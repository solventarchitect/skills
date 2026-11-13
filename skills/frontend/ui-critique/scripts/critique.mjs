#!/usr/bin/env node
// ui-critique runner: screenshots + measured checks + copy lint for one URL at several widths.
// Run from the app's root so Playwright resolves from the app's own node_modules (no new dependency):
//   node <skill>/scripts/critique.mjs http://localhost:3000/ [--out .ui-critique] [--widths 1440,768,390] [--config .ui-critique.json]
// Writes <out>/<width>-fold.jpg, <width>-full.jpg, report.json, report.md. Read-only towards the page.
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const opt = (name, dflt) => { const i = args.indexOf(`--${name}`); return i >= 0 ? args[i + 1] : dflt; };
const url = args.find((a) => /^https?:\/\//.test(a) || a.startsWith('file:'));
if (!url || args.includes('--help')) {
  console.log('usage: node critique.mjs <url> [--out .ui-critique] [--widths 1440,768,390] [--config .ui-critique.json]');
  process.exit(url ? 0 : 2);
}
if (!/^(https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\/|file:)/.test(url) && !args.includes('--allow-remote')) {
  console.error('Refusing a non-local URL. Pass --allow-remote for a deployed preview you own.');
  process.exit(2);
}

// Playwright from the app's node_modules
let chromium;
try {
  const req = createRequire(resolve(process.cwd(), 'package.json'));
  ({ chromium } = req('@playwright/test'));
} catch {
  try { ({ chromium } = createRequire(resolve(process.cwd(), 'package.json'))('playwright')); }
  catch { console.error('Playwright not found in this app. Run from an app root that has @playwright/test installed.'); process.exit(2); }
}

const defaults = JSON.parse(readFileSync(join(here, 'thresholds.json'), 'utf8'));
const cfgPath = opt('config', '.ui-critique.json');
const cfg = { ...defaults, ...(existsSync(cfgPath) ? JSON.parse(readFileSync(cfgPath, 'utf8')) : {}) };
const widths = (opt('widths') || cfg.widths.join(',')).split(',').map(Number);
const out = opt('out', '.ui-critique');
mkdirSync(out, { recursive: true });
const probe = readFileSync(join(here, 'probe.js'), 'utf8');

// Exceptions must carry a reason: {"check": "small-caps-captions", "reason": "..."} allows a whole check;
// {"check": "copy-buzzwords", "word": "robust", "reason": "..."} allows one word. Entries without a reason are ignored.
const allowList = (cfg.allow || []).filter((a) => a && a.check && typeof a.reason === 'string' && a.reason.trim());
const ignoredAllow = (cfg.allow || []).length - allowList.length;
const allowedWords = new Set(allowList.filter((a) => a.check === 'copy-buzzwords' && a.word).map((a) => a.word.toLowerCase()));
const checkAllow = (id) => allowList.find((a) => a.check === id && !a.word);

const lintCopy = (m) => {
  const text = m.text.toLowerCase();
  const found = cfg.bannedWords.filter((w) => !allowedWords.has(w) && new RegExp(`\\b${w.replace(/-/g, '[- ]')}\\b`).test(text));
  const vague = m.buttons.filter((b) => cfg.vagueLabels.includes(b.toLowerCase()));
  const proof = cfg.fakeProofPatterns.filter((p) => new RegExp(p, 'i').test(m.text));
  const notJust = /\bnot (just|only|merely) [^.]{1,60}[,—-]+ (it'?s|we'?re|but)\b/i.test(m.text);
  const lorem = /lorem ipsum/i.test(m.text);
  const emDashes = (m.text.match(/—/g) || []).length;
  return { buzzwords: found, vagueLabels: [...new Set(vague)], fakeProof: proof, notJustX: notJust, lorem, emDashes };
};

const checksFor = (m, copy) => {
  const c = [];
  const add = (id, ok, detail, level = 'warn') => {
    const a = !ok && level !== 'fail' ? checkAllow(id) : null; // failures can't be allowed away
    c.push(a ? { id, status: 'allowed', detail: `${detail} (allowed: ${a.reason})` } : { id, status: ok ? 'pass' : level, detail });
  };
  add('no-horizontal-scroll', !m.overflowX, m.overflowX ? 'page scrolls sideways' : 'none', 'fail');
  add('type-sizes', m.fontSizes.length <= cfg.maxFontSizes, `${m.fontSizes.length} sizes: ${m.fontSizes.map((s) => s.px).join(', ')}px`);
  add('left-edges', m.leftEdges.length <= cfg.maxLeftEdges, `${m.leftEdges.length} edges at x=${m.leftEdges.map((e) => e.x).join(', ')}`);
  add('centred-text', m.centredShare <= cfg.maxCentredShare, `${Math.round(m.centredShare * 100)}% of ${m.textBlocks} text blocks centred`);
  add('one-h1', m.h1Count === 1, `${m.h1Count} visible h1`);
  add('h1-length', !m.h1 || m.h1.lines <= cfg.maxH1Lines, m.h1 ? `${m.h1.lines} lines: "${m.h1.text}"` : 'no h1');
  add('empty-bands', m.emptyBands.length === 0, m.emptyBands.length ? m.emptyBands.map((g) => `${g.height}px at y=${g.from}`).join('; ') : 'none');
  const md = m.margins.left != null && m.margins.right != null ? Math.abs(m.margins.left - m.margins.right) : 0;
  add('even-margins', md <= cfg.maxMarginDifferencePx, `left ${m.margins.left}px, right ${m.margins.right}px`);
  add('small-caps-captions', m.smallCapsCaptions <= cfg.maxSmallCapsCaptions, `${m.smallCapsCaptions} small tracked uppercase captions`);
  add('tap-targets', m.smallTargets === 0, `${m.smallTargets} controls under 24x24px`, m.viewport.width < 500 ? 'fail' : 'warn');
  add('img-alt', m.imgNoAlt === 0, `${m.imgNoAlt} images without alt`, 'fail');
  add('copy-buzzwords', copy.buzzwords.length === 0, copy.buzzwords.join(', ') || 'none');
  add('copy-vague-labels', copy.vagueLabels.length === 0, copy.vagueLabels.join(', ') || 'none');
  add('copy-fake-proof', copy.fakeProof.length === 0, copy.fakeProof.length ? 'check claims are real' : 'none');
  add('copy-not-just-x', !copy.notJustX, copy.notJustX ? '"not just X, it\'s Y" found' : 'none');
  add('copy-lorem', !copy.lorem, copy.lorem ? 'lorem ipsum on page' : 'none', 'fail');
  add('copy-em-dashes', copy.emDashes <= cfg.maxEmDashes, `${copy.emDashes} em dashes`);
  return c;
};

const browser = await chromium.launch();
const report = { url, at: new Date().toISOString(), widths: {} };
try {
  for (const w of widths) {
    const ctx = await browser.newContext({ viewport: { width: w, height: w < 500 ? 844 : 900 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
    await page.evaluate(() => document.fonts && document.fonts.ready);
    await page.screenshot({ path: join(out, `${w}-fold.jpg`), type: 'jpeg', quality: 80 });
    await page.screenshot({ path: join(out, `${w}-full.jpg`), type: 'jpeg', quality: 70, fullPage: true });
    const m = await page.evaluate(probe);
    const copy = lintCopy(m);
    const rest = { ...m };
    delete rest.text; // the page text was only needed for the copy lint
    report.widths[w] = { metrics: rest, copy, checks: checksFor(m, copy) };
    await ctx.close();
  }
} finally {
  await browser.close();
}

writeFileSync(join(out, 'report.json'), JSON.stringify(report, null, 1));
const lines = [`# ui-critique: ${url}`, '', `${report.at}`, ''];
for (const [w, r] of Object.entries(report.widths)) {
  lines.push(`## ${w}px`, '', '| Check | Status | Detail |', '|---|---|---|');
  for (const c of r.checks) lines.push(`| ${c.id} | ${c.status} | ${String(c.detail).replace(/\|/g, '/')} |`);
  lines.push('');
}
const all = Object.values(report.widths).flatMap((r) => r.checks);
const n = (s) => all.filter((c) => c.status === s).length;
if (ignoredAllow) lines.push(`Note: ${ignoredAllow} allow entr${ignoredAllow === 1 ? 'y' : 'ies'} in the config ${ignoredAllow === 1 ? 'has no reason and was' : 'have no reason and were'} ignored.`, '');
lines.push(`**Summary:** ${n('fail')} fail · ${n('warn')} warn · ${n('allowed')} allowed · ${n('pass')} pass. Measured checks only; judge the screenshots with references/rubric.md.`);
writeFileSync(join(out, 'report.md'), lines.join('\n'));
console.log(lines.at(-1));
console.log(`Screenshots and report in ${out}/`);
process.exitCode = n('fail') ? 1 : 0;
