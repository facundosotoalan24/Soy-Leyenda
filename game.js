/* ===== LÓGICA DEL JUEGO ===== */

const $=s=>document.querySelector(s);
let rnd=Math.random,rndState=0;
const R=(a,b)=>a+rnd()*(b-a);
const I=a=>a[Math.floor(rnd()*a.length)];
const C=(v,a,b)=>Math.max(a,Math.min(b,v));
const oc=o=>o>=80?"#a855f7":o>=72?"#3b82f6":o>=64?"#16a34a":o>=56?"#d97706":"#ef4444";
const M=n=>{
  if(n=="Liga europea"||n=="Liga Profesional")return S.lg||n;
  if(n=="Copa nacional"||n=="Copa Argentina")return S.cp||n;
  if(n=="Torneo de Ascenso")return S.nt.d2||n;
  const L=leagueOf(S.lgId),conf=L?L.conf:"UEFA";
  if(conf==="UEFA"){
    if(n=="Copa Sudamericana")return "Conference League";
    if(n=="Copa Libertadores")return "Europa League";
  }
  if(conf==="CONMEBOL"){
    if(n=="Champions League")return "Copa Libertadores";
    if(n=="Europa League"||n=="Conference League")return "Copa Sudamericana";
  }
  return n;
};
const NAT_LEAGUE={Argentina:"ARG",Brasil:"BRA",Uruguay:"ARG","España":"ESP",Francia:"FRA",Inglaterra:"ENG",Alemania:"GER",Italia:"ITA",Portugal:"POR","Países Bajos":"NED",Colombia:"ARG",Chile:"ARG",Perú:"ARG",Ecuador:"ARG",Paraguay:"ARG",México:"ESP","Estados Unidos":"ENG",Bélgica:"FRA",Croacia:"ITA","Arabia Saudita":"ARA"};
const leagueOf=id=>LEAGUES.find(L=>L.id===id);
const trIs=n=>!!S.tr&&S.tr[0]===n;

