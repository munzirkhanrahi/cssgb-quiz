/* Widgets: Chapters 10 (process analysis), 11 (probability), 12 (distributions), 13 (collecting and summarizing data) */
(function () {
  "use strict";
  const { $, $$, esc } = G;
  const S = () => G.st;
  const C = (name, cfg) => { G.W[name] = (el) => G.classifier(el, cfg); };
  const rng = (seed) => () => { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const gauss = (r) => { let u = 0, v = 0; while (u === 0) u = r(); while (v === 0) v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
  G.rng = rng; G.gauss = gauss;
  const fmt = (x, d = 3) => G.num(x, d);
  const nice = (lo, hi, n = 5) => {
    if (hi <= lo) hi = lo + 1;
    const span = hi - lo, step0 = span / n, mag = Math.pow(10, Math.floor(Math.log10(step0))), r = step0 / mag;
    const step = (r >= 5 ? 10 : r >= 2 ? 5 : r >= 1 ? 2 : 1) * mag, t = [];
    for (let v = Math.ceil(lo / step) * step; v <= hi + step * 1e-9; v += step) t.push(+v.toPrecision(12));
    return t;
  };
  // Shared plot frame: returns scale functions and the axis markup
  G.frame = (o) => {
    const W = o.W || 640, H = o.H || 260, L = o.L || 52, R = W - (o.R || 18), T = o.T || 14, B = H - (o.B || 40);
    const x = (v) => L + ((v - o.x0) / (o.x1 - o.x0)) * (R - L), y = (v) => B - ((v - o.y0) / (o.y1 - o.y0)) * (B - T);
    const xt = o.xticks || nice(o.x0, o.x1, 6), yt = o.yticks || nice(o.y0, o.y1, 4);
    const xf = o.xf || ((v) => G.sig(v, 4)), yf = o.yf || ((v) => G.sig(v, 4));
    const axes = `${yt.map((v) => `<line x1="${L}" x2="${R}" y1="${y(v)}" y2="${y(v)}" stroke="var(--rule-soft)"/><text x="${L - 6}" y="${y(v) + 4}" text-anchor="end" font-size="11" class="t-soft">${yf(v)}</text>`).join("")}
      <line x1="${L}" x2="${R}" y1="${B}" y2="${B}" stroke="var(--ink-soft)"/>
      ${xt.map((v) => `<text x="${x(v)}" y="${B + 15}" text-anchor="middle" font-size="11" class="t-soft">${xf(v)}</text>`).join("")}
      ${o.xlab ? `<text x="${(L + R) / 2}" y="${H - 6}" text-anchor="middle" font-size="12" class="t-soft">${o.xlab}</text>` : ""}
      ${o.ylab ? `<text x="${L}" y="${T - 2}" font-size="11.5" class="t-soft" dy="-1">${o.ylab}</text>` : ""}`;
    const wide = o.wide !== false;
    return { W, H, L, R, T, B, x, y, axes, open: `${wide ? '<div class="vizscroll">' : ""}<svg class="viz${wide ? " wide" : ""}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(o.label || "chart")}">`, close: wide ? "</svg></div>" : "</svg>" };
  };
  G.nice = nice;

  /* =================== Chapter 10 =================== */
  const sym = (d) => `<svg viewBox="0 0 70 40" width="70" height="40" aria-hidden="true" style="vertical-align:middle;margin-right:.4rem">${d}</svg>`;
  const ST = 'fill="#fff" stroke="var(--ink)" stroke-width="2"';
  C("flowsym", {
    title: "Read the flowchart symbol", select: true,
    hint: "Figure 10.1 (ISO 5807 shapes, as shown in Tague's <i>Quality Toolbox</i>). Pick what each shape means.",
    cats: ["Process step", "Decision", "Delay or wait", "Document", "Input or output", "Link to another page", "Manual operation", "Preparation", "Start or end"],
    items: [
      { t: sym(`<rect x="8" y="6" width="54" height="28" ${ST}/>`) + "Usually one arrow leaves it.", a: 0, why: "A rectangle is one step in the process." },
      { t: sym(`<path d="M35 3 L66 20 L35 37 L4 20 Z" ${ST}/>`) + "Two or more arrows leave it.", a: 1, why: "The diamond holds a question; each exit is an answer (often yes/no)." },
      { t: sym(`<path d="M10 6 H40 A16 14 0 0 1 40 34 H10 Z" ${ST}/>`), a: 2, why: "The D-shape is a delay or wait." },
      { t: sym(`<path d="M8 6 H62 V30 Q48 22 35 30 T8 30 Z" ${ST}/>`), a: 3, why: "A box with a wavy bottom is a document." },
      { t: sym(`<path d="M18 6 H64 L52 34 H6 Z" ${ST}/>`), a: 4, why: "A parallelogram is an input or output." },
      { t: sym(`<circle cx="35" cy="20" r="14" ${ST}/>`) + "The same shape appears on the next page.", a: 5, why: "The connector shows the flow continues elsewhere." },
      { t: sym(`<path d="M6 6 H64 L54 34 H16 Z" ${ST}/>`), a: 6, why: "A trapezoid, wide edge on top, is a manual operation." },
      { t: sym(`<path d="M18 6 H52 L64 20 L52 34 H18 L6 20 Z" ${ST}/>`), a: 7, why: "The hexagon is preparation." },
      { t: sym(`<rect x="6" y="8" width="58" height="24" rx="12" ${ST}/>`), a: 8, why: "The rounded oval marks the start and end points." }
    ]
  });

  C("procwi", {
    title: "Procedure or work instruction?",
    hint: "Procedures describe what, why, where and when. Work instructions add who and how (p. 172).",
    cats: ["Procedure", "Work instruction"],
    items: [
      { t: "What is done during the process", a: 0, why: "Procedure." },
      { t: "Why it is done — the business reason", a: 0, why: "Procedure." },
      { t: "Where it is done — location or process step", a: 0, why: "Procedure." },
      { t: "When it is done — the trigger", a: 0, why: "Procedure." },
      { t: "Who does what — personnel with a specific skill set", a: 1, why: "Work instruction." },
      { t: "How it is done, step by step", a: 1, why: "Work instruction — which can be a checklist, flowchart, photo, video or screen shot." }
    ]
  });

  C("fishcat", {
    title: "Which bone of the fishbone?",
    hint: "Causes from Figure 10.5's machining-surface-defect brainstorm, sorted into the six classic categories.",
    cats: ["Measurement", "Material", "Personnel", "Environment", "Methods", "Machines"],
    items: [
      { t: "Repeatability and reproducibility of the gauge", a: 0, why: "Measurement." },
      { t: "Bias and stability", a: 0, why: "Measurement." },
      { t: "Supplier-to-supplier variation", a: 1, why: "Material." },
      { t: "Shifts, supervision, training, motivation", a: 2, why: "Personnel." },
      { t: "Static discharge, particle count, condensation, moisture", a: 3, why: "Environment." },
      { t: "Parameters, settings, tooling", a: 4, why: "Methods." },
      { t: "Speed, lubricant, maintenance, condition", a: 5, why: "Machines." },
      { t: "Vibration", a: [3, 5], why: "It appears on two bones in Figure 10.5 — floor vibration (environment) and spindle vibration (machine). Categories are a prompt, not a rule." }
    ]
  });

  /* Pareto: count vs weighted (Figures 10.6 and 10.7) */
  G.W.pareto10 = (el) => {
    const D = [["Stains", 17, "Minor"], ["Scratches", 15, "Minor"], ["Dent", 14, "Major"], ["Label smudge", 12, "Minor"], ["Broken LED", 7, "Critical"], ["Device nonfunctional", 5, "Critical"], ["Missing screw", 3, "Major"]];
    const w = { Critical: 100, Major: 25, Minor: 10 };
    let mode = "count";
    el.innerHTML = `<h4><span>Pareto: by count or by impact?</span><span class="seg" role="group" aria-label="Measure"><button type="button" data-m="count" aria-pressed="true">Count (Fig. 10.6)</button><button type="button" data-m="weighted" aria-pressed="false">Weighted (Fig. 10.7)</button></span></h4>
      <p class="hint">Final-assembly defects. Weighted score = occurrences × criticality weight. Edit the weights and watch the priorities change.</p>
      <div class="row" data-wts style="gap:.8rem">${Object.keys(w).map((k) => `<label class="field" style="width:8rem">${k} weight<input type="number" min="0" value="${w[k]}" data-wt="${k}"></label>`).join("")}</div>
      <div data-svg></div><p class="small" data-msg aria-live="polite"></p>`;
    function draw() {
      $("[data-wts]", el).style.display = mode === "weighted" ? "" : "none";
      const rows = D.map(([n, c, k]) => [n, mode === "count" ? c : c * w[k]]).sort((a, b) => b[1] - a[1]);
      const keep = mode === "count" ? 5 : 4, top = rows.slice(0, keep), other = rows.slice(keep);
      const bars = [...top, ["Other", other.reduce((s, r) => s + r[1], 0)]], tot = bars.reduce((s, r) => s + r[1], 0);
      let cum = 0; const cp = bars.map((b) => (cum += b[1]) / tot * 100);
      const f = G.frame({ W: 640, H: 270, x0: 0, x1: bars.length, y0: 0, y1: tot, yticks: nice(0, tot, 4), xticks: [], B: 56, R: 46, label: "Pareto chart", ylab: mode === "count" ? "Count" : "Weighted score" });
      const bw = (f.R - f.L) / bars.length;
      $("[data-svg]", el).innerHTML = f.open + f.axes + bars.map((b, i) => `<rect x="${f.L + i * bw + 3}" y="${f.y(b[1])}" width="${bw - 6}" height="${f.B - f.y(b[1])}" rx="3" fill="${b[0] === "Other" ? "#C9CEC4" : "var(--c10)"}"/>
        <text x="${f.L + i * bw + bw / 2}" y="${f.y(b[1]) - 5}" text-anchor="middle" font-size="11.5" font-weight="700">${b[1]}</text>
        <text x="${f.L + i * bw + bw / 2}" y="${f.B + 15}" text-anchor="middle" font-size="11">${b[0].length > 12 ? b[0].split(" ")[0] : b[0]}</text>
        <text x="${f.L + i * bw + bw / 2}" y="${f.B + 29}" text-anchor="middle" font-size="10.5" class="t-soft">${G.num(cp[i], 1)}%</text>`).join("")
        + `<path d="${cp.map((c, i) => `${i ? "L" : "M"}${f.L + i * bw + bw / 2},${f.T + (1 - c / 100) * (f.B - f.T)}`).join("")}" fill="none" stroke="var(--ooc)" stroke-width="2"/>
        ${cp.map((c, i) => `<circle cx="${f.L + i * bw + bw / 2}" cy="${f.T + (1 - c / 100) * (f.B - f.T)}" r="3.5" fill="var(--ooc)"/>`).join("")}
        <line x1="${f.L}" x2="${f.R}" y1="${f.T + 0.2 * (f.B - f.T)}" y2="${f.T + 0.2 * (f.B - f.T)}" stroke="var(--ooc)" stroke-dasharray="4 4" opacity=".6"/>
        <text x="${f.R + 4}" y="${f.T + 0.2 * (f.B - f.T) + 4}" font-size="11" fill="var(--ooc)">80%</text><text x="${f.R + 4}" y="${f.T + 4}" font-size="11" fill="var(--ooc)">100%</text>` + f.close;
      $("[data-msg]", el).innerHTML = mode === "count"
        ? "By count, stains and scratches lead — cosmetic, minor defects. “Other” always goes last, however big it is."
        : `Weighted by criticality, <b>${bars[0][0].toLowerCase()}</b> moves to the top. Same data, different priority: choose the measure (count, cost, criticality) that matches the goal.`;
    }
    $$("[data-m]", el).forEach((b) => b.addEventListener("click", () => { mode = b.dataset.m; $$("[data-m]", el).forEach((x) => x.setAttribute("aria-pressed", x === b)); draw(); }));
    $$("[data-wt]", el).forEach((i) => i.addEventListener("input", () => { w[i.dataset.wt] = Math.max(0, +i.value || 0); draw(); }));
    draw();
  };

  /* =================== Chapter 11 =================== */
  G.W.probrules = (el) => {
    const P = {
      mold: ["Two molding machines, each works with P = 0.8", 0.8, 0.8, "ind"],
      supp: ["Board from supplier B (0.3) or C (0.5)", 0.3, 0.5, "me"],
      comp: ["Assembly needs component A (0.7) and B (0.8)", 0.7, 0.8, "ind"],
      die: ["One die throw: a 4 or a 6", 1 / 6, 1 / 6, "me"]
    };
    let pa = 0.8, pb = 0.8, rel = "ind", pab = 0.5;
    el.innerHTML = `<h4>Addition and multiplication rules</h4>
      <p class="hint">Pick how A and B are related, then read P(A or B) and P(A and B). Presets are the handbook's examples (pp. 184–186).</p>
      <div class="row" style="gap:.4rem;margin-bottom:.6rem">${Object.entries(P).map(([k, p]) => `<button type="button" class="btn sm" data-p="${k}">${p[0]}</button>`).join("")}</div>
      <div class="grid2"><label class="field">P(A)<input type="number" min="0" max="1" step="0.01" data-a></label><label class="field">P(B)<input type="number" min="0" max="1" step="0.01" data-b></label></div>
      <div class="row" style="margin:.6rem 0"><span class="seg" role="group" aria-label="Relationship"><button type="button" data-r="me">Mutually exclusive</button><button type="button" data-r="ind">Independent</button><button type="button" data-r="gen">Neither — I know P(A and B)</button></span>
      <label class="field" data-abw style="width:9rem">P(A and B)<input type="number" min="0" max="1" step="0.01" data-ab></label></div>
      <div class="grid2" style="align-items:center"><div data-svg></div><div class="readout" data-ro style="grid-template-columns:1fr 1fr"></div></div>
      <p class="small" data-msg aria-live="polite"></p>`;
    const sync = () => { $("[data-a]", el).value = +pa.toFixed(4); $("[data-b]", el).value = +pb.toFixed(4); $("[data-ab]", el).value = +pab.toFixed(4); };
    function draw() {
      $$("[data-r]", el).forEach((x) => x.setAttribute("aria-pressed", x.dataset.r === rel));
      $("[data-abw]", el).style.display = rel === "gen" ? "" : "none";
      const and = rel === "me" ? 0 : rel === "ind" ? pa * pb : Math.min(pab, pa, pb), or = pa + pb - and;
      const bad = rel === "me" && pa + pb > 1;
      const ov = Math.min(pa, pb) > 0 ? and / Math.min(pa, pb) : 0, r1 = 34 + 40 * Math.sqrt(pa), r2 = 34 + 40 * Math.sqrt(pb);
      const gap = rel === "me" ? r1 + r2 + 8 : (r1 + r2) * (1 - 0.55 * ov);
      const cx1 = 150 - gap / 2, cx2 = 150 + gap / 2;
      $("[data-svg]", el).innerHTML = `<svg class="viz" viewBox="0 0 300 190" role="img" aria-label="Venn diagram of A and B"><rect x="2" y="2" width="296" height="186" rx="8" fill="none" stroke="var(--rule)"/>
        <circle cx="${cx1}" cy="95" r="${r1}" fill="var(--c11)" fill-opacity=".28" stroke="var(--c11)" stroke-width="2"/>
        <circle cx="${cx2}" cy="95" r="${r2}" fill="var(--c4)" fill-opacity=".22" stroke="var(--c4)" stroke-width="2"/>
        <text x="${cx1 - r1 * 0.45}" y="99" text-anchor="middle" font-weight="700">A</text><text x="${cx2 + r2 * 0.45}" y="99" text-anchor="middle" font-weight="700">B</text>
        <text x="150" y="182" text-anchor="middle" font-size="11" class="t-soft">${rel === "me" ? "no overlap: P(A and B) = 0" : "overlap = P(A and B)"}</text></svg>`;
      $("[data-ro]", el).innerHTML = G.ro("P(A or B)", bad ? "—" : fmt(Math.min(1, or), 4), rel === "me" ? "P(A) + P(B)" : "P(A) + P(B) − P(A and B)", true) + G.ro("P(A and B)", fmt(and, 4), rel === "me" ? "0 — can't both happen" : rel === "ind" ? "P(A) × P(B)" : "given")
        + G.ro("P(not A)", fmt(1 - pa, 4), "1 − P(A)") + G.ro("P(B | A)", pa > 0 ? fmt(and / pa, 4) : "—", "P(A and B) ÷ P(A)");
      $("[data-msg]", el).innerHTML = bad ? `<b style="color:var(--ooc)">Mutually exclusive events can't have P(A) + P(B) above 1.</b>`
        : rel === "ind" ? `Independent: knowing A happened doesn't change P(B) — P(B | A) = P(B) = ${fmt(pb, 3)}.`
        : rel === "me" ? "Mutually exclusive events with nonzero probabilities are <b>not</b> independent: if A happens, P(B) drops to 0."
        : Math.abs(and - pa * pb) < 1e-9 ? "Here P(A and B) = P(A) × P(B), so A and B happen to be independent." : `P(A and B) ≠ P(A) × P(B) = ${fmt(pa * pb, 3)}, so A and B are dependent.`;
    }
    $("[data-a]", el).addEventListener("input", (e) => { pa = Math.min(1, Math.max(0, +e.target.value || 0)); draw(); });
    $("[data-b]", el).addEventListener("input", (e) => { pb = Math.min(1, Math.max(0, +e.target.value || 0)); draw(); });
    $("[data-ab]", el).addEventListener("input", (e) => { pab = Math.min(1, Math.max(0, +e.target.value || 0)); draw(); });
    $$("[data-r]", el).forEach((b) => b.addEventListener("click", () => { rel = b.dataset.r; draw(); }));
    $$("[data-p]", el).forEach((b) => b.addEventListener("click", () => { const p = P[b.dataset.p]; pa = p[1]; pb = p[2]; rel = p[3]; sync(); draw(); }));
    sync(); draw();
  };

  G.W.counting = (el) => {
    let n = 10, r = 3;
    el.innerHTML = `<h4>Permutations and combinations</h4>
      <p class="hint">Order matters → permutation, nPr = n! ÷ (n − r)!. Order doesn't matter → combination, nCr = n! ÷ [r!(n − r)!].</p>
      <div class="row" style="gap:.4rem;margin-bottom:.6rem"><button type="button" class="btn sm" data-p="5,5">Letters of “SIGMA”, all at once</button><button type="button" class="btn sm" data-p="10,3">3-person task force from 10 volunteers</button><button type="button" class="btn sm" data-p="2,2">Seat A and B in two seats</button></div>
      <div class="grid2"><label class="field">n (objects available)<input type="number" min="0" max="60" value="${n}" data-n></label><label class="field">r (taken at a time)<input type="number" min="0" max="60" value="${r}" data-r></label></div>
      <div class="readout" data-ro></div><p class="small" data-msg></p>`;
    function draw() {
      const ok = r <= n;
      const P = ok ? S().perm(n, r) : NaN, Cc = ok ? S().choose(n, r) : NaN;
      $("[data-ro]", el).innerHTML = G.ro("Permutations nPr", ok ? P.toLocaleString("en-US") : "—", "order matters", true) + G.ro("Combinations nCr", ok ? Cc.toLocaleString("en-US") : "—", "order doesn't matter", true) + G.ro("r!", S().fact(r).toLocaleString("en-US"), "orderings of each group");
      $("[data-msg]", el).innerHTML = ok ? `Each combination can be ordered r! = ${S().fact(r).toLocaleString("en-US")} ways, so nPr = nCr × r!. Remember 0! = 1, nPn = n!, nC0 = nCn = 1.` : `<b style="color:var(--ooc)">r can't exceed n.</b>`;
    }
    $("[data-n]", el).addEventListener("input", (e) => { n = Math.max(0, Math.min(60, Math.round(+e.target.value) || 0)); draw(); });
    $("[data-r]", el).addEventListener("input", (e) => { r = Math.max(0, Math.min(60, Math.round(+e.target.value) || 0)); draw(); });
    $$("[data-p]", el).forEach((b) => b.addEventListener("click", () => { [n, r] = b.dataset.p.split(",").map(Number); $("[data-n]", el).value = n; $("[data-r]", el).value = r; draw(); }));
    draw();
  };

  G.W.drawprob = (el) => {
    let N = 50, D = 10, k = 3;
    el.innerHTML = `<h4>Drawing without replacement</h4>
      <p class="hint">Probability that every item drawn is defective. Without replacement the events are dependent — each draw changes the odds for the next.</p>
      <div class="row" style="gap:.4rem;margin-bottom:.6rem"><button type="button" class="btn sm" data-p="50,10,3">Lot of 50 with 10 defective, sample 3</button><button type="button" class="btn sm" data-p="5,2,2">Urn: 2 black of 5, draw 2</button></div>
      <div class="grid3"><label class="field">Lot size N<input type="number" min="1" value="${N}" data-N></label><label class="field">Defective in lot D<input type="number" min="0" value="${D}" data-D></label><label class="field">Draws k<input type="number" min="1" value="${k}" data-k></label></div>
      <div class="readout" data-ro></div><p class="small" data-msg></p>`;
    function draw() {
      const ok = D <= N && k <= N;
      let p = 1; const parts = [];
      for (let i = 0; i < k; i++) { p *= Math.max(0, D - i) / (N - i); parts.push(`${Math.max(0, D - i)}/${N - i}`); }
      const pr = Math.pow(D / N, k);
      $("[data-ro]", el).innerHTML = G.ro("Without replacement", ok ? fmt(p, 4) : "—", parts.join(" × "), true) + G.ro("With replacement", ok ? fmt(pr, 4) : "—", `(${D}/${N})^${k}`);
      $("[data-msg]", el).innerHTML = ok ? "With replacement the draws are independent, so the same probability multiplies k times." : `<b style="color:var(--ooc)">D and k can't exceed N.</b>`;
    }
    ["N", "D", "k"].forEach((id) => $(`[data-${id}]`, el).addEventListener("input", (e) => { const v = Math.max(id === "D" ? 0 : 1, Math.round(+e.target.value) || 0); if (id === "N") N = v; else if (id === "D") D = v; else k = v; draw(); }));
    $$("[data-p]", el).forEach((b) => b.addEventListener("click", () => { [N, D, k] = b.dataset.p.split(",").map(Number); $("[data-N]", el).value = N; $("[data-D]", el).value = D; $("[data-k]", el).value = k; draw(); }));
    draw();
  };

  C("relsort", {
    title: "Mutually exclusive, independent, or neither?",
    hint: "Mutually exclusive: can't happen together, P(A and B) = 0. Independent: one doesn't change the other's probability, P(B | A) = P(B).",
    cats: ["Mutually exclusive", "Independent", "Neither"],
    items: [
      { t: "Rolling a 4 and rolling a 6 on a single throw of a die", a: 0, why: "Both can't happen on one throw." },
      { t: "Heads on the first coin toss and heads on the second", a: 1, why: "The first toss doesn't change the second." },
      { t: "Two machines in different cells both running on a given day", a: 1, why: "Treated as independent in the handbook's molding example." },
      { t: "First and second marbles drawn are black, without replacement", a: 2, why: "Dependent — the first draw changes the second — but both can happen." },
      { t: "The board on a unit came from supplier B, or it came from supplier C", a: 0, why: "One board, one supplier." },
      { t: "A part is defective and it came from night shift, which runs a higher defect rate", a: 2, why: "Dependent and not exclusive." },
      { t: "P(A and B) = 0", a: 0, why: "The definition of mutually exclusive." },
      { t: "P(B | A) = P(B)", a: 1, why: "The definition of independence." }
    ]
  });

  /* Central limit theorem simulator */
  G.W.clt = (el) => {
    const POP = {
      unif: ["Uniform", (r) => 10 * r(), 5, 10 / Math.sqrt(12)],
      skew: ["Right-skewed (exponential)", (r) => -2 * Math.log(1 - r()), 2, 2],
      bimo: ["Bimodal", (r) => (r() < 0.5 ? 2 : 8) + 0.7 * gauss(r), 5, Math.sqrt(9 + 0.49)],
      norm: ["Normal", (r) => 5 + 1.5 * gauss(r), 5, 1.5]
    };
    let pop = "skew", n = 2;
    el.innerHTML = `<h4><span>Central limit theorem: averages turn normal</span><span class="seg" role="group" aria-label="Population">${Object.entries(POP).map(([k, p]) => `<button type="button" data-pop="${k}" aria-pressed="${k === pop}">${p[0]}</button>`).join("")}</span></h4>
      <p class="hint">Each bar chart shows 3,000 sample means of size n drawn from the population. Watch the shape turn normal and the spread shrink by √n.</p>
      <div class="row" style="margin-bottom:.4rem"><span class="small soft">Sample size n</span><span class="seg" role="group" aria-label="Sample size">${[1, 2, 5, 10, 30].map((v) => `<button type="button" data-n="${v}" aria-pressed="${v === n}">${v}</button>`).join("")}</span></div>
      <div data-svg></div><div class="readout" data-ro></div><p class="small" data-msg aria-live="polite"></p>`;
    function draw() {
      const [name, gen, mu, sig] = POP[pop], r = rng(29 + n * 7 + pop.length);
      const means = []; for (let i = 0; i < 3000; i++) { let s = 0; for (let j = 0; j < n; j++) s += gen(r); means.push(s / n); }
      const lo = pop === "skew" ? 0 : 0, hi = pop === "skew" ? 10 : 10, bins = 40, bw = (hi - lo) / bins, cnt = new Array(bins).fill(0);
      means.forEach((m) => { const b = Math.floor((m - lo) / bw); if (b >= 0 && b < bins) cnt[b]++; });
      const se = sig / Math.sqrt(n), dens = cnt.map((c) => c / (3000 * bw)), ymax = Math.max(...dens, S().npdf(0) / se) * 1.08;
      const f = G.frame({ W: 640, H: 230, x0: lo, x1: hi, y0: 0, y1: ymax, yticks: [], label: `Histogram of sample means, n = ${n}`, xlab: "Sample mean" });
      const curve = []; for (let i = 0; i <= 200; i++) { const x = lo + (i / 200) * (hi - lo); curve.push(`${i ? "L" : "M"}${f.x(x).toFixed(1)},${f.y(S().npdf((x - mu) / se) / se).toFixed(1)}`); }
      $("[data-svg]", el).innerHTML = f.open + f.axes + dens.map((d, i) => `<rect x="${f.x(lo + i * bw) + 0.5}" y="${f.y(d)}" width="${Math.max(0, f.x(lo + (i + 1) * bw) - f.x(lo + i * bw) - 1)}" height="${f.B - f.y(d)}" fill="var(--c11)" opacity=".75"/>`).join("")
        + `<path d="${curve.join("")}" fill="none" stroke="var(--ink)" stroke-width="2"/><text x="${f.R - 4}" y="${f.T + 12}" text-anchor="end" font-size="11.5">— normal, mean μ, SD σ/√n</text>` + f.close;
      const sdm = S().sd(means);
      $("[data-ro]", el).innerHTML = G.ro("Population σ", fmt(sig, 3)) + G.ro("σ/√n", fmt(se, 3), "standard error", true) + G.ro("SD of the 3,000 means", fmt(sdm, 3), "simulated") + G.ro("Mean of means", fmt(S().mean(means), 3), `μ = ${fmt(mu, 2)}`);
      $("[data-msg]", el).innerHTML = n === 1 ? "With n = 1 you're just looking at the population itself."
        : n >= 30 ? "By n = 30 even the skewed and bimodal populations give near-normal averages — the usual “large enough” rule of thumb."
        : pop === "norm" ? "A normal population gives normal averages at any n (statement 3 of the theorem)." : "Averages are already less lumpy than the population; the stranger the population, the larger n needs to be.";
    }
    $$("[data-pop]", el).forEach((b) => b.addEventListener("click", () => { pop = b.dataset.pop; $$("[data-pop]", el).forEach((x) => x.setAttribute("aria-pressed", x === b)); draw(); }));
    $$("[data-n]", el).forEach((b) => b.addEventListener("click", () => { n = +b.dataset.n; $$("[data-n]", el).forEach((x) => x.setAttribute("aria-pressed", x === b)); draw(); }));
    draw();
  };

  /* Confidence interval for a mean */
  G.W.cimean = (el) => {
    const P = { fill: ["Chemical filling: σ 0.012, n 16, mean 10", 10, 0.012, 16, 95, "z"], shop: ["Home shopping: σ $37.50, n 32, mean $78.25", 78.25, 37.5, 32, 95, "z"], shopt: ["Same, n 25 with t", 78.25, 37.5, 25, 95, "t"] };
    let m = 10, s = 0.012, n = 16, cl = 95, dist = "z";
    el.innerHTML = `<h4>Confidence interval for the mean</h4>
      <p class="hint">Standard error = σ/√n; margin of error = Z (or t) × standard error. Use Z when σ is known; t with n − 1 degrees of freedom when only s is known.</p>
      <div class="row" style="gap:.4rem;margin-bottom:.6rem">${Object.entries(P).map(([k, p]) => `<button type="button" class="btn sm" data-p="${k}">${p[0]}</button>`).join("")}</div>
      <div class="grid3"><label class="field">Sample mean<input type="number" step="any" data-m></label><label class="field">σ or s<input type="number" step="any" min="0" data-s></label><label class="field">n<input type="number" min="2" data-n></label></div>
      <div class="row" style="margin:.6rem 0"><span class="seg" role="group" aria-label="Confidence">${[90, 95, 99].map((c) => `<button type="button" data-c="${c}">${c}%</button>`).join("")}</span><span class="seg" role="group" aria-label="Distribution"><button type="button" data-d="z">Z (σ known)</button><button type="button" data-d="t">t (s from sample)</button></span></div>
      <div class="readout" data-ro></div>`;
    const sync = () => { $("[data-m]", el).value = m; $("[data-s]", el).value = s; $("[data-n]", el).value = n; };
    function draw() {
      $$("[data-c]", el).forEach((x) => x.setAttribute("aria-pressed", +x.dataset.c === cl)); $$("[data-d]", el).forEach((x) => x.setAttribute("aria-pressed", x.dataset.d === dist));
      const a = 1 - cl / 100, crit = dist === "z" ? S().ninv(1 - a / 2) : S().tinv(1 - a / 2, n - 1), se = s / Math.sqrt(n), me = crit * se, d = Math.max(3, -Math.floor(Math.log10(me)) + 2);
      $("[data-ro]", el).innerHTML = G.ro("Standard error", G.sig(se, 4), "σ/√n") + G.ro(dist === "z" ? "Z" : `t, df ${n - 1}`, fmt(crit, 3), `${cl}% two-sided`) + G.ro("Margin of error", G.sig(me, 4), "critical × SE") + G.ro(`${cl}% CI`, `${G.num(m - me, d)} to ${G.num(m + me, d)}`, "mean ± margin", true);
    }
    $("[data-m]", el).addEventListener("input", (e) => { m = +e.target.value || 0; draw(); });
    $("[data-s]", el).addEventListener("input", (e) => { s = Math.max(0, +e.target.value || 0); draw(); });
    $("[data-n]", el).addEventListener("input", (e) => { n = Math.max(2, Math.round(+e.target.value) || 2); draw(); });
    $$("[data-c]", el).forEach((b) => b.addEventListener("click", () => { cl = +b.dataset.c; draw(); }));
    $$("[data-d]", el).forEach((b) => b.addEventListener("click", () => { dist = b.dataset.d; draw(); }));
    $$("[data-p]", el).forEach((b) => b.addEventListener("click", () => { [, m, s, n, cl, dist] = P[b.dataset.p]; sync(); draw(); }));
    sync(); draw();
  };

  /* =================== Chapter 12 =================== */
  G.W.dist = (el) => {
    const D = {
      binom: { n: "Binomial", f: [["n", "Trials n", 5, 1], ["p", "Probability p", 0.1, 0.01], ["x", "x", 1, 1]], q: true,
        presets: [["Sample of 5, 10% defective, exactly 1", { n: 5, p: 0.1, x: 1, mode: "eq" }], ["Coin tossed 60 times, tails", { n: 60, p: 0.5, x: 30, mode: "eq" }], ["Guessing 100 four-choice items, 80+ right", { n: 100, p: 0.25, x: 80, mode: "ge" }]] },
      pois: { n: "Poisson", f: [["l", "Mean λ", 5, 0.1], ["x", "x", 1, 1]], q: true,
        presets: [["λ = 5, fewer than 2 defects", { l: 5, x: 1, mode: "le" }], ["Lot of 50 at 10%: exactly 5", { l: 5, x: 5, mode: "eq" }]] },
      norm: { n: "Normal", f: [["mu", "Mean μ", 0, 0.1], ["sd", "SD σ", 1, 0.1], ["a", "From a", 1.5, 0.1], ["b", "To b", 2.5, 0.1]],
        presets: [["Area from +1.5σ to +2.5σ", { mu: 0, sd: 1, a: 1.5, b: 2.5 }], ["Pizza orders: 20 to 35 min (μ 30, σ 5)", { mu: 30, sd: 5, a: 20, b: 35 }]] },
      t: { n: "Student's t", f: [["df", "Degrees of freedom", 5, 1], ["al", "α", 0.05, 0.01]], crit: true, presets: [["df 4, two-sided α 0.05", { df: 4, al: 0.05 }], ["df 19, α 0.10", { df: 19, al: 0.1 }]] },
      chi: { n: "Chi-square", f: [["df", "Degrees of freedom", 5, 1], ["al", "α (right tail)", 0.01, 0.01]], crit: true, presets: [["df 5, α 0.01", { df: 5, al: 0.01 }], ["df 3, α 0.05", { df: 3, al: 0.05 }]] },
      F: { n: "F", f: [["d1", "Numerator df v₁", 4, 1], ["d2", "Denominator df v₂", 6, 1], ["al", "α (right tail)", 0.05, 0.01]], crit: true, presets: [["F(0.05; 4, 6)", { d1: 4, d2: 6, al: 0.05 }], ["F(0.05; 2, 9) for ANOVA", { d1: 2, d2: 9, al: 0.05 }]] }
    };
    let k = "binom", mode = "eq"; const v = {}; Object.values(D).forEach((d) => d.f.forEach(([id, , def]) => { if (!(id in v)) v[id] = def; }));
    const V = { binom: { n: 5, p: 0.1, x: 1 }, pois: { l: 5, x: 1 }, norm: { mu: 0, sd: 1, a: 1.5, b: 2.5 }, t: { df: 5, al: 0.05 }, chi: { df: 5, al: 0.01 }, F: { d1: 4, d2: 6, al: 0.05 } };
    el.innerHTML = `<h4>Distribution explorer</h4>
      <div class="row" style="margin-bottom:.5rem"><span class="seg" role="group" aria-label="Distribution">${Object.entries(D).map(([id, d]) => `<button type="button" data-k="${id}">${d.n}</button>`).join("")}</span></div>
      <div data-form></div><div data-svg></div><div class="readout" data-ro></div><p class="small" data-msg aria-live="polite"></p>`;
    function form() {
      const d = D[k], vals = V[k];
      $$("[data-k]", el).forEach((b) => b.setAttribute("aria-pressed", b.dataset.k === k));
      $("[data-form]", el).innerHTML = `<div class="row" style="gap:.4rem;margin-bottom:.5rem">${d.presets.map((p, i) => `<button type="button" class="btn sm" data-pr="${i}">${p[0]}</button>`).join("")}</div>
        <div class="grid3">${d.f.map(([id, lab, , step]) => `<label class="field">${lab}<input type="number" step="${step}" value="${vals[id]}" data-f="${id}"></label>`).join("")}</div>
        ${d.q ? `<div class="row" style="margin:.5rem 0"><span class="seg" role="group" aria-label="Probability">${[["eq", "P(X = x)"], ["le", "P(X ≤ x)"], ["ge", "P(X ≥ x)"]].map(([m, l]) => `<button type="button" data-mode="${m}" aria-pressed="${m === mode}">${l}</button>`).join("")}</span></div>` : ""}`;
      $$("[data-f]", el).forEach((i) => i.addEventListener("input", () => { vals[i.dataset.f] = +i.value; draw(); }));
      $$("[data-mode]", el).forEach((b) => b.addEventListener("click", () => { mode = b.dataset.mode; $$("[data-mode]", el).forEach((x) => x.setAttribute("aria-pressed", x === b)); draw(); }));
      $$("[data-pr]", el).forEach((b) => b.addEventListener("click", () => { const p = d.presets[+b.dataset.pr][1]; Object.assign(vals, p); if (p.mode) mode = p.mode; form(); draw(); }));
    }
    function bars(pm, xs, hit, label) {
      const ymax = Math.max(...xs.map(pm)) * 1.12 || 1, f = G.frame({ W: 640, H: 220, x0: xs[0] - 0.6, x1: xs[xs.length - 1] + 0.6, y0: 0, y1: ymax, label, xlab: "x", yticks: nice(0, ymax, 3) });
      const bw = Math.max(1, (f.R - f.L) / (xs.length + 1) * 0.8);
      return f.open + f.axes + xs.map((x) => `<rect x="${f.x(x) - bw / 2}" y="${f.y(pm(x))}" width="${bw}" height="${f.B - f.y(pm(x))}" fill="${hit(x) ? "var(--c12)" : "#C9CEC4"}"/>`).join("") + f.close;
    }
    function curve(pdf, x0, x1, shade, label, extra = "") {
      const pts = []; let ym = 0; for (let i = 0; i <= 240; i++) { const x = x0 + (i / 240) * (x1 - x0), y = pdf(x); if (isFinite(y)) ym = Math.max(ym, y); pts.push([x, y]); }
      ym = Math.min(ym, 2.5) * 1.1; const f = G.frame({ W: 640, H: 220, x0, x1, y0: 0, y1: ym, yticks: [], label });
      const pth = pts.map(([x, y], i) => `${i ? "L" : "M"}${f.x(x).toFixed(1)},${f.y(Math.min(y, ym)).toFixed(1)}`).join("");
      const segs = []; let cur = null;
      pts.forEach((pt) => { if (shade(pt[0])) { if (!cur) segs.push((cur = [])); cur.push(pt); } else cur = null; });
      const area = segs.map((sh) => `<path d="M${f.x(sh[0][0])},${f.B} ${sh.map(([x, y]) => `L${f.x(x).toFixed(1)},${f.y(Math.min(y, ym)).toFixed(1)}`).join("")} L${f.x(sh[sh.length - 1][0])},${f.B} Z" fill="var(--c12)" opacity=".45"/>`).join("");
      return f.open + f.axes + area + `<path d="${pth}" fill="none" stroke="var(--ink)" stroke-width="2"/>` + (typeof extra === "function" ? extra(f) : extra) + f.close;
    }
    function draw() {
      const s = S(), vals = V[k]; let svg = "", ro = "", msg = "";
      if (k === "binom") {
        const n = Math.max(1, Math.round(vals.n)), p = Math.min(1, Math.max(0, vals.p)), x = Math.max(0, Math.round(vals.x));
        const lo = Math.max(0, Math.floor(n * p - 4.5 * Math.sqrt(n * p * (1 - p) + 0.25)) - 1), hi = Math.min(n, Math.ceil(n * p + 4.5 * Math.sqrt(n * p * (1 - p) + 0.25)) + 1);
        const xs = []; for (let i = Math.min(lo, x); i <= Math.max(hi, Math.min(x, n)); i++) xs.push(i);
        const hit = (i) => (mode === "eq" ? i === x : mode === "le" ? i <= x : i >= x);
        let pr = 0; for (let i = 0; i <= n; i++) if (hit(i)) pr += s.binompmf(i, n, p);
        svg = bars((i) => s.binompmf(i, n, p), xs, hit, "Binomial probabilities");
        ro = G.ro(mode === "eq" ? `P(X = ${x})` : mode === "le" ? `P(X ≤ ${x})` : `P(X ≥ ${x})`, pr < 1e-6 ? pr.toExponential(2) : fmt(pr, 4), "", true) + G.ro("Mean np", G.sig(n * p, 4)) + G.ro("SD √(np(1−p))", fmt(Math.sqrt(n * p * (1 - p)), 3));
        msg = `Spreadsheet: =BINOM.DIST(${x},${n},${p},${mode === "le" ? "TRUE" : "FALSE"}). Normal approximation OK only if np ≥ 10 and n(1 − p) ≥ 10 — here ${n * p >= 10 && n * (1 - p) >= 10 ? "it is" : "it isn't"}.`;
      } else if (k === "pois") {
        const l = Math.max(0.01, vals.l), x = Math.max(0, Math.round(vals.x)), hi = Math.ceil(l + 5 * Math.sqrt(l) + 2);
        const xs = []; for (let i = 0; i <= Math.max(hi, x); i++) xs.push(i);
        const hit = (i) => (mode === "eq" ? i === x : mode === "le" ? i <= x : i >= x);
        let pr = 0; for (let i = 0; i <= Math.max(hi, x) + 60; i++) if (hit(i)) pr += s.poispmf(i, l);
        svg = bars((i) => s.poispmf(i, l), xs, hit, "Poisson probabilities");
        ro = G.ro(mode === "eq" ? `P(X = ${x})` : mode === "le" ? `P(X ≤ ${x})` : `P(X ≥ ${x})`, fmt(pr, 4), "", true) + G.ro("Mean = variance", G.sig(l, 4), "λ") + G.ro("SD", fmt(Math.sqrt(l), 3), "√λ");
        msg = "Poisson counts defects (several per unit possible). Mean and variance are both λ.";
      } else if (k === "norm") {
        const mu = vals.mu, sd = Math.max(1e-9, vals.sd), a = Math.min(vals.a, vals.b), b = Math.max(vals.a, vals.b);
        const za = (a - mu) / sd, zb = (b - mu) / sd, pr = s.ncdf(zb) - s.ncdf(za);
        svg = curve((x) => s.npdf((x - mu) / sd) / sd, mu - 4 * sd, mu + 4 * sd, (x) => x >= a && x <= b, "Normal curve");
        ro = G.ro(`P(${G.sig(a, 4)} < X < ${G.sig(b, 4)})`, fmt(pr, 4), "", true) + G.ro("Z at a", fmt(za, 2), "(a − μ)/σ") + G.ro("Z at b", fmt(zb, 2), "(b − μ)/σ");
        msg = `Area = Φ(${fmt(zb, 2)}) − Φ(${fmt(za, 2)}). The total area under the curve is 1.`;
      } else if (k === "t") {
        const df = Math.max(1, Math.round(vals.df)), al = Math.min(0.5, Math.max(0.001, vals.al)), c2 = s.tinv(1 - al / 2, df), c1 = s.tinv(1 - al, df);
        svg = curve((x) => s.tpdf(x, df), -5, 5, (x) => Math.abs(x) >= c2, "t distribution vs normal", (f) => { const p = []; for (let i = 0; i <= 200; i++) { const x = -5 + i / 20; p.push(`${i ? "L" : "M"}${f.x(x).toFixed(1)},${f.y(s.npdf(x)).toFixed(1)}`); } return `<path d="${p.join("")}" fill="none" stroke="var(--c4)" stroke-width="1.5" stroke-dasharray="5 4"/><text x="${f.R - 4}" y="${f.T + 12}" text-anchor="end" font-size="11.5" fill="var(--c4)">- - normal</text>`; });
        ro = G.ro("Two-sided critical ±t", fmt(c2, 3), `α/2 = ${al / 2} in each tail`, true) + G.ro("One-sided critical t", fmt(c1, 3), `α = ${al}`) + G.ro("Z for comparison", fmt(s.ninv(1 - al / 2), 3), "two-sided");
        msg = df >= 30 ? "With 30 or more df, t is nearly the normal curve." : "Small df: heavier tails, so the critical value is larger than Z — you need more evidence.";
      } else if (k === "chi") {
        const df = Math.max(1, Math.round(vals.df)), al = Math.min(0.5, Math.max(0.001, vals.al)), c = s.chi2inv(1 - al, df), x1 = Math.max(c * 1.3, df + 5 * Math.sqrt(2 * df));
        svg = curve((x) => s.chi2pdf(x, df), 0.001, x1, (x) => x >= c, "Chi-square distribution");
        ro = G.ro(`χ²(${al}, df ${df})`, fmt(c, 3), "right-tail critical value", true) + G.ro("Mean", df, "= df") + G.ro("Shape", "skewed right", "never negative");
        msg = "One chi-square curve per df; it approaches normal as df grows. For a single variance, df = n − 1.";
      } else {
        const d1 = Math.max(1, Math.round(vals.d1)), d2 = Math.max(1, Math.round(vals.d2)), al = Math.min(0.5, Math.max(0.001, vals.al)), c = s.finv(1 - al, d1, d2), lower = 1 / s.finv(1 - al, d2, d1);
        svg = curve((x) => s.fpdf(x, d1, d2), 0.005, Math.max(5, c * 1.3), (x) => x >= c, "F distribution");
        ro = G.ro(`F(${al}; ${d1}, ${d2})`, fmt(c, 3), "right-tail critical value", true) + G.ro(`Lower tail F(${1 - al}; ${d1}, ${d2})`, fmt(lower, 3), `= 1 ÷ F(${al}; ${d2}, ${d1})`);
        msg = `F is a ratio of two variances (each chi-square ÷ its df). Swapping the df gives the reciprocal: F(${G.num(1 - al, 2)}; ${d2}, ${d1}) = 1 ÷ ${fmt(c, 2)} = ${fmt(1 / c, 3)}. (Handbook: F(0.95; 6, 4) = 1 ÷ 4.53 = 0.22.)`;
      }
      $("[data-svg]", el).innerHTML = svg; $("[data-ro]", el).innerHTML = ro; $("[data-msg]", el).innerHTML = msg;
    }
    $$("[data-k]", el).forEach((b) => b.addEventListener("click", () => { k = b.dataset.k; if (k === "pois") mode = "le"; if (k === "binom") mode = "eq"; form(); draw(); }));
    form(); draw();
  };

  C("distpick", {
    title: "Which distribution?", select: true,
    hint: "Match the situation or the property to the distribution (Chapter 12, Table 12.1).",
    cats: ["Normal", "Binomial", "Poisson", "Chi-square", "Student's t", "F"],
    items: [
      { t: "Number of defective units in a sample of 50 (each unit good or bad)", a: 1, why: "Two outcomes per unit, fixed n." },
      { t: "Number of paint defects on a car door (several possible per unit)", a: 2, why: "Defects per unit — Poisson." },
      { t: "Shaft diameters measured to 0.001 mm", a: 0, why: "Continuous measurement." },
      { t: "Its mean and variance are equal", a: 2, why: "Poisson: both equal λ." },
      { t: "Testing a mean when σ is unknown and n is small", a: 4, why: "t, with n − 1 df." },
      { t: "Bell-shaped but with heavier tails than the normal; approaches it as df grows", a: 4, why: "Student's t." },
      { t: "Comparing two variances, or the F-test in ANOVA", a: 5, why: "F is a ratio of two variances." },
      { t: "Testing one variance; goodness of fit; contingency tables", a: 3, why: "Chi-square." },
      { t: "Never negative, skewed right, one curve per degree of freedom", a: [3, 5], why: "Both chi-square and F are nonnegative and right-skewed; chi-square has one df, F has two." },
      { t: "Defectives in a lot, used when n is less than 10% of N", a: 1, why: "The handbook's condition for the binomial (N > 50, n < 0.1N)." }
    ]
  });

  /* =================== Chapter 13 =================== */
  C("scales", {
    title: "Nominal, ordinal, interval or ratio?",
    hint: "Table 13.1. Each scale allows the operations of the ones before it, plus its own.",
    cats: ["Nominal", "Ordinal", "Interval", "Ratio"],
    items: [
      { t: "Color-coded wires in a cable", a: 0, why: "Names only — no order. Count, mode, chi-square." },
      { t: "Defect criticality: critical, major, minor", a: 1, why: "Ordered, but gaps between levels are unknown. Median, sign test." },
      { t: "Temperature in °C", a: 2, why: "Equal intervals, no true zero — 40 °C isn't twice as hot as 20 °C." },
      { t: "Weight in kilograms", a: 3, why: "True zero, so ratios mean something." },
      { t: "Customer satisfaction rating from 1 to 5", a: 1, why: "Ordinal — a 4 isn't twice a 2." },
      { t: "Part number or supplier name", a: 0, why: "Labels." },
      { t: "Cycle time in seconds", a: 3, why: "Ratio — 60 s is twice 30 s. Geometric mean and coefficient of variation allowed." },
      { t: "Calendar year", a: 2, why: "Equal intervals but an arbitrary zero." }
    ]
  });

  C("contdisc", {
    title: "Continuous, discrete, or locational?",
    hint: "Continuous data come from measuring; discrete (attribute) data from counting; locational data say where.",
    cats: ["Continuous (variables)", "Discrete (attributes)", "Locational"],
    items: [
      { t: "Bore diameter, 1.5372 in", a: 0, why: "Infinitely many values between any two." },
      { t: "Number of valves that leaked", a: 1, why: "A count." },
      { t: "Bubbles per square foot of float glass", a: 1, why: "A count per area." },
      { t: "Where on the car body each paint defect appears", a: 2, why: "Location — shown on a measles chart." },
      { t: "Call handle time in seconds", a: 0, why: "Measured." },
      { t: "Pass / fail on a go/no-go gauge", a: 1, why: "Attribute." }
    ]
  });

  C("sampling", {
    title: "Which sampling method?",
    hint: "Random needs a homogeneous lot; stratify a mixed one; sequential for costly or destructive tests; systematic takes every nth item (Chapters 13 and 15).",
    cats: ["Random", "Stratified", "Sequential", "Systematic"],
    items: [
      { t: "A lot mixes parts from three machines; sample each machine's parts separately at random", a: 1, why: "Not homogeneous — stratify by machine, then sample randomly within each group." },
      { t: "Destructive reliability tests run one unit at a time until a decision is reached", a: 2, why: "Sequential sampling." },
      { t: "Every unit in a homogeneous batch has an equal chance of selection", a: 0, why: "Random." },
      { t: "Take every 20th part off the conveyor", a: 3, why: "Systematic — common for individuals charts." },
      { t: "Survey every 50th customer at a bank", a: 3, why: "Systematic." },
      { t: "Calls sampled separately from day shift and night shift", a: 1, why: "Stratified." }
    ]
  });

  /* Descriptive statistics workbench */
  G.W.desc = (el) => {
    const P = {
      crit: ["Critical dimensions (15)", "5.551, 5.361, 5.392, 5.479, 5.456, 5.542, 5.423, 5.476, 5.298, 5.499, 5.312, 5.319, 5.317, 5.314, 5.382", "hist"],
      bond9: ["Bond strength (9) — box plot example", "8.250, 8.085, 8.795, 9.565, 11.880, 9.180, 9.950, 9.630, 8.150", "box"],
      chem: ["Chemical weights (20) — stem-and-leaf", "10.3, 11.4, 10.9, 9.7, 10.4, 10.6, 10.0, 10.8, 11.1, 11.9, 10.9, 10.8, 11.7, 12.3, 10.6, 12.2, 11.6, 11.2, 10.7, 11.4", "stem"],
      bond19: ["Bond strength (19) — normal plot, spec 9 to 11", "8.250, 8.085, 8.795, 9.565, 11.880, 9.180, 9.950, 9.630, 8.150, 10.800, 10.800, 11.080, 10.730, 10.520, 10.380, 10.535, 9.600, 10.340, 10.410", "norm"]
    };
    let key = "crit", view = "hist", lsl = "", usl = "";
    el.innerHTML = `<h4>Descriptive statistics and graphs</h4>
      <p class="hint">Paste any numbers (commas, spaces or new lines). Presets are the handbook's data sets.</p>
      <div class="row" style="gap:.4rem;margin-bottom:.5rem">${Object.entries(P).map(([k, p]) => `<button type="button" class="btn sm" data-p="${k}">${p[0]}</button>`).join("")}</div>
      <label class="field">Data<textarea rows="3" data-x style="width:100%;padding:.5rem;border:1.5px solid var(--rule);border-radius:6px"></textarea></label>
      <div class="row" style="margin:.6rem 0"><span class="seg" role="group" aria-label="Graph">${[["hist", "Histogram"], ["box", "Box plot"], ["stem", "Stem-and-leaf"], ["norm", "Normal probability plot"]].map(([v, l]) => `<button type="button" data-v="${v}">${l}</button>`).join("")}</span>
      <label class="field" style="width:6rem">LSL<input type="number" step="any" data-l></label><label class="field" style="width:6rem">USL<input type="number" step="any" data-u></label></div>
      <div class="readout" data-ro></div><div data-svg style="margin-top:.6rem"></div><div data-extra></div><p class="small" data-msg aria-live="polite"></p>`;
    const data = () => S().parse($("[data-x]", el).value);
    function histogram(x) {
      const s = S(), n = x.length, mn = Math.min(...x), mx = Math.max(...x), k = Math.max(5, Math.min(12, Math.round(Math.sqrt(n)) + 1));
      const w0 = (mx - mn) / k || 1, mag = Math.pow(10, Math.floor(Math.log10(w0))), w = [1, 2, 2.5, 5, 10].map((c) => c * mag).reduce((a, b) => (Math.abs(b - w0) < Math.abs(a - w0) ? b : a)), start = Math.floor(mn / w + 1e-9) * w;
      const bins = []; for (let a = start; a <= mx + 1e-12; a += w) bins.push([a, a + w, 0]);
      x.forEach((v) => { const i = Math.min(bins.length - 1, Math.floor((v - start) / w + 1e-9)); bins[i][2]++; });
      const ym = Math.max(...bins.map((b) => b[2])) + 1, f = G.frame({ W: 640, H: 230, x0: start, x1: start + bins.length * w, y0: 0, y1: ym, yticks: nice(0, ym, 4).filter((t) => Number.isInteger(t)), label: "Histogram", ylab: "Frequency" });
      let cum = 0;
      const tbl = `<div class="tbl-wrap" style="margin-top:.6rem"><table class="tbl"><thead><tr><th scope="col">Class</th><th scope="col" class="num">Frequency</th><th scope="col" class="num">Cumulative</th><th scope="col" class="num">Cumulative %</th></tr></thead><tbody>${bins.map((b) => { cum += b[2]; return `<tr><td>${G.sig(b[0], 5)} to &lt; ${G.sig(b[1], 5)}</td><td class="num">${b[2]}</td><td class="num">${cum}</td><td class="num">${G.num((cum / n) * 100, 1)}%</td></tr>`; }).join("")}</tbody></table></div>`;
      return [f.open + f.axes + bins.map((b) => `<rect x="${f.x(b[0]) + 1}" y="${f.y(b[2])}" width="${Math.max(0, f.x(b[1]) - f.x(b[0]) - 2)}" height="${f.B - f.y(b[2])}" fill="var(--c13)" opacity=".85"/>`).join("") + specs(f) + f.close, tbl];
    }
    function specs(f) {
      return [["LSL", lsl], ["USL", usl]].filter(([, v]) => v !== "" && isFinite(+v) && +v >= f.x0 - 1e9).map(([l, v]) => { const xx = f.x(+v); return xx >= f.L - 1 && xx <= f.R + 1 ? `<line x1="${xx}" x2="${xx}" y1="${f.T + 14}" y2="${f.B}" stroke="var(--ooc)" stroke-width="2" stroke-dasharray="5 4"/><text x="${xx}" y="${f.T + 8}" text-anchor="middle" font-size="11" fill="var(--ooc)" font-weight="700">${l}</text>` : ""; }).join("");
    }
    function boxplot(x) {
      const s = S(), q1 = s.qmt(x, 0.25), q3 = s.qmt(x, 0.75), md = s.median(x), iqr = q3 - q1, lo = q1 - 1.5 * iqr, hi = q3 + 1.5 * iqr;
      const inner = x.filter((v) => v >= lo && v <= hi), wl = Math.min(...inner), wh = Math.max(...inner), out = x.filter((v) => v < lo || v > hi);
      const mn = Math.min(...x, lo), mx = Math.max(...x, hi), f = G.frame({ W: 640, H: 150, x0: mn - (mx - mn) * 0.05, x1: mx + (mx - mn) * 0.05, y0: 0, y1: 1, yticks: [], label: "Box plot", B: 34 });
      const y0 = 40, y1 = 96;
      return f.open + f.axes + `<line x1="${f.x(lo)}" x2="${f.x(lo)}" y1="${y0 - 10}" y2="${y1 + 10}" stroke="var(--limit)" stroke-dasharray="3 3"/><line x1="${f.x(hi)}" x2="${f.x(hi)}" y1="${y0 - 10}" y2="${y1 + 10}" stroke="var(--limit)" stroke-dasharray="3 3"/>
        <text x="${f.x(hi)}" y="${y0 - 14}" text-anchor="middle" font-size="10.5" fill="var(--limit)">Q3 + 1.5·IQR</text><text x="${f.x(lo)}" y="${y0 - 14}" text-anchor="middle" font-size="10.5" fill="var(--limit)">Q1 − 1.5·IQR</text>
        <line x1="${f.x(wl)}" x2="${f.x(q1)}" y1="${(y0 + y1) / 2}" y2="${(y0 + y1) / 2}" stroke="var(--ink)" stroke-width="2"/><line x1="${f.x(q3)}" x2="${f.x(wh)}" y1="${(y0 + y1) / 2}" y2="${(y0 + y1) / 2}" stroke="var(--ink)" stroke-width="2"/>
        <line x1="${f.x(wl)}" x2="${f.x(wl)}" y1="${y0 + 14}" y2="${y1 - 14}" stroke="var(--ink)" stroke-width="2"/><line x1="${f.x(wh)}" x2="${f.x(wh)}" y1="${y0 + 14}" y2="${y1 - 14}" stroke="var(--ink)" stroke-width="2"/>
        <rect x="${f.x(q1)}" y="${y0}" width="${f.x(q3) - f.x(q1)}" height="${y1 - y0}" fill="var(--c13)" fill-opacity=".3" stroke="var(--ink)" stroke-width="2"/>
        <line x1="${f.x(md)}" x2="${f.x(md)}" y1="${y0}" y2="${y1}" stroke="var(--ink)" stroke-width="3"/>
        ${out.map((v) => `<text x="${f.x(v)}" y="${(y0 + y1) / 2 + 5}" text-anchor="middle" font-size="16" fill="var(--ooc)">*</text>`).join("")}` + f.close;
    }
    function stem(x) {
      const s = S().sorted(x), n = s.length, md = S().median(s), r = Math.max(...s) - Math.min(...s);
      const unit = r >= 20 ? 1 : r >= 2 ? 0.1 : r >= 0.2 ? 0.01 : 0.001, half = r / unit < 30;
      const rows = new Map(); s.forEach((v) => { const t = Math.round(v / unit), st = Math.floor(t / 10), lf = t - st * 10, key = half ? st + (lf >= 5 ? 0.5 : 0) : st; if (!rows.has(key)) rows.set(key, { st, leaves: [] }); rows.get(key).leaves.push(lf); });
      const keys = [...rows.keys()].sort((a, b) => a - b); let cum = 0;
      const counts = keys.map((k) => rows.get(k).leaves.length), out = [];
      keys.forEach((kk, i) => { const row = rows.get(kk), lo = row.leaves.length, below = counts.slice(i + 1).reduce((a, b) => a + b, 0), above = cum; cum += lo;
        const hasMed = (Math.round(md / unit) >= Math.min(...row.leaves.map((l) => row.st * 10 + l))) && (Math.round(md / unit) <= Math.max(...row.leaves.map((l) => row.st * 10 + l)));
        const c = hasMed && above < n / 2 && above + lo >= n / 2 ? `(${lo})` : above + lo <= n / 2 ? above + lo : below + lo;
        out.push(`<tr><td class="num">${c}</td><td class="num"><b>${G.num(row.st * unit * 10, unit >= 1 ? 0 : Math.max(0, -Math.log10(unit * 10)))}</b></td><td style="font-family:ui-monospace,monospace;letter-spacing:.2em">${row.leaves.join("")}</td></tr>`); });
      return `<p class="small soft">Leaf unit = ${unit}. The row holding the median shows its count in parentheses; other counts are cumulative toward that row.</p><div class="tbl-wrap"><table class="tbl" style="max-width:24rem"><thead><tr><th scope="col" class="num">Count</th><th scope="col" class="num">Stem</th><th scope="col">Leaves</th></tr></thead><tbody>${out.join("")}</tbody></table></div>`;
    }
    function normplot(x) {
      const s = S(), srt = s.sorted(x), n = srt.length, m = s.mean(x), sd = s.sd(x), ad = s.adNormal(x);
      const pts = srt.map((v, i) => [v, s.ninv((i + 1 - 0.3) / (n + 0.4))]);
      const mn = Math.min(srt[0], m - 3 * sd), mx = Math.max(srt[n - 1], m + 3 * sd), pr = [1, 5, 10, 20, 30, 50, 70, 80, 90, 95, 99];
      const f = G.frame({ W: 640, H: 260, x0: mn, x1: mx, y0: -2.6, y1: 2.6, yticks: pr.map((p) => s.ninv(p / 100)), yf: (z) => Math.round(G.Phi(z) * 100) + "", label: "Normal probability plot", ylab: "Percent" });
      return [f.open + f.axes + `<line x1="${f.x(m - 2.6 * sd)}" y1="${f.y(-2.6)}" x2="${f.x(m + 2.6 * sd)}" y2="${f.y(2.6)}" stroke="var(--c4)" stroke-width="2"/>` + pts.map(([v, z]) => `<circle cx="${f.x(v)}" cy="${f.y(z)}" r="4" fill="var(--c13)" stroke="#fff"/>`).join("") + specs(f) + f.close, ad];
    }
    function draw() {
      const x = data(), s = S();
      $$("[data-v]", el).forEach((b) => b.setAttribute("aria-pressed", b.dataset.v === view));
      if (x.length < 3) { $("[data-ro]", el).innerHTML = ""; $("[data-svg]", el).innerHTML = ""; $("[data-extra]", el).innerHTML = ""; $("[data-msg]", el).textContent = "Enter at least three numbers."; return; }
      const n = x.length, m = s.mean(x), md = s.median(x), mo = s.mode(x), sd = s.sd(x), sp = s.sdp(x), q1 = s.qmt(x, 0.25), q3 = s.qmt(x, 0.75), [h1, h3] = s.hinges(x);
      const dp = Math.min(4, Math.max(2, ...x.map((v) => (String(v).split(".")[1] || "").length)));
      $("[data-ro]", el).innerHTML = G.ro("n", n) + G.ro("Mean", G.num(m, dp + 1), "Σx ÷ n", true) + G.ro("Median", G.num(md, dp), "middle value") + G.ro("Mode", mo.length ? mo.slice(0, 3).map((v) => G.sig(v, 6)).join(", ") + (mo.length > 3 ? ` +${mo.length - 3}` : "") : "none", mo.length > 1 ? `${mo.length} values tie` : "most frequent")
        + G.ro("Range", G.num(Math.max(...x) - Math.min(...x), dp), "max − min") + G.ro("s (sample)", G.num(sd, dp + 1), "divide by n − 1", true) + G.ro("σ (population formula)", G.num(sp, dp + 1), "divide by N") + G.ro("Q1, Q3", `${G.num(q1, dp + 1)}, ${G.num(q3, dp + 1)}`, `IQR ${G.num(q3 - q1, dp + 1)}`);
      let svg = "", extra = "", msg = "";
      if (view === "hist") { [svg, extra] = histogram(x); msg = "Spread, shape and center — the three things a histogram shows that a list of numbers hides."; }
      else if (view === "box") { svg = boxplot(x); const iqr = q3 - q1, out = x.filter((v) => v < q1 - 1.5 * iqr || v > q3 + 1.5 * iqr); msg = `Quartiles here use the (n + 1)p position, as Minitab does — this reproduces the handbook's Q1 = 8.20 and Q3 = 9.79 for the 9-point bond data. Tukey's hinges (median included in each half) give ${G.num(h1, dp + 1)} and ${G.num(h3, dp + 1)}. ${out.length ? `Outliers beyond 1.5 × IQR: ${out.join(", ")}.` : "No points lie beyond 1.5 × IQR, so nothing is flagged as an outlier."}`; }
      else if (view === "stem") { extra = stem(x); msg = "A stem-and-leaf plot keeps every value, so you can read the median and spot repeated digits."; }
      else { const [sv, ad] = normplot(x); svg = sv; let tail = ""; if (lsl !== "" && usl !== "") { tail = ` If normal, about ${G.num(G.Phi((+lsl - m) / sd) * 100, 1)}% falls below the LSL and ${G.num(G.upperTail((+usl - m) / sd) * 100, 1)}% above the USL.`; }
        extra = `<div class="readout" style="margin-top:.6rem">${G.ro("Anderson-Darling A²", G.num(ad.A2, 3)) + G.ro("p-value", s.fmtP(ad.p), ad.p > 0.05 ? "> 0.05: no evidence against normality" : "≤ 0.05: data look non-normal", true)}</div>`;
        msg = `Points close to the straight line suggest normal data; a smaller AD statistic (larger p) means a better fit.${tail}`; }
      $("[data-svg]", el).innerHTML = svg; $("[data-extra]", el).innerHTML = extra; $("[data-msg]", el).innerHTML = msg;
    }
    const load = (k) => { key = k; const p = P[k]; $("[data-x]", el).value = p[1]; view = p[2]; lsl = k === "bond19" ? "9" : ""; usl = k === "bond19" ? "11" : ""; $("[data-l]", el).value = lsl; $("[data-u]", el).value = usl; draw(); };
    $("[data-x]", el).addEventListener("input", draw);
    $("[data-l]", el).addEventListener("input", (e) => { lsl = e.target.value; draw(); });
    $("[data-u]", el).addEventListener("input", (e) => { usl = e.target.value; draw(); });
    $$("[data-v]", el).forEach((b) => b.addEventListener("click", () => { view = b.dataset.v; draw(); }));
    $$("[data-p]", el).forEach((b) => b.addEventListener("click", () => load(b.dataset.p)));
    load("crit");
  };

  /* Run chart tests */
  G.W.runchart = (el) => {
    const N = 40;
    const GEN = {
      random: ["Random", (r) => Array.from({ length: N }, () => 10 + gauss(r)), [1, 2, 3, 4, 5, 6]],
      cluster: ["Clustering", (r) => { const o = []; let lvl = 10; for (let i = 0; i < N; i++) { if (i % 8 === 0) lvl = 10 + (r() < 0.5 ? -1.3 : 1.3); o.push(lvl + 0.45 * gauss(r)); } return o; }, [3, 6, 7, 8, 9, 10]],
      mixture: ["Mixture", (r) => { const o = []; let side = 1; for (let i = 0; i < N; i++) { if (r() < 0.8) side = -side; o.push(10 + 1.6 * side + 0.45 * gauss(r)); } return o; }, [1, 2, 3, 8, 9, 12]],
      trend: ["Trend", (r) => Array.from({ length: N }, (_, i) => 8 + 0.1 * i + 0.06 * gauss(r)), [1, 2, 3, 4, 5, 6]],
      osc: ["Oscillation", (r) => Array.from({ length: N }, (_, i) => 10 + (i % 2 ? 0.7 : -0.7) + gauss(r)), [1, 2, 5, 14, 15, 16]]
    };
    let key = "random", si = 0;
    el.innerHTML = `<h4><span>Run chart: reading the run tests</span><span class="seg" role="group" aria-label="Pattern">${Object.entries(GEN).map(([k, g]) => `<button type="button" data-k="${k}" aria-pressed="${k === key}">${g[0]}</button>`).join("")}</span></h4>
      <p class="hint">Runs about the median: too <b>few</b> → clustering; too <b>many</b> → mixture. Runs up or down: too few → trend; too many → oscillation. p &lt; 0.05 flags the pattern.</p>
      <div data-svg></div><div class="readout" data-ro></div><p class="small" data-msg aria-live="polite"></p>
      <div class="row"><button type="button" class="btn sm" data-s>New random data</button></div>`;
    function tests(x) {
      const n = x.length, md = S().median(x), sgn = x.map((v) => (v > md ? 1 : v < md ? -1 : 0)).filter((v) => v !== 0);
      const n1 = sgn.filter((v) => v > 0).length, n2 = sgn.length - n1, m = sgn.length;
      let runs = 1; for (let i = 1; i < m; i++) if (sgn[i] !== sgn[i - 1]) runs++;
      const er = 1 + (2 * n1 * n2) / m, vr = (2 * n1 * n2 * (2 * n1 * n2 - m)) / (m * m * (m - 1)), z = (runs - er) / Math.sqrt(vr);
      const d = []; for (let i = 1; i < n; i++) if (x[i] !== x[i - 1]) d.push(x[i] > x[i - 1] ? 1 : -1);
      let ud = 1; for (let i = 1; i < d.length; i++) if (d[i] !== d[i - 1]) ud++;
      const eu = (2 * n - 1) / 3, vu = (16 * n - 29) / 90, zu = (ud - eu) / Math.sqrt(vu);
      return { md, runs, er, pClu: G.Phi(z), pMix: G.upperTail(z), ud, eu, pTr: G.Phi(zu), pOsc: G.upperTail(zu) };
    }
    function draw() {
      const x = GEN[key][1](rng(GEN[key][2][si % GEN[key][2].length])), t = tests(x);
      const mn = Math.min(...x), mx = Math.max(...x), f = G.frame({ W: 640, H: 220, x0: 0.5, x1: N + 0.5, y0: mn - 0.4, y1: mx + 0.4, xticks: [1, 10, 20, 30, 40], label: "Run chart", xlab: "Observation" });
      $("[data-svg]", el).innerHTML = f.open + f.axes + `<line x1="${f.L}" x2="${f.R}" y1="${f.y(t.md)}" y2="${f.y(t.md)}" stroke="var(--c13)" stroke-width="2"/><text x="${f.L + 4}" y="${f.T + 10}" font-size="11" fill="var(--c13)">— median ${G.sig(t.md, 4)}</text>
        <path d="${x.map((v, i) => `${i ? "L" : "M"}${f.x(i + 1).toFixed(1)},${f.y(v).toFixed(1)}`).join("")}" fill="none" stroke="var(--ink-soft)" stroke-width="1.5"/>${x.map((v, i) => `<circle cx="${f.x(i + 1)}" cy="${f.y(v)}" r="3.5" fill="var(--ink)"/>`).join("")}` + f.close;
      const flag = (p) => (p < 0.05 ? `<b style="color:var(--ooc)">p = ${G.num(p, 3)}</b>` : `p = ${G.num(p, 3)}`);
      $("[data-ro]", el).innerHTML = G.ro("Runs about median", `${t.runs} vs ${G.num(t.er, 1)}`, "observed vs expected") + G.ro("Clustering", flag(t.pClu), "too few runs") + G.ro("Mixtures", flag(t.pMix), "too many runs")
        + G.ro("Runs up or down", `${t.ud} vs ${G.num(t.eu, 1)}`, "observed vs expected") + G.ro("Trends", flag(t.pTr), "too few runs") + G.ro("Oscillation", flag(t.pOsc), "too many runs");
      const hits = [["clustering", t.pClu], ["mixtures", t.pMix], ["trends", t.pTr], ["oscillation", t.pOsc]].filter((h) => h[1] < 0.05).map((h) => h[0]);
      $("[data-msg]", el).innerHTML = (hits.length ? `Significant: <b>${hits.join(", ")}</b> — a nonrandom pattern that points to special causes.` : "No run test is significant: the pattern is consistent with common-cause variation. (A run chart has no control limits — it only tests patterns.)")
        + (key === "trend" ? " A steady trend also leaves very few runs about the median, so clustering flags too." : "");
    }
    $$("[data-k]", el).forEach((b) => b.addEventListener("click", () => { key = b.dataset.k; si = 0; $$("[data-k]", el).forEach((x) => x.setAttribute("aria-pressed", x === b)); draw(); }));
    $("[data-s]", el).addEventListener("click", () => { si++; draw(); });
    draw();
  };

  C("graphpick", {
    title: "Which graph answers the question?",
    hint: "Table 13.4. Each graph is built to show one thing well.",
    cats: ["Histogram", "Box plot", "Stem-and-leaf", "Scatter diagram", "Run chart", "Normal probability plot"],
    select: true,
    items: [
      { t: "Compare the median and spread of yield across three process settings", a: 1, why: "Side-by-side box plots (Figure 13.8)." },
      { t: "Does surface finish rise with coolant temperature?", a: 3, why: "Two variables — scatter diagram." },
      { t: "Do these 19 bond-strength values come from a normal population?", a: 5, why: "Points on a straight line suggest normality; check the AD p-value." },
      { t: "Is there a trend or oscillation in readings over time?", a: 4, why: "Run chart, in time order, with run tests." },
      { t: "See the shape and spread while keeping every original value", a: 2, why: "Stem-and-leaf." },
      { t: "Show the shape of 200 measurements — bimodal or skewed?", a: 0, why: "Histogram (frequency distribution)." }
    ]
  });
})();
