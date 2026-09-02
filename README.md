# FINTERM — Plataforma financiera con IA

Plataforma para interpretar coeficientes, ratios e informes financieros del
**S&P 500**, el **Merval** y **Brasil (ADRs)**, con análisis asistido por IA.

## Estructura del repo

```
frontend/          # La plataforma (HTML). Funciona sola, sin backend.
backend/           # API FastAPI + SQLite: proxy de datos, caché compartida,
                   # histórico diario, análisis IA compartidos y cuentas.
```

## Frontend solo (modo actual)

Abrí `frontend/Plataforma.dc.html` en un navegador o servilo estático
(GitHub Pages, Netlify, etc.). Los datos se piden directo a las APIs públicas
y todo se guarda en el navegador de cada usuario (localStorage).

> Limitación: las API keys quedan visibles en el cliente y cada usuario
> consume su propio cupo. Para compartir la plataforma con más usuarios, usá el backend.

## Backend (recomendado para multi-usuario)

### Qué aporta
- **Keys ocultas**: Finnhub y Alpha Vantage viven en el servidor (`.env`).
- **Caché compartida con TTL** (SQLite): precios 30 s, fundamentales 24 h,
  noticias 30 min, macro 24 h → una sola llamada externa por ventana,
  sin importar cuántos usuarios haya.
- **Histórico propio**: snapshot diario de precio/P.E/ROE por símbolo
  (tabla `history`) — base para backtesting futuro.
- **Análisis IA compartidos**: un análisis generado queda disponible para todos
  hasta que alguien lo regenera (`GET/POST /api/analysis`).
- **Cuentas básicas**: registro/login con token + watchlist por usuario.

### Correr local

```bash
cd backend
cp .env.example .env        # completá tus keys
pip install -r requirements.txt
uvicorn main:app --reload
```

- API: `http://localhost:8000/api/docs` (Swagger)
- Frontend servido en `http://localhost:8000/` (si existe la carpeta `frontend/`)

### Deploy gratis

**Render**: New → Web Service → conectar el repo → Root Directory `backend`,
runtime Docker. Agregá las variables de entorno del `.env.example` y un
**Persistent Disk** montado donde apunte `DB_PATH` (ej. `/data/finterm.db`).

**Railway**: New Project → Deploy from GitHub → detecta el Dockerfile.
Variables en Settings → Variables; agregá un Volume para la base.

**Fly.io**: `fly launch` dentro de `backend/`, `fly secrets set FINNHUB_KEY=...`,
`fly volumes create data` y montálo en `fly.toml`; `DB_PATH=/data/finterm.db`.

### Conectar el frontend al backend

**Es automático.** Al cargar, el frontend detecta si hay backend en el mismo
dominio (`GET /api/openapi.json`); si responde, enruta todas las llamadas por
`/api/...` (keys ocultas + caché compartida) y comparte los análisis IA entre
usuarios. Si no hay backend (GitHub Pages, archivo local), usa las APIs
públicas directo, como siempre. Mapa de rutas (referencia):

| Directo (hoy)                                   | Vía backend            |
|-------------------------------------------------|------------------------|
| `data912.com/live/usa_stocks`                   | `/api/live/spx`        |
| `data912.com/live/arg_stocks`                   | `/api/live/merval`     |
| `data912.com/live/arg_cedears`                  | `/api/live/cedears`    |
| `data912.com/live/ccl`                          | `/api/ccl`             |
| `data912.com/historical/usa_stocks/{sym}`       | `/api/historical/{sym}`|
| `finnhub.io/api/v1/quote?symbol={sym}&token=…`  | `/api/quote/{sym}`     |
| `finnhub.io/api/v1/stock/metric…` + `profile2…` | `/api/metrics/{sym}`   |
| `finnhub.io/api/v1/company-news…`               | `/api/news/{sym}`      |
| `finnhub.io/api/v1/news…`                       | `/api/news`            |
| `alphavantage.co/query?function={fn}…`          | `/api/macro/{fn}`      |

Para los análisis IA compartidos (también automático con backend): al generar,
el frontend hace `POST /api/analysis`; al entrar a una empresa sin análisis local,
consulta `GET /api/analysis/{market}/{ticker}`.

## Fuentes de datos

- **data912** — precios en vivo BYMA/EE.UU. e histórico de cierres (sin key).
- **Finnhub** — cotizaciones, fundamentales, industria y noticias (key gratuita).
- **Alpha Vantage** — indicadores macro de EE.UU. (key gratuita, 25 req/día).
- **IA** — el análisis se genera con un modelo de lenguaje desde el frontend.

> ⚠ Uso educativo. Nada de esto constituye una recomendación de inversión.
