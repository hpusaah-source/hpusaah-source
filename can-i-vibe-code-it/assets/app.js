/* Can I Vibe Code It? — no framework, no build step. Open index.html and it works. */

const CATALOG = window.CATALOG;

const VERDICT_LABEL = { yes: "Build it", maybe: "It depends", no: "Keep paying" };

const VERDICT_BLURB = {
  yes: "A weekend of your time beats this invoice. The whole product is a table, a form and a report.",
  maybe: "Buildable, but there is exactly one hard part. Read the gotchas — they decide it for you.",
  no: "Keep paying. What you are buying here is not the app, and you can't build the part that matters."
};

const EFFORT_RANK = {
  "An afternoon": 1, "A weekend": 2, "A week": 3, "A week+": 4,
  "Months": 8, "Years": 9, "Don't": 9
};

/* Each agent gets the same brief with a different jacket on — the prompt is the product,
   the preamble just sets the working style each tool responds to. */
const TOOLS = {
  claude: {
    label: "Claude Code",
    preamble:
      "Plan before you build. Propose the file layout and the data model first and wait for my " +
      "go-ahead, then implement it in one pass. Run the thing and verify it actually works " +
      "before you tell me it's done.\n\n",
    coda:
      "\n\nWhen you're finished: a README with a single command to run it, seed data so the first " +
      "screen isn't empty, and a short list of what you deliberately left out."
  },
  codex: {
    label: "Codex",
    preamble:
      "Build this end to end. Set up the project, install dependencies, and run the test suite " +
      "and the app before reporting back. If a choice is ambiguous, pick the boring option and " +
      "note it rather than stopping to ask.\n\n",
    coda:
      "\n\nWhen you're finished: a README with a single command to run it, seed data so the first " +
      "screen isn't empty, and a short list of what you deliberately left out."
  },
  cursor: {
    label: "Cursor",
    preamble:
      "Use Agent mode and create the files directly. Follow the conventions already in this " +
      "workspace where they exist; otherwise use the stack below.\n\n",
    coda:
      "\n\nWhen you're finished: a README with a single command to run it, seed data so the first " +
      "screen isn't empty, and a short list of what you deliberately left out."
  }
};

const state = {
  q: "",
  verdicts: new Set(),
  category: "",
  sort: "savings",
  tool: "claude",
  picks: new Set(load("civci:picks", [])),
  open: null
};

const $ = (sel) => document.querySelector(sel);
const grid = $("#grid");
const dialog = $("#sheet-dialog");

/* ---------- storage ---------- */

function load(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* private browsing — picks just won't persist */
  }
}

/* ---------- helpers ---------- */

const esc = (s) =>
  String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

const money = (n) => "$" + n.toLocaleString("en-US");

function priceLabel(item) {
  return money(item.price) + "/mo" + (item.priceNote ? " " + item.priceNote : "");
}

function matches(item, q) {
  if (!q) return true;
  const hay = [item.name, item.category, item.stack, item.why, ...item.replaces]
    .join(" ")
    .toLowerCase();
  return q.split(/\s+/).every((term) => hay.includes(term));
}

function visible() {
  const q = state.q.trim().toLowerCase();
  let out = CATALOG.filter(
    (item) =>
      matches(item, q) &&
      (state.verdicts.size === 0 || state.verdicts.has(item.verdict)) &&
      (!state.category || item.category === state.category)
  );

  const sorters = {
    // A price is only a saving if you can actually replace it, so the no's sink.
    savings: (a, b) =>
      (a.verdict === "no") - (b.verdict === "no") || b.price - a.price || a.name.localeCompare(b.name),
    effort: (a, b) =>
      (EFFORT_RANK[a.effort] ?? 5) - (EFFORT_RANK[b.effort] ?? 5) || a.name.localeCompare(b.name),
    name: (a, b) => a.name.localeCompare(b.name),
    category: (a, b) => a.category.localeCompare(b.category) || b.price - a.price
  };
  return out.sort(sorters[state.sort]);
}

/* ---------- grid ---------- */

