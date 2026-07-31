# Can I Vibe Code It?

An honest audit of 48 software subscription categories: which ones you can replace with an app
you build yourself in a weekend, which ones you can't, and the exact prompt to paste into Claude
Code, Codex or Cursor for the ones you can.

Not everything is buildable. 26 of the 48 are a clear yes, 13 depend on one hard part
(deliverability, bank sync, API pricing, storage bills), and 9 are honest no's — password
managers, file sync, Figma, backup. Those entries say what to use instead. A list that claims you
can build everything isn't useful; the value is in knowing where the line is.

## Run it

No build step, no dependencies, no server needed:

```bash
open index.html          # macOS
xdg-open index.html      # Linux
```

Or serve it if your browser is fussy about `file://`:

```bash
python3 -m http.server 8080   # then http://localhost:8080
```

Deploy by copying the folder to any static host — GitHub Pages, Cloudflare Pages, Netlify.

## What's in it

- **Search and filter** by product name, category, or verdict.
- **Build list** — tick cards to total up what those subscriptions cost you per month and per year.
  Stored in `localStorage`.
- **Prompts** tuned per agent — the same brief with a Claude Code / Codex / Cursor preamble.
  One click to copy.
- Dark and light themes, `/` to focus search, deep links per entry (`#crm`).

## Files

```
index.html          markup and copy
assets/style.css    all styling, themed with CSS custom properties
assets/app.js       rendering, filtering, build list, prompt assembly
data/catalog.js     the catalog — one object per subscription category
```

## Adding an entry

Append to `window.CATALOG` in `data/catalog.js`:

```js
{
  id: "unique-slug",
  name: "What it is",
  category: "Ops",                        // new categories appear in the filter automatically
  replaces: ["Product A", "Product B"],
  verdict: "yes",                         // yes | maybe | no
  effort: "A weekend",                    // An afternoon | A weekend | A week | Months | Years | Don't
  price: 20,                              // USD/month
  priceNote: "per seat",                  // optional
  stack: "Next.js + Postgres",
  why: "One paragraph on what you're actually paying for.",
  gotchas: ["The thing that will bite you."],
  prompt: `...`                           // for yes/maybe
  // instead: "..."                       // for no — what to use or build instead
}
```

Nothing else needs touching: category options, counts and the search placeholder all derive from
the data.

## On the estimates

Prices are rough monthly list prices for a single user or small team, gathered mid-2026. The
number that matters is your own invoice times your seat count — per-seat tools are where this
pays off fastest.

"A weekend" means a version you'd genuinely use, not feature parity. Feature parity is never the
goal. Self-built tools win because they do the 20% you use and skip the rest.

Before cancelling anything: run both in parallel for a month, and confirm you can export your
data out of the thing you built. An app you can't get your data out of is just a subscription you
pay for in maintenance.
