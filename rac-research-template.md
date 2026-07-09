# RAC — Research & Comparison Template

A standardized framework for sourcing and qualifying vendors, suppliers, tools, or
services, then proposing only fully-qualified candidates. Based on the **[Charisse]
RAC MASTERLIST** methodology. Copy the template block for each new research topic.

---

## 1. What RAC Is

**RAC (Research & Comparison)** is a one-tab-per-topic method for turning an open-ended
sourcing question ("find us a credible ring-box supplier") into a defensible, side-by-side
decision. Each topic produces a matrix: **criteria down the rows, candidates across the
columns**, every cell qualified pass/fail, and a single recommended candidate.

**Core principles**
- **Qualify every cell.** Each candidate is assessed against each criterion and marked
  qualified or not — no blanks, no "maybe."
- **Only propose 100%-viable candidates.** A candidate is only put forward as **PROPOSED**
  if it meets the qualification threshold below.
- **Evidence, not assertion.** Every qualified claim carries a source (link, screenshot,
  quote, or document reference). Mark anything unverified as *"to confirm."*

## 2. Qualification Rules & Color Coding

| Cell / status | Color | Meaning |
|---|---|---|
| **Qualified** | 🟩 Green | Candidate meets this criterion (evidence attached) |
| **Not qualified** | 🟥 Red | Candidate fails this criterion |
| **PROPOSED** | 🟩 Green header | Recommended candidate — meets **≥ 85%** of criteria |
| **2ND PRIORITY** | 🟨 Yellow header | Viable backup — strong but below the proposal threshold |
| **NOT QUALIFIED** | 🟥 Red header | Fails one or more must-have criteria; excluded |

- **Qualification threshold: ≥ 85%** of criteria qualified (auto-calculated as
  `qualified cells ÷ total criteria`). Any candidate below 85% cannot be **PROPOSED**.
