from fractions import Fraction as F
from math import isclose, sqrt
from pathlib import Path
import hashlib
import json
import os
import re
import shutil
import winreg

import pypdfium2 as pdfium
from reportlab.lib import colors
from reportlab.pdfgen import canvas

from build_kai_practice import paragraph, work_box, axes, graph, math_html
from build_kai_inverse_practice import inverse


ROOT = Path(__file__).parent
QUIZ_NAME = "Kai_Mixed_Refresher_Quiz_2026-11-04.pdf"
KEY_NAME = "Kai_Mixed_Refresher_Quiz_2026-11-04_PARENT_KEY.pdf"
LEFT, RIGHT = 44, 568
WIDTH = RIGHT - LEFT
TABLE = [(2, 8), (4, 13), (6, 18), (8, 23), (10, 28), (12, 33)]
MANIFEST = {
    "source_date": "2026-11-01",
    "quiz_date": "2026-11-04",
    "questions": [
        {"number": 1, "topic": "rational", "difficulty": 3, "points": 20},
        {"number": 2, "topic": "rational", "difficulty": 2, "points": 20},
        {"number": 3, "topic": "rational", "difficulty": 3, "points": 20},
        {"number": 4, "topic": "inverse", "difficulty": 2, "points": 20},
        {"number": 5, "topic": "inverse", "difficulty": 3, "points": 20},
    ],
    "simulator": {
        "model": "claude-opus-5.5",
        "persona": "A-level Honors Precalculus student",
        "method": "Independent worked attempt and comparison with original scans and prior practice tests",
        "verdict": "Honors-level refresher after required revisions",
        "minutes_estimated": [37, 43],
        "applied_revisions": [
            "Q4(c) uses 53 seconds, which is not an output already present in the table.",
            "Q3 explicitly identifies the only missing point and asks for one possible matching equation.",
        ],
        "limitation": "Qualitative model simulation, not a prediction of Kai's grade or a school rubric.",
    },
}


def header(c, number, total, kind="quiz", continuation=False):
    c.setStrokeColor(colors.black)
    c.setLineWidth(2)
    c.line(LEFT, 752, RIGHT, 752)
    paragraph(c, "MOTOR CITY MATH | ALGEBRA 2 / PRECALCULUS", LEFT, 742, size=9, bold=True)
    title = "Mixed-Unit Refresher" if kind == "quiz" else "Mixed-Unit Refresher: Parent Key"
    paragraph(c, title, LEFT, 722, size=18, bold=True)
    if kind == "quiz":
        paragraph(c, "Name: __________________________________  Date: ______________",
                  LEFT, 690, size=10)
        if c.getPageNumber() == 1:
            paragraph(c, "5 questions | 100 points | About 40 minutes | Four-function calculator",
                      LEFT, 668, size=10)
            paragraph(c, "Show your work and explain your reasoning. Give exact answers.",
                      LEFT, 650, size=10)
            top = 619
        else:
            top = 658
    else:
        paragraph(c, "November 4, 2026 | Worked solutions and scoring | Keep separate from quiz",
                  LEFT, 690, size=10)
        top = 658
    c.setFillColor(colors.Color(0.94, 0.94, 0.94))
    c.rect(LEFT, top - 30, WIDTH, 30, fill=1, stroke=0)
    c.setFillColor(colors.black)
    suffix = " (continued)" if continuation else ""
    paragraph(c, f"{number}.{suffix}", LEFT + 10, top - 7, WIDTH - 20, 12, bold=True)
    if not continuation:
        c.setFont("Helvetica-Bold", 10)
        c.drawRightString(RIGHT - 10, top - 19, "20 points")
    c.setLineWidth(0.5)
    c.line(LEFT, 43, RIGHT, 43)
    paragraph(c, "Mixed-Unit Refresher | " + ("Student copy" if kind == "quiz" else "Parent key"),
              LEFT, 35, WIDTH - 85, 8)
    c.setFont("Helvetica", 8)
    c.drawRightString(RIGHT, 24, f"Page {c.getPageNumber()} of {total}")
    return top - 44


