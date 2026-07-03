# Part 6 — The Refund Stack

**10 open-source repos that kill ~$55,000/year of "unavoidable" software.**

This is part six of the open-source alternatives series. This round goes after
the bills everyone believes have no alternative: your email server, your VPN,
your HR software, even Grammarly. Together these 10 repos carry **over 294,000
GitHub stars** — the biggest lineup in the series.

> **One honest rule:** self-hosting saves you the license fee, not the work.

Every repo is real. Every command below stands the tool up. Each entry lists the
bill it replaces and the *honest catch* — the thing the hosted version does that
you now own yourself.

---

## The lineup at a glance

| # | Tool | Replaces | Approx. bill killed | Stars* |
|---|------|----------|--------------------|--------|
| 1 | **Firecrawl** | Apify / paid scraping APIs | ~$2,400/yr | ~143k |
| 2 | **Postiz** | Buffer / Hootsuite | ~$2,400/yr | ~32k |
| 3 | **Huly** | Linear + Slack + Notion | ~$3,300/yr (10 users) | ~26k |
| 4 | **NetBird** | Tailscale (control plane) | ~$2,400/yr (25 users) | ~26k |
| 5 | **Stalwart** | Google Workspace (mail) | ~$1,680/yr (10 users) | ~13k |
| 6 | **LanguageTool** | Grammarly Pro | ~$1,440/yr (10 users) | ~14k |
| 7 | **Rybbit** | Plausible + Hotjar | ~$800/yr | ~12k |
| 8 | **Solidtime** | Toggl | ~$2,160/yr (10 users) | ~9k |
| 9 | **Frappe HR** | BambooHR | ~$3,000/yr (25 employees) | ~8k |
| 10 | **GrowthBook** | LaunchDarkly + Optimizely | ~$36,000/yr | ~8k |

\*Star counts are approximate snapshots from the video and move over time.

**Total: over $55,000/year in software, for zero.**

---

## 1. Firecrawl — the scraping engine of the AI era

Zero to ~143,000 stars in about two years. Firecrawl turns any website into
clean, LLM-ready markdown or structured data. It handles JavaScript-heavy pages,
parses hosted PDFs and Word documents, and plugs straight into agents and MCP
clients. Every RAG tutorial uses its cloud API; almost nobody mentions you can
self-host the whole thing.

- **Replaces:** Apify Scale (~$199/mo, ~$2,400/yr); Firecrawl's own cloud ($83–$333/mo)
- **Setup:** clone the repo, copy the env file, `docker compose up`. API is live on `localhost:3002`.
- **Honest catch:** self-hosted skips Fire Engine (their cloud-only anti-bot / IP-rotation layer), and AI extraction needs your own model key (Ollama works).

## 2. Postiz — the open-source social scheduler

~32,000 stars, built by an indie developer. The README says it plainly: **there
is no difference between the hosted version and the self-hosted version.**

- Schedules to 20+ platforms (Instagram, TikTok, X, LinkedIn, …)
- Writes AI captions tuned per network
- Pulls analytics from official APIs so you can compare the same post across platforms
- Team approvals + a full public API for n8n / Zapier flows
- **Replaces:** Buffer (per-channel), Hootsuite ($99–$199/mo, ~$2,400/yr)
- **Setup:** clone the official Docker Compose repo, set your env, `docker compose up`, open `localhost:4007`, connect accounts.
- **Honest catch:** you create and maintain each platform's developer app yourself, and X charges for API access now.

## 3. Huly — project management + chat + docs in one repo

Huly's own tagline: an all-in-one replacement for Linear, Jira, Slack, and
Notion. ~26,000 stars. Project management with two-way GitHub sync, team chat
with a virtual office (audio/video rooms), real-time collaborative documents, and
a team planner. One repo, three subscriptions dead.

The story: Huly's hosted cloud shut down because hosting funding ran out — but
the README's very next line reads *"self-hosted deployments are not affected."*
**Clouds die. Code you host does not.**

- **Replaces:** Linear Basic + Slack Pro + Notion Plus (~$27/user/mo, ~$3,300/yr for a 10-person team)
- **Setup:** clone Huly self-host, run the setup script, open `localhost:8087`, invite the team.
- **Honest catch:** it's heavy — 8 GB RAM minimum, 16 GB recommended. This lives on a real VPS, not a $5 one.

## 4. NetBird — the fully open Tailscale

Tailscale's coordination server — the brain of the network — is closed source and
lives on their cloud. NetBird open-sources the entire thing: clients *and* control
plane. ~26,000 stars.

- WireGuard mesh, peer-to-peer with relay fallback
- SSO + MFA, access control by groups, device posture checks
- Exit nodes, private DNS, clean self-hosted admin dashboard
- **Replaces:** Tailscale Standard ($8/user/mo, ~$2,400/yr for 25 people)
- **Setup:** export your domain, run the getting-started script on a small public VM — brings up everything (identity provider included) in ~5 minutes.
- **Honest catch:** clients are BSD-licensed but the control plane is AGPL; you need a public server, a domain, and some identity setup. A real sysadmin evening.

## 5. Stalwart — never self-host email? Watch me.

