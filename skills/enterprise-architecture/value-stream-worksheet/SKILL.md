---
name: value-stream-worksheet
description: Draft a value stream for an organization by starting from the nearest Blueprint Catalog value stream, then fill the Value Stream Worksheet (TM-30) with the organization's own stages, pain points and the capabilities each stage leans on.
---

# Value stream worksheet

## When to use

A team wants to model how work crosses capabilities to produce an outcome (order to cash, incident to resolution,
meter to cash) and needs a defensible starting point rather than a blank page.

## Steps

1. Find the nearest stream: `catalog_search` with `kinds: ["value-stream"]`, or scan `/api/v1/value-streams.json`
   (40 streams: 17 cross-industry, the rest per industry). Each has `trigger`, `outcome`, `aliases` and 4–8
   `stages`, each stage with `capability_ids`.
2. Fetch it: `value_stream_get` or `/api/v1/value-stream/<VS-id>.json`.
3. Copy `/templates/value-stream-worksheet.md` (template TM-30). Fill the header from the catalog stream
   (trigger, outcome), then rewrite the stages in the organization's words: keep, merge, split or add stages, and
   for each one record what is decided or produced, who owns it, the pain points, and the capabilities it leans on
   (start from the catalog's `capability_ids`, confirm each with `capability_get`).
   Note the domain events each catalog stage raises (`stages[].events`, detail in `/api/v1/domain-events.json`):
   they name the facts the organization's own stage must make true, which is a sharper test of a stage boundary
   than its activities.
4. Fill "Read across": capabilities that appear in three or more stages (investment or single-owner candidates),
   the stages with the most pain, and capabilities with no realizing application or more than one. The
   `capability_crosswalk` of each capability gives `realized_by` products as a prompt.
5. Keep the catalog stage ids (`VS-nn.mm`) in a note where a stage maps one-to-one, so the worksheet can be
   compared with the catalog later.

## Output

The filled worksheet, with the catalog stream named as the starting point and every capability id checked.

## Pitfalls

- Stages say what is produced, not who does it; roles belong in the owner column.
- Four to eight stages. More is a process map, not a value stream.
- Industry streams inherit the industry's `review_status`; a draft industry's stream is a starting point, not a
  reference.
