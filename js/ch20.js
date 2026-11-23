G.chapter({
  id: "ch20", num: 20, title: "Implementation Planning", bok: "V.B", pages: "360–362", drill: 33,
  lede: "A three-page chapter with one Apply-level BoK line: know what a proof of concept, try-storming and a pilot test each do, when each happens, and what each filters out.",
  sections: [
    {
      id: "three", title: "Proof of concept, try-storming and pilot tests", bok: "V.B", level: "Apply", hy: true, pages: "360–361",
      html: `
        ${G.table(["", "Proof of concept", "Try-storming", "Pilot test"], [
          ["When", "Early-stage design validation", "Right after brainstorming", "Latter stages, before broad deployment"],
          ["Purpose", "Confirm feasibility and elicit feedback and inputs from stakeholders", "Quickly simulate or prototype the most feasible ideas; build the concept incrementally", "Determine readiness for broad use and find outstanding critical issues"],
          ["Form", "Demonstration of suitability, cost fit, success criteria", "Prototypes, simulations, role-plays, quickly adjusted IT screens", "Reduced scope, tight control, often off-peak"],
          ["Output", "Justification for resources, schedule and commitments", "Ideas vetted or discarded", "Verified solution and validated implementation plan"]
        ])}
        ${G.w("gates")}
        <h3>What a pilot proves</h3>
        <ul>
          <li>It verifies the Six Sigma solution is effective.</li>
          <li>It validates the implementation plan.</li>
          <li>It establishes that participants and stakeholders can deploy the change.</li>
          <li>It confirms that the solution, properly implemented, gives the desired results.</li>
          <li>It identifies unintended risks or side effects.</li>
        </ul>
        <p class="small">The handbook's side-effect example: automatic card renewal fixed missed payments, but removing the personal renewal call eliminated a chance to upsell — solving one problem created a new one in growth-oriented customer engagement.</p>
        ${G.w("implsort")}
        ${G.trap(`<p>Try-storming is <b>brainstorming plus action</b> — a prototype, simulation or role-play — not a second round of idea generation. A pilot is <b>late and limited in scope</b>, not a feasibility check. Proof of concept comes first.</p>`)}`
    },
    {
      id: "gates", title: "Using the three as gates", bok: "V.B", level: "Apply", pages: "362",
      html: `
        <p>The three steps are presented in series but can be concurrent and interdependent. Treated as sequential gates they make progress measurable:</p>
        <ul>
          <li><b>Proof-of-concept gate:</b> a project milestone that enables broader commitment.</li>
          <li><b>Try-storming gate:</b> a filter that quickly vets and discards approaches that are not feasible.</li>
          <li><b>Pilot gate:</b> controls scope and scale, so if the pilot reveals risks or deficiencies, rollback stays within bounds. Without this gate, new defects from a sub-optimal rollout can offset the project's benefits.</li>
        </ul>
        <p>Measure efficiency by the time and resources between steps. Weeks or months between proof of concept and try-storming suggest slippage or abandonment; racing to a pilot without adequate try-storming suggests ideas are lacking.</p>
        ${G.tab(`<p>pp. 360–362: one tab for the whole chapter; write “PoC = feasible? · Try-storm = filter · Pilot = ready? (limited scope)” across the top.</p>`)}`
    }
  ],
  check: [
    { q: "Before requesting budget, a team demonstrates to stakeholders that its proposed solution addresses the problem statement, fits within cost constraints and can meet their success criteria. This is a:",
      o: ["Proof of concept", "Pilot test", "Try-storming session", "Kaizen blitz"], a: 0,
      why: "Proof of concept is early-stage validation of feasibility that justifies resources and commitments.",
      d: { 1: "A pilot comes late and tests readiness for deployment.", 2: "Try-storming prototypes ideas from brainstorming; it is not about securing commitment.", 3: "A kaizen blitz is a week-long improvement event (Chapter 21)." }, ref: "360" },
    { q: "Try-storming is best described as:",
      o: ["A pilot run during off-peak hours", "Brainstorming with immediate prototyping, simulation or role-play of the most feasible ideas", "A silent idea-generation technique", "A final validation before deployment"], a: 1,
      why: "It extends brainstorming by quickly simulating or prototyping solutions so participants can add incremental improvements.",
      d: { 0: "That describes a pilot test.", 2: "That describes nominal group technique.", 3: "Final readiness checking is the pilot's job." }, ref: "361" },
    { q: "Which is NOT a purpose of a pilot test?",
      o: ["Verify the effectiveness of the solution", "Validate the implementation plan", "Generate as many new solution ideas as possible", "Identify unintended side effects"], a: 2,
      why: "Idea generation belongs to brainstorming and try-storming, not to the pilot.",
      d: { 0: "A listed purpose.", 1: "A listed purpose.", 3: "A listed purpose." }, ref: "361" },
    { q: "A subscription business makes card renewal automatic. Missed payments drop, but the personal renewal call that produced upsell revenue disappears. Which implementation step is designed to surface this kind of problem before full rollout?",
      o: ["Proof of concept", "Try-storming", "Brainstorming", "Pilot test"], a: 3,
      why: "Identifying unintended risks or side effects is a stated purpose of the pilot.",
      d: { 0: "Too early — it establishes feasibility.", 1: "Explores and filters ideas; it is not a controlled field trial.", 2: "Generates ideas only." }, ref: "361" },
    { q: "As a gate, try-storming mainly acts as a:",
      o: ["Filter that quickly discards approaches that are not feasible", "Milestone that unlocks broader commitment", "Control on scope so changes can be rolled back", "Source of training records"], a: 0,
      why: "The handbook describes the try-storming gate as a filter that vets and discards infeasible approaches.",
      d: { 1: "That is the proof-of-concept gate.", 2: "That is the pilot-test gate.", 3: "Not a gate function in the handbook." }, ref: "362" },
    { q: "Months have passed between a project's proof of concept and its first try-storming session. According to the handbook, this most likely signals:",
      o: ["A well-planned project", "That ideas are lacking", "Slippage or even abandonment of the project", "That the pilot can be skipped"], a: 2,
      why: "Long gaps between gates suggest slippage or abandonment; a rush to pilot without try-storming suggests a lack of ideas.",
      d: { 0: "The handbook treats long gaps as a warning.", 1: "That is the signal for skipping quickly to the pilot.", 3: "Nothing justifies skipping the pilot gate." }, ref: "362" }
  ]
});
