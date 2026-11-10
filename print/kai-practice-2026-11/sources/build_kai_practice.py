from fractions import Fraction
from math import isfinite
from pathlib import Path
import re
import shutil
import winreg

import pypdfium2 as pdfium
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph


ROOT = Path(__file__).parent
FILENAME = "Kai_Rational_Functions_Practice_5_Problems.pdf"
OUTPUT = ROOT / FILENAME
PAGE_W, PAGE_H = 612, 792
LEFT, RIGHT = 44, 568
WIDTH = RIGHT - LEFT
TEXT_REGIONS = []


def paragraph(c, text, x, top, width=WIDTH, size=11, bold=False, align=0):
    style = ParagraphStyle(
        "body",
        fontName="Helvetica-Bold" if bold else "Helvetica",
        fontSize=size,
        leading=size * 1.4,
        textColor=colors.black,
        alignment=align,
    )
    p = Paragraph(text, style)
    _, height = p.wrap(width, PAGE_H)
    assert LEFT - 1 <= x and x + width <= RIGHT + 1
    min_y = 20 if top == 35 else 40
    assert top <= 754 and top - height >= min_y, (text, top, height)
    TEXT_REGIONS.append((c.getPageNumber(), x, top - height, width, height))
    p.drawOn(c, x, top - height)
    return top - height


def math_html(tex):
    text = re.sub(r"\^([23])", r"<super>\1</super>", tex)
    return re.sub(r"\b([xhtVCfg])\b", r"<i>\1</i>", text)


def fraction(c, label, numerator, denominator, top):
    x, frac_width = 228, 230
    paragraph(c, math_html(label) + " =", 162, top - 12, 64, 17)
    paragraph(c, math_html(numerator), x, top, frac_width, 17, align=TA_CENTER)
    c.setLineWidth(0.8)
    c.line(x + 5, top - 26, x + frac_width - 5, top - 26)
    paragraph(c, math_html(denominator), x, top - 31, frac_width, 17, align=TA_CENTER)


def page_header(c, number, title, continued=False):
    c.setStrokeColor(colors.black)
    c.setLineWidth(2)
    c.line(LEFT, 752, RIGHT, 752)
    paragraph(c, "MOTOR CITY MATH | ALGEBRA 2", LEFT, 742, size=9, bold=True)
    paragraph(c, "Rational Functions: Practice Test", LEFT, 723, size=18, bold=True)
    paragraph(c, "Name: __________________________________  Date: ______________",
              LEFT, 691, size=10)
    if number == 1:
        paragraph(c, "5 problems | About 25 minutes | Four-function calculator allowed",
                  LEFT, 669, size=10)
        paragraph(c, "Show your work and explain your choices. Use the answer space provided.",
                  LEFT, 651, size=10)
        qtop = 619
    else:
        qtop = 659
    c.setFillColor(colors.Color(0.94, 0.94, 0.94))
    c.rect(LEFT, qtop - 30, WIDTH, 30, fill=1, stroke=0)
    c.setFillColor(colors.black)
    suffix = " (continued)" if continued else ""
    paragraph(c, f"Problem {number}{suffix}. {title}", LEFT + 10, qtop - 7,
              WIDTH - 20, 12, bold=True)
    c.setLineWidth(0.5)
    c.line(LEFT, 43, RIGHT, 43)
    paragraph(c, "Rational Functions Practice | Student copy",
              LEFT, 35, WIDTH - 85, 8)
    c.setFont("Helvetica", 8)
    c.drawRightString(RIGHT, 24, f"Page {c.getPageNumber()} of 6")
    return qtop - 44


def work_box(c, top, bottom, label="Work and reasoning", ruled=False):
    paragraph(c, label, LEFT, top, size=10, bold=True)
    c.setStrokeColor(colors.Color(0.65, 0.65, 0.65))
    c.setLineWidth(0.5)
    c.rect(LEFT, bottom, WIDTH, top - 20 - bottom, fill=0, stroke=1)
    if ruled:
        c.setStrokeColor(colors.Color(0.83, 0.83, 0.83))
        y = top - 48
        while y > bottom + 12:
            c.line(LEFT + 10, y, RIGHT - 10, y)
            y -= 26
    c.setStrokeColor(colors.black)


def options(c, items, top):
    y = top
    for letter, text in zip("ABCD", items):
        y = paragraph(c, f"<b>{letter}.</b> {text}", LEFT + 8, y, WIDTH - 16) - 7
    return y


