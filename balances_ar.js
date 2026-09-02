// ─────────────────────────────────────────────────────────────────────────────
// FINTERM — Estados financieros curados de empresas argentinas SIN feed oficial
// legible por máquina (las que no reportan 20-F ante la SEC). Datos cargados a
// mano desde los balances OFICIALES de cada empresa (memorias / EE.FF. auditados).
//
// ⚠ REGLA DE CARGA: solo cifras verificables contra el balance oficial. Si un dato
// no se puede confirmar, se deja en null (se muestra "—"), nunca se inventa.
//
// Estructura por ticker (mismo formato que produce parseReported en la app):
//   { sv, annual:true|false, unit:'ARS (miles de millones)'|'US$ (miles de millones)',
//     periods:['FY 23','FY 24',...],
//     income:[{label,vals:[...],strong?,pct?}], balance:[...], cashflow:[...] }
// vals[] es paralelo a periods[]; un valor null = dato no disponible.
//
// Las empresas con ADR (YPF, GGAL, PAM, BMA, CEPU, CRESY, LOMA, TEO, SUPV, EDN…)
// NO van acá: ya reciben sus estados reales vía Finnhub. Este archivo es para las
// que solo cotizan local (TXAR, TRAN, MIRG, TGSU2, VALO, MOLI, etc.).
// ─────────────────────────────────────────────────────────────────────────────

var BALANCES_AR = {
  // (aún sin cargar) — se completará empresa por empresa desde balances oficiales.
  // Ejemplo de forma esperada (comentado):
  // TXAR: { sv:2, annual:true, unit:'ARS (miles de millones)',
  //   periods:['FY 22','FY 23','FY 24'],
  //   income:[{label:'Ingresos',vals:[null,null,null],strong:true}, ...],
  //   balance:[{label:'Activos totales',vals:[null,null,null],strong:true}, ...],
  //   cashflow:[{label:'Flujo operativo',vals:[null,null,null],strong:true}, ...] }
};

if (typeof window !== 'undefined') window.BALANCES_AR = BALANCES_AR;
if (typeof module !== 'undefined' && module.exports) module.exports = { BALANCES_AR };
