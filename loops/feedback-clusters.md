# Feedback clusters

Watches an inbound feedback stream and surfaces themes, not items. Genuinely
loop-shaped: nothing will ever notify you that sentiment moved, and the signal
only exists in aggregate.

**Interval:** `/loop 37m` for a busy stream, `/loop 3h` for a quiet one. Too
short and every firing sees three items and no pattern — clustering needs
volume to cluster.

Replace the source in step 1 with wherever your feedback actually lives (search
API, support inbox, issue tracker, a scraped file).

## Prompt

```
Cluster recent inbound feedback into themes.

1. Read loops/state/feedback-clusters.json if it exists. It holds the
   timestamp of the last item processed and the current standing themes. If
   it does not exist, treat the window as the last 24 hours and start fresh.

2. Fetch feedback newer than that timestamp. If fewer than 5 new items,
   update the timestamp and stop. Output nothing — too few to cluster.

3. Group the new items into themes. Prefer merging into an existing theme
   from the state file over inventing a new one; a theme that keeps getting
   renamed is useless for spotting trends. Each theme needs: a one-line
   description, a count, and two verbatim quotes.

4. Rewrite loops/state/feedback-clusters.json with the new timestamp and the
   updated theme list including running counts. Commit it.

5. Report ONLY if one of these is true:
   - A new theme appeared with 3+ items.
   - An existing theme's rate roughly doubled versus its previous window.
   - Any item describes data loss, a security issue, or a billing error —
     report those individually and immediately, never aggregated.
   Otherwise output nothing.

Do not reply to anyone. Do not open issues. Do not post anywhere. This loop
reads and summarizes only.
```

## Why the state file

This is the template that most needs external state, and the clearest example of
loops-have-amnesia. Without the file, every firing re-clusters the same window
from scratch, invents slightly different theme names each time, and you get
drifting labels that make trends impossible to see — which was the entire point.
The file is what makes "an existing theme doubled" a question the loop can even
ask.

## Tuning

The report thresholds are the actual product here. Too loose and you get a
digest every 37 minutes, which is a newsletter you didn't subscribe to. Start
stricter than feels right — a loop you trust to stay quiet is one you'll
actually read when it speaks.
