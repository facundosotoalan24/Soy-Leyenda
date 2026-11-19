const fs = require("fs");
const path = require("path");

const index = JSON.parse(fs.readFileSync("scripts/logo-index.json", "utf8"));
let tournamentHtml = "";
const tournamentUrl = new Map();
function countryUrl(id, slug) {
  const e = (index[id] || []).find((x) => x.slug === slug);
  return e ? e.url : null;
}

const SOURCES = {
  "premier-league": () => countryUrl("ENG", "english-premier-league"),
  "championship": () => countryUrl("ENG", "efl-championship"),
  "laliga": () => countryUrl("ESP", "la-liga"),
  "laliga-2": () => countryUrl("ESP", "la-liga-2"),
  "serie-a": () => countryUrl("ITA", "serie-a"),
  "serie-b": () => countryUrl("ITA", "serie-b"),
  "bundesliga": () => countryUrl("GER", "bundesliga"),
  "2-bundesliga": () => countryUrl("GER", "2-bundesliga"),
  "ligue-1": () => countryUrl("FRA", "ligue-1"),
  "ligue-2": () => countryUrl("FRA", "ligue-2"),
  "primeira-liga": () => countryUrl("POR", "primeira-liga"),
  "liga-portugal-2": () => countryUrl("POR", "liga-portugal-2"),
  "eredivisie": () => countryUrl("NED", "eredivisie"),
  "eerste-divisie": () => countryUrl("NED", "eerste-divisie"),
  "brasileirao": () => countryUrl("BRA", "brazilian-serie-a"),
  "brasileirao-b": () => countryUrl("BRA", "brazilian-serie-b"),
  "liga-profesional": () => countryUrl("ARG", "argentina-primera-division"),
  "primera-nacional": () => countryUrl("ARG", "primera-nacional"),
  "super-lig": () => countryUrl("TUR", "super-lig"),
  "tff-1-lig": () => countryUrl("TUR", "1st-lig"),
  "saudi-pro-league": () => countryUrl("ARA", "saudi-professional-league"),
  "saudi-first-division": () => countryUrl("ARA", "saudi-first-division-league"),

  "fa-cup": () => countryUrl("ENG", "emirates-fa-cup"),
  "copa-del-rey": () => countryUrl("ESP", "copa-del-rey"),
  "coppa-italia": () => countryUrl("ITA", "coppa-italia"),
  "dfb-pokal": () => countryUrl("GER", "dfb-pokal"),
  "coupe-de-france": () => countryUrl("FRA", "french-cup"),
  "taca-de-portugal": () => countryUrl("POR", "taca-de-portugal"),
  "knvb-beker": () => countryUrl("NED", "knvb-cup"),
  "copa-do-brasil": () => countryUrl("BRA", "copa-do-brasil"),
  "copa-argentina": () => countryUrl("ARG", "copa-argentina"),
  "turkiye-kupasi": () => countryUrl("TUR", "turkish-cup"),

  "champions-league": () => tournamentUrl.get("uefa-champions-league"),
  "europa-league": () => tournamentUrl.get("uefa-europa-league"),
  "conference-league": () => tournamentUrl.get("uefa-conference-league"),
  "libertadores": () => tournamentUrl.get("conmebol-libertadores"),
  "sudamericana": () => tournamentUrl.get("conmebol-copa-sudamericana"),
  "afc-champions-league": () => tournamentUrl.get("afc-champions-league-elite"),

  "mundial": () => tournamentUrl.get("fifa-world-cup-2026"),
  "copa-america": () => tournamentUrl.get("conmebol-copa-america-2024"),
  "eurocopa": () => tournamentUrl.get("uefa-euro-2024"),
  "copa-asiatica": () => tournamentUrl.get("afc-asian-cup"),
  "copa-oro": () => tournamentUrl.get("concacaf-gold-cup"),
};

const EXTRA = {
  // No hay logo de la King Cup en football-logos.cc: usamos un trofeo genérico.
  "king-cup": "https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/72x72/1f3c6.png",
  "premio": "https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/72x72/1f3c6.png",
};

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
  tournamentHtml = await (await fetch("https://football-logos.cc/tournaments/")).text();
  for (const m of tournamentHtml.matchAll(/https:\/\/assets\.football-logos\.cc\/logos\/tournaments\/256x256\/([^"'\s]+?)\.[a-f0-9]+\.png/g)) {
    if (!tournamentUrl.has(m[1])) tournamentUrl.set(m[1], m[0]);
  }
  fs.mkdirSync("assets/trofeos", { recursive: true });
  for (const [key, getUrl] of Object.entries(SOURCES)) {
    const url = getUrl();
    if (!url) {
      console.log(`SIN FUENTE ${key}`);
      continue;
    }
    const ok = await download(url, path.join("assets", "trofeos", `${key}.png`));
    console.log(`${ok ? "OK" : "FALLO"} ${key}`);
  }
  for (const [key, url] of Object.entries(EXTRA)) {
    const ok = await download(url, path.join("assets", "trofeos", `${key}.png`));
    console.log(`${ok ? "OK" : "FALLO"} ${key}`);
  }
})();