def fraction(c, label, numerator, denominator, top):
    paragraph(c, f"<i>{label}</i>(<i>x</i>) =", 122, top - 13, 98, 18)
    paragraph(c, math_html(numerator), 230, top, 270, 18, align=1)
    c.setLineWidth(0.8)
    c.line(236, top - 28, 494, top - 28)
    paragraph(c, math_html(denominator), 230, top - 34, 270, 18, align=1)


def show_root(c, top):
    paragraph(c, "<i>U</i>(<i>x</i>) = 2 +", 142, top, 165, 19)
    paragraph(c, "5<i>x</i> + 10", 338, top, 116, 19, align=1)
    p = c.beginPath()
    p.moveTo(311, top - 18)
    p.lineTo(317, top - 14)
    p.lineTo(324, top - 31)
    p.lineTo(334, top + 3)
    p.lineTo(457, top + 3)
    c.setLineWidth(1)
    c.drawPath(p)


def table(c, top):
    x, first_w, w, h = 58, 100, 66, 30
    for row in range(2):
        y = top - (row + 1) * h
        c.setFillColor(colors.Color(0.94, 0.94, 0.94))
        c.rect(x, y, first_w, h, fill=1, stroke=0)
        c.setFillColor(colors.black)
        c.setLineWidth(0.6)
        c.rect(x, y, first_w, h, fill=0, stroke=1)
        label = "<i>p</i> (pages)" if row == 0 else "<i>T</i>(<i>p</i>) (sec)"
        paragraph(c, label, x, y+23, first_w, 10, bold=True, align=1)
        for col, pair in enumerate(TABLE):
            cx = x+first_w+col*w
            c.rect(cx, y, w, h, fill=0, stroke=1)
            paragraph(c, str(pair[row]), cx, y+23, w, 11, align=1)


def mul(a, b):
    result = [F(0)] * (len(a)+len(b)-1)
    for i, x in enumerate(a):
        for j, y in enumerate(b):
            result[i+j] += x*y
    return result


def validate_math():
    assert len(MANIFEST["questions"]) == 5
    assert sum(q["topic"] == "rational" for q in MANIFEST["questions"]) == 3
    assert sum(q["topic"] == "inverse" for q in MANIFEST["questions"]) == 2
    assert sum(q["points"] for q in MANIFEST["questions"]) == 100
    assert mul([-4, 5], [1, 2]) == [-4, -3, 10]
    assert mul([1, 2], [6, 3]) == [6, 15, 6]
    simple = lambda x: F(5*x-4, 3*x+6)
    for x in [-6, -3, -1, 0, 1, 2, 6]:
        assert F(10*x*x-3*x-4, 6*x*x+15*x+6) == simple(x)
        assert simple(x) == F(5, 3) - F(14, 3*(x+2))
    assert simple(F(-1, 2)) == F(-13, 9)
    assert simple(F(4, 5)) == 0
    assert simple(0) == F(-2, 3)
    assert 5*F(-2)-4 != 0
    product = mul([-2, 1, 3], [-3, 2])
    product[0] += -4
    product[1] += 5
    assert product == [2, -2, -7, 6]
    for x in [-1000, -6, -2, 0, 1, 5, 1000]:
        assert F(6*x**3-7*x*x-2*x+2, 3*x*x+x-2) == (
            2*x-3 + F(5*x-4, 3*x*x+x-2)
        )
    k = lambda x: F(2) - F(8, x+1)
    assert k(1) == -2
    assert k(3) == 0
    assert k(0) == -6
    for x in [-8, -3, 0, 2, 3, 8]:
        assert F(2*(x-3)*(x-1), (x+1)*(x-1)) == k(x)
    t = lambda p: F(5, 2)*p+3
    inv = lambda seconds: F(2, 5)*(seconds-3)
    for p, seconds in TABLE:
        assert t(p) == seconds
        assert inv(seconds) == p
    assert t(8) == 23 and inv(8) == 2 and t(8) != inv(8)
    assert 8 in dict(TABLE) and 8 in {y for _, y in TABLE}
    assert inv(53) == 20
    assert 53 not in {y for _, y in TABLE}
    u = lambda x: 2+sqrt(5*x+10)
    uinv = lambda x: ((x-2)**2-10)/5
    for x in [-2, -1, 0, 1, 6, 10]:
        assert isclose(uinv(u(x)), x, abs_tol=1e-10)
    for x in [2, 3, 4, 6, 10]:
        assert isclose(u(uinv(x)), x, abs_tol=1e-10)
        assert uinv(x) >= -2
    assert u(-2) == 2
    assert u(uinv(1)) != 1
    assert mul([-2, 1], [-2, 1]) == [4, -4, 1]


