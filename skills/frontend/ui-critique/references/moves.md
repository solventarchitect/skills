# Named moves

One move, one target ("quieter the pricing section"). Read the app's `DESIGN.md` and tokens first; every move stays
inside the design system unless the brief says otherwise. After the move, run the loop on that target only.

| Move | Use when | Do | Don't | Done when |
|---|---|---|---|---|
| **bolder** | safe, bland, everything medium | raise the size jump (headline ≥ 3× body), commit a whole field of brand colour or one large real picture, cut a weak element to give the strong one room | add gradients, glows, more badges | the one-second glance names one thing |
| **quieter** | loud, busy, competing accents | remove accent from all but the primary action and one detail, drop effects, flatten surfaces to one tone step, reduce motion to one moment | grey everything out until it is empty | squint shows two or three masses |
| **distill** | too much on screen | delete sections without a claim (`argument.md`), merge duplicates, move secondary content behind a disclosure | hide required information or legal text | every remaining element has a job |
| **typeset** | weak hierarchy, many sizes | ≤ 5 sizes on a clear scale, line length 45-75 characters, tabular figures for numbers, one display moment | introduce new faces outside the system | measured `type-sizes` passes; no orphans in headings |
| **layout** | scattered, cramped or uneven | 2-3 shared left edges, section gaps clearly larger than in-section gaps, equal outer margins, one alignment rule per section | centre everything to "fix" alignment | measured `left-edges`, `even-margins`, `empty-bands` pass |
| **colorize** | grey, lifeless UI | spend brand colour on data, status and the primary action; one tinted surface for emphasis; check every text pair with a contrast checker | rainbow charts, colour as decoration | colour carries meaning and every pair passes AA |
| **clarify** | unclear labels, errors, empty states | name actions by result ("Send invoice"), keep one name per action through the flow, rewrite errors as what happened + how to fix | add exclamation marks or apologies | the measured copy checks pass |
| **adapt** | breaks or squeezes on other sizes | compose the phone layout on its own (crops, line breaks, navigation that folds away), check 390 / 768 / 1440 and landscape | shrink the desktop layout | measured checks pass at all widths; tap targets ≥ 24px |
| **onboard** | first run, empty states | an empty state that says what to do next with one action, sample data or a template where it helps, progress that is visible | tours that block the screen | a new user reaches the first useful result without help |
| **harden** | before release | follow `harden.md` | — | its checklist is clear |
| **polish** | final pass before shipping | walk the whole path at each width: hierarchy, spacing, states, focus, copy, motion; fix what one look shows before looking again | redesign during polish | rubric shows nothing above P3 |
