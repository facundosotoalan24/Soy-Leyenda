const fs = require("fs");

const COUNTRIES = {
  ENG: "england",
  ESP: "spain",
  ITA: "italy",
  GER: "germany",
  FRA: "france",
  POR: "portugal",
  NED: "netherlands",
  BRA: "brazil",
  ARG: "argentina",
  TUR: "turkey",
  ARA: "saudi-arabia",
};

const BASE = "https://football-logos.cc";

function parsePage(html, country) {
  const entries = [];
  const scripts = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  const main = scripts.map((s) => {
    try { return JSON.parse(s[1]); } catch { return null; }
  }).find((j) => j && j.mainEntity && j.mainEntity.itemListElement);
  const nameBySlug = new Map();
  if (main) {
    for (const li of main.mainEntity.itemListElement) {
      const u = li.url || "";
      const slug = u.split("/").filter(Boolean).pop();
      const name = (li.item && li.item.name || "").replace(/ Logo$/, "").trim();
      if (slug && name) nameBySlug.set(slug, name);
    }
  }
  const re = new RegExp(`https://assets\\.football-logos\\.cc/logos/${country}/256x256/([^"'\\s]+?)\\.[a-f0-9]+\\.png`, "g");
  const seen = new Set();
  for (const m of html.matchAll(re)) {
    const slug = m[1];
    if (seen.has(slug)) continue;
    seen.add(slug);
    entries.push({ slug, name: nameBySlug.get(slug) || slug, url: m[0] });
  }
  return entries;
}

(async () => {
  const index = {};
  for (const [id, country] of Object.entries(COUNTRIES)) {
    const html = await (await fetch(`${BASE}/${country}/`)).text();
    const entries = parsePage(html, country);
    index[id] = entries;
    console.log(id, country, entries.length);
    fs.writeFileSync(`scripts/index-${id}.json`, JSON.stringify(entries, null, 2));
  }
  fs.writeFileSync("scripts/logo-index.json", JSON.stringify(index, null, 2));
  console.log("total", Object.values(index).reduce((a, b) => a + b.length, 0));
})();
