G.chapter({
  id: "ch6", num: 6, title: "Project Management Basics", bok: "II.C", pages: "101–113",
  lede: "Charter it, scope it, measure it, schedule it, de-risk it, close it. Eight BoK subtopics live here — the widest spread in the Define phase — and the planning tools are where calculation questions appear.",
  sections: [
    {
      id: "theory", title: "Management theories and styles", bok: "II.C.1", level: "Apply", pages: "101–103",
      html: `
        <p>Style depends on the manager's assumptions about people, the employees' characteristics and the situation. ASQ likes to swap the names attached to these ideas, so drill the attributions.</p>
        ${G.w("theories")}
        ${G.trap(`<p>Theory X and Theory Y are both <b>McGregor</b>; Theory Z is <b>Ouchi</b>. Two-factor (satisfiers/dissatisfiers) is <b>Herzberg</b>, not Maslow. Situational leadership is <b>Hersey and Blanchard</b>, not Blake and Mouton (managerial grid).</p>`)}`
    },
    {
      id: "method", title: "Top-down vs agile", bok: "II.C.1", level: "Apply", pages: "103",
      html: `
        ${G.table(["", "Top-down", "Agile"], [
          ["Handbook definition", "Any mix of the theories where management (or the project manager) directs and controls the outcome. The manager controls all aspects of decision-making.", "A term from lean thinking: reduce cycle time and waste with tools such as value-stream mapping and removing non-value-added steps. Lean and agile are often used interchangeably."],
          ["Most associated with", "Theory X", "Lean tools (Chapter 2)"],
          ["Decision-making", "Centralised", "Pushed toward the team; adaptive"]
        ], { rowHead: true })}
        ${G.flag(`<p>The handbook ties “agile” to lean. In wider project-management practice (the 2001 Agile Manifesto, Scrum, the PMI), agile means <b>iterative, incremental delivery by empowered teams that adapt to change</b>. On the exam, if an option contrasts adaptive, iterative, team-driven work with centralised command and control, that is the agile vs top-down distinction either way.</p>`, "Calibration note")}`
    },
    {
      id: "charter", title: "Project charter and problem statement", bok: "II.C.2", level: "Apply", hy: true, pages: "104",
      html: `
        <p>A charter states the project's purpose and works as an <b>informal contract</b> that keeps the team aligned with organizational goals. It is usually one or two pages — a quick top-level overview.</p>
        <div class="grid2">
          <div class="card"><h4>The five charter elements (handbook)</h4>
            <ol class="small" style="margin:0">
              <li><b>Problem statement</b> — what needs to be improved.</li>
              <li><b>Purpose</b> — the team's goals and objectives.</li>
              <li><b>Benefits</b> — how the enterprise fares better when the goal is reached.</li>
              <li><b>Scope</b> — limits in budget, time and other resources.</li>
              <li><b>Results</b> — success criteria and metrics, including baseline and expected improvement.</li>
            </ol></div>
          <div class="card"><h4>Statement of work (SOW)</h4><p>Another term sometimes used for the charter; describes the actual work. Derived from the <b>WBS</b>, and combined with the project specification it becomes the basis of the <b>contract</b>. Also called the scope of work.</p></div>
        </div>
        ${G.w("probstmt")}
        <p><b>Goals in SMART format:</b> specific, measurable, achievable, relevant, time-bound.</p>
        ${G.trap(`<p>The best problem statement contains <b>baseline data and the gap to target</b> and names <b>no cause and no solution</b>. ASQ distractors often sound decisive because they include a cause (“due to untrained staff”) or a fix (“implement a new WMS”).</p>`)}
        ${G.tab(`<p>p. 104: number the five elements a–e and write “no cause, no solution, include baseline” next to the problem statement examples.</p>`)}`
    },
    {
      id: "scope", title: "Project scope", bok: "II.C.3", level: "Apply", pages: "105",
      html: `
        <p>Scope documents the boundaries: what the team and its resources will work on, and what is outside. It starts from the problem statement and is refined with experience, SIPOC, brainstorming, process maps and <b>Pareto charts</b>.</p>
        ${G.w("pareto")}
        ${G.trap(`<p>Scope is about <b>boundaries</b>, not the goal. If an option describes the target improvement, it is the purpose or results element of the charter, not scope.</p>`)}`
    },
    {
      id: "metrics", title: "Primary and consequential metrics", bok: "II.C.4", level: "Apply", hy: true, pages: "105–106",
      html: `
        <p>Without meaningful measures, timelines and plans become paperwork. Metrics should link directly to project goals and, through them, to benefits for the enterprise — e.g. a goal of 25% more throughput implies cycle time as a key metric, with incremental targets along the way.</p>
        <div class="grid2">
          <div class="card"><h4>Primary metric</h4><p>The measure the goal is written in: “reduce defect levels by x”.</p></div>
          <div class="card"><h4>Consequential metric</h4><p>A measure of the negative side effects the planned improvement might cause — the “don't break anything else” guardrail.</p></div>
        </div>
        ${G.w("metrics")}
        <ul>
          <li><b>Project measures</b> last only for the project: percentage of work on time (SPI), percentage on budget (CPI), availability of resources, quality of key deliverables.</li>
          <li>Start measuring as early as possible to benchmark the current state — numbers often improve as soon as people realise they are being watched (the Hawthorne effect).</li>
          <li>Check the area's KPIs: what does management already consider important?</li>
        </ul>
        ${G.trap(`<p>Because the baseline improves once people know they are being measured, a late-started baseline overstates the starting point and understates the project's gain.</p>`)}`
    },
    {
      id: "tools", title: "Planning tools: WBS, Gantt, CPM, PERT, toll gates", bok: "II.C.5", level: "Apply", hy: true, pages: "106–108, 124–125, 133–134",
      html: `
        <p>The number of tools and the depth of documentation scale with project size. A spreadsheet of projected dates, or a brainstormed flowchart with dates added, can be enough for a small project.</p>
        <h3>Work breakdown structure</h3>
        <p>Once objectives are defined, the WBS breaks the project into component tasks. It guides the logical development of tasks and summarises costs: decompose until each task's time and cost can be estimated confidently, then roll the costs up.</p>
        ${G.w("wbs")}
        <h3>Gantt chart</h3>
        <p>Bars on a calendar show each key activity's duration and timing, milestones, and predecessor–successor relationships, so you can see quickly what a delay or pull-in does to the schedule, check resources against the plan, and track performance.</p>
        ${G.w("gantt")}
        <h3>Critical path method and PERT</h3>
        <p>In current software PERT and CPM have essentially merged. The <b>critical path</b> is the path from start to finish that takes the <b>most</b> time; its length is the project duration. Delay anything on it and the whole project slips. The only way to finish sooner is to shorten at least one critical activity, usually by adding resources — <b>crashing</b>.</p>
        ${G.w("cpm")}
        ${G.w("pert")}
        <h3>Toll-gate reviews</h3>
        <p>Fixed checkpoints between phases — similar to the APQP gates in automotive work and to the DMAIC phases — where engineers, managers, the champion or a cross-functional team confirm the project is on the path to its intended outcome, and give feedback. The champion may bring in other senior managers.</p>
        <div style="display:flex;flex-wrap:wrap;align-items:center;gap:.3rem;margin:.6rem 0 1rem" aria-label="DMAIC with toll gates">${["Define", "Measure", "Analyze", "Improve", "Control"].map((p, i) => `<span style="background:var(--acc);color:#fff;font:700 1.1rem var(--display);padding:.35rem .7rem;border-radius:6px">${p}</span>${i < 4 ? '<span title="Toll gate" style="font:700 1rem var(--display);color:var(--ink)">▮ gate</span>' : ""}`).join("")}</div>
        ${G.trap(`<p>The critical path is the <b>longest</b> path, not the shortest; its activities have <b>zero slack</b>. Shortening a non-critical activity does not shorten the project. Distractors also add every activity's duration together — wrong when paths run in parallel.</p>`)}
        ${G.tab(`<p>p. 134: tab Fig. 7.15 and write “tₑ = (o + 4m + p) / 6” in the margin — the standard PERT estimate is not printed in these chapters.</p>`)}`
    },
    {
      id: "docs", title: "Project documentation and storyboards", bok: "II.C.6", level: "Apply", pages: "108–109",
      html: `
        <p>Missing documentation leads to projects that solve the wrong problem or answer a question nobody asked. Typical contents: goals and objectives, sponsors and stakeholders, plans and schedules (larger projects), key milestones, budget, boundaries, roles and responsibilities, deliverables, and the metrics used to judge performance. Small projects keep these in the charter.</p>
        <div style="display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:.3rem;margin:1rem 0" role="img" aria-label="Storyboard with five DMAIC panels">
          ${[["Define", "Charter, SIPOC, VOC"], ["Measure", "Baseline data, process map"], ["Analyze", "Root-cause charts"], ["Improve", "Pilot results, before/after"], ["Control", "Control plan, chart"]].map(([h, t]) => `<div style="border:1.5px solid var(--rule);border-radius:8px;background:#fff;padding:.45rem;min-height:5.5rem"><b style="font:700 1.05rem var(--display)">${h}</b><p class="small soft" style="margin:.2rem 0 0">${t}</p></div>`).join("")}
        </div>
        <p><b>Storyboards</b> convey changes that are easier to draw or photograph than explain — typically before-and-after (current state and future state) pictures, a good fit for facility or product redesign. Six Sigma storyboards are often laid out in five DMAIC sections. Spreadsheet summaries of results support phase reviews and management updates.</p>`
    },
    {
      id: "risk", title: "Project risk analysis and management", bok: "II.C.7", level: "Understand", hy: true, pages: "109–112",
      html: `
        <p>Do the first risk analysis early — during planning — and revisit it periodically, especially when a risk is realised. Tools: <b>SWOT</b>, <b>risk priority number or risk priority matrix</b>, <b>FMEA</b>, and the <b>expected-profit formula</b>, combined with brainstorming. Involve the right organizations and consider impacts on goals, schedule, resources, safety, producibility, serviceability, reliability and customer requirements.</p>
        ${G.w("riskmatrix")}
        ${G.w("rpn")}
        ${G.table(["Step", "Meaning", "ATM example (handbook)"], [
          ["Identification", "Name the risk", "Someone could access your bank account improperly"],
          ["Mitigation", "Reduce the likelihood and/or the impact", "Require a secured 6–10 digit PIN; freeze after three failed attempts"],
          ["Verification", "Prove the mitigation actually prevents the risk", "Try to access a secured account with an invalid or blank PIN"]
        ])}
        <p>Review mitigation plans regularly (usually weekly or monthly): are they working, are there new risks, has any risk occurred? A risk-management system curbs quality losses better than a reactive find-and-fix approach.</p>
        <h3>The risk management process</h3>
        <p>ISO 31000:2018 (clause 3.2) defines risk management as coordinated activities to direct and control an organization with regard to risk. In its simplest form, use <b>PDCA</b>: <b>Plan</b> — identify exposures, quantify financial and non-financial risks, examine alternatives, select techniques; <b>Do</b> — test the chosen technique; <b>Check</b> — assess effectiveness and adjust; <b>Act</b> — roll out and monitor; then improve and return to Plan.</p>
        <h3>Business continuity planning</h3>
        <p>Plan for disruptions such as pandemics, major fire, destructive weather, loss of key people or the workforce, supply-chain disruption, regulatory change, site-wide safety accidents, environmental incidents and transport disruption. Automotive calls these contingency plans (IATF 16949:2016, clause 6.1.2.3).</p>
        ${G.flag(`<p>The handbook says ISO released the business continuity standard “in 2019” but labels it “ISO 22301:2018”. The correct designation is <b>ISO 22301:2019</b> (Security and resilience — Business continuity management systems — Requirements). The definition quoted is ISO's definition of <b>business continuity</b>: the capability to keep delivering products and services within acceptable time frames at predefined capacity during a disruption.</p>`)}
        ${G.trap(`<p>The handbook's 3 × 3 <b>assignment number</b> = severity × probability (each 1–3). The FMEA <b>RPN</b> = severity × occurrence × detection (each 1–10, range 1–1,000). A stem mentioning detection wants RPN; a stem with two 1–3 ratings wants the assignment number. Mitigation reduces a risk; verification <i>tests</i> that the mitigation works.</p>`)}
        ${G.tab(`<p>p. 110: write both formulas side by side under Fig. 6.2.</p>`)}`
    },
    {
      id: "closure", title: "Project closure", bok: "II.C.8", level: "Apply", pages: "113",
      html: `
        <p><b>Closure is not a negotiation.</b> It is the final step, based on proving the project met its goals and objectives.</p>
        <ol class="steps-v">
          <li><p><b>Review the charter against documented results.</b> The charter set the scope, goals and time frame, so it is the yardstick. Analysis of project measures also proves the intent was met.</p></li>
          <li><p><b>Independent review, if the sponsor wants one</b> — typically an audit approach.</p></li>
          <li><p><b>Complete and store documentation</b> appropriately.</p></li>
          <li><p><b>Hold a closure meeting with the sponsors</b> to agree the project is complete.</p></li>
          <li><p><b>Capture lessons learned</b> and share them. No lessons-learned database? Use the corrective-action database common in ISO 9001-registered companies.</p></li>
        </ol>
        ${G.trap(`<p>Options like “negotiate closure with the sponsor when only some goals were met” or “close once the team agrees it has done enough” contradict the handbook. Closure is proven against the charter, not bargained.</p>`)}`
    }
  ],
  check: [
    { q: "A project network has two paths. Path A–C–E has durations 4, 6 and 5 days; path B–D–E has durations 3, 9 and 5 days (E is shared). What is the project duration and the critical path?",
      o: ["15 days; A–C–E", "27 days; all activities", "17 days; B–D–E", "17 days; A–C–E"], a: 2,
      why: "A–C–E = 15 and B–D–E = 17. The critical path is the longest: 17 days via B–D–E.",
      d: { 0: "Picks the shortest path — the classic reversal.", 1: "Adds every activity, ignoring that the paths run in parallel.", 3: "Right duration, wrong path." }, ref: "133–134" },
    { q: "Which is the best problem statement for a project charter?",
      o: ["“Late shipments are caused by untrained pickers on second shift.”", "“Implement a new WMS to eliminate late shipments.”", "“Shipping performance is poor and must improve quickly.”", "“From January to March, 8.2% of outbound orders shipped after the promised date versus a 2% target, costing about $41K in penalties.”"], a: 3,
      why: "It has baseline data, the gap to target and the impact, with no cause and no solution.",
      d: { 0: "Includes an assumed cause before analysis.", 1: "A solution, not a problem statement.", 2: "No baseline, no measure, no scope." }, ref: "104" },
    { q: "A project aims to cut order cycle time by 25%. Which is the best consequential metric?",
      o: ["Average order cycle time", "Pick accuracy (mis-picks per 1,000 lines)", "Number of orders received per day", "Percentage of project budget spent"], a: 1,
      why: "A consequential metric watches for negative side effects — going faster could raise errors.",
      d: { 0: "That is the primary metric.", 2: "An input volume outside the team's control.", 3: "A project measure (CPI territory), not a consequence of the process change." }, ref: "105–106" },
    { q: "Using the handbook's risk assessment assignment matrix, a risk rated severity 3 and probability 2 receives an assignment number of:",
      o: ["6", "5", "9", "18"], a: 0,
      why: "Assignment number = severity × probability = 3 × 2.",
      d: { 1: "Adds instead of multiplying.", 2: "Uses the maximum cell value, not this risk's ratings.", 3: "Applies an RPN-style third factor that this matrix doesn't have." }, ref: "110" },
    { q: "Which statement about project closure is NOT consistent with the handbook?",
      o: ["Documented results are reviewed against the charter", "The sponsor may ask for an independent audit before closure", "When goals are only partly met, closure terms are negotiated with the sponsor", "Lessons learned can be logged in the corrective-action database"], a: 2,
      why: "Closure is not a negotiation; it rests on proving the goals were met.",
      d: { 0: "Consistent — the charter is the yardstick.", 1: "Consistent — an audit approach is typical.", 3: "Consistent — suggested when no lessons-learned database exists." }, ref: "113" },
    { q: "Which project management approach does the handbook most closely associate with Theory X?",
      o: ["Agile approach", "Top-down management", "Theory Z management", "Situational leadership"], a: 1,
      why: "Top-down: management directs and controls the outcome and all of decision-making — most associated with Theory X.",
      d: { 0: "The handbook links agile to lean thinking, not Theory X.", 2: "Ouchi's Theory Z emphasises consensus and concern for the whole employee.", 3: "Hersey–Blanchard adjust direction and support to follower maturity." }, ref: "103" },
    { q: "In the handbook's ATM example, trying to access a secured account with an invalid or blank password is an example of risk:",
      o: ["Identification", "Mitigation", "Realisation", "Verification"], a: 3,
      why: "Verification tests that the mitigation (PIN plus lockout) actually prevents the risk.",
      d: { 0: "Identification names the risk (improper account access).", 1: "Mitigation is the PIN requirement and lockout itself.", 2: "Realisation means the risk actually occurred." }, ref: "111" },
    { q: "Which tool breaks a project into component tasks until each can be estimated for time and cost, then combines those estimates into a total project cost?",
      o: ["Work breakdown structure", "Gantt chart", "PERT chart", "Toll-gate review"], a: 0,
      why: "The WBS guides task development and provides the structure that summarises project costs.",
      d: { 1: "Displays durations on a calendar; doesn't decompose or roll up cost.", 2: "Shows the network and critical path, not the cost roll-up.", 3: "A phase checkpoint, not a planning decomposition." }, ref: "107" }
  ]
});
