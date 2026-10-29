---
name: lifecycle-check
description: Report the release lifecycle and end-of-life position of the technologies in a stack from the Blueprint Catalog's endoflife.date snapshot. Use for technical debt reviews, upgrade planning and risk registers.
---

# Lifecycle check

## When to use

A list of technologies (runtimes, databases, frameworks, operating systems) and the question "which cycles are
still maintained, which ended, and what ends next?"

## Steps

1. Resolve each technology: `lifecycle_get` with `name` (for example "PostgreSQL") or `id` (`TE-postgresql`), or
   `/api/v1/technologies.json` to list all 94 with their `category_ids`. `catalog_search` with
   `kinds: ["technology"]` also finds categories (`TR-…`), which list their technologies.
2. Read the record: `/api/v1/technology/<TE-id>.json` → `lifecycle` has `source_url`, `fetched_at`, `summary`
   (`current`, `current_eol`, `lts`, `lts_eol`, `next_eol`, `supported_cycles`) and `cycles[]` with `cycle`,
   `released`, `lts`, `support_until`, `eol`, `extended_until`, `maintained`, `latest`. `lifecycle` is `null` for
   the technologies that announce no cycles.
3. Judge on the snapshot date, not today: `maintained` is true only when `eol` is after `fetched_at`
   (catalog 0.20.1 and later). `extended_until` is paid or extended support after `eol`; show it separately.
4. For a horizon question ("what ends in the next six months?"), `lifecycle_get` with `ending_before` (YYYY-MM-DD)
   and no id lists the soonest ends of life first.
5. Match the organization's versions to `cycles[].cycle`; a version older than the oldest listed cycle ended
   before the snapshot's two most recent ended cycles and is out of support.

## Output

A table per technology: version in use, its cycle's `eol`, `maintained`, `extended_until`, the current and LTS
cycles, and `next_eol`. State the snapshot date and the credit "Lifecycle dates: endoflife.date (MIT)".

## Pitfalls

- The snapshot is refreshed before each catalog release, not daily; say when it was fetched.
- Commercial products with no public lifecycle page are listed without dates; that is not "no end of life".
