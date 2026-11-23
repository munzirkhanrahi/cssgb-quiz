G.chapter({
  id: "ch10", num: 10, title: "Process Analysis and Documentation", bok: "III.A", pages: "168–181", drill: 27,
  lede: "The Measure phase opens by drawing the process as it really runs. III.A is tested at the Create level — so expect scenario items: which map, which document, which tool turns a brainstorm into priorities. Tab the flowchart symbols (Figure 10.1) and the Pareto rules.",
  sections: [
    {
      id: "maps", title: "Process maps, flowcharts and swim lanes", bok: "III.A", level: "Create", hy: true, pages: "168–172",
      html: `
        <p>ISO 9000 defines a <b>process</b> as a set of interrelated or interacting activities that transforms inputs into outputs. A <b>flowchart</b> shows each step, decision point, input and output. A <b>process map</b> is a flowchart plus details about the steps — cost, setup time, cycle time, inventory, likely defects and their probability. Practitioners use the terms interchangeably, but the exam may not.</p>
        ${G.table(["Map", "What it adds", "Use it when"], [
          ["Flowchart", "Steps, decisions, flow direction (ISO 5807 symbols)", "Documenting or designing a sequence; training; audits"],
          ["Process map", "Flowchart + cost, setup and cycle time, inventory, defect types", "Finding waste, redundancy and complexity"],
          ["Swim-lane (cross-functional) map", "Each step sits in the lane of the department that does it", "A process crosses several functions — hand-offs show up"],
          ["Value stream map", "Lean icons; material and information flow; time ladder", "Lean projects (Chapter 2) — different icon set"],
          ["SIPOC", "Suppliers, inputs, 4–7 high-level steps, outputs, customers", "Bird's-eye view and project scope"]
        ])}
        ${G.w("flowsym")}
        <h3>Building a flowchart (p. 171)</h3>
        <ol class="steps-v">
          <li><p><b>Set the boundaries</b> — the inputs and outputs, or the suppliers and customers.</p></li>
          <li><p><b>List the steps</b> by brainstorming or walking the process. Don't worry about order yet.</p></li>
          <li><p><b>Sequence them</b>, showing parallel steps and alternative paths.</p></li>
          <li><p><b>Draw</b> with the standard symbols.</p></li>
          <li><p><b>Verify</b> — for a new process, that it's complete; for an existing one, that it matches what actually happens. Do this as a team.</p></li>
        </ol>
        <p>Common mistakes: the wrong people on the team, unclear scope, not walking the process, and polishing a “perfect” diagram instead of studying the process. The biggest mistake of all is not drawing one. Update the chart whenever the process changes. Process FMEA starts from a process map.</p>
        ${G.trap(`<p>“Map the process <i>as it actually operates</i>” beats “as the procedure says” for an existing process — the gap between the two is often the finding. Swim lanes add <b>who</b> (which function) to a flowchart; they don't add timing or cost.</p>`)}
        ${G.tab(`<p>Figure 10.1 (p. 169): rectangle = step, diamond = decision, D-shape = delay, wavy-bottom box = document, parallelogram = input/output, circle = connector, trapezoid = manual operation, hexagon = preparation, oval = start/end.</p>`)}`
    },
    {
      id: "docs", title: "Written procedures and work instructions", bok: "III.A", level: "Create", pages: "172–173",
      html: `
        <div class="grid2">
          <div class="card"><h4>Procedure</h4><p><b>What</b> is done, <b>why</b> (the business reason), <b>where</b> (location or step) and <b>when</b> (the trigger).</p></div>
          <div class="card"><h4>Work instruction</h4><p>Adds <b>who</b> does it (a specific skill set) and <b>how</b>, step by step. Can be text, a checklist, flowchart, photo, drawing, video, screen shot or software-driven steps.</p></div>
        </div>
        <p>Where no procedure is required, an activity can run as a <b>method</b> — unwritten, but followed consistently. Decide what to document by its effect on quality, risk of customer dissatisfaction, statutory or regulatory requirements, economic risk, effectiveness and efficiency, competence of personnel, and complexity.</p>
        <p>BoK III.A asks you to review these documents against the process map to find <b>gaps or misaligned areas</b> — steps people perform that the documents don't describe, or documented steps nobody follows.</p>
        ${G.w("procwi")}
        ${G.trap(`<p>The split is <b>what/why/where/when</b> (procedure) versus <b>who/how</b> (work instruction). A distractor that puts “how” in the procedure or “why” in the work instruction is the usual trap.</p>`)}`
    },
    {
      id: "io", title: "Process inputs, outputs and SIPOC", bok: "III.A", level: "Create", pages: "173–174",
      html: `
        <p>Every process has input variables, output responses and feedback loops; feedback is what lets the process improve. Inputs include needs, ideas, expectations, requirements, information, data, documents and resources. Outputs include designs, decisions, results, measurements, products, services, proposals, solutions, authorizations and actions.</p>
        <p>A detailed map of a whole value stream can run to hundreds of blocks, so start with a <b>SIPOC</b> — suppliers, inputs, process, outputs, customers — and keep the process portion to <b>four to seven</b> high-level steps. It shows the team the scope at a glance.</p>
        <p>The Six Sigma logic is <b>y = f(x)</b>: measure and control the input variables (x) so variation in the output (y) falls. Tools for exploring how inputs drive outputs include cause-and-effect diagrams, CEDAC, relationship and cause-and-effect matrices, scatter diagrams and designed experiments.</p>
        ${G.trap(`<p>SIPOC is high level — four to seven process steps, not a detailed flowchart. A question asking for “a bird's-eye view to agree project scope” wants SIPOC.</p>`)}`
    },
    {
      id: "fishbone", title: "Cause-and-effect diagrams and converging on causes", bok: "III.A", level: "Create", pages: "174–176",
      html: `
        <p>The <b>cause-and-effect</b> (Ishikawa, fishbone) diagram sorts brainstormed causes into categories — classically measurement, material, personnel, environment, methods and machines. The categories are a prompt, not a rule: software teams use people, processes, products, resources and miscellaneous, and service processes shouldn't be forced into “machine” or “environment”.</p>
        ${G.w("fishcat")}
        ${G.table(["Step", "Tool", "Notes from the handbook"], [
          ["Diverge", "Brainstorming", "Quantity first, no criticism — “there are no bad ideas”. A session typically yields 25–40 ideas. Needs a trained facilitator to enforce the ground rules."],
          ["Diverge (whole workforce)", "CEDAC — cause-and-effect diagram with addition of cards", "The fishbone goes on a wall; anyone adds causes on cards or sticky notes. Success depends on culture and communication."],
          ["Organize", "Affinity diagram", "Groups a large number of ideas into natural relationships."],
          ["Converge", "Nominal group technique (NGT)", "Members rank items silently; ranks are tallied. Best for sensitive or emotional issues, or teams that mix organizational levels — dominant members can't sway it."],
          ["Converge", "Multivoting", "The handbook's version divides 100 points among the choices by importance."],
          ["Converge with data", "Collect data on each cause, then Pareto it", "“I tried two coolants and saw no difference” is data; prioritize on a Pareto chart."]
        ])}
        ${G.trap(`<p>NGT versus multivoting: both converge and rank, but NGT's silent individual ranking is the answer when the topic is sensitive or a senior person might dominate. Brainstorming and CEDAC diverge; they don't prioritize.</p>`)}`
    },
    {
      id: "pareto", title: "Pareto charts, weighted Pareto and measles charts", bok: "III.A", level: "Create", hy: true, pages: "176–180",
      html: `
        <p>A true <b>Pareto chart</b> is not just a sorted bar chart. It has bars in descending order of the chosen measure, the “trivial many” pooled into <b>Other</b> (plotted last), a secondary axis in percent, and a <b>cumulative-percentage line</b>. It separates the vital few from the trivial many using Vilfredo Pareto's 80:20 principle; Joseph Juran is credited with applying it to quality.</p>
        ${G.w("pareto10")}
        <ul>
          <li><b>Choose the measure that matches the goal.</b> Count, cost of repair or rework, or a criticality weight × count. In Figure 10.7, weighting critical = 100, major = 25, minor = 10 moves broken LEDs (700) and nonfunctional devices (500) above stains and scratches.</li>
          <li><b>Not too detailed.</b> Figure 10.8 lists defects by exact location (“stains on the cover”, “stains on the display”…) and the chart comes out flat — a vital many and trivial few. Move one level up (stains, scratches, dents), Pareto that, then drill into the top bars.</li>
          <li><b>Location data</b> go on a <b>measles chart</b> (a pictorial check sheet) — the car-rental damage diagram is the familiar example. Useful when the product is large and defect sites are many.</li>
        </ul>
        ${G.trap(`<p>“Other” always goes on the far right even if it's taller than some named bars. A chart that sorts “Other” into the middle, or has no cumulative line, isn't a Pareto chart. And the tallest bar by count isn't automatically the priority — check whether the question gives cost or severity.</p>`)}
        ${G.tab(`<p>Pareto features (p. 177) and the weighted example (Figure 10.7, p. 178): weighted score = count × weight. The five bars total 2,065 points, so broken LEDs alone are 33.9%.</p>`)}`
    },
    {
      id: "matrix", title: "Relationship matrix", bok: "III.A", level: "Create", pages: "180–181",
      html: `
        <p>A <b>relationship matrix</b> rates how strongly each cause (rows) relates to each effect (columns): strong ◎ = 9, moderate ○ = 3, weak △ = 1. Total the rows and columns to prioritize; add a weights row or column for an overall weighted score. QFD (Chapter 5) uses the same idea.</p>
        <p>In the pizza example (Figure 10.10), “traffic jam” relates strongly to “delivered late” but is outside the caterer's control — so the actions target what is controllable: a better insulated container, correct addresses, a less congested route, and labelling orders on the shelf to cut wrong-topping and wrong-pizza errors.</p>
        ${G.trap(`<p>9-3-1, not 3-2-1 or 5-3-1. The deliberately wide gaps make strong relationships dominate the totals.</p>`)}`
    }
  ],
  check: [
    { q: "A team's diagram shows each step of an order process along with its setup time, cycle time, queue inventory and typical defects. This diagram is best described as a:",
      o: ["Process map", "SIPOC", "Basic flowchart", "Relationship matrix"], a: 0,
      why: "A process map is a flowchart with extra information about each step — costs, setup and cycle time, inventory and defects.",
      d: { 1: "SIPOC is a high-level view with four to seven steps and no step-level detail.", 2: "A basic flowchart shows steps, decisions and flow but not these process details.", 3: "A relationship matrix scores causes against effects." }, ref: "168–169" },
    { q: "A warranty-replacement process passes between the customer, customer support, the warehouse and engineering. Which tool best exposes the hand-offs between departments?",
      o: ["Pareto chart", "Measles chart", "Swim-lane flowchart", "Cause-and-effect diagram"], a: 2,
      why: "A swim-lane (cross-functional) flowchart places each step in the lane of the function that performs it, so every hand-off crosses a lane line.",
      d: { 0: "Pareto prioritizes categories by frequency or cost.", 1: "A measles chart shows where defects occur on a physical item.", 3: "A fishbone organizes possible causes of one effect." }, ref: "169–171" },
    { q: "Which pair of elements does a work instruction add that a procedure does not normally describe?",
      o: ["What and why", "Where and when", "Why and when", "Who and how"], a: 3,
      why: "Procedures describe what, why, where and when; work instructions explain who does what and how, step by step.",
      d: { 0: "Both are procedure content.", 1: "Both are procedure content.", 2: "Both are procedure content." }, ref: "172" },
    { q: "Defect counts at final assembly are: stains 17, scratches 15, dents 14, broken LEDs 7. Weights are critical 100, major 25, minor 10; stains and scratches are minor, dents major, broken LEDs critical. Which defect should be first on a weighted Pareto chart?",
      o: ["Broken LEDs", "Stains", "Dents", "Scratches"], a: 0,
      why: "Weighted scores: broken LEDs 7 × 100 = 700, dents 14 × 25 = 350, stains 17 × 10 = 170, scratches 15 × 10 = 150.",
      d: { 1: "Stains lead only by raw count.", 2: "Dents score 350 — second.", 3: "Scratches score 150 — last of the four." }, ref: "178" },
    { q: "A Pareto chart of defects recorded by exact location (“stains on the cover”, “stains on the display”, “scratches on the name plate”…) comes out nearly flat. The best next step is to:",
      o: ["Add more locations so each bar has fewer counts", "Group the defects one level up (stains, scratches, dents) and redraw", "Replace the Pareto with a run chart", "Remove the cumulative-percentage line"], a: 1,
      why: "Over-specific categories give a “vital many and trivial few”. Generalize one level up, then drill into the top bars; location detail belongs on a measles chart.",
      d: { 0: "That spreads the data even thinner.", 2: "A run chart shows time patterns, not category priorities.", 3: "The cumulative line is a defining feature of a Pareto chart." }, ref: "178–180" },
    { q: "A team that includes line operators and two vice presidents must rank causes of a sensitive safety issue. Which technique best prevents the senior members from swaying the result?",
      o: ["Brainstorming", "CEDAC", "Nominal group technique", "Affinity diagram"], a: 2,
      why: "NGT has members rank items silently and tallies the ranks, so dominant or senior members can't steer the outcome; the handbook recommends it for sensitive topics and mixed levels.",
      d: { 0: "Brainstorming generates ideas; it doesn't rank them.", 1: "CEDAC collects causes on a wall board — still divergent.", 3: "An affinity diagram groups ideas; it doesn't prioritize them." }, ref: "176" },
    { q: "In a SIPOC diagram, the handbook recommends limiting the process portion to:",
      o: ["Four to seven high-level steps", "One step per department", "Every step down to the task level", "Two or three steps"], a: 0,
      why: "Keeping the process to four to seven high-level steps keeps SIPOC a bird's-eye, enterprise-level view.",
      d: { 1: "Department lanes belong to a swim-lane chart.", 2: "That's a detailed process map.", 3: "Too few to show the process meaningfully." }, ref: "174" },
    { q: "On a flowchart, which symbol shows a point where the flow branches according to the answer to a question?",
      o: ["Rectangle", "Parallelogram", "Oval", "Diamond"], a: 3,
      why: "The decision diamond holds the question; one arrow leaves for each answer, often yes and no.",
      d: { 0: "A rectangle is one process step, usually with one exit.", 1: "A parallelogram is an input or output.", 2: "An oval marks start and end." }, ref: "169" }
  ]
});
