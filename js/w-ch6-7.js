/* Widgets: Chapter 6 and 7 */
(function () {
  "use strict";
  const { $, $$, esc } = G;
  const ARROW = (id, color = "#4F5E6C") => `<marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 10 5 0 10Z" fill="${color}"/></marker>`;

  /* ---------- Ch6: theory ↔ theorist ---------- */
  G.W.theories = (el) => G.classifier(el, {
    title: "Match the idea to its originator",
    hint: "Pioneer swaps are a favourite ASQ distractor. Pick from the list for each idea.",
    select: true,
    cats: ["Frederick Taylor", "Henri Fayol", "Hawthorne studies (Western Electric)", "Abraham Maslow", "Frederick Herzberg", "Douglas McGregor", "William Ouchi", "David Kolb", "B. F. Skinner", "Hersey and Blanchard", "Peter Senge", "Blake and Mouton", "Stephen Covey"],
    items: [
      { t: "Scientific management: find the one best way to do a task; efficiency over worker satisfaction.", a: 0 },
      { t: "Fourteen principles of management, including subordinating individual interests to the common good.", a: 1 },
      { t: "Productivity rose when lighting went up — and also when it went down.", a: 2, why: "The Hawthorne effect: being observed changes behaviour. Shewhart, Juran and Deming were all connected to the plant." },
      { t: "Hierarchy of needs.", a: 3 },
      { t: "Two-factor theory: satisfiers (motivators) and dissatisfiers (hygiene factors).", a: 4 },
      { t: "Theory X (people avoid work and need prodding) versus Theory Y (people seek responsibility).", a: 5 },
      { t: "Theory Z: long-term employment, slow promotion, job rotation, consensus decisions, concern for the whole employee.", a: 6 },
      { t: "Experiential learning: experience, reflect, form abstract theory, apply.", a: 7 },
      { t: "Operant conditioning, the basis of behaviour management.", a: 8 },
      { t: "Situational leadership: adjust direction and support as followers mature.", a: 9 },
      { t: "The Fifth Discipline: systems thinking ties together personal mastery, mental models, shared vision and team learning.", a: 10 },
      { t: "Managerial grid: concern for task (x-axis) against concern for people (y-axis).", a: 11 },
      { t: "Seven habits, from dependence through independence to interdependence.", a: 12 }
    ]
  });

  /* ---------- Ch6: problem statement tester ---------- */
  G.W.probstmt = (el) => G.classifier(el, {
    title: "Is this a good problem statement?",
    hint: "A good statement says what is wrong, where, since when, and how big — with baseline data — and names no cause and no solution.",
    cats: ["Good", "Contains a cause", "Contains a solution", "No baseline / not measurable"],
    items: [
      { t: "“Since January, 6.8% of outbound orders shipped after the promised date against a 2% target, costing about $38K a month in carrier and client penalties.”", a: 0, why: "What, when, how big, versus what goal, and the impact — no cause, no fix." },
      { t: "“Late shipments are happening because new pickers are not trained.”", a: 1, why: "It jumps to a cause before the Measure and Analyze phases." },
      { t: "“We need to buy a new WMS to fix late shipments.”", a: 2, why: "A solution disguised as a problem. It narrows the project before data exists." },
      { t: "“Shipping performance is bad and customers are unhappy.”", a: 3, why: "No baseline, no measure, no scope." },
      { t: "“Return-processing cycle time averaged 4.6 days in Q2 versus the 2-day service level, delaying client refunds.”", a: 0, why: "Baseline, target, impact — ready for a charter." }
    ]
  });

  /* ---------- Ch6: primary vs consequential metrics ---------- */
  G.W.metrics = (el) => G.classifier(el, {
    title: "Goal: cut order cycle time by 25%",
    hint: "Primary metric = the goal itself. Consequential metric = something the improvement might make worse.",
    cats: ["Primary", "Consequential", "Neither"],
    items: [
      { t: "Average time from order release to truck departure.", a: 0, why: "This is the measure the goal is written in." },
      { t: "Pick accuracy (mis-picks per 1,000 lines).", a: 1, why: "Rushing can raise errors — watch it so the gain is not offset." },
      { t: "Overtime hours per week.", a: 1, why: "Speed bought with overtime is a negative side effect." },
      { t: "Recordable safety incidents.", a: 1, why: "Faster work can raise injury risk." },
      { t: "Number of orders the clients send each day.", a: 2, why: "An input volume outside the team's control — context, not a project metric." }
    ]
  });

  /* ---------- Ch6: Pareto for scoping (single % axis) ---------- */
  G.W.pareto = (el) => {
    const data = [["Wrong item", 120], ["Damaged", 80], ["Late", 40], ["Wrong size", 25], ["Other", 15]];
    const tot = data.reduce((s, d) => s + d[1], 0);
    let cum = 0; const rows = data.map(([n, v]) => { cum += v; return { n, v, p: (v / tot) * 100, c: (cum / tot) * 100 }; });
    const W = 560, H = 270, L = 48, B = 230, T = 20, bw = 72, gap = 18;
    const y = (p) => B - (p / 100) * (B - T);
    const x = (i) => L + 14 + i * (bw + gap);
    el.innerHTML = `<h4>Use a Pareto chart to narrow scope</h4>
      <p class="hint">Customer returns by reason, last quarter (n = ${tot}). Bars and the cumulative line share one percent axis. Hover a bar.</p>
      <div class="legend" aria-hidden="true"><span><i style="background:var(--acc);height:10px;width:10px;border-radius:2px"></i>Share of returns</span><span><i style="background:var(--ink)"></i>Cumulative share</span></div>
      <svg class="viz" viewBox="0 0 ${W} ${H}" role="img" aria-label="Pareto chart. Wrong item and damaged account for 71 percent of returns">
        ${[0, 25, 50, 75, 100].map((p) => `<line x1="${L}" x2="${W - 10}" y1="${y(p)}" y2="${y(p)}" stroke="#E1E7E3"/><text x="${L - 6}" y="${y(p) + 4}" text-anchor="end" font-size="11" class="t-soft">${p}%</text>`).join("")}
        <rect x="${x(0) - 7}" y="${T - 6}" width="${2 * bw + gap + 14}" height="${B - T + 6}" fill="none" stroke="var(--acc)" stroke-dasharray="5 4" rx="6"/>
        <text x="${x(0) + bw + gap / 2}" y="${T + 8}" text-anchor="middle" font-size="12" font-weight="700">vital few → project scope</text>
        ${rows.map((r, i) => `<g data-i="${i}"><rect x="${x(i)}" y="${y(r.p)}" width="${bw}" height="${B - y(r.p)}" rx="4" fill="var(--acc)" opacity="${i < 2 ? 1 : 0.45}"/>
          <rect x="${x(i) - gap / 2}" y="${T}" width="${bw + gap}" height="${B - T}" fill="transparent"/>
          <text x="${x(i) + bw / 2}" y="${B + 16}" text-anchor="middle" font-size="12">${r.n}</text></g>`).join("")}
        <polyline points="${rows.map((r, i) => `${x(i) + bw / 2},${y(r.c)}`).join(" ")}" fill="none" stroke="#18283A" stroke-width="2"/>
        ${rows.map((r, i) => `<circle cx="${x(i) + bw / 2}" cy="${y(r.c)}" r="4.5" fill="#18283A" stroke="#fff" stroke-width="2"/>`).join("")}
        <text x="${x(1) + bw / 2 + 8}" y="${y(rows[1].c) - 8}" font-size="12" font-weight="700">${rows[1].c.toFixed(0)}%</text>
        <line x1="${L}" x2="${W - 10}" y1="${B}" y2="${B}" stroke="#18283A"/>
      </svg>`;
    $$("[data-i]", el).forEach((g) => {
      const r = rows[+g.dataset.i];
      g.addEventListener("mousemove", (e) => G.tip(`<b>${r.n}</b><br>${r.v} returns · ${r.p.toFixed(1)}%<br>Cumulative ${r.c.toFixed(1)}%`, e));
      g.addEventListener("mouseleave", () => G.tip(null));
    });
  };

  /* ---------- Ch6: WBS cost roll-up ---------- */
  G.W.wbs = (el) => {
    const tree = [
      ["1.0 Plan", [["1.1 Kickoff meeting", 500], ["1.2 Project plan", 1200]]],
      ["2.0 Select software", [["2.1 Requirements", 2000], ["2.2 Vendor demos", 800]]],
      ["3.0 Install", [["3.1 Configure", 6000], ["3.2 Test", 2500]]],
      ["4.0 Train", [["4.1 Train leads", 1500], ["4.2 Train associates", 3000]]]
    ];
    const $f = (n) => "$" + Math.round(n).toLocaleString("en-US");
    function calc() {
      let tot = 0;
      tree.forEach((p, i) => { const s = p[1].reduce((a, c) => a + c[1], 0); tot += s; $(`[data-p="${i}"]`, el).textContent = $f(s); });
      $("[data-tot]", el).textContent = $f(tot);
    }
    el.innerHTML = `<h4>Work breakdown structure: costs roll up</h4>
      <p class="hint">Break each activity down until its time and cost can be estimated with confidence. Edit any work-package cost.</p>
      <div style="border-left:3px solid var(--acc);padding-left:.8rem">
        <p style="margin:0 0 .5rem"><b style="font:700 1.25rem var(--display)">Slotting-software project</b> <span class="soft">total</span> <b data-tot style="font:700 1.4rem var(--display)"></b></p>
        <div class="grid2" style="gap:.6rem">${tree.map((p, i) => `
          <div style="background:#fff;border:1.5px solid var(--rule);border-radius:8px;padding:.5rem .65rem">
            <div style="display:flex;justify-content:space-between;font-weight:700"><span>${p[0]}</span><span data-p="${i}"></span></div>
            ${p[1].map((c, j) => `<label style="display:flex;justify-content:space-between;align-items:center;gap:.5rem;font-size:.9rem;margin-top:.35rem;padding-left:.6rem;border-left:2px solid var(--rule)"><span>${c[0]}</span><input type="number" min="0" step="100" value="${c[1]}" data-c="${i}-${j}" aria-label="Cost of ${c[0]}"></label>`).join("")}
          </div>`).join("")}</div>
      </div>`;
    $$("[data-c]", el).forEach((inp) => inp.addEventListener("input", () => { const [i, j] = inp.dataset.c.split("-").map(Number); tree[i][1][j][1] = Math.max(0, +inp.value || 0); calc(); }));
    calc();
  };

  /* ---------- Ch6/7: Gantt with a slip ---------- */
  G.W.gantt = (el) => {
    const T = [
      { k: "A", n: "Construct survey", d: 2, p: [] }, { k: "B", n: "Buy-or-build decision", d: 1, p: [] },
      { k: "C", n: "Print and mail survey", d: 2, p: ["A"] }, { k: "D", n: "Buy/build software", d: 3, p: ["B"] },
      { k: "E", n: "Test software", d: 1, p: ["D"] }, { k: "F", n: "Enter data", d: 2, p: ["C", "E"] },
      { k: "G", n: "Analyze results", d: 1, p: ["F"] }, { k: "H", n: "Write report", d: 1, p: ["G"] }
    ];
    let slipTask = "D", slip = 0;
    function sched(sl) {
      const s = {};
      T.forEach((t) => { const es = Math.max(0, ...t.p.map((p) => s[p].ef)) + (t.k === slipTask ? sl : 0); s[t.k] = { es, ef: es + t.d }; });
      return s;
    }
    function draw() {
      const s = sched(slip), b0 = sched(0), base = Math.max(...Object.values(b0).map((v) => v.ef)), end = Math.max(...Object.values(s).map((v) => v.ef));
      const W = 600, L = 170, wk = (W - L - 10) / 13, rh = 26;
      el.innerHTML = `<h4>Gantt chart: what does a slip do?</h4>
        <p class="hint">Delay one task and watch its successors move (red bars; dashed outline = original slot). Tasks with slack can slip without moving the end date.</p>
        <div class="row" style="margin-bottom:.5rem"><span class="small">Delay task</span>
          <span class="seg" role="group" aria-label="Task to delay">${T.map((t) => `<button type="button" data-t="${t.k}" aria-pressed="${t.k === slipTask}">${t.k}</button>`).join("")}</span>
          <label class="small" style="display:flex;gap:.4rem;align-items:center">by <input type="range" min="0" max="3" value="${slip}" style="width:7rem" aria-label="Weeks of delay"> <b>${slip} wk</b></label></div>
        <svg class="viz" viewBox="0 0 ${W} ${T.length * rh + 40}" role="img" aria-label="Gantt chart; project ends week ${end}">
          ${Array.from({ length: 14 }, (_, w) => `<line x1="${L + w * wk}" x2="${L + w * wk}" y1="18" y2="${T.length * rh + 22}" stroke="#E1E7E3"/>${w < 13 ? `<text x="${L + w * wk + wk / 2}" y="13" text-anchor="middle" font-size="10.5" class="t-soft">${w + 1}</text>` : ""}`).join("")}
          ${T.map((t, i) => { const v = s[t.k], yy = 22 + i * rh; const moved = v.es > b0[t.k].es;
            return `<text x="0" y="${yy + 16}" font-size="12.5"><tspan font-weight="700">${t.k}</tspan> ${esc(t.n)}</text>
              ${moved ? `<rect x="${L + b0[t.k].es * wk + 1}" y="${yy + 4}" width="${t.d * wk - 2}" height="${rh - 9}" rx="4" fill="none" stroke="var(--ink-soft)" stroke-dasharray="3 3"/>` : ""}
              <rect x="${L + v.es * wk + 1}" y="${yy + 4}" width="${t.d * wk - 2}" height="${rh - 9}" rx="4" fill="${moved ? "var(--ooc)" : "var(--acc)"}"/>`; }).join("")}
          <path d="M${L + end * wk} ${T.length * rh + 22} l-6 10 h12 Z" fill="#18283A"/>
          <text x="${L + end * wk}" y="${T.length * rh + 38}" text-anchor="middle" font-size="11" font-weight="700">ends wk ${end}</text>
        </svg>
        <p class="small" aria-live="polite">${slip === 0 ? `Baseline: report done at the end of week ${base}.` : end > base ? `<b>The end date moved ${end - base} week${end - base > 1 ? "s" : ""}.</b> Task ${slipTask} had less slack than the delay.` : `<b>No change to the end date.</b> Task ${slipTask} had enough slack to absorb a ${slip}-week slip.`}</p>`;
      $$("[data-t]", el).forEach((b) => b.addEventListener("click", () => { slipTask = b.dataset.t; draw(); }));
      $("input[type=range]", el).addEventListener("input", (e) => { slip = +e.target.value; draw(); $("input[type=range]", el).focus(); });
    }
    draw();
  };

  /* ---------- Ch6/7: critical path calculator ---------- */
  G.W.cpm = (el) => {
    const A = {
      A: { d: 10, p: [], x: 95, y: 20 }, C: { d: 5, p: ["A"], x: 195, y: 20 }, E: { d: 10, p: ["C"], x: 295, y: 20 },
      B: { d: 5, p: [], x: 95, y: 150 }, D: { d: 15, p: ["B"], x: 195, y: 150 }, F: { d: 10, p: ["D"], x: 295, y: 150 },
      G: { d: 10, p: ["E", "F"], x: 405, y: 85 }, H: { d: 15, p: ["G"], x: 510, y: 85 }
    };
    const order = ["A", "B", "C", "D", "E", "F", "G", "H"];
    const BW = 78, BH = 64;
    function solve() {
      const r = {};
      order.forEach((k) => { const es = Math.max(0, ...A[k].p.map((p) => r[p].ef)); r[k] = { es, ef: es + A[k].d }; });
      const end = Math.max(...order.map((k) => r[k].ef));
      [...order].reverse().forEach((k) => {
        const succ = order.filter((s) => A[s].p.includes(k));
        const lf = succ.length ? Math.min(...succ.map((s) => r[s].ls)) : end;
        r[k].lf = lf; r[k].ls = lf - A[k].d; r[k].sl = r[k].ls - r[k].es;
      });
      return { r, end };
    }
    function paths() {
      const out = [];
      const walk = (k, acc) => { const nxt = order.filter((s) => A[s].p.includes(k)); if (!nxt.length) out.push([...acc, k]); nxt.forEach((n) => walk(n, [...acc, k])); };
      order.filter((k) => !A[k].p.length).forEach((k) => walk(k, []));
      return out.map((p) => ({ p, len: p.reduce((s, k) => s + A[k].d, 0) }));
    }
    function draw() {
      const { r, end } = solve(), ps = paths();
      const crit = (k) => r[k].sl === 0;
      const edges = [];
      order.forEach((k) => A[k].p.forEach((p) => edges.push([p, k])));
      ["A", "B"].forEach((k) => edges.push(["S", k])); edges.push(["H", "F*"]);
      const pos = (k) => k === "S" ? { x: 10, y: 85 + BH / 2 - 16 } : k === "F*" ? { x: 610, y: 85 + BH / 2 - 16 } : A[k];
      const anchor = (k, side) => { if (k === "S") return { x: 42, y: 85 + BH / 2 }; if (k === "F*") return { x: 610, y: 85 + BH / 2 }; return { x: A[k].x + (side === "out" ? BW : 0), y: A[k].y + BH / 2 }; };
      el.innerHTML = `<h4>Critical path calculator</h4>
        <p class="hint">Same network shape as the handbook's PERT/CPM example (p. 134). Edit durations (days). Boxes show earliest start/finish on top, latest start/finish below.</p>
        <div class="row" style="margin-bottom:.6rem">${order.map((k) => `<label class="field" style="width:4.6rem">${k}<input type="number" min="0" max="99" value="${A[k].d}" data-d="${k}" style="width:4.4rem" aria-label="Duration of ${k}"></label>`).join("")}</div>
        <svg class="viz" viewBox="0 0 660 230" role="img" aria-label="Network diagram; critical path ${ps.filter((p) => p.len === end).map((p) => p.p.join("")).join(" and ")}, ${end} days">
          <defs>${ARROW("ar1")}${ARROW("ar2", "#B83A26")}</defs>
          ${edges.map(([a, b]) => { const s = anchor(a, "out"), t = anchor(b, "in"); const c = (a === "S" ? crit(b) : b === "F*" ? crit(a) : crit(a) && crit(b) && r[a].ef === r[b].es);
            const mx = (s.x + t.x) / 2; return `<path d="M${s.x} ${s.y} C${mx} ${s.y} ${mx} ${t.y} ${t.x - 2} ${t.y}" class="edge${c ? " crit" : ""}" marker-end="url(#${c ? "ar2" : "ar1"})"/>`; }).join("")}
          <circle cx="26" cy="${85 + BH / 2}" r="16" fill="#18283A"/><text x="26" y="${85 + BH / 2 + 4}" text-anchor="middle" font-size="10.5" style="fill:#fff">Start</text>
          <circle cx="626" cy="${85 + BH / 2}" r="16" fill="#18283A"/><text x="626" y="${85 + BH / 2 + 4}" text-anchor="middle" font-size="10.5" style="fill:#fff">End</text>
          ${order.map((k) => { const n = A[k], v = r[k]; return `<g class="node${crit(k) ? " crit" : ""}">
            <rect x="${n.x}" y="${n.y}" width="${BW}" height="${BH}" rx="7"/>
            <line x1="${n.x}" x2="${n.x + BW}" y1="${n.y + 21}" y2="${n.y + 21}" stroke="#E1E7E3"/><line x1="${n.x}" x2="${n.x + BW}" y1="${n.y + 43}" y2="${n.y + 43}" stroke="#E1E7E3"/>
            <text x="${n.x + 6}" y="${n.y + 15}" font-size="11.5">${v.es}</text><text x="${n.x + BW - 6}" y="${n.y + 15}" text-anchor="end" font-size="11.5">${v.ef}</text>
            <text x="${n.x + BW / 2}" y="${n.y + 37}" text-anchor="middle" class="t-disp" font-size="16">${k} · ${n.d}</text>
            <text x="${n.x + 6}" y="${n.y + 58}" font-size="11.5" class="t-soft">${v.ls}</text><text x="${n.x + BW - 6}" y="${n.y + 58}" text-anchor="end" font-size="11.5" class="t-soft">${v.lf}</text>
          </g>`; }).join("")}
        </svg>
        <div class="readout">
          ${G.ro("Project duration", end + " days", "= longest path", true)}
          ${ps.map((p) => G.ro("Path " + p.p.join("–"), p.len + " days", p.len === end ? "critical" : `slack ${end - p.len}`)).join("")}
        </div>
        <p class="small" style="margin-top:.6rem">Slack per activity: ${order.map((k) => `${k} <b>${r[k].sl}</b>`).join(", ")}. Try cutting A by 5 days — the end date does not move. Now cut D by 5.</p>`;
      $$("[data-d]", el).forEach((inp) => inp.addEventListener("change", () => { A[inp.dataset.d].d = Math.max(0, Math.round(+inp.value || 0)); const k = inp.dataset.d; draw(); $(`[data-d="${k}"]`, el).focus(); }));
    }
    draw();
  };

  /* ---------- PERT three-point estimate ---------- */
  G.W.pert = (el) => {
    let o = 4, m = 6, p = 14;
    function draw() {
      const te = (o + 4 * m + p) / 6, sd = (p - o) / 6;
      el.innerHTML = `<h4>PERT three-point estimate</h4>
        <p class="hint">Standard PERT formula (beta approximation). It is not printed in Chapters 6–7, but PERT questions often expect it.</p>
        <div class="row">
          <label class="field">Optimistic (o)<input type="number" value="${o}" data-k="o"></label>
          <label class="field">Most likely (m)<input type="number" value="${m}" data-k="m"></label>
          <label class="field">Pessimistic (p)<input type="number" value="${p}" data-k="p"></label>
        </div>
        <div class="readout">${G.ro("Expected time tₑ = (o + 4m + p) / 6", G.num(te, 2), "", true)}${G.ro("Std. dev. = (p − o) / 6", G.num(sd, 2))}${G.ro("Simple average (wrong)", G.num((o + m + p) / 3, 2), "distractor")}</div>`;
      $$("[data-k]", el).forEach((i) => i.addEventListener("change", () => { const v = +i.value || 0; if (i.dataset.k === "o") o = v; if (i.dataset.k === "m") m = v; if (i.dataset.k === "p") p = v; draw(); }));
    }
    draw();
  };

  /* ---------- Ch6: risk assessment assignment matrix ---------- */
  G.W.riskmatrix = (el) => {
    const R = [
      { k: "A", n: "Key team members pulled to peak season", s: 3, p: 3 },
      { k: "B", n: "Second-round funding delayed", s: 3, p: 1 },
      { k: "C", n: "Client changes the label specification", s: 2, p: 2 },
      { k: "D", n: "Timeline shifts by two weeks", s: 1, p: 3 },
      { k: "E", n: "Conveyor breakdown during the pilot", s: 2, p: 1 }
    ];
    const band = (v) => (v >= 6 ? ["High", "var(--ooc-wash)", "var(--ooc)"] : v >= 3 ? ["Medium", "var(--limit-wash)", "var(--limit)"] : ["Low", "var(--belt-wash)", "var(--belt)"]);
    function draw() {
      const c = 120, x0 = 70, y0 = 10;
      el.innerHTML = `<h4>Risk assessment assignment matrix</h4>
        <p class="hint">Rate each risk 1–3 for severity and probability. Assignment number = severity × probability (a simpler cousin of the FMEA RPN). Highest numbers get attention first.</p>
        <div class="grid2" style="align-items:start">
          <svg class="viz" viewBox="0 0 440 440" role="img" aria-label="Three by three risk matrix">
            ${[3, 2, 1].map((s, ri) => [1, 2, 3].map((p, ci) => { const v = s * p, [lab, bg, bd] = band(v); const here = R.filter((r) => r.s === s && r.p === p);
              return `<rect x="${x0 + ci * c}" y="${y0 + ri * c}" width="${c - 4}" height="${c - 4}" rx="8" fill="${bg}" stroke="${bd}" stroke-width="1.5"/>
                <text x="${x0 + ci * c + 8}" y="${y0 + ri * c + 18}" font-size="11.5" class="t-soft">${lab} · ${v}</text>
                ${here.map((r, j) => `<g><circle cx="${x0 + ci * c + 30 + (j % 3) * 30}" cy="${y0 + ri * c + 55 + Math.floor(j / 3) * 32}" r="13" fill="#18283A"/><text x="${x0 + ci * c + 30 + (j % 3) * 30}" y="${y0 + ri * c + 60 + Math.floor(j / 3) * 32}" text-anchor="middle" font-size="13" font-weight="700" style="fill:#fff">${r.k}</text></g>`).join("")}`; }).join("")).join("")}
            ${[3, 2, 1].map((s, ri) => `<text x="${x0 - 10}" y="${y0 + ri * c + c / 2}" text-anchor="end" font-size="12">${s}</text>`).join("")}
            ${[1, 2, 3].map((p, ci) => `<text x="${x0 + ci * c + c / 2 - 2}" y="${y0 + 3 * c + 16}" text-anchor="middle" font-size="12">${p}</text>`).join("")}
            <text x="16" y="${y0 + 1.5 * c}" font-size="12.5" font-weight="700" transform="rotate(-90 16 ${y0 + 1.5 * c})" text-anchor="middle">Severity</text>
            <text x="${x0 + 1.5 * c}" y="${y0 + 3 * c + 36}" text-anchor="middle" font-size="12.5" font-weight="700">Probability</text>
          </svg>
          <div>${R.slice().sort((a, b) => b.s * b.p - a.s * a.p).map((r) => `<div class="sort-item" style="margin-bottom:.4rem"><p style="margin:0 0 .3rem"><b>${r.k}</b> ${esc(r.n)} — <b style="font:700 1.2rem var(--display)">${r.s * r.p}</b> <span class="small soft">${band(r.s * r.p)[0]}</span></p>
            <div class="row small"><label>Severity <select data-s="${r.k}">${[1, 2, 3].map((v) => `<option ${v === r.s ? "selected" : ""}>${v}</option>`).join("")}</select></label>
            <label>Probability <select data-p="${r.k}">${[1, 2, 3].map((v) => `<option ${v === r.p ? "selected" : ""}>${v}</option>`).join("")}</select></label></div></div>`).join("")}</div>
        </div>`;
      $$("[data-s]", el).forEach((s) => s.addEventListener("change", () => { R.find((r) => r.k === s.dataset.s).s = +s.value; draw(); }));
      $$("[data-p]", el).forEach((s) => s.addEventListener("change", () => { R.find((r) => r.k === s.dataset.p).p = +s.value; draw(); }));
    }
    draw();
  };

  /* ---------- RPN ---------- */
  G.W.rpn = (el) => {
    const F = [{ n: "Label prints off-centre", s: 3, o: 8, d: 4 }, { n: "Hazmat shipped without a placard", s: 10, o: 2, d: 5 }];
    function draw() {
      el.innerHTML = `<h4>RPN = Severity × Occurrence × Detection</h4>
        <p class="hint">Each rated 1–10, so RPN runs 1–1,000. RPN ranks risks relative to each other within one analysis — it is not a pass/fail threshold.</p>
        <div class="grid2">${F.map((f, i) => `<div class="sort-item"><p style="margin:0 0 .4rem"><b>${esc(f.n)}</b></p>
          <div class="row small">${["s", "o", "d"].map((k) => `<label>${{ s: "S", o: "O", d: "D" }[k]} <input type="number" min="1" max="10" value="${f[k]}" data-f="${i}-${k}" style="width:4rem"></label>`).join("")}</div>
          <div class="readout">${G.ro("RPN", f.s * f.o * f.d, "", true)}</div></div>`).join("")}</div>
        <p class="small" aria-live="polite">${F[0].s * F[0].o * F[0].d === F[1].s * F[1].o * F[1].d ? "<b>Equal RPNs</b> — " : ""}Severity ${F[1].s} on “${F[1].n}” versus ${F[0].s} on the label issue. Common FMEA practice gives very high severity attention even when the RPN is lower.</p>`;
      $$("[data-f]", el).forEach((inp) => inp.addEventListener("change", () => { const [i, k] = inp.dataset.f.split("-"); F[+i][k] = Math.min(10, Math.max(1, Math.round(+inp.value || 1))); draw(); }));
    }
    draw();
  };

  /* ---------- Ch7: tool picker ---------- */
  G.W.toolpick = (el) => G.classifier(el, {
    title: "Which management and planning tool?",
    hint: "Each scenario has one best fit among the eight BoK II.D tools.",
    select: true,
    cats: ["Affinity diagram", "Interrelationship digraph", "Tree diagram", "Prioritization matrix", "Matrix diagram", "PDPC", "Activity network diagram", "SWOT analysis"],
    items: [
      { t: "The team has 70 sticky notes from brainstorming and needs to sort them into natural groups.", a: 0, why: "Affinity organises a large pool of ideas into 5–10 groups." },
      { t: "Eight competing issues; the team wants to know which one drives the others.", a: 1, why: "The digraph's arrow counts reveal the driver (most outgoing)." },
      { t: "Break the goal ‘reduce mis-picks’ into specific actions, level by level.", a: 2, why: "A tree diagram moves from general to specific." },
      { t: "Choose one of four software packages against weighted criteria.", a: 3, why: "Weighted criteria × option rankings = prioritization matrix." },
      { t: "Show which course units cover which training objectives.", a: 4, why: "Relationship between two groups of items — the matrix diagram (handbook Fig. 7.11)." },
      { t: "List what could go wrong at each step of a rollout plan and the countermeasure for each.", a: 5, why: "PDPC = anticipated problems plus possible solutions, updated as the project moves." },
      { t: "Show task durations and which tasks run in series versus in parallel.", a: 6, why: "The activity network diagram, close cousin of PERT/CPM." },
      { t: "Assess internal capabilities and external conditions before committing to a strategy.", a: 7, why: "Strengths/weaknesses are internal; opportunities/threats are external." }
    ]
  });

  /* ---------- Ch7: interrelationship digraph ---------- */
  G.W.digraph = (el) => {
    const N = ["Inaccurate labour forecast", "Understaffed pick shift", "Late wave release", "Rush orders inserted mid-shift", "Pick-path congestion", "Packing backlog", "Missed carrier cut-off"];
    const E = [[0, 1], [0, 2], [0, 5], [1, 5], [1, 6], [2, 4], [2, 6], [3, 2], [3, 4], [4, 6], [5, 6]];
    let sel = null, reveal = false;
    const cx = 300, cy = 190, rad = 150;
    const P = N.map((_, i) => { const a = -Math.PI / 2 + (i * 2 * Math.PI) / N.length; return { x: cx + rad * Math.cos(a) * 1.25, y: cy + rad * Math.sin(a) }; });
    function draw() {
      const out = N.map((_, i) => E.filter((e) => e[0] === i).length), inn = N.map((_, i) => E.filter((e) => e[1] === i).length);
      const drv = out.indexOf(Math.max(...out)), oc = inn.indexOf(Math.max(...inn));
      el.innerHTML = `<h4>Interrelationship digraph</h4>
        <p class="hint">“Why are we missing the carrier cut-off?” Each arrow points from the issue that influences more toward the issue it influences. Click an issue to trace its arrows.</p>
        <div class="row" style="margin-bottom:.4rem"><button class="btn sm" data-a="rev" aria-pressed="${reveal}">${reveal ? "Hide" : "Show"} arrow counts, driver and outcome</button></div>
        <svg class="viz" viewBox="0 0 600 390" role="img" aria-label="Interrelationship digraph of seven issues">
          <defs>${ARROW("dg1")}${ARROW("dg2", "#D0507A")}</defs>
          ${E.map(([a, b]) => { const s = P[a], t = P[b], dx = t.x - s.x, dy = t.y - s.y, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L;
            const hl = sel !== null && (a === sel || b === sel);
            return `<line x1="${s.x + ux * 62}" y1="${s.y + uy * 26}" x2="${t.x - ux * 66}" y2="${t.y - uy * 30}" class="edge${hl ? " hl" : ""}" style="${hl ? "stroke:var(--acc)" : sel !== null ? "opacity:.25" : ""}" marker-end="url(#${hl ? "dg2" : "dg1"})"/>`; }).join("")}
          ${N.map((n, i) => { const p = P[i], isD = reveal && i === drv, isO = reveal && i === oc;
            return `<g class="clickable" data-n="${i}" tabindex="0" role="button" aria-label="${esc(n)}${reveal ? `, ${out[i]} out, ${inn[i]} in` : ""}">
              <rect x="${p.x - 62}" y="${p.y - 26}" width="124" height="52" rx="8" fill="${isD ? "var(--acc)" : isO ? "#18283A" : "#fff"}" stroke="${sel === i ? "var(--acc)" : "#4F5E6C"}" stroke-width="${sel === i ? 3 : 1.5}"/>
              <foreignObject x="${p.x - 58}" y="${p.y - 24}" width="116" height="48"><div xmlns="http://www.w3.org/1999/xhtml" style="height:48px;display:flex;align-items:center;justify-content:center;text-align:center;font-size:11.5px;line-height:1.15;color:${isD || isO ? "#fff" : "#18283A"};font-weight:${isD || isO ? 700 : 400}">${esc(n)}</div></foreignObject>
              ${reveal ? `<text x="${p.x}" y="${p.y + 41}" text-anchor="middle" font-size="11" font-weight="700">out ${out[i]} · in ${inn[i]}</text>` : ""}
            </g>`; }).join("")}
        </svg>
        <p class="small" aria-live="polite">${reveal ? `<b>Driver:</b> ${N[drv]} (${out[drv]} outgoing) — often a key cause. <b>Outcome:</b> ${N[oc]} (${inn[oc]} incoming) — often a good source of the project's success metric.` : sel !== null ? `${N[sel]}: influences ${out[sel]}, influenced by ${inn[sel]}.` : "Count the arrows yourself first, then reveal."}</p>`;
      $("[data-a=rev]", el).addEventListener("click", () => { reveal = !reveal; draw(); });
      $$("[data-n]", el).forEach((g) => { const f = () => { sel = sel === +g.dataset.n ? null : +g.dataset.n; draw(); }; g.addEventListener("click", f); g.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); f(); } }); });
    }
    draw();
  };

  /* ---------- Ch7: prioritization matrix ---------- */
  G.W.primatrix = (el) => {
    const C = [["Reliability", 0.5], ["Cost", 0.3], ["Support", 0.15], ["Training time", 0.05]];
    const O = [["Vendor A", [4, 3, 1, 1]], ["Vendor B", [1, 4, 4, 4]], ["Vendor C", [3, 1, 3, 3]], ["Vendor D", [2, 2, 2, 2]]];
    const RANKS = [1, 1.5, 2, 2.5, 3, 3.5, 4];
    function calc() {
      const wsum = C.reduce((s, c) => s + c[1], 0);
      $("[data-ws]", el).innerHTML = `Weights sum to <b>${G.num(wsum, 2)}</b>${Math.abs(wsum - 1) > 0.001 ? ' <span style="color:var(--ooc)">— should be 1.00</span>' : ""}`;
      const tot = O.map((o) => o[1].reduce((s, r, j) => s + r * C[j][1], 0)), raw = O.map((o) => o[1].reduce((a, b) => a + b, 0));
      O.forEach((o, i) => { o[1].forEach((r, j) => { $(`[data-v="${i}-${j}"]`, el).textContent = G.num(r * C[j][1], 2); }); $(`[data-t="${i}"]`, el).textContent = G.num(tot[i], 2); $(`[data-r="${i}"]`, el).textContent = raw[i]; });
      const bw = tot.indexOf(Math.max(...tot)), br = raw.indexOf(Math.max(...raw));
      $$("tbody tr", el).forEach((tr, i) => tr.style.background = i === bw ? "color-mix(in srgb, var(--acc) 12%, white)" : "");
      $("[data-win]", el).innerHTML = `Weighted winner: <b>${O[bw][0]}</b> (${G.num(tot[bw], 2)}). ${bw !== br ? `An unweighted sum of ranks would wrongly pick <b>${O[br][0]}</b> (${raw[br]}) — a classic distractor.` : "The unweighted sum agrees this time."}`;
    }
    el.innerHTML = `<h4>Prioritization matrix</h4>
      <p class="hint">Rank options within each criterion (4 = most desirable of four; ties share the average of their places, e.g. a tie for 3rd and 4th = 1.5 each). Cell = rank × weight; highest row total wins.</p>
      <div class="tbl-wrap"><table class="tbl"><thead><tr><th scope="col">Option</th>${C.map((c, j) => `<th scope="col">${c[0]}<br><input type="number" step="0.05" min="0" max="1" value="${c[1]}" data-wt="${j}" aria-label="Weight of ${c[0]}" style="width:4.6rem"></th>`).join("")}<th scope="col" class="num">Total</th><th scope="col" class="num soft">Rank sum</th></tr></thead>
      <tbody>${O.map((o, i) => `<tr><th scope="row">${o[0]}</th>${o[1].map((r, j) => `<td><select data-k="${i}-${j}" aria-label="${o[0]} rank on ${C[j][0]}">${RANKS.map((v) => `<option ${v === r ? "selected" : ""}>${v}</option>`).join("")}</select> <span class="small soft">= <span data-v="${i}-${j}"></span></span></td>`).join("")}<td class="num"><b data-t="${i}" style="font:700 1.35rem var(--display)"></b></td><td class="num soft" data-r="${i}"></td></tr>`).join("")}</tbody></table></div>
      <p class="small" data-ws></p><p class="small" data-win aria-live="polite"></p>`;
    $$("[data-wt]", el).forEach((i) => i.addEventListener("input", () => { C[+i.dataset.wt][1] = Math.max(0, +i.value || 0); calc(); }));
    $$("[data-k]", el).forEach((s) => s.addEventListener("change", () => { const [i, j] = s.dataset.k.split("-").map(Number); O[i][1][j] = +s.value; calc(); }));
    calc();
  };

  /* ---------- Ch7: SWOT sorter ---------- */
  G.W.swot = (el) => G.classifier(el, {
    title: "Sort into SWOT",
    hint: "First ask: inside the organization or outside it? Then: helpful or harmful?",
    cats: ["Strength", "Weakness", "Opportunity", "Threat"],
    items: [
      { t: "Pick accuracy has held above 99.8% for a year.", a: 0, why: "Internal and helpful." },
      { t: "Labour forecasting is done by hand in a spreadsheet.", a: 1, why: "Internal capability gap." },
      { t: "Three new e-commerce brands are moving into the region.", a: 2, why: "External, and something you can go after." },
      { t: "A competitor is opening a larger site ten miles away.", a: 3, why: "External and harmful." },
      { t: "Most of the leadership team has been cross-trained.", a: 0, why: "Internal strength — and note it is not simply the opposite of any weakness listed." },
      { t: "Local unemployment is at a record low, tightening the labour market.", a: 3, why: "External condition that threatens staffing." }
    ]
  });

  /* ---------- Ch7: PDCA / PDSA / SDCA wheel ---------- */
  G.W.pdca = (el) => {
    const M = {
      PDCA: [["Plan", "Define the problem and hypothesise possible causes and solutions. Deming and Ishikawa both urged spending more time here."], ["Do", "Implement a solution."], ["Check", "Evaluate the results."], ["Act", "If results are unsatisfactory, return to Plan; if satisfactory, standardise the solution."]],
      PDSA: [["Plan", "Same as PDCA: plan before work starts — advanced quality planning is this step."], ["Do", "Implement the change, often as a small test."], ["Study", "Study what is happening as it happens, rather than checking after the fact. Deming swapped Check for Study late in his career because Check is reactive."], ["Act", "Adopt, adapt, or abandon; then cycle again."]],
      SDCA: [["Standardize", "Lock in the improvement as the standard way of working."], ["Do", "Work to the standard."], ["Check", "Confirm the standard is followed and stable."], ["Act", "Correct deviations. SDCA stabilises; PDSA improves. Munro paired them so both sides of improvement are covered."]]
    };
    let mode = "PDCA", on = 0;
    function draw() {
      const q = M[mode], cx = 150, cy = 150, r = 120;
      const arc = (i) => { const a0 = -Math.PI / 2 + (i * Math.PI) / 2, a1 = a0 + Math.PI / 2; return `M${cx} ${cy} L${cx + r * Math.cos(a0)} ${cy + r * Math.sin(a0)} A${r} ${r} 0 0 1 ${cx + r * Math.cos(a1)} ${cy + r * Math.sin(a1)} Z`; };
      el.innerHTML = `<h4><span>Improvement cycles</span><span class="seg" role="group" aria-label="Cycle">${Object.keys(M).map((k) => `<button type="button" data-m="${k}" aria-pressed="${k === mode}">${k}</button>`).join("")}</span></h4>
        <div class="grid2" style="align-items:center">
          <svg class="viz" viewBox="0 0 300 300" style="max-width:300px" role="group" aria-label="${mode} cycle">
            ${q.map((s, i) => { const a = -Math.PI / 4 + (i * Math.PI) / 2; return `<g class="clickable" data-q="${i}" tabindex="0" role="button" aria-label="${s[0]}"><path d="${arc(i)}" fill="${i === on ? "var(--acc)" : "#fff"}" stroke="#18283A" stroke-width="1.5"/>
              <text x="${cx + 70 * Math.cos(a)}" y="${cy + 70 * Math.sin(a) + 6}" text-anchor="middle" class="t-disp" font-size="${s[0].length > 6 ? 17 : 22}" style="fill:${i === on ? "#fff" : "#18283A"}">${s[0]}</text></g>`; }).join("")}
            <circle cx="${cx}" cy="${cy}" r="26" fill="#18283A"/><text x="${cx}" y="${cy + 6}" text-anchor="middle" class="t-disp" font-size="17" style="fill:#fff">${mode}</text>
          </svg>
          <div class="ro key" aria-live="polite"><div class="k">${mode}, step ${on + 1}</div><div class="v">${q[on][0]}</div><p class="small" style="margin:.35rem 0 0">${q[on][1]}</p></div>
        </div>`;
      $$("[data-m]", el).forEach((b) => b.addEventListener("click", () => { mode = b.dataset.m; draw(); }));
      $$("[data-q]", el).forEach((g) => { const f = () => { on = +g.dataset.q; draw(); }; g.addEventListener("click", f); g.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); f(); } }); });
    }
    draw();
  };

  /* ---------- Ch7: force-field ---------- */
  G.W.forcefield = (el) => {
    const D = [["Client pressure on accuracy", 4], ["Team incentive tied to accuracy", 3], ["Supportive site leadership", 3], ["Scan-to-confirm already in place", 2]];
    const Rs = [["Look-alike SKUs slotted side by side", 4], ["High temp-labour turnover", 4], ["Poor bin labels", 2], ["“We've always done it this way”", 2]];
    const off = new Set();
    function draw() {
      const ds = D.reduce((s, d) => s + d[1], 0), rs = Rs.reduce((s, r, i) => s + (off.has(i) ? 0 : r[1]), 0);
      el.innerHTML = `<h4>Force-field analysis</h4>
        <p class="hint">Future state: pick accuracy ≥ 99.9%. Arrow length = team-ranked strength. Click a restraining force to remove it.</p>
        <svg class="viz" viewBox="0 0 600 ${Math.max(D.length, Rs.length) * 44 + 40}" role="group" aria-label="Force-field diagram">
          <defs>${ARROW("ff1", "#2E7D4F")}${ARROW("ff2", "#B83A26")}</defs>
          <line x1="300" x2="300" y1="6" y2="${Math.max(D.length, Rs.length) * 44 + 24}" stroke="#18283A" stroke-width="3"/>
          <text x="150" y="16" text-anchor="middle" font-size="13" font-weight="700">Driving forces</text><text x="450" y="16" text-anchor="middle" font-size="13" font-weight="700">Restraining forces</text>
          ${D.map((d, i) => `<line x1="${296 - d[1] * 32}" x2="296" y1="${40 + i * 44}" y2="${40 + i * 44}" stroke="#2E7D4F" stroke-width="5" marker-end="url(#ff1)"/><text x="${290}" y="${30 + i * 44}" text-anchor="end" font-size="12">${esc(d[0])}</text>`).join("")}
          ${Rs.map((r, i) => `<g class="clickable" data-r="${i}" tabindex="0" role="button" aria-label="${off.has(i) ? "Restore" : "Remove"} ${esc(r[0])}" opacity="${off.has(i) ? 0.25 : 1}"><rect x="302" y="${22 + i * 44}" width="296" height="36" fill="transparent"/><line x1="${304 + r[1] * 32}" x2="304" y1="${40 + i * 44}" y2="${40 + i * 44}" stroke="#B83A26" stroke-width="5" marker-end="url(#ff2)"/><text x="310" y="${30 + i * 44}" font-size="12" ${off.has(i) ? 'text-decoration="line-through"' : ""}>${esc(r[0])}</text></g>`).join("")}
        </svg>
        <p class="small" aria-live="polite">Driving total ${ds}, restraining total ${rs}. ${rs < ds ? "<b>The balance tips toward the future state.</b> " : ""}The handbook's point: reducing or removing restraining forces is often more useful than pushing harder on the drivers. Rank the forces with nominal group technique.</p>`;
      $$("[data-r]", el).forEach((g) => { const f = () => { const i = +g.dataset.r; off.has(i) ? off.delete(i) : off.add(i); draw(); }; g.addEventListener("click", f); g.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); f(); } }); });
    }
    draw();
  };
})();
