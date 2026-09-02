# FINTERM — backend (FastAPI + SQLite)
# Rol: proxy de APIs (keys ocultas), caché compartida con TTL, histórico diario,
# análisis IA compartidos y cuentas básicas con watchlist.
# El frontend (Plataforma.dc.html) también funciona sin este backend; cuando está
# desplegado, apuntá los fetch del frontend a /api/... de este servidor.

import hashlib, hmac, json, os, secrets, sqlite3, time
from contextlib import contextmanager

import httpx
from dotenv import load_dotenv
from fastapi import Depends, FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

load_dotenv()
FINNHUB = os.getenv("FINNHUB_KEY", "")
ALPHA = os.getenv("ALPHAVANTAGE_KEY", "")
SECRET = os.getenv("SECRET", "dev-secret")
DB_PATH = os.getenv("DB_PATH", "finterm.db")

app = FastAPI(title="FINTERM API", docs_url="/api/docs", openapi_url="/api/openapi.json")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

# ---------------------------- base de datos ----------------------------

SCHEMA = """
CREATE TABLE IF NOT EXISTS cache     (key TEXT PRIMARY KEY, value TEXT NOT NULL, expires REAL NOT NULL);
CREATE TABLE IF NOT EXISTS analyses  (market TEXT, ticker TEXT, body TEXT NOT NULL, created REAL NOT NULL,
                                      PRIMARY KEY (market, ticker));
CREATE TABLE IF NOT EXISTS history   (symbol TEXT, date TEXT, price REAL, pct REAL, pe REAL, roe REAL,
                                      extra TEXT, PRIMARY KEY (symbol, date));
CREATE TABLE IF NOT EXISTS users     (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT UNIQUE NOT NULL,
                                      pw_hash TEXT NOT NULL, salt TEXT NOT NULL, created REAL NOT NULL,
                                      role TEXT NOT NULL DEFAULT 'user');
CREATE TABLE IF NOT EXISTS requests  (id INTEGER PRIMARY KEY AUTOINCREMENT, market TEXT NOT NULL,
                                      ticker TEXT NOT NULL, horizon TEXT NOT NULL DEFAULT 'medio',
                                      user_id INTEGER NOT NULL, email TEXT, created REAL NOT NULL,
                                      status TEXT NOT NULL DEFAULT 'pendiente');
CREATE TABLE IF NOT EXISTS userdata  (user_id INTEGER PRIMARY KEY, body TEXT NOT NULL, updated REAL NOT NULL);
CREATE TABLE IF NOT EXISTS tokens    (token TEXT PRIMARY KEY, user_id INTEGER NOT NULL, created REAL NOT NULL);
CREATE TABLE IF NOT EXISTS watchlist (user_id INTEGER, symbol TEXT, market TEXT,
                                      PRIMARY KEY (user_id, symbol, market));
"""

@contextmanager
def db():
    con = sqlite3.connect(DB_PATH)
    con.row_factory = sqlite3.Row
    try:
        yield con
        con.commit()
    finally:
        con.close()

with db() as con:
    con.executescript(SCHEMA)
    try:
        con.execute("ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'user'")
    except sqlite3.OperationalError:
        pass  # la columna ya existe

ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "").lower().strip()

# ---------------------------- caché con TTL ----------------------------

def cache_get(key: str):
    with db() as con:
        row = con.execute("SELECT value, expires FROM cache WHERE key=?", (key,)).fetchone()
    if row and row["expires"] > time.time():
        return json.loads(row["value"])
    return None

def cache_put(key: str, value, ttl: int):
    with db() as con:
        con.execute("INSERT OR REPLACE INTO cache VALUES (?,?,?)",
                    (key, json.dumps(value), time.time() + ttl))

async def fetch_json(url: str):
    async with httpx.AsyncClient(timeout=20) as cli:
        r = await cli.get(url)
        r.raise_for_status()
        return r.json()

async def cached(key: str, url: str, ttl: int):
    hit = cache_get(key)
    if hit is not None:
        return hit
    data = await fetch_json(url)
    cache_put(key, data, ttl)
    return data

