G.chapter({
  id: "ch12", num: 12, title: "Statistical Distributions", bok: "III.C", pages: "193–205", drill: 27,
  lede: "Understand level: pick the right distribution for the data and know its shape and key properties. Expect “which distribution models…” items and simple probabilities. Every table value is in your binder — tab the appendices rather than memorizing them.",
  sections: [
    {
      id: "pick", title: "Choosing a distribution", bok: "III.C", level: "Understand", hy: true, pages: "193–205",
      html: `
        ${G.table(["Distribution", "Data", "Mean", "Variance", "Typical use"], [
          ["Binomial", "Discrete: count of defective units out of n (each unit good or bad)", "np", "np(1 − p)", "Defectives in a sample; p and np charts"],
          ["Poisson", "Discrete: count of defects (several possible per unit)", "λ", "λ", "Defects per unit; c and u charts"],
          ["Normal", "Continuous measurements", "μ", "σ²", "Capability, Z-tests, control limits"],
          ["Chi-square", "Continuous, ≥ 0, right-skewed; one df", "df", "2·df", "One variance; goodness of fit; contingency tables"],
          ["Student's t", "Continuous, symmetric, heavier tails; one df", "0", "df ÷ (df − 2), above 1", "Means when σ is unknown"],
          ["F", "Continuous, ≥ 0, right-skewed; two df", "—", "—", "Ratio of two variances; ANOVA"]
        ])}
        ${G.w("dist")}
        ${G.w("distpick")}
        ${G.tab(`<p>Tab Table 12.1 (p. 193) and Appendices F (normal), G (F), I (chi-square) and L (t). Spreadsheet functions are faster in practice but you won't have them in the exam — read the tables.</p>`)}`
    },
    {
      id: "binom", title: "Binomial", bok: "III.C", level: "Understand", pages: "193–196",
      html: `
        <p>Each unit has two states — good/bad, accept/reject, conform/not, success/failure — and you count how many of n are “defective”.</p>
        <p class="formula">P(x) = n! ÷ [x!(n − x)!] × pˣ(1 − p)ⁿ⁻ˣ</p>
        <p>The handbook's conditions: the lot N is greater than 50, and the sample is less than 10% of the lot (n &lt; 0.1N). For small lots, sampling without replacement changes p and the binomial is no longer accurate (the hypergeometric applies).</p>
        ${G.table(["Example", "Result"], [
          ["n = 5 from a batch 10% defective; exactly 1 defective", "5 × 0.1 × 0.9⁴ = 0.328 (=BINOM.DIST(1,5,0.1,FALSE))"],
          ["Fair coin tossed 60 times — tails", "Mean np = 30; σ = √(60 × 0.5 × 0.5) = √15 = 3.873"]
        ])}
        <p><b>Normal approximation:</b> for large n the count is approximately normal; use it only when np ≥ 10 and n(1 − p) ≥ 10.</p>
        ${G.flag(`<p>p. 196 prints the rule as “np ≥ 10 and n<b>p</b>(1 − p) ≥ 10”. The usual condition is np ≥ 10 and <b>n(1 − p)</b> ≥ 10 — enough expected successes and enough expected failures.</p>`)}`
    },
    {
      id: "pois", title: "Poisson", bok: "III.C", level: "Understand", pages: "196–198",
      html: `
        <p>Counts of <b>defects</b> — several can occur on one unit: paint defects on a surface, errors per quote, bugs in code. Defects per unit (DPU) is the basis for DPO and DPMO.</p>
        <p class="formula">P(x) = e<sup>−λ</sup> λˣ ÷ x!</p>
        <p>Its signature property: <b>mean = variance = λ</b>.</p>
        ${G.table(["Example", "Result"], [
          ["λ = 5 defects per unit; fewer than 2 defects", "P(0) + P(1) = 0.0067 + 0.0337 = 0.040"],
          ["Historical 10% defective, lot of 50; exactly 5 defectives", "λ = np = 5; P(5) = 0.175"]
        ])}
        ${G.flag(`<p>p. 197 prints P(0) ≈ 0.006; it's 0.0067 (the total, 0.040, is right). The lot-of-50 example applies Poisson to <i>defectives</i> — a Poisson approximation to the binomial, reasonable when n is large and p small. The exact binomial answer is 0.185, not 0.175.</p>`)}
        ${G.trap(`<p>Defect<b>ive</b> units → binomial. Defect<b>s</b> → Poisson. Read the noun.</p>`)}`
    },
    {
      id: "normal", title: "Normal", bok: "III.C", level: "Understand", hy: true, pages: "199–201",
      html: `
        <p>Continuous, symmetric, bell-shaped, defined by μ and σ. The standard normal has mean 0 and σ = 1; convert with <b>Z = (x − μ) ÷ σ</b> and read areas from Appendix F. The total area under the curve is 1.</p>
        ${G.table(["Example", "Working", "Answer"], [
          ["Area between Z = +1.5 and +2.5", "0.0668 − 0.0062", "0.0606"],
          ["Pizza orders: μ = 30 min, σ = 5 — share between 20 and 35 min", "Z = −2.00 and +1.00; 0.97724 − 0.15865", "0.8186 (about 82%)"]
        ])}
        ${G.trap(`<p>Appendix tables differ — some give the area to the right of Z, some the area from the mean, some the cumulative area to the left. Check the picture at the top of your table before subtracting.</p>`)}
        ${G.tab(`<p>Tab Appendix F. Memorize nothing: write on the tab the three areas you'll use most — beyond 1.96 (0.025), beyond 2.576 (0.005), beyond 3 (0.00135).</p>`)}`
    },
    {
      id: "sampling", title: "Chi-square, t and F", bok: "III.C", level: "Understand", hy: true, pages: "201–205",
      html: `
        <div class="grid3">
          <div class="card"><h4>Chi-square (χ²)</h4><p>Sum of squared standard normals; (n − 1)s² ÷ σ² for a normal population. Nonnegative, right-skewed, one curve per df; approaches normal as df grows. One variance: df = n − 1. χ²(0.01, 5) = 15.09.</p></div>
          <div class="card"><h4>Student's t</h4><p>Symmetric about 0 and bell-shaped, but flatter with thicker tails; variance above 1. Used when σ is unknown and estimated by s. Approaches the normal as n grows — differences are negligible beyond about 30.</p></div>
          <div class="card"><h4>F</h4><p>Ratio of two chi-squares, each divided by its df (v₁, v₂). Nonnegative, right-skewed. Used to compare variances and in ANOVA. Lower-tail values are reciprocals: F(0.95; 6, 4) = 1 ÷ F(0.05; 4, 6) = 1 ÷ 4.53 = 0.22.</p></div>
        </div>
        <p><b>Degrees of freedom</b> — the amount of information the data provide for estimating unknown parameters and their variability.</p>
        <p>Contingency-table example (p. 202): 100 people by age group and daily social-network hours (21, 31 / 29, 19). Expected counts 26, 26, 24, 24; χ² = 4.006, df 1, p = 0.045 — at α = 0.05 the groups differ.</p>
        ${G.flag(`<p>The t example (p. 204): twelve chemical packs, mean 7.375 g, s 0.2832, label 7.5 g. The test of μ &gt; 7.5 gives t = −1.53 and p = 0.923. The handbook concludes “approximately 7.8 percent of the packs could be greater than 7.5” — that number is 1 − p, and a p-value isn't a proportion of packs at all. If pack weights are normal with this mean and s, about <b>33%</b> of individual packs exceed 7.5 g. What the test does say: no evidence that the mean exceeds 7.5 g.</p>`)}
        ${G.trap(`<p>χ² and F are never negative and are skewed right; t and Z are symmetric about zero. “Bell-shaped with heavier tails” is t. “Ratio of two variances” is F. “Mean equals variance” is Poisson, not chi-square.</p>`)}`
    }
  ],
  check: [
    { q: "A Green Belt counts the number of scratches on each painted panel; a panel can have several scratches. Which distribution should model the count?",
      o: ["Poisson", "Binomial", "Normal", "Student's t"], a: 0,
      why: "Several defects per unit — a count of occurrences in an area of opportunity — is Poisson.",
      d: { 1: "Binomial counts defective units, each simply good or bad.", 2: "Normal models continuous measurements.", 3: "t is used to test means when σ is unknown." }, ref: "196" },
    { q: "A sample of 5 is drawn from a large batch that is 10% defective. The probability of exactly one defective is closest to:",
      o: ["0.100", "0.656", "0.328", "0.500"], a: 2,
      why: "5 × 0.1 × 0.9⁴ = 0.328.",
      d: { 0: "That's p, not P(x = 1).", 1: "0.9⁴ alone — the 5 and the 0.1 are missing.", 3: "No basis in the binomial formula." }, ref: "195" },
    { q: "Which distribution has its mean equal to its variance?",
      o: ["Binomial", "Chi-square", "Normal", "Poisson"], a: 3,
      why: "For the Poisson, both equal λ.",
      d: { 0: "Binomial variance np(1 − p) is less than the mean np.", 1: "Chi-square has mean df and variance 2·df.", 2: "Normal mean and variance are independent parameters." }, ref: "197" },
    { q: "Pizza delivery times are normal with mean 30 minutes and standard deviation 5. About what proportion of orders take between 20 and 35 minutes?",
      o: ["0.68", "0.82", "0.95", "0.84"], a: 1,
      why: "Z = −2 and +1; area = 0.9772 − 0.1587 = 0.8186.",
      d: { 0: "That's ±1σ.", 2: "That's ±2σ.", 3: "That's only the area below Z = 1." }, ref: "200–201" },
    { q: "Compared with the standard normal, Student's t-distribution with 5 degrees of freedom is:",
      o: ["Skewed to the right and never negative", "More peaked with thinner tails", "Symmetric with heavier tails", "Identical, because both have mean 0"], a: 2,
      why: "t is symmetric about 0 but flatter with thicker tails, so its critical values are larger than Z's; it approaches the normal as df grows.",
      d: { 0: "That describes chi-square and F.", 1: "The opposite of t's shape.", 3: "Same mean, different spread and tails." }, ref: "203–204" },
    { q: "F(0.05; 4, 6) = 4.53. What is the lower-tail critical value F(0.95; 6, 4)?",
      o: ["0.22", "4.53", "−4.53", "0.95"], a: 0,
      why: "Lower-tail F values are reciprocals with the df swapped: 1 ÷ 4.53 = 0.22.",
      d: { 1: "That's the upper-tail value with the original df.", 2: "F is never negative.", 3: "0.95 is the cumulative probability, not the F value." }, ref: "205" },
    { q: "A one-sample t-test of H₁: μ > 7.5 g on 12 packs gives p = 0.923. The correct interpretation is:",
      o: ["7.7% of packs weigh more than 7.5 g", "92.3% of packs weigh less than 7.5 g", "The mean is proven to be 7.5 g", "There's no evidence that the mean exceeds 7.5 g"], a: 3,
      why: "A large p-value means the data give no support to H₁; it isn't a proportion of packs and doesn't prove H₀.",
      d: { 0: "The handbook's error — 1 − p is not a share of packs.", 1: "A p-value is not a proportion of the population.", 2: "Failing to reject never proves H₀." }, ref: "204" }
  ]
});
