# Green Belt Drill

A practice quiz for the ASQ Certified Six Sigma Green Belt (CSSGB) exam: 654 multiple-choice questions across 24 chapters, each with its answer and explanation.

**Live site:** https://munzirkhanrahi.github.io/cssgb-quiz/

## Visual study guide: the whole Body of Knowledge

**Live:** https://munzirkhanrahi.github.io/cssgb-quiz/learn/

Interactive, visual notes for all 24 handbook chapters — Chapters 1–3 (Six Sigma and the organization, BoK I.A–I.C), 4–9 (Define, II.A–II.F), 10–15 (Measure, III.A–III.F), 16–18 (Analyze, IV.A–IV.C), 19–21 (Improve, V.A–V.C) and 22–24 (Control, VI.A–VI.C). It includes:

- a BoK map shaded by cognitive level, from Remember to Create;
- a working tool for every calculation — expected profit, cost-of-quality curves, drum-buffer-rope, value stream timeline, FMEA risk priority; DPMO, RTY, sigma level, Cp/Cpk, CPI/SPI, critical path, QFD weights; probability rules, counting, a central-limit-theorem simulator, a distribution explorer (binomial, Poisson, normal, t, χ², F), descriptive statistics with histogram, box plot, stem-and-leaf and normal probability plot (Anderson-Darling), run-chart tests, GR&R (AIAG average and range), bias and linearity, attribute agreement, a capability calculator (Cp, Cpk, Pp, Ppk, Cpm) and the 1.5σ shift; multi-vari charts, correlation and regression with confidence and prediction intervals, power and sample size, Z/t/pooled/Welch/paired tests, χ² and F variance tests, proportion tests, chi-square goodness of fit and contingency tables, one-way ANOVA, gap analysis, 5 Whys and fault-tree gates; 2³ DOE effects, takt time, line balance, Little's law, SMED; control limits for X̄–R, X̄–s, I–MR, p, np, c and u charts, run rules, rational subgrouping and tampering, OEE;
- classification drills and decision trees (which distribution, which test, which chart);
- a traps lab of 123 close-difference pairs, a printable formula sheet with the control chart constants, a binder tab map with handbook corrections, and a blind check at the end of each chapter.

Files live in `learn/` (no build step); `learn/js/stats.js` holds the statistics functions (t, χ², F, binomial, Poisson, Anderson-Darling).

## What it does

- Practice one chapter, several chapters, or a random mixed set (10, 25, 50 or 100 questions).
- Answer with A, B, C or D (click, or press `A`–`D` / `1`–`4`). `Enter` goes to the next question, `S` saves the current one.
- Save any question and review the saved list later, with answers and explanations, or practice just those.
- "Missed" collects every question you got wrong on your last try.
- A run chart tracks your running accuracy against a target score you set.
- An unfinished quiz resumes where you left off, even after closing the tab.
- Optional shuffling of question order and of the A–D choices. In the source PDF the answer is B 56% of the time, so shuffling choices is on by default.

## Where progress is stored

Everything is kept: every answer (with its time and the choice picked), saved and unsaved questions, settings, chapter selection and the quiz in progress.

1. **In the browser**, written the moment anything changes. The app also asks the browser to treat the storage as persistent.
2. **In a secret gist in your GitHub account**, once sync is turned on (Sync screen → paste a token with only the `gist` scope). Changes are pushed a few seconds after they happen and again when the tab is hidden or closed. On load, and whenever the tab comes back into view, the app pulls the gist and merges it, so you can switch between laptop and phone.
3. **As a backup file** you can download and load back in from the Sync screen.

Merging never loses answers: attempts from all devices are combined; for saved questions, settings and the current quiz, the most recent change wins.

## Files

| File | Purpose |
| --- | --- |
| `index.html`, `styles.css`, `app.js` | The app (no build step, no dependencies) |
| `questions.js` | Question bank generated from the PDF |
| `tools/parse.py` | Extracts questions, options, answers and explanations from the PDF text |
| `tools/build_bank.py` | Turns the parsed JSON into `questions.js` |
| `learn/` | Visual study guide covering all 24 chapters (`index.html`, `learn.css`, `js/`) |

## Regenerating the question bank

```bash
pip install pdfplumber
python3 -c "import pdfplumber,sys; p=pdfplumber.open(sys.argv[1]); open('q.txt','w').write('\n'.join(pg.extract_text() or '' for pg in p.pages))" All_Claude_Questions.pdf
python3 tools/parse.py q.txt questions.json
python3 tools/build_bank.py questions.json questions.js
```

## Embedding on another site

```html
<iframe src="https://munzirkhanrahi.github.io/cssgb-quiz/" style="width:100%;height:900px;border:0"></iframe>
```
