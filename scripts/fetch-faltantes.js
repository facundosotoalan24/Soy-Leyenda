const fs = require("fs");
const path = require("path");

const MISSING = {
  "Al-Adalah": "https://r2.thesportsdb.com/images/media/team/badge/ugjap61737684503.png",
  "Al-Zulfi": "https://r2.thesportsdb.com/images/media/team/badge/zg8k731737689709.png",
  "Al-Jubail": "https://r2.thesportsdb.com/images/media/team/badge/7b4ird1737690523.png",
  "Al-Safa": "https://r2.thesportsdb.com/images/media/team/badge/vh48ud1737688877.png",
};
const WIKI = {
  "Al-Ansar": "https://upload.wikimedia.org/wikipedia/en/2/2c/Al-Ansar_FC_logo.png",
};

function slug(s) {
  return String(s).toLowerCase().normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "").replace(/&/g, "and")
    .replace(/['’]/g, "").replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

(async () => {
  const manifestPath = "assets/escudos/crests.json";
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  for (const [club, url] of Object.entries(MISSING)) {
    const file = `ara-${slug(club)}.png`;
    const r = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        "Accept": "image/*,*/*;q=0.8",
      },
    });
    if (!r.ok) {
      console.log("FALLO", club, r.status);
      continue;
    }
    fs.writeFileSync(path.join("assets", "escudos", file), Buffer.from(await r.arrayBuffer()));
    const entry = manifest.find((x) => x.lgId === "ARA" && x.club === club);
    if (entry) {
      entry.file = file;
      entry.source = url;
      entry.sourceName = club + " (TheSportsDB)";
    }
    console.log("OK", club, file);
  }
  for (const [club, url] of Object.entries(WIKI)) {
    const file = `ara-${slug(club)}.png`;
    const r = await fetch(url, {
      headers: {
        "User-Agent": "MiCarrera/1.0 (personal game; contact: local)",
        "Referer": "https://en.wikipedia.org/",
        "Accept": "image/*,*/*;q=0.8",
      },
    });
    if (!r.ok) {
      console.log("FALLO", club, r.status);
      continue;
    }
    fs.writeFileSync(path.join("assets", "escudos", file), Buffer.from(await r.arrayBuffer()));
    const entry = manifest.find((x) => x.lgId === "ARA" && x.club === club);
    if (entry) {
      entry.file = file;
      entry.source = url;
      entry.sourceName = club + " (Wikipedia)";
    }
    console.log("OK", club, file);
  }
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
})();
