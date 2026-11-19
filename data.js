/* ===== DATOS DEL JUEGO ===== */

/* Tasas por partido: [nombre, goles, asistencias, icono].
   El mediocampo y el enganche deben diferenciarse claramente de la defensa. */
const POS=[["Arquero",0,.004,"🧤"],["Central",.03,.015,"🛡️"],["Lateral izquierdo",.02,.09,"◀️"],["Lateral derecho",.02,.09,"▶️"],["Pivote",.04,.12,"⚙️"],["Mediocampista",.12,.22,"🎯"],["Enganche",.23,.36,"🎩"],["Extremo",.2,.18,"⚡"],["Delantero",.45,.12,"🔥"]];

const CL=[[["Brown de Adrogué",.4],["Atlanta",.4],["Nueva Chicago",.45],["Almirante Brown",.35],["Ferro",.4]],[["Platense",.4],["Argentinos",.5],["Lanús",.55],["Huracán",.5],["Talleres",.6]],[["Independiente",.65],["Racing",.7],["San Lorenzo",.6],["Boca",.85],["River",.9]],[["Benfica",.8],["Ajax",.75],["Sevilla",.6],["Atlético de Madrid",.7],["Inter",.8]],[["Real Madrid",1],["Barcelona",.9],["Man. City",1],["Bayern",.95]]];
const CA=[["Al-Hilal",1],["Al-Nassr",.8],["Al-Ittihad",.7]];
const TN=["Ascenso","Primera","Club grande","Europa","Élite mundial"],EX=[0,55,65,72,80],AM=[41,39,36,34,32];
const TT=[[["Torneo de Ascenso",.25]],[["Liga Profesional",.12],["Copa de la Liga",.12],["Copa Argentina",.1],["Copa Sudamericana",.1]],[["Liga Profesional",.22],["Copa de la Liga",.18],["Copa Argentina",.16],["Copa Libertadores",.14]],[["Liga europea",.28],["Copa nacional",.24],["Europa League",.12],["Champions League",.08]],[["Liga europea",.45],["Copa nacional",.33],["Champions League",.24]]];
const TA=[["Liga de Arabia",.4],["Copa de Arabia",.25]];

CL[0].push(["Chacarita",.4],["Quilmes",.4],["Tristán Suárez",.35]);
CL[1].push(["Estudiantes",.55],["Newell’s",.5],["Rosario Central",.55],["Belgrano",.5],["Godoy Cruz",.45]);
CL[2].push(["Vélez",.6]);
CL[3]=[["Benfica",.8,"Primeira Liga","Taça de Portugal"],["Porto",.75,"Primeira Liga","Taça de Portugal"],["Sporting",.75,"Primeira Liga","Taça de Portugal"],["Ajax",.7,"Eredivisie","KNVB Beker"],["Sevilla",.6,"LaLiga","Copa del Rey"],["Atlético de Madrid",.7,"LaLiga","Copa del Rey"],["Inter",.8,"Serie A","Coppa Italia"],["Juventus",.8,"Serie A","Coppa Italia"],["Milan",.75,"Serie A","Coppa Italia"],["Napoli",.7,"Serie A","Coppa Italia"],["Arsenal",.7,"Premier League","FA Cup"],["Tottenham",.55,"Premier League","FA Cup"],["Dortmund",.7,"Bundesliga","DFB-Pokal"],["Leverkusen",.65,"Bundesliga","DFB-Pokal"],["Marsella",.55,"Ligue 1","Copa de Francia"],["Lyon",.5,"Ligue 1","Copa de Francia"]];
CL[4]=[["Real Madrid",1,"LaLiga","Copa del Rey"],["Barcelona",.95,"LaLiga","Copa del Rey"],["Man. City",1,"Premier League","FA Cup"],["Liverpool",.85,"Premier League","FA Cup"],["Bayern",.95,"Bundesliga","DFB-Pokal"],["PSG",.95,"Ligue 1","Copa de Francia"]];
TT[4]=[["Liga europea",.42],["Copa nacional",.25],["Champions League",.2]];

