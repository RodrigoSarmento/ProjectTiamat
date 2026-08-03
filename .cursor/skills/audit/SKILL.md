---
name: audit
description: >-
  Repo-specific diff review for luna-oculus. Reviews the changes on the current
  branch against this repo's `.cursor/context/*` rules, returns a severity-ranked
  list of findings, and applies the fixes you pick. Invoked as `/audit [args]` and
  runs standalone. Use whenever the user types `/audit`,
  or asks to review / audit / sanity-check the diff or branch changes against the
  repo's own conventions. This is the repo-specific companion to the built-in
  code-review (which is general-purpose, not tuned to `.cursor/context/*`).
---

# `/audit` workflow

A standalone, repo-specific diff reviewer. It scopes to the actual work on the
branch, hands the read-heavy pass to a read-only subagent so the raw diff and
`.cursor/context/*` docs don't fill the main context, and returns a
**severity-ranked list of findings**, then applies the fixes the user picks and
re-runs the repo checks.

It runs on its own — no ticket, no branch naming convention required.

`help`, `-h`, and `--help` are reserved — those print the usage summary below and
stop. A leading `run` is also accepted as an explicit alias for the default action
(`/audit run` → run with an empty scope; `/audit run src/screens` → run with
scope `src/screens`) — strip it before reading the scope. Any other arguments
(or none) run the default `run` action, and the whole argument string **is** the
`[scope]` passed to step 1.

```
/audit [scope]   Review the branch diff (+ uncommitted); default scope is the whole diff
/audit help      Show this usage summary
```

`[scope]` is optional and narrows what's reviewed — e.g. a path/glob (`src/screens`),
or `staged` / `uncommitted` to review only those changes. Omit it to review the
full branch diff plus uncommitted changes.

---

## Conventions

### Context docs — read lazily, only what the change needs

The rule sources the review checks against. Read only what the diff actually
touches — don't pull all of them for every change:

- `.cursor/context/architecture-patterns.md` — placement, naming, Redux vs local
  media, Toast/NetInfo conventions. Almost always relevant.
- `.cursor/context/unit-testing.md` — tests exist and follow Jest /
  `renderWithProviders` conventions, with meaningful coverage for the change.

### How findings should read

Write each finding the way you'd explain it to a teammate looking over your
shoulder — plain, everyday words and a natural, flowing tone, not clipped
review-bot shorthand. Say what's wrong and why it matters in a sentence or two a
person can read once and get, then point to the fix. Prefer "this runs on every
keypress, so the list re-renders more than it needs to" over "unnecessary
re-render on keypress." Skip the jargon where a normal word does the job, don't
pile on severity labels or telegraphic fragments, and keep the `file:line` and
severity tag so it's still easy to scan. Be direct and kind — describe the code,
not the person who wrote it.

### Code style (when applying fixes)

**Avoid comments.** Add one only when the change is genuinely complex or hard to
understand, and keep it to a line or two. Otherwise match the surrounding code and
let it speak for itself.

### When to run checks

Run repo checks **once, after applying fixes** — not during the read-only review
and not after every edit:

- `npm test -- --watchman=false` (or targeted `npx jest --watchman=false --testPathPattern=...`)
- `npx eslint` on touched files when practical

If no fixes were applied, skip the checks.

---

## Subcommand: `run [scope]` (default)

1. **Scope the diff.** Default to `git diff main...HEAD` plus any uncommitted
   changes (`git diff` / `git status`). If a `[scope]` arg was given, narrow to it
   (a path/glob, or `staged` / `uncommitted`). Review **only the changed code and
   its immediate blast radius**, not the whole repo. Typical touch areas:
   `src/screens`, `src/components`, `src/redux`, `src/services`, `src/hooks`.
   Treat `Core-Android` / `Core-iOS` / native modules as high-caution. If there is
   no diff to review, say so and stop.

2. **Delegate the read-heavy review to a subagent** so the raw diff and
   `.cursor/context/*` docs stay out of the main context. Spawn a read-only
   reviewer (`Explore` or `generalPurpose`) seeded with the diff scope from step 1,
   any caller-supplied intent/acceptance context, and the rule sources to check
   against (read lazily — see Conventions). Instruct it to flag issues across:
   - **performance** — extra renders / allocations / loops, heavy work on the JS
     thread during tracking / map / camera,
   - **potential regressions**,
   - **new bugs**,
   - **deviations from our architecture / patterns** (Redux local media, path
     helpers, Toast/NetInfo, screen/component placement),
   - **unhandled edge / use cases** (offline, empty local media, partial sync),
   - **missing or weak tests** for non-trivial behavior.

   It must return **only** a severity-ranked list of findings (each: severity,
   `file:line`, what's wrong, suggested fix), written in plain natural language
   (see How findings should read) — **not** the diff or file contents it read. For
   a large diff, fan out several reviewers by dimension (e.g. one for RN UI, one
   for sync/upload, one for tests) and merge their findings.

3. **Take the subagent's findings as the review result**, spot-checking any that
   look off against the actual code before acting on them.

4. **Present the findings** to the user, **ordered high → low severity** (each:
   severity, `file:line`, what's wrong, suggested fix), phrased in the plain,
   flowing tone described in How findings should read. Then **ask which issues to
   address**.

5. **Fix the selected issues directly** (edit the code), following the Code style
   convention (avoid comments) and matching the surrounding code. After fixing, run
   the checks (see When to run checks) and report results.

6. Summarize what was found and what was fixed (and what the user deferred). This
   skill does **not** commit, push, or open a PR, and does **not** write a findings
   file unless the user asks for one.

---

## Subcommand: `help`

Print the usage summary at the top of this file and stop.
