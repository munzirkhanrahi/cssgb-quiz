G.chapter({
  id: "ch4", num: 4, title: "Project Identification", bok: "II.A", pages: "80–88",
  lede: "Choose the right problem and the right method, then draw the process's edges before anyone touches it. Two of the five subtopics are tested at Analyze level, so expect scenarios rather than definitions.",
  sections: [
    {
      id: "select", title: "Project selection", bok: "II.A.1", level: "Understand", pages: "80–81",
      html: `
        <p>There are always more project ideas than capacity. A <b>project selection group</b> — Master Black Belts, Black Belts, champions and key executives — sets the criteria and decides which projects go to Six Sigma teams and which go to other methods.</p>
        <ul>
          <li><b>Non-negotiable criterion:</b> the project must further organizational goals.</li>
          <li>Proposals should carry a precise problem definition plus preliminary measures of how serious the problem is.</li>
          <li>Metrics get converted to money: ROI, cost reduction, more sales or profit. All else roughly equal, the biggest bottom-line contributor goes first.</li>
          <li>A selected project is one that is in suitable form to be judged against those criteria.</li>
        </ul>
        ${G.w("method")}
        ${G.trap(`<p>“Which project should start first?” The handbook's tiebreaker is bottom-line dollars <i>when other things are approximately equal</i>. A distractor that offers the biggest saving on a project unrelated to strategic goals is wrong — alignment with goals comes first.</p>`)}
        ${G.tab(`<p>p. 80: write in the margin “DMAIC → data analysis + DOE; lean/kaizen → no heavy stats; DFSS → design new.”</p>`)}`
    },
    {
      id: "elements", title: "Process elements and boundaries", bok: "II.A.2", level: "Analyze", hy: true, pages: "81–82, 85, 87",
      html: `
        <p>A <b>process</b> is a step or sequence of steps that turns <b>inputs</b> into <b>outputs</b>. Inputs are grouped as the M's — people (man), materials, methods, machines, Mother Nature, management, money and the measurement system. Outputs are products (hardware, software, systems, data, information) or services.</p>
        <p>Processes nest. A machining step is itself a process (clamping, turning, plunging, facing), and plunging is a process too. Before improving anything, the team must agree on the <b>boundaries</b>: where the process starts and where it ends.</p>
        ${G.w("zoom")}
        <h3>Crossing functional areas</h3>
        <p>Most processes cross departments and organizations. Find them with a SIPOC, swim-lane flowchart or process map. The handbook names four challenges:</p>
        ${G.table(["Challenge", "What it looks like"], [
          ["Process ownership", "Two or more areas each believe they own the process and have final say on changes."],
          ["Sharing information", "Proprietary concerns, or hiding poor performance."],
          ["Commonality of measures", "Finance counts dollars, production counts defects or productivity, engineering counts design completion."],
          ["Process knowledge", "Manufacturing may not understand how the supply chain works or what it requires."]
        ])}
        <p>If a challenge is significant, log it as a <b>project risk</b> with mitigation (Chapter 6).</p>
        <h3>Systems thinking</h3>
        <p>Consider how a change here affects work downstream, and how upstream work affects this step — for example, a supplier ships material with higher moisture; what must the next processes adjust? A change made without systems thinking fixes one spot and breaks another.</p>
        ${G.trap(`<p>The handbook's note: to show real improvement, a process behaviour (control) chart may have to go <b>out of control</b>. A distractor claiming a well-run improvement keeps the chart in control throughout is “not systems thinking”.</p>`)}
        ${G.trap(`<p>Key point on p. 85: many projects flounder because of <b>unclear boundaries</b>. Clear boundaries do not forbid outside-the-box thinking; they define what the team works on.</p>`, "Exam trap: boundaries")}
        ${G.tab(`<p>p. 85: tab the four cross-functional challenges. They make easy “which is NOT a challenge” items.</p>`)}`
    },
    {
      id: "sipoc", title: "Process inputs and outputs: SIPOC", bok: "II.A.4", level: "Analyze", hy: true, pages: "83–86, 135–136",
      html: `
        <p>The basic process model (inputs → process → outputs) is quick but can be too simple to show where to stop. The <b>SIPOC</b> — suppliers, inputs, process, outputs, customers — adds who supplies and who receives, which also exposes the functions and organizations a process crosses.</p>
        ${G.w("sipoc")}
        <ul>
          <li><b>External</b> suppliers and customers are outside the enterprise; <b>internal</b> ones are departments or processes inside it.</li>
          <li>Suppliers are responsible for meeting their customers' requirements. Customers are responsible for communicating those requirements.</li>
          <li>A SIPOC can be extended to capture the requirements of the process and its customers.</li>
        </ul>
        ${G.trap(`<p>“What is the first step in building a SIPOC?” The acronym starts with S, which is why <b>Suppliers</b> is the bait. The handbook starts in the middle: define the <b>process and its boundaries</b>, then outputs, inputs, customers and finally suppliers.</p>`)}
        ${G.trap(`<p>A SIPOC is a <b>high-level</b> Define-phase scoping tool. A question about documenting every decision point and handoff wants a detailed flowchart or process map (Measure phase), not a SIPOC.</p>`, "Exam trap: level of detail")}
        ${G.tab(`<p>p. 135: write the order “P → O → I → C → S” beside the SIPOC instructions, and “internal / external = enterprise boundary”.</p>`)}`
    },
    {
      id: "bench", title: "Benchmarking", bok: "II.A.3", level: "Understand", pages: "82–84, 118",
      html: `
        <p><b>Benchmarking</b> compares your current state with outstanding processes or products to set targets and find new ways to reach them. It is especially useful when a team has run out of ideas, it shows what performance is possible, and the handbook says it drives <b>breakthrough</b> rather than continuous improvement.</p>
        <h3>Four steps</h3>
        <ol class="steps-v">
          <li><p>Analyze your own operation.</p></li>
          <li><p>Identify the competition and the industry leaders.</p></li>
          <li><p>Incorporate the best of the best.</p></li>
          <li><p>Determine how your organization can gain superiority.</p></li>
        </ol>
        <h3>Types</h3>
        ${G.table(["Type", "Compares with", "Upside", "Downside"], [
          ["Internal", "Other departments or divisions of your company", "Easy access", "Limited by your own culture, norms and history"],
          ["Competitive", "Direct competitors", "Forces an external view", "Industry practice may cap performance — especially if your industry is not known for quality"],
          ["Functional", "Similar functions, usually outside your industry", "Plenty of willing partners; ideal for best-practice hunting", "Requires translating practices across contexts"],
          ["Collaborative", "A group of organizations or functions cooperating", "Access to partners you could not reach otherwise", "Needs agreement and reciprocity"]
        ])}
        <p class="small soft">The BoK names “competitive, collaborative and best practices”. Best-practice benchmarking maps most closely to functional: learn from whoever is best at a function, in any industry — the handbook's example is studying a fast-food restaurant's order flow.</p>
        <h3>Benchmarking tips (Table 4.1, highlights)</h3>
        <div class="grid2">
          <ul class="small"><li>Tie projects to strategic goals; benchmark a <b>core</b> process.</li><li>Map and understand your own process before studying someone else's.</li><li>Get management commitment and process-owner involvement; keep middle managers in.</li><li>Research the partner before the visit; limit visits and visitors.</li></ul>
          <ul class="small"><li>Reciprocate — never ask for what you would not share.</li><li>Debrief as soon as possible — no more than three days after a visit.</li><li>Do not confuse benchmarking with industrial tourism.</li><li>Implement the best practices you find; that is the point.</li></ul>
        </div>
        ${G.trap(`<p>A downside of benchmarking <b>only within your industry</b>: at best it puts you in second place. Also, information gained in benchmarking is treated as protected, for internal use only (p. 118).</p>`)}
        ${G.tab(`<p>p. 84: tab Table 4.1. Do/don't tables feed “which is NOT recommended” items.</p>`)}`
    },
    {
      id: "owners", title: "Process owners and stakeholders", bok: "II.A.5", level: "Apply", pages: "87–88",
      html: `
        <div class="grid2">
          <div class="card"><h4>Process owner</h4><p>Responsible for the definition, execution, maintenance and improvement of a specific process. Usually <b>formally</b> recognised through procedures, work instructions, document-approval authority, a job description or the org chart. Sometimes also called the subject-matter expert.</p></div>
          <div class="card"><h4>Stakeholder</h4><p>Anyone with a vested interest in the process or its outputs: customers, suppliers, employees, investors, communities. Interest and involvement can change over time with economic and contractual conditions.</p></div>
        </div>
        <p>The most effective improvement teams include the process owner and representatives of all stakeholders, because stakeholders have the best process knowledge, tend to have the best improvement ideas, are most aware of unintended consequences, and their buy-in is usually needed to implement change.</p>
        <p><b>Stakeholders of a process:</b> operators and managers from all shifts; internal and external customers; internal and external suppliers; process design personnel; maintenance personnel; anyone else affected by changes.</p>
        ${G.w("ownersort")}
        ${G.trap(`<p>Every process owner is a stakeholder, but not every stakeholder is an owner. When a stem mentions formal documentation of responsibility or approval authority, pick <b>process owner</b>, not the broader “stakeholder”. Do not confuse the owner with the <b>champion</b>, an upper manager who removes barriers across projects (Chapter 9).</p>`)}`
    }
  ],
  check: [
    { q: "A project selection group is routing a problem: intermittent seal leaks on an existing filling line, root cause unknown, several process variables appear to interact, and a designed experiment will probably be needed. Which assignment best fits the handbook's guidance?",
      o: ["A lean team running a kaizen event", "A DFSS team using DMADV", "A Six Sigma team using DMAIC", "A just-do-it fix assigned to the process owner"], a: 2,
      why: "The handbook routes problems needing extensive data analysis and designed experiments to a Six Sigma team. The line exists, so it is improvement (DMAIC), not design.",
      d: { 0: "Lean/kaizen suits improvements that don't need heavy statistical techniques — the opposite of this stem.", 1: "True but not here: DFSS designs a new process or product. This line already exists.", 3: "Just-do-it requires a known, low-risk solution; here the cause is unknown." }, ref: "80" },
    { q: "Priya's team is building a SIPOC using the sequence in the handbook. After naming the process and agreeing on its start and end points, what should the team identify next?",
      o: ["Suppliers", "Inputs", "Customers", "Outputs"], a: 3,
      why: "Handbook order: process and boundaries, then outputs, then the inputs for each output, then customers, then back to suppliers.",
      d: { 0: "The acronym order is the trap; suppliers come last.", 1: "Inputs are identified for each output — so outputs must come first.", 2: "Customers follow inputs in the handbook's sequence." }, ref: "135" },
    { q: "A distribution centre wants to speed up order intake, so it studies how a fast-food chain takes and fills orders within minutes. This is best described as which type of benchmarking?",
      o: ["Functional", "Competitive", "Internal", "Collaborative"], a: 0,
      why: "Functional benchmarking compares similar functions, typically outside the organization's own industry.",
      d: { 1: "A fast-food chain is not a competitor of a distribution centre.", 2: "Internal benchmarking compares departments within the same company.", 3: "Collaborative benchmarking is a cooperative arrangement among several organizations; nothing in the stem describes one." }, ref: "83" },
    { q: "Which of the following is NOT one of the challenges the handbook associates with processes that cross functional areas?",
      o: ["Departments hiding poor performance rather than sharing information", "Teams with greater diversity tend to interact better", "Finance measures in dollars while production measures in defects", "Two areas each believing they have final authority over the process"], a: 1,
      why: "Diversity improving interaction is a true statement from Chapter 9 — true but not here. The four listed challenges are ownership, information sharing, commonality of measures and process knowledge.",
      d: { 0: "Sharing of information is a listed challenge.", 2: "Commonality of measures is a listed challenge.", 3: "Process ownership disputes are a listed challenge." }, ref: "85" },
    { q: "Marcus is named in the work instruction as responsible for defining, executing, maintaining and improving the returns-receiving process, and he approves revisions to it. In project terms, Marcus is the:",
      o: ["Process owner", "Champion", "Executive sponsor", "Stakeholder, but not the process owner"], a: 0,
      why: "Formal recognition in documentation plus responsibility for definition, execution, maintenance and improvement defines the process owner.",
      d: { 1: "A champion is an upper-level manager who removes barriers and approves projects, not the owner of one process.", 2: "The executive sets Six Sigma direction and allocates resources at business-unit level.", 3: "He is a stakeholder, but the stem describes the more specific owner role." }, ref: "87" },
    { q: "According to the handbook, a drawback of benchmarking only against organizations in your own industry is that it:",
      o: ["Requires sharing proprietary data with competitors", "Cannot be used to set stretch targets", "Tends to put the organization in second place at best", "Works only for non-core processes"], a: 2,
      why: "Copying the industry's best still leaves you behind the leader — second place at best.",
      d: { 0: "Reciprocity is encouraged, but sharing proprietary data is not the stated drawback.", 1: "Benchmarking exists to help set meaningful stretch targets.", 3: "Table 4.1 advises benchmarking core processes." }, ref: "82" },
    { q: "After a successful improvement, Jordan's control chart shows several points beyond the upper limit in the favourable direction. Applying the handbook's systems-thinking note, this is best interpreted as:",
      o: ["A measurement error that calls for recalibrating the gauge", "An expected signal that the system has changed for the better", "Proof the improvement failed and should be reversed", "A reason to widen the control limits immediately"], a: 1,
      why: "The handbook warns that a real improvement may push the chart out of control; expecting continuous improvement with charts that are always in control is not systems thinking.",
      d: { 0: "Nothing in the stem suggests gauge trouble — the shift matches the intended improvement.", 2: "The signal is favourable; reversing it would undo the gain.", 3: "Limits are recalculated from new stable data, not widened to hide a signal." }, ref: "87" },
    { q: "The handbook gives several reasons improvement teams should include stakeholders. Which is NOT one of them?",
      o: ["They have the best knowledge base about the process", "They tend to have the best ideas for improvement", "They are often most aware of unintended consequences", "They hold the legitimate authority to approve process changes"], a: 3,
      why: "Approval authority belongs to the process owner (and champions approve projects). The handbook's stakeholder reasons are knowledge, ideas, awareness of unintended consequences and buy-in.",
      d: { 0: "Listed reason.", 1: "Listed reason.", 2: "Listed reason." }, ref: "88" }
  ]
});