function cardHTML(item) {
  const picked = state.picks.has(item.id);
  return `
    <article class="card v-${item.verdict}" data-id="${item.id}" tabindex="0" role="button"
             aria-label="${esc(item.name)} — ${VERDICT_LABEL[item.verdict]}">
      <button class="pick" data-pick="${item.id}" aria-pressed="${picked}"
              aria-label="${picked ? "Remove from" : "Add to"} my build list" title="Add to my build list">
        <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor"
             stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M2 7.5 5.5 11 12 3.5"/>
        </svg>
      </button>
      <h3>${esc(item.name)}</h3>
      <p class="replaces">${esc(item.replaces.join(" · "))}</p>
      <p class="why">${esc(item.why)}</p>
      <div class="meta">
        <span class="verdict-tag">${VERDICT_LABEL[item.verdict]}</span>
        <span class="sep">/</span>
        <span>${esc(item.effort)}</span>
        <span class="price">${esc(priceLabel(item))}</span>
      </div>
    </article>`;
}

function render() {
  const items = visible();

  grid.innerHTML = items.length
    ? items.map(cardHTML).join("")
    : `<p class="empty">Nothing matches that. Try a product name — most entries list the
        subscriptions they replace.</p>`;

  const buildable = items.filter((i) => i.verdict !== "no").length;
  $("#count").textContent = items.length
    ? `${items.length} of ${CATALOG.length} categories · ${buildable} you could build yourself`
    : "";

  renderTally();
}

function renderTally() {
  const picked = CATALOG.filter((i) => state.picks.has(i.id));
  const tally = $("#tally");

  if (!picked.length) {
    tally.innerHTML = `<span>Tick the box on a card to add it to your build list and total up what it's costing you.</span>`;
    return;
  }

  const monthly = picked.reduce((sum, i) => sum + i.price, 0);
  const perSeat = picked.some((i) => i.priceNote);
  tally.innerHTML = `
    <span>Build list: <strong>${picked.length}</strong> app${picked.length > 1 ? "s" : ""}</span>
    <span>Cancelling saves <strong>${money(monthly)}</strong>/mo — <strong>${money(monthly * 12)}</strong>/yr${perSeat ? " <span>(some priced per seat)</span>" : ""}</span>
    <button class="clear" id="clear-picks">clear</button>`;

  $("#clear-picks").addEventListener("click", () => {
    state.picks.clear();
    save("civci:picks", []);
    render();
  });
}

/* ---------- detail sheet ---------- */

function fullPrompt(item) {
  const tool = TOOLS[state.tool];
  return tool.preamble + item.prompt.trim() + tool.coda;
}

function sheetHTML(item) {
  const facts = [
    ["Verdict", VERDICT_LABEL[item.verdict]],
    ["Effort", item.effort],
    ["They charge", priceLabel(item)],
    ["Suggested stack", item.stack]
  ];

  const body = item.prompt
    ? `
      <div class="prompt-head">
        <h4>The prompt</h4>
        <div class="tool-tabs" id="tool-tabs">
          ${Object.entries(TOOLS)
            .map(
              ([key, t]) =>
                `<button class="tool-tab" data-tool="${key}" aria-pressed="${key === state.tool}">${t.label}</button>`
            )
            .join("")}
        </div>
        <button class="copy" id="copy-prompt">Copy</button>
      </div>
      <pre class="prompt" id="prompt-text">${esc(fullPrompt(item))}</pre>
      <p class="footnote">
        Paste it as your first message in a fresh, empty directory. Expect to spend the second
        hour telling it what you actually meant — that part is the job, and it's still faster
        than the trial signup.
      </p>`
    : `
      <h4>What to build instead</h4>
      <p class="body">${esc(item.instead || "")}</p>`;

  return `
    <div class="sheet-head">
      <div>
        <h2>${esc(item.name)}</h2>
        <p class="replaces">Replaces ${esc(item.replaces.join(", "))}</p>
      </div>
      <button class="close" id="close-sheet" aria-label="Close">✕</button>
    </div>

    <div class="verdict-banner ${item.verdict}">
      <b>${VERDICT_LABEL[item.verdict]}</b>
      ${esc(VERDICT_BLURB[item.verdict])}
    </div>

    <dl class="facts">
      ${facts
        .map(([k, v]) => `<div class="fact"><dt>${k}</dt><dd>${esc(v)}</dd></div>`)
        .join("")}
    </dl>

    <h4>The honest read</h4>
    <p class="body">${esc(item.why)}</p>

    ${
      item.gotchas && item.gotchas.length
        ? `<h4>Where it bites</h4>
           <ul class="gotchas">${item.gotchas.map((g) => `<li>${esc(g)}</li>`).join("")}</ul>`
        : ""
    }

    ${body}`;
}

