G.chapter({
  id: "ch16", num: 16, title: "Exploratory Data Analysis", bok: "IV.A", pages: "270–292", drill: 33,
  lede: "The Analyze phase starts by letting the data point to the biggest family of variation (multi-vari, Create level) and testing relationships (correlation and regression, Evaluate level). The worked examples here contain several reasoning slips — knowing why they're wrong is exactly the Evaluate skill the exam tests.",
  sections: [
    {
      id: "multivari", title: "Multi-vari studies", bok: "IV.A.1", level: "Create", hy: true, pages: "270–278",
      html: `
        <p>A multi-vari chart splits variation into families so you can see which is largest before chasing causes.</p>
        ${G.table(["Family", "Also called", "In a piece", "In a batch or lot"], [
          ["Positional", "Within-part", "Taper, out-of-round, thick center", "Within the batch — cavity, position in the oven"],
          ["Cyclical", "Part-to-part, lot-to-lot", "Consecutive pieces differ", "Batch-to-batch"],
          ["Temporal", "Shift-to-shift, over time", "Drift over the shift", "Drift over time"]
        ])}
        ${G.w("varfam")}
        <h3>Sampling plan (p. 271–273)</h3>
        <ol class="steps-v">
          <li><p>Select the process and characteristic.</p></li>
          <li><p>Choose a manageable sample — 3 to 5 pieces — and a collection frequency that captures within-sample and sample-to-sample variation.</p></li>
          <li><p>Record time and values in a table.</p></li>
          <li><p>Plot time on the horizontal axis and the measured values vertically.</p></li>
          <li><p>Connect the observed values with lines.</p></li>
          <li><p>Look for variation within samples, between samples and over time.</p></li>
          <li><p>Run further studies on the area of largest variation.</p></li>
        </ol>
        <h3>The stainless casting case</h3>
        <p>A machined bore was measured at the top, middle and bottom (positional, top-to-bottom) and at 12, 2 and 4 o'clock (positional, out-of-round), on five parts spread over one shift (cyclical and temporal).</p>
        ${G.w("multivari")}
        <ol class="steps-v">
          <li><p>Original castings: <b>part-to-part</b> dominates. Ideas about chuck pressure and tooling were parked — they couldn't fix the biggest family. A precision foundry was sourced.</p></li>
          <li><p>Precision castings (with a more discriminating gage): <b>out-of-round</b> now dominates. Because the longest diameter changes angle from part to part (12 o'clock on part 4, other angles elsewhere), fixed-orientation chuck pressure couldn't be the cause.</p></li>
          <li><p>An operator suggested chips from the lathe were being burnished into the bore. Pressure-washing before burnishing cut out-of-round; it had failed a year earlier only because the large part-to-part variation masked it.</p></li>
          <li><p>A remaining shift-to-shift pattern was traced to tool wear and fixed with a tool-change routine.</p></li>
        </ol>
        ${G.trap(`<p>Attack the largest family first; improvements to small families are invisible while a big one dominates. For transactional processes (bank tellers, call-center handle time), stratify by transaction type and complexity before the multi-vari.</p>`)}`
    },
    {
      id: "corr", title: "Correlation vs causation; the correlation coefficient", bok: "IV.A.2", level: "Evaluate", hy: true, pages: "279–285",
      html: `
        <p><b>Correlation</b> measures the strength (strong, moderate, weak) and direction (positive, negative) of a <b>linear</b> relationship. <b>Causation</b> means a change in x produces a change in y — and every cause has prior causes (a causal chain). Association alone never proves causation; that takes a well-designed experiment or several consistent observational studies.</p>
        <p>Put the independent variable (hours studied, hours of exercise, advertising level) on x and the dependent one (grade, weight loss, sales) on y — and check the relationship from both directions before deciding which is which.</p>
        <p class="formula">r = Σ(x − x̄)(y − ȳ) ÷ [(n − 1)s<sub>x</sub>s<sub>y</sub>] = [nΣxy − ΣxΣy] ÷ √{[nΣx² − (Σx)²][nΣy² − (Σy)²]}</p>
        <p>Exercise example (Table 16.6, n = 6): Σx = 38, Σy = 24, Σxy = 217, Σx² = 372, Σy² = 130 → r = 390 ÷ √(788 × 204) = 0.972. Spreadsheet: =CORREL(A2:A7, B2:B7) = 0.972717.</p>
        ${G.w("rguess")}
        <h3>Testing r</h3>
        <p>H₀: ρ = 0. Test statistic <b>t = r ÷ √[(1 − r²) ÷ (n − 2)]</b> with <b>n − 2</b> df. Conditions: for each x, y is normal and independent with equal spread. Exercise data: t = 0.972 ÷ √(0.0552 ÷ 4) = 8.27 (8.39 with r unrounded) &gt; 2.132 (one-tailed, α 0.05, df 4) → reject; positive correlation.</p>
        ${G.flag(`<p>Step 4 of the procedure (p. 284) says to use <b>n − 1</b> degrees of freedom, and so does the confidence-interval formula above it. The example correctly uses n − 2 — two parameters (slope and intercept) are estimated from the data.</p>`)}
        ${G.flag(`<p>The 3-point example (3,2), (3,3), (6,4) gives r = 0.866, p = 0.333. The handbook adds “there is a 0.33 probability of mistakenly rejecting the hypothesis.” Not quite: 0.333 is the probability of a correlation at least this strong <i>if there were no relationship</i>. With only three points, r = 0.87 is easy to get by chance — which is the real lesson.</p>`)}
        ${G.trap(`<p>A big |r| from a tiny sample isn't significant; a small r from a huge sample can be. Always pair r with its p-value. And r measures linear association only — a perfect U-shaped curve can give r ≈ 0.</p>`)}`
    },
    {
      id: "regress", title: "Simple linear regression", bok: "IV.A.2", level: "Evaluate", hy: true, pages: "286–292",
      html: `
        <p>Least squares picks the line ŷ = a + bx that minimizes the sum of squared vertical distances from the points:</p>
        <p class="formula">b = [nΣxy − ΣxΣy] ÷ [nΣx² − (Σx)²] = S<sub>xy</sub> ÷ S<sub>xx</sub> &nbsp;&nbsp; a = ȳ − b·x̄</p>
        <p><b>Testing the slope:</b> H₀: β₁ = 0 (the equation isn't useful for predicting y). t = b ÷ (s ÷ √S<sub>xx</sub>), df = n − 2, where s = √[SSE ÷ (n − 2)] is the standard error of the estimate. Same conditions as for r.</p>
        ${G.w("regress")}
        ${G.table(["Interval at x₀", "Formula", "Answers"], [
          ["Confidence interval for the mean", "ŷ ± t·s·√[1/n + (x₀ − x̄)² ÷ S<sub>xx</sub>]", "Where is the average y for all units at x₀?"],
          ["Prediction interval", "ŷ ± t·s·√[1 + 1/n + (x₀ − x̄)² ÷ S<sub>xx</sub>]", "Where will one new y at x₀ fall? Always wider."]
        ])}
        <h3>The handbook's two examples</h3>
        <p><b>Complaints by month</b> (Table 16.7, months 1–8: 8, 6, 10, 6, 10, 13, 9, 11): b = 0.5833, a = 6.50, s = 2.105. Slope t = 0.5833 ÷ 0.325 = 1.79, df 6, critical 2.447, p ≈ 0.12 — not significant.</p>
        ${G.flag(`<p>Four problems with the complaints example (p. 287): (1) it says complaints rise “at an average rate of one per month” — the slope is 0.58 per month; (2) it extrapolates six months beyond the data to month 14; (3) it computes 14.666 and reports “14” — that's truncating, not rounding; (4) the slope isn't statistically significant, so the line shouldn't be used to predict at all. Later (p. 292) it calls the interval 7.84 to 14.49 at month 8 a confidence interval for “the number of items” — that's the CI for the <i>mean</i>; a single month's count needs the wider prediction interval.</p>`)}
        <p><b>Temperature vs viscosity</b> (10, 15, 20, 15 °C → 2, 3, 5, 4 cP): b = 0.3, a = −1, R² = 0.90, s = 0.5, t = 0.3 ÷ (0.5 ÷ √50) = 4.24 against ±4.303 (df 2) → fail to reject, p = 0.0513.</p>
        ${G.flag(`<p>Both regression examples end “we cannot reject the null hypothesis and must conclude that a relationship between the variables does not exist.” Failing to reject is <b>not</b> evidence of no relationship — with four points and p = 0.051 (R² = 90%), the honest conclusion is “not proven at α = 0.05; collect more data.”</p>`)}
        ${G.trap(`<p>Extrapolation is the classic regression trap: the line is only supported inside the range of x you observed. And R² can be high while the slope is still not significant when n is very small.</p>`)}
        ${G.tab(`<p>Tab p. 283–292 with three lines: r, t for r (df n − 2), and b/a. Add a note: CI = mean, PI = one unit.</p>`)}`
    }
  ],
  check: [
    { q: "A multi-vari study of a machined bore shows small differences between top, middle and bottom, small out-of-round, but large differences between consecutive parts. Where should the team focus first?",
      o: ["Out-of-round variation from chuck pressure", "Part-to-part (cyclical) variation", "Top-to-bottom taper from tooling", "Measurement error in the bore gage"], a: 1,
      why: "Attack the dominant family first. Part-to-part variation swamps the positional families here.",
      d: { 0: "Out-of-round is small in this scenario.", 2: "Taper is also small.", 3: "Nothing in the scenario points to the gage." }, ref: "275–276" },
    { q: "Diameter differences between cavity 1 and cavity 4 of the same mold shot are an example of which family of variation?",
      o: ["Temporal", "Cyclical", "Positional", "Common-cause only"], a: 2,
      why: "Variation by position within a batch (one shot) is positional, within-batch variation.",
      d: { 0: "Temporal is change over time.", 1: "Cyclical is piece-to-piece or lot-to-lot.", 3: "The family question doesn't depend on cause type." }, ref: "271" },
    { q: "Ice-cream sales and drowning deaths are strongly positively correlated across the months of a year. The best interpretation is:",
      o: ["Ice cream consumption increases drowning risk", "The correlation proves causation because r is high", "Drownings cause ice cream sales", "A third variable, such as hot weather, may drive both"], a: 3,
      why: "Correlation doesn't establish cause; a lurking variable (summer heat) explains both.",
      d: { 0: "Causal claim without evidence.", 1: "Strength of association never proves causation.", 2: "Reverse causation — equally unsupported." }, ref: "279–280" },
    { q: "To test whether a sample correlation r from 12 pairs differs significantly from zero, the t-statistic is compared with a critical value having how many degrees of freedom?",
      o: ["10", "11", "12", "24"], a: 0,
      why: "df = n − 2 = 10, because the line estimates two parameters.",
      d: { 1: "n − 1 — the handbook's step-4 error.", 2: "n itself.", 3: "Double-counting the pairs." }, ref: "284–285" },
    { q: "A regression of complaints on month (months 1–8) gives ŷ = 6.5 + 0.583x with slope p-value 0.12. Using it to predict complaints in month 14 is:",
      o: ["Appropriate, giving 14.67 complaints", "Appropriate, but round down to 14", "Inappropriate — the slope isn't significant and month 14 is an extrapolation", "Inappropriate because R² must be at least 0.95"], a: 2,
      why: "A non-significant slope means the line isn't a useful predictor, and month 14 lies outside the observed range.",
      d: { 0: "The handbook's approach — ignores both problems.", 1: "Truncating doesn't fix the underlying issue.", 3: "There's no fixed R² threshold." }, ref: "287–288" },
    { q: "At a given x₀, how does a 95% prediction interval compare with a 95% confidence interval for the mean response?",
      o: ["It is narrower", "It is wider", "They are identical", "It depends only on R²"], a: 1,
      why: "The prediction interval adds the scatter of individual points (the extra “1 +” under the root), so it's always wider.",
      d: { 0: "The opposite.", 2: "Only the CI ignores individual scatter.", 3: "Both depend on s, n and the distance from x̄." }, ref: "291–292" },
    { q: "A regression with four points gives slope t = 4.24 against critical ±4.303 (p = 0.051) and R² = 90%. The best conclusion at α = 0.05 is:",
      o: ["A relationship has been proven not to exist", "The relationship is proven because R² is 90%", "The intercept must be tested instead", "There's insufficient evidence of a linear relationship at α = 0.05; more data are needed"], a: 3,
      why: "Failing to reject H₀ means the evidence falls short — not that there's no relationship. With n = 4, power is low.",
      d: { 0: "The handbook's overstatement.", 1: "R² doesn't replace the significance test.", 2: "The slope is the test of a relationship." }, ref: "288–290" }
  ]
});
