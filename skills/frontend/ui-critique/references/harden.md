# Harden: production checklist for a surface

Run on one target before release. Each line is checked in the browser, not assumed from code. Record anything
deliberately left as a known limitation in the app's shipping docs.

| Area | Check |
|---|---|
| **Text overflow** | Longest real name, title and email fit or wrap or truncate with the full value available (tooltip, title, detail view); no text under or over controls; numbers don't wrap mid-value |
| **Translation-ready** | Strings 30-50% longer still fit; no text baked into images; dates, numbers and currency formatted per locale (`Intl`); layout survives right-to-left if the app may ever need it (logical CSS properties) |
| **Counts** | 0, 1, many and very many items each look intended (empty state, singular wording, pagination or virtualisation) |
| **Extreme values** | Very large and negative numbers, long words and URLs without spaces, missing optional fields, future and past dates |
| **Errors** | Every request has a failure state that says what happened and what to do; retry where it makes sense; no silent failures; form errors next to the field and announced to screen readers |
| **Slow and offline** | Loading states match the final layout (no jump); double-submit prevented; timeouts handled; what happens offline is stated |
| **Input** | Validation on the server as well as the client; helpful formats (`inputmode`, `autocomplete`); paste works; limits shown before they are hit |
| **Access under stress** | Focus is kept or moved sensibly after errors, dialogs and deletes; zoom to 200% works; reduced motion respected; contrast holds in every state |
| **Permissions** | Each action hidden or disabled with a reason when the user can't do it, and refused by the server anyway |
| **Destructive actions** | Confirm or allow undo; say exactly what will be deleted |

Done when every row is checked or recorded as a known limitation.
