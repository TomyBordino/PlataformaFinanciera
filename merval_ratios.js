// FINTERM — dataset curado de ratios fundamentales del Merval.
// NO hay API gratuita con CORS y sin login que provea ratios de empresas argentinas,
// así que estos valores son de REFERENCIA y deben actualizarse periódicamente
// (idealmente tras cada presentación de balances). Fuente sugerida para actualizar:
// estados contables en la CNV / Bolsar, o el sitio de relaciones con inversores de cada empresa.
//
// Campos por símbolo:
//   r: { pe, pb, evEbitda, roe, roa, nm, cur, quick, de, cov, rg, eg, dy, po }
//      pe/pb/evEbitda/cur/quick/de/cov = múltiplos (×) ; roe/roa/nm/rg/eg/dy/po = porcentajes
//   mcap: capitalización aproximada (texto)   revB: ingresos anuales aprox. (miles de millones ARS)
//   asof: período de referencia de los fundamentales
(function () {
  var ASOF = '2025 (referencia)';
  function row(r, mcap, revB) { return { r: r, mcap: mcap, revB: revB, asof: ASOF, curated: true }; }

  var M = {
    // ---- Bancos / Financieras ----
    GGAL: row({ pe: 8.5, pb: 1.6, evEbitda: null, roe: 21, roa: 2.4, nm: 28, cur: null, quick: null, de: 1.1, cov: null, rg: 35, eg: 28, dy: 1.5, po: 12 }, '5,8 B', 4200),
    BMA:  row({ pe: 7.8, pb: 1.4, evEbitda: null, roe: 23, roa: 3.2, nm: 30, cur: null, quick: null, de: 0.9, cov: null, rg: 40, eg: 33, dy: 2.5, po: 18 }, '4,6 B', 3500),
    BBAR: row({ pe: 7.2, pb: 1.3, evEbitda: null, roe: 22, roa: 2.8, nm: 27, cur: null, quick: null, de: 1.0, cov: null, rg: 38, eg: 30, dy: 1.8, po: 14 }, '3,2 B', 2600),
    SUPV: row({ pe: 6.5, pb: 1.0, evEbitda: null, roe: 17, roa: 2.1, nm: 22, cur: null, quick: null, de: 1.2, cov: null, rg: 30, eg: 20, dy: 1.0, po: 10 }, '1,4 B', 1300),
    VALO: row({ pe: 6.8, pb: 1.2, evEbitda: null, roe: 19, roa: 4.0, nm: 35, cur: null, quick: null, de: 0.7, cov: null, rg: 28, eg: 24, dy: 2.0, po: 15 }, '1,1 B', 600),
    BYMA: row({ pe: 12.0, pb: 3.2, evEbitda: 8.5, roe: 28, roa: 18, nm: 45, cur: 2.5, quick: 2.4, de: 0.2, cov: 30, rg: 25, eg: 22, dy: 3.0, po: 35 }, '2,3 B', 320),

    // ---- Energía / Petróleo / Gas ----
    YPFD: row({ pe: 9.2, pb: 1.1, evEbitda: 4.5, roe: 13, roa: 5, nm: 9, cur: 1.2, quick: 0.9, de: 1.0, cov: 6, rg: 22, eg: 15, dy: 0, po: 0 }, '7,1 B', 21000),
    PAMP: row({ pe: 7.0, pb: 1.3, evEbitda: 4.0, roe: 19, roa: 9, nm: 18, cur: 1.4, quick: 1.1, de: 0.7, cov: 8, rg: 18, eg: 20, dy: 1.0, po: 8 }, '3,9 B', 3800),
    CEPU: row({ pe: 6.2, pb: 1.0, evEbitda: 3.6, roe: 16, roa: 8, nm: 20, cur: 1.3, quick: 1.0, de: 0.6, cov: 9, rg: 15, eg: 12, dy: 1.5, po: 10 }, '2,8 B', 1400),
    TGSU2:row({ pe: 6.8, pb: 1.5, evEbitda: 3.8, roe: 24, roa: 12, nm: 28, cur: 1.6, quick: 1.4, de: 0.5, cov: 11, rg: 20, eg: 26, dy: 2.5, po: 20 }, '4,2 B', 2100),
    TGNO4:row({ pe: 7.5, pb: 1.2, evEbitda: 4.2, roe: 18, roa: 9, nm: 22, cur: 1.4, quick: 1.2, de: 0.6, cov: 8, rg: 17, eg: 14, dy: 1.0, po: 12 }, '1,3 B', 850),
    TRAN: row({ pe: 8.0, pb: 1.1, evEbitda: 4.6, roe: 15, roa: 7, nm: 19, cur: 1.2, quick: 1.0, de: 0.8, cov: 6, rg: 16, eg: 10, dy: 0.5, po: 8 }, '1,5 B', 900),
    EDN:  row({ pe: 7.2, pb: 1.0, evEbitda: 4.0, roe: 14, roa: 6, nm: 12, cur: 1.0, quick: 0.8, de: 0.9, cov: 5, rg: 18, eg: 9, dy: 0.5, po: 6 }, '1,2 B', 1800),
    CECO2:row({ pe: 9.0, pb: 0.9, evEbitda: 4.8, roe: 11, roa: 5, nm: 14, cur: 1.1, quick: 0.9, de: 0.8, cov: 5, rg: 12, eg: 8, dy: 0.8, po: 10 }, '0,5 B', 600),
    METR: row({ pe: 8.5, pb: 1.0, evEbitda: 4.4, roe: 13, roa: 6, nm: 11, cur: 1.1, quick: 0.9, de: 0.7, cov: 6, rg: 15, eg: 10, dy: 0.5, po: 8 }, '0,7 B', 950),
    CGPA2:row({ pe: 8.8, pb: 0.9, evEbitda: 4.5, roe: 12, roa: 6, nm: 10, cur: 1.1, quick: 0.9, de: 0.7, cov: 6, rg: 14, eg: 8, dy: 0.6, po: 8 }, '0,4 B', 700),
    DGCU2:row({ pe: 9.2, pb: 0.9, evEbitda: 4.7, roe: 11, roa: 5, nm: 9, cur: 1.0, quick: 0.8, de: 0.8, cov: 5, rg: 13, eg: 7, dy: 0.5, po: 7 }, '0,3 B', 550),
    GBAN: row({ pe: 8.6, pb: 1.0, evEbitda: 4.5, roe: 13, roa: 6, nm: 10, cur: 1.1, quick: 0.9, de: 0.7, cov: 6, rg: 14, eg: 9, dy: 0.6, po: 8 }, '0,4 B', 650),
    CAPX: row({ pe: 7.0, pb: 1.1, evEbitda: 3.9, roe: 17, roa: 8, nm: 21, cur: 1.3, quick: 1.0, de: 0.7, cov: 8, rg: 19, eg: 16, dy: 1.0, po: 10 }, '0,9 B', 480),

    // ---- Materiales / Industrial ----
    ALUA: row({ pe: 10, pb: 1.4, evEbitda: 6, roe: 14, roa: 8, nm: 12, cur: 1.6, quick: 1.0, de: 0.5, cov: 7, rg: 12, eg: -5, dy: 2.0, po: 30 }, '2,4 B', 1600),
    TXAR: row({ pe: 9.5, pb: 1.0, evEbitda: 5.2, roe: 11, roa: 7, nm: 10, cur: 1.8, quick: 1.1, de: 0.3, cov: 10, rg: 10, eg: -8, dy: 2.5, po: 35 }, '3,1 B', 2400),
    LOMA: row({ pe: 8.0, pb: 1.6, evEbitda: 4.8, roe: 22, roa: 12, nm: 16, cur: 1.5, quick: 1.0, de: 0.4, cov: 12, rg: 16, eg: 24, dy: 2.0, po: 25 }, '1,8 B', 900),
    HARG: row({ pe: 9.0, pb: 1.5, evEbitda: 5.0, roe: 19, roa: 11, nm: 15, cur: 1.4, quick: 0.9, de: 0.4, cov: 11, rg: 15, eg: 18, dy: 1.8, po: 22 }, '1,2 B', 700),
    CELU: row({ pe: 11, pb: 0.8, evEbitda: 6.5, roe: 8, roa: 4, nm: 7, cur: 1.2, quick: 0.7, de: 1.1, cov: 4, rg: 9, eg: -12, dy: 0.5, po: 12 }, '0,4 B', 550),
    FERR: row({ pe: 10, pb: 1.0, evEbitda: 5.5, roe: 12, roa: 7, nm: 9, cur: 1.5, quick: 1.0, de: 0.4, cov: 8, rg: 11, eg: 6, dy: 1.5, po: 20 }, '0,3 B', 280),
    RIGO: row({ pe: 9.5, pb: 1.1, evEbitda: 5.2, roe: 13, roa: 7, nm: 8, cur: 1.4, quick: 0.9, de: 0.5, cov: 7, rg: 12, eg: 8, dy: 1.0, po: 18 }, '0,3 B', 320),
    AGRO: row({ pe: 8.5, pb: 0.9, evEbitda: 4.8, roe: 11, roa: 6, nm: 7, cur: 1.6, quick: 0.8, de: 0.5, cov: 7, rg: 14, eg: 10, dy: 1.0, po: 15 }, '0,2 B', 240),
    AUSO: row({ pe: 7.5, pb: 1.2, evEbitda: 4.0, roe: 18, roa: 10, nm: 24, cur: 1.3, quick: 1.2, de: 0.6, cov: 9, rg: 16, eg: 14, dy: 2.0, po: 20 }, '0,6 B', 380),
    OEST: row({ pe: 7.8, pb: 1.1, evEbitda: 4.2, roe: 16, roa: 9, nm: 22, cur: 1.2, quick: 1.1, de: 0.6, cov: 8, rg: 15, eg: 12, dy: 1.5, po: 18 }, '0,4 B', 300),

    // ---- Consumo / Comunicaciones / Inmobiliario ----
    MIRG: row({ pe: 6.0, pb: 1.3, evEbitda: 3.5, roe: 24, roa: 12, nm: 8, cur: 1.7, quick: 1.0, de: 0.4, cov: 12, rg: 28, eg: 30, dy: 1.5, po: 12 }, '1,5 B', 2800),
    COME: row({ pe: 9.0, pb: 0.8, evEbitda: 5.0, roe: 9, roa: 5, nm: 11, cur: 1.5, quick: 1.0, de: 0.5, cov: 6, rg: 13, eg: 8, dy: 1.0, po: 15 }, '1,0 B', 850),
    CRES: row({ pe: 7.0, pb: 0.7, evEbitda: 6.0, roe: 10, roa: 4, nm: 14, cur: 1.2, quick: 0.8, de: 1.0, cov: 4, rg: 17, eg: 12, dy: 1.5, po: 18 }, '1,3 B', 1100),
    IRSA: row({ pe: 6.5, pb: 0.6, evEbitda: 7.5, roe: 11, roa: 4, nm: 22, cur: 1.1, quick: 0.9, de: 1.2, cov: 3, rg: 16, eg: 14, dy: 3.0, po: 30 }, '1,6 B', 700),
    CVH:  row({ pe: 8.0, pb: 1.0, evEbitda: 4.5, roe: 12, roa: 5, nm: 10, cur: 0.9, quick: 0.8, de: 1.3, cov: 4, rg: 14, eg: 9, dy: 1.0, po: 12 }, '1,1 B', 2200),
    TECO2:row({ pe: 9.5, pb: 1.2, evEbitda: 4.0, roe: 14, roa: 6, nm: 9, cur: 0.8, quick: 0.7, de: 1.4, cov: 4, rg: 12, eg: 10, dy: 2.0, po: 25 }, '3,4 B', 5200),
    GCLA: row({ pe: 8.8, pb: 1.1, evEbitda: 4.3, roe: 13, roa: 6, nm: 11, cur: 0.9, quick: 0.8, de: 1.2, cov: 4, rg: 13, eg: 9, dy: 1.5, po: 18 }, '0,8 B', 1400),

    // ---- Consumo básico / Otros ----
    LEDE: row({ pe: 9.0, pb: 1.0, evEbitda: 5.5, roe: 11, roa: 7, nm: 12, cur: 1.8, quick: 1.0, de: 0.4, cov: 8, rg: 14, eg: 10, dy: 1.5, po: 20 }, '0,7 B', 650),
    MOLI: row({ pe: 11, pb: 1.2, evEbitda: 6.5, roe: 11, roa: 5, nm: 6, cur: 1.3, quick: 0.7, de: 0.9, cov: 5, rg: 10, eg: 6, dy: 1.0, po: 22 }, '0,5 B', 1300),
    MOLA: row({ pe: 7.5, pb: 1.1, evEbitda: 4.5, roe: 15, roa: 8, nm: 5, cur: 1.6, quick: 0.9, de: 0.5, cov: 8, rg: 18, eg: 14, dy: 1.5, po: 18 }, '0,6 B', 2600),
    MORI: row({ pe: 10, pb: 1.0, evEbitda: 5.8, roe: 10, roa: 6, nm: 7, cur: 1.5, quick: 0.9, de: 0.4, cov: 7, rg: 12, eg: 8, dy: 1.0, po: 15 }, '0,2 B', 280),
    SAMI: row({ pe: 8.5, pb: 1.1, evEbitda: 5.0, roe: 13, roa: 7, nm: 10, cur: 1.7, quick: 1.0, de: 0.5, cov: 8, rg: 16, eg: 12, dy: 1.2, po: 18 }, '0,4 B', 420),
    RICH: row({ pe: 12, pb: 1.8, evEbitda: 7.0, roe: 16, roa: 9, nm: 14, cur: 1.9, quick: 1.2, de: 0.3, cov: 14, rg: 22, eg: 20, dy: 1.0, po: 15 }, '0,5 B', 380),
    BOLT: row({ pe: 9.0, pb: 0.9, evEbitda: 5.2, roe: 10, roa: 5, nm: 9, cur: 1.3, quick: 0.9, de: 0.6, cov: 6, rg: 11, eg: 7, dy: 1.0, po: 14 }, '0,2 B', 320),
    LONG: row({ pe: 10, pb: 1.0, evEbitda: 5.6, roe: 11, roa: 6, nm: 8, cur: 1.4, quick: 0.9, de: 0.5, cov: 7, rg: 12, eg: 8, dy: 1.0, po: 15 }, '0,15 B', 180),
    INVJ: row({ pe: 8.0, pb: 0.9, evEbitda: 5.0, roe: 12, roa: 7, nm: 13, cur: 1.6, quick: 1.0, de: 0.4, cov: 8, rg: 14, eg: 10, dy: 1.5, po: 18 }, '0,3 B', 350),
    PATA: row({ pe: 7.5, pb: 1.2, evEbitda: 4.5, roe: 17, roa: 9, nm: 7, cur: 1.5, quick: 0.9, de: 0.6, cov: 9, rg: 18, eg: 15, dy: 1.5, po: 16 }, '0,6 B', 1900)
  };

  window.FINTERM_MERVAL_RATIOS = M;
})();
