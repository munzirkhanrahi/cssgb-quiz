G.chapter({
  id: "ch18", num: 18, title: "Additional Analysis Methods", bok: "IV.C", pages: "329–333", drill: 33,
  lede: "Two Analyze-level topics: baseline the gap between current and future state, and find the true root cause. The short chapter carries a lot of questions (33 in the drill bank) — expect scenarios about when to stop asking why, AND vs OR logic, and which tool fits the problem.",
  sections: [
    {
      id: "gap", title: "Gap analysis", bok: "IV.C.1", level: "Analyze", hy: true, pages: "329–330",
      html: `
        <p>Baseline the current state with <b>predefined metrics</b> before improving. Without knowing where you started, you can't know where you landed. A documented baseline lets you:</p>
        <ol class="steps-v">
          <li><p>Identify the stakeholders needed for a cross-functional effort.</p></li>
          <li><p>Identify the resources required.</p></li>
          <li><p>Secure a leadership commitment.</p></li>
          <li><p>Measure progress after the improvement.</p></li>
          <li><p>State the improvement as financial and economic benefits.</p></li>
        </ol>
        <div class="grid2">
          <div class="card"><h4>Proactive gap analysis</h4><p>Customer perception before a product or service launch; operational efficiency before an organizational change.</p></div>
          <div class="card"><h4>Reactive gap analysis</h4><p>Customer satisfaction after a launch; operational efficiency after the change.</p></div>
        </div>
        <p>Start from the objective and choose metrics that will clearly show the difference the change makes — measured up front. Some gaps are obvious at Define (customer satisfaction); others only appear as the analysis “peels the onion”. Gap analysis also covers areas like energy use (ISO 50001:2018).</p>
        ${G.w("gap")}
        <p>Tools for gap analysis: audits, assessments, value stream analysis, FMEA and hypothesis testing.</p>
        ${G.trap(`<p>The metrics are <b>predefined</b> — chosen before the change, so the before-and-after comparison is fair. Picking metrics afterward to show improvement isn't gap analysis.</p>`)}`
    },
    {
      id: "why", title: "5 Whys (why-why analysis)", bok: "IV.C.2", level: "Analyze", hy: true, pages: "331–332",
      html: `
        <p>Keep asking “why” until you reach the root cause. It needs no special training — only persistence. “Five” is a guideline: the root cause may appear at the third why or the ninth, which is why many organizations now call it <b>why-why analysis</b>.</p>
        ${G.w("fivewhy")}
        <h3>When to stop</h3>
        <ul>
          <li><b>Too soon</b> (second or third why) and the cause is still shallow — the Toyota team would have stocked fuses, or poured on oil and caused spills and accidents.</li>
          <li><b>Too far</b> and it becomes too broad to act on — “organizational culture”, “market conditions”.</li>
          <li><b>Stop</b> where the cause is specific and actionable, and you have no control over the next why — and make sure it addresses the <b>process or system</b> breakdown so the problem can't recur elsewhere.</li>
        </ul>
        <h3>Verify the root cause</h3>
        <p>The strongest check is to switch the cause on and off and watch the problem appear and disappear. Where that's impractical or would hurt customers, use creative alternatives such as simulation. Finally, verify that the problem doesn't recur — customer complaints are the reactive check.</p>
        ${G.trap(`<p>“No filter on the pump” is a root cause; “no error-proofed preventive maintenance process” is the <b>system-level</b> root cause that also prevents a missing washer on a different machine. When an option offers the process-level cause, it usually beats the part-level one.</p>`)}`
    },
    {
      id: "fta", title: "Fault tree analysis", bok: "IV.C.2", level: "Analyze", pages: "332–333",
      html: `
        <p><b>FTA</b> is a top-down analysis: start from the system failure (top event) and work down through combinations of lower-level events joined by logic gates. Mainly a reliability-engineering tool, it also works for program planning — a top-level objective broken into next-tier objectives with AND/OR relationships.</p>
        <p>Uses: understand the AND/OR logic of a failure; find the significant contributors and prioritize; optimize resources for the highest system reliability; help maintenance troubleshoot to the root cause.</p>
        <p>Unlike the 5 Whys, which follows one chain, FTA allows several causes at each level, in combination or independently, each with its own probability.</p>
        ${G.w("fta")}
        ${G.table(["Gate", "Top event occurs when", "Probability (independent events)"], [
          ["AND", "All inputs occur", "p₁ × p₂ × … (redundancy — much smaller)"],
          ["OR", "Any input occurs", "1 − (1 − p₁)(1 − p₂)… (≈ p₁ + p₂ + … only when all are small)"]
        ])}
        ${G.flag(`<p>p. 333 ends: “All the probabilities sum up to the top-level cause.” Probabilities combine by the gate logic — multiplied through AND gates, and through OR gates by 1 − Π(1 − p). Summing is only an approximation for OR gates with small, independent probabilities, and can even exceed 1.</p>`)}
        ${G.trap(`<p>FMEA is bottom-up (each failure mode → its effects); FTA is top-down (one undesired event → its causes). A question that starts from a single system failure and asks for combinations of causes wants FTA.</p>`)}`
    },
    {
      id: "rca", title: "Choosing a root-cause tool", bok: "IV.C.2", level: "Analyze", pages: "174–181, 331–333",
      html: `
        ${G.table(["Tool", "Best for", "Chapter"], [
          ["Cause-and-effect (fishbone)", "Brainstorming many possible causes in categories", "10"],
          ["Relationship matrix", "Scoring causes against several effects (9/3/1)", "10"],
          ["Pareto chart", "Deciding which problem or cause to work on first", "10"],
          ["5 Whys", "Drilling one cause chain to an actionable, system-level cause", "18"],
          ["Fault tree analysis", "System failures with multiple, combined causes and probabilities", "18"],
          ["Scatter diagram, regression", "Confirming a suspected x–y relationship with data", "13, 16"],
          ["Multi-vari", "Finding which family of variation dominates", "16"],
          ["Hypothesis tests", "Confirming a cause with statistical evidence", "17"]
        ])}
        ${G.w("rcatool")}
        ${G.trap(`<p>Brainstorming tools (fishbone, 5 Whys) generate <b>hypotheses</b> about causes. Data tools (scatter, multi-vari, hypothesis tests, turning the cause on and off) <b>verify</b> them. The Analyze phase isn't finished until the root cause is verified.</p>`)}`
    }
  ],
  check: [
    { q: "Before starting a value-stream improvement, a Green Belt records lead time, RTY, OEE and COPQ for the current process. The main purpose is to:",
      o: ["Satisfy the audit department", "Show the improvement later against a baseline", "Replace the project charter", "Calculate the control limits"], a: 1,
      why: "Baselining predefined metrics lets you measure progress, justify resources and quantify the financial benefit after the change.",
      d: { 0: "Not the stated purpose.", 2: "The charter remains; the baseline supports it.", 3: "Control limits come from SPC data in the Control phase." }, ref: "329–330" },
    { q: "Measuring customer satisfaction after a new service has launched is an example of:",
      o: ["Proactive gap analysis", "Fault tree analysis", "Reactive gap analysis", "Benchmarking"], a: 2,
      why: "After-the-fact measurement of satisfaction or efficiency is reactive; before the launch or change it would be proactive.",
      d: { 0: "Proactive happens before the launch.", 1: "FTA analyzes failure logic.", 3: "Benchmarking compares with others." }, ref: "329–330" },
    { q: "In a 5 Whys analysis, the team reaches “there is no filter on the pump.” According to the handbook, the team should:",
      o: ["Stop — five whys have been asked", "Stop — a specific cause has been found", "Keep asking until the answer is “organizational culture”", "Keep asking until a process or system-level cause is reached"], a: 3,
      why: "The handbook continues to “no error-proofing and no defined PM process” so the fix prevents similar failures elsewhere.",
      d: { 0: "Five is a guideline, not a rule.", 1: "Specific but not yet system-level.", 2: "Too broad to act on." }, ref: "331–332" },
    { q: "Which is the most convincing way to verify a suspected root cause?",
      o: ["Turn the cause on and off and see the problem appear and disappear", "Ask the team to vote", "Count how many whys were asked", "Wait for customer complaints to stop"], a: 0,
      why: "Recreating and removing the problem by switching the cause is the strongest verification, where practical.",
      d: { 1: "Voting isn't verification.", 2: "The number of whys proves nothing.", 3: "That's a slow, reactive check — useful as final confirmation, not first proof." }, ref: "332" },
    { q: "A system fails only if both the primary pump AND the backup pump fail. Each fails independently with probability 0.1 per month. The probability of system failure per month is:",
      o: ["0.20", "0.19", "0.10", "0.01"], a: 3,
      why: "AND gate: 0.1 × 0.1 = 0.01.",
      d: { 0: "Summing — wrong for an AND gate.", 1: "That's the OR result, 1 − 0.9².", 2: "One pump alone." }, ref: "333" },
    { q: "A Green Belt starts with one undesired system event and works downward to identify combinations of causes and their probabilities. The tool is:",
      o: ["Process FMEA", "Fault tree analysis", "Pareto analysis", "Cause-and-effect diagram"], a: 1,
      why: "FTA is top-down, uses AND/OR logic and assigns probabilities.",
      d: { 0: "FMEA is bottom-up, from failure modes to effects.", 2: "Pareto prioritizes categories.", 3: "A fishbone lists causes without logic gates or probabilities." }, ref: "332–333" },
    { q: "A team has brainstormed 30 possible causes of late deliveries on a fishbone diagram. What should happen next?",
      o: ["Implement fixes for all 30 causes", "Start a new brainstorm with a different team", "Converge on the likely causes and verify them with data", "Draw a fault tree for each cause"], a: 2,
      why: "Brainstorming produces hypotheses; prioritize (multivoting, NGT, Pareto of collected data) and verify before acting.",
      d: { 0: "Unverified fixes waste resources.", 1: "More ideas don't verify any.", 3: "FTA isn't needed for every cause." }, ref: "175–176, 331–333" }
  ]
});
