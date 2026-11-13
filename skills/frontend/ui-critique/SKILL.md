---
name: ui-critique
description: Use before designing a public page (subject inventory + argument) and after building any page or app screen (screenshots at three widths, measured layout and copy checks, a scored critique, fix the top three, up to three rounds). Also for named design moves on one target (bolder, quieter, distill, typeset, layout, colorize, clarify, adapt, onboard, harden, polish), when a page "looks generic" or "AI-made", or before a UI milestone sign-off.
---

> Method adapted from Leonxlnx/taste-skill (MIT), with ideas from pbakaus/impeccable (Apache-2.0); see `NOTICE`.
> It is brand-aware (a brand's own signatures are allowed, see `references/tells.md`), uses Playwright from the app's
> own `node_modules` (no new dependency), reads local URLs only by default and writes nothing outside the app. The
> project's own instructions, the app's `DESIGN.md` and its design system win over this skill.

# UI Critique

Decide what a surface must do **before** it is designed, and judge what was built **from the pixels**, not from
the code you wrote.

## Guardrails

- **The brief wins.** A pinned look, era, palette or font is followed even when `references/tells.md` warns about it.
  Steering a clear brief toward your own taste is a failure.
- **Refinement preserves; redesign replaces.** A refinement keeps the existing identity, behaviour, copy and
  everything outside the target; ask before changing factual copy or adding claims. A redesign keeps content,
  function and constraints but replaces the look entirely (and updates `DESIGN.md`). Never polish half of a look you
  are replacing.
- **Narrow targets.** One section or component reviewed closely beats a whole page at a glance.

## Choose the mode first

The mode is what success looks like for the visitor on **this surface** (not the product as a whole).

| Mode | Surfaces | Ambition shows as | Before design | Critique |
|---|---|---|---|---|
| **Persuade** | landing, marketing, pricing, campaigns | a committed idea and real imagery | `references/argument.md` | all rubric passes |
| **Operate** | app UI, dashboards, admin, settings, editors, tools | precision, consistency, restraint | `references/app-screens.md` | passes 2, 4-7, 10, 12-14 |
| **Read** | docs, articles, posts, guides, changelogs | structure for comprehension, comfortable reading | outline the reader's questions | passes 1, 2, 4-7, 10-14 |
| **Experience** | portfolio, gallery, showcase | the work leads; the interface recedes | pick the 3-5 works that carry it | passes 1-3, 5, 8, 10, 11, 14 |

A tool's landing page is Persuade; its docs are Read; its app is Operate.

## After building: the loop

1. **Capture and measure.** Start the app (or use a deployed preview you own), then from the app root:

   ```bash
   node <path-to-skill>/scripts/critique.mjs http://localhost:3000/<path> --out .ui-critique
   ```

   Default widths 1440, 768, 390 (`--widths`); `--allow-remote` only for a preview URL you own. Writes fold and
   full-page screenshots, `report.json` and `report.md` to `.ui-critique/` (add that folder to the app's `.gitignore`).
   Per-app limits and exceptions go in `<app>/.ui-critique.json`, which overrides `scripts/thresholds.json`.

2. **Read the measured report.** `fail` items are fixed first. `warn` items need a fix or an exception with a reason:
   `"allow": [{"check": "small-caps-captions", "reason": "mono labels are a brand signature"}]` or, for one word,
   `{"check": "copy-buzzwords", "word": "robust", "reason": "..."}`. Entries without a reason are ignored; failures
   can't be allowed away.

3. **Judge and score the screenshots** with `references/rubric.md`: the passes for the mode, then the 0-4 heuristic
   scores and P0-P3 findings. Record the score so later runs show a trend:

   ```bash
   node <path-to-skill>/scripts/record.mjs --target "pricing section" --mode persuade --score 26 --na 7,10 --p0 0 --p1 2
   ```

4. **Fix the top three** (P0 first), re-run steps 1-3, look again. **Stop after three rounds**, or earlier when
   nothing above P2 remains. Report what you fixed and left, with the before/after summary and score trend.

## Named moves

When asked to make a target bolder, quieter, simpler, better typeset, better laid out, more colourful, clearer,
responsive, friendlier on first run, production-hardened or polished, use the matching playbook in
`references/moves.md` (`harden` has its own checklist in `references/harden.md`). One move, one target, then run the
loop on that target.

## What the measured checks cover

| Check | Default limit | Why |
|---|---|---|
| Sideways scroll | none (fail) | Broken layout |
| Type sizes | ≤ 7 distinct | Many near-equal sizes = no hierarchy |
| Left edges (left-aligned text) | ≤ 4 | Things placed one at a time instead of on a grid |
| Centred text | ≤ 60% of blocks | Everything centred reads as a template |
| One h1, h1 ≤ 2 lines | — | A title, not a sentence |
| Empty bands | none over half a screen | Holes left by removed content |
| Even margins | within 24px | Content shoved to one side |
| Small tracked uppercase captions | ≤ 6 | A brand may use some; dozens are noise |
| Tap targets | ≥ 24×24px (WCAG 2.2 SC 2.5.8) | Phone use; fail at phone width |
| Images without alt | 0 (fail) | Accessibility |
| Copy | buzzwords, vague labels, fake proof, "not just X", lorem, em dashes | The word lists are in `scripts/thresholds.json` |

Measured checks catch mechanical problems only; passing them says nothing about whether the surface is good.

## Boundaries

- Read-only towards the page. Local URLs by default; never point it at a site you don't own.
- Uses the app's installed `@playwright/test`. If an app has none, ask before adding it.
- Not a replacement for a rule audit of the interface, or for axe and contrast checks; run those too.
