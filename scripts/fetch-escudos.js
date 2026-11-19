const fs = require("fs");
const path = require("path");
const vm = require("vm");

const code = fs.readFileSync("leagues.js", "utf8");
const ctx = {};
vm.createContext(ctx);
vm.runInContext(code + ";globalThis.__clubs=ALL_CLUBS;", ctx);
const clubs = ctx.__clubs;
const index = JSON.parse(fs.readFileSync("scripts/logo-index.json", "utf8"));

// Clubas de reserva o divisiones muy bajas que no están en football-logos.cc.
const FORCE_NO_MATCH = new Set([
  "ARA|Al-Adalah", "ARA|Al-Safa", "ARA|Al-Taraji", "ARA|Al-Ansar",
  "ARA|Al-Zulfi", "ARA|Al-Qaisumah", "ARA|Al-Jubail",
]);
const FORCE_MATCH = {
  "NED|Jong AZ": "AZ Alkmaar",
};

const ALIASES = {
  ENG: {
    "Man. City": "Manchester City", "Man. United": "Manchester United",
    "West Brom": "West Bromwich Albion", "QPR": "Queens Park Rangers",
    "Wolves": "Wolverhampton Wanderers", "Brighton": "Brighton & Hove Albion",
    "Newcastle": "Newcastle United", "Tottenham": "Tottenham Hotspur",
    "Leeds": "Leeds United", "Hull": "Hull City", "Cardiff": "Cardiff City",
    "Derby": "Derby County", "Stoke": "Stoke City", "Swansea": "Swansea City",
    "Oxford": "Oxford United", "Plymouth": "Plymouth Argyle",
    "Preston": "Preston North End", "Luton": "Luton Town",
    "Coventry": "Coventry City", "Norwich": "Norwich City",
    "Blackburn": "Blackburn Rovers", "Bournemouth": "AFC Bournemouth",
  },
  ESP: {
    "Atlético": "Atletico Madrid", "Athletic": "Athletic Club",
    "Betis": "Real Betis", "Celta": "Celta Vigo", "Rayo": "Rayo Vallecano",
    "Valladolid": "Real Valladolid", "Deportivo": "Deportivo La Coruña",
    "Zaragoza": "Real Zaragoza", "Oviedo": "Real Oviedo",
    "Ferrol": "Racing Club Ferrol", "Eldense": "CD Eldense",
    "Cartagena": "FC Cartagena", "Sporting Gijón": "Sporting Gijón",
    "Racing Santander": "Racing Santander",
  },
  ITA: {
    "Inter": "Inter Milan", "Milan": "AC Milan", "Roma": "AS Roma",
    "Lazio": "SS Lazio", "Verona": "Hellas Verona",
  },
  GER: {
    "Bayern": "Bayern Munich", "Dortmund": "Borussia Dortmund",
    "Leipzig": "RB Leipzig", "Leverkusen": "Bayer Leverkusen",
    "Gladbach": "Borussia Mönchengladbach", "St. Pauli": "FC St. Pauli",
    "Hamburg": "Hamburger SV", "Köln": "1. FC Köln", "Schalke": "FC Schalke 04",
    "Hertha": "Hertha BSC", "Düsseldorf": "Fortuna Düsseldorf",
    "Nürnberg": "1. FC Nürnberg", "Hannover": "Hannover 96",
    "Kaiserslautern": "1. FC Kaiserslautern",
    "Greuther Fürth": "SpVgg Greuther Fürth",
    "Braunschweig": "Eintracht Braunschweig", "Münster": "Preußen Münster",
    "Regensburg": "Jahn Regensburg",
  },
  FRA: {
    "PSG": "Paris Saint-Germain", "Lyon": "Olympique Lyonnais",
    "Marseille": "Olympique de Marseille", "Monaco": "AS Monaco",
    "Saint-Étienne": "AS Saint-Étienne", "Reims": "Stade de Reims",
    "Laval": "Stade Lavallois", "Caen": "Stade Malherbe Caen",
    "Guingamp": "EA Guingamp", "Clermont": "Clermont Foot",
    "Grenoble": "Grenoble Foot 38", "Rodez": "Rodez AF",
    "Martigues": "FC Martigues", "Amiens": "Amiens SC", "Bastia": "SC Bastia",
    "Metz": "FC Metz", "Lorient": "Lorient FC", "Pau": "Pau FC",
    "Red Star": "Red Star FC", "Strasbourg": "RC Strasbourg Alsace",
    "Lens": "RC Lens", "Le Havre": "Le Havre AC",
  },
  POR: {
    "Sporting": "Sporting CP", "Porto": "FC Porto", "Braga": "SC Braga",
    "Vitória Guimarães": "Vitória de Guimarães", "Casa Pia": "Casa Pia AC",
    "Estrela Amadora": "Estrela da Amadora", "Nacional": "Nacional da Madeira",
    "AVS": "AVS Futebol SAD", "Chaves": "Grupo Desportivo de Chaves",
    "Paços de Ferreira": "Paços Ferreira", "Académico Viseu": "Académico de Viseu",
    "Torreense": "S.C.U. Torreense",
  },
  NED: {
    "PSV": "PSV Eindhoven", "AZ": "AZ Alkmaar", "Utrecht": "FC Utrecht",
    "Sparta": "Sparta Rotterdam", "NEC": "N.E.C. Nijmegen",
    "Groningen": "FC Groningen", "Heerenveen": "sc Heerenveen",
    "Zwolle": "PEC Zwolle", "Heracles": "Heracles Almelo",
    "RKC": "RKC Waalwijk", "Almere City": "Almere City FC",
    "Cambuur": "SC Cambuur", "Excelsior": "Excelsior Rotterdam",
    "Den Bosch": "FC Den Bosch", "Dordrecht": "FC Dordrecht",
    "Eindhoven": "FC Eindhoven", "Roda JC": "Roda JC Kerkrade",
    "MVV": "MVV Maastricht", "VVV": "VVV-Venlo", "Oss": "TOP Oss",
  },
  BRA: {
    "Atlético-MG": "Atlético Mineiro", "Atlético-GO": "Atlético Goianiense",
    "Athletico-PR": "Athletico Paranaense", "Bragantino": "RB Bragantino",
    "Botafogo": "Botafogo FR", "Vasco": "Vasco da Gama", "Santos": "Santos FC",
    "Sport": "Sport Recife", "América-MG": "América Mineiro",
    "Athletic-MG": "Athletic", "Botafogo-SP": "Botafogo SP",
    "Novorizontino": "Grêmio Novorizontino", "Operário": "Operário Ferroviário",
    "Avaí": "Avai",
  },
  ARG: {
    "River": "River Plate", "Boca": "Boca Juniors", "Racing": "Racing Club",
    "Vélez": "Vélez Sarsfield", "San Lorenzo": "San Lorenzo de Almagro",
    "Estudiantes": "Estudiantes de La Plata", "Huracán": "CA Huracán",
    "Gimnasia": "Gimnasia LP", "Argentinos": "Argentinos Juniors",
    "Newell's": "Newell's Old Boys", "Instituto": "Instituto Córdoba",
    "Chacarita": "Chacarita Juniors", "Ferro": "Ferro Carril Oeste",
    "Atlanta": "Atlético Atlanta", "San Martín (T)": "San Martín",
    "Estudiantes de Río Cuarto": "Estudiantes de Rio Cuarto",
    "Mitre": "Club Atlético Mitre", "Temperley": "Club Atlético Temperley",
    "Agropecuario": "Agropecuario Argentino",
  },
  TUR: {
    "Göztepe": "Göztepe Izmir", "Rizespor": "Çaykur Rizespor",
    "Amed Sportif": "Amed SFK", "Çorum": "Çorum FK", "Bodrum": "Bodrum FK",
    "Karagümrük": "Fatih Karagümrük", "Erokspor": "Esenler Erokspor",
    "Iğdır": "Iğdır FK", "Manisa": "Manisa FK",
  },
  ARA: {
    "Al-Ittihad": "Al Ittihad", "Al-Hilal": "Al Hilal",
    "Al-Qadsiah": "Al Qadsiah", "Al-Nassr": "Al Nassr",
    "Al-Ahli": "Al Ahli", "Al-Shabab": "Al Shabab", "Al-Hazem": "Al Hazem",
    "Al-Ettifaq": "Al Ettifaq", "Al-Taawoun": "Al Taawoun",
    "Al-Riyadh": "Al Riyadh", "Al-Khaleej": "Al Khaleej",
    "Al-Kholood": "Al-Kholood", "Al-Fateh": "Al Fateh",
    "Al-Fayha": "Al Fayha", "Neom": "Neom SC", "Al-Faisaly": "Al-Faisaly FC",
    "Al-Batin": "Al Batin", "Al-Najma": "Al Najma", "Al-Wehda": "Al Wehda",
    "Al-Orobah": "Al Orobah", "Al-Okhdood": "Al Okhdood",
    "Al-Raed": "Al Raed", "Al-Jabalain": "Al Jabalain",
    "Al-Bukiryah": "Al Bukayriyah", "Al-Jandal": "Al Jandal",
    "Al-Arabi": "Al Arabi", "Al-Diriyah": "Diriyah Club",
  },
};

