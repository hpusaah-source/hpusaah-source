# Fact-Check: The DeepSeek / Liang Wenfeng Video Transcript

A claim-by-claim review of a short viral video narrating the story of Liang Wenfeng
and DeepSeek. Each claim is quoted, given a verdict, and checked against reporting as
of early 2026.

**Verdict key:** ✅ Accurate · 🟡 Mostly accurate (needs context) · 🟠 Exaggerated / misleading · 🔴 Unsupported or false

---

## The transcript (cleaned up)

> In 2021, a hedge fund manager started buying 10,000 Nvidia chips. He would not tell
> anyone why. Four years later, that secret erased $600 billion in a single day. Meet
> Liang Wenfeng — not a Silicon Valley founder, a quant trader from Hangzhou. Partners
> called him a nerdy guy with a bad haircut collecting GPUs for fun. In 2023, he
> launched DeepSeek. No VC, fresh graduates, no KPIs. He couldn't match OpenAI's
> billions. So he fed his model millions of answers from the American models and trained
> his own to copy them. The student learns from the teacher. January 2025, DeepSeek R1,
> $5.6 million, free forever. Nvidia lost $600 billion in a single day. Then OpenAI and
> Anthropic called him a thief. Every AI on Earth is trained on someone else's work.
> Liang just did it cheaper, gave it away for free, and beat the people who taught him
> how.

---

## Claim 1 — "In 2021, a hedge fund manager started buying 10,000 Nvidia chips."

**Verdict: 🟡 Mostly accurate.**

Liang Wenfeng co-founded the quant hedge fund **High-Flyer** in 2015–2016 and did begin
accumulating Nvidia GPUs for AI research. In a May 2023 interview with *36Kr*, Liang said
High-Flyer had acquired **~10,000 Nvidia A100 GPUs** before the U.S. tightened chip export
restrictions on China. Reporting places the bulk of that build-out around **2021–2022**,
so "in 2021 he started buying" is a fair compression of the timeline. The round number
"10,000" comes from Liang himself; independent verification of the exact count is limited.

## Claim 2 — "He would not tell anyone why."

**Verdict: 🟠 Exaggerated.**

The "secret hoard" framing is dramatic license. Liang openly discussed building a
10,000-chip cluster for large-model research, and a business partner publicly described him
as a tech geek focused on that goal. The purchases weren't a public event, but they weren't
a guarded secret either — he talked about the ambition in interviews.

## Claim 3 — "Four years later, that secret erased $600 billion in a single day."

**Verdict: ✅ Accurate (on the number), 🟠 misleading (on causation).**

On **January 27, 2025**, Nvidia's stock fell about **17%**, wiping out close to **$600
billion** in market value — the largest single-day market-cap loss for any company in
history at the time. That figure is real. But attributing it to Liang's 2021 chip purchases
is a storytelling leap: the sell-off was triggered by DeepSeek's **R1** release and the
market's fear that competitive models could be trained far more cheaply than assumed —
i.e., a demand-for-chips thesis shock, not the GPU stockpile itself.

## Claim 4 — "Meet Liang Wenfeng — not a Silicon Valley founder, a quant trader from Hangzhou."

**Verdict: ✅ Accurate.**

Liang is a Chinese entrepreneur who built his career in quantitative trading and founded
High-Flyer. High-Flyer and DeepSeek are associated with **Hangzhou**, China. He is not a
Silicon Valley figure.

## Claim 5 — "Partners called him a nerdy guy with a bad haircut collecting GPUs for fun."

**Verdict: 🟡 Directionally true, embellished.**

Associates have described Liang as a low-key, technically obsessed "geek." The specific
"bad haircut / for fun" phrasing is colorful paraphrase, not a documented quote, and "for
fun" undersells the fact that the GPUs were bought for serious model-training research.

## Claim 6 — "In 2023, he launched DeepSeek."

**Verdict: ✅ Accurate.**

DeepSeek was founded in **July 2023**, spun out of High-Flyer, with Liang as CEO of both.

## Claim 7 — "No VC, fresh graduates, no KPIs."

