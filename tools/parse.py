"""Parse the CSSGB question PDF (text extracted with pdfplumber) into structured JSON."""
import json
import re
import sys

src, out = sys.argv[1], sys.argv[2]
lines = open(src, encoding="utf-8").read().split("\n")

CH_RE = re.compile(r"^\s*(?:Chapter|Chaper)\s+(\d+)\s*:\s*(.+?)\s*$")
AK_RE = re.compile(r"^\s*Answer Key")

chapters = []
cur = None
for ln in lines:
    m = CH_RE.match(ln)
    if m:
        cur = {"num": int(m.group(1)), "title": m.group(2).strip(), "q": [], "a": [], "in_ans": False}
        chapters.append(cur)
        continue
    if cur is None:
        continue
    if AK_RE.match(ln):
        cur["in_ans"] = True
        continue
    (cur["a"] if cur["in_ans"] else cur["q"]).append(ln)


def squash(s):
    s = s.replace("\f", " ")
    return re.sub(r"\s+", " ", s).strip()


def clean(s):
    # The PDF has no glyph for the grand-average symbol (X double-bar); restore it.
    s = s.replace("(cid:0)", "")
    s = s.replace("grand average (X)", "grand average (X̿)")
    s = s.replace("UCL = X + A₂R̄", "UCL = X̿ + A₂R̄")
    s = re.sub(r"\s+([,;:)])", r"\1", s)
    s = re.sub(r"\s+\.(?=\s|$)", ".", s)
    s = re.sub(r"\(\s+", "(", s)
    return squash(s)


Q_SPLIT = re.compile(r"Question\s+(\d+)\s*:")
OPT_RE = re.compile(r"^(.*?)\s+A\.\s+(.*?)\s+B\.\s+(.*?)\s+C\.\s+(.*?)\s+D\.\s+(.*)$", re.S)

# Answer header: "Question 1 Answer: B", "Question 1 — Answer: B", "Q1 Answer: B",
# "Q1 — B.", "Question 1 — B", "Q1 — C (SPD)."
A_SPLIT = re.compile(
    r"(?<![\w(])(?:Question|Q)\s?(\d+)\s*(?:[—–-]\s*)?(?:Answer\s*:?\s*)?(?:[—–-]\s*)?([A-D])(?=[\s.)(:—–-]|$)"
)

problems = []
result = []
for ch in chapters:
    qtext = squash(" ".join(ch["q"]))
    qtext = re.sub(r"^Questions\s*", "", qtext)
    parts = Q_SPLIT.split(qtext)
    questions = {}
    for i in range(1, len(parts), 2):
        n = int(parts[i])
        body = parts[i + 1].strip()
        m = OPT_RE.match(body)
        if not m:
            problems.append(f"Ch{ch['num']} Q{n}: options not parsed: {body[:120]}")
            continue
        stem, a, b, c, d = (clean(x) for x in m.groups())
        if n in questions:
            problems.append(f"Ch{ch['num']} Q{n}: duplicate question number")
        questions[n] = {"stem": stem, "options": {"A": a, "B": b, "C": c, "D": d}}

    atext = "\n".join(ch["a"])
    hits = list(A_SPLIT.finditer(atext))
    answers = {}
    expected = 1
    kept = []
    # keep only headers whose number is the next expected one (filters in-text references)
    for h in hits:
        n = int(h.group(1))
        if n in questions and n not in answers and n >= expected:
            kept.append(h)
            answers[n] = None
            expected = n + 1
    for idx, h in enumerate(kept):
        n = int(h.group(1))
        end = kept[idx + 1].start() if idx + 1 < len(kept) else len(atext)
        expl_raw = atext[h.end():end]
        answers[n] = {"answer": h.group(2), "raw": expl_raw}

    for n in sorted(questions):
        q = questions[n]
        a = answers.get(n)
        if not a:
            problems.append(f"Ch{ch['num']} Q{n}: no answer found")
            continue
        raw = a["raw"]
        # Turn bullets into separate paragraphs; unwrap the rest.
        raw = raw.replace("\f", "\n")
        segs = re.split(r"\s*●\s*", raw)
        paras = [squash(s) for s in segs]
        paras = [p for p in paras if p]
        if paras:
            paras[0] = re.sub(r"^\s*[.:)—–-]*\s+", "", paras[0]).strip()
            paras[0] = re.sub(r"^\([^()]{1,40}\)\.\s*", "", paras[0]).strip()
        # split inline labels ("... DNA: ...  Ref: ...") into their own paragraphs
        LBL = r"(?:Distractor DNA|Distractor logic|DNA trap|DNA mimicry|DNA|Ref|Reference|References|Explanation)\s*:"
        split = []
        for p in paras:
            split.extend(re.split(r"(?<=[.)\"”'’])\s+(?=" + LBL + ")", p))
        paras = [clean(p) for p in split]
        paras = [re.sub(r"^Explanation\s*:\s*", "", p) for p in paras]
        paras = [p for p in paras if p]
        result.append({
            "id": f"c{ch['num']}q{n}",
            "chapter": ch["num"],
            "chapterTitle": ch["title"],
            "number": n,
            "question": q["stem"],
            "options": q["options"],
            "answer": a["answer"],
            "explanation": paras,
        })

    print(f"Ch{ch['num']:>2} {ch['title'][:45]:<45} questions={len(questions):>3} answers={sum(1 for v in answers.values() if v):>3}")

print(f"TOTAL {len(result)}")
for p in problems:
    print("PROBLEM:", p)
json.dump(result, open(out, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
