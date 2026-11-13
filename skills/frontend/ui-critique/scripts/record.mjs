#!/usr/bin/env node
// Record a scored critique (references/rubric.md, "Scoring") and print the trend for the same target.
//   node record.mjs --target "pricing section" --mode persuade --score 26 --na 7,10 --p0 0 --p1 2 [--out .ui-critique]
// --score is the sum over the heuristics you scored (each 0-4); --na lists heuristic numbers scored n/a.
// Appends one line to <out>/history.jsonl. Reads the last measured report.md summary if present.
import { appendFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const args = process.argv.slice(2);
const opt = (name, dflt) => { const i = args.indexOf(`--${name}`); return i >= 0 ? args[i + 1] : dflt; };
const target = opt('target');
const score = Number(opt('score'));
const mode = (opt('mode', '') || '').toLowerCase();
const na = (opt('na', '') || '').split(',').map((s) => s.trim()).filter(Boolean).map(Number);
const MODES = ['persuade', 'operate', 'read', 'experience'];
const bad = [];
if (!target) bad.push('--target is required');
if (!MODES.includes(mode)) bad.push(`--mode must be one of ${MODES.join(', ')}`);
if (na.some((h) => !Number.isInteger(h) || h < 1 || h > 10)) bad.push('--na takes heuristic numbers 1-10');
const max = 4 * (10 - new Set(na).size);
if (!Number.isFinite(score) || score < 0 || score > max) bad.push(`--score must be between 0 and ${max} (4 x ${10 - new Set(na).size} scored heuristics)`);
if (bad.length) { console.error(bad.join('\n')); process.exit(2); }

const out = opt('out', '.ui-critique');
mkdirSync(out, { recursive: true });
const reportMd = join(out, 'report.md');
const measured = existsSync(reportMd) ? (readFileSync(reportMd, 'utf8').match(/\*\*Summary:\*\* ([^.]+)/) || [])[1] || null : null;
const entry = {
  at: new Date().toISOString(), target, mode, score, max, na: [...new Set(na)].sort((a, b) => a - b),
  p0: Number(opt('p0', 0)), p1: Number(opt('p1', 0)), measured,
};
const hist = join(out, 'history.jsonl');
const prior = existsSync(hist)
  ? readFileSync(hist, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l)).filter((e) => e.target === target)
  : [];
appendFileSync(hist, JSON.stringify(entry) + '\n');
const fmt = (e) => `${e.score}/${e.max}`;
const trend = [...prior, entry].map(fmt).join(' → ');
const sameMax = [...prior, entry].every((e) => e.max === entry.max);
console.log(`${target} (${mode}): ${trend}${prior.length ? '' : '  (first run for this target, no trend yet)'}`);
if (!sameMax) console.log('Note: runs scored different heuristic sets, so totals are not like-for-like.');
console.log(`P0 ${entry.p0} · P1 ${entry.p1}${measured ? ` · measured: ${measured}` : ''}`);
