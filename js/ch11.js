G.chapter({
  id: "ch11", num: 11, title: "Probability and Statistics", bok: "III.B", pages: "182–192", drill: 27,
  lede: "Both BoK topics here are Understand level: know which rule applies and why, and what the central limit theorem buys you. The arithmetic is light; the traps are in the words — mutually exclusive versus independent, permutation versus combination, standard error versus standard deviation.",
  sections: [
    {
      id: "rules", title: "Probability rules", bok: "III.B.1", level: "Understand", hy: true, pages: "182–186",
      html: `
        <p>A probability lies between 0 (impossible) and 1 (certain); the probabilities of all possible outcomes add to 1. “Random” means every item has an equal chance of selection.</p>
        ${G.table(["Rule", "Formula", "When"], [
          ["Special addition", "P(A or B) = P(A) + P(B)", "Only if A and B are mutually exclusive"],
          ["General addition", "P(A or B) = P(A) + P(B) − P(A and B)", "Always true"],
          ["Special multiplication", "P(A and B) = P(A) × P(B)", "Only if A and B are independent"],
          ["General multiplication", "P(A and B) = P(A) × P(B | A)", "Always true"],
          ["Conditional", "P(B | A) = P(A and B) ÷ P(A)", "Probability of B given A has happened"],
          ["Complement", "P(not A) = 1 − P(A)", "Car starts on a rainy day 0.4 → doesn't start 0.6"]
        ])}
        ${G.w("probrules")}
        <h3>The handbook's examples</h3>
        ${G.table(["Situation", "Working", "Answer"], [
          ["Two molding machines, each works with P = 0.8; will at least one run?", "0.8 + 0.8 − 0.8 × 0.8", "0.96 — redundancy"],
          ["Board from supplier B (0.3) or C (0.5)", "0.3 + 0.5 (one board, one supplier)", "0.8"],
          ["Assembly needs component A (0.7) and B (0.8)", "0.7 × 0.8", "0.56"],
          ["Lot of 50 with 10 defective; draw 3 without replacement — all defective?", "10/50 × 9/49 × 8/48", "0.0061"],
          ["Urn: 3 white, 2 black; first two draws both black", "2/5 × 1/4", "0.10"]
        ])}
        ${G.w("drawprob")}
        ${G.w("relsort")}
        ${G.trap(`<p><b>Mutually exclusive is not independent.</b> If A and B can't happen together, then knowing A happened tells you B didn't — that's the opposite of independence. Mutually exclusive events with nonzero probabilities are always dependent.</p><p>Without replacement, draws are dependent (the odds change each time); with replacement, they're independent.</p>`)}
        ${G.tab(`<p>Tab the rules box (p. 183). Exam stems signal the rule: “either… or” → addition; “both… and” → multiplication; “can't happen at the same time” → drop the overlap term; “without replacement” → shrink the numerator and denominator each draw.</p>`)}`
    },
    {
      id: "counting", title: "Permutations and combinations", bok: "III.B.1", level: "Understand", pages: "186–187",
      html: `
        <div class="grid2">
          <div class="card"><h4>Permutation — order matters</h4><p class="formula">nPr = n! ÷ (n − r)!</p><p>AB ≠ BA: seating two people on a plane (window and aisle) is a permutation. Letters of “SIGMA” all at once: 5P5 = 5! = 120.</p></div>
          <div class="card"><h4>Combination — order doesn't matter</h4><p class="formula">nCr = n! ÷ [r!(n − r)!]</p><p>AB = BA: choosing a 3-person task force from 10 volunteers: 10C3 = 120. Spreadsheet: =COMBIN(10,3).</p></div>
        </div>
        <p>Useful identities: 0! = 1, nPn = n!, nCn = nC0 = 1. Every combination can be arranged r! ways, so nPr = nCr × r!.</p>
        ${G.w("counting")}
        ${G.flag(`<p>p. 187 says the task-force formula counts “combinations of three objects from a collection of <b>seven</b> objects”. The example has <b>ten</b> volunteers, and the answer 120 = 10C3 (7C3 would be 35).</p>`)}
        ${G.trap(`<p>Both worked examples happen to equal 120 — 5P5 and 10C3. Don't anchor on the number; decide first whether order matters (seats, rankings, sequences → permutation; committees, samples, hands of cards → combination).</p>`)}`
    },
    {
      id: "clt", title: "Central limit theorem and standard error", bok: "III.B.2", level: "Understand", hy: true, pages: "188–191",
      html: `
        <p>The <b>central limit theorem</b>: averages of samples tend to be normally distributed even when the individual values are not. Three statements:</p>
        <ol class="steps-v">
          <li><p>The mean of the sampling distribution of means equals the population mean μ.</p></li>
          <li><p>The variance of the sample means equals σ² ÷ n, so their standard deviation — the <b>standard error</b> — is σ ÷ √n.</p></li>
          <li><p>If the population is normal, the sample means are normal at any n. If not, they become more nearly normal as n grows; the stranger the population, the larger n must be. n ≥ 30 is the usual rule of thumb.</p></li>
        </ol>
        ${G.w("clt")}
        ${G.table(["Where the CLT matters", "Why"], [
          ["Confidence intervals", "x̄ ± Z × σ/√n relies on x̄ being normal; Z × σ/√n is the margin of error"],
          ["Hypothesis tests", "Test statistics for means assume a normal sampling distribution"],
          ["Control charts", "X̄ charts plot averages, so they're robust to non-normal individual data"]
        ])}
        <p>Example (p. 190): a chemical filling process has σ = 0.012 mg. For n = 16 the standard error is 0.012 ÷ √16 = 0.003 mg, and with a process average of 10 mg the 95% interval is 10 ± 1.96 × 0.003 = 9.9941 to 10.0059 mg.</p>
        ${G.w("cimean")}
        ${G.flag(`<p>p. 190 calls σ/√n = 0.003 the “sample standard deviation”. It's the <b>standard error of the mean</b> — the spread of averages, not of individual fillings (which stays 0.012).</p>`)}
        ${G.trap(`<p>To halve the standard error you need <b>four times</b> the sample size, because of the square root. And the CLT is about the distribution of <i>averages</i> — it doesn't make individual data normal, so capability studies still need a normality check on individuals.</p>`)}`
    },
    {
      id: "inference", title: "Descriptive vs inferential statistics", bok: "III.B.2", level: "Understand", pages: "191–192",
      html: `
        ${G.table(["", "Descriptive (enumerative)", "Analytical (inferential)"], [
          ["Purpose", "Collect, organize, summarize and present data", "Draw conclusions about a population from a sample; test hypotheses; predict"],
          ["Typical outputs", "Mean, median, mode, spread, shape", "Confidence intervals, p-values, regression equations"],
          ["Typical tools", "Histograms, pie charts, box plots", "Hypothesis tests, scatter diagrams, regression"]
        ], { rowHead: true })}
        <p>A <b>parameter</b> describes a population (Greek letters: μ, σ); a <b>statistic</b> describes a sample (Latin letters: x̄, s). The sample size is the exception to the lettering rule (n for a sample, N for a population). Samples must be random so they represent the population they came from.</p>
        ${G.trap(`<p>“Is process A better than process B?” is an inferential question even when you've calculated two averages — the question is whether the difference is statistically significant, not just whether the numbers differ.</p>`)}`
    }
  ],
  check: [
    { q: "Two injection-molding machines each have a probability of 0.8 of working on a given day, independently. What is the probability that at least one is working?",
      o: ["0.64", "0.80", "0.96", "1.60"], a: 2,
      why: "P(A or B) = 0.8 + 0.8 − 0.8 × 0.8 = 0.96. The events aren't mutually exclusive, so the overlap must be subtracted.",
      d: { 0: "0.64 is P(both working).", 1: "That's one machine alone.", 3: "Adding without removing the overlap gives an impossible probability above 1." }, ref: "184" },
    { q: "Events A and B are mutually exclusive, and each has a probability greater than zero. Which statement is true?",
      o: ["A and B are independent", "P(A and B) = P(A) × P(B)", "P(A or B) = P(A) + P(B) − P(A) × P(B)", "A and B are dependent"], a: 3,
      why: "If A occurs, B can't, so P(B | A) = 0 ≠ P(B). Mutually exclusive events with nonzero probabilities are dependent.",
      d: { 0: "The classic confusion — exclusive is the opposite of independent.", 1: "For mutually exclusive events P(A and B) = 0.", 2: "That's the general rule with an independence assumption; for exclusive events the overlap is zero." }, ref: "183–185" },
    { q: "A lot of 50 units contains 10 defectives. Three units are drawn at random without replacement. The probability that all three are defective is closest to:",
      o: ["0.0061", "0.0080", "0.0600", "0.2000"], a: 0,
      why: "10/50 × 9/49 × 8/48 = 720 ÷ 117,600 = 0.0061.",
      d: { 1: "(10/50)³ = 0.008 assumes replacement.", 2: "Not a product of the draw probabilities.", 3: "That's the first draw only." }, ref: "185" },
    { q: "A supervisor must choose 3 of 10 operators for a training class. The order of selection doesn't matter. How many different groups are possible?",
      o: ["30", "120", "720", "1,000"], a: 1,
      why: "10C3 = 10! ÷ (3! × 7!) = 120.",
      d: { 0: "10 × 3 has no counting meaning here.", 2: "10P3 = 720 counts ordered selections.", 3: "10³ allows repeats and order." }, ref: "187" },
    { q: "A process has σ = 0.012 mg. For samples of 16, the standard deviation of the sample means is:",
      o: ["0.012 mg", "0.00075 mg", "0.003 mg", "0.048 mg"], a: 2,
      why: "Standard error = σ ÷ √n = 0.012 ÷ 4 = 0.003 mg.",
      d: { 0: "That's the spread of individual values.", 1: "Dividing by n (16) instead of √n.", 3: "Multiplying instead of dividing." }, ref: "190" },
    { q: "Why are X̄ control charts considered robust to non-normal individual measurements?",
      o: ["Control limits are set at ±3σ of the individuals", "Subgroup averages tend toward a normal distribution as the central limit theorem predicts", "Non-normal data are removed before plotting", "The range chart corrects the averages"], a: 1,
      why: "The CLT says averages tend to be normal even when individuals are not, so charts of averages behave as the normal-theory limits assume.",
      d: { 0: "X̄ limits use the spread of averages, not individuals.", 2: "Nothing is removed — that would hide real behaviour.", 3: "The R chart tracks spread; it doesn't adjust X̄." }, ref: "190" },
    { q: "Which statement correctly describes a parameter?",
      o: ["A numerical value describing a sample, written with Latin letters", "Any value calculated by statistical software", "The size of a sample", "A numerical value describing a population, written with Greek letters"], a: 3,
      why: "Parameters describe populations (μ, σ); statistics describe samples (x̄, s).",
      d: { 0: "That's a statistic.", 1: "Software computes both statistics and estimates of parameters.", 2: "Sample size is n — the one exception to the lettering rule." }, ref: "191–192" }
  ]
});
