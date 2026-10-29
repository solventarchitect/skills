---
name: capability-mapping
description: Map a list of applications, products or team responsibilities onto Blueprint Catalog business capabilities, flag ambiguous matches, and produce the capability heat-map CSV (TM-20) ready to discuss. Use for application portfolio assessments, CMDB business-capability modeling and heat maps.
---

# Capability mapping

## When to use

You have an inventory (applications, SaaS products, vendor modules, or a team's list of "what we do") and need each
item placed on one or more business capabilities, at the right level, with a heat map to review with the business.

## Steps

1. Get the tree once: `capability_tree` with no arguments (every L1 with macro domain and industry), or
   `/api/v1/tree-lite.json` (every node with `parent_id`, `child_ids`, `industry`, `macro_id`). Pick the lens:
   cross-industry L1s (ids in the hundreds) apply to everyone; industry blocks (ids from 1100 up) only to that industry.
2. For each inventory item, find candidates: `catalog_search` with `kinds: ["capability"]` using the item's
   function words, not its product name ("expense claims", not "Concur"). If the item is a known product, try
   `catalog_search` with `kinds: ["product"]` first: a catalog product already carries `product_capabilities[]` with
   `business_capability_ids`, which is a ready-made mapping with `maturity` and `confidence`.
3. Place each item at L2 by default; go to L3 only when the item does one specific thing. Read the candidate's
   `in_scope` and `out_of_scope` with `capability_get`; an `out_of_scope` line that names the item's function points
   you to the right capability.
4. Mark ambiguity rather than guessing: an item that could sit under two L2s gets both with a note, or the L1 with a
   note that it needs the owner's call.
5. Write the heat map: copy `/templates/capability-heat-map.csv` (template TM-20) and add one row per capability
   you will discuss, with `id`, `name`, `level`, `parent_id` from the catalog and your own `owner`,
   `strategic_importance` (1–5), `current_performance` (1–5), `investment_trend` (up/flat/down), `risk`
   (low/medium/high), `applications` (the items you mapped) and `notes`.
   A finished one to compare against: `/examples/northwind-harbor/capability-heat-map.csv`, pre-filled from the
   fictional worked example (`example_portfolio_get` or `/api/v1/example/northwind-harbor.json`), whose `overlaps`,
   `gaps` and `contested_masters` show what the review should surface.
6. Check every id you wrote resolves: `/api/v1/capability/<id>.json` returns 200 and `status: "active"`.

## Output

The filled CSV, plus a short list of items you could not place and why. Keep the catalog id on every row so the
map can be re-imported after the next catalog release (ids never change; merged ids still resolve to a successor).

## Pitfalls

- Do not name capabilities after applications (anti-pattern AP-100) or make the map mirror the org chart (AP-080).
- A process is not a capability (AP-090): "process invoices" maps to a Payables capability, not a new node.
- Industry blocks are source-reviewed or draft (see `review_status` in `/api/v1/industries.json`); say so when you
  rely on one.
