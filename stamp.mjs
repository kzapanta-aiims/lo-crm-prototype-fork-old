// Node twin of stamp.py, for machines without Python. Same job: rewrite every
// page's css/ and js/ links to ...?v=<content hash> so a changed file is a new
// URL and a browser holding the old copy has to fetch it. Safe to run twice.
//
//     node stamp.mjs
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';

const LINK = /((?:href|src)=")((?:css|js)\/[A-Za-z0-9_.-]+\.(?:css|js))(\?v=[A-Za-z0-9]+)?(")/g;
const cache = new Map();
let touched = 0;

for (const page of readdirSync('.').filter(f => f.endsWith('.html')).sort()) {
  const text = readFileSync(page, 'utf8');
  const next = text.replace(LINK, (whole, attr, rel, _old, close) => {
    if (!existsSync(rel)) { console.log(`  ! ${page}: ${rel} is missing, left alone`); return whole; }
    if (!cache.has(rel)) cache.set(rel, createHash('sha1').update(readFileSync(rel)).digest('hex').slice(0, 8));
    return `${attr}${rel}?v=${cache.get(rel)}${close}`;
  });
  if (next !== text) { writeFileSync(page, next); touched++; console.log(`  stamped ${page}`); }
}
if (!touched) console.log('  everything already current');
console.log(`\n${cache.size} asset(s), ${touched} page(s) rewritten`);
