# App screens: Operate mode (dashboards, admin, settings, lists, editors)

Screens people work in follow different rules from pages people read. Quiet repeated panels and small
labels are normal here; decoration is not.

| Rule | Detail |
|---|---|
| Quiet panels | One surface style, one border or tone step; no shadows stacked on shadows, no gradients, no glows |
| Figures line up | Tabular numerals (`font-variant-numeric: tabular-nums`), right-aligned numeric columns, consistent units and decimals |
| Colour is spent on data | Neutral chrome; colour marks status, series or the one thing that needs attention. No rainbow charts |
| Real data that adds up | Totals equal the sum of rows; dates are plausible; no lorem and no vanity metrics ("+340% engagement") |
| One finding per chart | Title states what the chart shows ("Late invoices doubled in March"), not "Chart 1" |
| Density with hierarchy | Page title, then section titles, then labels: three levels, not seven |
| Every state designed | Loading (skeleton matching the layout), empty (what to do next), error (what happened, how to fix), disabled (why) |
| Phone | Navigation folds away; tables become stacked rows or scroll inside their own box, never the page |
| Keyboard | Every action reachable; visible focus; shortcuts listed where they exist |

Critique app screens (Operate mode) with `rubric.md` passes 2, 4-7, 10, 12-14 plus these rules; skip the "page"
passes (1, 3, 9, 11). Score all ten heuristics; 7 (efficiency) and 10 (help) matter most here. Measured checks still apply, but raise `maxCentredShare` limits only with a reason.
