G.chapter({
  id: "ch13", num: 13, title: "Collecting and Summarizing Data", bok: "III.D", pages: "206–232", drill: 27,
  lede: "Four BoK topics at four different levels — Analyze (data types), Apply (sampling and data collection), Evaluate (descriptive statistics) and Create (graphs). The higher levels mean scenario items: which graph answers this question, what does this box plot or run chart tell you, is this sample plan sound.",
  sections: [
    {
      id: "types", title: "Types of data and measurement scales", bok: "III.D.1", level: "Analyze", hy: true, pages: "206–207",
      html: `
        <div class="grid3">
          <div class="card"><h4>Continuous (variables)</h4><p>From measuring on a continuous scale — length, weight, temperature, time. Between any two values there are infinitely many others.</p></div>
          <div class="card"><h4>Discrete (attributes)</h4><p>From counting — paint runs per batch, valves that leaked, bubbles per square foot of glass, pass/fail.</p></div>
          <div class="card"><h4>Locational</h4><p>Where the defect is — essential for rework on large items. Displayed on a measles chart.</p></div>
        </div>
        <p><b>Move from discrete to continuous whenever you can:</b> variables control charts are more sensitive to process changes; in designed experiments, continuous data can show a change while the pass/fail count hasn't moved; and discrete data need much larger samples for the same protection against Type II (consumer's) risk.</p>
        ${G.table(["Scale", "Property", "Example", "Allowed statistics (cumulative)"], [
          ["Nominal", "Names only; no order", "Color-coded wires", "Count, mode, chi-square"],
          ["Ordinal", "Ordered; gaps unknown", "Defect criticality: critical, major, minor", "+ median, interquartile range, sign test"],
          ["Interval", "Equal intervals; arbitrary zero", "°C: 20 → 40 is the same step as −10 → −30", "+ mean, standard deviation, t- and F-tests"],
          ["Ratio", "Equal intervals; true zero", "Weight, cycle time: 10 ÷ 5 = 64 ÷ 32", "+ geometric mean, coefficient of variation"]
        ])}
        ${G.w("scales")}
        ${G.w("contdisc")}
        ${G.trap(`<p>A 1-to-5 satisfaction rating looks numeric but is <b>ordinal</b> — you can rank it, but the mean of ordinal codes is suspect. Temperature in °C is interval, not ratio: 40 °C isn't “twice as hot” as 20 °C.</p>`)}`
    },
    {
      id: "collect", title: "Sampling and data collection plans", bok: "III.D.2", level: "Apply", hy: true, pages: "207–213",
      html: `
        <p>Plan before collecting — answer <b>5W1H</b>: what, why, where, when, who and how. Collecting more data than needed is common and expensive. Real-time automatic capture reduces human and transfer errors and lets you act quickly, at a cost in infrastructure.</p>
        ${G.table(["Data collection plan element", "Includes"], [
          ["What to measure", "The measure, its type, and an <b>operational definition</b> — “cycle time” or “lead time” can mean different things to different people"],
          ["How", "Measurement or test method; data tags to stratify; collection method; <b>validation checks</b> for quality and integrity"],
          ["When", "Timing (start of shift, new material lot…) and frequency"],
          ["Where", "Process step or physical location"],
          ["Who", "Responsibility for collecting"],
          ["Sampling plan", "How many data points are needed to be statistically valid"]
        ])}
        <p>The 2022 BoK adds <b>quality checks</b> on collected data: minimum and maximum values (impossible readings), erroneous entries, and null (missing) values.</p>
        <div class="grid2">
          <div class="card"><h4>Common causes of data errors</h4><ul><li>Undefined units (feet or meters?)</li><li>Illegible handwriting (2 or Z?)</li><li>Poor gage resolution; rounding that loses precision</li><li>Emotional bias (flinching); guesswork</li><li>Several points of data entry</li><li>Poor instructions or training; ambiguous terms</li><li>Clerical and typing errors</li></ul></div>
          <div class="card"><h4>Ways to minimize them</h4><ul><li>A 5W1H data collection plan</li><li>Calibration schedule; R&amp;R studies</li><li>Record units, time, conditions, gage and recorder</li><li>Statistical tests for outliers</li><li>Error-correcting storage and transmission</li><li>Clear instructions and training</li><li><b>Data coding</b> for repetitive manual entry — it must still decode to the original values</li></ul></div>
        </div>
        ${G.table(["Sampling method", "Use when"], [
          ["Random", "The lot is homogeneous; every item has an equal chance of selection"],
          ["Stratified", "The lot mixes machines, streams, material lots or settings — divide into strata, then sample randomly within each"],
          ["Sequential", "Testing is costly or destructive (reliability tests): test one at a time until a decision is reached"],
          ["Systematic", "Every nth item — common for individuals charts and transactional sampling (Chapter 15)"]
        ])}
        ${G.w("sampling")}
        <p><b>Check sheets</b> pre-categorize outcomes so data can be tallied during the process. Steps: agree on the categories; decide who collects, over what period and how; design a sheet that fits the operation; collect consistently. Check sheets feed Pareto charts and attribute control charts. Surveys get low response rates (about 10–15%); interviews and focus groups give higher-integrity data and the chance to clarify.</p>
        ${G.trap(`<p>Random sampling from a mixed lot is the error the handbook warns about — it can produce more nonconformance than the AQL plan anticipates. When parts come from several machines or streams, <b>stratify</b> first.</p>`)}`
    },
    {
      id: "desc", title: "Descriptive statistics", bok: "III.D.3", level: "Evaluate", hy: true, pages: "213–216",
      html: `
        <p>Three things to describe in any data set: <b>center</b>, <b>spread</b> and <b>shape</b>.</p>
        ${G.table(["Measure", "Symbol", "Definition"], [
          ["Mean", "x̄ (sample), μ (population)", "Σx ÷ n — the most useful center in quality work"],
          ["Median", "x̃", "Middle value of the sorted data; average the two middle values when n is even"],
          ["Mode", "", "Most frequent value; there may be several or none"],
          ["Range", "R", "Highest − lowest"],
          ["Sample standard deviation", "s", "√[Σ(x − x̄)² ÷ (n − 1)] — estimates the population σ"],
          ["Population standard deviation", "σ", "Same formula with N in the denominator, using μ"]
        ])}
        <p>Example (p. 214): 15 critical dimensions sum to 81.121, so the mean is 5.408; sorted, the eighth value is the median, 5.392. Shape can also be described by symmetry, skewness and kurtosis.</p>
        <p>A <b>frequency distribution</b> counts values per class; adding a running total gives a <b>cumulative frequency distribution</b> (Figure 13.3), often plotted as an ogive.</p>
        ${G.w("desc")}
        ${G.trap(`<p>s divides by n − 1; σ divides by N. Calculators label them differently (σₙ₋₁ and σₙ, or s and σ) — know which key you're pressing. In a right-skewed distribution the mean is pulled toward the tail, above the median.</p>`)}
        ${G.tab(`<p>Tab the summary of descriptive measures (p. 216) and write your calculator's s and σ keys on it.</p>`)}`
    },
    {
      id: "graphs", title: "Graphical methods", bok: "III.D.4", level: "Create", hy: true, pages: "217–227",
      html: `
        ${G.table(["Graph", "Shows", "Read it for"], [
          ["Tally / frequency distribution", "Counts by class", "Peaks: unimodal, bimodal (a mixture), flat (rectangular)"],
          ["Stem-and-leaf", "Every value, grouped by stem", "Shape plus the actual digits; median is easy to find"],
          ["Box-and-whisker", "Minimum, Q1, median, Q3, maximum; outliers", "Center, spread, skew; comparing groups side by side"],
          ["Scatter diagram", "Pairs of variables", "Direction and strength of association; nonlinearity"],
          ["Run chart", "Data in time order with a median line", "Clustering, mixtures, trends, oscillation"],
          ["Normal probability plot", "Ordered data against normal scores", "Straight line ⇒ consistent with normality"]
        ])}
        ${G.w("graphpick")}
        <h3>Stem-and-leaf</h3>
        <p>Like a tally column, but each mark is the next digit of the value. The left column is a cumulative count toward the row holding the median, whose own count is in parentheses. For the 20 chemical weights (Figure 13.4), the leaf unit is 0.1, the median 10.9 falls in the row 10 | 6678899, shown as (7).</p>
        <h3>Box plot</h3>
        <p>John Tukey's box shows Q1 to Q3 with a line at the median. Whiskers reach the most extreme values within Q1 − 1.5·IQR and Q3 + 1.5·IQR; anything beyond is an outlier (*). A median off-center in the box or unequal whiskers suggests skew. Side-by-side box plots compare groups (Figure 13.8: period 2 has the widest spread).</p>
        ${G.flag(`<p>For the 9 bond-strength values, p. 220 defines Q1 as the median of the values at or below Q2 — that rule gives Q1 = 8.25 and Q3 = 9.63. The printed Q1 = 8.20 and Q3 = 9.79 come from the (n + 1)p interpolation that Minitab uses. Both are legitimate quartile methods; on the exam, follow the method the question describes.</p>`)}
        <h3>Run chart</h3>
        <p>Individual values in time order with a horizontal line at the median — no control limits. Four run tests:</p>
        ${G.table(["Too few…", "Pattern", "Too many…", "Pattern"], [
          ["Runs about the median", "Clustering (measurement problems, lot-to-lot or setup variation)", "Runs about the median", "Mixtures (two machines, operators or lots)"],
          ["Runs up or down", "Trends (tool wear, loosening fixture, drift)", "Runs up or down", "Oscillation (an unsteady process)"]
        ], { rowHead: false })}
        ${G.w("runchart")}
        <h3>Scatter diagram and correlation</h3>
        <p>Independent variable on x, dependent on y. Patterns: positive, negative, none, or nonlinear (Figure 13.10). The correlation coefficient r (−1 ≤ r ≤ +1) measures <b>linear</b> association; R² is the share of variation in y explained by x. Example (p. 229): exercise minutes 30, 45, 60, 75 vs weight loss 1, 2, 4, 4.5 lb gives S<sub>xx</sub> = 1125, S<sub>xy</sub> = 93.75, S<sub>yy</sub> = 8.1875 and r = 0.9768 (p = 0.023).</p>
        ${G.trap(`<p><b>Correlation is not causation.</b> Gold prices and infant mortality from 1930 to 2000 correlate, but neither drives the other. Use engineering judgment to choose which variables to examine. And r ≈ 0 rules out only a <i>linear</i> relationship — a curve can still be there.</p>`)}`
    },
    {
      id: "probplot", title: "Normal probability plots and Weibull plots", bok: "III.D.4", level: "Create", pages: "230–232",
      html: `
        <p>A <b>normal probability plot</b> scales the y-axis so normal data fall on a straight line. Software adds a goodness-of-fit test — most often <b>Anderson-Darling</b> (AD): a smaller AD and a larger p-value mean a better fit. Other tests: Ryan-Joiner and Shapiro-Wilk (correlation-based), Kolmogorov-Smirnov (ECDF-based, like AD).</p>
        <p>Example (Figure 13.14): 19 bond-strength values, mean 9.931, s 1.059, AD p = 0.217. With a specification of 9 to 11, the fitted normal puts about 19% below 9 and 15.6% above 11 (the handbook reads “about 20% and 17%” off the graph). Load the 19-point preset in the descriptive statistics tool above and switch to the normal probability plot to see this.</p>
        ${G.flag(`<p>“As the p-value is greater than 0.05, we can conclude that these data come from a normal distribution” (p. 230) overstates it: a large p-value means there's <b>no evidence against</b> normality, not proof of it.</p>`)}
        <h3>Weibull</h3>
        <p>Used for reliability data when the underlying distribution is unknown. Shape β tells you the life-cycle phase:</p>
        ${G.table(["β", "Failure rate", "Phase"], [
          ["&lt; 1", "Decreasing with time", "Infant mortality (early-life failures)"],
          ["≈ 1", "Constant", "Useful life — random failures"],
          ["&gt; 1", "Increasing with time", "Wear-out"]
        ])}
        <p>Example (Figure 13.15): 15 units under environmental stress, β = 6.734 (wear-out) and scale (characteristic life) η = 4.635 h.</p>
        ${G.flag(`<p>p. 232 says the Weibull mean “is at the 63.2 percentile” and reports MTBF = 4.635 h. The <b>characteristic life η</b> is the 63.2% point — that's 4.635 h. The mean (MTBF) is η × Γ(1 + 1/β) = 4.635 × 0.9335 = <b>4.33 h</b> (the data average 4.34 h), which for β = 6.7 sits near the 47th percentile. Reliability at 3.9 h from the fitted model is exp[−(3.9/4.635)^6.734] = 0.73; the handbook reads about 0.70 off the graph. A p-value &gt; 0.25 means the Weibull isn't rejected, not that it's “more probable”.</p>`)}
        ${G.trap(`<p>The 63.2% point is a property of η for <i>every</i> Weibull — and for the exponential (β = 1), where η is also the mean. That's the only case where “MTBF at 63.2% failed” is exactly right.</p>`)}`
    }
  ],
  check: [
    { q: "Defects are classified as critical, major or minor. This classification is measured on which scale?",
      o: ["Nominal", "Ordinal", "Interval", "Ratio"], a: 1,
      why: "The categories have a clear order but the distances between them are undefined — ordinal.",
      d: { 0: "Nominal categories have no order.", 2: "Interval needs equal, meaningful distances.", 3: "Ratio needs equal distances and a true zero." }, ref: "207" },
    { q: "Incoming parts arrive as a mixture from three molding machines. To estimate the defect rate, the Green Belt should use:",
      o: ["Simple random sampling of the whole lot", "Sequential sampling", "Stratified sampling by machine", "Sampling only from the machine with the most output"], a: 2,
      why: "A mixed lot isn't homogeneous; stratify by machine and sample randomly within each stratum.",
      d: { 0: "Random sampling assumes a homogeneous lot.", 1: "Sequential sampling suits costly or destructive tests.", 3: "That ignores two of the three sources." }, ref: "209–210" },
    { q: "Which statement about the sample standard deviation s is correct?",
      o: ["It divides the sum of squared deviations by n − 1", "It is always larger than the range", "It divides the sum of squared deviations by N", "It is the square of the variance"], a: 0,
      why: "s = √[Σ(x − x̄)² ÷ (n − 1)]; dividing by N gives the population formula.",
      d: { 1: "s is smaller than the range for any data set with spread.", 2: "That's the population σ.", 3: "s is the square root of the variance." }, ref: "215" },
    { q: "On a box plot, a point plotted beyond Q3 + 1.5 × (Q3 − Q1) represents:",
      o: ["The maximum whisker value", "The 95th percentile", "The median of the upper half", "A potential outlier"], a: 3,
      why: "Whiskers stop at the most extreme values inside the 1.5·IQR fences; points beyond them are flagged as outliers.",
      d: { 0: "The whisker ends at the last value inside the fence.", 1: "Box plots don't mark the 95th percentile.", 2: "That's Q3." }, ref: "221" },
    { q: "A run chart shows far fewer runs about the median than expected (p = 0.003 for clustering). The most likely explanation is:",
      o: ["A mixture of two machines alternating", "Measurement problems, lot-to-lot or setup variation", "Random common-cause variation", "Oscillation from an unsteady process"], a: 1,
      why: "Too few runs about the median means points bunch together — clustering, which the handbook ties to measurement, lot-to-lot or setup variation.",
      d: { 0: "Mixtures give too many runs about the median.", 2: "p = 0.003 says the pattern is unlikely to be random.", 3: "Oscillation is too many runs up or down." }, ref: "223–224" },
    { q: "A Green Belt wants to see whether part surface finish changes with coolant temperature. Which graph should be drawn first?",
      o: ["Pareto chart", "Histogram of surface finish", "Scatter diagram", "Box plot of coolant temperature"], a: 2,
      why: "Two continuous variables, one suspected of driving the other: a scatter diagram with temperature on x and finish on y.",
      d: { 0: "Pareto ranks categories.", 1: "A histogram shows one variable's distribution.", 3: "A box plot of one variable can't show a relationship." }, ref: "224–226" },
    { q: "A normal probability plot of 19 values gives an Anderson-Darling p-value of 0.217. The correct conclusion at α = 0.05 is:",
      o: ["The data are proven to be normal", "The data are not normal", "The sample is too small to plot", "There's no significant evidence against normality"], a: 3,
      why: "p > 0.05 means you fail to reject normality; it doesn't prove it.",
      d: { 0: "The handbook's overstatement.", 1: "A small p-value would suggest that.", 2: "19 points is enough for a probability plot." }, ref: "230" },
    { q: "A Weibull analysis of failure times gives a shape parameter β = 0.6. The units are most likely in which phase of life?",
      o: ["Infant mortality", "Useful life", "Wear-out", "It cannot be determined from β"], a: 0,
      why: "β < 1 means a decreasing failure rate — early-life failures.",
      d: { 1: "β ≈ 1 is the constant-rate random-failure period.", 2: "β > 1 is wear-out.", 3: "β is exactly what identifies the phase." }, ref: "231" }
  ]
});
