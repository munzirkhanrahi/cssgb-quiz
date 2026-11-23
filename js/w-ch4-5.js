/* Widgets: shared classifier + Chapter 4 and 5 tools */
(function () {
  "use strict";
  const { $, $$, esc } = G;

  /* ---------- Shared: classify-each-item game ---------- */
  // cfg: {title, hint, cats:[..], items:[{t, a (index or [indices]), why}], select:bool}
  G.classifier = (el, cfg) => {
    const done = new Array(cfg.items.length).fill(null);
    const ok = (it, j) => (Array.isArray(it.a) ? it.a.includes(j) : it.a === j);
    function draw() {
      el.innerHTML = `<h4><span>${cfg.title}</span><span class="soft small" data-score></span></h4>
        ${cfg.hint ? `<p class="hint">${cfg.hint}</p>` : ""}
        <div class="sort-list">${cfg.items.map((it, i) => `
          <div class="sort-item" data-i="${i}">
            <p>${it.t}</p>
            ${cfg.select
              ? `<select aria-label="Your answer for item ${i + 1}"><option value="">Choose…</option>${cfg.cats.map((c, j) => `<option value="${j}">${c}</option>`).join("")}</select>`
              : `<div class="chips" role="group" aria-label="Choose a category">${cfg.cats.map((c, j) => `<button type="button" class="chip" data-j="${j}">${c}</button>`).join("")}</div>`}
            <p class="why" hidden></p>
          </div>`).join("")}</div>
        <div class="row" style="margin-top:.8rem"><button type="button" class="btn sm" data-reset>Reset</button></div>`;
      $$(".sort-item", el).forEach((box) => {
        const i = +box.dataset.i, it = cfg.items[i];
        const answer = (j) => {
          if (done[i] !== null) return;
          done[i] = ok(it, j);
          box.classList.add(done[i] ? "ok" : "no");
          $$(".chip", box).forEach((c) => { const cj = +c.dataset.j; if (ok(it, cj)) c.classList.add("right"); else if (cj === j) c.classList.add("wrong"); c.disabled = true; });
          const sel = $("select", box); if (sel) sel.disabled = true;
          const right = Array.isArray(it.a) ? it.a.map((k) => cfg.cats[k]).join(" or ") : cfg.cats[it.a];
          const w = $(".why", box); w.hidden = false;
          w.innerHTML = `<b style="color:${done[i] ? "var(--belt-deep)" : "var(--ooc)"}">${done[i] ? "Right" : "Not quite"} — ${right}.</b> ${it.why || ""}`;
          score();
        };
        $$(".chip", box).forEach((c) => c.addEventListener("click", () => answer(+c.dataset.j)));
        const sel = $("select", box); if (sel) sel.addEventListener("change", () => sel.value !== "" && answer(+sel.value));
      });
      $("[data-reset]", el).addEventListener("click", () => { done.fill(null); draw(); });
      score();
    }
    function score() {
      const n = done.filter((d) => d !== null).length, r = done.filter((d) => d === true).length;
      $("[data-score]", el).textContent = n ? `${r} of ${n} right` : `${cfg.items.length} items`;
    }
    draw();
  };

  /* ---------- Ch4: which methodology? ---------- */
  G.W.method = (el) => {
    const N = {
      q1: { q: "Is the solution already known, cheap, and low-risk?", yes: "jdi", no: "q2" },
      q2: { q: "Does the process or product already exist, or must it be designed (or completely redesigned)?", yesL: "It exists", noL: "Must be designed", yes: "q3", no: "dfss" },
      q3: { q: "Is the root cause unknown, with variation that needs data analysis or designed experiments to untangle?", yes: "dmaic", no: "q4" },
      q4: { q: "Is the problem mainly waste, flow or cycle time, with visible non-value-added steps?", yes: "lean", no: "other" },
      jdi: { r: "Just do it", d: "Not a project. Implement through normal management, then verify. Spending DMAIC effort on a known fix wastes resources." },
      dfss: { r: "DFSS (DMADV or IDOV)", d: "Design for Six Sigma builds a new process or product to be capable from the start (Chapter 3). DMAIC improves something that already exists." },
      dmaic: { r: "Six Sigma team using DMAIC", d: "The handbook's example: problems needing extensive data analysis and improvements through designed experiments go to a Six Sigma team." },
      lean: { r: "Lean team using kaizen tools", d: "The handbook's example: improvements that do not need those statistical techniques can go to a lean team running kaizen." },
      other: { r: "Re-scope, or use a structured problem-solving method", d: "Sharpen the problem statement first. Options include 8D or PDSA, or a method your customer prescribes (Chapter 7, p. 133)." }
    };
    let path = ["q1"];
    function draw() {
      const cur = path[path.length - 1], node = N[cur];
      el.innerHTML = `<h4>Which methodology fits this problem?</h4>
        <p class="hint">Answer the questions in order. The selection group's real job is to further organizational goals — every route assumes the project is already tied to one.</p>
        <ol class="steps-v">${path.filter((p) => N[p].q).map((p, i) => {
          const ans = path[i + 1];
          return `<li><p><b>${N[p].q}</b>${ans ? `<br><span class="soft">${ans === N[p].yes ? N[p].yesL || "Yes" : N[p].noL || "No"}</span>` : ""}</p></li>`;
        }).join("")}</ol>
        ${node.q ? `<div class="row" style="margin:.8rem 0 0 2.6rem"><button class="btn" data-a="yes">${node.yesL || "Yes"}</button><button class="btn" data-a="no">${node.noL || "No"}</button></div>`
          : `<div class="ro key" style="margin-top:.9rem"><div class="k">Route to</div><div class="v">${node.r}</div><p class="small" style="margin:.3rem 0 0">${node.d}</p></div>`}
        <div class="row" style="margin-top:.8rem">${path.length > 1 ? '<button class="btn sm" data-a="back">Back</button><button class="btn sm" data-a="restart">Start over</button>' : ""}</div>`;
      $$("[data-a]", el).forEach((b) => b.addEventListener("click", () => {
        const a = b.dataset.a;
        if (a === "back") path.pop(); else if (a === "restart") path = ["q1"]; else path.push(N[cur][a]);
        draw();
      }));
    }
    draw();
  };

  /* ---------- Ch4: process zoom (process model + subprocesses) ---------- */
  G.W.zoom = (el) => {
    const trees = {
      part: { name: "Produce part", kids: { "Cut stock": null, Machining: { name: "Machining", kids: { Clamping: null, Turning: null, Plunging: { name: "Plunging", kids: { "Position tool": null, "Feed in": null, Retract: null }, ill: true }, Facing: null } }, Inspect: null, Pack: null } },
      pay: { name: "Run payroll", kids: { "Gather time-clock data": null, "Make deductions": { name: "Make deductions", kids: { "Tax deductions": null, Insurance: null, Retirement: null }, ill: true }, "Issue payments": null } }
    };
    let which = "part", stack = [trees.part];
    const Ms = ["People (man)", "Materials", "Methods", "Machines", "Mother Nature", "Management", "Money", "Measurement system"];
    function draw() {
      const node = stack[stack.length - 1];
      const kids = Object.entries(node.kids);
      const W = 640, bw = Math.min(118, (380 - (kids.length - 1) * 10) / kids.length);
      const x0 = 160 + (400 - (kids.length * bw + (kids.length - 1) * 10)) / 2;
      el.innerHTML = `<h4><span>Zoom into a process</span><span class="seg" role="group" aria-label="Example"><button type="button" data-ex="part" aria-pressed="${which === "part"}">Machined part</button><button type="button" data-ex="pay" aria-pressed="${which === "pay"}">Payroll</button></span></h4>
        <p class="hint">Every step is itself a process with its own inputs, outputs and boundaries. Click a dark step to zoom in.</p>
        <p class="small" aria-live="polite">Level ${stack.length}: ${stack.map((s, i) => i < stack.length - 1 ? `<a href="#" data-up="${i}">${esc(s.name)}</a>` : `<b>${esc(s.name)}</b>`).join(" › ")}${node.ill ? ' <span class="soft">(lowest-level steps illustrative)</span>' : ""}</p>
        <svg class="viz" viewBox="0 0 ${W} 250" role="img" aria-label="Process model for ${esc(node.name)}">
          <defs><marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 10 5 0 10Z" fill="#4F5E6C"/></marker></defs>
          <text x="10" y="18" class="t-disp" font-size="16">Inputs</text>
          ${Ms.map((m, i) => `<text x="10" y="${42 + i * 25}" font-size="12.5" class="t-soft">${m}</text>`).join("")}
          <line x1="128" y1="125" x2="152" y2="125" class="edge" marker-end="url(#arr)"/>
          <rect x="158" y="40" width="404" height="170" rx="10" fill="#fff" stroke="var(--acc)" stroke-width="2"/>
          <text x="360" y="62" text-anchor="middle" class="t-disp" font-size="17">${esc(node.name)}</text>
          <text x="${x0 - 4}" y="98" text-anchor="end" font-size="11" class="t-soft">start</text>
          <line x1="${x0 - 2}" y1="104" x2="${x0 - 2}" y2="176" stroke="var(--acc)" stroke-width="2" stroke-dasharray="4 3"/>
          ${kids.map(([k, v], i) => {
            const x = x0 + i * (bw + 10);
            return `<g class="${v ? "clickable" : ""}" ${v ? `data-k="${esc(k)}" tabindex="0" role="button" aria-label="Zoom into ${esc(k)}"` : ""}>
              <rect x="${x}" y="110" width="${bw}" height="60" rx="7" fill="${v ? "var(--acc)" : "#fff"}" stroke="${v ? "var(--acc)" : "#4F5E6C"}" stroke-width="1.5"/>
              <foreignObject x="${x + 3}" y="113" width="${bw - 6}" height="54"><div xmlns="http://www.w3.org/1999/xhtml" style="height:54px;display:flex;align-items:center;justify-content:center;text-align:center;font-size:12.5px;line-height:1.15;color:${v ? "#fff" : "#18283A"};font-weight:${v ? 700 : 400}">${esc(k)}</div></foreignObject>
              ${i < kids.length - 1 ? `<line x1="${x + bw + 1}" y1="140" x2="${x + bw + 9}" y2="140" class="edge" marker-end="url(#arr)"/>` : ""}
            </g>`;
          }).join("")}
          <line x1="${x0 + kids.length * (bw + 10) - 8}" y1="104" x2="${x0 + kids.length * (bw + 10) - 8}" y2="176" stroke="var(--acc)" stroke-width="2" stroke-dasharray="4 3"/>
          <text x="${x0 + kids.length * (bw + 10) - 4}" y="98" font-size="11" class="t-soft">end</text>
          <line x1="562" y1="125" x2="586" y2="125" class="edge" marker-end="url(#arr)"/>
          <text x="${W - 4}" y="18" text-anchor="end" class="t-disp" font-size="16">Outputs</text>
          ${["Products", "Services", "Data", "Information"].map((m, i) => `<text x="${W - 4}" y="${42 + i * 25}" text-anchor="end" font-size="12.5" class="t-soft">${m}</text>`).join("")}
        </svg>`;
      $$("[data-ex]", el).forEach((b) => b.addEventListener("click", () => { which = b.dataset.ex; stack = [trees[which]]; draw(); }));
      $$("[data-up]", el).forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); stack = stack.slice(0, +a.dataset.up + 1); draw(); }));
      $$("[data-k]", el).forEach((g) => {
        const go = () => { stack.push(node.kids[g.dataset.k]); draw(); };
        g.addEventListener("click", go);
        g.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } });
      });
    }
    draw();
  };

  /* ---------- Ch4/Ch7: SIPOC builder in the handbook's order ---------- */
  G.W.sipoc = (el) => {
    const cols = [
      { k: "S", n: "Suppliers", items: [["Merchant (client)", "ext"], ["Packaging vendor", "ext"], ["Inventory control team", "int"], ["WMS / IT team", "int"]] },
      { k: "I", n: "Inputs", items: [["Order file", ""], ["On-hand inventory", ""], ["Cartons, labels, dunnage", ""], ["Pick list and wave plan", ""]] },
      { k: "P", n: "Process", items: [["1  Receive order", ""], ["2  Release wave", ""], ["3  Pick", ""], ["4  Pack and label", ""], ["5  Load and manifest", ""]] },
      { k: "O", n: "Outputs", items: [["Packed shipment", ""], ["Tracking number", ""], ["Ship confirmation", ""], ["Billing data", ""]] },
      { k: "C", n: "Customers", items: [["End consumer", "ext"], ["Merchant (client)", "ext"], ["Carrier", "ext"], ["Billing team", "int"]] }
    ];
    const order = [
      { c: "P", t: "Define the process and its boundaries first — the centre column. Keep it high level: about four to seven steps, with a clear start (order received) and end (truck manifested)." },
      { c: "O", t: "Next, list everything the process produces: products, data, services, information, records." },
      { c: "I", t: "For each output, identify the inputs it needs." },
      { c: "C", t: "Move to the right: who receives each output? Include internal and external customers." },
      { c: "S", t: "Finally go back to the left: who provides each input? Bouncing side to side is deliberate — it surfaces outputs and customers you would otherwise miss." }
    ];
    let step = 0, tags = false;
    function draw() {
      const shown = new Set(order.slice(0, step + 1).map((o) => o.c));
      el.innerHTML = `<h4><span>Build a SIPOC — handbook order</span><span class="soft small">Step ${step + 1} of 5</span></h4>
        <p class="hint">Example: outbound e-commerce order fulfilment.</p>
        <div style="display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:.35rem;overflow-x:auto">
          ${cols.map((c) => {
            const on = shown.has(c.k), now = order[step].c === c.k;
            return `<div style="border:1.5px solid ${now ? "var(--acc)" : "var(--rule)"};border-radius:8px;background:${on ? "#fff" : "transparent"};padding:.45rem;min-width:6.5rem">
              <div style="font:700 1.6rem/1 var(--display);color:${on ? "var(--acc)" : "var(--rule)"}">${c.k}</div>
              <div class="small" style="font-weight:700;margin-bottom:.3rem;color:${on ? "var(--ink)" : "var(--ink-soft)"}">${c.n}${on ? ` <span class="soft">(${order.findIndex((o) => o.c === c.k) + 1})</span>` : ""}</div>
              ${on ? c.items.map(([t, ie]) => `<div class="small" style="border-top:1px solid var(--rule-soft);padding:.25rem 0;line-height:1.25">${esc(t)}${tags && ie ? ` <span class="pill" style="padding:.1rem .35rem;font-size:.7rem">${ie === "ext" ? "external" : "internal"}</span>` : ""}</div>`).join("") : '<div class="small soft">—</div>'}
            </div>`;
          }).join("")}
        </div>
        <p style="margin:.8rem 0 .4rem" aria-live="polite"><b>Step ${step + 1}: ${cols.find((c) => c.k === order[step].c).n}.</b> ${order[step].t}</p>
        <div class="row">
          <button class="btn sm" data-a="prev" ${step === 0 ? "disabled" : ""}>Previous step</button>
          <button class="btn sm primary" data-a="next" ${step === 4 ? "disabled" : ""}>Next step</button>
          ${step === 4 ? `<button class="btn sm" data-a="tags" aria-pressed="${tags}">${tags ? "Hide" : "Show"} internal / external</button>` : ""}
        </div>`;
      $$("[data-a]", el).forEach((b) => b.addEventListener("click", () => {
        const a = b.dataset.a; if (a === "prev") step--; else if (a === "next") step++; else tags = !tags; draw();
      }));
    }
    draw();
  };

  /* ---------- Ch4: process owner vs stakeholder sorter ---------- */
  G.W.ownersort = (el) => G.classifier(el, {
    title: "Process owner or stakeholder?",
    hint: "Every process owner is also a stakeholder. Pick the most specific role.",
    cats: ["Process owner", "Stakeholder"],
    items: [
      { t: "Named in the work instruction as responsible for defining, running, maintaining and improving the returns process.", a: 0, why: "Formal recognition (procedures, job description, org chart) plus responsibility for execution and improvement is the process-owner test." },
      { t: "Night-shift pickers who run the process every day.", a: 1, why: "Operators from all shifts are stakeholders — the people with the best process knowledge, but not the owner." },
      { t: "The carrier that collects the outbound trailers.", a: 1, why: "An external customer of the process — a stakeholder." },
      { t: "The engineer who designed the packing station layout.", a: 1, why: "Process design personnel are listed among stakeholders." },
      { t: "The manager whose job description says she approves all changes to the putaway procedure and answers for its results.", a: 0, why: "Approval authority over the documented procedure and accountability for results mark the owner." },
      { t: "Investors and the local community near the site.", a: 1, why: "The handbook's general stakeholder list includes investors and communities." }
    ]
  });

  /* ---------- Ch5: internal vs external customer depends on the boundary ---------- */
  G.W.boundary = (el) => {
    const boxes = [
      { n: "Packaging vendor", pos: "up", ent: "out" },
      { n: "Receiving", pos: "up", ent: "in" },
      { n: "Picking", pos: "in", ent: "in" },
      { n: "Packing", pos: "in", ent: "in" },
      { n: "Shipping dock", pos: "down", ent: "in" },
      { n: "Billing team", pos: "down", ent: "in" },
      { n: "Carrier", pos: "down", ent: "out" },
      { n: "End consumer", pos: "down", ent: "out" }
    ];
    let frame = "voc";
    function label(b) {
      if (frame === "voc") {
        if (b.pos === "in") return ["Internal customer", "works inside the project boundary", "var(--acc)"];
        if (b.pos === "up") return ["Supplier", "feeds the process", "var(--ink-soft)"];
        return ["External customer", "outside the project boundary", "var(--ink)"];
      }
      if (b.pos === "in") return ["The process", "being studied", "var(--acc)"];
      if (b.pos === "up") return [b.ent === "in" ? "Internal supplier" : "External supplier", b.ent === "in" ? "inside the enterprise" : "outside the enterprise", "var(--ink-soft)"];
      return [b.ent === "in" ? "Internal customer" : "External customer", b.ent === "in" ? "inside the enterprise" : "outside the enterprise", "var(--ink)"];
    }
    function draw() {
      el.innerHTML = `<h4><span>Who is an internal customer? It depends on the boundary</span>
        <span class="seg" role="group" aria-label="Definition"><button type="button" data-f="voc" aria-pressed="${frame === "voc"}">Ch 5 VOC (project boundary)</button><button type="button" data-f="ent" aria-pressed="${frame === "ent"}">Ch 7 SIPOC (enterprise)</button></span></h4>
        <p class="hint">Project scope: picking and packing (shaded). Switch definitions and watch the labels move.</p>
        <div style="display:grid;grid-template-columns:repeat(8,minmax(5.6rem,1fr));gap:.3rem;overflow-x:auto;padding-bottom:.3rem">
          ${boxes.map((b) => { const [l, s, c] = label(b); return `
            <div style="border:1.5px solid ${b.pos === "in" ? "var(--acc)" : "var(--rule)"};background:${b.pos === "in" ? "color-mix(in srgb, var(--acc) 12%, white)" : "#fff"};border-radius:8px;padding:.45rem;display:flex;flex-direction:column;gap:.3rem">
              <div style="font-weight:700;font-size:.9rem;line-height:1.2">${b.n}</div>
              <div style="font:700 1rem/1.1 var(--display);color:${c}">${l}</div>
              <div class="small soft" style="line-height:1.2">${s}</div>
            </div>`; }).join("")}
        </div>
        <p class="small" style="margin-top:.6rem" aria-live="polite">${frame === "voc"
          ? "Chapter 5 (p. 89): internal customers are people who work in the process being studied; external customers are outside the project's boundaries. Anyone beyond both groups is a stakeholder (board, neighbours, regulators)."
          : "Chapter 7 (p. 135): internal customers are departments or processes inside the enterprise that receive outputs; external customers are outside the enterprise. The shipping dock and billing team flip to internal."}</p>`;
      $$("[data-f]", el).forEach((b) => b.addEventListener("click", () => { frame = b.dataset.f; draw(); }));
    }
    draw();
  };

  /* ---------- Ch5: survey question fixer ---------- */
  G.W.survey = (el) => G.classifier(el, {
    title: "Find the flaw in each survey question",
    hint: "BoK II.B.2 asks you to review questions for vagueness, ambiguity and unintended bias.",
    cats: ["Leading / biased", "Double-barrelled", "Vague", "Ambiguous scale", "No flaw"],
    items: [
      { t: "“Don't you agree our new returns portal is much easier?”", a: 0, why: "It pushes toward ‘yes’. Neutral form: “How easy or difficult was the returns portal to use?”" },
      { t: "“How satisfied are you with our delivery speed and packaging?”", a: 1, why: "Two topics, one answer. A low score cannot tell you which one failed. Split it." },
      { t: "“Do you use the portal regularly?”", a: 2, why: "‘Regularly’ means different things to different people. Ask for a count in a defined period." },
      { t: "“Rate us: 1 = poor, 2 = fair, 3 = fair, 4 = good, 5 = excellent.”", a: 3, why: "Two points share a label, so the scale is ambiguous. Each point needs one distinct meaning." },
      { t: "“In the last 30 days, how many orders arrived after the promised date?”", a: 4, why: "Specific period, one topic, neutral wording, countable answer." },
      { t: "“How much did our industry-leading support team help you?”", a: 0, why: "‘Industry-leading’ is a loaded word that biases the respondent." }
    ]
  });

  /* ---------- Ch5: house of quality rooms ---------- */
  G.W.hoq = (el) => {
    const R = {
      roof: ["Co-relationships (the roof)", "How the technical requirements (hows) affect each other. Positive: both can improve together. Negative: improving one makes the other worse — a design trade-off."],
      hows: ["Technical requirements (hows)", "The organization's measurable response to the customer requirements. Symbols on top show the direction of improvement: higher is better, lower is better, or target is best."],
      whats: ["Customer requirements (whats)", "Built from the voice of the customer, usually with an importance rating for each line. More than about 25 lines gets unmanageable — condense with an affinity diagram first."],
      rel: ["Relationship matrix", "Where each what meets each how. Symbols mark strong, moderate or weak links; the example scores them 9, 3 and 1 (the values are arbitrary)."],
      comp: ["Comparison with competition (customer)", "How customers rate you against competitors on each customer requirement. Not shown on every QFD matrix."],
      notes: ["Action notes", "An index to documentation about improvement activities."],
      tcomp: ["Comparison with competition (technical)", "Your technical performance versus competitors on each how. Not shown on every matrix."],
      target: ["Target values and column weights", "Targets for each technical requirement. Optional column weight = Σ (importance × relationship value), showing which hows matter most to the customer."]
    };
    let on = "rel";
    el.innerHTML = `<h4>Rooms of the house of quality</h4><p class="hint">Click a room.</p>
      <div class="grid2" style="align-items:start">
        <svg class="viz" viewBox="0 0 400 330" role="group" aria-label="House of quality diagram">
          ${[
            ["roof", '<polygon CLS points="120,80 220,10 320,80"/>', 220, 58],
            ["hows", '<rect CLS x="120" y="80" width="200" height="55"/>', 220, 112],
            ["whats", '<rect CLS x="10" y="135" width="110" height="120"/>', 65, 198],
            ["rel", '<rect CLS x="120" y="135" width="200" height="120"/>', 220, 198],
            ["comp", '<rect CLS x="320" y="135" width="40" height="120"/>', 340, 198],
            ["notes", '<rect CLS x="360" y="135" width="32" height="120"/>', 376, 198],
            ["tcomp", '<rect CLS x="120" y="255" width="200" height="34"/>', 220, 276],
            ["target", '<rect CLS x="120" y="289" width="200" height="34"/>', 220, 310]
          ].map(([k, shape, tx, ty]) => `<g class="clickable" data-r="${k}" tabindex="0" role="button" aria-label="${R[k][0]}">
              ${shape.replace("CLS", `class="room${k === on ? " on" : ""}"`)}
              <text x="${tx}" y="${ty}" text-anchor="middle" font-size="${k === "comp" || k === "notes" ? 9.5 : 12.5}" ${k === "comp" || k === "notes" ? `transform="rotate(-90 ${tx} ${ty})"` : ""}>${{ roof: "Roof", hows: "Hows", whats: "Whats", rel: "Relationships", comp: "Competition", notes: "Notes", tcomp: "Technical comparison", target: "Targets / weights" }[k]}</text>
            </g>`).join("")}
        </svg>
        <div class="ro key" aria-live="polite"><div class="k">Room</div><div class="v" data-t></div><p class="small" data-d style="margin:.35rem 0 0"></p></div>
      </div>`;
    const set = (k) => { on = k; $$(".room", el).forEach((r) => r.classList.toggle("on", r.parentNode.dataset.r === k)); $("[data-t]", el).textContent = R[k][0]; $("[data-d]", el).textContent = R[k][1]; };
    $$("[data-r]", el).forEach((g) => { g.addEventListener("click", () => set(g.dataset.r)); g.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); set(g.dataset.r); } }); });
    set(on);
  };

  /* ---------- Ch5: QFD column weight calculator ---------- */
  G.W.qfdcalc = (el) => {
    const whats = [["Easy to open", 4], ["Doesn't leak", 5], ["Light to carry", 2]];
    const hows = ["Lid torque", "Seal compression", "Wall thickness"];
    const rel = [[9, 3, 0], [3, 9, 1], [0, 0, 9]];
    const SYM = { 0: "", 1: "△ 1", 3: "○ 3", 9: "● 9" };
    function calc() {
      const w = hows.map((_, j) => whats.reduce((s, wt, i) => s + wt[1] * rel[i][j], 0));
      const tot = w.reduce((a, b) => a + b, 0) || 1;
      w.forEach((v, j) => { $(`[data-cw="${j}"]`, el).textContent = v; $(`[data-cp="${j}"]`, el).textContent = Math.round((v / tot) * 100) + "%"; });
      const best = w.indexOf(Math.max(...w));
      $("[data-best]", el).innerHTML = `Highest-priority technical requirement: <b>${hows[best]}</b> (${w[best]}).`;
    }
    el.innerHTML = `<h4>QFD column weights</h4>
      <p class="hint">Column weight = Σ (customer importance × relationship value). Change any importance or symbol.</p>
      <div class="tbl-wrap"><table class="tbl"><thead><tr><th scope="col">Customer requirement</th><th scope="col" class="num">Importance</th>${hows.map((h) => `<th scope="col">${h}</th>`).join("")}</tr></thead>
      <tbody>${whats.map((w, i) => `<tr><th scope="row">${w[0]}</th><td class="num"><input type="number" min="1" max="5" value="${w[1]}" data-imp="${i}" aria-label="Importance of ${w[0]}" style="width:4.2rem"></td>
        ${hows.map((h, j) => `<td><select data-rel="${i}-${j}" aria-label="${w[0]} vs ${h}">${[0, 1, 3, 9].map((v) => `<option value="${v}" ${rel[i][j] === v ? "selected" : ""}>${SYM[v] || "—"}</option>`).join("")}</select></td>`).join("")}</tr>`).join("")}
        <tr><th scope="row">Column weight</th><td></td>${hows.map((_, j) => `<td><b data-cw="${j}" style="font:700 1.4rem var(--display)"></b> <span class="soft small" data-cp="${j}"></span></td>`).join("")}</tr></tbody></table></div>
      <p class="small" data-best aria-live="polite"></p>
      <p class="small soft">Roof note for this example: lid torque and seal compression are negatively co-related — a tighter seal makes the lid harder to open.</p>`;
    $$("[data-imp]", el).forEach((inp) => inp.addEventListener("input", () => { whats[+inp.dataset.imp][1] = Math.max(0, +inp.value || 0); calc(); }));
    $$("[data-rel]", el).forEach((s) => s.addEventListener("change", () => { const [i, j] = s.dataset.rel.split("-").map(Number); rel[i][j] = +s.value; calc(); }));
    calc();
  };

  /* ---------- Ch5: CTx lens — same spec, different reason ---------- */
  G.W.ctx = (el) => {
    const L = {
      CTQ: { t: "Critical to quality", d: "The customer specifies weight between 15 and 20 lb. A unit outside the window does not meet the critical requirement — a conformance issue.", mark: "q" },
      CTC: { t: "Critical to cost", d: "Same 15–20 lb window, stated for a cost reason: units heavier than 20 lb draw more power, raising the customer's operating cost.", mark: "c" },
      CTS: { t: "Critical to safety", d: "Same window again, for safety: over 20 lb causes back injuries, and under 15 lb tempts operators to carry several at once — also injuring backs.", mark: "s" },
      CTD: { t: "Critical to delivery", d: "Delivery has a window too. Late is bad, and so is early: early stock is inventory the customer pays for before needing it. Example: no earlier than 2 days before, no later than 1 day after the due date.", mark: "d" },
      CTP: { t: "Critical to process", d: "Usually key process input variables — the critical x's in y = f(x), such as temperature, pressure or humidity. You may know which x's matter before knowing their settings; once set, they deliver a consistent y.", mark: "p" }
    };
    let on = "CTQ";
    function axis() {
      const k = L[on].mark;
      if (k === "p") return `<svg class="viz" viewBox="0 0 560 120" role="img" aria-label="y equals f of x diagram">
        ${["Temperature", "Pressure", "Humidity"].map((x, i) => `<rect x="10" y="${8 + i * 36}" width="140" height="28" rx="6" fill="#fff" stroke="var(--acc)" stroke-width="1.5"/><text x="80" y="${27 + i * 36}" text-anchor="middle" font-size="13">${x}</text><line x1="152" y1="${22 + i * 36}" x2="250" y2="60" class="edge"/>`).join("")}
        <rect x="250" y="38" width="120" height="44" rx="8" fill="var(--acc)"/><text x="310" y="66" text-anchor="middle" fill="#fff" class="t-disp" font-size="18" style="fill:#fff">Process</text>
        <line x1="370" y1="60" x2="430" y2="60" class="edge"/><text x="440" y="56" class="t-disp" font-size="20">y = f(x)</text><text x="440" y="76" font-size="12" class="t-soft">consistent output</text></svg>`;
      if (k === "d") {
        const sx = (d) => 40 + (d + 4) * 60;
        return `<svg class="viz" viewBox="0 0 560 110" role="img" aria-label="Delivery window from 2 days early to 1 day late">
          <rect x="${sx(-2)}" y="30" width="${sx(1) - sx(-2)}" height="34" fill="color-mix(in srgb, var(--acc) 22%, white)" stroke="var(--acc)"/>
          <line x1="40" y1="64" x2="520" y2="64" stroke="#18283A" stroke-width="1.5"/>
          ${[-4, -3, -2, -1, 0, 1, 2, 3, 4].map((d) => `<line x1="${sx(d)}" y1="64" x2="${sx(d)}" y2="70" stroke="#18283A"/><text x="${sx(d)}" y="86" text-anchor="middle" font-size="12">${d === 0 ? "due" : (d > 0 ? "+" : "") + d}</text>`).join("")}
          <text x="${(sx(-2) + sx(1)) / 2}" y="22" text-anchor="middle" font-size="13" font-weight="700">acceptable window</text>
          <text x="${sx(-3.5)}" y="50" text-anchor="middle" font-size="12" style="fill:var(--ooc)">too early</text><text x="${sx(3)}" y="50" text-anchor="middle" font-size="12" style="fill:var(--ooc)">too late</text>
          <text x="280" y="106" text-anchor="middle" font-size="11.5" class="t-soft">days relative to due date</text></svg>`;
      }
      const sx = (w) => 40 + (w - 10) * 32;
      const notes = { q: [["outside spec = nonconforming", 22.5]], c: [["more power → higher cost", 22.5]], s: [["back injuries", 22.5], ["carry several → back injuries", 12.1]] }[k];
      return `<svg class="viz" viewBox="0 0 560 110" role="img" aria-label="Weight window 15 to 20 pounds">
        <rect x="${sx(15)}" y="30" width="${sx(20) - sx(15)}" height="34" fill="color-mix(in srgb, var(--acc) 22%, white)" stroke="var(--acc)"/>
        <line x1="40" y1="64" x2="520" y2="64" stroke="#18283A" stroke-width="1.5"/>
        ${[10, 12.5, 15, 17.5, 20, 22.5, 25].map((w) => `<line x1="${sx(w)}" y1="64" x2="${sx(w)}" y2="70" stroke="#18283A"/><text x="${sx(w)}" y="86" text-anchor="middle" font-size="12">${w}</text>`).join("")}
        <text x="${(sx(15) + sx(20)) / 2}" y="22" text-anchor="middle" font-size="13" font-weight="700">15–20 lb</text>
        ${notes.map(([t, w]) => `<text x="${sx(w)}" y="50" text-anchor="middle" font-size="12" style="fill:var(--ooc)">${t}</text>`).join("")}
        <text x="280" y="106" text-anchor="middle" font-size="11.5" class="t-soft">product weight (lb)</text></svg>`;
    }
    function draw() {
      el.innerHTML = `<h4><span>One characteristic, five lenses</span><span class="seg" role="group" aria-label="CTx type">${Object.keys(L).map((k) => `<button type="button" data-k="${k}" aria-pressed="${k === on}">${k}</button>`).join("")}</span></h4>
        ${axis()}
        <p style="margin:.6rem 0 0" aria-live="polite"><b>${L[on].t}.</b> ${L[on].d}</p>`;
      $$("[data-k]", el).forEach((b) => b.addEventListener("click", () => { on = b.dataset.k; draw(); }));
    }
    draw();
  };

  /* ---------- Ch5: Kano model with life cycle ---------- */
  G.W.kano = (el) => {
    const W = 560, H = 330, px = (x) => 60 + ((x + 1) / 2) * 460, py = (y) => 165 - y * 140;
    const fM = (x) => -Math.exp(-2.5 * (x + 1)), fD = (x) => Math.exp(-2.5 * (1 - x)), fO = (x) => x;
    const path = (f) => { let d = ""; for (let i = 0; i <= 80; i++) { const x = -1 + i / 40; d += (i ? "L" : "M") + px(x).toFixed(1) + " " + py(f(x)).toFixed(1); } return d; };
    const ERAS = [
      { n: "Just introduced", cat: "Delighter", f: fD, d: "Present: customers are delighted. Absent: nobody misses them — no dissatisfaction." },
      { n: "Becoming common", cat: "One-dimensional", f: fO, d: "Satisfaction now tracks how well the feature performs — more is better, less is worse." },
      { n: "Expected today", cat: "Must-be", f: fM, d: "Present: merely neutral. Absent: strong dissatisfaction. A car without cup holders would not sell well." }
    ];
    let era = 0;
    function draw() {
      const E = ERAS[era], yes = E.f(0.85), no = E.f(-0.85);
      el.innerHTML = `<h4>Kano model — and how a delighter ages</h4>
        <div class="legend" aria-hidden="true"><span><i style="background:#2F6DB5"></i>Must-be</span><span><i style="background:#C4751A"></i>One-dimensional</span><span><i style="background:#7B5AA6"></i>Delighter</span><span><i class="dot" style="background:var(--ink)"></i>Cup holders present</span><span><i class="dot" style="background:#fff;border:2px solid var(--ink)"></i>Absent</span></div>
        <svg class="viz" viewBox="0 0 ${W} ${H}" role="img" aria-label="Kano model curves. Era: ${E.n}, cup holders behave as ${E.cat}">
          <line x1="60" y1="${py(0)}" x2="520" y2="${py(0)}" stroke="#CBD5CE" stroke-width="1.5"/>
          <line x1="${px(0)}" y1="20" x2="${px(0)}" y2="310" stroke="#CBD5CE" stroke-width="1.5"/>
          <text x="${px(0)}" y="14" text-anchor="middle" font-size="12" class="t-soft">Satisfaction</text>
          <text x="${px(0)}" y="306" text-anchor="middle" font-size="12" class="t-soft" dx="6" style="text-anchor:start">Dissatisfaction</text>
          <text x="60" y="324" font-size="12" class="t-soft">← Dysfunctional / absent</text>
          <text x="520" y="324" text-anchor="end" font-size="12" class="t-soft">Fully functional →</text>
          <path d="${path(fM)}" fill="none" stroke="#2F6DB5" stroke-width="2.5" ${E.f === fM ? "" : 'opacity=".45"'}/>
          <path d="${path(fO)}" fill="none" stroke="#C4751A" stroke-width="2.5" ${E.f === fO ? "" : 'opacity=".45"'}/>
          <path d="${path(fD)}" fill="none" stroke="#7B5AA6" stroke-width="2.5" ${E.f === fD ? "" : 'opacity=".45"'}/>
          <text x="${px(-0.73)}" y="${py(fM(-0.73)) - 8}" text-anchor="end" font-size="12.5" font-weight="700">Must-be</text>
          <text x="${px(-0.45)}" y="${py(-0.62)}" font-size="12.5" font-weight="700">One-dimensional</text>
          <text x="${px(0.6)}" y="${py(fD(0.6)) + 22}" font-size="12.5" font-weight="700">Delighter</text>
          <line x1="${px(0.85)}" y1="${py(yes)}" x2="${px(-0.85)}" y2="${py(no)}" stroke="#18283A" stroke-dasharray="3 3"/>
          <circle cx="${px(0.85)}" cy="${py(yes)}" r="8" fill="#18283A" stroke="#fff" stroke-width="2"/>
          <circle cx="${px(-0.85)}" cy="${py(no)}" r="8" fill="#fff" stroke="#18283A" stroke-width="2.5"/>
        </svg>
        <label class="field" style="margin-top:.4rem">Life cycle of automobile cup holders: <b style="color:var(--ink)">${E.n} → ${E.cat}</b>
          <input type="range" min="0" max="2" step="1" value="${era}" aria-valuetext="${E.n}, ${E.cat}"></label>
        <p class="small" style="margin-top:.4rem" aria-live="polite">${E.d}</p>`;
      $("input", el).addEventListener("input", (e) => { era = +e.target.value; draw(); $("input", el).focus(); });
    }
    draw();
  };

  G.W.kanosort = (el) => G.classifier(el, {
    title: "Classify the feature",
    hint: "Think about what happens when the feature is absent as well as present.",
    cats: ["Must-be", "One-dimensional", "Delighter"],
    items: [
      { t: "The right item is in the box.", a: 0, why: "Absence causes anger; presence earns no praise." },
      { t: "Each day faster delivery means a happier customer.", a: 1, why: "Satisfaction rises in direct proportion to performance." },
      { t: "A handwritten thank-you note from the packer, never advertised.", a: 2, why: "Nobody expects it, so its absence costs nothing; its presence delights." },
      { t: "The hotel room is clean.", a: 0, why: "A basic expectation — it can only bring satisfaction up to neutral." },
      { t: "Lower shipping fee: the lower it goes, the better customers feel.", a: 1, why: "A linear, more-is-better relationship." },
      { t: "A free room upgrade on arrival.", a: 2, why: "Unexpected and unrequested — a delighter (until guests start to expect it)." }
    ]
  });

  /* ---------- Ch5: weighting different kinds of VOC input ---------- */
  G.W.vocweight = (el) => {
    const ch = [["Product complaint", 4], ["Expedited service request", 3], ["Telephone call", 2], ["Survey response", 1]];
    const issues = [["Late delivery", [3, 2, 4, 30]], ["Damaged carton", [12, 4, 3, 5]]];
    function calc() {
      issues.forEach((iss, k) => {
        const raw = iss[1].reduce((a, b) => a + b, 0), wt = iss[1].reduce((s, c, i) => s + c * ch[i][1], 0);
        $(`[data-raw="${k}"]`, el).textContent = raw; $(`[data-wt="${k}"]`, el).textContent = wt;
      });
      const r = issues.map((i) => i[1].reduce((a, b) => a + b, 0)), w = issues.map((iss) => iss[1].reduce((s, c, i) => s + c * ch[i][1], 0));
      const rt = r[0] >= r[1] ? 0 : 1, wtp = w[0] >= w[1] ? 0 : 1;
      $("[data-v]", el).innerHTML = rt === wtp ? `Both counts point to <b>${issues[rt][0]}</b>.` : `Raw count says <b>${issues[rt][0]}</b>; weighted says <b>${issues[wtp][0]}</b>. Weighting changed the priority.`;
    }
    el.innerHTML = `<h4>Weighting VOC by channel</h4>
      <p class="hint">BoK II.B.3: weight inputs to amplify importance and urgency — a complaint can count for more than a survey comment. The weights below are illustrative; your team sets real ones.</p>
      <div class="tbl-wrap"><table class="tbl"><thead><tr><th scope="col">Channel</th><th scope="col" class="num">Weight</th>${issues.map((i) => `<th scope="col" class="num">${i[0]}</th>`).join("")}</tr></thead>
      <tbody>${ch.map((c, i) => `<tr><th scope="row">${c[0]}</th><td class="num"><input type="number" min="0" max="10" step="0.5" value="${c[1]}" data-wt="${i}" aria-label="Weight for ${c[0]}" style="width:4.5rem"></td>${issues.map((iss) => `<td class="num">${iss[1][i]}</td>`).join("")}</tr>`).join("")}
      <tr><th scope="row">Raw mentions</th><td></td>${issues.map((_, k) => `<td class="num"><b data-raw="${k}"></b></td>`).join("")}</tr>
      <tr><th scope="row">Weighted score</th><td></td>${issues.map((_, k) => `<td class="num"><b data-wt="${k}" style="font:700 1.3rem var(--display)"></b></td>`).join("")}</tr></tbody></table></div>
      <p class="small" data-v aria-live="polite"></p>`;
    $$("[data-wt]", el).forEach((inp) => inp.addEventListener("input", () => { ch[+inp.dataset.wt][1] = Math.max(0, +inp.value || 0); calc(); }));
    calc();
  };
})();
