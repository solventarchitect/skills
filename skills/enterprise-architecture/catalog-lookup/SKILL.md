---
name: catalog-lookup
description: Find a business capability, product, pattern, technology, framework, principle or glossary term in the Blueprint Catalog by name or alias and return its id, definition, scope and canonical link. Use before citing or linking any catalog entry.
---

# Catalog lookup

## When to use

Someone names a thing ("CMDB", "circuit breaker", "meter data management", "Kafka") and you need the catalog's
authoritative record for it: the id, the one-paragraph definition, what is in and out of scope, and the URL to link.

## Steps

1. Search. MCP: `catalog_search` with `query` and, if you know the kind, `kinds` (one or more of `capability`,
   `macro`, `value-stream`, `product`, `pattern`, `stack`, `book`, `technology`, `glossary`, `framework`,
   `anti-pattern`, `template`, `industry`, `principle`, `data-concept`). HTTPS: fetch `/api/v1/search-docs.json` once and match on `name` and
   `aliases` yourself. An exact name or alias match ranks first; prefer it over a fuzzy hit.
2. Fetch the record. By kind:
   - capability → `capability_get` or `/api/v1/capability/<BC-id>.json` (description, aliases, `in_scope`,
     `out_of_scope`, `csdm_note`, ancestors, children, crosswalk)
   - product → `product_get` or `/api/v1/product/<PR-id>.json`
   - value stream → `value_stream_get` or `/api/v1/value-stream/<VS-id>.json`
   - technology category or technology → `technology_get` or `/api/v1/technology/<id>.json`
   - pattern, stack, book, framework, anti-pattern, template, principle, data concept, domain event → `/api/v1/patterns.json`,
     `stacks.json`, `books.json`, `frameworks.json`, `anti-patterns.json`, `templates.json`, `principles.json`,
     `data-concepts.json`, `domain-events.json` (one file per kind; filter by id)
   - glossary term → `/api/v1/glossary/<GL-id>.json`
3. If a capability id answers with `status: "deprecated"`, use its `successor_id` and say so: the old id was merged.
4. Quote the definition in the catalog's words only when you attribute it; otherwise paraphrase. Always give the
   canonical page: `page_url` on the record, or `https://catalog.mikereams.com/capabilities/<id>` for a capability.

## Output

`id`, `name`, kind, the definition, scope lines where they exist, `page_url`, and (for a capability) its path from
the L1 down. One line of credit: "Blueprint Catalog, CC BY 4.0 © Mike Reams".

## Pitfalls

- Capability names repeat across industries (there are a few shared names); check the `industry` field and the path.
- `MDM` is Meter Data Management in the utilities lens; the data term is spelled out as Master Data Management.
- Search returns best matches first, not all matches; narrow with `kinds` before concluding something is absent.
