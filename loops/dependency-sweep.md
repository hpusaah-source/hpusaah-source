# Dependency sweep

Daily check for security advisories and meaningful version drift. Prepares the
upgrade; never applies it.

**Interval:** `/loop 0 7 * * * ...` style — once a day, early. Advisories don't
move hourly, and a loop that opens dependency PRs faster than you review them is
a bot you'll end up muting.

## Prompt

```
Sweep dependencies for advisories and drift.

1. Run the project's audit command for its ecosystem (npm audit, pip-audit,
   cargo audit, govulncheck — pick by what lockfiles exist). Also list
   direct dependencies that are more than one MAJOR version behind.

2. Check for an existing open PR or issue for each finding before acting.
   If one exists, skip it silently — do not open a duplicate.

3. Triage:
   - CRITICAL or HIGH advisory with a fix available: open ONE PR per
     advisory, upgrading only the affected package and its lockfile. Nothing
     else in that PR. Run the test suite; put the result in the description,
     pass or fail.
   - MODERATE or LOW advisory: collect into a single summary comment on a
     tracking issue. No PRs.
   - Major-version drift with no advisory: never open a PR. Note it in the
     summary with a one-line assessment of what the upgrade would involve.

4. Never merge. Never push to the default branch. Never upgrade a transitive
   dependency by pinning it in the manifest unless the advisory has no other
   remedy — and say so explicitly in the PR if you do.

5. If a fix requires a major-version bump of a direct dependency, do not
   attempt it. Open an issue describing the advisory, the required bump, and
   the likely breaking changes. That's a human decision.

Silence contract: no advisories and no new drift means no output, no commit,
no comment.
```

## Why it never applies

The failure mode for this loop isn't a missed advisory — it's a stream of green
dependency PRs that nobody reads carefully because there are always more, until
one of them changes behavior and lands on reputation alone. Keeping the loop in
prepare-and-stop mode means each PR still costs a human decision, which is the
only thing keeping the decisions real.

Major bumps get an issue rather than an attempt for the same reason: an agent
that starts fixing call sites across a codebase to satisfy a version bump is
doing open-ended work, and open-ended work is not loop-shaped.