def build_quiz():
    c = canvas.Canvas(str(ROOT / QUIZ_NAME), pagesize=(612, 792), pageCompression=1)
    c.setTitle("Kai - Mixed-Unit Refresher - November 4, 2026")
    c.setAuthor("Motor City Math")
    top = header(c, 1, 6)
    paragraph(c, "Let <i>R</i> be the function below.", LEFT, top)
    fraction(c, "R", "10x^2 - 3x - 4", "6x^2 + 15x + 6", 536)
    paragraph(c, "(a) Simplify and state the original domain in interval notation.",
              LEFT, 452, bold=True)
    work_box(c, 428, 327, label="Work")
    paragraph(c, "(b) Find all intercepts, any holes (coordinates), and all vertical and",
              LEFT, 307, bold=True)
    paragraph(c, "horizontal asymptotes. Show your calculations.", LEFT, 291, bold=True)
    work_box(c, 265, 59, label="Work")
    c.showPage()

    top = header(c, 1, 6, continuation=True)
    paragraph(c, "(c) Sketch <i>R</i> on the grid. Label the features you found in part (b).",
              LEFT, top, bold=True)
    paragraph(c, "Each square represents 1 unit on both axes.", LEFT, top-22, size=10)
    axes(c, 102, 164, 408, 408, -6, 6, -6, 6, label_every=1)
    paragraph(c, "Explain what happens as <i>x</i> approaches the vertical asymptote from each side.",
              LEFT, 148, size=10, bold=True)
    work_box(c, 123, 59, label="Answer")
    c.showPage()

    top = header(c, 2, 6)
    paragraph(c, "Let <i>S</i> be the function below.", LEFT, top)
    fraction(c, "S", "6x^3 - 7x^2 - 2x + 2", "3x^2 + x - 2", 562)
    paragraph(c, "(a) Find the slant asymptote using polynomial long division. Show all work.",
              LEFT, 481, bold=True)
    work_box(c, 450, 233, label="Work")
    paragraph(c, "(b) Describe the far-left and far-right end behavior. Explain algebraically",
              LEFT, 212, bold=True)
    paragraph(c, "why your line describes that behavior.", LEFT, 196, bold=True)
    work_box(c, 169, 59, label="Answer")
    c.showPage()

    top = header(c, 3, 6)
    paragraph(c, "The graph continues beyond the window. Dashed lines are asymptotes.",
              LEFT, top, size=10)
    paragraph(c, "The open circle is its only missing point away from the vertical asymptote.",
              LEFT, top-16, size=10)
    bounds = (-6, 6, -8, 8)
    gx, gy, gw, gh = 147, 358, 300, 216
    graph(c, lambda x: 2-8/(x+1), [-1], gx, gy, gw, gh, bounds)
    to_xy = lambda x, y: (gx+(x+6)*gw/12, gy+(y+8)*gh/16)
    c.saveState()
    c.setDash(4, 4)
    c.setLineWidth(0.8)
    c.setStrokeColor(colors.Color(0.4, 0.4, 0.4))
    _, hy = to_xy(0, 2)
    c.line(gx, hy, gx+gw, hy)
    c.restoreState()
    px, py = to_xy(1, -2)
    c.setFillColor(colors.white)
    c.setStrokeColor(colors.black)
    c.setLineWidth(1.3)
    c.circle(px, py, 3.5, fill=1, stroke=1)
    c.setFillColor(colors.black)
    paragraph(c, "(1, -2)", px+10, py+9, 70, 9)
    px, py = to_xy(3, 0)
    paragraph(c, "(3, 0)", px+7, py+20, 60, 9)
    px, py = to_xy(0, -6)
    paragraph(c, "(0, -6)", px+10, py+9, 70, 9)
    paragraph(c, "(a) State the domain in interval notation.", LEFT, 335, bold=True)
    paragraph(c, "________________________________________________________________",
              LEFT, 311, size=10)
    paragraph(c, "(b) Write one possible rational function that matches the graph, including",
              LEFT, 284, bold=True)
    paragraph(c, "its hole. Explain how it matches the intercepts, asymptotes, and hole.",
              LEFT, 268, bold=True)
    work_box(c, 241, 150, label="Work")
    paragraph(c, "(c) Describe the far-left and far-right end behavior.", LEFT, 129, bold=True)
    work_box(c, 107, 59, label="Answer")
    c.showPage()

    top = header(c, 4, 6)
    paragraph(c, "A printer takes a fixed setup time plus a constant time per page. <i>T</i>(<i>p</i>) is",
              LEFT, top)
    paragraph(c, "the total job time in seconds for <i>p</i> pages. Selected values are shown.",
              LEFT, top-18)
    table(c, 554)
    paragraph(c, "(a) Find <i>T</i>(8) and " + inverse("T", "8") + ". Explain what each means, including units.",
              LEFT, 461, bold=True)
    work_box(c, 434, 336, label="Answer")
    paragraph(c, "(b) Write formulas for <i>T</i> and " + inverse("T") + ". Show your algebra.",
              LEFT, 315, bold=True)
    work_box(c, 290, 175, label="Work")
    paragraph(c, "(c) Use your inverse to determine the number of pages in a 53-second job.",
              LEFT, 154, bold=True)
    work_box(c, 126, 59, label="Work")
    c.showPage()

    top = header(c, 5, 6)
    paragraph(c, "Let <i>U</i> be the function below.", LEFT, top)
    show_root(c, 561)
    paragraph(c, "(a) Find " + inverse("U") + ". State the domains of <i>U</i> and " + inverse("U") + ". Show your algebra.",
              LEFT, 498, bold=True)
    work_box(c, 470, 330, label="Work")
    paragraph(c, "(b) What should each expression below equal if the functions are inverses?",
              LEFT, 309, bold=True)
    paragraph(c, "Write your answers first. Then verify each with algebra and state the allowed",
              LEFT, 293, bold=True)
    paragraph(c, "<i>x</i>-values.", LEFT, 277, bold=True)
    work_box(c, 249, 167,
             label="<i>U</i>("+inverse("U", "<i>x</i>")+") = __________________")
    work_box(c, 143, 59,
             label=inverse("U", "<i>U</i>(<i>x</i>)")+" = __________________")
    c.showPage()
    c.save()