- **Must-have criteria are gating.** Failing a designated must-have (e.g., "Verified
  Supplier") disqualifies a candidate outright, regardless of overall percentage.

## 3. The Template (copy per topic)

```
< TOC                                   ← link back to Table of Contents
GOAL:        [One-sentence statement of exactly what is being sourced/decided,
              including platform or geography constraints, e.g. "Propose a credible
              supplier of ring-box and paper-box packaging on Alibaba."]

QUALIFICATION KEY:  Green = Qualified · Red = Not Qualified · Propose only ≥85% qualified

                    ┌─────────────┬─────────────┬─────────────┬─────────────┐
CURRENT STATUS      │  PROPOSED   │ 2ND PRIORITY│ NOT QUALIFIED│ NOT QUALIFIED│
                    ├─────────────┼─────────────┼─────────────┼─────────────┤
RESEARCHED/SOURCED  │ Candidate A │ Candidate B │ Candidate C │ Candidate D │
Location            │  [city/ctry]│  [city/ctry]│  [city/ctry]│  [city/ctry]│
Image               │  [photo]    │  [photo]    │  [photo]    │  [photo]    │
Link                │  [url]      │  [url]      │  [url]      │  [url]      │
                    └─────────────┴─────────────┴─────────────┴─────────────┘

CRITERIA (rows)              | QUALIFICATION STANDARD           | A | B | C | D
-------------------------------------------------------------------------------
--- Data Gathering & Assessment ---
[Criterion 1 — must-have]    | [what "qualified" requires]      | 🟩| 🟩| 🟩| 🟥
[Criterion 2]                | [what "qualified" requires]      | 🟩| 🟩| 🟥| 🟩
[Criterion 3]                | [what "qualified" requires]      | 🟩| 🟥| 🟩| 🟩
--- Commercial Terms ---
[Criterion 4 — price/MOQ]    | [threshold, e.g. MOQ ≤ 500]      | 🟩| 🟩| 🟥| 🟩
[Criterion 5 — lead time]    | [threshold, e.g. ≤ 30 days]      | 🟩| 🟥| 🟩| 🟩
--- Trust & Verification ---
[Criterion 6 — reviews]      | [threshold, e.g. ≥ 4.5 / 95%]    | 🟩| 🟩| 🟩| 🟥
[Criterion 7 — certs/warranty]| [required certification]        | 🟩| 🟩| 🟥| 🟩
-------------------------------------------------------------------------------
TOTAL CRITERIA: [N]          | QUALIFIED %  (auto = ✓ ÷ N)      |100%| 71%| 57%| 71%
STATUS (≥85% = Propose)      |                                  |PROP| 2ND| NO | 2ND

ADDITIONAL INFORMATION:
[Notes, caveats, negotiation levers, items to confirm, contact/quotes, next steps.]
```

## 4. Designing Good Criteria

- **Make each criterion binary and testable.** "Verified Supplier — yes/no," not
  "reputable." If it can't be answered pass/fail with evidence, split or sharpen it.
- **Flag must-haves explicitly.** A handful of criteria should be gating (auto-disqualify
  on fail); the rest are weighted equally toward the 85% score.
- **Group criteria into sections** — e.g., *Data Gathering & Assessment*, *Commercial
  Terms* (price, MOQ, lead time), *Trust & Verification* (reviews, certifications,
  warranty, years in business), *Logistics* (shipping, location). Adjust per topic.
- **Standardize the row set** across similar topics so tabs stay comparable.
- **State the standard, not just the label.** Each criterion row names *what qualified
  means* (the threshold), so scoring is objective and repeatable.

## 5. Reusable Prompt — generate a new RAC

```
ROLE: Act as a sourcing analyst using the RAC (Research & Comparison) method.

GOAL: Source and qualify candidates for: [what to source — product/tool/service],
on [platform / marketplace, e.g. Alibaba, Amazon, G2] within [geography, if any].

MUST-HAVE CRITERIA (auto-disqualify on fail):
• [e.g., Verified Supplier / vendor badge]
• [e.g., required certification, warranty, or compliance]
• [e.g., ships to / located in ...]

SCORED CRITERIA (contribute to the ≥85% qualification threshold):
• [price / unit cost ceiling]      • [MOQ ≤ ...]         • [lead time ≤ ...]
• [rating ≥ ... / response rate]   • [years in business] • [customization / samples]
• [add topic-specific criteria]

INSTRUCTIONS:
• Research 4–6 real candidates. For EACH, fill every criterion with a qualified/not-
  qualified verdict PLUS the evidence (link, spec, quote). No blanks.
• Verify each candidate is active/legitimate; flag anything unconfirmed as "to confirm."
• Compute qualified % (= qualified ÷ total criteria). Classify each as PROPOSED (≥85%
  and all must-haves pass), 2ND PRIORITY (strong but <85%), or NOT QUALIFIED.
• Present as a comparison matrix (criteria = rows, candidates = columns) with a
  color/qualification key, then a one-line recommendation and an "items to confirm" list.

OUTPUT: Draft inline first for my review; only propose 100%-qualified candidates.
```

## 6. Worked Mini-Example (topic #1 from the masterlist)

**GOAL:** Propose a credible Alibaba supplier of ring-box + paper-box packaging.

| Criterion (standard) | Boyang Packing | Shenfutai | Weisi |
|---|---|---|---|
| **Verified Supplier** (must-have) | 🟩 Verified | 🟩 Verified | 🟥 Not verified |
| Product match (ring + paper box) | 🟩 Yes | 🟩 Yes | 🟩 Yes |
| Location (Guangdong hub) | 🟩 Guangdong | 🟩 Guangdong | 🟩 Guangdong |
| Reviews / response rate | 🟩 High | 🟨 Mixed | 🟥 Low |
| **Qualified %** | **100% → PROPOSED** | **~80% → 2nd Priority** | **~50% → Not Qualified** |

**Recommendation:** Propose **Shenzhen Boyang Packing Co., Ltd.** (100% qualified, verified).
Hold Shenfutai as 2nd priority; exclude Weisi (fails the verified-supplier must-have).

---

*How to use:* copy the Section 3 block into a new tab per topic, define the GOAL and
criteria (Section 4), run the Section 5 prompt to populate candidates, and color each
cell per Section 2. Keep the Table of Contents updated with each new topic.
