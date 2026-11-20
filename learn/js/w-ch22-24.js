/* Widgets: Chapters 22 (SPC), 23 (sustain improvements), 24 (TPM and visual factory) */
(function () {
  "use strict";
  const { $, $$, esc } = G;

  /* ---------- shared: control chart constants (AIAG / ASTM values) ---------- */
  const K = {
    2: { A2: 1.880, A3: 2.659, d2: 1.128, D3: 0, D4: 3.267, B3: 0, B4: 3.267, Am: 1.880 },
    3: { A2: 1.023, A3: 1.954, d2: 1.693, D3: 0, D4: 2.574, B3: 0, B4: 2.568, Am: 1.187 },
    4: { A2: 0.729, A3: 1.628, d2: 2.059, D3: 0, D4: 2.282, B3: 0, B4: 2.266, Am: 0.796 },
    5: { A2: 0.577, A3: 1.427, d2: 2.326, D3: 0, D4: 2.114, B3: 0, B4: 2.089, Am: 0.691 },
    6: { A2: 0.483, A3: 1.287, d2: 2.534, D3: 0, D4: 2.004, B3: 0.030, B4: 1.970, Am: 0.548 },
    7: { A2: 0.419, A3: 1.182, d2: 2.704, D3: 0.076, D4: 1.924, B3: 0.118, B4: 1.882, Am: 0.508 },
    8: { A2: 0.373, A3: 1.099, d2: 2.847, D3: 0.136, D4: 1.864, B3: 0.185, B4: 1.815, Am: 0.433 },
    9: { A2: 0.337, A3: 1.032, d2: 2.970, D3: 0.184, D4: 1.816, B3: 0.239, B4: 1.761, Am: 0.412 },
    10: { A2: 0.308, A3: 0.975, d2: 3.078, D3: 0.223, D4: 1.777, B3: 0.284, B4: 1.716, Am: 0.362 }
  };
  G.SPC_K = K;

  /* seeded random numbers so demos are repeatable */
  const rng = (seed) => () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const normal = (r) => () => { let u = 0, v = 0; while (u === 0) u = r(); while (v === 0) v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };

  /* shared: control chart SVG */
  G.ctrlSVG = (o) => {
    const n = o.y.length, W = 600, H = o.h || 210, L = 58, R = W - 70, T = 14, B = H - 24;
    const arr = (v) => (Array.isArray(v) ? v : Array(n).fill(v));
    const U = arr(o.ucl), Lw = arr(o.lcl);
    const vals = [...o.y, ...U.filter(isFinite), ...Lw.filter(isFinite), o.cl];
    let lo = Math.min(...vals), hi = Math.max(...vals); const pad = (hi - lo) * 0.12 || 1; lo -= pad; hi += pad;
    const x = (i) => L + (n === 1 ? (R - L) / 2 : (i * (R - L)) / (n - 1)), y = (v) => T + (1 - (v - lo) / (hi - lo)) * (B - T);
    const step = (a) => a.map((v, i) => { const x0 = i === 0 ? x(0) : (x(i - 1) + x(i)) / 2, x1 = i === n - 1 ? x(n - 1) : (x(i) + x(i + 1)) / 2; return `M${x0} ${y(v)} H${x1}`; }).join(" ");
    const flags = o.flags || [];
    const f = o.fmt || ((v) => G.num(v, 3));
    const zone = o.sigma ? [1, 2].map((z) => `<rect x="${L}" y="${y(o.cl + z * o.sigma)}" width="${R - L}" height="${y(o.cl - z * o.sigma) - y(o.cl + z * o.sigma)}" fill="var(--acc)" opacity="${z === 1 ? 0.1 : 0.05}"/>`).join("") : "";
    return `<div class="vizscroll"><svg class="viz ctrl" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(o.title || "Control chart")}: ${flags.filter(Boolean).length} flagged points">
      ${o.title ? `<text x="${L}" y="11" font-size="12" font-weight="700">${esc(o.title)}</text>` : ""}
      ${zone}
      ${U.some(isFinite) ? `<path d="${step(U.map((v) => (isFinite(v) ? v : hi)))}" stroke="var(--ooc)" stroke-width="1.6" stroke-dasharray="6 4" fill="none"/><text x="${R + 6}" y="${y(U[n - 1]) + 4}" font-size="11" style="fill:var(--ooc)">UCL ${f(U[n - 1])}</text>` : ""}
      ${Lw.some((v) => isFinite(v) && v > lo) ? `<path d="${step(Lw.map((v) => (isFinite(v) ? v : lo)))}" stroke="var(--ooc)" stroke-width="1.6" stroke-dasharray="6 4" fill="none"/><text x="${R + 6}" y="${y(Lw[n - 1]) + 4}" font-size="11" style="fill:var(--ooc)">LCL ${f(Lw[n - 1])}</text>` : ""}
      <line x1="${L}" x2="${R}" y1="${y(o.cl)}" y2="${y(o.cl)}" stroke="#18283A" stroke-width="1.6"/><text x="${R + 6}" y="${y(o.cl) + 4}" font-size="11">CL ${f(o.cl)}</text>
      ${[lo + pad, (lo + hi) / 2, hi - pad].map((v) => `<text x="${L - 6}" y="${y(v) + 4}" text-anchor="end" font-size="10.5" class="t-soft">${f(v)}</text>`).join("")}
      <polyline points="${o.y.map((v, i) => `${x(i)},${y(v)}`).join(" ")}" fill="none" stroke="var(--ink-soft)" stroke-width="1.4"/>
      ${o.y.map((v, i) => `<circle cx="${x(i)}" cy="${y(v)}" r="${flags[i] ? 6 : 4}" fill="${flags[i] ? "var(--ooc)" : "var(--acc)"}" stroke="#fff" stroke-width="1.5"/>${flags[i] ? `<circle cx="${x(i)}" cy="${y(v)}" r="10" fill="none" stroke="var(--ooc)" stroke-width="1.5"/>` : ""}`).join("")}
      ${o.y.map((_, i) => (n <= 15 || i % 5 === 4 ? `<text x="${x(i)}" y="${B + 16}" text-anchor="middle" font-size="10" class="t-soft">${i + 1}</text>` : "")).join("")}
    </svg></div>`;
  };

  /* shared: yes/no decision tree */
  G.tree = (el, N, start, title, hint) => {
    let path = [start];
    function draw() {
      const cur = path[path.length - 1], node = N[cur];
      el.innerHTML = `<h4>${title}</h4>${hint ? `<p class="hint">${hint}</p>` : ""}
        <ol class="steps-v">${path.filter((p) => N[p].q).map((p, i) => { const nx = path[i + 1]; const lab = nx ? N[p].opts.find((o) => o[1] === nx)[0] : ""; return `<li><p><b>${N[p].q}</b>${lab ? `<br><span class="soft">${lab}</span>` : ""}</p></li>`; }).join("")}</ol>
        ${node.q ? `<div class="row" style="margin:.8rem 0 0 2.6rem">${node.opts.map((o, i) => `<button type="button" class="btn" data-o="${i}">${o[0]}</button>`).join("")}</div>`
          : `<div class="ro key" style="margin-top:.9rem"><div class="k">Use</div><div class="v">${node.r}</div><p class="small" style="margin:.3rem 0 0">${node.d}</p></div>`}
        <div class="row" style="margin-top:.8rem">${path.length > 1 ? '<button type="button" class="btn sm" data-a="back">Back</button><button type="button" class="btn sm" data-a="restart">Start over</button>' : ""}</div>`;
      $$("[data-o]", el).forEach((b) => b.addEventListener("click", () => { path.push(node.opts[+b.dataset.o][1]); draw(); }));
      $$("[data-a]", el).forEach((b) => b.addEventListener("click", () => { if (b.dataset.a === "back") path.pop(); else path = [start]; draw(); }));
    }
    draw();
  };

  /* ---------- Ch22: which control chart? ---------- */
  G.W.chartpick = (el) => G.tree(el, {
    q1: { q: "Is the characteristic measured on a continuous scale, or counted?", opts: [["Measured (variables)", "q2"], ["Counted (attributes)", "q3"]] },
    q2: { q: "How many readings are in each subgroup?", opts: [["One at a time (n = 1)", "imr"], ["Small subgroups, about 2–9", "q2b"], ["Larger subgroups (about 10+) or software computes s", "xs"]] },
    q2b: { q: "Are outliers expected, or is the chart plotted by hand where the simplest arithmetic matters?", opts: [["No — the usual case", "xr"], ["Yes", "med"]] },
    q3: { q: "Are you counting defective units (each unit passes or fails) or defects (flaws, several possible per unit)?", opts: [["Defective units (binomial)", "q4"], ["Defects (Poisson)", "q5"]] },
    q4: { q: "Is the sample size the same every time?", opts: [["Yes, constant", "np"], ["No, it varies", "p"]] },
    q5: { q: "Is the area of opportunity (sample size) the same every time?", opts: [["Yes, constant", "c"], ["No, it varies", "u"]] },
    imr: { r: "Individuals and moving range (I-MR / XmR)", d: "Moving range = |xᵢ − xᵢ₋₁|, so each range compares two points: use n = 2 constants (E₂ = 2.660, D₄ = 3.267)." },
    xr: { r: "X̄ and R chart", d: "The most common chart. Subgroups of about 4–5 are typical; range is easy to compute and nearly as efficient as s for small n." },
    xs: { r: "X̄ and s chart", d: "Standard deviation uses every value in the subgroup, so it is the more precise indicator as subgroups grow." },
    med: { r: "Median chart", d: "Plot every reading, connect the subgroup medians, and use the special constant Ã₂. Trends in range are hard to see." },
    np: { r: "np chart", d: "Plots the number of defectives — simpler than p when n is constant (it can still be a p chart)." },
    p: { r: "p chart", d: "Plots the proportion defective. With varying n, limits use n̄; recalculate when a sample is more than 25% above or below n̄ (AIAG)." },
    c: { r: "c chart", d: "Plots the count of defects per sample when the inspection area is constant." },
    u: { r: "u chart", d: "Plots defects per unit when the number of units inspected varies." }
  }, "q1", "Which control chart?", "Answer two or three questions.");

  G.W.chartsort = (el) => G.classifier(el, {
    title: "Pick the chart for each situation", select: true,
    cats: ["X̄–R", "X̄–s", "I–MR", "Median", "p", "np", "c", "u"],
    items: [
      { t: "Shaft diameter measured on five consecutive parts every hour.", a: 0 },
      { t: "Twelve fill weights per subgroup, computed by the line's software.", a: 1 },
      { t: "One assay result per batch, one batch a day.", a: 2 },
      { t: "Three readings per subgroup, charted by hand at the machine, outliers expected.", a: 3 },
      { t: "Share of invoices paid late each week; invoice volume varies.", a: 4 },
      { t: "Number of bulbs that fail to light in each lot of 1,000.", a: 5 },
      { t: "Number of paint blemishes on each car door of the same size.", a: 6 },
      { t: "Defects per pane of glass, with a different number of panes inspected each day.", a: 7 }
    ]
  });

  /* ---------- Ch22: control limit calculator ---------- */
  const LIM = {
    xr: { n: "X̄–R", a: "7.125, 7.124, 7.126, 7.126, 7.127, 7.126, 7.124, 7.127, 7.128, 7.124", b: ".004, .005, .006, .003, .003, .003, .003, .002, .002, .006", ss: 4, la: "Subgroup averages", lb: "Subgroup ranges", src: "Handbook Fig. 22.9: groove ID, 7.125 ± .010, four parts per hour." },
    xs: { n: "X̄–s", a: "7.125, 7.124, 7.126, 7.126, 7.127, 7.126, 7.124, 7.127, 7.128, 7.124", b: ".002, .002, .003, .002, .002, .002, .002, .001, .001, .003", ss: 4, la: "Subgroup averages", lb: "Subgroup standard deviations", src: "Handbook Fig. 22.11: same parts, s instead of R." },
    imr: { n: "I–MR", a: "290, 288, 285, 290, 291, 287, 284, 290, 290, 288", la: "Individual values", src: "Handbook Fig. 22.12." },
    p: { n: "p", a: "14, 18, 13, 17, 15, 15, 16, 11, 14, 13, 14, 17", b: "125, 111, 133, 120, 118, 137, 108, 110, 124, 128, 144, 138", la: "Defectives", lb: "Sample sizes", src: "Handbook Fig. 22.14 (Rh-negative blood samples). Values read from the scanned figure and checked against the printed p̄ and limits." },
    np: { n: "np", a: "6, 9, 4, 7, 11, 5, 8, 6, 10, 7, 5, 9", ss: 200, la: "Defectives per sample", src: "Practice data (the scanned np figure is not reliably legible)." },
    c: { n: "c", a: "19, 12, 13, 12, 18, 19, 17, 20, 22, 18, 19, 17, 11", la: "Defects per sample", src: "Handbook Fig. 22.17 (pen imprint defects); total 217, c̄ = 16.7." },
    u: { n: "u", a: "4, 8, 3, 7, 5, 5, 6, 10, 4, 3, 4, 7", b: "125, 111, 133, 120, 118, 137, 108, 110, 124, 128, 144, 138", la: "Defects", lb: "Units inspected", src: "Handbook Fig. 22.16 (glass panes); total 66 defects in 1,496 panes." }
  };
  G.W.limits = (el) => {
    let t = "xr";
    const S = JSON.parse(JSON.stringify(LIM));
    const parse = (s) => (s || "").split(/[\s,;]+/).filter(Boolean).map(Number).filter((v) => isFinite(v));
    const mean = (a) => a.reduce((x, y) => x + y, 0) / a.length;
    function compute() {
      const s = S[t], A = parse(s.a), Bv = parse(s.b);
      const out = { charts: [], lines: [], ro: [] };
      if (t === "xr" || t === "xs") {
        const n = +s.ss, k = K[n], xbb = mean(A), sb = mean(Bv), isR = t === "xr";
        const Af = isR ? k.A2 : k.A3, Up = isR ? k.D4 : k.B4, Lo = isR ? k.D3 : k.B3, sym = isR ? "R̄" : "s̄";
        const ux = xbb + Af * sb, lx = xbb - Af * sb, ur = Up * sb, lr = Lo * sb;
        out.lines = [`X̿ = ${G.num(xbb, 4)}, ${sym} = ${G.num(sb, 4)}, n = ${n} → ${isR ? "A₂" : "A₃"} = ${Af}, ${isR ? "D₄" : "B₄"} = ${Up}, ${isR ? "D₃" : "B₃"} = ${Lo}`,
          `UCL<sub>X̄</sub> = ${G.num(xbb, 4)} + ${Af} × ${G.num(sb, 4)} = <b>${G.num(ux, 4)}</b>; LCL<sub>X̄</sub> = <b>${G.num(lx, 4)}</b>`,
          `UCL<sub>${isR ? "R" : "s"}</sub> = ${Up} × ${G.num(sb, 4)} = <b>${G.num(ur, 4)}</b>; LCL<sub>${isR ? "R" : "s"}</sub> = ${Lo} × ${G.num(sb, 4)} = <b>${G.num(lr, 4)}</b>${Lo === 0 ? " (no lower limit for this n)" : ""}`];
        out.charts.push({ title: "Averages (X̄)", y: A, cl: xbb, ucl: ux, lcl: lx, fmt: (v) => G.num(v, 4) });
        out.charts.push({ title: isR ? "Ranges (R)" : "Standard deviations (s)", y: Bv, cl: sb, ucl: ur, lcl: Lo ? lr : -Infinity, fmt: (v) => G.num(v, 4) });
      } else if (t === "imr") {
        const mr = A.slice(1).map((v, i) => Math.abs(v - A[i])), xb = mean(A), mrb = mean(mr);
        const ux = xb + 2.66 * mrb, lx = xb - 2.66 * mrb, um = 3.267 * mrb;
        out.lines = [`X̄ = ${G.num(xb, 3)}, MR̄ = ${G.num(mrb, 3)} (n = 2 for moving ranges: E₂ = 2.660, D₄ = 3.267)`,
          `UCL<sub>X</sub> = ${G.num(xb, 3)} + 2.660 × ${G.num(mrb, 3)} = <b>${G.num(ux, 2)}</b>; LCL<sub>X</sub> = <b>${G.num(lx, 2)}</b>`,
          `UCL<sub>MR</sub> = 3.267 × ${G.num(mrb, 3)} = <b>${G.num(um, 3)}</b>; LCL<sub>MR</sub> = 0`];
        out.charts.push({ title: "Individuals (X)", y: A, cl: xb, ucl: ux, lcl: lx, fmt: (v) => G.num(v, 1) });
        out.charts.push({ title: "Moving range (MR)", y: [NaN, ...mr].slice(1), cl: mrb, ucl: um, lcl: -Infinity, fmt: (v) => G.num(v, 2) });
      } else if (t === "p" || t === "u") {
        const d = A, ns = Bv.slice(0, d.length), nb = mean(ns), cbar = d.reduce((a, b) => a + b, 0) / ns.reduce((a, b) => a + b, 0);
        const sd = t === "p" ? Math.sqrt((cbar * (1 - cbar)) / nb) : Math.sqrt(cbar / nb), u = cbar + 3 * sd, l = cbar - 3 * sd;
        const big = ns.map((n) => Math.abs(n - nb) / nb > 0.25);
        out.lines = [`${t === "p" ? "p̄" : "ū"} = Σ${t === "p" ? "defectives" : "defects"} ÷ Σn = ${d.reduce((a, b) => a + b, 0)} ÷ ${ns.reduce((a, b) => a + b, 0)} = ${G.num(cbar, 4)}; n̄ = ${G.num(nb, 1)}`,
          t === "p" ? `UCL = p̄ + 3√(p̄(1 − p̄) ÷ n̄) = ${G.num(cbar, 4)} + 3 × ${G.num(sd, 4)} = <b>${G.num(u, 4)}</b>` : `UCL = ū + 3√(ū ÷ n̄) = ${G.num(cbar, 4)} + 3 × ${G.num(sd, 4)} = <b>${G.num(u, 4)}</b>`,
          `LCL = ${G.num(l, 4)}${l < 0 ? " → negative, so no LCL" : ""}`,
          big.some(Boolean) ? `Samples ${big.map((b, i) => (b ? i + 1 : null)).filter(Boolean).join(", ")} differ from n̄ by more than 25% — AIAG says recalculate their limits.` : "Every sample is within ±25% of n̄, so the average-n limits are acceptable (AIAG)."];
        out.charts.push({ title: t === "p" ? "Proportion defective (p)" : "Defects per unit (u)", y: d.map((v, i) => v / ns[i]), cl: cbar, ucl: u, lcl: l > 0 ? l : -Infinity, fmt: (v) => G.num(v, 3) });
      } else {
        const n = +s.ss, cb = mean(A), pb = cb / n;
        const sd = t === "np" ? Math.sqrt(cb * (1 - pb)) : Math.sqrt(cb), u = cb + 3 * sd, l = cb - 3 * sd;
        out.lines = t === "np" ? [`np̄ = ${G.num(cb, 2)} (n = ${n}, p̄ = ${G.num(pb, 4)})`, `UCL = np̄ + 3√(np̄(1 − p̄)) = ${G.num(cb, 2)} + 3 × ${G.num(sd, 3)} = <b>${G.num(u, 2)}</b>`, `LCL = ${G.num(l, 2)}${l < 0 ? " → negative, so no LCL" : ""}`]
          : [`c̄ = ${A.reduce((a, b) => a + b, 0)} ÷ ${A.length} = ${G.num(cb, 2)}`, `UCL = c̄ + 3√c̄ = ${G.num(cb, 2)} + 3 × ${G.num(sd, 3)} = <b>${G.num(u, 2)}</b>`, `LCL = c̄ − 3√c̄ = <b>${G.num(l, 2)}</b>${l < 0 ? " → negative, so no LCL" : ""}`];
        out.charts.push({ title: t === "np" ? "Number defective (np)" : "Number of defects (c)", y: A, cl: cb, ucl: u, lcl: l > 0 ? l : -Infinity, fmt: (v) => G.num(v, 1) });
      }
      out.charts.forEach((c) => { const U = c.ucl, Lw = c.lcl; c.flags = c.y.map((v) => v > U + 1e-12 || v < Lw - 1e-12); });
      return out;
    }
    function draw() {
      const s = S[t], o = compute();
      const nFlag = o.charts.reduce((a, c) => a + c.flags.filter(Boolean).length, 0);
      el.innerHTML = `<h4><span>Control limit calculator</span><span class="seg" role="group" aria-label="Chart type">${Object.entries(LIM).map(([k, v]) => `<button type="button" data-t="${k}" aria-pressed="${k === t}">${v.n}</button>`).join("")}</span></h4>
        <p class="hint">${esc(s.src)} Edit the values (comma separated) and the limits recompute.</p>
        <div class="grid2">
          <label class="field">${s.la}<textarea data-k="a" rows="2" style="width:100%;border:1.5px solid var(--ink-soft);border-radius:6px;padding:.4rem;font:inherit">${esc(s.a)}</textarea></label>
          ${s.lb ? `<label class="field">${s.lb}<textarea data-k="b" rows="2" style="width:100%;border:1.5px solid var(--ink-soft);border-radius:6px;padding:.4rem;font:inherit">${esc(s.b)}</textarea></label>` : ""}
          ${t === "xr" || t === "xs" ? `<label class="field">Subgroup size n<select data-k="ss">${Object.keys(K).map((n) => `<option ${+n === +s.ss ? "selected" : ""}>${n}</option>`).join("")}</select></label>` : ""}
          ${t === "np" ? `<label class="field">Constant sample size n<input type="number" min="1" value="${s.ss}" data-k="ss"></label>` : ""}
        </div>
        <div class="small" style="margin:.7rem 0;line-height:1.7">${o.lines.map((l) => `<div>${l}</div>`).join("")}</div>
        ${o.charts.map((c) => G.ctrlSVG(c)).join("")}
        <p class="small ${nFlag ? "feedback bad" : "feedback good"}" aria-live="polite">${nFlag ? `${nFlag} point${nFlag > 1 ? "s" : ""} beyond the control limits — investigate for special causes.` : "No points beyond the limits. Check the run rules too before calling it in control."}</p>`;
      $$("[data-t]", el).forEach((b) => b.addEventListener("click", () => { t = b.dataset.t; draw(); }));
      $$("[data-k]", el).forEach((i) => i.addEventListener("change", () => { S[t][i.dataset.k] = i.value; draw(); }));
    }
    draw();
  };

  /* ---------- Ch22: constants table ---------- */
  G.W.constants = (el) => {
    el.innerHTML = `<h4>Control chart constants</h4>
      <p class="hint">Standard AIAG/ASTM factors, the same values as the handbook's Appendix E. For I-MR charts use the n = 2 row (E₂ = 2.660, D₄ = 3.267). Ã₂ is the median-chart factor.</p>
      ${G.table(["n", "A₂", "D₃", "D₄", "d₂", "A₃", "B₃", "B₄", "Ã₂ (median)"], Object.entries(K).map(([n, k]) => [n, k.A2.toFixed(3), k.D3 ? k.D3.toFixed(3) : "0", k.D4.toFixed(3), k.d2.toFixed(3), k.A3.toFixed(3), k.B3 ? k.B3.toFixed(3) : "0", k.B4.toFixed(3), k.Am.toFixed(3)]))}
      <p class="small soft">σ̂ = R̄ ÷ d₂. When D₃ or B₃ is 0, the range or s chart has no lower limit.</p>`;
  };

  /* ---------- Ch22: run-rules lab ---------- */
  const PATTERNS = {
    stable: [0.3, -0.8, 1.1, -0.2, 0.6, -1.3, 0.4, 0.9, -0.5, 0.1, -0.9, 1.4, 1.7, 0.7, -1.1, 0.2, -0.4, 1.0, 1.2, 0.5, -0.1, 0.8, -1.2, 0.3, -0.6, 1.2, 1.5, 0.4, -0.9, 0.6],
    outlier: [0.3, -0.8, 1.1, -0.2, 0.6, -1.3, 0.4, 0.9, -0.5, 0.1, -0.9, 1.4, 1.7, 0.7, -1.1, 0.2, -0.4, 3.6, 1.2, 0.5, -0.1, 0.8, -1.2, 0.3, -0.6, 1.2, 1.5, 0.4, -0.9, 0.6],
    shift: [0.3, -0.8, 1.1, -0.2, 0.6, -1.3, 0.4, 0.9, -0.5, 0.1, -0.9, 0.4, 0.9, 1.5, 1.2, 0.7, 1.6, 1.1, 1.9, 1.4, 0.8, 1.3, 1.7, 1.0, 1.5, 0.6, 1.2, 1.8, 1.1, 1.4],
    trend: [0.3, -0.8, 1.1, -0.2, 0.6, -1.3, 0.4, 0.9, -0.5, 0.1, -0.9, -1.6, -1.1, -0.6, -0.2, 0.3, 0.9, 1.4, 2.0, 2.6, 0.5, -0.1, 0.8, -1.2, 0.3, -0.6, 1.2, 1.5, 0.4, -0.9],
    sawtooth: [0.3, -0.8, 1.1, 1.4, 0.6, 0.2, 1.2, -0.3, 1.4, -0.6, 0.9, -1.1, 0.7, -0.2, 1.3, -0.9, 0.5, -1.2, 0.8, -0.4, 1.1, -0.5, 0.2, -0.6, 1.2, 1.5, 0.4, -0.9, 0.6, -0.1],
    hugging: [0.3, 0.1, -0.2, -0.4, 0.2, 0.5, 0.4, -0.1, -0.3, -0.5, 0.1, 0.3, 0.6, 0.2, -0.2, -0.4, -0.1, 0.3, 0.2, 0.5, -0.3, -0.6, -0.2, 0.4, 0.1, -0.1, 0.3, 0.5, -0.4, 0.2],
    mixture: [1.5, 1.7, -1.4, -1.8, 1.6, 1.3, -1.5, -1.9, 1.4, 1.8, -1.6, -1.3, 1.7, 1.5, -1.8, -1.4, 1.3, 1.9, -1.5, -1.7, 1.6, 1.4, -1.3, -1.6, 1.8, 1.5, -1.7, -1.5, 1.4, 1.6],
    twoofthree: [0.3, -0.8, 1.1, -0.2, 0.6, -1.3, 0.4, 0.9, -0.5, 0.1, -0.9, 1.4, 1.7, 0.7, -1.1, 0.2, -0.4, 1.0, 1.2, 2.3, 0.4, 2.5, -1.2, 0.3, -0.6, 1.2, 1.5, 0.4, -0.9, 0.6]
  };
  const PNAME = { stable: "In control", outlier: "One outlier", shift: "Mean shift", trend: "Trend", sawtooth: "Sawtooth", hugging: "Hugging the centre", mixture: "Mixture", twoofthree: "2 of 3 near a limit" };
  G.runRules = (x, set) => {
    const hits = [], n = x.length;
    const add = (rule, idx) => hits.push({ rule, idx });
    const win = (len, test) => { for (let i = 0; i + len <= n; i++) { const w = x.slice(i, i + len); if (test(w, i)) add(null, [...Array(len).keys()].map((k) => k + i)); } };
    const run = (rule, len, test) => { const before = hits.length; win(len, test); for (let h = before; h < hits.length; h++) hits[h].rule = rule; };
    if (set === "minitab") {
      x.forEach((v, i) => { if (Math.abs(v) > 3) add("1 point beyond 3σ", [i]); });
      run("9 in a row on one side", 9, (w) => w.every((v) => v > 0) || w.every((v) => v < 0));
      run("6 in a row increasing or decreasing", 6, (w) => w.slice(1).every((v, i) => v > w[i]) || w.slice(1).every((v, i) => v < w[i]));
      run("14 in a row alternating up and down", 14, (w) => { const d = w.slice(1).map((v, i) => Math.sign(v - w[i])); return d.every((s, i) => s !== 0 && (i === 0 || s === -d[i - 1])); });
      for (let i = 0; i + 3 <= n; i++) { const w = x.slice(i, i + 3); [1, -1].forEach((sg) => { const idx = w.map((v, k) => (v * sg > 2 ? i + k : -1)).filter((k) => k >= 0); if (idx.length >= 2) add("2 of 3 beyond 2σ, same side", idx); }); }
      for (let i = 0; i + 5 <= n; i++) { const w = x.slice(i, i + 5); [1, -1].forEach((sg) => { const idx = w.map((v, k) => (v * sg > 1 ? i + k : -1)).filter((k) => k >= 0); if (idx.length >= 4) add("4 of 5 beyond 1σ, same side", idx); }); }
      run("15 in a row within 1σ", 15, (w) => w.every((v) => Math.abs(v) < 1));
      run("8 in a row beyond 1σ, either side", 8, (w) => w.every((v) => Math.abs(v) > 1));
    } else {
      x.forEach((v, i) => { if (Math.abs(v) > 3) add("Point beyond a control limit", [i]); });
      run("7 in a row on one side", 7, (w) => w.every((v) => v > 0) || w.every((v) => v < 0));
      run("7 in a row consistently increasing or decreasing", 7, (w) => (w.slice(1).every((v, i) => v >= w[i]) && w[6] > w[0]) || (w.slice(1).every((v, i) => v <= w[i]) && w[6] < w[0]));
      const mid = x.filter((v) => Math.abs(v) < 1).length / n;
      if (n >= 25 && mid > 0.9) add(`Over 90% of points in the middle third (${Math.round(mid * 100)}%)`, x.map((_, i) => i));
      if (n >= 25 && mid < 0.4) add(`Under 40% of points in the middle third (${Math.round(mid * 100)}%)`, x.map((_, i) => i));
    }
    return hits;
  };
  G.W.rules = (el) => {
    let pat = "shift", set = "minitab";
    function draw() {
      const x = PATTERNS[pat], hits = G.runRules(x, set);
      const flags = x.map((_, i) => hits.some((h) => h.idx.includes(i)));
      const names = [...new Set(hits.map((h) => h.rule))];
      el.innerHTML = `<h4><span>Run-rules lab</span><span class="seg" role="group" aria-label="Rule set"><button type="button" data-s="minitab" aria-pressed="${set === "minitab"}">Minitab (8 tests)</button><button type="button" data-s="aiag" aria-pressed="${set === "aiag"}">AIAG (6 rules)</button></span></h4>
        <p class="hint">Points are in σ units; shading marks the ±1σ and ±2σ zones. Pick a pattern and see which rules fire.</p>
        <div class="chips" role="group" aria-label="Pattern" style="margin-bottom:.5rem">${Object.keys(PATTERNS).map((k) => `<button type="button" class="chip" data-p="${k}" aria-pressed="${k === pat}">${PNAME[k]}</button>`).join("")}</div>
        ${G.ctrlSVG({ y: x, cl: 0, ucl: 3, lcl: -3, sigma: 1, flags, fmt: (v) => (v === 0 ? "0" : (v > 0 ? "+" : "") + G.num(v, 0) + "σ"), title: PNAME[pat] })}
        <p class="small" aria-live="polite">${names.length ? `<b style="color:var(--ooc)">Signals:</b> ${names.join("; ")}.` : "<b style='color:var(--belt-deep)'>No signals</b> under this rule set."} ${set === "aiag" ? "AIAG's sixth rule, obvious non-random patterns such as cycles, needs judgment — no algorithm fires it." : ""}</p>`;
      $$("[data-p]", el).forEach((b) => b.addEventListener("click", () => { pat = b.dataset.p; draw(); }));
      $$("[data-s]", el).forEach((b) => b.addEventListener("click", () => { set = b.dataset.s; draw(); }));
    }
    draw();
  };

  /* ---------- Ch22: rational subgrouping ---------- */
  G.W.subgroup = (el) => {
    const r = normal(rng(42)), off = [-1.2, -0.4, 0.4, 1.2], sd = 0.35, T = 20;
    const parts = []; for (let t = 0; t < T; t++) { parts.push(off.map((o) => 10 + o + r() * sd)); }
    const parts2 = []; for (let t = 0; t < T; t++) { const sp = t % 4; parts2.push([0, 1, 2, 3].map(() => 10 + off[sp] + r() * sd)); }
    let mode = "across";
    function draw() {
      const sg = mode === "across" ? parts : parts2;
      const xb = sg.map((g) => g.reduce((a, b) => a + b, 0) / 4), R = sg.map((g) => Math.max(...g) - Math.min(...g));
      const xbb = xb.reduce((a, b) => a + b, 0) / T, rb = R.reduce((a, b) => a + b, 0) / T, u = xbb + 0.729 * rb, l = xbb - 0.729 * rb;
      const flags = xb.map((v) => v > u || v < l), mid = xb.filter((v) => Math.abs(v - xbb) < (u - xbb) / 3).length / T;
      el.innerHTML = `<h4><span>Rational subgrouping: four spindles</span><span class="seg" role="group" aria-label="Subgroup design"><button type="button" data-m="across" aria-pressed="${mode === "across"}">One part from each spindle</button><button type="button" data-m="within" aria-pressed="${mode === "within"}">Four parts from one spindle</button></span></h4>
        <p class="hint">A machine has four spindles that run at slightly different sizes. Same process, two ways of forming subgroups of n = 4.</p>
        ${G.ctrlSVG({ y: xb, cl: xbb, ucl: u, lcl: l, flags, fmt: (v) => G.num(v, 2), title: "X̄ chart", h: 190 })}
        <div class="readout">${G.ro("Average range R̄", G.num(rb, 2), mode === "across" ? "includes spindle-to-spindle differences" : "within one spindle only", true)}${G.ro("Width of X̄ limits", "±" + G.num(0.729 * rb, 2))}${G.ro("Points in middle third", Math.round(mid * 100) + "%")}</div>
        <p class="small" aria-live="polite">${mode === "across" ? "<b>Wrong subgrouping.</b> Each subgroup mixes four streams, so the range is inflated, the limits are wide and the averages hug the centre line (stratification). The chart cannot see the spindle differences." : "<b>Rational subgrouping.</b> Within-subgroup variation is common cause only, the limits are tight, and the spindle differences appear between subgroups as out-of-control signals — exactly what you want the X̄ chart to reveal."}</p>`;
      $$("[data-m]", el).forEach((b) => b.addEventListener("click", () => { mode = b.dataset.m; draw(); }));
    }
    draw();
  };

  /* ---------- Ch22: tampering ---------- */
  G.W.tamper = (el) => {
    const r = normal(rng(7)), N = 60, e = Array.from({ length: N }, () => r());
    const keep = e.slice();
    const adj = []; let setting = 0; for (let i = 0; i < N; i++) { const v = setting + e[i]; adj.push(v); setting -= v; }
    const sd = (a) => { const m = a.reduce((x, y) => x + y, 0) / a.length; return Math.sqrt(a.reduce((s, v) => s + (v - m) ** 2, 0) / (a.length - 1)); };
    let mode = "leave";
    function draw() {
      const y = mode === "leave" ? keep : adj;
      el.innerHTML = `<h4><span>Tampering: adjusting to common-cause noise</span><span class="seg" role="group" aria-label="Operator policy"><button type="button" data-m="leave" aria-pressed="${mode === "leave"}">Leave a stable process alone</button><button type="button" data-m="adjust" aria-pressed="${mode === "adjust"}">Adjust after every point</button></span></h4>
        <p class="hint">Same 60 random disturbances (σ = 1, target 0). The tamperer moves the setting by the full deviation after each part.</p>
        ${G.ctrlSVG({ y, cl: 0, ucl: 3, lcl: -3, sigma: 1, flags: y.map((v) => Math.abs(v) > 3), fmt: (v) => G.num(v, 1), title: mode === "leave" ? "No adjustment" : "Adjusted every time", h: 190 })}
        <div class="readout">${G.ro("Observed standard deviation", G.num(sd(y), 2), mode === "leave" ? "≈ 1, the process's own variation" : "≈ √2 ≈ 1.41 in theory", true)}</div>
        <p class="small" aria-live="polite">${mode === "leave" ? "Reacting only to signals keeps variation at its natural level." : "<b>Over-adjustment roughly increases the standard deviation by 40%.</b> This is the Type I error in action: treating common cause as special cause. Deming: the control chart's job is to minimise the net loss from over-adjustment and under-adjustment."}</p>`;
      $$("[data-m]", el).forEach((b) => b.addEventListener("click", () => { mode = b.dataset.m; draw(); }));
    }
    draw();
  };

  G.W.causesort = (el) => G.classifier(el, {
    title: "Common cause or special cause?",
    cats: ["Common cause — improve the system", "Special cause — find and remove it"],
    items: [
      { t: "Random point-to-point scatter within the limits with no pattern.", a: 0 },
      { t: "A cutting tool breaks mid-shift and diameters jump.", a: 1 },
      { t: "A new raw-material lot shifts the average for the rest of the week.", a: 1 },
      { t: "Many small, inherent factors that operators cannot control — the process's natural variation.", a: 0 },
      { t: "Nine consecutive points above the centre line.", a: 1 },
      { t: "The spread is too wide for the specification, but the chart is stable.", a: 0, why: "A stable but incapable process needs a system change (management action), not hunting for special causes." }
    ]
  });
  G.W.errors = (el) => G.classifier(el, {
    title: "Type I, Type II, or a correct decision?",
    cats: ["Type I error (α)", "Type II error (β)", "Correct decision"],
    items: [
      { t: "The operator adjusts the process after a point that was ordinary common-cause noise.", a: 0, why: "A false alarm: concluding the process changed when it did not (over-adjustment, producer's risk)." },
      { t: "A real shift in the mean goes undetected for two shifts.", a: 1, why: "Missing a real change (under-adjustment, consumer's risk)." },
      { t: "Tool wear produces a trend; the team spots it and changes the tool.", a: 2 },
      { t: "Producer's risk.", a: 0 },
      { t: "Consumer's risk.", a: 1 },
      { t: "A stable process is left alone and keeps producing within its natural limits.", a: 2 }
    ]
  });

  /* ---------- Ch23 ---------- */
  G.W.cplan = (el) => G.classifier(el, {
    title: "Which control plan element is this?", select: true,
    cats: ["Control subject", "Performance standard", "Unit of measure", "Measurement rules", "Actions", "Decision / deployment", "Record", "Version"],
    items: [
      { t: "Seal-bar temperature on line 3 is the feature being monitored.", a: 0 },
      { t: "Subgroup averages must stay between 7.123 and 7.129.", a: 1 },
      { t: "Temperatures are recorded in °C everywhere — never °F.", a: 2 },
      { t: "Digital probe, four readings every hour, written on the X̄–R chart.", a: 3 },
      { t: "If a point falls outside the limits: stop the line, quarantine the last hour's output, check the heater.", a: 4 },
      { t: "The shift lead decides; the maintenance technician carries out the repair.", a: 5 },
      { t: "Every reaction is written in the process log and archived for trend analysis.", a: 6 },
      { t: "Rev C, released 17 March, supersedes Rev B.", a: 7 }
    ]
  });
  G.W.audits = (el) => G.classifier(el, {
    title: "First-, second- or third-party audit?",
    cats: ["First-party", "Second-party", "Third-party"],
    items: [
      { t: "Quality audits the receiving dock to confirm it checks for certification labels.", a: 0, why: "Internal, between functions of the same organization." },
      { t: "Your largest customer audits your plant as a condition of continued orders.", a: 1 },
      { t: "An accredited registrar audits you for ISO 9001 certification.", a: 2 },
      { t: "A government inspector audits a medical-device maker under regulatory controls.", a: 2 },
      { t: "Your team audits a supplier before awarding a contract.", a: 1, why: "A customer (you) auditing a supplier is second-party from the supplier's side." },
      { t: "An internal audit of whether Purchasing puts the certification requirement on every quotation.", a: 0 }
    ]
  });
  G.W.docrec = (el) => G.classifier(el, {
    title: "Controlled document or record?",
    cats: ["Document (template / instruction)", "Record (evidence the work was done)"],
    items: [
      { t: "The released work instruction for the new material-handling process.", a: 0 },
      { t: "The completed checklist signed by the operator at 2 p.m. today.", a: 1 },
      { t: "A blank control chart form, revision C.", a: 0 },
      { t: "Training sign-off sheets showing who was trained and when.", a: 1 },
      { t: "The control plan currently in circulation.", a: 0 }
    ]
  });
  G.W.trainval = (el) => G.classifier(el, {
    title: "Does this prove the training worked?",
    cats: ["Valid validation", "Not enough on its own"],
    items: [
      { t: "Ninety-five percent of attendees rated the session 'excellent'.", a: 1, why: "Validation must go beyond satisfaction to show learning and changed behaviour." },
      { t: "Each operator demonstrates the new return-to-vendor steps without help.", a: 0 },
      { t: "Forty certificates were issued.", a: 1, why: "The handbook: success is not measured by the count of certificates or classroom hours." },
      { t: "Two months of monitoring show completed work meets the performance targets and special causes have disappeared.", a: 0 },
      { t: "A written or oral examination on the new procedure.", a: 0 }
    ]
  });
  G.W.variability = (el) => G.classifier(el, {
    title: "Instability, variation or off-target?",
    cats: ["Instability", "Variation", "Off-target"],
    items: [
      { t: "Special causes come and go and nobody responds to them.", a: 0 },
      { t: "The process is stable and centred, but the spread is too wide.", a: 1 },
      { t: "The process is stable and tight, but centred at 10.4 when the target is 10.0.", a: 2, why: "Often an engineering design decision; operators feed data back for redesign." },
      { t: "Capability indices are not worth calculating yet.", a: 0, why: "Without stability, capability values are meaningless." }
    ]
  });

  /* ---------- Ch24: OEE waterfall ---------- */
  G.W.oee = (el) => {
    const v = { potential: 1600, planned: 100, down: 250, cycle: 0.5, units: 2000, good: 1960 };
    function draw() {
      const pat = v.potential - v.planned, op = pat - v.down, net = v.cycle * v.units, full = v.cycle * v.good;
      const A = op / pat, P = net / op, Q = v.good / v.units, oee = A * P * Q;
      const rows = [["Potential time", v.potential, 0, "#CBD5CE"], ["Planned downtime (excluded)", v.planned, pat, "#E1E7E3"], ["Planned available time", pat, 0, "var(--ink-soft)"], ["Unplanned downtime — availability loss", v.down, op, "var(--ooc)"], ["Actual operating time", op, 0, "var(--ink-soft)"], ["Speed loss — performance", op - net, net, "var(--ooc)"], ["Net run time (ideal cycle × units)", net, 0, "var(--ink-soft)"], ["Quality loss", net - full, full, "var(--ooc)"], ["Fully productive time", full, 0, "var(--acc)"]];
      const W = 600, sc = (t) => (t / v.potential) * 330;
      el.innerHTML = `<h4>OEE = Availability × Performance × Quality</h4>
        <p class="hint">Handbook example: 1,500 available hours, 250 hours of downtime, 0.5 h ideal cycle, 2,000 units, 1,960 good. Planned downtime (100 h here) is removed before OEE starts.</p>
        <div class="row">${[["potential", "Potential time (h)"], ["planned", "Planned downtime (h)"], ["down", "Unplanned downtime (h)"], ["cycle", "Ideal cycle (h/unit)"], ["units", "Units produced"], ["good", "Good units"]].map(([k, l]) => `<label class="field">${l}<input type="number" step="${k === "cycle" ? 0.01 : 1}" min="0" value="${v[k]}" data-k="${k}"></label>`).join("")}</div>
        <svg class="viz" viewBox="0 0 ${W} ${rows.length * 28 + 6}" role="img" aria-label="OEE time waterfall, OEE ${G.num(oee * 100, 1)} percent">
          ${rows.map(([n, t, off, c], i) => `<text x="250" y="${i * 28 + 19}" text-anchor="end" font-size="12" ${c === "var(--ink-soft)" || c === "var(--acc)" ? 'font-weight="700"' : ""}>${n}</text>
            <rect x="${258 + sc(off)}" y="${i * 28 + 5}" width="${Math.max(1, sc(Math.max(0, t)))}" height="20" rx="3" fill="${c}"/>
            <text x="${264 + sc(off) + sc(Math.max(0, t))}" y="${i * 28 + 19}" font-size="11.5">${G.num(t, 0)} h</text>`).join("")}
        </svg>
        <div class="readout">${G.ro("Availability", G.num(A * 100, 1) + "%", `${G.num(op, 0)} ÷ ${G.num(pat, 0)}`)}${G.ro("Performance", G.num(P * 100, 1) + "%", `${v.cycle} × ${v.units} ÷ ${G.num(op, 0)}`)}${G.ro("Quality", G.num(Q * 100, 1) + "%", `${v.good} ÷ ${v.units}`)}${G.ro("OEE", G.num(oee * 100, 1) + "%", "= fully productive ÷ planned available", true)}</div>
        ${P > 1 ? '<p class="small feedback bad">Performance above 100% means the ideal cycle time is set too slow — check it.</p>' : ""}`;
      $$("[data-k]", el).forEach((i) => i.addEventListener("change", () => { v[i.dataset.k] = Math.max(0, +i.value || 0); if (v.good > v.units) v.good = v.units; if (v.planned > v.potential) v.planned = v.potential; const k = i.dataset.k; draw(); $(`[data-k="${k}"]`, el).focus(); }));
    }
    draw();
  };
  G.W.losses = (el) => G.classifier(el, {
    title: "Which OEE factor does each of the six big losses hit?",
    cats: ["Availability (downtime)", "Performance (speed)", "Quality"],
    items: [
      { t: "Breakdowns — a mechanical failure stops production.", a: 0 },
      { t: "Changeovers — setup and adjustment stop the line.", a: 0 },
      { t: "Idling and minor stoppages — a jam cleared in under a minute; waiting for material.", a: 1 },
      { t: "Reduced speed — running slower than designed.", a: 1 },
      { t: "Scrap and rework.", a: 2 },
      { t: "Start-up losses — the machine runs but is not yet making salable product.", a: 2, why: "Reduced yield at start-up counts against quality." }
    ]
  });
  G.W.maint = (el) => G.classifier(el, {
    title: "What kind of maintenance is this?",
    cats: ["Breakdown", "Corrective", "Preventive", "Predictive", "Operator-led (TPM)"],
    items: [
      { t: "Repair the conveyor motor after it fails.", a: 0 },
      { t: "Redesign the guard so the belt can be changed without removing the frame.", a: 1, why: "Improving or modifying equipment to prevent breakdowns or make maintenance easier." },
      { t: "Replace the bearings every 2,000 hours whatever their condition.", a: 2 },
      { t: "Rising vibration readings trigger a bearing change before it fails.", a: 3, why: "Acting on early signs of deterioration — the prediction side of TPM in the BoK." },
      { t: "Operators clean, inspect, lubricate and tighten their own machine each shift.", a: 4 }
    ]
  });
  G.W.tpmroles = (el) => G.classifier(el, {
    title: "Who does this in TPM?",
    cats: ["Operators", "Maintenance", "Engineers", "Managers / supervisors"],
    items: [
      { t: "Prevent deterioration through regular inspection; correct it through regular cleaning.", a: 0 },
      { t: "Plan maintenance to reduce disruption to production and train operators in TPM and OEE.", a: 1 },
      { t: "Early equipment management: design for maintainability and prevent contamination at the design stage.", a: 2 },
      { t: "Hold people accountable for completing data collection and worksheets; provide leadership.", a: 3 }
    ]
  });
  G.W.stacklight = (el) => {
    const L = { g: ["Green", "#2E7D4F", "Normal production, no interruption.", "Keep running."], y: ["Yellow", "#C99A06", "The operator needs help — can be signalled at any time.", "The line supervisor responds, helps, and records the incident so it does not recur."], r: ["Red", "#B83A26", "Production has stopped.", "Respond immediately — and use the record to remove the cause."] };
    let on = "y";
    function draw() {
      el.innerHTML = `<h4>Stack light (andon)</h4>
        <div class="grid2" style="align-items:center">
          <svg class="viz" viewBox="0 0 120 220" style="max-width:120px;margin:auto" role="group" aria-label="Stack light">
            ${["r", "y", "g"].map((k, i) => `<g class="clickable" data-k="${k}" tabindex="0" role="button" aria-label="${L[k][0]} light"><rect x="30" y="${10 + i * 62}" width="60" height="56" rx="10" fill="${L[k][1]}" opacity="${k === on ? 1 : 0.25}" stroke="#18283A" stroke-width="${k === on ? 3 : 1}"/></g>`).join("")}
            <rect x="50" y="198" width="20" height="18" fill="#4F5E6C"/>
          </svg>
          <div class="ro key" aria-live="polite"><div class="k">${L[on][0]}</div><p style="margin:.2rem 0">${L[on][2]}</p><p class="small" style="margin:0"><b>Response:</b> ${L[on][3]}</p></div>
        </div>
        <p class="small" style="margin-top:.6rem">The catch: a visual system only works if people respond. An ignored light, an unreplenished bin or an ignored safety sign makes the device pointless.</p>`;
      $$("[data-k]", el).forEach((g) => { const f = () => { on = g.dataset.k; draw(); }; g.addEventListener("click", f); g.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); f(); } }); });
    }
    draw();
  };
  G.W.visualsort = (el) => G.classifier(el, {
    title: "Name the visual-factory device", select: true,
    cats: ["Andon board", "Jidoka", "Kanban card", "Poka-yoke", "Single-point lesson", "Lockout/tagout", "Hour-by-hour chart", "Colour-coded tags"],
    items: [
      { t: "A display lights up the stopped process step and alerts the group leader, sometimes with an alarm.", a: 0 },
      { t: "The machine detects an abnormality, stops itself and alerts the operator, who decides what to do.", a: 1 },
      { t: "A card on the empty bin signals the sub-assembly area to make more parts.", a: 2 },
      { t: "A connector that only fits one way round.", a: 3 },
      { t: "A one-page picture showing what a good and a bad weld look like, with almost no text.", a: 4 },
      { t: "A lock and tag stop anyone from energising equipment under repair.", a: 5 },
      { t: "Expected output per pitch versus actual, with reasons for any miss written beside it.", a: 6 },
      { t: "Green, red and yellow tags marking product as good, scrap or on hold.", a: 7 }
    ]
  });
})();
