# CSSGB Prep

One site for the ASQ Certified Six Sigma Green Belt (CSSGB) exam: a visual study guide to the whole Body of Knowledge and a drill of 654 practice questions, sharing one progress record.

**Live site:** https://munzirkhanrahi.github.io/cssgb-quiz/

The old addresses still work: `/learn/` redirects to the site, and quiz links such as `#/quiz`, `#/saved` and `#/sync` open the matching Drill screen.

## Study pages

Interactive, visual notes for all 24 handbook chapters — Chapters 1–3 (Six Sigma and the organization, BoK I.A–I.C), 4–9 (Define, II.A–II.F), 10–15 (Measure, III.A–III.F), 16–18 (Analyze, IV.A–IV.C), 19–21 (Improve, V.A–V.C) and 22–24 (Control, VI.A–VI.C). They include:

- a BoK map shaded by cognitive level, from Remember to Create, with your drill score for each chapter;
- a working tool for every calculation — expected profit, cost-of-quality curves, drum-buffer-rope, value stream timeline, FMEA risk priority; DPMO, RTY, sigma level, Cp/Cpk, CPI/SPI, critical path, QFD weights; probability rules, counting, a central-limit-theorem simulator, a distribution explorer (binomial, Poisson, normal, t, χ², F), descriptive statistics with histogram, box plot, stem-and-leaf and normal probability plot (Anderson-Darling), run-chart tests, GR&R (AIAG average and range), bias and linearity, attribute agreement, a capability calculator (Cp, Cpk, Pp, Ppk, Cpm) and the 1.5σ shift; multi-vari charts, correlation and regression with confidence and prediction intervals, power and sample size, Z/t/pooled/Welch/paired tests, χ² and F variance tests, proportion tests, chi-square goodness of fit and contingency tables, one-way ANOVA, gap analysis, 5 Whys and fault-tree gates; 2³ DOE effects, takt time, line balance, Little's law, SMED; control limits for X̄–R, X̄–s, I–MR, p, np, c and u charts, run rules, rational subgrouping and tampering, OEE;
- classification drills and decision trees (which distribution, which test, which chart);
- a traps lab of 121 close-difference pairs, a printable formula sheet with the control chart constants, and a binder tab map with handbook corrections;
- at the end of each chapter, a blind check (answer everything, then see the key and why each wrong option is wrong), followed by that chapter's drill questions.

## Drill

- Practice one chapter, several chapters, or a random mixed set (10, 25, 50 or 100 questions). Each study chapter can also start its own questions, or only the ones you missed.
- Answer with A, B, C or D (click, or press `A`–`D` / `1`–`4`). `Enter` goes to the next question, `S` saves the current one. These keys work only on the quiz screen.
- After each answer, a link opens the study chapter the question comes from; the results screen lists the chapters to go back to.
- Save any question and review the saved list later, with answers and explanations, or practice just those.
- "Missed" collects every question you got wrong on your last try.
- A run chart tracks your running accuracy against a target score you set.
- An unfinished quiz resumes where you left off, even after closing the tab.
- Optional shuffling of question order and of the A–D choices. In the source PDF the answer is B 56% of the time, so shuffling choices is on by default.

## Where progress is stored

One record holds everything: every drill answer (with its time and the choice picked), saved and unsaved questions, settings, chapter selection, the quiz in progress, the study topics you mark "I can explain this without looking", and your best blind-check score per chapter.

1. **In the browser**, written the moment anything changes. The site also asks the browser to treat the storage as persistent.
2. **In a secret gist in your GitHub account**, once sync is turned on (Drill → Sync and backup → paste a token with only the `gist` scope). Changes are pushed a few seconds after they happen and again when the tab is hidden or closed. On load, and whenever the tab comes back into view, the site pulls the gist and merges it, so you can switch between laptop and phone.
3. **As a backup file** you can download and load back in from the same screen.

Merging never loses answers: attempts from all devices are combined; for saved questions, settings, the current quiz and each reviewed topic, the most recent change wins; blind-check bests keep the highest score.

Progress from the two earlier sites carries over: the quiz already used this record, and the study guide's ticks and scores are moved into it the first time the merged site opens in that browser. The storage keys, gist file name (`green-belt-drill.json`) and backup format are unchanged, so existing sync setups and backup files keep working.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | The page shell (no build step, no dependencies) |
| `site.css` | Styles for the study pages and the drill |
| `js/core.js` | Router, tab bar, chapter renderer and blind check |
| `js/stats.js` | Statistics functions (t, χ², F, binomial, Poisson, Anderson-Darling) |
| `js/w-*.js` | The interactive tools and drills used in the chapters |
| `js/ch1.js` … `js/ch24.js` | Chapter content |
| `js/pages.js` | Home map, traps lab, formula sheet and binder tab map |
| `js/drill.js` | The drill: quizzes, saved questions, the progress record, sync and backup |
| `questions.js` | Question bank generated from the PDF |
| `learn/index.html` | Redirect from the old study-guide address |
| `tools/parse.py` | Extracts questions, options, answers and explanations from the PDF text |
| `tools/build_bank.py` | Turns the parsed JSON into `questions.js` |

## Addresses inside the site

| Address | Screen |
| --- | --- |
| `#/` | Home: BoK map and drill summary |
| `#/ch1` … `#/ch24` | Study chapters; add a section id to jump to it, e.g. `#/ch10/drill` |
| `#/traps`, `#/formulas`, `#/binder` | Traps lab, formula sheet, binder tab map |
| `#/drill` | Drill home: pick chapters and options |
| `#/drill/quiz`, `#/drill/results` | The quiz in progress and its results |
| `#/drill/saved`, `#/drill/sync` | Saved questions; sync and backup |

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
