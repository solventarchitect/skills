---
name: calm-tagging
description: Tag a FINOS CALM architecture's nodes, relationships and flows with the Blueprint Catalog business capabilities, value stream stages and data concepts they support, using the Blueprint Catalog CALM Standard, and check every id exists. Use when a CALM model should be read against a shared business model.
---

# CALM tagging

## When to use

You have, or are writing, a CALM architecture (a JSON document of nodes, relationships and flows, CALM release 1.2)
and want each element to say which business capabilities, value stream stages and data concepts it supports, so the
system model can be read against the business and checked in a pipeline.

## Steps

1. Read the Standard once: `/calm/v1/blueprint-catalog.standard.json` (and `/calm/README.md`). Tags go in a
   `blueprint-catalog` entry of the element's `metadata`, because CALM flows accept no other extra properties.
2. For each node, find the capability it supports: `catalog_search` with `kinds: ["capability"]` using what the
   component does ("take card payments", not its product name). Prefer an L2 or L3; read `in_scope` and
   `out_of_scope` with `capability_get` before choosing. Add the ids to `business-capability-ids`.
3. For each database or service that is the system of record for business data, find the concept with
   `catalog_search` and `kinds: ["data-concept"]` (or `/api/v1/data-concepts.json`) and add its id to
   `data-concept-ids`. Two nodes that both master the same concept is a finding worth raising.
4. For each flow, find the value stream it serves with `catalog_search` and `kinds: ["value-stream"]`, then
   `value_stream_get` for its stages, and add the stage ids it covers to `value-stream-stage-ids`, with the
   capabilities the flow realizes in `business-capability-ids`.
5. Record the catalog version once at the architecture level: `catalog-release` from `/api/v1/version.json`.
6. Check: validate the file against CALM 1.2 and the Standard (any JSON Schema 2020-12 validator; compose an element
   with `#/$defs/node`, `#/$defs/relationship` or `#/$defs/flow` to require tags), then look up each id with
   `capability_get` or the API. An id that answers `status: "deprecated"` names its `successor_id`: use that.

## Output

The CALM file with tagged elements, and a short list of anything left untagged with the reason (no fitting
capability, or a decision for the element's owner).

## Notes

- Start from the example: `/calm/v1/examples/online-store-checkout.architecture.json` tags a fictional checkout with
  BC-670.10, VS-120.10 and DC-110, among others.
- Tags describe what an element supports, not who owns it; ownership belongs in your own metadata or Standard.
- CALM is a FINOS specification (Apache-2.0); the catalog is not affiliated with FINOS.
