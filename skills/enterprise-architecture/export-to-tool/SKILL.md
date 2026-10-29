---
name: export-to-tool
description: Get the Blueprint Catalog capability map into ServiceNow, LeanIX, Ardoq or an ArchiMate tool such as Archi, choosing the right export file and following the import notes. Use when loading or refreshing a capability model in an EA or CMDB tool.
---

# Export to a tool

## When to use

The capability map (all of it, or one L1 subtree) has to land in a tool: ServiceNow Business Capability records,
LeanIX fact sheets, Ardoq components, or an ArchiMate model.

## Steps

1. Pick the profile:

   | Target | Profile | File |
   |---|---|---|
   | ServiceNow (`cmdb_ci_business_capability` import set) | `servicenow` | `/api/v1/export/servicenow-business-capabilities.csv` |
   | LeanIX | `leanix` | `/api/v1/export/leanix-business-capabilities.csv` |
   | Ardoq | `ardoq` | `/api/v1/export/ardoq-capabilities.csv` |
   | Archi or any ArchiMate exchange-format importer | `archimate` | `/api/v1/export/archimate.xml` |
   | Anything else | `csv` | `/api/v1/export/capabilities.csv` |
   | Product → capability edges | `product-map` | `/api/v1/export/product-capability-map.csv` |

2. Get the file. MCP `export` with `profile` returns the download URL; with `l1_id` (a `BC-nnn` L1) it returns that
   subtree as CSV text inline for the CSV profiles. HTTPS: fetch the file; `/api/v1/export/index.json` lists them
   with sizes.
3. Read `/api/v1/export/README.md` for the tool's import steps: ServiceNow coalesces on `u_external_id` and
   resolves the parent in the transform; LeanIX references parents by display name (duplicates carry the id);
   Ardoq maps `Path` as a `Parent::Child` component path; Archi imports with File › Import › Open Exchange XML
   Model, and element identifiers are the catalog ids, so a later release re-imports onto the same elements.
4. Rows are parents first, so a single-file import never meets a child before its parent. Test on a non-production
   instance or workspace first.
5. On refresh, read `/api/v1/changes.json`: it lists each release's added, removed (with `successor_id`) and
   renamed ids, so you can retire merged records in the tool instead of duplicating them.

## Output

The file and the import steps for the target, plus the catalog version (`/api/v1/version.json`) recorded with the
import so the next refresh knows its baseline.

## Pitfalls

- Field names in a tenant may differ from the README's; export a template from the tenant first.
- The ArchiMate file has no views; draw them in the tool.
- Not affiliated with ServiceNow, LeanIX, Ardoq or The Open Group; names are used to say what the file is shaped for.
