G.chapter({
  id: "ch8", num: 8, title: "Business Results for Projects", bok: "II.E", pages: "139–143",
  lede: "The calculation chapter of the Define phase, and the only Define subtopic tested at Analyze level for calculations: DPU, DPMO, RTY, sigma level, capability indices and cost of quality. Tab these pages first.",
  sections: [
    {
      id: "bsc", title: "Business and project measures", bok: "II.E.1", level: "Analyze", pages: "139–140",
      html: `
        <p>Results (performance measures) should be identified during initial planning and refined as the project progresses. Business performance is usually tracked with a <b>balanced scorecard</b> or with <b>performance to established goals</b>.</p>
        <div class="grid2">
          <div class="card"><h4>Balanced scorecard</h4><p>Kaplan and Norton (early 1990s): financial measures only describe the past and only one part of the business. Measure <b>financial, customer, internal process, and learning and growth</b> so that no single area outweighs the others.</p></div>
          <div class="card"><h4>Performance to goals</h4><p>Set goals and periodically measure against them — “raise sales 10% over last year”, “every employee gets 40 hours of job training”.</p></div>
        </div>
        ${G.flag(`<p>p. 139 says the scorecard looks at performance in “five primary areas” and then lists four. Kaplan and Norton's balanced scorecard has <b>four</b> perspectives. Correct it in your copy.</p>`)}
        <h3>Project performance measures</h3>
        ${G.w("evm")}
        <p class="small">Other project measures: defects per source line of code (software), customer complaints or corrective-action requests, inquiry response time, defect containment.</p>
        ${G.trap(`<p>Both indices have <b>EV on top</b>. CPI divides by <b>actual cost</b>; SPI divides by <b>planned value</b>. An inverted ratio (AC/EV) makes an over-budget project look healthy.</p>`)}`
    },
    {
      id: "dpmo", title: "DPU, DPO and DPMO", bok: "II.E.1", level: "Analyze", hy: true, pages: "140–141",
      html: `
        <div class="formula">DPU = total defects ÷ total units</div><br>
        <div class="formula">DPO = total defects ÷ (units × opportunities per unit)</div><br>
        <div class="formula">DPMO = DPO × 1,000,000</div>
        <p>To count opportunities, find the number of ways each defect can occur on one item. In the handbook's pencil example: blurred printing can happen one way, dimensions are checked in three places, and rolled ends can occur at the top or bottom — six opportunities per pencil, 240,000 in a batch of 40,000.</p>
        ${G.w("dpmo")}
        ${G.flag(`<p>p. 140 says “an average 165 defects/unit”, but the arithmetic (165 ÷ 240,000) treats <b>165 as the total defects in the 40,000-pencil batch</b>, which gives DPU = 0.004125 and DPMO = 687.5. The DPO line on p. 141 is also garbled in the scan; use DPO = total defects ÷ total opportunities.</p>`)}
        ${G.trap(`<p>DPMO uses <b>opportunities</b>; DPU does not. The distractor “18,500” in a DPMO question is usually DPU × 10⁶ — the opportunities were forgotten. Some industries must say <i>nonconformity</i> or <i>deficiency</i> instead of “defect”.</p>`)}`
    },
    {
      id: "rty", title: "Rolled throughput yield", bok: "II.E.1", level: "Analyze", hy: true, pages: "141",
      html: `
        <div class="formula">RTY = Y₁ × Y₂ × … × Yₙ</div>&nbsp;&nbsp;<div class="formula">Throughput yield = e<sup>−DPU</sup></div>
        <p>RTY is the probability that a unit passes through a whole series of processes without a defect the first time. Final yield after rework can look excellent while RTY exposes the “hidden factory” of rework.</p>
        ${G.w("rty")}
        ${G.trap(`<p>RTY is <b>never an average</b> and never the lowest step yield. It is the product, so it is always at or below the worst single step.</p>`)}`
    },
    {
      id: "sigma", title: "Sigma levels and the 1.5σ shift", bok: "II.E.1", level: "Analyze", hy: true, pages: "141",
      html: `
        <p>With tolerance 5.000 ± 0.012 and σ = 0.004, the limits sit at ±3σ: Cp = Cpk = 1 and a centred yield of about 0.9973. Experience says the mean does not stay put, so by convention it may drift <b>1.5σ</b> either way. A 1.5σ shift toward one limit drops the yield to about 0.9332.</p>
        <p>Cut σ to 0.002 and the limits sit at ±6σ — a six sigma process. Shift the mean 1.5σ and the nearer limit is 4.5σ away: yield 0.9999966, defects 3.4 ppm. The handbook calls this “a rather theoretical number”: the mean will not shift exactly 1.5σ, and no process is normal to the sixth decimal place.</p>
        ${G.w("sigma")}
        ${G.w("sigmatable")}
        ${G.flag(`<p>The scanned text on p. 141 has dropped digits and signs. Read the six sigma yield as <b>0.9999966</b> (not 0.999966) and the defect level as 1 − 0.9999966 = 0.0000034. The “area to the right of 1.5σ” should read <b>−1.5σ</b>, matching the later “−4.5σ”.</p>`)}
        ${G.trap(`<p>Why 3.4 ppm and not about 0.002 ppm? Because 3.4 ppm <b>assumes the 1.5σ shift</b>. A perfectly centred ±6σ process would produce about 0.002 ppm. Short-term sigma level = long-term Z + 1.5.</p>`)}
        ${G.tab(`<p>Tab your handbook's standard normal (Z) table appendix next to p. 141 — every sigma-level item needs it. Your TI-30Xa has no normal function.</p>`)}`
    },
    {
      id: "cap", title: "Process capability indices", bok: "II.E.1", level: "Analyze", hy: true, pages: "141",
      html: `
        <div class="formula">Cp = (USL − LSL) ÷ 6σ</div><br>
        <div class="formula">Cpk = min[(USL − μ) ÷ 3σ, (μ − LSL) ÷ 3σ]</div><br>
        <div class="formula">Cr = 1 ÷ Cp = 6σ ÷ (USL − LSL)</div>
        ${G.table(["Index", "Measures", "Better when", "Key fact"], [
          ["Cp", "Spread only — potential capability if centred", "Higher", "Ignores where the mean is"],
          ["Cpk", "Spread and centring — actual capability", "Higher", "Cpk ≤ Cp always; equal only when centred"],
          ["Cr", "Share of the tolerance the process uses", "Lower", "1 is the historical maximum acceptable value"]
        ])}
        <p>Use the curve above: shift the mean and watch Cpk fall while Cp stays put.</p>
        ${G.trap(`<p>Cp vs Cpk is the classic close-difference pair. If the mean is off-centre, Cp overstates real performance. Pp and Ppk (Chapter 15) use overall long-term variation instead of within-subgroup σ — a separate trap for the Measure phase.</p>`)}`
    },
    {
      id: "coq", title: "Cost of poor quality", bok: "II.E.1", level: "Analyze", hy: true, pages: "141–142",
      html: `
        <p>COPQ — originally cost of quality (COQ), sometimes cost of current quality — goes back to Juran and Feigenbaum. The handbook uses four categories, which your accounting department should help gather:</p>
        ${G.table(["Category", "Meaning", "Examples"], [
          ["Prevention", "Doing things right the first time", "Training, APQP, mistake-proofing, supplier qualification"],
          ["Appraisal", "Checking the current process", "Inspection, verification, testing, calibration, audits"],
          ["Internal failure", "Work done wrong and caught before shipment", "Rework, internal scrap, re-inspection, defect downtime"],
          ["External failure", "Work done wrong and caught by the customer", "Returned goods, external scrap, warranty, complaints, recalls"]
        ])}
        ${G.w("coq")}
        <p><b>Key point:</b> focusing on prevention lowers the total cost of quality. Companies that start measuring usually find the money concentrated in the two failure categories.</p>
        ${G.flag(`<p>Some texts reserve “COPQ” for the two failure categories and call all four “COQ”. The handbook and the ASQ glossary both list all four under COPQ, so use the four-category version on the exam. There is no single exact way to calculate it — every company has its own method.</p>`, "Calibration note")}
        ${G.tab(`<p>p. 142: write one example in the margin beside each category, including the trap: “re-inspection after rework = internal failure”.</p>`)}`
    },
    {
      id: "comm", title: "Communication", bok: "II.E.2", level: "Apply", pages: "142–143",
      html: `
        <p>Messages exist to convey information, and information is meant to change behaviour. The more senior the role, the higher the stakes — so <b>plan to communicate</b>. In a matrix project structure, go/no-go decisions and stakeholder support depend on it.</p>
        ${G.w("commflow")}
        ${G.w("commpick")}
        ${G.trap(`<p>Horizontal communication is fast but <b>wrong where authorization or approval is required</b> — it shortcuts the process. And to stop a top-down message being filtered, the handbook's fix is written communication and/or one meeting for the whole chain, not “send it down the chain more carefully”.</p>`)}`
    }
  ],
  check: [
    { q: "An invoicing process handled 2,000 invoices last month. Each invoice has 5 opportunities for a defect, and 37 defects were found. What is the DPMO?",
      o: ["18,500", "740", "3,700", "0.0037"], a: 2,
      why: "DPO = 37 ÷ (2,000 × 5) = 0.0037; DPMO = 0.0037 × 10⁶ = 3,700.",
      d: { 0: "DPU × 10⁶ — forgot the opportunities.", 1: "Divides by the opportunities twice.", 3: "That is DPO, not per million." }, ref: "140–141" },
    { q: "A product passes through three processes with first-time yields of 0.95, 0.98 and 0.90. What is the rolled throughput yield?",
      o: ["0.943", "0.838", "0.900", "0.980"], a: 1,
      why: "0.95 × 0.98 × 0.90 = 0.8379.",
      d: { 0: "The average of the three yields.", 2: "The lowest step yield.", 3: "The highest step yield." }, ref: "141" },
    { q: "A process averages 0.25 defects per unit. Assuming defects follow a Poisson distribution, what proportion of units has zero defects?",
      o: ["0.750", "0.250", "0.221", "0.779"], a: 3,
      why: "Throughput yield = e^(−DPU) = e^(−0.25) = 0.7788.",
      d: { 0: "1 − DPU — close only when DPU is very small.", 1: "That is the DPU itself.", 2: "1 − e^(−0.25), the proportion with at least one defect." }, ref: "141" },
    { q: "A dimension has USL 10.6 and LSL 9.4. The process mean is 10.2 and σ is 0.1. What are Cp and Cpk?",
      o: ["Cp 2.00, Cpk 1.33", "Cp 1.33, Cpk 2.00", "Cp 2.00, Cpk 2.67", "Cp 1.00, Cpk 0.67"], a: 0,
      why: "Cp = 1.2 ÷ 0.6 = 2.00. Cpk = min(0.4 ÷ 0.3, 0.8 ÷ 0.3) = min(1.33, 2.67) = 1.33.",
      d: { 1: "Swapped — Cpk can never exceed Cp.", 2: "Takes the maximum side instead of the minimum.", 3: "Divides by 12σ and 6σ instead of 6σ and 3σ." }, ref: "141" },
    { q: "At a status review, a project shows EV = $80,000, AC = $100,000 and PV = $90,000. Which describes the project?",
      o: ["Under budget and ahead of schedule", "Over budget but ahead of schedule", "Over budget and behind schedule", "Under budget but behind schedule"], a: 2,
      why: "CPI = 80/100 = 0.80 (over budget); SPI = 80/90 = 0.89 (behind schedule).",
      d: { 0: "Results from inverting both ratios (AC/EV, PV/EV).", 1: "SPI is below 1, so the project is behind.", 3: "CPI is below 1, so the project is over budget." }, ref: "139–140" },
    { q: "A plant tracks quality costs. The cost of re-inspecting units after they have been reworked belongs in which category?",
      o: ["Appraisal", "Internal failure", "Prevention", "External failure"], a: 1,
      why: "The re-inspection exists only because of a defect caught before shipment — an internal failure cost.",
      d: { 0: "Looks like inspection, which is the trap; routine first-time inspection would be appraisal.", 2: "Prevention stops defects from happening at all.", 3: "Nothing has reached the customer." }, ref: "142" },
    { q: "A plant manager wants a new policy to reach line associates without being filtered through five layers of management. According to the handbook, the best approach is to:",
      o: ["Pass it carefully through each level of the chain of command", "Use horizontal communication between department leads", "Post it in the suggestion box area", "Send written communication to the team and/or hold a meeting for the whole chain"], a: 3,
      why: "The handbook recommends a written message and/or one meeting for the full chain to avoid filtering and distortion.",
      d: { 0: "That is exactly where filtering happens.", 1: "Horizontal is for peers, and unsuitable where approval processes apply.", 2: "Suggestion boxes are a bottom-up channel." }, ref: "143" },
    { q: "Why is the defect level of a six sigma process usually quoted as 3.4 ppm?",
      o: ["It allows the process mean to shift 1.5σ toward a specification limit", "A perfectly centred ±6σ process produces 3.4 ppm", "A six sigma process has Cpk = 2.0", "It adds an allowance for measurement error"], a: 0,
      why: "With a 1.5σ shift the nearer limit is 4.5σ from the mean; the tail beyond 4.5σ is about 3.4 ppm.",
      d: { 1: "A centred ±6σ process gives roughly 0.002 ppm.", 2: "Cpk = 2.0 only when centred; with the 1.5σ shift Cpk = 1.5.", 3: "Measurement error isn't part of the convention." }, ref: "141" },
    { q: "Which of the following is NOT one of the balanced scorecard's perspectives?",
      o: ["Financial", "Internal processes", "Learning and growth", "Supplier"], a: 3,
      why: "Kaplan and Norton's four perspectives are financial, customer, internal processes, and learning and growth.",
      d: { 0: "A perspective.", 1: "A perspective.", 2: "A perspective." }, ref: "139" }
  ]
});
