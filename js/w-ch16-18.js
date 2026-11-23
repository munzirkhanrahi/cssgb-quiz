/* Widgets: Chapters 16 (exploratory data analysis), 17 (hypothesis testing), 18 (additional analysis methods) */
(function () {
  "use strict";
  const { $, $$ } = G;
  const S = () => G.st;
  const C = (name, cfg) => { G.W[name] = (el) => G.classifier(el, cfg); };
  const fmt = (x, d = 3) => G.num(x, d);
  const press = (sel, el, test) => $$(sel, el).forEach((b) => b.setAttribute("aria-pressed", test(b)));
  const pfmt = (p) => S().fmtP(p);
  const pEq = (p) => { const t = pfmt(p); return /^[<>]/.test(t) ? `p ${t}` : `p = ${t}`; };
  const decide = (p, a) => (p <= a
    ? `<b style="color:var(--ooc)">Reject H₀</b> (${pEq(p)}, α = ${a}).`
    : `<b>Fail to reject H₀</b> (${pEq(p)} > α = ${a}). That is not proof H₀ is true — only that the data aren't strong enough evidence against it.`);
  const altSeg = (cur) => `<span class="seg" role="group" aria-label="Alternative hypothesis">${[["ne", "≠ two-sided"], ["lt", "< left"], ["gt", "> right"]].map(([k, l]) => `<button type="button" data-alt="${k}" aria-pressed="${k === cur}">${l}</button>`).join("")}</span>`;
  const alphaSeg = (cur) => `<span class="seg" role="group" aria-label="Significance level">${[0.01, 0.05, 0.1].map((a) => `<button type="button" data-al="${a}" aria-pressed="${a === cur}">α ${a}</button>`).join("")}</span>`;
  // p-value and critical values for a symmetric statistic with cdf F and inverse Q
  const sym = (stat, alt, a, cdf, inv) => {
    const p = alt === "ne" ? 2 * Math.min(cdf(stat), 1 - cdf(stat)) : alt === "lt" ? cdf(stat) : 1 - cdf(stat);
    const crit = alt === "ne" ? `±${fmt(inv(1 - a / 2), 3)}` : alt === "lt" ? fmt(-inv(1 - a), 3) : fmt(inv(1 - a), 3);
    return { p: Math.min(1, Math.max(0, p)), crit };
  };
  // statistic-on-curve sketch with shaded rejection region
  const curveSVG = (pdf, x0, x1, stat, alt, a, inv, label, nonneg) => {
    const pts = []; let ym = 0;
    for (let i = 0; i <= 240; i++) { const x = x0 + (i / 240) * (x1 - x0), y = pdf(x); if (isFinite(y)) ym = Math.max(ym, y); pts.push([x, isFinite(y) ? y : 0]); }
    ym = Math.min(ym, 2) * 1.15;
    const f = G.frame({ W: 640, H: 180, x0, x1, y0: 0, y1: ym, yticks: [], label, B: 30 });
    const P = (arr) => arr.map(([x, y], i) => `${i ? "L" : "M"}${f.x(x).toFixed(1)},${f.y(Math.min(y, ym)).toFixed(1)}`).join("");
    const shade = (cond) => { const s = pts.filter(([x]) => cond(x)); return s.length ? `<path d="M${f.x(s[0][0])},${f.B} ${P(s).replace(/^M/, "L")} L${f.x(s[s.length - 1][0])},${f.B} Z" fill="var(--ooc)" opacity=".35"/>` : ""; };
    let rej = "";
    if (nonneg) { const c = inv(1 - a); rej = shade((x) => x >= c); }
    else if (alt === "ne") { const c = inv(1 - a / 2); rej = shade((x) => x <= -c) + shade((x) => x >= c); }
    else if (alt === "lt") { const c = -inv(1 - a); rej = shade((x) => x <= c); }
    else { const c = inv(1 - a); rej = shade((x) => x >= c); }
    const sx = Math.max(x0, Math.min(x1, stat));
    return f.open + f.axes + rej + `<path d="${P(pts)}" fill="none" stroke="var(--ink)" stroke-width="2"/>
      <line x1="${f.x(sx)}" x2="${f.x(sx)}" y1="${f.T}" y2="${f.B}" stroke="var(--c17)" stroke-width="3"/><text x="${f.x(sx)}" y="${f.T + 10}" text-anchor="${sx > (x0 + x1) / 2 ? "end" : "start"}" dx="${sx > (x0 + x1) / 2 ? -5 : 5}" font-size="12" font-weight="700" fill="var(--c17)">${stat === sx ? "" : stat > x1 ? "→ " : "← "}${G.sig(stat, 4)}</text>` + f.close;
  };

  /* =================== Chapter 16 =================== */
  // [part][T,M,B][12,2,4 o'clock]
  const MV = {
    t162: [[[.998, .994, .996], [.992, .996, .994], [.996, .994, .995]], [[.984, .982, .984], [.982, .980, .983], [.981, .982, .980]], [[.998, .999, .996], [.998, .998, .996], [.997, .997, .996]], [[.986, .985, .984], [.987, .986, .985], [.986, .986, .984]], [[.975, .976, .978], [.980, .976, .980], [.976, .974, .974]]],
    t163: [[[.985, .982, .985], [.984, .981, .983], [.980, .982, .983]], [[.981, .985, .983], [.985, .982, .981], [.983, .981, .984]], [[.982, .985, .982], [.982, .984, .983], [.982, .984, .982]], [[.984, .981, .982], [.984, .982, .981], [.983, .982, .981]], [[.981, .984, .983], [.981, .982, .983], [.984, .981, .982]]]
  };
  G.MV = MV;
  G.W.multivari = (el) => {
    let key = "t162";
    el.innerHTML = `<h4><span>Multi-vari chart: stainless steel casting ID</span><span class="seg" role="group" aria-label="Data set"><button type="button" data-k="t162">Table 16.2 — original castings</button><button type="button" data-k="t163">Table 16.3 — precision castings</button></span></h4>
      <p class="hint">Five parts from one shift. Each part is measured at the top, middle and bottom (T, M, B) of the bore, and at three angles (12, 2 and 4 o'clock). Vertical bars = out-of-round; solid line joins position averages within a part = top-to-bottom; dashed line joins part averages = part-to-part.</p>
      <div data-svg></div><div class="readout" data-ro></div><p class="small" data-msg aria-live="polite"></p>`;
    function draw() {
      press("[data-k]", el, (b) => b.dataset.k === key);
      const D = MV[key], s = S(), all = D.flat(2), lo = Math.min(...all) - 0.002, hi = Math.max(...all) + 0.002;
      const f = G.frame({ W: 640, H: 270, x0: 0, x1: 15, y0: lo, y1: hi, xticks: [], yticks: G.nice(lo, hi, 5), yf: (v) => v.toFixed(3).replace(/^0/, ""), label: "Multi-vari chart", B: 46 });
      const X = (p, q) => f.x(p * 3 + q + 0.5);
      let svg = f.open + f.axes;
      const pm = D.map((part) => s.mean(part.flat())), posm = D.map((part) => part.map((pos) => s.mean(pos)));
      D.forEach((part, p) => {
        svg += `<text x="${X(p, 1)}" y="${f.B + 32}" text-anchor="middle" font-size="12" font-weight="700">Part ${p + 1}</text>`;
        if (p) svg += `<line x1="${f.x(p * 3)}" x2="${f.x(p * 3)}" y1="${f.T}" y2="${f.B}" stroke="var(--rule-soft)"/>`;
        part.forEach((pos, q) => {
          svg += `<text x="${X(p, q)}" y="${f.B + 15}" text-anchor="middle" font-size="11" class="t-soft">${"TMB"[q]}</text>`;
          svg += `<line x1="${X(p, q)}" x2="${X(p, q)}" y1="${f.y(Math.max(...pos))}" y2="${f.y(Math.min(...pos))}" stroke="var(--c16)" stroke-width="3"/>`;
          pos.forEach((v) => (svg += `<circle cx="${X(p, q)}" cy="${f.y(v)}" r="3.5" fill="var(--c16)" stroke="#fff"/>`));
        });
        svg += `<path d="${posm[p].map((m, q) => `${q ? "L" : "M"}${X(p, q)},${f.y(m)}`).join("")}" fill="none" stroke="var(--ink)" stroke-width="1.8"/>`;
      });
      svg += `<path d="${pm.map((m, p) => `${p ? "L" : "M"}${X(p, 1)},${f.y(m)}`).join("")}" fill="none" stroke="var(--ooc)" stroke-width="2" stroke-dasharray="7 5"/>` + pm.map((m, p) => `<rect x="${X(p, 1) - 5}" y="${f.y(m) - 5}" width="10" height="10" fill="var(--ooc)"/>`).join("") + f.close;
      $("[data-svg]", el).innerHTML = svg;
      const oor = s.mean(D.flat().map((pos) => Math.max(...pos) - Math.min(...pos))), ttb = s.mean(posm.map((ms) => Math.max(...ms) - Math.min(...ms))), ptp = Math.max(...pm) - Math.min(...pm);
      const fam = [["Out-of-round (within position)", oor], ["Top-to-bottom (within part)", ttb], ["Part-to-part", ptp]], top = fam.reduce((a, b) => (b[1] > a[1] ? b : a));
      $("[data-ro]", el).innerHTML = fam.map(([k, v]) => G.ro(k, (v * 1000).toFixed(1) + " thou", k === "Part-to-part" ? "range of part averages" : "average range", k === top[0])).join("");
      $("[data-msg]", el).innerHTML = key === "t162"
        ? "Part-to-part variation dominates — the casting process. The team held the other ideas (chuck pressure, tooling) because they couldn't touch the biggest family. A new precision foundry was sourced."
        : "With precision castings, part-to-part shrinks and out-of-round is now the largest family. The longest diameter changes angle from part to part, so fixed-orientation chuck pressure can't be the cause — the data killed a favorite theory.";
    }
    $$("[data-k]", el).forEach((b) => b.addEventListener("click", () => { key = b.dataset.k; draw(); }));
    draw();
  };

  C("varfam", {
    title: "Positional, cyclical, or temporal?",
    hint: "Table 16.1. Positional = within a piece or batch; cyclical = piece-to-piece or lot-to-lot; temporal = over time (shift-to-shift).",
    cats: ["Positional (within part)", "Cyclical (part-to-part)", "Temporal (over time)"],
    items: [
      { t: "A shaft is thicker at one end than the other (taper)", a: 0, why: "Within one piece." },
      { t: "Each bore is out of round", a: 0, why: "Within one piece." },
      { t: "Cavity 3 of a four-cavity mold always runs heavy", a: 0, why: "Position within a batch (one shot) — positional." },
      { t: "Consecutive parts differ in diameter", a: 1, why: "Piece-to-piece." },
      { t: "Lot 12 of resin molds differently from lot 13", a: 1, why: "Lot-to-lot." },
      { t: "Parts made on night shift run larger than day shift", a: 2, why: "Shift-to-shift." },
      { t: "Diameter drifts upward through the morning as the machine warms", a: 2, why: "Over time." }
    ]
  });

  /* Correlation and simple regression */
  G.W.regress = (el) => {
    const P = {
      ex: ["Hours of exercise vs weight loss (Table 16.6)", "3, 5, 10, 15, 2, 3", "2, 4, 6, 8, 1, 3", "Hours of exercise", "Weight loss (lb)", 8],
      ex4: ["Exercise minutes vs weight loss (Ch. 13, 4 points)", "30, 45, 60, 75", "1, 2, 4, 4.5", "Exercise (min/day)", "Weight loss (lb)", 60],
      tiny: ["3-point example (p. 281)", "3, 3, 6", "2, 3, 4", "x", "y", 5],
      comp: ["Month vs complaints (Table 16.7)", "1, 2, 3, 4, 5, 6, 7, 8", "8, 6, 10, 6, 10, 13, 9, 11", "Month", "Complaints", 8],
      visc: ["Temperature vs viscosity (p. 288)", "10, 15, 20, 15", "2, 3, 5, 4", "Temperature (°C)", "Viscosity (cP)", 15]
    };
    let key = "ex", x0 = 8, al = 0.05;
    el.innerHTML = `<h4>Correlation and simple linear regression</h4>
      <p class="hint">Least squares: b = Sxy ÷ Sxx, a = ȳ − b·x̄. The t-test of the slope (df = n − 2) is the same test as the t-test of r. Presets are the handbook's examples.</p>
      <div class="row" style="gap:.4rem;margin-bottom:.5rem">${Object.entries(P).map(([k, p]) => `<button type="button" class="btn sm" data-p="${k}">${p[0]}</button>`).join("")}</div>
      <div class="grid2"><label class="field">x values<input type="text" data-x></label><label class="field">y values<input type="text" data-y></label></div>
      <div class="row" style="margin:.5rem 0"><label class="field" style="width:9rem">Predict at x₀<input type="number" step="any" data-x0></label>${alphaSeg(al)}</div>
      <div data-svg></div><div class="readout" data-ro></div><p class="small" data-msg aria-live="polite"></p>`;
    function draw() {
      press("[data-al]", el, (b) => +b.dataset.al === al);
      const x = S().parse($("[data-x]", el).value), y = S().parse($("[data-y]", el).value), n = Math.min(x.length, y.length), s = S();
      if (n < 3) { $("[data-ro]", el).innerHTML = ""; $("[data-svg]", el).innerHTML = ""; $("[data-msg]", el).textContent = "Enter at least three (x, y) pairs."; return; }
      const xs = x.slice(0, n), ys = y.slice(0, n), mx = s.mean(xs), my = s.mean(ys);
      let sxx = 0, sxy = 0, syy = 0; for (let i = 0; i < n; i++) { sxx += (xs[i] - mx) ** 2; sxy += (xs[i] - mx) * (ys[i] - my); syy += (ys[i] - my) ** 2; }
      if (sxx === 0) { $("[data-msg]", el).textContent = "All x values are the same — no slope can be fitted."; return; }
      const b = sxy / sxx, a = my - b * mx, r = syy > 0 ? sxy / Math.sqrt(sxx * syy) : 0, df = n - 2, sse = Math.max(0, syy - b * sxy), se = df > 0 ? Math.sqrt(sse / df) : NaN;
      const seb = se / Math.sqrt(sxx), t = seb > 0 ? b / seb : Infinity, p = df > 0 && isFinite(t) ? 2 * (1 - s.tcdf(Math.abs(t), df)) : 0, tc = s.tinv(1 - al / 2, df);
      const yh = a + b * x0, hci = tc * se * Math.sqrt(1 / n + (x0 - mx) ** 2 / sxx), hpi = tc * se * Math.sqrt(1 + 1 / n + (x0 - mx) ** 2 / sxx);
      const lox = Math.min(...xs, x0), hix = Math.max(...xs, x0), padx = (hix - lox) * 0.08 || 1, xa = lox - padx, xb = hix + padx;
      const band = []; for (let i = 0; i <= 60; i++) { const xx = xa + (i / 60) * (xb - xa), e = tc * se * Math.sqrt(1 + 1 / n + (xx - mx) ** 2 / sxx), c = tc * se * Math.sqrt(1 / n + (xx - mx) ** 2 / sxx); band.push([xx, a + b * xx, c, e]); }
      const lov = Math.min(...ys, ...band.map((q) => q[1] - (isFinite(q[3]) ? q[3] : 0))), hiv = Math.max(...ys, ...band.map((q) => q[1] + (isFinite(q[3]) ? q[3] : 0)));
      const f = G.frame({ W: 640, H: 260, x0: xa, x1: xb, y0: lov - (hiv - lov) * 0.05, y1: hiv + (hiv - lov) * 0.05, label: "Scatter plot with fitted line", xlab: P[key][3], ylab: P[key][4] });
      const poly = (k, sgn) => band.map((q, i) => `${i ? "L" : "M"}${f.x(q[0]).toFixed(1)},${f.y(q[1] + sgn * q[k]).toFixed(1)}`).join("");
      const area = (k) => `${poly(k, 1)} ${band.slice().reverse().map((q) => `L${f.x(q[0]).toFixed(1)},${f.y(q[1] - q[k]).toFixed(1)}`).join("")} Z`;
      $("[data-svg]", el).innerHTML = f.open + f.axes + (isFinite(se) ? `<path d="${area(3)}" fill="var(--c16)" opacity=".1"/><path d="${area(2)}" fill="var(--c16)" opacity=".22"/>` : "")
        + `<line x1="${f.x(xa)}" y1="${f.y(a + b * xa)}" x2="${f.x(xb)}" y2="${f.y(a + b * xb)}" stroke="var(--c16)" stroke-width="2.5"/>`
        + xs.map((v, i) => `<circle cx="${f.x(v)}" cy="${f.y(ys[i])}" r="5" fill="var(--ink)" stroke="#fff" stroke-width="1.5"/>`).join("")
        + `<line x1="${f.x(x0)}" x2="${f.x(x0)}" y1="${f.T}" y2="${f.B}" stroke="var(--limit)" stroke-dasharray="4 4"/><circle cx="${f.x(x0)}" cy="${f.y(yh)}" r="5" fill="var(--limit)"/>`
        + `<text x="${f.R}" y="${f.T + 10}" text-anchor="end" font-size="11" class="t-soft">dark band: CI for the mean · light band: prediction interval</text>` + f.close;
      const dp = 4;
      $("[data-ro]", el).innerHTML = G.ro("Equation", `ŷ = ${G.sig(a, dp)} ${b < 0 ? "−" : "+"} ${G.sig(Math.abs(b), dp)}x`, "least squares", true) + G.ro("r", fmt(r, 4), "Sxy ÷ √(Sxx·Syy)") + G.ro("R²", G.num(r * r * 100, 1) + "%", "share of y variation explained")
        + G.ro("s (residual SD)", G.sig(se, 4), "√(SSE ÷ (n − 2))") + G.ro("Slope t", isFinite(t) ? fmt(t, 3) : "∞", `b ÷ (s/√Sxx), df ${df}`) + G.ro("p-value", df > 0 ? pfmt(p) : "—", `critical ±${fmt(tc, 3)}`, true)
        + G.ro(`ŷ at x₀ = ${x0}`, G.sig(yh, 5), "point prediction") + G.ro(`${100 * (1 - al)}% CI for the mean`, `${G.sig(yh - hci, 4)} to ${G.sig(yh + hci, 4)}`, "average y at x₀") + G.ro(`${100 * (1 - al)}% prediction interval`, `${G.sig(yh - hpi, 4)} to ${G.sig(yh + hpi, 4)}`, "one new y at x₀");
      const extrap = x0 < Math.min(...xs) || x0 > Math.max(...xs);
      $("[data-msg]", el).innerHTML = `${decide(p, al)} ${p > al ? "The slope isn't significantly different from zero, so this line shouldn't be used to predict." : "There is a significant linear relationship — which still isn't proof of cause and effect."}${extrap ? " <b>x₀ is outside the data range: extrapolation.</b>" : ""} The prediction interval is always wider than the CI for the mean.`;
    }
    const load = (k) => { key = k; const p = P[k]; $("[data-x]", el).value = p[1]; $("[data-y]", el).value = p[2]; x0 = p[5]; $("[data-x0]", el).value = x0; draw(); };
    $("[data-x]", el).addEventListener("input", draw); $("[data-y]", el).addEventListener("input", draw);
    $("[data-x0]", el).addEventListener("input", (e) => { x0 = +e.target.value || 0; draw(); });
    $$("[data-al]", el).forEach((b) => b.addEventListener("click", () => { al = +b.dataset.al; draw(); }));
    $$("[data-p]", el).forEach((b) => b.addEventListener("click", () => load(b.dataset.p)));
    load("ex");
  };

  /* Guess r */
  G.W.rguess = (el) => {
    const R = [0.95, -0.8, 0.5, 0, -0.3, 0.75, -0.97, 0.2];
    let i = 0, ans = null;
    el.innerHTML = `<h4><span>Read the scatter: estimate r</span><span class="soft small" data-sc></span></h4><p class="hint">Pick the closest correlation coefficient. Strength is how tightly the points hug a line; sign is the direction.</p><div data-svg></div><div class="chips" data-ch role="group" aria-label="Choose r"></div><p class="small" data-msg aria-live="polite"></p><div class="row"><button type="button" class="btn sm" data-n>Next plot</button></div>`;
    let right = 0, done = 0;
    function draw() {
      const target = R[i % R.length], rnd = G.rng(31 + i * 7), n = 40, xs = [], ys = [];
      for (let k = 0; k < n; k++) { const a = G.gauss(rnd), b = G.gauss(rnd); xs.push(a); ys.push(target * a + Math.sqrt(1 - target * target) * b); }
      const f = G.frame({ W: 360, H: 240, x0: -3, x1: 3, y0: -3, y1: 3, xticks: [], yticks: [], label: "Scatter plot", L: 14, B: 14, wide: false });
      $("[data-svg]", el).innerHTML = `<div style="max-width:380px">${f.open}<rect x="${f.L}" y="${f.T}" width="${f.R - f.L}" height="${f.B - f.T}" fill="none" stroke="var(--rule)"/>${xs.map((v, k) => `<circle cx="${f.x(v)}" cy="${f.y(Math.max(-3, Math.min(3, ys[k])))}" r="4" fill="var(--c16)" opacity=".8"/>`).join("")}${f.close}</div>`;
      const opts = [target, ...[-0.9, -0.5, 0, 0.5, 0.9].filter((v) => Math.abs(v - target) > 0.25).sort((a, b) => Math.abs(a - target) - Math.abs(b - target)).slice(0, 3)].sort((a, b) => a - b);
      ans = null; $("[data-msg]", el).textContent = "";
      $("[data-ch]", el).innerHTML = opts.map((v) => `<button type="button" class="chip" data-v="${v}">r = ${v}</button>`).join("");
      $$("[data-v]", el).forEach((b) => b.addEventListener("click", () => {
        if (ans !== null) return; ans = +b.dataset.v; done++;
        const ok = ans === target; if (ok) right++;
        $$("[data-v]", el).forEach((c) => { c.disabled = true; if (+c.dataset.v === target) c.classList.add("right"); else if (c === b) c.classList.add("wrong"); });
        $("[data-msg]", el).innerHTML = `${ok ? "<b>Right.</b>" : "<b>Not quite.</b>"} Generated with r ≈ ${target}. ${Math.abs(target) < 0.25 ? "No linear pattern — but r near 0 doesn't rule out a curved relationship." : target < 0 ? "Negative: y falls as x rises." : "Positive: y rises with x."}`;
        $("[data-sc]", el).textContent = `${right} of ${done} right`;
      }));
    }
    $("[data-n]", el).addEventListener("click", () => { i++; draw(); });
    draw();
  };

  /* =================== Chapter 17 =================== */
  G.W.testpick = (el) => G.tree(el, {
    q1: { q: "What are you comparing?", opts: [["Means (averages)", "m1"], ["Variances or standard deviations", "v1"], ["Proportions (defective rate, yes/no)", "p1"], ["Counts in categories", "c1"], ["Relationship between two continuous variables", "reg"]] },
    m1: { q: "How many groups?", opts: [["One group against a target value", "m2"], ["Two groups", "m3"], ["Three or more groups", "anova"]] },
    m2: { q: "Is the population σ known?", opts: [["Yes (or n is large)", "z1"], ["No — estimate s from the sample", "t1"]] },
    m3: { q: "Are the two sets of readings paired — the same parts or people measured twice (before/after)?", opts: [["Yes, paired", "pt"], ["No, independent samples", "m4"]] },
    m4: { q: "Can the two variances be assumed equal? (Test with F first.)", opts: [["Yes", "pool"], ["No", "welch"]] },
    v1: { q: "How many groups?", opts: [["One, against a target σ²", "chi1"], ["Two", "f2"]] },
    p1: { q: "How many groups?", opts: [["One, against a target proportion", "p1z"], ["Two or more", "pc"]] },
    c1: { q: "One categorical variable against an expected distribution, or two categorical variables against each other?", opts: [["One variable vs expected proportions", "gof"], ["Two variables in a table — are they independent?", "cont"]] },
    z1: { r: "One-sample Z-test", d: "Z = (x̄ − μ₀) ÷ (σ/√n). Example: vendor's claimed mean 1.84, n 64, x̄ 1.88, σ 0.03 → Z = 10.67, reject." },
    t1: { r: "One-sample t-test", d: "t = (x̄ − μ₀) ÷ (s/√n), df = n − 1. Example: saw blade, n 20, x̄ 4.123, s 0.008, H₁ μ < 4.125 → t = −1.12, critical −1.328 at α 0.10, fail to reject." },
    pt: { r: "Paired t-test", d: "Work with the differences: t = d̄ ÷ (s_d/√n), df = n − 1. It removes part-to-part variation, so it's more sensitive than a two-sample test on the same data." },
    pool: { r: "Two-sample t-test, pooled (equal variances)", d: "s_p = √{[(n₁ − 1)s₁² + (n₂ − 1)s₂²] ÷ (n₁ + n₂ − 2)}, df = n₁ + n₂ − 2." },
    welch: { r: "Two-sample t-test, unequal variances (Welch)", d: "SE = √(s₁²/n₁ + s₂²/n₂). The Satterthwaite df is usually fractional — round it down when using a t-table." },
    anova: { r: "One-way ANOVA", d: "F = MS between ÷ MS within, df (k − 1, N − k). A significant F says at least one mean differs — not which one." },
    chi1: { r: "Chi-square test for one variance", d: "χ² = (n − 1)s² ÷ σ₀², df = n − 1. Its confidence interval isn't symmetric." },
    f2: { r: "F-test for two variances", d: "F = s₁² ÷ s₂² (put the larger variance on top for a right-tail test), df (n₁ − 1, n₂ − 1)." },
    p1z: { r: "One-proportion test (Z approximation or exact binomial)", d: "Z = (p̂ − p₀) ÷ √[p₀(1 − p₀)/n], valid when np₀ and n(1 − p₀) are both at least 5. Otherwise use the exact binomial." },
    pc: { r: "Two-proportion Z-test or a chi-square contingency table", d: "A 2 × k table of pass/fail counts by group is a chi-square test of independence." },
    gof: { r: "Chi-square goodness-of-fit test", d: "χ² = Σ(O − E)² ÷ E, df = k − 1, always right-tailed. Every E ≥ 1 and no more than 20% of E below 5." },
    cont: { r: "Chi-square contingency table (test of independence)", d: "E = row total × column total ÷ grand total; df = (r − 1)(c − 1)." },
    reg: { r: "Correlation / regression t-test", d: "t = r√(n − 2) ÷ √(1 − r²) = b ÷ SE(b), df = n − 2." }
  }, "q1", "Which hypothesis test?", "Answer the questions; the tree ends at the test and its statistic.");

  C("errtypes", {
    title: "α, β, or power?",
    hint: "Type I (α): reject a true H₀ — a false alarm. Type II (β): fail to reject a false H₀ — a miss. Power = 1 − β.",
    cats: ["Type I error (α)", "Type II error (β)", "Power (1 − β)"],
    items: [
      { t: "Concluding the new process is better when it really isn't", a: 0, why: "False alarm — rejecting a true null." },
      { t: "Missing a real shift in the process mean", a: 1, why: "Failing to detect a true difference." },
      { t: "The probability the test detects a real difference of a given size", a: 2, why: "1 − β." },
      { t: "Producer's risk — rejecting a good lot", a: 0, why: "The lot was good (H₀ true) but you rejected it." },
      { t: "Consumer's risk — accepting a bad lot", a: 1, why: "The lot was bad but you accepted it." },
      { t: "The significance level you set before collecting data", a: 0, why: "α is chosen up front." },
      { t: "With power 0.80, the 20% chance of missing a real difference", a: 1, why: "β = 0.20. The handbook (p. 300) wrongly calls this the chance of finding a difference that doesn't exist — that's α." },
      { t: "A control chart point beyond the limits when nothing has changed", a: 0, why: "A false signal — Type I." }
    ]
  });

  /* Power and sample size */
  G.W.power = (el) => {
    let sd = 0.03, delta = 0.04, n = 6, al = 0.05, target = 0.9;
    el.innerHTML = `<h4>Power and sample size (one-sample Z, two-sided)</h4>
      <p class="hint">The left curve is where x̄ falls if H₀ is true; the right curve, if the mean really shifted by δ. Red = α (false alarm); amber = β (miss); power = the rest of the right curve.</p>
      <div class="row" style="gap:.4rem;margin-bottom:.5rem"><button type="button" class="btn sm" data-p="hb">Handbook: σ 0.03, δ 0.04 (1.88 − 1.84)</button></div>
      <div class="grid2">
        <label class="field">σ <output data-o="s"></output><input type="range" min="0.01" max="0.08" step="0.005" value="${sd}" data-s></label>
        <label class="field">Difference to detect δ <output data-o="d"></output><input type="range" min="0.005" max="0.08" step="0.005" value="${delta}" data-d></label>
        <label class="field">Sample size n <output data-o="n"></output><input type="range" min="2" max="40" step="1" value="${n}" data-n></label>
        <label class="field">Target power <output data-o="t"></output><input type="range" min="0.5" max="0.99" step="0.01" value="${target}" data-t></label>
      </div>
      <div class="row" style="margin:.4rem 0">${alphaSeg(al)}</div>
      <div data-svg></div><div class="readout" data-ro></div><p class="small" data-msg aria-live="polite"></p>`;
    const sync = () => { $("[data-s]", el).value = sd; $("[data-d]", el).value = delta; $("[data-n]", el).value = n; $("[data-t]", el).value = target; };
    function draw() {
      press("[data-al]", el, (b) => +b.dataset.al === al);
      $("[data-o=s]", el).textContent = sd.toFixed(3); $("[data-o=d]", el).textContent = delta.toFixed(3); $("[data-o=n]", el).textContent = n; $("[data-o=t]", el).textContent = target.toFixed(2);
      const se = sd / Math.sqrt(n), z = S().ninv(1 - al / 2), c = z * se, pw = G.upperTail(z - delta / se) + G.Phi(-z - delta / se);
      const need = Math.ceil(Math.pow(((z + S().ninv(target)) * sd) / delta, 2));
      const x0 = -4 * se, x1 = delta + 4 * se, f = G.frame({ W: 640, H: 220, x0, x1, y0: 0, y1: 1.15, yticks: [], label: "Sampling distributions under H0 and H1", xlab: "x̄ − μ₀", xf: (v) => G.sig(v, 3) });
      const g = (mu) => (x) => Math.exp(-0.5 * ((x - mu) / se) ** 2), pts = (fn, a, b) => { const o = []; for (let i = 0; i <= 160; i++) { const x = a + (i / 160) * (b - a); o.push([x, fn(x)]); } return o; };
      const area = (fn, a, b, col, op) => { const p = pts(fn, Math.max(a, x0), Math.min(b, x1)); return p.length > 1 && b > a ? `<path d="M${f.x(p[0][0])},${f.B} ${p.map(([x, y]) => `L${f.x(x).toFixed(1)},${f.y(y).toFixed(1)}`).join("")} L${f.x(p[p.length - 1][0])},${f.B} Z" fill="${col}" opacity="${op}"/>` : ""; };
      const line = (fn, col) => `<path d="${pts(fn, x0, x1).map(([x, y], i) => `${i ? "L" : "M"}${f.x(x).toFixed(1)},${f.y(y).toFixed(1)}`).join("")}" fill="none" stroke="${col}" stroke-width="2"/>`;
      $("[data-svg]", el).innerHTML = f.open + f.axes + area(g(delta), c, x1, "var(--belt)", 0.25) + area(g(delta), -c, c, "var(--limit)", 0.4) + area(g(0), c, x1, "var(--ooc)", 0.55) + area(g(0), x0, -c, "var(--ooc)", 0.55)
        + line(g(0), "var(--ink)") + line(g(delta), "var(--c17)") + `<line x1="${f.x(c)}" x2="${f.x(c)}" y1="${f.T}" y2="${f.B}" stroke="var(--ooc)" stroke-dasharray="4 3"/>`
        + `<text x="${f.x(0)}" y="${f.y(1.04)}" text-anchor="middle" font-size="11.5">H₀</text><text x="${f.x(delta)}" y="${f.y(1.04)}" text-anchor="middle" font-size="11.5" fill="var(--c17)">H₁: shift δ</text>` + f.close;
      $("[data-ro]", el).innerHTML = G.ro("Power", fmt(pw, 3), `1 − β at n = ${n}`, true) + G.ro("β", fmt(1 - pw, 3), "chance of missing δ") + G.ro("α", al, "chance of a false alarm") + G.ro(`n for power ${target.toFixed(2)}`, need, "⌈((Z₁₋α/₂ + Z_power)σ ÷ δ)²⌉", true);
      $("[data-msg]", el).innerHTML = `Power rises when n or δ goes up, or when σ goes down or α goes up. With the handbook's inputs, n = 6 gives power 0.904 (Figure 17.4). ${pw < 0.8 ? "<b>Below 0.80</b> — the usual minimum before trusting a “no difference” result." : ""}`;
    }
    $("[data-s]", el).addEventListener("input", (e) => { sd = +e.target.value; draw(); });
    $("[data-d]", el).addEventListener("input", (e) => { delta = +e.target.value; draw(); });
    $("[data-n]", el).addEventListener("input", (e) => { n = +e.target.value; draw(); });
    $("[data-t]", el).addEventListener("input", (e) => { target = +e.target.value; draw(); });
    $$("[data-al]", el).forEach((b) => b.addEventListener("click", () => { al = +b.dataset.al; draw(); }));
    $("[data-p]", el).addEventListener("click", () => { sd = 0.03; delta = 0.04; n = 6; al = 0.05; target = 0.9; sync(); draw(); });
    draw();
  };

  G.W.ssize = (el) => {
    let z = 1.96, s = 35, E = 10;
    el.innerHTML = `<h4>Sample size to estimate a mean</h4>
      <p class="hint">n = (Z·σ ÷ E)², always rounded <b>up</b>. E is the margin (or shift) you want to detect — not the process mean.</p>
      <div class="grid3"><label class="field">Confidence<select data-z><option value="1.645">90%</option><option value="1.96" selected>95%</option><option value="2.576">99%</option></select></label>
      <label class="field">σ<input type="number" min="0" step="any" value="${s}" data-s></label><label class="field">E (margin to detect)<input type="number" min="0" step="any" value="${E}" data-e></label></div>
      <div class="readout" data-ro></div><p class="small" data-msg></p>`;
    function draw() {
      const raw = Math.pow((z * s) / E, 2);
      $("[data-ro]", el).innerHTML = G.ro("(Zσ/E)²", G.num(raw, 2)) + G.ro("Sample size", isFinite(raw) ? Math.ceil(raw - 1e-9) : "—", "round up", true);
      $("[data-msg]", el).innerHTML = "Shipyard example (p. 299): Z 1.96, σ 35 tons, E 10 tons → 47.06 → <b>48</b>. The handbook prints 470.59 — an arithmetic slip (3.8416 × 1225 ÷ 100 = 47.06). Its text also switches to 8 tons, which would need 74. Halving E quadruples n.";
    }
    $("[data-z]", el).addEventListener("input", (e) => { z = +e.target.value; draw(); });
    $("[data-s]", el).addEventListener("input", (e) => { s = Math.max(0, +e.target.value || 0); draw(); });
    $("[data-e]", el).addEventListener("input", (e) => { E = Math.max(1e-9, +e.target.value || 0); draw(); });
    draw();
  };

  /* Tests of means */
  G.W.meantest = (el) => {
    const CNC1 = "5.257, 5.220, 5.235, 5.230, 5.225", CNC2 = "5.243, 5.193, 5.225, 5.220, 5.223";
    const P = {
      z: { mode: "z", m: 1.88, s: 0.03, n: 64, mu: 1.84, alt: "ne", al: 0.05, lab: "Vendor's claim μ = 1.84 (Z)" },
      t: { mode: "t", m: 4.123, s: 0.008, n: 20, mu: 4.125, alt: "lt", al: 0.1, lab: "Saw blade: has the mean dropped? (t)" },
      pool: { mode: "pool", a: CNC1, b: CNC2, alt: "ne", al: 0.05, lab: "CNC 1 vs CNC 2, pooled" },
      welch: { mode: "welch", a: CNC1, b: CNC2, alt: "ne", al: 0.05, lab: "Same data, unequal variances" },
      paired: { mode: "paired", a: CNC1, b: CNC2, alt: "ne", al: 0.05, lab: "Same numbers as before/after calibration (paired)" }
    };
    const st = { ...P.z, a: CNC1, b: CNC2 };
    el.innerHTML = `<h4>Tests for means</h4>
      <div class="row" style="gap:.4rem;margin-bottom:.5rem">${Object.entries(P).map(([k, p]) => `<button type="button" class="btn sm" data-p="${k}">${p.lab}</button>`).join("")}</div>
      <div class="row" style="margin-bottom:.5rem"><span class="seg" role="group" aria-label="Test">${[["z", "1-sample Z"], ["t", "1-sample t"], ["pool", "2-sample pooled t"], ["welch", "2-sample Welch t"], ["paired", "Paired t"]].map(([k, l]) => `<button type="button" data-m="${k}">${l}</button>`).join("")}</span></div>
      <div data-in></div><div class="row" style="margin:.5rem 0" data-ah></div>
      <div data-svg></div><div class="readout" data-ro></div><p class="small" data-msg aria-live="polite"></p>`;
    function inputs() {
      press("[data-m]", el, (b) => b.dataset.m === st.mode);
      const one = st.mode === "z" || st.mode === "t";
      $("[data-in]", el).innerHTML = one
        ? `<div class="grid3"><label class="field">Sample mean x̄<input type="number" step="any" data-f="m" value="${st.m}"></label><label class="field">${st.mode === "z" ? "Population σ" : "Sample s"}<input type="number" step="any" min="0" data-f="s" value="${st.s}"></label><label class="field">n<input type="number" min="2" data-f="n" value="${st.n}"></label><label class="field">Hypothesized μ₀<input type="number" step="any" data-f="mu" value="${st.mu}"></label></div>`
        : `<div class="grid2"><label class="field">${st.mode === "paired" ? "Before" : "Sample 1"}<input type="text" data-f="a" value="${st.a}"></label><label class="field">${st.mode === "paired" ? "After (same parts, same order)" : "Sample 2"}<input type="text" data-f="b" value="${st.b}"></label></div>`;
      $("[data-ah]", el).innerHTML = altSeg(st.alt) + alphaSeg(st.al);
      $$("[data-f]", el).forEach((i) => i.addEventListener("input", () => { const k = i.dataset.f; st[k] = i.type === "number" ? +i.value : i.value; draw(); }));
      $$("[data-alt]", el).forEach((b) => b.addEventListener("click", () => { st.alt = b.dataset.alt; press("[data-alt]", el, (x) => x === b); draw(); }));
      $$("[data-al]", el).forEach((b) => b.addEventListener("click", () => { st.al = +b.dataset.al; press("[data-al]", el, (x) => x === b); draw(); }));
      draw();
    }
    function draw() {
      const s = S(); let stat, df = Infinity, se, est, ro = "", note = "";
      if (st.mode === "z" || st.mode === "t") {
        const n = Math.max(2, Math.round(st.n)); se = st.s / Math.sqrt(n); est = st.m - st.mu; stat = est / se; if (st.mode === "t") df = n - 1;
        ro = G.ro("Standard error", G.sig(se, 4), `${st.mode === "z" ? "σ" : "s"}/√n`);
      } else {
        const a = s.parse(st.a), b = s.parse(st.b);
        if (a.length < 2 || b.length < 2 || (st.mode === "paired" && a.length !== b.length)) { $("[data-ro]", el).innerHTML = ""; $("[data-svg]", el).innerHTML = ""; $("[data-msg]", el).textContent = st.mode === "paired" ? "Paired data need the same number of values in each box, in matching order." : "Enter at least two values in each sample."; return; }
        const m1 = s.mean(a), m2 = s.mean(b), s1 = s.sd(a), s2 = s.sd(b), n1 = a.length, n2 = b.length;
        if (st.mode === "paired") { const d = a.map((v, i) => v - b[i]), sd = s.sd(d); est = s.mean(d); se = sd / Math.sqrt(n1); df = n1 - 1; ro = G.ro("Mean difference d̄", G.sig(est, 4)) + G.ro("s of differences", G.sig(sd, 4)) + G.ro("Standard error", G.sig(se, 4), "s_d/√n"); }
        else if (st.mode === "pool") { const sp = Math.sqrt(((n1 - 1) * s1 * s1 + (n2 - 1) * s2 * s2) / (n1 + n2 - 2)); est = m1 - m2; se = sp * Math.sqrt(1 / n1 + 1 / n2); df = n1 + n2 - 2; ro = G.ro("Means", `${G.sig(m1, 6)} vs ${G.sig(m2, 6)}`) + G.ro("s₁, s₂", `${G.sig(s1, 3)}, ${G.sig(s2, 3)}`) + G.ro("Pooled s_p", G.sig(sp, 4)); }
        else { const v1 = (s1 * s1) / n1, v2 = (s2 * s2) / n2; est = m1 - m2; se = Math.sqrt(v1 + v2); const dfw = (v1 + v2) ** 2 / (v1 * v1 / (n1 - 1) + v2 * v2 / (n2 - 1)); df = Math.max(1, Math.floor(dfw)); ro = G.ro("Means", `${G.sig(m1, 6)} vs ${G.sig(m2, 6)}`) + G.ro("s₁, s₂", `${G.sig(s1, 3)}, ${G.sig(s2, 3)}`) + G.ro("Welch df", G.num(dfw, 2), `rounded down to ${df}, as software does`); }
        stat = est / se;
      }
      const isZ = !isFinite(df), cdf = isZ ? G.Phi : (x) => s.tcdf(x, df), inv = isZ ? s.ninv : (p) => s.tinv(p, df);
      const { p, crit } = sym(stat, st.alt, st.al, cdf, inv), c2 = inv(1 - st.al / 2), ci = [est - c2 * se, est + c2 * se];
      const lim = Math.max(4.2, Math.min(Math.abs(stat) + 1, 12));
      $("[data-svg]", el).innerHTML = curveSVG(isZ ? s.npdf : (x) => s.tpdf(x, df), -lim, lim, stat, st.alt, st.al, inv, isZ ? "Standard normal" : `t with ${G.num(df, 2)} df`);
      $("[data-ro]", el).innerHTML = ro + G.ro(isZ ? "Z" : "t", fmt(stat, 3), isZ ? "" : `df ${Number.isInteger(df) ? df : G.num(df, 2)}`, true) + G.ro("Critical value", crit, `α = ${st.al}`) + G.ro("p-value", pfmt(p), "", true) + G.ro(`${Math.round(100 * (1 - st.al))}% CI`, `${G.sig(ci[0], 4)} to ${G.sig(ci[1], 4)}`, st.mode === "z" || st.mode === "t" ? "for μ − μ₀" : "for the difference");
      if (st.mode === "pool") note = " Same data analyzed as <b>paired</b> give t = 3.08, p = 0.037 — significant. Pairing removes part-to-part variation. The handbook's text calls this example a paired test but computes this pooled one.";
      if (st.mode === "welch") note = " The handbook rounds 7.63 up to 8 df “to increase confidence” — round <b>down</b> (7, critical 2.365): fewer df is the conservative choice, and the software shows DF = 7.";
      if (st.mode === "paired") note = " A paired test can be one- or two-sided — the handbook's “always two-tailed” is wrong.";
      $("[data-msg]", el).innerHTML = decide(p, st.al) + note;
    }
    $$("[data-m]", el).forEach((b) => b.addEventListener("click", () => { st.mode = b.dataset.m; inputs(); }));
    $$("[data-p]", el).forEach((b) => b.addEventListener("click", () => { Object.assign(st, P[b.dataset.p]); inputs(); }));
    inputs();
  };

  /* Tests of variances */
  G.W.vartest = (el) => {
    const st = { mode: "chi", n: 35, v: 46, v0: 36, alt: "ne", al: 0.05, s1: 1800, n1: 8, s2: 600, n2: 6 };
    el.innerHTML = `<h4>Tests for variances</h4>
      <div class="row" style="gap:.4rem;margin-bottom:.5rem"><button type="button" class="btn sm" data-p="chi">One variance: s² 46 vs 36, n 35</button><button type="button" class="btn sm" data-p="f">Two variances: pickle crispness</button></div>
      <div class="row" style="margin-bottom:.5rem"><span class="seg" role="group" aria-label="Test"><button type="button" data-m="chi">χ² — one variance</button><button type="button" data-m="f">F — two variances</button></span></div>
      <div data-in></div><div class="row" style="margin:.5rem 0" data-ah></div><div data-svg></div><div class="readout" data-ro></div><p class="small" data-msg aria-live="polite"></p>`;
    function inputs() {
      press("[data-m]", el, (b) => b.dataset.m === st.mode);
      $("[data-in]", el).innerHTML = st.mode === "chi"
        ? `<div class="grid3"><label class="field">n<input type="number" min="2" data-f="n" value="${st.n}"></label><label class="field">Sample variance s²<input type="number" step="any" min="0" data-f="v" value="${st.v}"></label><label class="field">Hypothesized σ₀²<input type="number" step="any" min="0" data-f="v0" value="${st.v0}"></label></div>`
        : `<div class="grid2"><label class="field">s₁ (initial)<input type="number" step="any" min="0" data-f="s1" value="${st.s1}"></label><label class="field">n₁<input type="number" min="2" data-f="n1" value="${st.n1}"></label><label class="field">s₂ (after aging)<input type="number" step="any" min="0" data-f="s2" value="${st.s2}"></label><label class="field">n₂<input type="number" min="2" data-f="n2" value="${st.n2}"></label></div>`;
      $("[data-ah]", el).innerHTML = altSeg(st.alt) + alphaSeg(st.al);
      $$("[data-f]", el).forEach((i) => i.addEventListener("input", () => { st[i.dataset.f] = +i.value; draw(); }));
      $$("[data-alt]", el).forEach((b) => b.addEventListener("click", () => { st.alt = b.dataset.alt; press("[data-alt]", el, (x) => x === b); draw(); }));
      $$("[data-al]", el).forEach((b) => b.addEventListener("click", () => { st.al = +b.dataset.al; press("[data-al]", el, (x) => x === b); draw(); }));
      draw();
    }
    function draw() {
      const s = S(), a = st.al;
      if (st.mode === "chi") {
        const df = Math.max(1, Math.round(st.n) - 1), x = (df * st.v) / st.v0, cdf = s.chi2cdf(x, df);
        const p = st.alt === "ne" ? Math.min(1, 2 * Math.min(cdf, 1 - cdf)) : st.alt === "lt" ? cdf : 1 - cdf;
        const lo = s.chi2inv(a / 2, df), hi = s.chi2inv(1 - a / 2, df), ci = [(df * st.v) / hi, (df * st.v) / lo];
        const crit = st.alt === "ne" ? `${fmt(lo, 2)} and ${fmt(hi, 2)}` : st.alt === "lt" ? fmt(s.chi2inv(a, df), 2) : fmt(s.chi2inv(1 - a, df), 2);
        const x1 = Math.max(x * 1.15, df + 5 * Math.sqrt(2 * df)), pts = []; for (let i = 0; i <= 200; i++) pts.push(0.001 + (i / 200) * x1);
        const f = G.frame({ W: 640, H: 180, x0: 0, x1, y0: 0, y1: Math.max(...pts.map((v) => s.chi2pdf(v, df))) * 1.15, yticks: [], label: "Chi-square distribution", B: 30 });
        const shade = (c) => { const q = pts.filter(c); return q.length ? `<path d="M${f.x(q[0])},${f.B} ${q.map((v) => `L${f.x(v).toFixed(1)},${f.y(s.chi2pdf(v, df)).toFixed(1)}`).join("")} L${f.x(q[q.length - 1])},${f.B} Z" fill="var(--ooc)" opacity=".35"/>` : ""; };
        const rej = st.alt === "ne" ? shade((v) => v <= lo) + shade((v) => v >= hi) : st.alt === "lt" ? shade((v) => v <= s.chi2inv(a, df)) : shade((v) => v >= s.chi2inv(1 - a, df));
        $("[data-svg]", el).innerHTML = f.open + f.axes + rej + `<path d="${pts.map((v, i) => `${i ? "L" : "M"}${f.x(v).toFixed(1)},${f.y(s.chi2pdf(v, df)).toFixed(1)}`).join("")}" fill="none" stroke="var(--ink)" stroke-width="2"/><line x1="${f.x(x)}" x2="${f.x(x)}" y1="${f.T}" y2="${f.B}" stroke="var(--c17)" stroke-width="3"/>` + f.close;
        $("[data-ro]", el).innerHTML = G.ro("χ²", fmt(x, 2), `(n − 1)s² ÷ σ₀², df ${df}`, true) + G.ro("Critical", crit, `α = ${a}`) + G.ro("p-value", pfmt(p), "", true) + G.ro(`${Math.round(100 * (1 - a))}% CI for σ²`, `${fmt(ci[0], 2)} to ${fmt(ci[1], 2)}`, "not symmetric about s²") + G.ro("CI for σ", `${fmt(Math.sqrt(ci[0]), 2)} to ${fmt(Math.sqrt(ci[1]), 2)}`);
        $("[data-msg]", el).innerHTML = decide(p, a) + " The CI divides by the <i>upper</i> χ² value to get the <i>lower</i> limit. Handbook check: 90% CI = 34 × 46 ÷ 48.60 to 34 × 46 ÷ 21.66 = 32.18 to 72.21.";
      } else {
        const d1 = Math.max(1, Math.round(st.n1) - 1), d2 = Math.max(1, Math.round(st.n2) - 1), F = (st.s1 * st.s1) / (st.s2 * st.s2), cdf = s.fcdf(F, d1, d2);
        const p = st.alt === "ne" ? Math.min(1, 2 * Math.min(cdf, 1 - cdf)) : st.alt === "lt" ? cdf : 1 - cdf;
        const crit = st.alt === "ne" ? `${fmt(s.finv(a / 2, d1, d2), 3)} and ${fmt(s.finv(1 - a / 2, d1, d2), 3)}` : st.alt === "lt" ? fmt(s.finv(a, d1, d2), 3) : fmt(s.finv(1 - a, d1, d2), 3);
        const x1 = Math.max(6, Math.min(F * 1.15, 30)), pts = []; for (let i = 0; i <= 200; i++) pts.push(0.01 + (i / 200) * x1);
        const f = G.frame({ W: 640, H: 180, x0: 0, x1, y0: 0, y1: Math.max(...pts.map((v) => s.fpdf(v, d1, d2))) * 1.15, yticks: [], label: "F distribution", B: 30 });
        const cr = st.alt === "gt" ? s.finv(1 - a, d1, d2) : st.alt === "ne" ? s.finv(1 - a / 2, d1, d2) : null, cl = st.alt === "lt" ? s.finv(a, d1, d2) : st.alt === "ne" ? s.finv(a / 2, d1, d2) : null;
        const shade = (c) => { const q = pts.filter(c); return q.length ? `<path d="M${f.x(q[0])},${f.B} ${q.map((v) => `L${f.x(v).toFixed(1)},${f.y(s.fpdf(v, d1, d2)).toFixed(1)}`).join("")} L${f.x(q[q.length - 1])},${f.B} Z" fill="var(--ooc)" opacity=".35"/>` : ""; };
        $("[data-svg]", el).innerHTML = f.open + f.axes + (cr ? shade((v) => v >= cr) : "") + (cl ? shade((v) => v <= cl) : "") + `<path d="${pts.map((v, i) => `${i ? "L" : "M"}${f.x(v).toFixed(1)},${f.y(s.fpdf(v, d1, d2)).toFixed(1)}`).join("")}" fill="none" stroke="var(--ink)" stroke-width="2"/><line x1="${f.x(Math.min(F, x1))}" x2="${f.x(Math.min(F, x1))}" y1="${f.T}" y2="${f.B}" stroke="var(--c17)" stroke-width="3"/>` + f.close;
        $("[data-ro]", el).innerHTML = G.ro("F", fmt(F, 3), `s₁² ÷ s₂², df (${d1}, ${d2})`, true) + G.ro("Critical", crit, `α = ${a}`) + G.ro("p-value", pfmt(p), "", true);
        $("[data-msg]", el).innerHTML = decide(p, a) + " Pickle example: H₁ is that variance fell after aging, so the test is right-tailed with the initial variance on top: F = 1800² ÷ 600² = 9 > F(0.05; 7, 5) = 4.88.";
      }
    }
    $$("[data-m]", el).forEach((b) => b.addEventListener("click", () => { st.mode = b.dataset.m; st.alt = st.mode === "f" ? "gt" : "ne"; inputs(); }));
    $$("[data-p]", el).forEach((b) => b.addEventListener("click", () => { Object.assign(st, b.dataset.p === "chi" ? { mode: "chi", n: 35, v: 46, v0: 36, alt: "ne", al: 0.05 } : { mode: "f", s1: 1800, n1: 8, s2: 600, n2: 6, alt: "gt", al: 0.05 }); inputs(); }));
    inputs();
  };

  /* Test and CI for one proportion */
  G.W.proptest = (el) => {
    const P = { b: ["Supplier B: 15 of 100 vs 10%", 15, 100, 0.1, "ne", 0.05], v: ["Vendor: 15 of 500 vs ≤ 2%", 15, 500, 0.02, "gt", 0.05], f: ["Female shoppers: 110 of 175 (90% CI)", 110, 175, 0.5, "ne", 0.1] };
    let [, x, n, p0, alt, al] = P.b;
    el.innerHTML = `<h4>One proportion: test and confidence interval</h4>
      <div class="row" style="gap:.4rem;margin-bottom:.5rem">${Object.entries(P).map(([k, p]) => `<button type="button" class="btn sm" data-p="${k}">${p[0]}</button>`).join("")}</div>
      <div class="grid3"><label class="field">Count x<input type="number" min="0" data-x></label><label class="field">Sample size n<input type="number" min="1" data-n></label><label class="field">Hypothesized p₀<input type="number" min="0" max="1" step="0.01" data-p0></label></div>
      <div class="row" style="margin:.5rem 0" data-ah></div><div class="readout" data-ro></div><p class="small" data-msg aria-live="polite"></p>`;
    const sync = () => { $("[data-x]", el).value = x; $("[data-n]", el).value = n; $("[data-p0]", el).value = p0; $("[data-ah]", el).innerHTML = altSeg(alt) + alphaSeg(al);
      $$("[data-alt]", el).forEach((b) => b.addEventListener("click", () => { alt = b.dataset.alt; press("[data-alt]", el, (q) => q === b); draw(); }));
      $$("[data-al]", el).forEach((b) => b.addEventListener("click", () => { al = +b.dataset.al; press("[data-al]", el, (q) => q === b); draw(); })); };
    function draw() {
      const s = S(); if (x > n || n < 1) { $("[data-msg]", el).textContent = "x can't exceed n."; return; }
      const ph = x / n, se0 = Math.sqrt((p0 * (1 - p0)) / n), z = (ph - p0) / se0, { p } = sym(z, alt, al, G.Phi, s.ninv);
      const pm = []; for (let k = 0; k <= n; k++) pm.push(s.binompmf(k, n, p0));
      const up = pm.slice(x).reduce((a, b) => a + b, 0), lo = pm.slice(0, x + 1).reduce((a, b) => a + b, 0), mir = Math.floor(2 * n * p0 - x + 1e-9), mir2 = Math.ceil(2 * n * p0 - x - 1e-9);
      const ex2 = x >= n * p0 ? up + (mir >= 0 ? pm.slice(0, mir + 1).reduce((a, b) => a + b, 0) : 0) : lo + (mir2 <= n ? pm.slice(Math.max(0, mir2)).reduce((a, b) => a + b, 0) : 0);
      const ex = alt === "ne" ? Math.min(1, ex2) : alt === "gt" ? up : lo, zc = s.ninv(1 - al / 2), w = zc * Math.sqrt((ph * (1 - ph)) / n), [cl, ch] = G.clopper(x, n);
      const ok = n * p0 >= 5 && n * (1 - p0) >= 5;
      $("[data-ro]", el).innerHTML = G.ro("p̂", fmt(ph, 4), "x ÷ n") + G.ro("Z", fmt(z, 3), "(p̂ − p₀) ÷ √[p₀(1 − p₀)/n]", true) + G.ro("p-value (normal)", pfmt(p), ok ? "np₀ and n(1 − p₀) ≥ 5" : "approximation shaky") + G.ro("p-value (exact binomial)", pfmt(ex), alt === "ne" ? "both tails" : "one tail", !ok)
        + G.ro(`${Math.round(100 * (1 - al))}% CI (normal)`, `${fmt(ph - w, 3)} to ${fmt(ph + w, 3)}`, "p̂ ± Z√[p̂(1 − p̂)/n]") + G.ro("95% CI (exact)", `${fmt(cl, 4)} to ${fmt(ch, 4)}`, "Clopper-Pearson");
      $("[data-msg]", el).innerHTML = decide(alt === "ne" || !ok ? ex : p, al) + " Note the test uses p₀ in the standard error; the confidence interval uses p̂. The handbook's supplier conclusion “no difference between suppliers” overstates a fail-to-reject.";
    }
    $("[data-x]", el).addEventListener("input", (e) => { x = Math.max(0, Math.round(+e.target.value) || 0); draw(); });
    $("[data-n]", el).addEventListener("input", (e) => { n = Math.max(1, Math.round(+e.target.value) || 1); draw(); });
    $("[data-p0]", el).addEventListener("input", (e) => { p0 = Math.min(0.999, Math.max(0.001, +e.target.value || 0.001)); draw(); });
    $$("[data-p]", el).forEach((b) => b.addEventListener("click", () => { [, x, n, p0, alt, al] = P[b.dataset.p]; sync(); draw(); }));
    sync(); draw();
  };

  /* Chi-square: goodness of fit and contingency tables */
  G.W.chisq = (el) => {
    let mode = "gof";
    const gof = { cats: ["Paint run", "Paint blister", "Decal crooked", "Door cracked"], o: [27, 60, 100, 21], p: [0.16, 0.28, 0.42, 0.14] };
    const ct = { rows: ["3 hours/day", "5 hours/day"], cols: ["Age 13–18", "Age 21–35"], o: [[21, 31], [29, 19]] };
    el.innerHTML = `<h4><span>Chi-square tests</span><span class="seg" role="group" aria-label="Test"><button type="button" data-m="gof">Goodness of fit</button><button type="button" data-m="ct">Contingency table</button></span></h4>
      <p class="hint" data-hint></p><div data-in></div><div data-svg style="margin-top:.6rem"></div><div class="readout" data-ro></div><p class="small" data-msg aria-live="polite"></p>`;
    function inputs() {
      press("[data-m]", el, (b) => b.dataset.m === mode);
      if (mode === "gof") {
        $("[data-hint]", el).innerHTML = "Rejected parts by defect type this week vs the historical mix (p. 324). Edit the counts or proportions.";
        $("[data-in]", el).innerHTML = `<div class="tbl-wrap"><table class="tbl"><thead><tr><th scope="col">Category</th><th scope="col" class="num">Observed</th><th scope="col" class="num">Historical proportion</th></tr></thead><tbody>${gof.cats.map((c, i) => `<tr><th scope="row">${c}</th><td class="num"><input type="number" min="0" style="width:6rem" data-o="${i}" value="${gof.o[i]}" aria-label="Observed ${c}"></td><td class="num"><input type="number" min="0" max="1" step="0.01" style="width:6rem" data-pp="${i}" value="${gof.p[i]}" aria-label="Proportion ${c}"></td></tr>`).join("")}</tbody></table></div>`;
        $$("[data-o]", el).forEach((i) => i.addEventListener("input", () => { gof.o[+i.dataset.o] = Math.max(0, +i.value || 0); draw(); }));
        $$("[data-pp]", el).forEach((i) => i.addEventListener("input", () => { gof.p[+i.dataset.pp] = Math.max(0, +i.value || 0); draw(); }));
      } else {
        $("[data-hint]", el).innerHTML = "Social networking hours by age group, 100 people (p. 202). Expected = row total × column total ÷ grand total.";
        $("[data-in]", el).innerHTML = `<div class="tbl-wrap"><table class="tbl" style="max-width:30rem"><thead><tr><th scope="col"></th>${ct.cols.map((c) => `<th scope="col" class="num">${c}</th>`).join("")}</tr></thead><tbody>${ct.rows.map((r, i) => `<tr><th scope="row">${r}</th>${ct.cols.map((c, j) => `<td class="num"><input type="number" min="0" style="width:5rem" data-c="${i},${j}" value="${ct.o[i][j]}" aria-label="${r}, ${c}"></td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
        $$("[data-c]", el).forEach((i) => i.addEventListener("input", () => { const [r, c] = i.dataset.c.split(",").map(Number); ct.o[r][c] = Math.max(0, +i.value || 0); draw(); }));
      }
      draw();
    }
    function draw() {
      const s = S(); let chi = 0, df, cells = [], warn = "";
      if (mode === "gof") {
        const N = gof.o.reduce((a, b) => a + b, 0), ps = gof.p.reduce((a, b) => a + b, 0);
        cells = gof.cats.map((c, i) => { const E = (N * gof.p[i]) / (ps || 1); const k = E > 0 ? (gof.o[i] - E) ** 2 / E : 0; chi += k; return [c, gof.o[i], E, k]; });
        df = gof.cats.length - 1; if (Math.abs(ps - 1) > 0.005) warn = ` Proportions add to ${G.num(ps, 3)}; they've been rescaled to 1.`;
      } else {
        const R = ct.o.map((r) => r.reduce((a, b) => a + b, 0)), Cc = ct.cols.map((_, j) => ct.o.reduce((a, r) => a + r[j], 0)), N = R.reduce((a, b) => a + b, 0);
        ct.rows.forEach((r, i) => ct.cols.forEach((c, j) => { const E = (R[i] * Cc[j]) / N, k = E > 0 ? (ct.o[i][j] - E) ** 2 / E : 0; chi += k; cells.push([`${r} · ${c}`, ct.o[i][j], E, k]); }));
        df = (ct.rows.length - 1) * (ct.cols.length - 1);
      }
      const p = 1 - s.chi2cdf(chi, df), crit = s.chi2inv(0.95, df), lowE = cells.filter((c) => c[2] < 5).length, bad1 = cells.some((c) => c[2] < 1);
      const mx = Math.max(...cells.map((c) => Math.max(c[1], c[2]))) * 1.1, W = 640, H = 200, L = 44, R2 = W - 10, T = 12, B = H - 40, gw = (R2 - L) / cells.length, y = (v) => B - (v / mx) * (B - T);
      $("[data-svg]", el).innerHTML = `<div class="vizscroll"><svg class="viz wide" viewBox="0 0 ${W} ${H}" role="img" aria-label="Observed vs expected counts">${G.nice(0, mx, 4).map((v) => `<line x1="${L}" x2="${R2}" y1="${y(v)}" y2="${y(v)}" stroke="var(--rule-soft)"/><text x="${L - 6}" y="${y(v) + 4}" text-anchor="end" font-size="11" class="t-soft">${v}</text>`).join("")}
        ${cells.map((c, i) => { const x0 = L + i * gw, bw = Math.min(34, gw / 3); return `<rect x="${x0 + gw / 2 - bw - 1}" y="${y(c[1])}" width="${bw}" height="${B - y(c[1])}" rx="3" fill="var(--c17)"/><rect x="${x0 + gw / 2 + 1}" y="${y(c[2])}" width="${bw}" height="${B - y(c[2])}" rx="3" fill="#C9CEC4"/><text x="${x0 + gw / 2}" y="${B + 15}" text-anchor="middle" font-size="10.5">${c[0].length > 18 ? c[0].slice(0, 17) + "…" : c[0]}</text>`; }).join("")}
        <rect x="${L}" y="${H - 14}" width="12" height="10" fill="var(--c17)"/><text x="${L + 16}" y="${H - 5}" font-size="11">Observed</text><rect x="${L + 90}" y="${H - 14}" width="12" height="10" fill="#C9CEC4"/><text x="${L + 106}" y="${H - 5}" font-size="11">Expected</text></svg></div>`
        + G.table(["Cell", "O", "E", "(O − E)² ÷ E"], cells.map((c) => [c[0], c[1], G.num(c[2], 2), G.num(c[3], 3)]));
      $("[data-ro]", el).innerHTML = G.ro("χ²", fmt(chi, 3), "Σ(O − E)² ÷ E", true) + G.ro("df", df, mode === "gof" ? "k − 1" : "(r − 1)(c − 1)") + G.ro("Critical at α 0.05", fmt(crit, 3), "right tail only") + G.ro("p-value", pfmt(p), "", true);
      $("[data-msg]", el).innerHTML = decide(p, 0.05) + (bad1 || lowE / cells.length > 0.2 ? ` <b style="color:var(--ooc)">Conditions not met: every E must be at least 1 and no more than 20% of cells below 5.</b>` : "") + warn
        + (mode === "gof" ? " The handbook's hand calculation reports 4.9, but its own column sums to 5.33 (the software agrees: 5.331, p 0.149). Same conclusion." : " Handbook: χ² = 4.006, p = 0.045 — the two groups differ.");
    }
    $$("[data-m]", el).forEach((b) => b.addEventListener("click", () => { mode = b.dataset.m; inputs(); }));
    inputs();
  };

  /* One-way ANOVA */
  G.W.anova = (el) => {
    const P = { hb: "240 °F: 10.8, 10.4, 11.2, 9.9\n220 °F: 11.4, 11.9, 11.6, 12.0\n200 °F: 14.3, 12.6, 13.0, 14.2", same: "A: 10.1, 9.8, 10.4, 10.0\nB: 10.2, 9.9, 10.3, 10.1\nC: 9.9, 10.2, 10.0, 10.3" };
    el.innerHTML = `<h4>One-way ANOVA</h4>
      <p class="hint">One group per line, “label: values”. The handbook example: does polyurethane casting temperature affect moisture content (% H₂O)? Four batches at each temperature, run in random order (p. 319).</p>
      <div class="row" style="gap:.4rem;margin-bottom:.5rem"><button type="button" class="btn sm" data-p="hb">Handbook: three temperatures</button><button type="button" class="btn sm" data-p="same">Three groups, no real difference</button></div>
      <label class="field">Groups<textarea rows="4" data-x style="width:100%;padding:.5rem;border:1.5px solid var(--rule);border-radius:6px;font-family:ui-monospace,monospace"></textarea></label>
      <div data-svg style="margin-top:.6rem"></div><div data-tbl></div><div class="readout" data-ro></div><p class="small" data-msg aria-live="polite"></p>`;
    function draw() {
      const s = S(), groups = $("[data-x]", el).value.split("\n").map((l) => { const i = l.indexOf(":"); return i < 0 ? null : [l.slice(0, i).trim(), s.parse(l.slice(i + 1))]; }).filter((g) => g && g[1].length);
      if (groups.length < 2 || groups.some((g) => g[1].length < 2)) { $("[data-msg]", el).textContent = "Enter at least two groups with two or more values each."; $("[data-ro]", el).innerHTML = ""; $("[data-svg]", el).innerHTML = ""; $("[data-tbl]", el).innerHTML = ""; return; }
      const all = groups.flatMap((g) => g[1]), N = all.length, k = groups.length, gm = s.mean(all);
      const ssb = groups.reduce((a, g) => a + g[1].length * (s.mean(g[1]) - gm) ** 2, 0), sst = all.reduce((a, v) => a + (v - gm) ** 2, 0), ssw = sst - ssb;
      const d1 = k - 1, d2 = N - k, msb = ssb / d1, msw = ssw / d2, F = msb / msw, p = 1 - s.fcdf(F, d1, d2), crit = s.finv(0.95, d1, d2);
      const lo = Math.min(...all), hi = Math.max(...all), pad = (hi - lo) * 0.1 || 1;
      const f = G.frame({ W: 640, H: 60 + 42 * k, x0: lo - pad, x1: hi + pad, y0: 0, y1: k, yticks: [], label: "Dot plot by group", B: 30 });
      $("[data-svg]", el).innerHTML = f.open + f.axes + `<line x1="${f.x(gm)}" x2="${f.x(gm)}" y1="${f.T}" y2="${f.B}" stroke="var(--ink-soft)" stroke-dasharray="4 4"/><text x="${f.x(gm)}" y="${f.T + 9}" text-anchor="middle" font-size="10.5" class="t-soft">grand mean</text>`
        + groups.map((g, i) => { const yy = f.y(k - i - 0.5), m = s.mean(g[1]); return `<text x="${f.L - 6}" y="${yy + 4}" text-anchor="end" font-size="11.5" font-weight="700">${g[0]}</text><line x1="${f.L}" x2="${f.R}" y1="${yy}" y2="${yy}" stroke="var(--rule-soft)"/>${g[1].map((v) => `<circle cx="${f.x(v)}" cy="${yy}" r="5" fill="var(--c17)" opacity=".8"/>`).join("")}<line x1="${f.x(m)}" x2="${f.x(m)}" y1="${yy - 13}" y2="${yy + 13}" stroke="var(--ink)" stroke-width="3"/>`; }).join("") + f.close;
      $("[data-tbl]", el).innerHTML = G.table(["Source", "SS", "df", "MS", "F", "p"], [["Between groups", G.num(ssb, 4), d1, G.num(msb, 4), G.num(F, 2), pfmt(p)], ["Within groups (error)", G.num(ssw, 4), d2, G.num(msw, 4), "", ""], ["Total", G.num(sst, 4), N - 1, "", "", ""]]);
      $("[data-ro]", el).innerHTML = G.ro("F", fmt(F, 2), `MSB ÷ MSW, df (${d1}, ${d2})`, true) + G.ro("F critical, α 0.05", fmt(crit, 3)) + G.ro("p-value", pfmt(p), "", true) + G.ro("Pooled s", fmt(Math.sqrt(msw), 4), "√MSW");
      $("[data-msg]", el).innerHTML = decide(p, 0.05) + (p <= 0.05 ? " ANOVA says at least one mean differs — it doesn't say which. Use a comparison of means (or the dot plot) to find it." : "") + " SS total = SS between + SS within; df total = N − 1.";
    }
    $("[data-x]", el).addEventListener("input", draw);
    $$("[data-p]", el).forEach((b) => b.addEventListener("click", () => { $("[data-x]", el).value = P[b.dataset.p]; draw(); }));
    $("[data-x]", el).value = P.hb; draw();
  };

  C("sigprac", {
    title: "Statistically significant, practically significant, both, or neither?",
    hint: "Statistical significance asks whether a difference is real; practical significance asks whether it matters to the customer or the business.",
    cats: ["Statistical only", "Practical only (not proven)", "Both", "Neither"],
    items: [
      { t: "Defect rate fell from 1.2% to 0.7% (p = 0.001); the customer allows 3% and the step isn't critical", a: 0, why: "Real, but it doesn't change anything that matters (p. 300)." },
      { t: "Cycle time fell 20 minutes on a 4-hour process (p = 0.30, n = 4) — a saving that would be worth a lot", a: 1, why: "Would matter, but the evidence isn't there. Low power — collect more data." },
      { t: "Bond strength rose 15% (p = 0.002), lifting Cpk from 0.9 to 1.4", a: 2, why: "Real and valuable." },
      { t: "Two gages differ by 2 microns (p = 0.40); 50 microns would still be acceptable", a: 3, why: "Neither real nor important." },
      { t: "With n = 50,000 transactions, average handle time differs by 0.4 seconds (p < 0.001)", a: 0, why: "Huge samples make tiny differences significant." }
    ]
  });

  /* =================== Chapter 18 =================== */
  G.W.gap = (el) => {
    const D = [["Lead time (days)", 21, 7, "low"], ["Cycle time (min)", 1800, 600, "low"], ["Inventory ($K)", 500, 50, "low"], ["People (#)", 10, 7, "low"], ["Wait time (min)", 3000, 500, "low"], ["Transportation (m)", 1000, 500, "low"], ["Rolled throughput yield (%)", 90, 95, "high"], ["Process RPN > 100 (count)", 10, 0, "low"], ["Process cycle efficiency (%)", 3, 10, "high"], ["OEE (%)", 60, 75, "high"], ["COPQ (% of operating expense)", 25, 10, "low"], ["Customer satisfaction (%)", 90, 95, "high"]];
    let sel = -1;
    el.innerHTML = `<h4>Gap analysis: baseline vs future state</h4>
      <p class="hint">Predefined metrics for a value-stream improvement (p. 330). Grey = current state, green = future state, each row scaled to its own larger value. Most metrics should fall; yield, PCE, OEE and satisfaction should rise. Tap a row for the relative gap.</p>
      <div data-svg></div><p class="small" data-msg aria-live="polite">Baseline first: without the current state you can't show the improvement, size the resources, or quantify the financial benefit.</p>`;
    function draw() {
      const W = 640, rh = 30, H = D.length * rh + 34, L = 214, R = W - 104, x = (v) => L + v * (R - L);
      $("[data-svg]", el).innerHTML = `<div class="vizscroll"><svg class="viz wide" viewBox="0 0 ${W} ${H}" role="img" aria-label="Gap analysis chart">
        <rect x="${L}" y="${H - 18}" width="10" height="8" fill="#BFC5BA"/><text x="${L + 14}" y="${H - 10}" font-size="11">Current</text>
        <rect x="${L + 80}" y="${H - 18}" width="10" height="8" fill="var(--c18)"/><text x="${L + 94}" y="${H - 10}" font-size="11">Future state</text>
        ${D.map(([k, c, f, dir], i) => { const y = 4 + i * rh, m = Math.max(c, f) || 1, hit = i === sel;
          return `<g data-i="${i}" style="cursor:pointer"><rect x="0" y="${y}" width="${W}" height="${rh - 2}" fill="${hit ? "var(--belt-wash)" : "transparent"}"/><text x="${L - 8}" y="${y + 18}" text-anchor="end" font-size="11.5" ${hit ? 'font-weight="700"' : ""}>${k}</text>
            <rect x="${L}" y="${y + 4}" width="${Math.max(1, x(c / m) - L)}" height="9" rx="2" fill="#BFC5BA"/>
            <rect x="${L}" y="${y + 15}" width="${Math.max(1, x(f / m) - L)}" height="9" rx="2" fill="var(--c18)"/>
            <text x="${R + 8}" y="${y + 18}" font-size="11.5">${c} → ${f}</text></g>`; }).join("")}</svg></div>`;
      $$("[data-i]", el).forEach((g) => g.addEventListener("click", () => { sel = +g.dataset.i; const [k, c, f, dir] = D[sel]; $("[data-msg]", el).innerHTML = `<b>${k}</b>: gap ${Math.abs(c - f)} (${dir === "low" ? "lower is better" : "higher is better"}) — a ${G.num((100 * Math.abs(c - f)) / c, 0)}% ${dir === "low" ? "reduction" : "increase"} from the baseline.`; draw(); }));
    }
    draw();
  };

  G.W.fivewhy = (el) => {
    const W = [
      ["Why did the robot stop?", "The circuit overloaded and blew a fuse.", "Stop here and you stock spare fuses."],
      ["Why did the circuit overload?", "Insufficient lubrication on the bearings — they locked up.", "Stop here and operators pour on more oil: spills and slip accidents."],
      ["Why was there insufficient lubrication?", "The oil pump isn't circulating enough oil.", ""],
      ["Why isn't the pump circulating enough oil?", "The pump intake is clogged with metal shavings.", ""],
      ["Why is the intake clogged?", "There is no filter on the pump.", "A specific, actionable root cause — fit a filter. But is it the system cause?"],
      ["Why is there no filter?", "The maintenance technician forgot to replace it during preventive maintenance.", ""],
      ["Why did the technician forget?", "No error-proofing and no defined preventive maintenance process.", "System-level root cause: define and deploy the PM process, error-proof it, and feed back to the equipment vendor."]
    ];
    let k = 1;
    el.innerHTML = `<h4>5 Whys: the Toyota robot</h4><p class="hint">Keep asking until the cause is specific, actionable and within your control — and addresses the process or system breakdown. Five is a guideline, not a rule (“why-why analysis”).</p>
      <ol class="steps-v" data-list></ol><div class="row" style="margin-top:.6rem"><button type="button" class="btn" data-next>Ask why</button><button type="button" class="btn sm" data-reset>Start over</button></div>`;
    function draw() {
      $("[data-list]", el).innerHTML = W.slice(0, k).map(([q, a, n], i) => `<li><p><b>${q}</b><br>${a}${n ? `<br><span class="small" style="color:${i === W.length - 1 ? "var(--belt-deep)" : "var(--ooc)"}">${n}</span>` : ""}</p></li>`).join("");
      $("[data-next]", el).disabled = k >= W.length; $("[data-next]", el).textContent = k >= W.length ? "Root cause reached" : k === 5 ? "Ask why again (past five)" : "Ask why";
    }
    $("[data-next]", el).addEventListener("click", () => { k = Math.min(W.length, k + 1); draw(); });
    $("[data-reset]", el).addEventListener("click", () => { k = 1; draw(); });
    draw();
  };

  /* Fault tree: AND vs OR */
  G.W.fta = (el) => {
    let gate = "or", ps = [0.1, 0.2, 0.05];
    el.innerHTML = `<h4><span>Fault tree: combining basic events</span><span class="seg" role="group" aria-label="Gate"><button type="button" data-g="or">OR gate</button><button type="button" data-g="and">AND gate</button></span></h4>
      <p class="hint">Independent basic events feed one gate. AND: all must happen — multiply. OR: any one is enough — 1 − Π(1 − p). Simply adding works only when every p is small.</p>
      <div class="grid3">${ps.map((p, i) => `<label class="field">P(event ${i + 1}) <output data-o="${i}"></output><input type="range" min="0" max="0.6" step="0.01" value="${p}" data-p="${i}"></label>`).join("")}</div>
      <div data-svg></div><div class="readout" data-ro></div><p class="small" data-msg aria-live="polite"></p>`;
    function draw() {
      press("[data-g]", el, (b) => b.dataset.g === gate);
      ps.forEach((p, i) => ($(`[data-o="${i}"]`, el).textContent = p.toFixed(2)));
      const and = ps.reduce((a, b) => a * b, 1), or = 1 - ps.reduce((a, b) => a * (1 - b), 1), sum = ps.reduce((a, b) => a + b, 0), top = gate === "and" ? and : or;
      const W = 640, H = 200, gx = W / 2, gy = 74;
      const gateShape = gate === "and" ? `<path d="M${gx - 30},${gy + 30} V${gy} A30,30 0 0 1 ${gx + 30},${gy} V${gy + 30} Z" fill="#fff" stroke="var(--ink)" stroke-width="2"/>`
        : `<path d="M${gx - 30},${gy + 30} Q${gx - 26},${gy - 6} ${gx},${gy - 18} Q${gx + 26},${gy - 6} ${gx + 30},${gy + 30} Q${gx},${gy + 18} ${gx - 30},${gy + 30} Z" fill="#fff" stroke="var(--ink)" stroke-width="2"/>`;
      $("[data-svg]", el).innerHTML = `<svg class="viz" viewBox="0 0 ${W} ${H}" role="img" aria-label="Fault tree with one ${gate.toUpperCase()} gate">
        <rect x="${gx - 120}" y="4" width="240" height="34" rx="4" fill="var(--c18)" fill-opacity=".15" stroke="var(--c18)" stroke-width="2"/><text x="${gx}" y="26" text-anchor="middle" font-weight="700" font-size="14">Top event: P = ${G.num(top, 4)}</text>
        <line x1="${gx}" x2="${gx}" y1="38" y2="${gy - 18}" stroke="var(--ink)" stroke-width="2"/>${gateShape}<text x="${gx}" y="${gy + 22}" text-anchor="middle" font-size="11" font-weight="700">${gate.toUpperCase()}</text>
        ${ps.map((p, i) => { const bx = W * (i + 1) / 4; return `<line x1="${gx - 20 + i * 20}" x2="${bx}" y1="${gy + 30}" y2="${H - 50}" stroke="var(--ink)" stroke-width="1.5"/><circle cx="${bx}" cy="${H - 30}" r="22" fill="#fff" stroke="var(--ink)" stroke-width="2"/><text x="${bx}" y="${H - 26}" text-anchor="middle" font-size="12">${p.toFixed(2)}</text>`; }).join("")}</svg>`;
      $("[data-ro]", el).innerHTML = G.ro("AND (all occur)", G.num(and, 5), "p₁ × p₂ × p₃", gate === "and") + G.ro("OR (any occurs)", G.num(or, 4), "1 − (1 − p₁)(1 − p₂)(1 − p₃)", gate === "or") + G.ro("Simple sum", G.num(sum, 3), sum > 1 ? "exceeds 1 — impossible" : "approximation for OR");
      $("[data-msg]", el).innerHTML = `The handbook (p. 333) says the probabilities “sum up to the top-level cause.” That's only roughly true for an OR gate with small probabilities — here the sum overstates OR by ${G.num(sum - or, 3)} — and wrong for AND, where they multiply. Redundancy (AND) makes failure much less likely; extra single points of failure (OR) make it more likely.`;
    }
    $$("[data-g]", el).forEach((b) => b.addEventListener("click", () => { gate = b.dataset.g; draw(); }));
    $$("[data-p]", el).forEach((i) => i.addEventListener("input", () => { ps[+i.dataset.p] = +i.value; draw(); }));
    draw();
  };

  C("rcatool", {
    title: "Which root-cause tool?",
    hint: "Chapter 18 plus the Chapter 10 tools. Pick the best fit.",
    cats: ["5 Whys", "Cause-and-effect (fishbone)", "Fault tree analysis", "Relationship matrix", "Gap analysis"],
    select: true,
    items: [
      { t: "A single, fairly simple failure; drill down one chain of cause and effect quickly with no special training", a: 0, why: "5 Whys — persistence, not statistics." },
      { t: "Brainstorm many possible causes across people, methods, machines, materials, measurement and environment", a: 1, why: "Fishbone organizes the brainstorm into categories." },
      { t: "A system failure that needs several causes in combination; estimate the top-event probability from AND/OR logic", a: 2, why: "FTA is top-down and handles multiple causes with logic gates." },
      { t: "Score how strongly each candidate cause relates to each output using 9/3/1", a: 3, why: "A relationship matrix ranks causes against effects." },
      { t: "Baseline lead time, RTY and OEE now, set future-state targets, and size the difference", a: 4, why: "Gap analysis compares current and future states with predefined metrics." },
      { t: "Prioritize which subsystems contribute most to overall unreliability", a: 2, why: "FTA identifies significant contributors and the reliability of the whole system." }
    ]
  });
})();
