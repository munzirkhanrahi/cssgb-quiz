/* Home, Traps lab, Formula sheet, Binder map */
(function () {
  "use strict";
  const { $, $$ } = G;
  const CC = {};
  [4, 5, 6, 7, 8, 9, 19, 20, 21, 22, 23, 24].forEach((n) => { CC["ch" + n] = "--c" + n; });
  const PHASE_OF = (ch) => (+ch.slice(2) <= 9 ? "define" : +ch.slice(2) <= 21 ? "improve" : "control");
  const secTitle = (ch, sec) => G.chapters[ch].sections.find((s) => s.id === sec).title;
  const link = (href, label, primary) => `<a class="btn${primary ? " primary" : ""}" href="${href}" style="display:inline-flex;align-items:center;text-decoration:none">${label}</a>`;

  /* ---------- Home ---------- */
  const PHASES = [
    { id: "define", name: "Define", q: 20, chs: "4–9", start: "ch4", rows: [
      ["ch4", "II.A", [["II.A.1", "Project selection", "Understand", "select"], ["II.A.2", "Process elements", "Analyze", "elements"], ["II.A.3", "Benchmarking", "Understand", "bench"], ["II.A.4", "SIPOC", "Analyze", "sipoc"], ["II.A.5", "Owners & stakeholders", "Apply", "owners"]]],
      ["ch5", "II.B", [["II.B.1", "Customer identification", "Apply", "ident"], ["II.B.2", "Customer data", "Apply", "data"], ["II.B.3", "QFD, CTx, Kano", "Apply", "qfd"]]],
      ["ch6", "II.C", [["II.C.1", "Agile vs top-down", "Apply", "method"], ["II.C.2", "Charter", "Apply", "charter"], ["II.C.3", "Scope", "Apply", "scope"], ["II.C.4", "Metrics", "Apply", "metrics"], ["II.C.5", "Planning tools", "Apply", "tools"], ["II.C.6", "Documentation", "Apply", "docs"], ["II.C.7", "Risk", "Understand", "risk"], ["II.C.8", "Closure", "Apply", "closure"]]],
      ["ch7", "II.D", [["II.D", "Eight M&P tools", "Apply", "eight"]]],
      ["ch8", "II.E", [["II.E.1", "Process performance", "Analyze", "dpmo"], ["II.E.2", "Communication", "Apply", "comm"]]],
      ["ch9", "II.F", [["II.F.1", "Stages & dynamics", "Understand", "stages"], ["II.F.2", "Roles & RACI", "Apply", "roles"], ["II.F.3", "Team tools", "Apply", "tools"], ["II.F.4", "Team communication", "Apply", "tcomm"]]]
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
    improve: [
      ["ch21", "takt", "Takt = available time ÷ demand. Takt is the customer's pace; cycle time is the process's."],
      ["ch19", "effects", "Effect = average at + minus average at −. Check the interaction plot before dropping a factor."],
      ["ch21", "tools", "Little's law: lead time = WIP ÷ throughput. Pull and kanban shrink WIP, so lead time falls."],
      ["ch21", "smed", "SMED: move internal work to external first, then shrink what stays internal. Setup ends at the first good piece."],
      ["ch19", "terms", "Replication resets every run; repetition does not."],
      ["ch19", "fractional", "In a half fraction, a main effect is aliased with an interaction (C = AB)."],
      ["ch21", "kaizen", "Kaizen = small steps; blitz = one-week event; kaikaku = radical, management-led change."],
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
  const LEVELS = [["Remember", "recall a term"], ["Understand", "recognise and interpret"], ["Apply", "use it in a scenario"], ["Analyze", "break down scenarios and calculate"]];
  G.page("home", {
    title: "Phase map",
    render: () => `
      <h1>CSSGB, visually</h1>
      <p class="lede">The Define, Improve and Control phases of the CSSGB Handbook — Chapters 4–9, 19–21 and 22–24, which together carry 51 of the 100 scored questions. Every topic pairs a picture or a working tool with the trap ASQ sets and the page to tab in your binder.</p>
      <div class="row" style="margin-top:1rem">${PHASES.map((p) => link("#/" + p.start, `Start ${p.name} (Ch ${G.chapters[p.start].num})`, p.id === "define")).join("")}${link("#/traps", "Open the traps lab")}${link("#/binder", "See what to tab")}</div>
      <h2 style="margin-top:2rem">Where the depth is</h2>
      <p class="soft">Each tile is a BoK subtopic, shaded by the highest cognitive level ASQ will test. ASQ publishes phase totals, not a split by subtopic — so shading tells you <i>how</i> you'll be asked, not how often.</p>
      <div class="legend">${LEVELS.map(([l, d]) => `<span><i class="dot lvdot lv-${l}"></i>${l} — ${d}</span>`).join("")}</div>
      ${PHASES.map((p, pi) => `
        <h3 class="phase-h">${p.name} phase · ${p.q} questions · Chapters ${p.chs}</h3>
        <div class="map anim">${p.rows.map(([ch, bok, items], r) => `
          <div class="map-row">
            <a class="map-lab" href="#/${ch}" style="--tc: var(${CC[ch]})"><b>Ch ${G.chapters[ch].num} ${G.chapters[ch].title}</b><span>BoK ${bok}</span></a>
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
      <p>Each chapter ends with a <b>blind check</b>: answer everything, then see the key and why each wrong option is wrong. For volume, use <a href="../">Green Belt Drill</a> — 22 questions per Define chapter, 33 per Improve chapter and 30 per Control chapter.</p>
      <p class="foot">Study notes in plain language from the ASQ CSSGB Handbook (Chapters 4–9 and 19–24) and the 2022 CSSGB Body of Knowledge. Progress is saved in this browser only.</p>`
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
    ["ch9", "Consensus vs majority", ["Consensus", "Every member can support it."], ["Majority / unanimity", "Majority = more than half. Unanimity = everyone's first choice."], "Consensus is neither.", "decide"],
    /* Improve */
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
    ["ch21", "Kaizen vs kaizen blitz", ["Kaizen", "Small, frequent, low-cost improvement sustained over years."], ["Kaizen blitz", "An intensive event of about a week: collect data, analyze, implement at once."], "Kaikaku is a third term: radical, management-led change (p. 381 blurs it with the blitz).", "kaizen"],
    ["ch21", "Bottleneck vs capacity-constrained resource", ["Bottleneck", "Already sets the pace of the whole process."], ["Capacity-constrained resource", "At risk of becoming a bottleneck; can hurt throughput even below full capacity."], "Limit inventory to what the bottleneck can process.", "smed"],
    ["ch21", "Push vs pull", ["Push", "Produce to a schedule or forecast regardless of downstream need; WIP builds."], ["Pull", "Customer demand triggers production; replenish only what is consumed (kanban)."], "Lower WIP means shorter lead time (Little's law).", "tools"],
    ["ch21", "Poka-yoke vs inspection", ["Poka-yoke", "Makes the error impossible, or obvious the moment it happens."], ["Inspection", "Finds defects after they are made (appraisal)."], "Mistake-proofing prevents; it is not after-the-fact checking.", "tools"],
    /* Control */
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
    ["ch24", "Andon vs kanban", ["Andon", "A visual or audible signal of process status that calls for help."], ["Kanban", "A signal to replenish or produce when parts are consumed."], "Status and help → andon. Material → kanban.", "visual"]
  ];
  let filt = "all";
  const PH_BTNS = [["all", "All"], ["define", "Define"], ["improve", "Improve"], ["control", "Control"]];
  const CH_OF = { define: ["ch4", "ch5", "ch6", "ch7", "ch8", "ch9"], improve: ["ch19", "ch20", "ch21"], control: ["ch22", "ch23", "ch24"] };
  G.page("traps", {
    title: "Traps lab",
    render: () => `
      <h1>Traps lab</h1>
      <p class="lede">ASQ's favourite distractor is the correct definition of the wrong concept. These are the pairs it builds them from, across Define, Improve and Control.</p>
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
      <p class="lede">Every calculation in the Define, Improve and Control chapters, each with a worked example from the handbook or this guide. Print it and file it in your binder.</p>
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
    ["ch21", "380–385", "Kaizen, blitz, kaikaku, levels, events", "Three-way distinction (fix p. 381)"],
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
    ["ch6", "112", "“ISO 22301:2018”", "ISO 22301:2019. The quoted text is its definition of business continuity."],
    ["ch7", "131", "Fig. 7.13 cost column", "Contradicts the text's ranking; with the text's ranks the totals are A 3.40, B 1.40, C 3.60, D 1.90. C wins either way."],
    ["ch8", "139", "Balanced scorecard “five primary areas”", "Four perspectives: financial, customer, internal processes, learning and growth."],
    ["ch8", "140", "“An average 165 defects/unit”", "165 is the total defects in the 40,000-unit batch: DPU = 0.004125, DPMO = 687.5."],
    ["ch8", "141", "DPO formula line garbled in the scan", "DPO = total defects ÷ total opportunities = DPU ÷ opportunities per unit."],
    ["ch8", "141", "Six sigma yield shown as 0.999966 and “1 − 0.999996”", "0.9999966, and 1 − 0.9999966 = 0.0000034 (3.4 ppm)."],
    ["ch8", "141", "Shifted yield described as area “to the right of 1.5σ”", "Read −1.5σ (sign lost in the scan); yield ≈ 0.9332."],
    ["ch9", "165", "Fig. 9.3 member columns", "In the scan two members' columns repeat a rank (sum 16, not 15). Final order A > C > B > D > E holds."],
    ["ch9", "166", "Fig. 9.4 total for D shown as 430", "130 — every column sums to 100, so the grand total is 900."],
    ["ch19", "338", "Fisher developed DOE “in the 1920s and 1980s”", "1920s and 1930s (<i>The Design of Experiments</i>, 1935)."],
    ["ch19", "338", "An independent variable “does not have interactions with other variables”", "Factors can interact — that is what interaction effects measure. “Independent” only means the experimenter sets it."],
    ["ch19", "356", "Half-fraction steak average 76.67", "74.25 — the four runs are 88, 58, 67 and 84. The effects (23.5, −6.5, 2.5) are right."],
    ["ch19", "359", "Table 19.8 (ANOVA outcomes)", "Garbled in the scan. Trust the text: effects G 23, C 20, A 13, D 5; only G and C are significant."],
    ["ch19", "359", "Significant if |effect| exceeds the standard error", "Loose shortcut. Compare effect ÷ SE with t (about 2 at 95%), or use ANOVA."],
    ["ch21", "381", "Kaikaku described as a one-week focused kaizen", "That is a kaizen blitz. Kaikaku = radical, usually management-initiated change."],
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
      <h3 class="phase-h">Define</h3>
      <ul>
        <li><b>NOT questions</b> (roughly a quarter of items): find the handbook's list — challenges, reasons, do/don't tables — and eliminate the three that appear on it.</li>
        <li><b>Calculation items:</b> write the formula from your formula sheet first, then substitute. The distractors are the classic slips: forgetting opportunities, averaging yields, inverting CPI.</li>
        <li><b>Scenario items with named people:</b> underline the symptom words (agree too readily, doubts in private, interrupts) and go straight to Table 9.1 or the stage list.</li>
        <li><b>Budget:</b> about 2 minutes 20 seconds per question. Define items are mostly recognition — bank time here for Measure and Analyze calculations.</li>
      </ul>
      <h3 class="phase-h">Improve</h3>
      <ul>
        <li><b>DOE effects:</b> sum the four responses at + and the four at −, divide each by four, subtract. Wrong options are the high-level average alone, the difference of sums, or the sign flipped.</li>
        <li><b>Takt and Little's law:</b> both are one division. Write the units (min per unit, days) — an inverted ratio gives units that make no sense.</li>
        <li><b>Kaizen family and implementation gates:</b> the stem's timeframe decides — about a week → blitz; years of small steps → kaizen; radical → kaikaku; early → proof of concept; late and limited → pilot.</li>
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