# ---------------------------- proxy de datos ----------------------------
# TTLs: precios 30 s (compartidos entre todos los usuarios), fundamentales 24 h,
# noticias 30 min, macro 24 h. Una sola llamada a la API externa por ventana.

D912 = "https://data912.com"
LIVE_FEEDS = {"spx": "usa_stocks", "merval": "arg_stocks", "cedears": "arg_cedears"}

@app.get("/api/live/{feed}")
async def live(feed: str):
    if feed not in LIVE_FEEDS:
        raise HTTPException(404, "feed desconocido")
    return await cached(f"live:{feed}", f"{D912}/live/{LIVE_FEEDS[feed]}", 30)

@app.get("/api/ccl")
async def ccl():
    return await cached("ccl", f"{D912}/live/ccl", 60)

@app.get("/api/historical/{symbol}")
async def historical(symbol: str):
    return await cached(f"hist:{symbol}", f"{D912}/historical/usa_stocks/{symbol}", 86400)

@app.get("/api/quote/{symbol}")
async def quote(symbol: str):
    data = await cached(f"quote:{symbol}",
                        f"https://finnhub.io/api/v1/quote?symbol={symbol}&token={FINNHUB}", 30)
    # histórico propio: guarda un snapshot de precio por símbolo y día
    if isinstance(data, dict) and data.get("c"):
        with db() as con:
            con.execute("""INSERT OR REPLACE INTO history (symbol, date, price, pct, pe, roe, extra)
                           VALUES (?, date('now'), ?, ?,
                                   (SELECT pe  FROM history WHERE symbol=? AND date=date('now')),
                                   (SELECT roe FROM history WHERE symbol=? AND date=date('now')), NULL)""",
                        (symbol, data["c"], data.get("dp"), symbol, symbol))
    return data

@app.get("/api/metrics/{symbol}")
async def metrics(symbol: str):
    key = f"metrics:{symbol}"
    hit = cache_get(key)
    if hit is not None:
        return hit
    m = await fetch_json(f"https://finnhub.io/api/v1/stock/metric?symbol={symbol}&metric=all&token={FINNHUB}")
    p = await fetch_json(f"https://finnhub.io/api/v1/stock/profile2?symbol={symbol}&token={FINNHUB}")
    data = {"metric": (m or {}).get("metric", {}), "industry": (p or {}).get("finnhubIndustry"),
            "finnhubIndustry": (p or {}).get("finnhubIndustry")}  # alias: el frontend lee esta clave
    cache_put(key, data, 86400)
    met = data["metric"]
    with db() as con:  # snapshot diario de ratios → base para backtesting
        con.execute("""INSERT INTO history (symbol, date, price, pct, pe, roe, extra)
                       VALUES (?, date('now'), NULL, NULL, ?, ?, ?)
                       ON CONFLICT(symbol, date) DO UPDATE SET pe=excluded.pe, roe=excluded.roe, extra=excluded.extra""",
                    (symbol, met.get("peTTM"), met.get("roeTTM"),
                     json.dumps({k: met.get(k) for k in ("pbQuarterly", "evEbitdaTTM", "netProfitMarginTTM",
                                                          "totalDebt/totalEquityQuarterly", "revenueGrowthTTMYoy")})))
    return data

@app.get("/api/history/{symbol}")
def own_history(symbol: str):
    """Serie acumulada por este servidor (un punto por día desde que está en línea)."""
    with db() as con:
        rows = con.execute("SELECT * FROM history WHERE symbol=? ORDER BY date", (symbol,)).fetchall()
    return [dict(r) for r in rows]

@app.get("/api/news/{symbol}")
async def news(symbol: str):
    frm = time.strftime("%Y-%m-%d", time.gmtime(time.time() - 14 * 86400))
    to = time.strftime("%Y-%m-%d")
    return await cached(f"news:{symbol}",
                        f"https://finnhub.io/api/v1/company-news?symbol={symbol}&from={frm}&to={to}&token={FINNHUB}", 1800)