**Verdict: 🟡 Mostly accurate, with a caveat.**

DeepSeek was **not** funded by outside venture capital — it was bankrolled by its parent
hedge fund, High-Flyer. It is well documented for hiring young researchers (often recent
graduates and PhD students) and for a flat, curiosity-driven culture rather than a rigid
KPI/metrics regime. The caveat: "no VC" is true only because a profitable hedge fund was
footing the bill — this was a very well-resourced startup, not a shoestring operation.

## Claim 8 — "He couldn't match OpenAI's billions."

**Verdict: 🟡 Mostly accurate.**

DeepSeek operated at a smaller scale than OpenAI's reported spending. But see Claim 10 —
the popular "$5.6M vs. billions" contrast overstates how frugal DeepSeek really was once
total R&D and hardware are counted.

## Claim 9 — "He fed his model millions of answers from the American models and trained his own to copy them. The student learns from the teacher."

**Verdict: 🟠 Alleged, not proven.**

This describes **distillation** — training a model on another model's outputs. In early
2025 **OpenAI said it had evidence** that groups linked to DeepSeek used ChatGPT outputs to
train competing models, which would violate OpenAI's terms of service; in February 2026
OpenAI escalated the allegation to the U.S. Congress. Cited evidence includes unusually high
output-style similarity and suspicious API access patterns via third-party routers. However:

- These remain **accusations**; DeepSeek has not admitted to it and it has not been proven
  in court.
- DeepSeek's published papers describe substantial original engineering (e.g.,
  reinforcement-learning-driven reasoning in R1, mixture-of-experts efficiency work) that is
  not reducible to "copying answers."

So stating it as settled fact ("he fed his model… and trained it to copy") overstates what
is actually established.

## Claim 10 — "January 2025, DeepSeek R1, $5.6 million, free forever."

**Verdict: 🟠 Misleading (the price), ✅ Accurate (free/open).**

- **Date/model:** DeepSeek **R1** was released in **January 2025**. ✅
- **"$5.6 million":** This figure actually comes from the **DeepSeek-V3** paper and refers
  to the GPU cost of a **single pre-training run only**. It explicitly **excludes** R&D,
  staff, prior experiments, and the cost of the underlying hardware. Analysts (e.g.,
  SemiAnalysis) estimated total server/infrastructure outlays in the **~$1.3–1.6 billion**
  range. Using $5.6M as the all-in cost of "DeepSeek" — and attaching it to R1 — is a
  well-known misreading. 🟠
- **"Free forever":** DeepSeek released open-weight models under a permissive (MIT) license,
  free to download and use. Calling it "free" is fair; "forever" is a promise no one can
  guarantee, but the released weights can't be un-published. ✅

## Claim 11 — "Nvidia lost $600 billion in a single day."

**Verdict: ✅ Accurate.** See Claim 3 — this is the January 27, 2025 record loss.

## Claim 12 — "Then OpenAI and Anthropic called him a thief."

**Verdict: 🟠 Half-right, overstated.**

- **OpenAI:** publicly alleged **IP misuse / ToS-violating distillation**. It framed this as
  improper appropriation, though "thief" is the video's word, not an official one.
- **Anthropic:** **did not call Liang a thief.** Anthropic CEO **Dario Amodei's** January
  2025 essay, *On DeepSeek and Export Controls*, focused on chip export policy. He argued
  the "$6M vs. billions" narrative was misleading and that DeepSeek's models were roughly
  comparable to U.S. models 7–10 months older — not an accusation of theft. Lumping Anthropic
  in with OpenAI here is inaccurate.

## Claim 13 — "Every AI on Earth is trained on someone else's work."

**Verdict: 🟡 True in a broad sense, but conflates two things.**

Modern models are trained on vast human-created data (text, code, images), and that itself is
the subject of ongoing copyright disputes. But "trained on human data from the open web" is
categorically different from "trained on **another AI company's model outputs** in violation
of its terms." The line blurs these to imply "everyone does the same thing," which
understates the specific distillation allegation in Claim 9.

## Claim 14 — "Liang just did it cheaper, gave it away for free, and beat the people who taught him how."

