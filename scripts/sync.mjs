#!/usr/bin/env node
/**
 * Keeps this repo in step with the skills Mike publishes on mikereams.com/ai.
 *
 *   node scripts/sync.mjs            # fetch every original and write it under skills/
 *   node scripts/sync.mjs --check    # change nothing; exit 1 if any file differs or is missing
 *   node scripts/sync.mjs --index <url>   # read another index (for example a deploy preview)
 *
 * The source of truth is the index at https://mikereams.com/ai/skills.json: for each original skill
 * it lists `files` (absolute URLs to the one published copy, on mikereams.com or on the Blueprint
 * Catalog) and `repo_path` (where they land here). Nothing in this repo is edited by hand except
 * README.md, LICENSE and this script. Node 22, no dependencies, run by hand.
 */
import { mkdir, readFile, writeFile, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const check = args.includes("--check");
const indexUrl = args.includes("--index") ? args[args.indexOf("--index") + 1] : "https://mikereams.com/ai/skills.json";
const ALLOWED_HOSTS = new Set(["mikereams.com", "catalog.mikereams.com"]);

/** The path of a published file inside its skill folder: everything after `/<name>/`. */
export function relativeFile(url, name) {
  const u = new URL(url);
  if (!ALLOWED_HOSTS.has(u.hostname)) throw new Error(`${name}: ${url} is not on mikereams.com or catalog.mikereams.com`);
  const marker = `/${name}/`;
  const at = u.pathname.indexOf(marker);
  if (at < 0) throw new Error(`${name}: ${url} has no /${name}/ segment`);
  const rel = decodeURIComponent(u.pathname.slice(at + marker.length));
  if (!rel || rel.includes("..") || rel.startsWith("/")) throw new Error(`${name}: unsafe path ${rel}`);
  return rel;
}

/** A licence note for skills that are not under this repo's MIT licence (the catalog skills). */
export function licenceNote(skill) {
  // MIT skills (code-review's bundled parts are listed in its own NOTICE) sit under this repo's LICENSE.
  if (skill.license.startsWith("MIT")) return null;
  return [
    `# Licence: ${skill.license}`,
    "",
    `\`${skill.name}\` is published by Mike Reams under ${skill.license}${skill.license === "CC BY 4.0" ? " (https://creativecommons.org/licenses/by/4.0/)" : ""}, not this repo's MIT licence.`,
    "",
    `Source: ${skill.files[0]}`,
    `Page: ${skill.page}`,
    "",
    "Keep the credit and the source link when you reuse or adapt it.",
    "",
  ].join("\n");
}

async function fetchText(url) {
  const res = await fetch(url, { headers: { accept: "text/plain, text/markdown, application/json" } });
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
  return (await res.text()).replace(/\r\n/g, "\n");
}

async function main() {
  const index = JSON.parse(await fetchText(indexUrl));
  const originals = index.skills.filter((s) => s.origin === "original");
  if (originals.length === 0) throw new Error(`${indexUrl}: no original skills`);
  const drift = [];
  let written = 0;

  for (const skill of originals) {
    if (!/^skills\/[a-z0-9-]+\/[a-z0-9-]+\/$/.test(skill.repo_path ?? "")) throw new Error(`${skill.name}: bad repo_path ${skill.repo_path}`);
    const dir = path.join(ROOT, skill.repo_path);
    const wanted = [];
    for (const url of skill.files) wanted.push([relativeFile(url, skill.name), await fetchText(url)]);
    const note = licenceNote(skill);
    if (note) wanted.push(["LICENSE.md", note]);

    for (const [rel, body] of wanted) {
      const file = path.join(dir, rel);
      const current = existsSync(file) ? (await readFile(file, "utf8")).replace(/\r\n/g, "\n") : null;
      if (current === body) continue;
      drift.push(`${skill.repo_path}${rel}${current === null ? " (missing)" : ""}`);
      if (!check) {
        await mkdir(path.dirname(file), { recursive: true });
        await writeFile(file, body);
        written++;
      }
    }
  }

  // Folders here that the index no longer lists: reported, never deleted by the script.
  const listed = new Set(originals.map((s) => s.repo_path));
  const strays = [];
  if (existsSync(path.join(ROOT, "skills"))) {
    for (const cat of await readdir(path.join(ROOT, "skills"), { withFileTypes: true })) {
      if (!cat.isDirectory()) continue;
      for (const s of await readdir(path.join(ROOT, "skills", cat.name), { withFileTypes: true })) {
        if (s.isDirectory() && !listed.has(`skills/${cat.name}/${s.name}/`)) strays.push(`skills/${cat.name}/${s.name}/`);
      }
    }
  }

  console.log(`${originals.length} skills from ${indexUrl}`);
  if (strays.length) console.log(`not in the index (remove by hand if retired): ${strays.join(", ")}`);
  if (check) {
    if (drift.length) {
      console.log(`drift in ${drift.length} file(s):\n  ${drift.join("\n  ")}`);
      process.exitCode = 1;
    } else console.log("in step: no drift");
  } else console.log(written ? `wrote ${written} file(s)` : "already in step");
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((e) => {
    console.error(e.message);
    process.exitCode = 2;
  });
}
