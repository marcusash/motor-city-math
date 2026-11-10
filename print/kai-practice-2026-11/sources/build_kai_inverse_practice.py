from fractions import Fraction as F
from math import isclose, sqrt
from pathlib import Path
import re
import shutil
import winreg

import pypdfium2 as pdfium
from reportlab.lib import colors
from reportlab.pdfgen import canvas

from build_kai_practice import paragraph, work_box


ROOT = Path(__file__).parent
FILENAME = "Kai_Inverse_Functions_Practice_5_Problems.pdf"
OUTPUT = ROOT / FILENAME
LEFT, RIGHT = 44, 568
WIDTH = RIGHT - LEFT
TABLE = [(-4, 9), (3, -2), (0, -4), (-2, 6), (9, 0), (6, 3)]
DESIGN = {
    "source_question_groups": [[1], [2], [3, 4], [5], [6]],
    "difficulty": [1, 2, 1, 2, 2],
    "changes": [
        "Map scale instead of student/bus counts; written inverse interpretation.",
        "A whole linear numerator over a denominator instead of slope-intercept form.",
        "A vertical non-patterned table; inverse lookup plus an inverse graph point.",
        "Increasing battery energy instead of draining water; fraction of remaining capacity.",
        "A decreasing square-root function instead of an increasing square-root function.",
    ],
    "research_sources": [
        "https://ies.ed.gov/ncee/wwc/PracticeGuide/1",
        "https://ies.ed.gov/ncee/wwc/PracticeGuide/20",
    ],
}


def inverse(name, variable=None):
    label = f"<i>{name}</i><super>&nbsp;-1</super>"
    if variable is not None:
        label += f"({variable})"
    return label


def header(c, number):
    c.setStrokeColor(colors.black)
    c.setLineWidth(2)
    c.line(LEFT, 752, RIGHT, 752)
    paragraph(c, "MOTOR CITY MATH | ALGEBRA 2", LEFT, 742, size=9, bold=True)
    paragraph(c, "Inverse Functions: Practice Test", LEFT, 723, size=18, bold=True)
    paragraph(c, "Name: __________________________________  Date: ______________",
              LEFT, 691, size=10)
    if number == 1:
        paragraph(c, "5 problems | About 25 minutes | Four-function calculator allowed",
                  LEFT, 669, size=10)
        paragraph(c, "Show your work. Write your own explanations and include units in context.",
                  LEFT, 651, size=10)
        qtop = 619
    else:
        qtop = 659
    c.setFillColor(colors.Color(0.94, 0.94, 0.94))
    c.rect(LEFT, qtop - 30, WIDTH, 30, fill=1, stroke=0)
    c.setFillColor(colors.black)
    paragraph(c, f"{number}.", LEFT + 10, qtop - 7,
              WIDTH - 20, 12, bold=True)
    c.setLineWidth(0.5)
    c.line(LEFT, 43, RIGHT, 43)
    paragraph(c, "Inverse Functions Practice | Student copy",
              LEFT, 35, WIDTH - 85, 8)
    c.setFont("Helvetica", 8)
    c.drawRightString(RIGHT, 24, f"Page {number} of 5")
    return qtop - 44


def linear_fraction(c):
    paragraph(c, "<i>f</i>(<i>x</i>) =", 170, 567, 85, 18)
    paragraph(c, "3<i>x</i> - 8", 283, 583, 135, 18, align=1)
    c.setLineWidth(0.8)
    c.line(285, 557, 416, 557)
    paragraph(c, "2", 283, 550, 135, 18, align=1)


def radical(c):
    paragraph(c, "<i>r</i>(<i>x</i>) =", 170, 568, 100, 19)
    paragraph(c, "18 - 3<i>x</i>", 293, 568, 125, 19, align=1)
    c.setLineWidth(1)
    path = c.beginPath()
    path.moveTo(270, 550)
    path.lineTo(276, 554)
    path.lineTo(283, 537)
    path.lineTo(292, 571)
    path.lineTo(418, 571)
    c.drawPath(path)


def table(c):
    x, top, col_width, row_height = 169, 566, 137, 25
    c.setStrokeColor(colors.Color(0.4, 0.4, 0.4))
    c.setLineWidth(0.6)
    for row in range(7):
        y = top - (row + 1) * row_height
        if row == 0:
            c.setFillColor(colors.Color(0.94, 0.94, 0.94))
            c.rect(x, y, 2 * col_width, row_height, fill=1, stroke=0)
            c.setFillColor(colors.black)
        c.rect(x, y, col_width, row_height, fill=0, stroke=1)
        c.rect(x + col_width, y, col_width, row_height, fill=0, stroke=1)
        values = ("<i>x</i>", "<i>h</i>(<i>x</i>)") if row == 0 else TABLE[row - 1]
        for column, value in enumerate(values):
            paragraph(c, str(value), x + column * col_width, y + 20,
                      col_width, 11, bold=row == 0, align=1)
    c.setStrokeColor(colors.black)


