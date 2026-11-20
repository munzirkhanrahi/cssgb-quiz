/* Home, Traps lab, Formula sheet, Binder map */
(function () {
  "use strict";
  const { $, $$ } = G;
  const CC = { ch4: "--c4", ch5: "--c5", ch6: "--c6", ch7: "--c7", ch8: "--c8", ch9: "--c9" };

  /* ---------- Home ---------- */
  const MAP = [
    ["ch4", "II.A", [["II.A.1", "Project selection", "Understand", "select"], ["II.A.2", "Process elements", "Analyze", "elements"], ["II.A.3", "Benchmarking", "Understand", "bench"], ["II.A.4", "SIPOC", "Analyze", "sipoc"], ["II.A.5", "Owners & stakeholders", "Apply", "owners"]]],
    ["ch5", "II.B", [["II.B.1", "Customer identification", "Apply", "ident"], ["II.B.2", "Customer data", "Apply", "data"], ["II.B.3", "QFD, CTx, Kano", "Apply", "qfd"]]],
    ["ch6", "II.C", [["II.C.1", "Agile vs top-down", "Apply", "method"], ["II.C.2", "Charter", "Apply", "charter"], ["II.C.3", "Scope", "Apply", "scope"], ["II.C.4", "Metrics", "Apply", "metrics"], ["II.C.5", "Planning tools", "Apply", "tools"], ["II.C.6", "Documentation", "Apply", "docs"], ["II.C.7", "Risk", "Understand", "risk"], ["II.C.8", "Closure", "Apply", "closure"]]],
    ["ch7", "II.D", [["II.D", "Eight M&P tools", "Apply", "eight"]]],
    ["ch8", "II.E", [["II.E.1", "Process performance", "Analyze", "dpmo"], ["II.E.2", "Communication", "Apply", "comm"]]],
    ["ch9", "II.F", [["II.F.1", "Stages & dynamics", "Understand", "stages"], ["II.F.2", "Roles & RACI", "Apply", "roles"], ["II.F.3", "Team tools", "Apply", "tools"], ["II.F.4", "Team communication", "Apply", "tcomm"]]]
  ];
  const MUST = [
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
  ];
  G.page("home", {
    title: "Define phase map",
    render: () => `
      <h1>Define, visually</h1>
      <p class="lede">Chapters 4–9 of the CSSGB Handbook — the Define phase, 20 of the 100 scored questions. Every topic pairs a picture or a working tool with the trap ASQ sets and the page to tab in your binder.</p>
      <h2 style="margin-top:2rem">Where the depth is</h2>
      <p class="soft">Each tile is a BoK subtopic, shaded by the highest cognitive level ASQ will test. ASQ publishes only the Define total (20), not a split by subtopic — so shading tells you <i>how</i> you'll be asked, not how often.</p>
      <div class="legend"><span><i class="dot" style="background:var(--lv-u)"></i>Understand — recognise and interpret</span><span><i class="dot" style="background:var(--lv-a)"></i>Apply — use it in a scenario</span><span><i class="dot" style="background:var(--lv-n)"></i>Analyze — break down scenarios and calculate</span></div>
      <div class="map anim">${MAP.map(([ch, bok, items], r) => `
        <div class="map-row">
          <a class="map-lab" href="#/${ch}" style="--tc: var(${CC[ch]})"><b>Ch ${G.chapters[ch].num} ${G.chapters[ch].title}</b><span>BoK ${bok}</span></a>
          <div class="map-tiles">${items.map(([ref, name, lv, sec], i) => `<a class="mt lv-${lv}" href="#/${ch}/${sec}" style="animation-delay:${(r * 4 + i) * 35}ms"><span class="r">${ref}</span><span>${name}</span><span class="lvl">${lv}</span></a>`).join("")}</div>
        </div>`).join("")}</div>
      <h2>Start with these fourteen</h2>
      <p class="soft">Ranked by how often they decide a question: calculations first, then the close-difference pairs ASQ builds distractors from.</p>
      <ol class="mustlist">${MUST.map(([ch, sec, t]) => `<li style="--tc: var(${CC[ch]})"><a class="tagc" href="#/${ch}/${sec}">Ch ${G.chapters[ch].num}</a><p><a href="#/${ch}/${sec}">${G.chapters[ch].sections.find((s) => s.id === sec).title}</a> — ${t}</p></li>`).join("")}</ol>
      <h2>How each topic is laid out</h2>
      <div class="grid3">
        ${G.trap("<p>The distractor ASQ is likely to use, and how to beat it.</p>")}
        ${G.tab("<p>What to tab or write in your handbook before exam day.</p>")}
        ${G.flag("<p>Where the handbook text or its scan is wrong, with the correct version.</p>")}
      </div>
      <p>Each chapter ends with a <b>blind check</b>: answer everything, then see the key and why each wrong option is wrong. For volume, use <a href="../">Green Belt Drill</a> — it has 22 questions per chapter.</p>
      <div class="row" style="margin-top:1rem"><a class="btn primary" href="#/ch4" style="display:inline-flex;align-items:center;text-decoration:none">Start Chapter 4</a><a class="btn" href="#/traps" style="display:inline-flex;align-items:center;text-decoration:none">Open the traps lab</a><a class="btn" href="#/binder" style="display:inline-flex;align-items:center;text-decoration:none">See what to tab</a></div>
      <p class="foot">Study notes in plain language from the ASQ CSSGB Handbook (Chapters 4–9) and the 2022 CSSGB Body of Knowledge. Progress is saved in this browser only.</p>`
  });

  /* ---------- Traps lab ---------- */
  const TRAPS = [
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
    ["ch9", "Consensus vs majority", ["Consensus", "Every member can support it."], ["Majority / unanimity", "Majority = more than half. Unanimity = everyone's first choice."], "Consensus is neither.", "decide"]
  ];
  let filt = "all";
  G.page("traps", {
    title: "Traps lab",
    render: () => `
      <h1>Traps lab</h1>
      <p class="lede">ASQ's favourite distractor is the correct definition of the wrong concept. These are the Define-phase pairs it builds them from.</p>
      <div class="row noprint" style="margin:1rem 0"><span class="seg" role="group" aria-label="Filter by chapter">${[["all", "All"], ["ch4", "Ch 4"], ["ch5", "Ch 5"], ["ch6", "Ch 6"], ["ch7", "Ch 7"], ["ch8", "Ch 8"], ["ch9", "Ch 9"]].map(([k, l]) => `<button type="button" data-f="${k}" aria-pressed="${k === filt}">${l}</button>`).join("")}</span><span class="soft small" data-n></span></div>
      <div data-cards></div>`,
    after: (root) => {
      const draw = () => {
        const list = TRAPS.filter((t) => filt === "all" || t[0] === filt);
        $("[data-n]", root).textContent = `${list.length} pairs`;
        $("[data-cards]", root).innerHTML = list.map(([ch, title, a, b, trap, sec]) => `
          <article class="trapcard" style="border-left:5px solid var(${CC[ch]})">
            <header><h3>${title}</h3><a class="small" href="#/${ch}/${sec}">Ch ${G.chapters[ch].num}: ${G.chapters[ch].sections.find((s) => s.id === sec).title}</a></header>
            <div class="vs"><div><b>${a[0]}</b><p>${a[1]}</p></div><div><b>${b[0]}</b><p>${b[1]}</p></div></div>
            <footer><b>Trap:</b> ${trap}</footer>
          </article>`).join("");
        $$("[data-f]", root).forEach((btn) => btn.setAttribute("aria-pressed", btn.dataset.f === filt));
      };
      $$("[data-f]", root).forEach((btn) => btn.addEventListener("click", () => { filt = btn.dataset.f; draw(); }));
      draw();
    }
  });

  /* ---------- Formula sheet ---------- */
  const F = [
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
  ];
  G.page("formulas", {
    title: "Formula sheet",
    render: () => `
      <h1>Define-phase formula sheet</h1>
      <p class="lede">Every calculation in Chapters 4–9 on one printable page, each with a worked example. Print it and add it to your binder behind the Chapter 8 tab.</p>
      <div class="row noprint" style="margin-bottom:1rem"><button class="btn primary" type="button" data-print>Print this sheet</button></div>
      <div class="fsheet">${F.map(([h, f, ex, ch, sec]) => `<div class="fcell" style="border-top:4px solid var(${CC[ch]})"><h4><a href="#/${ch}/${sec}" style="color:inherit;text-decoration:none">${h}</a></h4><div class="formula">${f}</div><p class="soft">${ex}</p></div>`).join("")}</div>
      <p class="foot">Normal-table note: your calculator cannot compute normal probabilities. Convert Z to area with the handbook's standard normal table.</p>`,
    after: (root) => { const b = $("[data-print]", root); if (b) b.addEventListener("click", () => window.print()); }
  });

  /* ---------- Binder map ---------- */
  const TABS = [
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
    ["ch8", "Appendix", "Standard normal (Z) table", "Needed for every sigma-level item"]
  ];
  const ERRATA = [
    ["139", "Balanced scorecard “five primary areas”", "Four perspectives: financial, customer, internal processes, learning and growth."],
    ["140", "“An average 165 defects/unit”", "165 is the total defects in the 40,000-unit batch: DPU = 0.004125, DPMO = 687.5."],
    ["141", "DPO formula line garbled in the scan", "DPO = total defects ÷ total opportunities = DPU ÷ opportunities per unit."],
    ["141", "Six sigma yield shown as 0.999966 and “1 − 0.999996”", "0.9999966, and 1 − 0.9999966 = 0.0000034 (3.4 ppm)."],
    ["141", "Shifted yield described as area “to the right of 1.5σ”", "Read −1.5σ (sign lost in the scan); yield ≈ 0.9332."],
    ["112", "“ISO 22301:2018”", "ISO 22301:2019. The quoted text is its definition of business continuity."],
    ["131", "Fig. 7.13 cost column", "Contradicts the text's ranking; with the text's ranks the totals are A 3.40, B 1.40, C 3.60, D 1.90. C wins either way."],
    ["165", "Fig. 9.3 member columns", "In the scan two members' columns repeat a rank (sum 16, not 15). Final order A > C > B > D > E holds."],
    ["166", "Fig. 9.4 total for D shown as 430", "130 — every column sums to 100, so the grand total is 900."]
  ];
  G.page("binder", {
    title: "Binder map",
    render: () => `
      <h1>What to tab in your binder</h1>
      <p class="lede">Page numbers match your handbook copy. You may annotate before the exam but not during it, so do the margin notes now.</p>
      ${G.table(["Ch", "Pages", "Tab label", "Write in the margin"], TABS.map(([ch, p, l, n]) => [`<a href="#/${ch}" style="font:700 1.1rem var(--display);color:var(${CC[ch]})">${G.chapters[ch].num}</a>`, p, l, n]))}
      <h2>Correct these in your copy</h2>
      <p class="soft">Verified against the handbook's own arithmetic, the 2022 BoK and the source standards. Where a figure only looks wrong because of the scan, check your printed page.</p>
      ${G.table(["Page", "Handbook / scan says", "Use instead"], ERRATA)}
      <h2>Define-phase exam habits</h2>
      <ul>
        <li><b>NOT questions</b> (roughly a quarter of items): find the handbook's list — challenges, reasons, do/don't tables — and eliminate the three that appear on it.</li>
        <li><b>Calculation items:</b> write the formula from your formula sheet first, then substitute. The distractors are the classic slips: forgetting opportunities, averaging yields, inverting CPI.</li>
        <li><b>Scenario items with named people:</b> underline the symptom words (agree too readily, doubts in private, interrupts) and go straight to Table 9.1 or the stage list.</li>
        <li><b>Budget:</b> about 2 minutes 20 seconds per question. Define items are mostly recognition — bank time here for Measure and Analyze calculations.</li>
      </ul>
      <p><a href="#/formulas">Print the formula sheet</a> to file behind the Chapter 8 tab.</p>`
  });
})();