function openSheet(id) {
  const item = CATALOG.find((i) => i.id === id);
  if (!item) return;
  state.open = item;
  $("#sheet").innerHTML = sheetHTML(item);
  $("#sheet").scrollTop = 0;
  if (!dialog.open) dialog.showModal();
  location.hash = id;
}

function closeSheet() {
  if (dialog.open) dialog.close();
}

async function copyPrompt() {
  const btn = $("#copy-prompt");
  const text = fullPrompt(state.open);
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
  }
  btn.textContent = "Copied";
  btn.classList.add("done");
  setTimeout(() => {
    btn.textContent = "Copy";
    btn.classList.remove("done");
  }, 1600);
}

/* ---------- events ---------- */

grid.addEventListener("click", (e) => {
  const pick = e.target.closest("[data-pick]");
  if (pick) {
    const id = pick.dataset.pick;
    state.picks.has(id) ? state.picks.delete(id) : state.picks.add(id);
    save("civci:picks", [...state.picks]);
    pick.setAttribute("aria-pressed", state.picks.has(id));
    renderTally();
    return;
  }
  const card = e.target.closest(".card");
  if (card) openSheet(card.dataset.id);
});

grid.addEventListener("keydown", (e) => {
  if ((e.key === "Enter" || e.key === " ") && e.target.classList.contains("card")) {
    e.preventDefault();
    openSheet(e.target.dataset.id);
  }
});

dialog.addEventListener("click", (e) => {
  if (e.target === dialog) return closeSheet(); // click on the backdrop
  if (e.target.closest("#close-sheet")) return closeSheet();

  const tab = e.target.closest("[data-tool]");
  if (tab) {
    state.tool = tab.dataset.tool;
    save("civci:tool", state.tool);
    $("#prompt-text").textContent = fullPrompt(state.open);
    document
      .querySelectorAll("[data-tool]")
      .forEach((t) => t.setAttribute("aria-pressed", t.dataset.tool === state.tool));
    return;
  }

  if (e.target.closest("#copy-prompt")) copyPrompt();
});

dialog.addEventListener("close", () => {
  state.open = null;
  if (location.hash) history.replaceState(null, "", location.pathname + location.search);
});

$("#search").addEventListener("input", (e) => {
  state.q = e.target.value;
  render();
});

$("#verdict-filters").addEventListener("click", (e) => {
  const chip = e.target.closest("[data-verdict]");
  if (!chip) return;
  const v = chip.dataset.verdict;
  state.verdicts.has(v) ? state.verdicts.delete(v) : state.verdicts.add(v);
  chip.setAttribute("aria-pressed", state.verdicts.has(v));
  render();
});

$("#category").addEventListener("change", (e) => {
  state.category = e.target.value;
  render();
});

$("#sort").addEventListener("change", (e) => {
  state.sort = e.target.value;
  render();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "/" && !/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName)) {
    e.preventDefault();
    $("#search").focus();
    $("#search").select();
  }
});

/* ---------- theme ---------- */

const themeBtn = $("#theme-toggle");

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  themeBtn.textContent = theme === "dark" ? "Light" : "Dark";
  save("civci:theme", theme);
}

themeBtn.addEventListener("click", () =>
  applyTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark")
);

/* ---------- boot ---------- */

function init() {
  const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
  applyTheme(load("civci:theme", prefersLight ? "light" : "dark"));
  state.tool = load("civci:tool", "claude");

  const categories = [...new Set(CATALOG.map((i) => i.category))].sort();
  $("#category").innerHTML =
    `<option value="">All categories</option>` +
    categories.map((c) => `<option value="${esc(c)}">${esc(c)}</option>`).join("");

  $("#search").placeholder = `Search ${CATALOG.length} categories — Notion, Calendly, Sentry…`;

  render();

  const hash = location.hash.slice(1);
  if (hash) openSheet(hash);
}

init();