const INJ=[["una distensión muscular",.7,0,"1 mes"],["un esguince de tobillo",.6,0,"2 meses"],["una fractura de peroné",.4,-1,"5 meses"],["una rotura de ligamentos cruzados",.25,-3,"9 meses"]];
const TR=[["Crack precoz","Arrancás con más nivel, pero tu techo es más bajo."],["Late bloomer","Arrancás flojo, pero tu techo es altísimo."],["Propenso a lesiones","Las lesiones te van a perseguir."],["Líder","Los técnicos confían en vos."],["Disciplinado","Te cuidás: menos lesiones y mejor crecimiento."],["Goleador nato","Convertís mucho más, pero asistís menos."],["Nómada","Más ofertas del exterior y mejor sueldo, pero la dirigencia desconfía."],["Resiliente","Te recuperás antes: lesiones más leves y menos minutos perdidos."]];

const AGENTS=[
{n:"El Amigo",d:"Leal: menos ofertas, menos riesgo.",off:-.08,rel:6,bonus:0},
{n:"El Mercenario",d:"Muchas ofertas y comisiones, más riesgo.",off:.12,rel:-4,bonus:2},
{n:"El Influyente",d:"Contactos: mejores clubes y equilibrio.",off:.04,rel:0,bonus:3}
];

const PRE=[
{id:"fisico",n:"Pretemporada física",d:"Más minutos y crecimiento, con más riesgo de lesión.",e:{pj:1.08,gr:.3,inj:.03}},
{id:"tecnico",n:"Trabajo técnico",d:"Más goles y asistencias.",e:{g:1.12,a:1.05},noGk:1},
{id:"descanso",n:"Descanso y recuperación",d:"Menos lesiones y más minutos, pero crecés menos.",e:{inj:-.04,pj:1.05,gr:-.1}},
{id:"dt",n:"Hablar con el cuerpo técnico",d:"Mejor forma y más minutos.",e:{mod:.08,pj:1.1}},
{id:"capitan",n:"Entrenar con el capitán",d:"Mejor crecimiento, confianza y relación con el DT.",e:{gr:.2,mod:.04,dt:2}},
{id:"prensa",n:"Trabajo con prensa e hinchada",d:"Mejora tu imagen, pero descuidás lo físico.",e:{press:6,hin:4,gr:-.05}},
{id:"definicion",n:"Trabajo de definición",d:"Más goles, menos asistencias y minutos.",e:{g:1.18,a:.95,pj:.97},noGk:1},
{id:"pases",n:"Trabajo de pases",d:"Más asistencias, menos goles.",e:{a:1.18,g:.95},noGk:1},
{id:"exigente",n:"Pretemporada exigente",d:"Mucho más ritmo y crecimiento, con riesgo alto.",e:{pj:1.12,gr:.4,inj:.05,mod:-.05}},
{id:"tranquila",n:"Pretemporada tranquila",d:"Menos lesiones y mejor forma, pero menos crecimiento.",e:{inj:-.06,mod:.03,gr:-.15}},
{id:"liderazgo",n:"Asumir el rol de líder",d:"Mejor relación con el DT y el grupo.",e:{dt:4,mod:.03}},
{id:"recuperacion",n:"Plan de recuperación",d:"Llegás más fresco a los partidos.",e:{inj:-.03,mod:.05,gr:-.05}},
{id:"reflejos",n:"Entrenar reflejos",d:"Más penales atajados y vallas invictas.",e:{gk:1.15,pj:1.02},gk:1},
{id:"salida",n:"Salida en juego",d:"Más mano a mano ganados y seguridad.",e:{gk:1.08,mod:.04},gk:1},
{id:"defensa",n:"Trabajo defensivo",d:"Más minutos, mejor forma y menos lesiones.",e:{pj:1.06,mod:.05,inj:-.02},def:1}
];