def key_block(c, text, top, size=11):
    return paragraph(c, text, LEFT, top, WIDTH, size) - 13


def build_key():
    c = canvas.Canvas(str(ROOT / KEY_NAME), pagesize=(612, 792), pageCompression=1)
    c.setTitle("Kai - Mixed-Unit Refresher - Parent Key - November 4, 2026")
    c.setAuthor("Motor City Math")
    top = header(c, 1, 5, kind="key")
    top = key_block(c, "<b>(a)</b> Factor: 10x<super>2</super> - 3x - 4 = (5x - 4)(2x + 1).<br/>"
                    "6x<super>2</super> + 15x + 6 = 3(2x + 1)(x + 2).<br/>"
                    "R(x) = (5x - 4) / [3(x + 2)], with x &#8800; -2, -1/2.", top)
    top = key_block(c, "Domain: (-&#8734;, -2) &#8746; (-2, -1/2) &#8746; (-1/2, &#8734;). "
                    "Canceling does not restore an excluded input.", top)
    top = key_block(c, "<b>(b)</b> x-intercept: (4/5, 0). The canceled zero is not an intercept.<br/>"
                    "y-intercept: R(0) = -4/6 = -2/3, so (0, -2/3).<br/>"
                    "Vertical asymptote: x = -2.<br/>"
                    "Horizontal asymptote: y = 10/6 = 5/3.<br/>"
                    "Hole: at x = -1/2; [5(-1/2) - 4] / [3(-1/2 + 2)] = -13/9.<br/>"
                    "Hole coordinate: (-1/2, -13/9).", top)
    top = key_block(c, "<b>(c)</b> R(x) = 5/3 - 14/[3(x + 2)]. Draw dashed lines at x = -2 "
                    "and y = 5/3, an open circle at (-1/2, -13/9), and the two intercepts. "
                    "Left of -2, the branch is above y = 5/3 and tends to +&#8734; near -2. "
                    "Right of -2, the branch is below y = 5/3 and tends to -&#8734; near -2.", top)
    top = key_block(c, "<b>Scoring (20):</b> domain and simplification 4; intercepts 4; hole 3; "
                    "asymptotes 3; sketch 4; one-sided explanation 2.", top, 10)
    key_block(c, "<b>Use of this key:</b> Each question is worth 20 points. A suggested 90/100 "
                 "mastery target is a local diagnostic benchmark, not Kai's school grading rubric. "
                 "An Opus 5.5 simulated Honors Precalculus A-student attempt reviewed the draft "
                 "against the November 1 scans; it is not a prediction of Kai's grade.", top, 9)
    c.showPage()

    top = header(c, 2, 5, kind="key")
    top = key_block(c, "<b>(a)</b> Divide leading terms: 6x<super>3</super> / (3x<super>2</super>) = 2x.<br/>"
                    "Multiply: 2x(3x<super>2</super> + x - 2) = 6x<super>3</super> + 2x<super>2</super> - 4x.<br/>"
                    "Subtract from the numerator to obtain -9x<super>2</super> + 2x + 2.", top)
    top = key_block(c, "Next term: -9x<super>2</super> / (3x<super>2</super>) = -3.<br/>"
                    "Multiply: -3(3x<super>2</super> + x - 2) = -9x<super>2</super> - 3x + 6.<br/>"
                    "Subtract to obtain remainder 5x - 4.", top)
    top = key_block(c, "<b>S(x) = 2x - 3 + (5x - 4)/(3x<super>2</super> + x - 2).</b><br/>"
                    "The slant asymptote is <b>y = 2x - 3</b>, not the remainder.", top)
    top = key_block(c, "<b>(b)</b> As x tends to -&#8734;, S(x) tends to -&#8734;.<br/>"
                    "As x tends to +&#8734;, S(x) tends to +&#8734;.<br/>"
                    "The difference S(x) - (2x - 3) tends to zero because its numerator degree "
                    "is smaller than its denominator degree. Thus the ends approach that line. "
                    "At sufficiently large negative x the graph is below the line; at sufficiently "
                    "large positive x it is above the line.", top)
    key_block(c, "<b>Scoring (20):</b> long division 10; asymptote 4; end directions 2; "
                 "explanation that the remainder fraction tends to zero 4. "
                 "Above/below detail is useful but not required for full credit.", top, 10)
    c.showPage()

    top = header(c, 3, 5, kind="key")
    top = key_block(c, "<b>(a)</b> Domain: (-&#8734;, -1) &#8746; (-1, 1) &#8746; (1, &#8734;). "
                    "Exclude the vertical asymptote and the hole.", top)
    top = key_block(c, "<b>(b)</b> One possible equation is:<br/>"
                    "<b>K(x) = 2(x - 3)(x - 1) / [(x + 1)(x - 1)].</b><br/>"
                    "The factor (x - 3) gives the x-intercept 3; (x + 1) gives vertical "
                    "asymptote -1; the equal degrees and leading ratio 2 give y = 2. "
                    "The canceled (x - 1) factor preserves a hole rather than an intercept.", top)
    top = key_block(c, "To see the scale, start with A(x - 3)/(x + 1). Its horizontal asymptote "
                    "is y = A, so A = 2. The original form must still be undefined at x = 1.<br/>"
                    "Hole height: 2(1 - 3)/(1 + 1) = -2.<br/>"
                    "y-intercept: 2(0 - 3)/(0 + 1) = -6.", top)
    top = key_block(c, "Accept algebraically equivalent expressions with exactly the same domain "
                    "and graph. In particular, 2 - 8/(x + 1) is acceptable only if the student "
                    "explicitly excludes x = 1 as well as x = -1. No unique written form is required.", top)
    top = key_block(c, "<b>(c)</b> K(x) = 2 - 8/(x + 1).<br/>"
                    "As x tends to -&#8734;, K(x) approaches 2 from above.<br/>"
                    "As x tends to +&#8734;, K(x) approaches 2 from below.", top)
    key_block(c, "<b>Scoring (20):</b> domain 4; valid equation including excluded point 8; "
                 "explanation of features 4; end behavior 4. Do not penalize a different "
                 "equivalent equation.", top, 10)
    c.showPage()

    top = header(c, 4, 5, kind="key")
    top = key_block(c, "<b>(a)</b> T(8) = 23: an 8-page job takes 23 seconds.<br/>"
                    + inverse("T", "8") + " = 2: an 8-second job contains 2 pages.<br/>"
                    "Both columns contain 8, but the lookups have different directions.", top)
    top = key_block(c, "<b>(b)</b> Rate = (13 - 8)/(4 - 2) = 5/2 seconds per page.<br/>"
                    "Using (2, 8): 8 = (5/2)(2) + b, so b = 3 seconds.<br/>"
                    "<b>T(p) = (5/2)p + 3.</b>", top)
    top = key_block(c, "To invert, solve t = (5/2)p + 3 for p:<br/>"
                    "t - 3 = (5/2)p, so p = (2/5)(t - 3).<br/><b>"
                    + inverse("T", "<i>t</i>") + " = (2/5)(t - 3).</b><br/>"
                    "The inverse takes total seconds as input and returns pages.", top)
    top = key_block(c, "<b>(c)</b> " + inverse("T", "53") + " = (2/5)(53 - 3) = 20.<br/>"
                    "A 53-second job contains <b>20 pages</b>.<br/>"
                    "Check: (5/2)(20) + 3 = 53 seconds.", top)
    key_block(c, "<b>Scoring (20):</b> two correct lookups and meanings 6; forward model "
                 "4; inverse model and algebra 4; new inverse evaluation, work, and units 6. "
                 "Do not give full interpretation credit for a number without units.", top, 10)
    c.showPage()

    top = header(c, 5, 5, kind="key")
    top = key_block(c, "<b>(a)</b> Let y = 2 + &#8730;(5x + 10).<br/>"
                    "y - 2 = &#8730;(5x + 10), so (y - 2)<super>2</super> = 5x + 10.<br/>"
                    "x = [(y - 2)<super>2</super> - 10]/5. Therefore:<br/><b>"
                    + inverse("U", "<i>x</i>") + " = [(x - 2)<super>2</super> - 10]/5.</b>", top)
    top = key_block(c, "Domain of U: [-2, &#8734;), since 5x + 10 &#8805; 0.<br/>"
                    "Range of U: [2, &#8734;), so domain of "
                    + inverse("U") + " is <b>[2, &#8734;)</b>.", top)
    top = key_block(c, "<b>(b)</b> Both expected results are <b>x</b>, on the appropriate domains.", top)
    top = key_block(c, "<b>First order:</b> U(" + inverse("U", "<i>x</i>") + ")<br/>"
                    "= 2 + &#8730;{5[(x - 2)<super>2</super> - 10]/5 + 10}<br/>"
                    "= 2 + &#8730;((x - 2)<super>2</super>) = 2 + |x - 2|<br/>"
                    "= x for <b>x &#8805; 2</b>.", top)
    top = key_block(c, "<b>Other order:</b> " + inverse("U", "<i>U</i>(<i>x</i>)") + "<br/>"
                    "= {[(2 + &#8730;(5x + 10)) - 2]<super>2</super> - 10}/5<br/>"
                    "= [(5x + 10) - 10]/5 = x for <b>x &#8805; -2</b>.", top)
    top = key_block(c, "The first restriction matters: &#8730;(z<super>2</super>) = |z|. "
                    "Also, the first composition cannot take x &lt; 2 because that input is "
                    "outside the inverse function's domain.", top, 10)
    key_block(c, "<b>Scoring (20):</b> inverse formula and algebra 6; both domains 4; "
                 "expected composition results 2; algebra for each order 3 + 3; "
                 "allowed x-values for each order 1 + 1.", top, 10)
    c.showPage()
    c.save()