@app.get("/api/news")
async def market_news():
    return await cached("news:market", f"https://finnhub.io/api/v1/news?category=general&token={FINNHUB}", 1800)

@app.get("/api/macro/{fn}")
async def macro(fn: str):
    allowed = {"FEDERAL_FUNDS_RATE", "CPI", "TREASURY_YIELD", "UNEMPLOYMENT"}
    if fn not in allowed:
        raise HTTPException(404, "indicador desconocido")
    extra = "&interval=daily&maturity=10year" if fn == "TREASURY_YIELD" else ""
    return await cached(f"macro:{fn}",
                        f"https://www.alphavantage.co/query?function={fn}{extra}&apikey={ALPHA}", 86400)

# ---------------------------- análisis IA compartidos ----------------------------
# El frontend genera el análisis (modelo de IA) y lo publica acá: queda disponible
# para TODOS los usuarios hasta que alguien lo regenere.

class Analysis(BaseModel):
    market: str
    ticker: str
    body: dict

@app.get("/api/analysis/{market}/{ticker}")
def get_analysis(market: str, ticker: str):
    with db() as con:
        row = con.execute("SELECT body, created FROM analyses WHERE market=? AND ticker=?",
                          (market, ticker)).fetchone()
    if not row:
        raise HTTPException(404, "sin análisis guardado")
    return {"body": json.loads(row["body"]), "created": row["created"]}

@app.post("/api/analysis")
def put_analysis(a: Analysis, user_id: int = Depends(admin_only)):
    with db() as con:
        con.execute("INSERT OR REPLACE INTO analyses VALUES (?,?,?,?)",
                    (a.market, a.ticker.upper(), json.dumps(a.body), time.time()))
    return {"ok": True}

# ---------------------------- cuentas y watchlist ----------------------------

def hash_pw(pw: str, salt: str) -> str:
    return hashlib.pbkdf2_hmac("sha256", pw.encode(), (salt + SECRET).encode(), 200_000).hex()

class Credentials(BaseModel):
    email: str
    password: str

def auth(authorization: str = Header(None)) -> int:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(401, "falta el token")
    with db() as con:
        row = con.execute("SELECT user_id FROM tokens WHERE token=?", (authorization[7:],)).fetchone()
    if not row:
        raise HTTPException(401, "token inválido")
    return row["user_id"]

def user_role(user_id: int) -> str:
    with db() as con:
        row = con.execute("SELECT role FROM users WHERE id=?", (user_id,)).fetchone()
    return row["role"] if row else "user"

def admin_only(user_id: int = Depends(auth)) -> int:
    if user_role(user_id) != "admin":
        raise HTTPException(403, "solo el administrador puede hacer esto")
    return user_id

@app.post("/api/register")
def register(c: Credentials):
    if len(c.password) < 8:
        raise HTTPException(400, "la contraseña debe tener al menos 8 caracteres")
    salt = secrets.token_hex(16)
    email = c.email.lower().strip()
    with db() as con:
        n_users = con.execute("SELECT COUNT(*) AS n FROM users").fetchone()["n"]
    # el PRIMER usuario registrado (o el que coincida con ADMIN_EMAIL) es el administrador
    role = "admin" if (n_users == 0 or (ADMIN_EMAIL and email == ADMIN_EMAIL)) else "user"
    try:
        with db() as con:
            con.execute("INSERT INTO users (email, pw_hash, salt, created, role) VALUES (?,?,?,?,?)",
                        (email, hash_pw(c.password, salt), salt, time.time(), role))
    except sqlite3.IntegrityError:
        raise HTTPException(409, "ese email ya está registrado")
    return login(c)

@app.post("/api/login")
def login(c: Credentials):
    with db() as con:
        u = con.execute("SELECT * FROM users WHERE email=?", (c.email.lower().strip(),)).fetchone()
    if not u or not hmac.compare_digest(u["pw_hash"], hash_pw(c.password, u["salt"])):
        raise HTTPException(401, "email o contraseña incorrectos")
    token = secrets.token_urlsafe(32)
    with db() as con:
        con.execute("INSERT INTO tokens VALUES (?,?,?)", (token, u["id"], time.time()))
    return {"token": token, "role": u["role"], "email": u["email"]}