const CH=[
{id:"chacarita",n:"Chacarita a la Libertadores",club:"Chacarita",tier:1,k:.54,lg:"Primera Nacional",cp:"Copa Argentina",lgId:"ARG",div:2,meta:1,d:"Ascenso · llevá al club a ganar la Libertadores.",gt:"Ganá la Copa Libertadores.",goal:()=>S.pal.some(x=>x[0]==="Copa Libertadores")},
{id:"ajax",n:"Ajax campeón de Europa",club:"Ajax",tier:3,k:.86,lg:"Eredivisie",cp:"KNVB Beker",lgId:"NED",div:1,meta:2,d:"Europa · ganá la Champions con el Ajax.",gt:"Ganá la Champions League.",goal:()=>S.pal.some(x=>x[0]==="Champions League")},
{id:"valencia",n:"Valencia a la cima",club:"Valencia",tier:3,k:.72,lg:"LaLiga",cp:"Copa del Rey",lgId:"ESP",div:1,meta:4,d:"Europa · llevá al Valencia a 85 de OVR.",gt:"Llegá a 85 de OVR.",goal:()=>S.peak>=85},
{id:"madrid",n:"Rey del Bernabéu",club:"Real Madrid",tier:4,k:.99,lg:"LaLiga",cp:"Copa del Rey",lgId:"ESP",div:1,meta:2,d:"Élite · ganá la Champions con el Real Madrid.",gt:"Ganá la Champions League.",goal:()=>S.pal.some(x=>x[0]==="Champions League")},
{id:"salvar",n:"Salvar al Lobo",club:"Gimnasia",tier:3,k:.70,lg:"Liga Profesional",cp:"Copa Argentina",lgId:"ARG",div:1,meta:7,d:"Argentina · evitá el descenso en tu primera temporada.",gt:"Terminá tu primera temporada fuera del descenso.",goal:()=>!!S.chDone},
{id:"ascenso",n:"Ascenso histórico",club:"Deportivo Madryn",tier:0,k:.44,lg:"Primera Nacional",cp:"Copa Argentina",lgId:"ARG",div:2,meta:8,d:"Argentina · ascendé con Madryn a la Liga Profesional.",gt:"Lográ el ascenso con Deportivo Madryn.",goal:()=>!!S.chDone},
{id:"arabia",n:"Rey de Arabia",club:"Al-Nassr",tier:3,k:.85,lg:"Saudi Pro League",cp:"King Cup",lgId:"ARA",div:1,meta:9,d:"Arabia · ganá la liga y la AFC Champions League.",gt:"Ganá la Saudi Pro League y la AFC Champions League.",goal:()=>S.pal.some(x=>x[0]==="Saudi Pro League")&&S.pal.some(x=>x[0]==="AFC Champions League")},
{id:"turquia",n:"Milagro en Turquía",club:"Trabzonspor",tier:3,k:.78,lg:"Süper Lig",cp:"Türkiye Kupası",lgId:"TUR",div:1,meta:10,d:"Turquía · devolvé el título de liga a Trabzon.",gt:"Ganá la Süper Lig.",goal:()=>S.pal.some(x=>x[0]==="Süper Lig")},
{id:"joya",n:"La joya del Ajax",club:"Ajax",tier:3,k:.86,lg:"Eredivisie",cp:"KNVB Beker",lgId:"NED",div:1,meta:11,d:"Países Bajos · ganá el Balón de Oro saliendo del Ajax.",gt:"Ganá el Balón de Oro.",goal:()=>S.pal.some(x=>x[0]==="Balón de Oro")},
{id:"porto",n:"Doble corona en Porto",club:"Porto",tier:4,k:.90,lg:"Primeira Liga",cp:"Taça de Portugal",lgId:"POR",div:1,meta:12,d:"Portugal · ganá la liga y la Europa League.",gt:"Ganá la Primeira Liga y la Europa League.",goal:()=>S.pal.some(x=>x[0]==="Primeira Liga")&&S.pal.some(x=>x[0]==="Europa League")}
];

const L=(a,g,c)=>a.map(x=>[x[0],x[1],g,c]);

