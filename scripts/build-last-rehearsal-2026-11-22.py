"""Render the owner-approved final rehearsal with the existing print helpers."""
import argparse
import importlib.util
from html import escape
from pathlib import Path
import re
import math

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location(
    "template", ROOT / "scripts" / "build-practice-workflow-trial-2026-11-22.py")
template = importlib.util.module_from_spec(spec)
spec.loader.exec_module(template)
m, p, work, table = template.m, template.p, template.work, template.table
POINTS = [7, 8, 3, 10, 7, 5, 10, 5, 10, 4, 8, 10, 9, 4]

EXPRESSIONS = {
    "f(x)=sqrt(x-2)+1": r"f(x)=\sqrt{x-2}+1",
    "f^(-1)(x)": r"f^{-1}(x)", "C^(-1)(x)": r"C^{-1}(x)",
    "C^(-1)(28)": r"C^{-1}(28)", "h(x)=x^2+1": r"h(x)=x^2+1",
    "C(t)=4t+8": r"C(t)=4t+8", "t>=0": r"t\ge0",
    "f(g(x))=0": r"f(g(x))=0", "f(g(x))": r"f(g(x))",
    "g(f(x))": r"g(f(x))", "(2f-g)(0)": r"(2f-g)(0)",
    "g(f(-2))": r"g(f(-2))", "(f/g)(0)": r"(f/g)(0)",
    "f(g(-3))": r"f(g(-3))", "f(-2)": r"f(-2)",
    "f(0)": r"f(0)", "f(2)": r"f(2)", "f(x)=2": r"f(x)=2",
    "f(x)=1": r"f(x)=1", "p(-2)": r"p(-2)", "p(1)": r"p(1)",
    "x=2": r"x=2", "x=-2": r"x=-2", "x=-1": r"x=-1",
    "x=-4": r"x=-4", "y=1": r"y=1", "y=1/x": r"y=\frac1x",
    "V(t)": r"V(t)", "A(0)": r"A(0)", "A(20)": r"A(20)",
}


def render_text(text):
    saved = []
    pattern = "|".join(re.escape(x) for x in sorted(EXPRESSIONS, key=len, reverse=True))
    def replace(match):
        saved.append(m(EXPRESSIONS[match[0]]))
        return f"@@MATH{len(saved)-1}@@"
    text = re.sub(pattern, replace, text)
    text = escape(text)
    for index, value in enumerate(saved):
        text = text.replace(f"@@MATH{index}@@", value)
    return text


template.render_text = render_text
template.EXTRA_CSS += """
body{font-size:11pt} .work-line{height:22pt}
.equation{font-size:17pt;margin:7pt 0}
.student td{height:27pt}.student table th:last-child,.student table td:last-child{width:auto}
.graph-page figure{margin:12pt auto}
"""


def md(text):
    text = re.sub(r"\$\$([\s\S]*?)\$\$", lambda z: "$$\n" + z[1].strip() + "\n$$", text)
    text = re.sub(r"(?m)^(?=\d+\. )", "\n", text)
    return template.markdown(text)


