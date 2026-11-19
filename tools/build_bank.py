"""Turn parsed questions.json into the app's questions.js bank."""
import json
import re
import sys

src, out = sys.argv[1], sys.argv[2]
qs = json.load(open(src, encoding="utf-8"))
by_id = {q["id"]: q for q in qs}

chapters = []
seen = set()
for q in qs:
    if q["chapter"] not in seen:
        seen.add(q["chapter"])
        chapters.append({"n": q["chapter"], "title": q["chapterTitle"]})

bank = []
for q in qs:
    item = {
        "id": q["id"],
        "ch": q["chapter"],
        "n": q["number"],
        "q": q["question"],
        "o": [q["options"][k] for k in "ABCD"],
        "a": "ABCD".index(q["answer"]),
        "x": q["explanation"],
    }
    # Questions like "Using the data in Question 5…" need that question's setup when shuffled.
    refs = sorted({int(r) for r in re.findall(r"Question\s+(\d+)", q["question"])})
    ctx = []
    for r in refs:
        ref = by_id.get(f"c{q['chapter']}q{r}")
        if ref:
            ctx.append({"n": r, "q": ref["question"]})
    if ctx:
        item["ctx"] = ctx
    bank.append(item)

payload = {"chapters": chapters, "questions": bank}
with open(out, "w", encoding="utf-8") as f:
    f.write("// Generated from All_Claude_Questions.pdf by tools/build_bank.py\n")
    f.write("window.QUESTION_BANK = ")
    json.dump(payload, f, ensure_ascii=False, separators=(",", ":"))
    f.write(";\n")
print(len(chapters), "chapters,", len(bank), "questions,", sum(1 for b in bank if "ctx" in b), "with linked context")
