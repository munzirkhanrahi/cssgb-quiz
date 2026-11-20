G.chapter({
  id: "ch2", num: 2, title: "Lean Principles in the Organization", bok: "I.B", pages: "32–51", drill: 24,
  lede: "Value, waste and creating value without waste. Lean concepts are tested at Apply level — scenarios about the theory of constraints, takt, JIT, gemba and the wastes — and value stream mapping at Understand level.",
  sections: [
    {
      id: "concepts", title: "Lean thinking, value and the TPS house", bok: "I.B.1", level: "Apply", hy: true, pages: "32–35",
      html: `
        <p>Three concepts are fundamental to lean thinking: <b>value</b>, <b>waste</b>, and <b>the process of creating value without waste</b>. Toyota built lean into the Toyota Production System from the 1950s (crediting what it learned from Ford). Some describe lean thinking with eight Ps: purpose, process, people, pull, prevention, partnering, planet, perfection.</p>
        <p>Lean is more than a toolkit for removing <b>muda</b> (waste): it is a culture of continual improvement and of developing everyone in the organization. NUMMI, the Toyota–GM joint venture in Fremont, California (1984–2010), went from GM's worst plant to one of its best in under two years.</p>
        ${G.w("tpshouse")}
        <h3>Value is defined by the customer</h3>
        <p>A step is <b>value-added</b> only if the customer recognizes the value, it changes (transforms) the product, and it is done right the first time. Rework is the classic non-value-added activity. Inspection is a gray area: inspecting because the process is incapable is non-value-added, but a test customers pay for — fire-testing furnaces for the CSA listing — is value-added. Most lead time is non-value-added waiting, yet improvement efforts often speed up the value-added steps instead.</p>
        ${G.w("vatest")}
        ${G.trap(`<p>“Value stream” is not one of the three fundamental concepts — it is the series of activities that delivers value. Distractors swap it in.</p>`)}`
    },
    {
      id: "tools", title: "The top lean tools", bok: "I.B.1", level: "Apply", hy: true, pages: "35–42",
      html: `
        ${G.table(["Tool", "What it is"], [
          ["5S (6S, 7S)", "Sort, set in order, shine, standardize, sustain. Sustain is hardest. Some add safety (6S) and oversight (7S). Casey's advice: post a cleanliness scoreboard and start at standardize."],
          ["Andon", "Red/yellow/green stacked lights showing status; empowers workers to stop the process"],
          ["A3", "One-sheet overview of a project, named after the paper size"],
          ["Continuous flow", "Work in process flows with minimal or no buffers between steps"],
          ["Gemba", "“The real place” — go where the work happens (management by walking around)"],
          ["Heijunka", "Level the schedule by mixing variants in small batches: shorter lead times, lower inventory"],
          ["Hoshin kanri", "Policy deployment: align strategy, middle-management tactics and floor-level action"],
          ["Jidoka", "Autonomation, “automation with a human touch”. Shingo found 23 stages between manual and automatic; about 90% of the benefit of full automation"],
          ["Just-in-time", "Cut in-process inventory and its carrying cost; have things available as needed"],
          ["Kanban", "Pull signal: an empty bin with a card triggers replenishment. Put 5S, standard work, TPM and variation reduction in place first"],
          ["OEE", "Availability × performance × quality"],
          ["Poka-yoke", "Mistake-proofing — prevention type or detection type"],
          ["SMED", "Rapid changeover; “single minute” means single-digit minutes, under 10"],
          ["Standard work", "Interaction of operator and machine: standard time, standard inventory, standard sequence"],
          ["Takt time", "Available time ÷ demand; from German <i>taktzeit</i>, first used in German aircraft production in the 1930s"],
          ["TPM", "Operators and maintenance technicians team up to cut downtime"],
          ["Visual factory", "Anyone walking onto the floor can tell what is running, what is being made and what is left to do"]
        ])}
        ${G.w("leantool")}
        ${G.w("pokatype")}
        <h3>Kaizen, kaizen events and kaikaku</h3>
        <p><b>Kaizen</b> is improvement through small incremental steps. A <b>kaizen event</b> (blitz) assembles a cross-functional team for <b>three to five days</b> to review every option for a breakthrough; it needs management support. The handbook adds that breakthrough improvement is <b>kaikaku</b>, which North Americans call a kaizen event or blitz.</p>
        ${G.trap(`<p>SMED's “single minute” is a <b>single-digit</b> minute (under 10), not one minute. And standard work's three parts here (time, inventory, sequence) match Chapter 21's list (cycle and takt time, sequence, minimum parts on hand) in different words.</p>`)}
        ${G.flag(`<ul>
          <li><b>p. 38, kaikaku:</b> this page and p. 381 equate kaikaku with the North American kaizen event or blitz. The Lean Enterprise Institute defines kaikaku as radical improvement of a value stream (breakthrough kaizen) and a kaizen workshop as a group event commonly lasting five days. What the BoK tests is kaizen vs kaizen blitz; don't expect an item to hinge on blitz vs kaikaku.</li>
          <li><b>p. 37, jidoka:</b> “why have a human do what a machine can do better” is this page's gloss. The defining feature (Figure 2.1 and Chapter 24) is a machine that <b>detects an abnormality and stops</b>, with a person responding.</li>
        </ul>`, "Calibration notes")}`
    },
    {
      id: "toc", title: "Theory of constraints and drum-buffer-rope", bok: "I.B.1", level: "Apply", hy: true, pages: "40–41",
      html: `
        <p>The theory of constraints focuses on the weakest link — usually the slowest process. System flow cannot rise unless the constraint's rate rises, so improving any other process does not improve the system.</p>
        <ol class="steps-v">
          <li><p><b>Identify</b> the constraint — if throughput is the concern, it is often the step with WIP waiting in front of it.</p></li>
          <li><p><b>Exploit</b> it — use kaizen or other methods to raise its rate.</p></li>
          <li><p><b>Subordinate</b> the other processes — adjust their rates to match the constraint.</p></li>
          <li><p><b>Elevate</b> it — invest in equipment or new technology if the system needs more.</p></li>
          <li><p><b>Repeat</b> with the new constraint.</p></li>
        </ol>
        ${G.w("toc5")}
        <p><b>Drum-buffer-rope</b> (Goldratt's soldiers): the slowest soldier is the <b>drum</b> that sets the pace; a <b>rope</b> ties the lead soldier (material release) to the drum; the rope's slack is the <b>buffer</b>, sized by how dependable the processes are. Everything slows to the drum's pace, so lead time and WIP stay minimal.</p>
        ${G.w("dbr")}
        ${G.trap(`<p>“Measure” is a DMAIC step, not a TOC step — the ASQ sample item uses exactly that distractor. And the drum is the constraint, not the first operation.</p>`)}
        ${G.tab(`<p>p. 40: number the five steps in the margin; write “drum = constraint, rope = release signal, buffer = rope length” beside the soldier diagram.</p>`)}`
    },
    {
      id: "waste", title: "Waste (muda)", bok: "I.B.1", level: "Apply", hy: true, pages: "42–47",
      html: `
        ${G.table(["Waste", "Typical cause and sign"], [
          ["Overproduction", "Making more, earlier or faster than the next process needs; main symptom is excess WIP. Caused by long setups, unbalanced work, just-in-case thinking"],
          ["Excess motion", "Poor workplace layout, awkward placement of supplies and equipment — people moving"],
          ["Waiting", "Late shipments, long setups, missing people; demoralizing. Fix with setup reduction, TPM, cross-training, scheduling"],
          ["Inventory", "Storage, handling and record-keeping costs; hides problems"],
          ["Transportation", "Excess movement of material — function-oriented layouts; fix with cells (e.g. C-shaped) built around product families"],
          ["Defect correction", "Rework from poor maintenance, quality systems, training or design"],
          ["Excess processing", "Steps that add nothing the customer pays for: dip-and-degrease while parts wait for paint, grinding welds, filing unused paper copies"],
          ["Lost creativity", "Unused employee ideas — the handbook calls it the most unfortunate waste"]
        ])}
        ${G.w("waste8")}
        ${G.w("seainv")}
        <p>A <b>C-shaped cell</b> can be staffed flexibly: six people at high demand (one per machine), one person walking machine to machine at low demand. A <b>spaghetti diagram</b> traces the paths people, product or paperwork travel and makes an unimproved process look as messy as it is.</p>
        <p class="small">The handbook also lists employee demotivation (with Maslow's hierarchy: self-actualization, esteem, belonging, security, fundamental needs) and missing emergency-response planning (ISO 22301 business continuity) as additional wastes.</p>
        ${G.trap(`<p><b>Motion</b> is people moving (reaching, walking, searching); <b>transportation</b> is material moving (conveyors, forklifts). Both stem from layout, so read who or what is moving.</p>`)}`
    },
    {
      id: "vsm", title: "Value stream mapping", bok: "I.B.2", level: "Understand", hy: true, pages: "47–51",
      html: `
        <p>A <b>value stream</b> is the series of activities an organization performs — order, design, produce, deliver — often from a <b>supplier's supplier to the customer's customer</b>. It has three components:</p>
        <ol><li><b>Flow of materials</b>, from supplier receipt to delivery to customers.</li><li><b>Transformation</b> of raw materials into finished goods.</li><li><b>Flow of information</b> that supports the other two (purchase orders, work orders, shipping notices).</li></ol>
        <p>The map uses simple icons for material, information, inventory, WIP and operators; <b>value stream analysis</b> then uncovers the hidden waste.</p>
        <h3>Applying lean thinking to a value stream</h3>
        <ol class="steps-v">
          <li><p><b>Produce a value stream map</b> (also called a value chain diagram), with timing and inventory beside each process box.</p></li>
          <li><p><b>Analyze all inventory</b> for reduction — storage is expensive, quality deteriorates, design changes wait, money is tied up, and defects pile up undetected.</p></li>
          <li><p><b>Analyze the whole stream for unneeded steps</b> (non-value-added activities).</p></li>
          <li><p><b>Determine how flow is driven</b> and move toward pull from customer demand.</p></li>
          <li><p><b>Extend the map upstream</b> into suppliers' plants.</p></li>
        </ol>
        ${G.w("vsm")}
        <p>Pick a narrow focus first — don't try to boil the ocean.</p>
        ${G.trap(`<p>The biggest <b>initial</b> opportunity a value stream analysis reveals is <b>inventory</b>; flow, unneeded steps and quality come next (ASQ sample item). The BoK's waste list for mapping: excess inventory, unused space, test and inspection, rework, transportation, storage.</p>`)}
        ${G.tab(`<p>pp. 48–51: tab the five steps and the symbol figure.</p>`)}`
    }
  ],
  check: [
    { q: "Which three concepts are fundamental to understanding lean thinking?",
      o: ["Value, waste, and the process of creating value without waste", "Lean, waste, and value", "Value stream, mistake-proofing, and flow", "Takt, pull, and perfection"], a: 0,
      why: "The handbook's opening sentence on lean (p. 32).",
      d: { 1: "Lean is the subject, not a concept within it.", 2: "The value stream is a series of activities; mistake-proofing is one tool.", 3: "Real lean ideas, but not the three fundamentals." }, ref: "32" },
    { q: "Which is NOT one of the theory of constraints' five steps?",
      o: ["Exploit", "Subordinate", "Measure", "Elevate"], a: 2,
      why: "The steps are identify, exploit, subordinate, elevate and repeat; measure is a DMAIC phase.",
      d: { 0: "Step 2.", 1: "Step 3.", 3: "Step 4." }, ref: "40" },
    { q: "Producing product variants in small, mixed batches within the same process, to shorten lead times and reduce inventory, is called:",
      o: ["Hoshin kanri", "Jidoka", "Kanban", "Heijunka"], a: 3,
      why: "Heijunka levels production by sequencing variants.",
      d: { 0: "Policy deployment.", 1: "Autonomation.", 2: "A replenishment signal." }, ref: "37" },
    { q: "Poor workplace layout, with supplies and equipment placed awkwardly, most directly causes which waste?",
      o: ["Transportation", "Excess motion", "Inventory", "Overproduction"], a: 1,
      why: "People reaching, walking and searching is excess motion.",
      d: { 0: "Transportation is material moving, usually from function-based plant layout.", 2: "Inventory is stock held.", 3: "Overproduction is making too much or too early." }, ref: "42" },
    { q: "What is typically the biggest initial opportunity revealed by a value stream analysis?",
      o: ["Inventory", "Unneeded process steps", "Gaps in the quality system", "Information flow"], a: 0,
      why: "Inventory is the first key revelation; flow, unneeded steps and quality follow.",
      d: { 1: "Step 3 — a later target.", 2: "Not the first revelation.", 3: "Mapped, but rarely the largest waste." }, ref: "48–50" },
    { q: "In single-minute exchange of die (SMED), “single minute” means a changeover should take:",
      o: ["Exactly one minute", "Under 10 minutes", "Less than one takt time", "Under 60 seconds of internal time"], a: 1,
      why: "Single-digit minutes — less than 10.",
      d: { 0: "The common misreading.", 2: "Takt is unrelated to the definition.", 3: "Same misreading in seconds." }, ref: "39" },
    { q: "In drum-buffer-rope, the drum is:",
      o: ["The first operation, which releases material", "The buffer stock in front of the constraint", "The signal that ties material release to the constraint", "The constraint, which sets the pace for the whole system"], a: 3,
      why: "The slowest soldier sets the drumbeat.",
      d: { 0: "The lead soldier, tied to the drum by the rope.", 1: "That is the buffer.", 2: "That is the rope." }, ref: "40–41" },
    { q: "Under the handbook's three conditions for value-added work, which activity is value-added?",
      o: ["Inspecting parts because the process is not capable", "Moving parts to a storage rack", "Fire-testing each gas furnace for the CSA listing customers pay for", "Reworking parts that failed final test"], a: 2,
      why: "Customers pay for the listing, so this test is value-added.",
      d: { 0: "Fix the process instead — non-value-added.", 1: "Transportation and storage add nothing.", 3: "Rework fails “right the first time”." }, ref: "33–35" }
  ]
});