const NT=[
{n:"Argentina",ct:"Copa América",b:.06,d2:"Primera Nacional",cl:[CL[0],CL[1],CL[2]]},
{n:"Brasil",ct:"Copa América",b:.05,d2:"Série B",cl:[L([["Ponte Preta",.4],["Sport",.4],["Avaí",.4]],"Brasileirão","Copa do Brasil"),L([["Bahia",.5],["Fortaleza",.5],["Cruzeiro",.55]],"Brasileirão","Copa do Brasil"),L([["Flamengo",.9],["Palmeiras",.9],["Corinthians",.7],["São Paulo",.7]],"Brasileirão","Copa do Brasil")]},
{n:"Uruguay",ct:"Copa América",b:0,d2:"Segunda División",cl:[L([["Cerro",.4],["Wanderers",.4]],"Liga uruguaya","Copa Uruguay"),L([["Danubio",.45],["Defensor Sporting",.45]],"Liga uruguaya","Copa Uruguay"),L([["Peñarol",.85],["Nacional",.85]],"Liga uruguaya","Copa Uruguay")]},
{n:"España",ct:"Eurocopa",eu:1,b:.04,d2:"Segunda División",cl:[L([["Racing de Santander",.4],["Zaragoza",.4],["Sporting de Gijón",.4]],"Segunda División","Copa del Rey"),L([["Getafe",.45],["Osasuna",.45],["Villarreal",.55]],"LaLiga","Copa del Rey"),L([["Athletic",.6],["Real Sociedad",.6],["Valencia",.6]],"LaLiga","Copa del Rey")]},
{n:"Francia",ct:"Eurocopa",eu:1,b:.05,d2:"Ligue 2",cl:[L([["Guingamp",.4],["Metz",.4],["Bastia",.4]],"Ligue 2","Copa de Francia"),L([["Rennes",.5],["Lens",.5],["Nantes",.45]],"Ligue 1","Copa de Francia"),L([["Lille",.6],["Mónaco",.65],["Niza",.55]],"Ligue 1","Copa de Francia")]},
{n:"Inglaterra",ct:"Eurocopa",eu:1,b:.02,d2:"Championship",cl:[L([["Leeds",.4],["Sheffield United",.4],["Norwich",.4]],"Championship","FA Cup"),L([["Brighton",.5],["Newcastle",.55],["Aston Villa",.55]],"Premier League","FA Cup"),L([["Chelsea",.75],["Man. United",.7],["Tottenham",.6]],"Premier League","FA Cup")]},
{n:"Alemania",ct:"Eurocopa",eu:1,b:.05,d2:"2. Bundesliga",cl:[L([["Hansa Rostock",.4],["Schalke",.4],["Hannover",.4]],"2. Bundesliga","DFB-Pokal"),L([["Mainz",.45],["Friburgo",.5],["Eintracht Frankfurt",.55]],"Bundesliga","DFB-Pokal"),L([["Wolfsburgo",.55],["Stuttgart",.6],["Leipzig",.7]],"Bundesliga","DFB-Pokal")]},
{n:"Italia",ct:"Eurocopa",eu:1,b:.04,d2:"Serie B",cl:[L([["Sampdoria",.4],["Palermo",.4],["Bari",.4]],"Serie B","Coppa Italia"),L([["Torino",.45],["Bologna",.5],["Fiorentina",.55]],"Serie A","Coppa Italia"),L([["Lazio",.6],["Roma",.65],["Atalanta",.65]],"Serie A","Coppa Italia")]},
{n:"Portugal",ct:"Eurocopa",eu:1,b:.03,d2:"Liga Portugal 2",cl:[L([["Académica",.4],["Farense",.4],["Vizela",.4]],"Liga Portugal 2","Taça de Portugal"),L([["Famalicão",.45],["Boavista",.45],["Rio Ave",.45]],"Primeira Liga","Taça de Portugal"),L([["Braga",.6],["Vitória de Guimarães",.55]],"Primeira Liga","Taça de Portugal")]},
{n:"Países Bajos",ct:"Eurocopa",eu:1,b:.03,d2:"Eerste Divisie",cl:[L([["Cambuur",.4],["Roda JC",.4],["Go Ahead Eagles",.4]],"Eerste Divisie","KNVB Beker"),L([["Utrecht",.45],["Twente",.5],["Heerenveen",.45]],"Eredivisie","KNVB Beker"),L([["PSV",.7],["Feyenoord",.7],["AZ",.55]],"Eredivisie","KNVB Beker")]},
{n:"Colombia",ct:"Copa América",b:.02,d2:"Primera B",cl:[L([["Cúcuta",.4],["Tigres",.4]],"Torneo BetPlay","Copa Colombia"),L([["Once Caldas",.45],["Deportes Tolima",.5],["Santa Fe",.5]],"Liga colombiana","Copa Colombia"),L([["Atlético Nacional",.8],["Millonarios",.7],["Junior",.65]],"Liga colombiana","Copa Colombia")]},
{n:"Chile",ct:"Copa América",b:0,d2:"Primera B",cl:[L([["Cobreloa",.4],["Unión San Felipe",.4]],"Primera B","Copa Chile"),L([["Huachipato",.45],["Palestino",.45],["Ñublense",.45]],"Liga chilena","Copa Chile"),L([["Colo-Colo",.8],["Universidad de Chile",.7],["Universidad Católica",.7]],"Liga chilena","Copa Chile")]},
{n:"Perú",ct:"Copa América",b:.02,d2:"Liga 2",cl:[]},
{n:"Ecuador",ct:"Copa América",b:.02,d2:"Liga Pro Serie B",cl:[]},
{n:"Paraguay",ct:"Copa América",b:.02,d2:"División Intermedia",cl:[]},
{n:"México",ct:"Copa Oro",b:.03,d2:"Liga de Expansión MX",cl:[]},
{n:"Estados Unidos",ct:"Copa Oro",b:.02,d2:"USL Championship",cl:[]},
{n:"Bélgica",ct:"Eurocopa",eu:1,b:.03,d2:"Challenger Pro League",cl:[]},
{n:"Croacia",ct:"Eurocopa",eu:1,b:.03,d2:"Prva NL",cl:[]},
{n:"Arabia Saudita",ct:"Copa Asiática",b:.03,d2:"Saudi First Division",cl:[]}
];

