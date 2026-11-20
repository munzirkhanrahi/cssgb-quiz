G.chapter({
  id: "ch21", num: 21, title: "Lean Tools", bok: "V.C", pages: "363–385", drill: 33,
  lede: "Lean removes waste and smooths flow; Six Sigma shifts the average and reduces variation. Cycle-time reduction is tested at Analyze level — expect takt, capacity and setup scenarios — while waste tools and kaizen are Apply level.",
  sections: [
    {
      id: "lean", title: "Lean and Six Sigma, and the wastes", bok: "V.C.1", level: "Apply", pages: "363–366",
      html: `
        <div class="grid2">
          <div class="card"><h4>Six Sigma objectives</h4><p>Shift the process average; reduce process variation.</p></div>
          <div class="card"><h4>Lean objectives</h4><p>Improve process flow; reduce process complexity.</p></div>
        </div>
        <p>Value-stream mapping is the prerequisite for project selection: it uncovers the problems, which then feed Six Sigma projects, kaizen projects or quick hits. <b>Lean thinking:</b> specify value for each product, identify the value stream, make value flow without interruption, let the customer pull, and pursue perfection.</p>
        ${G.table(["Aspect", "Lean approach"], [
          ["Design", "Standardization and incremental change"],
          ["Capacity", "Flexibility and utilization that absorb demand spikes"],
          ["Layout", "Work cells and flow, not large work areas"],
          ["Workforce", "Empowered, cross-trained teams; leadership by consensus"],
          ["Scheduling", "Short setups; concurrent production of different models"],
          ["Inventory", "Less WIP, less storage space, lower carrying cost"],
          ["Suppliers", "Fewer partners; delivery to the point of use"],
          ["Operations", "Visual indicators, preventive quality and maintenance, a logical pace"]
        ])}
        ${G.w("wastes")}
        ${G.trap(`<p>The handbook's wastes are the seven of TIM WOOD (listed in Chapter 24). Some references add an eighth, unused skills (TIM WOODS). Use the handbook's seven unless a question names the eighth.</p>`)}`
    },
    {
      id: "tools", title: "Waste-elimination tools", bok: "V.C.1", level: "Apply", hy: true, pages: "365–372",
      html: `
        <div class="cards">
          <div class="card"><h4>Pull system</h4><p>Customer demand drives production; materials are staged at the point of use and replenished only as consumed. Follows Little's law: cutting WIP cuts lead time.</p></div>
          <div class="card"><h4>Kanban</h4><p>“Sign” or “signboard”: a signal to obtain inventory, produce a part or move material, ordering new material only after consumption.</p></div>
          <div class="card"><h4>Poka-yoke</h4><p>Mistake-proofing by design — a step can only be completed correctly (the one-way plug), or the error is made visible. Term coined by <b>Shigeo Shingo</b>.</p></div>
          <div class="card"><h4>5S</h4><p>Sort, set in order (straighten), shine, standardize, sustain. Housekeeping matters for measurement too.</p></div>
          <div class="card"><h4>Standard work</h4><p>Cycle time, takt time, task sequence and minimum parts on hand — the <b>baseline for improvement</b>. Built with three charts: production capacity chart, standardized work combination table, standardized work analysis chart.</p></div>
          <div class="card"><h4>Visual factory, kaizen, TPM</h4><p>Make status visible; improve in small steps or a blitz; keep equipment reliable (Chapters 21 and 24).</p></div>
        </div>
        ${G.w("littles")}
        ${G.w("fives")}
        ${G.w("leanpick")}
        <p class="small"><b>Introducing standard work</b> (handbook sequence): communicate the change, identify the benefits, identify the barriers, decide how to capitalise on the benefits, decide how to mitigate the barriers, get agreement on those two, implement, communicate the results, celebrate.</p>
        ${G.trap(`<p>Standard work is a <b>baseline for improvement</b>, not a fixed end state. And poka-yoke prevents the error from being made (or exposes it at once) — it is not inspection after the fact.</p>`)}
        ${G.tab(`<p>p. 368: write the 5S order with the Japanese names; p. 371: list the three standard-work charts.</p>`)}`
    },
    {
      id: "flow", title: "Stability, capacity and work-flow analysis", bok: "V.C.2", level: "Analyze", pages: "372–376",
      html: `
        <p><b>Process stability</b> comes from defined methods, trained people, maintained machinery, calibrated measurement and consistent materials. Stable processes have predictable cost, quality and cycle time. <b>Capability</b> compares the voice of the customer with the voice of the process.</p>
        ${G.w("capacity")}
        <h3>Four ways to evaluate work flow</h3>
        <p>Flowcharts, flow analysis charts, value-stream mapping and takt time analysis.</p>
        ${G.w("flow5")}
        <h3>Value-stream mapping</h3>
        <ul>
          <li>Start at the <b>shipping end</b>, closest to the customer, and work upstream.</li>
          <li>Collect information directly from the value stream (observation, time study, counting inventory) and draw by hand during the walk.</li>
          <li>Typical data: cycle time, changeover time, people, uptime, WIP, inventory, scrap rate, operating time, value-added versus non-value-added time, lead time.</li>
          <li>Design the future state, plan countermeasures, and draw a new current-state map when about 80% of them are implemented.</li>
        </ul>
        ${G.trap(`<p>Mapping starts at the customer (shipping) end, not at receiving.</p>`)}`
    },
    {
      id: "takt", title: "Takt time and line balancing", bok: "V.C.2", level: "Analyze", hy: true, pages: "376–377",
      html: `
        <div class="formula">Takt time = available work time ÷ customer demand</div>
        <p>Takt (German for pace or beat) is the heartbeat of the process — a measure of <b>customer demand</b>. Example: 480 minutes ÷ 160 units = 3 minutes per unit, so every step must take 3 minutes or less to avoid a backlog. Match process (cycle) time to takt as closely as possible.</p>
        ${G.w("takt")}
        ${G.trap(`<p><b>Takt time is set by demand; cycle time is set by the process.</b> A distractor will define takt as how long a station takes. And the ideal balance puts each downstream step slightly faster than the one before it.</p>`)}
        ${G.tab(`<p>p. 376: box the takt formula with the 480 ÷ 160 = 3 example.</p>`)}`
    },
    {
      id: "smed", title: "Cycle-time reduction: countermeasures, SMED, constraints", bok: "V.C.2", level: "Analyze", hy: true, pages: "377–380",
      html: `
        <p>Countermeasures attack <b>muda</b> (waste), <b>mura</b> (unevenness) and <b>muri</b> (unreasonableness): poka-yoke, quick changeover, one-piece flow, right-sized equipment, cellular flow, sensible automation (jidoka), kanban and source inspection.</p>
        ${G.w("smed")}
        <ul>
          <li><b>Why it matters:</b> long changeovers create bottlenecks, inflate lot sizes (the old EOQ logic) and cut flexibility. Related: one-touch exchange of die (OTED).</li>
          <li><b>First moves:</b> 5S the setup area; do everything possible while the previous job is still running.</li>
          <li><b>Then shrink internal time:</b> eliminate adjustments; standardize tools, tool positions and programs; use setup teams. Document the new method as standard work and keep applying PDCA.</li>
        </ul>
        <h3>Theory of constraints (Goldratt)</h3>
        <p>The process can go no faster than its <b>bottleneck</b>; a delay there absorbs any slack, just as on a project's critical path. Limit inventory to what the bottleneck can process. Relieve it by reducing discretionary demand on it, adding capacity or speed, raising skill, automating, simplifying, or moving preparation upstream.</p>
        <p><b>Goldratt's five focusing steps</b> (not listed in Chapter 21, but they appear in ASQ-style practice items): <b>identify</b> the constraint, <b>exploit</b> it (get the most from it as is), <b>subordinate</b> everything else to it, <b>elevate</b> it (add capacity), then <b>repeat</b> — without letting inertia become the new constraint.</p>
        ${G.trap(`<p>A <b>capacity-constrained resource</b> is at risk of becoming a bottleneck and can hurt throughput even when operations are not at full capacity — people, equipment, suppliers or policies. A <b>bottleneck</b> already sets the pace.</p>`)}`
    },
    {
      id: "kaizen", title: "Kaizen, kaizen blitz and kaikaku", bok: "V.C.3", level: "Apply", hy: true, pages: "380–385",
      html: `
        ${G.table(["", "Kaizen", "Kaizen blitz (event)", "Kaikaku"], [
          ["Meaning", "Continuous improvement", "A rapid, focused kaizen", "Innovation, radical change"],
          ["Pace", "Small, frequent, over years", "About one week", "Major redesign"],
          ["Character", "Evolutionary, low cost, low risk", "Trained cross-functional team collects data, analyzes and implements immediately", "Revolutionary; usually initiated by management, often triggered externally"],
          ["Relationship", "Keeps gains from decaying", "Accelerates kaizen", "Sets a new base for kaizen"]
        ])}
        ${G.w("kaizentype")}
        <h3>Gemba kaizen</h3>
        <p>The gemba is the real place where work happens. The economy-of-motion checklist: eliminate unnecessary movement, reduce eye movement, combine operations, improve the workplace layout, and improve tools, jigs and machines. Because about 85% of cost, quality and delivery conditions are set in design and planning, gemba kaizen is a starting point for kaizen upstream.</p>
        <p><b>Levels of kaizen:</b> point (individual workstation), mini (work team), flow (a full value stream, led by a project manager), process (a specific process or subprocess) and supply chain (several companies).</p>
        <p><b>Kaizen events succeed with:</b> a charter, critical success factors, the right scope, a link to the business plan, team selection, follow-through, presenting results, communication and management commitment.</p>
        ${G.flag(`<p>p. 381 says kaikaku “commonly refers to a focused kaizen action … over the course of a week, referred to as a kaizen blitz”, which blurs two terms the same page distinguishes. Use the clean distinction: <b>kaizen</b> = incremental; <b>kaizen blitz</b> = intensive one-week event; <b>kaikaku</b> = radical, management-led change.</p>`)}`
    }
  ],
  check: [
    { q: "A packing cell has 450 available minutes per shift and customer demand of 150 units per shift. What is the takt time?",
      o: ["0.33 minutes", "150 minutes", "3.0 minutes", "6.0 minutes"], a: 2,
      why: "Takt = available time ÷ demand = 450 ÷ 150 = 3.0 minutes per unit.",
      d: { 0: "Demand ÷ time — inverted.", 1: "That is the demand, not a time per unit.", 3: "Doubles the correct value." }, ref: "376" },
    { q: "A line holds 400 units of work in process and completes 50 units per day. By Little's law, the average lead time is:",
      o: ["8 days", "0.125 days", "450 days", "20,000 days"], a: 0,
      why: "Lead time = WIP ÷ throughput = 400 ÷ 50 = 8 days.",
      d: { 1: "Throughput ÷ WIP — inverted.", 2: "Adds the numbers.", 3: "Multiplies them." }, ref: "366" },
    { q: "In quick changeover (SMED), converting internal setup work to external setup work means:",
      o: ["Hiring an outside contractor to do the setup", "Doing the work while the machine is still running the previous job", "Eliminating all adjustments", "Running larger lots to amortize setup time"], a: 1,
      why: "External setup can be done while the machine runs, removing it from the stoppage.",
      d: { 0: "External refers to timing, not who does it.", 2: "Eliminating adjustments shortens internal time — a separate step.", 3: "That is the old EOQ logic SMED replaces." }, ref: "379" },
    { q: "According to the handbook, setup time is measured from:",
      o: ["The moment the machine stops to the moment it restarts", "The start of the shift to the first good piece", "When the setup crew arrives to when it leaves", "The last piece of one product to the first good piece of the next"], a: 3,
      why: "Setup time is the total elapsed time from the last piece of one product to the first good piece of the next.",
      d: { 0: "Restarting is not enough — the first piece must be good.", 1: "Not tied to the changeover.", 2: "Measures the crew, not the stoppage." }, ref: "378" },
    { q: "A trained, cross-functional team spends one week collecting data on a returns cell, analyzing it and implementing the improvements immediately. This is a:",
      o: ["Kaizen blitz", "Kaikaku", "Point kaizen", "Value-stream map"], a: 0,
      why: "A kaizen blitz compresses kaizen into an intensive event of about a week.",
      d: { 1: "Kaikaku is radical, management-initiated redesign.", 2: "Point kaizen is one individual at one workstation.", 3: "A VSM is a diagnostic picture, not an improvement event." }, ref: "380–381" },
    { q: "Under the theory of constraints, inventory at each process point should be limited to:",
      o: ["The economic order quantity", "What the bottleneck can process", "Two days of customer demand", "The capacity of the fastest operation"], a: 1,
      why: "The process runs at the bottleneck's pace, so inventory should be regulated to what the bottleneck can process.",
      d: { 0: "EOQ thinking inflates lots.", 2: "An arbitrary rule not in the handbook.", 3: "The fastest step does not set the pace." }, ref: "380" },
    { q: "In 5S, which step comes third?",
      o: ["Sort", "Set in order", "Standardize", "Shine"], a: 3,
      why: "Sort, set in order, shine, standardize, sustain.",
      d: { 0: "First.", 1: "Second.", 2: "Fourth." }, ref: "368" },
    { q: "A cell runs 1.5 min machine time and 0.5 min manual time per piece, with a 20-minute tool change every 200 pieces. With 450 minutes available per shift, what is the capacity?",
      o: ["225 pieces", "300 pieces", "214 pieces", "22 pieces"], a: 2,
      why: "450 ÷ (1.5 + 0.5 + 20/200) = 450 ÷ 2.1 = 214 pieces.",
      d: { 0: "Ignores tool-change time.", 1: "Uses machine time only.", 3: "Divides by the tool-change time per change." }, ref: "373" }
  ]
});
