# CI health

Keeps the default branch's test suite green by fixing flakes. The canonical
loop-shaped job: the check is cheap, the fix is bounded, and most firings should
find nothing.

**Interval:** `/loop 23m` — long enough that a fix from the previous firing has
landed and re-run, short enough to catch a flake before it trains everyone to
ignore red.

## Prompt

```
Check CI health on the default branch. Do not assume anything about previous
runs of this loop — re-derive everything from current state.

1. List the most recent CI runs on the default branch. If the latest run
   passed and no run in the last 24h failed, stop. Output nothing.

2. For each failure, determine whether it is a FLAKE or a REAL failure:
   - FLAKE: the same commit passed on a retry, or the failure is in a test
     that has both passed and failed on identical code in the last 20 runs,
     or the error is infrastructure (timeout, runner OOM, network, registry).
   - REAL: the failure appeared with a specific commit and reproduces.
   State which one it is and the evidence, before doing anything.

3. If REAL: stop. Do not fix it. Report the failing commit, the test, and the
   error in one short message. Real breakage belongs to whoever wrote it.

4. If FLAKE, you may fix it under these limits:
   - Only files under the test directories.
   - Never delete a test, never add skip/xfail/ignore, never widen a timeout
     past 2x, never mark a test as expected-to-fail.
   - Fix the actual race or ordering dependency. If the fix requires touching
     non-test source, stop and report instead.
   - One flake per firing. If several, fix the one that has failed most often
     and report the rest.

5. If you fix something: open a PR with the flake evidence (which runs, which
   commits) in the description. Do not merge it. Do not push to the default
   branch.

Silence contract: if CI is green, or the only failures are REAL and you have
already reported them in an open PR or comment, output nothing at all.
```

## What this will not do

Fix real breakage, merge anything, push to the default branch, or silence a test
to get to green. Those are the moves that make a CI loop actively dangerous —
it's the one job where "make the red go away" and "keep the suite meaningful"
point in opposite directions, and an unsupervised agent optimizing the first
will quietly destroy the second.

## Tuning

If it reports the same REAL failure repeatedly, it's not re-deriving properly —
add "check for an existing open PR or issue referencing this test before
reporting." If it's finding nothing for weeks, lengthen the interval rather than
deleting it; this is a backstop, and backstops are supposed to be boring.
