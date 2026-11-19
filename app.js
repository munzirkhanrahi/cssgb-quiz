(() => {
  "use strict";

  const BANK = window.QUESTION_BANK;
  const app = document.getElementById("app");
  if (!BANK || !app) return;

  const QUESTIONS = BANK.questions;
  const BY_ID = new Map(QUESTIONS.map((q) => [q.id, q]));
  const CHAPTERS = BANK.chapters;
  const LETTERS = ["A", "B", "C", "D"];
  const STORE_KEY = "gbdrill.v1";
  const RECENT_MAX = 300;

  const DEFAULTS = {
    saved: [],
    history: {}, // id -> { s: times seen, c: times correct, l: last result 1/0 }
    recent: [], // last answers across sessions, 1 = correct, 0 = missed
    selected: [],
    settings: { shuffleQ: true, shuffleOpts: true, target: 75, mixedSize: 25 },
    session: null,
  };

  /* ---------------- storage ---------------- */
  let storageOk = true;
  const clone = (o) => JSON.parse(JSON.stringify(o));

  function load() {
    const base = clone(DEFAULTS);
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (!raw) return base;
      const s = JSON.parse(raw);
      return {
        saved: Array.isArray(s.saved) ? s.saved.filter((id) => BY_ID.has(id)) : [],
        history: s.history && typeof s.history === "object" ? s.history : {},
        recent: Array.isArray(s.recent) ? s.recent.slice(-RECENT_MAX) : [],
        selected: Array.isArray(s.selected) ? s.selected : [],
        settings: Object.assign(base.settings, s.settings || {}),
        session: validSession(s.session) ? s.session : null,
      };
    } catch (e) {
      storageOk = false;
      return base;
    }
  }

  function validSession(s) {
    return s && Array.isArray(s.ids) && s.ids.length && s.ids.every((id) => BY_ID.has(id)) && s.perm && s.picks;
  }

  let state = load();

  function persist() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(state));
    } catch (e) {
      if (storageOk) toast("This browser isn't keeping your progress (private mode?). Use Backup before closing.");
      storageOk = false;
    }
  }

  /* ---------------- helpers ---------------- */
  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  const chapterTitle = (n) => (CHAPTERS.find((c) => c.n === n) || {}).title || "";
  const isSaved = (id) => state.saved.includes(id);
  const pct = (a, b) => (b ? Math.round((100 * a) / b) : 0);
  const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;

  let toastTimer;
  function toast(msg) {
    let el = document.querySelector(".toast");
    if (!el) {
      el = document.createElement("div");
      el.className = "toast";
      el.setAttribute("role", "status");
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 2600);
  }

  const ICON_SAVE = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h12v18l-6-4.5L6 21z" fill="currentColor"/></svg>`;
  const ICON_UNSAVED = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h12v18l-6-4.5L6 21z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>`;
  const LOGO = `<svg viewBox="0 0 44 44" aria-hidden="true"><rect x="1" y="1" width="42" height="42" rx="9" fill="#2E7D4F"/><path d="M6 15h32M6 29h32" stroke="#E1EFE6" stroke-width="1.5" stroke-dasharray="3 3"/><polyline points="7,24 13,19 19,23 25,17 31,21 37,12" fill="none" stroke="#fff" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/><circle cx="37" cy="12" r="3.2" fill="#fff" stroke="#B83A26" stroke-width="2"/></svg>`;

  /* ---------------- run chart ---------------- */
  function runChart(results, { height = 120, label = "Running accuracy" } = {}) {
    const W = 600, H = height, padL = 38, padR = 8, padT = 10, padB = 10;
    const target = Math.min(100, Math.max(0, Number(state.settings.target) || 0));
    const y = (v) => padT + (H - padT - padB) * (1 - v / 100);
    const n = results.length;
    let body = "";
    body += `<line class="axis" x1="${padL}" y1="${y(100)}" x2="${W - padR}" y2="${y(100)}"/>`;
    body += `<line class="axis" x1="${padL}" y1="${y(0)}" x2="${W - padR}" y2="${y(0)}"/>`;
    body += `<text class="target-label" x="0" y="${y(100) + 4}" style="fill:var(--ink-soft)">100%</text>`;
    body += `<text class="target-label" x="0" y="${y(0) + 4}" style="fill:var(--ink-soft)">0%</text>`;
    if (target > 0) {
      body += `<line class="target" x1="${padL}" y1="${y(target)}" x2="${W - padR}" y2="${y(target)}"/>`;
      if (target < 92 && target > 8) body += `<text class="target-label" x="0" y="${y(target) + 4}">${target}%</text>`;
    }
    let aria = `${label}: no answers yet`;
    if (n === 0) {
      body += `<text class="empty" x="${(W + padL) / 2}" y="${H / 2 + 4}" text-anchor="middle">Answer a question and your run chart starts here</text>`;
    } else {
      let ok = 0;
      const pts = results.map((r, i) => {
        ok += r;
        const x = n === 1 ? (padL + W - padR) / 2 : padL + 6 + ((W - padR - padL - 12) * i) / (n - 1);
        return { x, y: y((100 * ok) / (i + 1)), r };
      });
      body += `<polyline class="line" points="${pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ")}"/>`;
      const rad = n > 120 ? 2.2 : n > 60 ? 3 : 4;
      body += pts.map((p) => `<circle class="${p.r ? "pt-ok" : "pt-miss"}" cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${rad}"/>`).join("");
      aria = `${label}: ${pct(ok, n)}% after ${plural(n, "answer")}`;
    }
    return `<svg class="runchart" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" style="height:${H}px" role="img" aria-label="${esc(aria)}">${body}</svg>`;
  }

  const chartKey = () =>
    `<div class="chart-key" aria-hidden="true"><span class="k-ok">Right</span><span class="k-miss">Missed</span><span class="k-target">Your target</span></div>`;

  /* ---------------- sessions ---------------- */
  function startSession(title, ids, { keepOrder = false } = {}) {
    if (!ids.length) {
      toast("There are no questions in that set yet.");
      return;
    }
    const order = ids.slice();
    if (state.settings.shuffleQ && !keepOrder) shuffle(order);
    const perm = {};
    for (const id of order) perm[id] = state.settings.shuffleOpts ? shuffle([0, 1, 2, 3]) : [0, 1, 2, 3];
    state.session = { title, ids: order, perm, picks: {}, i: 0, done: false };
    persist();
    go("quiz");
  }

  function sessionResults(s) {
    return s.ids.filter((id) => id in s.picks).map((id) => (s.picks[id] === BY_ID.get(id).a ? 1 : 0));
  }

  function answer(displayIdx) {
    const s = state.session;
    if (!s) return;
    const id = s.ids[s.i];
    if (id in s.picks) return;
    const q = BY_ID.get(id);
    const orig = s.perm[id][displayIdx];
    s.picks[id] = orig;
    const right = orig === q.a ? 1 : 0;
    const h = state.history[id] || { s: 0, c: 0, l: null };
    h.s += 1;
    h.c += right;
    h.l = right;
    state.history[id] = h;
    state.recent.push(right);
    if (state.recent.length > RECENT_MAX) state.recent = state.recent.slice(-RECENT_MAX);
    persist();
    renderQuiz({ justAnswered: true });
  }

  function next() {
    const s = state.session;
    if (!s) return;
    if (s.i < s.ids.length - 1) {
      s.i += 1;
      persist();
      renderQuiz();
      window.scrollTo(0, 0);
    } else {
      s.done = true;
      persist();
      go("results");
    }
  }

  function toggleSave(id) {
    if (isSaved(id)) {
      state.saved = state.saved.filter((x) => x !== id);
      toast("Removed from saved");
    } else {
      state.saved.push(id);
      toast("Saved for later");
    }
    persist();
  }

  /* ---------------- routing ---------------- */
  function go(view) {
    const h = "#/" + (view === "home" ? "" : view);
    if (location.hash !== h) location.hash = h;
    else route();
  }

  function route() {
    const view = location.hash.replace(/^#\/?/, "") || "home";
    if (view === "quiz" && state.session && !state.session.done) renderQuiz();
    else if (view === "results" && state.session) renderResults();
    else if (view === "saved") renderSaved();
    else renderHome();
    window.scrollTo(0, 0);
  }
  window.addEventListener("hashchange", route);

  /* ---------------- views ---------------- */
  function renderHome() {
    const missedIds = QUESTIONS.filter((q) => state.history[q.id] && state.history[q.id].l === 0).map((q) => q.id);
    const recent = state.recent.slice(-60);
    const recentOk = recent.reduce((a, b) => a + b, 0);
    const answeredAll = QUESTIONS.filter((q) => state.history[q.id]).length;
    const sel = new Set(state.selected);
    const selCount = QUESTIONS.filter((q) => sel.has(q.ch)).length;
    const s = state.session;
    const resumable = s && !s.done;

    const chapterRows = CHAPTERS.map((c) => {
      const qs = QUESTIONS.filter((q) => q.ch === c.n);
      let ans = 0, ok = 0, miss = 0;
      for (const q of qs) {
        const h = state.history[q.id];
        if (!h) continue;
        ans++;
        if (h.l === 1) ok++;
        else if (h.l === 0) miss++;
      }
      const meta = ans
        ? `${ans} of ${qs.length} answered, ${pct(ok, ans)}% right on last try`
        : `${qs.length} questions, not started`;
      return `<li><label class="chapter">
          <input type="checkbox" data-ch="${c.n}" ${sel.has(c.n) ? "checked" : ""}>
          <span class="num">${c.n}</span>
          <span class="title">${esc(c.title)}<span class="meta">${meta}</span></span>
          <span class="bar" aria-hidden="true"><i class="b-ok" style="width:${(100 * ok) / qs.length}%"></i><i class="b-miss" style="width:${(100 * miss) / qs.length}%"></i></span>
        </label></li>`;
    }).join("");

    app.innerHTML = `
      <header class="masthead">
        <div class="brand">${LOGO}<div><h1>Green Belt Drill</h1><p>${QUESTIONS.length} CSSGB practice questions across ${CHAPTERS.length} chapters</p></div></div>
        <div class="backup">
          <button class="btn quiet small" data-act="backup" title="Download your saved questions and progress">Backup</button>
          <button class="btn quiet small" data-act="restore" title="Load a backup file">Restore</button>
        </div>
      </header>

      ${resumable ? `<section class="resume" aria-label="Unfinished quiz">
          <p><b>${esc(s.title)}</b><br>Question ${s.i + 1} of ${s.ids.length}, ${sessionResults(s).reduce((a, b) => a + b, 0)} right so far</p>
          <button class="btn primary" data-act="resume">Resume quiz</button>
        </section>` : ""}

      <section class="chart-wrap" aria-label="Recent accuracy">
        <div class="chart-head">
          <h2>Your last ${recent.length ? plural(recent.length, "answer") : "answers"}</h2>
          ${recent.length ? `<span><span class="big">${pct(recentOk, recent.length)}%</span> <span class="muted">right, ${answeredAll} of ${QUESTIONS.length} questions tried</span></span>` : ""}
        </div>
        ${runChart(recent)}
        ${chartKey()}
      </section>

      <nav class="quick" aria-label="Quick start">
        <button class="btn primary" data-act="mixed"><b>Mixed ${state.settings.mixedSize}</b><small>Random from all chapters</small></button>
        <button class="btn" data-act="saved"><b>Saved ${state.saved.length}</b><small>Review or practice</small></button>
        <button class="btn" data-act="missed" ${missedIds.length ? "" : "disabled"}><b>Missed ${missedIds.length}</b><small>Wrong on last try</small></button>
      </nav>

      <div class="section-head">
        <h2>Chapters</h2>
        <div><button class="linkish" data-act="sel-all">Select all</button><button class="linkish" data-act="sel-none">Clear</button></div>
      </div>
      <ul class="chapters">${chapterRows}</ul>

      <section class="options-panel" aria-label="Quiz options">
        <h3>Quiz options</h3>
        <label class="toggle"><input type="checkbox" data-set="shuffleQ" ${state.settings.shuffleQ ? "checked" : ""}>
          <span>Shuffle question order<small>Off keeps the PDF's order within each chapter.</small></span></label>
        <label class="toggle"><input type="checkbox" data-set="shuffleOpts" ${state.settings.shuffleOpts ? "checked" : ""}>
          <span>Shuffle the A–D choices<small>In the PDF, B is the right answer 56% of the time. Shuffling stops you learning the letter instead of the concept.</small></span></label>
        <div class="field"><label for="target">Target score</label><input id="target" type="number" min="0" max="100" step="1" data-set="target" value="${esc(state.settings.target)}"> <span>%</span></div>
        <div class="field"><label for="mixed">Mixed quiz size</label>
          <select id="mixed" data-set="mixedSize">${[10, 25, 50, 100].map((n) => `<option ${Number(state.settings.mixedSize) === n ? "selected" : ""}>${n}</option>`).join("")}</select></div>
      </section>

      <p class="footnote">Progress and saved questions stay in this browser. To move them to another device, use Backup here and Restore there.</p>

      <div class="startbar"><div class="inner">
        <p>${sel.size ? `${plural(sel.size, "chapter")} selected, ${selCount} questions` : "Tick chapters to practice them"}</p>
        <button class="btn primary" data-act="start" ${sel.size ? "" : "disabled"}>Start quiz</button>
      </div></div>`;
  }

  function explanationHtml(paras) {
    return paras
      .map((p) => {
        const m = p.match(/^(Distractor DNA|Distractor logic|DNA trap|DNA mimicry|DNA|Ref|Reference|References)\s*:\s*/);
        if (!m) return `<p>${esc(p)}</p>`;
        const isRef = /^Ref/.test(m[1]);
        const label = isRef ? "Source" : "Traps";
        return `<p class="${isRef ? "ref" : ""}"><span class="lbl">${label}:</span> ${esc(p.slice(m[0].length))}</p>`;
      })
      .join("");
  }

  function renderQuiz({ justAnswered = false } = {}) {
    const s = state.session;
    if (!s) return go("home");
    const id = s.ids[s.i];
    const q = BY_ID.get(id);
    const perm = s.perm[id];
    const picked = id in s.picks ? s.picks[id] : null;
    const answered = picked !== null;
    const shuffled = perm.some((v, i) => v !== i);
    const results = sessionResults(s);
    const ok = results.reduce((a, b) => a + b, 0);
    const last = s.i === s.ids.length - 1;
    const saved = isSaved(id);

    const choices = perm.map((orig, d) => {
      let cls = "choice";
      if (answered && orig === q.a) cls += " is-right";
      else if (answered && orig === picked) cls += " is-wrong";
      return `<li><button class="${cls}" data-act="answer" data-i="${d}" ${answered ? "disabled" : ""} aria-label="${LETTERS[d]}: ${esc(q.o[orig])}${answered && orig === q.a ? " (correct answer)" : ""}${answered && orig === picked && orig !== q.a ? " (your answer)" : ""}">
          <span class="key">${LETTERS[d]}</span><span>${esc(q.o[orig])}</span>${answered && shuffled ? `<span class="orig">was ${LETTERS[orig]}</span>` : ""}
        </button></li>`;
    }).join("");

    let verdict = "";
    if (answered) {
      const right = picked === q.a;
      const shownLetter = LETTERS[perm.indexOf(q.a)];
      verdict = `<section class="verdict ${right ? "ok" : "miss"}" aria-live="polite">
          <h3>${right ? "Correct" : `Not quite. The answer is ${shownLetter}.`}</h3>
          ${explanationHtml(q.x)}
          ${shuffled ? `<p class="note">Letters inside the explanation follow the PDF's original order, shown as "was …" on each choice.</p>` : ""}
        </section>`;
    }

    const ctx = (q.ctx || [])
      .map((c) => `<div class="context"><b>From question ${c.n}</b>${esc(c.q)}</div>`)
      .join("");

    app.innerHTML = `
      <div class="quizbar">
        <button class="btn quiet small" data-act="home">Chapters</button>
        <span class="where">${esc(s.title)}</span>
        <button class="btn small save-btn" data-act="save" aria-pressed="${saved}">${saved ? ICON_SAVE : ICON_UNSAVED}<span>${saved ? "Saved" : "Save"}</span></button>
      </div>
      <div class="progress" aria-hidden="true"><i style="width:${(100 * (s.i + (answered ? 1 : 0))) / s.ids.length}%"></i></div>

      <article class="qsheet ${justAnswered ? "pop" : ""}" aria-labelledby="stem">
        <div class="qnum"><strong>${s.i + 1}</strong><span>of ${s.ids.length}. Chapter ${q.ch}, question ${q.n}: ${esc(chapterTitle(q.ch))}</span></div>
        ${ctx}
        <p class="stem" id="stem" tabindex="-1">${esc(q.q)}</p>
        <ul class="choices">${choices}</ul>
        ${verdict}
        <p class="keys-hint">Keys: <kbd>A</kbd>–<kbd>D</kbd> or <kbd>1</kbd>–<kbd>4</kbd> to answer, <kbd>Enter</kbd> for next, <kbd>S</kbd> to save.</p>
      </article>

      <div class="nextbar"><div class="inner">
        <span class="score">${ok} of ${results.length} right</span>
        ${answered
          ? `<button class="btn primary" data-act="next">${last ? "See results" : "Next question"}</button>`
          : `<button class="btn quiet" data-act="next">${last ? "Skip and finish" : "Skip"}</button>`}
      </div></div>`;

    if (justAnswered) {
      const v = app.querySelector(".verdict");
      if (v && v.getBoundingClientRect().top > window.innerHeight - 140) {
        v.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
      }
      const nb = app.querySelector('.nextbar [data-act="next"]');
      if (nb) nb.focus({ preventScroll: true });
    } else {
      const stem = document.getElementById("stem");
      if (stem) stem.focus({ preventScroll: true });
    }
  }

  function reviewItem(id, { showUnsave = false } = {}) {
    const q = BY_ID.get(id);
    return `<li><details>
        <summary><span class="tag">Ch ${q.ch}, Q${q.n}</span><span>${esc(q.q)}</span></summary>
        <div class="body">
          ${(q.ctx || []).map((c) => `<div class="context"><b>From question ${c.n}</b>${esc(c.q)}</div>`).join("")}
          <ol>${q.o.map((o, i) => `<li class="${i === q.a ? "right" : ""}">${esc(o)}${i === q.a ? " (answer)" : ""}</li>`).join("")}</ol>
          <div class="verdict" style="margin-top:0;border-top:0;padding-top:0">${explanationHtml(q.x)}</div>
          ${showUnsave ? `<button class="btn small quiet" data-act="unsave" data-id="${id}">Remove from saved</button>` : ""}
        </div>
      </details></li>`;
  }

  function renderResults() {
    const s = state.session;
    if (!s) return go("home");
    const results = sessionResults(s);
    const ok = results.reduce((a, b) => a + b, 0);
    const missed = s.ids.filter((id) => id in s.picks && s.picks[id] !== BY_ID.get(id).a);
    const skipped = s.ids.length - results.length;
    const p = pct(ok, results.length);
    const target = Number(state.settings.target) || 0;

    app.innerHTML = `
      <div class="quizbar"><button class="btn quiet small" data-act="home">Chapters</button><span class="where">${esc(s.title)}</span><span></span></div>
      <header class="result-head">
        <h2>${ok} / ${results.length}</h2>
        <p>${results.length ? `${p}% right${target ? (p >= target ? `, at or above your ${target}% target` : `, below your ${target}% target`) : ""}.` : "No questions answered."}${skipped ? ` ${plural(skipped, "question")} skipped.` : ""}</p>
      </header>
      <section class="chart-wrap" aria-label="This quiz">
        <div class="chart-head"><h2>This quiz</h2></div>
        ${runChart(results)}
        ${chartKey()}
      </section>
      <div class="actions">
        ${missed.length ? `<button class="btn primary" data-act="retry-missed">Practice the ${missed.length} you missed</button>` : ""}
        <button class="btn" data-act="restart">Start this set again</button>
        <button class="btn quiet" data-act="home">Back to chapters</button>
      </div>
      ${missed.length ? `<div class="section-head"><h2>Missed in this quiz</h2></div><ul class="saved-list">${missed.map((id) => reviewItem(id)).join("")}</ul>` : ""}`;
  }

  function renderSaved() {
    const ids = state.saved.filter((id) => BY_ID.has(id));
    const sorted = ids.slice().sort((a, b) => {
      const qa = BY_ID.get(a), qb = BY_ID.get(b);
      return qa.ch - qb.ch || qa.n - qb.n;
    });
    app.innerHTML = `
      <div class="quizbar"><button class="btn quiet small" data-act="home">Chapters</button><span class="where">Saved questions</span><span></span></div>
      <div class="section-head"><h2>Saved questions (${ids.length})</h2></div>
      ${ids.length
        ? `<div class="actions"><button class="btn primary" data-act="practice-saved">Practice saved questions</button></div>
           <ul class="saved-list">${sorted.map((id) => reviewItem(id, { showUnsave: true })).join("")}</ul>`
        : `<div class="empty-state"><h3>Nothing saved yet</h3><p>During a quiz, press Save (or the <kbd>S</kbd> key) on any question you want to come back to. It will show up here.</p>
           <button class="btn primary" data-act="home">Pick chapters</button></div>`}`;
  }

  /* ---------------- backup / restore ---------------- */
  function backup() {
    const data = {
      app: "green-belt-drill",
      version: 1,
      exported: new Date().toISOString(),
      saved: state.saved,
      history: state.history,
      recent: state.recent,
      settings: state.settings,
    };
    const blob = new Blob([JSON.stringify(data, null, 1)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `green-belt-drill-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      URL.revokeObjectURL(a.href);
      a.remove();
    }, 500);
    toast("Backup downloaded");
  }

  const restoreInput = document.getElementById("restore-file");
  restoreInput.addEventListener("change", async () => {
    const file = restoreInput.files && restoreInput.files[0];
    restoreInput.value = "";
    if (!file) return;
    try {
      const data = JSON.parse(await file.text());
      if (data.app !== "green-belt-drill") throw new Error("not ours");
      const savedIn = (data.saved || []).filter((id) => BY_ID.has(id));
      state.saved = Array.from(new Set([...state.saved, ...savedIn]));
      for (const [id, h] of Object.entries(data.history || {})) {
        if (!BY_ID.has(id) || !h || typeof h.s !== "number") continue;
        const mine = state.history[id];
        if (!mine || h.s > mine.s) state.history[id] = { s: h.s, c: Number(h.c) || 0, l: h.l === 1 ? 1 : h.l === 0 ? 0 : null };
      }
      if (Array.isArray(data.recent) && data.recent.length > state.recent.length) {
        state.recent = data.recent.filter((r) => r === 0 || r === 1).slice(-RECENT_MAX);
      }
      persist();
      toast(`Restored. ${plural(state.saved.length, "saved question")}.`);
      route();
    } catch (e) {
      toast("That file isn't a Green Belt Drill backup. Choose the .json file made by Backup.");
    }
  });

  /* ---------------- events ---------------- */
  app.addEventListener("click", (e) => {
    const t = e.target.closest("[data-act]");
    if (!t || t.disabled) return;
    const act = t.dataset.act;
    const s = state.session;
    switch (act) {
      case "answer": answer(Number(t.dataset.i)); break;
      case "next": next(); break;
      case "save":
        if (s) { toggleSave(s.ids[s.i]); renderQuiz(); }
        break;
      case "unsave": toggleSave(t.dataset.id); renderSaved(); break;
      case "home": go("home"); break;
      case "resume": go("quiz"); break;
      case "saved": go("saved"); break;
      case "practice-saved": startSession("Saved questions", state.saved.slice()); break;
      case "missed":
        startSession("Missed questions", QUESTIONS.filter((q) => state.history[q.id] && state.history[q.id].l === 0).map((q) => q.id));
        break;
      case "mixed": {
        const size = Number(state.settings.mixedSize) || 25;
        const ids = shuffle(QUESTIONS.map((q) => q.id)).slice(0, size);
        startSession(`Mixed set of ${ids.length}`, ids);
        break;
      }
      case "start": {
        const sel = new Set(state.selected);
        const ids = QUESTIONS.filter((q) => sel.has(q.ch)).map((q) => q.id);
        const chs = CHAPTERS.filter((c) => sel.has(c.n));
        const title = chs.length === 1 ? `Chapter ${chs[0].n}: ${chs[0].title}` : `${chs.length} chapters`;
        startSession(title, ids);
        break;
      }
      case "sel-all": state.selected = CHAPTERS.map((c) => c.n); persist(); renderHome(); break;
      case "sel-none": state.selected = []; persist(); renderHome(); break;
      case "retry-missed":
        if (s) startSession("Missed in last quiz", s.ids.filter((id) => id in s.picks && s.picks[id] !== BY_ID.get(id).a));
        break;
      case "restart":
        if (s) startSession(s.title, s.ids.slice());
        break;
      case "backup": backup(); break;
      case "restore": restoreInput.click(); break;
    }
  });

  app.addEventListener("change", (e) => {
    const t = e.target;
    if (t.dataset.ch) {
      const n = Number(t.dataset.ch);
      const sel = new Set(state.selected);
      t.checked ? sel.add(n) : sel.delete(n);
      state.selected = CHAPTERS.map((c) => c.n).filter((c) => sel.has(c));
      persist();
      const y = window.scrollY;
      renderHome();
      window.scrollTo(0, y);
      const again = app.querySelector(`input[data-ch="${n}"]`);
      if (again) again.focus({ preventScroll: true });
    } else if (t.dataset.set) {
      const key = t.dataset.set;
      if (t.type === "checkbox") state.settings[key] = t.checked;
      else if (key === "target") state.settings.target = Math.min(100, Math.max(0, Math.round(Number(t.value) || 0)));
      else state.settings[key] = Number(t.value);
      persist();
      const y = window.scrollY;
      renderHome();
      window.scrollTo(0, y);
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (/^(INPUT|SELECT|TEXTAREA)$/.test(e.target.tagName)) return;
    const view = location.hash.replace(/^#\/?/, "") || "home";
    const s = state.session;
    if (view !== "quiz" || !s || s.done) return;
    const id = s.ids[s.i];
    const answered = id in s.picks;
    const k = e.key.toLowerCase();
    const idx = ["a", "b", "c", "d"].indexOf(k) >= 0 ? ["a", "b", "c", "d"].indexOf(k) : ["1", "2", "3", "4"].indexOf(k);
    if (idx >= 0 && !answered) {
      e.preventDefault();
      answer(idx);
    } else if ((k === "enter" || k === "arrowright" || k === "n") && answered) {
      if (k === "enter" && e.target.closest && e.target.closest("button") && !e.target.closest('[data-act="answer"]')) return;
      e.preventDefault();
      next();
    } else if (k === "s") {
      e.preventDefault();
      toggleSave(id);
      renderQuiz();
    }
  });

  route();
})();