def grid(curves=(), dots=(), guides=(), xmax=6, ymax=6, ystep=1, xstep=1, key=False):
    if xstep != 1:
        curves = [(lambda x, fn=fn: fn(x*xstep), a/xstep, b/xstep) for fn,a,b in curves]
        dots = [(a/xstep,b,o) for a,b,o in dots]
        guides = [(s*xstep if s is not None else None,
                   b/xstep if s is None else b) for s,b in guides]
    html = template.grid(curves, dots, guides, wide=True,
                         xmax=xmax//xstep, ymax=ymax, ystep=ystep)
    if xstep != 1:
        html = re.sub(r'(<text[^>]*text-anchor="middle"[^>]*>)(-?\d+)(</text>)',
                      lambda z: z[1]+str(int(z[2])*xstep)+z[3], html)
        html = html.replace("x: 1 per square", f"x: {xstep} per square")
        html = html.replace(f'data-xmin="{-xmax//xstep}"', f'data-xmin="{-xmax}"')
        html = html.replace(f'data-xmax="{xmax//xstep}"', f'data-xmax="{xmax}"')
    scale = 1 if key else 22/17
    html = re.sub(r'(width|height):([0-9.]+)pt',
                  lambda z: z[1]+":"+str(round(float(z[2])*scale,2))+"pt", html)
    return html


def graph(number, solved=False):
    curves, dots, guides = [], [], []
    opts = {}
    if number == 1:
        opts = dict(ymax=20, ystep=2)
        if solved:
            curves = [(lambda x: 2*(-x+2)**3-2,-6,6)]
            dots = [(x,y,False) for x,y in [(0,14),(1,0),(2,-2),(3,-4),(4,-18)]]
    elif number == 2:
        opts = dict(xmax=16, xstep=2)
        if solved:
            curves = [(lambda x: -.5*math.sqrt(x+4)+2,-4,16)]
            dots = [(x,y,False) for x,y in [(-4,2),(0,1),(12,0)]]
    elif number == 4:
        opts = dict(ymax=12, ystep=2)
        if solved:
            curves = [(lambda x: x**3+2*x*x-5*x-6,-6,6)]
            dots = [(x,y,False) for x,y in [(-3,0),(-1,0),(2,0),(0,-6),(-2,4),(1,-8)]]
    elif number == 6:
        opts = dict(xmax=4,ymax=4)
        curves = [(lambda x:-x,-3,1),(lambda x:2*x-3,1,3)]
        dots = [(-3,3,False),(1,-1,False),(3,3,False)]
    elif number == 7:
        opts = dict(ymax=8)
        if solved:
            curves = [(lambda x:-x-1,-6,-2),(lambda x:x*x-2,-2,2),(lambda x:x+1,2,6)]
            dots = [(-2,1,True),(-2,2,False),(2,2,True),(2,3,False),(0,-2,False)]
    elif number == 9:
        opts = dict(ymax=8)
        if solved:
            curves = [(lambda x:-2/(x-1)+2,-6,.99),(lambda x:-2/(x-1)+2,1.01,6)]
            dots = [(x,y,False) for x,y in [(-1,3),(0,4),(2,0),(3,1)]]
            guides = [(None,1),(0,2)]
    elif number == 11 and solved:
        curves = [(lambda x:(x+4)/(x+2),-6,-2.01),(lambda x:(x+4)/(x+2),-1.99,6)]
        dots = [(-1,3,True),(-4,0,False),(0,2,False)]
        guides = [(None,-2),(0,1)]
    elif number == 12:
        opts = dict(ymax=10)
        if solved:
            curves = [(lambda x:(x*x+x-6)/(x-1),-6,.99),
                      (lambda x:(x*x+x-6)/(x-1),1.01,6)]
            dots = [(-3,0,False),(2,0,False),(0,6,False),(-1,3,False),(3,3,False)]
            guides = [(None,1),(1,2)]
    elif number == 13:
        curves = [(lambda x:.5*x-3,-4,-2),(lambda x:2*x,-2,2),
                  (lambda x:.5*x+3,2,4)]
        dots = [(x,y,False) for x,y in [(-4,-5),(-2,-4),(2,4),(4,5)]]
        if solved:
            curves = [(lambda x:2*x+6,-5,-4),(lambda x:x/2,-4,4),
                      (lambda x:2*x-6,4,5)]
            dots = [(x,y,False) for x,y in [(-5,-4),(-4,-2),(4,2),(5,4)]]
    html = grid(curves,dots,guides,key=solved,**opts)
    if number == 4 and not solved:
        html = re.sub(r'(width|height):([0-9.]+)pt',
                      lambda z: z[1]+":"+str(round(float(z[2])*21/22,2))+"pt",html)
    return html


ANSWERS = [
    [r"\displaystyle 2(-x+2)^3-2=-2(x-2)^3-2",
     "Points: (0,14), (1,0), (2,-2), (3,-4), (4,-18).",
     "Reflect across the y-axis, stretch vertically by 2, translate right 2 and down 2. An equivalent x-axis reflection description is valid for the odd cubic.",
     "Left end rises without bound; right end falls without bound."],
    [r"g(x)=-\frac12\sqrt{x+4}+2",
     r"1=2a+2\Rightarrow a=-\frac12",
     "Reflect across the x-axis, compress vertically by 1/2, translate left 4 and up 2.",
     "Points: (-4,2), (0,1), (12,0).",
     r"D=[-4,\infty),\quad R=(-\infty,2]",
     "Intercepts: (12,0) and (0,1)."],
    ["Degree 5, leading coefficient 2. Left end falls, right end rises.",
     "At most 4 turning points and 5 distinct x-intercepts. These are upper bounds, not actual counts."],
    [r"\displaystyle p(x)=(x-2)(x^2+4x+3)=(x-2)(x+1)(x+3)",
     "Zeros -3, -1, 2 all cross. Left end falls; right end rises.",
     r"p(-2)=4,\quad p(1)=-8,\quad p(0)=-6",
     "Plot (-2,4) and (1,-8) at the stated two-unit y scale. They are not exact turning points. Accept any correct factoring method."],
    [r"\text{a) }f(g(x))=\frac{2x}{2x-3},\quad x\ne\frac32",
     r"\text{b) }g(f(x))=\frac{x+4}{x-2},\quad x\ne2",
     "Different functions: their domains differ; at x=0 the outputs are 0 and -2.",
     r"\text{c) }2x=0\Rightarrow x=0;\quad g(0)=-1,\ f(-1)=0"],
    ["a) 2f(0)-g(0)=2(-2)-0=-4.",
     "b) f(-2)=3, so g(f(-2))=g(3)=3.",
     "c) -2/0 is undefined: division by zero.",
     "d) g(-3)=3, but f(3) is undefined because 3 is absent from the stated table-only domain."],
    ["Open (-2,1), closed (-2,2); open (2,2), closed (2,3).",
     r"f(-2)=2,\quad f(0)=-2,\quad f(2)=3",
     r"D=(-\infty,\infty),\quad R=[-2,\infty)",
     "Left candidate -3 is valid. Middle candidates -2 and 2: keep -2, reject 2. Right candidate 1 is rejected.",
     r"\{x:f(x)=2\}=\{-3,-2\}"],
    [r"V(t)=\begin{cases}20+5t&0\le t<4\\40&4\le t\le8\\40-10(t-8)&8<t\le12\end{cases}",
     "Adjacent formulas agree at each transition; accept other consistent nonoverlapping assignments that include 0 and 12.",
     r"20+5t=30\Rightarrow t=2;\quad40-10(t-8)=30\Rightarrow t=9",
     "Both are in the correct intervals; the constant phase gives no solution. Answers: 2 and 9 minutes."],
    ["Reflect across x-axis, stretch by 2, translate right 1 and up 2. VA x=1; HA y=2.",
     "Points: (-1,3), (0,4), (2,0), (3,1).",
     r"D=(-\infty,1)\cup(1,\infty),\quad R=(-\infty,2)\cup(2,\infty)",
     "x-intercept (2,0); y-intercept (0,4). Increasing separately on each domain interval; decreasing nowhere. Both distant ends approach 2.",
     r"-\frac2{x-1}+2=1\Rightarrow x=3,\quad f(3)=1"],
    [r"A(0)=\frac{12}{20}=60\%", "Initially, 60% of attempts were successful.",
     r"A(20)=\frac{32}{40}=80\%"],
    [r"f(x)=\frac{(x+4)(x+1)}{(x+2)(x+1)},\quad x\ne-2,-1",
     r"f(x)=1+\frac2{x+2}\ \text{on its original domain}",
     "Hole (-1,3), y-intercept (0,2), x-intercept (-4,0). VA x=-2; HA y=1.",
     "The canceled factor leaves a finite limit at -1, but the original expression remains undefined there. The uncanceled denominator zero is the vertical asymptote.",
     "Accept other valid constructions with consistent calculations and graphs."],
    ["a) A: horizontal y=3. B: horizontal y=0. C: neither horizontal nor slant.",
     r"\text{b) }x^2+x-6=(x+3)(x-2)",
     "Intercepts: (-3,0), (2,0), (0,6).",
     r"\text{c) }f(x)=x+2-\frac4{x-1};\quad \mathrm{VA}:x=1,\quad\mathrm{slant}:y=x+2",
     "d) Left end tends to negative infinity; right end to positive infinity. Both approach the line y=x+2.",
     "e) Left branch above the slant; right branch below. Useful points (-1,3) and (3,3)."],
    [r"\text{a) }D_f=[2,\infty),\quad R_f=[1,\infty)",
     r"x=\sqrt{y-2}+1\Rightarrow(x-1)^2=y-2",
     r"f^{-1}(x)=(x-1)^2+2,\quad D_{f^{-1}}=[1,\infty),\ R_{f^{-1}}=[2,\infty)",
     "b) In order: (5,-2), (2,-1), (1,0), (2,1), (5,2).",
     "c) Not a function: inverse input 2 has outputs -1 and 1.",
     r"x\ge0:\ h^{-1}(x)=\sqrt{x-1};\qquad x\le0:\ h^{-1}(x)=-\sqrt{x-1}",
     r"\text{Both inverse domains: }[1,\infty)",
     "Accept smaller valid one-sided intervals with consistent inverse restrictions.",
     "d) Inverse vertices: (-5,-4), (-4,-2), (4,2), (5,4), joined in order with closed endpoints. Shared point (0,0): swapping its coordinates leaves it unchanged."],
    [r"x=4y+8\Rightarrow y=\frac{x-8}{4}",
     r"C^{-1}(x)=\frac{x-8}{4}", r"\displaystyle C^{-1}(28)=\frac{28-8}{4}=5",
     "A $28 total cost corresponds to 5 rental hours.",
     r"\displaystyle C(5)=4(5)+8=28",
     "Contextual inverse domain [8,infinity), range [0,infinity). These intervals are not separately required."]
]

RUBRICS = [
    "Graph/points 4; transformations 2; ends 1.",
    "Rule 2; transformations 1; graph 2; domain/range 2; intercepts 1.",
    "Degree/leading coefficient/ends 1; maximum turns 1; maximum zeros 1.",
    "Factoring 3; zeros/crossing 2; ends 1; anchor values 2; graph 2.",
    "First composition/exclusion 2; second composition/exclusion 2; comparison 1; solve/check 2.",
    "a 1; b 1; c 1; d 2 including reason.",
    "Graph/endpoints 3; evaluations 1; domain/range 2; candidates/conditions/complete set 4.",
    "Piecewise rules and complete intervals 3; both target times with checks 2.",
    "Transformations 2; asymptotes 1; graph 2; full analysis 4; solve 1.",
    "Initial calculation/meaning 2; later percentage 2.",
    "Four construction features 4; hole/y-intercept/explanation 2; consistent graph 2.",
    "Classifications 1.5; factoring/intercepts 1.5; VA 1; division/slant 2; ends 1; graph 3.",
    "Inverse algebra and sets 3; inverse pairs 1; restrictions/inverses/explanation 2; inverse graph/shared-point explanation 3.",
    "Inverse rule 1; evaluation 1; contextual units 1; forward check 1."
]


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", required=True, type=Path)
    parser.add_argument("--output", required=True, type=Path)
    args = parser.parse_args()
    raw = args.source.read_text(encoding="utf-8").replace("\r\n","\n")
    matches = list(re.finditer(r"^## (\d+)\. (.+)$",raw,re.M))
    questions = []
    for i,match in enumerate(matches):
        body = raw[match.end():matches[i+1].start() if i+1<len(matches) else len(raw)]
        body = body.split("Parent notes:")[0]
        body = re.split(r"\nGraph (?:requirement|requirements|authoring requirement):",body)[0].strip()
        title = match[2].replace(" (replaces original 16)","")
        title = re.sub(r" \(\d+ points\)$","",title)
        questions.append((int(match[1]),title,body))
    if [n for n,_,_ in questions] != list(range(1,15)) or sum(POINTS)!=100:
        raise ValueError("Expected the approved 14-question, 100-point revision")
    args.output.mkdir(parents=True,exist_ok=True)
    pages, keys = [], []
    for n,title,body in questions:
        heading = f"{n}. {title} / {POINTS[n-1]} points"
        content = md(body)
        if n == 6:
            content = content.replace(p("Use the supplied graph of g."),p("Use the supplied graph of g.")+graph(6))
        if n in (1,4,7,9,12):
            pages.append((heading,content+work(10 if n!=9 else 5)))
            pages.append((f"{n}. Graph / continued",
                          p("Use the instructions on the preceding question page.")+graph(n)+work(1)))
        elif n == 13:
            first, last = body.split("\nd) ",1)
            pages.append((heading,md(first)+work(10)))
            pages.append(("13. Inverse graph / source",p("d) "+render_text(last))
                          +p("Supplied graph of k:")+graph(13)))
            pages.append(("13. Inverse graph / your drawing",
                          p("Draw the inverse of the supplied graph on this separate grid.")
                          +grid()+p("Shared point and explanation:")+work(3)))
        elif n in (2,11):
            pages.append((heading,content+work(6)+graph(n)))
        else:
            pages.append((heading,content+work(10 if n in (5,8) else 6)))
        answer = "".join(p(m(line,True) if "\\" in line else escape(line)) for line in ANSWERS[n-1])
        if n in (1,2,4,6,7,9,11,12):
            answer += graph(n,True)
        if n == 13:
            keys.append((heading,answer+p("Suggested scoring: "+RUBRICS[n-1])))
            keys.append(("13. Worked inverse graph",graph(13,True)+p("Closed endpoints; shared point (0,0).")))
        else:
            keys.append((heading,answer+p("Suggested scoring: "+RUBRICS[n-1])))
    for name,keyflag,sheets in [("Final_Rehearsal_2026-11-22",False,pages),
                               ("Final_Rehearsal_2026-11-22_KEY",True,keys)]:
        html = template.document(sheets,keyflag)
        html = html.replace("60 minutes | 8 questions | 100 points | Four-function calculator",
                            "75-minute target | 90-minute maximum | 14 questions | 100 points")
        html = html.replace("Reserve six minutes to check.","Reserve five minutes to check.")
        html = html.replace("Final practice","Final rehearsal")
        html = html.replace("Revision 2","Approved final revision")
        (args.output/(name+".html")).write_text(html,encoding="utf-8")
        print(f"{name}: {len(sheets)} pages")
    clean = "# Approved final rehearsal\n\n75-minute target; 90-minute maximum; 100 points.\n\n"
    clean += "\n\n".join(f"## {n}. {title} ({POINTS[n-1]} points)\n\n{body}" for n,title,body in questions)
    (args.output/"questions.md").write_text(clean+"\n",encoding="utf-8")
    key = "# Approved final rehearsal - worked key\n\nPractice rubric, not an official school scale. Preserve valid follow-through; do not deduct the same originating error repeatedly.\n\n"
    for n in range(1,15):
        lines = ["$$\n"+line+"\n$$" if "\\" in line else line for line in ANSWERS[n-1]]
        key += f"## {n}. {POINTS[n-1]} points\n\n"+"\n\n".join(lines)+"\n\n"+RUBRICS[n-1]+"\n\n"
    (args.output/"key.md").write_text(key.rstrip()+"\n",encoding="utf-8")


if __name__ == "__main__":
    main()
