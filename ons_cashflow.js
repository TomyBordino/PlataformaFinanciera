// FINTERM — Cronograma de pagos curado de ONs argentinas (validado contra prospecto/aviso de resultados).
// Clave = ticker base de data912 (sin sufijo O/D/C). Formato:
//   { emisor, ley, cupon:<%anual>, freq:<meses entre cupones>, pagos:[{f:'YYYY-MM-DD', amort:<%VN>}], venc:'YYYY-MM-DD' }
// El interés de cada fecha = capital_residual * (cupon/100) * freq/12. Amort = % del VN original.
// ⚠ Solo especies con prospecto verificado. Se amplía a medida que se cura cada ON.
var ONS_CF = {
  // YPF Clase XXXIV — ley NY, US$, 8,25% anual semestral (17-ene/17-jul), amort 30/30/40. (verif. aviso de resultados + reapertura 2026)
  YM34: { emisor:'YPF', ley:'NY', cupon:8.25, freq:6, venc:'2034-01-17',
    pagos:[ {f:'2032-01-17',amort:30}, {f:'2033-01-17',amort:30}, {f:'2034-01-17',amort:40} ] },
  // YPF Clase 53 (REGS) — 6,95% anual, venc 21/07/2027. Amortización bullet (asumida; confirmar prospecto).
  YCAM: { emisor:'YPF', ley:'NY', cupon:6.95, freq:6, venc:'2027-07-21', pagos:[ {f:'2027-07-21',amort:100} ] },
  // YPF 10% — venc 02/11/2028. Bullet (asumido).
  YPC4: { emisor:'YPF', ley:'local', cupon:10, freq:6, venc:'2028-11-02', pagos:[ {f:'2028-11-02',amort:100} ] },
  // YPF Clase XLI — 6,00% anual, cupón trimestral, venc 08/01/2027, bullet. (verif. aviso de resultados)
  YM41: { emisor:'YPF', ley:'local', cupon:6.00, freq:3, venc:'2027-01-08', pagos:[ {f:'2027-01-08',amort:100} ] },
  // YPF Clase XLII — 7,00% anual, semestral, venc 02/03/2029, bullet. (verif. aviso de resultados)
  YM42: { emisor:'YPF', ley:'local', cupon:7.00, freq:6, venc:'2029-03-02', pagos:[ {f:'2029-03-02',amort:100} ] },
  // YPF Clase XXXIX — 8,75% anual, semestral, venc 22/07/2030, bullet. (verif. aviso de resultados)
  YM39: { emisor:'YPF', ley:'NY', cupon:8.75, freq:6, venc:'2030-07-22', pagos:[ {f:'2030-07-22',amort:100} ] },
  // Pampa Energía Clase 27 — ley ARG, US$, 5,49% semestral, venc 01/04/2029, bullet.
  MGCT: { emisor:'Pampa Energía', ley:'local', cupon:5.49, freq:6, venc:'2029-04-01', pagos:[ {f:'2029-04-01',amort:100} ] },
  // Pampa Energía Clase 26 — ley NY, US$, 7,75% semestral, venc 14/11/2037, bullet.
  MGCR: { emisor:'Pampa Energía', ley:'NY', cupon:7.75, freq:6, venc:'2037-11-14', pagos:[ {f:'2037-11-14',amort:100} ] },
  // Pampa Energía Clase 25 — ley ARG, US$, 7,25% semestral, venc 06/08/2028, bullet.
  MGCQ: { emisor:'Pampa Energía', ley:'local', cupon:7.25, freq:6, venc:'2028-08-06', pagos:[ {f:'2028-08-06',amort:100} ] },
  // Pampa Energía Clase 23 — ley NY, US$, 7,875% semestral, venc 16/12/2034, bullet.
  MGCO: { emisor:'Pampa Energía', ley:'NY', cupon:7.875, freq:6, venc:'2034-12-16', pagos:[ {f:'2034-12-16',amort:100} ] },
  // Pampa Energía Clase 22 — ley ARG, US$, 5,75% semestral, venc 04/10/2028, bullet.
  MGCN: { emisor:'Pampa Energía', ley:'local', cupon:5.75, freq:6, venc:'2028-10-04', pagos:[ {f:'2028-10-04',amort:100} ] },
  // Pampa Energía Clase 21 (REGS) — ley NY, US$, 7,95% semestral, venc 10/09/2031, bullet.
  MGCM: { emisor:'Pampa Energía', ley:'NY', cupon:7.95, freq:6, venc:'2031-09-10', pagos:[ {f:'2031-09-10',amort:100} ] },
  // Pampa Energía Clase 13 — ley ARG, dollar-linked, cupón 0%, venc 19/12/2027, bullet.
  MGCE: { emisor:'Pampa Energía', ley:'local', dl:true, cupon:0, freq:12, venc:'2027-12-19', pagos:[ {f:'2027-12-19',amort:100} ] },
  // Telecom Argentina Clase 30 — ley ARG, US$, 6,25% semestral, venc 29/05/2030, bullet.
  TLCW: { emisor:'Telecom Argentina', ley:'local', cupon:6.25, freq:6, venc:'2030-05-29', pagos:[ {f:'2030-05-29',amort:100} ] },
  // Telecom Argentina Clase 29 — ley ARG, US$, 3,5% trimestral, venc 29/05/2027, bullet.
  TLCV: { emisor:'Telecom Argentina', ley:'local', cupon:3.5, freq:3, venc:'2027-05-29', pagos:[ {f:'2027-05-29',amort:100} ] },
  // Telecom Argentina Clase 28 — ley ARG, US$, 6,5% semestral, venc 05/03/2029, bullet.
  TLCU: { emisor:'Telecom Argentina', ley:'local', cupon:6.5, freq:6, venc:'2029-03-05', pagos:[ {f:'2029-03-05',amort:100} ] },
  // Telecom Argentina Clase 27 — ley NY, US$, 8,5% semestral, venc 20/01/2036, amort 2 cuotas 50% (ene-2035 y venc). Verif. prospecto.
  TLCT: { emisor:'Telecom Argentina', ley:'NY', cupon:8.5, freq:6, venc:'2036-01-20',
    pagos:[ {f:'2035-01-20',amort:50}, {f:'2036-01-20',amort:50} ] },
  // Telecom Argentina Clase 25 — ley ARG, US$, 7,5% trimestral, venc 02/07/2027, bullet.
  TLCQ: { emisor:'Telecom Argentina', ley:'local', cupon:7.5, freq:3, venc:'2027-07-02', pagos:[ {f:'2027-07-02',amort:100} ] },
  // Telecom Argentina Clase 24 (REGS) — ley NY, US$, 9,25% semestral, venc 28/05/2033, amort 2 cuotas 50% (7 y 8 años). Verif. prospecto.
  TLCP: { emisor:'Telecom Argentina', ley:'NY', cupon:9.25, freq:6, venc:'2033-05-28',
    pagos:[ {f:'2032-05-28',amort:50}, {f:'2033-05-28',amort:50} ] },
  // Telecom Argentina Clase 23 — ley ARG, US$, 7% semestral, venc 28/11/2028, bullet.
  TLCO: { emisor:'Telecom Argentina', ley:'local', cupon:7, freq:6, venc:'2028-11-28', pagos:[ {f:'2028-11-28',amort:100} ] },
  // Telecom Argentina Clase 21 — ley NY, US$, 9,5% semestral, venc 18/07/2031, amort en 3 cuotas (sinkable jul-2029/2030/2031).
  TLCM: { emisor:'Telecom Argentina', ley:'NY', cupon:9.5, freq:6, venc:'2031-07-18',
    pagos:[ {f:'2029-07-18',amort:33.34}, {f:'2030-07-18',amort:33.33}, {f:'2031-07-18',amort:33.33} ] },
  // Telecom Argentina Clase 14 — ley ARG, dollar-linked, cupón 0%, venc 10/02/2028, bullet.
  TLCF: { emisor:'Telecom Argentina', ley:'local', dl:true, cupon:0, freq:3, venc:'2028-02-10', pagos:[ {f:'2028-02-10',amort:100} ] },
  // Telecom Argentina Clase 12 — ley ARG, dollar-linked, 1% trimestral, venc 09/03/2027, bullet.
  TLCD: { emisor:'Telecom Argentina', ley:'local', dl:true, cupon:1, freq:3, venc:'2027-03-09', pagos:[ {f:'2027-03-09',amort:100} ] },
  // Vista Energy Clase XXXIII — ley ARG, US$, 5% semestral, venc 16/07/2029, bullet.
  VSCZ: { emisor:'Vista Energy', ley:'local', cupon:5, freq:6, venc:'2029-07-16', pagos:[ {f:'2029-07-16',amort:100} ] },
  // Vista Energy Clase XXXII — ley ARG, US$, 3,75% semestral, venc 16/01/2028, bullet.
  VSCY: { emisor:'Vista Energy', ley:'local', cupon:3.75, freq:6, venc:'2028-01-16', pagos:[ {f:'2028-01-16',amort:100} ] },
  // Vista Energy Clase XXXI — ley NY, US$, 7,875% semestral, venc 08/04/2038, amort 3 cuotas anuales 33/33/34. Verif. prospecto.
  VSCX: { emisor:'Vista Energy', ley:'NY', cupon:7.875, freq:6, venc:'2038-04-08',
    pagos:[ {f:'2036-04-08',amort:33}, {f:'2037-04-08',amort:33}, {f:'2038-04-08',amort:34} ] },
  // Vista Energy Clase XXIX — ley NY, US$, 8,5% semestral, venc 10/06/2033, amort 3 cuotas anuales (6 años gracia). Verif. prospecto.
  VSCV: { emisor:'Vista Energy', ley:'NY', cupon:8.5, freq:6, venc:'2033-06-10',
    pagos:[ {f:'2031-06-10',amort:33.34}, {f:'2032-06-10',amort:33.33}, {f:'2033-06-10',amort:33.33} ] },
  // Vista Energy Clase XXVIII — ley ARG, US$, 7,5% semestral, venc 07/03/2030, bullet.
  VSCU: { emisor:'Vista Energy', ley:'local', cupon:7.5, freq:6, venc:'2030-03-07', pagos:[ {f:'2030-03-07',amort:100} ] },
  // Vista Energy Clase XXVII — ley NY, US$, 7,625% semestral, venc 10/12/2035, amort 3 cuotas anuales (9 años gracia). Verif. prospecto.
  VSCT: { emisor:'Vista Energy', ley:'NY', cupon:7.625, freq:6, venc:'2035-12-10',
    pagos:[ {f:'2033-12-10',amort:33.34}, {f:'2034-12-10',amort:33.33}, {f:'2035-12-10',amort:33.33} ] },
  // Vista Energy Clase XXVI — ley ARG, US$, 7,65% semestral, venc 10/10/2031, amort 3 cuotas anuales (5 años gracia). Verif. prospecto.
  VSCR: { emisor:'Vista Energy', ley:'local', cupon:7.65, freq:6, venc:'2031-10-10',
    pagos:[ {f:'2029-10-10',amort:33.34}, {f:'2030-10-10',amort:33.33}, {f:'2031-10-10',amort:33.33} ] },
  // Vista Energy Clase XXV — ley ARG, dollar-linked, 3% trimestral, venc 08/07/2028, bullet.
  VSCQ: { emisor:'Vista Energy', ley:'local', dl:true, cupon:3, freq:3, venc:'2028-07-08', pagos:[ {f:'2028-07-08',amort:100} ] },
  // Vista Energy Clase XXIV — ley ARG, US$, 8% semestral, venc 03/05/2029, amort 4 cuotas semestrales 25% (3,5 años gracia). Verif. prospecto.
  VSCP: { emisor:'Vista Energy', ley:'local', cupon:8, freq:6, venc:'2029-05-03',
    pagos:[ {f:'2027-11-03',amort:25}, {f:'2028-05-03',amort:25}, {f:'2028-11-03',amort:25}, {f:'2029-05-03',amort:25} ] },
  // Vista Energy Clase XIX — ley ARG, dollar-linked, 1% trimestral, venc 03/03/2028, bullet.
  VSCK: { emisor:'Vista Energy', ley:'local', dl:true, cupon:1, freq:3, venc:'2028-03-03', pagos:[ {f:'2028-03-03',amort:100} ] },
  // Pluspetrol Clase 7 — ley NY, US$, 7,55% semestral, venc 30/09/2037, sinkable (amort 3 cuotas finales, estimada).
  PLC7: { emisor:'Pluspetrol', ley:'NY', cupon:7.55, freq:6, venc:'2037-09-30',
    pagos:[ {f:'2035-09-30',amort:33.34}, {f:'2036-09-30',amort:33.33}, {f:'2037-09-30',amort:33.33} ] },
  // Pluspetrol Clase 6 — ley ARG, US$, 6,5% semestral, venc 27/02/2029, bullet.
  PLC6: { emisor:'Pluspetrol', ley:'local', cupon:6.5, freq:6, venc:'2029-02-27', pagos:[ {f:'2029-02-27',amort:100} ] },
  // Pluspetrol Clase 5 — ley NY, US$, 8,125% semestral, venc 18/05/2031, bullet.
  PLC5: { emisor:'Pluspetrol', ley:'NY', cupon:8.125, freq:6, venc:'2031-05-18', pagos:[ {f:'2031-05-18',amort:100} ] },
  // Pluspetrol Clase 4 (REGS Adic.) — ley NY, US$, 8,5% semestral, venc 30/05/2032, bullet.
  PLC4: { emisor:'Pluspetrol', ley:'NY', cupon:8.5, freq:6, venc:'2032-05-30', pagos:[ {f:'2032-05-30',amort:100} ] },
  // Pluspetrol Clase 3 — ley ARG, US$, 7,25% semestral, venc 30/04/2028, bullet.
  PLC3: { emisor:'Pluspetrol', ley:'local', cupon:7.25, freq:6, venc:'2028-04-30', pagos:[ {f:'2028-04-30',amort:100} ] },
  // Pluspetrol Clase 2 — ley ARG, US$, 7,5% semestral, venc 27/01/2030, bullet.
  PLC2: { emisor:'Pluspetrol', ley:'local', cupon:7.5, freq:6, venc:'2030-01-27', pagos:[ {f:'2030-01-27',amort:100} ] },
  // Pluspetrol Clase 1 — ley ARG, US$, 6% semestral, venc 27/01/2028, bullet.
  PLC1: { emisor:'Pluspetrol', ley:'local', cupon:6, freq:6, venc:'2028-01-27', pagos:[ {f:'2028-01-27',amort:100} ] },
  // ── Pan American Energy (PN*) — bullets salvo indicación, verif. datos técnicos ──
  PN34: { emisor:'Pan American Energy', ley:'local', cupon:4.97, freq:6, venc:'2027-09-27', pagos:[ {f:'2027-09-27',amort:100} ] },
  PN35: { emisor:'Pan American Energy', ley:'local', cupon:7, freq:6, venc:'2029-09-27', pagos:[ {f:'2029-09-27',amort:100} ] },
  PN36: { emisor:'Pan American Energy', ley:'local', cupon:7.25, freq:6, venc:'2031-11-13', pagos:[ {f:'2031-11-13',amort:100} ] },
  PN37: { emisor:'Pan American Energy', ley:'local', cupon:6.25, freq:6, venc:'2028-11-13', pagos:[ {f:'2028-11-13',amort:100} ] },
  PN38: { emisor:'Pan American Energy', ley:'local', cupon:6.5, freq:6, venc:'2027-08-11', pagos:[ {f:'2027-08-11',amort:100} ] },
  PN41: { emisor:'Pan American Energy', ley:'local', cupon:7.5, freq:6, venc:'2029-08-27', pagos:[ {f:'2029-08-27',amort:100} ] },
  PN42: { emisor:'Pan American Energy', ley:'local', cupon:6, freq:6, venc:'2027-04-17', pagos:[ {f:'2027-04-17',amort:100} ] },
  // PNXC Clase 31 — ley NY, 8,5%, venc 2032-04-30, sinkable: 33,33% en abr-2030/2031/2032 (verif. cashflow).
  PNXC: { emisor:'Pan American Energy', ley:'NY', cupon:8.5, freq:6, venc:'2032-04-30',
    pagos:[ {f:'2030-04-30',amort:33.33}, {f:'2031-04-30',amort:33.33}, {f:'2032-04-30',amort:33.34} ] },
  // PN43 Clase 43 — ley NY, 7,75%, venc 2037-01-15, sinkable: 33/33/34% en 2035-2037 (verif. cashflow).
  PN43: { emisor:'Pan American Energy', ley:'NY', cupon:7.75, freq:6, venc:'2037-01-15',
    pagos:[ {f:'2035-01-15',amort:33}, {f:'2036-01-15',amort:33}, {f:'2037-01-15',amort:34} ] },
  // PNDC Clase 12 REGS — ley NY, 9,125%, venc 2027-04-30, sinkable, residual 40: 20%+20% (verif. cashflow).
  PNDC: { emisor:'Pan American Energy', ley:'NY', cupon:9.125, freq:6, venc:'2027-04-30', residual0:40,
    pagos:[ {f:'2026-10-30',amort:20}, {f:'2027-04-30',amort:20} ] },
  // Genneia Clase XLIX — ley NY, US$, 7,75% semestral, venc 02/12/2033, sinkable: 33/33/34% (verif. cashflow).
  GN49: { emisor:'Genneia', ley:'NY', cupon:7.75, freq:6, venc:'2033-12-02',
    pagos:[ {f:'2031-12-02',amort:33}, {f:'2032-12-02',amort:33}, {f:'2033-12-02',amort:34} ] },
  // Genneia Clase XLVIII — ley ARG, US$, 6,5% semestral, venc 05/03/2028, bullet.
  GN48: { emisor:'Genneia', ley:'local', cupon:6.5, freq:6, venc:'2028-03-05', pagos:[ {f:'2028-03-05',amort:100} ] },
  // Genneia Clase XLVII — ley ARG, US$, 6% semestral, venc 17/10/2028, bullet.
  GN47: { emisor:'Genneia', ley:'local', cupon:6, freq:6, venc:'2028-10-17', pagos:[ {f:'2028-10-17',amort:100} ] },
  // Genneia Clase XLIII — ley ARG, US$, 6,25% trimestral, venc 08/03/2027, bullet.
  GN43: { emisor:'Genneia', ley:'local', cupon:6.25, freq:3, venc:'2027-03-08', pagos:[ {f:'2027-03-08',amort:100} ] },
  // YPF Clase XXXIII — ley ARG, US$, 7% semestral, venc 10/10/2028, bullet.
  YMCZ: { emisor:'YPF', ley:'local', cupon:7, freq:6, venc:'2028-10-10', pagos:[ {f:'2028-10-10',amort:100} ] },
  // YPF Clase XXXII — ley ARG, US$, 6,5% trimestral, venc 10/10/2028, bullet.
  YMCY: { emisor:'YPF', ley:'local', cupon:6.5, freq:3, venc:'2028-10-10', pagos:[ {f:'2028-10-10',amort:100} ] },
  // YPF Clase XXXI (YM1XO Adic.) — ley NY, US$, 8,75% semestral, venc 11/09/2031, sinkable (amort 3 cuotas finales, estimada).
  YMCX: { emisor:'YPF', ley:'NY', cupon:8.75, freq:6, venc:'2031-09-11',
    pagos:[ {f:'2029-09-11',amort:33.34}, {f:'2030-09-11',amort:33.33}, {f:'2031-09-11',amort:33.33} ] },
  // YPF Clase XVIII — ley NY, US$, 7% semestral, venc 30/09/2033, sinkable (amort 3 cuotas finales, estimada).
  YMCJ: { emisor:'YPF', ley:'NY', cupon:7, freq:6, venc:'2033-09-30',
    pagos:[ {f:'2031-09-30',amort:33.34}, {f:'2032-09-30',amort:33.33}, {f:'2033-09-30',amort:33.33} ] },
  // YPF Clase (YMC1) — ley NY, US$, 8,5% semestral, venc 27/06/2029, bullet.
  YMC1: { emisor:'YPF', ley:'NY', cupon:8.5, freq:6, venc:'2029-06-27', pagos:[ {f:'2029-06-27',amort:100} ] },
  // YPF Clase XVII — ley NY, US$, 9% semestral, venc 30/06/2029, sinkable. Ya amortizó ~14,29%: residual actual 85,71
  // y 6 cuotas de 14,2857% (dic-2026 a jun-2029). Cupón sobre el residual.
  YMCI: { emisor:'YPF', ley:'NY', cupon:9, freq:6, venc:'2029-06-30', residual0:85.714286,
    pagos:[ {f:'2026-12-30',amort:14.2857}, {f:'2027-06-30',amort:14.2857}, {f:'2027-12-30',amort:14.2857}, {f:'2028-06-30',amort:14.2857}, {f:'2028-12-30',amort:14.2857}, {f:'2029-06-30',amort:14.2857} ] },
  // YPF Clase XLIII — ley ARG, US$, 5,5% semestral, venc 14/04/2030, bullet.
  YM43: { emisor:'YPF', ley:'local', cupon:5.5, freq:6, venc:'2030-04-14', pagos:[ {f:'2030-04-14',amort:100} ] },
  // YPF Clase XL — ley ARG, US$, 7,5% trimestral, venc 28/08/2028, bullet.
  YM40: { emisor:'YPF', ley:'local', cupon:7.5, freq:3, venc:'2028-08-28', pagos:[ {f:'2028-08-28',amort:100} ] },
  // YPF Clase XXXVIII — ley ARG, US$, 7,5% trimestral, venc 22/07/2027, bullet.
  YM38: { emisor:'YPF', ley:'local', cupon:7.5, freq:3, venc:'2027-07-22', pagos:[ {f:'2027-07-22',amort:100} ] },
  // YPF Clase XXXVII — ley ARG, US$, 7% trimestral, venc 07/05/2027, bullet.
  YM37: { emisor:'YPF', ley:'local', cupon:7, freq:3, venc:'2027-05-07', pagos:[ {f:'2027-05-07',amort:100} ] },
  // YPF Clase XXXV — ley ARG, US$, 6,25% trimestral, venc 27/02/2027, bullet.
  YM35: { emisor:'YPF', ley:'local', cupon:6.25, freq:3, venc:'2027-02-27', pagos:[ {f:'2027-02-27',amort:100} ] },
  // YPF Clase XXXIV (Y134O Adic.) — ley NY, US$, 8,25% semestral, venc 17/01/2034, sinkable (amort 3 cuotas finales, estimada).
  YM34: { emisor:'YPF', ley:'NY', cupon:8.25, freq:6, venc:'2034-01-17',
    pagos:[ {f:'2032-01-17',amort:33.34}, {f:'2033-01-17',amort:33.33}, {f:'2034-01-17',amort:33.33} ] },
  // YPF Luz (YPF Energía Eléctrica) Clase XXIII — ley ARG, US$, 6,75% trimestral, venc 15/12/2028, bullet.
  YFCO: { emisor:'YPF Luz', ley:'local', cupon:6.75, freq:3, venc:'2028-12-15', pagos:[ {f:'2028-12-15',amort:100} ] },
  // YPF Luz Clase XXII — ley ARG, US$, 6% semestral, venc 03/10/2026, bullet.
  YFCN: { emisor:'YPF Luz', ley:'local', cupon:6, freq:6, venc:'2026-10-03', pagos:[ {f:'2026-10-03',amort:100} ] },
  // YPF Luz Clase XXI — ley ARG, US$, 6,5% trimestral, venc 20/05/2027, bullet.
  YFCM: { emisor:'YPF Luz', ley:'local', cupon:6.5, freq:3, venc:'2027-05-20', pagos:[ {f:'2027-05-20',amort:100} ] },
  // YPF Luz Clase XX — ley ARG, US$, 6,75% trimestral, venc 22/11/2028, bullet.
  YFCL: { emisor:'YPF Luz', ley:'local', cupon:6.75, freq:3, venc:'2028-11-22', pagos:[ {f:'2028-11-22',amort:100} ] },
  // YPF Luz Clase XIX — ley ARG, US$, 5,25% trimestral, venc 22/11/2026, bullet.
  YFCK: { emisor:'YPF Luz', ley:'local', cupon:5.25, freq:3, venc:'2026-11-22', pagos:[ {f:'2026-11-22',amort:100} ] },
  // YPF Luz Clase XVIII — ley NY, US$, 7,875% semestral, venc 16/10/2032, sinkable (amort 3 cuotas finales, estimada).
  YFCJ: { emisor:'YPF Luz', ley:'NY', cupon:7.875, freq:6, venc:'2032-10-16',
    pagos:[ {f:'2030-10-16',amort:33.34}, {f:'2031-10-16',amort:33.33}, {f:'2032-10-16',amort:33.33} ] },
  // YPF Luz Clase XVII — ley ARG, US$, 5,9% trimestral, venc 13/06/2027, sinkable (amort 2 cuotas finales, estimada).
  YFCI: { emisor:'YPF Luz', ley:'local', cupon:5.9, freq:3, venc:'2027-06-13',
    pagos:[ {f:'2026-12-13',amort:50}, {f:'2027-06-13',amort:50} ] },
  // YPF Luz Clase XV — ley ARG, US$, 6% trimestral, venc 27/02/2027, bullet.
  YFCG: { emisor:'YPF Luz', ley:'local', cupon:6, freq:3, venc:'2027-02-27', pagos:[ {f:'2027-02-27',amort:100} ] },
  // Central Puerto Clase C — ley ARG, US$, 8% anual semestral, venc 25/08/2029, bullet. (verif. ficha técnica, ISIN AR0630055561)
  NPCCD: { emisor:'Central Puerto', ley:'local', cupon:8, freq:6, venc:'2029-08-25', pagos:[ {f:'2029-08-25',amort:100} ] },
  // Central Puerto Clase D — ley ARG, US$, 6% anual semestral, venc 30/04/2030, bullet. (verif. ficha técnica, ISIN AR0670326856)
  NPCDD: { emisor:'Central Puerto', ley:'local', cupon:6, freq:6, venc:'2030-04-30', pagos:[ {f:'2030-04-30',amort:100} ] },
  // Loma Negra Clase 6 — ley ARG, US$, 6,5% anual semestral, venc 23/01/2029, bullet. (verif. ficha técnica, ISIN AR0204516451)
  LOC6D: { emisor:'Loma Negra', ley:'local', cupon:6.5, freq:6, venc:'2029-01-23', pagos:[ {f:'2029-01-23',amort:100} ] },
  // Loma Negra Clase 5 — ley ARG, US$, 8% anual semestral, venc 24/07/2027, bullet. (verif. ficha técnica, ISIN AR0579536985)
  LOC5D: { emisor:'Loma Negra', ley:'local', cupon:8, freq:6, venc:'2027-07-24', pagos:[ {f:'2027-07-24',amort:100} ] },
  // TGS (Transportadora de Gas del Sur) Clase 4 — ley NY, US$, 7,75% anual semestral, venc 20/11/2035, bullet. (verif. ficha técnica, ISIN USP9308RBB89)
  TSC4D: { emisor:'Transportadora de Gas del Sur', ley:'NY', cupon:7.75, freq:6, venc:'2035-11-20', pagos:[ {f:'2035-11-20',amort:100} ] },
  // TGS Clase 3 — ley NY, US$, 8,5% anual semestral, venc 24/07/2031, bullet. (verif. ficha técnica, ISIN USP9308RBA07)
  TSC3D: { emisor:'Transportadora de Gas del Sur', ley:'NY', cupon:8.5, freq:6, venc:'2031-07-24', pagos:[ {f:'2031-07-24',amort:100} ] },
  // CGC (Compañía General de Combustibles) Clase 40 — ley ARG, US$, 9,5% trimestral, venc 09/03/2028, bullet. (verif. ficha técnica, ISIN AR0360181769)
  CP40D: { emisor:'Compañía General de Combustibles', ley:'local', cupon:9.5, freq:3, venc:'2028-03-09', pagos:[ {f:'2028-03-09',amort:100} ] },
  // Aluar Serie 8 — ley ARG, US$, 6,25% trimestral, venc 21/03/2027, sinkable. 3 cuotas restantes de 25% (verif. cashflow).
  LMS8D: { emisor:'Aluar', ley:'local', cupon:6.25, freq:3, venc:'2027-03-21',
    pagos:[ {f:'2026-09-21',amort:25}, {f:'2026-12-21',amort:25}, {f:'2027-03-21',amort:25} ] },
  // Aluar Serie 7 — ley ARG, US$, 7% trimestral, venc 12/10/2028, sinkable. 9 cuotas restantes ~8,33% (verif. cashflow).
  LMS7D: { emisor:'Aluar', ley:'local', cupon:7, freq:3, venc:'2028-10-12',
    pagos:[ {f:'2026-10-12',amort:8.33}, {f:'2027-01-12',amort:8.33}, {f:'2027-04-12',amort:8.33}, {f:'2027-07-12',amort:8.33}, {f:'2027-10-12',amort:8.33}, {f:'2028-01-12',amort:8.33}, {f:'2028-04-12',amort:8.33}, {f:'2028-07-12',amort:8.33}, {f:'2028-10-12',amort:8.37} ] },
  // Cresud (todas ARG, US$, bullet — verif. ficha técnica)
  CS49D: { emisor:'Cresud', ley:'local', cupon:7.25, freq:6, venc:'2027-09-02', pagos:[ {f:'2027-09-02',amort:100} ] },
  CS53D: { emisor:'Cresud', ley:'local', cupon:6.25, freq:6, venc:'2030-04-30', pagos:[ {f:'2030-04-30',amort:100} ] },
  CS52D: { emisor:'Cresud', ley:'local', cupon:4.75, freq:6, venc:'2028-04-30', pagos:[ {f:'2028-04-30',amort:100} ] },
  CS50D: { emisor:'Cresud', ley:'local', cupon:7.25, freq:6, venc:'2029-03-10', pagos:[ {f:'2029-03-10',amort:100} ] },
  CS48D: { emisor:'Cresud', ley:'local', cupon:8, freq:6, venc:'2028-07-11', pagos:[ {f:'2028-07-11',amort:100} ] },
  CS47D: { emisor:'Cresud', ley:'local', cupon:7, freq:6, venc:'2028-11-15', pagos:[ {f:'2028-11-15',amort:100} ] },
  // IRSA (bullets — verif. ficha técnica)
  IRCQ: { emisor:'IRSA', ley:'local', cupon:3.75, freq:6, venc:'2027-06-08', pagos:[ {f:'2027-06-08',amort:100} ] },
  IRCO: { emisor:'IRSA', ley:'local', cupon:7.25, freq:6, venc:'2029-10-23', pagos:[ {f:'2029-10-23',amort:100} ] },
  IRCN: { emisor:'IRSA', ley:'local', cupon:5.75, freq:6, venc:'2027-10-23', pagos:[ {f:'2027-10-23',amort:100} ] },
  IRCJ: { emisor:'IRSA', ley:'local', cupon:7, freq:6, venc:'2027-02-28', pagos:[ {f:'2027-02-28',amort:100} ] },
  // IRSA Clase XIV — ley NY, US$, 8,75% semestral, venc 22/06/2028, sinkable. Residual actual 47,5: 17,5%+30% (verif. cashflow).
  IRCF: { emisor:'IRSA', ley:'NY', cupon:8.75, freq:6, venc:'2028-06-22', residual0:47.5,
    pagos:[ {f:'2027-06-22',amort:17.5}, {f:'2028-06-22',amort:30} ] },
  // IRSA Clase XXIV — ley NY, US$, 8% semestral, venc 31/03/2035, sinkable. Amort 33/33/34% en 2033-2035 (verif. cashflow).
  IRCP: { emisor:'IRSA', ley:'NY', cupon:8, freq:6, venc:'2035-03-31',
    pagos:[ {f:'2033-03-31',amort:33}, {f:'2034-03-31',amort:33}, {f:'2035-03-31',amort:34} ] },
  // Genneia — bullets, verif. ficha técnica
  GN47: { emisor:'Genneia', ley:'local', cupon:6, freq:6, venc:'2028-10-17', pagos:[ {f:'2028-10-17',amort:100} ] },
  GN43: { emisor:'Genneia', ley:'local', cupon:6.25, freq:3, venc:'2027-03-08', pagos:[ {f:'2027-03-08',amort:100} ] },
  // CGC (Compañía General de Combustibles) — bullets, verif. ficha técnica
  CP36: { emisor:'CGC', ley:'local', cupon:6.5, freq:6, venc:'2027-10-10', pagos:[ {f:'2027-10-10',amort:100} ] },
  CP37: { emisor:'CGC', ley:'local', cupon:7, freq:3, venc:'2027-03-10', pagos:[ {f:'2027-03-10',amort:100} ] },
  CP38: { emisor:'CGC', ley:'NY', cupon:11.875, freq:6, venc:'2030-11-28', pagos:[ {f:'2030-11-28',amort:100} ] },
  CP40: { emisor:'CGC', ley:'local', cupon:9.5, freq:3, venc:'2028-03-09', pagos:[ {f:'2028-03-09',amort:100} ] },
  // Edenor (bullets — verif. ficha técnica)
  DNCB: { emisor:'Edenor', ley:'local', cupon:7.5, freq:6, venc:'2029-07-03', pagos:[ {f:'2029-07-03',amort:100} ] },
  DNC5: { emisor:'Edenor', ley:'local', cupon:9.5, freq:6, venc:'2028-08-05', pagos:[ {f:'2028-08-05',amort:100} ] },
  DNC3: { emisor:'Edenor', ley:'local', cupon:9.75, freq:6, venc:'2026-11-22', pagos:[ {f:'2026-11-22',amort:100} ] },
  // Edenor Clase 10 — ley NY, US$, 9,5% semestral, venc 28/04/2033, sinkable. Amort 33,33/33,33/33,34% (verif. cashflow).
  DNCA: { emisor:'Edenor', ley:'NY', cupon:9.5, freq:6, venc:'2033-04-28',
    pagos:[ {f:'2031-04-28',amort:33.33}, {f:'2032-04-28',amort:33.33}, {f:'2033-04-28',amort:33.34} ] },
  // Edenor Clase 7 — ley NY, US$, 9,75% semestral, venc 24/10/2030, sinkable. Amort 33,33/33,33/33,34% (verif. cashflow).
  DNC7: { emisor:'Edenor', ley:'NY', cupon:9.75, freq:6, venc:'2030-10-24',
    pagos:[ {f:'2028-10-24',amort:33.33}, {f:'2029-10-24',amort:33.33}, {f:'2030-10-24',amort:33.34} ] },
  // Aeropuertos Argentina 2000 Clase 11 — ley ARG, US$, 5,5% semestral, venc 15/12/2026, bullet. (verif. ficha técnica)
  AERB: { emisor:'Aeropuertos Argentina 2000', ley:'local', cupon:5.5, freq:6, venc:'2026-12-15', pagos:[ {f:'2026-12-15',amort:100} ] },
  // John Deere Credit Compañía Financiera — todas ARG, US$, semestral, bullet (verif. ficha técnica)
  HJCL: { emisor:'John Deere', ley:'local', cupon:6.5, freq:6, venc:'2028-12-08', pagos:[ {f:'2028-12-08',amort:100} ] },
  HJCK: { emisor:'John Deere', ley:'local', cupon:7.75, freq:6, venc:'2029-01-16', pagos:[ {f:'2029-01-16',amort:100} ] },
  HJCI: { emisor:'John Deere', ley:'local', cupon:7.5, freq:6, venc:'2027-05-27', pagos:[ {f:'2027-05-27',amort:100} ] },
  HJCG: { emisor:'John Deere', ley:'local', cupon:6.5, freq:6, venc:'2028-10-21', pagos:[ {f:'2028-10-21',amort:100} ] },
  HJCF: { emisor:'John Deere', ley:'local', cupon:5, freq:6, venc:'2026-10-21', pagos:[ {f:'2026-10-21',amort:100} ] },
  HJCJ: { emisor:'John Deere', ley:'local', cupon:8.5, freq:6, venc:'2027-07-25', pagos:[ {f:'2027-07-25',amort:100} ] },
  // PCR (Petroquímica Comodoro Rivadavia) — todas ARG, US$, bullet (verif. ficha técnica)
  PQCTD: { emisor:'Petroquímica Comodoro Rivadavia', ley:'local', cupon:8.5, freq:6, venc:'2028-07-21', pagos:[ {f:'2028-07-21',amort:100} ] },
  PQCSD: { emisor:'Petroquímica Comodoro Rivadavia', ley:'local', cupon:8, freq:6, venc:'2031-02-17', pagos:[ {f:'2031-02-17',amort:100} ] },
  PQCRD: { emisor:'Petroquímica Comodoro Rivadavia', ley:'local', cupon:6.75, freq:6, venc:'2028-10-22', pagos:[ {f:'2028-10-22',amort:100} ] },
  // Edemsa Clase 3 — ley ARG, US$, 8% semestral, venc 29/11/2027, bullet. (verif. ficha técnica)
  OZC3D: { emisor:'Edemsa', ley:'local', cupon:8, freq:6, venc:'2027-11-29', pagos:[ {f:'2027-11-29',amort:100} ] },
  // Edemsa Clase 6 — US$, 8% semestral, bullet efectivo 29/11/2027 (verif. cashflow).
  OZC6D: { emisor:'Edemsa', ley:'local', cupon:8, freq:6, venc:'2027-11-29', pagos:[ {f:'2027-11-29',amort:100} ] },
  // Edemsa Clase 8 — ley NY, US$, 9,75% semestral, venc 11/06/2033, sinkable 33,33/33,33/33,34% (verif. cashflow).
  OZC8D: { emisor:'Edemsa', ley:'NY', cupon:9.75, freq:6, venc:'2033-06-11',
    pagos:[ {f:'2031-06-11',amort:33.33}, {f:'2032-06-11',amort:33.33}, {f:'2033-06-11',amort:33.34} ] },
  // Banco Macro — ley NY, US$, bullets (verif. ficha técnica)
  BACAD: { emisor:'Banco Macro', ley:'NY', cupon:6.75, freq:6, venc:'2026-11-04', pagos:[ {f:'2026-11-04',amort:100} ] },
  BACGD: { emisor:'Banco Macro', ley:'NY', cupon:8, freq:6, venc:'2029-06-23', pagos:[ {f:'2029-06-23',amort:100} ] },
  // Plaza Logística — ley ARG, US$, trimestrales, bullets (verif. ficha técnica)
  ZPC5D: { emisor:'Plaza Logística', ley:'local', cupon:6.5, freq:3, venc:'2029-06-25', pagos:[ {f:'2029-06-25',amort:100} ] },
  ZPC3D: { emisor:'Plaza Logística', ley:'local', cupon:8.5, freq:3, venc:'2027-09-03', pagos:[ {f:'2027-09-03',amort:100} ] },
  ZPC2D: { emisor:'Plaza Logística', ley:'local', cupon:7.5, freq:3, venc:'2027-06-02', pagos:[ {f:'2027-06-02',amort:100} ] },
  // Oldelval (Oleoductos del Valle) — ley ARG, US$, semestrales, bullets (verif. ficha técnica)
  OLC7D: { emisor:'Oldelval', ley:'local', cupon:6.9, freq:6, venc:'2030-02-23', pagos:[ {f:'2030-02-23',amort:100} ] },
  OLC6D: { emisor:'Oldelval', ley:'local', cupon:7.5, freq:6, venc:'2029-06-05', pagos:[ {f:'2029-06-05',amort:100} ] },
  OLC5D: { emisor:'Oldelval', ley:'local', cupon:7.89, freq:6, venc:'2028-06-12', pagos:[ {f:'2028-06-12',amort:100} ] },
  // Mirgor — ley ARG, US$, trimestrales, bullets (verif. ficha técnica)
  MIC6D: { emisor:'Mirgor', ley:'local', cupon:8, freq:3, venc:'2028-05-28', pagos:[ {f:'2028-05-28',amort:100} ] },
  MIC4D: { emisor:'Mirgor', ley:'local', cupon:8.25, freq:3, venc:'2027-07-29', pagos:[ {f:'2027-07-29',amort:100} ] },
  MIC3D: { emisor:'Mirgor', ley:'local', cupon:8.5, freq:3, venc:'2026-11-11', pagos:[ {f:'2026-11-11',amort:100} ] },
  // Banco Comafi — ley ARG, US$, semestrales, bullets (verif. ficha técnica)
  AFCID: { emisor:'Banco Comafi', ley:'local', cupon:6.5, freq:6, venc:'2026-11-07', pagos:[ {f:'2026-11-07',amort:100} ] },
  AFCKD: { emisor:'Banco Comafi', ley:'local', cupon:7, freq:6, venc:'2029-02-06', pagos:[ {f:'2029-02-06',amort:100} ] },
  // MSU Energy — sinkable (verif. cashflow)
  // Clase XIII — ley ARG, US$, 7,5% trimestral, venc 30/10/2027, amort 50/50% (jul y oct 2027).
  RUCED: { emisor:'MSU Energy', ley:'local', cupon:7.5, freq:3, venc:'2027-10-30',
    pagos:[ {f:'2027-07-30',amort:50}, {f:'2027-10-30',amort:50} ] },
  // Clase XII Serie B — ley NY, US$, 9,75% semestral, venc 05/12/2030, amort 17,5/17,5/65% (dic-2028/29/30).
  RUCDD: { emisor:'MSU Energy', ley:'NY', cupon:9.75, freq:6, venc:'2030-12-05',
    pagos:[ {f:'2028-12-05',amort:17.5}, {f:'2029-12-05',amort:17.5}, {f:'2030-12-05',amort:65} ] },
  // CNH Industrial Capital Argentina — ley ARG, US$, semestrales, bullets (verif. ficha técnica)
  CIC8D: { emisor:'CNH Industrial', ley:'local', cupon:7.5, freq:6, venc:'2028-11-12', pagos:[ {f:'2028-11-12',amort:100} ] },
  CIC9D: { emisor:'CNH Industrial', ley:'local', cupon:8.25, freq:6, venc:'2027-05-21', pagos:[ {f:'2027-05-21',amort:100} ] }
};
if (typeof window!=='undefined') window.ONS_CF = ONS_CF;
if (typeof module!=='undefined' && module.exports) module.exports = { ONS_CF };
// Calificaciones crediticias por emisor — Fix SCR (afiliada Fitch), escala nacional argentina. Ago-2025.
var ONS_RATINGS = {
  'YPF':'AAA(arg)', 'Pampa Energía':'AAA(arg)', 'Vista Energy':'AAA(arg)', 'Pluspetrol':'AAA(arg)',
  'IRSA':'AAA(arg)', 'Loma Negra':'AAA(arg)', 'TGS':'AAA(arg)', 'Transportadora de Gas del Sur':'AAA(arg)', 'John Deere':'AAA(arg)', 'Pan American Energy':'AAA(arg)',
  'Telecom':'AA(arg)', 'Telecom Argentina':'AA(arg)', 'Aeropuertos Argentina 2000':'AA+(arg)', 'Edenor':'A(arg)', 'Banco Macro':'AAA(arg)', 'Cresud':'AAA(arg)', 'CGC':'AA-(arg)', 'Petroquímica Comodoro Rivadavia':'AA-(arg)', 'MSU Energy':'AA-(arg)',
  'Capex':'AA(arg)', 'Rizobacter':'BBB-(arg)', 'YPF Luz':'AAA(arg)', 'Genneia':'AAA(arg)', 'Central Puerto':'AA+(arg)', 'Oldelval':'AAA(arg)', 'Mirgor':'A+(arg)', 'Banco Comafi':'AA(arg)'
};
if (typeof window!=='undefined') window.ONS_RATINGS = ONS_RATINGS;
if (typeof module!=='undefined' && module.exports) module.exports.ONS_RATINGS = ONS_RATINGS;
// Calificación internacional (Fitch, escala global) — relevante para las ONs ley NY (hard-dollar). May-2026.
var ONS_RATINGS_INT = { 'YPF':'B-', 'Pampa Energía':'B+', 'Vista Energy':'BB-', 'Pluspetrol':'BB', 'Telecom':'B-', 'Telecom Argentina':'B-', 'Edenor':'B-', 'Banco Macro':'B-' };
if (typeof window!=='undefined') window.ONS_RATINGS_INT = ONS_RATINGS_INT;
if (typeof module!=='undefined' && module.exports) module.exports.ONS_RATINGS_INT = ONS_RATINGS_INT;
