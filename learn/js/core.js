/* Define, visually — core: helpers, stats, router, chapter renderer, blind check engine */
(function () {
  "use strict";
  const G = (window.G = { chapters: {}, order: [], W: {}, pages: {} });

  /* ---------- tiny helpers ---------- */
  G.esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  G.$ = (sel, root = document) => root.querySelector(sel);
  G.$$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  G.num = (x, d = 2) => {
    if (!isFinite(x)) return "—";
    return Number(x).toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
  };
  G.sig = (x, s = 4) => (isFinite(x) ? Number(x.toPrecision(s)).toLocaleString("en-US", { maximumFractionDigits: 10 }) : "—");
  G.html = (el, s) => { el.innerHTML = s; return el; };
  G.LETTERS = ["A", "B", "C", "D", "E"];

  /* ---------- storage (best-effort; never required) ---------- */
  const KEY = "gbLearn.v1";
  G.load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } };
  G.save = (o) => { try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) { /* private mode etc. */ } };
  G.state = G.load();
  G.state.rev = G.state.rev || {};
  G.state.best = G.state.best || {};
  G.persist = () => G.save(G.state);

  /* ---------- statistics ---------- */
  // Complementary error function, Numerical Recipes erfcc (fractional error < 1.2e-7 everywhere, good in the tails)
  G.erfc = (x) => {
    const z = Math.abs(x), t = 1 / (1 + 0.5 * z);
    const r = t * Math.exp(-z * z - 1.26551223 + t * (1.00002368 + t * (0.37409196 + t * (0.09678418 + t * (-0.18628806 +
      t * (0.27886807 + t * (-1.13520398 + t * (1.48851587 + t * (-0.82215223 + t * 0.17087277)))))))));
    return x >= 0 ? r : 2 - r;
  };
  G.Phi = (z) => 0.5 * G.erfc(-z / Math.SQRT2);
  G.upperTail = (z) => 0.5 * G.erfc(z / Math.SQRT2); // P(Z > z) computed directly for precision
  // Inverse standard normal (Acklam), relative error ~1.15e-9
  G.PhiInv = (p) => {
    if (p <= 0) return -Infinity; if (p >= 1) return Infinity;
    const a = [-3.969683028665376e1, 2.209460984245205e2, -2.759285104469687e2, 1.383577518672690e2, -3.066479806614716e1, 2.506628277459239];
    const b = [-5.447609879822406e1, 1.615858368580409e2, -1.556989798598866e2, 6.680131188771972e1, -1.328068155288572e1];
    const c = [-7.784894002430293e-3, -3.223964580411365e-1, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783];
    const d = [7.784695709041462e-3, 3.224671290700398e-1, 2.445134137142996, 3.754408661907416];
    const pl = 0.02425;
    let q, r;
    if (p < pl) { q = Math.sqrt(-2 * Math.log(p)); return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1); }
    if (p > 1 - pl) { q = Math.sqrt(-2 * Math.log(1 - p)); return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1); }
    q = p - 0.5; r = q * q;
    return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
  };
  // Sigma level (short-term convention, adds the 1.5 shift) from DPMO
  G.sigmaFromDPMO = (dpmo) => G.PhiInv(1 - dpmo / 1e6) + 1.5;

  /* ---------- icons + callouts ---------- */
  const IC = {
    trap: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 2 19 18H1Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M10 8v4.5M10 14.6v.4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    tab: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 2h9l5 4v12H3Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M12 2v4h5" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
    flag: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 3.5c2.5-1.5 4.5-1.5 7 0s4.5 1.5 7 0v8c-2.5 1.5-4.5 1.5-7 0s-4.5-1.5-7 0Zm0 0V19" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>'
  };
  G.trap = (body, head = "Exam trap") => `<aside class="callout trap"><p class="callout-h">${IC.trap}${head}</p>${body}</aside>`;
  G.tab = (body, head = "Tab it") => `<aside class="callout tabit"><p class="callout-h">${IC.tab}${head}</p>${body}</aside>`;
  G.flag = (body, head = "Handbook check") => `<aside class="callout flag"><p class="callout-h">${IC.flag}${head}</p>${body}</aside>`;
  G.table = (head, rows, opts = {}) => `<div class="tbl-wrap"><table class="tbl">${opts.caption ? `<caption class="vh">${opts.caption}</caption>` : ""}<thead><tr>${head.map((h) => `<th scope="col">${h}</th>`).join("")}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c, i) => (i === 0 && opts.rowHead !== false ? `<th scope="row">${c}</th>` : `<td>${c}</td>`)).join("")}</tr>`).join("")}</tbody></table></div>`;
  G.w = (name, attrs = "") => `<div class="bench" data-w="${name}" ${attrs}></div>`;
  G.ro = (k, v, s = "", key = false) => `<div class="ro${key ? " key" : ""}"><div class="k">${k}</div><div class="v">${v}</div>${s ? `<div class="s">${s}</div>` : ""}</div>`;

  /* tooltip shared by SVG widgets */
  let tipEl;
  G.tip = (html, ev) => {
    if (!tipEl) { tipEl = document.createElement("div"); tipEl.className = "tip"; tipEl.setAttribute("role", "status"); document.body.appendChild(tipEl); }
    if (!html) { tipEl.style.display = "none"; return; }
    tipEl.innerHTML = html; tipEl.style.display = "block";
    const x = Math.min(ev.clientX + 14, window.innerWidth - tipEl.offsetWidth - 8);
    const y = Math.max(8, ev.clientY - tipEl.offsetHeight - 12);
    tipEl.style.left = x + "px"; tipEl.style.top = y + "px";
  };

  /* ---------- registration ---------- */
  G.chapter = (def) => { G.chapters[def.id] = def; G.order.push(def.id); };
  G.page = (id, def) => { G.pages[id] = def; };

  /* ---------- tabs ---------- */
  const TABS = [
    { id: "home", n: "Map", l: "Start here", c: "--cx", word: true },
    { gap: "Organization" },
    { id: "ch1", n: "1", l: "Goals, history", c: "--c1" },
    { id: "ch2", n: "2", l: "Lean", c: "--c2" },
    { id: "ch3", n: "3", l: "DFSS, FMEA", c: "--c3" },
    { gap: "Define" },
    { id: "ch4", n: "4", l: "Project ID", c: "--c4" },
    { id: "ch5", n: "5", l: "VOC", c: "--c5" },
    { id: "ch6", n: "6", l: "Project mgmt", c: "--c6" },
    { id: "ch7", n: "7", l: "M&P tools", c: "--c7" },
    { id: "ch8", n: "8", l: "Results", c: "--c8" },
    { id: "ch9", n: "9", l: "Teams", c: "--c9" },
    { gap: "Improve" },
    { id: "ch19", n: "19", l: "DOE", c: "--c19" },
    { id: "ch20", n: "20", l: "Pilots, PoC", c: "--c20" },
    { id: "ch21", n: "21", l: "Lean tools", c: "--c21" },
    { gap: "Control" },
    { id: "ch22", n: "22", l: "SPC", c: "--c22" },
    { id: "ch23", n: "23", l: "Sustain", c: "--c23" },
    { id: "ch24", n: "24", l: "TPM, visual", c: "--c24" },
    { gap: "All chapters" },
    { id: "traps", n: "Traps", l: "Close calls", c: "--ooc", word: true },
    { id: "formulas", n: "Math", l: "Formula sheet", c: "--cx", word: true },
    { id: "binder", n: "Binder", l: "What to tab", c: "--limit", word: true }
  ];
  G.colorOf = (id) => (TABS.find((t) => t.id === id) || { c: "--belt" }).c;

  function drawTabs(active) {
    const nav = G.$("#tabs");
    nav.innerHTML = TABS.map((t) => {
      if (t.gap) return `<span class="tab-gap" aria-hidden="true">${t.gap}</span>`;
      const best = G.state.best[t.id];
      const ch = G.chapters[t.id];
      const done = best && ch ? `<span class="done" title="Best blind-check score">${best}/${ch.check.length}</span>` : "";
      return `<a class="tab" href="#/${t.id === "home" ? "" : t.id}" style="--tc: var(${t.c})" ${t.id === active ? 'aria-current="page"' : ""}>
        <span class="${t.word ? "tab-w" : "tab-n"}">${t.word ? t.n : t.n}</span><span class="tab-l">${t.l}</span>${done}</a>`;
    }).join("");
  }
  G.drawTabs = drawTabs;

  /* ---------- chapter renderer ---------- */
  function renderChapter(ch) {
    const secs = ch.sections;
    const toc = secs.map((s) => `<li><a href="#/${ch.id}/${s.id}"><span class="lvdot lv-${s.level}" title="${s.level}"></span><span class="tl">${s.title}</span>${s.hy ? '<span class="hymark" title="High yield">HY</span>' : ""}</a></li>`).join("");
    const body = secs.map((s) => `
      <section class="topic" id="${ch.id}-${s.id}" aria-labelledby="${ch.id}-${s.id}-h">
        <h2 id="${ch.id}-${s.id}-h">${s.title}</h2>
        <div class="meta">
          <span class="pill">BoK ${s.bok}</span>
          <span class="pill lv-${s.level}">${s.level}</span>
          ${s.hy ? '<span class="pill hy">High yield</span>' : ""}
          ${s.pages ? `<span class="pill pg">Handbook p. ${s.pages}</span>` : ""}
        </div>
        ${s.html}
        <label class="reviewed noprint"><input type="checkbox" data-rev="${ch.id}/${s.id}" ${G.state.rev[ch.id + "/" + s.id] ? "checked" : ""}> I can explain this without looking</label>
      </section>`).join("");
    return `
      <header class="ch-head">
        <div class="ch-num" aria-hidden="true">${ch.num}</div>
        <div><p class="soft small" style="margin:0 0 .3rem">Chapter ${ch.num}, BoK ${ch.bok}, handbook pages ${ch.pages}</p><h1>${ch.title}</h1></div>
        <p class="lede">${ch.lede}</p>
      </header>
      <div class="legend small" aria-hidden="true">${["Remember", "Understand", "Apply", "Analyze"].filter((l) => secs.some((x) => x.level === l)).map((l) => `<span><i class="dot lvdot lv-${l}" style="width:10px;height:10px;border-radius:50%;display:inline-block"></i>${l}</span>`).join("")}<span><b>HY</b> high yield</span></div>
      <ul class="toc">${toc}<li><a href="#/${ch.id}/check"><span class="lvdot" style="background:var(--ink)"></span><span class="tl">Blind check (${ch.check.length} questions)</span></a></li></ul>
      ${body}
      <section class="check" id="${ch.id}-check" aria-labelledby="${ch.id}-check-h">
        <h2 id="${ch.id}-check-h">Blind check</h2>
        <p class="soft">Answer every question first. The key and the reasoning behind each wrong option appear only after you submit. For volume, drill the ${ch.drill || 22} Chapter ${ch.num} questions in <a href="../#/">Green Belt Drill</a>.</p>
        <div data-check="${ch.id}"></div>
      </section>
      <p class="foot">Study notes written in plain language from the ASQ CSSGB Handbook chapter and the 2022 CSSGB Body of Knowledge. Page numbers match your handbook copy.</p>`;
  }

  /* ---------- blind check engine ---------- */
  G.mountCheck = (root, chId, qs) => {
    const answers = new Array(qs.length).fill(null);
    let submitted = false;
    function draw() {
      root.innerHTML = `
        <form class="qs" novalidate>
          ${qs.map((q, i) => `
            <fieldset class="q" style="border:0;padding:0;margin:1.25rem 0">
              <legend class="q-stem"><span class="qn">${i + 1}</span><span>${q.q}</span></legend>
              <div class="q-opts">
                ${q.o.map((o, j) => {
                  let cls = "";
                  if (submitted) { if (j === q.a) cls = "is-right"; else if (answers[i] === j) cls = "is-wrong"; }
                  return `<label class="q-opt ${cls}"><span class="L">${G.LETTERS[j]}</span><input type="radio" name="${chId}-q${i}" value="${j}" ${answers[i] === j ? "checked" : ""} ${submitted ? "disabled" : ""}><span>${o}</span></label>`;
                }).join("")}
              </div>
            </fieldset>`).join("")}
        </form>
        <div class="check-bar noprint">
          ${submitted ? '<button class="btn" type="button" data-act="reset">Clear and retake</button>' : '<button class="btn primary" type="button" data-act="submit">Submit answers</button>'}
          <span class="count soft small" aria-live="polite"></span>
        </div>
        <div class="key" aria-live="polite"></div>`;
      const count = G.$(".count", root);
      const upd = () => { const n = answers.filter((a) => a !== null).length; count.textContent = submitted ? "" : `${n} of ${qs.length} answered`; };
      upd();
      G.$$("input[type=radio]", root).forEach((inp) => inp.addEventListener("change", () => {
        const i = +inp.name.split("-q")[1]; answers[i] = +inp.value; upd();
      }));
      const sub = G.$('[data-act="submit"]', root);
      if (sub) sub.addEventListener("click", () => {
        const n = answers.filter((a) => a !== null).length;
        if (n < qs.length) { count.textContent = `Answer all ${qs.length} first — ${qs.length - n} left. (The real exam has no penalty for guessing, so practise committing.)`; return; }
        submitted = true;
        const score = qs.reduce((s, q, i) => s + (answers[i] === q.a ? 1 : 0), 0);
        G.state.best[chId] = Math.max(G.state.best[chId] || 0, score); G.persist(); drawTabs(chId);
        draw();
        renderKey(score);
      });
      const rst = G.$('[data-act="reset"]', root);
      if (rst) rst.addEventListener("click", () => { submitted = false; answers.fill(null); draw(); });
      if (submitted) renderKey(qs.reduce((s, q, i) => s + (answers[i] === q.a ? 1 : 0), 0));
    }
    function renderKey(score) {
      const pct = Math.round((score / qs.length) * 100);
      G.$(".key", root).innerHTML = `
        <hr>
        <p class="score">${score} / ${qs.length} <span class="soft" style="font-size:1rem">(${pct}%)</span></p>
        <h3>Answer key and psychometric breakdown</h3>
        ${qs.map((q, i) => `
          <div class="key-item">
            <h4>${i + 1}. ${G.LETTERS[q.a]} ${answers[i] === q.a ? '<span style="color:var(--belt-deep)">— you got it</span>' : `<span style="color:var(--ooc)">— you chose ${G.LETTERS[answers[i]]}</span>`}</h4>
            <p>${q.why}</p>
            <ul class="small">${q.o.map((o, j) => (j === q.a ? "" : `<li><b>${G.LETTERS[j]}.</b> ${q.d[j] || ""}</li>`)).join("")}</ul>
            ${q.ref ? `<p class="soft small" style="margin:.3rem 0 0">Handbook p. ${q.ref}</p>` : ""}
          </div>`).join("")}`;
    }
    draw();
  };

  /* ---------- mount widgets after render ---------- */
  G.mountAll = (root) => {
    G.$$("[data-w]", root).forEach((el) => {
      const f = G.W[el.dataset.w];
      if (f) { try { f(el); } catch (e) { el.innerHTML = `<p class="feedback bad">This tool failed to load: ${G.esc(e.message)}</p>`; console.error(e); } }
      else el.innerHTML = `<p class="feedback bad">Missing tool: ${G.esc(el.dataset.w)}</p>`;
    });
    G.$$("[data-check]", root).forEach((el) => { const ch = G.chapters[el.dataset.check]; G.mountCheck(el, ch.id, ch.check); });
    G.$$("[data-rev]", root).forEach((el) => el.addEventListener("change", () => { G.state.rev[el.dataset.rev] = el.checked; G.persist(); }));
  };

  /* ---------- router ---------- */
  function route() {
    const parts = location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
    const id = parts[0] || "home";
    const sec = parts[1];
    const sheet = G.$("#sheet");
    let html, title;
    if (G.chapters[id]) { html = renderChapter(G.chapters[id]); title = `Ch ${G.chapters[id].num} ${G.chapters[id].title}`; }
    else if (G.pages[id]) { html = G.pages[id].render(); title = G.pages[id].title; }
    else { html = G.pages.home.render(); title = G.pages.home.title; }
    const key = G.chapters[id] || G.pages[id] ? id : "home";
    if (sheet.dataset.view !== key) {
      sheet.dataset.view = key;
      document.documentElement.style.setProperty("--acc", `var(${G.colorOf(key)})`);
      sheet.innerHTML = html;
      G.mountAll(sheet);
      if (G.pages[key] && G.pages[key].after) G.pages[key].after(sheet);
      drawTabs(key);
      document.title = `${title} | CSSGB, visually`;
      if (!sec) { window.scrollTo(0, 0); sheet.focus({ preventScroll: true }); }
    }
    if (sec) {
      const target = document.getElementById(`${key}-${sec}`);
      if (target) requestAnimationFrame(() => target.scrollIntoView({ block: "start" }));
    }
  }
  G.boot = () => { window.addEventListener("hashchange", route); route(); };
})();
