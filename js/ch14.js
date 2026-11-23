G.chapter({
  id: "ch14", num: 14, title: "Measurement System Analysis", bok: "III.E", pages: "233–252", drill: 27,
  lede: "Evaluate level: you'll be handed GR&R output and asked whether the gage is good enough, which component dominates, and what to do next. Tab the AIAG worksheet (Figures 14.5–14.6) with its K-constants and the acceptance criteria.",
  sections: [
    {
      id: "terms", title: "Sources of measurement variation", bok: "III.E", level: "Evaluate", hy: true, pages: "233–234",
      html: `
        <p>All process data are filtered through the measurement system, so it should be one of the first things analyzed — measurement error of 40–50% of the specification is not unusual. Many SPC programs now start with an MSA.</p>
        ${G.table(["Term", "Meaning"], [
          ["Accuracy", "Closeness to the true or accepted reference value"],
          ["Precision", "Closeness of repeated readings to each other — the random component"],
          ["Bias", "Average reading minus the reference (master) value"],
          ["Linearity", "How bias changes across the operating range"],
          ["Stability", "Drift in bias over time"],
          ["Calibration", "Drift in average readings of an absolute value; corrected against a standard"],
          ["Repeatability (EV, equipment variation)", "One appraiser, same gage, same part, same setting, short time — the gage's own precision"],
          ["Reproducibility (AV, appraiser variation)", "Variation between the averages of two or more appraisers — setup, training, skill, technique"],
          ["Discrimination (resolution)", "The smallest change the gage can detect — reported as a number of distinct categories (ndc)"]
        ])}
        ${G.w("msaterms")}
        ${G.trap(`<p>Accuracy (bias) and precision (repeatability and reproducibility) are independent: a gage can be precise but biased, or unbiased but imprecise. Calibration fixes bias; it does nothing for repeatability.</p>`)}`
    },
    {
      id: "grr", title: "Running and calculating a GR&R study", bok: "III.E", level: "Evaluate", hy: true, pages: "234–241",
      html: `
        <h3>Conducting the study</h3>
        <ol class="steps-v">
          <li><p><b>Plan</b>: equipment calibrated, the regular appraisers available and trained, samples in good condition.</p></li>
          <li><p><b>Select samples that cover the process spread</b> (for process control even beyond the specification limits) — handpicked, not random from the bin. Identify them where appraisers can't see the number.</p></li>
          <li><p><b>Randomize</b> the run order between trials and appraisers (Table 14.1: 10 parts × 3 appraisers × 3 trials).</p></li>
          <li><p>Every appraiser measures every part on every trial — an incomplete study unbalances the calculation.</p></li>
          <li><p>Enter the data on the AIAG sheet and calculate.</p></li>
        </ol>
        <h3>The average-and-range calculation</h3>
        ${G.table(["Quantity", "Formula", "Handbook example"], [
          ["R̿", "Average of the appraisers' average ranges", "(0.184 + 0.513 + 0.328) ÷ 3 = 0.3417"],
          ["UCL<sub>R</sub>", "D₄ × R̿ (D₄ = 3.27 for 2 trials, 2.58 for 3)", "0.3417 × 2.58 = 0.8816 — appraiser B, part 4 (1.02) is out"],
          ["X̄<sub>DIFF</sub>", "Largest − smallest appraiser average", "0.1903 − (−0.2543) = 0.4446"],
          ["Rp", "Range of the part averages", "3.511"],
          ["EV", "R̿ × K₁ (K₁ = 0.8862 for 2 trials, 0.5908 for 3)", "0.20188"],
          ["AV", "√[(X̄<sub>DIFF</sub> × K₂)² − EV² ÷ (n·r)] (K₂ = 0.7071 for 2 appraisers, 0.5231 for 3)", "0.22963"],
          ["GRR", "√(EV² + AV²)", "0.30575"],
          ["PV", "Rp × K₃ (K₃ by number of parts; 0.3146 for 10)", "1.10456"],
          ["TV", "√(GRR² + PV²)", "1.14610"],
          ["%GRR", "100 × GRR ÷ TV", "26.68%"],
          ["ndc", "1.41 × PV ÷ GRR, truncated", "5"]
        ])}
        ${G.w("grr")}
        <p><b>Precision-to-tolerance (P/T):</b> replace TV with tolerance ÷ 6, so %GRR = 100 × 6 × GRR ÷ tolerance. Six covers 99.73% of the variation; some practitioners use 5.15 (99%).</p>
        ${G.tab(`<p>Tab Figure 14.6 (p. 240) and copy the K₁, K₂, K₃ and D₄ values onto the tab. Write the formula for AV with its subtraction term — it's the one people get wrong.</p>`)}`
    },
    {
      id: "interpret", title: "Interpreting GR&R results", bok: "III.E", level: "Evaluate", hy: true, pages: "241–244",
      html: `
        ${G.table(["Measure", "Acceptable", "Conditional", "Unacceptable"], [
          ["%GRR (study variation or tolerance)", "&lt; 10%", "10–30% — depends on application, cost of the gage, cost of repair", "&gt; 30% — improve the measurement system"],
          ["%Contribution (variance basis)", "&lt; 1%", "1–9%", "&gt; 9%"],
          ["Number of distinct categories", "≥ 5 for process control", "2–4: coarse estimates only", "1: conformance information only"]
        ])}
        <p>The software output (Figure 14.8) for the same data: %Contribution of total GR&R 7.26%, %Study variation 26.94%, ndc 5. Two percentages for the same gage — because one is a ratio of variances and the other of standard deviations. Only the variance components add to 100%.</p>
        <ul>
          <li><b>X̄ chart by appraiser:</b> more than half the points <i>should</i> fall outside the limits — the parts were chosen to span the process. If they don't, the gage lacks resolution or the samples don't represent the process.</li>
          <li><b>R chart:</b> all points should be inside. One appraiser out → that person's method differs. Everyone has some out → the system is sensitive to technique.</li>
          <li><b>By appraiser:</b> appraiser C reads consistently lower — a reproducibility issue.</li>
        </ul>
        <p>Total observed variance = part-to-part + repeatability + operator + operator-by-part (Figure 14.9).</p>
        ${G.w("grrcap")}
        ${G.flag(`<p>Figure 14.10's example — observed Cp 1.0 with 50% GR&R means an actual Cp of 1.23 — holds only with the older 5.15σ definition of %GRR. Under the 6σ convention the handbook uses everywhere else, the same inputs give 1.15. The point is unchanged: gage error makes a process look worse than it is, and the effect grows as capability rises.</p>`)}
        ${G.trap(`<p>“%GRR = 26%” — is that of study variation, of tolerance, or a %contribution? The verdict changes with the base. 26% of study variation is conditional; 26% contribution would be unacceptable.</p>`)}`
    },
    {
      id: "errors", title: "Common GR&R mistakes", bok: "III.E", level: "Evaluate", pages: "244–246",
      html: `
        <ol class="steps-v">
          <li><p><b>Random samples instead of samples that span the tolerance</b> (process control) — PV shrinks and %GRR looks worse than it is (Figure 14.11).</p></li>
          <li><p><b>No randomization</b> — appraisers remember earlier readings (knowledge bias).</p></li>
          <li><p><b>Untrained or substitute appraisers</b> (engineers instead of the usual operators) — inflated reproducibility.</p></li>
          <li><p><b>Samples altered</b> during the study, including dropped parts.</p></li>
          <li><p><b>Experimenter absent</b> during the human parts of the measurement.</p></li>
          <li><p><b>Publishing results with appraisers' names</b> — use A, B, C.</p></li>
          <li><p><b>Treating results as valid forever</b> — revalidate periodically, like calibration.</p></li>
          <li><p><b>Assuming one gage represents the whole family</b> — different users, settings and environments.</p></li>
        </ol>
        ${G.trap(`<p>Product control (100% inspection, sorting) may use random samples and judges the gage against the <b>tolerance</b>. Process control (SPC, capability) needs samples across the whole operating range and judges against <b>process variation</b> (p. 252).</p>`)}`
    },
    {
      id: "bias", title: "Linearity, bias and measurement correlation", bok: "III.E", level: "Evaluate", pages: "246–249",
      html: `
        <p>A <b>linearity study</b> measures master parts across the operating range and regresses bias on the reference value. The <b>slope</b> is the linearity: a significant slope means the gage's bias depends on where in the range you measure. The <b>average bias</b> and its p-value say whether the gage is offset overall.</p>
        ${G.w("linbias")}
        <p>Causes of nonlinearity: calibration off at the high or low end, an error in a master part, a worn instrument, or the instrument's design.</p>
        ${G.flag(`<p>Reading Figure 14.12, the handbook says “R-Sq is 0.0%. This shows a nonlinearity issue.” It's the reverse: the slope is 0.00262 with p = 0.974, so bias <b>doesn't</b> change across the range — linearity is fine. R² is 0% because there's no trend to explain. The real finding is <b>bias</b>: average −0.115 (p = 0.000), driven by the reference 0.6 reading, bias −1.207 (p = 0.001). Investigate that point (a bad master or a recording error) and recalibrate.</p>`)}
        <p><b>Measurement correlation</b> compares gages measuring the same parts. Use a scatter diagram and r, or <b>orthogonal regression</b>, which allows for error in both gages. If the intercept's CI includes 0 and the slope's CI includes 1, the gages agree. Figure 14.13: equipment A = 0.136 + 0.987 × equipment B; CIs (−0.704, 0.976) and (0.911, 1.063) — equivalent. A full study with several gages, appraisers and parts can be analyzed for components of variance.</p>`
    },
    {
      id: "attr", title: "Attribute agreement analysis", bok: "III.E", level: "Evaluate", pages: "249–251",
      html: `
        <p>For go/no-go, pass/fail or rating-scale judgments — often pure human variation, sometimes an automatic screen. Three appraisers judged 32 polished-glass samples over repeated trials.</p>
        ${G.table(["Appraiser", "Within appraiser (matches self)", "Versus standard", "Rejects good (R/A)", "Accepts bad (A/R)", "Mixed"], [
          ["A", "20/32 = 62.5% (43.7, 78.9)", "16/32 = 50.0% (31.9, 68.1)", "3 = 11.5%", "1 = 16.7%", "12 = 37.5%"],
          ["B", "26/32 = 81.3% (63.6, 92.8)", "25/32 = 78.1% (60.0, 90.7)", "0", "1 = 16.7%", "6 = 18.8%"],
          ["C", "27/32 = 84.4% (67.2, 94.7)", "25/32 = 78.1% (60.0, 90.7)", "0", "2 = 33.3%", "5 = 15.6%"]
        ])}
        ${G.w("attagree")}
        <p>Inconsistency within an appraiser comes from unclear criteria, fatigue, ergonomics of the inspection area and mood. The handbook suggests training C, the most consistent appraiser, to stop passing bad parts.</p>
        ${G.trap(`<p>Within-appraiser agreement is <b>repeatability</b> — it says nothing about being right. An appraiser can agree with themself 100% of the time and still be wrong every time. Versus-standard agreement can't exceed within-appraiser agreement.</p>`)}`
    }
  ],
  check: [
    { q: "One operator measures the same part ten times with the same micrometer and gets readings spread over 0.03 mm. This variation is called:",
      o: ["Reproducibility", "Repeatability", "Bias", "Linearity"], a: 1,
      why: "One appraiser, one gage, one part, repeated readings — repeatability, or equipment variation.",
      d: { 0: "Reproducibility is variation between appraisers.", 2: "Bias is an offset from the reference value.", 3: "Linearity is change in bias across the range." }, ref: "233–234" },
    { q: "A GR&R study gives EV = 0.20, AV = 0.23 and PV = 1.10. The %GRR of total variation is closest to:",
      o: ["7%", "38%", "27%", "20%"], a: 2,
      why: "GRR = √(0.20² + 0.23²) = 0.305; TV = √(0.305² + 1.10²) = 1.141; 0.305 ÷ 1.141 = 26.7%.",
      d: { 0: "That's the variance-based %contribution (0.305² ÷ 1.141²).", 1: "Adding EV and AV directly overstates GRR.", 3: "That's %AV alone." }, ref: "240" },
    { q: "A gage study shows %GRR = 18% of study variation and ndc = 6. Under AIAG guidelines the measurement system is:",
      o: ["Acceptable without qualification", "Unacceptable", "Acceptable only for product sorting", "Conditionally acceptable, depending on the application and costs"], a: 3,
      why: "10–30% is conditional; ndc 6 meets the ≥ 5 requirement.",
      d: { 0: "Unconditional acceptance needs under 10%.", 1: "Unacceptable is over 30%.", 2: "The criteria don't restrict it to sorting." }, ref: "242" },
    { q: "In a GR&R study's X̄ chart by appraiser, very few part averages fall outside the control limits. This most likely means:",
      o: ["The measurement system is excellent", "The parts chosen don't span the process variation, or the gage lacks resolution", "Appraisers are reading too high", "The range chart is out of control"], a: 1,
      why: "Limits on this chart come from measurement error; parts spanning the process should put about half or more of the averages outside them.",
      d: { 0: "Points inside the limits here signal a problem, not a good gage.", 2: "Bias between appraisers shows in the by-appraiser comparison.", 3: "That's a separate chart and question." }, ref: "241" },
    { q: "A linearity study gives slope 0.003 (p = 0.97), R² = 0%, and average bias −0.115 (p = 0.000). The correct conclusion is:",
      o: ["The gage is nonlinear because R² is 0%", "The gage is both linear and unbiased", "Bias is constant across the range, but there is a significant overall bias", "The study is invalid because R² must exceed 70%"], a: 2,
      why: "A non-significant slope means linearity is fine; the significant average bias is the problem.",
      d: { 0: "The handbook's misreading — R² near 0 means no trend in bias.", 1: "The bias p-value of 0.000 says otherwise.", 3: "There's no such R² requirement for linearity studies." }, ref: "246–248" },
    { q: "An inspector agrees with themself on 30 of 30 samples across three trials but matches the expert standard on only 18. This shows:",
      o: ["Good repeatability but poor accuracy", "Poor repeatability but good accuracy", "Poor reproducibility", "That the standard is wrong"], a: 0,
      why: "Consistent with themself (repeatable) but often wrong against the standard — a calibration or criteria problem.",
      d: { 1: "Repeatability is perfect here.", 2: "Reproducibility needs more than one appraiser.", 3: "The standard is the reference by definition." }, ref: "249–250" },
    { q: "Which practice should be AVOIDED when running a GR&R study for process control?",
      o: ["Randomizing the order in which parts are measured", "Using the operators who normally take the measurement", "Selecting parts at random from production", "Hiding part numbers from the appraisers"], a: 2,
      why: "For process control, parts must be chosen to span the whole process range; random parts from the bin can understate part variation.",
      d: { 0: "Randomizing prevents knowledge bias.", 1: "Substituting engineers inflates reproducibility.", 3: "Recommended, so appraisers can't recall earlier readings." }, ref: "235, 244" }
  ]
});