def axes(c, x, y, width, height, xmin, xmax, ymin, ymax, label_every=2):
    def point(a, b):
        return (
            x + (a - xmin) * width / (xmax - xmin),
            y + (b - ymin) * height / (ymax - ymin),
        )

    c.setStrokeColor(colors.Color(0.82, 0.82, 0.82))
    c.setLineWidth(0.35)
    for a in range(xmin, xmax + 1):
        px, _ = point(a, 0)
        c.line(px, y, px, y + height)
    for b in range(ymin, ymax + 1):
        _, py = point(0, b)
        c.line(x, py, x + width, py)
    c.setStrokeColor(colors.black)
    c.setLineWidth(0.9)
    x0, y0 = point(0, 0)
    c.line(x, y0, x + width, y0)
    c.line(x0, y, x0, y + height)
    for px, py, dx, dy in [
        (x + width, y0, -4, 2),
        (x, y0, 4, 2),
        (x0, y + height, 2, -4),
        (x0, y, 2, 4),
    ]:
        path = c.beginPath()
        path.moveTo(px, py)
        path.lineTo(px + dx, py + dy)
        path.moveTo(px, py)
        path.lineTo(px + (dx if dy == 2 else -dx), py + (-dy if dy == 2 else dy))
        c.drawPath(path)
    c.setFont("Helvetica", 8)
    for a in range(xmin, xmax + 1):
        if a and a % label_every == 0:
            px, _ = point(a, 0)
            text = str(a)
            tw = c.stringWidth(text, "Helvetica", 8)
            c.setFillColor(colors.white)
            c.rect(px - tw / 2 - 1, y0 - 15, tw + 2, 10, stroke=0, fill=1)
            c.setFillColor(colors.black)
            c.drawCentredString(px, y0 - 13, text)
    for b in range(ymin, ymax + 1):
        if b and b % label_every == 0:
            _, py = point(0, b)
            text = str(b)
            tw = c.stringWidth(text, "Helvetica", 8)
            c.setFillColor(colors.white)
            c.rect(x0 - tw - 6, py - 4, tw + 2, 10, stroke=0, fill=1)
            c.setFillColor(colors.black)
            c.drawRightString(x0 - 5, py - 2, text)
    c.drawString(x + width + 7, y0 - 3, "x")
    c.drawString(x0 + 5, y + height + 6, "y")
    c.drawString(x0 + 4, y0 + 4, "0")
    return point


def graph(c, function, poles, x, y, width, height, bounds):
    xmin, xmax, ymin, ymax = bounds
    point = axes(c, x, y, width, height, xmin, xmax, ymin, ymax)
    c.saveState()
    clip = c.beginPath()
    clip.rect(x, y, width, height)
    c.clipPath(clip, stroke=0)
    c.setStrokeColor(colors.Color(0.4, 0.4, 0.4))
    c.setLineWidth(0.8)
    c.setDash(4, 4)
    for pole in poles:
        px, _ = point(pole, 0)
        c.line(px, y, px, y + height)
    c.setDash()
    c.setStrokeColor(colors.black)
    c.setLineWidth(1.7)
    edges = [xmin, *poles, xmax]
    for a, b in zip(edges, edges[1:]):
        lo = a + (0.001 if a in poles else 0)
        hi = b - (0.001 if b in poles else 0)
        path = c.beginPath()
        drawing = False
        for i in range(1601):
            t = lo + (hi - lo) * i / 1600
            value = function(t)
            assert isfinite(value)
            px, py = point(t, max(ymin - 5, min(ymax + 5, value)))
            if not drawing:
                path.moveTo(px, py)
                drawing = True
            else:
                path.lineTo(px, py)
        c.drawPath(path)
    c.restoreState()


