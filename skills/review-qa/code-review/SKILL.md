---
name: code-review
description: Use when reviewing a change before commit, merge or milestone sign-off — a working copy, a commit, a branch range or a PR. Produces a coverage ledger (every changed file reviewed or skipped with a reason) and severity-ranked, line-anchored findings, each re-checked before it is reported.
---

> **Skill by Mike Reams (2026-10-01, updated 2026-10-17).** Combines ideas from obra/superpowers
> `requesting-code-review` (MIT) and alibaba/open-code-review delegation mode + rule docs (Apache-2.0).
> See `NOTICE`. Read-only by default. Your project's instructions (`CLAUDE.md` or equivalent) win over
> this skill on any conflict.

# Code Review

Two failure modes this skill exists to stop:

- **Silent partial coverage.** On a 14-file change, the reviewer reads 6 files and says "looks good."
- **Noise.** Twenty nitpicks bury the one real defect, and line numbers drift off the code they describe.

The fix is deterministic bookkeeping around a judgment step. Lists, rules and coverage are mechanical.
Judgment is spent only on the diff.

## Step 1 — Fix the range

| Asked to review | Base / head |
|---|---|
| "my changes" / working copy | `git diff HEAD` + untracked files (`git ls-files --others --exclude-standard`) |
| a commit | `git show <sha>` |
| a branch / PR / milestone | `git merge-base main <branch>` → `<branch>` |

Get the file list with `git diff --name-status <base>..<head>` (plus untracked files for a working copy).

**Audit the change, not the repo** (added 2026-10-17): review the changed files plus whatever the change makes newly
reachable or newly wrong elsewhere (a new caller of an old function, a widened type, a route that now skips a guard).
Review the whole repository only for an app's first release or after a large refactor, and say which you did.

**Modes:**

| Mode | Writes | Output |
|---|---|---|
| `review` (default) | nothing | Steps 2-6 below |
| `check` (release gate) | nothing | Only disagreements between the app's shipping docs and its code over the range: each with the doc line and the code `file:line`, no fixes applied. Ends with one line: `docs-vs-code: N disagreements (C critical) · docs stale: <list or none>`. The owner decides whether the code or the doc is wrong |

## Step 2 — Build the ledger (before reading any diff)

One row per changed file: `path · status (A/M/D/R) · +/- · rule group · state`. Every row starts
`pending` and must end as `reviewed` or `skipped: <concrete reason>`.

Skip mechanically, never by taste:

| Skip | Reason to record |
|---|---|
| `pnpm-lock.yaml`, `package-lock.json`, `bun.lock` | lockfile (but review the `package.json` change that caused it) |
| `.next/`, `dist/`, `out/`, `coverage/`, `*.tsbuildinfo` | build output |
| Files a tool generated and the repo marks generated | generated, check the generator instead |
| Binary assets | binary, review only if the change is suspicious (size, name, location) |

**Do not skip** `baseline/` snapshots (e.g. `openapi.json`). They are the contract, and an unexplained
diff there is a finding. Do not skip migrations, `.github/workflows/`, `vercel.json` or `.env.example`.

## Step 3 — Attach rules to each file

| Path / type | Rules |
|---|---|
| every file | `rules/default.md` + `rules/estate.md` |
| `*.ts *.tsx *.js *.jsx *.mjs` | + `rules/ts-js.md` |
| `.github/workflows/*.yml` | + `rules/github-workflows.md` |
| `package.json` | + `rules/package-json.md` |
| `supabase/migrations/*.sql` | + `postgres-pro` skill (RLS, indexes, locking) |
| UI components | + `web-design-guidelines` for a11y/UX rules |
| anything in the app's `CLAUDE.md` "Regression gates" / "Review rules" / "Stop-and-ask tripwires" | **always** — app rules outrank the generic ones |

A tripwire hit (e.g. a hub change to key hashing, auth middleware or KV isolation) is reported as
**critical / stop-and-ask**, regardless of code quality.

## Step 4 — Review

**Preferred: a fresh-context reviewer subagent** (when the Agent tool is available). Fill
`reviewer-prompt.md` with the range, the requirement (SPEC milestone row or task text), the ledger and
the rule groups. Give it precise context, never this session's history.

**Otherwise inline**, in bounded passes grouped by rule group. Tick each ledger row as you finish it.

In both cases:

- Read the full file around a hunk when the hunk alone can't show correctness (callers, types, tests).
- Don't stop at the first high-severity finding.
- Large diff: say how many passes you ran.

### Step 4b — Intent axis: documented vs implemented (added 2026-10-17)

When the app keeps shipping docs (`templates/shipping/`: architecture, flows, permissions, variables, tests) or
equivalents under other names, treat them as **claims to verify**, not proof:

1. For each documented rule the change touches (who may do what, which boundary is trusted, what is public), find the
   enforcement point on the server, on every path. "Handled upstream", "admin only" and "internal" comments are not
   evidence; the code path is.
2. A mismatch matters when crossing it lets a real actor reach data, money, infrastructure or another user/tenant they
   shouldn't. Drift that only affects the actor's own data is cosmetic; drop it.
3. **Documented but not enforced** is a finding on its own. **Enforced but not documented** is usually fine, but report
   the doc as stale.
4. Every intent finding states: the doc claim (quoted, with its file), the code reality (`file:line`), who could exploit
   it and who is harmed, and the fix. If you cannot cite both sides, it is a question to investigate, not a finding.
5. No shipping docs on a production or consulting app is itself the first finding (`docs`, `medium`).

## Step 5 — Re-check every finding before it is reported

For each finding, re-open `path:line` in the **head** revision and confirm three things: (a) the line
says what the finding claims, (b) the problem isn't already handled nearby (guard, caller, test), and
(c) the severity matches the actual effect. Fix drifted line numbers. **Drop anything you can't confirm.**
Report fewer, true findings, not many plausible ones.

## Step 6 — Report

Lead with the verdict, then findings, then the ledger summary.

**Verdict:** `Ready` · `Ready with fixes` · `Not ready` · `Stop-and-ask (tripwire)` plus one sentence why.

**Findings**, ranked most severe first:

| Sev | Category | File:line | Problem → effect | Fix |
|---|---|---|---|---|

- Severity: `critical` (data loss, security, broken contract, tripwire) · `high` (bug a user/caller hits)
  · `medium` (error-handling gap, perf, maintainability with real cost) · `low` (style/nit).
  **Omit `low` unless it is clearly worth the reader's time.**
- Category: `bug · security · performance · maintainability · test · accessibility · docs · other`.

**Ledger summary:** `N files · reviewed R · skipped S (reasons) · coverage R/(N−S mechanical skips)`.
Below 100% coverage of the reviewable files, the verdict cannot be `Ready`.

**Declined to judge:** behavior considered and set aside as out of scope, one line each with the reason
(so nothing is dropped silently).

## Step 7 — After the review

- **Fixing is not implied.** If the ask was "review", stop at the report and ask before changing code.
  If the ask was "review and fix", fix critical/high, describe medium, and leave low.
- Treat incoming findings (yours or anyone's) with `receiving-code-review`. Verify them; don't
  perform agreement.
- No "fixed / passing / ready" claim without fresh evidence (`verification-before-completion`): rerun
  the app's gate (`pnpm typecheck && pnpm lint && pnpm test`) after fixes.