@app.get("/api/me")
def me(user_id: int = Depends(auth)):
    with db() as con:
        u = con.execute("SELECT email, role FROM users WHERE id=?", (user_id,)).fetchone()
    return {"email": u["email"], "role": u["role"]}

# --------- solicitudes de análisis (usuarios piden, el admin genera) ---------

class AnalysisRequest(BaseModel):
    market: str
    ticker: str
    horizon: str = "medio"

@app.post("/api/request")
def create_request(r: AnalysisRequest, user_id: int = Depends(auth)):
    with db() as con:
        u = con.execute("SELECT email FROM users WHERE id=?", (user_id,)).fetchone()
        dup = con.execute("""SELECT id FROM requests WHERE market=? AND ticker=? AND horizon=?
                             AND status='pendiente'""", (r.market, r.ticker.upper(), r.horizon)).fetchone()
        if dup:
            return {"ok": True, "nota": "ya estaba solicitado"}
        con.execute("INSERT INTO requests (market, ticker, horizon, user_id, email, created) VALUES (?,?,?,?,?,?)",
                    (r.market, r.ticker.upper(), r.horizon, user_id, u["email"], time.time()))
    return {"ok": True}

@app.get("/api/requests")
def list_requests(user_id: int = Depends(admin_only)):
    with db() as con:
        rows = con.execute("SELECT * FROM requests WHERE status='pendiente' ORDER BY created").fetchall()
    return [dict(r) for r in rows]

@app.post("/api/requests/{req_id}/done")
def resolve_request(req_id: int, user_id: int = Depends(admin_only)):
    with db() as con:
        con.execute("UPDATE requests SET status='resuelto' WHERE id=?", (req_id,))
    return {"ok": True}

# --------- datos por usuario: cartera, watchlist, ajustes (blob JSON) ---------

class UserData(BaseModel):
    body: dict

@app.get("/api/userdata")
def get_userdata(user_id: int = Depends(auth)):
    with db() as con:
        row = con.execute("SELECT body, updated FROM userdata WHERE user_id=?", (user_id,)).fetchone()
    if not row:
        return {"body": {}, "updated": None}
    return {"body": json.loads(row["body"]), "updated": row["updated"]}

@app.put("/api/userdata")
def put_userdata(d: UserData, user_id: int = Depends(auth)):
    with db() as con:
        con.execute("INSERT OR REPLACE INTO userdata VALUES (?,?,?)",
                    (user_id, json.dumps(d.body), time.time()))
    return {"ok": True}

class WatchItem(BaseModel):
    symbol: str
    market: str

@app.get("/api/watchlist")
def get_watchlist(user_id: int = Depends(auth)):
    with db() as con:
        rows = con.execute("SELECT symbol, market FROM watchlist WHERE user_id=?", (user_id,)).fetchall()
    return [dict(r) for r in rows]

@app.post("/api/watchlist")
def add_watch(item: WatchItem, user_id: int = Depends(auth)):
    with db() as con:
        con.execute("INSERT OR IGNORE INTO watchlist VALUES (?,?,?)",
                    (user_id, item.symbol.upper(), item.market))
    return {"ok": True}

@app.delete("/api/watchlist/{market}/{symbol}")
def del_watch(market: str, symbol: str, user_id: int = Depends(auth)):
    with db() as con:
        con.execute("DELETE FROM watchlist WHERE user_id=? AND symbol=? AND market=?",
                    (user_id, symbol.upper(), market))
    return {"ok": True}

# ---------------------------- frontend estático ----------------------------
# Sirve la plataforma desde la carpeta raíz del repo (Plataforma.dc.html, support.js, etc.)

if os.path.isdir(os.path.join(os.path.dirname(__file__), "..", "frontend")):
    app.mount("/", StaticFiles(directory=os.path.join(os.path.dirname(__file__), "..", "frontend"),
                               html=True), name="frontend")