def validate_math():
    for x in [-12, -3, 0, 1, 3, 10]:
        d = x * x - 4 * x + 2
        assert Fraction(x**3 + 3*x*x - 2*x + 7, d) == (
            x + 7 + Fraction(24*x - 7, d)
        )
    concentration = Fraction(420, 4**2 + 4*4 + 24)
    assert concentration == Fraction(15, 2)
    assert all(t*t + 4*t + 24 > 0 for t in range(13))
    def simplified(x):
        return Fraction(3, 4) * (x + 2) / (x - 2)

    for x in [-5, -3, -2, 0, 1, 3, 5]:
        numerator = 6*x*x + 3*x - 18
        denominator = 8*x*x - 28*x + 24
        assert numerator == 3*(2*x - 3)*(x + 2)
        assert denominator == 4*(2*x - 3)*(x - 2)
        assert Fraction(numerator, denominator) == simplified(x)
        assert simplified(x) - Fraction(3, 4) == Fraction(3, x-2)
    hole_x = Fraction(3, 2)
    assert 8*hole_x**2 - 28*hole_x + 24 == 0
    assert simplified(hole_x) == Fraction(-21, 4)
    assert simplified(0) == Fraction(-3, 4)
    assert simplified(-2) == 0
    assert Fraction(6, 8) == Fraction(3, 4)
    assert -6 < hole_x < 6 and -6 < simplified(hole_x) < 6
    # Graph sources: h(x)=-x+1+4x/(x^2-4), k(x)=3x/4-2+6/(x-1).
    for x in [-10000, 10000]:
        assert abs(4*x/(x*x-4)) < 0.001
        assert abs(6/(x-1)) < 0.001
    assert -(-2)**3 + (-2)**2 + 8*(-2) - 4 != 0
    assert -(2)**3 + (2)**2 + 8*(2) - 4 != 0
    assert Fraction(3, 4) - Fraction(11, 4) + 8 == 6


