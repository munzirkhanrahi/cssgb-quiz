/* Widgets: Chapter 8 and 9 */
(function () {
  "use strict";
  const { $, $$, esc } = G;
  const pct = (x, sig = 6) => {
    if (!isFinite(x)) return "—";
    if (x >= 0.99) { const miss = 1 - x; const dec = Math.min(8, Math.max(2, Math.ceil(-Math.log10(miss || 1e-9)) + 1)); return (x * 100).toFixed(dec - 1) + "%"; }
    return (x * 100).toFixed(2) + "%";
  };

  G.ppm = (v) => (v >= 10 ? Math.round(v).toLocaleString("en-US") : v >= 0.01 ? Number(v.toPrecision(2)).toString() : v.toExponential(1));

  /* ---------- Ch8: CPI / SPI quadrant ---------- */
  G.W.evm = (el) => {
    let pv = 90000, ev = 80000, ac = 100000;
    function draw() {
      const cpi = ev / ac, spi = ev / pv, cv = ev - ac, sv = ev - pv;
      const W = 360, S = 300, px = (v) => 30 + ((Math.min(1.5, Math.max(0.5, v)) - 0.5) / 1) * S, py = (v) => 10 + (1 - (Math.min(1.5, Math.max(0.5, v)) - 0.5) / 1) * S;
      const status = `${spi >= 1 ? "on or ahead of schedule" : "behind schedule"}, ${cpi >= 1 ? "on or under budget" : "over budget"}`;
      const $f = (n) => (n < 0 ? "−$" : "$") + Math.abs(Math.round(n)).toLocaleString("en-US");
      el.innerHTML = `<h4>Cost and schedule performance index</h4>
        <p class="hint">Both indices put earned value (EV, the budgeted cost of work performed) on top. Above 1 is good.</p>
        <div class="row">
          <label class="field">Planned value (PV)<input type="number" step="1000" value="${pv}" data-k="pv"></label>
          <label class="field">Earned value (EV)<input type="number" step="1000" value="${ev}" data-k="ev"></label>
          <label class="field">Actual cost (AC)<input type="number" step="1000" value="${ac}" data-k="ac"></label>
        </div>
        <div class="grid2" style="align-items:center;margin-top:.6rem">
          <svg class="viz" viewBox="0 0 ${W} ${S + 50}" style="max-width:360px" role="img" aria-label="Quadrant chart, project is ${status}">
            <rect x="30" y="10" width="${S}" height="${S}" fill="#fff" stroke="#CBD5CE"/>
            <line x1="${px(1)}" x2="${px(1)}" y1="10" y2="${S + 10}" stroke="#18283A" stroke-width="1.5"/><line y1="${py(1)}" y2="${py(1)}" x1="30" x2="${S + 30}" stroke="#18283A" stroke-width="1.5"/>
            <text x="${px(1.25)}" y="30" text-anchor="middle" font-size="11.5" class="t-soft">ahead · under budget</text>
            <text x="${px(0.75)}" y="30" text-anchor="middle" font-size="11.5" class="t-soft">behind · under budget</text>
            <text x="${px(0.75)}" y="${S}" text-anchor="middle" font-size="11.5" class="t-soft">behind · over budget</text>
            <text x="${px(1.25)}" y="${S}" text-anchor="middle" font-size="11.5" class="t-soft">ahead · over budget</text>
            ${[0.5, 1, 1.5].map((v) => `<text x="${px(v)}" y="${S + 26}" text-anchor="middle" font-size="11">${v}</text><text x="24" y="${py(v) + 4}" text-anchor="end" font-size="11">${v}</text>`).join("")}
            <text x="${30 + S / 2}" y="${S + 44}" text-anchor="middle" font-size="12" font-weight="700">SPI = EV / PV</text>
            <text x="8" y="${10 + S / 2}" font-size="12" font-weight="700" transform="rotate(-90 8 ${10 + S / 2})" text-anchor="middle">CPI = EV / AC</text>
            <circle cx="${px(spi)}" cy="${py(cpi)}" r="9" fill="var(--acc)" stroke="#fff" stroke-width="2.5"/>
          </svg>
          <div>
            <div class="readout">${G.ro("CPI = EV / AC", G.num(cpi, 3), cpi >= 1 ? "≥ 1 on or under budget" : "< 1 over budget", true)}${G.ro("SPI = EV / PV", G.num(spi, 3), spi >= 1 ? "≥ 1 on or ahead" : "< 1 behind schedule", true)}${G.ro("Cost variance EV − AC", $f(cv))}${G.ro("Schedule variance EV − PV", $f(sv))}</div>
            <p class="small" aria-live="polite" style="margin-top:.5rem">Status: <b>${status}</b>. For every dollar spent, the project earned ${G.num(cpi, 2)} dollars of planned work.</p>
          </div>
        </div>`;
      $$("[data-k]", el).forEach((i) => i.addEventListener("change", () => { const v = Math.max(1, +i.value || 1); if (i.dataset.k === "pv") pv = v; if (i.dataset.k === "ev") ev = v; if (i.dataset.k === "ac") ac = v; const k = i.dataset.k; draw(); $(`[data-k="${k}"]`, el).focus(); }));
    }
    draw();
  };

  /* ---------- Ch8: DPU / DPO / DPMO from opportunities ---------- */
  G.W.dpmo = (el) => {
    let units = 40000, defects = 165;
    const types = [["Blurred printing", 1], ["Dimension checks", 3], ["Rolled ends (top/bottom)", 2]];
    function draw() {
      const opu = types.reduce((s, t) => s + t[1], 0), topp = units * opu;
      const dpu = defects / units, dpo = defects / topp, dpmo = dpo * 1e6, sig = G.sigmaFromDPMO(dpmo);
      el.innerHTML = `<h4>DPU, DPO, DPMO and sigma level</h4>
        <p class="hint">The handbook's pencil batch. Count the ways each defect can occur on one unit, then multiply by units.</p>
        <div class="grid2" style="align-items:start">
          <div>
            <div class="row"><label class="field">Units in batch<input type="number" min="1" value="${units}" data-k="u"></label><label class="field">Total defects found<input type="number" min="0" value="${defects}" data-k="d"></label></div>
            <div class="tbl-wrap"><table class="tbl"><thead><tr><th scope="col">Defect type</th><th scope="col" class="num">Ways per unit</th><th scope="col" class="num">Opportunities</th></tr></thead>
              <tbody>${types.map((t, i) => `<tr><th scope="row">${esc(t[0])}</th><td class="num"><input type="number" min="0" value="${t[1]}" data-t="${i}" style="width:4.2rem" aria-label="Ways per unit for ${esc(t[0])}"></td><td class="num">${(units * t[1]).toLocaleString("en-US")}</td></tr>`).join("")}
              <tr><th scope="row">Total</th><td class="num"><b>${opu}</b></td><td class="num"><b>${topp.toLocaleString("en-US")}</b></td></tr></tbody></table></div>
          </div>
          <div class="readout" style="margin-top:0">
            ${G.ro("DPU = defects ÷ units", G.sig(dpu, 4), `${defects} ÷ ${units.toLocaleString("en-US")}`)}
            ${G.ro("DPO = defects ÷ (units × opps)", G.sig(dpo, 4), `= DPU ÷ ${opu}`)}
            ${G.ro("DPMO = DPO × 10⁶", G.sig(dpmo, 5), "", true)}
            ${G.ro("Yield per opportunity", pct(1 - dpo), "1 − DPO")}
            ${G.ro("Sigma level", G.num(sig, 2), "Z of (1 − DPO) + 1.5 shift", true)}
            ${G.ro("Throughput yield e^−DPU", pct(Math.exp(-dpu)), "chance a unit has zero defects")}
          </div>
        </div>`;
      $$("[data-k]", el).forEach((i) => i.addEventListener("change", () => { if (i.dataset.k === "u") units = Math.max(1, Math.round(+i.value || 1)); else defects = Math.max(0, Math.round(+i.value || 0)); draw(); }));
      $$("[data-t]", el).forEach((i) => i.addEventListener("change", () => { types[+i.dataset.t][1] = Math.max(0, Math.round(+i.value || 0)); draw(); }));
    }
    draw();
  };

  /* ---------- Ch8: rolled throughput yield ---------- */
  G.W.rty = (el) => {
    const steps = [["Process 1", 0.994], ["Process 2", 0.987], ["Process 3", 0.951], ["Process 4", 0.99]];
    let dpu = 0.25;
    function draw() {
      let flow = 1000; const f = [flow];
      steps.forEach((s) => { flow *= s[1]; f.push(flow); });
      const rty = steps.reduce((p, s) => p * s[1], 1), avg = steps.reduce((a, s) => a + s[1], 0) / steps.length, low = Math.min(...steps.map((s) => s[1]));
      const W = 600, bh = 26, max = 1000;
      el.innerHTML = `<h4>Rolled throughput yield: the hidden factory</h4>
        <p class="hint">RTY multiplies first-time yields of a series of processes (handbook example: .994, .987, .951, .990). Edit any yield.</p>
        <div class="row" style="margin-bottom:.5rem">${steps.map((s, i) => `<label class="field">${s[0]}<input type="number" step="0.001" min="0" max="1" value="${s[1]}" data-y="${i}" style="width:5.4rem"></label>`).join("")}
          <button class="btn sm" data-a="add">Add step</button>${steps.length > 1 ? '<button class="btn sm" data-a="rm">Remove last</button>' : ""}</div>
        <svg class="viz" viewBox="0 0 ${W} ${(steps.length + 1) * (bh + 8) + 8}" role="img" aria-label="Units passing each step first time out of 1000">
          ${f.map((v, i) => `<text x="0" y="${i * (bh + 8) + 18}" font-size="12.5">${i === 0 ? "Enter" : "After " + steps[i - 1][0].toLowerCase()}</text>
            <rect x="130" y="${i * (bh + 8)}" width="${((W - 210) * v) / max}" height="${bh}" rx="4" fill="var(--acc)" opacity="${i === 0 ? 0.4 : 1}"/>
            <text x="${130 + ((W - 210) * v) / max + 6}" y="${i * (bh + 8) + 18}" font-size="12.5" font-weight="700">${v.toFixed(0)}</text>`).join("")}
        </svg>
        <div class="readout">${G.ro("RTY = product of yields", G.num(rty, 4), `${(rty * 1000).toFixed(0)} of 1,000 pass every step first time`, true)}${G.ro("Average yield (wrong)", G.num(avg, 4), "distractor")}${G.ro("Lowest step (wrong)", G.num(low, 4), "distractor")}</div>
        <h4 style="margin-top:1rem">Throughput yield from DPU</h4>
        <p class="hint">With defects following a Poisson pattern, the chance a unit has zero defects is e<sup>−DPU</sup>.</p>
        <div class="row"><label class="field">DPU<input type="number" step="0.01" min="0" value="${dpu}" data-a="dpu"></label></div>
        <div class="readout">${G.ro("Throughput yield = e^−DPU", G.num(Math.exp(-dpu), 4), "", true)}${G.ro("1 − DPU (wrong)", G.num(1 - dpu, 4), "only close when DPU is tiny")}</div>`;
      $$("[data-y]", el).forEach((i) => i.addEventListener("change", () => { steps[+i.dataset.y][1] = Math.min(1, Math.max(0, +i.value || 0)); draw(); }));
      const add = $("[data-a=add]", el); add.addEventListener("click", () => { steps.push(["Process " + (steps.length + 1), 0.98]); draw(); });
      const rm = $("[data-a=rm]", el); if (rm) rm.addEventListener("click", () => { steps.pop(); draw(); });
      $("[data-a=dpu]", el).addEventListener("change", (e) => { dpu = Math.max(0, +e.target.value || 0); draw(); });
    }
    draw();
  };

  /* ---------- Ch8: sigma level and capability on a normal curve ---------- */
  G.W.sigma = (el) => {
    let lsl = 4.988, usl = 5.012, sd = 0.004, shift = 0;
    const PRE = [["3σ, centred", 0.004, 0], ["3σ, mean +1.5σ", 0.004, 1.5], ["6σ, mean +1.5σ", 0.002, 1.5]];
    function draw() {
      const tgt = (lsl + usl) / 2, mu = tgt + shift * sd;
      const zu = (usl - mu) / sd, zl = (mu - lsl) / sd;
      const pu = G.upperTail(zu), pl = G.upperTail(zl), yld = 1 - pu - pl, ppm = (pu + pl) * 1e6;
      const cp = (usl - lsl) / (6 * sd), cpk = Math.min(zu, zl) / 3, cr = 1 / cp, k = (usl - lsl) / 2 / sd;
      const half = Math.max(7 * sd, (usl - lsl) * 0.75), x0 = tgt - half, x1 = tgt + half;
      const W = 600, H = 220, L = 20, R = 580, B = 180;
      const sx = (x) => L + ((x - x0) / (x1 - x0)) * (R - L);
      const pdf = (x) => Math.exp(-0.5 * ((x - mu) / sd) ** 2);
      const sy = (v) => B - v * 150;
      const pts = (a, b, n = 120) => { let s = ""; for (let i = 0; i <= n; i++) { const x = a + ((b - a) * i) / n; s += `${sx(x).toFixed(1)},${sy(pdf(x)).toFixed(1)} `; } return s; };
      const area = (a, b) => `${sx(a).toFixed(1)},${B} ${pts(a, b)} ${sx(b).toFixed(1)},${B}`;
      el.innerHTML = `<h4>Sigma level, yield and Cp / Cpk on one curve</h4>
        <p class="hint">Handbook example: tolerance 5.000 ± 0.012. Shrink σ or shift the mean and read the yield.</p>
        <div class="row" style="margin-bottom:.4rem">${PRE.map((p, i) => `<button class="btn sm" data-p="${i}">${p[0]}</button>`).join("")}</div>
        <div class="grid2">
          <label class="field">Standard deviation σ: <b style="color:var(--ink)">${sd.toFixed(4)}</b><input type="range" min="0.0015" max="0.008" step="0.0001" value="${sd}" data-k="sd" aria-valuetext="${sd.toFixed(4)}"></label>
          <label class="field">Mean shift from target: <b style="color:var(--ink)">${shift >= 0 ? "+" : ""}${shift.toFixed(1)}σ</b><input type="range" min="-2" max="2" step="0.1" value="${shift}" data-k="sh" aria-valuetext="${shift.toFixed(1)} sigma"></label>
        </div>
        <svg class="viz" viewBox="0 0 ${W} ${H}" role="img" aria-label="Normal curve, yield ${pct(yld)}">
          <polygon points="${area(Math.max(x0, lsl), Math.min(x1, usl))}" fill="color-mix(in srgb, var(--acc) 22%, white)"/>
          ${lsl > x0 ? `<polygon points="${area(x0, lsl)}" fill="var(--ooc)" opacity=".75"/>` : ""}
          ${usl < x1 ? `<polygon points="${area(usl, x1)}" fill="var(--ooc)" opacity=".75"/>` : ""}
          <polyline points="${pts(x0, x1, 240)}" fill="none" stroke="#18283A" stroke-width="2"/>
          <line x1="${L}" x2="${R}" y1="${B}" y2="${B}" stroke="#18283A"/>
          ${[[lsl, "LSL"], [usl, "USL"]].map(([v, t]) => `<line x1="${sx(v)}" x2="${sx(v)}" y1="20" y2="${B}" stroke="var(--ooc)" stroke-width="2"/><text x="${sx(v)}" y="14" text-anchor="middle" font-size="12" font-weight="700">${t} ${v}</text>`).join("")}
          <line x1="${sx(tgt)}" x2="${sx(tgt)}" y1="30" y2="${B}" stroke="#4F5E6C" stroke-dasharray="4 4"/>
          <line x1="${sx(mu)}" x2="${sx(mu)}" y1="${sy(1)}" y2="${B}" stroke="var(--acc)" stroke-width="2"/>
          <text x="${sx(mu)}" y="${B + 16}" text-anchor="middle" font-size="11.5" font-weight="700">μ ${mu.toFixed(4)}</text>
          ${[-6, -4.5, -3, -1.5, 1.5, 3, 4.5, 6].map((z) => { const x = mu + z * sd; return x > x0 && x < x1 ? `<text x="${sx(x)}" y="${B + 32}" text-anchor="middle" font-size="10.5" class="t-soft">${z > 0 ? "+" : ""}${z}σ</text>` : ""; }).join("")}
        </svg>
        <div class="readout">
          ${G.ro("Yield (in spec)", pct(yld), "", true)}
          ${G.ro("Out of spec", G.ppm(ppm) + " ppm", "")}
          ${G.ro("Sigma level (half-tolerance ÷ σ)", G.num(k, 2) + "σ", "before any shift")}
          ${G.ro("Cp = (USL − LSL) / 6σ", G.num(cp, 2), "spread only", true)}
          ${G.ro("Cpk = min(Zu, Zl) / 3", G.num(cpk, 2), "spread + centring", true)}
          ${G.ro("Cr = 1 / Cp", G.num(cr, 2), "lower is better")}
        </div>
        <p class="small" aria-live="polite" style="margin-top:.5rem">Z to USL ${G.num(zu, 2)}, Z to LSL ${G.num(zl, 2)}. ${Math.abs(shift) < 0.05 ? "Centred, so Cp = Cpk." : "Off-centre, so Cpk < Cp."}</p>
        <details class="small"><summary>Edit the specification limits</summary><div class="row" style="margin-top:.4rem"><label class="field">LSL<input type="number" step="0.001" value="${lsl}" data-k="lsl"></label><label class="field">USL<input type="number" step="0.001" value="${usl}" data-k="usl"></label></div></details>`;
      $$("[data-p]", el).forEach((b) => b.addEventListener("click", () => { const p = PRE[+b.dataset.p]; sd = p[1]; shift = p[2]; lsl = 4.988; usl = 5.012; draw(); }));
      $$("input[data-k]", el).forEach((i) => i.addEventListener(i.type === "range" ? "input" : "change", () => {
        const v = +i.value; const k2 = i.dataset.k;
        if (k2 === "sd") sd = v; else if (k2 === "sh") shift = v; else if (k2 === "lsl" && v < usl) lsl = v; else if (k2 === "usl" && v > lsl) usl = v;
        draw(); const again = $(`input[data-k="${k2}"]`, el); if (again) { if (k2 === "lsl" || k2 === "usl") $("details", el).open = true; again.focus(); }
      }));
    }
    draw();
  };

  /* ---------- Ch8: sigma table ---------- */
  G.W.sigmatable = (el) => {
    const rows = [1, 2, 3, 4, 5, 6].map((s) => { const p = G.upperTail(s - 1.5); return [s, p * 1e6, 1 - p]; });
    el.innerHTML = `<h4>Sigma level → DPMO (with the 1.5σ shift)</h4>
      <p class="hint">Computed live from the normal distribution with the mean shifted 1.5σ toward one limit, counting the tail beyond that nearer limit — the convention published sigma tables use.</p>
      ${G.table(["Sigma level", "Z beyond nearer limit", "DPMO", "Yield"], rows.map((r) => [r[0] + "σ", (r[0] - 1.5).toFixed(1), G.ppm(r[1]), pct(r[2])]))}`;
  };

  /* ---------- Ch8: cost of quality sorter ---------- */
  G.W.coq = (el) => G.classifier(el, {
    title: "Sort each cost into the PAF model",
    hint: "Prevention stops defects; appraisal looks for them; failure costs pay for them — before shipment (internal) or after the customer has it (external).",
    cats: ["Prevention", "Appraisal", "Internal failure", "External failure"],
    items: [
      { t: "Training course for new packers", a: 0, why: "Doing it right the first time." },
      { t: "Final inspection before shipping", a: 1, why: "Checking conformance." },
      { t: "Re-inspecting units after rework", a: 2, why: "Trap: it looks like inspection, but it exists only because of a failure caught in-house." },
      { t: "Warranty claims", a: 3, why: "Failure found by the customer." },
      { t: "Calibrating gauges", a: 1, why: "Part of the cost of measuring conformance." },
      { t: "Advanced product quality planning (APQP)", a: 0, why: "The handbook lists APQP efforts under prevention." },
      { t: "Scrap found on the line", a: 2, why: "Caught before shipment." },
      { t: "Handling customer complaints and returns", a: 3, why: "Caught by the customer." },
      { t: "Qualifying a supplier before awarding the contract", a: 0, why: "Prevents defective input from ever arriving." },
      { t: "Receiving inspection of incoming parts", a: 1, why: "Checks what already arrived — appraisal, not prevention." },
      { t: "Machine downtime caused by defective parts", a: 2, why: "A failure cost incurred before shipment." },
      { t: "A product recall", a: 3, why: "The most expensive external failure." }
    ]
  });

  /* ---------- Ch8: communication flows ---------- */
  G.W.commflow = (el) => {
    const M = {
      down: { t: "Top-down (downward)", use: "Executives or sponsors give instructions, communicate policy, or give feedback on project performance.", risk: "Passed sponsor → champion → process owner → Black Belt → team, the message can be filtered or distorted.", fix: "Send a written message to the whole team and/or hold one meeting for the full chain. Leave sensitive items to the chain of command so middle managers keep their standing." },
      up: { t: "Bottom-up (upward)", use: "Operators, front-desk staff or team members give feedback to management or the executive sponsor.", risk: "Can also be distorted on the way up.", fix: "Open-door policy, employee surveys, suggestion boxes, stand-up and lunch meetings — planned well, or suggestion boxes turn into complaint boxes and open doors get used to point fingers." },
      across: { t: "Horizontal", use: "Peers coordinate directly — most effective in flatter organizations; quicker results.", risk: "Unsuitable where a process requires management authorization or approval — it can shortcut it. In vertical organizations managers may feel bypassed.", fix: "Management sets guidelines for where horizontal communication is encouraged." }
    };
    let on = "down";
    function draw() {
      const box = (x, y, t) => `<rect x="${x}" y="${y}" width="150" height="34" rx="7" fill="#fff" stroke="#4F5E6C" stroke-width="1.5"/><text x="${x + 75}" y="${y + 22}" text-anchor="middle" font-size="12.5">${t}</text>`;
      const chain = ["Executive sponsor", "Champion", "Process owner", "Black Belt", "Team members"];
      const c = on === "across" ? "#4F5E6C" : "var(--acc)";
      el.innerHTML = `<h4><span>Three directions of communication</span><span class="seg" role="group" aria-label="Direction">${[["down", "Top-down"], ["up", "Bottom-up"], ["across", "Horizontal"]].map(([k, l]) => `<button type="button" data-k="${k}" aria-pressed="${k === on}">${l}</button>`).join("")}</span></h4>
        <div class="grid2" style="align-items:start">
          <svg class="viz" viewBox="0 0 400 250" style="max-width:420px" role="img" aria-label="${M[on].t} communication">
            <defs><marker id="cf" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 10 5 0 10Z" fill="${on === "across" ? "#D0507A" : "#6A55C2"}"/></marker></defs>
            ${chain.map((t, i) => box(20, 8 + i * 48, t)).join("")}
            ${box(230, 104, "Peer process owner")}
            ${on !== "across" ? chain.slice(0, -1).map((_, i) => on === "down" ? `<line x1="95" x2="95" y1="${42 + i * 48}" y2="${54 + i * 48}" stroke="${c}" stroke-width="3" marker-end="url(#cf)"/>` : `<line x1="95" x2="95" y1="${54 + i * 48}" y2="${43 + i * 48}" stroke="${c}" stroke-width="3" marker-end="url(#cf)"/>`).join("") : ""}
            ${on === "across" ? `<line x1="172" x2="228" y1="121" y2="121" stroke="#D0507A" stroke-width="3" marker-end="url(#cf)" marker-start="url(#cf)"/>` : `<line x1="172" x2="228" y1="121" y2="121" stroke="#CBD5CE" stroke-width="1.5" stroke-dasharray="3 3"/>`}
          </svg>
          <div aria-live="polite"><p style="margin:0 0 .4rem"><b style="font:700 1.25rem var(--display)">${M[on].t}</b></p><p class="small"><b>When:</b> ${M[on].use}</p><p class="small"><b>Risk:</b> ${M[on].risk}</p><p class="small"><b>Make it work:</b> ${M[on].fix}</p></div>
        </div>`;
      $$("[data-k]", el).forEach((b) => b.addEventListener("click", () => { on = b.dataset.k; draw(); }));
    }
    draw();
  };

  G.W.commpick = (el) => G.classifier(el, {
    title: "Pick the delivery method",
    hint: "The handbook's rules for setting and medium.",
    cats: ["In private", "In public", "In person / face to face", "Email is fine"],
    items: [
      { t: "Correcting a team member's repeated lateness.", a: 0, why: "Reprimand in private." },
      { t: "Thanking the night shift for hitting a record pick rate.", a: 1, why: "Give appreciation in public." },
      { t: "Telling the team the project budget is being cut.", a: 2, why: "Sensitive issues go in person — body language matters." },
      { t: "Two leads disagree about the pack-out standard.", a: 2, why: "Email is poor at carrying emotion; handle disagreements face to face." },
      { t: "Sending the meeting minutes and action items.", a: 3, why: "Routine, factual, needs a record." }
    ]
  });

  /* ---------- Ch9: Tuckman stages ---------- */
  G.W.tuckman = (el) => {
    const S = [
      { n: "Forming", work: 1, style: "Directing", b: ["Members get to know each other; group is immature", "Pride in membership; members try to please and may agree too readily", "Orientation to goals, roles and responsibilities — the honeymoon", "Little work gets done"], lead: "Close supervision and clear direction: what, when, where, how. Welcome the team, explain roles and goals, still listen." },
      { n: "Storming", work: 1, style: "Coaching", b: ["Members voice ideas; scope and roles get tested", "Ideas conflict and disagreement slows the team", "A necessary stage — members position themselves", "Too much conflict can stall the team completely"], lead: "Still directive, but add supportive behaviour and listen more. Use conflict-resolution approaches to keep storming at a useful level." },
      { n: "Norming", work: 2, style: "Supporting", b: ["Conflicts get resolved; mutually acceptable ideas emerge", "Trust builds; members share ideas and work freely", "The group starts to function as a team", "Some work gets done"], lead: "Less directive, more supportive. Encourage the team to take decisions; reinforce ground rules, scope and roles; push on to performing before the team slips back." },
      { n: "Performing", work: 4, style: "Delegating", b: ["Complementary skills create synergy", "Members recognise their interdependence", "The team solves problems as a team", "A large amount of work gets done"], lead: "Step back from day-to-day direction and support. Keep monitoring goals and performance; watch for major changes." },
      { n: "Adjourning", work: 0, style: "—", b: ["The team disbands; members return to other work", "If scope is extended, membership may change", "Dynamics shift and can drop back to an earlier stage", "A major change can send the team back to forming"], lead: "Close the project properly and capture lessons learned (Chapter 6)." },
      { n: "Recognition", work: 0, style: "—", b: ["Often forgotten or taken for granted", "Being paid is not the same as being recognised", "Pat on the back, thank-you notes, newsletters, all-hands mentions", "Certificates, bonuses, stock options"], lead: "Plan it; it sets up the next team to perform." }
    ];
    let on = 0;
    function draw() {
      const s = S[on];
      el.innerHTML = `<h4>Team stages and the leader's style</h4>
        <div class="seg" role="group" aria-label="Stage" style="margin-bottom:.7rem">${S.map((x, i) => `<button type="button" data-i="${i}" aria-pressed="${i === on}">${i + 1} ${x.n}</button>`).join("")}</div>
        <div class="grid2" style="align-items:start" aria-live="polite">
          <div><p style="margin:0 0 .3rem"><b style="font:700 1.5rem var(--display)">${s.n}</b></p><ul class="small">${s.b.map((b) => `<li>${b}</li>`).join("")}</ul></div>
          <div>
            ${on < 4 ? `<div class="ro key"><div class="k">Leadership style</div><div class="v">${s.style}</div><p class="small" style="margin:.3rem 0 0">${s.lead}</p></div>
              <p class="small" style="margin:.6rem 0 .2rem">Work accomplished</p>
              <div style="display:flex;gap:3px" aria-label="${["", "little", "some", "", "a large amount"][s.work]}">${[1, 2, 3, 4].map((k) => `<span style="flex:1;height:12px;border-radius:3px;background:${k <= s.work ? "var(--acc)" : "var(--rule-soft)"}"></span>`).join("")}</div>`
              : `<div class="ro"><div class="k">What to do</div><p class="small" style="margin:.3rem 0 0">${s.lead}</p></div>`}
          </div>
        </div>`;
      $$("[data-i]", el).forEach((b) => b.addEventListener("click", () => { on = +b.dataset.i; draw(); }));
    }
    draw();
  };

  G.W.stageid = (el) => G.classifier(el, {
    title: "Name the stage",
    cats: ["Forming", "Storming", "Norming", "Performing", "Adjourning"],
    items: [
      { t: "Two weeks in, the team agrees with every idea the Green Belt raises. Not much has been produced.", a: 0, why: "Agreeing too much and pleasing each other is forming, not norming." },
      { t: "Members argue over whether the scope includes returns. Progress has slowed.", a: 1, why: "Scope and roles being tested through conflict." },
      { t: "The team settles on ground rules and starts sharing draft analyses without hesitation.", a: 2, why: "Conflict resolved, trust rising, some work getting done." },
      { t: "The team splits the data work itself and finishes the root-cause analysis ahead of schedule.", a: 3, why: "Interdependence, synergy, lots of output." },
      { t: "The project closes and three members move back to their normal shifts.", a: 4, why: "The team disbands." },
      { t: "A new client is added mid-project, two members rotate off, and old disagreements resurface.", a: 1, why: "A major change can push a team back to earlier stages — here, conflict has returned." }
    ]
  });

  /* ---------- Ch9: negative dynamics ---------- */
  G.W.dynamics = (el) => G.classifier(el, {
    title: "Diagnose the negative dynamic",
    hint: "Pick the best name for each symptom, then read the countermeasure.",
    select: true,
    cats: ["Overbearing member", "Dominant member", "Floundering", "Reluctant participant", "Unquestioned acceptance of opinions as facts", "Groupthink", "Feuding", "Rush to accomplishment", "Attribution", "Discounts", "Digressions and tangents"],
    items: [
      { t: "The site director sits in on meetings; everyone else just listens and nods.", a: 0, why: "Authority or expertise intimidates others. Countermeasure: round-robin, nominal group technique, a less formal setting, or move the influential person to the extended team." },
      { t: "One member keeps interrupting and the discussion becomes chaotic.", a: 1, why: "Airtime, not authority. Structure the agenda for equal participation, moderate firmly, use round-robin." },
      { t: "The team keeps postponing decisions; the sponsor never attends and a merger is rumoured.", a: 2, why: "Lack of direction or an overwhelmed team. More direction early, visible leadership, refocus on the agenda." },
      { t: "A member about to transfer departments gives noncommittal answers and rarely speaks.", a: 3, why: "No stake in the outcome, intimidation or fear. Leaders support and protect participation." },
      { t: "“Everyone knows night shift causes the errors.” No data is offered and nobody asks for any.", a: 4, why: "Request supporting data and statistically valid analysis; question assumptions." },
      { t: "No one disagrees in meetings, but doubts come out in hallway conversations.", a: 5, why: "Harmony valued over truth. Bring in outside members, rotate roles at milestones, manage by fact." },
      { t: "Two leads trade heated arguments every meeting and morale is dropping.", a: 6, why: "Confront the adversaries offline, not in the meeting; enforce ground rules and mutual respect; restate the objective." },
      { t: "Facing an unrealistic deadline, the team skips data collection and jumps to a fix.", a: 7, why: "Ask for data and statistical significance, ask for alternatives, and reset the deadline to fit resources." },
      { t: "Members explain the problem with “they're just lazy” instead of seeking causes.", a: 8, why: "Psychological or emotional judgements in place of explanations. Challenge assumptions, play devil's advocate, ask for the analysis." },
      { t: "A member's suggestions are ignored, sometimes with sarcasm.", a: 9, why: "Encourage mutual respect, enforce discipline, ask the member to clarify." },
      { t: "The meeting drifts into a debate about the holiday party.", a: 10, why: "Agenda items with time allotments, restated ground rules, redirection." }
    ]
  });

  /* ---------- Ch9: roles ---------- */
  G.W.roles = (el) => {
    const R = {
      "Executive": { who: "Business-unit leader with profit-and-loss responsibility, usually director level or above.", ft: "Part of an executive job", r: ["Sets direction, priorities, vision and overall objectives for the Six Sigma organization", "Allocates resources for projects", "Monitors the overall program", "Starts incentive programs and rewards successful projects"] },
      "Champion": { who: "Typically an upper-level manager.", ft: "Part of a management job", r: ["Liaison with senior management", "Allocates resources; sets project selection criteria", "Removes barriers to project success", "Approves completed projects; implements change"] },
      "Process owner": { who: "The person responsible and accountable for the process's execution and results. The sponsor or champion could also be the process owner.", ft: "Part of their normal role", r: ["Selects team members; allocates resources", "Provides process knowledge; reviews and approves changes", "Supports change management and implements change", "Ensures improvements are sustained"] },
      "Master Black Belt": { who: "Expert in the methods and statistics, change management and coaching. Always full-time.", ft: "Full-time", r: ["Coaches and mentors Black Belts and Green Belts", "Links business strategy to the Six Sigma program", "Oversees roughly 15–20 projects at a time; tackles stagnation and barriers", "Reviews and approves completed projects; shares lessons learned"] },
      "Black Belt": { who: "Experienced project leader trained in the methods, statistics, basic finance and change management. Always full-time.", ft: "Full-time", r: ["Leads and manages Six Sigma projects — about four to six a year", "Provides net present value, ROI and payback calculations", "Follows DMAIC; applies the right statistics", "Updates and presents progress to management"] },
      "Green Belt": { who: "Trained in the methods, basic statistics and improvement tools.", ft: "Handbook: typically full-time, though many organizations fold it into an existing job", r: ["Supports higher-ROI Black Belt projects", "Leads smaller projects with moderate savings and ROI", "Reviews the approach periodically with the Black Belt and Master Black Belt", "Identifies and reports barriers and stagnation"] },
      "Yellow Belt": { who: "New to Six Sigma with a small role, an interest, or a need for foundational knowledge.", ft: "Part of their normal role", r: ["Follows DMAIC and applies the tools", "Supports management and teams as needed", "Suggests future projects"] },
      "Team member": { who: "Selected by the process owner; trained in the methods and basic tools.", ft: "Part-time on the project", r: ["Takes part in charter and scope definition", "Brainstorms and gives input in meetings", "Collects data where responsible", "Reviews the approach with the Green Belt and Black Belt"] }
    };
    let on = "Champion";
    function draw() {
      const r = R[on];
      el.innerHTML = `<h4>Six Sigma roles</h4>
        <div class="chips" role="group" aria-label="Role" style="margin-bottom:.7rem">${Object.keys(R).map((k) => `<button type="button" class="chip" data-k="${k}" aria-pressed="${k === on}">${k}</button>`).join("")}</div>
        <div class="grid2" style="align-items:start" aria-live="polite">
          <div><p style="margin:0 0 .2rem"><b style="font:700 1.5rem var(--display)">${on}</b></p><p class="small">${r.who}</p><p class="small"><b>Time on Six Sigma:</b> ${r.ft}</p></div>
          <ul class="small">${r.r.map((x) => `<li>${x}</li>`).join("")}</ul>
        </div>`;
      $$("[data-k]", el).forEach((b) => b.addEventListener("click", () => { on = b.dataset.k; draw(); }));
    }
    draw();
  };

  /* ---------- Ch9: RACI builder with validator ---------- */
  G.W.raci = (el) => {
    const roles = ["Champion", "Process owner", "Black Belt", "Green Belt", "Team member"];
    const tasks = ["Approve the charter", "Collect baseline data", "Analyze root cause", "Approve the solution", "Sustain the gain"];
    const M = [["A", "A", "C", "R", "I"], ["I", "C", "C", "A", ""], ["I", "C", "A", "R", "R"], ["A", "R", "C", "C", "I"], ["I", "A", "I", "C", "R"]];
    const CYC = ["", "R", "A", "C", "I"];
    function draw() {
      const msgs = tasks.map((t, i) => { const a = M[i].filter((x) => x === "A").length, r = M[i].filter((x) => x === "R").length;
        if (a !== 1) return [false, `${t}: needs exactly one A (has ${a}).`]; if (r < 1) return [false, `${t}: nobody is Responsible for doing the work.`]; return [true, `${t}: OK`]; });
      const bad = msgs.filter((m) => !m[0]);
      el.innerHTML = `<h4>RACI chart — fix the two mistakes</h4>
        <p class="hint">Click a cell to cycle R → A → C → I → blank. Rules: exactly one Accountable per task, and at least one Responsible.</p>
        <div class="tbl-wrap"><table class="tbl"><thead><tr><th scope="col">Task</th>${roles.map((r) => `<th scope="col" style="text-align:center">${r}</th>`).join("")}</tr></thead>
        <tbody>${tasks.map((t, i) => `<tr${msgs[i][0] ? "" : ' style="background:var(--ooc-wash)"'}><th scope="row">${t}</th>${roles.map((r, j) => `<td style="text-align:center"><button type="button" class="btn sm" data-c="${i}-${j}" style="min-width:2.6rem;font-family:var(--display);font-size:1.05rem" aria-label="${t}, ${r}: ${M[i][j] || "blank"}">${M[i][j] || "·"}</button></td>`).join("")}</tr>`).join("")}</tbody></table></div>
        <p class="small ${bad.length ? "" : "feedback good"}" aria-live="polite">${bad.length ? bad.map((m) => "✗ " + m[1]).join("<br>") : "All tasks pass: one A each and at least one R."}</p>
        <p class="small soft">R = Responsible (does the work) · A = Accountable (owns the outcome, one per task) · C = Consulted (two-way) · I = Informed (one-way). RASIC adds S = Supporting.</p>`;
      $$("[data-c]", el).forEach((b) => b.addEventListener("click", () => { const [i, j] = b.dataset.c.split("-").map(Number); M[i][j] = CYC[(CYC.indexOf(M[i][j]) + 1) % CYC.length]; draw(); $(`[data-c="${i}-${j}"]`, el).focus(); }));
    }
    draw();
  };

  /* ---------- Ch9: multivoting ranked vs weighted ---------- */
  G.W.multivote = (el) => {
    const ideas = ["A  Better speakers", "B  Rotate venues", "C  Free food", "D  Campus outreach"];
    const rank = [[4, 3, 2, 1], [4, 2, 3, 1], [3, 4, 2, 1], [3, 2, 4, 1], [2, 4, 3, 1]];
    const pts = [[40, 30, 20, 10], [40, 15, 35, 10], [15, 70, 10, 5], [30, 20, 40, 10], [10, 60, 25, 5]];
    let mode = "rank";
    function draw() {
      const M = mode === "rank" ? rank : pts;
      const tot = ideas.map((_, j) => M.reduce((s, m) => s + m[j], 0));
      const order = tot.map((t, j) => [t, j]).sort((a, b) => b[0] - a[0]);
      const tR = ideas.map((_, j) => rank.reduce((s, m) => s + m[j], 0)), tP = ideas.map((_, j) => pts.reduce((s, m) => s + m[j], 0));
      const winR = tR.indexOf(Math.max(...tR)), winP = tP.indexOf(Math.max(...tP));
      const check = M.map((m) => mode === "rank" ? new Set(m).size === 4 && m.every((v) => v >= 1 && v <= 4) : m.reduce((a, b) => a + b, 0) === 100);
      el.innerHTML = `<h4><span>Multivoting: ranked vs weighted</span><span class="seg" role="group" aria-label="Approach"><button type="button" data-m="rank" aria-pressed="${mode === "rank"}">Ranked (1–4)</button><button type="button" data-m="pts" aria-pressed="${mode === "pts"}">Weighted (100 points)</button></span></h4>
        <p class="hint">${mode === "rank" ? "Each member ranks the ideas, 4 = most important. Ranking shows order but not strength of preference." : "Each member splits 100 points. Intensity counts — one passionate member can move the result."}</p>
        <div class="tbl-wrap"><table class="tbl"><thead><tr><th scope="col">Idea</th>${M.map((_, i) => `<th scope="col" class="num">M${i + 1}</th>`).join("")}<th scope="col" class="num">Total</th></tr></thead>
        <tbody>${ideas.map((idea, j) => `<tr${order[0][1] === j ? ' style="background:color-mix(in srgb, var(--acc) 12%, white)"' : ""}><th scope="row">${idea}</th>${M.map((m, i) => `<td class="num"><input type="number" value="${m[j]}" min="${mode === "rank" ? 1 : 0}" max="${mode === "rank" ? 4 : 100}" data-c="${i}-${j}" style="width:4rem" aria-label="Member ${i + 1}, ${idea}"></td>`).join("")}<td class="num"><b style="font:700 1.3rem var(--display)">${tot[j]}</b></td></tr>`).join("")}
        <tr><th scope="row">Valid?</th>${check.map((c) => `<td class="num small" style="color:${c ? "var(--belt-deep)" : "var(--ooc)"}">${c ? "✓" : mode === "rank" ? "dup" : "≠100"}</td>`).join("")}<td></td></tr></tbody></table></div>
        <p class="small" aria-live="polite">Order: ${order.map(([t, j]) => ideas[j].slice(0, 1)).join(" > ")}. ${winR === winP ? `Both methods put <b>${ideas[winR].slice(0, 1)}</b> first this time.` : `Same team, different method: ranked puts <b>${ideas[winR].slice(0, 1)}</b> first; weighted puts <b>${ideas[winP].slice(0, 1)}</b> first because some members feel much more strongly.`} The handbook's advice: the two approaches do not always agree, so use both, and re-vote between options whose totals are close.</p>`;
      $$("[data-m]", el).forEach((b) => b.addEventListener("click", () => { mode = b.dataset.m; draw(); }));
      $$("[data-c]", el).forEach((i) => i.addEventListener("change", () => { const [m, j] = i.dataset.c.split("-").map(Number); (mode === "rank" ? rank : pts)[m][j] = Math.round(+i.value || 0); draw(); }));
    }
    draw();
  };

  G.W.decisions = (el) => G.classifier(el, {
    title: "Name the decision approach",
    cats: ["Top-down", "Consensus", "Fact-based", "Majority vote", "Unanimous"],
    items: [
      { t: "The site manager hears the options and announces her choice.", a: 0, why: "The leader decides." },
      { t: "Not everyone's first choice, but every member says they can support it.", a: 1, why: "The handbook's definition of consensus: acceptable enough that all members will support it." },
      { t: "Five of nine members vote yes, so the motion carries.", a: 3, why: "Majority rule is not consensus — four members may not support it." },
      { t: "Every member independently picks the same option as their favourite.", a: 4, why: "Unanimity is stronger than, and different from, consensus." },
      { t: "The team picks the option the Pareto data and hypothesis test support.", a: 2, why: "Fact-based decision-making, the term ISO auditors use." }
    ]
  });
})();
