/* Drill — the practice-question bank inside CSSGB Prep (formerly the Green Belt Drill app).
   It owns the one progress record for the whole site: every drill answer, saved questions,
   settings, the quiz in progress, and the study-page progress (topics marked reviewed and
   best blind-check scores). The record lives in this browser and, once sync is on, in a
   secret gist in the user's GitHub account. The site shell (core.js) calls Drill.show(). */
(() => {
  "use strict";

  const BANK = window.QUESTION_BANK;
  let app = null; // the drill view's container; the shell re-creates it on each visit
  if (!BANK) return;

  const QUESTIONS = BANK.questions;
  const BY_ID = new Map(QUESTIONS.map((q) => [q.id, q]));
  const CHAPTERS = BANK.chapters;
  const CH_NUMS = new Set(CHAPTERS.map((c) => c.n));
  const LETTERS = ["A", "B", "C", "D"];
  const STORE_KEY = "gbdrill.v1";
  const SYNC_KEY = "gbdrill.sync";
  const GIST_FILE = "green-belt-drill.json";
  const ATTEMPTS_MAX = 20000;
  const DEFAULT_SETTINGS = { shuffleQ: true, shuffleOpts: true, target: 75, mixedSize: 25 };

  /* =====================================================================
     Data model (everything is kept; nothing is thrown away)
       attempts:  [[time, questionId, pickedOriginalIndex], ...]  every answer ever given
       saved:     { questionId: { v: 1 | 0, t: time } }           1 = saved, 0 = removed
       settings + settingsT, selected + selectedT                 last change wins
       session:   the current quiz, with t = last change          resumes on any device
       learn:     study pages: rev { "ch10/maps": { v, t } }      last change wins per topic
                               best { ch10: 6 }                   highest blind-check score wins
     ===================================================================== */
  const blank = () => ({
    v: 2,
    attempts: [],
    saved: {},
    settings: Object.assign({}, DEFAULT_SETTINGS),
    settingsT: 0,
    selected: [],
    selectedT: 0,
    session: null,
    learn: { rev: {}, best: {} },
  });

  const num = (x) => (typeof x === "number" && isFinite(x) ? x : 0);

  function validSession(s) {
    return (
      s && typeof s === "object" && Array.isArray(s.ids) && s.ids.length > 0 &&
      s.ids.every((id) => BY_ID.has(id)) && s.perm && typeof s.perm === "object" &&
      s.picks && typeof s.picks === "object" &&
      s.ids.every((id) => Array.isArray(s.perm[id]) && s.perm[id].length === 4)
    );
  }

  function cleanSession(s, fallbackT) {
    if (!validSession(s)) return null;
    const picks = {};
    for (const [id, p] of Object.entries(s.picks)) if (BY_ID.has(id) && Number.isInteger(p) && p >= 0 && p <= 3) picks[id] = p;
    return {
      title: String(s.title || "Quiz"),
      ids: s.ids.slice(),
      perm: s.perm,
      picks,
      i: Math.min(Math.max(0, Number.isInteger(s.i) ? s.i : 0), s.ids.length - 1),
      done: !!s.done,
      t: num(s.t) || fallbackT,
    };
  }

  function cleanLearn(raw) {
    const out = { rev: {}, best: {} };
    if (!raw || typeof raw !== "object") return out;
    if (raw.rev && typeof raw.rev === "object" && !Array.isArray(raw.rev)) {
      for (const [k, r] of Object.entries(raw.rev)) {
        if (/^ch\d{1,2}\/[a-z0-9-]{1,40}$/.test(k) && r && (r.v === 0 || r.v === 1)) out.rev[k] = { v: r.v, t: num(r.t) };
      }
    }
    if (raw.best && typeof raw.best === "object" && !Array.isArray(raw.best)) {
      for (const [k, n] of Object.entries(raw.best)) {
        if (/^ch\d{1,2}$/.test(k) && Number.isInteger(n) && n >= 0 && n <= 100) out.best[k] = n;
      }
    }
    return out;
  }

  // Accepts current data, older (v1) data, backups and the synced file.
  function sanitize(raw) {
    const out = blank();
    if (!raw || typeof raw !== "object") return out;
    if (raw.data && typeof raw.data === "object" && (raw.app === "green-belt-drill")) raw = raw.data;

    const settingsIn = raw.settings && typeof raw.settings === "object" ? raw.settings : {};
    for (const k of Object.keys(DEFAULT_SETTINGS)) {
      if (typeof settingsIn[k] === typeof DEFAULT_SETTINGS[k]) out.settings[k] = settingsIn[k];
    }
    out.selected = Array.isArray(raw.selected) ? raw.selected.filter((n) => CH_NUMS.has(n)) : [];

    if (Array.isArray(raw.attempts)) {
      // v2
      out.attempts = raw.attempts
        .filter((a) => Array.isArray(a) && typeof a[0] === "number" && BY_ID.has(a[1]) && Number.isInteger(a[2]) && a[2] >= -1 && a[2] <= 3)
        .map((a) => [a[0], a[1], a[2]]);
      if (raw.saved && typeof raw.saved === "object" && !Array.isArray(raw.saved)) {
        for (const [id, r] of Object.entries(raw.saved)) {
          if (BY_ID.has(id) && r && (r.v === 0 || r.v === 1)) out.saved[id] = { v: r.v, t: num(r.t) };
        }
      }
      out.settingsT = num(raw.settingsT);
      out.selectedT = num(raw.selectedT);
      out.session = cleanSession(raw.session, 1);
    } else {
      // v1: saved was a list; history held counts. Rebuild an attempt log from the counts.
      let t = 1;
      if (Array.isArray(raw.saved)) for (const id of raw.saved) if (BY_ID.has(id)) out.saved[id] = { v: 1, t: 1 };
      const hist = raw.history && typeof raw.history === "object" ? raw.history : {};
      for (const [id, h] of Object.entries(hist)) {
        const q = BY_ID.get(id);
        if (!q || !h || typeof h.s !== "number") continue;
        const s = Math.max(0, Math.floor(h.s));
        const c = Math.min(s, Math.max(0, Math.floor(num(h.c))));
        const results = [];
        const lastOk = h.l === 1;
        // order so that the final attempt matches the recorded last result
        if (lastOk) { for (let k = 0; k < s - c; k++) results.push(0); for (let k = 0; k < c; k++) results.push(1); }
        else { for (let k = 0; k < c; k++) results.push(1); for (let k = 0; k < s - c; k++) results.push(0); }
        for (const r of results) out.attempts.push([t++, id, r ? q.a : -1]);
      }
      out.settingsT = 1;
      out.selectedT = 1;
      out.session = cleanSession(raw.session, 1);
    }
    out.learn = cleanLearn(raw.learn);
    out.attempts.sort((a, b) => a[0] - b[0]);
    if (out.attempts.length > ATTEMPTS_MAX) out.attempts = out.attempts.slice(-ATTEMPTS_MAX);
    return out;
  }

  // Combine two copies of the data without losing anything.
  function mergeStates(a, b) {
    const out = blank();
    const byKey = new Map();
    for (const x of a.attempts) byKey.set(x[0] + "|" + x[1], x);
    for (const x of b.attempts) if (!byKey.has(x[0] + "|" + x[1])) byKey.set(x[0] + "|" + x[1], x);
    out.attempts = Array.from(byKey.values()).sort((p, q) => p[0] - q[0]).slice(-ATTEMPTS_MAX);

    out.saved = Object.assign({}, a.saved);
    for (const [id, r] of Object.entries(b.saved)) if (!out.saved[id] || r.t > out.saved[id].t) out.saved[id] = r;

    const useB = (ta, tb) => tb > ta;
    if (useB(a.settingsT, b.settingsT)) { out.settings = Object.assign({}, b.settings); out.settingsT = b.settingsT; }
    else { out.settings = Object.assign({}, a.settings); out.settingsT = a.settingsT; }
    if (useB(a.selectedT, b.selectedT)) { out.selected = b.selected.slice(); out.selectedT = b.selectedT; }
    else { out.selected = a.selected.slice(); out.selectedT = a.selectedT; }

    if (!a.session) out.session = b.session;
    else if (!b.session) out.session = a.session;
    else out.session = b.session.t > a.session.t ? b.session : a.session;

    out.learn = { rev: Object.assign({}, a.learn.rev), best: Object.assign({}, a.learn.best) };
    for (const [k, r] of Object.entries(b.learn.rev)) if (!out.learn.rev[k] || r.t > out.learn.rev[k].t) out.learn.rev[k] = r;
    for (const [k, n] of Object.entries(b.learn.best)) if (n > (out.learn.best[k] || 0)) out.learn.best[k] = n;
    return out;
  }

  function signature(s) {
    let savedMax = 0;
    for (const r of Object.values(s.saved)) savedMax = Math.max(savedMax, r.t);
    const lastT = s.attempts.length ? s.attempts[s.attempts.length - 1][0] : 0;
    let revMax = 0, bestSum = 0;
    for (const r of Object.values(s.learn.rev)) revMax = Math.max(revMax, r.t);
    for (const n of Object.values(s.learn.best)) bestSum += n;
    return [s.attempts.length, lastT, Object.keys(s.saved).length, savedMax, s.settingsT, s.selectedT, s.session ? s.session.t : 0,
      Object.keys(s.learn.rev).length, revMax, Object.keys(s.learn.best).length, bestSum].join("|");
  }

  /* ---------------- local storage ---------------- */
  let storageOk = true;

  function readLocal() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      return raw ? sanitize(JSON.parse(raw)) : blank();
    } catch (e) {
      storageOk = false;
      return blank();
    }
  }

  let state = readLocal();
  let lastStamp = state.attempts.length ? state.attempts[state.attempts.length - 1][0] : 0;
  const now = () => (lastStamp = Math.max(Date.now(), lastStamp + 1));

  function writeLocal() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(state));
      storageOk = true;
    } catch (e) {
      if (storageOk) toast("This browser refused to store your progress. Turn on sync so nothing is lost.");
      storageOk = false;
    }
  }

  // Every change goes through here: store locally right away, then sync.
  function commit() {
    writeLocal();
    Sync.markDirty();
  }

  // Ask the browser not to clear this site's storage under pressure.
  try {
    if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});
  } catch (e) { /* ignore */ }

  // Another tab of this site changed the data: fold it in.
  window.addEventListener("storage", (e) => {
    if (e.key !== STORE_KEY || !e.newValue) return;
    try {
      const other = sanitize(JSON.parse(e.newValue));
      if (signature(other) === signature(state)) return;
      state = mergeStates(state, other);
      afterDataChange();
    } catch (err) { /* ignore */ }
  });

  /* ---------------- derived data ---------------- */
  let histCache = { key: "", map: {} };
  function historyMap() {
    const key = state.attempts.length + ":" + (state.attempts.length ? state.attempts[state.attempts.length - 1][0] : 0);
    if (histCache.key === key) return histCache.map;
    const m = {};
    for (const [, id, pick] of state.attempts) {
      const q = BY_ID.get(id);
      const ok = pick === q.a ? 1 : 0;
      const h = m[id] || (m[id] = { s: 0, c: 0, l: null });
      h.s++;
      h.c += ok;
      h.l = ok;
    }
    histCache = { key, map: m };
    return m;
  }
  const attemptOk = (a) => (a[2] === BY_ID.get(a[1]).a ? 1 : 0);
  const savedIds = () =>
    Object.entries(state.saved).filter(([, r]) => r.v === 1).sort((x, y) => x[1].t - y[1].t).map(([id]) => id);
  const isSaved = (id) => !!(state.saved[id] && state.saved[id].v === 1);

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
  const pct = (a, b) => (b ? Math.round((100 * a) / b) : 0);
  const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;
  const clock = (t) => new Date(t).toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

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
    toastTimer = setTimeout(() => el.classList.remove("show"), 3000);
  }

  const ICON_SAVE = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h12v18l-6-4.5L6 21z" fill="currentColor"/></svg>`;
  const ICON_UNSAVED = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h12v18l-6-4.5L6 21z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>`;
  const LOGO = `<svg viewBox="0 0 44 44" aria-hidden="true"><rect x="1" y="1" width="42" height="42" rx="9" fill="#2E7D4F"/><path d="M6 15h32M6 29h32" stroke="#E1EFE6" stroke-width="1.5" stroke-dasharray="3 3"/><polyline points="7,24 13,19 19,23 25,17 31,21 37,12" fill="none" stroke="#fff" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/><circle cx="37" cy="12" r="3.2" fill="#fff" stroke="#B83A26" stroke-width="2"/></svg>`;

  /* =====================================================================
     Sync to a private GitHub gist (single user, any device)
     ===================================================================== */
  const Sync = (() => {
    let cfg = {};
    try { cfg = JSON.parse(localStorage.getItem(SYNC_KEY) || "{}") || {}; } catch (e) { cfg = {}; }
    let status = cfg.token && cfg.gistId ? { s: "idle" } : { s: "off" };
    let timer = null;
    let running = null;
    let again = false;

    const saveCfg = () => { try { localStorage.setItem(SYNC_KEY, JSON.stringify(cfg)); } catch (e) { /* ignore */ } };
    const enabled = () => !!(cfg.token && cfg.gistId);

    function setStatus(s, msg) {
      status = { s, msg };
      paintChip();
    }

    async function api(path, opts = {}) {
      const headers = { Accept: "application/vnd.github+json", Authorization: "Bearer " + cfg.token };
      if (opts.body) headers["Content-Type"] = "application/json";
      const res = await fetch("https://api.github.com" + path, Object.assign({ cache: "no-store" }, opts, { headers }));
      if (!res.ok) {
        const err = new Error("GitHub said " + res.status);
        err.status = res.status;
        throw err;
      }
      return res.status === 204 ? null : res.json();
    }

    const payload = () =>
      JSON.stringify({ app: "green-belt-drill", v: 2, updated: new Date().toISOString(), data: state });

    async function readGist() {
      const g = await api("/gists/" + cfg.gistId);
      const f = g.files && g.files[GIST_FILE];
      if (!f) return blank();
      let text = f.content;
      if (f.truncated && f.raw_url) text = await (await fetch(f.raw_url, { cache: "no-store" })).text();
      try { return sanitize(JSON.parse(text)); } catch (e) { return blank(); }
    }

    async function writeGist() {
      await api("/gists/" + cfg.gistId, { method: "PATCH", body: JSON.stringify({ files: { [GIST_FILE]: { content: payload() } } }) });
    }

    // pull, merge, push if the cloud copy is missing anything
    async function syncOnce() {
      const remote = await readGist();
      const before = signature(state);
      const merged = mergeStates(state, remote);
      const changedHere = signature(merged) !== before;
      state = merged;
      writeLocal();
      if (signature(merged) !== signature(remote)) await writeGist();
      cfg.dirty = false;
      cfg.lastSync = Date.now();
      saveCfg();
      return changedHere;
    }

    async function run() {
      if (!enabled()) return;
      if (running) { again = true; return running; }
      if (!navigator.onLine) { setStatus("offline"); return; }
      setStatus("syncing");
      running = (async () => {
        try {
          const changedHere = await syncOnce();
          setStatus("ok");
          if (changedHere) afterDataChange();
        } catch (e) {
          handleError(e);
        } finally {
          running = null;
          if (again) { again = false; schedule(500); }
        }
      })();
      return running;
    }

    function handleError(e) {
      if (e.status === 401) setStatus("error", "GitHub rejected the token. It may have expired or been deleted. Paste a new one on the Sync screen.");
      else if (e.status === 404) setStatus("error", "The sync file was not found on GitHub (it may have been deleted). Turn sync off and on again to recreate it.");
      else if (e.status === 403 || e.status === 429) setStatus("error", "GitHub is limiting requests right now. Your progress is safe here and will sync later.");
      else if (!navigator.onLine) setStatus("offline");
      else setStatus("error", "Couldn't reach GitHub. Your progress is safe in this browser and will sync when it can.");
    }

    function schedule(ms = 2500) {
      if (!enabled()) return;
      clearTimeout(timer);
      timer = setTimeout(run, ms);
    }

    function markDirty() {
      if (!enabled()) return;
      cfg.dirty = true;
      saveCfg();
      if (status.s !== "syncing") setStatus("pending");
      schedule();
    }

    // Leaving the page: push straight away without waiting for the timer.
    function flush() {
      if (!enabled() || !cfg.dirty) return;
      clearTimeout(timer);
      const body = JSON.stringify({ files: { [GIST_FILE]: { content: payload() } } });
      try {
        fetch("https://api.github.com/gists/" + cfg.gistId, {
          method: "PATCH",
          keepalive: body.length < 60000,
          headers: { Accept: "application/vnd.github+json", Authorization: "Bearer " + cfg.token, "Content-Type": "application/json" },
          body,
        }).then((r) => { if (r.ok) { cfg.dirty = false; cfg.lastSync = Date.now(); saveCfg(); } }).catch(() => {});
      } catch (e) { /* the next visit will sync */ }
    }

    async function connect(token) {
      cfg = { token: token.trim() };
      setStatus("syncing");
      try {
        const user = await api("/user");
        cfg.login = user.login;
        // reuse the sync file if this account already has one (e.g. set up on another device)
        let found = null;
        for (let page = 1; page <= 10 && !found; page++) {
          const list = await api(`/gists?per_page=100&page=${page}`);
          found = list.find((g) => g.files && g.files[GIST_FILE]);
          if (list.length < 100) break;
        }
        if (found) {
          cfg.gistId = found.id;
        } else {
          const g = await api("/gists", {
            method: "POST",
            body: JSON.stringify({
              description: "CSSGB Prep progress (synced by the site; do not edit)",
              public: false,
              files: { [GIST_FILE]: { content: payload() } },
            }),
          });
          cfg.gistId = g.id;
        }
        cfg.gistUrl = found ? found.html_url : "https://gist.github.com/" + cfg.gistId;
        saveCfg();
        const changedHere = await syncOnce();
        setStatus("ok");
        if (changedHere) learnToG();
        return { ok: true, reused: !!found };
      } catch (e) {
        const msg =
          e.status === 401 ? "GitHub didn't accept that token. Check you copied all of it."
          : e.status === 403 || e.status === 404 ? "That token can't create gists. Make a new one with the gist box ticked."
          : "Couldn't reach GitHub. Check your connection and try again.";
        cfg = {};
        saveCfg();
        setStatus("off");
        return { ok: false, msg };
      }
    }

    function disconnect() {
      clearTimeout(timer);
      cfg = {};
      saveCfg();
      setStatus("off");
    }

    window.addEventListener("online", () => schedule(300));
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") flush();
      else schedule(300); // coming back: pick up anything done on another device
    });
    window.addEventListener("pagehide", flush);

    return {
      start: () => { if (enabled()) run(); },
      run, markDirty, connect, disconnect, enabled,
      info: () => ({ login: cfg.login, gistUrl: cfg.gistUrl, lastSync: cfg.lastSync, status }),
    };
  })();

  function chipHtml() {
    const { status, lastSync } = Sync.info();
    const map = {
      off: ["warn", "Saved in this browser only. Turn on sync"],
      idle: ["", "Sync on"],
      pending: ["", "Saving to GitHub…"],
      syncing: ["", "Saving to GitHub…"],
      ok: ["good", lastSync ? `Saved to GitHub ${clock(lastSync)}` : "Saved to GitHub"],
      offline: ["warn", "Offline. Saved here, will sync later"],
      error: ["bad", "Sync problem. Tap for details"],
    };
    const [cls, text] = map[status.s] || map.idle;
    return `<button class="sync-chip ${cls}" id="sync-chip" data-dact="sync"><i aria-hidden="true"></i>${esc(text)}</button>`;
  }
  function paintChip() {
    const el = document.getElementById("sync-chip");
    if (el) el.outerHTML = chipHtml();
    const panel = document.getElementById("sync-status");
    if (panel) panel.innerHTML = syncStatusHtml();
  }

  /* ---------------- run chart ----------------
     Drawn first at a nominal width, then redrawn at the width it actually gets (fitCharts), so the
     axis labels keep their real size on a phone instead of being squeezed by the stretched SVG. */
  const chartData = new Map();
  let chartSeq = 0;
  function runChart(results, opts = {}) {
    const id = ++chartSeq;
    chartData.set(id, [results, opts]);
    if (chartData.size > 12) chartData.delete(chartData.keys().next().value);
    return drawRunChart(results, opts, 600, id);
  }
  function fitCharts(root) {
    if (!root) return;
    root.querySelectorAll("svg.runchart[data-rc]").forEach((svg) => {
      const w = Math.round(svg.getBoundingClientRect().width);
      const d = chartData.get(Number(svg.dataset.rc));
      if (!d || w < 120 || Math.abs(w - Number(svg.dataset.w)) < 2) return;
      svg.outerHTML = drawRunChart(d[0], d[1], w, Number(svg.dataset.rc));
    });
  }
  let fitTimer = null;
  window.addEventListener("resize", () => { clearTimeout(fitTimer); fitTimer = setTimeout(() => fitCharts(document), 150); });

  function drawRunChart(results, { height = 120, label = "Running accuracy" } = {}, width = 600, id = 0) {
    const W = width, H = height, padL = 38, padR = 8, padT = 10, padB = 10;
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
      const msg = W >= 420 ? "Answer a question and your run chart starts here" : "Answer a question to start the chart";
      body += `<text class="empty" x="${(padL + W - padR) / 2}" y="${H / 2 + 4}" text-anchor="middle">${msg}</text>`;
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
    return `<svg class="runchart" data-rc="${id}" data-w="${W}" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" style="height:${H}px" role="img" aria-label="${esc(aria)}">${body}</svg>`;
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
    state.session = { title, ids: order, perm, picks: {}, i: 0, done: false, t: now() };
    commit();
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
    const orig = s.perm[id][displayIdx];
    s.picks[id] = orig;
    const t = now();
    s.t = t;
    state.attempts.push([t, id, orig]);
    if (state.attempts.length > ATTEMPTS_MAX) state.attempts = state.attempts.slice(-ATTEMPTS_MAX);
    commit();
    renderQuiz({ justAnswered: true });
  }

  function next() {
    const s = state.session;
    if (!s) return;
    s.t = now();
    if (s.i < s.ids.length - 1) {
      s.i += 1;
      commit();
      renderQuiz();
      window.scrollTo(0, 0);
    } else {
      s.done = true;
      commit();
      go("results");
    }
  }

  function toggleSave(id) {
    const was = isSaved(id);
    state.saved[id] = { v: was ? 0 : 1, t: now() };
    commit();
    toast(was ? "Removed from saved" : "Saved for later");
  }

  /* ---------------- routing ----------------
     Drill pages live under #/drill (home), #/drill/quiz, #/drill/results, #/drill/saved and
     #/drill/sync. The site shell owns the hashchange listener and calls show(). */
  const drillView = () => {
    const m = location.hash.match(/^#\/drill(?:\/([a-z]+))?\/?$/);
    return m ? m[1] || "home" : null;
  };
  const TITLES = { home: "Drill", quiz: "Drill question", results: "Drill results", saved: "Saved questions", sync: "Sync and backup" };
  const currentView = () => drillView() || "";
  const onDrillPage = () => !!(drillView() && app && document.body.contains(app));

  function go(view) {
    const h = view === "home" ? "#/drill" : "#/drill/" + view;
    if (location.hash !== h) location.hash = h;
    else show(view);
  }

  function renderView(view) {
    if (view === "quiz" && state.session && !state.session.done) renderQuiz();
    else if (view === "results" && state.session) renderResults();
    else if (view === "saved") renderSaved();
    else if (view === "sync") renderSync();
    else renderHome();
  }

  function show(view, el) {
    if (el) app = el;
    if (!app || !document.body.contains(app)) return;
    view = view || "home";
    // No quiz to show (old bookmark, finished quiz, another device cleared it): go to drill home.
    const live = state.session && !state.session.done;
    if ((view === "quiz" && !live) || (view === "results" && !state.session) || !TITLES[view]) {
      location.replace("#/drill");
      return;
    }
    renderView(view);
    window.scrollTo(0, 0);
  }

  // Re-draw after data arrived from another device or tab, keeping the scroll position.
  function rerender() {
    if (!onDrillPage()) {
      // Study pages: update ticks, scores and practice panels in place; tools keep their state.
      if (window.G && G.refreshProgress) G.refreshProgress();
      return;
    }
    if (document.activeElement && /^(INPUT|SELECT|TEXTAREA)$/.test(document.activeElement.tagName)) return;
    const y = window.scrollY;
    renderView(drillView());
    window.scrollTo(0, y);
  }

  /* ---------------- views ---------------- */
  function masthead() {
    return `<header class="masthead">
        <div class="brand">${LOGO}<div><h1>Drill</h1><p>${QUESTIONS.length} practice questions across ${CHAPTERS.length} chapters, with explanations</p></div></div>
        ${chipHtml()}
      </header>`;
  }

  function renderHome() {
    const hist = historyMap();
    const missedIds = QUESTIONS.filter((q) => hist[q.id] && hist[q.id].l === 0).map((q) => q.id);
    const recent = state.attempts.slice(-60).map(attemptOk);
    const recentOk = recent.reduce((a, b) => a + b, 0);
    const answeredAll = Object.keys(hist).length;
    const sel = new Set(state.selected);
    const selCount = QUESTIONS.filter((q) => sel.has(q.ch)).length;
    const s = state.session;
    const resumable = s && !s.done;
    const nSaved = savedIds().length;

    const chapterRows = CHAPTERS.map((c) => {
      const qs = QUESTIONS.filter((q) => q.ch === c.n);
      let ans = 0, ok = 0, miss = 0;
      for (const q of qs) {
        const h = hist[q.id];
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
        </label>${hasNotes(c.n) ? `<a class="notes" href="#/ch${c.n}" aria-label="Study notes for chapter ${c.n}">Notes</a>` : ""}</li>`;
    }).join("");

    app.innerHTML = `
      ${masthead()}

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
        <button class="btn" data-act="saved"><b>Saved ${nSaved}</b><small>Review or practice</small></button>
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

      <p class="footnote">Every answer, saved question and setting is stored as you go, together with your study-page progress. <button class="linkish" data-act="sync">Sync and backup</button></p>

      <div class="startbar"><div class="inner">
        <p>${sel.size ? `${plural(sel.size, "chapter")} selected, ${selCount} questions` : "Tick chapters to practice them"}</p>
        <button class="btn primary" data-act="start" ${sel.size ? "" : "disabled"}>Start quiz</button>
      </div></div>`;
    fitCharts(app);
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
    if (!s || s.done) return go("home");
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
          ${hasNotes(q.ch) ? `<p class="study"><a href="#/ch${q.ch}">Study Chapter ${q.ch}: ${esc(chapterTitle(q.ch))}</a></p>` : ""}
        </section>`;
    }

    const ctx = (q.ctx || [])
      .map((c) => `<div class="context"><b>From question ${c.n}</b>${esc(c.q)}</div>`)
      .join("");

    app.innerHTML = `
      <div class="quizbar">
        <button class="btn quiet small" data-act="home">Drill home</button>
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
      <div class="quizbar"><button class="btn quiet small" data-act="home">Drill home</button><span class="where">${esc(s.title)}</span><span></span></div>
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
        <button class="btn quiet" data-act="home">Back to drill home</button>
      </div>
      ${reviewChapters(missed)}
      ${missed.length ? `<div class="section-head"><h2>Missed in this quiz</h2></div><ul class="saved-list">${missed.map((id) => reviewItem(id)).join("")}</ul>` : ""}`;
    fitCharts(app);
  }

  function renderSaved() {
    const ids = savedIds();
    const sorted = ids.slice().sort((a, b) => {
      const qa = BY_ID.get(a), qb = BY_ID.get(b);
      return qa.ch - qb.ch || qa.n - qb.n;
    });
    app.innerHTML = `
      <div class="quizbar"><button class="btn quiet small" data-act="home">Drill home</button><span class="where">Saved questions</span><span></span></div>
      <div class="section-head"><h2>Saved questions (${ids.length})</h2></div>
      ${ids.length
        ? `<div class="actions"><button class="btn primary" data-act="practice-saved">Practice saved questions</button></div>
           <ul class="saved-list">${sorted.map((id) => reviewItem(id, { showUnsave: true })).join("")}</ul>`
        : `<div class="empty-state"><h3>Nothing saved yet</h3><p>During a quiz, press Save (or the <kbd>S</kbd> key) on any question you want to come back to. It will show up here.</p>
           <button class="btn primary" data-act="home">Pick chapters</button></div>`}`;
  }

  function syncStatusHtml() {
    const { login, gistUrl, lastSync, status } = Sync.info();
    if (!Sync.enabled()) {
      return `<p class="status-line warn"><i aria-hidden="true"></i><span>Sync is off. Your progress is only in this browser.</span></p>`;
    }
    const line =
      status.s === "error" ? `<p class="status-line bad"><i aria-hidden="true"></i><span>${esc(status.msg || "Sync problem.")}</span></p>`
      : status.s === "offline" ? `<p class="status-line warn"><i aria-hidden="true"></i><span>Offline. Everything is saved in this browser and will go to GitHub when you're back online.</span></p>`
      : status.s === "syncing" || status.s === "pending" ? `<p class="status-line"><i aria-hidden="true"></i><span>Saving to GitHub…</span></p>`
      : `<p class="status-line good"><i aria-hidden="true"></i><span>Sync is on${login ? ` for <b>${esc(login)}</b>` : ""}.${lastSync ? ` Last saved to GitHub ${esc(clock(lastSync))}.` : ""}</span></p>`;
    return `${line}
      <p class="muted-small">Stored in a secret gist in your GitHub account${gistUrl ? `: <a href="${esc(gistUrl)}" target="_blank" rel="noopener">view the file</a>` : ""}.</p>
      <div class="actions"><button class="btn" data-act="sync-now">Sync now</button><button class="btn quiet" data-act="sync-off">Turn off sync on this device</button></div>`;
  }

  function renderSync() {
    const hist = historyMap();
    const total = state.attempts.length;
    const tokenUrl = "https://github.com/settings/tokens/new?scopes=gist&description=Green%20Belt%20Drill%20sync";
    app.innerHTML = `
      <div class="quizbar"><button class="btn quiet small" data-act="home">Drill home</button><span class="where">Sync and backup</span><span></span></div>
      <div class="section-head"><h2>Sync and backup</h2></div>

      <section class="panel">
        <h3>What's being kept</h3>
        <p>${plural(total, "answer")} across ${plural(Object.keys(hist).length, "question")}, ${plural(savedIds().length, "saved question")}, your settings, and the quiz you're in. Every answer is kept with its time and the choice you picked. From the study pages: ${plural(Object.values(state.learn.rev).filter((r) => r.v === 1).length, "topic")} marked “I can explain this” and blind-check best scores for ${plural(Object.keys(state.learn.best).length, "chapter")}.</p>
        <div id="sync-status">${syncStatusHtml()}</div>
      </section>

      ${Sync.enabled() ? "" : `<section class="panel">
        <h3>Turn on sync with GitHub</h3>
        <p>The browser alone can lose data (cleared history, Safari's 7-day cleanup, a new phone). Sync keeps a copy in your GitHub account and lets you continue on any device. You do this once per device.</p>
        <ol class="steps">
          <li><a class="btn small" href="${tokenUrl}" target="_blank" rel="noopener">Open GitHub's token page</a><br>The note and the <b>gist</b> box are filled in for you. Set <b>Expiration</b> to <b>No expiration</b>, leave every other box unticked, then press <b>Generate token</b> and copy it.</li>
          <li><label for="token">Paste the token here</label>
            <div class="token-row"><input id="token" type="password" autocomplete="off" spellcheck="false" placeholder="ghp_…"><button class="btn primary" data-act="sync-on">Turn on sync</button></div>
            <span class="muted-small" id="sync-msg" role="status"></span></li>
        </ol>
        <p class="muted-small">The token can only read and write your gists. It is kept in this browser and sent only to GitHub. On another device, paste the same token (or a new one) and it will pick up the same progress.</p>
      </section>`}

      <section class="panel">
        <h3>Backup file</h3>
        <p>Download everything as a file, or load a file back in. Loading merges with what's here; nothing is overwritten.</p>
        <div class="actions"><button class="btn" data-act="backup">Download backup</button><button class="btn quiet" data-act="restore">Load a backup file</button></div>
      </section>`;
  }

  /* ---------------- backup / restore ---------------- */
  function backup() {
    const data = { app: "green-belt-drill", v: 2, exported: new Date().toISOString(), data: state };
    const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `cssgb-prep-backup-${new Date().toISOString().slice(0, 10)}.json`;
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
      const raw = JSON.parse(await file.text());
      if (raw.app !== "green-belt-drill") throw new Error("not ours");
      const before = state.attempts.length;
      const learnBefore = JSON.stringify(state.learn);
      state = mergeStates(state, sanitize(raw));
      commit();
      const learnChanged = JSON.stringify(state.learn) !== learnBefore;
      toast(`Backup loaded. ${plural(state.attempts.length - before, "answer")} added${learnChanged ? ", and study-page progress updated" : ""}.`);
      afterDataChange();
    } catch (e) {
      toast("That file isn't a CSSGB Prep (Green Belt Drill) backup. Choose the .json file made by Download backup.");
    }
  });

  /* ---------------- events ----------------
     Listeners sit on the document because the drill container is re-created on every visit. */
  const inDrill = (e) => app && document.body.contains(app) && app.contains(e.target);

  document.addEventListener("click", async (e) => {
    if (!inDrill(e)) return;
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
      case "sync": go("sync"); break;
      case "resume": go("quiz"); break;
      case "saved": go("saved"); break;
      case "practice-saved": startSession("Saved questions", savedIds()); break;
      case "missed": startMissed(); break;
      case "mixed": startMixed(); break;
      case "start": {
        const sel = new Set(state.selected);
        const ids = QUESTIONS.filter((q) => sel.has(q.ch)).map((q) => q.id);
        const chs = CHAPTERS.filter((c) => sel.has(c.n));
        const title = chs.length === 1 ? `Chapter ${chs[0].n}: ${chs[0].title}` : `${chs.length} chapters`;
        startSession(title, ids);
        break;
      }
      case "sel-all": state.selected = CHAPTERS.map((c) => c.n); state.selectedT = now(); commit(); renderHome(); break;
      case "sel-none": state.selected = []; state.selectedT = now(); commit(); renderHome(); break;
      case "retry-missed":
        if (s) startSession("Missed in last quiz", s.ids.filter((id) => id in s.picks && s.picks[id] !== BY_ID.get(id).a));
        break;
      case "restart":
        if (s) startSession(s.title, s.ids.slice());
        break;
      case "backup": backup(); break;
      case "restore": restoreInput.click(); break;
      case "sync-now": Sync.run(); break;
      case "sync-off": Sync.disconnect(); renderSync(); toast("Sync turned off on this device. Your GitHub copy is untouched."); break;
      case "sync-on": {
        const input = document.getElementById("token");
        const msg = document.getElementById("sync-msg");
        const token = input ? input.value.trim() : "";
        if (!token) { if (msg) msg.textContent = "Paste your token first."; return; }
        t.disabled = true;
        if (msg) msg.textContent = "Connecting to GitHub…";
        const r = await Sync.connect(token);
        if (r.ok) {
          renderSync();
          toast(r.reused ? "Sync on. Progress from your other devices was merged in." : "Sync on. Your progress is now saved to GitHub.");
        } else {
          t.disabled = false;
          if (msg) msg.textContent = r.msg;
        }
        break;
      }
    }
  });

  document.addEventListener("change", (e) => {
    if (!inDrill(e)) return;
    const t = e.target;
    if (t.dataset.ch) {
      const n = Number(t.dataset.ch);
      const sel = new Set(state.selected);
      t.checked ? sel.add(n) : sel.delete(n);
      state.selected = CHAPTERS.map((c) => c.n).filter((c) => sel.has(c));
      state.selectedT = now();
      commit();
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
      state.settingsT = now();
      commit();
      const y = window.scrollY;
      renderHome();
      window.scrollTo(0, y);
    }
  });

  document.addEventListener("keydown", (e) => {
    if (!inDrill(e)) return;
    if (e.key === "Enter" && e.target.id === "token") {
      e.preventDefault();
      const b = app.querySelector('[data-act="sync-on"]');
      if (b) b.click();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (/^(INPUT|SELECT|TEXTAREA)$/.test(e.target.tagName)) return;
    const s = state.session;
    if (!onDrillPage() || currentView() !== "quiz" || !s || s.done) return;
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

  /* =====================================================================
     The rest of the site: study-page progress, practice panels, shortcuts
     ===================================================================== */
  function startMixed() {
    const size = Number(state.settings.mixedSize) || 25;
    const ids = shuffle(QUESTIONS.map((q) => q.id)).slice(0, size);
    startSession(`Mixed set of ${ids.length}`, ids);
  }
  function startMissed() {
    const hist = historyMap();
    startSession("Missed questions", QUESTIONS.filter((q) => hist[q.id] && hist[q.id].l === 0).map((q) => q.id));
  }

  const BY_CH = new Map(CHAPTERS.map((c) => [c.n, []]));
  for (const q of QUESTIONS) { if (!BY_CH.has(q.ch)) BY_CH.set(q.ch, []); BY_CH.get(q.ch).push(q); }
  const hasNotes = (n) => !!(window.G && G.chapters && G.chapters["ch" + n]);

  function chapterStats(n) {
    const hist = historyMap();
    const qs = BY_CH.get(n) || [];
    let tried = 0, ok = 0, miss = 0;
    const missedIds = [];
    for (const q of qs) {
      const h = hist[q.id];
      if (!h) continue;
      tried++;
      if (h.l === 1) ok++;
      else { miss++; missedIds.push(q.id); }
    }
    return { total: qs.length, tried, ok, miss, ids: qs.map((q) => q.id), missedIds };
  }

  function reviewChapters(missed) {
    if (!missed.length) return "";
    const by = new Map();
    for (const id of missed) { const n = BY_ID.get(id).ch; by.set(n, (by.get(n) || 0) + 1); }
    const rows = Array.from(by.entries()).sort((a, b) => a[0] - b[0]).filter(([n]) => hasNotes(n));
    if (!rows.length) return "";
    return `<section class="panel" aria-label="Chapters to review">
        <h3>Go back to the notes</h3>
        <ul class="review-chs">${rows.map(([n, k]) => `<li><a href="#/ch${n}">Chapter ${n}: ${esc(chapterTitle(n))}</a> <span class="muted-small">${plural(k, "question")} missed</span></li>`).join("")}</ul>
      </section>`;
  }

  function resumeHtml() {
    const s = state.session;
    if (!s || s.done) return "";
    return `<section class="resume" aria-label="Unfinished quiz">
        <p><b>${esc(s.title)}</b><br>Question ${s.i + 1} of ${s.ids.length}, ${sessionResults(s).reduce((a, b) => a + b, 0)} right so far</p>
        <button class="btn primary" data-dact="resume">Resume quiz</button>
      </section>`;
  }

  // Practice panel for the home page
  function homePanelHtml() {
    const hist = historyMap();
    const missedN = QUESTIONS.filter((q) => hist[q.id] && hist[q.id].l === 0).length;
    const recent = state.attempts.slice(-60).map(attemptOk);
    const recentOk = recent.reduce((a, b) => a + b, 0);
    return `<section class="drill home-drill" aria-labelledby="home-drill-h">
        <div class="section-head"><h2 id="home-drill-h">Drill</h2>${chipHtml()}</div>
        ${resumeHtml()}
        <section class="chart-wrap" aria-label="Recent accuracy">
          <div class="chart-head">
            <h2>Your last ${recent.length ? plural(recent.length, "answer") : "answers"}</h2>
            ${recent.length ? `<span><span class="big">${pct(recentOk, recent.length)}%</span> <span class="muted">right, ${Object.keys(hist).length} of ${QUESTIONS.length} questions tried</span></span>` : `<span class="muted">${QUESTIONS.length} questions waiting</span>`}
          </div>
          ${runChart(recent)}
          ${chartKey()}
        </section>
        <nav class="quick" aria-label="Quick start">
          <button class="btn primary" data-dact="mixed"><b>Mixed ${state.settings.mixedSize}</b><small>Random from all chapters</small></button>
          <button class="btn" data-dact="missed" ${missedN ? "" : "disabled"}><b>Missed ${missedN}</b><small>Wrong on last try</small></button>
          <a class="btn" href="#/drill"><b>Chapters</b><small>Pick chapters, options</small></a>
        </nav>
      </section>`;
  }

  // Practice panel at the end of each study chapter
  function chapterPanelHtml(n) {
    const c = chapterStats(n);
    if (!c.total) return "";
    const s = state.session;
    const unfinished = s && !s.done && Object.keys(s.picks).length ? s : null;
    const line = c.tried
      ? `${c.tried} of ${c.total} tried: ${c.ok} right on the last try (${pct(c.ok, c.tried)}%), ${c.miss} missed.`
      : `${c.total} practice questions on this chapter, none tried yet.`;
    return `<div class="drill ch-drill">
        <p>${line}</p>
        <span class="bar" aria-hidden="true" style="display:flex;max-width:30rem"><i class="b-ok" style="width:${(100 * c.ok) / c.total}%"></i><i class="b-miss" style="width:${(100 * c.miss) / c.total}%"></i></span>
        <div class="actions">
          <button class="btn primary" data-dact="chapter" data-ch="${n}">Drill all ${c.total}</button>
          <button class="btn" data-dact="chapter-missed" data-ch="${n}" ${c.miss ? "" : "disabled"}>${c.miss ? `Practice the ${c.miss} missed` : "No missed questions"}</button>
          <a class="btn quiet" href="#/drill">Mix with other chapters</a>
        </div>
        ${unfinished ? `<p class="muted-small">Starting replaces your unfinished quiz, “${esc(unfinished.title)}” (question ${unfinished.i + 1} of ${unfinished.ids.length}). <button class="linkish" data-dact="resume">Resume it instead</button></p>` : ""}
      </div>`;
  }

  function chapterStatText(n) {
    const c = chapterStats(n);
    if (!c.total) return "";
    return c.tried ? `Drill ${pct(c.ok, c.tried)}% right, ${c.tried} of ${c.total} tried` : `Drill: ${c.total} questions`;
  }

  // Fill the practice placeholders a study page leaves for the drill: data-drill="home" | "chapter:N" | "stat:N"
  function fill(root) {
    root.querySelectorAll("[data-drill]").forEach((el) => {
      const [kind, arg] = el.dataset.drill.split(":");
      if (kind === "home") { el.innerHTML = homePanelHtml(); fitCharts(el); }
      else if (kind === "chapter") el.innerHTML = chapterPanelHtml(Number(arg));
      else if (kind === "stat") el.textContent = chapterStatText(Number(arg));
    });
  }

  // Buttons on the study pages (and the sync chip anywhere)
  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-dact]");
    if (!t || t.disabled) return;
    const n = Number(t.dataset.ch);
    switch (t.dataset.dact) {
      case "sync": go("sync"); break;
      case "resume": go("quiz"); break;
      case "mixed": startMixed(); break;
      case "missed": startMissed(); break;
      case "chapter": startSession(`Chapter ${n}: ${chapterTitle(n)}`, chapterStats(n).ids); break;
      case "chapter-missed": startSession(`Chapter ${n}: missed questions`, chapterStats(n).missedIds); break;
    }
  });

  /* ---------- study-page progress lives in the same record ---------- */
  // Mirror the record into the study pages' G.state (rev: key -> true, best: chapter -> score).
  function learnToG() {
    if (!window.G || !G.state) return;
    const rev = {};
    for (const [k, r] of Object.entries(state.learn.rev)) if (r.v === 1) rev[k] = true;
    G.state.rev = rev;
    G.state.best = Object.assign({}, state.learn.best);
  }

  // The study pages call G.persist() after a change; stamp what changed and save it.
  function persistLearn() {
    if (!window.G || !G.state) return;
    const L = state.learn;
    let changed = false;
    for (const [k, on] of Object.entries(G.state.rev || {})) {
      if (!/^ch\d{1,2}\/[a-z0-9-]{1,40}$/.test(k)) continue;
      const v = on ? 1 : 0, cur = L.rev[k];
      if (cur ? cur.v !== v : v === 1) { L.rev[k] = { v, t: now() }; changed = true; }
    }
    for (const [k, n] of Object.entries(G.state.best || {})) {
      if (/^ch\d{1,2}$/.test(k) && Number.isInteger(n) && n > (L.best[k] || 0)) { L.best[k] = n; changed = true; }
    }
    if (changed) commit();
  }

  // One-time move of the old study-guide progress (kept under gbLearn.v1) into the record.
  function migrateLearn() {
    try {
      if (localStorage.getItem("gbLearn.migrated")) return;
      const old = JSON.parse(localStorage.getItem("gbLearn.v1") || "{}") || {};
      let changed = false;
      for (const [k, on] of Object.entries(old.rev || {})) {
        if (on === true && /^ch\d{1,2}\/[a-z0-9-]{1,40}$/.test(k) && !state.learn.rev[k]) { state.learn.rev[k] = { v: 1, t: 1 }; changed = true; }
      }
      for (const [k, n] of Object.entries(old.best || {})) {
        if (/^ch\d{1,2}$/.test(k) && Number.isInteger(n) && n > (state.learn.best[k] || 0)) { state.learn.best[k] = n; changed = true; }
      }
      localStorage.setItem("gbLearn.migrated", "1");
      if (changed) commit();
    } catch (e) { /* the old progress stays where it was */ }
  }

  // Data arrived from GitHub, another tab or a backup file.
  function afterDataChange() {
    learnToG();
    rerender();
  }

  // Save migrated data in the new format straight away.
  writeLocal();
  migrateLearn();
  learnToG();
  if (window.G) G.persist = persistLearn;

  window.Drill = {
    show,
    fill,
    title: (view) => TITLES[view] || "Drill",
    count: () => QUESTIONS.length,
    chapterCount: (n) => (BY_CH.get(n) || []).length,
  };

  Sync.start();
})();
