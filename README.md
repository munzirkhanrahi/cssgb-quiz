# Green Belt Drill

A practice quiz for the ASQ Certified Six Sigma Green Belt (CSSGB) exam: 654 multiple-choice questions across 24 chapters, each with its answer and explanation.

**Live site:** https://munzirkhanrahi.github.io/cssgb-quiz/

## Visual study guide: Define phase

**Live:** https://munzirkhanrahi.github.io/cssgb-quiz/learn/

Interactive, visual notes for handbook Chapters 4–9 (BoK II.A–II.F): a BoK map shaded by cognitive level, a working tool for every calculation (DPMO, RTY, sigma level and Cp/Cpk on a live normal curve, CPI/SPI, critical path, QFD column weights, prioritization matrix, multivoting), classification drills, a traps lab of close-difference pairs, a printable formula sheet, a binder tab map with handbook corrections, and a blind check at the end of each chapter. Files live in `learn/` (no build step).

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
| `learn/` | Visual study guide for the Define phase (`index.html`, `learn.css`, `js/`) |

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
