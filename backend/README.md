# Backend FINTERM

Ver el README de la raíz del repo para instrucciones completas.

```bash
cp .env.example .env   # completá tus keys
pip install -r requirements.txt
uvicorn main:app --reload
```

Swagger: http://localhost:8000/api/docs

> El `Dockerfile` de esta carpeta usa como contexto de build la **raíz del repo**
> (así lo arma `render.yaml`), por eso sus `COPY` apuntan a `backend/...`. Para
> buildearlo a mano hay que correr `docker build -f backend/Dockerfile .` parado
> en la raíz del repo, no dentro de `backend/`.

## Deploy en Render (plan free)

Este repo incluye `render.yaml` en la raíz (formato "Blueprint" de Render).

1. En [Render](https://dashboard.render.com) → **New** → **Blueprint** → conectá el repo `PlataformaFinanciera`.
2. Render detecta `render.yaml` y arma el servicio `finterm-backend` solo (usa `backend/Dockerfile`).
3. Completá las env vars que quedan en blanco: `FINNHUB_KEY`, `ALPHAVANTAGE_KEY` (gratuitas, se sacan en sus webs) y `ADMIN_EMAIL` (tu email, para asegurarte el rol admin).
4. Deploy. Una vez arriba, `https://<tu-servicio>.onrender.com/api/docs` tiene el Swagger para probar y para registrar el primer usuario (`POST /api/register`), que queda como admin.

> **Nota**: el plan free no tiene disco persistente, así que `finterm.db` (usuarios, caché, análisis) se reinicia en cada redeploy o cuando el servicio duerme por inactividad. Para persistencia real, pasar a un plan pago y agregar un disco montado en `DB_PATH`.

> Este backend queda **desconectado del sitio publicado en Netlify** a propósito: el frontend solo lo detecta si vive en el mismo dominio (`fetch('/api/openapi.json')` relativo). Conectarlos es un paso aparte y deliberado — no ocurre solo por desplegar esto.
