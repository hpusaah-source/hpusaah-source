# Agent Loops

Companion to [signal-to-noise.md](./signal-to-noise.md). That note is about
budgeting one human's attention. This one is about the machinery that lets you
take work out of that budget without dropping it.

Mechanics below are as of the current Claude Code; the scheduling details in
particular are version- and surface-specific, so re-check them before building
anything load-bearing on top.

## The claim

Two moves, and they're often conflated:

**Fan out.** One session spawns subagents that work in parallel and report back.
This is delegation — bounded, one-shot, you get results and the agents are gone.

**Stand up a loop.** `/loop` schedules a prompt to re-enqueue on an interval, so
some concern gets re-examined on a clock without you initiating it. This is not
delegation. It's a *standing order*.

The second one is the interesting move, and the reason is precise: a subagent
costs you an initiation. You still have to notice the work exists and ask. A loop
costs you one initiation, ever, and then the noticing itself is delegated. That's
a different category of relief. "Keep CI healthy" as a standing order means CI
flakiness stops being something you have to remember to look at — which was
always the expensive part, not the fixing.

Read against the other note: a loop is how something moves out of your signal
list without becoming a thing you're quietly failing to do.

## What a loop actually is

Worth knowing, because the abstraction leaks in ways that matter:

`/loop <interval> <prompt>` registers a cron entry. At each fire time, the prompt
is enqueued into the session as if you'd typed it. `/loop` with no interval runs
in dynamic mode instead — the agent picks its own next wake time (clamped to
between 1 minute and 1 hour) and re-arms each turn, which is the better fit when
the right cadence depends on what it finds.

That's the whole thing. It's a scheduler pointed at a prompt. The power is
entirely in the prompt being a good standing order.

## The constraints the demo skips

None of these are dealbreakers. All of them will bite once.

**Session-scoped cron dies with the session.** Jobs registered by `/loop` live in
memory. Close the session and they're gone — there's no persistence flag that
changes this. "Dozens of loops running" means dozens of sessions being kept
alive, which is a real operational cost and the actual reason the tab fills up.
If you need a schedule that survives, that's a different mechanism (durable
Routines, which are account-level and minimum hourly) — not the same tool, and
worth knowing which one you're reaching for.

**Recurring jobs auto-expire after seven days.** They fire one last time and
delete themselves. Anything you intend to run indefinitely needs re-arming, and
you will not get a warning the week it stops.

**Jobs only fire when the session is idle.** A loop cannot interrupt a turn in
progress. If a session is deep in a long piece of work, its loops queue behind
it. Corollary: a session doing heavy foreground work is a bad host for
time-sensitive loops.

**Fire times are jittered late** — up to 10% of the period, capped at 15 minutes.
A 5-minute loop is a "roughly every 5 minutes" loop. Fine for polling, wrong for
anything with a deadline.

**Don't schedule on the hour.** Everyone who asks for "hourly" gets minute 0, and
every one of those requests lands on the API at the same instant. Pick minute 7.
Costs nothing, and at scale it's the difference between a smooth load curve and a
spike.

## Poll versus subscribe — the biggest lever

The PR-babysitting example is the one worth examining, because polling is usually
the wrong tool for it.

If the platform can wake you when something happens, subscribing beats a loop on
every axis: no interval to tune, no jitter, no wasted wake-ups finding nothing,
and you react in seconds instead of on average half a period. For PRs
specifically there's an explicit subscription that pushes CI failures, review
comments, and merge-conflict notices into the session as they occur. A 5-minute
loop asking "has CI failed yet?" is strictly worse than being told.

The rule generalizes: **loop over state you must go look at; subscribe to state
that can announce itself.** Twitter feedback clustering is genuinely loop-shaped
— nothing is going to notify you that sentiment has shifted, and a 30-minute
cadence over accumulated volume is exactly right. CI on your own PR is not.

Where loops stay useful even with subscriptions in place is as a *backstop*: a
long-interval check (30–60 minutes, not 5) that catches what the event stream
dropped. Webhooks miss things. A slow loop that verifies real state is cheap
insurance; a fast loop that duplicates the event stream is just noise with a
schedule.

## Which work is loop-shaped

The pattern that holds across the good examples:

- **The check is cheap, the fix is bounded, and doing nothing is the common
  case.** Flaky-test triage qualifies. "Refactor the auth module" does not.
- **Findings accumulate whether or not you look.** Feedback, error rates, drift,
  dependency advisories. The loop is doing the noticing.
- **A wrong action is recoverable.** Loops act without you in the room. Anything
  where the bad outcome is expensive — force-pushing, deploying, posting publicly
  — either stays out of loops or gets a loop that *prepares* the action and stops,
  leaving the irreversible half to you.

The anti-pattern is a loop whose job is to make progress on something open-ended.
It'll wake up every interval, re-derive the same context, do a little, and you'll
have paid for twenty context reloads to get one session's worth of work. Fan out
for progress; loop for vigilance.

## The number isn't the achievement

"A few hundred agents going, a few thousand overnight" is a fun stat and a
misleading metric. Agents are cheap to start and the constraint was never
starting them. Two things actually bind:

**Concurrency is capped well below the headline number.** Parallel agents run
against a real limit — on the order of a dozen at a time — so a few hundred
"going" mostly means a few hundred queued. That's fine, it's just not what it
sounds like.

**You are the verification bottleneck.** Every agent that changes something
produces output that someone has to review. Scale the fleet past your ability to
review it and you haven't multiplied your output — you've built a queue of
unreviewed diffs with your name on them. The number worth tracking isn't agents
launched, it's changes that got verified and landed.

Which is the same failure the other note ends on, in a new costume: the loop is
an execution layer. It's excellent at making sure something gets looked at
regularly and silent on whether it was worth looking at. Dozens of well-tuned
loops maintaining things nobody needed maintained is a very efficient way to
stand still, and the dashboard will look fantastic the entire time.

## The short version

Subagents for bounded work you initiate. Loops for vigilance you don't want to
own. Subscribe instead of polling wherever the platform allows it, and keep the
loops you do run slow enough to be backstops rather than duplicates.

Then check periodically that each standing order is still worth standing —
because unlike your daily list, loops don't reset. They just keep running.
