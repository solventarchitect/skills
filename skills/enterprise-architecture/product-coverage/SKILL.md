---
name: product-coverage
description: Compare how two or more products in the Blueprint Catalog cover a set of business capabilities, showing overlaps, gaps and the catalog's maturity and confidence judgments. Use for build-versus-buy, platform consolidation and vendor shortlists.
---

# Product coverage

## When to use

A shortlist of products (for example ServiceNow against Jira, or two utility customer systems) and the question
"which capabilities does each cover, where do they overlap, and where is nobody?"

## Steps

1. Resolve the products to `PR-…` ids with `catalog_search` and `kinds: ["product"]`, or browse
   `/api/v1/products.json`.
2. Compare: MCP `product_coverage` with `product_ids` (two to ten). HTTPS: fetch each
   `/api/v1/product/<PR-id>.json` and union their `product_capabilities[].business_capability_ids`; or take the
   edge list `/api/v1/export/product-capability-map.csv` (one row per product capability → business capability,
   with `maturity`).
3. Read the judgments the right way. `maturity` (`core`, `strong`, `partial`) is the catalog author's view of how
   well the product does that one thing. `confidence` (`high`, `medium`, `low`) says how well public vendor
   documentation backs the mapping; `sources[]` and `as_of` on the product say which pages were checked and when.
   Treat `low` as a lead to verify with the vendor, not a fact.
4. Group the result by L1 and L2 (every capability record has `l1_id` and `parent_id`). Report, per L2: products
   that cover it, the strongest maturity, and whether confidence is high.
5. For a scope the shortlist leaves empty, check who else covers it: `capability_crosswalk` on that capability
   lists every `realized_by` product in the catalog.

## Output

A table with one row per capability in scope and one column per product (maturity, confidence), then gaps (no
product), overlaps (two or more at `core`/`strong`), and the `as_of` dates. Credit the catalog and say the
mappings are the catalog author's reading of public documentation, not a vendor claim or an endorsement.

## Pitfalls

- The catalog has 48 products; absence from it is not absence from the market.
- Product and vendor names are used nominatively; do not present the catalog as affiliated with any vendor.
