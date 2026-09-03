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

## Análisis IA (`/api/ai/complete`) y control de gasto

Este endpoint llama a la API de Claude (Anthropic) con la key del servidor. Como
la plataforma no tiene login, el acceso está protegido por `AI_ACCESS_CODE`
(un código que solo conocés vos, ver `.env.example`) y un rate-limit por IP
(`AI_RATE_LIMIT_PER_HOUR`) — pero igual **es uso pago, no gratuito**.

Para que nunca te sorprenda un gasto:

1. Por default usa `claude-haiku-4-5`, el modelo más barato de Claude
   ($1 / $5 por millón de tokens de entrada/salida) — alcanza bien para este
   tipo de resumen. Se puede cambiar con la env var `ANTHROPIC_MODEL`.
2. Poné un **tope de gasto duro** en la cuenta de Anthropic:
   [console.anthropic.com](https://console.anthropic.com) → **Settings → Billing → Usage limits**
   → configurá un límite mensual (ej. u$s 2-5). Una vez alcanzado, la API
   deja de responder (nuevos pedidos fallan) hasta el mes siguiente o hasta
   que subas el límite a mano — nunca te cobra de más.
3. `AI_ACCESS_CODE` + `AI_RATE_LIMIT_PER_HOUR` acotan cuánta gente puede
   gastar de ese presupuesto sin que lo sepas.
