G.chapter({
  id: "ch17", num: 17, title: "Hypothesis Testing", bok: "IV.B", pages: "295–328", drill: 33,
  lede: "The heaviest statistics chapter. IV.B.1 (Apply) covers the logic — hypotheses, α and β, power, sample size, practical significance. IV.B.2 (Analyze) covers choosing and reading the tests. On an open-book exam the formulas are in your binder; what costs time is picking the test and reading the conclusion. Every worked example here has been recomputed — several of the handbook's conclusions overstate what the test shows.",
  sections: [
    {
      id: "basics", title: "Hypotheses, errors and tails", bok: "IV.B.1", level: "Apply", hy: true, pages: "295–299",
      html: `
        <p>The <b>null hypothesis H₀</b> is the status quo (μ =, ≤ or ≥ a value). The <b>alternative H₁</b> is what you're trying to show (≠, &gt; or &lt;). Like a court: the defendant is “not guilty” until the evidence is overwhelming — but “not guilty” isn't “innocent”. You <b>reject</b> or <b>fail to reject</b> H₀; you never accept it.</p>
        ${G.table(["", "H₀ true", "H₀ false"], [
          ["Reject H₀", "Type I error — probability α (producer's risk; good lot rejected)", "Correct — probability 1 − β = <b>power</b>"],
          ["Fail to reject H₀", "Correct — probability 1 − α (confidence)", "Type II error — probability β (consumer's risk; bad lot accepted)"]
        ], { rowHead: true })}
        ${G.w("errtypes")}
        <h3>One tail or two?</h3>
        <p>The rejection region always sits on the side H₁ points to. H₁: μ &gt; 20 → right tail with all of α; H₁: μ &lt; 20 → left tail; H₁: μ ≠ value → α/2 in each tail (±1.96 at α = 0.05).</p>
        <p>Golf ball example: claim adds more than 20 yards, H₀: μ ≤ 20, H₁: μ &gt; 20. Ten drives: 18, 20, 19, 18, 21, 19, 23, 18, 19, 22. Fail to reject — the claim isn't supported.</p>
        ${G.flag(`<p>The printout on p. 298 (mean 19.673, s 1.775, t −0.58, p 0.713) doesn't match the listed data, which give mean 19.70, s 1.767, t −0.54, p 0.70. The conclusion is the same.</p>`)}
        ${G.trap(`<p>“Accept H₀” in an answer option is usually the wrong wording — the correct phrase is “fail to reject” or “insufficient evidence”. Match the tail to H₁, not to the sign of your test statistic.</p>`)}`
    },
    {
      id: "power", title: "Sample size, power and practical significance", bok: "IV.B.1", level: "Apply", hy: true, pages: "299–302",
      html: `
        <p>Sample size depends on α, β, the smallest difference worth detecting, and σ. Power rises when n, the difference δ, or α increases, and when σ falls. A power of 0.80 is the usual minimum; 0.90 or more where the risk is high.</p>
        ${G.w("ssize")}
        ${G.w("power")}
        ${G.flag(`<p>Three slips on pp. 299–300. (1) The shipyard sample size: (1.96 × 35 ÷ 10)² = <b>47.06 → 48</b>, not 470.59 — and E is the shift to detect, not “the process mean”. The text also switches from 10 to 8 tons (which would need 74). (2) “If the p-value is greater than α, the p-value is not significant enough to conclude that the null hypothesis is true” — no p-value ever concludes H₀ is true. (3) Power 0.8 is described as “an 80% likelihood to identify a significant difference when one truly exists, and a 20% likelihood it will incorrectly identify a significant difference when the difference does not exist.” The 20% is <b>β — missing a real difference</b>. Falsely finding one is α.</p>`)}
        <h3>Statistical vs practical significance</h3>
        <p>Statistical significance says a difference is probably real; practical significance says it matters. A 0.5% defect difference can be significant yet irrelevant when the customer allows 3%. A 20-micron gage difference may be detectable while 50 microns would still be acceptable. Low power can hide a difference that does matter.</p>
        ${G.w("sigprac")}
        ${G.trap(`<p>With huge samples, trivial differences become “significant”; with tiny samples, important ones don't. Report the size of the difference alongside the p-value, and calculate power before concluding “no difference”.</p>`)}`
    },
    {
      id: "pick", title: "Choosing the test", bok: "IV.B.2", level: "Analyze", hy: true, pages: "302–328",
      html: `
        ${G.w("testpick")}
        ${G.table(["Comparing", "Test", "Statistic", "df"], [
          ["One mean, σ known", "Z", "(x̄ − μ₀) ÷ (σ/√n)", "—"],
          ["One mean, σ unknown", "t", "(x̄ − μ₀) ÷ (s/√n)", "n − 1"],
          ["Two means, equal variances", "Pooled t", "(x̄₁ − x̄₂) ÷ [s<sub>p</sub>√(1/n₁ + 1/n₂)]", "n₁ + n₂ − 2"],
          ["Two means, unequal variances", "Welch t", "(x̄₁ − x̄₂) ÷ √(s₁²/n₁ + s₂²/n₂)", "Satterthwaite (round down)"],
          ["Paired readings", "Paired t", "d̄ ÷ (s<sub>d</sub>/√n)", "n − 1 pairs"],
          ["One variance", "χ²", "(n − 1)s² ÷ σ₀²", "n − 1"],
          ["Two variances", "F", "s₁² ÷ s₂²", "n₁ − 1, n₂ − 1"],
          ["Three or more means", "One-way ANOVA", "MS between ÷ MS within", "k − 1, N − k"],
          ["One proportion", "Z (or exact binomial)", "(p̂ − p₀) ÷ √[p₀(1 − p₀)/n]", "—"],
          ["Counts vs expected", "χ² goodness of fit", "Σ(O − E)² ÷ E", "k − 1"],
          ["Two categorical variables", "χ² contingency", "Σ(O − E)² ÷ E", "(r − 1)(c − 1)"]
        ])}
        <p><b>Parametric</b> tests assume a distribution (usually normal). <b>Nonparametric</b> (distribution-free) tests don't — for ranks and data that aren't truly continuous: Kendall coefficient of concordance, Spearman rank correlation, Kruskal-Wallis one-way analysis of variance. Details are outside the Green Belt BoK.</p>
        ${G.tab(`<p>This table is the single most valuable tab in the Analyze phase. Copy it onto a tab facing the t, χ² and F appendices, with the df column highlighted.</p>`)}`
    },
    {
      id: "means", title: "One-sample tests and confidence intervals for means", bok: "IV.B.2", level: "Analyze", pages: "302–307",
      html: `
        <p><b>Z-test</b> — normal population or n ≥ 30, σ known. A vendor claims a mean weight of 1.84; 64 parts average 1.88; σ = 0.03. Z = (1.88 − 1.84) ÷ (0.03/8) = 10.67 → reject; the 95% CI (1.8727, 1.8874) excludes 1.84.</p>
        <p><b>t-test</b> — σ unknown, estimated by s; the population roughly normal. Using t is never wrong; around n = 30 it's practically the same as Z. A new saw blade: n = 20, x̄ = 4.123, s = 0.008, H₁: μ &lt; 4.125, α = 0.10. t = −1.12 vs −1.328 (p = 0.139) → fail to reject.</p>
        ${G.table(["Confidence interval", "Formula", "Example"], [
          ["Mean, σ known", "x̄ ± Z<sub>α/2</sub>·σ/√n", "$78.25 ± 1.96 × 37.50/√32 = $65.25 to $91.25"],
          ["Mean, σ unknown", "x̄ ± t<sub>α/2, n−1</sub>·s/√n", "n = 25: $78.25 ± 2.064 × 37.50/5 = $62.77 to $93.73"]
        ])}
        ${G.w("meantest")}
        ${G.flag(`<p>The saw-blade example ends “declare that there is no change since the blade change” (p. 306). Failing to reject only means the data don't show a decrease at α = 0.10.</p>`)}`
    },
    {
      id: "varprop", title: "Tests and intervals for variances and proportions", bok: "IV.B.2", level: "Analyze", pages: "307–311",
      html: `
        <p><b>One variance (χ²).</b> 35 parts with s² = 46; is σ² = 36? χ² = 34 × 46 ÷ 36 = 43.44, df 34, p = 0.257 → fail to reject. The 95% CI for σ² is (30.1, 79.0) — it contains 36. The interval isn't symmetric: (n − 1)s² ÷ χ²<sub>upper</sub> to (n − 1)s² ÷ χ²<sub>lower</sub>. At 90%: 1,564 ÷ 48.60 to 1,564 ÷ 21.66 = 32.18 to 72.21.</p>
        ${G.w("vartest")}
        <p><b>One proportion.</b> The Z approximation needs np₀ and n(1 − p₀) of at least 5; otherwise use the exact binomial. A confidence interval uses p̂: p̂ ± Z√[p̂(1 − p̂)/n].</p>
        ${G.table(["Example", "Result"], [
          ["Supplier B: 15 defective in 100 vs historical 10%", "Exact p = 0.130; 95% CI 8.6% to 23.5% → fail to reject"],
          ["Female shoppers: 110 of 175, 90% CI", "0.629 ± 1.645 × 0.0365 = 0.569 to 0.689"],
          ["Vendor claims ≤ 2% defective; 15 of 500 found", "Z = (0.03 − 0.02) ÷ √(0.02 × 0.98/500) = 1.60 &lt; 1.645 (p = 0.055) → fail to reject"]
        ])}
        ${G.w("proptest")}
        ${G.flag(`<p>p. 311 writes p′ = 15/<b>300</b> = 0.03; it's 15/500. And the variance and supplier examples conclude “there is no difference between the two processes” and “no difference between suppliers” — both are fail-to-reject results, not proof of equality.</p>`)}`
    },
    {
      id: "two", title: "Two-sample, paired and F tests", bok: "IV.B.2", level: "Analyze", hy: true, pages: "312–317",
      html: `
        <p>The CNC example: CNC 1 = 5.257, 5.220, 5.235, 5.230, 5.225 (x̄ 5.2334, s 0.0143); CNC 2 = 5.243, 5.193, 5.225, 5.220, 5.223 (x̄ 5.2208, s 0.0179).</p>
        ${G.table(["Analysis", "Statistic", "df", "p", "Verdict"], [
          ["Pooled two-sample t (s<sub>p</sub> = 0.0162)", "t = 1.23", "8", "0.255", "Fail to reject"],
          ["Welch two-sample t", "t = 1.23", "7.63 → 7", "0.260", "Fail to reject"],
          ["Paired t on the same numbers (before/after calibration)", "d̄ = 0.0126, s<sub>d</sub> = 0.00915, t = 3.08", "4", "0.037", "Reject"]
        ])}
        <p>Same numbers, opposite conclusions. Pairing removes the part-to-part variation that swamps the two-sample comparison, so the paired test is more sensitive — but it's only valid when the readings really are paired (the same parts before and after, pre- and post-training scores).</p>
        ${G.flag(`<p>Three errors in this section. (1) The pooled example says “a paired t-test is used” but calculates the pooled two-sample test. (2) The Welch example rounds df 7.627 up to 8 “to increase the confidence level” — round <b>down</b>; fewer df gives the larger, conservative critical value (2.365), and the software output shows DF = 7. It then says “since the p-value &gt; 0.5, we conclude the parts… have equal variances” — the test is about means, and the threshold is 0.05. (3) “A paired test is always a two-tailed test” — paired tests can be one-tailed when H₁ is directional.</p>`)}
        <p><b>F-test for two variances.</b> Pickle crispness before aging: s = 1,800 (n 8); after one month: s = 600 (n 6). H₁: variance decreased, so the initial variance goes on top in a right-tailed test: F = 1,800² ÷ 600² = 9.0 &gt; F(0.05; 7, 5) = 4.88 → reject; aging improves consistency.</p>
        ${G.trap(`<p>Test variances first (F) to choose pooled vs Welch. When in doubt, Welch is the safe choice. Put the larger variance in the numerator for a right-tailed F so you only need the upper-tail table.</p>`)}`
    },
    {
      id: "anova", title: "One-way ANOVA", bok: "IV.B.2", level: "Analyze", hy: true, pages: "317–323",
      html: `
        <p>Compares three or more means at once. Conditions: normal populations, independent samples, equal variances. H₀: all means equal; H₁: not all equal. Always right-tailed.</p>
        ${G.table(["Source", "SS", "df", "MS", "F"], [
          ["Between treatments", "ΣT<sub>i</sub>²/n − C", "k − 1", "SS<sub>B</sub> ÷ (k − 1)", "MS<sub>B</sub> ÷ MS<sub>W</sub>"],
          ["Within (error)", "SS<sub>T</sub> − SS<sub>B</sub>", "N − k", "SS<sub>W</sub> ÷ (N − k)", ""],
          ["Total", "Σy² − C, with C = T²/N", "N − 1", "", ""]
        ])}
        <p>Polyurethane casting at 240, 220 and 200 °F, four batches each, response = moisture content (% H₂O). Totals 42.3, 46.9, 54.1; SS<sub>T</sub> = 21.03, SS<sub>B</sub> = 17.69, SS<sub>W</sub> = 3.34; F = 8.84 ÷ 0.371 = 23.8 &gt; F(0.05; 2, 9) = 4.26 → reject: temperature affects moisture.</p>
        ${G.w("anova")}
        ${G.flag(`<p>The hand table shows F = 23.92 because it divides the rounded values 8.85 ÷ 0.37; unrounded it's 23.81, as the software reports (p = 0.00025). In Figures 17.6–17.7 the group labels are swapped: the group with total 42.3 and mean 10.575 is 240 °F, not 200 °F.</p>`)}
        ${G.trap(`<p>A significant ANOVA says <b>at least one</b> mean differs — not which, and not that all differ. Running many t-tests instead inflates the overall chance of a Type I error, which is why ANOVA exists.</p>`)}`
    },
    {
      id: "chisq", title: "Chi-square tests", bok: "IV.B.2", level: "Analyze", pages: "324–328",
      html: `
        <p><b>Goodness of fit</b> — do observed counts match an expected distribution? <b>Contingency table</b> — are two classifications independent? Both use χ² = Σ(O − E)² ÷ E, are right-tailed, and need every expected count ≥ 1 with no more than 20% below 5. A contingency coefficient measures the strength of a significant association.</p>
        <p>Defect mix example: historical 16% paint run, 28% blister, 42% decal crooked, 14% door cracked; this week 27, 60, 100, 21 (n 208). Expected 33.28, 58.24, 87.36, 29.12. χ² = 1.185 + 0.053 + 1.829 + 2.264 = <b>5.33</b>, df 3, critical 7.815, p = 0.149 → fail to reject.</p>
        ${G.w("chisq")}
        ${G.flag(`<p>Step 5 on p. 326 reports χ² = 4.9, but the table directly above sums to 5.33 (and the software shows 5.331). The conclusion doesn't change.</p>`)}
        ${G.trap(`<p>Goodness-of-fit df = k − 1 categories; contingency df = (rows − 1)(columns − 1). Expected counts come from the hypothesized proportions (GOF) or from row total × column total ÷ grand total (contingency) — never from the observed cell itself.</p>`)}`
    }
  ],
  check: [
    { q: "A shipment of good parts is rejected because a sample happened to contain several defectives. This is a:",
      o: ["Type I error (α), producer's risk", "Type II error (β), consumer's risk", "Correct decision", "Lack of power"], a: 0,
      why: "H₀ (the lot is good) was true and was rejected — a Type I error, the producer's risk.",
      d: { 1: "Type II is accepting a bad lot.", 2: "Rejecting a good lot is an error.", 3: "Power concerns detecting a real difference." }, ref: "296" },
    { q: "A test has power 0.85 to detect a shift of 0.5 units. What is β for that shift?",
      o: ["0.05", "0.85", "0.95", "0.15"], a: 3,
      why: "β = 1 − power = 0.15, the probability of missing the shift.",
      d: { 0: "That's a typical α.", 1: "That's the power itself.", 2: "That's 1 − α at α = 0.05." }, ref: "296, 300" },
    { q: "σ = 35 tons. How many hourly readings are needed to estimate the mean within ±10 tons with 95% confidence?",
      o: ["47", "48", "470", "471"], a: 1,
      why: "n = (1.96 × 35 ÷ 10)² = 47.06, always rounded up to 48.",
      d: { 0: "Rounded down — gives less than the required confidence.", 2: "The handbook's arithmetic slip.", 3: "Built on the same slip." }, ref: "299" },
    { q: "The same five parts are measured before and after gage calibration. Which test should compare the two sets?",
      o: ["Pooled two-sample t-test", "F-test", "Paired t-test", "Chi-square test"], a: 2,
      why: "The readings are paired by part; the paired t-test analyzes the differences and removes part-to-part variation.",
      d: { 0: "Treats the readings as independent — loses sensitivity (p = 0.255 vs 0.037 here).", 1: "F compares variances, not means.", 3: "Chi-square is for counts." }, ref: "314–316" },
    { q: "A Welch t-test gives 7.63 degrees of freedom. Using a t-table, the Green Belt should use:",
      o: ["7 df, the conservative choice", "8 df, to increase confidence", "7.63 df, interpolating is required", "n₁ + n₂ − 2 = 8 df"], a: 0,
      why: "Rounding down gives the larger critical value, so the test stays conservative.",
      d: { 1: "The handbook's error — rounding up makes the test less conservative.", 2: "Tables don't need interpolation; round down.", 3: "That's the pooled test's df." }, ref: "313–314" },
    { q: "One-way ANOVA on three temperatures gives F = 23.8 with critical F = 4.26. The correct conclusion is:",
      o: ["All three temperature means are different", "At least one temperature mean differs from the others", "The variances are unequal", "No temperature effect"], a: 1,
      why: "Rejecting H₀ in ANOVA means not all means are equal — at least one differs.",
      d: { 0: "ANOVA doesn't say all differ.", 2: "Equal variances is an assumption, not the test.", 3: "F far exceeds the critical value." }, ref: "320–321" },
    { q: "A chi-square goodness-of-fit test has four defect categories. Its degrees of freedom are:",
      o: ["4", "2", "1", "3"], a: 3,
      why: "df = k − 1 = 3; the critical value at α = 0.05 is 7.815.",
      d: { 0: "That's k itself.", 1: "That's (r − 1)(c − 1) for a 2 × 3 table.", 2: "That's a 2 × 2 contingency table." }, ref: "324–326" },
    { q: "A test comparing two suppliers' defect rates gives p = 0.13 at α = 0.05. Which conclusion is correct?",
      o: ["The suppliers have the same defect rate", "Supplier B is worse", "The data don't provide sufficient evidence of a difference", "The test should be repeated at α = 0.15 to get significance"], a: 2,
      why: "p > α: fail to reject. That's insufficient evidence, not proof of equality.",
      d: { 0: "The handbook's overstatement.", 1: "Not shown at this α.", 3: "Changing α after seeing the data is not legitimate." }, ref: "309" },
    { q: "Defect rates differ by 0.5% between two lines (p = 0.002), but the customer allows 3% and the step isn't critical. The difference is:",
      o: ["Statistically significant but not practically significant", "Practically significant but not statistically significant", "Both statistically and practically significant", "Neither"], a: 0,
      why: "p = 0.002 makes it real; the customer's 3% allowance makes it unimportant.",
      d: { 1: "Reverses the two ideas.", 2: "It doesn't matter to the customer.", 3: "It is statistically significant." }, ref: "300" }
  ]
});