The one the internet swears you should never do. That advice predates Stalwart:
~13,000 stars, written in Rust, the entire mail stack in one binary.

- SMTP, IMAP, JMAP, POP3 + CalDAV calendars, CardDAV contacts, WebDAV
- Spam and phishing filtering built in
- Web dashboard with OIDC, LDAP, 2FA
- **Replaces:** Google Workspace Business Standard ($14/user/mo, ~$1,680/yr for 10 people)
- **Setup:** one `docker run`, open the admin wizard on port 8080 (walks you through domain + DKIM), then point your MX at the server.
- **Honest catch (big one):** deliverability is now your problem — IP reputation, SPF, DKIM, DMARC. Many cheap VPS providers block port 25 entirely, so pick your host carefully. Workspace also bundles Docs and Meet, which this doesn't replace.

## 6. LanguageTool — grammar checking that never leaves your machine

The most relatable bill on the list. Grammarly Pro is $144/yr per person. ~14,000
stars, 20+ years of linguistics behind it, 25+ languages.

The trick is the server: run LanguageTool's HTTP API on your own box, then point
the browser extension, VS Code, or Obsidian at *your* server. Every keystroke
stays local — and a cloud grammar checker reads literally everything you type.

- **Replaces:** Grammarly Pro / ProWritingAid (~$144/yr/person, ~$1,440/yr for 10)
- **Setup:** ships as a single Java server (one command) or a community Docker image.
- **Honest catch:** the premium AI rewriting models are closed source — self-hosted you get the rule engine, not the rewriter. The full n-gram pack (catches *there/their/they're*) is an 8 GB download.

## 7. Rybbit — analytics + session replay, two-for-one

The breakout of the list: created January 2025, already past ~12,000 stars.
What Google Analytics should feel like — a clean real-time dashboard, funnels,
goals, user journeys, custom events — **with session replay built in.** Analytics
and the Hotjar half in the same self-hosted tool.

- **Replaces:** Plausible Business (~$19/mo) + a replay tool like Hotjar (~$49/mo) — call it ~$800/yr, both climbing with traffic
- **Setup:** clone the repo, run the setup script with your domain (provisions HTTPS automatically), drop the snippet on your site.
- **Honest catch:** an ~18-month-old project; you run a ClickHouse pipeline yourself, and web vitals is cloud-only for now.

## 8. Solidtime — the billable hour, unbilled

Every freelancer and agency pays the time-tracking tax. Solidtime is the modern
open-source answer — launched January 2024, ~9,000 stars, arguably the cleanest UI
in the category.

- Projects, tasks, clients with billable rates at every level (project / member / org)
- Multiple orgs under one account with roles and permissions
- **Importers for Toggl, Clockify, and CSV** — your history walks out with you
- **Replaces:** Toggl Premium ($18/user/mo, ~$2,160/yr for 10 people)
- **Setup:** copy the env files, `docker compose up`, run the migrate and create-user commands, then import your Toggl data.
- **Honest catch:** young — no invoicing built in yet. Track time and rates here, bill from your invoicing tool.

## 9. Frappe HR — HR + payroll suite

From the team behind ERPNext. HR software has some of the most cynical pricing in
SaaS (BambooHR won't even publish numbers). ~8,000 stars, GPL-licensed.

- Full employee lifecycle: onboarding, appraisals, transfers, exit interviews
- Leave and attendance with geolocation check-in
- Expense claims with multi-level approvals
- Real payroll engine: salary structures, tax slabs, salary slips + a mobile app
- **Replaces:** BambooHR (reported ~$10/employee/mo, ~$250/mo minimum → ~$3,000/yr for 25 people)
- **Setup:** clone the repo, `docker compose up` from the docker folder, open `localhost:8000`, add employees, run a payroll.
- **Honest catch:** it computes payroll but does not file your taxes — the one thing Gusto genuinely does for its fee. Production means running the Frappe stack.

## 10. GrowthBook — feature flags + A/B testing (the biggest kill)

Feature flags and experimentation look like small tools until the invoices arrive.
LaunchDarkly bills by usage; a dedicated platform like Optimizely starts around
**$36,000/yr** entry-level. GrowthBook replaces both. ~8,000 stars, MIT-licensed core.

- Feature flags with advanced targeting, gradual rollouts, kill switches across 24 SDKs (React, Python, iOS, Android, …)
- **Warehouse-native experimentation:** analysis runs inside your own warehouse (BigQuery, Snowflake, Databricks) — your user data never leaves your infrastructure
- Serious stats engine: Bayesian and frequentist, CUPED variance reduction, sequential testing
- **Replaces:** LaunchDarkly + Optimizely (~$36,000/yr and up)
- **Setup:** clone, `docker compose up`, open `localhost:3000`, connect the warehouse, ship your first flag.
- **Honest catch:** GrowthBook brings no data of its own — you need event tracking flowing into a warehouse first, and a few enterprise directory features are not MIT.

---

## The tally

Firecrawl · Postiz · Huly · NetBird · Stalwart · LanguageTool · Rybbit ·
Solidtime · Frappe HR · GrowthBook.

**10 repos · ~294,000 stars · over $55,000/year of "unavoidable" bills killed.**

Clouds die. Code you host does not.
