"""Render the approved revision 2 using the established printable template."""
import argparse
import ast
from base64 import b64encode
from html import escape
import math
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "print" / "practice-workflow-trial-2026-11-22"
ASSETS = ROOT / "shared" / "katex"

# The earlier authoring script writes files at import time; load only its helpers.
template = ROOT / "scripts" / "build-final-practice-2026-11-21.py"
tree = ast.parse(template.read_text(encoding="utf-8"), filename=str(template))
helpers = [node for node in tree.body if
           isinstance(node, ast.FunctionDef) and node.name in {"m", "p", "work", "table", "grid"}
           or isinstance(node, ast.Assign) and any(
               isinstance(target, ast.Name) and target.id in {"CSS", "plot_id"}
               for target in node.targets)]
exec(compile(ast.Module(body=helpers, type_ignores=[]), str(template), "exec"))

EXTRA_CSS = """
body{font-size:11pt;line-height:1.32}
h2{font-size:12pt}header p{font-size:10pt}
.equation{font-size:18pt;margin:10pt 0}
.equation .katex{font-size:1em}.katex-display{margin:0}
.key .equation{font-size:16pt}
.work-line{height:23pt}.workspace{margin-top:8pt}
.student table{font-size:10pt}.student th,.student td{padding:6pt}
.student td{height:31pt}.student .answer-cell{width:42%}
.student table th:last-child,.student table td:last-child{width:42%}
.student p span[data-math] .katex{font-size:13pt}
.response-label{font-size:10pt;font-weight:bold;margin:6pt 0}
.pair{align-items:start;gap:16pt}
.key p{font-size:10.5pt;margin-bottom:9pt}
.key .rubric{font-size:9pt;margin-top:12pt}
"""

POINTS = [16, 14, 12, 12, 14, 8, 10, 14]


def render_text(text):
    text = escape(text)
    text = re.sub(r"\*\*(.*?)\*\*", r"<b>\1</b>", text)
    for original, latex in [
        ("x&lt;=2", r"x\le2"), ("x&gt;=2", r"x\ge2"),
        ("-4&lt;=1-x&lt;=4", r"-4\le1-x\le4"),
        ("y=1/x", r"\displaystyle y=\frac{1}{x}"),
    ]:
        text = text.replace(original, m(latex))
    return text


def markdown(text, correction_table=False):
    pieces = []
    for chunk in re.split(r"(^\$\$\n[\s\S]*?\n\$\$$)", text, flags=re.M):
        if chunk.startswith("$$"):
            pieces.append('<div class="equation">' + m(chunk[3:-3].strip(), True) + "</div>")
            continue
        for paragraph in re.split(r"\n\s*\n", chunk.strip()):
            if not paragraph:
                continue
            if paragraph.startswith("|"):
                lines = paragraph.splitlines()
                rows = [[render_text(cell.strip()) for cell in line.split("|")[1:-1]]
                        for line in lines if not re.fullmatch(r"\|[-| ]+\|", line)]
                if correction_table:
                    rows[0].append("Your correction")
                    for row in rows[1:]:
                        row.append('<span class="answer-cell"></span>')
                pieces.append(table(rows[0], rows[1:]))
            elif paragraph.startswith("- "):
                pieces.append("<ul>" + "".join("<li>" + render_text(line[2:]) + "</li>"
                                               for line in paragraph.splitlines()) + "</ul>")
            else:
                pieces.append(p(render_text(paragraph.replace("\n", " "))))
    return "".join(pieces)


def questions_from(source):
    matches = list(re.finditer(r"^## ([1-8])\. (.+)$", source, re.M))
    return [(int(match[1]), match[1] + ". " + match[2],
             source[match.end():matches[index + 1].start() if index + 1 < len(matches) else len(source)].strip())
            for index, match in enumerate(matches)]


def labeled_work(label, lines):
    return '<div class="response-label">' + label + "</div>" + work(lines)


def source_graph():
    return grid([(lambda x: x + 4, -4, -2),
                 (lambda x: -2 * x - 2, -2, 0),
                 (lambda x: x - 2, 0, 4)],
                [(-4, 0, False), (-2, 2, False), (0, -2, False),
                 (2, 0, False), (4, 2, False)], wide=True)


