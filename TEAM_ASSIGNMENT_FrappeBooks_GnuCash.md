# Team Assignment: Install & Evaluate Frappe Books and GnuCash

> **Forward this whole document to the technical team.**

---

## Message from management

Team,

I want us to move off relying on QuickBooks/Wave/Excel and evaluate two **free, open-source**
accounting apps: **Frappe Books** and **GnuCash**. Please install **both** on a test machine,
set up a sample company, and run through the checklist below so we can compare them side by side
against what QuickBooks and Wave do.

This is time-sensitive — **please start ASAP** and report back within the timeline below. Both apps
are free, install like normal desktop software, and store data locally, so there's no procurement
or licensing to wait on. Ping me with any blockers.

Thanks.

---

## Objective

Install Frappe Books and GnuCash, load identical sample data into each, and produce a short
comparison so leadership can decide which one to adopt as our QuickBooks/Wave/Excel replacement.

- **Priority:** High — start immediately
- **Environment:** One clean test machine (Windows or Mac preferred). Do **not** use real/production financial data yet — use the sample data in Part 3.
- **Cost:** $0 (both are free & open source)

---

## Part 1 — Install Frappe Books

**Official source (GitHub):** https://github.com/frappe/books
**Direct downloads:** open the repo's **Releases** page and pick the latest stable release.

### Windows
1. Go to https://github.com/frappe/books/releases
2. Download the latest `Frappe-Books-Setup-x.x.x.exe` (Windows installer).
3. Double-click the `.exe`. If Windows SmartScreen warns, choose **More info → Run anyway** (it's an unsigned open-source app — expected).
4. Complete the installer and launch **Frappe Books**.

### macOS
1. From the same Releases page, download the `.dmg` (choose the Apple Silicon `arm64` build for M1/M2/M3 Macs, or the Intel `x64` build for older Macs).
2. Open the `.dmg` and drag **Frappe Books** into **Applications**.
3. First launch: right-click the app → **Open** → **Open** (to bypass the Gatekeeper warning for unsigned apps).

### Linux
1. Download the `.AppImage` (or `.deb` for Debian/Ubuntu) from Releases.
2. AppImage: `chmod +x Frappe-Books-*.AppImage` then run it. Or `sudo dpkg -i frappe-books_*.deb` for the `.deb`.

### First-run setup
- Create a new company file → enter company name, **country**, and **currency**.
- Note where the local database file is saved (this file **is** your books — back it up).
- No account, no login, no internet required.

---

## Part 2 — Install GnuCash

**Official download:** https://www.gnucash.org/download
**Source (GitHub):** https://github.com/Gnucash/gnucash

### Windows
1. Go to https://www.gnucash.org/download → **Windows** → download the stable installer (`gnucash-x.x.x-setup.exe`).
2. Run the installer, accept defaults, launch **GnuCash**.

### macOS
1. From the download page → **Mac** → download the `.dmg`.
2. Open it and drag **GnuCash** to **Applications**. Launch it (right-click → Open on first run if prompted).

### Linux
- Ubuntu/Debian: `sudo apt install gnucash`
- Fedora: `sudo dnf install gnucash`
- Or use the Flatpak: `flatpak install flathub org.gnucash.GnuCash`

### First-run setup
- Use the **New Account Hierarchy** assistant → pick your country/currency → select a starter
  chart of accounts (e.g. "Common Accounts" or "Business Accounts").
- Save the GnuCash file locally (this file **is** your books — back it up).

---

## Part 3 — Load the same sample data into BOTH apps

So the comparison is fair, enter the **same** test data in each app:

1. **Company:** "Test Co." — your country and home currency.
2. **Two customers:** Customer A, Customer B (any name/address).
3. **Two products/services:** e.g. "Consulting — $100/hr", "Support Plan — $50".
4. **Create 3 sales invoices** across those customers, mark **one as paid**, leave two open.
5. **Enter 3 expenses/bills:** e.g. software subscription, office supplies, internet.
6. **Record one bank/cash payment** received and one paid out.
7. **Generate reports:** Profit & Loss (Income Statement), Balance Sheet, and a list of unpaid invoices (A/R aging).

---

## Part 4 — Evaluation checklist (fill in for EACH app)

Rate each item: ✅ Easy · 🟡 Possible but clunky · ❌ Missing. Add notes.

| # | Capability | Frappe Books | GnuCash |
|---|---|---|---|
| 1 | Install & first-run setup time | | |
| 2 | Create company + chart of accounts | | |
| 3 | Create & send a customer invoice | | |
| 4 | Record a customer payment | | |
| 5 | Enter a vendor bill / expense | | |
| 6 | Profit & Loss report | | |
| 7 | Balance Sheet report | | |
| 8 | Unpaid invoices / A/R aging | | |
| 9 | Multi-currency (if we need it) | | |
| 10 | Import bank transactions (CSV/OFX) | | |
| 11 | Export data / reports (PDF, CSV) | | |
| 12 | Overall ease for a non-accountant | | |
| 13 | UI look & modern feel | | |
| 14 | Data backup — where is the file, how to back it up | | |

**Known expectations (so the team knows what to look for):**
- **Frappe Books** = modern QuickBooks-like UI, easy invoicing, offline. *No* automatic bank feeds, *no* payroll.
- **GnuCash** = very powerful double-entry engine, strong reports, multi-currency. *Dated* UI, clunky invoicing, *no* bank feeds (manual CSV/OFX import).

---

## Part 5 — Deliverable & timeline

Please send me back:

1. **The filled-in checklist table** (Part 4) for both apps.
2. **A 3–5 sentence recommendation:** which one you'd pick and why, for a team new to accounting.
3. **Screenshots** of each app's Profit & Loss report and one invoice.
4. **Any blockers** (install issues, missing features we actually need like payroll or bank feeds).

**Suggested timeline (adjust as needed):**
- **Day 1:** Both apps installed, sample company created in each.
- **Day 2:** Sample invoices/expenses entered, reports generated, checklist filled.
- **Day 3:** Recommendation + screenshots sent to management.

---

## Reference

- Frappe Books (GitHub): https://github.com/frappe/books
- Frappe Books docs: https://docs.frappe.io/books
- GnuCash download: https://www.gnucash.org/download
- GnuCash (GitHub): https://github.com/Gnucash/gnucash
- GnuCash tutorial/guide: https://www.gnucash.org/docs.phtml

*Both apps are free and open source. Data is stored in a local file on the test machine — remember to back that file up.*
