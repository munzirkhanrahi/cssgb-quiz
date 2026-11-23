G.chapter({
  id: "ch15", num: 15, title: "Process and Performance Capability", bok: "III.F", pages: "253–267", drill: 27,
  lede: "All four topics are Evaluate level — the highest in the Measure phase after Create. Expect calculations (Z, Cp, Cpk, Pp, Ppk, percent out of spec) and judgments: which index to use, what to do when the process is stable but not capable, what a Cp–Cpk gap means. Tab the formula page and the normal table together.",
  sections: [
    {
      id: "limits", title: "Natural process limits vs specification limits", bok: "III.F.1", level: "Evaluate", hy: true, pages: "253–256",
      html: `
        <p><b>Natural process limits</b> are calculated from process variation (traditionally x̄ ± 3σ) once special causes are removed and the process is stable — the voice of the process. <b>Specification limits</b> come from engineering or the customer — the voice of the customer. A process is capable when its natural spread sits well inside the specification.</p>
        ${G.w("ctrlspec")}
        <h3>Example: packing weight (p. 255)</h3>
        <p>Specification 1.00–1.10 lb; stable X̄–R chart with subgroups of 4; x̿ = 1.065, R̄ = 0.05.</p>
        ${G.table(["Step", "Working", "Result"], [
          ["σ̂ = R̄ ÷ d₂", "0.05 ÷ 2.059", "0.024 lb"],
          ["Z<sub>U</sub> = (USL − x̄) ÷ σ̂", "0.035 ÷ 0.024", "1.46 → 7.21% overweight"],
          ["Z<sub>L</sub> = (x̄ − LSL) ÷ σ̂", "0.065 ÷ 0.024", "2.70 → 0.35% underweight"],
          ["Natural limits", "1.065 ± 3 × 0.024", "0.993 to 1.137 — wider than the spec, so not capable"]
        ])}
        <p>Software rule violations on the X̄ chart (Figure 15.2) must be investigated and the limits recalculated before they're used. Check the range chart first: variation must be in control before the averages mean anything.</p>
        ${G.trap(`<p>“The parts are all in spec, so the out-of-control points don't matter” is quadrant 3 thinking. An unpredictable process can go out of spec at any time — investigate. And never plot specification limits on an X̄ chart.</p>`)}`
    },
    {
      id: "study", title: "Conducting a process capability study", bok: "III.F.2", level: "Evaluate", pages: "257–260",
      html: `
        <p><b>Which characteristics?</b> Best practice is a process FMEA that identifies the characteristics needing SPC, recorded in a control plan — capability work costs money. Experienced people and customers also name the critical ones. Specifications come from drawings, contracts and service guarantees (“15 minutes or it's free”).</p>
        <ol class="steps-v">
          <li><p><b>Verify the measurement system</b> (MSA) — gage error inflates observed variation.</p></li>
          <li><p><b>Plan rational subgroups</b> — within-subgroup variation smaller than between; typically five consecutive parts at equal intervals (sizes 2–10; above 5 is uncommon). Individuals charts for low volume; X̄–s for subgroups above about 8.</p></li>
          <li><p><b>Establish stability</b> — about 20–30 subgroups with no special causes.</p></li>
          <li><p><b>Check normality</b> using a histogram or probability plot of the <i>individual</i> readings, not the averages. If non-normal, transform (Box-Cox, Johnson) or use a fitted distribution.</p></li>
          <li><p><b>Estimate capability</b> — μ and σ from the control chart.</p></li>
          <li><p><b>Act</b>: center the process first, then reduce variation (the Six Sigma payoff). As containment, a process may be deliberately off-centered toward rework rather than scrap (Figure 15.3: shaft machining, 15.5% over USL, reworkable; 0.14% under LSL). Or revisit an unrealistically tight specification.</p></li>
        </ol>
        ${G.table(["Sampling for SPC", "Use"], [
          ["Random", "Batch processes (oven baking, heat treatment) once a random part is shown to represent the batch; batch-to-batch variation via a moving range"],
          ["Systematic", "Every nth part off a conveyor, or every nth customer — individuals and moving range charts"],
          ["Subgroup", "Consecutive parts at fixed intervals — X̄–R and X̄–s charts"]
        ])}
        ${G.flag(`<p>p. 257 says FMEA and control plans are covered “in Chapter 9”. FMEA is in Chapter 3 and control plans in Chapter 23.</p>`)}
        ${G.trap(`<p>Control charts don't need normal data (the CLT protects X̄ charts); capability indices <b>do</b>, because they convert distances into percentages using the normal curve. Stability comes before capability — an unstable process has no single capability to report.</p>`)}`
    },
    {
      id: "indices", title: "Capability and performance indices", bok: "III.F.3", level: "Evaluate", hy: true, pages: "261–265",
      html: `
        ${G.table(["Index", "Formula", "σ used", "Notes"], [
          ["Cp", "(USL − LSL) ÷ 6σ", "Within (R̄/d₂) — short term", "Potential: ignores centering"],
          ["Cpk", "min(Z<sub>U</sub>, Z<sub>L</sub>) ÷ 3 = min[(USL − x̄), (x̄ − LSL)] ÷ 3σ", "Within", "Actual: uses the nearer limit"],
          ["Cr", "1 ÷ Cp (× 100 for percent)", "Within", "Share of the tolerance used; lower is better"],
          ["Pp", "(USL − LSL) ÷ 6s", "Overall sample s — long term", "Performance, not capability"],
          ["Ppk", "min[(USL − x̄), (x̄ − LSL)] ÷ 3s", "Overall s", "Performance at the nearer limit"],
          ["Cpm", "(USL − LSL) ÷ 6√[s² + (x̄ − T)²]", "Overall s plus distance from target", "When the target isn't the midpoint (fits such as clearance or interference)"]
        ])}
        ${G.w("capcalc")}
        <h3>Reading the numbers</h3>
        <ul>
          <li>Cpk ≤ Cp always; they're equal only when the process is centered.</li>
          <li>Cp doesn't change when you re-center the process; Cpk does.</li>
          <li>Cpk &lt; 0 means the mean is outside a specification limit.</li>
          <li>One-sided specification: report only CPU or CPL.</li>
          <li>Cp = 1 → about 0.27% defective if centered. Customers commonly require 1.33, 1.67 or 2.00 (±4σ, ±5σ, ±6σ inside the specification).</li>
          <li>Cp = 2 with Cpk = 1.5 is the Six Sigma convention. Cp above about 3 suggests a loose specification or a chance to use a cheaper process.</li>
          <li>A high Cpk from a small sample isn't worth much — its confidence interval is wide.</li>
        </ul>
        <p>Examples: packing weight Cp = 0.1 ÷ (6 × 0.024) = 0.69, Cpk = 1.46 ÷ 3 = 0.49, Cr = 1 ÷ 0.69 ≈ 1.45 (145% of the tolerance used; 0.144 ÷ 0.1 = 1.44 before rounding). Weekly-sampled devices, s = 0.004, spec 9.99–10.03, mean 10.014: Pp = 0.04 ÷ 0.024 = 1.667, Ppk = min(2.00, 1.33) = 1.33. Figure 15.6 (target 4.553 between 4.540 and 4.566, mean 4.54289): PPL 0.31, PPU 2.48, Cpm ≈ 0.41, 17.7% expected below the LSL.</p>
        ${G.w("indexpick")}
        ${G.flag(`<p>Two calibration notes. (1) The packing Cpk of 0.49 uses σ rounded to 0.024; unrounded (0.02428) it's 0.48 — expect rounding-level differences between answer options. (2) p. 263 says Pp, Ppk and Cpm “require stability of the process”, but p. 264 reports that AIAG and ANSI recommend Pp and Ppk precisely when the process is <i>not</i> in control (and quotes Montgomery calling them “a waste of engineering and management effort”). The consistent reading: Pp/Ppk describe past performance from overall s; they predict nothing for an unstable process.</p>`)}
        ${G.trap(`<p>Cp vs Pp is <b>which σ</b>, not which formula — within-subgroup (R̄/d₂) vs overall sample s. If a question gives you R̄ and d₂, it's heading for Cp/Cpk; if it gives a sample standard deviation from long-term data, Pp/Ppk.</p>`)}
        ${G.tab(`<p>One tab for p. 261–265: Cp, Cpk, Pp, Ppk, Cpm, Cr side by side, and d₂ for n = 2–5 (1.128, 1.693, 2.059, 2.326). Put the normal table tab right behind it.</p>`)}`
    },
    {
      id: "shift", title: "Short-term vs long-term capability and the 1.5σ shift", bok: "III.F.4", level: "Evaluate", hy: true, pages: "265–267",
      html: `
        <p><b>Short-term</b> capability comes from a stable process over about 20–30 subgroups — one machine, trained operators, homogeneous material, one gage — using σ from the average range (Cp, Cpk). <b>Long-term</b> data include multiple streams, spindles, cavities, operators, gages, and temperature and humidity changes, so the spread is wider; it uses the overall sample s (Pp, Ppk). Both assume normality.</p>
        <p>The mean also moves. The 1.5σ shift convention (attributed to Bill Smith, Motorola) assumes the long-term mean drifts about 1.5σ. A process with ±6σ short-term has 4.5σ to the nearer limit long term: <b>3.4 ppm</b>. A centered ±3σ process has 1,350 ppm beyond each limit (Figure 15.7).</p>
        ${G.w("stlt")}
        ${G.table(["Short-term Z (sigma level)", "Long-term Z", "Long-term ppm (one tail)"], [
          ["3", "1.5", "66,807"],
          ["4", "2.5", "6,210"],
          ["5", "3.5", "233"],
          ["6", "4.5", "3.4"]
        ])}
        ${G.trap(`<p>Sigma level conversions go one way at a time: short-term Z − 1.5 = long-term Z. If you're given long-term data (a DPMO from a year of production), <b>add</b> 1.5 to report the conventional short-term sigma level. And the AIAG advice is to use Pp/Ppk together with Cp/Cpk — the gap between them shows how much is lost to long-term shifts.</p>`)}`
    }
  ],
  check: [
    { q: "A stable process has x̿ = 1.065, R̄ = 0.05 with subgroups of 4 (d₂ = 2.059), and a specification of 1.00 to 1.10. Cpk is closest to:",
      o: ["0.69", "0.90", "1.46", "0.49"], a: 3,
      why: "σ = 0.05 ÷ 2.059 ≈ 0.024; Z<sub>U</sub> = 0.035 ÷ 0.024 = 1.46; Cpk = 1.46 ÷ 3 = 0.49.",
      d: { 0: "That's Cp.", 1: "Z<sub>L</sub> ÷ 3 — the farther limit.", 2: "That's Z<sub>U</sub>, not divided by 3." }, ref: "255–261" },
    { q: "A process is in statistical control but produces 4% out of specification. According to Figure 15.1, the appropriate action is to:",
      o: ["Stop the process and investigate immediately", "Change the process and/or the specification", "Investigate the out-of-control condition", "Take no action — the process is predictable"], a: 1,
      why: "Stable but not meeting spec (quadrant 2): reduce common-cause variation, re-center, or revisit the specification.",
      d: { 0: "Quadrant 4 — out of control and out of spec.", 2: "Quadrant 3 — out of control but in spec.", 3: "Predictably producing 4% scrap is not acceptable." }, ref: "253–254" },
    { q: "Which statement about Cp and Cpk is correct?",
      o: ["Cpk can exceed Cp when the process is off center", "Cp changes when the process mean is moved toward target", "Cp equals Cpk when the process is perfectly centered", "Cpk is calculated from the overall sample standard deviation"], a: 2,
      why: "Cpk measures distance to the nearer limit; when the mean is at the midpoint both limits are equally far, so Cpk = Cp.",
      d: { 0: "Cpk is always ≤ Cp.", 1: "Cp uses only the spread and tolerance.", 3: "That describes Ppk." }, ref: "262–263" },
    { q: "A supplier has no SPC records, but you have 125 measurements from incoming inspection over six months. Which index is most appropriate?",
      o: ["Ppk", "Cpk", "Cp", "Cr"], a: 0,
      why: "Long-term data with an overall sample standard deviation and no evidence of stability call for performance indices.",
      d: { 1: "Cpk needs within-subgroup σ from a stable control chart.", 2: "Cp also needs within-subgroup σ and ignores centering.", 3: "Cr is 1/Cp — same requirement." }, ref: "265" },
    { q: "A shaft-and-hole fit has a target of 10.0 mm with a specification of 7 to 11 mm. Which index directly penalizes the mean's distance from 10.0?",
      o: ["Cp", "Cpk", "Cpm", "Pp"], a: 2,
      why: "Cpm includes (x̄ − T)² in its denominator, so it measures performance against the target rather than the midpoint.",
      d: { 0: "Cp ignores the mean entirely.", 1: "Cpk measures distance to the nearer limit, not to the target.", 3: "Pp ignores the mean." }, ref: "264–265" },
    { q: "Under the 1.5σ shift convention, a process with a short-term sigma level of 6 is expected to produce about:",
      o: ["0.002 ppm", "3.4 ppm", "1,350 ppm", "66,807 ppm"], a: 1,
      why: "6 − 1.5 = 4.5σ to the nearer limit long term; the tail beyond 4.5σ is 3.4 ppm.",
      d: { 0: "That's ±6σ with no shift (both tails).", 2: "That's one tail of a centered ±3σ process.", 3: "That's 3σ short term with the shift." }, ref: "266–267" },
    { q: "Before estimating process capability, which step should come first?",
      o: ["Calculate Cpk from the first 30 parts", "Transform the data to normality", "Set tighter internal specifications", "Verify the measurement system"], a: 3,
      why: "Measurement error inflates observed variation and misleads both stability and capability assessments, so MSA comes first.",
      d: { 0: "Capability needs a stable process and a trusted gage first.", 1: "Transformation is only needed if the data prove non-normal.", 2: "Internal specs are a business choice, not a study step." }, ref: "258" }
  ]
});