const clubSlug=s=>String(s||"").toLowerCase().normalize("NFD")
  .replace(/[\u0300-\u036f]/g,"").replace(/&/g,"and")
  .replace(/['’]/g,"").replace(/[^a-z0-9]+/g,"-")
  .replace(/^-|-$/g,"");
const crestSrc=(lgId,club)=>`assets/escudos/${String(lgId||"").toLowerCase()}-${clubSlug(club)}.png`;
const CREST_MISSING=new Set([
  "ARA|Al-Taraji","ARA|Al-Qaisumah"
]);
const CREST_OPAQUE=new Set([
  "ARA|Al-Adalah","ARA|Al-Zulfi","ARA|Al-Jubail","ARA|Al-Safa"
]);
const hasCrest=(lgId,club)=>!!lgId&&!!club&&!CREST_MISSING.has(lgId+"|"+club);
const TROPHY_KEY={
  "Premier League":"premier-league","Championship":"championship",
  "LaLiga":"laliga","LaLiga Hypermotion":"laliga-2",
  "Serie A":"serie-a","Serie B":"serie-b",
  "Bundesliga":"bundesliga","2. Bundesliga":"2-bundesliga",
  "Ligue 1":"ligue-1","Ligue 2":"ligue-2",
  "Primeira Liga":"primeira-liga","Liga Portugal 2":"liga-portugal-2",
  "Eredivisie":"eredivisie","Eerste Divisie":"eerste-divisie",
  "Série A":"brasileirao","Série B":"brasileirao-b",
  "Liga Profesional":"liga-profesional","Primera Nacional":"primera-nacional",
  "Süper Lig":"super-lig","TFF 1. Lig":"tff-1-lig",
  "Saudi Pro League":"saudi-pro-league","Saudi First Division":"saudi-first-division",
  "FA Cup":"fa-cup","Copa del Rey":"copa-del-rey","Coppa Italia":"coppa-italia",
  "DFB-Pokal":"dfb-pokal","Coupe de France":"coupe-de-france",
  "Taça de Portugal":"taca-de-portugal","KNVB Beker":"knvb-beker",
  "Copa do Brasil":"copa-do-brasil","Copa Argentina":"copa-argentina",
  "Türkiye Kupası":"turkiye-kupasi","King Cup":"king-cup",
  "Champions League":"champions-league","Europa League":"europa-league",
  "Conference League":"conference-league","Copa Libertadores":"libertadores",
  "Copa Sudamericana":"sudamericana","AFC Champions League":"afc-champions-league",
  "Mundial":"mundial","Copa América":"copa-america","Eurocopa":"eurocopa",
  "Copa Asiática":"copa-asiatica","Copa Oro":"copa-oro",
  "Goleador":"premio","Guante de Oro":"premio",
  "Mejor jugador del torneo":"premio","Balón de Oro":"premio"
};
const trophySrc=n=>TROPHY_KEY[n]?`assets/trofeos/${TROPHY_KEY[n]}.png`:null;
const imgCache=new Map();
function loadImg(src){
  if(!src)return Promise.resolve(null);
  if(imgCache.has(src))return Promise.resolve(imgCache.get(src));
  return new Promise(res=>{
    const im=new Image();
    im.onload=()=>{imgCache.set(src,im);res(im)};
    im.onerror=()=>{imgCache.set(src,null);res(null)};
    im.src=src;
  });
}
function setCrest(el,lgId,club){
  el.textContent=club?club.split(/[ .-]/).filter(Boolean).slice(0,2).map(w=>w[0]).join("").toUpperCase():"?";
  el.style.backgroundImage="";
  el.classList.remove("crest","op");
  const src=club&&hasCrest(lgId,club)?crestSrc(lgId,club):null;
  el.dataset.crest=src||"";
  if(!src)return;
  loadImg(src).then(im=>{
    if(!im||el.dataset.crest!==src)return;
    el.textContent="";
    el.style.backgroundImage=`url("${src}")`;
    el.classList.add("crest");
    el.classList.toggle("op",CREST_OPAQUE.has(lgId+"|"+club));
  });
}

let S,SD;
let prevOvr=null,lastVal=0,AC=null,muted=false,cardToken=0;
const THEMES=["","light","dark"];let thi=0;

function beep(f,d,t){
  if(muted)return;
  try{
    AC=AC||new (window.AudioContext||window.webkitAudioContext)();
    const o=AC.createOscillator(),g=AC.createGain();
    o.type=t||"sine";o.frequency.value=f;g.gain.value=.05;
    o.connect(g);g.connect(AC.destination);o.start();
    g.gain.exponentialRampToValueAtTime(.0001,AC.currentTime+d);
    o.stop(AC.currentTime+d);
  }catch(e){}
}
function sfx(k){
  if(k==="up")beep(660,.08);
  else if(k==="down")beep(220,.12,"triangle");
  else if(k==="title"){beep(523,.12);setTimeout(()=>beep(659,.12),90);setTimeout(()=>beep(784,.18),180)}
}
function setOvr(v){
  const el=$("#ho");
  el.textContent=v;
  if(prevOvr!=null&&v!==prevOvr){
    el.classList.remove("up","down");void el.offsetWidth;
    el.classList.add(v>prevOvr?"up":"down");
    sfx(v>prevOvr?"up":"down");
  }
  prevOvr=v;
}
function showVal(m){
  const el=$("#hv");
  if(Math.abs(m-lastVal)<0.0001){el.textContent="Valor "+fm(m);return}
  const from=lastVal;lastVal=m;
  const t0=performance.now();
  const step=now=>{
    const k=Math.min(1,(now-t0)/300);
    el.textContent="Valor "+fm(from+(m-from)*k);
    if(k<1)requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
function mile(ic,txt){
  if(!S||S.mile.includes(txt))return;
  S.mile.push(txt);
  const m=document.createElement("span");
  m.className="mi";
  m.textContent=ic+" "+txt;
  $("#ms").appendChild(m);
}
function relBar(vid,bid,v){
  $(vid).textContent=Math.round(v);
  const b=$(bid);
  b.style.width=Math.max(2,Math.min(100,v))+"%";
  b.style.background=v>=70?"linear-gradient(90deg,#16a34a,#4ade80)":v>=40?"linear-gradient(90deg,#d97706,#facc15)":"linear-gradient(90deg,#dc2626,#f87171)";
}

function show(id){["st","pl","en","hf"].forEach(x=>$("#"+x).hidden=x!==id)}

function gkHead(){
  const gk=S.p[0]=="Arquero";
  $("#hg").textContent=gk?"🧤":"G";
  $("#ha").textContent=gk?"🤜🤛":"A";
  $("#hx").textContent="🥅";
  $("#hx").hidden=!gk;
  $("#hr").classList.toggle("gk",gk);
}
function saveRun(){
  if(!S||!S.club)return;
  try{localStorage.setItem("mc_run",JSON.stringify({S,SD,rndState}))}catch(e){}
}
function checkRun(){
  let r=null;
  try{r=JSON.parse(localStorage.getItem("mc_run")||"null")}catch(e){}
  const b=$("#runBtn");
  if(r&&r.S&&r.S.club){b.hidden=false;b.textContent="▶️ Continuar: "+r.S.n+" ("+r.S.age+" años, "+(r.S.free?"agente libre":r.S.club)+")"}
  else b.hidden=true;
}
function continueRun(){
  let r=null;
  try{r=JSON.parse(localStorage.getItem("mc_run")||"null")}catch(e){}
  if(!r||!r.S||!r.S.club)return;
  S=r.S;SD=r.SD||"";restoreRnd(r.rndState||0);
  S.rel=S.rel||{dt:50,hin:50,pre:50,dir:50};
  S.rel.dir=S.rel.dir??50;
  S.mile=S.mile||[];
  S.ag=S.ag||0;S.agOff=S.agOff||0;S.agB=S.agB||0;S.injured=null;S.home=S.home||null;S.ra=S.ra||0;
  S.money=S.money||0;S.free=!!S.free;S.chDone=!!S.chDone;S.pre=S.pre||null;S.preAge=S.preAge||0;
  S.gf=S.gf||1;S.af=S.af||1;S.rs=S.rs||0;
  // Las partidas viejas guardaron POS como array; actualizar a las tasas nuevas.
  const posName=Array.isArray(S.p)?S.p[0]:S.p;
  S.p=POS.find(p=>p[0]===posName)||POS[8];
  if(!S.lgId){
    S.lgId=NAT_LEAGUE[S.nt&&S.nt.n]||"ARG";
    S.div=S.tier>=3?1:2;
    const L=leagueOf(S.lgId)||LEAGUES[0];
    S.lg=S.div===1?L.d1:L.d2;S.cp=L.cup;
  }
  if(!S.ctr&&S.club)S.ctr=contractTerms({k:S.k,div:S.div},"base");
  S.slot=S.slot||null;S.pos=S.pos||0;
  S.spd=+$("#sp").value;
  prevOvr=S.ovr;lastVal=val();
  $("#rw").innerHTML="";$("#dc").innerHTML="";$("#ms").innerHTML="";
  show("pl");head();gkHead();step();
}

function valueOf(ovr,age,pot,pos,tier){
  const base=3.4e-7*Math.pow(Math.max(0,ovr-40),5); // millones de €
  const ageF=age<=18?1.6:age<=21?1.45:age<=24?1.25:age<=27?1.1:age<=29?.95:age<=31?.75:age<=33?.5:age<=35?.3:.15;
  const potF=1+Math.max(0,(pot||ovr)-ovr)*.008;
  const posF=pos==="Arquero"?.85:["Central","Lateral izquierdo","Lateral derecho"].includes(pos)?.9:["Pivote","Mediocampista","Enganche"].includes(pos)?.97:1.05;
  const lgF=[.5,.72,1,1.1,1.22][tier]||1;
  return Math.max(.05,Math.min(250,base*ageF*potF*posF*lgF));
}
function val(){return valueOf(S.ovr,S.age,S.pot,S.p&&S.p[0],S.tier)}
function wageOf(ovr,age,pot,pos,tier,k){
  const v=valueOf(ovr,age,pot,pos,tier);
  const annual=Math.max(v*.12,[.08,.15,.4,1.5,4][tier]||.4);
  return Math.max(1,Math.round(annual*1000/52*(.85+(k||.5)*.3)));
}
function fm(m){
  if(m>=1000)return "€"+(m/1000).toFixed(m>=10000?0:1).replace(".",",")+"MM";
  if(m>=1){const v=m>=20?Math.round(m):Math.round(m*10)/10;return "€"+String(v).replace(".",",")+"M"}
  return "€"+Math.max(10,Math.round(m*1000))+"K";
}
function newSeed(){
  const a=new Uint32Array(1);
  if(globalThis.crypto&&crypto.getRandomValues)crypto.getRandomValues(a);
  else a[0]=Math.floor(Math.random()*4294967296);
  return (a[0]>>>0).toString(36).padStart(6,"0").slice(-6).toUpperCase();
}

function restoreRnd(v){
  rndState=v|0;
  rnd=()=>{rndState=rndState+0x6D2B79F5|0;let t=Math.imul(rndState^rndState>>>15,1|rndState);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
}
function seedUp(){
  const v=$("#sd").value.trim()||newSeed();
  SD=v;
  let a=0;
  for(const ch of v)a=(a*31+ch.charCodeAt(0))|0;
  restoreRnd(a);
}

function trait(){
  const t=I(TR);S.tr=t;
  if(t[0]=="Crack precoz"){S.ovr+=4;S.pot-=5}
  else if(t[0]=="Late bloomer"){S.ovr-=3;S.pot+=6}
  else if(t[0]=="Propenso a lesiones")S.ij=.17;
  else if(t[0]=="Disciplinado"){S.ij=.05;S.gb=.5}
  else if(t[0]=="Goleador nato"){S.gf=1.25;S.af=.85}
  else if(t[0]=="Nómada"){S.agOff+=.06;S.rel.dir=C(S.rel.dir-8,0,100)}
  else if(t[0]=="Resiliente")S.rs=1;
}

function sv(x){
  S.tier=x.tier;S.club=x.club;S.k=x.k;S.tl=x.tl||[];S.lg=x.lg;S.cp=x.cp;
  S.slot=null;S.pos=0;
  if(x.lgId!==undefined)S.lgId=x.lgId;
  if(x.div!==undefined)S.div=x.div;
}

function contractTerms(x,kind){
  const t=tierOf(x.k,x.div);
  const v=valueOf(S.ovr,S.age,S.pot,S.p&&S.p[0],t);
  const baseW=wageOf(S.ovr,S.age,S.pot,S.p&&S.p[0],t,x.k);
  const w0=kind==="low"?Math.max(1,Math.round(baseW*.92)):kind==="short"?Math.max(1,Math.round(baseW*1.05)):baseW;
  const w=trIs("Nómada")?Math.round(w0*1.1):w0;
  return {w,y:kind==="short"?2:3,cl:Math.max(1,Math.round(v*(kind==="low"?1.1:kind==="short"?1.6:2)))};
}
function signContract(x,terms){
  S.ctr={w:terms.w,y:terms.y,cl:terms.cl,s:S.age};
  S.free=false;
}
function contractLine(){
  if(S.free)return "Libre";
  if(!S.ctr)return "Sin contrato";
  return "€"+S.ctr.w+"K/sem · "+S.ctr.y+(S.ctr.y===1?" año":" años")+" · cláusula €"+S.ctr.cl+"M";
}
function negotiate(x,done){
  const t=tierOf(x.k,x.div),ex=EX[t];
  const base=contractTerms(x,"base"),short=contractTerms(x,"short"),low=contractTerms(x,"low");
  const raise={w:Math.round(base.w*1.3),y:base.y,cl:base.cl};
  const chance=C(.5+((S.rel.dir??50)-50)/250+(S.ag===2?.08:S.ag===1?-.04:0)+(S.ovr-ex)/100,.15,.9);
  const fmt=o=>"€"+o.w+"K/sem · "+o.y+" años · cláusula €"+o.cl+"M";
  const renew=x.club===S.club;
  panel((renew?"Renovás con ":"Negociás tu contrato con ")+x.club+".",[
    {l:"Firmar la oferta",s:fmt(base),terms:base},
    {l:"Pedir más sueldo",s:fmt(raise)+" · riesgo",terms:raise,risk:1},
    {l:"Cláusula baja",s:fmt(low)+" · salida fácil",terms:low},
    {l:"Contrato corto",s:fmt(short)+" · más libertad",terms:short}
  ],o=>{
    if(o.risk&&rnd()>chance){
      S.rel.dir=C((S.rel.dir??50)-6,0,100);
      note(renew?"💼 La dirigencia rechazó tu pedido y sigue tu contrato actual.":"💼 La dirigencia se cansó de negociar y retiró la oferta.","💼");
      if(S.free)return offer();
      head();return step();
    }
    if(o.risk){S.rel.dir=C((S.rel.dir??50)+3,0,100);note("💼 Negociaste bien y te mejoraron el sueldo.","💼")}
    signContract(x,o.terms);
    note("📃 "+(renew?"Renovás":"Firmás")+" con "+x.club+": €"+o.terms.w+"K/sem por "+o.terms.y+" años.","📃");
    done();
  });
}

function go(i){
  seedUp();
  const chMode=$("#md").value==="1",chSel=chMode?+$("#ch").value||0:-1,agSel=+$("#ag").value||0;
  const nt=NT[+$("#nat").value||0],lgId=NAT_LEAGUE[nt.n]||"ARG",L0=leagueOf(lgId)||LEAGUES[0];
  S={p:POS[i],f:Math.max(1,parseInt($("#fq").value)||1),nt:nt,n:$("#nm").value.trim()||"Tu jugador",age:16,ovr:Math.round(R(44,54)),pot:Math.round(R(70,93)),tier:0,club:"",k:.4,tl:[],lgId:lgId,div:2,lg:L0.d2,cp:L0.cup,slot:null,pos:0,pj:0,g:0,a:0,t:0,caps:0,cg:0,ca:0,peak:0,pv:0,pal:[],since:0,asked:0,ra:0,cj:{},gk:{p:0,m:0,v:0},seen:[],gb:0,ij:.08,mt:+$("#mt").value,mod:0,spd:+$("#sp").value,mile:[],rel:{dt:50,hin:50,pre:50,dir:50},ag:agSel,agOff:AGENTS[agSel].off,agB:AGENTS[agSel].bonus,injured:null,ch:chSel,ctr:null,money:0,free:false,chDone:false,pre:null,preAge:0};
  trait();
  S.rel.dt=C(S.rel.dt+AGENTS[agSel].rel,0,100);
  prevOvr=S.ovr;lastVal=val();
  $("#rw").innerHTML="";$("#dc").innerHTML="";$("#ms").innerHTML="";show("pl");head();
  gkHead();
  if(chSel>=0){
    const ch=CH[chSel];
    S.mt=ch.meta;S.lgId=ch.lgId||S.lgId;S.div=ch.div||1;S.slot=null;S.pos=0;
    const x={tier:ch.tier,club:ch.club,k:ch.k,lg:ch.lg,cp:ch.cp,lgId:S.lgId,div:S.div,tl:[]};
    S.fc=x;sv(x);signContract(x,contractTerms(x,"base"));head();
    note("🤝 Representante: "+AGENTS[agSel].n+". "+AGENTS[agSel].d,"🤝");
    note("🎯 Desafío: "+ch.n+". "+ch.d,"🎯");
    panel("Desafío: "+ch.n,[{l:"Aceptar el desafío",s:ch.d}],()=>{head();step()});
    return;
  }
  const local=ALL_CLUBS.filter(c=>c.lgId===S.lgId),d2=local.filter(c=>c.div===2),d1=local.filter(c=>c.div===1);
  const pick=(pool,maxK)=>{const p=pool.filter(c=>c.k<=maxK);return I(p.length?p:pool)};
  const seen=new Set(),o=[];
  const add=c=>{if(!c||seen.has(c.n))return;seen.add(c.n);o.push({l:c.n,s:(c.div===2?L0.d2:L0.d1)+" · "+(c.div===2?"más minutos, ideal para crecer":"competencia exigente"),w:wageOf(S.ovr,S.age,S.pot,S.p&&S.p[0],c.tier,c.k),tier:c.tier,club:c.n,k:c.k,lgId:c.lgId,div:c.div,lg:c.lg,cp:c.cp,tl:[]})};
  add(pick(d2,.52));add(pick(d2,.58));add(pick(d2,.65));add(pick(d1,.62));
  let tries=0;
  while(o.length<4&&local.length&&tries++<50)add(I(local));
  panel("Te llegan 4 ofertas. Elegí tu primer club.",o,x=>{
    S.fc=x;sv(x);signContract(x,contractTerms(x,"base"));head();
    note("🧬 Tu rasgo: "+S.tr[0]+". "+S.tr[1]);
    note("⏱️ Decisiones: "+(S.f==1?"todas las temporadas":"cada 2 temporadas")+".");
    note("🤝 Representante: "+AGENTS[S.ag].n+". "+AGENTS[S.ag].d,"🤝");
    step();
  });
}

function head(){
  const n=S.free?"Sin club":(S.club||"Sin club"),h=[...n].reduce((a,c)=>(a*31+c.charCodeAt(0))%360,7);
  $("#hd").style.setProperty("--cc","hsl("+h+",65%,38%)");
  $("#hd").className="hd t"+S.tier;
  setCrest($("#bg"),S.free?null:S.lgId,S.free?null:S.club);
  $("#hc").textContent=n;
  $("#hi").textContent=S.p[0]+" · "+S.age+" años · "+S.n+(S.tr?" · "+S.tr[0]:"")+(S.pos?" · "+S.pos+"°":"");
  $("#cn").textContent=S.nt.n;
  $("#ct").textContent=S.free?"Agente libre":(S.lg||TN[S.tier]);
  setOvr(S.ovr);
  showVal(val());
  if(S.caps>0)mile("🌎","Selección");
  relBar("#rd","#rbd",S.rel.dt);
  relBar("#rh","#rhb",S.rel.hin);
  relBar("#rp2","#rpb",S.rel.pre);
  relBar("#rdir","#rdirb",S.rel.dir??50);
  $("#cwage").textContent=S.free?"Libre":S.ctr?("€"+S.ctr.w+"K/sem"):"—";
  $("#cyears").textContent=S.free?"Sin club":S.ctr?(S.ctr.y+(S.ctr.y===1?" año":" años")):"—";
  $("#cclause").textContent=S.free?"—":S.ctr?("€"+S.ctr.cl+"M"):"—";
  $("#ctrBox").classList.toggle("free",!!S.free);
  $("#ob").dataset.lvl=S.ovr>=85?"leyenda":S.ovr>=80?"elite":S.ovr>=72?"pro":S.ovr>=64?"bueno":"base";
  saveRun();
}

function retire(){return S.age>40||(S.age>=33&&S.ovr<45)}

function step(){
  if(retire())return fin();
  if(S.free&&S.asked!==S.age){S.asked=S.age;return offer()}
  if(S.age>=34&&S.ra!==S.age){S.ra=S.age;return askRetire()}
  const expiring=!!(S.ctr&&!S.free&&S.ctr.y<=1);
  if(expiring&&S.asked!==S.age){S.asked=S.age;return offer()}
  if(S.age>=18&&(S.age-18)%S.f===0&&S.asked!==S.age){
    S.asked=S.age;S.since++;
    if(S.ovr<EX[S.tier]-8||S.since>=3||rnd()<.45+S.agOff){S.since=0;return offer()}
    return event2();
  }
  if(S.preAge!==S.age)return preSeason();
  playSeason();
}

function preSeason(){
  const def=["Central","Lateral izquierdo","Lateral derecho"].includes(S.p[0]);
  const pool=PRE.filter(p=>!p.gk||S.p[0]==="Arquero").filter(p=>!p.noGk||S.p[0]!=="Arquero").filter(p=>!p.def||def);
  const opts=[];
  while(opts.length<4&&pool.length)opts.push(pool.splice(Math.floor(rnd()*pool.length),1)[0]);
  panel("Pretemporada en "+(S.club||"tu club")+" rumbo a la temporada "+(S.age+1)+". Elegí cómo prepararte.",opts.map(p=>({l:p.n,s:p.d,e:p.e})),x=>{
    S.pre={...x.e};S.preAge=S.age;
    note("🏋️ "+x.l+". "+x.s,"🏋️");
    head();
    playSeason();
  });
}

function playSeason(){
  season();
  if(S.home){note("↩️ Terminó el préstamo: volvés a "+S.home.club+".");sv(S.home);S.home=null}
  const after=()=>{S.age++;head();setTimeout(step,S.spd)};
  if(S.injured)return injuryPanel(after);
  after();
}

let scrollT;
function scrollEnd(el){
  clearTimeout(scrollT);
  scrollT=setTimeout(()=>{if(el&&el.isConnected)el.scrollIntoView({block:"end",behavior:"smooth"})},80);
}

function pop(){
  const cf=$("#cf");
  for(let i=0;i<14;i++){
    const e=document.createElement("span");
    e.className="cf";
    e.textContent=["🏆","✨","🎉"][Math.floor(rnd()*3)];
    e.style.left=rnd()*95+"vw";
    e.style.animationDelay=rnd()*.5+"s";
    e.addEventListener("animationend",()=>e.remove(),{once:true});
    cf.appendChild(e);
  }
}

function simLeague(g){
  const L=leagueOf(S.lgId);
  if(!L)return {pos:1,total:1};
  const base=(S.div===1?L.d1c:L.d2c).map(c=>({n:c[0],k:c[1]}));
  const me=base.find(c=>c.n===S.club);
  if(me)me.k=S.k;else base.push({n:S.club,k:S.k});
  const bonus=(S.ovr-70)*.12+(g||0)*.04+((S.rel?S.rel.hin:50)-50)*.02;
  const rows=base.map(c=>({n:c.n,s:c.k*100+rnd()*46+(c.n===S.club?bonus:0)}));
  rows.sort((a,b)=>b.s-a.s);
  return {pos:rows.findIndex(r=>r.n===S.club)+1,total:rows.length};
}
function continentalSlot(pos,conf){
  if(conf==="CONMEBOL")return pos<=4?"Copa Libertadores":pos<=6?"Copa Sudamericana":null;
  if(conf==="AFC")return pos<=2?"AFC Champions League":null;
  return pos<=4?"Champions League":pos<=6?"Europa League":pos<=7?"Conference League":null;
}

function season(){
  const a=S.age,gr=a<21?3.5:a<24?2.5:a<27?1.2:a<30?.2:a<33?-.8:-2.2,pre=S.pre||{};
  if(S.pj===0)mile("🌱","Debut");
  S.ovr=Math.round(C(S.ovr+gr+(pre.gr||0)+S.gb+R(-1.6,1.6),35,Math.min(94,S.pot+2)));
  S.peak=Math.max(S.peak,S.ovr);
  S.pv=Math.max(S.pv,val());
  if(S.rel.hin>75)S.mod=(S.mod||0)+.05;
  else if(S.rel.hin<25)S.mod=(S.mod||0)-.05;
  S.mod=(S.mod||0)+(pre.mod||0);
  const dtb=(S.rel.dt-50)/200;
  const ex=EX[S.tier],s=C(.55+(S.ovr-ex+6)/25+(S.mod||0)+dtb+(trIs("Líder")?.05:0),.15,1);
  S.mod=0;
  const inj=rnd()<C(S.ij+(pre.inj||0),.01,.5)?INJ[I(trIs("Resiliente")?[0,0,0,1,1,2]:[0,0,0,1,1,2,3])]:null;
  if(inj)S.ovr=Math.max(35,S.ovr+inj[2]*(trIs("Resiliente")?.5:1));
  if(inj&&inj[2]<=-1)S.injured=inj;
  if(S.ovr>=85)mile("⭐","OVR 85");
  let pj=Math.round(38*s*R(.85,1)*(inj?(trIs("Resiliente")?Math.min(1,inj[1]+.2):inj[1]):1)*(pre.pj||1));
  if(a<18)pj=Math.round(pj*.6);
  // El nivel también pesa: un enganche elite genera muchas más ocasiones que uno de plantel.
  const off=C(.75+(S.ovr-60)/45,.7,1.7);
  const g=Math.round(pj*S.p[1]*R(.6,1.5)*(pre.g||1)*(S.gf||1)*off),as=Math.round(pj*S.p[2]*R(.6,1.5)*(pre.a||1)*(S.af||1)*off);
  const gkm=S.p[0]=="Arquero",rel=S.ovr-Math.max(ex,45),gkF=pre.gk||1;
  let pen=0,mm=0,vc=0;
  if(gkm){
    const fc=Math.round(pj*R(.05,.12));
    for(let q=0;q<fc;q++)if(rnd()<C(.2+rel/200,.1,.4)*gkF)pen++;
    const du=Math.round(pj*R(.3,.6));
    mm=Math.round(du*C(.5+rel/100,.35,.8)*gkF);
    vc=Math.min(pj,Math.round(pj*C(.28+rel/150,.12,.55)*R(.8,1.2)*gkF));
    S.gk.p+=pen;S.gk.m+=mm;S.gk.v+=vc;
  }
  const tr=[],ic=[],aw=[];
  const L=leagueOf(S.lgId),conf=L?L.conf:"UEFA";
  if(S.slot){
    const conmebolSlot=S.slot==="Copa Sudamericana"||S.slot==="Copa Libertadores";
    const uefaSlot=S.slot==="Champions League"||S.slot==="Europa League"||S.slot==="Conference League";
    const afcSlot=S.slot==="AFC Champions League";
    if((conf==="UEFA"&&(conmebolSlot||afcSlot))||(conf==="CONMEBOL"&&(uefaSlot||afcSlot))||(conf==="AFC"&&(uefaSlot||conmebolSlot)))S.slot=null;
  }
  const lgName=L?(S.div===1?L.d1:L.d2):(S.lg||"Liga");
  const cupName=L?L.cup:(S.cp||"Copa");
  const table=simLeague(g);
  const wasD1=S.div===1;
  S.pos=table.pos;
  if(table.pos===1)tr.push(lgName);
  if(rnd()<C(.04+.14*S.k+(S.ovr-75)*.003,.02,.22))tr.push(cupName);
  if(S.slot&&rnd()<C(.02+.12*S.k+(S.ovr-78)*.003,.01,.18))tr.push(S.slot);
  let c=0,wcn="";
  const ps=C((S.ovr-68)/18,0,.9)+(S.caps?.12:0);
  if(a>=19&&rnd()<ps){
    c=Math.round(R(3,10));S.caps+=c;
    S.cg+=Math.round(c*S.p[1]*R(.6,1.4)*off);
    S.ca+=Math.round(c*S.p[2]*R(.6,1.4)*off);
    if(a%4==2){
      const st=["la fase de grupos","los octavos","los cuartos","la semifinal","la final"],pw=C(.52+(S.ovr-70)/50+S.nt.b,.4,.85);
      let k=0;while(k<5&&rnd()<pw)k++;
      const m=3+Math.min(k,4),wg=Math.round(m*S.p[1]*R(.6,1.5)*off),wa=Math.round(m*S.p[2]*R(.6,1.5)*off);
      S.caps+=m;S.cg+=wg;S.ca+=wa;
      wcn=k==5?"🌎 Mundial: ¡campeones del mundo! "+wg+" goles y "+wa+" asistencias en "+m+" partidos.":"🌎 Mundial: eliminados en "+st[k]+" ("+m+" partidos, "+wg+" G, "+wa+" A).";
      if(k==5){ic.push("Mundial");mile("🌍","Mundial")}
    }
    if(a%4==0&&rnd()<.03+Math.max(0,S.ovr-75)*.01)ic.push(S.nt.ct);
  }
  if(pj>=25){
    if(S.p[1]>=.15&&g>=18)aw.push("Goleador");
    if(S.p[0]=="Arquero"&&S.ovr>=ex+5&&rnd()<.15)aw.push("Guante de Oro");
    if(S.ovr>=ex+7&&rnd()<.15+(S.rel.pre-50)/500)aw.push("Mejor jugador del torneo");
    if(S.ovr>=89&&S.tier>=3&&rnd()<.3)aw.push("Balón de Oro");
  }
  tr.forEach(n=>S.pal.push([n,"🏆",S.tier,a,S.club]));
  ic.forEach(n=>S.pal.push([n,"🌎",S.tier,a,S.club]));
  aw.forEach(n=>S.pal.push([n,"⭐",S.tier,a,S.club]));
  if(S.t===0&&(tr.length||ic.length))mile("🏆","Primer título");
  S.pj+=pj;S.g+=g;S.a+=as;S.cj[S.club]=(S.cj[S.club]||0)+pj;S.t+=tr.length+ic.length;
  const perf=(tr.length+ic.length)*3+(g>=15?2:0)+(S.ovr>=ex+5?2:0)-(S.ovr<ex-5?2:0)-(inj?1:0);
  S.rel.dt=C(S.rel.dt+(perf>0?1:perf<0?-1:0)+(trIs("Líder")?.5:0)+(pre.dt||0),0,100);
  S.rel.hin=C(S.rel.hin+(tr.length?2:0)+(g>=20?1:0)-(S.ovr<ex-5?1:0)+(pre.hin||0),0,100);
  S.rel.pre=C(S.rel.pre+(aw.length?1:0)+(ic.length?1:0)+(inj?-1:0)+(pre.press||0),0,100);
  S.rel.dir=C((S.rel.dir??50)+(perf>0?1:perf<0?-1:0)+(S.pos<=3?1:0)-(S.pos>table.total-2?1:0),0,100);
  if(wasD1&&S.div===1&&S.pos>table.total-2){S.div=2;S.lg=L?L.d2:S.lg;S.cp=L?L.cup:S.cp;mile("⬇️","Descenso")}
  else if(!wasD1&&S.div===2&&S.pos<=2){S.div=1;S.lg=L?L.d1:S.lg;S.cp=L?L.cup:S.cp;mile("⬆️","Ascenso")}
  const chId=S.ch>=0&&CH[S.ch]?CH[S.ch].id:null;
  if(chId==="salvar"&&a===16&&S.div===1)S.chDone=true;
  if(chId==="ascenso"&&S.club==="Deportivo Madryn"&&S.div===1)S.chDone=true;
  S.tier=tierOf(S.k,S.div);
  if(S.ctr&&!S.free){
    S.money=(S.money||0)+S.ctr.w*52/1000;
    S.ctr.y--;
    if(S.ctr.y<=0){S.free=true;note("📃 Tu contrato con "+S.club+" venció. Quedás libre.","📃")}
  }
  S.slot=wasD1&&S.div===1?continentalSlot(S.pos,conf):null;
  S.pre=null;
  if(S.pj>=500)mile("👟","500 PJ");
  const x=["📊 "+table.pos+"°"];
  if(tr.length)x.push("🏆 "+tr.join(", "));
  if(ic.length)x.push("🌎 "+ic.join(", "));
  if(aw.length)x.push("⭐ "+aw.join(", "));
  if(c)x.push("Selección: "+c+" PJ");
  if(wcn)x.push(wcn);
  if(inj)x.push("🩹 "+inj[0]+" ("+inj[3]+")");
  const r=document.createElement("div");
  r.className="r"+(tr.length+ic.length?" t":"")+(gkm?" gk":"");
  const cr=S.club&&hasCrest(S.lgId,S.club)?`<img class="row-crest${CREST_OPAQUE.has(S.lgId+"|"+S.club)?" op":""}" src="${crestSrc(S.lgId,S.club)}" alt="" onerror="this.remove()">`:"";
  r.innerHTML=`<span class="a">${a}</span><span>${cr}${S.club}${inj?" 🩹":""}${x.length?"<small>"+x.join(" · ")+"</small>":""}</span><span class="o" style="background:${oc(S.ovr)}">${S.ovr}</span><span>${pj}</span>${gkm?`<span>${pen}</span><span>${mm}</span><span>${vc}</span>`:`<span>${g}</span><span>${as}</span>`}`;
  $("#rw").appendChild(r);
  note("📊 "+lgName+": "+table.pos+"° de "+table.total+(table.pos===1?" · ¡Campeón!":""),"📊");
  if(tr.length+ic.length){pop();sfx("title")}
  if(tr.length||ic.length)note([...tr,...ic].join(", "),"🏆");
  if(inj)note(inj[0]+" ("+inj[3]+")","🩹");
  scrollEnd(r);
}

function note(t,ic){
  let text=t,icon=ic;
  if(!icon){
    const m=t.match(/^([\p{Extended_Pictographic}\uFE0F\u200D]+)\s*/u);
    if(m){icon=m[1];text=t.slice(m[0].length)}
  }
  const n=document.createElement("div");n.className="nt";
  const i=document.createElement("span");i.className="nt-ic";i.textContent=icon||"📰";
  const b=document.createElement("div");b.className="nt-bd";
  const h=document.createElement("b");h.textContent="FutApp";
  const s=document.createElement("span");s.textContent=text;
  b.append(h,s);n.append(i,b);
  $("#rw").appendChild(n);scrollEnd(n);
}

/* La categoria visible depende de la division del club, no de su confederacion.
   Asi Velez nunca aparece como "Europa" y Chacarita no aparece como "Primera". */
function clubLabel(x){
  if(!x)return "";
  if(x.div===2)return x.k>=.7?"Grande en segunda":(x.k>=.46?TN[1]:TN[0]);
  return TN[x.tier]!==undefined?TN[x.tier]:"";
}

function panel(txt,opts,fn){
  const d=$("#dc");
  const market=opts.some(x=>x.club&&x.tier!==undefined&&!x.r);
  d.innerHTML='<div class="dec'+(market?" market":"")+'">'+
    (market?'<span class="dec-eyebrow">MERCADO DE PASES</span>':"")+
    '<h3>Tenés '+S.age+' años</h3><p class="s">'+txt+'</p></div>';
  opts.forEach(x=>{
    const b=document.createElement("button");
    b.type="button";
    const card=market&&(x.club||x.r);
    if(card)b.className="off-card"+(x.r?" retire":"");
    const tx=document.createElement("span");
    tx.className="off-txt";
    if(card&&x.club){
      const head=document.createElement("span");head.className="off-head";
      const nm=document.createElement("b");nm.textContent=x.club;head.appendChild(nm);
      const label=clubLabel(x);
      if(label){const tp=document.createElement("span");tp.className="tier-pill t"+x.tier;tp.textContent=label;head.appendChild(tp)}
      const raw=x.s||"",wm=raw.match(/€[\d.,]+K\/sem/);
      const s=document.createElement("small");s.className="off-desc";
      s.textContent=wm?raw.replace(wm[0],"").replace(/\s*·\s*$/,""):raw;
      const wage=document.createElement("span");wage.className="off-wage";
      wage.textContent=wm?wm[0]:(x.w?"€"+x.w+"K/sem":x.loan?"Préstamo":"");
      const cta=document.createElement("span");cta.className="off-cta";
      cta.textContent=(x.l===x.club?"Elegir club":x.l||"Elegir")+" →";
      tx.append(head,s,wage,cta);
    }else{
      tx.innerHTML=x.l+(x.s?"<small>"+x.s+"</small>":"");
    }
    b.appendChild(tx);
    if(x.club&&hasCrest(x.lgId,x.club)){
      const im=document.createElement("img");
      im.className="off-crest"+(CREST_OPAQUE.has(x.lgId+"|"+x.club)?" op":"");
      im.alt="";
      im.src=crestSrc(x.lgId,x.club);
      im.onerror=()=>im.remove();
      b.prepend(im);
    }
    b.onclick=()=>{d.innerHTML="";fn(x)};
    d.firstChild.appendChild(b);
  });
  scrollEnd(d);
}

function offer(){
  const T=S.tier,ex=EX[T],L=leagueOf(S.lgId),curConf=L?L.conf:"UEFA";
  const tierOfClub=c=>tierOf(c.k,c.div);
  const canJoin=c=>{
    const t=tierOfClub(c);
    if(t<=T)return true;
    if(S.age>AM[t])return false;
    if(S.ovr>=79)return true;
    if(t===T+1)return S.ovr>=EX[t]-4-S.agB;
    return false;
  };
  const canMove=c=>{
    const L2=leagueOf(c.lgId);
    if(!L2)return false;
    if(curConf==="CONMEBOL"&&L2.conf==="UEFA"&&(S.ovr<70||(S.tier<2&&S.ovr<79)))return false;
    if(curConf==="UEFA"&&L2.conf==="CONMEBOL"){
      if(L2.n!==S.nt.n&&S.age<33)return false;
      if(S.age<29&&S.ovr>=ex-2)return false;
    }
    if(curConf==="AFC"&&L2.conf!=="AFC"&&S.ovr<75)return false;
    if(curConf==="CONMEBOL"&&L2.conf==="AFC"&&S.age<27&&S.ovr<78)return false;
    if(curConf==="UEFA"&&L2.conf==="AFC"&&S.age<29&&S.ovr<78)return false;
    return true;
  };
  const pick=a=>a.length?I(a):null;
  const reach=S.ovr>=79?.65:S.ovr>=ex+6?.32:.18;
  const desc=c=>{
    const L2=leagueOf(c.lgId);
    const same=c.lgId===S.lgId;
    const sameDiv=same&&c.div===S.div;
    const stronger=c.k>S.k+.04,weaker=c.k<S.k-.04;
    const parts=[];
    if(sameDiv)parts.push("misma categoría");
    else if(same)parts.push(c.div===1?"salto a Primera":"bajar a Segunda");
    else if(L2&&L2.n===S.nt.n)parts.push("volver a "+L2.n);
    else parts.push("salto a "+(L2?L2.n:"otra liga"));
    if(stronger)parts.push("club más exigente");
    else if(weaker)parts.push("más minutos");
    else parts.push("competencia pareja");
    const lgName=L2?(c.div===1?L2.d1:L2.d2):(c.lg||"Liga");
    const w=wageOf(S.ovr,S.age,S.pot,S.p&&S.p[0],tierOfClub(c),c.k);
    return lgName+" · "+parts.join(" · ")+" · €"+w+"K/sem";
  };
  const mk=(c,tierOverride)=>{
    const t=tierOverride??tierOfClub(c);
    return {l:"Fichar por "+c.n,s:desc(c),w:wageOf(S.ovr,S.age,S.pot,S.p&&S.p[0],t,c.k),tier:t,club:c.n,k:c.k,lgId:c.lgId,div:c.div,lg:c.lg,cp:c.cp,tl:[]};
  };
  const o=[];
  const expiring=!!(S.ctr&&!S.free&&S.ctr.y<=1);
  const canRenew=S.ovr>=ex-8&&(expiring||(S.free?(S.rel.dir??50)>=45:(S.rel.dt>=25||(S.rel.dir??50)>=60)));
  if(canRenew)o.push({l:(S.free?"Volver a ":"Renovar en ")+S.club,s:(S.free?"Agente libre · ":"")+S.lg+(S.free?"":" · "+contractLine()),w:S.ctr?S.ctr.w:wageOf(S.ovr,S.age,S.pot,S.p&&S.p[0],T,S.k),tier:T,club:S.club,k:S.k,lgId:S.lgId,div:S.div,lg:S.lg,cp:S.cp,tl:S.tl,renew:1});

  const sameCountry=ALL_CLUBS.filter(c=>c.lgId===S.lgId&&c.n!==S.club);
  const sameDiv=sameCountry.filter(c=>c.div===S.div);
  const otherDiv=sameCountry.filter(c=>c.div!==S.div);
  const has=n=>o.some(x=>x.club===n);
  const add=c=>{if(c&&!has(c.n)){o.push(mk(c));return true}return false};

  const bigPool=ALL_CLUBS.filter(c=>c.n!==S.club&&c.div===1&&c.k>=.78&&c.k>=S.k-.05&&c.k<=S.k+reach&&canJoin(c)&&canMove(c));
  if(S.ovr>=79&&bigPool.length&&rnd()<(S.ovr>=85?.9:.8))add(pick(bigPool));

  const elitePool=ALL_CLUBS.filter(c=>c.n!==S.club&&c.div===1&&c.k>=.88&&c.k>=S.k-.05&&c.k<=S.k+reach&&canJoin(c)&&canMove(c));
  if(S.ovr>=79&&elitePool.length&&rnd()<(S.ovr>=85?.75:S.ovr>=82?.55:.35))add(pick(elitePool));

  const stepUp=sameDiv.filter(c=>canJoin(c)&&c.k>S.k+.04&&c.k<=S.k+reach);
  if(!add(pick(stepUp))){
    const lateral=sameDiv.filter(c=>canJoin(c)&&Math.abs(c.k-S.k)<=.12);
    add(pick(lateral));
  }

  const c2=pick(otherDiv.filter(c=>canJoin(c)&&(c.div===1?S.ovr>=EX[tierOfClub(c)]-4-S.agB:S.ovr<ex+2)));
  add(c2);

  const foreignChance=(S.div===2?.10:.28)+(S.ag===2?.07:0)+(S.ovr>=ex+4?.07:0)+(S.ovr>=79?.18:0)+(S.ovr>=85?.10:0)+(trIs("Nómada")?.12:0);
  if(rnd()<foreignChance){
    const fc=ALL_CLUBS.filter(c=>{
      if(c.lgId===S.lgId||c.n===S.club||c.div!==1)return false;
      if(!canJoin(c)||!canMove(c))return false;
      if(c.k>S.k+reach)return false;
      if(c.k<S.k-.15&&S.age<30&&S.ovr>=ex)return false;
      return true;
    });
    add(pick(fc));
  }

  if(o.length<2){
    const c4=pick(sameCountry.filter(c=>canJoin(c)&&c.k>=S.k-.15&&!has(c.n)));
    add(c4);
  }
  if(!o.length){
    const c5=pick(ALL_CLUBS.filter(c=>c.n!==S.club&&canJoin(c)&&canMove(c)));
    add(c5);
  }

  if(S.age>=29&&S.ovr>=60&&S.lgId!=="ARA"){
    const sa=ALL_CLUBS.filter(c=>c.lgId==="ARA"&&c.div===1&&c.n!==S.club&&c.k<=.74);
    const ca=sa.length?I(sa):ALL_CLUBS.find(c=>c.lgId==="ARA"&&c.div===1);
    if(ca&&!has(ca.n)){const ct=tierOf(ca.k,ca.div);o.push({l:"Irte a "+ca.n,s:"Saudi Pro League · contrato millonario",w:wageOf(S.ovr,S.age,S.pot,S.p&&S.p[0],ct,ca.k),tier:ct,club:ca.n,k:ca.k,lgId:ca.lgId,div:ca.div,lg:ca.lg,cp:ca.cp,tl:[]})}
  }

  if(!S.free&&S.age<=23&&T>=2&&S.ovr<ex+2&&!S.home){
    const lc=pick(sameCountry.filter(c=>c.div===S.div&&c.k<S.k))||pick(sameCountry);
    if(lc&&!has(lc.n)){
      const L2=leagueOf(lc.lgId);
      o.push({...mk(lc,T-1),l:"Salir cedido a "+lc.n,s:(L2?(lc.div===1?L2.d1:L2.d2):lc.lg)+" · préstamo de 1 año",loan:1});
    }
  }

  if(S.age>=34)o.push({l:"Retirarte",s:"Colgás los botines",r:1});
  const cx=S.free?"Quedaste libre. Elegí tu próximo club.":expiring?"Te queda un año de contrato. Es el momento de renovar o escuchar ofertas.":S.ovr<ex-8?"El club no cuenta con vos y no te renueva.":S.age>=35?"Con tu edad, las ofertas grandes ya no llegan.":S.ovr>=ex+6?"Rendís muy bien y llegan ofertas.":S.ovr<ex-3?"Te cuesta tener minutos y el DT ya no cuenta con vos como antes.":"Terminás la temporada con altibajos. Hay que decidir el próximo paso.";
  panel(cx,o,x=>{
    if(x.r){note("🧤 Te retirás a los "+S.age+" años.");return fin()}
    if(x.loan){S.home={tier:S.tier,club:S.club,k:S.k,tl:S.tl,lg:S.lg,cp:S.cp,lgId:S.lgId,div:S.div};S.mod=.25;note("🔁 Salís cedido a "+x.club+" por una temporada.");mile("🔁","Préstamo");sv(x);head();step();return}
    if(x.club===S.club){
      negotiate(x,()=>{note("✍️ Renovás con "+S.club+".");head();step()});
      return;
    }
    negotiate(x,()=>{
      note("✈️ Firmás con "+x.club+".");mile("✈️","Fichaje");
      sv(x);head();step();
    });
  });
}

function injuryPanel(done){
  const inj=S.injured;S.injured=null;
  panel("🩹 "+inj[0]+" ("+inj[3]+"). ¿Cómo encarás la recuperación?",[
    {l:"Operarte y rehabilitar",s:"Más lento, pero seguro",f:()=>{S.ovr+=1;S.ij=Math.max(.04,S.ij-.02);S.mod=-.1;return"La operación salió bien."}},
    {l:"Rehabilitación conservadora",s:"Equilibrado",f:()=>{S.mod=-.2;return"Volvés con paciencia."}},
    {l:"Jugar infiltrado",s:"Riesgo alto",f:()=>rnd()<.5?(S.ovr-=2,S.ij+=.03,S.mod=-.3,"La lesión se complicó."):(S.mod=.1,S.ovr+=1,"Aguantaste y rendiste.")}
  ],x=>{note(x.f(),"🩹");done()});
}

function event2(){
  let p=EV.slice(0,6).concat(EV2.filter(e=>!e.c||e.c()));
  if(S.age>=25&&S.ovr>=EX[S.tier]+3)p.push(EV[7]);
  if(S.ovr>=68)p.push(SEL);
  let q=p.filter(e=>!S.seen.includes(e.t));
  if(!q.length){S.seen=[];q=p}
  const e=I(q);
  S.seen.push(e.t);
  panel(e.t,e.o,x=>{const m=x.f();S.ovr=C(S.ovr,35,94);note("📖 "+m);head();step()});
}

function extras(){
  const G=["","Ganar la Libertadores","Ganar la Champions League","Ganar un Mundial","Llegar a 85 de OVR","Retirarte en el club que te formó","Jugar 500 partidos"],
  h=n=>S.pal.some(x=>x[0]===n);
  const ch=S.ch>=0?CH[S.ch]:null;
  let ok=false,label="";
  if(ch){
    ok=ch.goal?!!ch.goal():false;
    label="Desafío: "+ch.n+(ok?" ✅ Cumplido":" ❌ No cumplido");
  }else if(S.mt){
    ok=[0,h("Copa Libertadores"),h("Champions League"),h("Mundial"),S.peak>=85,!!S.fc&&S.club===S.fc.club,S.pj>=500][S.mt];
    label="Meta: "+G[S.mt]+(ok?" ✅ Cumplida":" ❌ No cumplida");
  }
  $("#gl").textContent=label;
  const top=Object.entries(S.cj).sort((a,b)=>b[1]-a[1])[0],e=[];
  if(top&&top[1]>=250)e.push("Te recordarán en "+top[0]+": "+top[1]+" partidos con su camiseta.");
  if(S.fc&&S.club===S.fc.club)e.push("Terminaste en el club que te formó.");
  if(S.t>=8)e.push("Tu vitrina es de museo.");else if(!S.t)e.push("No hubo copas, pero hubo carrera.");
  if(!S.caps)e.push("La Selección nunca te llamó.");else if(h("Mundial"))e.push("Levantaste la copa del mundo.");
  $("#ep").textContent=e.join(" ")+" Código: "+SD;
  try{
    const H=JSON.parse(localStorage.getItem("mc")||"[]");
    H.push({n:S.n,l:S.lab,s:Math.round(S.sc),p:S.p[0],club:S.club,lg:S.lg,lgId:S.lgId,div:S.div,pos:S.pos,age:S.age,peak:S.peak,pj:S.pj,g:S.g,a:S.a,t:S.t,caps:S.caps,pv:Math.round(S.pv),mt:S.mt,seed:SD,gkp:S.gk.p,gkm:S.gk.m,gkv:S.gk.v,money:Math.round(S.money||0),d:Date.now()});
    localStorage.setItem("mc",JSON.stringify(H.slice(-30)));
  }catch(_){}
  hist();
}

function hist(){
  try{
    const H=JSON.parse(localStorage.getItem("mc")||"[]");
    if(H.length){const b=H.reduce((a,c)=>c.s>a.s?c:a);$("#hs").textContent="Tu mejor carrera: "+b.n+" · "+b.l+" ("+b.s+" pts) · "+H.length+" jugadas"}
  }catch(_){}
}

function askRetire(){
  panel(S.age>=40?"Es tu última temporada posible.":"El cuerpo ya no responde igual. ¿Seguís o colgás los botines?",[{l:"Seguir una temporada más"},{l:"Retirarme ahora",s:"Cerrás tu carrera",r:1}],x=>{
    if(x.r){note("🧤 Te retirás a los "+S.age+" años.");fin()}else step();
  });
}

function fin(){
  const tw=t=>.25+(t||0)*.35,
  tS=S.pal.filter(x=>x[1]=="🏆").reduce((a,x)=>a+tw(x[2]),0),
  aS=S.pal.filter(x=>x[1]=="⭐").reduce((a,x)=>a+tw(x[2]),0),
  nS=S.pal.filter(x=>x[1]=="🌎").reduce((a,x)=>a+(x[0]=="Mundial"?2:1.2),0),
  sc=S.peak+tS*2.5+S.caps/10+S.g/25+aS*3+nS*4,
  lab=sc<90?"Jugador de plantel":sc<110?"Pilar del equipo":sc<130?"Figura":sc<160?"Ídolo":"Leyenda";
  S.lab=lab;S.sc=sc;
  show("en");
  $("#fileNote").hidden=location.protocol!=="file:";
  try{localStorage.removeItem("mc_run")}catch(e){}
  sfx("title");
  $("#lb").textContent=lab;
  $("#sb").textContent=S.n+" · "+S.p[0]+" · retiro a los "+S.age+" años · pico "+S.peak;
  const b=(v,l)=>`<div><b>${v}</b><span>${l}</span></div>`;
  const money=b(S.money?fm(S.money):"€0","Patrimonio")+b(S.ctr?("€"+S.ctr.w+"K"):"—","Sueldo/sem");
  $("#sm").innerHTML=(S.p[0]=="Arquero"?b(S.pj,"PJ")+b(S.gk.p,"🧤 Penales atajados")+b(S.gk.m,"🤜🤛 Mano a mano ganados")+b(S.gk.v,"🥅 Vallas a 0")+b(S.t,"Títulos")+b(S.caps,"PJ Selección")+b(fm(S.pv),"Valor máx.")+b(S.peak,"OVR pico"):b(S.pj,"PJ")+b(S.g,"Goles")+b(S.a,"Asist.")+b(S.t,"Títulos")+b(S.caps,"PJ Selección")+b(S.cg,"Goles Sel.")+b(S.ca,"Asist. Sel.")+b(fm(S.pv),"Valor máx."))+money;
  trophyVitrine();
  if(S.t)pop();
  extras();
  drawCard();
}

function trophyVitrine(){
  const P={};
  S.pal.forEach(x=>{
    const k=x[0];P[k]=P[k]||{n:0,i:x[1],tier:x[2],ages:[],clubs:[]};
    P[k].n++;
    if(x[3]!=null)P[k].ages.push(x[3]);
    if(x[4])P[k].clubs.push(x[4]);
  });
  const order={"🏆":0,"🌎":1,"⭐":2};
  const list=Object.entries(P).sort((a,b)=>order[a[1].i]-order[b[1].i]||b[1].n-a[1].n);
  const box=$("#pm");box.innerHTML="";
  const head=document.createElement("div");head.className="pm-head";
  const h=document.createElement("h3");h.textContent="Vitrina de trofeos";
  const total=document.createElement("span");total.textContent=S.t+" en total";
  head.append(h,total);box.appendChild(head);
  const grid=document.createElement("div");grid.className="trophy-grid";
  if(!list.length){const p=document.createElement("p");p.className="s";p.textContent="Sin títulos todavía.";grid.appendChild(p)}
  list.forEach(([k,v])=>{
    const c=document.createElement("div");
    c.className="trophy "+(v.i==="🌎"?"world":v.i==="⭐"?"award":"league");
    c.tabIndex=0;c.setAttribute("role","button");
    const ages=[...new Set(v.ages)].join(", "),clubs=[...new Set(v.clubs)].slice(0,2).join(", ");
    c.dataset.info=k+" · "+v.n+" "+(v.n===1?"vez":"veces")+(ages?" · a los "+ages+" años":"")+(clubs?" · "+clubs:"")+(v.tier!==undefined?" · "+TN[v.tier]:"");
    c.title=c.dataset.info;
    const src=trophySrc(k);
    const addIcon=()=>{const ic=document.createElement("span");ic.className="trophy-ic";ic.textContent=v.i;c.prepend(ic)};
    if(src){const im=document.createElement("img");im.src=src;im.alt="";im.onerror=()=>{im.remove();addIcon()};c.appendChild(im)}
    else addIcon();
    const b=document.createElement("b");b.textContent=k;c.appendChild(b);
    const s=document.createElement("small");s.textContent="×"+v.n;c.appendChild(s);
    grid.appendChild(c);
  });
  box.appendChild(grid);
  const info=document.createElement("div");info.className="trophy-info";info.id="trophyInfo";
  info.textContent="Tocá un trofeo para ver cuándo lo ganaste.";
  box.appendChild(info);
}

async function drawCard(){
  const token=++cardToken;
  const cv=$("#crd");if(!cv)return;
  const ctx=cv.getContext("2d"),W=cv.width,H=cv.height;
  ctx.setTransform(1,0,0,1,0,0);
  ctx.globalAlpha=1;ctx.globalCompositeOperation="source-over";
  ctx.fillStyle="#0f172a";ctx.fillRect(0,0,W,H);
  const tiers=[["#78716c","#1c1917"],["#0ea5e9","#082f49"],["#6366f1","#1e1b4b"],["#a855f7","#2e1065"],["#f59e0b","#431407"]];
  const cols=tiers[S.tier]||tiers[0];
  const bg=ctx.createLinearGradient(0,0,W,H);bg.addColorStop(0,cols[0]);bg.addColorStop(1,cols[1]);
  ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
  const sh=ctx.createRadialGradient(W*.82,-H*.08,0,W*.82,-H*.08,W*.9);
  sh.addColorStop(0,"rgba(255,255,255,.35)");sh.addColorStop(1,"rgba(255,255,255,0)");
  ctx.fillStyle=sh;ctx.fillRect(0,0,W,H);

  ctx.fillStyle="rgba(255,255,255,.8)";ctx.font="700 30px system-ui,sans-serif";ctx.fillText("SOY LEYENDA",60,90);

  ctx.fillStyle="#fff";ctx.font="900 78px system-ui,sans-serif";
  ctx.fillText(S.n.length>15?S.n.slice(0,15)+"…":S.n,60,190);
  ctx.font="600 34px system-ui,sans-serif";ctx.fillStyle="rgba(255,255,255,.82)";
  ctx.fillText(S.p[0]+" · "+S.nt.n,60,238);

  ctx.textAlign="right";
  ctx.fillStyle="#fff";ctx.font="900 140px system-ui,sans-serif";ctx.fillText(String(S.peak),W-60,220);
  ctx.font="700 26px system-ui,sans-serif";ctx.fillStyle="rgba(255,255,255,.7)";ctx.fillText("OVR PICO",W-60,262);
  ctx.textAlign="left";

  ctx.fillStyle="#fff";ctx.font="900 54px system-ui,sans-serif";ctx.fillText(S.lab,60,350);

  const stats=[["Partidos",S.pj],["Goles",S.g],["Asistencias",S.a],["Títulos",S.t],["Selección",S.caps],["Valor máx.",fm(S.pv)],["Sueldo",S.ctr?("€"+S.ctr.w+"K"):"—"],["Patrimonio",S.money?fm(S.money):"€0"]];
  const gx=60,gy=410,gw=(W-120-60)/4,gh=118;
  const rr=(x,y,w,h,r)=>{ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();};
  stats.forEach((st,i)=>{
    const x=gx+(i%4)*(gw+20),y=gy+Math.floor(i/4)*(gh+16);
    ctx.fillStyle="rgba(255,255,255,.12)";rr(x,y,gw,gh,18);ctx.fill();
    ctx.fillStyle="rgba(255,255,255,.7)";ctx.font="600 22px system-ui,sans-serif";ctx.fillText(st[0],x+20,y+42);
    ctx.fillStyle="#fff";ctx.font="900 44px system-ui,sans-serif";ctx.fillText(String(st[1]),x+20,y+96);
  });

  const titles=Object.entries(S.pal.reduce((a,p)=>{a[p[0]]=(a[p[0]]||0)+1;return a},{}));
  const icon=Object.fromEntries(S.pal.map(x=>[x[0],x[1]]));
  // Con file:// el canvas se contamina al dibujar imágenes locales y toDataURL falla.
  const allowImgs=location.protocol!=="file:";
  const timgs=allowImgs?await Promise.all(titles.slice(0,4).map(([n])=>loadImg(trophySrc(n)))):[];
  if(token!==cardToken)return;

  ctx.fillStyle="rgba(255,255,255,.7)";ctx.font="700 28px system-ui,sans-serif";ctx.fillText("PALMARÉS",60,760);
  if(!titles.length){ctx.fillStyle="rgba(255,255,255,.8)";ctx.font="600 24px system-ui,sans-serif";ctx.fillText("Sin títulos",60,800)}
  else titles.slice(0,4).forEach(([n,c],i)=>{
    const im=timgs[i];
    let tx=60;
    if(im){
      ctx.save();
      ctx.beginPath();ctx.arc(74,800+i*40-8,19,0,Math.PI*2);
      ctx.fillStyle="#fff";ctx.fill();
      ctx.beginPath();ctx.arc(74,800+i*40-8,19,0,Math.PI*2);ctx.clip();
      ctx.drawImage(im,55,781+i*40,38,38);
      ctx.restore();
      tx=104;
    }
    ctx.fillStyle="rgba(255,255,255,.9)";ctx.font="600 24px system-ui,sans-serif";
    ctx.fillText((im?"":(icon[n]||"🏆")+" ")+n+(c>1?" ×"+c:""),tx,804+i*40);
  });

  let clubTxt="Club final: "+(S.club||"—")+(S.lg?" · "+S.lg:"")+(S.pos?" · "+S.pos+"°":"");
  if(clubTxt.length>56)clubTxt=clubTxt.slice(0,55)+"…";
  ctx.fillStyle="rgba(255,255,255,.75)";ctx.font="600 24px system-ui,sans-serif";
  ctx.fillText(clubTxt,60,1000);
  ctx.fillText("Semilla: "+SD,60,1040);

  const crest=allowImgs&&hasCrest(S.lgId,S.club)?await loadImg(crestSrc(S.lgId,S.club)):null;
  if(token!==cardToken)return;
  if(crest){
    ctx.save();
    ctx.beginPath();ctx.arc(W-125,H-125,58,0,Math.PI*2);
    ctx.fillStyle="rgba(255,255,255,.92)";ctx.fill();
    ctx.beginPath();ctx.arc(W-125,H-125,58,0,Math.PI*2);ctx.clip();
    ctx.drawImage(crest,W-175,H-175,100,100);
    ctx.restore();
  }else if(S.club){
    const ini=S.club.split(/[ .-]/).filter(Boolean).slice(0,2).map(w=>w[0]).join("").toUpperCase();
    ctx.save();
    ctx.beginPath();ctx.arc(W-125,H-125,58,0,Math.PI*2);
    ctx.fillStyle="rgba(255,255,255,.92)";ctx.fill();
    ctx.fillStyle="#0f172a";ctx.font="900 40px system-ui,sans-serif";
    ctx.textAlign="center";ctx.textBaseline="middle";
    ctx.fillText(ini,W-125,H-123);
    ctx.textAlign="left";ctx.textBaseline="alphabetic";
    ctx.restore();
  }
}

function renderHf(){
  let H=[];
  try{H=JSON.parse(localStorage.getItem("mc")||"[]")}catch(e){}
  const f=$("#hfFilter").value;
  H=H.slice().sort((a,b)=>(b[f]||0)-(a[f]||0));
  const list=$("#hfList");list.innerHTML="";
  if(!H.length){list.innerHTML='<p class="s">Todavía no hay carreras guardadas.</p>';return}
  H.slice(0,10).forEach((c,i)=>{
    const d=document.createElement("div");d.className="hf-i";
    const r=document.createElement("b");r.textContent=i===0?"🥇":i===1?"🥈":i===2?"🥉":(i+1)+".";
    const m=document.createElement("div");
    if(c.club&&c.lgId&&hasCrest(c.lgId,c.club)){
      const im=document.createElement("img");
      im.className="hf-crest"+(CREST_OPAQUE.has(c.lgId+"|"+c.club)?" op":"");im.alt="";im.src=crestSrc(c.lgId,c.club);
      im.onerror=()=>im.remove();
      m.appendChild(im);
    }
    const n=document.createElement("strong");n.textContent=c.n||"Sin nombre";
    const s=document.createElement("span");s.textContent=(c.p||"Jugador")+" · "+(c.club||"—")+" · "+(c.lg||c.l||"");
    const s2=document.createElement("span");s2.textContent=(c.pj||0)+" PJ · "+(c.g||c.gkp||0)+" "+(c.p==="Arquero"?"penales":"goles")+" · "+(c.t||0)+" títulos · pico "+(c.peak||0)+(c.money?" · "+fm(c.money):"");
    m.append(n,s,s2);
    const e=document.createElement("em");e.textContent=(c.s||0)+" pts";
    d.append(r,m,e);
    list.appendChild(d);
  });
}

/* ===== INICIALIZACIÓN ===== */
let selPos=8;
function selectPos(i){
  selPos=i;
  $("#ps").querySelectorAll("button.pos").forEach((b,j)=>b.setAttribute("aria-pressed",j===i?"true":"false"));
  updPreview();
}
function updPreview(){
  const p=POS[selPos]||POS[8],nm=($("#nm").value||"").trim()||"Tu jugador",nt=NT[+$("#nat").value||0]||NT[0];
  const parts=String(nt.n||"AR").trim().split(/\s+/);
  const ini=(parts.length>1?parts.slice(0,2).map(w=>w[0]).join(""):String(nt.n||"AR").slice(0,2)).toUpperCase();
  $("#pvName").textContent=nm;
  $("#pvPos").textContent=p[3]+" "+p[0];
  $("#pvNat").textContent=nt.n;
  $("#pvCrest").textContent=ini;
}
POS.forEach((p,i)=>{
  const b=document.createElement("button");
  b.type="button";b.className="pos pos-"+i;b.dataset.pos=i;
  b.setAttribute("aria-pressed",i===selPos?"true":"false");
  b.innerHTML="<i>"+p[3]+"</i><span>"+p[0]+"</span>";
  b.onclick=()=>selectPos(i);
  $("#ps").appendChild(b);
});
$("#startBtn").onclick=()=>go(selPos);
$("#nm").addEventListener("input",updPreview);
$("#nat").addEventListener("change",updPreview);
$("#nat").innerHTML="";
const seenNat=new Set();
NT.forEach((n,i)=>{
  if(seenNat.has(n.n))return;
  seenNat.add(n.n);
  const o=document.createElement("option");
  o.value=i;
  o.textContent=n.n;
  $("#nat").appendChild(o);
});
updPreview();
CH.forEach((c,i)=>{
  const o=document.createElement("option");
  o.value=i;
  o.textContent=c.n;
  $("#ch").appendChild(o);
});
$("#md").onchange=e=>{const c=e.target.value==="1";$("#ch").hidden=!c;$("#mt").disabled=c;if(c)$("#mt").value=CH[+$("#ch").value||0].meta;else $("#mt").value="0"};
$("#ch").onchange=()=>{if($("#md").value==="1")$("#mt").value=CH[+$("#ch").value||0].meta};
const applyTheme=v=>{
  thi=Math.max(0,THEMES.indexOf(v));
  if(v)document.documentElement.dataset.theme=v;else delete document.documentElement.dataset.theme;
  $("#th2").textContent=v==="light"?"☀️":v==="dark"?"🌙":"🌓";
  $("#th").value=v;
};
$("#th").onchange=e=>applyTheme(e.target.value);
$("#th2").onclick=()=>applyTheme(THEMES[(thi+1)%THEMES.length]);
$("#mu").onclick=()=>{muted=!muted;$("#mu").textContent=muted?"🔇":"🔊"};
$("#ps").addEventListener("click",()=>{try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();if(AC.state==="suspended")AC.resume()}catch(e){}},{once:true});
$("#sp").onchange=()=>{if(S)S.spd=+$("#sp").value};
$("#hfBtn").onclick=()=>{show("hf");renderHf()};
$("#hfe").onclick=()=>{show("hf");renderHf()};
$("#hfBack").onclick=()=>{show("st");hist()};
$("#hfFilter").onchange=renderHf;
$("#hfClear").onclick=()=>{if(confirm("¿Borrar todo el historial?")){try{localStorage.removeItem("mc")}catch(e){}renderHf();hist()}};
$("#dl").onclick=()=>{
  const cv=$("#crd");
  const name="soy-leyenda-"+(S.n||"jugador").replace(/[^\w-]+/g,"_")+".png";
  const save=url=>{
    const a=document.createElement("a");
    a.href=url;a.download=name;a.rel="noopener";
    document.body.appendChild(a);a.click();a.remove();
  };
  if(cv.toBlob){
    cv.toBlob(b=>{
      if(!b){save(cv.toDataURL("image/png"));return}
      const url=URL.createObjectURL(b);
      save(url);
      setTimeout(()=>URL.revokeObjectURL(url),60000);
    },"image/png");
  }else save(cv.toDataURL("image/png"));
};
const openCard=()=>{
  if(!S)return;
  $("#zoomImg").src=$("#crd").toDataURL("image/png");
  $("#zoom").hidden=false;
};
$("#crd").onclick=openCard;
$("#crd").onkeydown=e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();openCard()}};
$("#zoomClose").onclick=()=>{$("#zoom").hidden=true};
$("#zoom").onclick=e=>{if(e.target.id==="zoom")$("#zoom").hidden=true};
document.addEventListener("keydown",e=>{if(e.key==="Escape")$("#zoom").hidden=true});
const showTrophy=e=>{const t=e.target.closest(".trophy");const i=$("#trophyInfo");if(t&&i)i.textContent=t.dataset.info};
$("#pm").addEventListener("click",showTrophy);
$("#pm").addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();showTrophy(e)}});
$("#runBtn").onclick=continueRun;
$("#rp").onclick=()=>{try{localStorage.removeItem("mc_run")}catch(e){};show("st");hist();checkRun()};
$("#sh").onclick=async()=>{
  const t=`${S.n} (${S.p[0]}): ${S.pj} PJ, ${S.p[0]=="Arquero"?S.gk.p+" penales atajados, "+S.gk.m+" mano a mano ganados, "+S.gk.v+" vallas a 0,":S.g+" goles, "+S.a+" asistencias,"} ${S.t} títulos${S.caps?", "+S.caps+" PJ en la Selección":""}. “${S.lab}”. ¿Podés hacerlo mejor?`;
  try{await navigator.clipboard.writeText(t);$("#msg").textContent="Copiado. Pegalo en WhatsApp."}catch(e){$("#msg").textContent=t}
};
hist();
checkRun();
