# Bright Side Cleaning — Instant Quote Tool

A single-page instant quote tool for a home cleaning business (Fable 5 automation
use case #1). Enter a few details about the home and get a clear, all-in price
instantly, then generate a clean, shareable summary page.

## Open it

It's a single self-contained `index.html` — no build step, no server required.
Open `index.html` in any browser, or host it anywhere (the file is fully static).

## Inputs → price

The quote is computed deterministically from four inputs:

- **Number of bedrooms** — `$22` each
- **Number of bathrooms** — `$28` each
- **Square footage** — `$0.045` / sq ft
- **Deep clean** (yes/no) — multiplies the whole clean by `1.4` (+40%)

Plus a `$49` base service fee, with an `$89` minimum visit. Every line item is
shown in a transparent breakdown so the price is never a black box.

## Shareable summary

Clicking **Get my sharable quote** shows a clean summary page with a quote ID and
a **Copy sharable link** button. The link encodes the inputs in the URL, so
opening it reproduces the exact same quote — reload-safe and easy to send to a
customer.

## Tested

`test.mjs` drives the page end-to-end with Playwright and independently
re-derives every price to verify the on-screen math. It covers pricing across a
range of inputs, deep-clean pricing, invalid-input handling, the stepper
buttons, the share/summary flow, shareable-URL reload, and asserts a clean
console (no errors). Run it with:

```bash
npm install playwright
node test.mjs
```

All 31 checks pass.