def blank_graph(number):
    if number == 1:
        return grid(wide=True, ymax=8, xmax=8)
    if number == 7:
        return grid(wide=True, ymax=24, ystep=4)
    if number == 8:
        return grid(wide=True, ymax=12, ystep=2)
    return grid(wide=True)


def key_graph(number):
    if number == 1:
        return grid([(lambda x: (x + 3) / (x - 1), -8, .98),
                     (lambda x: (x + 3) / (x - 1), 1.02, 8)],
                    [(-3, 0, False), (0, -3, False), (3, 3, False)],
                    [(None, 1), (0, 1)], ymax=8, xmax=8)
    if number == 4:
        return grid([(lambda x: (x - 2) ** 2 - 3, -6, 2),
                     (lambda x: 2 - math.sqrt(x + 3), -3, 6)],
                    [(2, -3, False), (-3, 2, False), (-1, 6, False),
                     (6, -1, False), (2 - math.sqrt(3), 0, False),
                     (0, 1, False), (1, 0, False), (0, 2 - math.sqrt(3), False)],
                    [(1, 0)], wide=True)
    if number == 5:
        return grid([(lambda x: x + 2, -4, -1),
                     (lambda x: (x - 1) ** 2, -1, 3)],
                    [(-4, -2, False), (-1, 1, True), (-1, 4, False),
                     (1, 0, False), (3, 4, False)], wide=True)
    if number == 6:
        return source_graph()
    if number == 7:
        return grid([(lambda x: -(x + 2) ** 2 * (x - 1) * (x - 3), -6, 6)],
                    [(-2, 0, False), (1, 0, False), (3, 0, False),
                     (0, -12, False), (2, 16, False)],
                    wide=True, ymax=24, ystep=4)
    if number == 8:
        return grid([(lambda x: (x * x + 1) / (x + 2), -6, -2.02),
                     (lambda x: (x * x + 1) / (x + 2), -1.98, 6)],
                    [(2, 1.25, True), (0, .5, False)],
                    [(None, -2), (1, -2)], wide=True, ymax=12, ystep=2)
    return ""


def student_pages(questions):
    pages = []
    for number, title, body in questions:
        body = re.sub(r"\n\nGraph requirement:[\s\S]*$", "", body)
        content = markdown(body, correction_table=number == 1)
        if number == 1:
            pages.append((title, content + labeled_work("Direction justification and input-output pairs:", 4)))
            pages.append(("1. Graph and remaining reasoning / continued",
                          blank_graph(1) + labeled_work("Distant ends and transformations:", 3)
                          + labeled_work("Solve F(x)=3 and check in the original rule:", 3)))
        elif number == 2:
            pages.append((title, content + labeled_work("Models and meaningful domains:", 5)
                          + labeled_work("Percentages, target conclusions and checks:", 8)))
        elif number == 3:
            pages.append((title, content + labeled_work("Inverse, domains/ranges and recovered input:", 6)
                          + labeled_work("Both symbolic checks:", 6)))
        elif number == 4:
            pages.append((title, content + '<div class="pair"><div>'
                          + labeled_work("Inverse rules, sets and comparison:", 9)
                          + "</div><div>" + blank_graph(4) + "</div></div>"
                          + labeled_work("Preimages, explanation and transformations:", 3)))
        elif number == 5:
            pages.append((title, content + '<div class="pair"><div>'
                          + labeled_work("Evaluations, domain and range:", 8)
                          + "</div><div>" + blank_graph(5) + "</div></div>"
                          + labeled_work("All candidates, branch checks and retained solutions:", 5)))
        elif number == 6:
            content = content.replace("</div>", "</div>" + source_graph(), 1)
            pages.append((title, content + labeled_work("Intercepts, nested evaluations, domain and all solutions:", 8)))
        elif number == 7:
            pages.append((title, content + '<div class="pair"><div>'
                          + labeled_work("Rule, coefficient, ends and sign intervals:", 9)
                          + "</div><div>" + blank_graph(7) + "</div></div>"
                          + labeled_work("Calculate p(2):", 3)))
        else:
            pages.append((title, content + '<div class="pair"><div>'
                          + labeled_work("Equivalence, domains, holes and asymptotes:", 9)
                          + "</div><div>" + blank_graph(8) + "</div></div>"
                          + labeled_work("Division, distant ends and crossing justification:", 4)))
    return pages


