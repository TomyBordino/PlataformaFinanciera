# Repositorio del proyecto

repo: Tbordino/finterminal
branch: main

## Last sync

date: 2026-09-02T03:09:32Z

### Updated in this project

- La plataforma actual es una app HTML (`Plataforma.dc.html`) + backend FastAPI en `backend/`, y **reemplaza** la versión previa en Streamlit (`app.py`) que hoy está en el repo.
- Datos de mercado en vivo: S&P 500, Merval, Brasil, ETFs y commodities (data912, Finnhub, brapi, Twelve Data).
- Renta fija argentina: ONs curadas con cronograma de pagos verificado por prospecto, TIR/duration, curva por ley y calificaciones crediticias (`ons_cashflow.js`, `bond_math.js`).
- Análisis IA: veredicto, escenarios con probabilidad, precio objetivo por plazo, anclaje en estimaciones forward de analistas y múltiplo histórico propio, contexto macro (tasas, bonos, inflación, empleo) y track record de proyecciones.

## Screen map

| Sección | Archivos |
| --- | --- |
| App completa (todas las pantallas) | `Plataforma.dc.html` |
| Universo de instrumentos (paneles, ETFs, commodities) | `constituents.js`, `industries.js` |
| Ratios curados del Merval | `merval_ratios.js` |
| Renta fija (ONs: cashflow, ratings) | `ons_cashflow.js`, `bond_math.js` |
| Balances argentinos (enlaces oficiales) | `balances_ar.js` |
| Backend (auth, caché compartida, análisis) | `backend/` |
| Exploraciones de diseño | `Diseños.dc.html` |

## Notas de subida

El repo todavía contiene `app.py`, `requirements.txt` y `.streamlit/` de la versión anterior en
Streamlit. Al subir esta versión conviene borrarlos (o moverlos a una carpeta `legacy/`) para
que quede solo la plataforma actual.
