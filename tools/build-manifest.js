#!/usr/bin/env node
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

if (!fs.existsSync(EX_DIR)) {
  console.error(`Missing folder: ${EX_DIR}`);
  process.exit(1);
}

const files = fs.readdirSync(EX_DIR).filter(f => f.toLowerCase().endsWith(".html"));

const sessions = new Map(); // sessionNumber -> items[]
for (const f of files) {
  const m = f.match(re);
  if (!m) continue;

  const sNum = toInt(m[1]);
  const btNum = toInt(m[2]);
  if (sNum == null || btNum == null) continue;

  if (!sessions.has(sNum)) sessions.set(sNum, []);
  sessions.get(sNum).push({
    title: `BT ${btNum}`,
    file: `exercises/${f}`,
    order: btNum
  });
}

const manifest = Array.from(sessions.entries())
  .sort((a, b) => a[0] - b[0])
  .map(([sNum, items]) => ({
    session: `Session ${sNum}`,
    order: sNum,
    items: items
      .sort((a, b) => a.order - b.order)
      .map(({ order, ...rest }) => rest)
  }));

fs.writeFileSync(
  OUT,
  JSON.stringify({ generatedAt: new Date().toISOString(), sessions: manifest }, null, 2),
  "utf8"
);

console.log(`Wrote manifest.json with ${manifest.length} session(s).`);
