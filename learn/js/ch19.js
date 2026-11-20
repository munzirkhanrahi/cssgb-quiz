G.chapter({
  id: "ch19", num: 19, title: "Design of Experiments", bok: "V.A", pages: "336–359", drill: 33,
  lede: "Change several factors on purpose, in a planned pattern, and read which ones move the response. The BoK tests vocabulary at Understand level and reading main-effect and interaction plots at Apply level — alias structures and resolution are Black Belt depth.",
  sections: [
    {
      id: "terms", title: "Basic terms", bok: "V.A.1", level: "Understand", hy: true, pages: "336–338, 340–342",
      html: `
        ${G.table(["Term", "Meaning", "Example"], [
          ["Factor (independent variable)", "A variable the experimenter controls — the stimulus", "Oven temperature"],
          ["Level", "A setting of a factor; quantitative or qualitative", "180, 200, 220 °F; on/off; operator 1–4"],
          ["Treatment", "One level of one factor, or a specific combination of levels compared with others", "Pressure at 200 psi"],
          ["Treatment combination", "The set of levels for all factors in one run", "200 psi, 70 °F, feed high"],
          ["Response (dependent variable)", "The observed outcome of a treatment", "Moisture content"],
          ["Block", "A portion of material or environment that is alike within itself and different from other portions", "Samples from one batch"],
          ["Experimental error", "Variation in the response when factors and levels are held constant", "Run-to-run noise"],
          ["Planned grouping", "Grouping to make blocks uniform and minimise unwanted variables", "—"],
          ["Main effect", "Average response at a factor's high level minus at its low level", "S = 4.25 − 6.75 = −2.50"],
          ["Interaction", "The effect of one factor depends on the level of another", "Feed matters only at high coolant"],
          ["Confounding", "An effect cannot be separated from another factor or interaction", "C aliased with A×B in a half fraction"]
        ])}
        <div class="grid2">
          <div class="card"><h4>Replication</h4><p>Repeat the <b>whole set</b> of treatment combinations, in random order, <b>resetting each trial condition</b>. Captures setup-to-setup variation and estimates experimental error. Costs more time and money.</p></div>
          <div class="card"><h4>Repetition</h4><p>Run trials again <b>under the same machine setup</b> without resetting. Cheaper, but cannot capture variation caused by the setup itself.</p></div>
        </div>
        ${G.w("doeterms")}
        ${G.trap(`<p>Replication and repetition are the chapter's favourite close difference. The test word is <b>reset</b>: if each run's conditions are reset (and the order randomized), it is replication.</p>`)}
        ${G.flag(`<p>p. 338 says Fisher developed DOE “in the 1920s and 1980s”. Read <b>1920s and 1930s</b> — Fisher began at Rothamsted in 1919 and published <i>The Design of Experiments</i> in 1935. The same page says an independent variable “does not have interactions with other variables”; factors certainly can interact — that is what interaction effects measure. The point is only that the experimenter sets them.</p>`)}
        ${G.tab(`<p>pp. 336–338: tab the definitions and box replication and repetition side by side.</p>`)}`
    },
    {
      id: "plan", title: "Planning and running an experiment", bok: "V.A.1", level: "Understand", pages: "338–345",
      html: `
        <p>The purpose of a designed experiment is to generate knowledge about a product or process: which independent variables (control or signal factors) affect the dependent variables, in the presence of noise factors.</p>
        <h3>Four steps to build a design</h3>
        <ol class="steps-v">
          <li><p>Define an objective — measurable and tied to enterprise goals.</p></li>
          <li><p>Define the variables that will be controlled.</p></li>
          <li><p>Define the response variables and check their measurement precision.</p></li>
          <li><p>Choose a design that fits the objective, the number of factors and the measurement precision.</p></li>
        </ol>
        <p>Choose levels with the guideline “<b>be bold but not foolish</b>”, set a budget of time and resources, and usually start with a modest <b>screening</b> design to find what deserves further study. An iterative series of two or three experiments is normal.</p>
        ${G.w("doeobj")}
        <h3>Assumptions that must hold</h3>
        <ul>
          <li><b>Measurement system capability</b> — confirmed before and throughout the experiment.</li>
          <li><b>Process stability</b> — start and end at standard set points; keep a baseline to detect drift.</li>
          <li><b>Residuals</b> (observed − predicted) — normal and independent, mean zero, constant variance.</li>
        </ul>
        <p><b>Practical habits:</b> check gauges, keep it simple, confirm every planned run is feasible, watch for drift, avoid unplanned changes, keep backup material, get buy-in, preserve all raw data (not just averages), record everything, reset equipment afterwards, and debug with practice runs that do not count.</p>
        <p>Finish with a <b>confirmation run</b> at the new settings; if it holds, update the operation sheets — the SDCA cycle locks the gain in.</p>
        ${G.trap(`<p>Key point on p. 345: DOE is <b>more suitable for optimizing a process than for solving problems</b>. And Taguchi's emphasis is <b>robustness</b> — quality designed in so it withstands noise — not simply hitting a mean.</p>`)}`
    },
    {
      id: "principles", title: "Randomization, blocking, replication and design types", bok: "V.A.1", level: "Understand", pages: "339–342, 350–351",
      html: `
        <div class="grid3">
          <div class="card"><h4>Randomization</h4><p>Run tests in chance order to spread noise (e.g. morning versus afternoon) across all treatments. Numbering 40 tests and running them in random order is a completely randomized design.</p></div>
          <div class="card"><h4>Blocking</h4><p>Group runs into batches to remove a known nuisance variable — e.g. first three replicates on first shift, last two on second shift. A randomized block design randomizes within each block.</p></div>
          <div class="card"><h4>Replication</h4><p>Repeat all treatment combinations in random order to estimate error and increase precision.</p></div>
        </div>
        ${G.w("designpick")}
        ${G.w("runs")}
        ${G.trap(`<p>A <b>Latin square</b> needs equal numbers of rows, columns and treatments and assumes <b>no interactions</b> — so it is not a factorial design. A Youden square keeps columns equal to treatments but allows a wider choice of rows.</p>`)}`
    },
    {
      id: "effects", title: "Main effects and interaction plots", bok: "V.A.2", level: "Apply", hy: true, pages: "345–348, 352–356",
      html: `
        <div class="formula">Main effect = ȳ(factor at +) − ȳ(factor at −)</div><br>
        <div class="formula">Interaction A×B = ȳ(A×B column +) − ȳ(A×B column −)</div>
        <p>Build interaction columns by multiplying the factor signs: same signs give +, different signs give −. The larger the absolute effect, the more influence the factor has. Whether it is statistically significant (versus experimental error) is settled with ANOVA.</p>
        ${G.w("doe")}
        <ul>
          <li><b>Main effects plot:</b> a steep line means a large effect; a flat line means the factor does not matter in this range — set it for cost or speed (the handbook picks the faster feed).</li>
          <li><b>Interaction plot:</b> parallel lines mean no interaction; non-parallel or crossing lines mean the best level of one factor depends on the other. When interactions exist, main effects are not additive.</li>
          <li><b>α-risk</b>: concluding there is a significant effect when there is not. <b>β-risk</b>: missing a real effect. <b>Power = 1 − β</b>; more replicates give a better error estimate and lower β.</li>
        </ul>
        ${G.trap(`<p>The 2² example (Table 19.6) has a tiny A main effect (≈0.3) but a large A×B interaction (4.0). Reading only main effects would wrongly dismiss A. Check the interaction plot before discarding a factor.</p>`)}
        ${G.flag(`<p>p. 359 says an effect is significant if its absolute value exceeds the standard error. That is a loose shortcut; the usual test compares effect ÷ standard error with a t value (about 2 for 95% confidence), or uses ANOVA. Table 19.8 is unreadable in the scan — don't rely on its numbers.</p>`, "Calibration note")}
        ${G.tab(`<p>pp. 346–348: tab the surface-finish example and write “effect = avg(+) − avg(−)” and the sign-multiplication rule in the margin.</p>`)}`
    },
    {
      id: "fractional", title: "Full vs fractional factorials and confounding", bok: "V.A.2", level: "Apply", hy: true, pages: "348–350, 353–359",
      html: `
        <div class="grid2">
          <div class="card"><h4>Full factorial</h4><p>Every combination of every level (L<sup>F</sup> runs). Main effects and all interactions are estimated cleanly. Expensive as factors grow.</p></div>
          <div class="card"><h4>Fractional factorial</h4><p>A balanced subset of runs (2<sup>F−p</sup>). Much cheaper; used for quick screening when interactions are believed negligible. The price is <b>confounding</b>.</p></div>
        </div>
        <p>A design is <b>balanced</b> when each setting of each factor appears the same number of times with each setting of every other factor.</p>
        ${G.w("alias")}
        <p>The handbook's software example screens seven factors in eight runs (a 2<sup>7−4</sup> design). Its effects: quality assurance (G) +23, architecture (C) +20, requirements (A) +13, design (D) +5, and zero for B, E and F — with interactions assumed away. ANOVA then finds only <b>G and C</b> significant: a large-looking effect (A = 13) can still be noise.</p>
        ${G.flag(`<p>p. 356 gives the half-fraction steak average as 76.67. The four runs (88, 58, 67, 84) average <b>74.25</b>. The effects shown (23.5, −6.5, 2.5) are correct.</p>`)}
        ${G.trap(`<p>Why run a full factorial if a fraction costs half? Because in the fraction a main effect may really be an interaction (C = A×B). Fractions are justified when earlier full factorials showed the interactions are not significant.</p>`)}`
    }
  ],
  check: [
    { q: "A team reruns all eight treatment combinations in a new random order, resetting the machine to each condition before every run. This is:",
      o: ["Repetition", "Blocking", "Replication", "Randomization only"], a: 2,
      why: "Repeating the whole set of treatment combinations with each condition reset is replication.",
      d: { 0: "Repetition re-runs trials under the same setup without resetting.", 1: "Blocking groups runs to remove a nuisance variable.", 3: "Random order is part of it, but the defining act is repeating the full set with resets." }, ref: "337–338" },
    { q: "Lower surface-finish scores are better. Runs at 1800 rev/min gave 6, 2, 6 and 3; runs at 1300 rev/min gave 10, 4, 7 and 6. What is the main effect of speed (high minus low)?",
      o: ["−2.50", "+2.50", "4.25", "−10.0"], a: 0,
      why: "Average at 1800 = 17/4 = 4.25; average at 1300 = 27/4 = 6.75; effect = 4.25 − 6.75 = −2.50.",
      d: { 1: "Subtracts in the wrong direction (low − high).", 2: "That is only the high-level average.", 3: "Difference of the sums, not of the averages." }, ref: "346–347" },
    { q: "On an interaction plot, the line for factor B at its low level slopes down across factor A while the line for B high slopes up, and the lines cross. This indicates:",
      o: ["No interaction between A and B", "Factor A has no main effect", "A large experimental error", "A strong A×B interaction"], a: 3,
      why: "Non-parallel, crossing lines mean the effect of A depends on the level of B.",
      d: { 0: "No interaction shows as parallel lines.", 1: "A's main effect may be small, but the plot tests interaction, not main effects.", 2: "The plot of means says nothing directly about error; ANOVA does." }, ref: "347–348" },
    { q: "A full factorial experiment studies four factors at two levels each, with two replicates. How many tests are run?",
      o: ["16", "32", "8", "64"], a: 1,
      why: "2⁴ = 16 runs per replicate × 2 replicates = 32.",
      d: { 0: "One replicate only.", 2: "A half fraction of 2⁴ with no replicate.", 3: "Treats the design as 2⁶ or doubles twice." }, ref: "355" },
    { q: "In a half-fraction 2³⁻¹ design, the column of signs for factor C is identical to the A×B interaction column. This means:",
      o: ["The C effect cannot be separated from the A×B interaction", "Factor C has no effect on the response", "The design is no longer balanced", "Factors A and B must be the same variable"], a: 0,
      why: "Identical columns are confounded (aliased): the calculated effect is the combination of both.",
      d: { 1: "Confounding says nothing about the size of C's effect.", 2: "The half fraction is still balanced.", 3: "A and B remain distinct factors." }, ref: "349" },
    { q: "Which statement about a Latin square design is NOT correct?",
      o: ["Rows, columns and treatments must be equal in number", "It can block two noise variables, such as day and machine", "It assumes there are no interactions", "It estimates all two-factor interactions"], a: 3,
      why: "A Latin square assumes no interactions, so it is not a factorial and cannot estimate them.",
      d: { 0: "True — required.", 1: "True — the handbook's day × machine example.", 2: "True — a stated condition." }, ref: "340, 351" },
    { q: "Increasing the number of replicates in an experiment primarily:",
      o: ["Increases the α-risk", "Removes the need to randomize run order", "Improves the error estimate, lowering β-risk and raising power", "Turns a fractional factorial into a full factorial"], a: 2,
      why: "More replicates give a more precise estimate of experimental error, which reduces β and increases power (1 − β).",
      d: { 0: "α is set by the experimenter, not raised by replication.", 1: "Randomization is still required.", 3: "Replication repeats runs; it does not add the missing treatment combinations." }, ref: "347" },
    { q: "Parts made before noon differ from parts made after noon. The team runs the first three replicates of every treatment on first shift and the last two on second shift, so the shift effect can be separated. This technique is:",
      o: ["Randomization", "Blocking", "Replication", "Confounding"], a: 1,
      why: "Grouping runs by a known nuisance variable is blocking (a randomized block design).",
      d: { 0: "Randomization spreads unknown noise; this deliberately groups a known one.", 2: "Replication is already present; the shift grouping is the blocking.", 3: "Confounding is an unwanted inability to separate effects." }, ref: "341–342" }
  ]
});
