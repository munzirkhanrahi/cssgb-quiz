G.chapter({
  id: "ch22", num: 22, title: "Statistical Process Control", bok: "VI.A", pages: "388–426", drill: 30,
  lede: "The heart of the Control phase. SPC basics are tested at Analyze level — reading patterns and separating common from special causes — and chart construction at Apply level. Tab the constants table and the limit formulas.",
  sections: [
    {
      id: "basics", title: "SPC basics, objectives and errors", bok: "VI.A.1", level: "Analyze", pages: "388–391",
      html: `
        ${G.table(["Term", "Meaning"], [
          ["Control process", "A feedback loop: measure actual performance, compare it with a standard, act on the difference"],
          ["Statistical process control (SPC)", "Statistical techniques to measure, analyze and reduce process variation"],
          ["Statistical quality control (SQC)", "Statistical techniques to measure and improve the quality of processes"],
          ["Statistical process display (SPD)", "Charts kept for show (often for a customer) rather than to run the process"]
        ])}
        <p>Walter Shewhart (Bell Telephone Laboratories, 1920s) separated <b>inherent (random)</b> variation from <b>intermittent (assignable)</b> variation. SPC's objectives include monitoring in real time, telling whether the process has changed, deciding when — and when not — to act, centring the process, reducing variation and confirming that changes worked. Pre-control (Rath and Strong for IBM, 1953) needs no charting: a pair of readings in the caution zones, or either outside tolerance, triggers adjustment.</p>
        ${G.table(["Error", "On a control chart", "Consequence"], [
          ["Type I (α)", "Treating common-cause noise as a special cause — a false alarm", "Over-adjustment (tampering) — more variation"],
          ["Type II (β)", "Failing to act on a real special cause", "Under-adjustment — the problem keeps adding variation"]
        ])}
        ${G.w("tamper")}
        ${G.w("errors")}
        ${G.flag(`<p>p. 425 calls a false signal — accepting that the process changed when it is actually in control — a “type II error (producer's risk)”. That is a <b>Type I error</b> (α, producer's risk), exactly as p. 390 defines it. Type II (β, consumer's risk) is missing a real change. Also, p. 389's hypothesis definition has its examples reversed: rejecting the null hypothesis means concluding there <i>has</i> been a significant change.</p>`)}`
    },
    {
      id: "causes", title: "Common vs special causes; control vs specification limits", bok: "VI.A.1", level: "Analyze", hy: true, pages: "391–398",
      html: `
        <div class="grid2">
          <div class="card"><h4>Common cause (chance, natural)</h4><p>Inherent to the process; many small sources; generally not controllable by the operator. Predictable by location, spread and shape. Reducing it means changing the process itself — usually a management action.</p></div>
          <div class="card"><h4>Special cause (assignable)</h4><p>Unusual events the operator, once alerted, can usually remove or adjust. Until special causes are removed, output is unpredictable.</p></div>
        </div>
        <p>A process is <b>in statistical control</b> when only common causes remain. That does <b>not</b> mean it meets specifications — and an out-of-control process can still produce conforming product.</p>
        ${G.table(["", "Control limits", "Specification limits"], [
          ["Source", "Calculated from process data (±3σ of the plotted statistic)", "Set by the customer or engineering"],
          ["Voice of", "The process", "The customer"],
          ["Answers", "Is the process stable?", "Is the product acceptable?"],
          ["Plotted with", "Subgroup statistics (X̄, R, p…)", "Individual measurements (capability study)"]
        ], { rowHead: true })}
        ${G.w("causesort")}
        ${G.trap(`<p>Never draw specification limits on an X̄ chart — averages vary less than individuals, so the comparison is meaningless. And “in control” never means “capable”.</p>`)}`
    },
    {
      id: "subgroup", title: "Rational subgrouping", bok: "VI.A.2", level: "Understand", hy: true, pages: "399–402",
      html: `
        <p>Choose subgroups so units <b>within</b> a subgroup are as alike as possible (only common cause) and differences show up <b>between</b> subgroups. Then the R chart captures common-cause variation and the X̄ chart catches shifts.</p>
        <ul>
          <li>Take consecutive parts from the same process stream; take the next subgroup some time later.</li>
          <li>Smaller, more frequent subgroups beat one large one (five of five rather than one of 25).</li>
          <li>Variables charts: small subgroups, typically 4–5 (the handbook cites 2–5, 4–6 and 4–10 in different places). Attributes charts: 50–200.</li>
          <li>Aim for about 25 subgroups (100+ readings) before trusting the limits; keep subgroup size constant.</li>
        </ul>
        ${G.w("subgroup")}
        ${G.trap(`<p>Mixing streams (spindles, cavities, operators) inside a subgroup inflates R̄, widens the limits and makes the chart hug the centre line — the AIAG “over 90% in the middle third” signal. The fix is better subgrouping, not tighter limits.</p>`)}
        ${G.tab(`<p>p. 400: write “within = alike (common cause), between = shifts show” beside the method list.</p>`)}`
    },
    {
      id: "select", title: "Choosing the right control chart", bok: "VI.A.3", level: "Apply", hy: true, pages: "394, 402–417",
      html: `
        ${G.table(["Data", "What you count or measure", "Sample size", "Chart"], [
          ["Variables", "Measurements, n = 1", "—", "I–MR (XmR)"],
          ["Variables", "Measurements in small subgroups", "constant", "X̄–R (or median)"],
          ["Variables", "Measurements in larger subgroups / s available", "constant", "X̄–s"],
          ["Attributes", "Defectives (unit passes or fails) — binomial", "varies", "p"],
          ["Attributes", "Defectives — binomial", "constant", "np (or p)"],
          ["Attributes", "Defects (flaws, several per unit) — Poisson", "constant", "c"],
          ["Attributes", "Defects — Poisson", "varies", "u"]
        ])}
        ${G.w("chartpick")}
        ${G.w("chartsort")}
        ${G.trap(`<p><b>Defective</b> describes a unit; <b>defect</b> describes a flaw. p and np count defective units; c and u count defects. “n” in np or “u per unit” hints at the answer. Variables charts are more sensitive than attributes charts and need far smaller subgroups.</p>`)}
        ${G.tab(`<p>Copy the table above onto a tab card. Selection questions are quick points if you can see it at a glance.</p>`)}`
    },
    {
      id: "limits", title: "Calculating control limits", bok: "VI.A.3", level: "Apply", hy: true, pages: "403–417, Appendices D–E",
      html: `
        <div class="grid2">
          <div class="fcell"><h4>X̄–R</h4><div class="formula">X̿ ± A₂R̄</div><p>R chart: UCL = D₄R̄, LCL = D₃R̄</p></div>
          <div class="fcell"><h4>X̄–s</h4><div class="formula">X̿ ± A₃s̄</div><p>s chart: UCL = B₄s̄, LCL = B₃s̄</p></div>
          <div class="fcell"><h4>I–MR</h4><div class="formula">X̄ ± 2.660 MR̄</div><p>MR chart: UCL = 3.267 MR̄ (n = 2 constants)</p></div>
          <div class="fcell"><h4>Median</h4><div class="formula">X̃̄ ± Ã₂R̄</div><p>Range limits as for X̄–R</p></div>
          <div class="fcell"><h4>p</h4><div class="formula">p̄ ± 3√(p̄(1−p̄)/n̄)</div><p>p̄ = Σdefectives ÷ Σn</p></div>
          <div class="fcell"><h4>np</h4><div class="formula">np̄ ± 3√(np̄(1−p̄))</div><p>Constant n</p></div>
          <div class="fcell"><h4>c</h4><div class="formula">c̄ ± 3√c̄</div><p>Constant area of opportunity</p></div>
          <div class="fcell"><h4>u</h4><div class="formula">ū ± 3√(ū/n̄)</div><p>ū = Σdefects ÷ Σn</p></div>
        </div>
        <p class="small">When a lower limit comes out negative, there is no LCL. With varying sample sizes the handbook uses the average n; AIAG recommends recalculating limits for any sample more than 25% above or below it.</p>
        ${G.w("limits")}
        ${G.w("constants")}
        ${G.flag(`<p>The median-chart example (p. 409) uses 1.880 as Ã₂ with three readings per sample. 1.880 is the n = 2 value; for n = 3, <b>Ã₂ = 1.187</b>. With X̃̄ = 7.125 and R̄ = .0036 the limits are about 7.129 and 7.121, not 7.132. The D₄ of 2.574 in the same example is correct for n = 3.</p>`)}
        ${G.tab(`<p>Tab Appendix E (constants) and Appendix D (formulas) next to this chapter — every limit calculation needs both.</p>`)}`
    },
    {
      id: "rules", title: "Reading the chart: run rules and patterns", bok: "VI.A.1", level: "Analyze", hy: true, pages: "418–426",
      html: `
        <p>A point beyond ±3σ is a strong signal (with a normal distribution, the limits enclose about 99.73% of points). Run rules add sensitivity to shifts and patterns that stay inside the limits. Analyze the <b>range chart first</b>, then the averages; keep a process log so signals can be matched to changes.</p>
        ${G.table(["Signal", "Minitab (8 tests)", "AIAG (6 rules)", "Handbook's own list (p. 418)"], [
          ["Point outside limits", "1 point beyond 3σ", "Points beyond the limits", "Any point above UCL or below LCL"],
          ["Run on one side", "9 in a row", "7 in a row", "7 or more in a row"],
          ["Trend", "6 in a row up or down", "7 in a row up or down", "5 or more up or down, or a drift of 7+"],
          ["Zone tests", "2 of 3 beyond 2σ; 4 of 5 beyond 1σ (same side)", "—", "More than 1 in 20 in the outer third"],
          ["Too little variation", "15 in a row within 1σ", "Over 90% in middle third (25+ subgroups)", "Lack of variability: limits too loose or measurement issue"],
          ["Too much spread / mixture", "8 in a row beyond 1σ either side", "Under 40% in middle third", "—"],
          ["Oscillation / cycles", "14 in a row alternating", "Obvious non-random patterns", "Recurring cycles"]
        ])}
        ${G.w("rules")}
        <ul class="small">
          <li><b>Trends</b> — equipment wear; fix with repair, rotation or replacement.</li>
          <li><b>Jumps</b> — abrupt change in material, method or performance.</li>
          <li><b>Recurring cycles</b> — wear and fatigue.</li>
          <li><b>Points near or outside limits</b> — over-adjustment or material variation.</li>
          <li>Exclude points with confirmed special causes when recalculating limits; a run of favourable points is an improvement worth investigating and keeping.</li>
        </ul>
        ${G.flag(`<p>The handbook gives three different sets of run rules, and p. 418 says limits enclose “99.72%” (it is 99.73%). On the exam, use the rule set the question names; if none is named, the 7-in-a-row and point-beyond-limits rules are the safest common ground.</p>`, "Calibration note")}
        ${G.tab(`<p>pp. 419–424: tab the Minitab and AIAG lists and the pattern figures.</p>`)}`
    }
  ],
  check: [
    { q: "A glass plant counts the defects on each pane inspected. The number of panes inspected varies from day to day. Which chart fits?",
      o: ["p chart", "c chart", "u chart", "np chart"], a: 2,
      why: "Defects (not defectives) with a varying sample size → u chart.",
      d: { 0: "p tracks the proportion of defective units.", 1: "c needs a constant sample size.", 3: "np tracks defective units with a constant n." }, ref: "415" },
    { q: "An X̄–R chart has X̿ = 50.0, R̄ = 4.0 and subgroups of n = 5 (A₂ = 0.577, D₄ = 2.114). What are the X̄ chart's control limits?",
      o: ["47.69 to 52.31", "45.77 to 54.23", "38.0 to 62.0", "41.54 to 58.46"], a: 0,
      why: "50.0 ± 0.577 × 4.0 = 50.0 ± 2.31 → 47.69 to 52.31.",
      d: { 1: "Uses D₄ × R̄ (8.46) ÷ 2 as the half-width — mixes up the charts.", 2: "Uses ±3R̄ directly.", 3: "Uses D₄ × R̄ (8.46) as the half-width." }, ref: "404" },
    { q: "For an individuals and moving range chart, which subgroup size's constants are used?",
      o: ["n = 1", "n = 4", "The number of individual readings collected", "n = 2"], a: 3,
      why: "Each moving range compares two consecutive points, so the n = 2 constants apply (E₂ = 2.660, D₄ = 3.267).",
      d: { 0: "No constants exist for n = 1.", 1: "Only for X̄–R with subgroups of four.", 2: "The count of points does not set the constants." }, ref: "408–409" },
    { q: "A rational subgroup should be chosen so that:",
      o: ["Variation within subgroups is as large as possible", "Each subgroup contains one part from every stream", "Units within a subgroup are as alike as possible, so shifts appear between subgroups", "Subgroup size changes each time to keep the chart sensitive"], a: 2,
      why: "Within-subgroup variation should be common cause only; process changes then show up between subgroups.",
      d: { 0: "The opposite of the goal.", 1: "Mixing streams inflates the range and hides stream differences.", 3: "Subgroup size should be held constant." }, ref: "400–401" },
    { q: "An operator adjusts a stable process after every point that is not exactly on target. The most likely result is:",
      o: ["Variation decreases because errors are corrected quickly", "Variation increases because common-cause variation is treated as special cause", "The process becomes more capable", "Nothing changes because adjustments cancel out"], a: 1,
      why: "Tampering (over-adjustment) adds variation — a Type I error in action.",
      d: { 0: "The intuition the handbook warns against.", 2: "Capability worsens as variation grows.", 3: "Adjustments compound rather than cancel." }, ref: "390–391, 418" },
    { q: "A process is in a state of statistical control. Which statement is correct?",
      o: ["All output meets specifications", "Only common causes of variation are present", "Cp is at least 1.33", "No further improvement is possible"], a: 1,
      why: "Statistical control means only random (common) causes remain; it says nothing about meeting specifications.",
      d: { 0: "Control is not capability.", 2: "Capability is a separate assessment.", 3: "Common-cause variation can still be reduced by changing the process." }, ref: "391, 395" },
    { q: "Under the AIAG rules, which of the following is a signal of a special cause?",
      o: ["Five points in a row above the centre line", "Two points in a row near the centre line", "Seven points in a row on one side of the average", "One point between 1σ and 2σ"], a: 2,
      why: "AIAG flags seven consecutive points on one side of the average.",
      d: { 0: "Too short for any of the listed rules.", 1: "Not a signal.", 3: "A single point inside 2σ is normal." }, ref: "419" },
    { q: "A p chart calculation gives an LCL of −0.012. What should be done?",
      o: ["Plot the LCL at −0.012", "Use zero as a lower limit that can be breached", "Switch to a u chart", "Use no lower control limit"], a: 3,
      why: "When the LCL formula gives a negative number, no LCL is used.",
      d: { 0: "A proportion cannot be negative.", 1: "The handbook says no LCL is used.", 2: "The chart type depends on the data, not on the LCL." }, ref: "411" },
    { q: "On an X̄ chart built from 30 subgroups, 97% of points fall in the middle third of the limits. The most likely explanation is:",
      o: ["Subgroups mix several process streams, or the limits are too loose", "The process has improved and the limits should be tightened at once", "The process is perfectly in control and nothing should be done", "The measurement system is too precise"], a: 0,
      why: "Too little variation between the limits signals stratification or loose limits (or a measurement issue) — a rule violation, not a cause for celebration.",
      d: { 1: "Investigate first; do not move limits without a confirmed change.", 2: "Over 90% in the middle third is an AIAG signal.", 3: "A precise gauge would not cause points to hug the centre." }, ref: "419, 424" }
  ]
});