def build():
    validate_math()
    c = canvas.Canvas(str(OUTPUT), pagesize=(PAGE_W, PAGE_H), pageCompression=1)
    c.setTitle("Kai - Rational Functions Practice - 5 Problems")
    c.setAuthor("Motor City Math")
    c.setSubject("Slant asymptotes, rational-function graphs, and interpreting rates")

    top = page_header(c, 1, "Read and explain the graph")
    paragraph(c, "The graph of a rational function <i>h</i> is shown below.",
              LEFT, top)
    graph(c, lambda x: -x + 1 + 4*x/(x*x-4), [-2, 2],
          158, 300, 296, 238, (-8, 8, -10, 10))
    paragraph(c, "(a) Domain (interval notation): _____________________________________",
              LEFT, 279, size=11, bold=True)
    paragraph(c, "(b) Explain what happens near each excluded <i>x</i>-value and as you move",
              LEFT, 249, size=11, bold=True)
    paragraph(c, "far to the left and far to the right on the graph.",
              LEFT, 233, size=11, bold=True)
    work_box(c, 205, 59, label="Your explanation")
    c.showPage()

    top = page_header(c, 2, "Calculate a slant asymptote")
    paragraph(c, "Use polynomial long division to find the slant asymptote.",
              LEFT, top)
    paragraph(c, "Show all your work.", LEFT, top - 18)
    fraction(c, "f(x)", "x^3 + 3x^2 - 2x + 7", "x^2 - 4x + 2", 567)
    work_box(c, 475, 120, label="Long division")
    paragraph(c, "Slant asymptote: ______________________________________________",
              LEFT, 90, size=12, bold=True)
    c.showPage()

    top = page_header(c, 3, "Apply a concentration model")
    paragraph(c, "A filter removes a dissolved chemical from a tank of water.",
              LEFT, top)
    paragraph(c, "The chemical's concentration in the water is modeled by",
              LEFT, top - 18)
    fraction(c, "C(t)", "420", "t^2 + 4t + 24", 563)
    paragraph(c, "The model applies for the first 12 minutes. Here <i>t</i> is minutes since the",
              LEFT, 489)
    paragraph(c, "filter started, and <i>C</i>(<i>t</i>) is concentration in milligrams per liter (mg/L).",
              LEFT, 471)
    paragraph(c, "(a) Explain why <i>C</i> is a rational function.", LEFT, 443, bold=True)
    work_box(c, 419, 347, label="Your explanation", ruled=True)
    paragraph(c, "(b) Calculate <i>C</i>(4). Show the substitution and arithmetic.",
              LEFT, 326, bold=True)
    work_box(c, 298, 195, label="Your calculation")
    paragraph(c, "(c) Write a complete-sentence interpretation of <i>C</i>(4). Explain what the",
              LEFT, 174, bold=True)
    paragraph(c, "input and output mean in this situation. Include units.",
              LEFT, 158, bold=True)
    work_box(c, 133, 59, label="Your interpretation")
    c.showPage()

    top = page_header(c, 4, "Connect the graph to degrees")
    paragraph(c, "The graph below represents a rational function <i>k</i>, written in reduced form.",
              LEFT, top)
    graph(c, lambda x: 0.75*x - 2 + 6/(x-1), [1],
          167, 315, 288, 260, (-8, 10, -14, 10))
    paragraph(c, "Which relationship between the polynomial degrees must be true?",
              LEFT, 292, bold=True)
    bottom = options(c, [
        "The denominator degree is one greater than the numerator degree.",
        "The numerator and denominator have equal degrees.",
        "The numerator degree is two greater than the denominator degree.",
        "The numerator degree is one greater than the denominator degree.",
    ], 265)
    paragraph(c, "Circle one answer. Explain how the graph supports your choice.",
              LEFT, bottom - 4, size=10)
    work_box(c, bottom - 30, 59, ruled=True)
    c.showPage()

    top = page_header(c, 5, "Analyze and sketch")
    paragraph(c, "For the function below, factor and simplify. Keep the original restrictions.",
              LEFT, top)
    fraction(c, "g(x)", "6x^2 + 3x - 18", "8x^2 - 28x + 24", 575)
    paragraph(c, "Factoring / simplified form: __________________________________________",
              LEFT, 492, size=10)
    paragraph(c, "________________________________________________________________",
              LEFT, 468, size=10)
    rows = [
        ("Domain restrictions", "x-intercept(s)"),
        ("Vertical asymptote(s)", "y-intercept"),
        ("Horizontal asymptote(s)", "Hole coordinate(s)"),
    ]
    for i, (a, b) in enumerate(rows):
        y = 438 - 31*i
        paragraph(c, a + ": __________________", LEFT, y, 252, 10)
        paragraph(c, b + ": __________________", 314, y, 254, 10)
    paragraph(c, "Use the full-size coordinate grid on the next page for your sketch.",
              LEFT, 336, size=10, bold=True)
    work_box(c, 306, 65, label="Additional factoring, calculations, and graph planning")
    c.showPage()

    top = page_header(c, 5, "Your graph", continued=True)
    paragraph(c, "Sketch the function from Problem 5. Label the intercepts, draw asymptotes",
              LEFT, top, size=11)
    paragraph(c, "as dashed lines, and mark any holes with open circles.",
              LEFT, top - 18, size=11)
    paragraph(c, "Each square represents 1 unit on both axes.",
              LEFT, top - 46, size=10)
    axes(c, 72, 72, 468, 468, -6, 6, -6, 6, label_every=1)
    c.showPage()
    c.save()

    document = pdfium.PdfDocument(OUTPUT)
    assert len(document) == 6
    texts = []
    for i in range(6):
        page = document[i]
        assert page.get_size() == (612.0, 792.0)
        text = page.get_textpage().get_text_range()
        if i < 5:
            assert f"Problem {i+1}." in text
        else:
            assert "Problem 5 (continued)." in text
        assert f"Page {i+1} of 6" in text
        assert "answer key" not in text.lower()
        texts.append(text)
        page.render(scale=1.5).to_pil().save(ROOT / f"kai-final-page-{i+1}.png")
    (ROOT / "kai-final-extracted.txt").write_text("\n\n".join(texts), encoding="utf-8")
    document.close()
    print(f"Generated and structurally verified: {OUTPUT}")
    assert "Circle one answer" not in texts[1]
    assert "y = x + 7" not in texts[1]
    assert not re.search(r"(?m)^[ABCD]\.", texts[1])
    assert "hint" not in texts[1].lower()
    assert "Domain (interval notation)" in texts[0]
    assert "Explain what happens near each excluded" in texts[0]
    assert "far to the left and far to the right" in texts[0]
    assert "Circle all that apply" not in texts[0]
    assert "Circle one answer" not in texts[0]
    assert not re.search(r"(?m)^[ABCD]\.", texts[0])
    assert "A filter removes a dissolved chemical" in texts[2]
    assert "milligrams per liter" in texts[2]
    assert "input and output mean" in texts[2]
    assert "complete-sentence interpretation" in texts[2]
    assert "visitors" not in texts[2].lower()
    assert "midnight" not in texts[2].lower()
    assert not re.search(r"(?m)^[ABCD]\.", texts[2])
    print("Five problems on six letter-size pages; full-size graph grid; no answer key.")


def publish(expected_sha256=None):
    with winreg.OpenKey(
        winreg.HKEY_CURRENT_USER,
        r"Software\Microsoft\Windows\CurrentVersion\Explorer\User Shell Folders",
    ) as key:
        folder, _ = winreg.QueryValueEx(key, "{374DE290-123F-4565-9164-39C4925E467B}")
    import os
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
