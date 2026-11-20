G.chapter({
  id: "ch7", num: 7, title: "Management and Planning Tools", bok: "II.D", pages: "114–138",
  lede: "One BoK line — define, select and apply eight tools — but the chapter covers about thirty. Selection questions (“which tool fits this situation?”) dominate, so learn each tool's job and its look-alike.",
  sections: [
    {
      id: "eight", title: "The eight BoK tools at a glance", bok: "II.D", level: "Apply", hy: true, pages: "114–138",
      html: `
        <div class="cards">
          <div class="card"><h4>Affinity diagram</h4><p>Organises many ideas (usually from brainstorming) into 5–10 natural groups. Notes are moved silently; a note that keeps moving gets duplicated; each group gets a header name.</p><p class="tr">Groups ideas; shows no cause and effect.</p></div>
          <div class="card"><h4>Interrelationship digraph</h4><p>Shows cause-and-effect among 6–12 issues. Arrows run from influencer to influenced. Most outgoing = driver; most incoming = outcome.</p><p class="tr">Driver and outcome get swapped in distractors.</p></div>
          <div class="card"><h4>Tree diagram</h4><p>Breaks a general topic into more specific contributors, two to five per level, until the bottom level is actionable. Check that each item contributes to the one above. CTQ and fault trees are versions.</p><p class="tr">Decomposes a goal; does not list countermeasures (that's PDPC).</p></div>
          <div class="card"><h4>Prioritization matrix</h4><p>Chooses among options: weight the criteria, rank each option on each criterion, multiply and sum. Highest total wins.</p><p class="tr">Weighted total, not a raw rank sum.</p></div>
          <div class="card"><h4>Matrix diagram</h4><p>Shows relationships between two groups of items, one listed across the top and one down the side, with strong / moderate / weak symbols. Common shapes beyond two groups: T, Y, X.</p><p class="tr">Shows relationships; doesn't pick a winner.</p></div>
          <div class="card"><h4>Process decision program chart</h4><p>A tree of a plan's steps with anticipated problems and possible solutions for each. A living document updated as the project proceeds.</p><p class="tr">Contingency planning for a plan, not failure modes of a product (FMEA).</p></div>
          <div class="card"><h4>Activity network diagram</h4><p>Shows task interdependencies, durations and serial versus parallel paths — like PERT and CPM, at overview or detailed level.</p><p class="tr">Use the Chapter 6 critical-path tool to practise.</p></div>
          <div class="card"><h4>SWOT analysis</h4><p>Strengths and weaknesses are internal; opportunities and threats are external. Strengths and weaknesses are not simply opposites.</p><p class="tr">Internal vs external is the whole test.</p></div>
        </div>
        ${G.w("toolpick")}
        ${G.tab(`<p>Make one index tab per tool on these pages: affinity p. 115, digraph p. 126, matrix p. 127, prioritization p. 131, PDPC p. 133, tree p. 137, SWOT p. 138, and activity network p. 114.</p>`)}`
    },
    {
      id: "digraph", title: "Interrelationship digraph", bok: "II.D", level: "Apply", hy: true, pages: "126–128",
      html: `
        <p>Arrange the concerns around a flip chart in no order. Starting at twelve o'clock, compare each note with every other one, asking <b>“Does A influence B more than B influences A?”</b> Draw the arrow that way, or none if there is no influence. Revise with data as needed.</p>
        ${G.w("digraph")}
        ${G.trap(`<p>Most <b>outgoing</b> arrows = <b>driver</b>, often a key cause. Most <b>incoming</b> arrows = <b>outcome</b>, often a source of the success metric. Ties or near-ties mean more than one driver.</p>`)}`
    },
    {
      id: "prio", title: "Prioritization matrix vs matrix diagram", bok: "II.D", level: "Apply", hy: true, pages: "127–131",
      html: `
        ${G.w("primatrix")}
        ${G.flag(`<p>In Fig. 7.13 (p. 131) the cost column contradicts the text. The text says packages A and C have the lowest cost and get 3.5 each, B is most expensive and gets 1, and D gets 3. Applying that gives A = 1.05, B = 0.30, C = 1.05, D = 0.90 in the cost column — but the figure prints 0.45, 1.20, 0.45, 0.90, which matches the opposite ranking. Totals move (A 3.40, B 1.40, C 3.60, D 1.90 using the text), but <b>package C wins either way</b>. On exam calculations, apply the method, not the printed figure.</p>`)}
        <div class="grid2">
          <div class="card"><h4>Matrix diagram</h4><p>Question: <i>how are these two lists related?</i> Output: a grid of relationship symbols the team discusses (e.g. which training units cover which objectives, and which cover nothing).</p></div>
          <div class="card"><h4>Prioritization matrix</h4><p>Question: <i>which option should we choose?</i> Output: a weighted score per option and a winner.</p></div>
        </div>`
    },
    {
      id: "pdpc", title: "Tree diagram vs PDPC", bok: "II.D", level: "Apply", pages: "133, 137",
      html: `
        <svg class="viz" viewBox="0 0 640 230" role="img" aria-label="PDPC: plan steps, problems, countermeasures">
          <rect x="220" y="6" width="200" height="38" rx="8" fill="var(--acc)"/><text x="320" y="30" text-anchor="middle" style="fill:#fff" font-size="13.5" font-weight="700">Plan: launch scan-to-confirm at packing</text>
          ${[["Train packers", 30], ["Install scanners", 245], ["Update the SOP", 460]].map(([t, x]) => `<line x1="320" y1="44" x2="${x + 75}" y2="74" stroke="#4F5E6C" stroke-width="1.5"/><rect x="${x}" y="74" width="150" height="34" rx="7" fill="#fff" stroke="var(--acc)" stroke-width="1.5"/><text x="${x + 75}" y="96" text-anchor="middle" font-size="12.5">${t}</text>`).join("")}
          ${[["Peak season", 30], ["Scanners late", 245], ["SOP owner away", 460]].map(([t, x]) => `<line x1="${x + 75}" y1="108" x2="${x + 75}" y2="128" stroke="#4F5E6C" stroke-width="1.5"/><rect x="${x}" y="128" width="150" height="34" rx="7" fill="var(--ooc-wash)" stroke="var(--ooc)" stroke-width="1.5"/><text x="${x + 75}" y="150" text-anchor="middle" font-size="12.5">Problem: ${t}</text>`).join("")}
          ${[["Train in 15-minute shift huddles", 30], ["Borrow units from returns", 245], ["Process owner signs an interim SOP", 460]].map(([t, x]) => `<line x1="${x + 75}" y1="162" x2="${x + 75}" y2="182" stroke="#4F5E6C" stroke-width="1.5"/><rect x="${x}" y="182" width="150" height="40" rx="7" fill="var(--belt-wash)" stroke="var(--belt)" stroke-width="1.5"/><foreignObject x="${x + 4}" y="184" width="142" height="36"><div xmlns="http://www.w3.org/1999/xhtml" style="height:36px;display:flex;align-items:center;justify-content:center;text-align:center;font-size:12px;line-height:1.15">Countermeasure: ${t}</div></foreignObject>`).join("")}
        </svg>
        <p>A <b>tree diagram</b> stops at the second row: it breaks the goal into activities. A <b>PDPC</b> adds what could go wrong (third row) and possible solutions (fourth row) — and it is updated as the project moves.</p>
        ${G.trap(`<p>PDPC vs FMEA: both anticipate problems, but the PDPC is about obstacles to <b>carrying out a plan</b>; FMEA is about how a <b>product or process</b> can fail, scored with an RPN.</p>`)}`
    },
    {
      id: "swot", title: "SWOT analysis", bok: "II.D", level: "Apply", pages: "138",
      html: `
        <div style="display:grid;grid-template-columns:auto 1fr 1fr;gap:.3rem;margin:.6rem 0 1rem;font-size:.92rem" role="table" aria-label="SWOT grid">
          <span></span><b role="columnheader" style="text-align:center">Helpful</b><b role="columnheader" style="text-align:center">Harmful</b>
          <b role="rowheader" style="writing-mode:vertical-rl;transform:rotate(180deg);text-align:center">Internal</b>
          <div style="background:#fff;border:1.5px solid var(--acc);border-radius:8px;padding:.5rem"><b>Strengths</b><br><span class="soft">introspective view of capabilities</span></div>
          <div style="background:#fff;border:1.5px solid var(--acc);border-radius:8px;padding:.5rem"><b>Weaknesses</b><br><span class="soft">not simply the opposite of strengths</span></div>
          <b role="rowheader" style="writing-mode:vertical-rl;transform:rotate(180deg);text-align:center">External</b>
          <div style="background:#fff;border:1.5px solid var(--ink-soft);border-radius:8px;padding:.5rem"><b>Opportunities</b><br><span class="soft">for the organization</span></div>
          <div style="background:#fff;border:1.5px solid var(--ink-soft);border-radius:8px;padding:.5rem"><b>Threats</b><br><span class="soft">to the organization</span></div>
        </div>
        <p>The question to ask: how can the organization use its strengths or improve its weaknesses to take advantage of opportunities while reducing or eliminating threats? SWOT also appears in Chapter 6 as a risk-analysis tool.</p>
        ${G.w("swot")}`
    },
    {
      id: "cycles", title: "PDCA, PDSA, SDCA and 8D", bok: "II.D (also VI.B.5)", level: "Apply", pages: "129–133",
      html: `
        <p>PDCA dates from 1939 with Shewhart, was updated by Deming, and was extended by Ishikawa and the Japanese quality-circle movement. It works for nearly any application — map the activities to P-D-C-A.</p>
        ${G.w("pdca")}
        <h3>Eight disciplines (8D) problem solving</h3>
        <ol class="steps-v">
          <li><p><b>Use a team approach.</b> A small group with process knowledge, line authority and the technical skills; it needs a designated champion. (The handbook says “group”, because it takes time to become a team.)</p></li>
          <li><p><b>Describe the problem</b> in quantifiable terms with 5W2H — who, what, when, where, why, how and how many.</p></li>
          <li><p><b>Start and check interim (containment) actions</b> so the customer sees no further problems.</p></li>
          <li><p><b>Define and check root causes</b>: list all potential causes, then isolate and verify the root cause with data.</p></li>
          <li><p><b>Check the corrective action</b> with a sampling plan; confirm it solves the problem without new issues (FMEA, control plans).</p></li>
          <li><p><b>Start permanent corrective action</b>: update procedures and train.</p></li>
          <li><p><b>Stop future problems</b>: change management and operating systems, and check similar processes elsewhere.</p></li>
          <li><p><b>Congratulate the team.</b></p></li>
        </ol>
        ${G.trap(`<p><b>Containment comes before root cause.</b> Protect the customer first (step 3), then find the cause (step 4). And Deming's switch from Check to Study was because checking is <b>reactive</b>; studying looks at issues as they occur.</p>`)}`
    },
    {
      id: "more", title: "Other Chapter 7 tools you may be asked about", bok: "II.D", level: "Apply", pages: "115–137",
      html: `
        <div class="cards">
          <div class="card"><h4>Advanced quality planning (AQP / APQP)</h4><p>Plan before starting: material, people, tools, safe methods. A cause-and-effect diagram helps. Think of it as the Plan step of PDSA.</p></div>
          <div class="card"><h4>Auditing</h4><p>Independent assessment against established plans and goals. Phases: planning, performance, reporting, closure. Types: first-party (internal), second-party (e.g. customer audits supplier), third-party (independent body). See ISO 19011.</p><p class="tr">Auditors are not police: be pleasant, prepared, factual, thorough.</p></div>
          <div class="card"><h4>Cause-and-effect (Ishikawa, fishbone)</h4><p>Developed by Kaoru Ishikawa in the 1940s. Effect y = f(causes x). Prompt with the six M's (plus money and management) or 5W1H. Can analyse <b>positive</b> effects too.</p></div>
          <div class="card"><h4>Check sheet</h4><p>Pre-categorised data collection during the process: agree categories, decide who/when/how, design for the workplace, collect consistently. Basis for attribute control charts.</p></div>
          <div class="card"><h4>Flowchart (Tague's steps)</h4><p>Define the process; set boundaries and detail level; brainstorm activities; sequence them; draw arrows when all agree; review with workers, supervisors, suppliers and customers.</p></div>
          <div class="card"><h4>Benchmarking (Ch 7 version)</h4><p>Flowchart current process, identify improvement areas, brainstorm, investigate others, plan, pilot, initiate, evaluate. Cross-industry is easier — it removes competitive concerns.</p></div>
          <div class="card"><h4>Sampling plan</h4><p>Juran: 100% inspection is only about 80% effective. Random sampling means every part has an equal chance of selection — vary the check time rather than always checking at quarter past the hour.</p></div>
          <div class="card"><h4>Control charts (overview)</h4><p>Variables data are measured on a continuous scale (time, weight); attributes data are counted (four errors, not four and a half). Details in Chapter 22.</p></div>
          <div class="card"><h4>Risk priority number</h4><p>RPN = S × O × D, from FMEA ratings. Use the full 1–1,000 range to separate the most important risks; it is relative, not a goal.</p></div>
        </div>
        ${G.w("forcefield")}`
    }
  ],
  check: [
    { q: "In an interrelationship digraph, the issue with the greatest number of outgoing arrows is called the:",
      o: ["Outcome", "Driver", "Bottleneck", "Root effect"], a: 1,
      why: "Most outgoing = driver, often a key cause of the problem.",
      d: { 0: "The outcome has the most incoming arrows.", 2: "A constraint (theory of constraints) term, not a digraph term.", 3: "Not a digraph term; it blends cause and effect." }, ref: "127" },
    { q: "After a brainstorming session, a team has about 70 sticky notes and wants to organise them into natural groups with header names. Which tool fits best?",
      o: ["Interrelationship digraph", "Tree diagram", "Affinity diagram", "Matrix diagram"], a: 2,
      why: "Affinity diagrams organise a large pool of ideas into 5–10 natural groups.",
      d: { 0: "Maps cause and effect between a manageable number of issues.", 1: "Breaks one goal into finer levels; doesn't cluster existing ideas.", 3: "Relates two lists of items." }, ref: "115–116" },
    { q: "Criteria weights are cost 0.5, ease of use 0.3 and training 0.2. Ranks (3 = best) are: X — cost 3, ease 1, training 2; Y — cost 1, ease 3, training 3; Z — cost 2, ease 2, training 1. Which option does the prioritization matrix favour?",
      o: ["X, total 2.2", "Y, total 2.0", "Y, total 7", "Z, total 1.8"], a: 0,
      why: "X = 1.5 + 0.3 + 0.4 = 2.2; Y = 0.5 + 0.9 + 0.6 = 2.0; Z = 1.0 + 0.6 + 0.2 = 1.8.",
      d: { 1: "Correct total for Y, but not the highest.", 2: "Adds ranks without weights — the classic error.", 3: "Correct total for Z, but the lowest." }, ref: "131" },
    { q: "Which tool lays out the steps of a plan, the problems that could arise at each step and possible countermeasures, and is updated as the project proceeds?",
      o: ["Failure mode and effects analysis", "Force-field analysis", "Tree diagram", "Process decision program chart"], a: 3,
      why: "The PDPC is a tree of anticipated problems and possible solutions, used as a dynamic document.",
      d: { 0: "True but not here: FMEA scores failure modes of a product or process with an RPN.", 1: "Lists driving and restraining forces for a desired state.", 2: "Breaks a goal down but has no problem-and-countermeasure layer." }, ref: "133" },
    { q: "Which statement about SWOT analysis is NOT correct?",
      o: ["Strengths and weaknesses describe internal capabilities", "Opportunities and threats come from outside the organization", "Strengths and weaknesses should be treated as opposites of each other", "The guiding question is how to use strengths to seize opportunities while mitigating threats"], a: 2,
      why: "The handbook explicitly says strengths and weaknesses should not be considered opposites.",
      d: { 0: "Correct.", 1: "Correct.", 3: "Correct — the handbook's guiding question." }, ref: "138" },
    { q: "In the 8D approach, which step immediately follows describing the problem?",
      o: ["Start and check interim (containment) actions", "Define and check root causes", "Use a team approach", "Start permanent corrective action"], a: 0,
      why: "Step 3 protects the customer with containment before the root-cause search in step 4.",
      d: { 1: "Step 4.", 2: "Step 1.", 3: "Step 6." }, ref: "132" },
    { q: "Why did Deming change the third step of the PDCA cycle from Check to Study?",
      o: ["ISO 9001 required a study phase", "Check is reactive; study examines issues as they occur", "Shewhart's original cycle used the word Study", "Study adds a standardisation step"], a: 1,
      why: "Checking reacts to what already happened; studying is proactive.",
      d: { 0: "Not the reason given.", 2: "The handbook credits the change to late in Deming's career.", 3: "Standardisation is SDCA's job." }, ref: "130–131" },
    { q: "In force-field analysis, the handbook notes that it is often more useful to:",
      o: ["Add as many driving forces as possible", "Rank the forces by multivoting only", "Ignore forces outside the team's control", "Reduce or remove restraining forces"], a: 3,
      why: "Removing restraints is often more effective than pushing harder on drivers.",
      d: { 0: "Focusing entirely on drivers is what the handbook cautions against.", 1: "The handbook suggests nominal group technique or similar for ranking.", 2: "Not stated." }, ref: "124" }
  ]
});
