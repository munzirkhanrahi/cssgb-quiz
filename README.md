# Green Belt Drill

A practice quiz for the ASQ Certified Six Sigma Green Belt (CSSGB) exam: 654 multiple-choice questions across 24 chapters, each with its answer and explanation.

**Live site:** https://munzirkhanrahi.github.io/cssgb-quiz/

## What it does

- Practice one chapter, several chapters, or a random mixed set (10, 25, 50 or 100 questions).
- Answer with A, B, C or D (click, or press `A`–`D` / `1`–`4`). `Enter` goes to the next question, `S` saves the current one.
- Save any question and review the saved list later, with answers and explanations, or practice just those.
- "Missed" collects every question you got wrong on your last try.
- A run chart tracks your running accuracy against a target score you set.
- An unfinished quiz resumes where you left off, even after closing the tab.
- Optional shuffling of question order and of the A–D choices. In the source PDF the answer is B 56% of the time, so shuffling choices is on by default.

## Where progress is stored

Saved questions and history live in the browser's local storage on each device. Use **Backup** to download them as a `.json` file and **Restore** on another device or browser to merge them in.

## Files

| File | Purpose |
| --- | --- |
| `index.html`, `styles.css`, `app.js` | The app (no build step, no dependencies) |
| `questions.js` | Question bank generated from the PDF |
| `tools/parse.py` | Extracts questions, options, answers and explanations from the PDF text |
| `tools/build_bank.py` | Turns the parsed JSON into `questions.js` |

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
