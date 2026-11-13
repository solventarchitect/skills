# Rubric: judging the screenshots

Judge the pictures, not the code: you will read your intentions into code. Make each pass separately.

| # | Pass | Question | Typical finding |
|---|---|---|---|
| 1 | **One second, then five** | Glance at the desktop fold and look away: what did you see? There should be one answer (a word, an image, an object). Then five seconds as a stranger: what is this, who is it for, what do I do next? | No focal point; title only makes sense after scrolling |
| 2 | **Squint** | Blur until text is grey bars. Do two or three large masses lead, with clear size differences? | Everything medium, nothing leads |
| 3 | **Cover the logo** | Could this first screen belong to a competitor? Swap the name: is the page still valid? Does the idea reach the lower sections? | No idea; stock blocks after the first screen |
| 4 | **Edges** | Follow the left edge of every text block down the page. How many distinct x positions? | More than three or four, unplanned |
| 5 | **Space and frame** | Related things close, unrelated far? Section gaps larger than in-section gaps? Equal left/right margins? Any half-empty section or accidental hole? | Content pushed to one side; a hole where a decoration was removed |
| 6 | **Type** | Body-to-headline jump decisive (about 3×)? Five sizes or fewer? Orphan words? Lines over ~75 characters? Centred over three lines? | Nine near-equal sizes |
| 7 | **Colour** | Which colour holds most of the surface, which supports, where is the accent? Is the accent on the one action and one detail? | Accent everywhere means nowhere |
| 8 | **Images** | Is every picture doing a job (showing the thing, setting the place, proving a claim)? Shared crops and grade? Any grey box, stretched photo, fake screen? | Placeholder or decorative stock |
| 9 | **Sameness** | Name each section's layout in one word (split, list, grid, statement, full-bleed…). Same word twice in a row, or three times on the page? | Template rhythm |
| 10 | **Phone** | Is the phone layout composed (its own crops and line breaks), and is the first screen still one clear thing? | Desktop squeezed; 10-line headline |
| 11 | **Fullness** | Is each screen composed, or a thin column with dead ground either side? Could it be mistaken for a wireframe? | Underbuilt; "empty page with good manners" |
| 12 | **Words** | Specific, plain, active? Buttons name their action? Proof real? | "Get started", buzzwords, invented numbers |
| 13 | **States and access** | Focus visible, hover/disabled/loading/empty/error designed, motion reduced when asked? | Missing focus ring; blank empty state |
| 14 | **Brand** | Does it read as this brand (tokens, type, voice), not a generic dark/cream template? | Off-palette accent; wrong faces |

## Scoring (after the passes)

Score each of Nielsen's ten usability heuristics 0-4 from what the screenshots and a click-through show.
4 = excellent, 3 = good, 2 = noticeable problems, 1 = serious problems, 0 = absent or broken. Most real interfaces
land between 20 and 32 out of 40; a 4 has to be earned.

| # | Heuristic | Ask |
|---|---|---|
| 1 | Visibility of system status | Does the user always know what is happening (loading, saved, sent, failed)? |
| 2 | Match with the real world | Are words, order and icons the user's, not the system's? |
| 3 | User control and freedom | Can they undo, cancel, go back, leave a flow? |
| 4 | Consistency and standards | Same thing, same name, same place, same look; platform conventions kept? |
| 5 | Error prevention | Are mistakes made hard (constraints, defaults, confirmations for destructive actions)? |
| 6 | Recognition over recall | Are options, recent items and context visible rather than remembered? |
| 7 | Flexibility and efficiency | Shortcuts, bulk actions, sensible defaults for frequent users? |
| 8 | Aesthetic and minimalist design | Does every element earn its place? |
| 9 | Help users recover from errors | Plain-language errors that say what happened and how to fix it? |
| 10 | Help and documentation | Is help findable at the moment it is needed? |

Mark a heuristic `n/a` (with a one-line reason) only when it genuinely cannot apply; 7 and 10 often don't on Persuade
and Experience surfaces. The maximum is 4 × the number scored (**/32** with two n/a), never /40 over a partial set.
Record each run with `scripts/record.mjs`; it prints the trend for the target and warns when two runs scored
different heuristic sets.

## Severity (P0-P3)

| Level | Meaning | Examples |
|---|---|---|
| **P0** | Blocks use or shipping | broken layout at a shipped width, unreadable text, missing focus, a failed measured check |
| **P1** | Most users hit it, or it makes the surface read as generic | no focal point, cover-the-logo test fails, unclear primary action |
| **P2** | Visible quality problem with a workaround | scattered edges, too many type sizes, weak empty state |
| **P3** | Polish | spacing nits, one orphan word |

## Writing it up

One line per finding: **P0-P3** · pass or heuristic number · what is visible and where (width, section) · the fix.
Fix order: P0, then P1, then the rest. Three fixes per round, three rounds at most. End with the score
(`26/32, n/a: 7, 10`) and the measured summary line.