const SEL={t:"La Selección te convoca.",o:[{l:"Ir a la convocatoria",f:()=>{S.caps+=Math.round(R(4,10));S.ovr+=1;return"Sumaste experiencia con la Selección."}},{l:"Priorizar el club",f:()=>{S.mod=.1;return"Te quedaste enfocado en tu club."}}]};

const EV=[
{t:"Un entrenamiento fuerte te deja con una molestia.",o:[{l:"Hacer recuperación extra",s:"Perdés minutos hoy, ganás a futuro",f:()=>{S.mod=-.2;S.pot+=1;return"Te cuidaste y volvés más fuerte."}},{l:"Volver rápido",s:"Riesgo de lesión",f:()=>{if(rnd()<.4){S.ovr-=2;S.mod=-.4;return"Te desgarraste y perdiste meses."}return"Zafaste y no perdiste ritmo."}}]},
{t:"El preparador físico te propone doble turno.",o:[{l:"Aceptar",s:"Sube el nivel, pero hay riesgo",f:()=>{if(rnd()<.25){S.ovr-=3;S.mod=-.3;return"Te sobrecargaste y quedaste afuera un tiempo."}S.ovr+=2;return"El trabajo extra se nota: +2 de nivel."}},{l:"Descansar",f:()=>{S.mod=.1;return"Llegás fresco a la temporada."}}]},
{t:"Hay una pelea fuerte en el vestuario.",o:[{l:"Poner la cara y hablar",s:"Puede salir bien o mal",f:()=>rnd()<.5?(S.mod=.2,"Te ganaste el respeto del grupo."):(S.mod=-.2,"Se tensó más y el DT te marcó.")},{l:"Hacerte el distraído",f:()=>{S.mod=-.1;return"Te quedaste al margen."}}]},
{t:"Tus amigos te invitan a jugar en el potrero del barrio.",o:[{l:"Ir",f:()=>{S.pot+=1;return"Recuperaste las ganas y jugás con más alegría."}},{l:"Quedarte en casa",f:()=>"Una noche más tranquila."}]},
{t:"Llega un técnico exigente que trabaja mucho el detalle.",o:[{l:"Aceptar su método",s:"Más techo",f:()=>{S.pot+=2;S.ovr+=1;return"Aprendiste mucho y tu techo creció."}},{l:"Seguir a tu manera",f:()=>"Seguís igual que siempre."}]},
{t:"El club atraviesa una crisis económica.",o:[{l:"Bancar al plantel",f:()=>{S.mod=.15;return"Te volvés referente del grupo."}},{l:"Esperar ofertas",f:()=>{S.mod=-.1;return"El clima se enrareció."}}]},
{t:"Te lesionás de gravedad: rodilla.",o:[{l:"Operarte y rehabilitar",s:"Largo, pero seguro",f:()=>{S.ovr-=3;S.mod=-.5;return"Fue duro, pero volvés."}},{l:"Tratamiento conservador",s:"Riesgo",f:()=>rnd()<.5?(S.ovr-=1,S.mod=-.3,"Volvés a tiempo."):(S.ovr-=4,S.mod=-.6,"No cicatrizó bien.")}]},
{t:"El club te ofrece la cinta de capitán.",o:[{l:"Aceptarla",f:()=>{S.mod=.12;return"El grupo te respeta y jugás con más peso."}},{l:"Rechazarla",f:()=>"Preferís no cargar con esa presión."}]}
];

