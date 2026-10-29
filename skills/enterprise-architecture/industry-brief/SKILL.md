---
name: industry-brief
description: Produce a one-page brief on how the Blueprint Catalog covers an industry: its L1 capabilities, value streams, the products that reach into it, technology categories and governing standards, with the review status stated. Use to orient on a sector before a mapping or assessment.
---

# Industry brief

## When to use

Starting work in a sector the catalog covers (cross-industry, manufacturing, software, retail, communications,
utilities, financial-services) and needing the lay of the land in one page.

## Steps

1. List the industries: `/api/v1/industries.json` or MCP `macro_list` (industries with their L1s and
   `review_status`). `catalog_search` with `kinds: ["industry"]` also finds one by name.
2. Fetch the profile: `/api/v1/industry/<id>.json` → `l1[]` (with capability counts and `macro_id` for
   cross-industry), `value_streams[]`, `products[]` (ranked by how many product capabilities reach in),
   `technology_categories[]`, `frameworks[]` and `counts`.
3. For each L1 you will mention, take the one-paragraph description from `/api/v1/capability/<id>.json`; for each
   value stream, the `trigger` and `outcome` from `/api/v1/value-stream/<id>.json`.
4. State the review status plainly: `draft` (author-written, automated checks only), `source-reviewed` (checked by
   an independent review against public standards and regulator sources, not yet by a practitioner), `reviewed`
   (practitioner-reviewed), or none for cross-industry. The site shows the same label.
5. Add the standards: `frameworks[]` on the profile are the frameworks and standards that govern a capability in
   the industry; `/api/v1/frameworks.json` has each one's `use` and official `url`.

## Output

Headline counts, the L1 list with one line each, the value streams with trigger and outcome, the top products with
how many product capabilities reach in, technology categories, governing standards, and the review status with the
catalog version. Link `https://catalog.mikereams.com/industries/<id>`.

## Pitfalls

- "Products that reach in" is the catalog author's mapping from public documentation, not market share.
- Cross-industry capabilities apply to every industry; an industry page lists only that industry's own block plus
  what reaches into it.