def inspect_files():
    for filename, pages, prefix in [(QUIZ_NAME, 6, "mixed-quiz"), (KEY_NAME, 5, "mixed-key")]:
        doc = pdfium.PdfDocument(ROOT / filename)
        assert len(doc) == pages
        texts = []
        for i in range(pages):
            page = doc[i]
            assert page.get_size() == (612.0, 792.0)
            text = page.get_textpage().get_text_range()
            assert f"Page {i+1} of {pages}" in text
            texts.append(text)
            page.render(scale=1.5).to_pil().save(ROOT / f"{prefix}-page-{i+1}.png")
        (ROOT / f"{prefix}-extracted.txt").write_text("\n\n".join(texts), encoding="utf-8")
        if filename == QUIZ_NAME:
            for i, number in enumerate([1, 1, 2, 3, 4, 5]):
                assert re.search(rf"(?m)^{number}\.(?: \(continued\)| 20 points)\s*$", texts[i])
            assert sum(t.count("20 points") for t in texts) == 5
            assert "53-second" in texts[4]
            assert "= x" not in texts[5]
            assert "expected results" not in "\n".join(texts)
            assert "slant asymptote" in texts[2]
            assert "3 (continued)" not in "\n".join(texts)
        doc.close()


def publish():
    with winreg.OpenKey(
        winreg.HKEY_CURRENT_USER,
        r"Software\Microsoft\Windows\CurrentVersion\Explorer\User Shell Folders",
    ) as key:
        folder, _ = winreg.QueryValueEx(key, "{374DE290-123F-4565-9164-39C4925E467B}")
    downloads = Path(os.path.expandvars(folder))
    assert downloads.is_dir()
    destinations = [downloads / QUIZ_NAME, downloads / KEY_NAME]
    if any(p.exists() for p in destinations):
        raise FileExistsError("Refusing to overwrite an existing refresher quiz or key.")
    for destination in destinations:
        source = ROOT / destination.name
        shutil.copy2(source, destination)
        assert hashlib.sha256(source.read_bytes()).digest() == hashlib.sha256(destination.read_bytes()).digest()
        print(f"Saved verified copy: {destination}")


if __name__ == "__main__":
    import sys
    if "--publish" in sys.argv:
        publish()
    else:
        validate_math()
        build_quiz()
        build_key()
        inspect_files()
        (ROOT / "mixed-refresher-evaluation.json").write_text(
            json.dumps(MANIFEST, indent=2), encoding="utf-8"
        )
        print("PASS: verified all math, 3 rational + 2 inverse questions, 100 points.")
        print("PASS: generated six-page student quiz and separate five-page worked parent key.")