function norm(s) {
  return String(s).toLowerCase().normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "").replace(/&/g, " and ")
    .replace(/['’]/g, "").replace(/[^a-z0-9 ]/g, " ")
    .replace(/\b(fc|cf|afc|sc|ac|cd|ud|sd|ca|club|the)\b/g, " ")
    .replace(/\s+/g, " ").trim();
}
function slug(s) {
  return String(s).toLowerCase().normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "").replace(/&/g, "and")
    .replace(/['’]/g, "").replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
function lev(a, b) {
  if (a === b) return 1;
  const m = a.length, n = b.length;
  if (!m || !n) return 0;
  let prev = Array.from({ length: n + 1 }, (_, i) => i);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = cur;
  }
  return 1 - prev[n] / Math.max(m, n);
}
function tokenScore(a, b) {
  const ta = new Set(a.split(" ").filter(Boolean));
  const tb = new Set(b.split(" ").filter(Boolean));
  if (!ta.size || !tb.size) return 0;
  let inter = 0;
  for (const x of ta) if (tb.has(x)) inter++;
  return inter / Math.min(ta.size, tb.size);
}

function bestMatch(club) {
  if (FORCE_NO_MATCH.has(club.lgId + "|" + club.n)) return null;
  const entries = index[club.lgId] || [];
  const forced = FORCE_MATCH[club.lgId + "|" + club.n];
  const alias = forced || (ALIASES[club.lgId] || {})[club.n];
  const target = norm(alias || club.n);
  let best = null;
  for (const e of entries) {
    const en = norm(e.name);
    const es = norm(e.slug.replace(/-/g, " "));
    let score = 0;
    if (en === target || es === target) score = 1;
    else {
      const s1 = tokenScore(target, en);
      const s2 = tokenScore(target, es);
      const s3 = lev(target, en);
      const s4 = lev(target, es);
      score = Math.max(s1 * 0.95, s2 * 0.9, s3, s4 * 0.98);
    }
    if (!best || score > best.score) best = { ...e, score };
  }
  return best && best.score >= 0.72 ? best : null;
}

async function download(url, dest) {
  const headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    "Referer": "https://football-logos.cc/",
    "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
  };
  for (let i = 0; i < 3; i++) {
    try {
      const r = await fetch(url, { headers });
      if (r.ok) {
        fs.writeFileSync(dest, Buffer.from(await r.arrayBuffer()));
        return true;
      }
    } catch {}
    await new Promise((res) => setTimeout(res, 400 * (i + 1)));
  }
  return false;
}

(async () => {
  fs.mkdirSync("assets/escudos", { recursive: true });
  const manifest = [];
  const queue = [];
  for (const club of clubs) {
    const m = bestMatch(club);
    if (!m) {
      manifest.push({ lgId: club.lgId, club: club.n, div: club.div, file: null, source: null });
      continue;
    }
    const file = `${club.lgId.toLowerCase()}-${slug(club.n)}.png`;
    queue.push({ club, m, file });
  }
  let done = 0, ok = 0;
  const concurrency = 6;
  async function worker() {
    while (queue.length) {
      const job = queue.shift();
      const dest = path.join("assets", "escudos", job.file);
      const success = await download(job.m.url, dest);
      if (success) ok++;
      manifest.push({
        lgId: job.club.lgId, club: job.club.n, div: job.club.div, file: success ? job.file : null,
        source: job.m.url, sourceName: job.m.name,
      });
      done++;
      if (done % 50 === 0) console.log(`${done}/${done + queue.length}...`);
    }
  }
  await Promise.all(Array.from({ length: concurrency }, worker));
  manifest.sort((a, b) => a.lgId.localeCompare(b.lgId) || a.club.localeCompare(b.club));
  fs.writeFileSync("assets/escudos/crests.json", JSON.stringify(manifest, null, 2));
  console.log(`\nDescargados ${ok} de ${clubs.length}. Sin escudo: ${clubs.length - ok}.`);
  console.log("Faltantes:");
  for (const m of manifest) if (!m.file) console.log(`  ${m.lgId} ${m.club}`);
})();