def validate_math():
    coverage = sorted(q for group in DESIGN["source_question_groups"] for q in group)
    assert coverage == [1, 2, 3, 4, 5, 6]
    assert len(DESIGN["difficulty"]) == 5

    scale = F(15, 2) / 18
    assert F(15, 2) / scale == 18

    def f(x):
        return (3 * F(x) - 8) / 2

    def g(x):
        return (2 * F(x) + 8) / 3

    for x in [-12, -3, 0, F(1, 2), 4, 11]:
        assert g(f(x)) == x
        assert f(g(x)) == x
    assert F(3, 2) * F(2, 3) == 1
    assert F(2, 3) * (-4) + F(8, 3) == 0

    assert len({x for x, _ in TABLE}) == len(TABLE)
    assert len({y for _, y in TABLE}) == len(TABLE)
    assert {x for x, _ in TABLE} == {y for _, y in TABLE}
    h = dict(TABLE)
    h_inverse = {y: x for x, y in TABLE}
    assert h_inverse[-4] == 0
    assert h[-4] == 9
    assert h_inverse[-4] != h[-4]
    assert h[-2] == 6
    assert (h[-2], -2) == (6, -2)

    def energy(t):
        return 18 + F(3, 2) * t

    def charging_time(e):
        return F(2, 3) * (e - 18)

    for t in [0, 4, 12, 24, 32, 48]:
        assert charging_time(energy(t)) == t
        assert 18 <= energy(t) <= 90
    assert charging_time(90) == 48
    additional_energy = F(2, 3) * (90 - 18)
    assert additional_energy == 48
    assert charging_time(18 + additional_energy) == 32
    assert energy(32) - energy(0) == F(2, 3) * (energy(48) - energy(0))

    # r(x)=sqrt(18-3x); r^{-1}(x)=6-x^2/3 for x>=0.
    def r(x):
        return sqrt(18 - 3 * x)

    def r_inverse(x):
        return 6 - x*x/3

    for x in [-21, -6, 0, 3, 5, 6]:
        assert isclose(r_inverse(r(x)), x, abs_tol=1e-10)
    for y in [0, 0.5, 1, 2, 4, 9]:
        assert r_inverse(y) <= 6
        assert isclose(r(r_inverse(y)), y, abs_tol=1e-10)
    assert r(6) == 0
    assert r(r_inverse(-2)) == 2


