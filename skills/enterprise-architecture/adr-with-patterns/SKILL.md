---
name: adr-with-patterns
description: Write an Architecture Decision Record (TM-10) that cites the Blueprint Catalog's design patterns and anti-patterns by id and link, with the capability the decision serves. Use when recording a design choice, trade-off or standard.
---

# ADR with patterns

## When to use

A decision needs recording (an integration style, a resilience approach, a data platform layering) and you want
it anchored to named patterns, the anti-patterns it avoids and the capability it serves.

## Steps

1. Name the capability the decision serves: `catalog_search` with `kinds: ["capability"]`, then `capability_get`.
2. Get the reading path for it: MCP `reading_path` with `capability_id`, or the `patterns`, `stacks` and `books`
   lists in `/api/v1/capability/<id>.json` → `crosswalk`. Each entry links to `/library#<id>`.
3. Find the patterns the options embody: `catalog_search` with `kinds: ["pattern"]` (51 patterns in resilience,
   scalability, integration, domain modeling, data, security, deployment, cloud, observability, organization). Each
   pattern in `/api/v1/patterns.json` has `when` (the trade-off it answers), `related_ids` and one canonical `url`.
4. Find the anti-patterns the options risk: `catalog_search` with `kinds: ["anti-pattern"]`;
   `/api/v1/anti-patterns.json` gives `symptom`, `cost`, `remedy` and the `patterns` that cure each one.
5. Copy `/templates/architecture-decision-record.md` (template TM-10) and fill it: context, options considered (name
   the pattern each option is, by id), decision, consequences (name the anti-patterns avoided or accepted, by id),
   and the capability served. Link ids as `https://catalog.mikereams.com/library#DP-nnn` and
   `https://catalog.mikereams.com/capabilities/BC-…`.

## Output

The ADR, with every catalog id checked against the API and the catalog credited once.

## Pitfalls

- Cite the pattern's canonical `url` for its definition; the catalog entry is a one-paragraph summary in the
  catalog author's words, not the source.
- A pattern's `when` is the trade-off; if the ADR cannot state the trade-off, the pattern is decoration.