**Verdict: 🟠 Rhetorical overreach.**

- **Cheaper:** Yes relative to frontier labs, but not as cheap as "$5.6M" implies (Claim 10).
- **Gave it away free:** Fair — open weights. ✅
- **"Beat the people who taught him":** R1 was **competitive with** OpenAI's o1 on several
  benchmarks and was a genuine shock to the field, but "beat" is a stretch. At release, several
  U.S. frontier models still led on many evaluations, and benchmark parity is not the same as
  decisively winning. The "student beats the teacher" framing is a satisfying narrative, not a
  measured conclusion.

---

## Bottom line

The transcript gets the **skeleton right**: Liang Wenfeng, a Hangzhou quant-fund founder,
stockpiled ~10,000 Nvidia A100s around 2021–2022, founded DeepSeek in 2023 without outside
VC, and its January 2025 R1 release helped trigger a record ~$600B single-day drop in
Nvidia's value. Those load-bearing facts check out.

Where it slips is in the **spin and the numbers**:

- The **$5.6M** is a single pre-training run for **V3**, not the all-in cost of R1 or of
  "DeepSeek" — real totals are estimated in the **~$1.3–1.6B** range.
- The **distillation / "copied the answers"** claim is a **serious accusation, not a proven
  fact**.
- **Anthropic did not call Liang a thief**; that conflation is wrong.
- **"Beat the people who taught him"** overstates what was, more precisely, reaching rough
  parity at dramatically lower headline cost.

It's an accurate-enough story wrapped in a too-tidy "underdog outsmarts the giants" bow.

---

## Sources

- [DeepSeek — Wikipedia](https://en.wikipedia.org/wiki/DeepSeek)
- [Liang Wenfeng — Wikipedia](https://en.wikipedia.org/wiki/Liang_Wenfeng)
- [DeepSeek Origins: Founder & CEO Liang Wenfeng's Vision (RecodeChina AI)](https://www.recodechinaai.com/p/the-deep-roots-of-deepseek-how-it)
- [The trillion-dollar mystery surrounding DeepSeek's Nvidia GPUs — Sherwood News](https://sherwood.news/tech/the-trillion-dollar-mystery-surrounding-deepseeks-nvidia-gpus/)
- [Biggest Market Loss in History: Nvidia Sheds Nearly $600 Billion — Forbes](https://www.forbes.com/sites/dereksaul/2025/01/27/biggest-market-loss-in-history-nvidia-stock-sheds-nearly-600-billion-as-deepseek-shakes-ai-darling/)
- [Nvidia loses nearly $600 billion in market value — NBC News](https://www.nbcnews.com/business/business-news/nvidia-loses-market-value-chinese-ai-startup-deepseek-debut-rcna189431)
- [DeepSeek Debates: True Training Cost — SemiAnalysis](https://newsletter.semianalysis.com/p/deepseek-debates)
- [Research: DeepSeek's training cost is not $6M, it's ~$1.3B — Yahoo/Techstrong](https://techstrong.ai/agentic-ai/early-critic-of-deepseek-says-model-cost-was-1-6-billion-not-5-6-million/)
- [OpenAI accuses DeepSeek of distilling US AI models — reporting](https://www.scmp.com/tech/big-tech/article/3296827/deepseeks-ai-distillation-theft-openai-seeks-answers-over-chinas-breakthrough)
- [OpenAI Alleges DeepSeek Stole IP (memo to Congress) — FDD](https://www.fdd.org/analysis/2026/02/13/openai-alleges-chinas-deepseek-stole-its-intellectual-property-to-train-its-own-models/)
- [Dario Amodei — On DeepSeek and Export Controls](https://darioamodei.com/post/on-deepseek-and-export-controls)
- [Anthropic's CEO says DeepSeek shows US export rules are working — TechCrunch](https://techcrunch.com/2025/01/29/anthropics-ceo-says-deepseek-shows-that-u-s-export-rules-are-working-as-intended/)

*Compiled July 2026. Claims verified against public reporting available at that time;
allegations described as such remain unproven unless otherwise noted.*
