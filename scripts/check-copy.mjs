#!/usr/bin/env node
// Fails if source text contains an em dash or en dash.
// Project rule: no em dashes or en dashes in copy, comments or docs.
// Usage: node scripts/check-copy.mjs [folder ...]   (default: current folder)
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const EM = String.fromCharCode(0x2014);
const EN = String.fromCharCode(0x2013);
const SKIP = new Set(['node_modules', '.git', '.next', 'dist', 'build', 'coverage', '.claude']);
const EXT = new Set(['.md', '.mdx', '.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.json', '.css', '.html', '.sql', '.txt', '.yml', '.yaml']);

const roots = process.argv.slice(2);
if (roots.length === 0) roots.push('.');

let bad = 0;

function walk(dir) {
  for (const name of readdirSync(dir)) {
    if (SKIP.has(name)) continue;
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) walk(p);
    else if (EXT.has(extname(name))) scan(p);
  }
}

function scan(file) {
  const lines = readFileSync(file, 'utf8').split('\n');
  lines.forEach((line, i) => {
    if (line.includes(EM) || line.includes(EN)) {
      bad++;
      console.error(`${file}:${i + 1}: dash character found`);
    }
  });
}

for (const r of roots) walk(r);

if (bad > 0) {
  console.error(`\n${bad} line(s) with an em or en dash. Replace with a comma, colon or full stop, or write ranges in words.`);
  process.exit(1);
}
console.log('check-copy: no em or en dashes found');
