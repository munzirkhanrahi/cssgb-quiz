/* Statistics helpers for the Measure and Analyze chapters (G.st) */
(function () {
  "use strict";
  const st = {};
  // log-gamma (Lanczos, g = 7)
  const LC = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
  st.lgamma = (x) => {
    if (x < 0.5) return Math.log(Math.PI / Math.abs(Math.sin(Math.PI * x))) - st.lgamma(1 - x);
    x -= 1; let a = LC[0]; const t = x + 7.5;
    for (let i = 1; i < 9; i++) a += LC[i] / (x + i);
    return 0.5 * Math.log(2 * Math.PI) + (x + 0.5) * Math.log(t) - t + Math.log(a);
  };
  st.gamma = (x) => Math.exp(st.lgamma(x));
  // regularized incomplete beta I_x(a, b)
  function betacf(a, b, x) {
    const MAXIT = 300, EPS = 3e-14, FPMIN = 1e-300;
    let qab = a + b, qap = a + 1, qam = a - 1, c = 1, d = 1 - (qab * x) / qap;
    if (Math.abs(d) < FPMIN) d = FPMIN; d = 1 / d; let h = d;
    for (let m = 1; m <= MAXIT; m++) {
      const m2 = 2 * m; let aa = (m * (b - m) * x) / ((qam + m2) * (a + m2));
      d = 1 + aa * d; if (Math.abs(d) < FPMIN) d = FPMIN; c = 1 + aa / c; if (Math.abs(c) < FPMIN) c = FPMIN; d = 1 / d; h *= d * c;
      aa = (-(a + m) * (qab + m) * x) / ((a + m2) * (qap + m2));
      d = 1 + aa * d; if (Math.abs(d) < FPMIN) d = FPMIN; c = 1 + aa / c; if (Math.abs(c) < FPMIN) c = FPMIN; d = 1 / d;
      const del = d * c; h *= del; if (Math.abs(del - 1) < EPS) break;
    }
    return h;
  }
  st.betai = (a, b, x) => {
    if (x <= 0) return 0; if (x >= 1) return 1;
    const bt = Math.exp(st.lgamma(a + b) - st.lgamma(a) - st.lgamma(b) + a * Math.log(x) + b * Math.log(1 - x));
    return x < (a + 1) / (a + b + 2) ? (bt * betacf(a, b, x)) / a : 1 - (bt * betacf(b, a, 1 - x)) / b;
  };
  // regularized lower incomplete gamma P(a, x)
  st.gammp = (a, x) => {
    if (x <= 0) return 0;
    if (x < a + 1) { let sum = 1 / a, del = sum, ap = a; for (let n = 0; n < 500; n++) { ap++; del *= x / ap; sum += del; if (Math.abs(del) < Math.abs(sum) * 3e-15) break; } return sum * Math.exp(-x + a * Math.log(x) - st.lgamma(a)); }
    let b = x + 1 - a, c = 1e300, d = 1 / b, h = d;
    for (let i = 1; i < 500; i++) { const an = -i * (i - a); b += 2; d = an * d + b; if (Math.abs(d) < 1e-300) d = 1e-300; c = b + an / c; if (Math.abs(c) < 1e-300) c = 1e-300; d = 1 / d; const del = d * c; h *= del; if (Math.abs(del - 1) < 3e-15) break; }
    return 1 - Math.exp(-x + a * Math.log(x) - st.lgamma(a)) * h;
  };
  // distributions
  st.npdf = (z) => Math.exp(-0.5 * z * z) / Math.sqrt(2 * Math.PI);
  st.ncdf = (z) => G.Phi(z);
  st.ninv = (p) => G.PhiInv(p);
  st.tcdf = (t, df) => { const x = df / (df + t * t), tail = 0.5 * st.betai(df / 2, 0.5, x); return t >= 0 ? 1 - tail : tail; };
  st.tpdf = (t, df) => Math.exp(st.lgamma((df + 1) / 2) - st.lgamma(df / 2)) / Math.sqrt(df * Math.PI) * Math.pow(1 + (t * t) / df, -(df + 1) / 2);
  st.chi2cdf = (x, df) => (x <= 0 ? 0 : st.gammp(df / 2, x / 2));
  st.chi2pdf = (x, df) => (x <= 0 ? 0 : Math.exp((df / 2 - 1) * Math.log(x) - x / 2 - (df / 2) * Math.log(2) - st.lgamma(df / 2)));
  st.fcdf = (x, d1, d2) => (x <= 0 ? 0 : st.betai(d1 / 2, d2 / 2, (d1 * x) / (d1 * x + d2)));
  st.fpdf = (x, d1, d2) => (x <= 0 ? 0 : Math.exp(0.5 * (d1 * Math.log(d1 * x) + d2 * Math.log(d2) - (d1 + d2) * Math.log(d1 * x + d2)) - Math.log(x) - (st.lgamma(d1 / 2) + st.lgamma(d2 / 2) - st.lgamma((d1 + d2) / 2))));
  const invert = (cdf, p, lo, hi) => { for (let i = 0; i < 200; i++) { const mid = (lo + hi) / 2; if (cdf(mid) < p) lo = mid; else hi = mid; if (hi - lo < 1e-10 * Math.max(1, Math.abs(mid))) break; } return (lo + hi) / 2; };
  st.tinv = (p, df) => invert((t) => st.tcdf(t, df), p, -1e4, 1e4);
  st.chi2inv = (p, df) => invert((x) => st.chi2cdf(x, df), p, 0, 1e4);
  st.finv = (p, d1, d2) => invert((x) => st.fcdf(x, d1, d2), p, 0, 1e5);
  st.lchoose = (n, k) => st.lgamma(n + 1) - st.lgamma(k + 1) - st.lgamma(n - k + 1);
  st.choose = (n, k) => (k < 0 || k > n ? 0 : Math.round(Math.exp(st.lchoose(n, k))));
  st.perm = (n, r) => { let v = 1; for (let i = 0; i < r; i++) v *= n - i; return v; };
  st.fact = (n) => { let v = 1; for (let i = 2; i <= n; i++) v *= i; return v; };
  st.binompmf = (k, n, p) => (k < 0 || k > n ? 0 : p === 0 ? (k === 0 ? 1 : 0) : p === 1 ? (k === n ? 1 : 0) : Math.exp(st.lchoose(n, k) + k * Math.log(p) + (n - k) * Math.log(1 - p)));
  st.poispmf = (k, l) => (k < 0 ? 0 : l === 0 ? (k === 0 ? 1 : 0) : Math.exp(-l + k * Math.log(l) - st.lgamma(k + 1)));
  // descriptive
  st.sum = (a) => a.reduce((s, x) => s + x, 0);
  st.mean = (a) => st.sum(a) / a.length;
  st.sd = (a) => { const m = st.mean(a); return Math.sqrt(a.reduce((s, x) => s + (x - m) ** 2, 0) / (a.length - 1)); };
  st.sdp = (a) => { const m = st.mean(a); return Math.sqrt(a.reduce((s, x) => s + (x - m) ** 2, 0) / a.length); };
  st.sorted = (a) => a.slice().sort((x, y) => x - y);
  st.median = (a) => { const s = st.sorted(a), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
  // Minitab-style quartile: position p(n+1), linear interpolation
  st.qmt = (a, p) => { const s = st.sorted(a), n = s.length, pos = p * (n + 1); if (pos <= 1) return s[0]; if (pos >= n) return s[n - 1]; const i = Math.floor(pos); return s[i - 1] + (pos - i) * (s[i] - s[i - 1]); };
  // Tukey hinges: median of each half, median included in both halves when n is odd
  st.hinges = (a) => { const s = st.sorted(a), n = s.length, h = Math.ceil(n / 2); return [st.median(s.slice(0, h)), st.median(s.slice(n - h))]; };
  st.mode = (a) => { const c = {}; a.forEach((x) => { c[x] = (c[x] || 0) + 1; }); const mx = Math.max(...Object.values(c)); if (mx === 1) return []; return Object.keys(c).filter((k) => c[k] === mx).map(Number); };
  // Anderson-Darling normality test with estimated parameters (Stephens' p-value approximation)
  st.adNormal = (a) => {
    const s = st.sorted(a), n = s.length, m = st.mean(s), sd = st.sd(s);
    let S = 0;
    for (let i = 0; i < n; i++) { const F1 = Math.min(Math.max(G.Phi((s[i] - m) / sd), 1e-15), 1 - 1e-15), F2 = Math.min(Math.max(G.Phi((s[n - 1 - i] - m) / sd), 1e-15), 1 - 1e-15); S += (2 * i + 1) * (Math.log(F1) + Math.log(1 - F2)); }
    const A2 = -n - S / n, As = A2 * (1 + 0.75 / n + 2.25 / (n * n));
    const p = As >= 0.6 ? Math.exp(1.2937 - 5.709 * As + 0.0186 * As * As) : As > 0.34 ? Math.exp(0.9177 - 4.279 * As - 1.38 * As * As) : As > 0.2 ? 1 - Math.exp(-8.318 + 42.796 * As - 59.938 * As * As) : 1 - Math.exp(-13.436 + 101.14 * As - 223.73 * As * As);
    return { A2, As, p: Math.min(1, Math.max(0, p)) };
  };
  st.parse = (txt) => (txt.match(/-?\d*\.?\d+(?:e-?\d+)?/gi) || []).map(Number).filter((x) => isFinite(x));
  st.fmtP = (p) => (p < 0.0001 ? "< 0.0001" : G.num(p, p < 0.001 ? 4 : 3));
  G.st = st;
})();
