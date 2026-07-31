/* Catalog of SaaS categories, a verdict on whether you can realistically
   build your own, and a prompt to paste into a coding agent.

   verdict: "yes"   -> a weekend project beats the subscription for most people
            "maybe" -> buildable, but one hard part (deliverability, bank sync,
                       API pricing, storage cost) decides it for you
            "no"    -> the moat is real. keep paying.
   price:   rough USD/month for a typical single user or small team, mid-2026.
   effort:  honest first-working-version estimate with an agent doing the typing. */

window.CATALOG = [
  {
    id: "notes",
    name: "Notes & personal wiki",
    category: "Knowledge",
    replaces: ["Notion", "Evernote", "Craft", "Obsidian Sync"],
    verdict: "yes",
    effort: "A weekend",
    price: 10,
    stack: "Next.js + SQLite + Tiptap",
    why: "Markdown in a database with full-text search. The hard part of Notion is real-time multiplayer editing, which you almost certainly do not need for your own notes.",
    gotchas: [
      "Skip real-time collaboration in v1 — it triples the work.",
      "Use SQLite FTS5 for search before reaching for a vector database."
    ],
    prompt: `Build me a personal notes app I can run locally and on a cheap VPS.

Stack: Next.js (App Router) + TypeScript + SQLite via better-sqlite3 + Tailwind + Tiptap for the editor.

Data model: notes(id, title, body_markdown, created_at, updated_at, archived), tags(id, name), note_tags join table, and links(from_note, to_note) derived from [[wiki-links]] in the body.

Features:
- Three-pane layout: tag sidebar, note list, editor.
- Autosave on a 500ms debounce, no save button.
- [[wiki-link]] autocomplete that creates the target note if it doesn't exist.
- Backlinks panel under the editor.
- Full-text search across title and body using SQLite FTS5, with a Cmd+K palette.
- Export everything to a folder of .md files, and import that folder back.

Single-user, no login. Store the DB path in an env var. Include a seed script with 5 sample notes so I can see it working immediately, and a README with run instructions.`
  },
  {
    id: "tasks",
    name: "To-do / task manager",
    category: "Productivity",
    replaces: ["Todoist", "Things", "TickTick"],
    verdict: "yes",
    effort: "An afternoon",
    price: 5,
    stack: "SvelteKit + SQLite (or plain HTML + localStorage)",
    why: "The canonical CRUD app. The only genuinely fiddly bit is recurring-task rules, and you can copy the RRULE spec for that.",
    gotchas: [
      "Recurring tasks: use the rrule library, do not invent your own repeat logic.",
      "If you want it on your phone, make it a PWA before you consider React Native."
    ],
    prompt: `Build a personal task manager that runs as a local web app and installs as a PWA on my phone.

Stack: SvelteKit + TypeScript + SQLite (better-sqlite3) + Tailwind.

Data model: tasks(id, title, notes, project_id, due_date, priority 1-4, completed_at, recurrence_rule, created_at), projects(id, name, color, sort_order).

Features:
- Inbox / Today / Upcoming / project views.
- Natural-language quick add: "pay rent every 1st at 9am p1 #home" parses date, recurrence, priority and project. Use chrono-node for the date parsing and rrule for recurrence.
- Completing a recurring task spawns the next instance from the rule.
- Drag to reorder, keyboard-first: n = new, e = edit, x = complete, / = search.
- Offline-capable PWA with a service worker and a web app manifest.

No accounts, no sync server. Add a JSON export/import for backups. Include seed data and a README.`
  },
  {
    id: "kanban",
    name: "Project board & issue tracker",
    category: "Team",
    replaces: ["Trello", "Asana", "Jira", "Linear"],
    verdict: "maybe",
    effort: "A weekend",
    price: 12,
    priceNote: "per seat",
    why: "Fine for a team of five who all trust each other. Once you need permissions, audit logs, SSO and an API other tools integrate with, you are rebuilding the product rather than the app.",
    stack: "Next.js + Postgres + dnd-kit",
    gotchas: [
      "Permissions are the tarpit. Keep it to one shared workspace in v1.",
      "You will miss the integrations (GitHub, Slack) more than the features."
    ],
    prompt: `Build a small-team issue tracker — think Linear for five people, self-hosted.

Stack: Next.js (App Router) + TypeScript + Postgres via Drizzle ORM + Tailwind + dnd-kit for drag and drop.

Data model: users, teams, issues(id, key like ENG-14, title, description_md, status, priority, assignee_id, labels[], estimate, created_at, updated_at), comments, activity_log(issue_id, actor_id, kind, payload_json).

Features:
- Board view (columns = status, drag to move) and a dense list view, toggled per team.
- Cmd+K command palette: create issue, assign, change status, jump to issue.
- Every mutation writes an activity_log row and renders in the issue timeline.
- Markdown comments with @mentions.
- Filter bar: assignee, label, status, plus a saved-view URL.
- Email-free auth: magic-link login using a signed token, sent via Resend.

Include Drizzle migrations, a seed script with two users and 15 issues, and a README covering local setup and deploying to a single VPS with Docker Compose.`
  },
  {
    id: "habits",
    name: "Habit tracker",
    category: "Home & life",
    replaces: ["Streaks", "Habitica", "Way of Life"],
    verdict: "yes",
    effort: "An afternoon",
    price: 4,
    stack: "Plain HTML + JS + localStorage",
    why: "It is a grid of checkboxes and a streak counter. This is the single best first project to prove the whole approach to yourself.",
    gotchas: ["Do the timezone handling on day boundaries or your streaks will lie to you."],
    prompt: `Build a habit tracker as a single self-contained HTML file I can open from my phone's home screen.

No build step, no dependencies, no server — one index.html with inline CSS and JS, state in localStorage.

Features:
- Add habits with a name, an emoji, a colour, and a target (daily, or N times per week).
- A GitHub-style contribution grid per habit showing the last 12 weeks.
- Tap today's cell to toggle; long-press any past cell to backfill.
- Current streak and best streak per habit, computed in local time with correct day boundaries.
- A weekly summary line: "4/5 habits on target".
- Export/import all data as JSON via a text area, so I can back it up.

Make it look good on a phone in dark mode: large tap targets (44px minimum), safe-area insets, and an apple-touch-icon so it installs to the home screen cleanly.`
  },
  {
    id: "readlater",
    name: "Read-later & bookmarks",
    category: "Knowledge",
    replaces: ["Pocket", "Raindrop", "Instapaper"],
    verdict: "yes",
    effort: "A weekend",
    price: 4,
    stack: "Node + SQLite + Readability.js",
    why: "Mozilla's Readability is the same extraction library the paid apps use. It is open source.",
    gotchas: [
      "Paywalled sites will not extract. Save the URL and move on.",
      "A share-target PWA saves you writing a browser extension."
    ],
    prompt: `Build a self-hosted read-later service.

Stack: Node + Fastify + SQLite + @mozilla/readability with jsdom for extraction + a small React frontend.

Features:
- POST /save with a URL: fetch the page, extract title/author/lead image/clean HTML with Readability, estimate reading time, store it.
- Reading view: serif type, adjustable width and font size, dark mode, progress bar, mark-as-read on scroll to bottom.
- Highlighting: select text to save a highlight, with a separate "all highlights" page.
- Tags, archive, and full-text search over extracted content (SQLite FTS5).
- A PWA share target so I can share a link from iOS/Android straight into it, plus a bookmarklet for desktop.
- Nightly job that re-fetches anything that failed extraction, max 3 attempts.

Respect robots.txt, set a descriptive User-Agent, and cache the raw HTML so re-parsing never re-fetches. Include a README with Docker Compose deployment.`
  },
  {
    id: "rss",
    name: "RSS reader",
    category: "Knowledge",
    replaces: ["Feedly", "Inoreader", "NetNewsWire premium"],
    verdict: "yes",
    effort: "A weekend",
    price: 8,
    stack: "Node + SQLite + a cron poller",
    why: "Polling XML on a schedule and deduping by GUID. The paid tier is mostly hosting a cron job for you.",
    gotchas: [
      "Honour ETag/Last-Modified or you will get rate-limited by big publishers.",
      "Feed discovery from a bare homepage URL is worth the extra hour."
    ],
    prompt: `Build a self-hosted RSS reader.

Stack: Node + Fastify + SQLite + rss-parser, frontend in Preact.

Features:
- Add a feed by pasting any site URL: discover the feed from <link rel="alternate"> if it isn't a feed itself.
- Poller every 15 minutes that sends If-None-Match / If-Modified-Since, backs off exponentially on errors, and disables a feed after 20 consecutive failures.
- Dedupe items by GUID, falling back to a hash of link+title.
- Views: unread, all, starred, per-folder. Keyboard nav: j/k move, o open, s star, m toggle read, shift+a mark all read.
- Full-text search across items.
- OPML import and export.
- Optional: fetch the full article with Readability when a feed only publishes excerpts.

Include the poller as a separate process with its own health endpoint, a Dockerfile, and a README.`
  },
  {
    id: "timetracking",
    name: "Time tracking & timesheets",
    category: "Money",
    replaces: ["Toggl", "Harvest", "Clockify"],
    verdict: "yes",
    effort: "A weekend",
    price: 12,
    priceNote: "per seat",
    stack: "Next.js + Postgres",
    why: "A timer, a table, and a weekly report. If you bill hourly, the invoice hand-off is the only part worth care.",
    gotchas: ["Store UTC, render in the user's timezone, and never do date maths in the browser locale."],
    prompt: `Build a time tracker for a freelancer who bills hourly.

Stack: Next.js (App Router) + TypeScript + Postgres via Drizzle + Tailwind.

Data model: clients, projects(client_id, hourly_rate, budget_hours), entries(project_id, description, started_at, ended_at, billable, invoiced_at).

Features:
- One big start/stop timer with project picker and description; only one timer can run at a time.
- Manual entry and drag-to-edit on a day timeline view.
- Week view with daily totals and a running weekly total.
- Reports: filter by client/project/date range, group by day or project, show billable vs non-billable and revenue at the project rate.
- Budget burn bar per project, red past 90%.
- CSV export, and a "generate invoice draft" action that produces a line-item summary of uninvoiced billable time and marks it invoiced.

All timestamps stored as UTC timestamptz, rendered in a user-configured IANA timezone using date-fns-tz. Seed with two clients and a week of entries.`
  },
  {
    id: "invoicing",
    name: "Invoicing",
    category: "Money",
    replaces: ["FreshBooks", "Invoice Ninja", "Bonsai"],
    verdict: "yes",
    effort: "A weekend",
    price: 17,
    stack: "Next.js + Postgres + Stripe + React-PDF",
    why: "Generating a PDF and emailing a payment link is a solved problem. Stripe does the part you must not build.",
    gotchas: [
      "Never build the payment flow itself — use a Stripe Payment Link or Checkout.",
      "Tax rules (VAT, GST, US nexus) are where this stops being a weekend project."
    ],
    prompt: `Build an invoicing app for a one-person consultancy.

Stack: Next.js + TypeScript + Postgres (Drizzle) + @react-pdf/renderer for PDFs + Stripe for payment + Resend for email.

Data model: clients(name, email, address, tax_id), invoices(number, client_id, issue_date, due_date, currency, status draft|sent|paid|overdue, notes, stripe_payment_link), line_items(invoice_id, description, quantity, unit_price, tax_rate).

Features:
- Sequential invoice numbers per year, gapless, generated inside a DB transaction.
- Live-preview editor: edit line items on the left, see the rendered PDF on the right.
- "Send" generates the PDF, creates a Stripe Payment Link for the total, and emails the client with the PDF attached and a Pay button.
- Stripe webhook marks the invoice paid and records the fee and net amount.
- Dashboard: outstanding total, overdue list, paid-this-quarter, average days-to-pay.
- Configurable tax rate per line item and a company-settings page for logo, address, and payment terms.

I am responsible for my own tax compliance — just render the rates I enter, do not try to compute jurisdictions. Include seed data and a README.`
  },
  {
    id: "accounting",
    name: "Bookkeeping & accounting",
    category: "Money",
    replaces: ["QuickBooks", "Xero", "Wave"],
    verdict: "no",
    effort: "Months",
    price: 35,
    stack: "—",
    why: "Double-entry ledgers are easy. Bank feeds, reconciliation, payroll tax tables, and an accountant who will accept your export are not. The subscription is buying you an audit trail somebody else will defend.",
    gotchas: [
      "Bank aggregation (Plaid et al.) costs more per month than QuickBooks does.",
      "Your accountant charges by the hour to work around your custom format."
    ],
    instead: "Build the thin layer instead: a CSV importer that categorises your bank exports with rules and hands your accountant a clean summary. That part is a weekend and it's where your actual time goes."
  },
  {
    id: "budget",
    name: "Personal budgeting",
    category: "Money",
    replaces: ["YNAB", "Copilot", "Monarch"],
    verdict: "maybe",
    effort: "A weekend",
    price: 15,
    stack: "SvelteKit + SQLite",
    why: "Envelope budgeting logic is a hundred lines. The reason those apps cost $15/month is the bank connection, and reselling that to yourself costs more than the subscription.",
    gotchas: [
      "Plaid/GoCardless pricing makes automated bank sync uneconomic for one user.",
      "CSV import from your bank works fine and takes five minutes a week."
    ],
    prompt: `Build a personal budgeting app using the envelope method, with CSV import instead of bank APIs.

Stack: SvelteKit + TypeScript + SQLite + Tailwind. Runs locally, data never leaves my machine.

Data model: accounts, categories(name, group, monthly_target), transactions(date, payee, memo, amount_cents, account_id, category_id, cleared), budgets(month, category_id, assigned_cents).

Features:
- CSV import with a column-mapping UI that remembers the mapping per account, and dedupes on (date, amount, payee).
- Auto-categorise with user-defined rules: "payee contains X -> category Y", applied on import, editable after.
- Month view: assigned / spent / available per category, with the "to be budgeted" number at the top. Overspent categories go red and roll negative into next month.
- Reports: spending by category over time (stacked bars), net worth line, top payees.
- All money as integer cents. Never use floats.

Include a sample CSV in the repo, a seed script, and a README explaining the envelope rules the app enforces.`
  },
  {
    id: "crm",
    name: "CRM",
    category: "Team",
    replaces: ["HubSpot Starter", "Pipedrive", "Attio"],
    verdict: "yes",
    effort: "A weekend",
    price: 25,
    priceNote: "per seat",
    stack: "Next.js + Postgres",
    why: "For a small sales motion a CRM is contacts, deals, a pipeline, and reminders. Per-seat pricing on that is why this category is the single best ROI on the list.",
    gotchas: [
      "Email sync via Gmail API is the one genuinely annoying part — do it in v2.",
      "Resist adding automations until you've used it for a month."
    ],
    prompt: `Build a CRM for a small sales team (under 10 people).

Stack: Next.js (App Router) + TypeScript + Postgres (Drizzle) + Tailwind.

Data model: companies, contacts(company_id, name, email, phone, title), deals(contact_id, company_id, title, value_cents, stage, expected_close, owner_id), activities(polymorphic: note | call | email | meeting, with due_at for tasks), users.

Features:
- Pipeline board: columns are stages, drag deals between them, column headers show count and total value.
- Contact and company detail pages with a merged activity timeline.
- Follow-up reminders: any activity with a due_at shows on a "Today" dashboard; overdue ones go red.
- Global search across contacts, companies and deals (Postgres trigram index).
- Import contacts from CSV with column mapping and duplicate detection on email.
- Reports: deals won/lost by month, pipeline value by stage, average sales cycle.

Multi-user with magic-link auth, everyone sees everything (no per-record permissions). Include migrations, a seed script with a realistic pipeline, and a README.`
  },
  {
    id: "helpdesk",
    name: "Support inbox / helpdesk",
    category: "Team",
    replaces: ["Zendesk", "Front", "Help Scout"],
    verdict: "maybe",
    effort: "A week",
    price: 25,
    priceNote: "per seat",
    stack: "Node + Postgres + inbound email webhook",
    why: "Threading inbound email correctly — References headers, quoted-reply stripping, out-of-office loops — is a week of edge cases. Doable, but it is the whole job.",
    gotchas: [
      "Use an inbound-email provider's webhook (Postmark, Resend). Do not run your own MTA.",
      "Reply-quote stripping is the difference between usable and unusable."
    ],
    prompt: `Build a shared support inbox for a 3-person team.

Stack: Node + Fastify + Postgres + a React frontend. Inbound email via Postmark's inbound webhook; outbound via Postmark.

Data model: conversations(subject, requester_email, status open|pending|closed, assignee_id, last_message_at), messages(conversation_id, direction, from, to, body_html, body_text, message_id, in_reply_to, references[]), users, canned_replies.

Features:
- Inbound webhook threads a message into an existing conversation by Message-ID/In-Reply-To/References, falling back to a +token in the reply-to address. Create a new conversation otherwise.
- Strip quoted replies and signatures from displayed message bodies (keep the raw copy).
- Inbox views: unassigned, mine, all open, closed. Assign, snooze until a date, close.
- Reply composer with canned replies and keyboard send (Cmd+Enter). Outbound sets In-Reply-To correctly so threading survives in the customer's client.
- Detect auto-responders (Auto-Submitted header, common subjects) and do not reopen conversations for them.
- Full-text search across all messages.

Include a fixture set of raw inbound payloads and tests for the threading logic — that is the part that must be right.`
  },
  {
    id: "feedback",
    name: "Feature requests & roadmap",
    category: "Marketing",
    replaces: ["Canny", "Featurebase", "Nolt"],
    verdict: "yes",
    effort: "A weekend",
    price: 50,
    stack: "Next.js + Postgres",
    why: "A list with upvotes and a status column. The pricing on this category is pure positioning.",
    gotchas: ["Add rate limiting and a spam check or you will be moderating pill ads by week two."],
    prompt: `Build a public feature-request board.

Stack: Next.js (App Router) + TypeScript + Postgres (Drizzle) + Tailwind, deployable to Vercel.

Data model: posts(title, body_md, board_id, status open|planned|in_progress|shipped|declined, author_email, created_at), votes(post_id, voter_hash unique per post), comments(post_id, body, author_email, is_admin), boards.

Features:
- Public board grouped by status, sortable by votes / newest / trending (votes weighted by recency).
- One vote per person per post: hash IP + user-agent + a salt, no login required for voting.
- Submitting a post asks for an email so I can notify them on status change; sending that notification is a background job via Resend.
- Admin view behind a password env var: change status, merge duplicate posts (votes and comments move to the target), pin, delete.
- A public /roadmap page: three columns — planned, in progress, shipped.
- Rate limit submissions and comments per IP, honeypot field, and hold posts with links for review.

Include seed data, migrations, and a README.`
  },
  {
    id: "statuspage",
    name: "Status page",
    category: "Ops",
    replaces: ["Statuspage", "Instatus", "Better Stack"],
    verdict: "yes",
    effort: "An afternoon",
    price: 29,
    stack: "Static site + a JSON file",
    why: "A public page that reads incident markdown and shows green squares. Just host it somewhere your app isn't.",
    gotchas: ["Host it on a different provider than the service it reports on. This is the entire point."],
    prompt: `Build a public status page that is a static site, hostable on Cloudflare Pages, separate from the app it reports on.

Stack: Astro + Tailwind. Content as markdown files in the repo; a build runs on every push and on a cron.

Features:
- components.yml defines the services shown. incidents/*.md are incident files with frontmatter (title, started_at, resolved_at, severity, affected components) and a body of timestamped updates.
- Homepage: overall status banner, per-component current status, and a 90-day uptime bar per component built from a checks.json history file.
- Incident history page, plus per-incident permalink pages.
- RSS feed and an /api/status.json endpoint for programmatic checks.
- A GitHub Action that runs every 5 minutes, curls each component's health URL, appends the result to checks.json, and commits it.
- Subscribe box that posts an email to a webhook of my choosing.

No database, no server. Everything is files in git so the page keeps working when my infrastructure does not.`
  },
  {
    id: "uptime",
    name: "Uptime monitoring",
    category: "Ops",
    replaces: ["Pingdom", "UptimeRobot Pro", "Better Uptime"],
    verdict: "yes",
    effort: "An afternoon",
    price: 20,
    stack: "Node + cron + SQLite",
    why: "curl on a timer with alerting. The one thing you can't self-host is a second geographic location, and for most people one is enough.",
    gotchas: ["Alert on two consecutive failures, not one, or you'll mute it within a week."],
    prompt: `Build an uptime monitor I can run on a $5 VPS.

Stack: Node + TypeScript + SQLite + a small Fastify dashboard.

Data model: monitors(name, url, method, expected_status, keyword, interval_seconds, timeout_ms, enabled), checks(monitor_id, checked_at, ok, status_code, response_ms, error), incidents(monitor_id, started_at, resolved_at, cause).

Features:
- Scheduler runs each monitor on its own interval, with jitter so they don't all fire at once.
- A check fails on: non-matching status, missing keyword in body, timeout, TLS error. Record response time always.
- Open an incident after 2 consecutive failures; resolve after 2 consecutive successes. Alert once per state change, never per check.
- Alerts via webhook (Slack/Discord format) and email through Resend, configurable per monitor.
- TLS certificate expiry check daily, warn at 14 days.
- Dashboard: current status grid, 24h/7d/30d uptime percentages, response-time sparkline per monitor, incident log.

Include a Dockerfile, a systemd unit as an alternative, and a README.`
  },
  {
    id: "shortener",
    name: "Link shortener & click analytics",
    category: "Marketing",
    replaces: ["Bitly", "Dub", "Short.io"],
    verdict: "yes",
    effort: "An afternoon",
    price: 35,
    stack: "Cloudflare Workers + KV/D1",
    why: "A redirect and a counter, running at the edge for pennies. The paid tiers charge per click for a KV lookup.",
    gotchas: ["Use a 302, not a 301, unless you never want to change the destination again."],
    prompt: `Build a link shortener on Cloudflare Workers with my own domain.

Stack: Cloudflare Workers + D1 for links + Analytics Engine (or a D1 clicks table) for events + Hono for routing. Admin UI as a small static SPA on Cloudflare Pages.

Features:
- GET /:slug -> 302 to the destination, logging click time, referrer, country (cf.country), device class parsed from UA, and the UTM params on the short link.
- Custom slugs, or a generated 6-char nanoid. Optional expiry date and click limit; expired links return a configurable 410 page.
- Optional password-protected links and a "deep link" mode that appends the incoming query string to the destination.
- Admin API behind a bearer token: create, edit, archive, bulk-import from CSV.
- Dashboard: clicks over time, top referrers, top countries, device split, per-link detail.
- QR code generation per link, downloadable as SVG.

Bot filtering: skip logging for known crawler user agents but still redirect. Include wrangler config, D1 migrations, and a README.`
  },
  {
    id: "forms",
    name: "Forms & surveys",
    category: "Marketing",
    replaces: ["Typeform", "Jotform", "Tally Pro"],
    verdict: "yes",
    effort: "A weekend",
    price: 25,
    stack: "Next.js + Postgres",
    why: "A JSON schema, a renderer, and a responses table. Conditional logic is the only interesting part and it's a weekend of it.",
    gotchas: ["File uploads change the cost profile — S3 with presigned URLs, and cap the size."],
    prompt: `Build a form builder with one-question-at-a-time rendering.

Stack: Next.js (App Router) + TypeScript + Postgres (Drizzle) + Tailwind + Framer Motion for transitions.

Data model: forms(slug, title, theme_json, schema_json, published), responses(form_id, answers_json, started_at, submitted_at, meta_json), plus a partials table for abandoned responses.

Features:
- Builder: drag to reorder questions. Types: short text, long text, email, number, single select, multi select, rating, date, file upload, statement.
- Conditional logic: "if Q2 = X, jump to Q5 / skip Q3". Store as rules on the question, evaluate in the renderer.
- Public form: one question per screen, Enter to advance, progress bar, resumable via a token in localStorage, saves partial answers as you go.
- Responses table with per-question summary charts, and CSV export.
- Webhook on submit with HMAC signature, plus optional email notification.
- File uploads go to S3-compatible storage via presigned URLs, 10MB cap, and are virus-scanned by a stub function I can swap.

Include a theme editor (colours, font, background) and a README.`
  },
  {
    id: "scheduling",
    name: "Meeting scheduling links",
    category: "Productivity",
    replaces: ["Calendly", "Cal.com Pro", "SavvyCal"],
    verdict: "maybe",
    effort: "A weekend",
    price: 12,
    stack: "Next.js + Google Calendar API",
    why: "Availability maths across timezones and DST is genuinely hard, and the calendar OAuth review process is a real cost of your time. Buildable, but this is the one where the paid tier is defensible.",
    gotchas: [
      "Google's OAuth verification for calendar scopes takes weeks if you want other people to use it.",
      "Double-booking bugs are embarrassing in a way most bugs aren't. Write tests."
    ],
    prompt: `Build a personal scheduling-link app (a self-hosted Calendly for one person).

Stack: Next.js (App Router) + TypeScript + Postgres + Google Calendar API (OAuth for my account only, so no app verification needed).

Data model: event_types(slug, title, duration_min, buffer_before, buffer_after, min_notice_hours, max_days_out, availability_json, location), bookings(event_type_id, invitee_name, invitee_email, starts_at, ends_at, timezone, google_event_id, cancelled_at).

Features:
- Weekly availability rules per event type, in my timezone, with date overrides for holidays.
- Slot generation: subtract busy blocks from the Calendar freebusy API, apply buffers, min notice and max horizon, then render in the visitor's detected timezone with a timezone picker.
- Booking creates a Google Calendar event with a Meet link and emails both parties an .ics attachment.
- Reschedule and cancel links in the confirmation email, both token-authenticated.
- Prevent double-booking with a transactional re-check of freebusy at confirm time, not just at render time.

Use Luxon for all timezone maths. Write unit tests for slot generation across a DST boundary in both directions — that is where this breaks.`
  },
  {
    id: "analytics",
    name: "Web analytics",
    category: "Marketing",
    replaces: ["Plausible", "Fathom", "Google Analytics 4"],
    verdict: "yes",
    effort: "A weekend",
    price: 9,
    stack: "Cloudflare Workers + ClickHouse or SQLite",
    why: "A 1px script, an events table, and some GROUP BYs. You also stop shipping a third-party script to your visitors, which is the actual win.",
    gotchas: [
      "Aggregate on write (daily rollups) or your queries slow down at a few million rows.",
      "Hash the IP with a daily-rotating salt and you stay cookie-free."
    ],
    prompt: `Build a privacy-friendly web analytics service, cookie-free.

Stack: Cloudflare Workers + D1 (or Postgres if simpler) for aggregates, Hono for the API, a Next.js dashboard.

Collector:
- A <1KB script that sends pageviews and SPA route changes to /api/event, plus an optional custom-event API window.stats('signup').
- Server derives country from cf headers, device/browser/OS from UA, and a visitor_id = sha256(ip + ua + domain + daily_salt). Never store the raw IP. Salt rotates at midnight UTC, so visitors are unlinkable across days by design.
- Bot filtering against a known-crawler list.

Storage: raw events for 7 days, plus rollup tables written hourly: pageviews per (site, day, path), per (site, day, referrer), per (site, day, country), and sessions per day. Dashboard queries only touch rollups.

Dashboard: visitors/pageviews/bounce/avg duration with a comparison to the previous period, top pages, top referrers grouped by source, countries map, device split, and a live "visitors in the last 5 minutes" counter. Date-range picker with URL state, and a public-dashboard share toggle.

Include the collector script minified in the repo, and a README with the snippet to paste.`
  },
  {
    id: "productanalytics",
    name: "Product analytics & funnels",
    category: "Marketing",
    replaces: ["Mixpanel", "Amplitude", "PostHog Cloud"],
    verdict: "maybe",
    effort: "A week",
    price: 25,
    stack: "ClickHouse + Next.js",
    why: "Funnels and retention over a few million events are fine. Past a hundred million, you are now running a columnar database as a hobby.",
    gotchas: [
      "Use ClickHouse from day one; Postgres will not do retention queries at volume.",
      "PostHog is open source and self-hostable — building from scratch may be the wrong kind of fun."
    ],
    prompt: `Build a product analytics service for event-based funnels and retention.

Stack: ClickHouse for events, Node + Fastify for ingest, Next.js for the dashboard.

Ingest: POST /capture with {distinct_id, event, properties, timestamp}, batched, async-inserted into a ClickHouse events table (event LowCardinality, properties as a JSON column, ordered by (project, event, timestamp)). Identify/alias support to merge anonymous ids into a user id.

Queries:
- Trends: any event over time, with breakdown by a property and filters, daily/weekly granularity.
- Funnels: ordered steps with a conversion window, showing per-step conversion and median time-to-convert, plus a breakdown by property.
- Retention: cohort by first occurrence of event A, returning on event B, as an N-week triangle.
- User paths: top next-events after a chosen event.

Dashboard: saved insights on a dashboard grid, date-range and global filters, CSV export per insight.

Include the ClickHouse DDL, a generator that seeds 2 million realistic events, and notes on which queries need which index. Show me the actual SQL each insight runs — I want to be able to read it.`
  },
  {
    id: "sessionreplay",
    name: "Session replay & heatmaps",
    category: "Marketing",
    replaces: ["Hotjar", "FullStory", "LogRocket"],
    verdict: "maybe",
    effort: "A week",
    price: 40,
    stack: "rrweb + object storage",
    why: "rrweb is open source and does the hard part. What you're really buying is the storage bill and the privacy review, both of which are now yours.",
    gotchas: [
      "Mask every input by default. A leaked replay of a password field is a genuine incident.",
      "Storage grows fast: compress, sample, and expire after 30 days."
    ],
    prompt: `Build a session replay tool using rrweb.

Stack: rrweb for recording, Node + Fastify for ingest, S3-compatible object storage for session data, Postgres for metadata, Next.js + rrweb-player for playback.

Recorder:
- rrweb record with maskAllInputs: true, blockClass "no-record", and a configurable list of CSS selectors to mask text within. Default to masking — opting in per element, never out.
- Buffer events and POST compressed batches (gzip via CompressionStream) every 5 seconds and on pagehide via sendBeacon.

Backend:
- Store event batches as gzipped NDJSON in object storage keyed by session; Postgres holds sessions(id, user_id, started_at, duration, page_count, country, device, has_rage_click, has_error).
- Detect and flag rage clicks (3+ clicks in 1s within 30px), dead clicks, and JS errors during ingest so they are queryable.
- Lifecycle rule deletes session data after 30 days.

Dashboard: session list filterable by flags/duration/page, player with speed controls and skip-inactivity, plus a click heatmap per URL rendered from click coordinates over a screenshot of the DOM snapshot.

Document the privacy posture in the README, including what is never recorded.`
  },
  {
    id: "newsletter",
    name: "Email newsletter",
    category: "Marketing",
    replaces: ["ConvertKit", "Mailchimp", "Beehiiv"],
    verdict: "maybe",
    effort: "A weekend",
    price: 29,
    stack: "Next.js + Postgres + Resend/SES",
    why: "The app is easy. Deliverability is not an app — it is domain reputation, warming, and complaint handling. Send through a provider and you're fine; try to send yourself and you're in spam.",
    gotchas: [
      "Never send from your own SMTP. Use SES/Resend/Postmark.",
      "One-click unsubscribe headers are mandatory now, not optional."
    ],
    prompt: `Build a newsletter platform for a single publication.

Stack: Next.js (App Router) + TypeScript + Postgres (Drizzle) + Amazon SES (or Resend) for delivery + BullMQ/Redis for the send queue.

Data model: subscribers(email unique, status pending|active|unsubscribed|bounced, tags[], subscribed_at, confirm_token, source), issues(subject, body_md, status draft|scheduled|sent, scheduled_at, sent_at), sends(issue_id, subscriber_id, sent_at, opened_at, clicked_at), events from webhooks.

Features:
- Double opt-in signup: form -> confirmation email -> active. Embeddable signup form snippet.
- Markdown editor with live email preview, and a rendered HTML email that survives Outlook (tables, inline CSS — use react-email or mjml).
- Queued sending in batches with rate limiting to stay under the provider's send rate; resumable if it crashes mid-send.
- List-Unsubscribe and List-Unsubscribe-Post headers plus a footer link; unsubscribes are one click, no login, no confirmation page.
- SES/Resend webhook handling for bounces and complaints: hard bounce or complaint sets status immediately and permanently.
- Per-issue stats: delivered, open rate (pixel), click rate (link wrapping), unsubscribes.
- A public web archive of past issues.

Include a README section on DNS: SPF, DKIM, DMARC, and a custom tracking domain.`
  },
  {
    id: "socialscheduler",
    name: "Social media scheduler",
    category: "Marketing",
    replaces: ["Buffer", "Hypefury", "Later"],
    verdict: "maybe",
    effort: "A weekend",
    price: 15,
    stack: "Node + cron + platform APIs",
    why: "The scheduler is trivial. X's API pricing and every platform's changing terms are the actual product you were paying for.",
    gotchas: [
      "X API access costs more than Buffer. Check current pricing before you start.",
      "LinkedIn and Instagram APIs require app review; personal-use posting is limited."
    ],
    prompt: `Build a social media scheduler for my own accounts.

Stack: Node + TypeScript + Postgres + BullMQ for scheduled jobs + a small React dashboard.

Data model: accounts(platform, handle, oauth_tokens encrypted at rest, token_expires_at), posts(body, media[], scheduled_at, status draft|queued|posted|failed, platform_post_id, error), threads(ordered posts).

Features:
- Compose once, choose target accounts, with per-platform overrides and a live character counter using each platform's real counting rules.
- Media upload with per-platform validation (aspect ratio, size, duration) before scheduling, not at post time.
- Queue view (calendar + list), drag to reschedule, "post now", and a posting-times preset so I can just add to a slot.
- Threads: chained posts that reply to the previous id, aborting the rest if one fails.
- Token refresh job that renews OAuth tokens before expiry and alerts me if refresh fails.
- Retry failed posts with exponential backoff, max 3, then notify.

Write the platform integrations behind a single interface with one adapter per platform, so I can add or remove a platform without touching the scheduler. Start with adapters for Mastodon and Bluesky (open APIs), and stub X/LinkedIn behind the same interface.`
  },
  {
    id: "seo",
    name: "SEO & backlink research",
    category: "Marketing",
    replaces: ["Ahrefs", "Semrush", "Moz"],
    verdict: "no",
    effort: "Years",
    price: 129,
    stack: "—",
    why: "You are not paying for the app, you are paying for a petabyte-scale crawl of the web and a decade of historical index data. That is the product, and you cannot build it.",
    gotchas: ["Rank tracking alone is buildable via a SERP API — the rest is not."],
    instead: "Build a rank tracker: a nightly job that queries a SERP API for your keywords, stores positions, and charts movement. That covers the 20% of Ahrefs most people actually open it for, at API cost."
  },
  {
    id: "password",
    name: "Password manager",
    category: "Ops",
    replaces: ["1Password", "LastPass", "Dashlane"],
    verdict: "no",
    effort: "Don't",
    price: 5,
    stack: "—",
    why: "Client-side crypto, a browser extension that fights every site's login form, secure recovery, and a threat model where a bug loses everything permanently. This is the one category where rolling your own is actively worse than paying.",
    gotchas: ["A vibe-coded crypto bug is silent until it isn't."],
    instead: "If you want to self-host, run Vaultwarden (the Bitwarden-compatible server). Existing audited clients, your own storage. Do not write the crypto."
  },
  {
    id: "filestorage",
    name: "File sync & storage",
    category: "Ops",
    replaces: ["Dropbox", "Google Drive", "iCloud+"],
    verdict: "no",
    effort: "Months",
    price: 10,
    stack: "—",
    why: "Conflict resolution, partial-file sync, and a native filesystem watcher on three OSes. The sync engine is a decade of engineering, and losing a file costs more than the subscription ever will.",
    gotchas: ["Sync conflicts are a distributed systems problem wearing a friendly icon."],
    instead: "Syncthing or Nextcloud, both mature and self-hostable. Build the layer on top instead — a share-link UI over your own S3 bucket is genuinely a weekend."
  },
  {
    id: "chat",
    name: "Team chat",
    category: "Team",
    replaces: ["Slack", "Microsoft Teams"],
    verdict: "no",
    effort: "Months",
    price: 9,
    priceNote: "per seat",
    stack: "—",
    why: "You can build a chat app in a weekend. You cannot build search over five years of history, mobile push that arrives reliably, and the integrations your team already depends on.",
    gotchas: ["Mobile push notification reliability is the hidden 80% of the work."],
    instead: "Self-host Zulip or Mattermost if the bill is the problem. Building your own only makes sense if chat is your product."
  },
  {
    id: "design",
    name: "Design tool",
    category: "Media",
    replaces: ["Figma", "Sketch", "Adobe XD"],
    verdict: "no",
    effort: "Years",
    price: 16,
    priceNote: "per seat",
    stack: "—",
    why: "A multiplayer vector editor with a CRDT sync engine, a font rendering stack, and a plugin ecosystem. Every part of that is a company.",
    gotchas: ["Even the 'simple' part — bezier editing that feels right — is months."],
    instead: "For one-off graphics, Penpot is open source and self-hostable. For programmatic image generation (OG images, certificates, social cards), that IS a weekend project and worth building."
  },
  {
    id: "photo",
    name: "Photo & video editing",
    category: "Media",
    replaces: ["Photoshop", "Premiere", "Final Cut"],
    verdict: "no",
    effort: "Years",
    price: 23,
    stack: "—",
    why: "Decades of codecs, colour science, GPU pipelines and hardware acceleration. Your agent can wrap ffmpeg, which is useful, but that is not an editor.",
    gotchas: ["Video export performance is the product. A slow editor is not an editor."],
    instead: "Build the batch job you actually keep doing by hand: an ffmpeg/sharp pipeline that crops, watermarks, transcodes and uploads. That saves more hours than the editor does."
  },
  {
    id: "screenshot",
    name: "Screenshot capture & sharing",
    category: "Media",
    replaces: ["CleanShot Cloud", "Droplr", "Monosnap"],
    verdict: "yes",
    effort: "A weekend",
    price: 10,
    stack: "Electron or a shell script + S3",
    why: "Your OS already takes the screenshot. You are paying for an upload and a short URL.",
    gotchas: ["On macOS a shell script plus a hotkey beats a whole Electron app."],
    prompt: `Build a screenshot capture-and-share tool for macOS.

Two parts:

1. Capture: a small menu-bar app (Swift, or Electron if that's faster to iterate) with a global hotkey that triggers a region capture via screencapture, opens a lightweight annotation window (arrow, rectangle, highlight, blur for redaction, text), then uploads.

2. Host: a tiny service — S3-compatible bucket + a Cloudflare Worker — that accepts an authenticated upload, stores the image under a nanoid key, and serves a viewer page with OG tags so the image unfurls in Slack. Copy the short URL to the clipboard and show a notification when done.

Also support: optional expiry (24h / 7d / never) set at upload time, optional password, drag-the-uploaded-file-out-of-the-app, and a local history list of recent uploads with re-copy and delete.

Blur redaction must rasterise the blur into the uploaded image — never ship the original pixels with a blur overlay. Include the Worker, the bucket lifecycle policy for expiry, and a README with signing-key setup.`
  },
  {
    id: "loom",
    name: "Screen recording with share links",
    category: "Media",
    replaces: ["Loom", "Vidyard", "Tella"],
    verdict: "maybe",
    effort: "A week",
    price: 15,
    stack: "MediaRecorder + object storage + a transcoder",
    why: "Recording in the browser is a built-in API. Transcoding to something that plays everywhere, and the bandwidth bill, are the parts you were paying for.",
    gotchas: [
      "Serve HLS, not a raw webm, if you want it to play on iOS reliably.",
      "Bandwidth is the real cost — put a CDN in front from day one."
    ],
    prompt: `Build a screen-recording-with-share-link tool (a self-hosted Loom).

Stack: browser MediaRecorder for capture, Node + Fastify for the API, S3-compatible storage, ffmpeg for transcoding, Next.js for the viewer.

Recorder (web app, no install):
- getDisplayMedia for the screen + getUserMedia for camera and mic, composited so the camera is a draggable circle overlay.
- Countdown, pause/resume, and chunked upload of MediaRecorder blobs during recording so the upload is nearly finished when I stop.

Backend:
- On finalise, queue an ffmpeg job: transcode to H.264 MP4 plus an HLS ladder (360p/720p), extract a poster frame, and write duration/dimensions to Postgres.
- Optional transcription with Whisper, stored as WebVTT and attached as a caption track.

Viewer page:
- HLS playback with a poster, speed control, captions, and a transcript panel that seeks on click.
- Per-view analytics: unique viewers, watch-through percentage, drop-off curve.
- Sharing: unlisted link, optional password, optional expiry. Comments with timestamps.

Include the worker process, a docker-compose with ffmpeg, and a README covering CDN setup.`
  },
  {
    id: "transcription",
    name: "Meeting notes & transcription",
    category: "Productivity",
    replaces: ["Otter", "Fireflies", "Granola"],
    verdict: "maybe",
    effort: "A weekend",
    price: 20,
    stack: "Whisper API + an LLM for summaries",
    why: "Transcription and summarisation are API calls now. The awkward part is getting audio out of the meeting — the bot-joins-your-call trick is the actual product.",
    gotchas: [
      "Recording a call may need everyone's consent depending on where you are. Check.",
      "Local system-audio capture on macOS needs a virtual audio device."
    ],
    prompt: `Build a meeting notes tool that transcribes and summarises recordings.

Stack: Node + TypeScript + Postgres + object storage. Transcription via the OpenAI Whisper API (with a local whisper.cpp fallback path). Summarisation via the Claude API using the @anthropic-ai/sdk.

Flow:
- Upload an audio/video file, or point at a local folder that gets watched for new recordings.
- ffmpeg normalises to 16kHz mono, and splits anything over 24MB into overlapping chunks; stitch the transcripts back with timestamp offsets.
- Speaker diarisation via pyannote if available, otherwise label speakers as Speaker 1/2 and let me rename them once, applying it across the transcript.
- Summarise with Claude into: a 3-sentence overview, decisions made, action items with owners and dates, and open questions. Ask for structured JSON output and validate it with zod before storing.

UI: transcript with click-to-seek audio playback, editable speaker names, the summary at the top, full-text search across all meetings, and export to markdown.

Costs matter: show me the per-meeting API cost after each run. Include a README with env vars and a note on consent to record.`
  },
  {
    id: "pdf",
    name: "PDF tools",
    category: "Productivity",
    replaces: ["Smallpdf", "Adobe Acrobat", "iLovePDF"],
    verdict: "yes",
    effort: "An afternoon",
    price: 12,
    stack: "pdf-lib / pdf.js, all client-side",
    why: "Merge, split, rotate, compress. There are mature open source libraries for all of it, and doing it in the browser means your documents never leave your machine.",
    gotchas: ["OCR is the one part that needs real work — Tesseract in a worker, and it's slow."],
    prompt: `Build a PDF toolbox that runs entirely in the browser — no server, no upload, files never leave the machine.

Stack: Vite + TypeScript + pdf-lib for manipulation + pdf.js for rendering + Tailwind. Heavy work in a Web Worker so the UI never blocks.

Tools:
- Merge: drop several PDFs, drag to reorder at the file and page level, export.
- Split: page thumbnails with checkboxes, extract selection to a new file or split every N pages.
- Rotate and delete pages, with undo.
- Compress: re-encode embedded images at a chosen quality; show before/after sizes.
- Images to PDF and PDF pages to PNG.
- Fill and flatten form fields; add a drawn or typed signature positioned by drag.
- Add page numbers, and a text or image watermark with opacity and rotation.
- Optional OCR via tesseract.js in a worker, producing a searchable text layer, with a clear progress bar because it is slow.

Everything is drag-and-drop with a persistent file tray so I can chain operations without re-uploading. Show a "processed locally, nothing uploaded" note in the UI, because that is the whole point. Ship as a static site.`
  },
  {
    id: "images",
    name: "Image optimisation & CDN",
    category: "Dev tools",
    replaces: ["Cloudinary", "imgix", "TinyPNG"],
    verdict: "yes",
    effort: "A weekend",
    price: 89,
    stack: "Cloudflare Workers + sharp/wasm",
    why: "Resize on demand, cache forever at the edge. Per-transformation pricing on this is why the bill surprises people at scale.",
    gotchas: ["Sign or allowlist your transform params or you're paying for someone else's fun."],
    prompt: `Build an image optimisation and delivery service.

Stack: Cloudflare Workers + R2 for originals + the Workers cache API. Transformations via Photon/wasm at the edge, or a Node origin using sharp if the wasm path is limiting.

URL API: /:signature/:transforms/:key — e.g. /abc123/w_800,q_80,f_auto/photos/hero.jpg
- Supported transforms: w, h, fit (cover|contain|inside), q, f (auto|webp|avif|jpeg), blur, dpr, and a gravity option for cropping.
- f_auto picks AVIF/WebP/JPEG from the Accept header.
- Cache immutably at the edge keyed on the full transform string; originals are never served directly.

Security: HMAC-sign the transform segment with a shared secret so nobody can request arbitrary resizes off my bucket. Ship a small signing helper for Node and one for the browser.

Also: an upload endpoint with a presigned URL flow, a placeholder generator (LQIP base64 blur-up + dominant colour), and a stats endpoint for bandwidth and cache hit rate per key.

Include a React <Img> component that generates the srcset for common breakpoints, plus a migration script that walks an existing folder of images into R2.`
  },
  {
    id: "adminpanel",
    name: "Internal admin panel",
    category: "Dev tools",
    replaces: ["Retool", "Appsmith", "Forest Admin"],
    verdict: "yes",
    effort: "A weekend",
    price: 50,
    priceNote: "per seat",
    stack: "Next.js + your existing database",
    why: "This is now the clearest win on the list. An agent writes CRUD screens against your schema faster than you can drag them into a builder, and per-seat pricing on internal tools is brutal.",
    gotchas: ["Write actions need an audit log and a confirmation step. Internal tools cause real incidents."],
    prompt: `Build an internal admin panel over my existing Postgres database.

Stack: Next.js (App Router) + TypeScript + Drizzle + Tailwind + TanStack Table.

Start by introspecting the database schema and generating a config file (one entry per table: label, columns to show, searchable fields, editable fields, relations) so the UI is config-driven and I can regenerate it when the schema changes without losing customisations.

Features:
- List views: server-side pagination, sorting, per-column filters, global search, saved filter URLs, CSV export of the current filter.
- Detail view: inline editing with zod validation derived from the column types, plus related-record tabs following foreign keys.
- Custom actions: a way to register a named server action (e.g. "refund order", "resend welcome email") that appears as a button with a confirmation dialog and an optional form.
- Every write goes through one wrapper that records actor, table, row id, before/after JSON in an audit_log table, and there is a page to browse it.
- Auth via Google OAuth restricted to my company domain, with two roles: viewer and editor.

Never expose a raw SQL box. Include a README on adding a new table to the config and on deploying behind a VPN or Cloudflare Access.`
  },
  {
    id: "airtable",
    name: "Spreadsheet-database",
    category: "Productivity",
    replaces: ["Airtable", "Smartsheet", "Notion databases"],
    verdict: "maybe",
    effort: "A week",
    price: 24,
    priceNote: "per seat",
    stack: "Next.js + Postgres",
    why: "A grid over a table is easy. A grid that stays smooth at 50k rows, with linked records, formula fields and permissions, is a real product.",
    gotchas: [
      "Virtualise the grid from the start; retrofitting it is painful.",
      "Formula fields mean writing an expression parser. Budget for it, or drop the feature."
    ],
    prompt: `Build a lightweight Airtable alternative for a small team.

Stack: Next.js + TypeScript + Postgres (Drizzle) + TanStack Virtual for the grid.

Data model: bases, tables, fields(type, options_json, order), records(table_id, values_json), views(type grid|kanban|calendar, filters, sorts, group_by, hidden_fields).

Field types: text, long text, number, currency, date, single select, multi select, checkbox, attachment, link-to-record, lookup, rollup, created/modified time.

Features:
- Virtualised grid: frozen first column, inline cell editing, keyboard navigation like a spreadsheet (arrows, tab, Enter, copy/paste a range from Excel), row expand modal.
- Views with saved filters, sorts, grouping and per-view field visibility; kanban grouped by a select field with drag between columns; a calendar view on a date field.
- Link-to-record with a picker, and lookup/rollup fields that resolve through the link.
- A REST API per table with an API key, so I can automate against it.
- Realtime updates over a WebSocket so two people don't clobber each other; last-write-wins per cell with a toast when a value changes under you.

Target smooth scrolling at 50,000 rows — measure it and tell me where it breaks. Skip formula fields in v1.`
  },
  {
    id: "docs",
    name: "Documentation site",
    category: "Dev tools",
    replaces: ["GitBook", "Notion sites", "Document360"],
    verdict: "yes",
    effort: "An afternoon",
    price: 8,
    priceNote: "per seat",
    stack: "Astro Starlight or Docusaurus",
    why: "Markdown in git, rendered as a static site. Free, open source options are better than most paid ones already.",
    gotchas: ["Search: Pagefind builds a static index at build time and needs no service."],
    prompt: `Build a documentation site for my project, deployable to Cloudflare Pages.

Stack: Astro + Starlight. Content as MDX in a docs/ folder, sidebar generated from frontmatter order.

Requirements:
- Static full-text search with Pagefind — no external search service, no API key.
- Dark/light theme with my brand colours, and a landing page separate from the docs shell.
- Code blocks with syntax highlighting, filename headers, line highlighting, and a copy button. Tabbed code groups for multiple languages.
- Versioned docs: /v1 and /v2 trees with a version switcher, where the latest is also served at the root.
- An OpenAPI page generated from my spec file at build time.
- Auto-generated "edit this page on GitHub" links, last-updated dates from git, and previous/next navigation.
- A build-time link checker that fails the build on a broken internal link or missing image.
- llms.txt output so coding agents can consume the docs cleanly.

Include a GitHub Action for deploy previews per PR, and a README explaining how to add a page.`
  },
  {
    id: "flags",
    name: "Feature flags",
    category: "Dev tools",
    replaces: ["LaunchDarkly", "Split", "Flagsmith"],
    verdict: "yes",
    effort: "A weekend",
    price: 75,
    stack: "Cloudflare Workers + KV",
    why: "A JSON document, an edge cache, and a consistent hash for percentage rollouts. LaunchDarkly's pricing has funded a lot of weekend projects.",
    gotchas: ["Bucketing must be deterministic on user id, or users flicker between variants."],
    prompt: `Build a feature flag service.

Stack: Cloudflare Workers + KV for flag config + D1 for the admin database. SDKs in TypeScript (server and browser) and one more language of your choice.

Model: flags(key, description, type boolean|string|number|json, default_value, archived), environments(dev/staging/prod), rules per flag per environment: ordered list of {conditions on context attributes, variant} plus a percentage rollout with a bucketing key.

Evaluation:
- SDK fetches the whole environment's flag payload from the edge, caches it, and evaluates locally — zero network calls per flag check.
- Percentage rollout uses a deterministic hash of (flag key + bucketing key), so a user stays in the same bucket across sessions and across flags is independent.
- Streaming updates via SSE, with polling fallback, so a flag change propagates within seconds without a deploy.
- Every evaluation optionally reports to an analytics endpoint, batched, for "who saw what".

Admin UI: toggle per environment, edit rules, a diff-and-confirm dialog before a prod change, an audit log of every change with who and when, and a big "kill switch" that sets a flag to its default everywhere.

Fail safe: if the SDK cannot reach the service, it uses the last cached payload, then the hardcoded defaults in code. Never throw. Include tests for bucketing distribution.`
  },
  {
    id: "errors",
    name: "Error tracking",
    category: "Dev tools",
    replaces: ["Sentry", "Bugsnag", "Rollbar"],
    verdict: "maybe",
    effort: "A week",
    price: 29,
    stack: "Node + Postgres + source maps",
    why: "Catching and storing errors is easy. Grouping them into useful issues, and applying source maps to minified stack traces, is the part that makes the tool worth having.",
    gotchas: [
      "Sentry's SDKs are open source and excellent — use them and just build the backend.",
      "Fingerprinting is the whole product. Bad grouping means 4,000 issues that are one bug."
    ],
    prompt: `Build an error tracking backend that speaks the Sentry SDK protocol, so I can keep using the official SDKs and only change the DSN.

Stack: Node + Fastify + Postgres + object storage for source maps + Next.js dashboard.

Ingest:
- Accept the Sentry envelope format at /api/:project/envelope/, validate the DSN key, and store events.
- Group into issues by fingerprint: default fingerprint = hash of (exception type + normalised top in-app stack frames), with numbers, hex ids and UUIDs normalised out of frame paths. Allow a custom fingerprint from the event.
- Apply source maps: accept uploaded maps per release, resolve minified frames to original file/line/column and show surrounding source context.

Dashboard:
- Issue list: title, culprit, events count, users affected, first/last seen, sparkline. Sort by frequency or recency; filter by release, environment, tag.
- Issue detail: latest event with full stack trace (in-app frames expanded, vendor frames collapsed), breadcrumbs, request context, tags, and the events-over-time chart.
- Resolve / ignore / regression detection: a resolved issue that recurs in a later release reopens and alerts.
- Alerts to webhook and email on a new issue or a spike (5x the hourly baseline).

Rate-limit per project and drop events over quota rather than falling over. Include fixture envelopes and tests for the fingerprinting.`
  },
  {
    id: "cron",
    name: "Cron job monitoring",
    category: "Ops",
    replaces: ["Cronitor", "Healthchecks.io", "Dead Man's Snitch"],
    verdict: "yes",
    effort: "An afternoon",
    price: 20,
    stack: "Node + SQLite",
    why: "A URL your job pings and an alert when it doesn't. Genuinely a few hundred lines, and Healthchecks.io is open source if you'd rather just host it.",
    gotchas: ["Host it somewhere other than the machine running the jobs. Obviously."],
    prompt: `Build a dead-man's-switch monitor for cron jobs.

Stack: Node + Fastify + SQLite, deployable as a single container.

Model: checks(slug, name, schedule_cron or period_seconds, grace_seconds, last_ping_at, status up|late|down|paused), pings(check_id, received_at, kind start|success|fail, duration_ms, exit_code, body).

Features:
- GET/POST /ping/:slug marks success; /ping/:slug/start marks a run start (so I get duration); /ping/:slug/fail with an optional exit code and log body marks failure.
- A sweeper computes the next expected ping from the cron expression plus grace, and moves a check to "late" then "down", alerting once per transition.
- Alerts by webhook, email, and Telegram, with a per-check escalation delay.
- Dashboard: status grid, last 30 runs per check with durations, and a log body viewer for failures (truncate at 10KB).
- Auto-create a check on first ping to an unknown slug if a flag is set, so adding a job is just adding a curl line.
- A "pause during maintenance" toggle with an auto-resume time.

Include copy-paste snippets for bash (with trap to report failures), a Python decorator, and a GitHub Actions step. Ship a Dockerfile and a README.`
  },
  {
    id: "changelog",
    name: "Changelog & in-app announcements",
    category: "Marketing",
    replaces: ["Beamer", "Headway", "LaunchNotes"],
    verdict: "yes",
    effort: "An afternoon",
    price: 49,
    stack: "Static markdown + a tiny widget",
    why: "Markdown files and a bell icon with an unread dot. This is the most obviously overpriced category on the list.",
    gotchas: ["Keep the widget under a few KB — it loads on every page of your app."],
    prompt: `Build a changelog with an in-app announcement widget.

Two parts:

1. Public changelog page: Astro static site reading entries/*.md with frontmatter (title, date, tags like New/Improved/Fixed, image). Renders a timeline, filterable by tag, with permalinks per entry, an RSS feed, and a JSON feed at /changelog.json.

2. Embeddable widget: a single <script> under 5KB gzipped that adds a bell icon to my app's header. It fetches /changelog.json, shows an unread dot when there are entries newer than the last-seen timestamp in localStorage, and opens a panel with the latest entries. Configurable position and theme, with a data attribute to scope by tag so I can show only entries relevant to a product area. Must not leak styles into or from the host page — render inside a shadow DOM.

Also: an email digest job that sends the month's entries to a subscriber list, and an og:image generated per entry at build time.

No tracking, no cookies, no external requests beyond my own domain. Include the widget build config and a README with the embed snippet.`
  },
  {
    id: "waitlist",
    name: "Waitlist & referrals",
    category: "Marketing",
    replaces: ["Viral Loops", "LaunchList", "GetWaitlist"],
    verdict: "yes",
    effort: "An afternoon",
    price: 39,
    stack: "Next.js + Postgres",
    why: "A signup form, a referral code, and a position counter. Charging monthly for this is the purest example of the pattern.",
    gotchas: ["Referral fraud is real — dedupe on email plus IP or your leaderboard is nonsense."],
    prompt: `Build a waitlist app with referral-based queue jumping.

Stack: Next.js (App Router) + TypeScript + Postgres (Drizzle) + Resend for email, deployable to Vercel.

Data model: signups(email unique, referral_code unique, referred_by, position, points, verified, ip_hash, created_at), referrals(referrer_id, referee_id, counted).

Features:
- Signup form -> confirmation email with a magic link to verify. Only verified signups count for referrals.
- Personal status page at /s/[code]: current position, number of people behind them, their share link, and one-click share buttons for X, LinkedIn, WhatsApp, email.
- Position = base signup order minus (referrals * jump_amount), recomputed with a single SQL window function, never in a loop.
- Milestone rewards: at 3 / 10 / 25 verified referrals, unlock a named perk and send a congratulations email.
- Anti-fraud: dedupe on normalised email (strip gmail dots and +tags), block disposable domains from a list, cap referrals per ip_hash, and flag rather than delete suspicious signups for review.
- Admin page: total signups, verified rate, referral coefficient, top referrers, CSV export, and a "send invite" action that marks people admitted in batches.

Include an embeddable form snippet and a README.`
  },
  {
    id: "esign",
    name: "E-signature",
    category: "Money",
    replaces: ["DocuSign", "HelloSign", "PandaDoc"],
    verdict: "no",
    effort: "Months",
    price: 25,
    stack: "—",
    why: "The PDF part is trivial. What you're buying is an evidentiary audit trail that holds up when a contract is disputed — identity verification, tamper-evident sealing, and a company willing to testify to it.",
    gotchas: ["ESIGN/eIDAS compliance is a legal posture, not a feature you implement."],
    instead: "For low-stakes internal sign-offs — NDAs with contractors you know, internal approvals — a simple sign-and-timestamp app with a hash chain is a weekend and fine. For anything you'd litigate, pay."
  },
  {
    id: "backup",
    name: "Cloud backup",
    category: "Ops",
    replaces: ["Backblaze", "Carbonite", "Arq Premium"],
    verdict: "no",
    effort: "Don't",
    price: 9,
    stack: "—",
    why: "Backup software you wrote yourself, that you have never tested a restore from, is not a backup. The value is entirely in it working on the worst day of your year.",
    gotchas: ["An untested restore is a rumour, not a backup."],
    instead: "Use restic or Kopia — open source, well-tested, encrypted, pointed at any S3 bucket. Then build the part worth building: a monitor that alerts you when a backup hasn't completed in 48 hours."
  },
  {
    id: "course",
    name: "Course & membership platform",
    category: "Marketing",
    replaces: ["Teachable", "Kajabi", "Podia"],
    verdict: "maybe",
    effort: "A week",
    price: 99,
    stack: "Next.js + Stripe + Mux/Bunny",
    why: "Worth it purely on the maths — these platforms often take a revenue cut on top of the monthly fee. The catch is video hosting, which you should rent rather than build.",
    gotchas: [
      "Do not self-host video. Use Mux or Bunny Stream; the bandwidth will eat you.",
      "Handle Stripe webhooks idempotently or you'll double-grant access."
    ],
    prompt: `Build a course platform for selling my own video course.

Stack: Next.js (App Router) + TypeScript + Postgres (Drizzle) + Stripe Checkout + Bunny Stream (or Mux) for video + Resend for email.

Data model: courses, modules, lessons(video_id, duration, free_preview, attachments[]), purchases(user_id, course_id, stripe_session_id, amount, refunded_at), progress(user_id, lesson_id, seconds_watched, completed_at), users.

Features:
- Sales page per course: curriculum outline with free-preview lessons playable without an account, testimonials, FAQ, and a Stripe Checkout button supporting one-time and 3-part payment plans.
- Stripe webhook grants access, creates the account, and emails a magic link. Make the handler idempotent on event id — retries must not double-grant. Refunds revoke access.
- Player: signed, expiring video URLs from the host so links can't be shared, resume-where-you-left-off, playback speed, and per-lesson completion with a course progress bar.
- Drip schedule option: unlock module N days after purchase.
- Certificate PDF on completion, and a per-student progress view for me.
- Discount codes with expiry and max redemptions, handled by Stripe promotion codes.

Never proxy video through my own server. Include migrations, a Stripe test-mode setup guide, and a README.`
  },
  {
    id: "familycal",
    name: "Family calendar & lists",
    category: "Home & life",
    replaces: ["Cozi", "Skylight", "FamilyWall"],
    verdict: "yes",
    effort: "A weekend",
    price: 4,
    stack: "SvelteKit + SQLite + CalDAV",
    why: "A shared calendar, a shared list, and a meal plan. Turning an old tablet into a fridge display is the fun part.",
    gotchas: ["Subscribe to everyone's existing calendars by ICS URL rather than migrating them."],
    prompt: `Build a family dashboard for an old tablet mounted on the fridge, plus a phone-friendly view.

Stack: SvelteKit + SQLite + Tailwind. Runs on a Raspberry Pi or any always-on machine on the home network.

Features:
- Calendar: aggregate several ICS subscription URLs (Google, iCloud, school calendars), colour-coded per person, shown as an agenda for the next 7 days plus a month grid. Refresh every 15 minutes and cache so it survives an offline period.
- Shared lists: groceries and to-dos, with quick-add, category grouping, and a "recently bought" list to re-add staples in one tap.
- Meal plan: assign meals to days of the week, with a "add all ingredients to groceries" action.
- Chores: recurring per-person tasks with a weekly reset and a simple star tally.
- Ambient display mode: large type, auto-dimming after dark, weather from a free API, and a photo slideshow from a folder when idle for 5 minutes.

Kiosk-friendly: no login on the local network, but a PIN-gated settings page. Everything must work with no internet except the calendar and weather refresh. Include Pi setup notes in the README.`
  },
  {
    id: "workout",
    name: "Workout logging",
    category: "Home & life",
    replaces: ["Strong", "Hevy", "JEFIT"],
    verdict: "yes",
    effort: "An afternoon",
    price: 6,
    stack: "PWA + localStorage or SQLite",
    why: "Sets, reps, weight, and a chart of your working weight over time. The gym-floor UX is the only thing to get right.",
    gotchas: ["Design it for one thumb, sweaty hands, and a screen you glance at between sets."],
    prompt: `Build a workout logger as a PWA I use on my phone at the gym.

Stack: Vite + React + TypeScript + Tailwind + Dexie (IndexedDB). Fully offline; no server, no account.

Data model: exercises(name, muscle_group, equipment, is_custom), routines(name, ordered exercises with target sets/reps), workouts(started_at, ended_at, routine_id), sets(workout_id, exercise_id, set_number, weight, reps, rpe, is_warmup, completed_at).

Features:
- Start from a routine or freestyle. Logging a set is: tap the exercise, weight and reps prefilled from last time, tap done. Two taps for a normal set.
- Rest timer starts automatically on completing a set, with a vibration and a notification when it ends; adjustable per exercise.
- Plate calculator: given a target weight and bar weight, show which plates per side.
- History per exercise: personal records (1RM estimate via Epley, best set, best volume), a chart of working weight over time, and last workout's numbers always visible while logging.
- Body weight log and a simple volume-per-muscle-group weekly chart.
- Export/import all data as JSON, and a CSV export for the charts.

UI must be one-thumb usable: big targets, bottom-anchored controls, high contrast, and it must never lose data if the browser is killed mid-workout — persist on every set.`
  },
  {
    id: "jobtracker",
    name: "Job application tracker",
    category: "Home & life",
    replaces: ["Teal", "Huntr", "Simplify"],
    verdict: "yes",
    effort: "An afternoon",
    price: 9,
    stack: "Next.js + SQLite",
    why: "A kanban board with dates and a reminder. The paid versions bundle an AI resume rewriter, which is now a prompt you can write yourself.",
    gotchas: ["The clipper matters more than the board — if saving a job takes 30 seconds you won't do it."],
    prompt: `Build a job application tracker.

Stack: Next.js (App Router) + TypeScript + SQLite + Tailwind, run locally.

Data model: applications(company, role, url, source, salary_range, location, status wishlist|applied|screen|interview|offer|rejected, applied_at, next_action, next_action_at, notes_md), contacts(application_id, name, role, email, linkedin), documents(application_id, kind resume|cover_letter, file_path, version).

Features:
- Kanban board by status with drag between columns, plus a table view sortable by date and a calendar of upcoming actions.
- Quick-add from a URL: paste a job posting link, fetch the page, and extract company, title, location and salary with a Claude API call returning structured JSON validated by zod. Always show me the extracted fields to confirm before saving.
- Follow-up nudges: anything in "applied" with no activity for 10 days shows on a Today list.
- Per-application notes with markdown, and an interview-prep section with the questions I was asked.
- Tailored resume helper: store a master resume as markdown, and generate a tailored version against a job description with the Claude API, showing a diff against the master so I can see exactly what changed. I edit before export; it never sends anything anywhere.
- Stats: applications per week, response rate by source, funnel conversion.

Export everything to CSV and markdown. Include seed data and a README.`
  }
];
