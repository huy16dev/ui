#!/usr/bin/env node
/**
 * GitHub Pages-friendly manifest generator.
 * Naming: exercises/{session}-{bt}.html, e.g. exercises/1-2.html
 */
const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const EX_DIR = path.join(ROOT, "exercises");
const OUT = path.join(ROOT, "manifest.json");

const re = /^(\d+)-(\d+)\.html$/i;

function toInt(s) {
  const n = Number.parseInt(s, 10);
  return Number.isFinite(n) ? n : null;
}

function safeReadTitle(fullPath) {
  // Optional: try to extract <title>...</title> to show nicer names
  try {
    const html = fs.readFileSync(fullPath, "utf8");
    const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    if (!m) return null;
    const title = m[1].replace(/\s+/g, " ").trim();
    return title || null;
  } catch {
    return null;
  }
}

if (!fs.existsSync(EX_DIR)) {
  console.error(`Missing folder: ${EX_DIR}`);
  process.exit(1);
}

const files = fs.readdirSync(EX_DIR).filter(f => f.toLowerCase().endsWith(".html"));

const sessions = new Map();
for (const f of files) {
  const m = f.match(re);
  if (!m) continue;

  const sNum = toInt(m[1]);
  const btNum = toInt(m[2]);
  if (sNum == null || btNum == null) continue;

  const full = path.join(EX_DIR, f);
  const niceTitle = safeReadTitle(full); // nếu có <title> thì dùng

  if (!sessions.has(sNum)) sessions.set(sNum, []);
  sessions.get(sNum).push({
    title: niceTitle ? niceTitle : `BT ${btNum}`,
    file: `exercises/${f}`,
    bt: btNum
  });
}

const manifest = Array.from(sessions.entries())
  .sort((a, b) => a[0] - b[0])
  .map(([sNum, items]) => ({
    session: `Session ${sNum}`,
    order: sNum,
    items: items
      .sort((a, b) => a.bt - b.bt)
      .map(({ bt, ...rest }) => rest)
  }));

fs.writeFileSync(
  OUT,
  JSON.stringify(
    { generatedAt: new Date().toISOString(), naming: "{session}-{bt}.html", sessions: manifest },
    null,
    2
  ),
  "utf8"
);

console.log(`Wrote ${OUT} with ${manifest.length} session(s).`);