def key_pages(questions):
    return [(title, markdown(body) + key_graph(number))
            for number, title, body in questions]


def document(pages, key=False):
    sheets = []
    for index, (title, body) in enumerate(pages, 1):
        instructions = ""
        if index == 1:
            instructions = p("Worked solutions and suggested practice scoring; not a school grade scale.") if key else (
                p("Name: __________________________  Date: ____________")
                + p("60 minutes | 8 questions | 100 points | Four-function calculator")
                + p("Show requested reasoning. Exact answers unless a percentage is requested. Reserve six minutes to check."))
        sheets.append('<section class="sheet"><header><div style="font-size:8pt">MOTOR CITY MATH | STANDARD PRECALCULUS</div>'
                      + "<h1>Final practice" + (" / worked key" if key else "") + "</h1>" + instructions
                      + "</header><main><h2>" + escape(title) + "</h2>" + body + "</main>"
                      + '<footer><span>November 22, 2026 | Revision 2 | '
                      + ("Worked key" if key else "Student copy") + "</span><span>"
                      + f"{index} / {len(pages)}</span></footer></section>")
    css = (ASSETS / "katex.min.css").read_text(encoding="utf-8")
    def font(match):
        asset = ASSETS / match[1].strip("'\"")
        mime = "font/woff2" if asset.suffix == ".woff2" else "font/woff" if asset.suffix == ".woff" else "font/ttf"
        return "url(data:" + mime + ";base64," + b64encode(asset.read_bytes()).decode() + ")"
    css = re.sub(r"url\(([^)]+)\)", font, css)
    js = (ASSETS / "katex.min.js").read_text(encoding="utf-8")
    return '<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Practice revision 2' + (
        " key" if key else "") + "</title><style>" + css + CSS + EXTRA_CSS + '</style></head><body class="' + (
        "key" if key else "student") + '">' + "".join(sheets) + "<script>" + js + """</script><script>
for(const n of document.querySelectorAll("[data-math]")){
katex.render(n.dataset.math,n,{displayMode:n.dataset.display==="true",throwOnError:true,trust:false,output:"html"});
}document.fonts.ready.then(()=>document.documentElement.dataset.fontsReady="true");
</script></body></html>"""


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source-dir", type=Path)
    args = parser.parse_args()
    OUT.mkdir(parents=True, exist_ok=True)
    if args.source_dir:
        student = (args.source_dir / "Kai_Practice_Workflow_Trial_R2.md").read_text(encoding="utf-8").replace("\r\n", "\n")
        key = (args.source_dir / "Kai_Practice_Workflow_Trial_R2_KEY.md").read_text(encoding="utf-8").replace("\r\n", "\n")
        student = "# Approved practice - revision 2\n\n" + student[student.index("## 1."):].split("## Parent-only baseline")[0].strip() + "\n"
        key = key.split("## Review record")[0].strip() + "\n"
        key = key.replace("# Proposed revision 2 - separate parent key", "# Approved revision 2 - worked key").replace(
            "Private draft; not a school rubric.", "Suggested practice rubric; not a school rubric.")
        (OUT / "questions.md").write_text(student, encoding="utf-8")
        (OUT / "key.md").write_text(key, encoding="utf-8")
    else:
        student = (OUT / "questions.md").read_text(encoding="utf-8")
        key = (OUT / "key.md").read_text(encoding="utf-8")
    questions = questions_from(student)
    answers = questions_from(key)
    if len(questions) != 8 or len(answers) != 8 or sum(POINTS) != 100:
        raise ValueError("Expected approved eight-question, 100-point packet")
    for key_flag, name, pages in [
        (False, "Practice_2026-11-22_R2", student_pages(questions)),
        (True, "Practice_2026-11-22_R2_KEY", key_pages(answers)),
    ]:
        (OUT / (name + ".html")).write_text(document(pages, key_flag), encoding="utf-8")
        print(f"{name}: {len(pages)} pages")


if __name__ == "__main__":
    main()
