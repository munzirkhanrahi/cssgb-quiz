G.chapter({
  id: "ch3", num: 3, title: "Design for Six Sigma Methodologies", bok: "I.C", pages: "52–76", drill: 24,
  lede: "Design quality in before the product exists, then study how it can fail. The road maps are Understand level; basic FMEA is the only Analyze-level item in Part I — expect RPN calculations and rating-scale traps — and design vs process FMEA is Apply level.",
  sections: [
    {
      id: "roadmaps", title: "DFSS road maps: DMADV and IDOV", bok: "I.C.1", level: "Understand", hy: true, pages: "52–57",
      html: `
        <p><b>Design for Six Sigma</b> is proactive rather than reactive design quality: a systematic process that creates producible designs by reducing and managing variation to meet customer expectations. Common road maps: <b>DMADV</b> and <b>IDOV</b> (others: DCOV, ICOV, DMEDI, IDDOV).</p>
        ${G.w("dfssmap")}
        ${G.w("dfsspick")}
        ${G.w("idovphase")}
        <p><b>Scoping pitfalls:</b> too small a scope (too few control factors for robustness), a vague scope with no subsystem named, separate projects for each symptom, and too much time on rating systems. Plan for <b>noise</b> — whatever you can't control in manufacturing or in the customer's hands; if a product can be misused, it will be. The usual root cause of DFSS failure is too few control factors.</p>
        <p class="small"><b>Benefits:</b> customer satisfaction (measured on the Kano model), reduced variation, robust design, lower warranty cost, better reliability and durability, market share, revenue, and less downtime from defects.</p>
        ${G.trap(`<p>DMADV is for a product or process that <b>doesn't exist</b>, or one that exists and is optimized but <b>still can't meet needs</b>. An existing process with a performance problem is DMAIC.</p>`)}
        ${G.flag(`<p>p. 54 heads IDOV's last phase “Validate”, but the acronym (and the BoK) say <b>verify</b>. Same tasks: prototype test and validation, failure modes and reliability, design iteration, final phase review.</p>`, "Calibration note")}`
    },
    {
      id: "dfx", title: "Design for X", bok: "I.C.1", level: "Understand", pages: "55–57",
      html: `
        <p>DMADV's Design phase makes sure outputs carry the desired attributes as requirements, not as an expensive extra layer. The handbook's list: cost, manufacturing / producibility / assembly, test, maintainability, robustness, usability, extended functionality, efficiency, performance, security, scalability, agility, compliance.</p>
        ${G.w("dfx")}
        <h3>Robustness and failure rate</h3>
        <div class="grid2">
          <div class="fcell"><h4>Non-repairable items</h4><div class="formula">MTTF = 1 / λ</div><p>Mean time to failure</p></div>
          <div class="fcell"><h4>Repairable items</h4><div class="formula">MTBF = 1 / λ</div><p>Mean time between failures</p></div>
        </div>
        ${G.w("mtbf")}
        ${G.trap(`<p><b>MTTF</b> is for items you replace (a bulb); <b>MTBF</b> for items you repair (a pump). The 1/λ relationship holds for a constant failure rate.</p>`)}`
    },
    {
      id: "verval", title: "Verification vs validation", bok: "I.C.1", level: "Understand", hy: true, pages: "57",
      html: `
        <div class="grid2">
          <div class="card"><h4>Verification (ISO 9000:2015, 3.8.12)</h4><p>Confirmation, through objective evidence, that <b>specified requirements</b> have been fulfilled. Done during APQP or tollgates, by the Green Belt, others in the company or a third party — before full release to production.</p></div>
          <div class="card"><h4>Validation (3.8.13)</h4><p>Confirmation, through objective evidence, that the requirements for a <b>specific intended use or application</b> have been fulfilled — for example through internal audits, or the Rice and Munro model for learning outcomes.</p></div>
        </div>
        ${G.w("verval")}
        ${G.trap(`<p>Shorthand: verification = “did we build it right?” (against the spec); validation = “did we build the right thing?” (for the intended use, by the intended users, in the intended environment). The handbook's design-for-usability paragraph uses exactly that framing for validation.</p>`)}
        ${G.tab(`<p>p. 57: highlight “specified requirements” and “specific intended use” — the two phrases that decide every item.</p>`)}`
    },
    {
      id: "fmea", title: "FMEA: purpose, team and steps", bok: "I.C.2", level: "Analyze", hy: true, pages: "58–67",
      html: `
        <p>FMEA is the <b>study of risk</b>, scored on three aspects: impact (<b>severity</b>), probability (<b>occurrence</b>) and event (<b>detection</b>). Its fundamental reason: to <b>predict the highest likelihood of things that could go wrong</b> — at concept, design, process, machinery or system level — and prevent them. It began as the U.S. military's FMECA procedure (1949) and spread through NASA, Ford and the automotive industry (AIAG, SAE J-1739).</p>
        <p><b>Team:</b> cross-functional, typically <b>five to seven</b> people, with process experts in a design FMEA and design experts in a process FMEA. FMEA is a <b>living document</b> — revision-controlled, part of the quality management system, linked to QFD and to control plans.</p>
        <h3>Three questions behind every row (Figure 3.4)</h3>
        <ol><li>What can go wrong? (no function, partial or degraded function, intermittent, unintended function)</li><li>What are the effects, and how bad are they?</li><li>What can be done? (design or process changes, special controls, changes to standards and procedures)</li></ol>
        <h3>The 13 steps (Table 3.2)</h3>
        <ol class="small">
          <li>Review the design (block diagram) or process (flowchart, walk-through)</li><li>Brainstorm potential failure modes</li><li>List the potential effects of each</li><li>Assign severity (S)</li><li>List potential causes</li><li>Assign occurrence (O)</li><li>List current controls (prevent or detect)</li><li>Assign detection (D)</li><li>Calculate RPN = S × O × D</li><li>Develop an action plan with owners and dates</li><li>Take action — where many FMEAs fall apart</li><li>Recalculate the RPN from objective evidence</li><li>Periodically review and update for new risks</li>
        </ol>
        ${G.trap(`<p>FMEA is not a process map of sequential steps and not a way to rank customer requirements or build a house of quality — those are the distractors in the ASQ sample item on its purpose.</p>`)}`
    },
    {
      id: "rpn", title: "Rating scales and the risk priority number", bok: "I.C.2", level: "Analyze", hy: true, pages: "67–71",
      html: `
        <div class="grid3">
          <div class="card"><h4>Severity</h4><p>How serious the effect. 1 = no discernible effect; 9–10 = hazardous (10 without warning).</p></div>
          <div class="card"><h4>Occurrence</h4><p>How often the cause happens. Daily ≈ 8–10; under 0.01 per thousand = 1.</p></div>
          <div class="card"><h4>Detection</h4><p><b>Reversed:</b> easy to detect = low (1–2); cannot detect = 10.</p></div>
        </div>
        ${G.w("sodscale")}
        <div class="formula">RPN = S × O × D (range 1–1,000)</div>&nbsp;&nbsp;<div class="formula">Criticality = S × O</div>
        <p>Figure 3.6: 2 × 8 × 10 = 160; 10 × 5 × 2 = 100; 8 × 2 × 9 = 144. A Pareto of RPNs shows where to act first; some industries put severity ahead of RPN.</p>
        ${G.w("rpnlab")}
        <div class="grid2">
          <div class="card"><h4>Do</h4><ul class="small"><li>Train the team first; always use a team</li><li>Ask customers how they will use the product</li><li>Standardize scales for your business</li><li>Brainstorm even rare failure modes</li><li><b>Equal RPNs: escalate the higher severity</b></li><li>Reassess after action; add new risks</li></ul></div>
          <div class="card"><h4>Don't</h4><ul class="small"><li>Copy scales from another industry</li><li>Force a 1–10 scale if 1–5 fits</li><li>Fight over 4 vs 5 (but analyze 4 vs 7)</li><li>Play a numbers game</li><li>Do FMEA just to comply</li></ul></div>
        </div>
        ${G.trap(`<p>RPNs are <b>relative</b> — compare them within one FMEA, not across organizations. A cutoff too low spends resources on many minor risks; too high misses important ones. Reducing <b>severity</b> usually requires a redesign; occurrence and detection respond to better prevention and controls.</p>`)}
        ${G.flag(`<ul>
          <li><b>p. 71, Figure 3.7:</b> the scan shows Risk 6 with S = 8 and Risk 4 (after) with D = 5, but the printed RPNs (42 and 75) only work with <b>S = 3</b> and <b>D = 3</b>. The lab above uses the corrected values.</li>
          <li><b>p. 71, “risk rating”:</b> the 2019 AIAG &amp; VDA FMEA Handbook replaced the RPN with <b>Action Priority (AP)</b> — high, medium or low, weighting severity first. The exam still uses RPN.</li>
          <li><b>p. 58:</b> ISO 31000:2018 is titled <i>Risk management — Guidelines</i>; “Principles and guidelines” was the 2009 title.</li>
        </ul>`, "Handbook check")}
        ${G.tab(`<p>pp. 66–68: tab Table 3.2 and the three rating tables; write “D is reversed” in red.</p>`)}`
    },
    {
      id: "types", title: "Design FMEA vs process FMEA", bok: "I.C.3", level: "Apply", hy: true, pages: "74–76",
      html: `
        ${G.table(["", "Design FMEA (DFMEA)", "Process FMEA (PFMEA)"], [
          ["Asks", "How can the product design fail to perform its function?", "How can the manufacturing or assembly process step fail?"],
          ["Used by", "Designers and process engineers", "Process and manufacturing engineers"],
          ["Starts from", "Schematic or functional block diagram", "Process flowchart and a walk-through"],
          ["Timing", "Early, before tooling is cut", "When the manufacturing or assembly layout is first developed"],
          ["Example", "A toy part could come loose and choke a child; a tire jack could slip", "An operator could load the part backwards"]
        ], { rowHead: true })}
        <p>Sequence: <b>concept FMEA → design FMEA → process FMEA</b> (machinery and system FMEAs also exist). Each can be done at system, subsystem or component level. In practice there is often no concept or design FMEA, and engineers must build the process FMEA without knowing the full design intent. Check the header block to see which type you are reading — the forms are nearly identical.</p>
        ${G.w("fmeatype")}
        ${G.trap(`<p>Ask what fails: the <b>thing</b> (design) or the <b>making of the thing</b> (process). A step's effect on the product is still a process FMEA if the cause is in the process.</p>`)}`
    }
  ],
  check: [
    { q: "In the IDOV road map, designing for robust performance and reliability happens in which phase?",
      o: ["Identify", "Design", "Optimize", "Verify"], a: 2,
      why: "Optimize develops detailed design elements: capability, robustness, error-proofing, tolerancing.",
      d: { 0: "Identify links the design to the VOC.", 1: "Design formulates the concept and runs FMEA and DOE.", 3: "Verify prototypes and tests." }, ref: "54" },
    { q: "Achieving aggressive benchmarks or breakthroughs on a consistent basis — such as aircraft faster than sound — is design for:",
      o: ["Robustness", "Performance", "Scalability", "Agility"], a: 1,
      why: "The handbook's definition of design for performance.",
      d: { 0: "Life-cycle testing and MTBF.", 2: "Handling growth in users or scope.", 3: "Delivering customized solutions quickly." }, ref: "56" },
    { q: "Confirmation, through objective evidence, that specified requirements have been fulfilled is:",
      o: ["Validation", "Calibration", "Qualification", "Verification"], a: 3,
      why: "ISO 9000:2015, 3.8.12.",
      d: { 0: "Validation concerns a specific intended use.", 1: "Calibration compares a gauge with a standard.", 2: "Not the ISO term defined here." }, ref: "57" },
    { q: "DMADV is more appropriate than DMAIC when:",
      o: ["A product or process does not exist yet and must be developed", "An existing process has excessive scrap", "A control chart shows a special cause", "The team needs a quick kaizen event"], a: 0,
      why: "Breyfogle: DMADV fits a new product or process, or an optimized one that still can't meet needs.",
      d: { 1: "Existing process → DMAIC.", 2: "Investigate and remove the special cause.", 3: "A kaizen event is a lean tool." }, ref: "54–55" },
    { q: "A failure mode is rated S = 8, O = 3 and D = 6. What are its RPN and criticality?",
      o: ["RPN 17; criticality 24", "RPN 144; criticality 24", "RPN 144; criticality 48", "RPN 24; criticality 144"], a: 1,
      why: "RPN = 8 × 3 × 6 = 144; criticality = S × O = 24.",
      d: { 0: "Adds the ratings.", 2: "Uses S × D for criticality.", 3: "Swaps the two." }, ref: "66" },
    { q: "On a typical 1–10 detection scale, a failure the operator obviously sees every time it happens is rated:",
      o: ["9 or 10", "About 5", "1 or 2", "It is not rated"], a: 2,
      why: "Detection runs in reverse: the easier to detect, the lower the number.",
      d: { 0: "That is for failures that cannot be detected.", 1: "Moderate detection.", 3: "Every failure mode gets a detection rating." }, ref: "67" },
    { q: "Two failure modes both have an RPN of 120: one is S 10 × O 4 × D 3, the other S 4 × O 6 × D 5. Following the handbook, which is escalated?",
      o: ["The second — its occurrence is higher", "Neither; equal RPNs mean equal priority", "Whichever is cheaper to fix", "The first — it has the higher severity"], a: 3,
      why: "When two risks score the same, escalate the one with the higher severity.",
      d: { 0: "Occurrence is not the tie-breaker.", 1: "The handbook gives a tie-breaker.", 2: "Cost is not the rule." }, ref: "70" },
    { q: "The fundamental reason for using an FMEA is to:",
      o: ["Predict the things most likely to go wrong so they can be prevented", "Lay out the sequential steps of a process", "Build the first room of a house of quality", "Rank customer requirements by importance"], a: 0,
      why: "FMEA predicts and prevents risk.",
      d: { 1: "That is a flowchart or process map.", 2: "QFD is an unrelated tool.", 3: "That is VOC prioritization." }, ref: "59" },
    { q: "A team asks whether a toddler could pull a small part off a toy and choke on it. Which analysis is this?",
      o: ["Design FMEA", "Process FMEA", "Machinery FMEA", "A control plan"], a: 0,
      why: "A product design hazard — the handbook's own design FMEA example.",
      d: { 1: "Process FMEA asks how manufacturing or assembly can fail.", 2: "Machinery FMEA covers tooling and equipment.", 3: "A control plan holds gains in production." }, ref: "75" }
  ]
});
