> Estate rules (Mike Reams, 2026-10-01): the governance baseline for a small estate of personal and
> consulting apps. When an app's own instructions are stricter, the app wins.

#### Governance (any hit = critical, stop-and-ask)
- A new runtime dependency, paid service or storage provider in `package.json`, `vercel.json`,
  `.mcp.json`, Docker/compose files or env examples, without a recorded approval (the app's spec or decision log)
- A secret, token, key hash, connection string or real credential in code, tests, fixtures, logs, docs
  or `.env.example`
- A schema change not expressed as a migration
- A change that alters a deploy target, domain, data contract or public baseline without a matching
  SPEC/ADR update
- Personal-project code or remotes pointing at the work org, or work content in a personal repo

#### Data & API
- Every new table has RLS enabled and explicit policies, and service-role use stays server-only
- zod (or the app's validator) at every boundary: route bodies, query params, env, external responses
- Errors use the app's error shape (for example RFC 7807 problem+json). No stack traces to callers
- Auth/scope checks on every non-public route. Mutations are audited where the app requires it

#### UI
- Colors, spacing and type come from tokens, with no raw hex in components
- Every interactive element is keyboard-reachable with visible focus and all states
  (hover/focus/active/disabled/loading/error/empty)
- Layout holds at all five breakpoints

#### Tests & evidence
- New behavior has a test that fails without the change (bug fixes: a regression test)
- Snapshot/baseline updates are intentional and explained in the commit
- No `.only`, skipped tests or weakened assertions introduced to get green
