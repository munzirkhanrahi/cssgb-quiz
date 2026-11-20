G.chapter({
  id: "ch1", num: 1, title: "Six Sigma and Organizational Goals", bok: "I.A", pages: "2–31", drill: 24,
  lede: "Why organizations use Six Sigma, who built the ideas behind it, and how a project links to the organization's goals and metrics. Every BoK line here is Understand level: expect recognition and attribution items, plus an expected-profit calculation.",
  sections: [
    {
      id: "value", title: "What Six Sigma is, and why it succeeds or fails", bok: "I.A.1", level: "Understand", hy: true, pages: "2–8",
      html: `
        <p>Every organization needs income to survive, so the first “formula” a Green Belt learns is the bottom line — the handbook's <b>$-double bar</b>, often tied to cost of quality. Six Sigma's real power is combining proven methods with management focus and standard accounting that shows the impact on the bottom line.</p>
        ${G.table(["View of Six Sigma", "What it means"], [
          ["Philosophy", "All work is a process that can be defined, measured, analyzed, improved and controlled; control the inputs and you control the outputs: <b>y = f(x)</b>"],
          ["Set of tools", "The qualitative and quantitative techniques (SPC, control charts, FMEA, process mapping…); little agreement on exactly which"],
          ["Methodology", "The DMAIC road map — the most widely adopted, though not the only one"],
          ["Metrics", "<b>3.4 defects per million opportunities</b>, allowing for a 1.5σ shift in the mean"]
        ])}
        <div class="grid2">
          <div class="card"><h4>Why deployments fail</h4><p>Most common: <b>management's lack of commitment</b> to real process improvement. Next: training too many Black Belts too early, before the organization knows how to deploy them. Consultants leave and nobody inside can carry on.</p></div>
          <div class="card"><h4>What works</h4><p>Learning the tools takes about <b>two years</b>. Start by training Green Belts on small projects, have managers learn the tools, and engage <b>accounting early</b> so savings can be substantiated. Use advanced quality planning (AQP) to prepare the deployment.</p></div>
        </div>
        <p><b>History:</b> Motorola promoted Six Sigma in the late 1980s and won the Baldrige award in 1988; GE made it a driving force in the mid-to-late 1990s. Motorola's salespeople once described a Six Sigma process to Ford as ±3σ (Cp = 1.0), below Ford's requirement (Cpk ≥ 1.33 ongoing, ≥ 1.67 at startup) — inside Motorola it actually meant ±6σ. Today Six Sigma means <b>Cp = 2.0, with Cpk = 1.5</b> once the 1.5σ shift is allowed for.</p>
        <p>Six Sigma reduces variation and improves process control; lean drives out waste and promotes standard work and value stream mapping. Green Belts should know both (“Lean Six Sigma”).</p>
        ${G.trap(`<p><b>sigma</b> (σ) is the statistic — the standard deviation of a process around its mean. <b>Six Sigma</b> is the problem-solving methodology. And the 3.4 DPMO figure already includes the 1.5σ shift; a perfectly centred ±6σ process would give about 0.002 ppm.</p>`)}
        ${G.flag(`<p>p. 7: the capability symbols are garbled in the scan (“C, = 2.0 and C,, &lt; 1.5”). Read: a Six Sigma process has <b>Cp = 2.0</b>; with the 1.5σ shift, <b>Cpk = 1.5</b>.</p>`, "Scan check")}`
    },
    {
      id: "pioneers", title: "Quality pioneers and the lead-up to Six Sigma", bok: "I.A.1", level: "Understand", hy: true, pages: "4–15",
      html: `
        <p>The BoK names Juran, Deming, Shewhart and Ishikawa “and others”. Attribution questions are pure recall, which is why the table is worth tabbing.</p>
        ${G.table(["Pioneer", "Remember them for"], [
          ["Walter Shewhart", "Control charts (1924 memo; the p-chart came first); father of statistical quality control; originator of PDCA per Deming"],
          ["W. Edwards Deming", "Fourteen Points; Seven Deadly Diseases; system of profound knowledge; red bead experiment; PDSA; Japan's reconstruction (Deming Prize, 1950)"],
          ["Joseph Juran", "Trilogy — quality planning, control, improvement; Pareto principle (“vital few, trivial many”); Juran Institute (1979)"],
          ["Kaoru Ishikawa", "Cause-and-effect diagram; quality circles; “the next process is your customer”"],
          ["Armand Feigenbaum", "Total quality control (1951); the hidden plant; quality costs; quality planning → AQP; three steps: leadership, technology, commitment"],
          ["Philip Crosby", "Zero defects; <i>Quality Is Free</i>; fourteen steps to quality improvement"],
          ["Genichi Taguchi", "Loss function (any departure from target is a loss to society); robust design; orthogonal arrays and outer arrays"],
          ["Dorian Shainin", "Red X; “talk to the parts”; component search; pre-control"],
          ["D. H. Stamatis", "FMEA from theory to practice"],
          ["Subir Chowdhury", "“Quality prophet”; DFSS-focused management books; LEO (listen, enrich, optimize)"]
        ])}
        ${G.w("pioneers")}
        <h3>Approaches to quality over the years (Table 1.1)</h3>
        <p class="small">Quality circles (1979–81) · SPC (mid-1980s) · ISO 9000 (1987–) · benchmarking (1988–96) · Baldrige criteria (1987–) · balanced scorecard (1990s–) · reengineering (1996–97) · Six Sigma (1995–) · lean manufacturing (2000–). The dates are approximate popularity windows, not inventions.</p>
        ${G.trap(`<p><b>Fourteen</b> appears twice: Deming's <b>Fourteen Points</b> (management principles, e.g. “drive out fear”, “cease dependence on inspection”) and Crosby's <b>fourteen steps</b> (a program, e.g. “hold a zero defects day”). PDCA is Shewhart's; PDSA is Deming's update.</p>`)}
        ${G.flag(`<ul>
          <li><b>p. 6, Baldrige:</b> the handbook lists five categories with up to two awards each. Since 2007 there are <b>six</b> (nonprofit was added), with up to three awards per category (NIST).</li>
          <li><b>p. 12, Feigenbaum:</b> his 1951 book was titled <i>Quality Control: Principles, Practice, and Administration</i>; later editions carry the title <i>Total Quality Control</i> (ASQ). For the exam, Feigenbaum = total quality control.</li>
          <li><b>p. 14 vs p. 389, pre-control:</b> Chapter 1 credits Shainin and Chapter 22 credits Rath &amp; Strong. Both hold — it came out of Rath &amp; Strong in the 1950s, where Shainin worked.</li>
        </ul>`, "Calibration notes")}
        ${G.tab(`<p>pp. 9–15: tab the pioneer pages and write each person's one-line signature in the margin.</p>`)}`
    },
    {
      id: "dmaic", title: "DMAIC, the road map and a Green Belt's role", bok: "I.A.1", level: "Understand", pages: "15–23",
      html: `
        ${G.table(["Phase", "In the handbook's words (p. 21)"], [
          ["Define", "Identify the issue causing decreased customer satisfaction"],
          ["Measure", "Collect data from the process"],
          ["Analyze", "Study the process and data for clues to what is going on"],
          ["Improve", "Take action, based on the analysis, to change the process"],
          ["Control", "Monitor the system to sustain the gains"]
        ])}
        <p>DMAIC grew from the earlier <b>MAIC</b> model (“magic without the garbage”), with Define added to identify the process customers. It is very similar to PDSA/PDCA. Management commitment runs through every phase: <b>PDCA</b> in Define and Measure, <b>PDSA</b> in Analyze and Improve, <b>SDCA</b> in Control.</p>
        ${G.w("dmaictools")}
        <div class="grid2">
          <div class="card"><h4>Ishikawa's road map (pp. 20–21)</h4><ol class="small"><li>Determine the assurance unit (what to measure)</li><li>Determine the measuring method</li><li>Determine the relative importance of quality characteristics</li><li>Reach consensus on defects and flaws</li><li>Expose latent defects</li><li>Observe quality statistically</li><li>Distinguish quality of design from quality of conformance</li></ol></div>
          <div class="card"><h4>The Six Sigma road map (p. 23)</h4><ol class="small"><li>Recognize that variation exists; standardize your work</li><li>Identify what the customer wants; reduce variation</li><li>Use a problem-solving method to plan improvements</li><li>Follow DMAIC to deploy them</li><li>Monitor with process behavior charts</li><li>Update SOPs and lessons learned</li><li>Celebrate successes</li><li>Start over — PDSA/SDCA</li></ol></div>
        </div>
        ${G.trap(`<p>Quality of <b>conformance</b> is what DMAIC can change now; quality of <b>design</b> is left to DFSS (Chapter 3). The Six Sigma model should not replace existing control plans or SOPs — it is used to review daily work.</p>`)}`
    },
    {
      id: "coq", title: "Cost of quality as a cost–benefit tool", bok: "I.A.1", level: "Understand", pages: "24–25",
      html: `
        <p>Classify quality-related spending into <b>prevention, appraisal, internal failure and external failure</b> (Chapter 8 has the details). The power of the tool is the <b>trend over time</b>, not exact classification, and the first measurement is a benchmark, not a reason to blame anyone. Only costs related to products or services shipped to customers are included.</p>
        ${G.w("coqcurve")}
        <p>Investing in prevention (and appraisal) may raise total cost at first; failure costs then fall slowly — it can take years as old product works its way out of the field. The goal is a total cost of quality lower than when you started.</p>
        ${G.flag(`<p>p. 24 says “by focusing on <b>reducing</b> prevention and appraisal costs, initial overall cost may rise; however, failure costs … will slowly start to come down.” The logic only works the other way: <b>increase</b> prevention spending, total cost may rise at first, then failure costs fall.</p>`)}`
    },
    {
      id: "systems", title: "Processes, systems, inputs and feedback", bok: "I.A.2", level: "Understand", pages: "15–19, 26–29",
      html: `
        <p>A <b>process</b> is a series of steps that produces products or services. A <b>business system</b> implements a set of processes, makes sure inputs are in the right place at the right time, and is responsible for collecting and analyzing data for continual improvement.</p>
        <div class="formula">Systems → processes → subprocesses → steps</div>
        <p>Each step is the customer of the previous step and the supplier to the next; the value to the enterprise lies in the quality of these inputs and outputs. Data about inputs and outputs feed back for adjustment (a control chart is the classic real-time loop) or for improvement plans (designed experiments when a stable process is incapable).</p>
        <p><b>Inputs to a process step (Fig. 1.4):</b> man, machine, methods, Mother Nature, management, materials, measurement system — classify each as <b>controllable (C)</b> or <b>noncontrollable (NC)</b>. Add suppliers and customers to input–process–output and you have SIPOC, used to set the boundaries of a study.</p>
        <h3>Systems thinking and suboptimization</h3>
        <p>Operating a system at less than its best is <b>suboptimization</b>: a change can optimize one process and hurt the whole. Examples: money spent on process A that would earn more in process B; raising a process's throughput far beyond what the next process can take; a distribution center loading trucks to minimize its own work while the receiving organization spends more unloading.</p>
        ${G.trap(`<p>The ASQ-style item asks for the subparts of a process flowchart: <b>systems, processes, subprocesses, steps</b>. Lists of SIPOC words (customers, inputs, outputs, suppliers) are the distractors.</p>`)}`
    },
    {
      id: "goals", title: "Linking projects to organizational goals", bok: "I.A.2", level: "Understand", hy: true, pages: "25–29",
      html: `
        <p>Goals must be consistent with long-term strategy. <b>Hoshin planning</b>: a company develops up to four vision statements of where it should be in five years, builds goals and work plans from them, and audits progress periodically.</p>
        <p>Once projects succeed there are more ideas than capacity, so a <b>project selection group</b> — Master Black Belts, Black Belts, champions and key executives — sets criteria, assigns Six Sigma projects (heavy data analysis, DOE) or lean projects (no such analysis), and sends new-product design to DFSS. Criteria usually convert to financial terms; other things equal, the biggest bottom-line contribution wins.</p>
        <div class="formula">Expected profit = Σ (profit × probability)</div>
        ${G.w("exprofit")}
        <p>Estimate the probabilities with a <b>SWOT</b> analysis (strengths, weaknesses, opportunities, threats).</p>
        <h3>SMART goals (new in the 2022 BoK)</h3>
        <p>Specific, Measurable, Attainable (Achievable), Relevant, Time-bound. Set them early: they bound the project, prevent scope creep and give targets for tollgate reviews.</p>
        ${G.w("smart")}
        ${G.trap(`<p>The probabilities must cover every outcome exactly once and add to 1. Wrong answers average the profits, ignore the loss case, or quote the best case alone.</p>`)}
        ${G.tab(`<p>pp. 26–27: box EP = Σ profit × probability next to Table 1.2.</p>`)}`
    },
    {
      id: "drivers", title: "Key drivers, scorecards and KPIs", bok: "I.A.3", level: "Understand", pages: "29–31",
      html: `
        <p>Measures should come from business needs and strategy and give critical information on key processes and results. Key drivers include customer, product, service, operational, market, competitive, supplier, workforce, cost, financial, governance and compliance performance — the BoK names profit, market share, customer satisfaction, efficiency, product differentiation and KPIs.</p>
        <p><b>Voice of the customer</b> captures stated, unstated and anticipated requirements (surveys, focus groups, web data, warranty data, complaint logs) to build loyalty and retention.</p>
        <div class="grid2">
          <div class="card"><h4>Balanced scorecard</h4><p>Kaplan and Norton, early 1990s. Financial and nonfinancial, <b>lagging and leading</b> measures across four perspectives: <b>financial, customer, internal processes, employee learning and growth</b>. A management system, not just a measurement system.</p></div>
          <div class="card"><h4>Dashboard</h4><p>A real-time visual of company performance. Three steps to build one: know industry averages and benchmarks; know your own history on them; develop a balanced scorecard covering the whole company.</p></div>
        </div>
        ${G.w("bscsort")}
        ${G.w("leadlag")}
        <p><b>KPI</b> (key process / performance indicator): a <b>quantifiable measurement, agreed beforehand, that reflects the critical success factors</b> of a department or group. The challenge is picking the few that matter from all the data collected.</p>
        ${G.trap(`<p><b>Lagging</b> = measured at the end of an event (profit, warranty claims). <b>Leading</b> = measured upstream, helping achieve the objective (training completed, PM on schedule). Most scorecard metrics come from brainstorming, which rarely balances the two.</p>`)}`
    }
  ],
  check: [
    { q: "A company develops up to four vision statements describing where it should be in five years, then builds its goals and work plans from them and audits progress. This approach is:",
      o: ["SMART goals", "Hoshin planning", "A balanced scorecard", "Advanced quality planning"], a: 1,
      why: "Hoshin planning links company goals and work plans to long-term strategy through vision statements.",
      d: { 0: "SMART describes how to write an individual goal.", 2: "A scorecard measures results across four perspectives.", 3: "AQP prepares a deployment or product launch." }, ref: "25–26" },
    { q: "A project's net outcomes are: full success +$3M (probability .5), partial success +$1M (.3) and failure −$1M (.2). What is the expected profit?",
      o: ["$1.6M", "$3.0M", "$1.8M", "$1.0M"], a: 0,
      why: "EP = 3(.5) + 1(.3) − 1(.2) = 1.5 + 0.3 − 0.2 = $1.6M.",
      d: { 1: "The best case alone.", 2: "Leaves out the failure term.", 3: "Averages the three profits, ignoring probabilities." }, ref: "26–27" },
    { q: "Which pioneer described managing for quality as a trilogy of quality planning, quality control and quality improvement?",
      o: ["Deming", "Feigenbaum", "Crosby", "Juran"], a: 3,
      why: "The Juran trilogy.",
      d: { 0: "Deming: Fourteen Points, profound knowledge.", 1: "Feigenbaum: total quality control; three steps of leadership, technology, commitment.", 2: "Crosby: zero defects and fourteen steps." }, ref: "13–14" },
    { q: "Deming credited which person as the originator of the plan-do-check-act cycle?",
      o: ["Ishikawa", "Juran", "Shewhart", "Taguchi"], a: 2,
      why: "Shewhart; Deming later changed it to plan-do-study-act.",
      d: { 0: "Ishikawa: fishbone diagram, quality circles.", 1: "Juran: trilogy, Pareto principle.", 3: "Taguchi: loss function, robust design." }, ref: "15" },
    { q: "Which is NOT one of the four balanced scorecard perspectives?",
      o: ["Financial", "Supplier", "Customer", "Learning and growth"], a: 1,
      why: "The four are financial, customer, internal processes and employee learning and growth.",
      d: { 0: "One of the four.", 2: "One of the four.", 3: "One of the four." }, ref: "30" },
    { q: "A distribution center changes how it loads trucks, cutting its own labor, but its customers' docks now need more time and money to unload. This is an example of:",
      o: ["Suboptimization", "Hoshin planning", "Kaizen", "A value-added activity"], a: 0,
      why: "Optimizing one process at the expense of the whole system is suboptimization — the handbook's own example.",
      d: { 1: "Hoshin links goals to strategy.", 2: "Kaizen is incremental improvement; here the system got worse.", 3: "The receiving work added is non-value-added." }, ref: "29" },
    { q: "In the modern view of quality costs, total cost of quality is lowest:",
      o: ["Where conformance and nonconformance costs are equal", "Where prevention spending is zero", "Short of 100% good, where more prevention costs more than it saves", "At 100% good product"], a: 3,
      why: "Figure 1.6: total cost keeps falling as quality approaches 100%.",
      d: { 0: "Equal costs is not what defines the minimum.", 1: "Cutting prevention drives failure costs up.", 2: "That is the traditional view (Figure 1.5)." }, ref: "24–25" },
    { q: "In simple terms, Six Sigma quality performance means:",
      o: ["0.002 defects per million opportunities", "A Cpk of 1.33", "3.4 defects per million opportunities, allowing for a 1.5σ shift", "99.73% of output within specification"], a: 2,
      why: "The metrics view of Six Sigma: 3.4 DPMO, which assumes the mean shifts 1.5σ.",
      d: { 0: "A perfectly centred ±6σ process, with no shift.", 1: "Ford's ongoing-process requirement, about 4σ.", 3: "±3σ coverage." }, ref: "8" }
  ]
});
