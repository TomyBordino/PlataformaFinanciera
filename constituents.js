// FINTERM — dataset de constituyentes (membresía de índice + nombre + sector).
// Formato: [símbolo, nombre, sector]. Los precios y ratios se traen en vivo
// (data912 / Finnhub); este archivo solo aporta la lista y los metadatos.
// La membresía de un índice cambia pocas veces al año: actualizar cuando sea necesario.
(function () {
  var TEC = 'Tecnología', SAL = 'Salud', FIN = 'Financiero', CD = 'Consumo discrecional',
      CB = 'Consumo básico', IND = 'Industrial', ENE = 'Energía', SP = 'Servicios públicos',
      MAT = 'Materiales', INM = 'Inmobiliario', COM = 'Comunicaciones';

  var spx = [
    // ---- Tecnología ----
    ['AAPL','Apple Inc.',TEC],['MSFT','Microsoft Corp.',TEC],['NVDA','NVIDIA Corp.',TEC],
    ['AVGO','Broadcom Inc.',TEC],['ORCL','Oracle Corp.',TEC],['CRM','Salesforce Inc.',TEC],
    ['ADBE','Adobe Inc.',TEC],['AMD','Advanced Micro Devices',TEC],['ACN','Accenture plc',TEC],
    ['CSCO','Cisco Systems',TEC],['INTC','Intel Corp.',TEC],['IBM','IBM Corp.',TEC],
    ['QCOM','Qualcomm Inc.',TEC],['TXN','Texas Instruments',TEC],['INTU','Intuit Inc.',TEC],
    ['NOW','ServiceNow Inc.',TEC],['AMAT','Applied Materials',TEC],['MU','Micron Technology',TEC],
    ['LRCX','Lam Research',TEC],['ADI','Analog Devices',TEC],['KLAC','KLA Corp.',TEC],
    ['SNPS','Synopsys Inc.',TEC],['CDNS','Cadence Design',TEC],['MRVL','Marvell Technology',TEC],
    ['APH','Amphenol Corp.',TEC],['MSI','Motorola Solutions',TEC],['ROP','Roper Technologies',TEC],
    ['ADSK','Autodesk Inc.',TEC],['NXPI','NXP Semiconductors',TEC],['FTNT','Fortinet Inc.',TEC],
    ['TEL','TE Connectivity',TEC],['MCHP','Microchip Technology',TEC],['IT','Gartner Inc.',TEC],
    ['ANSS','Ansys Inc.',TEC],['CDW','CDW Corp.',TEC],['KEYS','Keysight Technologies',TEC],
    ['HPQ','HP Inc.',TEC],['GLW','Corning Inc.',TEC],['ON','ON Semiconductor',TEC],
    ['HPE','Hewlett Packard Enterprise',TEC],['WDC','Western Digital',TEC],['STX','Seagate Technology',TEC],
    ['FSLR','First Solar',TEC],['TER','Teradyne Inc.',TEC],['ZBRA','Zebra Technologies',TEC],
    ['TDY','Teledyne Technologies',TEC],['PTC','PTC Inc.',TEC],['TYL','Tyler Technologies',TEC],
    ['JBL','Jabil Inc.',TEC],['SWKS','Skyworks Solutions',TEC],['NTAP','NetApp Inc.',TEC],
    ['GEN','Gen Digital',TEC],['AKAM','Akamai Technologies',TEC],['JNPR','Juniper Networks',TEC],
    ['EPAM','EPAM Systems',TEC],['FFIV','F5 Inc.',TEC],['SMCI','Super Micro Computer',TEC],
    ['ENPH','Enphase Energy',TEC],['QRVO','Qorvo Inc.',TEC],['DELL','Dell Technologies',TEC],
    ['ANET','Arista Networks',TEC],['PLTR','Palantir Technologies',TEC],['TRMB','Trimble Inc.',TEC],

    // ---- Comunicaciones ----
    ['GOOGL','Alphabet Inc. (A)',COM],['GOOG','Alphabet Inc. (C)',COM],['META','Meta Platforms',COM],
    ['NFLX','Netflix Inc.',COM],['DIS','Walt Disney Co.',COM],['CMCSA','Comcast Corp.',COM],
    ['T','AT&T Inc.',COM],['VZ','Verizon Communications',COM],['TMUS','T-Mobile US',COM],
    ['CHTR','Charter Communications',COM],['EA','Electronic Arts',COM],['TTWO','Take-Two Interactive',COM],
    ['WBD','Warner Bros. Discovery',COM],['OMC','Omnicom Group',COM],['IPG','Interpublic Group',COM],
    ['LYV','Live Nation Entertainment',COM],['NWSA','News Corp (A)',COM],['NWS','News Corp (B)',COM],
    ['FOXA','Fox Corp. (A)',COM],['FOX','Fox Corp. (B)',COM],['PARA','Paramount Global',COM],
    ['MTCH','Match Group',COM],['DASH','DoorDash Inc.',COM],

    // ---- Consumo discrecional ----
    ['AMZN','Amazon.com Inc.',CD],['TSLA','Tesla Inc.',CD],['HD','Home Depot',CD],
    ['MCD','McDonald\u0027s Corp.',CD],['NKE','Nike Inc.',CD],['LOW','Lowe\u0027s Companies',CD],
    ['BKNG','Booking Holdings',CD],['SBUX','Starbucks Corp.',CD],['TJX','TJX Companies',CD],
    ['ORLY','O\u0027Reilly Automotive',CD],['MAR','Marriott International',CD],['GM','General Motors',CD],
    ['F','Ford Motor Co.',CD],['CMG','Chipotle Mexican Grill',CD],['HLT','Hilton Worldwide',CD],
    ['AZO','AutoZone Inc.',CD],['ROST','Ross Stores',CD],['YUM','Yum! Brands',CD],
    ['LULU','Lululemon Athletica',CD],['DHI','D.R. Horton',CD],['LEN','Lennar Corp.',CD],
    ['NVR','NVR Inc.',CD],['PHM','PulteGroup',CD],['GRMN','Garmin Ltd.',CD],
    ['EBAY','eBay Inc.',CD],['APTV','Aptiv plc',CD],['TSCO','Tractor Supply',CD],
    ['ULTA','Ulta Beauty',CD],['DRI','Darden Restaurants',CD],['EXPE','Expedia Group',CD],
    ['BBY','Best Buy',CD],['POOL','Pool Corp.',CD],['DECK','Deckers Outdoor',CD],
    ['LVS','Las Vegas Sands',CD],['WYNN','Wynn Resorts',CD],['MGM','MGM Resorts',CD],
    ['CCL','Carnival Corp.',CD],['RCL','Royal Caribbean',CD],['NCLH','Norwegian Cruise Line',CD],
    ['KMX','CarMax Inc.',CD],['GPC','Genuine Parts',CD],['WSM','Williams-Sonoma',CD],
    ['HAS','Hasbro Inc.',CD],['MHK','Mohawk Industries',CD],['BWA','BorgWarner Inc.',CD],
    ['CZR','Caesars Entertainment',CD],['DPZ','Domino\u0027s Pizza',CD],['TPR','Tapestry Inc.',CD],
    ['RL','Ralph Lauren',CD],['LKQ','LKQ Corp.',CD],['APO','Apollo Global Mgmt.',CD],

    // ---- Consumo básico ----
    ['WMT','Walmart Inc.',CB],['COST','Costco Wholesale',CB],['PG','Procter & Gamble',CB],
    ['KO','Coca-Cola Co.',CB],['PEP','PepsiCo Inc.',CB],['PM','Philip Morris Intl.',CB],
    ['MO','Altria Group',CB],['MDLZ','Mondelez International',CB],['CL','Colgate-Palmolive',CB],
    ['TGT','Target Corp.',CB],['KMB','Kimberly-Clark',CB],['GIS','General Mills',CB],
    ['SYY','Sysco Corp.',CB],['KVUE','Kenvue Inc.',CB],['KHC','Kraft Heinz',CB],
    ['MNST','Monster Beverage',CB],['KDP','Keurig Dr Pepper',CB],['STZ','Constellation Brands',CB],
    ['HSY','Hershey Co.',CB],['KR','Kroger Co.',CB],['ADM','Archer-Daniels-Midland',CB],
    ['MKC','McCormick & Co.',CB],['CHD','Church & Dwight',CB],['CLX','Clorox Co.',CB],
    ['K','Kellanova',CB],['CAG','Conagra Brands',CB],['TSN','Tyson Foods',CB],
    ['HRL','Hormel Foods',CB],['SJM','J.M. Smucker',CB],['CPB','Campbell\u0027s Co.',CB],
    ['TAP','Molson Coors',CB],['BG','Bunge Global',CB],['DG','Dollar General',CB],
    ['DLTR','Dollar Tree',CB],['LW','Lamb Weston',CB],['BF.B','Brown-Forman',CB],
    ['WBA','Walgreens Boots Alliance',CB],['EL','Estée Lauder',CB],

    // ---- Salud ----
    ['LLY','Eli Lilly & Co.',SAL],['UNH','UnitedHealth Group',SAL],['JNJ','Johnson & Johnson',SAL],
    ['ABBV','AbbVie Inc.',SAL],['MRK','Merck & Co.',SAL],['TMO','Thermo Fisher Scientific',SAL],
    ['ABT','Abbott Laboratories',SAL],['DHR','Danaher Corp.',SAL],['PFE','Pfizer Inc.',SAL],
    ['AMGN','Amgen Inc.',SAL],['ISRG','Intuitive Surgical',SAL],['BMY','Bristol-Myers Squibb',SAL],
    ['GILD','Gilead Sciences',SAL],['VRTX','Vertex Pharmaceuticals',SAL],['MDT','Medtronic plc',SAL],
    ['CI','Cigna Group',SAL],['ELV','Elevance Health',SAL],['REGN','Regeneron Pharma',SAL],
    ['CVS','CVS Health',SAL],['BSX','Boston Scientific',SAL],['SYK','Stryker Corp.',SAL],
    ['ZTS','Zoetis Inc.',SAL],['BDX','Becton Dickinson',SAL],['HCA','HCA Healthcare',SAL],
    ['MCK','McKesson Corp.',SAL],['CAH','Cardinal Health',SAL],['COR','Cencora Inc.',SAL],
    ['EW','Edwards Lifesciences',SAL],['IQV','IQVIA Holdings',SAL],['IDXX','IDEXX Laboratories',SAL],
    ['GEHC','GE HealthCare',SAL],['A','Agilent Technologies',SAL],['DXCM','DexCom Inc.',SAL],
    ['MTD','Mettler-Toledo',SAL],['RMD','ResMed Inc.',SAL],['BIIB','Biogen Inc.',SAL],
    ['WST','West Pharmaceutical',SAL],['MRNA','Moderna Inc.',SAL],['WAT','Waters Corp.',SAL],
    ['ZBH','Zimmer Biomet',SAL],['STE','STERIS plc',SAL],['BAX','Baxter International',SAL],
    ['HOLX','Hologic Inc.',SAL],['ALGN','Align Technology',SAL],['MOH','Molina Healthcare',SAL],
    ['CNC','Centene Corp.',SAL],['LH','Labcorp Holdings',SAL],['DGX','Quest Diagnostics',SAL],
    ['VTRS','Viatris Inc.',SAL],['PODD','Insulet Corp.',SAL],['RVTY','Revvity Inc.',SAL],
    ['TECH','Bio-Techne Corp.',SAL],['INCY','Incyte Corp.',SAL],['CRL','Charles River Labs',SAL],
    ['HSIC','Henry Schein',SAL],['DVA','DaVita Inc.',SAL],['UHS','Universal Health Services',SAL],
    ['SOLV','Solventum Corp.',SAL],

    // ---- Financiero ----
    ['BRK.B','Berkshire Hathaway (B)',FIN],['JPM','JPMorgan Chase',FIN],['V','Visa Inc.',FIN],
    ['MA','Mastercard Inc.',FIN],['BAC','Bank of America',FIN],['WFC','Wells Fargo',FIN],
    ['GS','Goldman Sachs',FIN],['MS','Morgan Stanley',FIN],['AXP','American Express',FIN],
    ['SPGI','S&P Global',FIN],['BLK','BlackRock Inc.',FIN],['C','Citigroup Inc.',FIN],
    ['SCHW','Charles Schwab',FIN],['PGR','Progressive Corp.',FIN],['CB','Chubb Ltd.',FIN],
    ['MMC','Marsh & McLennan',FIN],['FI','Fiserv Inc.',FIN],['ICE','Intercontinental Exchange',FIN],
    ['PYPL','PayPal Holdings',FIN],['CME','CME Group',FIN],['USB','U.S. Bancorp',FIN],
    ['PNC','PNC Financial Services',FIN],['AON','Aon plc',FIN],['MCO','Moody\u0027s Corp.',FIN],
    ['TFC','Truist Financial',FIN],['COF','Capital One Financial',FIN],['BK','Bank of New York Mellon',FIN],
    ['AJG','Arthur J. Gallagher',FIN],['AFL','Aflac Inc.',FIN],['MET','MetLife Inc.',FIN],
    ['TRV','Travelers Companies',FIN],['ALL','Allstate Corp.',FIN],['AIG','American Intl. Group',FIN],
    ['MSCI','MSCI Inc.',FIN],['PRU','Prudential Financial',FIN],['AMP','Ameriprise Financial',FIN],
    ['DFS','Discover Financial',FIN],['FIS','Fidelity National Info.',FIN],['NDAQ','Nasdaq Inc.',FIN],
    ['ACGL','Arch Capital Group',FIN],['HIG','Hartford Financial',FIN],['STT','State Street',FIN],
    ['GPN','Global Payments',FIN],['WTW','Willis Towers Watson',FIN],['BRO','Brown & Brown',FIN],
    ['RJF','Raymond James Financial',FIN],['TROW','T. Rowe Price',FIN],['FITB','Fifth Third Bancorp',FIN],
    ['CINF','Cincinnati Financial',FIN],['MTB','M&T Bank',FIN],['NTRS','Northern Trust',FIN],
    ['HBAN','Huntington Bancshares',FIN],['RF','Regions Financial',FIN],['CFG','Citizens Financial',FIN],
    ['KEY','KeyCorp',FIN],['SYF','Synchrony Financial',FIN],['CPAY','Corpay Inc.',FIN],
    ['PFG','Principal Financial',FIN],['L','Loews Corp.',FIN],['CBOE','Cboe Global Markets',FIN],
    ['MKTX','MarketAxess Holdings',FIN],['JKHY','Jack Henry & Associates',FIN],['EG','Everest Group',FIN],
    ['BEN','Franklin Resources',FIN],['IVZ','Invesco Ltd.',FIN],['GL','Globe Life',FIN],
    ['AIZ','Assurant Inc.',FIN],['ERIE','Erie Indemnity',FIN],['WRB','W.R. Berkley',FIN],
    ['KKR','KKR & Co.',FIN],['BX','Blackstone Inc.',FIN],

    // ---- Industrial ----
    ['GE','GE Aerospace',IND],['RTX','RTX Corp.',IND],['CAT','Caterpillar Inc.',IND],
    ['HON','Honeywell International',IND],['UNP','Union Pacific',IND],['BA','Boeing Co.',IND],
    ['ETN','Eaton Corp.',IND],['DE','Deere & Co.',IND],['LMT','Lockheed Martin',IND],
    ['UPS','United Parcel Service',IND],['ADP','Automatic Data Processing',IND],['GD','General Dynamics',IND],
    ['TT','Trane Technologies',IND],['NOC','Northrop Grumman',IND],['CSX','CSX Corp.',IND],
    ['EMR','Emerson Electric',IND],['ITW','Illinois Tool Works',IND],['FDX','FedEx Corp.',IND],
    ['NSC','Norfolk Southern',IND],['PH','Parker-Hannifin',IND],['WM','Waste Management',IND],
    ['MMM','3M Co.',IND],['GEV','GE Vernova',IND],['CARR','Carrier Global',IND],
    ['PCAR','PACCAR Inc.',IND],['JCI','Johnson Controls',IND],['CPRT','Copart Inc.',IND],
    ['CTAS','Cintas Corp.',IND],['PAYX','Paychex Inc.',IND],['GWW','W.W. Grainger',IND],
    ['TDG','TransDigm Group',IND],['URI','United Rentals',IND],['RSG','Republic Services',IND],
    ['LHX','L3Harris Technologies',IND],['OTIS','Otis Worldwide',IND],['AME','Ametek Inc.',IND],
    ['FAST','Fastenal Co.',IND],['ODFL','Old Dominion Freight',IND],['VRSK','Verisk Analytics',IND],
    ['CMI','Cummins Inc.',IND],['DAL','Delta Air Lines',IND],['LUV','Southwest Airlines',IND],
    ['UAL','United Airlines',IND],['IR','Ingersoll Rand',IND],['ROK','Rockwell Automation',IND],
    ['DOV','Dover Corp.',IND],['EFX','Equifax Inc.',IND],['XYL','Xylem Inc.',IND],
    ['FTV','Fortive Corp.',IND],['HWM','Howmet Aerospace',IND],['WAB','Wabtec Corp.',IND],
    ['AXON','Axon Enterprise',IND],['PWR','Quanta Services',IND],['HUBB','Hubbell Inc.',IND],
    ['BR','Broadridge Financial',IND],['DD','DuPont de Nemours',IND],['VLTO','Veralto Corp.',IND],
    ['IEX','IDEX Corp.',IND],['SNA','Snap-on Inc.',IND],['PNR','Pentair plc',IND],
    ['NDSN','Nordson Corp.',IND],['JBHT','J.B. Hunt Transport',IND],['SWK','Stanley Black & Decker',IND],
    ['EXPD','Expeditors Intl.',IND],['MAS','Masco Corp.',IND],['TXT','Textron Inc.',IND],
    ['ALLE','Allegion plc',IND],['PNW','Pinnacle West? ',IND],['CHRW','C.H. Robinson',IND],
    ['ROL','Rollins Inc.',IND],['DAY','Dayforce Inc.',IND],['GNRC','Generac Holdings',IND],
    ['PAYC','Paycom Software',IND],['EMN','Eastman Chemical',IND],['AOS','A.O. Smith',IND],
    ['BLDR','Builders FirstSource',IND],

    // ---- Energía ----
    ['XOM','Exxon Mobil',ENE],['CVX','Chevron Corp.',ENE],['COP','ConocoPhillips',ENE],
    ['EOG','EOG Resources',ENE],['SLB','Schlumberger',ENE],['MPC','Marathon Petroleum',ENE],
    ['PSX','Phillips 66',ENE],['WMB','Williams Companies',ENE],['OXY','Occidental Petroleum',ENE],
    ['VLO','Valero Energy',ENE],['KMI','Kinder Morgan',ENE],['HES','Hess Corp.',ENE],
    ['OKE','ONEOK Inc.',ENE],['BKR','Baker Hughes',ENE],['HAL','Halliburton Co.',ENE],
    ['FANG','Diamondback Energy',ENE],['DVN','Devon Energy',ENE],['TRGP','Targa Resources',ENE],
    ['CTRA','Coterra Energy',ENE],['EQT','EQT Corp.',ENE],['MRO','Marathon Oil',ENE],
    ['APA','APA Corp.',ENE],['EXE','Expand Energy',ENE],

    // ---- Servicios públicos ----
    ['NEE','NextEra Energy',SP],['SO','Southern Co.',SP],['DUK','Duke Energy',SP],
    ['CEG','Constellation Energy',SP],['AEP','American Electric Power',SP],['SRE','Sempra',SP],
    ['D','Dominion Energy',SP],['EXC','Exelon Corp.',SP],['XEL','Xcel Energy',SP],
    ['PEG','Public Service Enterprise',SP],['ED','Consolidated Edison',SP],['VST','Vistra Corp.',SP],
    ['WEC','WEC Energy Group',SP],['AWK','American Water Works',SP],['DTE','DTE Energy',SP],
    ['ETR','Entergy Corp.',SP],['PPL','PPL Corp.',SP],['AEE','Ameren Corp.',SP],
    ['FE','FirstEnergy Corp.',SP],['ATO','Atmos Energy',SP],['CMS','CMS Energy',SP],
    ['CNP','CenterPoint Energy',SP],['NRG','NRG Energy',SP],['LNT','Alliant Energy',SP],
    ['NI','NiSource Inc.',SP],['EVRG','Evergy Inc.',SP],['ES','Eversource Energy',SP],
    ['PNW','Pinnacle West Capital',SP],['AES','AES Corp.',SP],['PCG','PG&E Corp.',SP],

    // ---- Materiales ----
    ['LIN','Linde plc',MAT],['SHW','Sherwin-Williams',MAT],['ECL','Ecolab Inc.',MAT],
    ['APD','Air Products & Chemicals',MAT],['FCX','Freeport-McMoRan',MAT],['NEM','Newmont Corp.',MAT],
    ['NUE','Nucor Corp.',MAT],['DOW','Dow Inc.',MAT],['CTVA','Corteva Inc.',MAT],
    ['PPG','PPG Industries',MAT],['VMC','Vulcan Materials',MAT],['MLM','Martin Marietta',MAT],
    ['IFF','Intl. Flavors & Fragrances',MAT],['LYB','LyondellBasell',MAT],['STLD','Steel Dynamics',MAT],
    ['PKG','Packaging Corp. of America',MAT],['BALL','Ball Corp.',MAT],['AVY','Avery Dennison',MAT],
    ['IP','International Paper',MAT],['CF','CF Industries',MAT],['ALB','Albemarle Corp.',MAT],
    ['AMCR','Amcor plc',MAT],['CE','Celanese Corp.',MAT],['MOS','Mosaic Co.',MAT],
    ['FMC','FMC Corp.',MAT],['SW','Smurfit WestRock',MAT],

    // ---- Inmobiliario ----
    ['PLD','Prologis Inc.',INM],['AMT','American Tower',INM],['EQIX','Equinix Inc.',INM],
    ['WELL','Welltower Inc.',INM],['SPG','Simon Property Group',INM],['PSA','Public Storage',INM],
    ['O','Realty Income',INM],['DLR','Digital Realty Trust',INM],['CCI','Crown Castle',INM],
    ['CBRE','CBRE Group',INM],['EXR','Extra Space Storage',INM],['VICI','VICI Properties',INM],
    ['AVB','AvalonBay Communities',INM],['EQR','Equity Residential',INM],['IRM','Iron Mountain',INM],
    ['SBAC','SBA Communications',INM],['WY','Weyerhaeuser Co.',INM],['INVH','Invitation Homes',INM],
    ['VTR','Ventas Inc.',INM],['MAA','Mid-America Apartment',INM],['ESS','Essex Property Trust',INM],
    ['ARE','Alexandria Real Estate',INM],['KIM','Kimco Realty',INM],['DOC','Healthpeak Properties',INM],
    ['UDR','UDR Inc.',INM],['HST','Host Hotels & Resorts',INM],['REG','Regency Centers',INM],
    ['BXP','BXP Inc.',INM],['FRT','Federal Realty',INM],['CPT','Camden Property Trust',INM],

    // ---- Altas recientes / adicionales ----
    ['ABNB','Airbnb Inc.',CD],['UBER','Uber Technologies',IND],['COIN','Coinbase Global',FIN],
    ['CRWD','CrowdStrike Holdings',TEC],['PANW','Palo Alto Networks',TEC],['WDAY','Workday Inc.',TEC],
    ['TTD','The Trade Desk',TEC],['DDOG','Datadog Inc.',TEC],['MPWR','Monolithic Power Systems',TEC],
    ['TPL','Texas Pacific Land',ENE],['GDDY','GoDaddy Inc.',TEC],['FICO','Fair Isaac Corp.',TEC],
    ['CSGP','CoStar Group',INM],['VRSN','Verisign Inc.',TEC],['ARES','Ares Management',FIN],
    ['APP','AppLovin Corp.',TEC],['TKO','TKO Group Holdings',COM],['MDB','MongoDB Inc.',TEC],
    ['HII','Huntington Ingalls',IND],['SW','Smurfit WestRock',MAT],['DELL','Dell Technologies',TEC]
  ];

  var merval = [
    ['GGAL','Grupo Financiero Galicia',FIN],['BMA','Banco Macro',FIN],['BBAR','BBVA Argentina',FIN],
    ['SUPV','Grupo Supervielle',FIN],['VALO','Grupo Financiero Valores',FIN],['BYMA','Bolsas y Mercados Argentinos',FIN],
    ['YPFD','YPF S.A.',ENE],['PAMP','Pampa Energía',ENE],['CEPU','Central Puerto',SP],
    ['TGSU2','Transportadora de Gas del Sur',ENE],['TGNO4','Transportadora de Gas del Norte',ENE],
    ['TRAN','Transener',SP],['EDN','Edenor',SP],['CECO2','Central Costanera',SP],
    ['METR','MetroGAS',SP],['CGPA2','Camuzzi Gas Pampeana',SP],['DGCU2','Distribuidora de Gas Cuyana',SP],
    ['GBAN','Naturgy BAN',SP],['CAPX','Capex S.A.',ENE],
    ['ALUA','Aluar Aluminio',MAT],['TXAR','Ternium Argentina',MAT],['LOMA','Loma Negra',MAT],
    ['HARG','Holcim Argentina',MAT],['CELU','Celulosa Argentina',MAT],['FERR','Ferrum',IND],
    ['RIGO','Rigolleau',IND],['AGRO','Agrometal',IND],['AUSO','Autopistas del Sol',IND],
    ['OEST','Grupo Concesionario del Oeste',IND],
    ['MIRG','Mirgor',CD],['COME','Sociedad Comercial del Plata',IND],['CRES','Cresud',INM],
    ['IRSA','IRSA Inversiones y Representaciones',INM],['CVH','Cablevisión Holding',COM],
    ['TECO2','Telecom Argentina',COM],['GCLA','Grupo Clarín',COM],
    ['LEDE','Ledesma',CB],['MOLI','Molinos Río de la Plata',CB],['MOLA','Molinos Agro',CB],
    ['MORI','Morixe Hermanos',CB],['SAMI','S.A. San Miguel',CB],['RICH','Laboratorios Richmond',SAL],
    ['BOLT','Boldt S.A.',CD],['LONG','Longvie',CD],['INVJ','Inversora Juramento',CB],
    ['PATA','Importadora y Exportadora de la Patagonia',CD]
  ];


  // ---- Brasil: empresas brasileñas que cotizan internacionalmente (ADRs en NYSE/NASDAQ, en US$) ----
  var brasil=[
    ['PBR','Petrobras',ENE],['VALE','Vale',MAT],['ITUB','Itaú Unibanco',FIN],['BBD','Bradesco',FIN],
    ['NU','Nubank (Nu Holdings)',FIN],['XP','XP Inc.',FIN],['BSBR','Banco Santander Brasil',FIN],
    ['STNE','StoneCo',FIN],['PAGS','PagSeguro (PagBank)',FIN],['MELI','MercadoLibre',CD],
    ['ABEV','Ambev',CB],['JBS','JBS',CB],
    ['EMBR3','Embraer',IND],['GGB','Gerdau',MAT],['SID','CSN (Siderúrgica Nacional)',MAT],
    ['SUZ','Suzano',MAT],['BAK','Braskem',MAT],['UGP','Ultrapar',ENE],
    ['SBS','Sabesp',SP],['CIG','Cemig',SP],
    ['TIMB','TIM Brasil',COM],['VIV','Vivo (Telefônica Brasil)',COM],
    ['AZUL','Azul Linhas Aéreas',IND],['LND','BrasilAgro',CB],['VTEX','VTEX',TEC],['AFYA','Afya',SAL],
    // B3 (bolsa local de São Paulo, precios en R$): empresas sin ADR en NYSE/NASDAQ
    ['WEGE3','WEG',IND],['BBAS3','Banco do Brasil',FIN],['ITSA4','Itaúsa',FIN],['BPAC11','BTG Pactual',FIN],
    ['B3SA3','B3 (Bolsa de Brasil)',FIN],['MGLU3','Magazine Luiza',CD],['LREN3','Lojas Renner',CD],
    ['RADL3','Raia Drogasil',CD],['RENT3','Localiza',IND],['RAIL3','Rumo',IND],['CCRO3','Motiva (ex CCR)',IND],
    ['PRIO3','PRIO (PetroRio)',ENE],['VBBR3','Vibra Energia',ENE],['TOTS3','Totvs',TEC],
    ['HAPV3','Hapvida',SAL],['HYPE3','Hypera Pharma',SAL],['FLRY3','Fleury',SAL],
    ['EQTL3','Equatorial Energia',SP],['TAEE11','Taesa',SP],['EGIE3','Engie Brasil',SP],['CPFE3','CPFL Energia',SP],
    ['KLBN11','Klabin',MAT],['CYRE3','Cyrela',INM],['MULT3','Multiplan',INM],['MRVE3','MRV',INM]
  ];

  merval.push(['VIST','Vista Energy',ENE]);

  // Acciones muy seguidas fuera del índice curado (mid/large caps líquidas de NYSE/NASDAQ).
  spx.push(
    ['PLTR','Palantir Technologies',TEC],['COIN','Coinbase Global',FIN],['HOOD','Robinhood Markets',FIN],
    ['SNOW','Snowflake Inc.',TEC],['RBLX','Roblox Corp.',COM],['DDOG','Datadog Inc.',TEC],
    ['NET','Cloudflare Inc.',TEC],['CRWD','CrowdStrike Holdings',TEC],['ABNB','Airbnb Inc.',CD],
    ['UBER','Uber Technologies',IND],['SHOP','Shopify Inc.',TEC],['XYZ','Block Inc.',TEC],
    ['ROKU','Roku Inc.',COM],['DASH','DoorDash Inc.',CD],['RIVN','Rivian Automotive',CD],
    ['SOFI','SoFi Technologies',FIN],['MSTR','MicroStrategy Inc.',TEC]
  );

  // ETFs que cotizan en Wall Street. "Sector" acá = categoría del ETF (no tienen ratios de empresa).
  var IDX='Índices', SEC='Sectores', RF='Bonos', COMM='Materias primas', GLOB='Global/Temáticos';
  var etf = [
    ['SPY','SPDR S&P 500 ETF',IDX],['VOO','Vanguard S&P 500 ETF',IDX],['IVV','iShares Core S&P 500',IDX],
    ['QQQ','Invesco QQQ (Nasdaq 100)',IDX],['DIA','SPDR Dow Jones',IDX],['IWM','iShares Russell 2000',IDX],
    ['XLK','Technology Select Sector',SEC],['XLF','Financial Select Sector',SEC],['XLE','Energy Select Sector',SEC],
    ['XLV','Health Care Select Sector',SEC],['XLY','Consumer Discretionary Sector',SEC],['XLI','Industrial Select Sector',SEC],
    ['XLP','Consumer Staples Sector',SEC],['SMH','VanEck Semiconductors',SEC],
    ['TLT','iShares 20+ Year Treasury',RF],['AGG','iShares Core US Aggregate Bond',RF],['HYG','iShares High Yield Corp',RF],
    ['GLD','SPDR Gold Shares',COMM],['SLV','iShares Silver Trust',COMM],['USO','US Oil Fund',COMM],
    ['ARKK','ARK Innovation ETF',GLOB],['VGT','Vanguard Information Tech',GLOB],['EEM','iShares MSCI Emerging Markets',GLOB],
    ['EFA','iShares MSCI EAFE',GLOB],['IEMG','iShares Core MSCI Emerging Markets',GLOB],['IEFA','iShares Core MSCI EAFE',GLOB],['VTI','Vanguard Total Stock Market',IDX],['SCHD','Schwab US Dividend Equity',GLOB]
  ];

  // Commodities vía ETFs que replican cada materia prima (cotizan en Wall Street, mismo feed que las acciones EE.UU.).
  var commodities = [
    ['GLD','Oro · SPDR Gold Shares','Metales preciosos'],['IAU','Oro · iShares Gold Trust','Metales preciosos'],
    ['SLV','Plata · iShares Silver Trust','Metales preciosos'],['PPLT','Platino · abrdn Platinum','Metales preciosos'],
    ['USO','Petróleo WTI · US Oil Fund','Energía'],['BNO','Petróleo Brent · US Brent Oil','Energía'],
    ['UNG','Gas natural · US Natural Gas','Energía'],['CPER','Cobre · US Copper Index','Metales industriales'],
    ['DBA','Agro · Invesco DB Agriculture','Agrícolas'],['CORN','Maíz · Teucrium Corn','Agrícolas'],
    ['WEAT','Trigo · Teucrium Wheat','Agrícolas'],['SOYB','Soja · Teucrium Soybean','Agrícolas'],
    ['DBC','Canasta amplia · Invesco DB Commodity','Diversificado'],['GSG','Canasta S&P GSCI · iShares','Diversificado'],
    ['URA','Uranio · Global X Uranium','Metales industriales']
  ];

  window.FINTERM_CONSTITUENTS = { spx: spx, merval: merval, brasil: brasil, etf: etf, commodities: commodities };

  // Descripción breve de cada ETF (curada, se muestra solo en el Detalle de ETFs).
  window.FINTERM_ETF_DESC = {
    SPY:'Replica el índice S&P 500, las 500 mayores empresas de EE.UU. Es el ETF más negociado del mundo y el termómetro del mercado estadounidense.',
    VOO:'Sigue al S&P 500 con una comisión muy baja. Alternativa de Vanguard al SPY, popular para inversión de largo plazo.',
    IVV:'Versión de iShares (BlackRock) del S&P 500. Mismo índice que SPY/VOO, con costos bajos.',
    QQQ:'Replica el Nasdaq 100: las 100 mayores empresas no financieras del Nasdaq, con fuerte peso tecnológico (Apple, Microsoft, NVIDIA).',
    DIA:'Sigue al Dow Jones Industrial Average, 30 grandes compañías industriales y de consumo de EE.UU.',
    IWM:'Replica el Russell 2000, índice de empresas de pequeña capitalización (small caps) estadounidenses.',
    XLK:'Sector tecnológico del S&P 500: software, hardware y semiconductores.',
    XLF:'Sector financiero del S&P 500: bancos, aseguradoras y servicios financieros.',
    XLE:'Sector energético del S&P 500: petroleras y gasíferas como Exxon y Chevron.',
    XLV:'Sector salud del S&P 500: farmacéuticas, biotecnología y equipamiento médico.',
    XLY:'Sector consumo discrecional: autos, retail, ocio y bienes no esenciales.',
    XLI:'Sector industrial: aeroespacial, defensa, maquinaria y transporte.',
    XLP:'Sector consumo básico: alimentos, bebidas y productos de uso diario (defensivo).',
    SMH:'Concentra las principales empresas de semiconductores del mundo (NVIDIA, TSMC, ASML).',
    TLT:'Bonos del Tesoro de EE.UU. a más de 20 años. Muy sensible a las tasas de interés.',
    AGG:'Cartera amplia de bonos de EE.UU. (Tesoro, corporativos, hipotecarios). Renta fija diversificada.',
    HYG:'Bonos corporativos de alto rendimiento ("high yield"), mayor riesgo y mayor cupón.',
    GLD:'Respaldo en oro físico. Sigue el precio del oro; refugio ante inflación e incertidumbre.',
    SLV:'Respaldo en plata física. Sigue el precio de la plata, más volátil que el oro.',
    USO:'Sigue el precio del petróleo crudo WTI mediante contratos de futuros.',
    ARKK:'Fondo de gestión activa de ARK Invest enfocado en innovación disruptiva (tecnología, genómica, IA). Alta volatilidad.',
    VGT:'ETF de Vanguard del sector tecnología de EE.UU., más amplio que XLK.',
    EEM:'Acciones de mercados emergentes (China, India, Brasil, etc.).',
    IEMG:'Versión "Core" de iShares para mercados emergentes: misma exposición que EEM pero con comisión más baja y mayor cantidad de empresas.',
    IEFA:'Versión "Core" de iShares para mercados desarrollados ex-EE.UU./Canadá (Europa, Japón, Australia), con comisión más baja que EFA.',
    EFA:'Acciones de mercados desarrollados fuera de EE.UU. y Canadá (Europa, Japón, Australia).',
    VTI:'Todo el mercado accionario de EE.UU.: grandes, medianas y pequeñas empresas en un solo fondo.',
    SCHD:'Empresas de EE.UU. con dividendos sólidos y sostenidos. Enfocado en renta por dividendos.',
    GLD:'Sigue el precio del oro físico. Refugio de valor clásico ante inflación e incertidumbre.',
    IAU:'Oro físico, alternativa de iShares al GLD con comisión más baja.',
    SLV:'Sigue el precio de la plata: metal precioso con fuerte demanda industrial (paneles solares, electrónica).',
    PPLT:'Sigue el precio del platino, usado en catalizadores automotores y joyería.',
    USO:'Petróleo crudo WTI (referencia de EE.UU.) vía contratos de futuros.',
    BNO:'Petróleo crudo Brent (referencia internacional/europea) vía futuros.',
    UNG:'Gas natural de EE.UU. (Henry Hub) vía futuros. Muy volátil y estacional.',
    CPER:'Sigue el precio del cobre, metal industrial ligado al ciclo económico global.',
    DBA:'Canasta de commodities agrícolas: maíz, trigo, soja, azúcar, café.',
    CORN:'Sigue el precio del maíz vía futuros.',
    WEAT:'Sigue el precio del trigo vía futuros.',
    SOYB:'Sigue el precio de la soja vía futuros.',
    DBC:'Canasta amplia y diversificada de commodities: energía, metales y agrícolas.',
    GSG:'Replica el índice S&P GSCI, canasta amplia con fuerte peso en energía.',
    URA:'Empresas mineras de uranio y del ciclo nuclear (no el metal directo).'
  };
})();
