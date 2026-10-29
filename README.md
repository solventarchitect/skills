# Skills by Mike Reams

Agent skills for enterprise architecture and engineering review, the originals from
[mikereams.com/ai](https://mikereams.com/ai). Each folder is a `SKILL.md` (plus any files it uses) that works with
Claude Code and other agents that read the open skill format.

## Install

With the [skills CLI](https://skills.sh) (installs into the current project; add `-g` for every project):

```bash
npx skills add solventarchitect/skills --skill capability-mapping
```

Or copy a folder into your agent's skills directory, for example `.claude/skills/capability-mapping/`.
Read a skill before you install it.

## Skills

| Skill | What you get | Licence |
|---|---|---|
| [capability-mapping](skills/enterprise-architecture/capability-mapping/SKILL.md) | A capability heat map with every application placed, and what could not be placed | CC BY 4.0 |
| [product-coverage](skills/enterprise-architecture/product-coverage/SKILL.md) | A capability-by-product table with gaps and overlaps | CC BY 4.0 |
| [value-stream-worksheet](skills/enterprise-architecture/value-stream-worksheet/SKILL.md) | A filled value stream worksheet: stages, owners, pain points, capabilities | CC BY 4.0 |
| [export-to-tool](skills/enterprise-architecture/export-to-tool/SKILL.md) | The capability map as an import file for a CMDB, an EA tool or ArchiMate | CC BY 4.0 |
| [adr-with-patterns](skills/enterprise-architecture/adr-with-patterns/SKILL.md) | An ADR that cites its design patterns and anti-patterns by id | CC BY 4.0 |
| [lifecycle-check](skills/enterprise-architecture/lifecycle-check/SKILL.md) | End-of-life position for each technology in a stack | CC BY 4.0 |
| [industry-brief](skills/enterprise-architecture/industry-brief/SKILL.md) | One page on how a sector is covered, with its review status | CC BY 4.0 |
| [calm-tagging](skills/enterprise-architecture/calm-tagging/SKILL.md) | A FINOS CALM architecture tagged with capabilities, stages and data concepts | CC BY 4.0 |
| [catalog-lookup](skills/enterprise-architecture/catalog-lookup/SKILL.md) | The catalog's record for a term: id, definition, scope, link | CC BY 4.0 |
| [code-review](skills/review-qa/code-review/SKILL.md) | A coverage ledger of every changed file and a short list of re-checked findings | MIT, with bundled Apache-2.0 and MIT parts (see its NOTICE) |
| [diagrams](skills/diagrams/diagrams/SKILL.md) | A Mermaid block or a clean blueprint SVG, chosen by where the diagram will live | MIT |

The enterprise-architecture skills use the [Blueprint Catalog](https://catalog.mikereams.com), a free capability
catalog, through its read-only MCP server or HTTPS API. They need no key and nothing to install.

## Where these come from

This repo is a mirror. Each skill has one published copy, on [mikereams.com/ai](https://mikereams.com/ai) or the
Blueprint Catalog, and [`scripts/sync.mjs`](scripts/sync.mjs) copies it here from the list at
[mikereams.com/ai/skills.json](https://mikereams.com/ai/skills.json). Don't edit a skill here. Change it at its
source, then run:

```bash
node scripts/sync.mjs           # update the copies here
node scripts/sync.mjs --check   # exit 1 if anything here differs from the source
```

## Licence

MIT (see [LICENSE](LICENSE)), except where a folder has its own `LICENSE.md` or `NOTICE`: the enterprise-architecture
skills are CC BY 4.0 (keep the credit and source link), and `code-review` bundles third-party parts listed in its NOTICE.
