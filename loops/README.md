# Loop templates

Runnable standing orders. Paste the prompt block into a session as
`/loop <interval> <prompt>`, or drop the file contents in and let the agent
schedule it.

The reasoning behind these is in [../notes/agent-loops.md](../notes/agent-loops.md).
Short version of what they all obey:

1. **Re-derive state, never remember it.** Each firing starts cold. Every
   template opens by inspecting real state.
2. **Silence by default.** Each template states what nothing-to-report looks
   like. If a loop talks every tick, it's broken.
3. **Bounded blast radius.** Each template names what it may change and what it
   must stop and report on instead.
4. **Off-minute scheduling.** Intervals below avoid `:00` and `:30`. Everyone
   who types "hourly" gets minute 0; don't be everyone.

## The set

| Template | Interval | Shape |
|---|---|---|
| [ci-health.md](./ci-health.md) | 20–30 min | Cheap check, bounded fix, usually no-op |
| [feedback-clusters.md](./feedback-clusters.md) | 30–60 min | Accumulating signal nothing will announce |
| [dependency-sweep.md](./dependency-sweep.md) | daily | Slow drift, prepares but doesn't apply |
| [pr-backstop.md](./pr-backstop.md) | 45–60 min | Backstop for dropped webhook events |

## Before you add a fifth

Ask whether the platform can just tell you. If the state can announce itself —
PR events, CI webhooks, anything with a subscription — subscribe and skip the
loop. Loops are for state you have to go look at.

## Operational reminders

- Session-scoped loops die with the session, and recurring ones auto-expire
  after **seven days**. Re-arm deliberately; nothing warns you.
- Loops fire only while the session is idle. Don't host time-sensitive loops in
  a session doing heavy foreground work.
- Fire times run up to 10% late (15 min cap). These are cadences, not deadlines.
- Audit the set monthly. A standing order nobody cancelled is not the same as a
  standing order still worth standing.
