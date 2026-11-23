G.chapter({
  id: "ch23", num: 23, title: "Sustain Improvements", bok: "VI.B", pages: "427–448", drill: 30,
  lede: "Hold the gains: control plans, controlled documents, training that changes behaviour, audits, and the PDCA family. Audits are the only Remember-level item in this guide — know the three party types cold.",
  sections: [
    {
      id: "cplan", title: "Control plan", bok: "VI.B.1", level: "Apply", hy: true, pages: "427–432",
      html: `
        <p>The control plan exists to <b>hold the gains</b> from the earlier phases. It is a living document that tells operators how to control the work flow during full production. At a minimum it shows:</p>
        <ul>
          <li>A flowchart or picture of the process with the desired outcomes.</li>
          <li>Special and safety characteristics, clearly marked.</li>
          <li>How each highlighted characteristic relates to its controlling process settings.</li>
          <li>Gauges and test equipment; sample sizes and frequencies.</li>
          <li>Reactions to FMEA conditions; reaction plans operators can understand.</li>
          <li>Criteria to verify accuracy and alignment with the next operation.</li>
        </ul>
        <h3>Six steps to build one</h3>
        <ol class="steps-v">
          <li><p>Specify the variables with direct or indirect impact on the remedy and the customer.</p></li>
          <li><p>Establish control limits and standards for when to act.</p></li>
          <li><p>Measure and set baselines.</p></li>
          <li><p>Specify timing and location of measurement and choose the control chart.</p></li>
          <li><p>Assign who reviews results, spots out-of-control conditions and diagnoses causes.</p></li>
          <li><p>Put troubleshooting and corrective actions in place, and adapt the plan as you learn.</p></li>
        </ol>
        ${G.w("cplan")}
        <p>Deming urged managers to fix the process, not the people: about 80% of the time the real issue is in the system. Operators' data collection shows they followed the plan, so problems can be traced to the system.</p>
        ${G.trap(`<p>A control plan controls the <b>process</b>, not just the outputs — it should let operators decide whether to start, continue, pause or stop. Incoming-material checks, first-piece inspection and control charts are all process controls.</p>`)}
        ${G.tab(`<p>p. 428: list the eight elements (control subject → version) in the margin.</p>`)}`
    },
    {
      id: "dcp", title: "Dynamic control plans, gage control and SOPs", bok: "VI.B.1", level: "Apply", pages: "432–435",
      html: `
        <p>A <b>dynamic control plan</b> combines SOPs, the control plan, FMEA, the gage control plan and quality planning sheets into one living document that operators have the right and responsibility to update. Its matrix covers launch, team structure, a question log, support information, preliminary controls, the process FMEA, the control plan, illustrations and instructions, and implementation and maintenance.</p>
        <p>A <b>gage control plan</b> covers storage, care, calibration and handling of gauges, supported by gauge R&amp;R results (Chapter 14).</p>
        <p><b>Standard operating procedures</b> (also called work instructions, level-three ISO 9001 documents, job aids) answer what the job is, where and when the SOP applies, and who is responsible. Operators follow them as written, document any deviation and why, and update them when the process changes — with review by affected functions.</p>
        ${G.flag(`<p>The handbook expands SDCA as standardize-do-check-<b>act</b> on p. 432 and standardize-do-check-<b>adjust</b> on p. 435, and mentions a standardize-do-study-act variant on p. 448. Any of these can appear; the idea is the same — lock in the gain.</p>`, "Calibration note")}`
    },
    {
      id: "ci", title: "Continual improvement and variability", bok: "VI.B.1", level: "Apply", pages: "435–437",
      html: `
        <ol class="steps-v">
          <li><p><b>Early 1900s — Taylor:</b> work specialization; workers stop checking their own work and inspectors take over.</p></li>
          <li><p><b>Late 1920s — Shewhart:</b> the first control chart; SPC is born.</p></li>
          <li><p><b>World War II:</b> charting becomes a requirement in the United States.</p></li>
          <li><p><b>1951 — Feigenbaum:</b> total quality control; senior management adopts quality as strategy (the TQM era).</p></li>
          <li><p><b>1960s–1970s:</b> quality circles and employee involvement.</p></li>
          <li><p><b>1980s:</b> resurgence of SPC. <b>1990s:</b> ISO 9001 and the Malcolm Baldrige award. Then lean, kaizen, poka-yoke — and Six Sigma.</p></li>
        </ol>
        <p>Deming changed <b>continuous</b> to <b>continual</b> improvement because improvement levels off or steps back at times. His <b>system of profound knowledge</b> has four parts: appreciation for a system, knowledge about variation, theory of knowledge, and psychology.</p>
        <p><b>Variability</b> has three components: <b>instability</b> (special and common causes unchecked — capability isn't worth calculating), <b>variation</b>, and <b>off-target</b> (often set by engineering design decisions).</p>
        ${G.w("variability")}`
    },
    {
      id: "docs", title: "Document control", bok: "VI.B.2", level: "Understand", pages: "437–438",
      html: `
        <p>Improve-phase changes must trigger timely revisions of the affected documents — otherwise obsolete procedures and control plans undermine the change. Documents are controlled by <b>approved release as of a date, by a recognised authority</b> (quality director, plant manager), and must be traceable to the processes they govern.</p>
        <ul>
          <li>Purpose, intended distribution and restrictions (internal, confidential).</li>
          <li>References to the affected processes and associated documents.</li>
          <li>Special documents and records clearly shown.</li>
          <li>The relationship to parent documents, for traceability.</li>
          <li>A warning that printed copies are uncontrolled — check the online version.</li>
        </ul>
        ${G.w("docrec")}
        ${G.trap(`<p><b>Documents</b> (templates, instructions) are released to guide the work; <b>records</b> are completed evidence that it was done — and gaps in records tell the team the improvement was not fully deployed.</p>`)}`
    },
    {
      id: "training", title: "Training plans", bok: "VI.B.3", level: "Apply", hy: true, pages: "438–442",
      html: `
        <p>Training differs from general education: it must produce <b>specific competencies</b>, building on existing skills. The level must go beyond knowing and understanding to <b>applying</b> the new method correctly.</p>
        <ol class="steps-v">
          <li><p><b>Needs analysis and business case</b> — gaps in skills and knowledge, flawed environments or incentives, motivation; scope, schedule and value. Include cross-training for upstream and downstream processes, reinforcement of existing practices and the “net-new” content.</p></li>
          <li><p><b>Strategic planning and learning experiences</b> — scope, trainee background (novice versus expert), resources, time and budget, mode (class, on site, online), chances to demonstrate.</p></li>
          <li><p><b>Documentation, facilitation and provision</b> — objectives written as performance targets; facilitators who advocate for the change against legacy habits; delivery that suits the learners (hands-on for tactile learners).</p></li>
          <li><p><b>Validation and confirmation</b> — exams, demonstrations, ongoing monitoring, verifying completed work; training records.</p></li>
          <li><p><b>Reinforcement</b> — apply immediately, remove the option of reverting to old methods, refresh periodically.</p></li>
        </ol>
        ${G.w("trainval")}
        ${G.trap(`<p>Success is <b>not</b> measured by certificates issued, hours in class or satisfaction scores. It is measured by sustained behaviour change and performance — ideally the disappearance of special causes.</p>`)}`
    },
    {
      id: "audits", title: "Audits", bok: "VI.B.4", level: "Remember", pages: "442–445",
      html: `
        ${G.table(["Type", "Who audits whom", "Typical purpose"], [
          ["First-party", "The organization audits itself (internal, between functions)", "Confirm controls are in place and respected for internal customers"],
          ["Second-party", "A customer audits its supplier", "Condition of orders or of the business relationship"],
          ["Third-party", "An independent registrar, accreditation or regulatory body", "Certification against a standard; regulatory compliance; market entry"]
        ])}
        <p><b>Audit scope can cover:</b> documents (the preliminary step that sets acceptance criteria), products and services, processes, and systems (including misalignment between functions, such as just-in-time purchasing supporting a build-to-stock strategy).</p>
        <p>Audit findings (objective evidence) compared with audit criteria lead to conclusions. Audits validate both compliance and the <b>effectiveness</b> of the improvement — e.g. certified components can be undermined by mishandling inside the plant.</p>
        ${G.w("audits")}
        ${G.trap(`<p>The party number describes the relationship, not the size or formality. You auditing your supplier is second-party; your registrar auditing you is third-party.</p>`)}`
    },
    {
      id: "pdca", title: "PDCA, PDSA and SDCA", bok: "VI.B.5", level: "Apply", hy: true, pages: "445–448",
      html: `
        ${G.w("pdca")}
        <p><b>Ishikawa's improved PDCA:</b> Plan — determine goals and targets, and the methods of reaching them. Do — engage in education and training, then implement. Check — check the effects. Act — take appropriate action.</p>
        ${G.table(["PDCA", "DMAIC", "8D (handbook mapping)"], [
          ["Plan", "Define", "Use a team; identify the problem"],
          ["Do", "Measure", "Describe the problem; interim containment"],
          ["Check / Study", "Analyze, Improve", "Root cause; develop solutions"],
          ["Act", "Control", "Implement solutions; prevent recurrence; congratulate the team"]
        ])}
        <p><b>PDSA</b> is for reviewing a process for improvement ideas; <b>SDCA</b> keeps the process stable and maintains the gains. Used together they cover both sides of continual improvement.</p>
        ${G.trap(`<p>Act is a decision point: return to Plan if results are unsatisfactory, or standardize if they are satisfactory. Deming's Study compares results with the predictions made in Plan.</p>`)}`
    }
  ],
  check: [
    { q: "The primary purpose of a control plan is to:",
      o: ["Hold the gains achieved in the earlier DMAIC phases", "Identify the root cause of the problem", "Replace the need for control charts", "Document the project charter"], a: 0,
      why: "The control plan exists to hold the gains realized through the earlier phases.",
      d: { 1: "Root-cause analysis belongs to Analyze.", 2: "Control charts are usually part of the control plan.", 3: "The charter is a Define document." }, ref: "428" },
    { q: "Which control plan element states who decides on and carries out the actions when a measure falls outside its limits?",
      o: ["Performance standard", "Decision / deployment", "Measurement rules", "Record"], a: 1,
      why: "Decision/deployment shows who decides and who carries out the actions.",
      d: { 0: "Sets the limits for evaluating performance.", 2: "Device, frequency, sample size and manner of recording.", 3: "Where actions are recorded and archived." }, ref: "428" },
    { q: "A major retailer audits a supplier's warehouse as a condition of continued orders. From the supplier's point of view, this is a:",
      o: ["First-party audit", "Third-party audit", "Second-party audit", "Document audit"], a: 2,
      why: "A customer auditing its supplier is a second-party audit.",
      d: { 0: "First-party audits are internal.", 1: "Third-party audits are done by registrars or regulators.", 3: "A document audit is a preliminary scope step, not a party type." }, ref: "443" },
    { q: "Which is the strongest evidence that a training program sustained the improvement?",
      o: ["High satisfaction scores on the course evaluation", "The number of completion certificates issued", "Total classroom hours delivered", "Monitoring shows trained operators' work meets the new performance targets"], a: 3,
      why: "Validation must show learning and changed behaviour — verified work performance.",
      d: { 0: "Satisfaction is not proof of learning.", 1: "The handbook says certificates are not the measure.", 2: "Hours are not the measure either." }, ref: "441–442" },
    { q: "Why did Deming prefer the term continual improvement to continuous improvement?",
      o: ["Continuous implies a single breakthrough", "Improvement sometimes levels off or steps back before advancing", "ISO 9001 required the change", "Continual refers only to manufacturing"], a: 1,
      why: "Nature and people don't improve in an unbroken line; there are plateaus and steps back.",
      d: { 0: "Not the handbook's reasoning.", 2: "Not stated.", 3: "Continual improvement applies everywhere." }, ref: "436" },
    { q: "Which is NOT one of the four parts of Deming's system of profound knowledge?",
      o: ["Appreciation for a system", "Knowledge about variation", "Process capability", "Psychology"], a: 2,
      why: "The four parts are appreciation for a system, knowledge about variation, theory of knowledge and psychology.",
      d: { 0: "One of the four.", 1: "One of the four.", 3: "One of the four." }, ref: "436" },
    { q: "A process is stable and has a narrow spread, but it is centred well away from the target. Which component of variability is the main problem?",
      o: ["Off-target", "Instability", "Variation", "Measurement error"], a: 0,
      why: "Variability = instability + variation + off-target; this process is stable and tight but off-target.",
      d: { 1: "The process is stable.", 2: "The spread is already narrow.", 3: "Nothing points to the gauge." }, ref: "436–437" },
    { q: "Which cycle is used mainly to keep an improved process stable and maintain its gains?",
      o: ["PDSA", "DMADV", "8D", "SDCA"], a: 3,
      why: "SDCA standardizes the improvement; PDSA looks for the next improvement.",
      d: { 0: "PDSA drives improvement.", 1: "DMADV designs new processes (DFSS).", 2: "8D is a problem-solving method." }, ref: "448" }
  ]
});
