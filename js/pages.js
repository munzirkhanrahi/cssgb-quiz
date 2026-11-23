/* Home, Traps lab, Formula sheet, Binder map */
(function () {
  "use strict";
  const { $, $$ } = G;
  const CC = {};
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24].forEach((n) => { CC["ch" + n] = "--c" + n; });
  const PHASE_OF = (ch) => { const n = +ch.slice(2); return n <= 3 ? "org" : n <= 9 ? "define" : n <= 15 ? "measure" : n <= 18 ? "analyze" : n <= 21 ? "improve" : "control"; };
  const secTitle = (ch, sec) => G.chapters[ch].sections.find((s) => s.id === sec).title;
  const link = (href, label, primary) => `<a class="btn${primary ? " primary" : ""}" href="${href}" style="display:inline-flex;align-items:center;text-decoration:none">${label}</a>`;

  /* ---------- Home ---------- */
  const PHASES = [
    { id: "org", name: "Organization", label: "Six Sigma and the organization", q: 11, chs: "1–3", start: "ch1", rows: [
      ["ch1", "I.A", [["I.A.1", "Value of six sigma", "Understand", "value"], ["I.A.2", "Goals, SMART, inputs", "Understand", "goals"], ["I.A.3", "Drivers & metrics", "Understand", "drivers"]]],
      ["ch2", "I.B", [["I.B.1", "Lean concepts", "Apply", "concepts"], ["I.B.2", "Value stream mapping", "Understand", "vsm"]]],
      ["ch3", "I.C", [["I.C.1", "DMADV & IDOV", "Understand", "roadmaps"], ["I.C.2", "Basic FMEA", "Analyze", "rpn"], ["I.C.3", "Design vs process FMEA", "Apply", "types"]]]
    ]},
    { id: "define", name: "Define", q: 20, chs: "4–9", start: "ch4", rows: [
      ["ch4", "II.A", [["II.A.1", "Project selection", "Understand", "select"], ["II.A.2", "Process elements", "Analyze", "elements"], ["II.A.3", "Benchmarking", "Understand", "bench"], ["II.A.4", "SIPOC", "Analyze", "sipoc"], ["II.A.5", "Owners & stakeholders", "Apply", "owners"]]],
      ["ch5", "II.B", [["II.B.1", "Customer identification", "Apply", "ident"], ["II.B.2", "Customer data", "Apply", "data"], ["II.B.3", "QFD, CTx, Kano", "Apply", "qfd"]]],
      ["ch6", "II.C", [["II.C.1", "Agile vs top-down", "Apply", "method"], ["II.C.2", "Charter", "Apply", "charter"], ["II.C.3", "Scope", "Apply", "scope"], ["II.C.4", "Metrics", "Apply", "metrics"], ["II.C.5", "Planning tools", "Apply", "tools"], ["II.C.6", "Documentation", "Apply", "docs"], ["II.C.7", "Risk", "Understand", "risk"], ["II.C.8", "Closure", "Apply", "closure"]]],
      ["ch7", "II.D", [["II.D", "Eight M&P tools", "Apply", "eight"]]],
      ["ch8", "II.E", [["II.E.1", "Process performance", "Analyze", "dpmo"], ["II.E.2", "Communication", "Apply", "comm"]]],
      ["ch9", "II.F", [["II.F.1", "Stages & dynamics", "Understand", "stages"], ["II.F.2", "Roles & RACI", "Apply", "roles"], ["II.F.3", "Team tools", "Apply", "tools"], ["II.F.4", "Team communication", "Apply", "tcomm"]]]
    ]},
    { id: "measure", name: "Measure", q: 20, chs: "10–15", start: "ch10", rows: [
      ["ch10", "III.A", [["III.A", "Process maps, procedures, flowcharts", "Create", "maps"]]],
      ["ch11", "III.B", [["III.B.1", "Probability rules, counting", "Understand", "rules"], ["III.B.2", "Central limit theorem", "Understand", "clt"]]],
      ["ch12", "III.C", [["III.C", "Six distributions", "Understand", "pick"]]],
      ["ch13", "III.D", [["III.D.1", "Data types & scales", "Analyze", "types"], ["III.D.2", "Sampling & data plans", "Apply", "collect"], ["III.D.3", "Descriptive statistics", "Evaluate", "desc"], ["III.D.4", "Graphical methods", "Create", "graphs"]]],
      ["ch14", "III.E", [["III.E", "GR&R, bias, linearity, agreement", "Evaluate", "grr"]]],
      ["ch15", "III.F", [["III.F.1", "Natural vs spec limits", "Evaluate", "limits"], ["III.F.2", "Capability studies", "Evaluate", "study"], ["III.F.3", "Cp, Cpk, Pp, Ppk, Cpm", "Evaluate", "indices"], ["III.F.4", "Short vs long term, shift", "Evaluate", "shift"]]]
    ]},
    { id: "analyze", name: "Analyze", q: 18, chs: "16–18", start: "ch16", rows: [
      ["ch16", "IV.A", [["IV.A.1", "Multi-vari studies", "Create", "multivari"], ["IV.A.2", "Correlation & regression", "Evaluate", "corr"]]],
      ["ch17", "IV.B", [["IV.B.1", "Errors, power, sample size", "Apply", "basics"], ["IV.B.2", "Means, variances, proportions", "Analyze", "pick"]]],
      ["ch18", "IV.C", [["IV.C.1", "Gap analysis", "Analyze", "gap"], ["IV.C.2", "Root cause analysis", "Analyze", "why"]]]
    ]},
    { id: "improve", name: "Improve", q: 16, chs: "19–21", start: "ch19", rows: [
      ["ch19", "V.A", [["V.A.1", "DOE basic terms", "Understand", "terms"], ["V.A.2", "Main-effect & interaction plots", "Apply", "effects"]]],
      ["ch20", "V.B", [["V.B", "PoC, try-storming, pilot", "Apply", "three"]]],
      ["ch21", "V.C", [["V.C.1", "Waste elimination", "Apply", "tools"], ["V.C.2", "Cycle-time reduction", "Analyze", "flow"], ["V.C.3", "Kaizen & kaizen blitz", "Apply", "kaizen"]]]
    ]},
    { id: "control", name: "Control", q: 15, chs: "22–24", start: "ch22", rows: [
      ["ch22", "VI.A", [["VI.A.1", "SPC basics", "Analyze", "causes"], ["VI.A.2", "Rational subgrouping", "Understand", "subgroup"], ["VI.A.3", "Control charts", "Apply", "select"]]],
      ["ch23", "VI.B", [["VI.B.1", "Control plan", "Apply", "cplan"], ["VI.B.2", "Document control", "Understand", "docs"], ["VI.B.3", "Training plans", "Apply", "training"], ["VI.B.4", "Audits", "Remember", "audits"], ["VI.B.5", "PDCA", "Apply", "pdca"]]],
      ["ch24", "VI.C", [["VI.C.1", "TPM", "Understand", "tpm"], ["VI.C.2", "Visual factory", "Understand", "visual"]]]
    ]}
  ];
  const MUST = {
    org: [
      ["ch3", "rpn", "RPN = S × O × D. Detection runs backwards (easy to detect = low); equal RPNs go to the higher severity."],
      ["ch2", "toc", "Theory of constraints: identify, exploit, subordinate, elevate, repeat — “measure” is the distractor."],
      ["ch1", "goals", "Expected profit = Σ profit × probability. Hoshin links goals to strategy; SMART shapes one goal."],
      ["ch1", "pioneers", "Attribution: Juran trilogy, Deming's Fourteen Points, Crosby's zero defects, Shewhart's PDCA, Taguchi's loss function."],
      ["ch2", "waste", "Name the waste from its cause: workstation layout → motion; function-based plant → transportation; running ahead → overproduction."],
      ["ch2", "vsm", "Value stream analysis finds inventory first; a value stream runs from the supplier's supplier to the customer's customer."],
      ["ch3", "verval", "Verification = specified requirements met; validation = requirements for the intended use met."],
      ["ch3", "roadmaps", "DMADV designs what doesn't exist; IDOV's Optimize holds robust design; DMAIC improves what exists."],
      ["ch3", "types", "Design FMEA: how the product can fail. Process FMEA: how making it can fail."],
      ["ch2", "tools", "SMED = under 10 minutes; heijunka levels the mix; hoshin kanri deploys policy; gemba = the real place."]
    ],
    define: [
      ["ch8", "dpmo", "DPMO needs opportunities per unit. Forgetting them is the most common wrong answer."],
      ["ch8", "rty", "RTY multiplies step yields; throughput yield is e^−DPU. Averages and minimums are distractors."],
      ["ch8", "sigma", "3.4 ppm assumes a 1.5σ mean shift. Practise reading the Z table."],
      ["ch8", "cap", "Cp is spread only; Cpk adds centring and is never larger than Cp."],
      ["ch8", "coq", "Prevention, appraisal, internal and external failure — re-inspection after rework is internal failure."],
      ["ch6", "tools", "The critical path is the longest path; zero slack; crash it to finish sooner."],
      ["ch8", "bsc", "CPI = EV/AC, SPI = EV/PV. Above 1 is good."],
      ["ch4", "sipoc", "SIPOC starts with the process, not suppliers, and stays high level."],
      ["ch5", "qfd", "Roof = hows vs hows. Column weight = Σ importance × 9/3/1."],
      ["ch5", "kano", "Delighters decay into must-be features over time."],
      ["ch9", "negative", "Diagnose the dynamic from its symptom, then pick Table 9.1's countermeasure."],
      ["ch9", "stages", "Forming–directing, storming–coaching, norming–supporting, performing–delegating."],
      ["ch9", "roles", "One A per RACI row. Process owner sustains gains; champion removes barriers."],
      ["ch7", "eight", "Know each tool's job and its look-alike: affinity vs digraph, matrix vs prioritization, tree vs PDPC."]
    ],
    measure: [
      ["ch15", "indices", "Cp/Cpk use within-subgroup σ (R̄/d₂); Pp/Ppk the overall s. Cpk ≤ Cp, equal only when centred."],
      ["ch15", "limits", "Z = distance to the limit ÷ σ, then the normal table for % out. Natural limits are x̄ ± 3σ — the voice of the process."],
      ["ch14", "grr", "%GRR under 10% OK, 10–30% conditional, over 30% not; ndc ≥ 5. AV subtracts EV² ÷ (n·r)."],
      ["ch14", "interpret", "%Contribution (variances) is not %study variation (SDs) — find the base before applying a cut-off."],
      ["ch15", "shift", "Short-term Z − 1.5 = long-term Z: 6σ → 3.4 ppm; a centred 3σ process → 1,350 ppm per side."],
      ["ch11", "rules", "Mutually exclusive → add; independent → multiply. Exclusive events are dependent."],
      ["ch12", "pick", "Defectives → binomial; defects → Poisson (mean = variance); σ unknown → t; variances → χ² or F."],
      ["ch11", "clt", "Standard error = σ/√n; averages go normal; quadruple n to halve the SE."],
      ["ch13", "graphs", "Run chart: too few runs → clustering or trend; too many → mixture or oscillation. Box-plot outliers lie beyond 1.5 × IQR."],
      ["ch13", "types", "Nominal, ordinal, interval, ratio: a 1–5 rating is ordinal; °C is interval."],
      ["ch13", "collect", "Stratify a mixed lot; sequential sampling for destructive tests; random needs a homogeneous lot."],
      ["ch11", "counting", "Order matters → permutation; committees and samples → combination."],
      ["ch10", "pareto", "A true Pareto: descending bars, “Other” last, cumulative line. Weight by cost or severity when the question does."],
      ["ch10", "docs", "Procedure = what, why, where, when; work instruction adds who and how."]
    ],
    analyze: [
      ["ch17", "pick", "Pick the test from what's compared — means (Z, t, paired t, ANOVA), variances (χ², F), counts (χ²) — then read its df."],
      ["ch17", "basics", "Type I = α = reject a true H₀ (producer's risk); Type II = β; power = 1 − β. Never “accept” H₀."],
      ["ch17", "two", "Same parts measured twice → paired t. Welch df rounds down. Test variances (F) before pooling."],
      ["ch17", "power", "n = (Zσ ÷ E)², round up. Power rises with n, δ and α and falls with σ. Statistical ≠ practical significance."],
      ["ch16", "corr", "Test r with df = n − 2. Correlation isn't causation; r measures linear association only."],
      ["ch16", "regress", "Don't predict from a non-significant slope or outside the data; a prediction interval is wider than the CI."],
      ["ch17", "anova", "F = MS between ÷ MS within, df (k − 1, N − k). Significant = at least one mean differs."],
      ["ch17", "chisq", "χ² goodness of fit df = k − 1; contingency df = (r − 1)(c − 1); always right-tailed."],
      ["ch16", "multivari", "Positional (within), cyclical (part-to-part), temporal (over time) — attack the biggest family first."],
      ["ch18", "why", "Stop asking why at an actionable, system-level cause, and verify it by switching it on and off."],
      ["ch18", "fta", "FTA is top-down: AND multiplies, OR = 1 − Π(1 − p). FMEA is bottom-up."],
      ["ch18", "gap", "Gap analysis baselines predefined metrics before the change."]
    ],
    improve: [
      ["ch21", "takt", "Takt = available time ÷ demand. Takt is the customer's pace; cycle time is the process's."],
      ["ch19", "effects", "Effect = average at + minus average at −. Check the interaction plot before dropping a factor."],
      ["ch21", "tools", "Little's law: lead time = WIP ÷ throughput. Pull and kanban shrink WIP, so lead time falls."],
      ["ch21", "smed", "SMED: move internal work to external first, then shrink what stays internal. Setup ends at the first good piece."],
      ["ch19", "terms", "Replication resets every run; repetition does not."],
      ["ch19", "fractional", "In a half fraction, a main effect is aliased with an interaction (C = AB)."],
      ["ch21", "kaizen", "Kaizen = small, ongoing steps; kaizen blitz = a 3–5-day to one-week team event; kaikaku = breakthrough change."],
      ["ch20", "three", "Proof of concept → try-storming → pilot: feasible? → filter → ready to deploy?"]
    ],
    control: [
      ["ch22", "select", "Defectives → p or np; defects → c or u; varying sample size → p or u."],
      ["ch22", "limits", "Know which constant goes where: A₂/D₃/D₄, A₃/B₃/B₄. I–MR uses the n = 2 constants."],
      ["ch22", "causes", "Control limits are the voice of the process, spec limits the voice of the customer. In control ≠ capable."],
      ["ch22", "basics", "Type I = false alarm = tampering (α, producer's risk). Type II = missed signal (β)."],
      ["ch22", "rules", "Use the rule set the question names: 7 in a row (AIAG, handbook) or 9 (Minitab)."],
      ["ch22", "subgroup", "Alike within, different between. Mixed streams make points hug the centre line."],
      ["ch24", "oee", "OEE = availability × performance × quality — multiply, never average."],
      ["ch23", "audits", "First party = self; second = customer audits supplier; third = registrar or regulator."],
      ["ch23", "pdca", "SDCA holds the gain; PDCA/PDSA finds the next one."]
    ]
  };
  const LEVELS = [["Remember", "recall a term"], ["Understand", "recognise and interpret"], ["Apply", "use it in a scenario"], ["Analyze", "break down scenarios and calculate"], ["Evaluate", "judge results against criteria"], ["Create", "build a chart, plan or study"]];
  G.page("home", {
    title: "Phase map",
    render: () => `
      <h1>CSSGB Prep</h1>
      <p class="lede">Study the whole CSSGB Body of Knowledge — all 24 handbook chapters, every topic paired with a picture or a working tool, the trap ASQ sets and the page to tab in your binder — then drill the practice bank. Both keep one progress record.</p>
      <div class="row" style="margin-top:1rem">${PHASES.map((p) => link("#/" + p.start, `Start ${p.name} (Ch ${G.chapters[p.start].num})`, p.id === "org" && !continueLink())).join("")}${link("#/traps", "Open the traps lab")}${link("#/binder", "See what to tab")}</div>
      ${continueLink()}
      <div data-drill="home"></div>
      <h2 style="margin-top:2rem">Where the depth is</h2>
      <p class="soft">Each tile is a BoK subtopic, shaded by the highest cognitive level ASQ will test. ASQ publishes phase totals, not a split by subtopic — so shading tells you <i>how</i> you'll be asked, not how often.</p>
      <div class="legend">${LEVELS.map(([l, d]) => `<span><i class="dot lvdot lv-${l}"></i>${l} — ${d}</span>`).join("")}</div>
      ${PHASES.map((p, pi) => `
        <h3 class="phase-h">${p.label || p.name + " phase"} · ${p.q} questions · Chapters ${p.chs}</h3>
        <div class="map anim">${p.rows.map(([ch, bok, items], r) => `
          <div class="map-row">
            <a class="map-lab" href="#/${ch}" style="--tc: var(${CC[ch]})"><b>Ch ${G.chapters[ch].num} ${G.chapters[ch].title}</b><span>BoK ${bok}</span><span class="map-drill" data-drill="stat:${G.chapters[ch].num}"></span></a>
            <div class="map-tiles">${items.map(([ref, name, lv, sec], i) => `<a class="mt lv-${lv}" href="#/${ch}/${sec}" style="animation-delay:${(pi * 12 + r * 4 + i) * 30}ms"><span class="r">${ref}</span><span>${name}</span><span class="lvl">${lv}</span></a>`).join("")}</div>
          </div>`).join("")}</div>`).join("")}
      <h2>Start with these</h2>
      <p class="soft">Ranked within each phase by how often they decide a question: calculations first, then the close-difference pairs ASQ builds distractors from.</p>
      ${PHASES.map((p) => `
        <h3 class="phase-h">${p.name}</h3>
        <ol class="mustlist">${MUST[p.id].map(([ch, sec, t]) => `<li style="--tc: var(${CC[ch]})"><a class="tagc" href="#/${ch}/${sec}">Ch ${G.chapters[ch].num}</a><p><a href="#/${ch}/${sec}">${secTitle(ch, sec)}</a> — ${t}</p></li>`).join("")}</ol>`).join("")}
      <h2>How each topic is laid out</h2>
      <div class="grid3">
        ${G.trap("<p>The distractor ASQ is likely to use, and how to beat it.</p>")}
        ${G.tab("<p>What to tab or write in your handbook before exam day.</p>")}
        ${G.flag("<p>Where the handbook text or its scan is wrong, with the correct version.</p>")}
      </div>
      <p>Each chapter ends with a <b>blind check</b> — answer everything, then see the key and why each wrong option is wrong — followed by that chapter's <b>drill questions</b> from the <a href="#/drill">practice bank</a>: 24 per Part I chapter, 22 per Define chapter, 27 per Measure chapter, 33 per Analyze and Improve chapter, and 30 per Control chapter.</p>
      <p class="foot">Study notes in plain language from the ASQ CSSGB Handbook (Chapters 1–24) and the 2022 CSSGB Body of Knowledge. Topics you mark, blind-check scores and every drill answer are saved in this browser; <a href="#/drill/sync">turn on sync</a> to keep them in your GitHub account and use them on any device.</p>`
  });

  /* ---------- Traps lab ---------- */
  const TRAPS = [
    ["ch1", "Deming's Fourteen Points vs Crosby's fourteen steps", ["Deming — Fourteen Points", "Management principles: constancy of purpose, cease dependence on inspection, drive out fear, eliminate slogans and quotas."], ["Crosby — fourteen steps", "An improvement program: management commitment, quality teams, cost of quality, zero defects day, do it all over again."], "“Zero defects” anywhere in the stem → Crosby.", "pioneers"],
    ["ch1", "Juran's trilogy vs Feigenbaum's three steps", ["Juran trilogy", "Quality planning, quality control, quality improvement."], ["Feigenbaum's three steps", "Quality leadership, modern quality technology, organizational commitment."], "“Planning, control, improvement” is Juran.", "pioneers"],
    ["ch1", "PDCA vs PDSA", ["PDCA", "Shewhart's cycle, as Deming credited it."], ["PDSA", "Deming's update — Check became Study."], "“Originator of PDCA” → Shewhart.", "pioneers"],
    ["ch1", "Hoshin planning vs SMART goals", ["Hoshin planning", "Links company goals and work plans to long-term strategy through up to four five-year vision statements."], ["SMART goals", "How to word a single goal: specific, measurable, attainable, relevant, time-bound."], "Strategy deployment → Hoshin; goal wording → SMART.", "goals"],
    ["ch1", "Leading vs lagging measures", ["Leading", "Measured upstream; helps achieve the objective (training completed, PM on schedule)."], ["Lagging", "Measured at the end of an event (profit, warranty claims)."], "A balanced scorecard needs both.", "drivers"],
    ["ch1", "Traditional vs modern cost-of-quality curves", ["Traditional (Fig. 1.5)", "Conformance cost soars near perfection; the cheapest point stops short of 100% good."], ["Modern (Fig. 1.6)", "Total cost keeps falling all the way to 100% good."], "Six Sigma assumes the modern picture.", "coq"],
    ["ch2", "Value-added vs non-value-added inspection", ["Value-added", "A test the customer pays for — fire-testing furnaces for the CSA listing."], ["Non-value-added", "Inspection because the process is incapable — fix the process."], "Is the customer willing to pay for it?", "concepts"],
    ["ch2", "Prevention vs detection mistake-proofing", ["Prevention type", "The error cannot be made (one-way plug, orientation fixture)."], ["Detection type", "Alerts immediately after the error (lights-on alarm, automatic gauge)."], "If the mistake already happened, it is detection.", "tools"],
    ["ch2", "Heijunka vs hoshin kanri", ["Heijunka", "Level the production schedule by mixing variants in small batches."], ["Hoshin kanri", "Policy deployment: align strategy, tactics and floor-level work."], "Schedule → heijunka; strategy → hoshin.", "tools"],
    ["ch2", "Drum vs rope vs buffer", ["Drum", "The constraint, the slowest process; it sets the pace."], ["Rope and buffer", "The rope ties material release to the drum; the buffer is the slack in front of the drum, sized by how dependable the processes are."], "The drum is not the first operation.", "toc"],
    ["ch2", "Excess motion vs transportation", ["Motion", "People reaching, walking, searching — poor workstation layout."], ["Transportation", "Material moved by conveyors and forklifts — function-based plant layout."], "Who or what is moving?", "waste"],
    ["ch3", "DMAIC vs DMADV", ["DMAIC", "Improve an existing process."], ["DMADV", "Design a new product or process, or redesign an optimized one that still can't meet needs."], "Nothing exists yet → DMADV.", "roadmaps"],
    ["ch3", "Verification vs validation", ["Verification", "Objective evidence that specified requirements are fulfilled (ISO 9000:2015, 3.8.12)."], ["Validation", "Objective evidence that requirements for a specific intended use are fulfilled (3.8.13)."], "Spec → verification; intended use → validation.", "verval"],
    ["ch3", "MTTF vs MTBF", ["MTTF", "Mean time to failure — non-repairable items; 1/λ."], ["MTBF", "Mean time between failures — repairable items; 1/λ."], "Replace it → MTTF; repair it → MTBF.", "dfx"],
    ["ch3", "Design for performance vs robustness", ["Performance", "Aggressive benchmarks or breakthroughs on a consistent basis."], ["Robustness", "Life-cycle tests; suppliers document MTTF or MTBF."], "“Breakthrough” → performance.", "dfx"],
    ["ch3", "Severity and occurrence vs detection scales", ["Severity, occurrence", "Worse or more frequent = higher number."], ["Detection", "Harder to detect = higher number; obvious every time = 1–2."], "Detection runs backwards.", "rpn"],
    ["ch3", "RPN vs criticality", ["RPN", "S × O × D, range 1–1,000."], ["Criticality", "S × O, used in some industries."], "A product of two ratings is criticality.", "rpn"],
    ["ch3", "Design FMEA vs process FMEA", ["Design FMEA", "How the product design can fail; block diagram; before tooling is cut."], ["Process FMEA", "How manufacturing or assembly can fail; flowchart and walk-through."], "The thing, or the making of the thing?", "types"],
    ["ch4", "Process owner vs stakeholder", ["Process owner", "Formally responsible for defining, running, maintaining and improving one process; named in procedures or job descriptions."], ["Stakeholder", "Anyone with a vested interest: operators, customers, suppliers, designers, maintenance, investors, communities."], "Every owner is a stakeholder. When the stem mentions documented responsibility or approval authority, choose owner.", "owners"],
    ["ch4", "SIPOC vs detailed process map", ["SIPOC", "High level, about four to seven steps, Define phase; built process → outputs → inputs → customers → suppliers."], ["Process map / flowchart", "Every step, decision and handoff — Measure phase detail."], "“First step of a SIPOC” is the process, not the suppliers.", "sipoc"],
    ["ch4", "Competitive vs functional benchmarking", ["Competitive", "Direct competitors in your industry; forces an external view."], ["Functional", "Similar function in any industry; many willing partners; best-practice hunting."], "Benchmarking only in your industry puts you second at best.", "bench"],
    ["ch5", "Internal customer: which boundary?", ["Ch 5 VOC", "Internal = works inside the project boundary. Downstream department outside the project = external customer."], ["Ch 7 SIPOC", "Internal = inside the enterprise. The same downstream department = internal customer."], "Read which definition the stem uses.", "ident"],
    ["ch5", "QFD roof vs relationship matrix", ["Roof", "Hows vs hows — positive or negative co-relationships, i.e. trade-offs."], ["Relationship matrix", "Whats vs hows — strong, moderate, weak (9, 3, 1)."], "Column weight comes from the relationship matrix × importance, never the roof.", "qfd"],
    ["ch5", "Must-be vs delighter", ["Must-be", "Absent → strong dissatisfaction. Present → only neutral."], ["Delighter", "Absent → no effect. Present → delight. Decays to must-be over time."], "An absent delighter causes no dissatisfaction.", "kano"],
    ["ch5", "CTQ vs CTC vs CTS", ["CTQ / CTC / CTS", "The same spec (15–20 lb) can be any of them — the stated reason decides: conformance, cost or safety."], ["CTP", "Key process input variables, the x's in y = f(x) — not a customer-stated product spec."], "Classify by the reason in the stem, not the characteristic.", "ctx"],
    ["ch6", "Critical path: longest, not shortest", ["Critical path", "The longest start-to-finish path; zero slack; its length is the project duration."], ["Non-critical path", "Has slack; shortening it does not finish the project sooner."], "Crash critical activities to shorten the project.", "tools"],
    ["ch6", "Gantt vs network diagram", ["Gantt chart", "Bars on a calendar: durations, timing, milestones, predecessor–successor links."], ["CPM / PERT / activity network", "Dependency network that computes earliest and latest times, slack and the critical path."], "“Which tool identifies the critical path?” — network, not Gantt.", "tools"],
    ["ch6", "Assignment number vs RPN", ["Assignment number", "Severity × probability, each 1–3 (handbook risk matrix)."], ["RPN", "Severity × occurrence × detection, each 1–10; range 1–1,000 (FMEA)."], "A stem mentioning detection wants RPN.", "risk"],
    ["ch6", "Risk mitigation vs verification", ["Mitigation", "Actions that reduce likelihood or impact (PIN plus lockout)."], ["Verification", "Testing that the mitigation actually prevents the risk (try an invalid PIN)."], "Verification is a test, not another control.", "risk"],
    ["ch6", "Primary vs consequential metric", ["Primary", "The measure the goal is written in."], ["Consequential", "A measure of negative side effects the improvement might cause."], "Speed goals usually pair with an accuracy, cost or safety consequential metric.", "metrics"],
    ["ch6", "Charter vs statement of work", ["Charter", "States the project's purpose; an informal contract; problem, purpose, benefits, scope, results."], ["Statement of work", "Describes the work; derived from the WBS; with the specification it is the basis of the contract."], "SOW comes from the WBS.", "charter"],
    ["ch7", "Affinity diagram vs interrelationship digraph", ["Affinity", "Groups many ideas into 5–10 natural categories."], ["Interrelationship digraph", "Maps cause and effect among 6–12 issues; finds drivers and outcomes."], "Grouping → affinity. Cause and effect → digraph.", "eight"],
    ["ch7", "Driver vs outcome", ["Driver", "Most outgoing arrows; often a key cause."], ["Outcome", "Most incoming arrows; often a source of the success metric."], "Distractors swap them.", "digraph"],
    ["ch7", "Matrix diagram vs prioritization matrix", ["Matrix diagram", "Relationships between two groups (strong/moderate/weak)."], ["Prioritization matrix", "Weighted criteria × option ranks → a winner."], "Choosing an option → prioritization matrix.", "prio"],
    ["ch7", "Tree diagram vs PDPC", ["Tree diagram", "Breaks a goal into more specific activities."], ["PDPC", "Adds anticipated problems and countermeasures for each step; updated as the project moves."], "Contingency planning → PDPC.", "pdpc"],
    ["ch7", "PDPC vs FMEA", ["PDPC", "Obstacles to carrying out a plan."], ["FMEA", "How a product or process can fail; scored with RPN."], "Plan → PDPC. Product or process failure → FMEA.", "pdpc"],
    ["ch7", "PDCA vs PDSA vs SDCA", ["PDCA / PDSA", "Improve. Deming replaced Check with Study because checking is reactive."], ["SDCA", "Standardise and stabilise the gain; pairs with PDSA."], "Holding a gain → SDCA.", "cycles"],
    ["ch8", "Cp vs Cpk", ["Cp", "(USL − LSL) ÷ 6σ. Spread only — potential."], ["Cpk", "Nearer-limit distance ÷ 3σ. Spread and centring — actual. Never above Cp."], "Off-centre process: Cp overstates capability.", "cap"],
    ["ch8", "CPI vs SPI", ["CPI", "EV ÷ AC — cost efficiency."], ["SPI", "EV ÷ PV — schedule efficiency."], "Both have EV on top; above 1 is good.", "bsc"],
    ["ch8", "DPU vs DPO vs DPMO", ["DPU", "Defects ÷ units. Ignores opportunities."], ["DPO / DPMO", "Defects ÷ (units × opportunities); × 10⁶ for DPMO."], "A DPMO option equal to DPU × 10⁶ forgot the opportunities.", "dpmo"],
    ["ch8", "RTY vs average yield", ["RTY", "Product of first-time yields across steps."], ["Average or final yield", "Hides rework — the hidden factory."], "RTY is at or below the worst single step.", "rty"],
    ["ch8", "Prevention vs appraisal", ["Prevention", "Stops defects: training, APQP, supplier qualification."], ["Appraisal", "Finds defects: inspection, testing, calibration, receiving inspection."], "Qualifying a supplier = prevention; inspecting its parts = appraisal.", "coq"],
    ["ch8", "Internal vs external failure", ["Internal", "Caught before shipment: scrap, rework, re-inspection."], ["External", "Caught by the customer: returns, warranty, complaints, recalls."], "Re-inspection after rework is internal failure, not appraisal.", "coq"],
    ["ch8", "Top-down vs horizontal communication", ["Top-down", "Policy, instructions, feedback; risks filtering — fix with one written message or meeting for all."], ["Horizontal", "Peers, flatter organizations, fast — but wrong where approval is required."], "Horizontal can shortcut authorization.", "comm"],
    ["ch9", "Forming vs norming", ["Forming", "Polite agreement, eager to please, little work."], ["Norming", "Agreement after conflict, trust, some work."], "Agreement + little output = forming.", "stages"],
    ["ch9", "Overbearing vs dominant", ["Overbearing", "Authority or expertise silences others."], ["Dominant", "Monopolises airtime and interrupts."], "Status → overbearing. Talking → dominant.", "negative"],
    ["ch9", "Groupthink vs unquestioned acceptance", ["Groupthink", "No public disagreement to protect harmony; doubts aired privately."], ["Unquestioned acceptance", "Opinions accepted as facts without data."], "Fix groupthink with outsiders and rotating roles; fix the other with data requests.", "negative"],
    ["ch9", "Champion vs process owner", ["Champion", "Upper manager; removes barriers; sets selection criteria; approves completed projects."], ["Process owner", "Owns one process; selects team members; sustains the gains."], "“Who sustains the improvement?” — process owner.", "roles"],
    ["ch9", "Black Belt vs Green Belt", ["Black Belt", "Always full-time; leads four to six projects a year; ROI and NPV calculations."], ["Green Belt", "Leads smaller projects; supports Black Belt projects; reviews approach with BB and MBB."], "MBB and BB are always full-time.", "roles"],
    ["ch9", "Brainstorming vs nominal group technique", ["Brainstorming", "Open, fast, maximum creative ideas; creative then evaluation phase."], ["NGT", "Silent generation, round-robin, optional anonymity — for dominant members or sensitive topics."], "Dominant voices or sensitive topic → NGT.", "tools"],
    ["ch9", "Ranked vs weighted multivoting", ["Ranked", "Each member orders the options; shows order, not intensity."], ["Weighted", "Each member splits 100 points; intensity counts."], "They can disagree — use both and re-vote if close.", "tools"],
    ["ch9", "Consensus vs majority", ["Consensus", "Every member can support it."], ["Majority / unanimity", "Majority = more than half. Unanimity = everyone's first choice."], "Consensus is neither.", "decide"],
    ["ch10", "Flowchart vs process map", ["Flowchart", "Steps, decisions, inputs and outputs in standard symbols."], ["Process map", "A flowchart plus step data: cost, setup and cycle time, inventory, defects."], "Step-level times and costs → process map.", "maps"],
    ["ch10", "Procedure vs work instruction", ["Procedure", "What, why, where and when."], ["Work instruction", "Who and how — step by step."], "“How” never belongs to the procedure.", "docs"],
    ["ch10", "Pareto chart vs sorted bar chart", ["Pareto chart", "Descending bars, “Other” last, cumulative-percentage line on a second axis."], ["Bar chart", "Categories in any order, no cumulative line."], "Sorting the bars alone doesn't make a Pareto.", "pareto"],
    ["ch10", "Nominal group technique vs multivoting", ["NGT", "Silent individual ranking, tallied — for sensitive topics or mixed ranks."], ["Multivoting", "Votes or points (100 in the handbook) spread over the options."], "Sensitive topic or a dominant boss → NGT.", "fishbone"],
    ["ch11", "Mutually exclusive vs independent", ["Mutually exclusive", "Can't happen together: P(A and B) = 0. Add."], ["Independent", "One doesn't change the other: P(B | A) = P(B). Multiply."], "Exclusive events with P &gt; 0 are dependent.", "rules"],
    ["ch11", "Permutation vs combination", ["Permutation", "Order matters: nPr = n! ÷ (n − r)!."], ["Combination", "Order doesn't: nCr = n! ÷ [r!(n − r)!]."], "Seats and rankings → P; teams and samples → C.", "counting"],
    ["ch11", "Standard deviation vs standard error", ["Standard deviation σ", "Spread of individual values."], ["Standard error σ/√n", "Spread of sample means."], "p. 190 mislabels σ/√n as a sample standard deviation.", "clt"],
    ["ch12", "Binomial vs Poisson", ["Binomial", "Defective units — each good or bad; mean np."], ["Poisson", "Defects — several per unit; mean = variance = λ."], "Read the noun: defectives vs defects.", "pois"],
    ["ch12", "Z vs t", ["Z", "σ known, or n large."], ["t", "σ estimated by s; heavier tails; df = n − 1."], "t is never wrong; beyond about 30 they converge.", "sampling"],
    ["ch12", "Chi-square vs F", ["Chi-square", "One variance; counts (goodness of fit, contingency); one df."], ["F", "Ratio of two variances; ANOVA; two df."], "Two variances → F.", "sampling"],
    ["ch13", "Ordinal vs interval data", ["Ordinal", "Ordered, unknown gaps — ratings, criticality."], ["Interval", "Equal gaps, no true zero — °C."], "A 1–5 rating is ordinal.", "types"],
    ["ch13", "Random vs stratified sampling", ["Random", "Homogeneous lot; every item has an equal chance."], ["Stratified", "Mixed lot — sample within each machine or stream."], "Mixed sources → stratify.", "collect"],
    ["ch13", "s vs σ", ["s", "Sample: divide by n − 1."], ["σ", "Population: divide by N."], "Know your calculator's σₙ₋₁ and σₙ keys.", "desc"],
    ["ch13", "Clustering vs mixtures", ["Clustering", "Too few runs about the median."], ["Mixtures", "Too many runs about the median."], "Few runs → clumps; many → alternating streams.", "graphs"],
    ["ch13", "Characteristic life vs mean life (Weibull)", ["Characteristic life η", "63.2% failed, for any β."], ["Mean life (MTBF)", "η × Γ(1 + 1/β); equals η only when β = 1."], "The handbook conflates them (p. 232).", "probplot"],
    ["ch14", "Repeatability vs reproducibility", ["Repeatability (EV)", "Same appraiser and gage, repeated — the gage's precision."], ["Reproducibility (AV)", "Differences between appraisers' averages — technique, training."], "EV → fix the gage; AV → train the people.", "terms"],
    ["ch14", "Bias vs linearity", ["Bias", "Average offset from the master value."], ["Linearity", "Change in bias across the range — the slope."], "A flat bias line away from zero is bias, not nonlinearity.", "bias"],
    ["ch14", "%Study variation vs %contribution", ["%Study variation", "GRR ÷ TV (standard deviations); 10% / 30% rule."], ["%Contribution", "GRR² ÷ TV² (variances); 1% / 9% rule; adds to 100%."], "Same gage: 26.7% vs 7.1%.", "interpret"],
    ["ch14", "Within appraiser vs versus standard", ["Within appraiser", "Agrees with self — repeatability."], ["Versus standard", "Agrees with the expert — accuracy."], "Consistent isn't the same as correct.", "attr"],
    ["ch14", "Product control vs process control GR&amp;R", ["Product control", "Sorting and inspection; judge against the tolerance."], ["Process control", "SPC and capability; parts span the range; judge against process variation."], "For process control, never pick parts at random.", "errors"],
    ["ch15", "Cp vs Cpk", ["Cp", "Spread only — potential capability."], ["Cpk", "Distance to the nearer limit — actual; Cpk ≤ Cp."], "Re-centring changes Cpk, never Cp.", "indices"],
    ["ch15", "Cpk vs Ppk", ["Cpk", "Within-subgroup σ (R̄/d₂) from a stable process."], ["Ppk", "Overall sample s from long-term data."], "It's which σ, not which formula.", "indices"],
    ["ch15", "Cpk vs Cpm", ["Cpk", "Distance to the nearer specification limit."], ["Cpm", "Distance from the target."], "Target off the midpoint → Cpm.", "indices"],
    ["ch15", "Natural process limits vs specification limits", ["Natural limits", "x̄ ± 3σ from the process — voice of the process."], ["Specification limits", "From the customer or engineering — voice of the customer."], "Stable is not the same as capable.", "limits"],
    ["ch15", "Short-term vs long-term sigma", ["Short-term Z", "Within-subgroup variation; the quoted sigma level."], ["Long-term Z", "Includes drift: Z<sub>ST</sub> − 1.5."], "6σ short term = 4.5σ long term = 3.4 ppm.", "shift"],
    ["ch16", "Correlation vs causation", ["Correlation", "Linear association — strength and direction."], ["Causation", "x changes y — needs a designed experiment."], "A lurking variable can drive both.", "corr"],
    ["ch16", "Confidence interval vs prediction interval", ["CI for the mean", "Where the average y at x₀ lies."], ["Prediction interval", "Where one new y at x₀ will fall — always wider."], "Predicting one month's count → PI.", "regress"],
    ["ch16", "Positional vs cyclical variation", ["Positional", "Within a piece or batch — taper, out-of-round, cavity."], ["Cyclical", "Piece-to-piece or lot-to-lot."], "Within vs between pieces.", "multivari"],
    ["ch17", "Type I vs Type II error", ["Type I (α)", "Reject a true H₀ — false alarm; producer's risk."], ["Type II (β)", "Miss a false H₀ — consumer's risk; power = 1 − β."], "Power 0.8 → β = 0.2, not α.", "basics"],
    ["ch17", "Fail to reject vs accept H₀", ["Fail to reject", "The evidence isn't strong enough."], ["Accept H₀", "Not a valid conclusion."], "“No difference” overstates — the handbook does it repeatedly.", "basics"],
    ["ch17", "Paired vs two-sample t", ["Paired t", "Same units measured twice — analyze the differences."], ["Two-sample t", "Independent groups."], "Same CNC data: p 0.037 paired vs 0.255 pooled.", "two"],
    ["ch17", "Pooled vs Welch t", ["Pooled", "Equal variances; df n₁ + n₂ − 2."], ["Welch", "Unequal variances; Satterthwaite df, rounded down."], "Test the variances with F first.", "two"],
    ["ch17", "Statistical vs practical significance", ["Statistical", "The difference is probably real."], ["Practical", "The difference matters to the customer or business."], "A huge n makes trivial differences significant.", "power"],
    ["ch17", "Goodness of fit vs contingency table", ["Goodness of fit", "One variable vs expected proportions; df k − 1."], ["Contingency", "Two variables; df (r − 1)(c − 1)."], "Contingency expected counts come from the totals.", "chisq"],
    ["ch18", "FTA vs FMEA", ["FTA", "Top-down from one undesired event; AND/OR gates."], ["FMEA", "Bottom-up from failure modes to effects; RPN."], "Starts from the system failure → FTA.", "fta"],
    ["ch18", "AND gate vs OR gate", ["AND", "All inputs needed — multiply."], ["OR", "Any input — 1 − Π(1 − p)."], "Summing is only an approximation for OR.", "fta"],
    ["ch18", "Proactive vs reactive gap analysis", ["Proactive", "Before the launch or change."], ["Reactive", "After the launch or change."], "Timing decides.", "gap"],
    ["ch18", "Root cause vs system-level root cause", ["Root cause", "Specific and actionable — no filter on the pump."], ["System-level cause", "The process breakdown that allowed it — no error-proofed PM."], "Prefer the system-level fix.", "why"],
    ["ch19", "Replication vs repetition", ["Replication", "Repeat the whole set of treatment combinations in random order, resetting each condition — captures setup-to-setup variation."], ["Repetition", "Rerun trials under the same setup without resetting — cheaper, but misses setup variation."], "The deciding word is reset.", "terms"],
    ["ch19", "Randomization vs blocking", ["Randomization", "Run order by chance, spreading unknown noise across all treatments."], ["Blocking", "Group runs by a known nuisance variable (shift, batch) so its effect can be separated."], "Known nuisance → block. Unknown noise → randomize.", "principles"],
    ["ch19", "Main effect vs interaction", ["Main effect", "Average at + minus average at − for one factor; a steep line on the main-effects plot."], ["Interaction", "One factor's effect depends on another's level; non-parallel or crossing lines."], "A flat main effect can hide a large interaction (Table 19.6: A ≈ 0.3, AB = 4.0).", "effects"],
    ["ch19", "Full vs fractional factorial", ["Full factorial", "L<sup>F</sup> runs; every main effect and interaction estimated cleanly."], ["Fractional factorial", "2<sup>F−p</sup> runs; cheap screening; effects are confounded (aliased)."], "A fraction is justified only when interactions are believed negligible.", "fractional"],
    ["ch19", "α-risk vs β-risk in DOE", ["α-risk", "Concluding an effect is significant when it is not."], ["β-risk", "Missing a real effect. Power = 1 − β; more replicates lower β."], "Replication improves power; it does not raise α.", "effects"],
    ["ch19", "Latin square vs full factorial", ["Latin square", "Rows = columns = treatments; blocks two nuisance variables; assumes no interactions."], ["Full factorial", "Every combination of levels; estimates interactions."], "A Latin square cannot estimate interactions.", "principles"],
    ["ch20", "Proof of concept vs pilot test", ["Proof of concept", "Early: feasibility, cost fit, success criteria — justifies resources and commitment."], ["Pilot test", "Late, reduced scope: verifies the solution, validates the plan, finds side effects."], "Stakeholder buy-in for resources → proof of concept.", "three"],
    ["ch20", "Try-storming vs brainstorming", ["Try-storming", "Brainstorming plus action: quick prototypes, simulations or role-plays that vet the feasible ideas."], ["Brainstorming", "Idea generation only."], "Try-storming filters ideas; it does not generate a second round.", "three"],
    ["ch21", "Takt time vs cycle time", ["Takt time", "Available time ÷ customer demand — the pace demand requires."], ["Cycle time", "How long a process step actually takes."], "Takt is set by demand, never by the station.", "takt"],
    ["ch21", "Internal vs external setup", ["Internal setup", "Can be done only while the machine is stopped."], ["External setup", "Can be done while the machine is still running the previous job."], "External is about timing, not about who does the work.", "smed"],
    ["ch21", "Kaizen vs kaizen blitz", ["Kaizen", "Small, frequent, low-cost improvement sustained over years."], ["Kaizen blitz", "An intensive team event of three to five days to a week: collect data, analyze, implement at once."], "Kaikaku = breakthrough change; the handbook (pp. 38, 381) says North Americans call it a kaizen event or blitz.", "kaizen"],
    ["ch21", "Bottleneck vs capacity-constrained resource", ["Bottleneck", "Already sets the pace of the whole process."], ["Capacity-constrained resource", "At risk of becoming a bottleneck; can hurt throughput even below full capacity."], "Limit inventory to what the bottleneck can process.", "smed"],
    ["ch21", "Push vs pull", ["Push", "Produce to a schedule or forecast regardless of downstream need; WIP builds."], ["Pull", "Customer demand triggers production; replenish only what is consumed (kanban)."], "Lower WIP means shorter lead time (Little's law).", "tools"],
    ["ch21", "Poka-yoke vs inspection", ["Poka-yoke", "Makes the error impossible, or obvious the moment it happens."], ["Inspection", "Finds defects after they are made (appraisal)."], "Mistake-proofing prevents; it is not after-the-fact checking.", "tools"],
    ["ch22", "Control limits vs specification limits", ["Control limits", "Calculated from process data at ±3σ of the plotted statistic — the voice of the process."], ["Specification limits", "Set by the customer or engineering — the voice of the customer."], "Never draw spec limits on an X̄ chart. In control does not mean capable.", "causes"],
    ["ch22", "Common vs special cause", ["Common cause", "Inherent, many small sources; reduce it by changing the system (management)."], ["Special cause", "Assignable, unusual; the operator can usually remove it once alerted."], "Treating common cause as special is tampering.", "causes"],
    ["ch22", "Type I vs Type II error on a chart", ["Type I (α)", "False alarm: acting on common-cause noise — producer's risk; leads to tampering."], ["Type II (β)", "Missed signal: failing to act on a real special cause — consumer's risk."], "p. 425 mislabels the false alarm as Type II; p. 389–390 has it right.", "basics"],
    ["ch22", "Defective vs defect", ["Defective (p, np)", "A unit that fails; binomial; counted once per unit."], ["Defect (c, u)", "A flaw; one unit can have several; Poisson."], "Varying sample size → p or u. Constant → np or c.", "select"],
    ["ch22", "p chart vs np chart", ["p chart", "Proportion defective; sample size may vary."], ["np chart", "Number defective; sample size must be constant."], "A stem that gives varying n rules out np.", "select"],
    ["ch22", "c chart vs u chart", ["c chart", "Count of defects; constant area of opportunity."], ["u chart", "Defects per unit; sample size may vary."], "“Per unit” plus varying n → u.", "select"],
    ["ch22", "X̄–R vs X̄–s", ["X̄–R", "Small subgroups (typically 4–5); the range is quick and nearly as efficient."], ["X̄–s", "Used when σ is available; common practice prefers it for larger subgroups (about 10+)."], "I–MR is for n = 1 and uses the n = 2 constants.", "select"],
    ["ch22", "Within vs between subgroup variation", ["Within", "Should contain only common cause; it sets R̄ and therefore the limits."], ["Between", "Where shifts should show up on the X̄ chart."], "Mixing streams inside a subgroup widens the limits and hides shifts.", "subgroup"],
    ["ch23", "Document vs record", ["Document", "A released instruction or template, controlled by approval and date."], ["Record", "Completed evidence that the work was done."], "Gaps in records show the improvement was not fully deployed.", "docs"],
    ["ch23", "Second-party vs third-party audit", ["Second-party", "A customer audits its supplier."], ["Third-party", "An independent registrar, accreditation or regulatory body audits."], "First-party = the organization audits itself.", "audits"],
    ["ch23", "Control plan vs dynamic control plan", ["Control plan", "Living document telling operators how to control the process; holds the gains."], ["Dynamic control plan", "Merges SOPs, control plan, FMEA, gage control plan and quality planning sheets; operators update it."], "Both are living documents — the DCP is the combined one.", "dcp"],
    ["ch23", "Continuous vs continual improvement", ["Continuous", "Implies an unbroken upward line."], ["Continual", "Deming's term: improvement comes in steps, with plateaus and setbacks."], "The handbook (and ISO 9001) uses continual.", "ci"],
    ["ch24", "MTBF vs MTTR", ["MTBF", "Mean time between failures — reliability."], ["MTTR", "Mean time to repair — maintenance responsiveness."], "Distractors swap them.", "tpm"],
    ["ch24", "Preventive vs predictive maintenance", ["Preventive", "Scheduled work by time or usage, to prevent unforeseen breakdowns."], ["Predictive", "Act on early signs of failure (condition, anomalies) before the breakdown."], "The 2022 BoK names predictive maintenance explicitly.", "tpm"],
    ["ch24", "Availability loss vs performance loss", ["Availability loss", "Breakdowns and changeovers — the machine is down."], ["Performance loss", "Idling, minor stops and reduced speed — running, but slowly."], "Planned downtime is removed before either is counted.", "oee"],
    ["ch24", "Jidoka vs poka-yoke", ["Jidoka", "The machine detects an abnormality, stops and alerts — automation with a human touch."], ["Poka-yoke", "A design that makes the error impossible or obvious; one technique used within jidoka."], "Jidoka does not remove people; it pairs detection with judgment.", "jidoka"],
    ["ch24", "Andon vs kanban", ["Andon", "A visual or audible signal of process status that calls for help."], ["Kanban", "A signal to replenish or produce when parts are consumed."], "Status and help → andon. Material → kanban.", "visual"],
    /* Improve */,
    /* Control */
  ];
  let filt = "all";
  const PH_BTNS = [["all", "All"], ["org", "Organization"], ["define", "Define"], ["measure", "Measure"], ["analyze", "Analyze"], ["improve", "Improve"], ["control", "Control"]];
  const CH_OF = { org: ["ch1", "ch2", "ch3"], define: ["ch4", "ch5", "ch6", "ch7", "ch8", "ch9"], measure: ["ch10", "ch11", "ch12", "ch13", "ch14", "ch15"], analyze: ["ch16", "ch17", "ch18"], improve: ["ch19", "ch20", "ch21"], control: ["ch22", "ch23", "ch24"] };
  // "Continue where you left off" — the last topic you were reading
  function continueLink() {
    const last = G.state.last;
    if (!last || !last.h) return "";
    const [, id, sec] = last.h.split("/");
    const ch = G.chapters[id], pg = G.pages[id];
    if (!ch && !pg) return "";
    let label = ch ? `Ch ${ch.num} ${ch.title}` : pg.title;
    if (ch && sec) {
      const s = ch.sections.find((x) => x.id === sec);
      if (s) label += `: ${s.title}`;
      else if (sec === "check") label += ": blind check";
      else if (sec === "drill") label += ": drill questions";
    }
    return `<div class="row continue" style="margin-top:1.1rem;align-items:center">${link(last.h, "Continue where you left off", true)}<span class="soft small">${label}</span></div>`;
  }

  G.page("traps", {
    title: "Traps lab",
    render: () => `
      <h1>Traps lab</h1>
      <p class="lede">ASQ's favourite distractor is the correct definition of the wrong concept. These are the pairs it builds them from, across all six areas of the Body of Knowledge.</p>
      <div class="row noprint" style="margin:1rem 0 .4rem"><span class="seg" role="group" aria-label="Filter by phase" data-ph></span><span class="soft small" data-n></span></div>
      <div class="row noprint" style="margin:0 0 1rem"><span class="seg" role="group" aria-label="Filter by chapter" data-chs></span></div>
      <div data-cards></div>`,
    after: (root) => {
      const phaseOfFilt = () => (filt === "all" || CH_OF[filt] ? filt : PHASE_OF(filt));
      const draw = () => {
        const ph = phaseOfFilt();
        const list = TRAPS.filter((t) => filt === "all" || t[0] === filt || PHASE_OF(t[0]) === filt);
        $("[data-ph]", root).innerHTML = PH_BTNS.map(([k, l]) => `<button type="button" data-f="${k}" aria-pressed="${k === ph}">${l}</button>`).join("");
        const chs = ph === "all" ? [] : CH_OF[ph];
        $("[data-chs]", root).innerHTML = chs.map((c) => `<button type="button" data-f="${c}" aria-pressed="${c === filt}">Ch ${G.chapters[c].num}</button>`).join("");
        $("[data-chs]", root).parentElement.style.display = chs.length ? "" : "none";
        $("[data-n]", root).textContent = `${list.length} pairs`;
        $("[data-cards]", root).innerHTML = list.map(([ch, title, a, b, trap, sec]) => `
          <article class="trapcard" style="border-left:5px solid var(${CC[ch]})">
            <header><h3>${title}</h3><a class="small" href="#/${ch}/${sec}">Ch ${G.chapters[ch].num}: ${secTitle(ch, sec)}</a></header>
            <div class="vs"><div><b>${a[0]}</b><p>${a[1]}</p></div><div><b>${b[0]}</b><p>${b[1]}</p></div></div>
            <footer><b>Trap:</b> ${trap}</footer>
          </article>`).join("");
        $$("[data-f]", root).forEach((btn) => btn.addEventListener("click", () => {
          const k = btn.dataset.f;
          filt = filt === k && !CH_OF[k] && k !== "all" ? PHASE_OF(k) : k;
          draw();
          const again = $(`[data-f="${k}"]`, root); if (again) again.focus();
        }));
      };
      draw();
    }
  });

  /* ---------- Formula sheet ---------- */
  const F = {
    org: [
      ["Expected profit", "EP = Σ (profit × probability)", "Table 1.2: 2(.6) + 2(.1) + 7(.05) − 3(.25) = $1.0M", "ch1", "goals"],
      ["Risk priority number", "RPN = S × O × D", "8 × 3 × 6 = 144 · range 1–1,000", "ch3", "rpn"],
      ["Criticality", "S × O", "8 × 3 = 24", "ch3", "rpn"],
      ["Failure rate and mean life", "MTBF (repairable) = MTTF (non-repairable) = 1 ÷ λ", "4 failures in 50,000 h → λ = 0.00008 → 12,500 h", "ch3", "dfx"],
      ["VSM lead time", "Production lead time = Σ inventory ÷ daily demand", "8,900 ÷ 460 = 19.3 days vs 187 s value-added · ladder from Rother and Shook", "ch2", "vsm"]
    ],
    define: [
      ["Defects per unit", "DPU = D ÷ U", "165 ÷ 40,000 = 0.004125", "ch8", "dpmo"],
      ["Defects per opportunity", "DPO = D ÷ (U × O)", "165 ÷ (40,000 × 6) = 0.0006875", "ch8", "dpmo"],
      ["Defects per million opportunities", "DPMO = DPO × 10⁶", "0.0006875 × 10⁶ = 687.5", "ch8", "dpmo"],
      ["Throughput yield", "TPY = e<sup>−DPU</sup>", "DPU 0.25 → e<sup>−0.25</sup> = 0.779", "ch8", "rty"],
      ["Rolled throughput yield", "RTY = Y₁ × Y₂ × … × Yₙ", ".994 × .987 × .951 × .990 = 0.924", "ch8", "rty"],
      ["Sigma level (short-term)", "σ level = Z<sub>LT</sub> + 1.5", "DPMO 687.5 → Z 3.20 → 4.70σ", "ch8", "sigma"],
      ["Six sigma defect rate", "Z = 6 − 1.5 = 4.5 → 3.4 ppm", "Centred ±6σ would be ≈ 0.002 ppm", "ch8", "sigma"],
      ["Process capability", "Cp = (USL − LSL) ÷ 6σ", "0.024 ÷ (6 × 0.004) = 1.00", "ch8", "cap"],
      ["Capability with centring", "Cpk = min[(USL − μ), (μ − LSL)] ÷ 3σ", "Cpk ≤ Cp; equal when centred", "ch8", "cap"],
      ["Capability ratio", "Cr = 1 ÷ Cp = 6σ ÷ (USL − LSL)", "Lower is better; ≤ 1 acceptable", "ch8", "cap"],
      ["Cost performance index", "CPI = EV ÷ AC", "80 ÷ 100 = 0.80 → over budget", "ch8", "bsc"],
      ["Schedule performance index", "SPI = EV ÷ PV", "80 ÷ 90 = 0.89 → behind", "ch8", "bsc"],
      ["Variances", "CV = EV − AC · SV = EV − PV", "Negative = bad", "ch8", "bsc"],
      ["Cost of quality", "COQ = P + A + IF + EF", "Prevention ↑ → total ↓", "ch8", "coq"],
      ["Critical path", "Duration = longest path", "Slack = LS − ES = LF − EF", "ch6", "tools"],
      ["PERT expected time", "tₑ = (o + 4m + p) ÷ 6", "σ = (p − o) ÷ 6 · not printed in Ch 6–7", "ch6", "tools"],
      ["Risk assignment number", "Severity × Probability (1–3 each)", "3 × 2 = 6", "ch6", "risk"],
      ["Risk priority number", "RPN = S × O × D (1–10 each)", "Range 1–1,000; relative, not a goal", "ch6", "risk"],
      ["QFD column weight", "Σ (importance × 9 / 3 / 1)", "4 × 9 + 2 × 3 = 42", "ch5", "qfd"],
      ["Prioritization matrix", "Total = Σ (weight × rank)", "Highest total wins; weights sum to 1", "ch7", "prio"],
      ["Multivoting", "Ranked: Σ ranks · Weighted: Σ points (100 each)", "Use both when close", "ch9", "tools"]
    ],
    measure: [
      ["Addition rule", "P(A or B) = P(A) + P(B) − P(A and B)", "Two machines at 0.8: 0.8 + 0.8 − 0.64 = 0.96", "ch11", "rules"],
      ["Multiplication rule", "P(A and B) = P(A) × P(B | A)", "10/50 × 9/49 × 8/48 = 0.0061", "ch11", "rules"],
      ["Permutations", "nPr = n! ÷ (n − r)!", "5P5 = 120", "ch11", "counting"],
      ["Combinations", "nCr = n! ÷ [r!(n − r)!]", "10C3 = 120", "ch11", "counting"],
      ["Standard error", "σ<sub>x̄</sub> = σ ÷ √n", "0.012 ÷ √16 = 0.003", "ch11", "clt"],
      ["CI for a mean", "x̄ ± Z·σ/√n · x̄ ± t·s/√n (df n − 1)", "10 ± 1.96 × 0.003 = 9.9941 to 10.0059", "ch11", "clt"],
      ["Binomial", "P(x) = nCx pˣ(1 − p)ⁿ⁻ˣ · μ = np · σ = √[np(1 − p)]", "n 5, p 0.1: P(1) = 0.328", "ch12", "binom"],
      ["Poisson", "P(x) = e<sup>−λ</sup>λˣ ÷ x! · mean = variance = λ", "λ 5: P(x &lt; 2) = 0.040", "ch12", "pois"],
      ["Z-score", "Z = (x − μ) ÷ σ", "Pizza: 20 → −2, 35 → +1 → 0.8186", "ch12", "normal"],
      ["Sample standard deviation", "s = √[Σ(x − x̄)² ÷ (n − 1)]", "σ divides by N", "ch13", "desc"],
      ["Box-plot fences", "Q1 − 1.5·IQR and Q3 + 1.5·IQR", "IQR = Q3 − Q1", "ch13", "graphs"],
      ["Correlation coefficient", "r = S<sub>xy</sub> ÷ √(S<sub>xx</sub>S<sub>yy</sub>)", "93.75 ÷ √(1125 × 8.1875) = 0.977", "ch13", "graphs"],
      ["Weibull mean life", "MTBF = η × Γ(1 + 1/β)", "4.635 × 0.9335 = 4.33 h", "ch13", "probplot"],
      ["Repeatability", "EV = R̿ × K₁", "0.3417 × 0.5908 = 0.202", "ch14", "grr"],
      ["Reproducibility", "AV = √[(X̄<sub>DIFF</sub>K₂)² − EV² ÷ (n·r)]", "√[(0.4446 × 0.5231)² − 0.202² ÷ 30] = 0.230", "ch14", "grr"],
      ["GRR, PV, TV", "GRR = √(EV² + AV²) · PV = Rp × K₃ · TV = √(GRR² + PV²)", "0.306 · 1.105 · 1.146", "ch14", "grr"],
      ["%GRR and ndc", "%GRR = 100 × GRR ÷ TV · ndc = 1.41 × PV ÷ GRR", "26.7% · ndc 5", "ch14", "grr"],
      ["Precision-to-tolerance", "%P/T = 100 × 6·GRR ÷ tolerance", "5.15 in older practice", "ch14", "grr"],
      ["σ from the range", "σ̂ = R̄ ÷ d₂", "0.05 ÷ 2.059 = 0.024", "ch15", "limits"],
      ["Z to each limit", "Z<sub>U</sub> = (USL − x̄) ÷ σ · Z<sub>L</sub> = (x̄ − LSL) ÷ σ", "1.46 → 7.21% · 2.70 → 0.35%", "ch15", "limits"],
      ["Cp, Cpk, Cr", "(USL − LSL) ÷ 6σ · min(Z<sub>U</sub>, Z<sub>L</sub>) ÷ 3 · 1 ÷ Cp", "0.69 · 0.49 · 1.45", "ch15", "indices"],
      ["Pp, Ppk", "Same formulas with the overall sample s", "s 0.004: 1.667 and 1.33", "ch15", "indices"],
      ["Cpm", "(USL − LSL) ÷ 6√[s² + (x̄ − T)²]", "Figure 15.6: 0.41", "ch15", "indices"],
      ["Sigma shift", "Z<sub>LT</sub> = Z<sub>ST</sub> − 1.5", "6σ → 4.5σ → 3.4 ppm", "ch15", "shift"]
    ],
    analyze: [
      ["t-test for r", "t = r ÷ √[(1 − r²) ÷ (n − 2)], df n − 2", "r 0.972, n 6 → 8.27", "ch16", "corr"],
      ["Least squares line", "b = S<sub>xy</sub> ÷ S<sub>xx</sub> · a = ȳ − b·x̄", "Complaints: b 0.583, a 6.50", "ch16", "regress"],
      ["Slope test", "t = b ÷ (s/√S<sub>xx</sub>), df n − 2", "0.3 ÷ (0.5/√50) = 4.24", "ch16", "regress"],
      ["CI vs prediction interval", "ŷ ± t·s√[1/n + (x₀ − x̄)²/S<sub>xx</sub>] · PI adds “1 +”", "The PI is always wider", "ch16", "regress"],
      ["Sample size", "n = (Z·σ ÷ E)², round up", "(1.96 × 35 ÷ 10)² = 47.06 → 48", "ch17", "power"],
      ["Sample size for power", "n = [(Z<sub>1−α/2</sub> + Z<sub>power</sub>)σ ÷ δ]²", "σ 0.03, δ 0.04, power 0.90 → 6", "ch17", "power"],
      ["One-sample Z and t", "(x̄ − μ₀) ÷ (σ/√n) · (x̄ − μ₀) ÷ (s/√n), df n − 1", "Z 10.67 · t −1.12", "ch17", "means"],
      ["Pooled two-sample t", "s<sub>p</sub>² = [(n₁ − 1)s₁² + (n₂ − 1)s₂²] ÷ (n₁ + n₂ − 2)", "s<sub>p</sub> 0.0162 · t 1.23 · df 8", "ch17", "two"],
      ["Welch t", "(x̄₁ − x̄₂) ÷ √(s₁²/n₁ + s₂²/n₂)", "df 7.63 → round down to 7", "ch17", "two"],
      ["Paired t", "d̄ ÷ (s<sub>d</sub>/√n), df n − 1", "0.0126 ÷ 0.00409 = 3.08", "ch17", "two"],
      ["χ² for one variance", "(n − 1)s² ÷ σ₀² · CI: (n − 1)s² ÷ χ²<sub>upper</sub> to ÷ χ²<sub>lower</sub>", "34 × 46 ÷ 36 = 43.44", "ch17", "varprop"],
      ["F for two variances", "s₁² ÷ s₂², df (n₁ − 1, n₂ − 1)", "1,800² ÷ 600² = 9 &gt; 4.88", "ch17", "two"],
      ["One proportion", "Z = (p̂ − p₀) ÷ √[p₀(1 − p₀)/n] · CI p̂ ± Z√[p̂(1 − p̂)/n]", "15/500 vs 0.02: Z 1.60", "ch17", "varprop"],
      ["One-way ANOVA", "F = [SS<sub>B</sub> ÷ (k − 1)] ÷ [SS<sub>W</sub> ÷ (N − k)]", "(17.69 ÷ 2) ÷ (3.34 ÷ 9) = 23.8", "ch17", "anova"],
      ["Chi-square tests", "Σ(O − E)² ÷ E · df k − 1 or (r − 1)(c − 1)", "Defect mix: 5.33 &lt; 7.815", "ch17", "chisq"],
      ["Fault tree gates", "AND: Π p · OR: 1 − Π(1 − p)", "0.1 and 0.1: AND 0.01 · OR 0.19", "ch18", "fta"]
    ],
    improve: [
      ["Full factorial runs", "Runs = L<sup>F</sup> × replicates", "2⁴ × 2 replicates = 32", "ch19", "principles"],
      ["Fractional factorial runs", "Runs = 2<sup>F−p</sup>", "2<sup>7−4</sup> = 8 runs for 7 factors", "ch19", "fractional"],
      ["Main effect", "ȳ(+) − ȳ(−)", "Speed: 4.25 − 6.75 = −2.50", "ch19", "effects"],
      ["Interaction effect", "ȳ(AB = +) − ȳ(AB = −); AB sign = A sign × B sign", "Table 19.6: (65.7 − 57.7) ÷ 2 = 4.0", "ch19", "effects"],
      ["Power", "Power = 1 − β", "More replicates → better error estimate → lower β", "ch19", "effects"],
      ["Takt time", "Available time ÷ customer demand", "480 ÷ 160 = 3.0 min per unit", "ch21", "takt"],
      ["Minimum stations", "⌈Σ cycle times ÷ takt⌉", "13.1 ÷ 3.0 = 4.4 → 5 · standard rule, not in the handbook", "ch21", "takt"],
      ["Process capacity", "Available time ÷ (machine + manual + tool change ÷ pieces per change)", "450 ÷ (1.5 + 0.5 + 20/200) = 214", "ch21", "flow"],
      ["Little's law", "Lead time = WIP ÷ throughput", "400 ÷ 50 per day = 8 days", "ch21", "tools"],
      ["Setup time", "Last piece of product A → first good piece of product B", "Restarting is not the end point", "ch21", "smed"]
    ],
    control: [
      ["X̄ chart (with R)", "X̿ ± A₂R̄", "7.1257 ± 0.729 × .0037 → 7.1230 to 7.1284", "ch22", "limits"],
      ["R chart", "UCL = D₄R̄ · LCL = D₃R̄", "2.282 × .0037 = .0084; LCL 0 (n = 4)", "ch22", "limits"],
      ["X̄ chart (with s)", "X̿ ± A₃s̄", "7.1257 ± 1.628 × .002 → 7.1224 to 7.1290", "ch22", "limits"],
      ["s chart", "UCL = B₄s̄ · LCL = B₃s̄", "2.266 × .002 = .0045", "ch22", "limits"],
      ["Individuals chart", "X̄ ± 2.660 MR̄", "288.3 ± 2.660 × 2.889 → 280.62 to 295.98", "ch22", "limits"],
      ["Moving range chart", "UCL = 3.267 MR̄ (n = 2 constants)", "3.267 × 2.889 = 9.44", "ch22", "limits"],
      ["Median chart", "X̃̄ ± Ã₂R̄", "7.125 ± 1.187 × .0036 → 7.1207 to 7.1293", "ch22", "limits"],
      ["p chart", "p̄ ± 3√(p̄(1 − p̄) ÷ n̄)", "p̄ = 177 ÷ 1,496 = .1183 → .0315 to .2051", "ch22", "limits"],
      ["np chart", "np̄ ± 3√(np̄(1 − p̄))", "n = 200, p̄ = .05: 10 ± 9.25 → 0.75 to 19.25", "ch22", "limits"],
      ["c chart", "c̄ ± 3√c̄", "c̄ = 16.69 → 4.44 to 28.95", "ch22", "limits"],
      ["u chart", "ū ± 3√(ū ÷ n̄)", "ū = 66 ÷ 1,496 = .0441 → UCL .1006; no LCL", "ch22", "limits"],
      ["Negative LCL", "Use no lower control limit", "Common on R, s, p, np, c and u charts", "ch22", "limits"],
      ["OEE", "Availability × Performance × Quality", ".8333 × .80 × .98 = .653", "ch24", "oee"],
      ["Availability", "Operating time ÷ planned production time", "(1,500 − 250) ÷ 1,500 = .8333", "ch24", "oee"],
      ["Performance efficiency", "Ideal cycle time × units ÷ operating time", ".5 × 2,000 ÷ 1,250 = .80", "ch24", "oee"],
      ["Quality rate", "Good units ÷ total units", "1,960 ÷ 2,000 = .98", "ch24", "oee"]
    ]
  };
  const K_COLS = [["A2", "A₂"], ["D3", "D₃"], ["D4", "D₄"], ["A3", "A₃"], ["B3", "B₃"], ["B4", "B₄"], ["Am", "Ã₂"], ["d2", "d₂"]];
  G.page("formulas", {
    title: "Formula sheet",
    render: () => `
      <h1>Formula sheet</h1>
      <p class="lede">Every calculation in all 24 chapters, each with a worked example from the handbook or this guide. Print it and file it in your binder.</p>
      <div class="row noprint" style="margin-bottom:1rem"><button class="btn primary" type="button" data-print>Print this sheet</button></div>
      ${PHASES.map((p) => `
        <h2 class="phase-h">${p.name} · Chapters ${p.chs}</h2>
        <div class="fsheet">${F[p.id].map(([h, f, ex, ch, sec]) => `<div class="fcell" style="border-top:4px solid var(${CC[ch]})"><h4><a href="#/${ch}/${sec}" style="color:inherit;text-decoration:none">${h}</a></h4><div class="formula">${f}</div><p class="soft">${ex}</p></div>`).join("")}</div>`).join("")}
      <h2 class="phase-h">Control chart constants</h2>
      <p class="soft">Subgroup size n. For I–MR charts use the n = 2 row (2.660 = 3 ÷ d₂). Matches handbook Appendix E.</p>
      ${G.table(["n", ...K_COLS.map((c) => c[1])], Object.keys(G.SPC_K).map((n) => [`<b>${n}</b>`, ...K_COLS.map(([k]) => G.SPC_K[n][k].toFixed(3))]))}
      <p class="foot">Normal-table note: your calculator cannot compute normal probabilities. Convert Z to area with the handbook's standard normal table.</p>`,
    after: (root) => { const b = $("[data-print]", root); if (b) b.addEventListener("click", () => window.print()); }
  });

  /* ---------- Binder map ---------- */
  const TABS = [
    ["ch1", "2–4", "Why Six Sigma; why deployments fail", "Management commitment; train Green Belts first; engage accounting early"],
    ["ch1", "7–8", "Six Sigma definitions", "Philosophy y = f(x) / tools / DMAIC / 3.4 DPMO"],
    ["ch1", "9–15", "Quality pioneers", "One-line signature per pioneer"],
    ["ch1", "21–23", "DMAIC tool lists", "PDCA (D, M) · PDSA (A, I) · SDCA (C)"],
    ["ch1", "24–25", "Cost of quality curves", "Fix the p. 24 wording; traditional vs modern"],
    ["ch1", "25–29", "Hoshin, expected profit, SMART", "EP = Σ profit × probability"],
    ["ch1", "30–31", "Balanced scorecard, dashboard, KPI", "Four perspectives; leading vs lagging"],
    ["ch2", "33–35", "TPS house, value-added test", "Three conditions; the CSA exception"],
    ["ch2", "35–42", "Top lean tools", "SMED under 10 min; kanban needs 5S, standard work, TPM first"],
    ["ch2", "40–41", "Theory of constraints, drum-buffer-rope", "Identify, exploit, subordinate, elevate, repeat"],
    ["ch2", "42–45", "The wastes", "Motion = people; transportation = material"],
    ["ch2", "47–51", "Value stream mapping", "Three components; five steps; inventory first"],
    ["ch3", "52–57", "DFSS, IDOV, DMADV, design for X", "IDOV ↔ MAIC; “Validate” heading = verify"],
    ["ch3", "56–57", "MTTF / MTBF; verification vs validation", "1/λ; specified requirements vs intended use"],
    ["ch3", "66–68", "FMEA steps and S-O-D tables", "Detection runs backwards"],
    ["ch3", "69–71", "RPN, do's and don'ts, Fig. 3.7", "Ties → higher severity; correct Fig. 3.7"],
    ["ch3", "74–76", "Design vs process FMEA", "Block diagram vs flowchart"],
    ["ch4", "80–81", "Project selection", "DMAIC vs lean/kaizen routing rule"],
    ["ch4", "83–84", "Benchmarking types + Table 4.1", "Do/don't list for NOT questions"],
    ["ch4", "85", "Cross-functional challenges", "Ownership, information, measures, knowledge"],
    ["ch4", "87–88", "Owners and stakeholders", "Owner = formal; stakeholder list"],
    ["ch5", "89", "Internal vs external customer", "“Project boundary” — cross-ref p. 135"],
    ["ch5", "93–94", "House of quality (Figs 5.1–5.2)", "Label rooms; column weight formula"],
    ["ch5", "97–99", "CTx examples", "Same 15–20 lb spec, different reason"],
    ["ch5", "100", "Kano model (Fig 5.8)", "Arrow: delighter → must-be over time"],
    ["ch6", "102–103", "Theories, top-down, agile", "Pioneer list for attribution items"],
    ["ch6", "104", "Charter elements", "Five elements; no cause, no solution, baseline"],
    ["ch6", "105–106", "Primary vs consequential", "Definitions side by side"],
    ["ch6", "110", "Risk assessment matrix (Fig 6.2)", "Assignment # = S × P; RPN = S × O × D"],
    ["ch6", "113", "Project closure", "“Not a negotiation”"],
    ["ch7", "126–128", "Interrelationship digraph", "Driver = out; outcome = in"],
    ["ch7", "131", "Prioritization matrix (Fig 7.13)", "Erratum: cost column"],
    ["ch7", "129–132", "PDCA / PDSA / SDCA and 8D", "8D order; Check → Study"],
    ["ch7", "133–134", "PDPC and PERT/CPM (Fig 7.15)", "tₑ = (o + 4m + p) / 6 in margin"],
    ["ch7", "138", "SWOT", "Internal vs external"],
    ["ch8", "139–140", "Balanced scorecard, CPI, SPI", "Correct “five” to four; CPI = EV/AC, SPI = EV/PV"],
    ["ch8", "140–141", "DPU, DPMO, RTY, sigma, Cp/Cpk/Cr", "The single most important Define tab"],
    ["ch8", "142", "COPQ categories", "One example per category"],
    ["ch8", "143", "Communication flows", "Fix for filtering; horizontal caveat"],
    ["ch9", "147–148", "Stages and leadership styles", "Four stage–style pairs"],
    ["ch9", "149–152", "Table 9.1 negative dynamics", "Tab the whole table"],
    ["ch9", "153–159", "RACI (Table 9.2) and roles (Table 9.3)", "One A per task; full-time roles"],
    ["ch9", "164–166", "NGT and multivoting", "Ranked vs weighted"],
    ["ch10", "169", "Flowchart symbols (Fig. 10.1)", "Nine shapes; diamond = decision"],
    ["ch10", "172–173", "Procedures vs work instructions", "What/why/where/when vs who/how"],
    ["ch10", "176–180", "Pareto rules, weighted Pareto, measles chart", "“Other” last; score = count × weight"],
    ["ch10", "180–181", "Relationship matrix", "9 / 3 / 1"],
    ["ch11", "183", "Probability rules box", "Exclusive → add; independent → multiply"],
    ["ch11", "186–187", "Permutations and combinations", "Fix “seven” → ten on p. 187"],
    ["ch11", "188–190", "Central limit theorem", "Three statements; SE = σ/√n (fix the p. 190 label)"],
    ["ch12", "193", "Table 12.1 distribution formulas", "Mean and variance of each"],
    ["ch12", "194–198", "Binomial and Poisson examples", "n(1 − p) ≥ 10; defects vs defectives"],
    ["ch12", "199–205", "Normal areas; χ², t and F properties", "Lower-tail F = reciprocal with df swapped"],
    ["ch13", "207", "Table 13.1 measurement scales", "Statistics allowed on each scale"],
    ["ch13", "209–213", "Sampling types, data collection plan", "Stratify mixed lots; 5W1H; data checks"],
    ["ch13", "216", "Summary of descriptive measures", "s (n − 1) vs σ (N); your calculator keys"],
    ["ch13", "217–224", "Graph comparison, box plot, run chart", "Quartile-method note; four run tests"],
    ["ch13", "230–232", "Probability plot and Weibull", "β &lt; 1, ≈ 1, &gt; 1; fix the MTBF statement"],
    ["ch14", "233–234", "MSA terms", "EV = gage; AV = appraisers"],
    ["ch14", "239–241", "AIAG GR&amp;R report (Figs 14.5–14.6)", "K₁, K₂, K₃, D₄ written on the tab"],
    ["ch14", "242", "Acceptance criteria and ndc", "10 / 30%; 1 / 9%; ndc ≥ 5"],
    ["ch14", "244–246", "Common GR&amp;R errors", "Parts must span the range"],
    ["ch14", "246–251", "Linearity and bias; attribute agreement", "Fix the R-sq reading on p. 246"],
    ["ch15", "254–256", "Control vs spec grid; packing example", "Z → % out with Appendix F"],
    ["ch15", "258–259", "Capability study steps", "MSA → stability → normality → indices"],
    ["ch15", "261–265", "Cp, Cpk, Cr, Pp, Ppk, Cpm", "Which σ; d₂ for n = 2–5"],
    ["ch15", "265–267", "Short- vs long-term; 1.5σ shift", "Z<sub>LT</sub> = Z<sub>ST</sub> − 1.5"],
    ["ch16", "271–278", "Multi-vari families and the casting case", "Attack the biggest family first"],
    ["ch16", "281–285", "Correlation, p-value, t-test for r", "df n − 2 (fix step 4)"],
    ["ch16", "286–292", "Least squares, slope test, intervals", "CI = mean; PI = one unit"],
    ["ch17", "296", "Error matrix (Table 17.1)", "α producer's; β consumer's; power 1 − β"],
    ["ch17", "299–301", "Sample size and power", "Fix 470.59 → 47.06; fix the p. 300 power sentence"],
    ["ch17", "303–311", "Z, t, χ² and proportion tests; CIs", "Statistic and df beside each"],
    ["ch17", "312–317", "Pooled, Welch, paired t; F-test", "Welch df rounds down"],
    ["ch17", "317–321", "One-way ANOVA table", "SS, df, MS, F; F(0.05; 2, 9) = 4.26"],
    ["ch17", "324–327", "Chi-square goodness of fit and contingency", "Fix 4.9 → 5.33"],
    ["ch17", "App. G, I, L", "F, χ² and t tables", "Tab next to the test-selection table"],
    ["ch18", "329–330", "Gap analysis metrics", "Predefined; proactive vs reactive"],
    ["ch18", "331–333", "5 Whys and fault tree analysis", "Stop at the system level; AND ×, OR 1 − Π(1 − p)"],
    ["ch19", "336–338", "DOE terms", "Box replication vs repetition (“reset”)"],
    ["ch19", "339–342", "Design types, randomization, blocking", "Latin square: no interactions"],
    ["ch19", "346–348", "Main effects and interactions (Fig 19.1)", "Effect = avg(+) − avg(−); sign × sign"],
    ["ch19", "348–350", "Fractional factorial and confounding", "C = AB in a 2³⁻¹ half fraction"],
    ["ch19", "352–356", "2² and steak examples", "Correct 76.67 → 74.25"],
    ["ch20", "360–362", "PoC, try-storming, pilot", "Feasible? · filter · ready? (limited scope)"],
    ["ch21", "365–368", "Pull, kanban, poka-yoke, 5S", "Lead time = WIP ÷ throughput; 5S order"],
    ["ch21", "369–373", "Standard work and capacity", "Three standard-work charts; capacity formula"],
    ["ch21", "374–377", "Flow analysis, VSM, takt", "Start VSM at shipping; takt = time ÷ demand"],
    ["ch21", "377–380", "Countermeasures, SMED, TOC", "Internal → external; five focusing steps"],
    ["ch21", "380–385", "Kaizen, blitz, kaikaku, levels, events", "Kaizen vs blitz; kaikaku per pp. 38 and 381"],
    ["ch22", "389–390", "SPC definitions, Type I/II errors", "Type I = false alarm = tampering"],
    ["ch22", "391–396", "Common vs special cause; chart basics", "Control limits ≠ spec limits"],
    ["ch22", "398–402", "Chart selection, rational subgrouping", "Copy the selection table onto the tab"],
    ["ch22", "403–417", "X̄–R, X̄–s, I–MR, median, p, np, u, c examples", "Formula and constant beside each"],
    ["ch22", "418–425", "Run rules and patterns", "Minitab 9 / AIAG 7 in a row; fix p. 425"],
    ["ch23", "427–432", "Control plan elements and steps", "Eight elements in the margin"],
    ["ch23", "432–435", "Dynamic control plan, gage control, SOPs", "SDCA act / adjust"],
    ["ch23", "435–437", "Continual improvement, variability", "Profound knowledge: four parts"],
    ["ch23", "438–442", "Training plans", "Success = behaviour change, not certificates"],
    ["ch23", "442–445", "Audits", "First / second / third party"],
    ["ch23", "445–448", "PDCA, PDSA, SDCA", "PDCA ↔ DMAIC ↔ 8D mapping"],
    ["ch24", "449–453", "TPM evolution, losses, roles", "Breakdown → corrective → preventive → productive"],
    ["ch24", "454–456", "OEE example", ".8333 × .80 × .98 = .653"],
    ["ch24", "456–463", "Visual factory, stack lights, jidoka", "Green normal · yellow help · red stopped"],
    ["ch8", "Appendix", "Standard normal (Z) table", "Needed for every sigma-level item"],
    ["ch22", "App. D–E", "Control chart formulas and constants", "Tab next to Chapter 22"]
  ];
  const ERRATA = [
    ["ch1", "6", "Baldrige: five categories, up to two awards each", "Six categories since 2007 (nonprofit added), up to three awards each (NIST)."],
    ["ch1", "7", "Capability symbols garbled (“C, = 2.0 and C,, &lt; 1.5”)", "A Six Sigma process: Cp = 2.0; with the 1.5σ shift, Cpk = 1.5."],
    ["ch1", "12", "Feigenbaum's <i>Total Quality Control</i> published in 1951", "The 1951 edition was titled <i>Quality Control: Principles, Practice, and Administration</i> (ASQ). Feigenbaum = TQC still holds."],
    ["ch1", "14, 389", "Pre-control credited to Shainin (Ch 1) and to Rath &amp; Strong (Ch 22)", "Both hold: it came out of Rath &amp; Strong in the 1950s, where Shainin worked."],
    ["ch1", "24", "“Focusing on reducing prevention and appraisal costs” raises cost first, then failure costs fall", "Increase prevention spending: total cost may rise at first, then failure costs fall."],
    ["ch2", "38, 381", "Kaikaku = what North Americans call a kaizen event or blitz", "Consistent within the handbook. LEI defines kaikaku as radical value-stream change and a kaizen workshop as a ~5-day event. The BoK tests kaizen vs blitz."],
    ["ch3", "54", "IDOV's last phase headed “Validate”", "Verify — same tasks."],
    ["ch3", "58", "ISO 31000:2018 “Principles and guidelines”", "The 2018 title is <i>Risk management — Guidelines</i>; the longer title was 2009's."],
    ["ch3", "71", "Fig. 3.7: Risk 6 S = 8; Risk 4 (after) D = 5", "S = 3 and D = 3 — the only values that give the printed RPNs 42 and 75."],
    ["ch3", "71", "The new automotive handbook changes RPN to “a risk rating”", "The 2019 AIAG &amp; VDA handbook replaced RPN with Action Priority (high / medium / low)."],
    ["ch6", "112", "“ISO 22301:2018”", "ISO 22301:2019. The quoted text is its definition of business continuity."],
    ["ch7", "131", "Fig. 7.13 cost column", "Contradicts the text's ranking; with the text's ranks the totals are A 3.40, B 1.40, C 3.60, D 1.90. C wins either way."],
    ["ch8", "139", "Balanced scorecard “five primary areas”", "Four perspectives: financial, customer, internal processes, learning and growth."],
    ["ch8", "140", "“An average 165 defects/unit”", "165 is the total defects in the 40,000-unit batch: DPU = 0.004125, DPMO = 687.5."],
    ["ch8", "141", "DPO formula line garbled in the scan", "DPO = total defects ÷ total opportunities = DPU ÷ opportunities per unit."],
    ["ch8", "141", "Six sigma yield shown as 0.999966 and “1 − 0.999996”", "0.9999966, and 1 − 0.9999966 = 0.0000034 (3.4 ppm)."],
    ["ch8", "141", "Shifted yield described as area “to the right of 1.5σ”", "Read −1.5σ (sign lost in the scan); yield ≈ 0.9332."],
    ["ch9", "165", "Fig. 9.3 member columns", "In the scan two members' columns repeat a rank (sum 16, not 15). Final order A > C > B > D > E holds."],
    ["ch9", "166", "Fig. 9.4 total for D shown as 430", "130 — every column sums to 100, so the grand total is 900."],
    ["ch11", "187", "“Three objects from a collection of seven objects”", "Ten volunteers: 10C3 = 120."],
    ["ch11", "190", "σ/√n = 0.003 called the “sample standard deviation”", "The standard error of the mean."],
    ["ch12", "196", "Normal approximation if np ≥ 10 and np(1 − p) ≥ 10", "np ≥ 10 and n(1 − p) ≥ 10."],
    ["ch12", "197", "Poisson P(0) ≈ 0.006", "0.0067 (the total P(x &lt; 2) = 0.040 is right)."],
    ["ch12", "198", "Defectives in a lot of 50 by Poisson: 0.175", "A Poisson approximation; the exact binomial is 0.185."],
    ["ch12", "204", "“Approximately 7.8 percent of the packs could be greater than 7.5”", "A p-value isn't a share of packs. If normal, about 33% of packs exceed 7.5 g; the test only shows no evidence that μ &gt; 7.5."],
    ["ch13", "220–221", "Q1 = median of values at or below Q2, yet Q1 = 8.20 and Q3 = 9.79 printed", "That rule gives 8.25 and 9.63; the printed values follow Minitab's (n + 1)p method."],
    ["ch13", "230", "p &gt; 0.05, so “these data come from a normal distribution”", "No evidence against normality — not proof of it."],
    ["ch13", "232", "Weibull mean at the 63.2 percentile; MTBF = 4.635 h", "4.635 h is the characteristic life η. Mean = η·Γ(1 + 1/β) = 4.33 h; R(3.9) = 0.73."],
    ["ch14", "243", "Observed Cp 1.0 with 50% GR&amp;R → actual Cp 1.23", "Holds only with the 5.15σ %GRR; with 6σ it's 1.15."],
    ["ch14", "246", "R-Sq 0.0% “shows a nonlinearity issue”", "Slope p = 0.974: linearity is fine. The problem is bias: −0.115 (p 0.000), driven by the 0.6 reference."],
    ["ch15", "257", "FMEA and control plans “can be found in Chapter 9”", "FMEA is in Chapter 3; control plans in Chapter 23."],
    ["ch15", "263–264", "Pp, Ppk, Cpm “require stability” — then AIAG recommends Pp/Ppk when not in control", "Pp/Ppk describe past performance from the overall s; they predict nothing for an unstable process."],
    ["ch16", "282", "p = 0.333 = “probability of mistakenly rejecting the hypothesis”", "The chance of an r this large with no real relationship; with n = 3 it isn't significant."],
    ["ch16", "283–284", "Correlation test and CI use df = n − 1", "n − 2 — as the example itself uses."],
    ["ch16", "287", "Complaints rise “one per month”; 14.666 reported as 14", "Slope 0.58 per month; the slope isn't significant (p ≈ 0.12) and month 14 is an extrapolation."],
    ["ch16", "290", "Fail to reject → “must conclude that a relationship does not exist”", "Insufficient evidence; p = 0.051 with n = 4 is a low-power result."],
    ["ch16", "292", "CI of 7.84 to 14.49 described as for “the number of items”", "That's the CI for the mean; one month's count needs the prediction interval."],
    ["ch17", "298", "Golf printout: mean 19.673, s 1.775, t −0.58", "The listed data give 19.70, 1.767, t −0.54, p 0.70. Same conclusion."],
    ["ch17", "299", "n = (1.96)²(35)² ÷ 10² = 470.59, “E = process mean”", "47.06 → 48. E is the shift to detect; with E = 8 tons, n = 74."],
    ["ch17", "300", "Power 0.8 means “a 20% likelihood it will incorrectly identify a significant difference”", "20% is β — missing a real difference. A false detection is α."],
    ["ch17", "306–310", "“No change”, “no difference” after failing to reject", "Insufficient evidence of a difference."],
    ["ch17", "311", "p′ = 15/300 = 0.03", "15/500 = 0.03."],
    ["ch17", "312", "Two-sample example “uses a paired t-test”", "It's a pooled two-sample t-test. A paired test on the same numbers gives p = 0.037."],
    ["ch17", "314", "Welch df 7.627 rounded up to 8; “p &gt; 0.5 … equal variances”", "Round down to 7 (critical 2.365). The test is about means; the threshold is 0.05."],
    ["ch17", "315", "“A paired test is always a two-tailed test”", "Paired tests can be one-tailed when H₁ is directional."],
    ["ch17", "320–323", "F = 23.92; Figures 17.6–17.7 labels", "23.81 unrounded. The group with mean 10.575 is 240 °F — the figure labels are swapped."],
    ["ch17", "326", "χ² = 4.9 for the defect mix", "5.33 — the table and software agree; p = 0.149."],
    ["ch18", "333", "“All the probabilities sum up to the top-level cause”", "AND gates multiply; OR = 1 − Π(1 − p)."],
    ["ch19", "338", "Fisher developed DOE “in the 1920s and 1980s”", "1920s and 1930s (<i>The Design of Experiments</i>, 1935)."],
    ["ch19", "338", "An independent variable “does not have interactions with other variables”", "Factors can interact — that is what interaction effects measure. “Independent” only means the experimenter sets it."],
    ["ch19", "356", "Half-fraction steak average 76.67", "74.25 — the four runs are 88, 58, 67 and 84. The effects (23.5, −6.5, 2.5) are right."],
    ["ch19", "359", "Table 19.8 (ANOVA outcomes)", "Garbled in the scan. Trust the text: effects G 23, C 20, A 13, D 5; only G and C are significant."],
    ["ch19", "359", "Significant if |effect| exceeds the standard error", "Loose shortcut. Compare effect ÷ SE with t (about 2 at 95%), or use ANOVA."],
    ["ch22", "389", "Hypothesis definition: rejecting = within expected variation; accepting = significant change", "Reversed. Rejecting the null hypothesis (no change) means concluding the process has changed."],
    ["ch22", "389, 401", "Subgroup size “four to 10”, “two to five” and “four to six”", "Inconsistent, not wrong: 4–5 is the usual variables-chart choice; attributes need 50–200."],
    ["ch22", "401", "Attribute sample sizes “should not vary by more than 20 percent”", "pp. 411–412 and 416 use the AIAG rule: recalculate limits for any sample more than 25% above or below the average."],
    ["ch22", "409", "Median chart uses 1.880 with three readings per sample", "1.880 is the n = 2 value. For n = 3, Ã₂ = 1.187: limits ≈ 7.129 and 7.121, not 7.132."],
    ["ch22", "418", "±3σ limits enclose “99.72%”", "99.73% for a normal distribution."],
    ["ch22", "425", "False alarm called a “type II error (producer's risk)”", "Type I error (α, producer's risk), as pp. 389–390 define it. Type II (β) is missing a real change."],
    ["ch23", "432, 435", "SDCA = standardize-do-check-<b>act</b> (p. 432), -<b>adjust</b> (p. 435)", "Both expansions are in use; the meaning — lock in the gain — is the same."]
  ];
  G.page("binder", {
    title: "Binder map",
    render: () => `
      <h1>What to tab in your binder</h1>
      <p class="lede">Page numbers match your handbook copy. You may annotate before the exam but not during it, so do the margin notes now.</p>
      ${PHASES.map((p) => `
        <h2 class="phase-h">${p.name} · Chapters ${p.chs}</h2>
        ${G.table(["Ch", "Pages", "Tab label", "Write in the margin"], TABS.filter((t) => PHASE_OF(t[0]) === p.id).map(([ch, pg, l, n]) => [`<a href="#/${ch}" style="font:700 1.1rem var(--display);color:var(${CC[ch]})">${G.chapters[ch].num}</a>`, pg, l, n]))}`).join("")}
      <h2>Correct these in your copy</h2>
      <p class="soft">Verified against the handbook's own arithmetic, the 2022 BoK and the source standards. Where a figure only looks wrong because of the scan, check your printed page.</p>
      ${G.table(["Ch", "Page", "Handbook / scan says", "Use instead"], ERRATA.map(([ch, pg, s, u]) => [`<a href="#/${ch}" style="font:700 1.1rem var(--display);color:var(${CC[ch]})">${G.chapters[ch].num}</a>`, pg, s, u]))}
      <h2>Exam habits by phase</h2>
      <h3 class="phase-h">Six Sigma and the organization</h3>
      <ul>
        <li><b>Attribution items:</b> the stem's key noun names the person — trilogy (Juran), zero defects (Crosby), loss function (Taguchi), fishbone (Ishikawa), PDCA originator (Shewhart).</li>
        <li><b>Expected profit:</b> check the probabilities add to 1, multiply, then sum — keep the negative “none” outcome.</li>
        <li><b>FMEA:</b> write S × O × D, remember detection runs backwards, and break ties on severity.</li>
        <li><b>Lean definitions:</b> the distractors are near-miss terms — heijunka vs hoshin kanri, motion vs transportation, “measure” among the TOC steps.</li>
      </ul>
      <h3 class="phase-h">Define</h3>
      <ul>
        <li><b>NOT questions</b> (roughly a quarter of items): find the handbook's list — challenges, reasons, do/don't tables — and eliminate the three that appear on it.</li>
        <li><b>Calculation items:</b> write the formula from your formula sheet first, then substitute. The distractors are the classic slips: forgetting opportunities, averaging yields, inverting CPI.</li>
        <li><b>Scenario items with named people:</b> underline the symptom words (agree too readily, doubts in private, interrupts) and go straight to Table 9.1 or the stage list.</li>
        <li><b>Budget:</b> about 2 minutes 20 seconds per question. Define items are mostly recognition — bank time here for Measure and Analyze calculations.</li>
      </ul>
      <h3 class="phase-h">Measure</h3>
      <ul>
        <li><b>Capability items:</b> write the σ source first — R̄/d₂ means Cp/Cpk, an overall s means Pp/Ppk — then Z to each limit, then divide by 3. Distractors: Cp offered for Cpk, Z not divided by 3, the far limit used.</li>
        <li><b>MSA items:</b> find the base (study variation, tolerance or %contribution) before applying 10/30% or 1/9%. Then ask whether EV or AV dominates.</li>
        <li><b>Probability:</b> decide exclusive or independent from the stem, write the rule, substitute. Watch for “without replacement”.</li>
        <li><b>Distributions and graphs:</b> the noun decides — defectives vs defects, one variable vs two, time order or not.</li>
      </ul>
      <h3 class="phase-h">Analyze</h3>
      <ul>
        <li><b>Test selection in two questions:</b> what is being compared (means, variances, proportions, counts), and how many groups — paired or independent? Then take the df from your tab.</li>
        <li><b>Conclusions:</b> when p &gt; α, options saying “accept H₀”, “proves” or “no difference” are wrong; “insufficient evidence” is right.</li>
        <li><b>Regression:</b> check the slope's significance before predicting, refuse to extrapolate, and use n − 2 df.</li>
        <li><b>Root cause scenarios:</b> prefer the verified, system-level cause; AND gates multiply.</li>
      </ul>
      <h3 class="phase-h">Improve</h3>
      <ul>
        <li><b>DOE effects:</b> sum the four responses at + and the four at −, divide each by four, subtract. Wrong options are the high-level average alone, the difference of sums, or the sign flipped.</li>
        <li><b>Takt and Little's law:</b> both are one division. Write the units (min per unit, days) — an inverted ratio gives units that make no sense.</li>
        <li><b>Kaizen family and implementation gates:</b> the stem's timeframe decides — a few days to a week → blitz; years of small steps → kaizen; early → proof of concept; late and limited → pilot.</li>
      </ul>
      <h3 class="phase-h">Control</h3>
      <ul>
        <li><b>Chart selection:</b> ask two questions in order — measured or counted? If counted, defective units or defects, and is n constant? That settles it in seconds.</li>
        <li><b>Control limits:</b> open Appendix E, read the constant for the stated n, and compute. I–MR uses n = 2. A negative LCL means no LCL.</li>
        <li><b>Run rules:</b> look for which rule set the stem names. If none, a point beyond a limit or 7 in a row on one side is safe ground.</li>
        <li><b>OEE:</b> multiply the three factors; remove planned downtime before availability.</li>
      </ul>
      <p><a href="#/formulas">Print the formula sheet</a> and file it in your binder.</p>`
  });
})();
