G.chapter({
  id: "ch24", num: 24, title: "Total Productive Maintenance and Visual Factory", bok: "VI.C", pages: "449–463", drill: 30,
  lede: "Keep the improved process running and make its status obvious. Both subtopics are Understand level, but OEE is a favourite calculation — and the six big losses map straight onto it.",
  sections: [
    {
      id: "tpm", title: "TPM: elements and evolution", bok: "VI.C.1", level: "Understand", hy: true, pages: "449–453",
      html: `
        <p><b>Total productive maintenance</b> improves maintenance so failures are predicted or prevented, by integrating engineering, operations and maintenance and shifting routine tasks — inspect, clean, lubricate, adjust, simple calibration — to operators. That frees technicians for higher-level work. The goals: zero breakdowns, maximum productivity, zero defects, across the whole equipment life cycle.</p>
        <ol class="steps-v">
          <li><p><b>Breakdown maintenance</b> — repair after failure.</p></li>
          <li><p><b>Corrective maintenance</b> — modify equipment to prevent breakdowns or make maintenance easier.</p></li>
          <li><p><b>Preventive maintenance</b> — scheduled work to prevent unforeseen breakdowns.</p></li>
          <li><p><b>Productive maintenance</b> — preventive maintenance plus reliability, maintainability and equipment economics. TPM grew from these.</p></li>
        </ol>
        <p>The BoK also names <b>predictive maintenance</b>: watch for early signs (hidden or minor failures, anomalies) and act before the breakdown.</p>
        ${G.w("maint")}
        <p><b>TPM system elements:</b> maintenance infrastructure, goals and objectives; a data collection system (OEE); training and education; workflow and controls; operational involvement. Other useful data: <b>MTTR</b> (mean time to repair — maintenance responsiveness) and <b>MTBF</b> (mean time between failures — reliability).</p>
        ${G.w("tpmroles")}
        <p>TPM also supports waste removal — TIM WOOD: transportation, inventory, motion, waiting, overproduction, overprocessing, defects.</p>
        ${G.trap(`<p>TPM goes beyond preventive maintenance to include people, processes, systems and the environment. MTBF measures reliability; MTTR measures how fast repairs happen — distractors swap them.</p>`)}`
    },
    {
      id: "oee", title: "Overall equipment effectiveness", bok: "VI.C.1", level: "Understand", hy: true, pages: "451–456",
      html: `
        <div class="formula">OEE = Availability × Performance efficiency × Quality rate</div>
        <ul>
          <li><b>Availability</b> = actual operating time ÷ planned available time — losses from failures, setups and adjustments (downtime loss). Planned downtime (closed, scheduled maintenance, breaks, no demand) is removed first and is not a loss.</li>
          <li><b>Performance</b> = ideal cycle time × units ÷ operating time — losses from idling, minor stops and slow running (speed loss).</li>
          <li><b>Quality</b> = good units ÷ total units — first-pass yield (quality loss).</li>
        </ul>
        ${G.w("oee")}
        ${G.w("losses")}
        <p class="small">For labour-intensive work (assembly, administration, service), redefine the three factors and call it <b>overall labor effectiveness (OLE)</b>.</p>
        ${G.trap(`<p>The handbook's example gives availability 83.33%, performance 80% and quality 98% — the OEE is their <b>product</b>, 65.3%, not their average (87.1%) or the lowest factor (80%).</p>`)}
        ${G.tab(`<p>pp. 455–456: write “0.8333 × 0.80 × 0.98 = 0.653” under the example.</p>`)}`
    },
    {
      id: "visual", title: "Visual factory and visual management", bok: "VI.C.2", level: "Understand", hy: true, pages: "456–462",
      html: `
        <p>The visual factory makes problems visible, tells employees the current operating condition and communicates goals — charts, production boards, clear work instructions, lines, signs and labels, built on a solid 5S foundation.</p>
        <p>A <b>visual workplace</b> is self-ordering, self-explaining, self-regulating and self-improving. Information is turned into simple visual devices at the point of use, closing the “information deficit”.</p>
        ${G.w("stacklight")}
        <div class="cards">
          <div class="card"><h4>Andon board</h4><p>Lights (and sometimes a sound) pinpoint a stopped process step and call the group leader or maintenance; some show rate, totals, OEE and takt.</p></div>
          <div class="card"><h4>Single-point lesson</h4><p>A picture-first, almost text-free page showing how to do or inspect one thing, so defects are caught before more value is added.</p></div>
          <div class="card"><h4>Kanban cards</h4><p>Visual triggers to replenish or produce when parts are used up.</p></div>
          <div class="card"><h4>Colour coding</h4><p>Tags for good, scrap and hold; green/yellow/red inventory levels; file colours; a diagonal stripe that shows a manual is missing.</p></div>
          <div class="card"><h4>Lockout/tagout</h4><p>Prevents inadvertent energizing of equipment under maintenance.</p></div>
          <div class="card"><h4>Hour-by-hour chart</h4><p>Expected output per pitch versus actual, with reasons for misses, in processes with established flow.</p></div>
        </div>
        ${G.w("visualsort")}
        ${G.trap(`<p>A visual system is worthless if nobody responds to it. And visual controls first appear in the Measure phase and evolve through Control — control charts and dashboards count as visual controls.</p>`)}`
    },
    {
      id: "jidoka", title: "Jidoka", bok: "VI.C.2", level: "Understand", pages: "463",
      html: `
        <p><b>Jidoka</b> — autonomation, “automation with a human touch”, intelligent automation. Machines detect abnormalities and stop themselves; operators are alerted and respond with judgment. One person can handle several processes, defects are caught at once, and special-cause variation is detected.</p>
        ${G.table(["", "Poka-yoke", "Jidoka", "Andon"], [
          ["What it is", "A design feature that makes an error impossible or obvious", "Equipment that detects an abnormality and stops automatically", "A visual/audible signal of process status"],
          ["Main job", "Prevent the mistake", "Stop and alert when something goes wrong", "Call for help and show status"],
          ["Relationship", "One technique inside jidoka", "Uses poka-yoke, automatic stops and in-station quality checks", "Often triggered by a jidoka stop"]
        ], { rowHead: true })}
        ${G.trap(`<p>Jidoka is not full automation that removes people — it pairs machine detection with human judgment.</p>`)}`
    }
  ],
  check: [
    { q: "A machine has 90% availability, 80% performance efficiency and a 95% quality rate. What is its OEE?",
      o: ["88.3%", "80.0%", "68.4%", "72.0%"], a: 2,
      why: "0.90 × 0.80 × 0.95 = 0.684.",
      d: { 0: "The average of the three factors.", 1: "The lowest factor.", 3: "Availability × performance only — quality left out." }, ref: "451, 456" },
    { q: "Jams that the operator clears in less than a minute reduce which OEE factor?",
      o: ["Availability", "Quality rate", "Planned available time", "Performance efficiency"], a: 3,
      why: "Idling and minor stoppages are speed losses — performance.",
      d: { 0: "Availability covers breakdowns and changeovers.", 1: "Quality covers scrap, rework and start-up losses.", 2: "Planned time is set before losses are counted." }, ref: "451–452" },
    { q: "In the evolution that led to TPM, which stage came immediately before productive maintenance?",
      o: ["Preventive maintenance", "Breakdown maintenance", "Corrective maintenance", "Predictive maintenance"], a: 0,
      why: "Breakdown → corrective → preventive → productive.",
      d: { 1: "The first stage.", 2: "The second stage.", 3: "Not in the handbook's four-stage list." }, ref: "450" },
    { q: "On a three-colour stack light, yellow means:",
      o: ["Normal production", "The operator needs help", "Production has stopped", "Preventive maintenance is due"], a: 1,
      why: "Green = normal, yellow = help needed, red = stopped.",
      d: { 0: "Green.", 2: "Red.", 3: "Not one of the stack-light meanings." }, ref: "461" },
    { q: "Which best describes jidoka?",
      o: ["Full automation that removes the need for operators", "A replenishment signal triggered by consumption", "Automation with a human touch: the machine stops itself on an abnormality and alerts the operator", "A one-page picture lesson"], a: 2,
      why: "Jidoka (autonomation) pairs automatic detection and stopping with human judgment.",
      d: { 0: "The human element is the point.", 1: "That is kanban.", 3: "That is a single-point lesson." }, ref: "463" },
    { q: "A visual workplace is described as all of the following EXCEPT:",
      o: ["Self-ordering", "Self-explaining", "Self-regulating", "Self-funding"], a: 3,
      why: "The definition is self-ordering, self-explaining, self-regulating and self-improving.",
      d: { 0: "Part of the definition.", 1: "Part of the definition.", 2: "Part of the definition." }, ref: "458" },
    { q: "When calculating OEE, scheduled preventive maintenance time is:",
      o: ["Removed as planned downtime before availability is calculated", "Counted as an availability loss", "Counted as a performance loss", "Counted as a quality loss"], a: 0,
      why: "Planned downtime is excluded; availability is based on planned available time.",
      d: { 1: "Only unplanned downtime is an availability loss.", 2: "Performance losses are speed losses during operation.", 3: "Quality losses are defects and rework." }, ref: "451, 454" },
    { q: "Mean time between failures (MTBF) is best interpreted as a measure of:",
      o: ["How quickly repairs are made", "Equipment reliability", "Changeover efficiency", "First-pass yield"], a: 1,
      why: "MTBF reflects reliability (or the effectiveness of maintenance on the machine); MTTR reflects repair responsiveness.",
      d: { 0: "That is MTTR.", 2: "Changeover is measured by setup time.", 3: "That is the quality factor of OEE." }, ref: "451–452" }
  ]
});
