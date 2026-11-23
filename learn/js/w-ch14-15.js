/* Widgets: Chapters 14 (measurement system analysis) and 15 (process and performance capability) */
(function () {
  "use strict";
  const { $, $$ } = G;
  const S = () => G.st;
  const C = (name, cfg) => { G.W[name] = (el) => G.classifier(el, cfg); };
  const fmt = (x, d = 3) => G.num(x, d);
  const press = (sel, el, test) => $$(sel, el).forEach((b) => b.setAttribute("aria-pressed", test(b)));

  /* =================== Chapter 14 =================== */
  const K1 = { 2: 0.8862, 3: 0.5908 }, K2 = { 2: 0.7071, 3: 0.5231 };
  const K3 = { 2: 0.7071, 3: 0.5231, 4: 0.4467, 5: 0.403, 6: 0.3742, 7: 0.3534, 8: 0.3375, 9: 0.3249, 10: 0.3146 };
  const D4 = { 2: 3.27, 3: 2.58 }; // as printed on the AIAG form
  G.GRR_K = { K1, K2, K3, D4 };

  G.W.grr = (el) => {
    const P = { hb: [3, 3, 10, 0.3417, 0.4446, 3.511, ""], tol: [3, 3, 10, 0.3417, 0.4446, 3.511, "6"], two: [2, 2, 10, 0.12, 0.05, 1.2, ""] };
    let [ap, tr, pt, rbar, xd, rp, tol] = P.hb;
    el.innerHTML = `<h4>Gage R&amp;R: average and range method (AIAG)</h4>
      <p class="hint">Enter the summary numbers from the data sheet. The preset is the handbook's example (3 appraisers × 3 trials × 10 parts).</p>
      <div class="row" style="gap:.4rem;margin-bottom:.6rem"><button type="button" class="btn sm" data-p="hb">Handbook example</button><button type="button" class="btn sm" data-p="tol">Same, with tolerance 6</button><button type="button" class="btn sm" data-p="two">2 appraisers × 2 trials</button></div>
      <div class="grid3">
        <label class="field">Appraisers<select data-ap><option>2</option><option>3</option></select></label>
        <label class="field">Trials<select data-tr><option>2</option><option>3</option></select></label>
        <label class="field">Parts<select data-pt>${[2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => `<option>${n}</option>`).join("")}</select></label>
        <label class="field">R̿ — average of appraiser ranges<input type="number" step="any" min="0" data-rbar></label>
        <label class="field">X̄diff — max − min appraiser average<input type="number" step="any" min="0" data-xd></label>
        <label class="field">Rp — range of part averages<input type="number" step="any" min="0" data-rp></label>
        <label class="field">Tolerance (optional)<input type="number" step="any" min="0" data-tol placeholder="USL − LSL"></label>
      </div>
      <div data-svg style="margin-top:.6rem"></div><div class="readout" data-ro></div><p class="small" data-msg aria-live="polite"></p>`;
    const sync = () => { $("[data-ap]", el).value = ap; $("[data-tr]", el).value = tr; $("[data-pt]", el).value = pt; $("[data-rbar]", el).value = rbar; $("[data-xd]", el).value = xd; $("[data-rp]", el).value = rp; $("[data-tol]", el).value = tol; };
    function draw() {
      const ev = rbar * K1[tr], av2 = Math.pow(xd * K2[ap], 2) - (ev * ev) / (pt * tr), av = Math.sqrt(Math.max(0, av2));
      const grr = Math.hypot(ev, av), pv = rp * K3[pt], tv = Math.hypot(grr, pv), ndc = Math.floor((1.41 * pv) / grr);
      const pc = (x) => (100 * x) / tv, t = +tol;
      const rows = [["EV", ev, "Repeatability — equipment"], ["AV", av, "Reproducibility — appraisers"], ["GRR", grr, "√(EV² + AV²)"], ["PV", pv, "Part variation"]];
      const W = 640, H = 176, L = 64, R = W - 70, bh = 26;
      const xs = (v) => L + (Math.min(v, 100) / 100) * (R - L);
      $("[data-svg]", el).innerHTML = `<div class="vizscroll"><svg class="viz wide" viewBox="0 0 ${W} ${H}" role="img" aria-label="Percent of total variation by component">
        ${[10, 30].map((v) => `<line x1="${xs(v)}" x2="${xs(v)}" y1="4" y2="${H - 22}" stroke="var(--limit)" stroke-dasharray="4 4"/><text x="${xs(v)}" y="${H - 8}" text-anchor="middle" font-size="11" fill="var(--limit)">${v}%</text>`).join("")}
        <text x="${xs(100)}" y="${H - 8}" text-anchor="middle" font-size="11" class="t-soft">100%</text>
        ${rows.map(([k, v], i) => { const y = 8 + i * (bh + 12), col = k === "GRR" ? (pc(v) < 10 ? "var(--belt)" : pc(v) <= 30 ? "var(--limit)" : "var(--ooc)") : k === "PV" ? "var(--c14)" : "#9AA39A";
          return `<text x="${L - 8}" y="${y + bh / 2 + 4}" text-anchor="end" font-weight="700" font-size="12.5">${k}</text><rect x="${L}" y="${y}" width="${Math.max(2, xs(pc(v)) - L)}" height="${bh}" rx="4" fill="${col}"/><text x="${xs(pc(v)) + 6}" y="${y + bh / 2 + 4}" font-size="12">${G.num(pc(v), 1)}%</text>`; }).join("")}</svg></div>`;
      $("[data-ro]", el).innerHTML = rows.map(([k, v, s]) => G.ro(k, G.sig(v, 5), s, k === "GRR")).join("") + G.ro("TV", G.sig(tv, 5), "√(GRR² + PV²)")
        + G.ro("%GRR of TV", G.num(pc(grr), 2) + "%", "100 × GRR ÷ TV", true) + G.ro("%Contribution", G.num((100 * grr * grr) / (tv * tv), 2) + "%", "variance basis: (GRR ÷ TV)²")
        + G.ro("ndc", isFinite(ndc) ? ndc : "—", "1.41 × PV ÷ GRR, truncated", true) + (t > 0 ? G.ro("%GRR of tolerance", G.num((600 * grr) / t, 1) + "%", "6 × GRR ÷ tolerance") : "")
        + G.ro("UCL for ranges", G.num(D4[tr] * rbar, 4), `D4 (${D4[tr]}) × R̿`);
      const p = pc(grr), verdict = p < 10 ? "acceptable" : p <= 30 ? "conditionally acceptable — depends on how critical the measurement is and the cost of fixing it" : "unacceptable — fix the measurement system first";
      $("[data-msg]", el).innerHTML = `%GRR ${G.num(p, 1)}% is <b>${verdict}</b> (AIAG: under 10% OK, 10–30% conditional, over 30% not OK). ndc ${ndc >= 5 ? "≥ 5: the gage can separate parts into enough categories" : "below 5: the gage can't tell parts apart well enough"}. ${ev > av ? "EV is the larger share — look at the gage (maintenance, fixturing, resolution)." : "AV is the larger share — look at the appraisers (training, method, reading the gage)."} The percentages don't add to 100 because they're ratios of standard deviations; %Contribution (variances) does add up.`;
    }
    const bind = (sel, set) => $(sel, el).addEventListener("input", (e) => { set(e.target.value); draw(); });
    bind("[data-ap]", (v) => (ap = +v)); bind("[data-tr]", (v) => (tr = +v)); bind("[data-pt]", (v) => (pt = +v));
    bind("[data-rbar]", (v) => (rbar = Math.max(0, +v || 0))); bind("[data-xd]", (v) => (xd = Math.max(0, +v || 0))); bind("[data-rp]", (v) => (rp = Math.max(0, +v || 0))); bind("[data-tol]", (v) => (tol = v));
    $$("[data-p]", el).forEach((b) => b.addEventListener("click", () => { [ap, tr, pt, rbar, xd, rp, tol] = P[b.dataset.p]; sync(); draw(); }));
    sync(); draw();
  };

  C("msaterms", {
    title: "Name the measurement error",
    hint: "Each description matches one MSA term (pp. 236–237 and Figure 14.1).",
    cats: ["Repeatability (EV)", "Reproducibility (AV)", "Bias", "Linearity", "Stability", "Resolution"],
    select: true,
    items: [
      { t: "One appraiser measures the same part three times with the same gage and gets three different readings", a: 0, why: "Variation within one appraiser and one gage — equipment variation." },
      { t: "Three appraisers measuring the same parts get different averages", a: 1, why: "Variation between appraisers — appraiser variation." },
      { t: "The gage reads 0.12 mm high on average compared with the master", a: 2, why: "Bias: observed average minus the reference value." },
      { t: "The gage reads accurately near the low end of its range but high near the top", a: 3, why: "Linearity: bias changes across the operating range." },
      { t: "Bias measured on the same master drifts from month to month", a: 4, why: "Stability: change in bias over time." },
      { t: "The gage reads to 0.1 mm but the tolerance is only 0.2 mm wide", a: 5, why: "Resolution (discrimination). Rule of thumb: the gage should read to at least one-tenth of the tolerance or process spread." },
      { t: "Precision of the gage itself", a: 0, why: "Repeatability is the gage's precision; reproducibility adds the people." },
      { t: "Fixed by calibrating against a traceable standard", a: 2, why: "Calibration corrects accuracy (bias); it doesn't reduce repeatability." }
    ]
  });

  /* Accuracy vs precision, and the linearity/bias plot */
  G.W.linbias = (el) => {
    let bias = 0.2, slope = 0, spread = 0.15;
    el.innerHTML = `<h4>Bias and linearity</h4>
      <p class="hint">Bias is the average offset from the reference value. Linearity asks whether that offset changes across the measuring range — the slope of bias vs reference. Move the sliders.</p>
      <div class="grid3">
        <label class="field">Average bias <output data-o="b"></output><input type="range" min="-0.5" max="0.5" step="0.05" value="${bias}" data-b></label>
        <label class="field">Slope of bias <output data-o="s"></output><input type="range" min="-0.1" max="0.1" step="0.01" value="${slope}" data-s></label>
        <label class="field">Scatter (repeatability) <output data-o="r"></output><input type="range" min="0.02" max="0.4" step="0.02" value="${spread}" data-r></label>
      </div>
      <div data-svg></div><p class="small" data-msg aria-live="polite"></p>`;
    function draw() {
      $("[data-o=b]", el).textContent = bias.toFixed(2); $("[data-o=s]", el).textContent = slope.toFixed(2); $("[data-o=r]", el).textContent = spread.toFixed(2);
      const r = G.rng(17), refs = [2, 4, 6, 8, 10], pts = [];
      refs.forEach((x) => { for (let i = 0; i < 6; i++) pts.push([x, bias + slope * (x - 6) + spread * G.gauss(r)]); });
      const f = G.frame({ W: 640, H: 230, x0: 0, x1: 12, y0: -1.2, y1: 1.2, xticks: refs, yticks: [-1, -0.5, 0, 0.5, 1], label: "Bias versus reference value", xlab: "Reference value", ylab: "Bias" });
      $("[data-svg]", el).innerHTML = f.open + f.axes + `<line x1="${f.L}" x2="${f.R}" y1="${f.y(0)}" y2="${f.y(0)}" stroke="var(--ink)" stroke-width="1.5"/><text x="${f.L + 4}" y="${f.y(0) + 14}" font-size="11" class="t-soft">zero bias</text>`
        + pts.map(([x, y]) => `<circle cx="${f.x(x + (G.rng(x * 100 + y * 1000)() - 0.5) * 0.4)}" cy="${f.y(Math.max(-1.2, Math.min(1.2, y)))}" r="3.5" fill="var(--c14)" opacity=".75"/>`).join("")
        + `<line x1="${f.x(1)}" x2="${f.x(11)}" y1="${f.y(bias + slope * -5)}" y2="${f.y(bias + slope * 5)}" stroke="var(--ooc)" stroke-width="2.5"/>` + f.close;
      const lin = Math.abs(slope) >= 0.02, b = Math.abs(bias) >= 0.1;
      $("[data-msg]", el).innerHTML = `${lin ? "<b>Linearity problem</b> — the fitted line is tilted, so bias depends on where in the range you measure." : "Linearity OK — the fitted line is flat."} ${b ? "<b>Bias problem</b> — the line sits away from zero." : "Bias is near zero."} ${spread > 0.25 ? "Wide scatter means poor repeatability, a precision problem separate from bias." : ""} Accuracy is about bias; precision is about scatter.`;
    }
    $("[data-b]", el).addEventListener("input", (e) => { bias = +e.target.value; draw(); });
    $("[data-s]", el).addEventListener("input", (e) => { slope = +e.target.value; draw(); });
    $("[data-r]", el).addEventListener("input", (e) => { spread = +e.target.value; draw(); });
    draw();
  };

  /* Measurement error inflates observed variation */
  G.W.grrcap = (el) => {
    let cp = 1, g = 50, k = 6;
    el.innerHTML = `<h4>How gage error hides real capability</h4>
      <p class="hint">Observed variance = actual process variance + measurement variance. Set the observed Cp and the %GRR (as a percent of tolerance) to see the capability you'd have with a perfect gage.</p>
      <div class="grid2">
        <label class="field">Observed Cp <output data-o="c"></output><input type="range" min="0.5" max="2" step="0.05" value="${cp}" data-c></label>
        <label class="field">%GRR of tolerance <output data-o="g"></output><input type="range" min="0" max="90" step="5" value="${g}" data-g></label>
      </div>
      <div class="row" style="margin:.6rem 0"><span class="small soft">%GRR convention</span><span class="seg" role="group" aria-label="Convention"><button type="button" data-k="6">6σ (AIAG 4th edition)</button><button type="button" data-k="5.15">5.15σ (older editions)</button></span></div>
      <div class="readout" data-ro></div><p class="small" data-msg aria-live="polite"></p>`;
    function draw() {
      $("[data-o=c]", el).textContent = cp.toFixed(2); $("[data-o=g]", el).textContent = g + "%";
      press("[data-k]", el, (b) => +b.dataset.k === k);
      const ratio = ((g / 100) * 6 * cp) / k, ok = ratio < 1, act = ok ? cp / Math.sqrt(1 - ratio * ratio) : NaN;
      $("[data-ro]", el).innerHTML = G.ro("Observed Cp", fmt(cp, 2)) + G.ro("σ measurement ÷ σ observed", fmt(ratio, 3), `%GRR × 6 × Cp ÷ ${k}`) + G.ro("Actual Cp", ok ? fmt(act, 3) : "—", "Cp ÷ √(1 − ratio²)", true);
      $("[data-msg]", el).innerHTML = !ok ? `<b style="color:var(--ooc)">Measurement variation would be larger than the total observed variation — impossible. Lower the %GRR or the observed Cp.</b>`
        : `The process is really ${fmt(act, 2)}, not ${fmt(cp, 2)}. ${g >= 30 ? "With this much gage error you could be scrapping good parts and chasing a process that's fine." : g <= 10 ? "At 10% or less the inflation is small." : ""} The handbook's Figure 14.10 (Cp 1 observed, 50% GRR → 1.23 actual) uses the older 5.15σ convention; with 6σ the same inputs give 1.15.`;
    }
    $("[data-c]", el).addEventListener("input", (e) => { cp = +e.target.value; draw(); });
    $("[data-g]", el).addEventListener("input", (e) => { g = +e.target.value; draw(); });
    $$("[data-k]", el).forEach((b) => b.addEventListener("click", () => { k = +b.dataset.k; draw(); }));
    draw();
  };

  /* Attribute agreement analysis */
  const betainv = (p, a, b) => { let lo = 0, hi = 1; for (let i = 0; i < 80; i++) { const m = (lo + hi) / 2; if (S().betai(a, b, m) < p) lo = m; else hi = m; } return (lo + hi) / 2; };
  const cp95 = (x, n) => [x === 0 ? 0 : betainv(0.025, x, n - x + 1), x === n ? 1 : betainv(0.975, x + 1, n - x)];
  G.clopper = cp95;
  G.W.attagree = (el) => {
    const D = { A: { within: 20, std: 16, ra: 3, ar: 1, mixed: 12 }, B: { within: 26, std: 25, ra: 0, ar: 1, mixed: 6 }, C: { within: 27, std: 25, ra: 0, ar: 2, mixed: 5 } };
    const N = 32, good = 26, bad = 6;
    let view = "within";
    el.innerHTML = `<h4><span>Attribute agreement: polished-glass inspection</span><span class="seg" role="group" aria-label="View"><button type="button" data-v="within">Within appraiser</button><button type="button" data-v="std">Appraiser vs standard</button><button type="button" data-v="err">Errors</button></span></h4>
      <p class="hint">Three appraisers judged 32 samples pass/fail over repeated trials (Figure 14.14). The standard has 26 good and 6 bad parts. Bars show percent matched with exact 95% confidence intervals.</p>
      <div data-out></div><p class="small" data-msg aria-live="polite"></p>`;
    function draw() {
      press("[data-v]", el, (b) => b.dataset.v === view);
      if (view === "err") {
        $("[data-out]", el).innerHTML = G.table(["Appraiser", "Rejects good parts (R/A)", "Accepts bad parts (A/R)", "Mixed across trials"], Object.entries(D).map(([k, d]) => [k, `${d.ra} of ${good} = ${G.num((100 * d.ra) / good, 1)}%`, `${d.ar} of ${bad} = ${G.num((100 * d.ar) / bad, 1)}%`, `${d.mixed} of ${N} = ${G.num((100 * d.mixed) / N, 1)}%`]));
        $("[data-msg]", el).innerHTML = "R/A rejects good parts — the producer's risk (scrap and rework). A/R accepts bad parts — the consumer's risk, usually worse because the customer gets it. C is the most consistent but lets the most bad parts through; A rejects good parts and is the least consistent. Check: matched to standard = 32 − R/A − A/R − mixed (A: 32 − 3 − 1 − 12 = 16).";
        return;
      }
      const W = 640, H = 220, L = 60, R = W - 20, T = 14, B = H - 34, y = (p) => B - ((p - 20) / 80) * (B - T), bw = 90;
      const items = Object.entries(D).map(([k, d]) => { const x = view === "within" ? d.within : d.std, [lo, hi] = cp95(x, N); return [k, x, (100 * x) / N, lo * 100, hi * 100]; });
      $("[data-out]", el).innerHTML = `<div class="vizscroll"><svg class="viz wide" viewBox="0 0 ${W} ${H}" role="img" aria-label="Percent agreement with 95% intervals">
        ${[20, 40, 60, 80, 100].map((v) => `<line x1="${L}" x2="${R}" y1="${y(v)}" y2="${y(v)}" stroke="var(--rule-soft)"/><text x="${L - 6}" y="${y(v) + 4}" text-anchor="end" font-size="11" class="t-soft">${v}%</text>`).join("")}
        ${items.map(([k, x, p, lo, hi], i) => { const cx = L + (i + 0.5) * ((R - L) / 3);
          return `<line x1="${cx}" x2="${cx}" y1="${y(lo)}" y2="${y(hi)}" stroke="var(--c14)" stroke-width="3"/><line x1="${cx - 14}" x2="${cx + 14}" y1="${y(lo)}" y2="${y(lo)}" stroke="var(--c14)" stroke-width="2"/><line x1="${cx - 14}" x2="${cx + 14}" y1="${y(hi)}" y2="${y(hi)}" stroke="var(--c14)" stroke-width="2"/>
            <circle cx="${cx}" cy="${y(p)}" r="7" fill="var(--c14)" stroke="#fff" stroke-width="2"/><text x="${cx + 14}" y="${y(p) + 4}" font-size="12" font-weight="700">${G.num(p, 1)}%</text>
            <text x="${cx}" y="${B + 18}" text-anchor="middle" font-weight="700">${k}</text><text x="${cx}" y="${B + 31}" text-anchor="middle" font-size="10.5" class="t-soft">${x}/32 · (${G.num(lo, 1)}, ${G.num(hi, 1)})</text>`; }).join("")}</svg></div>`;
      $("[data-msg]", el).innerHTML = view === "within"
        ? "Within appraiser = the appraiser agrees with <i>themself</i> on every trial (repeatability). It says nothing about being right."
        : "Versus standard = every trial matches the expert's call (accuracy). It can't be higher than within-appraiser agreement. A's 50% is no better than a coin toss, and the wide intervals show how little 32 samples can prove.";
    }
    $$("[data-v]", el).forEach((b) => b.addEventListener("click", () => { view = b.dataset.v; draw(); }));
    draw();
  };

  /* =================== Chapter 15 =================== */
  G.W.ctrlspec = (el) => {
    const Q = [
      [true, true, "1. Good", "Keep monitoring with SPC; look for ways to reduce cost or variation further.", "var(--belt)"],
      [true, false, "2. Change the process and/or the specification", "The process is stable and predictable — predictably out of spec. Reduce common-cause variation, re-center, or renegotiate a spec that's tighter than the customer needs.", "var(--limit)"],
      [false, true, "3. Investigate the out-of-control condition", "Parts are in spec today, but an unstable process can drift out at any time. Find and remove the special causes.", "var(--limit)"],
      [false, false, "4. Stop the process and investigate immediately", "Unstable and out of spec. Contain product, then find the special causes before attempting capability work.", "var(--ooc)"]
    ];
    let ctl = true, spec = true;
    el.innerHTML = `<h4>Control limits vs specification limits</h4>
      <p class="hint">Figure 15.1. Control limits come from the process (the voice of the process); specification limits come from the customer or engineering (the voice of the customer). Pick a combination.</p>
      <div class="grid2"><div><p class="small soft" style="margin:0 0 .3rem">In statistical control?</p><span class="seg" role="group" aria-label="In control"><button type="button" data-c="1">Yes</button><button type="button" data-c="0">No</button></span></div>
      <div><p class="small soft" style="margin:0 0 .3rem">Meets specification?</p><span class="seg" role="group" aria-label="Meets spec"><button type="button" data-s="1">Yes</button><button type="button" data-s="0">No</button></span></div></div>
      <div data-svg style="margin-top:.6rem"></div><div data-out></div>`;
    function draw() {
      press("[data-c]", el, (b) => (b.dataset.c === "1") === ctl); press("[data-s]", el, (b) => (b.dataset.s === "1") === spec);
      const q = Q.find((x) => x[0] === ctl && x[1] === spec), r = G.rng(ctl * 2 + spec + 3);
      const mu = spec ? 0 : 1.4, sd = spec ? 0.45 : 0.75, pts = [];
      for (let i = 0; i < 30; i++) { let v = mu + sd * G.gauss(r); if (!ctl && i >= 18 && i < 24) v += 2.2 * sd; if (!ctl && i === 9) v = mu + 3.6 * sd; pts.push(v); }
      const f = G.frame({ W: 640, H: 220, x0: 0.5, x1: 30.5, y0: -3.6, y1: 4.4, xticks: [1, 10, 20, 30], yticks: [], label: "Individuals with control and specification limits", xlab: "Sample" });
      const hl = (v, c, lab, dash) => `<line x1="${f.L}" x2="${f.R}" y1="${f.y(v)}" y2="${f.y(v)}" stroke="${c}" stroke-width="2" ${dash ? 'stroke-dasharray="6 4"' : ""}/><text x="${f.L + 4}" y="${f.y(v) - 4}" font-size="11" fill="${c}" font-weight="700">${lab}</text>`;
      const ucl = mu + 3 * sd, lcl = mu - 3 * sd;
      $("[data-svg]", el).innerHTML = f.open + f.axes + hl(2.4, "var(--ooc)", "USL", false) + hl(-2.4, "var(--ooc)", "LSL", false) + hl(ucl, "var(--limit)", "UCL", true) + hl(lcl, "var(--limit)", "LCL", true)
        + `<path d="${pts.map((v, i) => `${i ? "L" : "M"}${f.x(i + 1).toFixed(1)},${f.y(v).toFixed(1)}`).join("")}" fill="none" stroke="var(--ink-soft)" stroke-width="1.5"/>`
        + pts.map((v, i) => `<circle cx="${f.x(i + 1)}" cy="${f.y(v)}" r="4" fill="${v > ucl || v < lcl ? "var(--ooc)" : "var(--ink)"}"/>`).join("") + f.close;
      $("[data-out]", el).innerHTML = `<div class="card" style="border-left:5px solid ${q[4]};margin-top:.6rem"><p style="margin:0 0 .3rem"><b>${q[2]}</b></p><p class="small" style="margin:0">${q[3]}</p></div>`;
    }
    $$("[data-c]", el).forEach((b) => b.addEventListener("click", () => { ctl = b.dataset.c === "1"; draw(); }));
    $$("[data-s]", el).forEach((b) => b.addEventListener("click", () => { spec = b.dataset.s === "1"; draw(); }));
    draw();
  };

  G.W.capcalc = (el) => {
    const P = {
      pack: ["Packing weight (σ = R̄/d₂ ≈ 0.024)", 1.0, 1.1, "", 1.065, 0.024, 0.024],
      pp: ["Weekly sampled devices (s = 0.004)", 9.99, 10.03, "", 10.014, 0.004, 0.004],
      len: ["Vendor length, target off-center (Fig. 15.6)", 4.54, 4.566, 4.553, 4.54289, 0.0031118, 0.0031118],
      shaft: ["Shaft machining (Fig. 15.3)", 7, 11, 10, 9.98378, 1.00121, 1.00121]
    };
    let lsl, usl, tgt, m, sw, so;
    el.innerHTML = `<h4>Capability calculator</h4>
      <p class="hint">Cp/Cpk use the within-subgroup σ (from R̄/d₂ — short term). Pp/Ppk use the overall sample s (long term). Cpm penalizes distance from the target.</p>
      <div class="row" style="gap:.4rem;margin-bottom:.6rem">${Object.entries(P).map(([k, p]) => `<button type="button" class="btn sm" data-p="${k}">${p[0]}</button>`).join("")}</div>
      <div class="grid3">
        <label class="field">LSL<input type="number" step="any" data-f="lsl"></label><label class="field">USL<input type="number" step="any" data-f="usl"></label><label class="field">Target (optional)<input type="number" step="any" data-f="tgt"></label>
        <label class="field">Mean<input type="number" step="any" data-f="m"></label><label class="field">σ within (R̄/d₂)<input type="number" step="any" min="0" data-f="sw"></label><label class="field">s overall<input type="number" step="any" min="0" data-f="so"></label>
      </div>
      <div data-svg style="margin-top:.6rem"></div><div class="readout" data-ro></div><p class="small" data-msg aria-live="polite"></p>`;
    const F = { lsl: (v) => (lsl = +v), usl: (v) => (usl = +v), tgt: (v) => (tgt = v), m: (v) => (m = +v), sw: (v) => (sw = Math.max(1e-12, +v)), so: (v) => (so = Math.max(1e-12, +v)) };
    const load = (k) => { [, lsl, usl, tgt, m, sw, so] = P[k]; const vals = { lsl, usl, tgt, m, sw: +sw.toPrecision(5), so }; $$("[data-f]", el).forEach((i) => (i.value = vals[i.dataset.f])); draw(); };
    function draw() {
      const tol = usl - lsl, cp = tol / (6 * sw), cpu = (usl - m) / (3 * sw), cpl = (m - lsl) / (3 * sw), cpk = Math.min(cpu, cpl);
      const pp = tol / (6 * so), ppu = (usl - m) / (3 * so), ppl = (m - lsl) / (3 * so), ppk = Math.min(ppu, ppl);
      const T = tgt === "" ? (usl + lsl) / 2 : +tgt, cpm = tol / (6 * Math.sqrt(so * so + (m - T) * (m - T)));
      const below = G.Phi((lsl - m) / so), above = G.upperTail((usl - m) / so), d = Math.max(2, Math.min(5, -Math.floor(Math.log10(sw)) + 2));
      const x0 = Math.min(lsl, m - 4 * so) - tol * 0.08, x1 = Math.max(usl, m + 4 * so) + tol * 0.08;
      const f = G.frame({ W: 640, H: 210, x0, x1, y0: 0, y1: 1.12, yticks: [], label: "Process distribution against the specification", xf: (v) => G.sig(v, 5) });
      const pts = []; for (let i = 0; i <= 240; i++) { const x = x0 + (i / 240) * (x1 - x0); pts.push([x, Math.exp(-0.5 * Math.pow((x - m) / so, 2))]); }
      const path = pts.map(([x, y], i) => `${i ? "L" : "M"}${f.x(x).toFixed(1)},${f.y(y).toFixed(1)}`).join("");
      const tail = (cond) => { const s = pts.filter(([x]) => cond(x)); return s.length ? `<path d="M${f.x(s[0][0])},${f.B} ${s.map(([x, y]) => `L${f.x(x).toFixed(1)},${f.y(y).toFixed(1)}`).join("")} L${f.x(s[s.length - 1][0])},${f.B} Z" fill="var(--ooc)" opacity=".45"/>` : ""; };
      const vl = (v, lab, c, dash) => `<line x1="${f.x(v)}" x2="${f.x(v)}" y1="${f.T + 14}" y2="${f.B}" stroke="${c}" stroke-width="2" ${dash ? 'stroke-dasharray="5 4"' : ""}/><text x="${f.x(v)}" y="${f.T + 8}" text-anchor="middle" font-size="11" fill="${c}" font-weight="700">${lab}</text>`;
      $("[data-svg]", el).innerHTML = f.open + f.axes + `<path d="${path} L${f.x(x1)},${f.B} L${f.x(x0)},${f.B} Z" fill="var(--c15)" opacity=".18"/>` + tail((x) => x < lsl) + tail((x) => x > usl) + `<path d="${path}" fill="none" stroke="var(--c15)" stroke-width="2.5"/>`
        + vl(lsl, "LSL", "var(--ooc)") + vl(usl, "USL", "var(--ooc)") + (tgt !== "" ? vl(T, "Target", "var(--ink)", true) : "") + `<line x1="${f.x(m)}" x2="${f.x(m)}" y1="${f.y(1)}" y2="${f.B}" stroke="var(--c15)" stroke-width="1.5"/>` + f.close;
      $("[data-ro]", el).innerHTML = G.ro("Cp", fmt(cp, 2), "tolerance ÷ 6σ within", true) + G.ro("CPU, CPL", `${fmt(cpu, 2)}, ${fmt(cpl, 2)}`, "(USL − x̄) ÷ 3σ, (x̄ − LSL) ÷ 3σ") + G.ro("Cpk", fmt(cpk, 2), "min(CPU, CPL)", true) + G.ro("Cr", fmt(1 / cp, 2), `1 ÷ Cp — uses ${G.num(100 / cp, 0)}% of the tolerance`)
        + G.ro("Pp", fmt(pp, 2), "tolerance ÷ 6s overall") + G.ro("Ppk", fmt(ppk, 2), `min(${fmt(ppu, 2)}, ${fmt(ppl, 2)})`) + G.ro("Cpm", fmt(cpm, 2), tgt === "" ? "target = midpoint" : `target ${tgt}`)
        + G.ro("Expected below / above", `${G.num(below * 100, 2)}% / ${G.num(above * 100, 2)}%`, `total ≈ ${G.num((below + above) * 1e6, 0)} ppm (overall s)`) + G.ro("Natural limits", `${G.num(m - 3 * sw, d)} to ${G.num(m + 3 * sw, d)}`, "x̄ ± 3σ within");
      const msgs = [];
      if (Math.abs(cp - cpk) < 0.005) msgs.push("Cp = Cpk: the process is centered.");
      else msgs.push(`Cpk (${fmt(cpk, 2)}) is below Cp (${fmt(cp, 2)}) because the mean is off center — re-centering alone would lift Cpk to Cp.`);
      if (cp < 1) msgs.push("Cp below 1: the spread is wider than the tolerance, so centering can't fix it — variation must come down.");
      if (Math.abs(sw - so) > 1e-12) msgs.push(so > sw ? "Overall s is larger than within σ, so Pp/Ppk fall below Cp/Cpk — shifts between subgroups." : "");
      if (tgt !== "" && Math.abs(+tgt - (usl + lsl) / 2) > 1e-12) msgs.push("The target isn't the midpoint, so Cpm (distance from target) tells a different story from Cpk (distance from the nearer limit).");
      $("[data-msg]", el).innerHTML = msgs.filter(Boolean).join(" ");
    }
    $$("[data-f]", el).forEach((i) => i.addEventListener("input", () => { F[i.dataset.f](i.value); draw(); }));
    $$("[data-p]", el).forEach((b) => b.addEventListener("click", () => load(b.dataset.p)));
    load("pack");
  };

  /* Short-term vs long-term: the 1.5-sigma shift */
  G.W.stlt = (el) => {
    let z = 6, shift = 1.5;
    el.innerHTML = `<h4>Short-term sigma, long-term defects</h4>
      <p class="hint">Six Sigma tables assume the mean drifts about 1.5σ over the long term (Figures 15.7 and 15.8). A 6σ process then has 4.5σ to the nearer limit: 3.4 ppm.</p>
      <div class="grid2">
        <label class="field">Short-term Z (spec limit ÷ σ) <output data-o="z"></output><input type="range" min="2" max="6" step="0.5" value="${z}" data-z></label>
        <label class="field">Long-term shift <output data-o="s"></output><input type="range" min="0" max="2" step="0.25" value="${shift}" data-s></label>
      </div>
      <div data-svg></div><div class="readout" data-ro></div>`;
    function draw() {
      $("[data-o=z]", el).textContent = z + "σ"; $("[data-o=s]", el).textContent = shift + "σ";
      const f = G.frame({ W: 640, H: 200, x0: -7.5, x1: 7.5, y0: 0, y1: 1.15, xticks: [-6, -4, -2, 0, 2, 4, 6], yticks: [], label: "Centered and shifted distributions", xf: (v) => v + "σ" });
      const curve = (mu, c, op) => { const p = []; for (let i = 0; i <= 300; i++) { const x = -7.5 + i / 20; p.push(`${i ? "L" : "M"}${f.x(x).toFixed(1)},${f.y(Math.exp(-0.5 * (x - mu) * (x - mu))).toFixed(1)}`); } return `<path d="${p.join("")}" fill="none" stroke="${c}" stroke-width="2.5" opacity="${op}"/>`; };
      const vl = (v, lab) => `<line x1="${f.x(v)}" x2="${f.x(v)}" y1="${f.T + 14}" y2="${f.B}" stroke="var(--ooc)" stroke-width="2"/><text x="${f.x(v)}" y="${f.T + 8}" text-anchor="middle" font-size="11" fill="var(--ooc)" font-weight="700">${lab}</text>`;
      $("[data-svg]", el).innerHTML = f.open + f.axes + vl(-z, "LSL") + vl(z, "USL") + curve(0, "var(--ink-soft)", 0.5) + curve(shift, "var(--c15)", 1)
        + `<text x="${f.x(shift)}" y="${f.y(1.07)}" text-anchor="middle" font-size="11.5" fill="var(--c15)">shifted ${shift}σ</text>` + f.close;
      const st = 2 * G.upperTail(z) * 1e6, lt = (G.upperTail(z - shift) + G.Phi(-z - shift)) * 1e6;
      const p = (v) => (v >= 100 ? G.num(v, 0) : v >= 1 ? G.num(v, 1) : G.sig(v, 2));
      $("[data-ro]", el).innerHTML = G.ro("Centered (short term)", p(st) + " ppm", "both tails") + G.ro("Shifted (long term)", p(lt) + " ppm", `Z to nearer limit = ${z - shift}`, true) + G.ro("Cp", fmt(z / 3, 2), "Z ÷ 3") + G.ro("Cpk after shift", fmt((z - shift) / 3, 2), "(Z − shift) ÷ 3");
    }
    $("[data-z]", el).addEventListener("input", (e) => { z = +e.target.value; draw(); });
    $("[data-s]", el).addEventListener("input", (e) => { shift = +e.target.value; draw(); });
    draw();
  };

  C("indexpick", {
    title: "Which index fits?",
    hint: "Choose the measure the situation calls for.",
    cats: ["Cp", "Cpk", "Pp or Ppk", "Cpm", "Cr"],
    items: [
      { t: "Best-case capability if the process were perfectly centered", a: 0, why: "Cp ignores where the mean sits." },
      { t: "Stable process monitored with an X̄–R chart; the customer asks how close you run to the nearer limit", a: 1, why: "Cpk uses σ from R̄/d₂ and the nearer limit." },
      { t: "Incoming-inspection data from a supplier with no SPC records", a: 2, why: "Overall s from a sample — performance indices (p. 265)." },
      { t: "A shaft–hole fit with a target that isn't the midpoint of the tolerance", a: 3, why: "Cpm measures distance from the target (p. 265)." },
      { t: "Percent of the tolerance used up by process spread — smaller is better", a: 4, why: "Cr = 1/Cp; × 100 for percent." },
      { t: "Data include several machines, operators and shifts over months", a: 2, why: "Long-term variation — Pp/Ppk." },
      { t: "Doesn't change when you re-center the process", a: [0, 2], why: "Cp and Pp use only the spread. Pp alone (not Ppk) is the answer from that pair." }
    ]
  });
})();
