/* Widgets: Chapters 1 (Six Sigma and organizational goals), 2 (lean principles), 3 (DFSS and FMEA) */
(function () {
  "use strict";
  const { $, $$, esc } = G;
  const C = (name, cfg) => { G.W[name] = (el) => G.classifier(el, cfg); };
  const rng = (seed) => () => { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };

  /* =================== Chapter 1 =================== */

  C("pioneers", {
    title: "Who said or built it?", select: true,
    hint: "Match each idea to the quality pioneer the handbook credits (pp. 8–15). Attribution items are quick points if these are tabbed.",
    cats: ["Crosby", "Deming", "Feigenbaum", "Ishikawa", "Juran", "Shainin", "Shewhart", "Taguchi"],
    items: [
      { t: "Originated the zero-defects concept; wrote <i>Quality Is Free</i>; fourteen steps to quality improvement.", a: 0, why: "Crosby. Don't confuse his fourteen steps with Deming's Fourteen Points." },
      { t: "Fourteen Points and the Seven Deadly Diseases.", a: 1, why: "Deming, from <i>Out of the Crisis</i>." },
      { t: "The red bead experiment and the system of profound knowledge.", a: 1, why: "Deming: appreciation of a system, knowledge of variation, theory of knowledge, psychology." },
      { t: "Total quality control and the “hidden plant” of rework inside every factory.", a: 2, why: "Feigenbaum. The hidden plant became the hidden factory." },
      { t: "Three steps to quality: quality leadership, modern quality technology, organizational commitment.", a: 2, why: "Feigenbaum." },
      { t: "The cause-and-effect (fishbone) diagram and quality circles in Japan.", a: 3, why: "Ishikawa, working through JUSE." },
      { t: "“The next process is your customer.”", a: 3, why: "Ishikawa — a high focus on internal customers." },
      { t: "The trilogy: quality planning, quality control, quality improvement.", a: 4, why: "Juran. A three-part list with “planning” first is Juran." },
      { t: "The Pareto principle — “the vital few and the trivial many.”", a: 4, why: "Juran named and popularized the Pareto principle for quality." },
      { t: "Red X, component search and “talk to the parts.”", a: 5, why: "Shainin. The handbook also credits him with pre-control." },
      { t: "The first control chart, sketched in a one-page memo in May 1924.", a: 6, why: "Shewhart, the father of statistical quality control." },
      { t: "Credited by Deming as the originator of plan-do-check-act.", a: 6, why: "Shewhart. Deming later changed Check to Study (PDSA)." },
      { t: "Any departure from the target value is a loss to society.", a: 7, why: "Taguchi's loss function." },
      { t: "Robust design using orthogonal arrays, with an outer array for uncontrollable (noise) factors.", a: 7, why: "Taguchi — off-line quality control." }
    ]
  });

  C("dmaictools", {
    title: "Which DMAIC phase does the handbook put it in?",
    hint: "From the handbook's tool lists (pp. 21–23); the ASQ-style sample items in this project follow them. Other books place some tools elsewhere — FMEA often appears in Analyze.",
    cats: ["Define", "Measure", "Analyze", "Improve", "Control"],
    items: [
      { t: "SIPOC", a: 0, why: "Define — it sets the boundaries of what will be studied." },
      { t: "Define the problem with five whys and how", a: 0, why: "Define." },
      { t: "Identify a data collection plan", a: 1, why: "Measure." },
      { t: "Measurement systems analysis (first study)", a: 1, why: "Measure. Long-term MSA is listed under Control." },
      { t: "Identify variability: instability, variation, off-target", a: 1, why: "Measure." },
      { t: "Start cost of quality; set the benchmark baseline", a: 1, why: "Measure starts both; benchmarking “continues” in Analyze." },
      { t: "Central limit theorem", a: 2, why: "Analyze." },
      { t: "Geometric dimensioning and tolerancing; shop audit", a: 2, why: "Analyze." },
      { t: "Brainstorm alternatives and draw “should be” flowcharts", a: 3, why: "Improve." },
      { t: "Conduct FMEA", a: 3, why: "Improve, in the handbook's list (p. 23)." },
      { t: "Design of experiments", a: [2, 3], why: "Analyze lists “experiments”; Improve lists “design of experiments”." },
      { t: "Dynamic control plan", a: 4, why: "Control." },
      { t: "Long-term MSA", a: 4, why: "Control." },
      { t: "Mistake-proofing and process behavior charts", a: 4, why: "Control." },
      { t: "Management commitment through PDCA", a: [0, 1], why: "Define and Measure both list PDCA." },
      { t: "Management commitment through PDSA", a: [2, 3], why: "Analyze and Improve both list PDSA." },
      { t: "Management commitment through SDCA", a: 4, why: "Control — standardize to hold the gain." }
    ]
  });

  /* Cost of quality curves: Figures 1.5 and 1.6 */
  G.W.coqcurve = (el) => {
    let mode = "trad", q = 60;
    const M = {
      trad: { conf: (x) => (6 * x) / (1.04 - x), non: (x) => 100 * (1 - x), name: "Traditional (Fig. 1.5)" },
      mod: { conf: (x) => 8 + 22 * x, non: (x) => 92 * (1 - x), name: "Modern (Fig. 1.6)" }
    };
    const W = 640, H = 290, L = 40, R = W - 150, T = 14, B = H - 42, YM = 120;
    const xs = (x) => L + x * (R - L), ys = (v) => B - (v / YM) * (B - T);
    const minOf = (m) => { let best = 0, bv = Infinity; for (let i = 0; i <= 1000; i++) { const x = i / 1000, v = m.conf(x) + m.non(x); if (v < bv) { bv = v; best = x; } } return [best, bv]; };
    const line = (f) => { const pts = []; for (let i = 0; i <= 200; i++) { const x = i / 200, v = f(x); if (v > YM) { pts.push([xs(x), ys(YM)]); break; } pts.push([xs(x), ys(v)]); } return pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(""); };
    el.innerHTML = `<h4><span>Cost of quality: where is total cost lowest?</span><span class="seg" role="group" aria-label="Model">${Object.entries(M).map(([k, m]) => `<button type="button" data-m="${k}" aria-pressed="${k === mode}">${m.name}</button>`).join("")}</span></h4>
      <p class="hint">Conformance = prevention + appraisal. Nonconformance = internal + external failure. The figures are concept curves with no scale; the shapes are what matter.</p>
      <div data-svg></div>
      <label class="field" style="max-width:28rem">Quality level: <b style="color:var(--ink)" data-ql></b><input type="range" min="0" max="100" step="1" value="${q}" data-q aria-label="Quality level, percent good"></label>
      <div class="readout" data-ro></div><p class="small" data-msg aria-live="polite"></p>`;
    function draw() {
      const m = M[mode], x = q / 100, [mx, mv] = minOf(m);
      const c = m.conf(x), n = m.non(x);
      $("[data-svg]", el).innerHTML = `<svg class="viz" viewBox="0 0 ${W} ${H}" role="img" aria-label="${m.name}: total cost is lowest at ${Math.round(mx * 100)} percent good">
        <line x1="${L}" x2="${R}" y1="${B}" y2="${B}" stroke="var(--ink-soft)"/><line x1="${L}" x2="${L}" y1="${T}" y2="${B}" stroke="var(--ink-soft)"/>
        <text x="${L}" y="${B + 18}" font-size="12" class="t-soft">0% good</text><text x="${R}" y="${B + 18}" font-size="12" text-anchor="end" class="t-soft">100% good</text>
        <text x="${(L + R) / 2}" y="${B + 34}" font-size="12.5" text-anchor="middle" font-weight="700">Quality level</text>
        <text x="${L - 14}" y="${(T + B) / 2}" font-size="12.5" text-anchor="middle" font-weight="700" transform="rotate(-90 ${L - 14} ${(T + B) / 2})">Costs</text>
        <path d="${line(m.non)}" fill="none" stroke="var(--ooc)" stroke-width="2.5"/>
        <path d="${line(m.conf)}" fill="none" stroke="var(--c4)" stroke-width="2.5"/>
        <path d="${line((v) => m.conf(v) + m.non(v))}" fill="none" stroke="var(--ink)" stroke-width="3"/>
        ${(mode === "trad"
          ? [["Nonconformance", 1, m.non(1), 4, "var(--ooc)"], ["Conformance", 0.86, m.conf(0.86), 4, "var(--c4)"], ["Total cost", 0.97, m.conf(0.97) + m.non(0.97), -6, "var(--ink)"]]
          : [["Nonconformance", 1, m.non(1), 4, "var(--ooc)"], ["Conformance", 1, m.conf(1), 18, "var(--c4)"], ["Total cost", 1, m.conf(1) + m.non(1), -8, "var(--ink)"]])
          .map(([t, px, pv, dy, col]) => `<text x="${xs(px) + 8}" y="${ys(Math.min(pv, YM)) + dy}" font-size="12.5" fill="${col}"${t === "Total cost" ? ' font-weight="700"' : ""}>${t}</text>`).join("")}
        <line x1="${xs(x)}" x2="${xs(x)}" y1="${T}" y2="${B}" stroke="var(--ink-soft)" stroke-dasharray="4 4"/>
        <circle cx="${xs(mx)}" cy="${ys(mv)}" r="6" fill="var(--belt)" stroke="#fff" stroke-width="2"/>
        <text x="${mx > 0.9 ? xs(mx) - 10 : xs(mx)}" y="${ys(mv) - 14}" font-size="12" text-anchor="${mx > 0.9 ? "end" : "middle"}" fill="var(--belt-deep)" font-weight="700">lowest total</text>
      </svg>`;
      $("[data-ql]", el).textContent = q + "% good";
      $("[data-ro]", el).innerHTML = G.ro("Conformance", G.num(c, 0), "prevention + appraisal") + G.ro("Nonconformance", G.num(n, 0), "failure costs") + G.ro("Total", G.num(c + n, 0), "relative units", true) + G.ro("Lowest total at", Math.round(mx * 100) + "% good");
      $("[data-msg]", el).innerHTML = mode === "trad"
        ? "Traditional view: conformance cost soars as you approach perfection, so the cheapest point stops short of 100% — some defects are “economical”."
        : "Modern view: prevention keeps getting cheaper and failure costs include hidden losses, so total cost keeps falling all the way to 100% good — Crosby's “quality is free”. This is the picture Six Sigma aims for.";
    }
    $$("[data-m]", el).forEach((b) => b.addEventListener("click", () => { mode = b.dataset.m; $$("[data-m]", el).forEach((x) => x.setAttribute("aria-pressed", x === b)); draw(); }));
    $("[data-q]", el).addEventListener("input", (e) => { q = +e.target.value; draw(); });
    draw();
  };

  /* Expected profit: roulette and Table 1.2 */
  G.W.exprofit = (el) => {
    const P = {
      roulette: { n: "Roulette, $1 on red", u: "$", rows: [["Win", 1, 18 / 38], ["Loss", -1, 20 / 38]] },
      worst: { n: "Table 1.2 worst case", u: "$M", rows: [["Customer A only", 2, 0.6], ["Customer B only", 2, 0.1], ["A and B", 7, 0.05], ["Neither", -3, 0.25]] },
      best: { n: "Table 1.2 best case", u: "$M", rows: [["Customer A only", 2, 0.7], ["Customer B only", 2, 0.2], ["A and B", 7, 0.1], ["Neither", -3, 0]] }
    };
    let key = "worst", rows;
    function build() {
      rows = P[key].rows.map((r) => r.slice());
      el.innerHTML = `<h4><span>Expected profit = Σ (profit × probability)</span><span class="seg" role="group" aria-label="Example">${Object.entries(P).map(([k, p]) => `<button type="button" data-p="${k}" aria-pressed="${k === key}">${p.n}</button>`).join("")}</span></h4>
        <p class="hint">Edit any profit or probability. Profits are net of the project's cost, which is why “neither” is negative.</p>
        <div class="tbl-wrap"><table class="tbl"><thead><tr><th scope="col">Outcome</th><th scope="col" class="num">Profit (${P[key].u})</th><th scope="col" class="num">Probability</th><th scope="col" class="num">Profit × probability</th><th scope="col" style="width:30%">Contribution</th></tr></thead>
        <tbody>${rows.map((r, i) => `<tr><th scope="row">${esc(r[0])}</th><td class="num"><input type="number" step="0.1" value="${r[1]}" data-i="${i}" data-c="1" style="width:5.5rem" aria-label="Profit for ${esc(r[0])}"></td><td class="num"><input type="number" step="0.01" min="0" max="1" value="${+r[2].toFixed(4)}" data-i="${i}" data-c="2" style="width:5.5rem" aria-label="Probability for ${esc(r[0])}"></td><td class="num" data-x="${i}"></td><td data-bar="${i}"></td></tr>`).join("")}</tbody></table></div>
        <div class="readout" data-ro></div><p class="small" data-msg aria-live="polite"></p>`;
      $$("[data-p]", el).forEach((b) => b.addEventListener("click", () => { key = b.dataset.p; build(); }));
      $$("input[data-i]", el).forEach((inp) => inp.addEventListener("input", () => { rows[+inp.dataset.i][+inp.dataset.c] = +inp.value || 0; calc(); }));
      calc();
    }
    function calc() {
      const u = P[key].u, ep = rows.reduce((s, r) => s + r[1] * r[2], 0), sp = rows.reduce((s, r) => s + r[2], 0);
      const mx = Math.max(...rows.map((r) => Math.abs(r[1] * r[2])), 1e-9);
      rows.forEach((r, i) => {
        const v = r[1] * r[2];
        $(`[data-x="${i}"]`, el).textContent = (v < 0 ? "−" : "") + u.replace("M", "") + G.num(Math.abs(v), u === "$" ? 3 : 2) + (u === "$M" ? "M" : "");
        $(`[data-bar="${i}"]`, el).innerHTML = `<div style="height:12px;border-radius:3px;width:${(Math.abs(v) / mx) * 100}%;background:${v < 0 ? "var(--ooc)" : "var(--belt)"}"></div>`;
      });
      const fmt = (v) => (v < 0 ? "−" : "") + "$" + G.num(Math.abs(v), u === "$" ? 3 : 2) + (u === "$M" ? "M" : "");
      $("[data-ro]", el).innerHTML = G.ro("Expected profit", fmt(ep), "Σ profit × probability", true) + G.ro("Σ probabilities", G.num(sp, 3), Math.abs(sp - 1) < 0.005 ? "adds to 1" : "should add to 1");
      $("[data-msg]", el).innerHTML = Math.abs(sp - 1) > 0.005 ? `<b style="color:var(--ooc)">The probabilities add to ${G.num(sp, 3)}, not 1 — the outcomes must cover every possibility exactly once.</b>`
        : key === "roulette" ? "18 of 38 cells are red, so the gambler expects to lose about a nickel per $1 bet."
        : "The handbook's two tables bracket the project at $1M to $2.5M of expected profit. Use SWOT to sharpen the probability estimates.";
    }
    build();
  };

  C("smart", {
    title: "Which SMART element does each fragment supply?",
    hint: "Two goals, split into pieces. SMART = Specific, Measurable, Attainable (Achievable), Relevant, Time-bound (p. 29).",
    cats: ["Specific", "Measurable", "Attainable", "Relevant", "Time-bound"],
    items: [
      { t: "“…mis-picks on the returns line at Dock 4…”", a: 0, why: "Names exactly which process and where." },
      { t: "“…from 2.4% to 1.0% of orders…”", a: 1, why: "A baseline and a number to hit." },
      { t: "“…a pilot cell already ran at 1.1% with current staffing…”", a: 2, why: "Evidence the target can be reached with the resources at hand." },
      { t: "“…supports the site's customer-satisfaction objective…”", a: 3, why: "Links the project to an organizational goal." },
      { t: "“…by June 30.”", a: 4, why: "A deadline." },
      { t: "“…for invoices over $10,000 processed by accounts payable…”", a: 0, why: "Narrows the scope." },
      { t: "“…tracked weekly as first-pass yield…”", a: 1, why: "Defines how success is measured." },
      { t: "“…the team has budget and authority to change the work instructions…”", a: 2, why: "It is achievable because the team can act on it." },
      { t: "“…because late payments trigger supplier penalties named in the strategic plan…”", a: 3, why: "Relevance to strategy." },
      { t: "“…within 90 days of kickoff.”", a: 4, why: "Time-bound." }
    ]
  });

  C("bscsort", {
    title: "Which balanced scorecard perspective?",
    hint: "Four perspectives (p. 30): financial, customer, internal processes, employee learning and growth.",
    cats: ["Financial", "Customer", "Internal processes", "Learning and growth"],
    items: [
      { t: "Return on investment", a: 0, why: "Financial." },
      { t: "Savings from completed Six Sigma projects", a: 0, why: "Financial." },
      { t: "Customer satisfaction survey score", a: 1, why: "Customer." },
      { t: "Market share in the target segment", a: 1, why: "Customer — how the market sees and buys from you." },
      { t: "First-pass yield", a: 2, why: "Internal processes." },
      { t: "Order-to-ship cycle time", a: 2, why: "Internal processes." },
      { t: "Hours of training per employee", a: 3, why: "Learning and growth." },
      { t: "Employee suggestions implemented", a: 3, why: "Learning and growth." }
    ]
  });

  C("leadlag", {
    title: "Leading or lagging?",
    hint: "Lagging = measured at the end of an event. Leading = measured upstream, helping achieve the objective (p. 30).",
    cats: ["Leading", "Lagging"],
    items: [
      { t: "Quarterly profit", a: 1, why: "Reported after the quarter ends." },
      { t: "Warranty claims last year", a: 1, why: "The outcome has already happened." },
      { t: "Share of operators trained on the new standard work", a: 0, why: "Upstream of quality results." },
      { t: "Preventive-maintenance tasks completed on schedule this week", a: 0, why: "Predicts uptime." },
      { t: "Annual customer retention rate", a: 1, why: "End-of-period outcome." },
      { t: "Process audits completed this month", a: 0, why: "An input that drives later results." },
      { t: "Lost-time injury rate", a: 1, why: "Counts injuries after they occur." },
      { t: "Supplier lots accepted on first submission", a: 0, why: "Upstream of finished-product quality." }
    ]
  });

  /* =================== Chapter 2 =================== */

  /* TPS house (Figure 2.1) */
  G.W.tpshouse = (el) => {
    const D = {
      goal: ["Goal", "Highest quality, lowest cost, shortest lead time — delivered through customer focus, empowered employees and high morale."],
      perf: ["Pursuit of perfection", "Operational excellence that never stops: perfection is the end of the lean list of principles, reached by removing waste continually."],
      takt: ["Takt time", "Available time ÷ customer demand — the beat that matches production to demand."],
      pull: ["Pull system", "Downstream use triggers upstream production (kanban), so nothing is made before it is needed."],
      flow: ["One-piece flow", "Work moves step to step with little or no buffer — continuous flow removes inventory, waiting and transport."],
      smed: ["SMED", "Single-minute exchange of die: changeovers in single-digit minutes (under 10), so lots can shrink."],
      poka: ["Poka-yoke", "Mistake-proofing: prevention type makes the error impossible; detection type alerts right after it happens."],
      stop: ["Automatic stops", "The machine stops itself when something is abnormal, so defects are not passed on."],
      why5: ["Five whys", "Ask why repeatedly to get from the symptom to the root cause."],
      inst: ["In-station quality", "Build quality in at the station that does the work instead of inspecting later."],
      heij: ["Heijunka", "Level the schedule by mixing product variants in small batches — shorter lead times, less inventory."],
      kaiz: ["Kaizen", "Continuous improvement in small, incremental steps."],
      std: ["Standardized work", "Standard time, standard inventory and standard sequence — the baseline every improvement starts from."],
      stab: ["Operational stability", "Reliable machines, methods, materials and people (TPM, 5S) — without it the pillars cannot stand."],
      jit: ["Just-in-time", "Just what is needed, in just the required amount, just where and just when it is needed — reduces in-process inventory and its carrying cost."],
      jid: ["Jidoka (autonomation)", "Automation with a human touch: harmonize people and machines, stop and respond to problems, detect special-cause variation. Shingo: about 90% of the benefit of full automation."]
    };
    const b = (k, cls = "") => `<button type="button" class="tps-b ${cls}" data-k="${k}">${D[k][0]}</button>`;
    el.innerHTML = `<h4>The Toyota Production System house</h4>
      <p class="hint">Figure 2.1. Click any part. A house falls if any pillar or the foundation is missing — that is the point of the picture.</p>
      <div class="tps">
        <div class="tps-roof">${b("goal", "on-roof")}</div>
        <div class="tps-body">
          <div class="tps-pillar">${b("jit", "pillar-h")}${b("takt")}${b("pull")}${b("flow")}${b("smed")}</div>
          <div class="tps-core">${b("perf", "core-b")}</div>
          <div class="tps-pillar">${b("jid", "pillar-h")}${b("poka")}${b("stop")}${b("why5")}${b("inst")}</div>
        </div>
        <div class="tps-found">${b("heij")}${b("kaiz")}${b("std")}${b("stab")}</div>
      </div>
      <div class="ro key" style="margin-top:.8rem" data-info aria-live="polite"><div class="k">Select a part of the house</div><div class="v" style="font-size:1.2rem">—</div></div>`;
    $$(".tps-b", el).forEach((btn) => btn.addEventListener("click", () => {
      $$(".tps-b", el).forEach((x) => x.setAttribute("aria-pressed", x === btn));
      const [n, d] = D[btn.dataset.k];
      $("[data-info]", el).innerHTML = `<div class="k">${n}</div><div style="font-size:1rem;line-height:1.5;margin-top:.2rem">${d}</div>`;
    }));
  };

  C("vatest", {
    title: "Value-added or not?",
    hint: "Value-added only if the customer recognizes the value, it changes the product, and it is done right the first time (pp. 33–35).",
    cats: ["Value-added", "Non-value-added"],
    items: [
      { t: "Painting the part", a: 0, why: "Transforms the product and the customer pays for it." },
      { t: "Correcting a document the supplier printed wrong", a: 1, why: "Rework — the customer will not pay for the supplier's errors." },
      { t: "Fire-testing every gas furnace to keep the CSA listing", a: 0, why: "The handbook's exception: customers pay for the CSA listing, so this test is value-added." },
      { t: "100% inspection because the process is not capable", a: 1, why: "Most authorities call it non-value-added — fix the process instead." },
      { t: "Dipping stamped parts in oil so they don't rust while waiting for paint", a: 1, why: "The handbook's overprocessing example: schedule painting right after stamping instead." },
      { t: "Grinding off weld imperfections", a: 1, why: "Excess processing — improve the welding." },
      { t: "Machining a bore to size, right the first time", a: 0, why: "All three conditions met." },
      { t: "Filing paper copies of purchase orders already keyed into the system", a: 1, why: "The handbook's office example — half a person doing non-value-added work." }
    ]
  });

  C("waste8", {
    title: "Name the waste",
    hint: "The handbook's list (pp. 42–45): overproduction, motion, waiting, inventory, transportation, defect correction, excess processing, plus lost creativity.",
    cats: ["Overproduction", "Motion", "Waiting", "Inventory", "Transportation", "Defects", "Overprocessing", "Lost creativity"],
    items: [
      { t: "The press runs ahead of the paint schedule “to keep it busy”.", a: 0, why: "Making it earlier or faster than the next process needs. Its main symptom is excess WIP." },
      { t: "An operator walks across the cell to a shared gauge cabinet several times an hour.", a: 1, why: "Poor layout → excess motion. The sample items test exactly this wording." },
      { t: "Assemblers stand idle until a late shipment arrives.", a: 2, why: "Waiting." },
      { t: "Racks of safety stock the plant calls the “wall of shame”.", a: 3, why: "Inventory costs storage, handling and hides problems." },
      { t: "Forklifts shuttle parts between the all-lathes and all-presses departments.", a: 4, why: "Function-oriented layout → excess movement of material. Cells fix it." },
      { t: "Reworking parts that failed final test.", a: 5, why: "Defect correction." },
      { t: "Grinding welds because the welding leaves imperfections.", a: 6, why: "Excess processing — the step exists only to fix an upstream weakness." },
      { t: "Operators' ideas for fixes are never asked for.", a: 7, why: "Lost creativity — the waste the handbook calls the most unfortunate." }
    ]
  });

  C("toc5", {
    title: "Which step of the theory of constraints?",
    hint: "Identify, exploit, subordinate, elevate, repeat (p. 40). A distractor will offer a DMAIC word such as “measure”.",
    cats: ["Identify", "Exploit", "Subordinate", "Elevate", "Repeat"],
    items: [
      { t: "WIP is always piled up in front of welding.", a: 0, why: "The constraint usually has work waiting in front of it." },
      { t: "Run kaizen on welding to raise its rate with the equipment it already has.", a: 1, why: "Exploit = get more out of the constraint as it is." },
      { t: "Inspect parts before welding so the constraint never works on scrap.", a: 1, why: "Every minute of constraint time saved is system output gained." },
      { t: "Release raw material only at welding's pace; grinding and painting stop running flat out.", a: 2, why: "Subordinate the other rates to the constraint." },
      { t: "Buy a second welding robot.", a: 3, why: "Elevate = invest in capacity or new technology." },
      { t: "Welding is no longer the slowest step — painting is. Start again there.", a: 4, why: "Repeat with the new constraint." }
    ]
  });

  /* Drum-buffer-rope simulation */
  G.W.dbr = (el) => {
    const ST = [["Cut", 12], ["Weld", 9], ["Grind", 11], ["Paint", 13], ["Pack", 14]], HRS = 40;
    let v = 0.3, buf = 20, seed = 11;
    el.innerHTML = `<h4>Drum-buffer-rope: same output, a fraction of the WIP</h4>
      <p class="hint">Five soldiers in single file (p. 40). Welding at 9 units/hour is the slowest — the drum. Without a rope, every station runs flat out; with one, material is released only to keep a buffer in front of the drum. Hourly capacity varies by the amount you set (dropped rifles).</p>
      <div data-strip></div>
      <div class="grid2">
        <label class="field">Hour-to-hour variability: <b style="color:var(--ink)" data-vl></b><input type="range" min="0" max="50" step="5" value="${v * 100}" data-v></label>
        <label class="field">Rope length (buffer in front of the drum): <b style="color:var(--ink)" data-bl></b><input type="range" min="4" max="60" step="2" value="${buf}" data-b></label>
      </div>
      <div class="row" style="margin:.5rem 0"><button type="button" class="btn sm" data-s>New random hours</button></div>
      <div data-chart></div><div class="readout" data-ro></div><p class="small" data-msg aria-live="polite"></p>`;
    function strip() {
      const W = 640, H = 110, bw = 92, gap = (W - 20 - 5 * bw) / 4, oy = 14;
      $("[data-strip]", el).innerHTML = `<svg class="viz" viewBox="0 0 ${W} ${H}" role="img" aria-label="Five stations in series; welding is the drum">
        ${ST.map((s, i) => { const x = 10 + i * (bw + gap); return `<rect x="${x}" y="${34 + oy}" width="${bw}" height="46" rx="6" fill="${i === 1 ? "var(--acc)" : "#fff"}" stroke="var(--ink-soft)" stroke-width="1.5"/>
          <text x="${x + bw / 2}" y="${54 + oy}" text-anchor="middle" font-size="13" font-weight="700" ${i === 1 ? 'fill="#fff"' : ""}>${s[0]}</text>
          <text x="${x + bw / 2}" y="${71 + oy}" text-anchor="middle" font-size="11.5" ${i === 1 ? 'fill="#fff"' : 'class="t-soft"'}>${s[1]} / hour</text>
          ${i < 4 ? `<path d="M${x + bw + 3},${57 + oy} L${x + bw + gap - 4},${57 + oy}" stroke="var(--ink-soft)" stroke-width="1.5" marker-end="url(#dbra)"/>` : ""}`; }).join("")}
        <defs><marker id="dbra" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="var(--ink-soft)"/></marker></defs>
        <path d="M${10 + bw + gap + bw / 2},${32 + oy} C${10 + bw + gap + bw / 2},${4 + oy} ${10 + bw / 2},${4 + oy} ${10 + bw / 2},${30 + oy}" fill="none" stroke="var(--limit)" stroke-width="2" stroke-dasharray="5 4"/>
        <text x="${10 + 2 * bw + gap + 10}" y="${20}" font-size="11.5" fill="var(--limit)" font-weight="700">rope: release material only at the drum's pace</text>
        <text x="${10 + bw + gap + bw / 2}" y="${94 + oy}" text-anchor="middle" font-size="11" class="t-soft">drum</text>
      </svg>`;
    }
    function caps() {
      const r = rng(seed), out = [];
      for (let h = 0; h < HRS; h++) out.push(ST.map((s) => Math.max(0, s[1] * (1 + v * (2 * r() - 1)))));
      return out;
    }
    function sim(cap, rope) {
      const q = [0, 0, 0, 0, 0]; let out = 0; const wip = [], outs = [];
      for (let h = 0; h < HRS; h++) {
        for (let i = 4; i >= 1; i--) { const p = Math.min(q[i], cap[h][i]); q[i] -= p; if (i === 4) out += p; else q[i + 1] += p; }
        if (rope) { q[0] += Math.max(0, buf - (q[0] + q[1])); const p = Math.min(q[0], cap[h][0]); q[0] -= p; q[1] += p; }
        else q[1] += cap[h][0];
        wip.push(q.reduce((s, x) => s + x, 0)); outs.push(out);
      }
      const avg = wip.reduce((s, x) => s + x, 0) / HRS;
      return { wip, out, avg, lt: avg / (out / HRS) };
    }
    function draw() {
      $("[data-vl]", el).textContent = "±" + Math.round(v * 100) + "%";
      $("[data-bl]", el).textContent = buf + " units";
      const cap = caps(), P = sim(cap, false), Rp = sim(cap, true);
      const W = 640, H = 230, L = 44, R = W - 110, T = 12, B = H - 34, ym = Math.max(...P.wip, ...Rp.wip) * 1.08;
      const x = (h) => L + (h / (HRS - 1)) * (R - L), y = (w) => B - (w / ym) * (B - T);
      const pl = (s) => s.map((w, h) => `${h ? "L" : "M"}${x(h).toFixed(1)},${y(w).toFixed(1)}`).join("");
      const ticks = [0, Math.round(ym / 2), Math.round(ym * 0.92)];
      $("[data-chart]", el).innerHTML = `<svg class="viz" viewBox="0 0 ${W} ${H}" role="img" aria-label="Work in process by hour: without rope ends at ${Math.round(P.wip[HRS - 1])}, with rope ends at ${Math.round(Rp.wip[HRS - 1])}">
        ${ticks.map((t) => `<line x1="${L}" x2="${R}" y1="${y(t)}" y2="${y(t)}" stroke="var(--rule-soft)"/><text x="${L - 6}" y="${y(t) + 4}" text-anchor="end" font-size="11" class="t-soft">${t}</text>`).join("")}
        <line x1="${L}" x2="${R}" y1="${B}" y2="${B}" stroke="var(--ink-soft)"/>
        ${[0, 10, 20, 30, 39].map((h) => `<text x="${x(h)}" y="${B + 16}" text-anchor="middle" font-size="11" class="t-soft">${h + 1}</text>`).join("")}
        <text x="${(L + R) / 2}" y="${B + 30}" text-anchor="middle" font-size="12" class="t-soft">Hour</text>
        <text x="${L}" y="${T + 2}" font-size="11.5" class="t-soft" dy="-2">WIP (units)</text>
        <path d="${pl(P.wip)}" fill="none" stroke="var(--ooc)" stroke-width="2.5"/>
        <path d="${pl(Rp.wip)}" fill="none" stroke="var(--acc)" stroke-width="2.5"/>
        <text x="${R + 6}" y="${y(P.wip[HRS - 1]) + 4}" font-size="12.5" fill="var(--ooc)" font-weight="700">No rope</text>
        <text x="${R + 6}" y="${y(Rp.wip[HRS - 1]) + 4}" font-size="12.5" fill="var(--acc)" font-weight="700">With rope</text>
      </svg>`;
      $("[data-ro]", el).innerHTML = G.ro("Output, no rope", Math.round(P.out) + " units", "in 40 hours") + G.ro("Output, with rope", Math.round(Rp.out) + " units", "in 40 hours", true)
        + G.ro("Average WIP", `${Math.round(P.avg)} → ${Math.round(Rp.avg)}`, "no rope → rope") + G.ro("Lead time", `${G.num(P.lt, 1)} → ${G.num(Rp.lt, 1)} h`, "WIP ÷ throughput");
      const lost = P.out - Rp.out;
      $("[data-msg]", el).innerHTML = lost > 0.03 * P.out
        ? `<b style="color:var(--ooc)">The rope is too short for this much variability:</b> the drum starved and ${Math.round(lost)} units of output were lost. Lengthen the rope — the buffer size depends on how dependable the stations are.`
        : `Running non-constraints flat out only built WIP (${Math.round(P.wip[HRS - 1])} units by hour 40) — output is set by the drum either way. Speeding up a non-constraint suboptimizes the system.`;
    }
    $("[data-v]", el).addEventListener("input", (e) => { v = e.target.value / 100; draw(); });
    $("[data-b]", el).addEventListener("input", (e) => { buf = +e.target.value; draw(); });
    $("[data-s]", el).addEventListener("click", () => { seed += 7; draw(); });
    strip(); draw();
  };

  /* Sea of inventory (Figure 2.3) */
  G.W.seainv = (el) => {
    const ROCKS = [["Unreliable machines", 0.8, 70], ["Long setups", 0.66, 160], ["Quality problems", 0.55, 250], ["Late supplier deliveries", 0.44, 340], ["Unbalanced workload", 0.32, 430], ["Poor communication", 0.22, 515]];
    let lvl = 92;
    el.innerHTML = `<h4>A sea of inventory hides the rocks</h4>
      <p class="hint">Figure 2.3. Lower the inventory level and see what surfaces. The rock labels are typical examples; the handbook's figure leaves them unnamed.</p>
      <div data-svg></div>
      <label class="field" style="max-width:28rem">Inventory level: <b style="color:var(--ink)" data-l></b><input type="range" min="10" max="95" step="1" value="${lvl}" data-r aria-label="Inventory level"></label>
      <p class="small" data-msg aria-live="polite"></p>`;
    function draw() {
      const W = 600, H = 250, bed = 230, top = 30, wy = bed - (lvl / 100) * (bed - top);
      const exposed = ROCKS.filter((r) => r[1] * 100 > lvl);
      $("[data-svg]", el).innerHTML = `<svg class="viz" viewBox="0 0 ${W} ${H}" role="img" aria-label="${exposed.length} problems exposed at inventory level ${lvl} percent">
        <rect x="0" y="${wy}" width="${W}" height="${bed - wy}" fill="#CFE3F2"/>
        <line x1="0" x2="${W}" y1="${wy}" y2="${wy}" stroke="#2F6DB5" stroke-width="2"/>
        ${ROCKS.map(([n, h, x]) => { const ry = bed - h * (bed - top), up = h * 100 > lvl; return `<path d="M${x - 38},${bed} L${x - 18},${ry + 10} Q${x},${ry - 6} ${x + 18},${ry + 10} L${x + 38},${bed} Z" fill="${up ? "#8A8F86" : "#9FB7C6"}" stroke="${up ? "var(--ink)" : "#7FA2BC"}" stroke-width="1.5"/>
          <text x="${x}" y="${up ? ry - 8 : Math.min(ry + 30, bed - 6)}" text-anchor="middle" font-size="11.5" ${up ? 'fill="var(--ooc)" font-weight="700"' : 'fill="#5A7F99"'}>${up ? n : "hidden"}</text>`; }).join("")}
        <g transform="translate(${W - 70},${wy - 22})"><path d="M-34,14 L34,14 L22,26 L-22,26 Z" fill="var(--ink)"/><path d="M0,-18 L0,14 M0,-18 L22,8 L0,8" fill="#fff" stroke="var(--ink)" stroke-width="1.5"/></g>
        <text x="${W - 70}" y="${wy + 22}" text-anchor="middle" font-size="11" class="t-soft">the order</text>
        <rect x="0" y="${bed}" width="${W}" height="${H - bed}" fill="#B9A988"/>
      </svg>`;
      $("[data-l]", el).textContent = lvl + "%";
      $("[data-msg]", el).innerHTML = exposed.length === 0 ? "Inventory is high enough that every problem is hidden — the order floats through, and nobody is forced to fix anything."
        : `<b>${exposed.length} problem${exposed.length > 1 ? "s" : ""} exposed:</b> ${exposed.map((r) => r[0].toLowerCase()).join(", ")}. Fix ${exposed.length > 1 ? "them" : "it"} before lowering inventory further — that is how lean drives improvement.`;
    }
    $("[data-r]", el).addEventListener("input", (e) => { lvl = +e.target.value; draw(); });
    draw();
  };

  C("leantool", {
    title: "Name the lean concept", select: true,
    hint: "Definitions from the handbook's list of top lean tools (pp. 35–42).",
    cats: ["5S", "A3", "Andon", "Continuous flow", "Gemba", "Heijunka", "Hoshin kanri", "Jidoka", "Just-in-time", "Kanban", "Poka-yoke", "SMED", "Spaghetti diagram", "Standard work", "Takt time"],
    items: [
      { t: "Red/yellow/green stacked lights show status and let workers stop the process.", a: 2, why: "Andon." },
      { t: "One sheet giving management a quick overview of a project's key issues.", a: 1, why: "A3, named after the paper size." },
      { t: "Go to the real place where the work happens and observe it firsthand.", a: 4, why: "Gemba — also called “management by walking around”." },
      { t: "Mix product variants in small batches within the same process.", a: 5, why: "Heijunka (level scheduling)." },
      { t: "Align company strategy, middle-management plans and floor-level work.", a: 6, why: "Hoshin kanri (policy deployment)." },
      { t: "An empty bin with a card signals the previous step to replenish.", a: 9, why: "Kanban — a pull signal." },
      { t: "Changeovers in single-digit minutes.", a: 11, why: "SMED: “single minute” means under 10, not 1." },
      { t: "Standard time, standard inventory and standard sequence for operator and machine.", a: 13, why: "Standard work." },
      { t: "Sets the pace of the line to match customer demand.", a: 14, why: "Takt time." },
      { t: "Traces the path people, product or paperwork take during normal work.", a: 12, why: "Spaghetti diagram." },
      { t: "Cuts in-process inventory so items arrive as they are needed.", a: 8, why: "Just-in-time." },
      { t: "Work moves through the steps with minimal or no buffers.", a: 3, why: "Continuous flow." },
      { t: "A fixture that accepts the part in one orientation only.", a: 10, why: "Poka-yoke." },
      { t: "Machines detect problems and stop, so one operator can watch several (autonomation).", a: 7, why: "Jidoka." },
      { t: "Sort, set in order, shine, standardize, sustain.", a: 0, why: "5S — the handbook calls it one of the first tools to apply." }
    ]
  });

  C("pokatype", {
    title: "Prevention or detection mistake-proofing?",
    hint: "Prevention-type makes the error impossible. Detection-type alerts the user immediately after the error, to prevent further errors (p. 39).",
    cats: ["Prevention type", "Detection type"],
    items: [
      { t: "A plug that fits the socket only one way", a: 0, why: "The wrong action cannot be done." },
      { t: "A valve that shuts when maximum pressure is reached", a: 0, why: "Prevents the overpressure." },
      { t: "A fixture that won't accept a part in the wrong orientation", a: 0, why: "Prevention." },
      { t: "A window envelope that shows the address sealed inside", a: 0, why: "The handbook files it as mistake-proofing that prevents mailing to the wrong address." },
      { t: "A car alarm that sounds when the door closes with the lights on", a: 1, why: "Alerts right after the error." },
      { t: "An automatic gauge that alarms on an oversize or undersize part", a: 1, why: "Detection — the bad part already exists." },
      { t: "A counter that beeps if fewer than six screws were driven", a: 1, why: "Detection." },
      { t: "A date field that refuses input in the wrong format", a: 0, why: "The error cannot be entered." }
    ]
  });

  /* Value stream lead-time ladder */
  G.W.vsm = (el) => {
    const S = [["Cut", 39, 2300], ["Weld", 46, 1100], ["Assemble", 62, 1600], ["Pack", 40, 1200]];
    let fg = 2700, demand = 460;
    const DAY = 27000;
    el.innerHTML = `<h4>Value stream timeline: where does the time go?</h4>
      <p class="hint">Illustrative numbers. Inventory waiting in front of each step ÷ daily demand = days of lead time; cycle times are the value-added seconds. This lead-time ladder comes from Rother and Shook's <i>Learning to See</i>, which the handbook cites — the handbook doesn't print the ratio.</p>
      <div class="tbl-wrap"><table class="tbl"><thead><tr><th scope="col">Step</th><th scope="col" class="num">Inventory before it (units)</th><th scope="col" class="num">Cycle time (s)</th></tr></thead>
      <tbody>${S.map((s, i) => `<tr><th scope="row">${s[0]}</th><td class="num"><input type="number" min="0" step="100" value="${s[2]}" data-i="${i}" data-c="2" style="width:6rem" aria-label="Inventory before ${s[0]}"></td><td class="num"><input type="number" min="0" step="1" value="${s[1]}" data-i="${i}" data-c="1" style="width:5rem" aria-label="Cycle time of ${s[0]}"></td></tr>`).join("")}
      <tr><th scope="row">Finished goods</th><td class="num"><input type="number" min="0" step="100" value="${fg}" data-fg style="width:6rem" aria-label="Finished goods inventory"></td><td></td></tr></tbody></table></div>
      <div class="row" style="margin:.6rem 0"><label class="field">Customer demand per day<input type="number" min="1" value="${demand}" data-d style="width:7rem"></label><button type="button" class="btn sm" data-h>Halve every inventory</button></div>
      <div data-svg></div><div class="readout" data-ro></div><p class="small" data-msg></p>`;
    function draw() {
      const inv = [...S.map((s) => s[2]), fg], days = inv.map((u) => u / demand), lt = days.reduce((a, b) => a + b, 0), va = S.reduce((a, s) => a + s[1], 0);
      const W = 640, H = 134, L = 10, R = W - 10, segW = (R - L) / 5;
      $("[data-svg]", el).innerHTML = `<svg class="viz" viewBox="0 0 ${W} ${H}" role="img" aria-label="Lead time ${G.num(lt, 1)} days against ${va} seconds of value-added time">
        ${inv.map((u, i) => { const x0 = L + i * segW; return `<path d="M${x0},42 L${x0 + segW * 0.55},42 L${x0 + segW * 0.55},92 ${i < 4 ? `L${x0 + segW},92` : ""}" fill="none" stroke="var(--ink)" stroke-width="2"/>
          <text x="${x0 + 2}" y="18" font-size="12.5" font-weight="700" fill="var(--ooc)">${G.num(days[i], 1)} days</text>
          <text x="${x0 + 2}" y="33" font-size="10.5" class="t-soft">${i < 4 ? "before " + S[i][0].toLowerCase() : "finished goods"}</text>
          ${i < 4 ? `<text x="${x0 + segW * 0.78}" y="111" text-anchor="middle" font-size="12.5" font-weight="700" fill="var(--belt-deep)">${S[i][1]} s</text><text x="${x0 + segW * 0.78}" y="126" text-anchor="middle" font-size="10.5" class="t-soft">${S[i][0].toLowerCase()}</text>` : ""}`; }).join("")}
      </svg>`;
      const pct = (va / (lt * DAY)) * 100;
      $("[data-ro]", el).innerHTML = G.ro("Production lead time", G.num(lt, 1) + " days", "Σ inventory ÷ demand", true) + G.ro("Value-added time", va + " s", "Σ cycle times") + G.ro("Value-added share", G.num(pct, 3) + "%", "of lead time, 7.5-h working days");
      const big = inv.indexOf(Math.max(...inv));
      $("[data-msg]", el).innerHTML = `Almost all the lead time is product sitting in inventory — the biggest initial opportunity a value stream analysis finds (the largest pile here: ${big < 4 ? "before " + S[big][0].toLowerCase() : "finished goods"}). Speeding up a value-added step barely moves the total.`;
    }
    $$("input[data-i]", el).forEach((inp) => inp.addEventListener("input", () => { S[+inp.dataset.i][+inp.dataset.c] = Math.max(0, +inp.value || 0); draw(); }));
    $("[data-fg]", el).addEventListener("input", (e) => { fg = Math.max(0, +e.target.value || 0); draw(); });
    $("[data-d]", el).addEventListener("input", (e) => { demand = Math.max(1, +e.target.value || 1); draw(); });
    $("[data-h]", el).addEventListener("click", () => { S.forEach((s, i) => { s[2] = Math.round(s[2] / 2); $(`input[data-i="${i}"][data-c="2"]`, el).value = s[2]; }); fg = Math.round(fg / 2); $("[data-fg]", el).value = fg; draw(); });
    draw();
  };

  /* =================== Chapter 3 =================== */

  /* DMAIC, DMADV and IDOV side by side */
  G.W.dfssmap = (el) => {
    const ROWS = [
      ["DMAIC", "Improve an existing process", [["Define", "Identify the issue causing decreased customer satisfaction."], ["Measure", "Collect data from the process."], ["Analyze", "Study the process and data for clues."], ["Improve", "Change the process based on the analysis."], ["Control", "Monitor the system to sustain the gains."]]],
      ["DMADV", "Design when the product or process doesn't exist, or an optimized one still can't meet needs", [["Define", "Evaluate and prioritize the primary design objectives."], ["Measure", "Technical and competitive analysis of the design criteria customers and the industry value, plus regulator and stakeholder expectations."], ["Analyze", "Statistical analysis identifies design priorities with significance and confidence."], ["Design", "Work with designers so the outputs carry the attributes as requirements (design for X)."], ["Verify", "Objective evidence that the specified requirements are met, before full release."]]],
      ["IDOV", "Design (Woodford); the handbook says its four phases parallel MAIC", [null, ["Identify", "Customer and product requirements, business case, technical requirements, CTQs and spec limits, roles, milestones."], ["Design", "Concept design, FMEA of risks, design parameters, procurement and manufacturing plans, DOE for transfer functions."], ["Optimize", "Process capability against CTQ limits, robust performance and reliability, error-proofing, statistical tolerancing, cost."], ["Verify", "Prototype test and validation; performance, failure modes, reliability and risk; design iteration; final phase review."]]]
    ];
    el.innerHTML = `<h4>Three road maps, lined up</h4>
      <p class="hint">Click a phase. Columns line up the phases the handbook treats as parallel.</p>
      <div class="dfss-grid" role="table" aria-label="DMAIC, DMADV and IDOV phases aligned">
        ${ROWS.map(([n, d, ph], r) => `<div class="dfss-name" role="rowheader"><b>${n}</b><span>${d}</span></div>${ph.map((p, c) => p ? `<button type="button" class="dfss-c${p[0] !== ROWS[0][2][c][0] ? " diff" : ""}" data-r="${r}" data-c="${c}" aria-label="${n} ${p[0]}"><span class="full">${p[0]}</span><span class="ab" aria-hidden="true">${p[0][0]}</span></button>` : `<div class="dfss-c empty" aria-hidden="true">—</div>`).join("")}`).join("")}
      </div>
      <div class="ro key" style="margin-top:.8rem" data-info aria-live="polite"><div class="k">Select a phase</div><div class="v" style="font-size:1.2rem">—</div></div>
      <p class="small soft" style="margin-top:.5rem">Highlighted cells are where the design road maps differ from DMAIC: they design and verify a new product instead of improving and controlling an existing process. IDOV's Identify also covers Define-type work (business case, roles, milestones).</p>`;
    $$(".dfss-c[data-r]", el).forEach((b) => b.addEventListener("click", () => {
      $$(".dfss-c[data-r]", el).forEach((x) => x.setAttribute("aria-pressed", x === b));
      const row = ROWS[+b.dataset.r], p = row[2][+b.dataset.c];
      $("[data-info]", el).innerHTML = `<div class="k">${row[0]} · ${p[0]}</div><div style="font-size:1rem;line-height:1.5;margin-top:.2rem">${p[1]}</div>`;
    }));
  };

  C("dfsspick", {
    title: "DMAIC or a DFSS road map?",
    hint: "DMADV fits when the product or process doesn't exist, or exists and is optimized but still can't meet customer or business needs (Breyfogle, p. 55).",
    cats: ["DMAIC", "DMADV / DFSS"],
    items: [
      { t: "An existing order-entry process makes too many errors.", a: 0, why: "Improve what exists." },
      { t: "A product line that doesn't exist yet must be developed.", a: 1, why: "Nothing to improve — design it." },
      { t: "A process was already optimized with DMAIC and still can't meet the customer's requirement.", a: 1, why: "Breyfogle's second case: redesign." },
      { t: "Scrap on a current molding line rose last quarter.", a: 0, why: "Existing process, performance problem." },
      { t: "Designing a clinic's check-in process before the clinic opens.", a: 1, why: "New process." },
      { t: "Reduce fill-weight variation on an existing line.", a: 0, why: "Variation reduction on an existing process." }
    ]
  });

  C("idovphase", {
    title: "Which IDOV phase?",
    hint: "Identify → design → optimize → verify (p. 54). ASQ-style items ask where “robust performance” or “prototype and test” belong.",
    cats: ["Identify", "Design", "Optimize", "Verify"],
    items: [
      { t: "Identify customer and product requirements; establish the business case", a: 0, why: "Identify links the design to the voice of the customer." },
      { t: "Set technical requirements, CTQ variables and specification limits", a: 0, why: "Identify." },
      { t: "Formulate the concept design", a: 1, why: "Design." },
      { t: "Identify potential risks using FMEA", a: 1, why: "Design." },
      { t: "Use DOE to find transfer functions between CTQs and technical requirements", a: 1, why: "Design." },
      { t: "Design for robust performance and reliability", a: 2, why: "Optimize — the answer in the ASQ sample item." },
      { t: "Error-proofing and statistical tolerancing", a: 2, why: "Optimize." },
      { t: "Assess process capability against CTQ limits", a: 2, why: "Optimize." },
      { t: "Prototype test and validation", a: 3, why: "Verify (the handbook's heading says “Validate”)." },
      { t: "Final phase review", a: 3, why: "Verify." }
    ]
  });

  C("dfx", {
    title: "Design for what?", select: true,
    hint: "The handbook's design-for-X list (pp. 55–57). The sample item “aggressive benchmarks or breakthroughs on a consistent basis” is design for performance.",
    cats: ["Cost", "Manufacturing / assembly", "Test", "Maintainability", "Robustness", "Usability", "Extended functionality", "Efficiency", "Performance", "Security", "Scalability", "Agility", "Compliance"],
    items: [
      { t: "Cost accountants and purchasing hunt for cheaper materials and methods.", a: 0, why: "Design for cost." },
      { t: "Cut the part count so the product is easier and cheaper to build.", a: 1, why: "Design for manufacturing / assembly." },
      { t: "Allow in-process checks instead of relying only on a final functional test.", a: 2, why: "Design for test." },
      { t: "Modular, decoupled parts with standard components so repairs are quick.", a: 3, why: "Design for maintainability." },
      { t: "Life-cycle tests of every part; suppliers document MTTF or MTBF.", a: 4, why: "Design for robustness." },
      { t: "Users work comfortably with the product in its intended environment.", a: 5, why: "Design for usability." },
      { t: "Spreadsheet software later used for graphics, word processing and databases.", a: 6, why: "Design for extended functionality." },
      { t: "A point-of-sale system that completes a sale within five minutes.", a: 7, why: "Design for efficiency (Table 3.1)." },
      { t: "Aircraft built to fly faster than the speed of sound.", a: 8, why: "Design for performance." },
      { t: "Password encryption so only authorized users get in.", a: 9, why: "Design for security." },
      { t: "An auction site that must handle 100,000 users at month-end.", a: 10, why: "Design for scalability." },
      { t: "A hot tub maker quickly customizes each tub to blend into the buyer's landscape.", a: 11, why: "Design for agility." },
      { t: "Cars must meet California emission standards to be sold there.", a: 12, why: "Design for compliance." }
    ]
  });

  C("verval", {
    title: "Verification or validation?",
    hint: "Verification: objective evidence that <b>specified requirements</b> are fulfilled (ISO 9000:2015, 3.8.12). Validation: requirements for a <b>specific intended use</b> are fulfilled (3.8.13).",
    cats: ["Verification", "Validation"],
    items: [
      { t: "Inspect the machined housing against every dimension on the drawing.", a: 0, why: "Checks the spec — “did we build it right?”" },
      { t: "Nurses use the new infusion pump in a mock ward to see whether it fits their real work.", a: 1, why: "Intended use by intended users — “did we build the right thing?”" },
      { t: "Run the software's requirement test cases and confirm all pass.", a: 0, why: "Verification." },
      { t: "Farmers use the sprayer through a full growing season.", a: 1, why: "Validation." },
      { t: "Load-test the bracket to the specified 500 N.", a: 0, why: "A specified requirement." },
      { t: "A pilot group of customers uses the app for its intended purpose.", a: 1, why: "Validation." },
      { t: "Confirm the design output matches the design input specification.", a: 0, why: "Verification." },
      { t: "Confirm the training actually changed how operators do the job.", a: 1, why: "The handbook validates learning outcomes with the Rice and Munro evaluation model." }
    ]
  });

  /* MTBF / MTTF from failure rate */
  G.W.mtbf = (el) => {
    let hrs = 50000, f = 4, rep = true;
    el.innerHTML = `<h4><span>Failure rate and mean life</span><span class="seg" role="group" aria-label="Item type"><button type="button" data-t="1" aria-pressed="true">Repairable</button><button type="button" data-t="0" aria-pressed="false">Non-repairable</button></span></h4>
      <p class="hint">λ = failures ÷ total operating time. MTBF = 1/λ for repairable items; MTTF = 1/λ for non-repairable items (p. 56). The relationship assumes a constant failure rate.</p>
      <div class="grid2"><label class="field">Total operating hours<input type="number" min="1" value="${hrs}" data-h></label><label class="field">Failures observed<input type="number" min="1" value="${f}" data-f></label></div>
      <div class="readout" data-ro></div>`;
    function draw() {
      const lam = f / hrs, m = 1 / lam;
      $("[data-ro]", el).innerHTML = G.ro("Failure rate λ", G.sig(lam, 3), "failures per hour") + G.ro(rep ? "MTBF" : "MTTF", Math.round(m).toLocaleString("en-US") + " h", "1 ÷ λ", true) + G.ro("Use", rep ? "MTBF" : "MTTF", rep ? "repairable item" : "non-repairable item");
    }
    $("[data-h]", el).addEventListener("input", (e) => { hrs = Math.max(1, +e.target.value || 1); draw(); });
    $("[data-f]", el).addEventListener("input", (e) => { f = Math.max(1, +e.target.value || 1); draw(); });
    $$("[data-t]", el).forEach((b) => b.addEventListener("click", () => { rep = b.dataset.t === "1"; $$("[data-t]", el).forEach((x) => x.setAttribute("aria-pressed", x === b)); draw(); }));
    draw();
  };

  /* RPN lab with the Figure 3.7 data */
  G.W.rpnlab = (el) => {
    const R = [["Risk 7", 5, 8, 7, 5, 5, 3], ["Risk 1", 8, 8, 4, 8, 4, 3], ["Risk 3", 5, 5, 7, 5, 4, 4], ["Risk 9", 7, 5, 4, 7, 3, 4], ["Risk 5", 8, 4, 4, 8, 3, 3], ["Risk 2", 7, 4, 3, 7, 4, 3], ["Risk 4", 5, 5, 3, 5, 5, 3], ["Risk 6", 3, 7, 2, 3, 7, 2], ["Risk 8", 5, 3, 2, 5, 3, 2], ["Risk 10", 3, 3, 3, 3, 3, 3]];
    let cut = 100, mode = "rpn";
    const rpn = (r, o) => r[1 + o] * r[2 + o] * r[3 + o];
    el.innerHTML = `<h4><span>FMEA risk priority: before and after action</span><span class="seg" role="group" aria-label="Ranking rule"><button type="button" data-m="rpn" aria-pressed="true">Rank by RPN</button><button type="button" data-m="sev" aria-pressed="false">Severity first</button></span></h4>
      <p class="hint">Figure 3.7's ten risks. RPN = S × O × D, each 1–10. Edit any rating. Ties go to the higher severity (handbook “do's”); some industries rank severity first regardless of RPN.</p>
      <div class="tbl-wrap"><table class="tbl"><thead><tr><th scope="col">Risk</th><th scope="col" class="num">S</th><th scope="col" class="num">O</th><th scope="col" class="num">D</th><th scope="col" class="num">RPN</th><th scope="col" class="num">S×O</th><th scope="col" class="num">S′</th><th scope="col" class="num">O′</th><th scope="col" class="num">D′</th><th scope="col" class="num">RPN′</th></tr></thead>
      <tbody>${R.map((r, i) => `<tr><th scope="row">${r[0]}</th>${[1, 2, 3].map((c) => `<td class="num"><input type="number" min="1" max="10" value="${r[c]}" data-i="${i}" data-c="${c}" style="width:3.4rem" aria-label="${r[0]} ${"SOD"[c - 1]} before"></td>`).join("")}<td class="num" data-b="${i}"></td><td class="num" data-so="${i}"></td>${[4, 5, 6].map((c) => `<td class="num"><input type="number" min="1" max="10" value="${r[c]}" data-i="${i}" data-c="${c}" style="width:3.4rem" aria-label="${r[0]} ${"SOD"[c - 4]} after"></td>`).join("")}<td class="num" data-a="${i}"></td></tr>`).join("")}</tbody></table></div>
      <label class="field" style="max-width:24rem;margin-top:.6rem">Action cutoff: <b style="color:var(--ink)" data-cl></b><input type="range" min="20" max="300" step="5" value="${cut}" data-cut></label>
      <div data-svg></div><div class="readout" data-ro></div><p class="small" data-msg aria-live="polite"></p>`;
    function draw() {
      R.forEach((r, i) => {
        const b = rpn(r, 0), a = rpn(r, 3);
        const cb = $(`[data-b="${i}"]`, el); cb.textContent = b; cb.style.color = b > cut ? "var(--ooc)" : ""; cb.style.fontWeight = b > cut ? "700" : "";
        const ca = $(`[data-a="${i}"]`, el); ca.textContent = a; ca.style.color = a > cut ? "var(--ooc)" : ""; ca.style.fontWeight = a > cut ? "700" : "";
        $(`[data-so="${i}"]`, el).textContent = r[1] * r[2];
      });
      $("[data-cl]", el).textContent = cut;
      const order = R.map((r, i) => i).sort((p, q) => mode === "rpn" ? (rpn(R[q], 0) - rpn(R[p], 0)) || (R[q][1] - R[p][1]) : (R[q][1] - R[p][1]) || (rpn(R[q], 0) - rpn(R[p], 0)));
      const W = 640, rowH = 22, H = R.length * rowH + 30, L = 70, Rr = W - 50, mx = Math.max(300, ...R.map((r) => Math.max(rpn(r, 0), rpn(r, 3))));
      const x = (v) => L + (v / mx) * (Rr - L);
      $("[data-svg]", el).innerHTML = `<svg class="viz" viewBox="0 0 ${W} ${H}" role="img" aria-label="RPN before and after action for ten risks, cutoff ${cut}">
        ${order.map((i, k) => { const r = R[i], y = 8 + k * rowH, b = rpn(r, 0), a = rpn(r, 3); return `<text x="${L - 8}" y="${y + 13}" text-anchor="end" font-size="12">${r[0]}</text>
          <rect x="${L}" y="${y + 2}" width="${Math.max(1, x(b) - L)}" height="8" rx="2" fill="${b > cut ? "var(--ooc)" : "#C9B2AC"}"/>
          <rect x="${L}" y="${y + 11}" width="${Math.max(1, x(a) - L)}" height="8" rx="2" fill="var(--acc)"/>
          <text x="${x(Math.max(a, b)) + 6}" y="${y + 14}" font-size="11" class="t-soft">${b} → ${a}</text>`; }).join("")}
        <line x1="${x(cut)}" x2="${x(cut)}" y1="4" y2="${H - 22}" stroke="var(--limit)" stroke-width="2" stroke-dasharray="5 4"/>
        <text x="${x(cut)}" y="${H - 8}" text-anchor="middle" font-size="11.5" fill="var(--limit)" font-weight="700">cutoff ${cut}</text>
      </svg>
      <div class="legend"><span><i style="background:var(--ooc)"></i>Before, above cutoff</span><span><i style="background:#C9B2AC"></i>Before, below cutoff</span><span><i style="background:var(--acc)"></i>After action</span></div>`;
      const over0 = R.filter((r) => rpn(r, 0) > cut).length, over1 = R.filter((r) => rpn(r, 3) > cut).length, hiS = R.filter((r) => r[1] >= 9).map((r) => r[0]);
      $("[data-ro]", el).innerHTML = G.ro("Over cutoff before", over0) + G.ro("Over cutoff after", over1, "", true) + G.ro("First to act on", R[order[0]][0], mode === "rpn" ? "highest RPN" : "highest severity");
      $("[data-msg]", el).innerHTML = (hiS.length ? `<b style="color:var(--ooc)">Severity 9–10 on ${hiS.join(", ")}:</b> a hazardous effect deserves action whatever its RPN. ` : "")
        + `Lowering severity usually takes a redesign; occurrence falls with better prevention, and detection with better controls. Too low a cutoff spends resources on many minor risks; too high misses important ones.`;
    }
    $$("input[data-i]", el).forEach((inp) => inp.addEventListener("input", () => { R[+inp.dataset.i][+inp.dataset.c] = Math.min(10, Math.max(1, Math.round(+inp.value) || 1)); draw(); }));
    $("[data-cut]", el).addEventListener("input", (e) => { cut = +e.target.value; draw(); });
    $$("[data-m]", el).forEach((b) => b.addEventListener("click", () => { mode = b.dataset.m; $$("[data-m]", el).forEach((x) => x.setAttribute("aria-pressed", x === b)); draw(); }));
    draw();
  };

  C("sodscale", {
    title: "Where on the 1–10 scale?",
    hint: "Severity and occurrence: bad = high. Detection runs the other way: hard to detect = high (Table 3.2, step 8).",
    cats: ["Low (1–3)", "Middle (4–6)", "High (7–10)"],
    items: [
      { t: "Severity: hazardous to the user, without warning", a: 2, why: "10 in Table 3.3." },
      { t: "Severity: fit-and-finish item noticed by 50% of customers", a: 0, why: "3 in Table 3.3." },
      { t: "Severity: item works, but a comfort feature runs at reduced performance", a: 1, why: "5 in Table 3.3." },
      { t: "Occurrence: the cause happens daily", a: 2, why: "8–10 — frequent is high." },
      { t: "Occurrence: about 5 per thousand items", a: 1, why: "6 in Table 3.4." },
      { t: "Occurrence: under 0.01 per thousand items", a: 0, why: "1 in Table 3.4." },
      { t: "Detection: the operator obviously sees the error every time", a: 0, why: "1 or 2 — easy to detect scores low. The classic trap." },
      { t: "Detection: no control can detect the cause", a: 2, why: "10 — absolute uncertainty." },
      { t: "Detection: moderately high chance the control will catch it", a: 1, why: "4 in Table 3.5." }
    ]
  });

  C("fmeatype", {
    title: "Design FMEA or process FMEA?",
    hint: "DFMEA asks how the product design can fail; PFMEA asks how the manufacturing or assembly process can fail (pp. 74–76).",
    cats: ["Design FMEA", "Process FMEA"],
    items: [
      { t: "Could a small toy part come loose and become a choking hazard?", a: 0, why: "A product design question — the handbook's own example." },
      { t: "Could the operator load the part backwards in the fixture?", a: 1, why: "How the process step can fail." },
      { t: "The team starts from a schematic or functional block diagram.", a: 0, why: "DFMEA (Table 3.2, step 1)." },
      { t: "The team walks the line and works from process flowcharts.", a: 1, why: "PFMEA (Table 3.2, step 1)." },
      { t: "Might the tire jack slip when a driver uses it?", a: 0, why: "Design — how the customer will use the product." },
      { t: "Could the torque gun at station 30 be set wrong?", a: 1, why: "Process." },
      { t: "Done early, before tooling is cut, to save time and money.", a: 0, why: "DFMEA timing." },
      { t: "Done when the manufacturing or assembly layout is first developed.", a: 1, why: "PFMEA timing." }
    ]
  });
})();