const EV2=[
{t:"Tu representante llama a medianoche: un club de otra liga está muy interesado, pero tu DT te considera intransferible.",c:()=>S.age>=22,o:[{l:"Presionar para que te dejen salir",s:"Podés ganar un lugar... o un enemigo",f:()=>rnd()<.5?(S.mod=.05,"El club entendió que querías crecer y te dio más protagonismo."):(S.mod=-.2,"El DT se ofendió y empezaste a jugar menos.")},{l:"Renovar con aumento",f:()=>{S.mod=.1;return"Firmaste largo y te sentís pieza clave del proyecto."}}]},
{t:"Nace tu primer hijo. Estás feliz, pero dormís tres horas por noche.",c:()=>S.age>=24,o:[{l:"Tomarte unos días",f:()=>{S.pot+=1;S.mod=-.1;return"Volviste con la cabeza despejada y una motivación nueva."}},{l:"Volver a entrenar enseguida",f:()=>rnd()<.5?(S.ovr+=1,"Canalizaste la emoción y te viste más afilado que nunca."):(S.mod=-.15,"El cansancio se notó en los partidos.")}]},
{t:"Se viraliza un video tuyo saliendo de un boliche después de perder un partido.",c:()=>S.age>=20,o:[{l:"Pedir disculpas públicas",f:()=>{S.mod=-.05;return"La gente te perdonó rápido. Aprendiste la lección."}},{l:"Responder con ironía en redes",s:"Puede salir muy bien o muy mal",f:()=>rnd()<.5?(S.mod=.1,"Los hinchas se rieron con vos y te bancaron."):(S.mod=-.3,"La prensa se te vino encima durante semanas.")}]},
{t:"Un tío te pide plata prestada para abrir un negocio. Toda la familia mira cómo respondés.",c:()=>S.age<=27,o:[{l:"Ayudarlo",f:()=>{S.mod=-.05;return"El negocio no funcionó, pero tu familia sigue unida."}},{l:"Decirle que no",f:()=>{S.mod=.05;return"Se enojó un tiempo, pero te dejó concentrarte en la cancha."}}]},
{t:"Tu técnico te pide jugar unos partidos en otra posición porque falta gente.",c:()=>S.tier>=1,o:[{l:"Aceptar el desafío",f:()=>{S.mod=.15;S.ovr-=1;return"Te adaptaste, ganaste minutos y el DT te lo agradeció."}},{l:"Decir que ese no es tu lugar",f:()=>{S.mod=-.1;return"El DT guardó la respuesta... y te lo hizo sentir en la lista."}}]},
{t:"El DT te llama a entrenar con el primer equipo. Los referentes te miran de reojo.",c:()=>S.age<=20,o:[{l:"Aprovechar cada pelota",f:()=>{S.pot+=1;S.ovr+=1;return"Aprendiste de los grandes: tu nivel dio un salto."}},{l:"Quedarte callado y observar",f:()=>{S.pot+=1;return"Te llevaste lecciones para toda la carrera."}}]},
{t:"Se viene el clásico y el DT duda en ponerte. Toda la semana se habla de eso.",c:()=>S.tier>=1,o:[{l:"Hablar con el DT",f:()=>rnd()<.5?(S.mod=.2,"Te dio la titularidad y ganaron el clásico. Noche inolvidable."):(S.mod=-.1,"Te pidió paciencia y viste el clásico desde el banco.")},{l:"Ganártelo entrenando",f:()=>{S.ovr+=1;return"Entrenaste como nunca y te ganaste el puesto sin discutir."}}]},
{t:"Un histórico del club te adopta como pupilo y te invita a cenar los viernes.",c:()=>S.age<=23,o:[{l:"Seguir sus consejos",f:()=>{S.pot+=2;return"Te enseñó a jugar con la cabeza. Tu techo creció."}},{l:"Ir por tu propio camino",f:()=>{S.ovr+=1;return"Cometiste errores, pero aprendiste a tu manera."}}]},
{t:"Llega una oferta millonaria desde Arabia. Tu club quiere retenerte.",c:()=>S.age>=29,o:[{l:"Usarla para pedir aumento",s:"Arriesgado",f:()=>rnd()<.6?(S.mod=.1,"Te mejoraron el contrato y te dieron un rol importante."):(S.mod=-.15,"La dirigencia se ofendió y te enfrió el vínculo.")},{l:"Ignorarla",f:()=>{S.mod=.05;return"Dijiste que querías ganar acá. La hinchada te idolatró."}}]},
{t:"Te cantan en la tribuna y los hinchas te piden fotos en la calle.",c:()=>S.ovr>=EX[S.tier]+4,o:[{l:"Disfrutarlo y firmar camisetas",f:()=>{S.mod=.1;return"Sentiste el cariño y jugaste con más confianza."}},{l:"Mantener perfil bajo",f:()=>{S.ovr+=1;return"Seguiste enfocado en lo tuyo y tu nivel se mantuvo parejo."}}]},
{t:"Un nutricionista te propone cambiar tu dieta por completo: adiós al asado del domingo.",c:()=>S.age>=28,o:[{l:"Aceptar el plan",f:()=>{S.ovr+=1;S.ij=Math.max(.04,S.ij-.02);return"Te sentiste más liviano y con menos molestias."}},{l:"El asado no se negocia",f:()=>"Seguiste igual, con la panza contenta."}]},
{t:"Perdés una final en el último minuto. Los hinchas te insultan en la salida del estadio.",c:()=>S.tier>=2,o:[{l:"Dar la cara en conferencia",f:()=>{S.mod=.1;return"Te bancaste el golpe y el vestuario te lo valoró."}},{l:"Encerrarte unos días",f:()=>{S.mod=-.1;return"Te costó volver a sonreír en la cancha."}}]},
{t:"Se lesiona el titular de tu puesto y te toca reemplazarlo en un partido clave.",c:()=>S.tier>=1&&S.age<=30,o:[{l:"Ir con todo",f:()=>rnd()<.6?(S.mod=.2,"Fuiste figura y te ganaste la confianza del DT."):(S.mod=-.05,"No estuviste a la altura, pero aprendiste.")},{l:"Jugar tranquilo, sin presión",f:()=>{S.mod=.05;return"Cumpliste sin brillar y el DT lo tomó bien."}}]},
{t:"Los jugadores te eligen como voz para reclamar premios impagos a la dirigencia.",c:()=>S.age>=25,o:[{l:"Dar la cara",s:"Puede salir bien o mal",f:()=>rnd()<.55?(S.mod=.12,"Lograron que paguen y el plantel te hizo capitán de hecho."):(S.mod=-.2,"La dirigencia te marcó y empezaste a jugar menos.")},{l:"Pasar la posta a otro",f:()=>"Preferiste no meterte y todo siguió igual."}]},
{t:"Se retira tu ídolo de la infancia y te invitan a su despedida.",c:()=>S.age>=33,o:[{l:"Ir y emocionarte",f:()=>{S.mod=.05;return"Sentiste que el tiempo vuela, pero jugaste más agradecido."}},{l:"No ir",f:()=>"Preferiste no mirar hacia atrás todavía."}]},
{t:"El club de tu infancia te llama: quieren que vuelvas a casa.",c:()=>S.age>=30&&S.club!==S.fc.club,o:[{l:"Volver",s:"Cerrás el círculo",f:()=>{sv(S.fc);signContract(S.fc,contractTerms(S.fc,"base"));return"Volviste a "+S.fc.club+" con la camiseta de tu infancia."}},{l:"Seguir donde estás",f:()=>"Agradeciste el cariño, pero seguís tu camino."}]},
{t:"El DT te critica en la conferencia: dice que no estás a la altura.",c:()=>S.rel.dt<55,o:[{l:"Responder con altura",s:"Puede mejorar el vínculo",f:()=>rnd()<.55?(S.rel.dt=C(S.rel.dt+8,0,100),S.mod=.05,"El DT valoró tu madurez."):(S.rel.dt=C(S.rel.dt-6,0,100),"La respuesta no cayó bien.")},{l:"Callarte y entrenar",f:()=>{S.rel.dt=C(S.rel.dt+4,0,100);S.ovr+=1;return"Respondiste en la cancha."}}]},
{t:"La hinchada te silba después de una racha floja.",c:()=>S.rel.hin<40,o:[{l:"Dar la cara y pedir disculpas",f:()=>{S.rel.hin=C(S.rel.hin+10,0,100);S.mod=.05;return"La tribuna te bancó."}},{l:"Ignorar los silbidos",f:()=>{S.rel.hin=C(S.rel.hin-6,0,100);S.mod=-.05;return"El clima se puso tenso."}}]},
{t:"Un periodista publica una nota dura sobre tu rendimiento.",c:()=>S.rel.pre<45,o:[{l:"Responder en redes",s:"Puede salir bien o mal",f:()=>rnd()<.5?(S.rel.pre=C(S.rel.pre+9,0,100),S.rel.hin=C(S.rel.hin+3,0,100),"Los hinchas te apoyaron."):(S.rel.pre=C(S.rel.pre-8,0,100),"La polémica creció.")},{l:"Enfocarte en jugar",f:()=>{S.rel.pre=C(S.rel.pre+5,0,100);S.ovr+=1;return"Hablaste en la cancha."}}]},
{t:"Tu representante te consigue una oferta de imagen, pero pide una comisión alta.",c:()=>S.ag===1,o:[{l:"Aceptar",f:()=>{S.rel.pre=C(S.rel.pre+5,0,100);S.rel.hin=C(S.rel.hin-3,0,100);return"Ganaste plata, pero la hinchada lo notó."}},{l:"Rechazar",f:()=>{S.rel.hin=C(S.rel.hin+4,0,100);return"Priorizaste la camiseta."}}]},
{t:"El DT te pide que seas el referente del vestuario.",c:()=>S.rel.dt>65,o:[{l:"Asumir el rol",f:()=>{S.rel.dt=C(S.rel.dt+6,0,100);S.mod=.1;return"El grupo te siguió."}},{l:"Mantener el perfil bajo",f:()=>{S.rel.dt=C(S.rel.dt-4,0,100);return"Preferiste no cargar con eso."}}]}
];
