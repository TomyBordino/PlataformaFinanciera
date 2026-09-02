// FINTERM — motor de flujos de fondos de una ON (funciones puras, sin estado).
// Se cargan como globales window.* y la clase del .dc.html delega en ellas.
(function(){
  // Flujo futuro por US$100 desde hoy: cupón por frecuencia + amortización
  // (lineal en N cuotas desde amortStart, o bullet 100% al vencimiento).
  function onFlows(f, from){
    if(!f || f.tipo!=='Obligación Negociable' || !f.venc) return null;
    var today=from||new Date();
    var vy=parseInt(String(f.venc).slice(0,4),10); if(!(vy>1900)) return null;
    var step={mensual:1,trimestral:3,semestral:6,anual:12}[f.freq||'semestral']||6;
    var vEnd=new Date(vy,5,30), cRate=(f.cupon||0)/100, nCuo=(f.amortN>0)?Math.round(f.amortN):1;
    var aStartY=f.amortStart?parseInt(String(f.amortStart).slice(0,4),10):vy, aStart=new Date(aStartY,5,30);
    var amDates=[]; if(nCuo<=1){ amDates.push(vEnd.getTime()); } else { var span=vEnd-aStart; for(var i=0;i<nCuo;i++) amDates.push(aStart.getTime()+span*i/(nCuo-1)); }
    var amEach=100/nCuo, flows=[], residual=100;
    var d=new Date(today.getFullYear(), today.getMonth(), 15); d.setMonth(d.getMonth()+step); var pays=[];
    while(d<=vEnd){ pays.push(new Date(d)); d.setMonth(d.getMonth()+step); }
    for(var pi=0;pi<pays.length;pi++){ var p=pays[pi], amort=0;
      amDates.forEach(function(t){ var ad=new Date(t); if(ad.getFullYear()===p.getFullYear() && Math.abs(ad.getMonth()-p.getMonth())<=1 && residual>0.001) amort+=amEach; });
      var cupon=residual*cRate*step/12, paid=cupon+amort;
      if(p>today && paid>0.001) flows.push({d:p, years:(p-today)/(365.25*864e5), cf:paid, cupon:cupon, amort:amort});
      residual-=amort; if(residual<0) residual=0; }
    return flows;
  }
  // TIR anual (bisección) que iguala el VP del flujo al precio dirty px (por 100 VN).
  function onTIR(f, px){ var fl=onFlows(f); if(!fl||!fl.length||!(px>0)) return null;
    var vp=function(y){ return fl.reduce(function(s,x){ return s+x.cf/Math.pow(1+y,x.years); },0)-px; };
    var lo=-0.9,hi=5,flo=vp(lo),fhi=vp(hi); if(flo*fhi>0) return null;
    for(var i=0;i<100;i++){ var m=(lo+hi)/2,fm=vp(m); if(Math.abs(fm)<1e-7) return m; if(flo*fm<0) hi=m; else {lo=m;flo=fm;} } return (lo+hi)/2;
  }
  // Duration modificada (años).
  function onDuration(f, px, tir){ var fl=onFlows(f); if(!fl||tir==null) return null;
    var pv=0,w=0; for(var i=0;i<fl.length;i++){ var x=fl[i], dv=x.cf/Math.pow(1+tir,x.years); pv+=dv; w+=x.years*dv; } return pv>0?(w/pv)/(1+tir):null;
  }
  window.ON_MATH={ onFlows:onFlows, onTIR:onTIR, onDuration:onDuration };
})();