def build():
    validate_math()
    c = canvas.Canvas(str(OUTPUT), pagesize=(612, 792), pageCompression=1)
    c.setTitle("Kai - Inverse Functions Practice - 5 Problems")
    c.setAuthor("Motor City Math")
    c.setSubject("Inverse meaning, linear inverses, tables, contexts, and square-root inverses")

    top = header(c, 1)
    paragraph(c, "On a fixed-scale trail map, <i>M</i>(<i>d</i>) gives the map distance in centimeters",
              LEFT, top)
    paragraph(c, "for an actual trail distance of <i>d</i> kilometers. Suppose",
              LEFT, top - 18)
    paragraph(c, inverse("M", "7.5") + " = 18",
              164, 490, 284, 21, align=1)
    paragraph(c, "Write a complete-sentence interpretation of this statement. Identify the",
              LEFT, 423, bold=True)
    paragraph(c, "quantity and units represented by each number.",
              LEFT, 407, bold=True)
    work_box(c, 370, 85, label="Answer", ruled=True)
    c.showPage()

    top = header(c, 2)
    paragraph(c, "Let <i>f</i> be the function below.", LEFT, top)
    linear_fraction(c)
    paragraph(c, "Find an equation for <i>g</i>, the inverse of <i>f</i>. Show your algebra.",
              LEFT, 490, bold=True)
    work_box(c, 455, 131, label="Work")
    paragraph(c, "<i>g</i>(<i>x</i>) = ___________________________________________________",
              LEFT, 96, size=13, bold=True)
    c.showPage()

    top = header(c, 3)
    paragraph(c, "The table gives selected values of a one-to-one function <i>h</i>.",
              LEFT, top)
    table(c)
    paragraph(c, "(a) Find " + inverse("h", "-4") + ". Explain how the table supports your answer.",
              LEFT, 365, bold=True)
    work_box(c, 333, 237, label="Answer")
    paragraph(c, "(b) Use the row where <i>x</i> = -2 to write the corresponding ordered pair on",
              LEFT, 215, bold=True)
    paragraph(c, "the graph of " + inverse("h") + ". Explain your reasoning.",
              LEFT, 197, bold=True)
    work_box(c, 165, 65, label="Answer")
    c.showPage()

    top = header(c, 4)
    paragraph(c, "A portable battery initially stores 18 watt-hours of energy. While charging,",
              LEFT, top)
    paragraph(c, "its stored energy increases by 1.5 watt-hours per minute until it reaches 90.",
              LEFT, top - 18)
    paragraph(c, "<i>E</i>(<i>t</i>) = 18 + 1.5<i>t</i>",
              164, 565, 284, 18, align=1)
    paragraph(c, "Here <i>t</i> is minutes since charging began and <i>E</i>(<i>t</i>) is energy in watt-hours.",
              LEFT, 533)
    paragraph(c, "(a) Find a formula for " + inverse("E") + ". Show your algebra.",
              LEFT, 502, bold=True)
    work_box(c, 479, 399, label="Work")
    paragraph(c, "(b) For " + inverse("E") + ", identify the input and output quantities, including units.",
              LEFT, 380, bold=True)
    work_box(c, 356, 294, label="Answer")
    paragraph(c, "(c) How long does it take to fully charge the battery? Show your work.",
              LEFT, 275, bold=True)
    work_box(c, 251, 196, label="Work")
    paragraph(c, "(d) At what time has it gained two-thirds of the additional energy needed",
              LEFT, 177, bold=True)
    paragraph(c, "to become fully charged? Show your work.", LEFT, 161, bold=True)
    work_box(c, 135, 59, label="Work")
    c.showPage()

    top = header(c, 5)
    paragraph(c, "Let <i>r</i> be the function below.", LEFT, top)
    radical(c)
    paragraph(c, "(a) Find " + inverse("r") + " and state its domain. Show your algebra.",
              LEFT, 511, bold=True)
    work_box(c, 482, 334, label="Work")
    paragraph(c, "(b) What should each expression below equal if the functions are inverses?",
              LEFT, 314, bold=True)
    paragraph(c, "Write your answers first. Then verify each with algebra and state the allowed",
              LEFT, 298, bold=True)
    paragraph(c, "<i>x</i>-values.", LEFT, 282, bold=True)
    work_box(c, 263, 168,
             label="<i>r</i>(" + inverse("r", "<i>x</i>") + ") = __________________")
    work_box(c, 145, 59,
             label=inverse("r", "<i>r</i>(<i>x</i>)") + " = __________________")
    c.showPage()
    c.save()

    document = pdfium.PdfDocument(OUTPUT)
    assert len(document) == 5
    texts = []
    for i in range(5):
        page = document[i]
        assert page.get_size() == (612.0, 792.0)
        text = page.get_textpage().get_text_range()
        assert re.search(rf"(?m)^{i+1}\.\s*$", text)
        assert f"Page {i+1} of 5" in text
        assert "answer key" not in text.lower()
        assert not re.search(r"(?m)^[ABCD]\.", text)
        texts.append(text)
        page.render(scale=1.5).to_pil().save(ROOT / f"kai-inverse-final-page-{i+1}.png")
    assert "fixed-scale trail map" in texts[0]
    assert "table" in texts[2] and "ordered pair" in texts[2]
    assert "two-thirds of the additional energy" in texts[3]
    assert "What should each expression below equal" in texts[4]
    assert "Write your answers first" in texts[4]
    assert "state the allowed" in texts[4]
    assert texts[4].count("= __________________") == 2
    assert "= x" not in texts[4]
    assert "symbolically" not in texts[4]
    all_text = "\n\n".join(texts)
    for old_title in [
        "Interpret inverse notation",
        "Find an inverse algebraically",
        "Use a table and an ordered pair",
        "Build and interpret an inverse model",
        "Invert and verify a radical function",
    ]:
        assert old_title not in all_text
    for old_context in ["buses", "students to school", "sink", "stopper", "quarts"]:
        assert old_context not in all_text.lower()
    (ROOT / "kai-inverse-final-extracted.txt").write_text(all_text, encoding="utf-8")
    document.close()
    print("PASS: all six source skills covered in five original problems.")
    print("PASS: linear inverse, lookup, inverse point, battery model, and radical compositions.")
    print(f"Generated five letter-size pages with no choices or answer key: {OUTPUT}")


def publish(expected_sha256=None):
    import os
    with winreg.OpenKey(
        winreg.HKEY_CURRENT_USER,
        r"Software\Microsoft\Windows\CurrentVersion\Explorer\User Shell Folders",
    ) as key:
        folder, _ = winreg.QueryValueEx(key, "{374DE290-123F-4565-9164-39C4925E467B}")
    destination = Path(os.path.expandvars(folder)) / FILENAME
    assert destination.parent.is_dir()
    if destination.exists():
        import hashlib
        current_hash = hashlib.sha256(destination.read_bytes()).hexdigest()
        if expected_sha256 is None or current_hash != expected_sha256.lower():
            raise FileExistsError(f"Existing file changed or overwrite not authorized: {destination}")
    shutil.copy2(OUTPUT, destination)
    assert OUTPUT.read_bytes() == destination.read_bytes()
    print(f"Saved verified copy: {destination}")


if __name__ == "__main__":
    import sys
    if "--publish" in sys.argv:
        expected = None
        if "--replace-sha256" in sys.argv:
            expected = sys.argv[sys.argv.index("--replace-sha256") + 1]
        publish(expected)
    else:
        build()
