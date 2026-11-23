G.chapter({
  id: "ch5", num: 5, title: "Voice of the Customer", bok: "II.B", pages: "89–100",
  lede: "Find out who the customers are, ask them well, and translate what they say into measurable requirements. All three subtopics are Apply level: expect calculations from the house of quality and classification of Kano and CTx scenarios.",
  sections: [
    {
      id: "ident", title: "Customer identification", bok: "II.B.1", level: "Apply", pages: "89–90",
      html: `
        <p>Ask “who is the customer of this project?” up front, then plan to go and talk to them. The handbook's VOC chapter defines customers relative to the <b>project boundary</b>; the SIPOC section in Chapter 7 defines them relative to the <b>enterprise</b>. Know both.</p>
        ${G.w("boundary")}
        <ul>
          <li><b>Find customers by:</b> brainstorming, SIPOC, and tracking a product or service through to delivery.</li>
          <li><b>Segment them</b> by requirement-driven categories: internal/external, age group (consumer products), geography (climate, language, ethnicity), industry type.</li>
          <li><b>Don't forget stakeholders outside the organization:</b> the board, organizations that buy from you, neighbours of your sites, and local, state and federal agencies. Your company's social responsibility — ask the safety lead — is a good prompt.</li>
          <li>When a team proposes any change, customers must be consulted or, at minimum, their concerns represented.</li>
        </ul>
        ${G.trap(`<p>In a VOC question, the department <b>right after your project's boundary</b> is an <b>external</b> customer of the project even though it sits inside your company. In a SIPOC question, the same department is an <b>internal</b> customer. Read which definition the stem uses.</p>`)}
        ${G.tab(`<p>p. 89 and p. 135: tab both pages and cross-reference them in the margins (“project boundary” vs “enterprise boundary”).</p>`)}`
    },
    {
      id: "data", title: "Collecting customer data", bok: "II.B.2", level: "Apply", pages: "90–91, 121–124, 127, 137",
      html: `
        <p>The simplest way to know what customers need is to ask them — experts routinely assume they already know. Statistically, the most valid approach is a <b>randomly selected, reasonably large group</b> of customers with complete and accurate data on each. Because that is often impossible, use several independent sources, play them against each other to see where they reinforce or contradict, verify accuracy and consistency, and resolve conflicting or ambiguous data.</p>
        ${G.table(["Tool", "Strength", "Weakness"], [
          ["Written survey", "Cheap, wide reach; a carefully worded survey can shed real light", "Low return rate; you rarely know who answered; accuracy questionable"],
          ["Interview (phone or in person)", "Higher response rate; more accurate data; extra information; interviewer reads emotion and body language", "More effort per response"],
          ["Focus group", "More depth and accuracy than other techniques", "Sample is often small and non-random — “the plural of anecdote is not data”"],
          ["Observation / going to the customer", "The handbook calls experiencing the customer's use of your product the most effective method", "Time-consuming"]
        ])}
        <p class="small"><b>Focus group planning:</b> set session goals, develop actual or prototype products, decide how sessions run (brainstorming, survey, cause-and-effect or question-response), and plan how to get customers to attend.</p>
        <p class="small"><b>Key point (p. 91):</b> once you have baseline data, talk to the people doing the work, then to people upstream and downstream — it builds support for the project.</p>
        ${G.w("survey")}
        ${G.trap(`<p>Customer data are almost always <b>observational</b>. A high correlation (say r = 0.83 between ads watched and money spent) does not justify a cause-and-effect conclusion (p. 126).</p>`)}`
    },
    {
      id: "qfd", title: "Quality function deployment: the house of quality", bok: "II.B.3", level: "Apply", hy: true, pages: "92–95",
      html: `
        <p>QFD links customer requirements to product and process features. Its input is the voice of the customer; its output is a traceable matrix from customer wants (<b>whats</b>) to technical requirements (<b>hows</b>) and targets. There is no single standard format.</p>
        ${G.w("hoq")}
        ${G.w("qfdcalc")}
        <ul>
          <li>The product-planning matrix can cascade into <b>part planning</b> and then <b>process planning</b> matrices — the outputs of one stage become the inputs of the next.</li>
          <li>Whats can be expressed as required (must have), necessary (expected) or optional (nice to have).</li>
          <li>More than about <b>25 customer voice lines</b> makes the matrix unmanageable — condense them first with an <b>affinity diagram</b>.</li>
        </ul>
        ${G.trap(`<p>The <b>roof</b> compares hows with hows. The <b>relationship matrix</b> compares whats with hows. Distractors swap them. Column weights are optional, and the 9-3-1 values are arbitrary choices, not a standard.</p>`)}
        ${G.tab(`<p>pp. 93–94: label every room on Fig. 5.1 using Fig. 5.2's map, and write “column weight = Σ importance × 9/3/1” at the bottom.</p>`)}`
    },
    {
      id: "ctx", title: "Critical to X and the CTQ tree", bok: "II.B.3", level: "Apply", hy: true, pages: "95–99",
      html: `
        <p>Customers state needs in general terms. <b>CTx</b> characteristics make them measurable, where x is the impact area. The handbook's key lesson: <b>the same characteristic can appear under several CTx labels for different reasons.</b></p>
        ${G.w("ctx")}
        <h3>CTQ tree: from need to measurable spec</h3>
        <svg class="viz" viewBox="0 0 640 210" role="img" aria-label="CTQ tree: need, drivers, measurable CTQs">
          <rect x="230" y="6" width="180" height="40" rx="8" fill="var(--acc)"/><text x="320" y="31" text-anchor="middle" style="fill:#fff" font-size="14" font-weight="700">Need: reliable delivery</text>
          ${[["On time", 20], ["Right item", 235], ["Undamaged", 450]].map(([t, x]) => `<line x1="320" y1="46" x2="${x + 85}" y2="84" stroke="#4F5E6C" stroke-width="1.5"/><rect x="${x}" y="84" width="170" height="36" rx="7" fill="#fff" stroke="var(--acc)" stroke-width="1.5"/><text x="${x + 85}" y="107" text-anchor="middle" font-size="13" font-weight="700">Driver: ${t}</text>`).join("")}
          ${[["Ship by 4 p.m. cut-off, ≥ 99.5% of orders", 20], ["Pick accuracy ≥ 99.9% of lines", 235], ["Damage claims ≤ 0.2% of cartons", 450]].map(([t, x]) => `<line x1="${x + 85}" y1="120" x2="${x + 85}" y2="150" stroke="#4F5E6C" stroke-width="1.5"/><rect x="${x}" y="150" width="170" height="52" rx="7" fill="#fff" stroke="#4F5E6C" stroke-width="1.5"/><foreignObject x="${x + 4}" y="152" width="162" height="48"><div xmlns="http://www.w3.org/1999/xhtml" style="height:48px;display:flex;align-items:center;justify-content:center;text-align:center;font-size:12px;line-height:1.2">CTQ: ${t}</div></foreignObject>`).join("")}
        </svg>
        <p class="small soft">Tree diagrams like this keep projects aligned with CTx and with critical customer requirements — the projects with the biggest impact on the customer and often on the business.</p>
        ${G.trap(`<p><b>CTP</b> is the odd one out: it refers to key process <i>input</i> variables (the x's in y = f(x)), not a requirement the customer states. And <b>CTD</b> covers early as well as late delivery — early stock is inventory the customer pays for before needing it.</p>`)}
        ${G.tab(`<p>pp. 97–99: the 15–20 lb example runs through CTQ, CTC and CTS — draw a bracket linking the three paragraphs and write “same spec, different reason”.</p>`)}`
    },
    {
      id: "kano", title: "Kano model", bok: "II.B.3", level: "Apply", hy: true, pages: "99–100",
      html: `
        <p>Noriaki Kano's model relates how fully a feature is delivered to how satisfied customers feel, using three kinds of quality:</p>
        ${G.table(["Type", "Absent", "Present", "Shape"], [
          ["Must-be", "Strong dissatisfaction", "Satisfaction only up to neutral — it can satisfy, never delight", "Curve in the lower half"],
          ["One-dimensional", "Dissatisfaction", "Satisfaction in direct proportion", "Straight line"],
          ["Delighter", "No effect", "Delight", "Curve in the upper half"]
        ])}
        ${G.w("kano")}
        ${G.w("kanosort")}
        ${G.trap(`<p>Delighters do not stay delighters. As they become common they drift toward one-dimensional and then <b>must-be</b> (cup holders). Also watch for “absent delighter causes dissatisfaction” — false; absence has no effect.</p>`)}
        ${G.tab(`<p>p. 100: draw an arrow on Fig. 5.8 from the delighter curve down to must-be and write “over time”.</p>`)}`
    },
    {
      id: "weight", title: "Weighting different kinds of input", bok: "II.B.3", level: "Apply", pages: "92–94",
      html: `
        <p>The BoK asks you to use weighting methods to amplify the importance and urgency of different kinds of input — a telephone call versus a survey response, a product complaint versus an expedited service request. The QFD importance column is one form of weighting; channel weights are another.</p>
        ${G.w("vocweight")}
        ${G.flag(`<p>The handbook chapter does not prescribe specific channel weights. Expect the exam to test the <i>idea</i> — weights change priorities — not particular numbers.</p>`, "Calibration note")}`
    }
  ],
  check: [
    { q: "In a house of quality, the triangular “roof” shows:",
      o: ["Relationships between customer requirements and technical requirements", "How customers rate competitors on each customer requirement", "Co-relationships among the technical requirements", "Importance ratings of the customer requirements"], a: 2,
      why: "The roof compares hows with hows: positive means both can improve together; negative means a trade-off.",
      d: { 0: "That is the relationship matrix in the centre.", 1: "That is the customer competitive assessment on the right.", 3: "Importance sits with the customer requirements on the left." }, ref: "94" },
    { q: "A customer requirement with importance 4 has a strong relationship with technical requirement T1, and another requirement with importance 2 has a moderate relationship with T1. Using 9-3-1 scoring and no other links, what is T1's column weight?",
      o: ["42", "36", "54", "18"], a: 0,
      why: "(4 × 9) + (2 × 3) = 36 + 6 = 42.",
      d: { 1: "Counts only the strong relationship and drops the moderate one.", 2: "Treats both links as strong: (4 + 2) × 9.", 3: "Adds the numbers instead of multiplying: 4 + 9 + 2 + 3." }, ref: "94" },
    { q: "When automobile cup holders first appeared, buyers were delighted; today a car without them would sell poorly. In Kano terms, cup holders moved from:",
      o: ["One-dimensional to delighter", "Must-be to delighter", "Must-be to one-dimensional", "Delighter to must-be"], a: 3,
      why: "Delighters become expected over time; the handbook's cup-holder example ends at must-be.",
      d: { 0: "Reverses the direction of change.", 1: "Reverses the direction of change.", 2: "Starts in the wrong category — they began as delighters." }, ref: "100" },
    { q: "A customer requires product weight between 15 and 20 lb because heavier units cause back injuries and lighter units tempt operators to carry several at once. This requirement is best classified as:",
      o: ["Critical to quality (CTQ)", "Critical to safety (CTS)", "Critical to cost (CTC)", "Critical to process (CTP)"], a: 1,
      why: "The reason stated is injury — safety. The same 15–20 lb spec could be CTQ or CTC for other reasons.",
      d: { 0: "Same spec, but CTQ is the conformance reason, not injury.", 2: "CTC would be the power-consumption reason.", 3: "CTP refers to key process input variables, not a customer-stated product spec." }, ref: "98–99" },
    { q: "Which of the following is NOT an advantage of interviews over written surveys, according to the handbook?",
      o: ["A higher response rate", "The interviewer can note body language and other non-verbal clues", "Less effort is required per response", "The interviewee may add information the questions did not capture"], a: 2,
      why: "The handbook says interviews take more effort; the payoff is better data.",
      d: { 0: "Listed advantage.", 1: "Listed advantage.", 3: "Listed advantage." }, ref: "127" },
    { q: "Which survey question most needs to be split into two questions?",
      o: ["“How satisfied are you with our delivery speed and our packaging?”", "“In the last 30 days, how many of your orders arrived late?”", "“Rate checkout speed from 1 (very slow) to 5 (very fast).”", "“Which carrier delivered your most recent order?”"], a: 0,
      why: "A double-barrelled question asks about two things with one answer, so a low score is uninterpretable.",
      d: { 1: "Specific, single topic, defined period.", 2: "One topic with a clearly anchored scale.", 3: "One factual item." }, ref: "90" },
    { q: "A project's boundary covers only the picking process. Using the VOC chapter's definitions, which are tied to the project boundary, the packing department immediately downstream is:",
      o: ["An internal customer", "A stakeholder only", "A supplier", "An external customer"], a: 3,
      why: "Chapter 5: internal customers work inside the process being studied; external customers are outside the project's boundaries.",
      d: { 0: "That is the SIPOC (enterprise) definition — correct definition, wrong context.", 1: "Packing receives the output, so it is a customer, not merely a stakeholder.", 2: "Packing is downstream; suppliers feed inputs in." }, ref: "89" },
    { q: "A QFD team has gathered 60 distinct customer voice statements. What does the handbook recommend before building the matrix?",
      o: ["An interrelationship digraph", "An affinity diagram", "A prioritization matrix", "A Kano survey"], a: 1,
      why: "More than about 25 voice lines becomes unmanageable; a convergent tool such as the affinity diagram condenses them.",
      d: { 0: "Finds cause-and-effect relationships, not groupings.", 2: "Chooses among options using weighted criteria.", 3: "Classifies quality types but does not condense the list." }, ref: "95" }
  ]
});
