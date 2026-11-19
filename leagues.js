/* ===== LIGAS, DIVISIONES Y CLUBES ===== */

const LEAGUES=[
{id:"ENG",n:"Inglaterra",d1:"Premier League",d2:"Championship",cup:"FA Cup",conf:"UEFA",
 d1c:[["Man. City",.98],["Liverpool",.95],["Arsenal",.94],["Chelsea",.88],["Man. United",.86],["Tottenham",.84],["Newcastle",.83],["Aston Villa",.82],["Brighton",.78],["West Ham",.74],["Crystal Palace",.72],["Everton",.70],["Fulham",.70],["Brentford",.69],["Nottingham Forest",.69],["Bournemouth",.68],["Wolves",.66],["Leicester",.64],["Southampton",.62],["Ipswich",.60]],
 d2c:[["Leeds",.68],["Burnley",.66],["Sheffield United",.65],["Sunderland",.64],["Coventry",.62],["West Brom",.62],["Norwich",.61],["Middlesbrough",.61],["Hull",.59],["Watford",.59],["Bristol City",.58],["Swansea",.57],["Millwall",.56],["Blackburn",.55],["Luton",.55],["Preston",.54],["QPR",.54],["Stoke",.53],["Cardiff",.52],["Sheffield Wednesday",.52],["Derby",.51],["Portsmouth",.50],["Oxford",.48],["Plymouth",.47]]},
{id:"ESP",n:"España",d1:"LaLiga",d2:"LaLiga Hypermotion",cup:"Copa del Rey",conf:"UEFA",
 d1c:[["Real Madrid",.99],["Barcelona",.96],["Atlético",.90],["Athletic",.84],["Real Sociedad",.80],["Villarreal",.80],["Betis",.76],["Sevilla",.74],["Valencia",.72],["Girona",.72],["Osasuna",.70],["Celta",.68],["Mallorca",.68],["Rayo",.67],["Getafe",.66],["Alavés",.65],["Las Palmas",.64],["Espanyol",.63],["Leganés",.61],["Valladolid",.58]],
 d2c:[["Racing Santander",.62],["Levante",.60],["Almería",.59],["Granada",.58],["Cádiz",.58],["Deportivo",.57],["Sporting Gijón",.56],["Zaragoza",.56],["Oviedo",.55],["Elche",.55],["Eibar",.54],["Huesca",.53],["Albacete",.52],["Burgos",.52],["Cartagena",.51],["Mirandés",.50],["Tenerife",.50],["Málaga",.49],["Córdoba",.48],["Castellón",.47],["Eldense",.46],["Ferrol",.45]]},
{id:"ITA",n:"Italia",d1:"Serie A",d2:"Serie B",cup:"Coppa Italia",conf:"UEFA",
 d1c:[["Inter",.96],["Milan",.91],["Juventus",.90],["Napoli",.90],["Atalanta",.88],["Roma",.85],["Lazio",.84],["Fiorentina",.80],["Bologna",.78],["Torino",.74],["Udinese",.72],["Genoa",.70],["Como",.68],["Verona",.66],["Cagliari",.65],["Lecce",.64],["Parma",.63],["Empoli",.62],["Monza",.61],["Venezia",.60]],
 d2c:[["Sassuolo",.64],["Pisa",.62],["Spezia",.60],["Cremonese",.60],["Palermo",.58],["Sampdoria",.57],["Bari",.56],["Brescia",.55],["Catanzaro",.54],["Cesena",.53],["Frosinone",.53],["Juve Stabia",.51],["Modena",.51],["Reggiana",.50],["Salernitana",.50],["Südtirol",.49],["Cittadella",.48],["Mantova",.47],["Carrarese",.46],["Cosenza",.45]]},
{id:"GER",n:"Alemania",d1:"Bundesliga",d2:"2. Bundesliga",cup:"DFB-Pokal",conf:"UEFA",
 d1c:[["Bayern",.99],["Leverkusen",.90],["Dortmund",.88],["Leipzig",.86],["Stuttgart",.82],["Eintracht Frankfurt",.80],["Hoffenheim",.74],["Freiburg",.73],["Wolfsburg",.72],["Mainz",.70],["Augsburg",.68],["Werder Bremen",.67],["Union Berlin",.66],["Gladbach",.65],["Bochum",.62],["Heidenheim",.60],["St. Pauli",.58],["Holstein Kiel",.56]],
 d2c:[["Hamburg",.64],["Köln",.63],["Schalke",.62],["Hertha",.62],["Düsseldorf",.60],["Paderborn",.58],["Karlsruher",.57],["Nürnberg",.57],["Hannover",.56],["Kaiserslautern",.55],["Magdeburg",.54],["Elversberg",.53],["Greuther Fürth",.52],["Darmstadt",.52],["Braunschweig",.50],["Münster",.48],["Ulm",.47],["Regensburg",.46]]},
{id:"FRA",n:"Francia",d1:"Ligue 1",d2:"Ligue 2",cup:"Coupe de France",conf:"UEFA",
 d1c:[["PSG",.99],["Monaco",.88],["Marseille",.86],["Lille",.82],["Lyon",.80],["Nice",.78],["Lens",.76],["Rennes",.74],["Strasbourg",.72],["Toulouse",.70],["Nantes",.68],["Brest",.67],["Reims",.65],["Auxerre",.63],["Angers",.62],["Le Havre",.60],["Saint-Étienne",.59],["Montpellier",.58]],
 d2c:[["Metz",.62],["Lorient",.62],["Guingamp",.58],["Bastia",.56],["Clermont",.56],["Caen",.55],["Amiens",.55],["Paris FC",.54],["Annecy",.53],["Ajaccio",.52],["Dunkerque",.51],["Grenoble",.51],["Laval",.50],["Pau",.49],["Martigues",.48],["Red Star",.48],["Rodez",.47],["Troyes",.47]]},
{id:"POR",n:"Portugal",d1:"Primeira Liga",d2:"Liga Portugal 2",cup:"Taça de Portugal",conf:"UEFA",
 d1c:[["Benfica",.92],["Sporting",.91],["Porto",.90],["Braga",.82],["Vitória Guimarães",.74],["Famalicão",.70],["Moreirense",.66],["Santa Clara",.64],["Estoril",.63],["Rio Ave",.62],["Arouca",.62],["Gil Vicente",.61],["Casa Pia",.60],["Boavista",.58],["Estrela Amadora",.57],["Nacional",.56],["Farense",.55],["AVS",.54]],
 d2c:[["Vizela",.58],["Chaves",.57],["Leixões",.54],["Tondela",.53],["Marítimo",.53],["Penafiel",.52],["Portimonense",.52],["União de Leiria",.51],["Paços de Ferreira",.51],["Alverca",.50],["Académico Viseu",.50],["Mafra",.49],["Feirense",.48],["Torreense",.48],["Oliveirense",.47],["Felgueiras",.46],["Caldas",.44],["Amora",.43]]},
{id:"NED",n:"Países Bajos",d1:"Eredivisie",d2:"Eerste Divisie",cup:"KNVB Beker",conf:"UEFA",
 d1c:[["PSV",.90],["Feyenoord",.88],["Ajax",.86],["AZ",.80],["Twente",.78],["Utrecht",.74],["Go Ahead Eagles",.70],["NEC",.68],["Sparta",.66],["Heerenveen",.65],["Fortuna Sittard",.63],["Groningen",.63],["Zwolle",.61],["Heracles",.60],["Willem II",.59],["RKC",.58],["Almere City",.56],["NAC Breda",.55]],
 d2c:[["Cambuur",.58],["Excelsior",.57],["Volendam",.55],["Den Bosch",.54],["De Graafschap",.53],["Dordrecht",.53],["ADO Den Haag",.52],["Emmen",.52],["Jong Ajax",.52],["Jong PSV",.51],["Jong AZ",.50],["Eindhoven",.50],["Roda JC",.50],["Vitesse",.49],["Helmond Sport",.49],["Jong Utrecht",.48],["MVV",.47],["VVV",.47],["Oss",.46],["Telstar",.45]]},
{id:"BRA",n:"Brasil",d1:"Série A",d2:"Série B",cup:"Copa do Brasil",conf:"CONMEBOL",
 d1c:[["Palmeiras",.94],["Flamengo",.94],["Botafogo",.90],["Fortaleza",.82],["Internacional",.82],["Atlético-MG",.80],["São Paulo",.80],["Corinthians",.78],["Bahia",.78],["Cruzeiro",.78],["Vasco",.74],["Grêmio",.74],["Fluminense",.72],["Bragantino",.70],["Juventude",.68],["Athletico-PR",.66],["Criciúma",.64],["Cuiabá",.63],["Vitória",.62],["Atlético-GO",.60]],
 d2c:[["Santos",.72],["Sport",.66],["Ceará",.66],["Novorizontino",.62],["Mirassol",.62],["Goiás",.60],["Coritiba",.56],["Operário",.56],["América-MG",.55],["Amazonas",.54],["Avaí",.54],["CRB",.54],["Chapecoense",.53],["Paysandu",.52],["Ponte Preta",.52],["Athletic-MG",.50],["Botafogo-SP",.50],["Guarani",.48],["Brusque",.47],["Ituano",.46]]},
{id:"ARG",n:"Argentina",d1:"Liga Profesional",d2:"Primera Nacional",cup:"Copa Argentina",conf:"CONMEBOL",
 d1c:[["River",.90],["Boca",.88],["Racing",.82],["Independiente",.80],["Vélez",.78],["San Lorenzo",.76],["Estudiantes",.76],["Rosario Central",.74],["Huracán",.72],["Lanús",.72],["Talleres",.72],["Gimnasia",.70],["Defensa y Justicia",.70],["Banfield",.68],["Argentinos",.68],["Belgrano",.68],["Newell's",.68],["Instituto",.64],["Godoy Cruz",.64],["Independiente Rivadavia",.62]],
 d2c:[["Chacarita",.54],["Quilmes",.54],["Ferro",.52],["Almirante Brown",.52],["Brown de Adrogué",.50],["Atlanta",.50],["Nueva Chicago",.50],["San Martín (T)",.50],["Tristán Suárez",.48],["Deportivo Morón",.48],["Defensores de Belgrano",.47],["Temperley",.47],["Agropecuario",.46],["Güemes",.45],["Alvarado",.45],["Estudiantes de Río Cuarto",.45],["Los Andes",.44],["Deportivo Madryn",.44],["Mitre",.43],["Colegiales",.42]]},
{id:"TUR",n:"Turquía",d1:"Süper Lig",d2:"TFF 1. Lig",cup:"Türkiye Kupası",conf:"UEFA",
 d1c:[["Galatasaray",.86],["Fenerbahçe",.86],["Beşiktaş",.80],["Trabzonspor",.78],["Başakşehir",.74],["Samsunspor",.72],["Eyüpspor",.68],["Antalyaspor",.66],["Kasımpaşa",.64],["Konyaspor",.64],["Alanyaspor",.62],["Rizespor",.62],["Gaziantep",.60],["Sivasspor",.60],["Göztepe",.60],["Adana Demirspor",.60],["Kayserispor",.58],["Bodrum",.56],["Kocaelispor",.56],["Hatayspor",.54]],
 d2c:[["Karagümrük",.58],["Pendikspor",.56],["Sakaryaspor",.54],["Erzurumspor",.54],["Ankaragücü",.54],["Boluspor",.52],["İstanbulspor",.52],["Manisa",.50],["Ümraniyespor",.50],["Amed Sportif",.50],["Keçiörengücü",.48],["Çorum",.48],["Gençlerbirliği",.46],["Şanlıurfaspor",.46],["Adanaspor",.46],["Iğdır",.44],["Erokspor",.43],["Yeni Malatyaspor",.42]]},
{id:"ARA",n:"Arabia Saudita",d1:"Saudi Pro League",d2:"Saudi First Division",cup:"King Cup",conf:"AFC",
 d1c:[["Al-Hilal",.90],["Al-Ittihad",.86],["Al-Nassr",.85],["Al-Ahli",.82],["Al-Qadsiah",.76],["Al-Shabab",.74],["Al-Ettifaq",.67],["Neom",.66],["Al-Taawoun",.65],["Al-Fateh",.63],["Al-Fayha",.61],["Al-Riyadh",.60],["Al-Khaleej",.59],["Damac",.58],["Al-Kholood",.56],["Al-Orobah",.55],["Al-Hazem",.54],["Al-Najma",.52]],
 d2c:[["Al-Okhdood",.54],["Al-Raed",.53],["Al-Wehda",.53],["Abha",.51],["Al-Faisaly",.50],["Al-Adalah",.49],["Al-Batin",.48],["Al-Jabalain",.47],["Al-Safa",.46],["Al-Jandal",.45],["Al-Bukiryah",.44],["Al-Arabi",.43],["Al-Taraji",.42],["Al-Ansar",.41],["Al-Zulfi",.40],["Al-Qaisumah",.39],["Al-Diriyah",.38],["Al-Jubail",.37]]}
];

function tierOf(k,div){
  if(div===1)return k>=.88?4:k>=.68?3:2;
  return k>=.72?2:k>=.46?1:0;
}

const ALL_CLUBS=[];
LEAGUES.forEach(L=>{
  L.d1c.forEach(c=>ALL_CLUBS.push({n:c[0],k:c[1],lgId:L.id,div:1,lg:L.d1,cp:L.cup,tier:tierOf(c[1],1)}));
  L.d2c.forEach(c=>ALL_CLUBS.push({n:c[0],k:c[1],lgId:L.id,div:2,lg:L.d2,cp:L.cup,tier:tierOf(c[1],2)}));
});