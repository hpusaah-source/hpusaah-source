# PR backstop

The counter-example, and the one worth reading before writing any other loop.

**Do not use this as your primary PR watcher.** Subscribe to PR activity
instead — CI failures, review comments, and merge-conflict notices get pushed
into the session as they happen. No interval, no jitter, no wasted wake-ups, and
you react in seconds rather than on average half a period. A 5-minute loop
asking "has CI failed yet?" is strictly worse than being told, on every axis.

This template exists for the gap that remains: **webhooks drop things.** Events
arrive late, out of order, or not at all — CI-success and new-push notifications
especially. So the loop's job is not to watch PRs. It's to verify that the event
stream hasn't quietly lied to you.

**Interval:** `/loop 53m`. Deliberately slow. A fast backstop is just a
duplicate event stream with extra steps.

## Prompt

```
Reconcile open PR state against what this session believes.

1. List your open PRs with their true current state: CI conclusion, review
   status, mergeability, and head SHA. Fetch it fresh — do not trust
   anything in conversation history, which is exactly what may be stale.

2. Compare against what you last acted on. A discrepancy means a dropped
   event. The ones that matter:
   - CI is red and you never handled it.
   - CI went green after a failure you were still treating as open.
   - The PR became un-mergeable and no conflict notice arrived.
   - A review requested changes and you never responded.
   - The PR merged or closed while you were still watching it.

3. Act on the discrepancy exactly as you would have on the live event:
   red CI you own gets diagnosed and fixed, a conflict gets the base branch
   merged in and pushed, a review comment gets addressed or answered.

4. If a PR has merged or closed, unsubscribe from it and drop it from the
   watch set.

Silence contract: if every open PR matches what you already acted on, output
nothing. Matching state is the expected result — this loop earns its keep on
the rare firing where it doesn't.
```

## The general rule

Loop over state you must go look at. Subscribe to state that can announce
itself. When you have a subscription and still want a safety net, make the net
slow and make its job *reconciliation*, not observation. A backstop that fires
often enough to catch things first has stopped being a backstop and started
being the primary — at which point you're paying poll costs for push-quality
information you were already receiving.
