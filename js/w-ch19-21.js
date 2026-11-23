/* Widgets: Chapters 19 (DOE), 20 (implementation planning), 21 (lean tools) */
(function () {
  "use strict";
  const { $, $$, esc } = G;
  const LBL = ["A", "B", "C"];

  /* ---------- Ch19: 2^k effects calculator with main-effect and interaction plots ---------- */
  const DOE_PRESETS = {
    finish: {
      name: "2³ surface finish (Fig. 19.1)", goal: "lower", unit: "finish score",
      factors: [["F", "Feed", ".01", ".04"], ["S", "Speed", "1300", "1800"], ["C", "Coolant °F", "100", "140"]],
      // standard order with the first factor changing slowest, as in Table 19.1
      runs: [[-1, -1, -1, 10], [-1, -1, 1, 4], [-1, 1, -1, 6], [-1, 1, 1, 2], [1, -1, -1, 7], [1, -1, 1, 6], [1, 1, -1, 6], [1, 1, 1, 3]]
    },
    steak: {
      name: "2³ steak approval (handbook example)", goal: "higher", unit: "% approval",
      factors: [["Cook", "Cooking", "fry", "grill"], ["Meat", "Meat", "rib eye", "sirloin"], ["Mar", "Marinade", "soy-garlic", "wine-rosemary"]],
      runs: [[-1, -1, -1, 66], [1, -1, -1, 88], [-1, 1, -1, 58], [1, 1, -1, 84], [-1, -1, 1, 67], [1, -1, 1, 91], [-1, 1, 1, 63], [1, 1, 1, 84]]
    },
    two: {
      name: "2² with interaction (Table 19.6 means)", goal: "higher", unit: "response",
      factors: [["A", "Factor A", "low", "high"], ["B", "Factor B", "low", "high"]],
      runs: [[-1, -1, 28.4], [-1, 1, 33.0], [1, -1, 24.7], [1, 1, 37.3]]
    }
  };
  G.W.doe = (el) => {
    let key = "finish", pair = [0, 1];
    let P = JSON.parse(JSON.stringify(DOE_PRESETS[key]));
    const cols = (k) => {
      const out = [];
      const idx = [...Array(k).keys()];
      for (let size = 1; size <= k; size++) {
        const combos = (start, acc) => { if (acc.length === size) { out.push(acc.slice()); return; } for (let i = start; i < k; i++) { acc.push(i); combos(i + 1, acc); acc.pop(); } };
        combos(0, []);
      }
      return out;
    };
    function draw() {
      const k = P.factors.length, C = cols(k), y = P.runs.map((r) => r[k]);
      const sign = (r, c) => c.reduce((s, i) => s * r[i], 1);
      const eff = C.map((c) => { const p = P.runs.filter((r) => sign(r, c) > 0).map((r) => r[k]), m = P.runs.filter((r) => sign(r, c) < 0).map((r) => r[k]); return p.reduce((a, b) => a + b, 0) / p.length - m.reduce((a, b) => a + b, 0) / m.length; });
      const name = (c) => c.map((i) => P.factors[i][0]).join("×");
      const grand = y.reduce((a, b) => a + b, 0) / y.length;
      const maxAbs = Math.max(...eff.map(Math.abs), 0.001);
      const order = eff.map((e, i) => [Math.abs(e), i]).sort((a, b) => b[0] - a[0]);
      // main effects mini plots
      const mean = (i, lv) => { const v = P.runs.filter((r) => r[i] === lv).map((r) => r[k]); return v.reduce((a, b) => a + b, 0) / v.length; };
      const ys = P.factors.flatMap((_, i) => [mean(i, -1), mean(i, 1)]);
      let lo = Math.min(...ys), hi = Math.max(...ys); const pad = (hi - lo) * 0.25 || 1; lo -= pad; hi += pad;
      const panel = (i, x0) => { const yy = (v) => 20 + (1 - (v - lo) / (hi - lo)) * 120; const a = mean(i, -1), b = mean(i, 1);
        return `<g><line x1="${x0}" x2="${x0 + 150}" y1="${yy(grand)}" y2="${yy(grand)}" stroke="#CBD5CE" stroke-dasharray="3 3"/>
          <line x1="${x0 + 25}" x2="${x0 + 125}" y1="${yy(a)}" y2="${yy(b)}" stroke="var(--acc)" stroke-width="2.5"/>
          <circle cx="${x0 + 25}" cy="${yy(a)}" r="5" fill="var(--acc)"/><circle cx="${x0 + 125}" cy="${yy(b)}" r="5" fill="var(--acc)"/>
          <text x="${x0 + 25}" y="${yy(a) - 9}" text-anchor="middle" font-size="11">${G.num(a, 2)}</text><text x="${x0 + 125}" y="${yy(b) - 9}" text-anchor="middle" font-size="11">${G.num(b, 2)}</text>
          <text x="${x0 + 25}" y="160" text-anchor="middle" font-size="11" class="t-soft">${esc(P.factors[i][2])}</text><text x="${x0 + 125}" y="160" text-anchor="middle" font-size="11" class="t-soft">${esc(P.factors[i][3])}</text>
          <text x="${x0 + 75}" y="178" text-anchor="middle" font-size="12.5" font-weight="700">${esc(P.factors[i][1])}</text></g>`; };
      // interaction plot for pair
      const [pi, pj] = k === 2 ? [0, 1] : pair;
      const cm = (a, b) => { const v = P.runs.filter((r) => r[pi] === a && r[pj] === b).map((r) => r[k]); return v.reduce((s, x) => s + x, 0) / v.length; };
      const iv = [cm(-1, -1), cm(1, -1), cm(-1, 1), cm(1, 1)];
      let ilo = Math.min(...iv), ihi = Math.max(...iv); const ip = (ihi - ilo) * 0.2 || 1; ilo -= ip; ihi += ip;
      const iy = (v) => 20 + (1 - (v - ilo) / (ihi - ilo)) * 150;
      const ie = eff[C.findIndex((c) => c.length === 2 && c[0] === Math.min(pi, pj) && c[1] === Math.max(pi, pj))];
      const slopeLo = cm(1, -1) - cm(-1, -1), slopeHi = cm(1, 1) - cm(-1, 1);
      const gapLo = cm(-1, -1) - cm(-1, 1), gapHi = cm(1, -1) - cm(1, 1);
      const verdict = Math.abs(ie) < 0.1 * maxAbs ? "Lines are close to parallel — little or no interaction."
        : Math.sign(gapLo) !== Math.sign(gapHi) ? "Lines cross inside the tested range — a strong interaction: the best setting of one factor depends on the other."
        : Math.sign(slopeLo) !== Math.sign(slopeHi) ? "Lines are not parallel and slope in opposite directions — the factor's effect reverses with the other factor's level, which is an interaction."
        : "Lines are not parallel — some interaction.";
      el.innerHTML = `<h4><span>Effects calculator: main effects and interactions</span>
          <span class="seg" role="group" aria-label="Example">${Object.entries(DOE_PRESETS).map(([k2, v]) => `<button type="button" data-p="${k2}" aria-pressed="${k2 === key}">${v.name.split(" (")[0]}</button>`).join("")}</span></h4>
        <p class="hint">${esc(P.name)}. Edit any response. Effect = average at + minus average at −. Interaction columns are products of the factor signs (same signs → +).</p>
        <div class="tbl-wrap"><table class="tbl"><thead><tr><th scope="col">Run</th>${C.map((c) => `<th scope="col" style="text-align:center;${c.length > 1 ? "color:var(--ink-soft)" : ""}">${name(c)}</th>`).join("")}<th scope="col" class="num">${esc(P.unit)}</th></tr></thead>
          <tbody>${P.runs.map((r, ri) => `<tr><th scope="row">${ri + 1}</th>${C.map((c) => { const sg = sign(r, c); return `<td style="text-align:center;font:700 1.05rem var(--display);color:${sg > 0 ? "var(--ink)" : "var(--ink-soft)"}">${sg > 0 ? "+" : "−"}</td>`; }).join("")}<td class="num"><input type="number" step="0.1" value="${r[k]}" data-y="${ri}" style="width:5rem" aria-label="Response run ${ri + 1}"></td></tr>`).join("")}
          <tr><th scope="row">Effect</th>${eff.map((e) => `<td style="text-align:center"><b style="font:700 1.1rem var(--display)">${G.num(e, 2)}</b></td>`).join("")}<td class="num soft small">mean ${G.num(grand, 2)}</td></tr></tbody></table></div>
        <div class="grid2" style="align-items:start">
          <div><p class="small" style="margin:0 0 .3rem"><b>Effects ranked by size</b> (Pareto of |effect|)</p>
            <svg class="viz" viewBox="0 0 320 ${order.length * 26 + 6}" role="img" aria-label="Effects ranked by absolute size">
              ${order.map(([a, i], r) => `<text x="60" y="${r * 26 + 18}" text-anchor="end" font-size="12" font-weight="${C[i].length === 1 ? 700 : 400}">${name(C[i])}</text>
                <rect x="66" y="${r * 26 + 5}" width="${Math.max(2, (a / maxAbs) * 200)}" height="18" rx="4" fill="var(--acc)" opacity="${C[i].length === 1 ? 1 : 0.55}"/>
                <text x="${72 + Math.max(2, (a / maxAbs) * 200)}" y="${r * 26 + 18}" font-size="12">${G.num(eff[i], 2)}</text>`).join("")}
            </svg></div>
          <div><p class="small" style="margin:0 0 .3rem"><b>Interaction plot</b> ${k === 3 ? `<span class="seg" role="group" aria-label="Pair" style="vertical-align:middle;margin-left:.3rem">${[[0, 1], [0, 2], [1, 2]].map((pp) => `<button type="button" data-pair="${pp.join("")}" aria-pressed="${pp[0] === pair[0] && pp[1] === pair[1]}" style="min-height:30px">${P.factors[pp[0]][0]}×${P.factors[pp[1]][0]}</button>`).join("")}</span>` : ""}</p>
            <svg class="viz" viewBox="0 0 320 210" role="img" aria-label="Interaction plot, ${verdict}">
              <line x1="40" x2="300" y1="180" y2="180" stroke="#18283A"/>
              <text x="70" y="196" text-anchor="middle" font-size="11">${esc(P.factors[pi][1])} ${esc(P.factors[pi][2])}</text><text x="270" y="196" text-anchor="middle" font-size="11">${esc(P.factors[pi][3])}</text>
              <line x1="70" x2="270" y1="${iy(cm(-1, -1))}" y2="${iy(cm(1, -1))}" stroke="#2F6DB5" stroke-width="2.5"/>
              <line x1="70" x2="270" y1="${iy(cm(-1, 1))}" y2="${iy(cm(1, 1))}" stroke="#C4751A" stroke-width="2.5" stroke-dasharray="6 3"/>
              ${[[-1, -1, "#2F6DB5"], [1, -1, "#2F6DB5"], [-1, 1, "#C4751A"], [1, 1, "#C4751A"]].map(([a, b, c]) => `<circle cx="${a < 0 ? 70 : 270}" cy="${iy(cm(a, b))}" r="5" fill="${c}"/><text x="${a < 0 ? 62 : 278}" y="${iy(cm(a, b)) + 4}" text-anchor="${a < 0 ? "end" : "start"}" font-size="11">${G.num(cm(a, b), 1)}</text>`).join("")}
            </svg>
            <div class="legend" aria-hidden="true"><span><i style="background:#2F6DB5"></i>${esc(P.factors[pj][1])} ${esc(P.factors[pj][2])}</span><span><i style="background:#C4751A"></i>${esc(P.factors[pj][1])} ${esc(P.factors[pj][3])} (dashed)</span></div>
            <p class="small" style="margin:.2rem 0 0" aria-live="polite">${P.factors[pi][0]}×${P.factors[pj][0]} effect ${G.num(ie, 2)}. ${verdict}</p>
          </div>
        </div>
        <p class="small" style="margin:.8rem 0 .3rem"><b>Main effects plots</b> (dashed line = grand mean). The steeper the line, the bigger the effect.</p>
        <svg class="viz" viewBox="0 0 ${k * 180} 185" role="img" aria-label="Main effects plots">${P.factors.map((_, i) => panel(i, i * 180 + 10)).join("")}</svg>
        <p class="small" aria-live="polite">${(() => { const mains = order.filter(([, i]) => C[i].length === 1).map(([, i]) => i); const top = mains[0]; const f = C[top][0]; const better = (P.goal === "lower") === (eff[top] > 0) ? P.factors[f][2] : P.factors[f][3]; return `Biggest main effect: <b>${esc(P.factors[f][1])}</b> (${G.num(eff[top], 2)}). Goal is ${P.goal} ${esc(P.unit)}, so set it to <b>${esc(better)}</b>. A factor with an effect near zero can be set for cost or speed.`; })()}</p>`;
      $$("[data-p]", el).forEach((b) => b.addEventListener("click", () => { key = b.dataset.p; P = JSON.parse(JSON.stringify(DOE_PRESETS[key])); pair = [0, 1]; draw(); }));
      $$("[data-pair]", el).forEach((b) => b.addEventListener("click", () => { pair = b.dataset.pair.split("").map(Number); draw(); }));
      $$("[data-y]", el).forEach((inp) => inp.addEventListener("change", () => { const i = +inp.dataset.y; P.runs[i][k] = +inp.value || 0; draw(); $(`[data-y="${i}"]`, el).focus(); }));
    }
    draw();
  };

  /* ---------- Ch19: aliasing in a half fraction ---------- */
  G.W.alias = (el) => {
    const full = [[-1, -1, -1], [1, -1, -1], [-1, 1, -1], [1, 1, -1], [-1, -1, 1], [1, -1, 1], [-1, 1, 1], [1, 1, 1]];
    const COLS = [["A", [0]], ["B", [1]], ["C", [2]], ["A×B", [0, 1]], ["A×C", [0, 2]], ["B×C", [1, 2]], ["A×B×C", [0, 1, 2]]];
    let mode = "half", sel = 2;
    function draw() {
      const runs = mode === "half" ? full.filter((r) => r[0] * r[1] * r[2] > 0) : full;
      const v = (c) => runs.map((r) => c.reduce((s, i) => s * r[i], 1));
      const same = (a, b) => v(a).every((x, i) => x === v(b)[i]);
      const allPlus = (c) => v(c).every((x) => x > 0);
      const twins = COLS.map((c, i) => i).filter((i) => i !== sel && same(COLS[i][1], COLS[sel][1]));
      el.innerHTML = `<h4><span>Confounding: why a fraction can mislead</span><span class="seg" role="group" aria-label="Design"><button type="button" data-m="full" aria-pressed="${mode === "full"}">Full 2³ (8 runs)</button><button type="button" data-m="half" aria-pressed="${mode === "half"}">Half fraction 2³⁻¹ (4 runs)</button></span></h4>
        <p class="hint">Click a column. In the half fraction, columns with identical sign patterns cannot be separated — their effects are confounded (aliased).</p>
        <div class="tbl-wrap"><table class="tbl"><thead><tr><th scope="col">Run</th>${COLS.map(([n], i) => `<th scope="col" style="text-align:center"><button type="button" class="btn sm" data-c="${i}" aria-pressed="${i === sel}" style="${i === sel ? "background:var(--acc);color:#fff;border-color:var(--acc)" : twins.includes(i) ? "background:var(--ooc-wash);border-color:var(--ooc)" : ""}">${n}</button></th>`).join("")}</tr></thead>
        <tbody>${runs.map((r, ri) => `<tr><th scope="row">${ri + 1}</th>${COLS.map(([, c], i) => { const s = c.reduce((p, j) => p * r[j], 1); return `<td style="text-align:center;font:700 1.05rem var(--display);${i === sel || twins.includes(i) ? "background:color-mix(in srgb, var(--acc) 10%, white)" : ""}">${s > 0 ? "+" : "−"}</td>`; }).join("")}</tr>`).join("")}</tbody></table></div>
        <p class="small" aria-live="polite">${mode === "full" ? `In the full factorial every column is unique, so <b>${COLS[sel][0]}</b> is estimated cleanly.` : twins.length ? `<b>${COLS[sel][0]}</b> has the same pattern as <b>${twins.map((i) => COLS[i][0]).join(", ")}</b> — the calculated effect is really their sum. ${allPlus([0, 1, 2]) ? "The A×B×C column is all +, so this fraction is defined by I = ABC." : ""}` : `${COLS[sel][0]} is all + in this fraction — it is the defining relation (I = ABC), so it cannot be estimated at all.`}</p>
        <p class="small soft">This is the handbook's Table 19.3 / 19.4 fraction (runs 2, 3, 5 and 8 of the steak example). Fractions are safe when prior full factorials show the interactions are negligible.</p>`;
      $$("[data-m]", el).forEach((b) => b.addEventListener("click", () => { mode = b.dataset.m; draw(); }));
      $$("[data-c]", el).forEach((b) => b.addEventListener("click", () => { sel = +b.dataset.c; draw(); }));
    }
    draw();
  };

  /* ---------- Ch19: number of runs ---------- */
  G.W.runs = (el) => {
    let L = 2, F = 3, p = 0, r = 1;
    function draw() {
      const base = L === 2 ? 2 ** (F - p) : L ** F, full = L ** F;
      el.innerHTML = `<h4>How many runs?</h4>
        <p class="hint">Full factorial runs = L<sup>F</sup> (levels to the power of factors). A two-level fraction 2<sup>F−p</sup> runs 1/2<sup>p</sup> of them. Replicates multiply the total.</p>
        <div class="row">
          <label class="field">Levels (L)<input type="number" min="2" max="5" value="${L}" data-k="L"></label>
          <label class="field">Factors (F)<input type="number" min="1" max="10" value="${F}" data-k="F"></label>
          <label class="field">Fraction p (two-level only)<input type="number" min="0" max="${Math.max(0, F - 1)}" value="${p}" data-k="p" ${L !== 2 ? "disabled" : ""}></label>
          <label class="field">Replicates<input type="number" min="1" max="10" value="${r}" data-k="r"></label>
        </div>
        <div class="readout">${G.ro("Full factorial L^F", full.toLocaleString("en-US"), `${L}^${F}`)}${G.ro(p && L === 2 ? `Fraction 2^(${F}−${p})` : "Design used", base.toLocaleString("en-US"), p && L === 2 ? `1/${2 ** p} of the runs` : "")}${G.ro("Total tests with replicates", (base * r).toLocaleString("en-US"), `× ${r}`, true)}</div>`;
      $$("[data-k]", el).forEach((i) => i.addEventListener("change", () => { const v = Math.round(+i.value || 0); if (i.dataset.k === "L") L = Math.min(5, Math.max(2, v)); if (i.dataset.k === "F") F = Math.min(10, Math.max(1, v)); if (i.dataset.k === "p") p = Math.min(F - 1, Math.max(0, v)); if (i.dataset.k === "r") r = Math.min(10, Math.max(1, v)); if (p > F - 1) p = Math.max(0, F - 1); draw(); }));
    }
    draw();
  };

  /* ---------- Ch19: classifiers ---------- */
  G.W.doeterms = (el) => G.classifier(el, {
    title: "Name the DOE term", select: true,
    cats: ["Factor", "Level", "Treatment combination", "Response", "Block", "Replication", "Repetition", "Randomization", "Experimental error", "Confounding", "Interaction"],
    items: [
      { t: "Oven temperature, which the experimenter deliberately changes.", a: 0 },
      { t: "The settings 180 °F, 200 °F and 220 °F.", a: 1 },
      { t: "Pressure 200 psi, temperature 70 °F, feed high — all set together for one run.", a: 2 },
      { t: "Moisture content measured after each batch.", a: 3 },
      { t: "Samples from the same raw-material batch, grouped because they are alike.", a: 4 },
      { t: "Running the whole set of treatment combinations again, resetting each condition and in random order.", a: 5, why: "Replication resets the setup each time, so setup variation is captured — more expensive, more valid." },
      { t: "Running several trials back to back without resetting the machine setup.", a: 6, why: "Repetition cannot capture setup-to-setup variation." },
      { t: "Assigning run order by chance so that noise such as time of day spreads across all treatments.", a: 7 },
      { t: "Variation in the response when every factor and level is held constant.", a: 8 },
      { t: "In a half fraction, the C column has the same signs as the A×B column.", a: 9 },
      { t: "The effect of feed rate depends on which coolant temperature is used.", a: 10 }
    ]
  });
  G.W.designpick = (el) => G.classifier(el, {
    title: "Which experimental design fits?", select: true,
    cats: ["Completely randomized", "Randomized block", "Latin square", "Full factorial", "Fractional factorial", "Response surface", "Mixture", "Nested"],
    items: [
      { t: "One factor, and the 12 tests can run in any order with no known noise source.", a: 0 },
      { t: "One factor, run one batch per temperature per day, randomizing the order within each day.", a: 1 },
      { t: "One factor at three levels, blocking two noise variables (3 days × 3 machines), assuming no interactions.", a: 2, why: "Rows, columns and treatments must all be equal in number, and there must be no interactions — so it is not a factorial." },
      { t: "Three two-level factors where every interaction must be estimated cleanly.", a: 3 },
      { t: "Seven factors screened in only eight runs, assuming interactions are negligible.", a: 4 },
      { t: "Map how two settings shape the response so you can find the optimum.", a: 5 },
      { t: "Find the best percentages of three resin components that must total 100%.", a: 6 },
      { t: "Study how much variability comes from batches versus samples within batches.", a: 7, why: "Nested designs study relative variability rather than mean effects." }
    ]
  });
  G.W.doeobj = (el) => G.classifier(el, {
    title: "Match the experimental objective",
    cats: ["Comparative", "Screening", "Response surface", "Mixture"],
    items: [
      { t: "Decide whether the new supplier's resin changes tensile strength.", a: 0, why: "Conclude whether one factor is significant." },
      { t: "Out of twelve candidate factors, find the few that matter.", a: 1 },
      { t: "Find the temperature and pressure that maximize yield, and where the process is weak.", a: 2 },
      { t: "Determine the best blend ratio of three ingredients.", a: 3 }
    ]
  });

  /* ---------- Ch20: implementation gates ---------- */
  G.W.gates = (el) => {
    const GT = [
      { n: "Proof of concept", when: "Early", job: "Confirms feasibility: the solution suits the problem, fits cost and constraints, can meet stakeholders' success criteria, and justifies resources, schedule and commitments.", gate: "A milestone that unlocks broader commitment to the project." },
      { n: "Try-storming", when: "Middle", job: "Brainstorming plus action: the most feasible ideas are quickly prototyped, simulated or role-played so participants can add their own improvements. Also a strong training technique.", gate: "A filter that quickly discards approaches that are not feasible." },
      { n: "Pilot test", when: "Late", job: "A reduced-scope, tightly controlled sample of the solution (e.g. off-peak). Verifies effectiveness, validates the implementation plan, shows people can deploy it, confirms results and exposes side effects.", gate: "Controls scope and scale, so a failing solution can be rolled back within bounds." }
    ];
    let on = 0, gap = 2, ts = 2;
    function draw() {
      const diag = gap > 8 ? "Months between proof of concept and try-storming suggest the project is slipping or being abandoned." : ts === 0 ? "Jumping to a pilot without try-storming suggests the team is short of ideas." : "The gates are moving at a healthy pace.";
      el.innerHTML = `<h4>Three gates before full deployment</h4>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:.4rem" role="group" aria-label="Gates">${GT.map((g, i) => `<button type="button" class="btn" data-i="${i}" aria-pressed="${i === on}" style="min-height:64px;text-align:left;${i === on ? "background:var(--acc);color:#fff;border-color:var(--acc)" : ""}"><span style="font:700 1.15rem var(--display)">${i + 1} ${g.n}</span><br><span class="small" style="font-weight:400">${g.when}</span></button>`).join("")}</div>
        <div class="grid2" style="margin-top:.7rem" aria-live="polite"><p class="small" style="margin:0"><b>What it does:</b> ${GT[on].job}</p><p class="small" style="margin:0"><b>As a gate:</b> ${GT[on].gate}</p></div>
        <p class="small" style="margin:.9rem 0 .3rem"><b>Tracking the gates as a metric</b> — the handbook treats time between gates as a progress signal.</p>
        <div class="grid2">
          <label class="field">Weeks from proof of concept to try-storming: <b style="color:var(--ink)">${gap}</b><input type="range" min="0" max="20" value="${gap}" data-k="gap"></label>
          <label class="field">Try-storming rounds before the pilot: <b style="color:var(--ink)">${ts}</b><input type="range" min="0" max="5" value="${ts}" data-k="ts"></label>
        </div>
        <p class="small ${gap > 8 || ts === 0 ? "feedback bad" : "feedback good"}" aria-live="polite">${diag}</p>`;
      $$("[data-i]", el).forEach((b) => b.addEventListener("click", () => { on = +b.dataset.i; draw(); }));
      $$("[data-k]", el).forEach((r) => r.addEventListener("input", () => { if (r.dataset.k === "gap") gap = +r.value; else ts = +r.value; const k = r.dataset.k; draw(); $(`[data-k="${k}"]`, el).focus(); }));
    }
    draw();
  };
  G.W.implsort = (el) => G.classifier(el, {
    title: "Proof of concept, try-storming or pilot test?",
    cats: ["Proof of concept", "Try-storming", "Pilot test"],
    items: [
      { t: "Before asking for budget, the team shows stakeholders that auto-renewal can meet the success criteria within cost limits.", a: 0 },
      { t: "Right after brainstorming, the team mocks up three versions of the returns screen and lets users tweak them.", a: 1 },
      { t: "The new slotting logic runs on one aisle during the night shift for two weeks, with a rollback plan.", a: 2 },
      { t: "Operators role-play the new hand-off between pick and pack to see what breaks.", a: 1, why: "Role-playing a process revision is try-storming — also an effective training method." },
      { t: "The goal is to find unintended side effects before full rollout, such as losing upsell calls when renewals go automatic.", a: 2, why: "The handbook's subscription example: fixing missed payments removed a personal touchpoint." },
      { t: "Early-stage design validation that elicits feedback and detailed inputs from participants.", a: 0 }
    ]
  });

  /* ---------- Ch21: takt time and line balance ---------- */
  G.W.takt = (el) => {
    let avail = 480, demand = 160;
    const st = [["Prep", 2.4], ["Prime", 2.9], ["Paint", 3.4], ["Dry check", 1.8], ["Pack", 2.6]];
    function draw() {
      const takt = avail / demand, cts = st.map((s) => s[1]), bn = Math.max(...cts), bi = cts.indexOf(bn), sum = cts.reduce((a, b) => a + b, 0);
      const maxY = Math.max(bn, takt) * 1.2, W = 560, H = 230, L = 40, B = 190, bw = Math.min(80, (W - L - 20) / st.length - 14);
      const y = (v) => B - (v / maxY) * (B - 15), x = (i) => L + 10 + i * ((W - L - 20) / st.length);
      el.innerHTML = `<h4>Takt time and line balance</h4>
        <p class="hint">Takt time = available work time ÷ customer demand. Every station's cycle time must be at or under takt, or a backlog builds. The slowest station (the bottleneck) sets the real pace.</p>
        <div class="row">
          <label class="field">Available minutes per day<input type="number" min="1" value="${avail}" data-k="a"></label>
          <label class="field">Customer demand (units/day)<input type="number" min="1" value="${demand}" data-k="d"></label>
          ${st.map((s, i) => `<label class="field">${esc(s[0])} (min)<input type="number" step="0.1" min="0" value="${s[1]}" data-s="${i}" style="width:5rem"></label>`).join("")}
        </div>
        <svg class="viz" viewBox="0 0 ${W} ${H}" role="img" aria-label="Station cycle times against takt time ${G.num(takt, 2)} minutes">
          ${[0, 1, 2, 3, 4, 5].filter((v) => v <= maxY).map((v) => `<line x1="${L}" x2="${W - 10}" y1="${y(v)}" y2="${y(v)}" stroke="#E1E7E3"/><text x="${L - 6}" y="${y(v) + 4}" text-anchor="end" font-size="11" class="t-soft">${v}</text>`).join("")}
          ${st.map((s, i) => `<rect x="${x(i)}" y="${y(s[1])}" width="${bw}" height="${B - y(s[1])}" rx="4" fill="${s[1] > takt ? "var(--ooc)" : "var(--acc)"}"/><text x="${x(i) + bw / 2}" y="${y(s[1]) - 6}" text-anchor="middle" font-size="12" font-weight="700">${G.num(s[1], 1)}</text><text x="${x(i) + bw / 2}" y="${B + 16}" text-anchor="middle" font-size="12">${esc(s[0])}</text>`).join("")}
          <line x1="${L}" x2="${W - 10}" y1="${y(takt)}" y2="${y(takt)}" stroke="#18283A" stroke-width="2" stroke-dasharray="7 4"/>
          <text x="${W - 12}" y="${y(takt) - 6}" text-anchor="end" font-size="12" font-weight="700">takt ${G.num(takt, 2)} min</text>
          <line x1="${L}" x2="${W - 10}" y1="${B}" y2="${B}" stroke="#18283A"/>
        </svg>
        <div class="readout">${G.ro("Takt time", G.num(takt, 2) + " min/unit", `${avail} ÷ ${demand}`, true)}${G.ro("Bottleneck", esc(st[bi][0]), G.num(bn, 1) + " min")}${G.ro("Output at bottleneck pace", Math.floor(avail / bn) + " units", `vs demand ${demand}`)}${G.ro("Minimum stations if perfectly balanced", Math.ceil(sum / takt), `⌈Σ cycle time ÷ takt⌉ = ⌈${G.num(sum, 1)} ÷ ${G.num(takt, 2)}⌉`)}</div>
        <p class="small" aria-live="polite">${bn > takt ? `<b>${st.filter((s) => s[1] > takt).map((s) => esc(s[0])).join(", ")} exceed${st.filter((s) => s[1] > takt).length > 1 ? "" : "s"} takt</b> — demand cannot be met. Rebalance work, add capacity at the bottleneck, or cut its cycle time.` : "Every station is at or under takt. Ideal balance: all stations close to takt, each downstream step slightly faster than the one before."} The last readout uses the standard line-balancing rule, not printed in the handbook.</p>`;
      $$("[data-k]", el).forEach((i) => i.addEventListener("change", () => { const v = Math.max(1, +i.value || 1); if (i.dataset.k === "a") avail = v; else demand = v; draw(); }));
      $$("[data-s]", el).forEach((i) => i.addEventListener("change", () => { st[+i.dataset.s][1] = Math.max(0, +i.value || 0); const s = i.dataset.s; draw(); $(`[data-s="${s}"]`, el).focus(); }));
    }
    draw();
  };

  /* ---------- Ch21: process capacity sheet ---------- */
  G.W.capacity = (el) => {
    const v = { machine: 1.5, manual: 0.5, pieces: 200, change: 20, avail: 450, demand: 200 };
    function draw() {
      const cycle = v.machine + v.manual, tcp = v.change / v.pieces, cap = v.avail / (cycle + tcp);
      el.innerHTML = `<h4>Process capacity sheet</h4>
        <p class="hint">Capacity = available time per shift ÷ (total cycle time per piece + tool-change time per piece). All times in minutes.</p>
        <div class="row">
          ${[["machine", "Machine time / piece"], ["manual", "Manual time / piece"], ["pieces", "Pieces per tool change"], ["change", "Tool change time"], ["avail", "Available time / shift"], ["demand", "Demand / shift"]].map(([k, l]) => `<label class="field">${l}<input type="number" step="0.1" min="0" value="${v[k]}" data-k="${k}"></label>`).join("")}
        </div>
        <div class="readout">${G.ro("Total cycle time / piece", G.num(cycle, 2), "machine + manual")}${G.ro("Tool change / piece", G.num(tcp, 3), `${v.change} ÷ ${v.pieces}`)}${G.ro("Capacity per shift", Math.floor(cap).toLocaleString("en-US") + " pcs", "", true)}${G.ro("Takt time", G.num(v.avail / v.demand, 2) + " min", "available ÷ demand")}</div>
        <p class="small ${cap < v.demand ? "feedback bad" : "feedback good"}" aria-live="polite">${cap < v.demand ? `Capacity (${Math.floor(cap)}) is below demand (${v.demand}) — this step cannot keep up with takt; focus problem-solving here.` : `Capacity covers demand with ${Math.floor(cap - v.demand)} pieces to spare.`}</p>`;
      $$("[data-k]", el).forEach((i) => i.addEventListener("change", () => { v[i.dataset.k] = Math.max(i.dataset.k === "pieces" || i.dataset.k === "avail" ? 1 : 0, +i.value || 0); const k = i.dataset.k; draw(); $(`[data-k="${k}"]`, el).focus(); }));
    }
    draw();
  };

  /* ---------- Ch21: Little's law ---------- */
  G.W.littles = (el) => {
    let wip = 600, th = 120;
    function draw() {
      const lt = wip / th;
      el.innerHTML = `<h4>Little's law: WIP drives lead time</h4>
        <p class="hint">Lead time = work in process ÷ throughput. Pull systems cap WIP, and lead time falls with it.</p>
        <div class="grid2">
          <label class="field">Work in process: <b style="color:var(--ink)">${wip} units</b><input type="range" min="50" max="1200" step="10" value="${wip}" data-k="w"></label>
          <label class="field">Throughput: <b style="color:var(--ink)">${th} units/day</b><input type="range" min="20" max="300" step="5" value="${th}" data-k="t"></label>
        </div>
        <div class="readout">${G.ro("Lead time", G.num(lt, 1) + " days", `${wip} ÷ ${th}`, true)}${G.ro("Lead time if WIP halves", G.num(lt / 2, 1) + " days", "same throughput")}</div>`;
      $$("[data-k]", el).forEach((r) => r.addEventListener("input", () => { if (r.dataset.k === "w") wip = +r.value; else th = +r.value; const k = r.dataset.k; draw(); $(`[data-k="${k}"]`, el).focus(); }));
    }
    draw();
  };

  /* ---------- Ch21: SMED ---------- */
  G.W.smed = (el) => {
    const S = [
      { n: "Find the next die in storage", t: 8, canExt: true },
      { n: "Fetch tools and setup sheet", t: 5, canExt: true },
      { n: "Preheat the new die", t: 10, canExt: true },
      { n: "Remove the old die", t: 6, canExt: false },
      { n: "Mount and clamp the new die", t: 7, canExt: false },
      { n: "Adjust and run trial pieces until the first good part", t: 14, canExt: false, std: 4 },
      { n: "Return the old die to storage", t: 4, canExt: true }
    ];
    const ext = new Set(); let standardized = false;
    function draw() {
      const tm = (s) => (s.std && standardized ? s.std : s.t);
      const internal = S.filter((s, i) => !ext.has(i)).reduce((a, s) => a + tm(s), 0), before = S.reduce((a, s) => a + s.t, 0);
      el.innerHTML = `<h4>Quick changeover (SMED)</h4>
        <p class="hint">Setup time runs from the last piece of one product to the first good piece of the next. Move work that can be done while the machine is still running (external) out of the stoppage, then attack what remains (internal) — standardizing eliminates adjustments.</p>
        <div class="sort-list">${S.map((s, i) => `<div class="sort-item" style="display:flex;justify-content:space-between;gap:.6rem;align-items:center;flex-wrap:wrap;${ext.has(i) ? "border-color:var(--belt);background:var(--belt-wash)" : ""}">
            <span><b>${tm(s)} min</b> ${esc(s.n)}</span>
            ${s.canExt ? `<button type="button" class="btn sm" data-e="${i}" aria-pressed="${ext.has(i)}">${ext.has(i) ? "External ✓ (machine running)" : "Move to external"}</button>` : `<span class="small soft">Internal — machine must stop</span>`}
          </div>`).join("")}</div>
        <div class="row" style="margin-top:.6rem"><button type="button" class="btn sm" data-a="std" aria-pressed="${standardized}">${standardized ? "Adjustments eliminated ✓" : "Standardize tools and positions to eliminate adjustments"}</button><button type="button" class="btn sm" data-a="reset">Reset</button></div>
        <div class="readout">${G.ro("Setup time before", before + " min", "everything done while stopped")}${G.ro("Setup time now (internal only)", internal + " min", `${Math.round((1 - internal / before) * 100)}% shorter`, true)}</div>`;
      $$("[data-e]", el).forEach((b) => b.addEventListener("click", () => { const i = +b.dataset.e; ext.has(i) ? ext.delete(i) : ext.add(i); draw(); }));
      $("[data-a=std]", el).addEventListener("click", () => { standardized = !standardized; draw(); });
      $("[data-a=reset]", el).addEventListener("click", () => { ext.clear(); standardized = false; draw(); });
    }
    draw();
  };

  /* ---------- Ch21: classifiers ---------- */
  G.W.fives = (el) => G.classifier(el, {
    title: "Which 5S step is this?",
    cats: ["Sort (seiri)", "Set in order (seiton)", "Shine (seiso)", "Standardize (seiketsu)", "Sustain (shitsuke)"],
    items: [
      { t: "Red-tag and remove fixtures nobody has used in six months.", a: 0 },
      { t: "Outline a home on the shadow board for every tool — a place for everything.", a: 1 },
      { t: "Clean the gauge station and remove clutter so measurements are not affected.", a: 2, why: "The handbook ties housekeeping to measurement quality: process data is filtered through the measurement system." },
      { t: "Write the cleaning checklist and the standard layout into the area's procedures.", a: 3 },
      { t: "Weekly 5S audits keep the first four steps from slipping.", a: 4 }
    ]
  });
  G.W.wastes = (el) => G.classifier(el, {
    title: "Name the waste (TIM WOOD)", select: true,
    cats: ["Transportation", "Inventory", "Motion", "Waiting", "Overproduction", "Overprocessing", "Defects"],
    items: [
      { t: "Pallets moved from receiving to a staging area and then again to the line.", a: 0 },
      { t: "Three weeks of work-in-process stacked between press and paint.", a: 1 },
      { t: "A picker walks to the end of the aisle for tape every few orders.", a: 2 },
      { t: "Operators idle while the next batch is released.", a: 3 },
      { t: "Running the full lot because setups are long, even though only half is ordered.", a: 4, why: "Often the worst waste — it creates the others." },
      { t: "Polishing an internal surface the customer never sees.", a: 5 },
      { t: "Re-labelling cartons shipped with the wrong address.", a: 6 }
    ]
  });
  G.W.flow5 = (el) => G.classifier(el, {
    title: "Flow analysis: which of Shingo's five elements?",
    cats: ["Processing", "Inspection", "Transportation", "Process delay", "Lot delay"],
    items: [
      { t: "The part is machined to its final shape.", a: 0 },
      { t: "The part is compared with the drawing.", a: 1 },
      { t: "The part moves by forklift to assembly.", a: 2 },
      { t: "An entire lot waits while the previous lot is still being processed.", a: 3 },
      { t: "One piece is worked on while the rest of its lot waits to be inspected or moved.", a: 4 }
    ]
  });
  G.W.kaizentype = (el) => G.classifier(el, {
    title: "Kaizen, kaizen blitz or kaikaku?",
    cats: ["Kaizen", "Kaizen blitz (event)", "Kaikaku"],
    items: [
      { t: "Operators suggest and test small, low-cost changes every week, year after year.", a: 0, why: "Evolutionary, incremental, continuous." },
      { t: "A trained cross-functional team redesigns the returns cell, collects data and implements changes within one week.", a: 1 },
      { t: "Management relocates the plant and replaces the batch process with a new production technology after a competitor's move.", a: 2, why: "Revolutionary, management-initiated, often triggered externally — and it gives kaizen a new baseline." },
      { t: "Small improvements that keep a redesigned process from deteriorating after the big change.", a: 0, why: "Without kaizen, kaikaku gains decay." }
    ]
  });
  G.W.leanpick = (el) => G.classifier(el, {
    title: "Pick the lean tool", select: true,
    cats: ["Pull system / kanban", "5S", "Standard work", "Poka-yoke", "Quick changeover (SMED)", "Total productive maintenance", "Visual factory", "One-piece flow", "Jidoka", "Theory of constraints"],
    items: [
      { t: "Parts are restocked only after the line consumes them.", a: 0 },
      { t: "A fixture makes it impossible to stack parts on the pallet upside down.", a: 3, why: "The handbook's press-operator example." },
      { t: "Changeovers take two hours, forcing large lot sizes.", a: 4 },
      { t: "The best-known sequence, cycle time and minimum parts on hand are documented as the baseline for improvement.", a: 2 },
      { t: "Operators clean, lubricate and inspect their own machines to prevent breakdowns.", a: 5 },
      { t: "A board shows hourly output against plan so anyone can see if the line is behind.", a: 6 },
      { t: "Parts move one at a time between stations instead of in batches of 50.", a: 7 },
      { t: "The machine detects a bad part and stops itself without an operator watching.", a: 8 },
      { t: "Inventory is limited to what the slowest step can process.", a: 9 },
      { t: "Tools are scattered and searching wastes minutes every shift.", a: 1 }
    ]
  });
})();
