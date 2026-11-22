"""Build the standalone printable practice and separate worked key."""
from pathlib import Path
from html import escape
from base64 import b64encode
import json
import math
import re

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "print" / "final-practice-2026-11-21"
OUT.mkdir(parents=True, exist_ok=True)
ASSETS = ROOT / "shared" / "katex"


def m(value, display=False):
    return '<span data-math="' + escape(value, quote=True) + '" data-display="' + str(display).lower() + '"></span>'


def p(value):
    return "<p>" + value + "</p>"


def work(lines=3):
    return '<div class="workspace">' + '<div class="work-line"></div>' * lines + "</div>"


def table(headers, rows):
    return "<table><tr>" + "".join("<th>" + c + "</th>" for c in headers) + "</tr>" + "".join(
        "<tr>" + "".join("<td>" + c + "</td>" for c in row) + "</tr>" for row in rows) + "</table>"


plot_id = 0


def grid(curves=(), dots=(), guides=(), wide=False, ystep=1, ymax=6, compact=False, xmax=6):
    global plot_id
    plot_id += 1
    unit = 11 if compact else 17 if wide else 14
    xmin, ymin = -xmax, -ymax
    left, top = 23, 15
    width, height = 2 * xmax * unit, 2 * ymax / ystep * unit
    x = lambda a: left + (a + xmax) * unit
    y = lambda b: top + (ymax - b) / ystep * unit
    clip = f"grid-{plot_id}"
    bits = [f'<figure><svg data-xmin="{-xmax}" data-xmax="{xmax}" data-ymin="{-ymax}" data-ymax="{ymax}" '
            f'viewBox="0 0 {width+48} {height+42}" style="width:{width+48}pt;height:{height+42}pt" '
            'role="img" aria-label="Symmetric coordinate grid centered at the origin">',
            f'<defs><clipPath id="{clip}"><rect x="{left}" y="{top}" width="{width}" height="{height}"/></clipPath></defs>']
    for a in range(-xmax, xmax + 1):
        bits.append(f'<path d="M{x(a)} {top}v{height}" stroke="#ccc" stroke-width=".5"/>')
    for b in range(-ymax, ymax + 1, ystep):
        bits.append(f'<path d="M{left} {y(b)}h{width}" stroke="#ccc" stroke-width=".5"/>')
    bits.append(f'<path d="M{left} {y(0)}h{width}M{x(0)} {top}v{height}" stroke="#111" stroke-width="1"/>')
    for a in range(-xmax, xmax + 1):
        if a:
            bits.append(f'<text x="{x(a)}" y="{y(0)+10}" text-anchor="middle">{a}</text>')
    for b in range(-ymax, ymax + 1, ystep):
        if b:
            bits.append(f'<text x="{x(0)-4}" y="{y(b)+2}" text-anchor="end">{b}</text>')
    bits.append(f'<text x="{left+width+8}" y="{y(0)+2}">x</text><text x="{x(0)+4}" y="9">y</text>')
    for slope, intercept in guides:
        path = f"M{x(intercept)} {top}v{height}" if slope is None else f"M{x(-xmax)} {y(slope*-xmax+intercept)}L{x(xmax)} {y(slope*xmax+intercept)}"
        bits.append(f'<path d="{path}" '
                    f'stroke="#555" stroke-dasharray="4,3" clip-path="url(#{clip})"/>')
    for fn, a, b in curves:
        coords = [f"{x(a+(b-a)*i/500):.2f},{y(fn(a+(b-a)*i/500)):.2f}" for i in range(501)]
        bits.append('<polyline points="' + " ".join(coords) + '" fill="none" stroke="#111" '
                    f'stroke-width="1.5" clip-path="url(#{clip})"/>')
    for a, b, opened in dots:
        bits.append(f'<circle cx="{x(a)}" cy="{y(b)}" r="3" fill="{"white" if opened else "#111"}" stroke="#111"/>')
    bits.append(f'</svg><figcaption>x: 1 per square; y: {ystep} per square. Both axes are centered at 0.</figcaption></figure>')
    return "".join(bits)


CSS = """
@page{size:letter;margin:0}*{box-sizing:border-box}
body{margin:0;font:10.2pt/1.3 Arial;color:#111;background:white}
.sheet{width:612pt;height:792pt;padding:27pt 36pt 22pt;display:flex;flex-direction:column;break-after:page}
.sheet:last-child{break-after:auto}header{border-top:2pt solid #111;padding-top:6pt}
h1{font-size:18pt;margin:4pt 0 7pt}header p{font-size:9pt;margin:3pt 0}
main{flex:1;min-height:0}h2{font-size:11.5pt;margin:11pt 0 8pt;background:#eee;padding:6pt}
p{margin:0 0 7pt}.work-line{height:20.5pt;border-bottom:.5pt solid #aaa}
.workspace{margin:3pt 0 6pt}.pair{display:grid;grid-template-columns:1fr 1fr;gap:14pt}
table{width:100%;border-collapse:collapse;font-size:9pt;margin:6pt 0}
th,td{border:.6pt solid #888;padding:5pt;text-align:center}th{background:#eee}td{height:25pt}
figure{margin:6pt auto;text-align:center;line-height:0}svg{max-width:100%}svg text{font:8pt Arial;paint-order:stroke;stroke:white;stroke-width:2px}
figcaption{font:8pt/1.2 Arial;margin-top:4pt}.katex{font-size:1.05em}
.formula-row{display:grid;grid-template-columns:repeat(3,1fr);gap:18pt;margin:7pt 0 12pt;text-align:center}
.formula-row .katex{font-size:16pt}.formula-row .katex-display{margin:8pt 0}.formula-label{font-size:10pt}
.formula-row.two{grid-template-columns:repeat(2,1fr);margin:4pt 0 6pt}.formula-row.two .katex-display{margin:4pt 0}
.calculation-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:4pt 14pt;margin:4pt 0 6pt}
.calc-slot{display:flex;align-items:flex-end;gap:8pt;min-height:27.5pt}.calc-answer{border-bottom:.5pt solid #aaa;flex:1;min-width:0;height:27.5pt}
.rubric{font-size:8.5pt;border-top:.5pt solid #999;margin-top:10pt;padding-top:5pt}
footer{font-size:8pt;display:flex;justify-content:space-between;border-top:.5pt solid #888;padding-top:5pt;margin-top:9pt}
.key main{font-size:10pt}.key .work-line{display:none}
@media print{*{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
@media screen{body{background:#e8ecf1}.sheet{background:white;margin:12px auto;box-shadow:0 2px 8px #0002}}
"""

questions = []


def add(number, points, minutes, lt, prompt, answer, rubric):
    questions.append(dict(number=number, points=points, minutes=minutes, learning_targets=lt,
                          difficulty=2 if number == 3 else 3, student=prompt, worked=answer, rubric=rubric))


add(1, 12, 7, [1],
    p("A quadratic A has vertex (-2, 4) and passes through (0, 0). B is a transformation of the square-root function, has endpoint (3, -1), and passes through (-1, 3). Neither has an extra domain restriction.")
    +p("Find both rules. Sketch each, labeling its intercepts and vertex or endpoint.")
    +work(2) + '<div class="pair">' + grid() + grid() + "</div>"
    +table(["Function", "Domain", "Range", "Increasing / decreasing"], [["A", "", "", ""], ["B", "", "", ""]])
    +p("Describe A's distant ends and extremum. Describe B's transformations.") + work(3),
    p(m(r"A(x)=a(x+2)^2+4,\quad 0=4a+4\Rightarrow a=-1") + ". Hence " + m(r"A(x)=4-(x+2)^2") + ".")
    +p("For B, its endpoint and given left-side point require " + m(r"B(x)=c\sqrt{3-x}-1") + ". "
       + m(r"3=2c-1\Rightarrow c=2") + ".")
    +p("A: domain all real numbers; range " + m(r"(-\infty,4]") + "; increasing " + m(r"(-\infty,-2)")
       + ", decreasing " + m(r"(-2,\infty)") + ". Intercepts (-4,0) and (0,0); maximum 4 at x=-2. Both ends fall without bound.")
    +p("B: domain " + m(r"(-\infty,3]") + "; range " + m(r"[-1,\infty)") + "; decreasing throughout its domain."
       " Zero: " + m(r"2\sqrt{3-x}=1\Rightarrow x=11/4") + "; y-intercept " + m(r"(0,2\sqrt3-1)") + "."
       " Reflect across the y-axis, shift right 3, stretch vertically by 2, and shift down 1.")
    +'<div class="pair">' + grid([(lambda x: 4-(x+2)**2, -6, 2)], [(-2,4,False),(-4,0,False),(0,0,False)])
    +grid([(lambda x: 2*math.sqrt(3-x)-1, -6, 3)], [(3,-1,False),(-1,3,False),(2,1,False),(2.75,0,False)]) + "</div>",
    "Rules with reconstruction 4; two sketches and intercepts 4; sets/directions 2; ends/extremum/transformations 2.")

add(2, 8, 4, [2],
    p("A polynomial is negative for x&lt;-2, positive for -2&lt;x&lt;1, and positive for x&gt;1. Its only zeros are -2 and 1; it touches the axis at 1. Also, p(0)=4.")
    +p("Find the polynomial of least degree. Could a degree-two polynomial meet all this evidence? Justify. State the leading coefficient, the maximum possible number of turns and distinct real zeros for its degree, and both end behaviors.")
    +p("Find p(-1), then sketch p with exact zeros and that point labeled. Exact turning-point calculations are not required.")
    +'<div class="pair"><div>'+grid(ystep=2, ymax=10)+'</div><div>'
    +p("Polynomial / degree reasoning / structure / value:")+work(6)+'</div></div>',
    p("The sign changes at -2 but not at 1. Least multiplicities are 1 and 2, so "
      +m(r"p(x)=a(x+2)(x-1)^2")+". At zero, "+m(r"4=2a\Rightarrow a=2")+".")
    +p(m(r"p(x)=2(x+2)(x-1)^2=2x^3-6x+4")+". Least degree 3, not 2. Leading coefficient 2; at most 2 turns and 3 distinct real zeros."
       " Down-left, up-right. "+m(r"p(-1)=2(1)(4)=8")+".")
    +grid([(lambda x: 2*(x+2)*(x-1)**2,-3,3)], [(-2,0,False),(1,0,False),(-1,8,False)], wide=True, ystep=2, ymax=10),
    "Multiplicity/minimum-degree reasoning 2; polynomial and scale 2; structure/ends 2; value and accurately scaled sketch 2.")

add(3, 7, 3, [3],
    p("F and G are defined only at the listed inputs. One entry is missing.")
    +table(["x","-2","-1","0","1","2"], [["F(x)","1","2","0","-1","-2"],["G(x)","-1","?","1","0","-2"]])
    +p(m(r"F(G(-1))=-2")+". Recover the missing entry. Then find the following, showing intermediate inputs where needed.")
    +'<div class="calculation-grid">'
    +"".join('<div class="calc-slot">'+m(value)+'<span class="calc-answer"></span></div>'
             for value in [r"G(F(-1))",r"(F+G)(1)",r"(FG)(-2)",r"F(G(2))",r"G(F(-2))"])
    +'</div>'
    +p("At which listed inputs is F/G undefined? Do the two compositions agree at every listed input? Support your conclusion.")+work(2),
    p("Only F(2)=-2, so G(-1)=2. Then "+m(r"G(F(-1))=G(2)=-2")+".")
    +p(m(r"(F+G)(1)=-1+0=-1,\quad(FG)(-2)=1(-1)=-1")+". "
       +m(r"F(G(2))=F(-2)=1,\quad G(F(-2))=G(1)=0")+".")
    +p("F/G is undefined at x=1 because G(1)=0. The compositions do not agree: at x=-2, "
       +m(r"F(G(-2))=F(-1)=2")+", but "+m(r"G(F(-2))=0")+"."),
    "Recovered input 1; five evaluations 4; quotient exclusion 1; noncommutation with evidence 1.")

add(4, 8, 4, [3],
    p("Two processing stages use "+m(r"u(x)=\sqrt{x-2}")+" and "+m(r"v(x)=6-x")+". They can be used in either order.")
    +p("Write the rule and complete allowable input set for each order. Which orders accept input 1? Input 3? Give the outputs where they exist.")
    +table(["Expression","Rule","Allowable inputs"], [[m(r"u(v(x))"),"",""],[m(r"v(u(x))"),"",""]])+work(2)
    +p("Find every starting input that produces final output 2, for each order. Also write u/v and its complete domain.")+work(5),
    p(m(r"u(v(x))=\sqrt{4-x},\quad x\le4")+"; "
       +m(r"v(u(x))=6-\sqrt{x-2},\quad x\ge2")+".")
    +p("Input 1 works only for "+m(r"u(v(x))")+", producing "+m(r"\sqrt3")+". Input 3 works for both: outputs 1 and 5, respectively.")
    +p("First order: "+m(r"\sqrt{4-x}=2\Rightarrow4-x=4\Rightarrow x=0")+", which is allowable."
       " Second order: "+m(r"6-\sqrt{x-2}=2\Rightarrow x-2=16\Rightarrow x=18")+", also allowable.")
    +p(m(r"(u/v)(x)=\frac{\sqrt{x-2}}{6-x}")+". Its domain is "+m(r"[2,6)\cup(6,\infty)")+": the radical needs x>=2 and the denominator excludes 6."),
    "Rules/domains 3; accepted-input outputs 2; both equation solutions with domain checks 2; quotient and complete domain 1.")

add(5, 6, 3, [4],
    p("A studio charges for a booking lasting 0&lt;t<=60 minutes. Its price is continuous and has exactly three phases: initially constant, then a single increasing straight line, then a constant cap. Both transition times are multiples of 10 minutes.")
    +table(["Minutes t","5","10","20","25","30","45","60"],[["Price ($)","3","3","6","7.50","9","9","9"]])
    +p("Reconstruct the complete piecewise price rule, including every boundary. Find the price at 15 minutes and all booking lengths costing exactly $9.")+work(7),
    p("The middle line contains (20,6) and (25,7.5), so "
       +m(r"m=(7.5-6)/(25-20)=0.3")+". Its intercept is "+m(r"6-0.3(20)=0")+".")
    +p("It meets the initial $3 level at t=10 and the $9 cap at t=30. Thus "
       +m(r"C(t)=\begin{cases}3&0<t\le10\\0.3t&10<t<30\\9&30\le t\le60.\end{cases}")+".")
    +p("Assigning either transition to the neighboring piece is also correct because the values agree. C(15)=$4.50. All $9 bookings have "+m(r"t\in[30,60]")+"."),
    "Inferred line/transitions 3; complete nonoverlapping bounded pieces 1.5; price .5; entire cap interval 1.")

piece_curves = [(lambda x: 2*x+2,-6,-0.001),(lambda x: 4-(x-2)**2,0,6)]
piece_dots = [(0,2,True),(0,0,False),(2,4,False),(-1,0,False)]
add(6, 11, 5, [4],
    p("The left branch is a straight line and the right branch is a parabola. They continue beyond the window in their shown directions.")
    +grid(piece_curves, piece_dots, wide=True)
    +p("Recover an exact piecewise rule from the graph. Find F(-1), F(0), and the complete domain and range. Solve F(x)=2, including an explanation of any candidate you reject.")
    +work(8),
    p("Left slope 2 and intercept 2 give "+m(r"2x+2")+" for x&lt;0. Right vertex (2,4) and closed point (0,0) give "
       +m(r"4-(x-2)^2")+" for x>=0.")
    +p(m(r"F(x)=\begin{cases}2x+2&x<0\\4-(x-2)^2&x\ge0.\end{cases}")+". "
       +m(r"F(-1)=0,\quad F(0)=0")+". Domain all real numbers; range "+m(r"(-\infty,4]")+".")
    +p("For F=2, the left rule gives x=0, rejected because 0 is not less than 0. The right rule gives "
       +m(r"(x-2)^2=2\Rightarrow x=2-\sqrt2,\ 2+\sqrt2")+". Both are positive and valid."
       " The open point at (0,2) is not a solution."),
    "Graph-to-rule reconstruction and boundaries 4; evaluations 1; full sets 2; both valid roots and rejected endpoint reasoning 4.")

reciprocal = [(lambda x: 3*x/(x+2),-6,-2.02),(lambda x: 3*x/(x+2),-1.98,6)]
add(7, 14, 7, [5],
    p("Construct a rational function of the lowest possible degree whose only vertical asymptote is x=-2, whose values approach 3 at both distant ends, and whose only zero is 0. It has no holes.")
    +p("Give and justify your equation. Sketch it and label the intercepts and asymptotes. State its domain and range, describe both distant ends, and identify the shifts, reflections and stretches from an appropriate parent function.")
    +work(3)+grid(wide=True)
    +p("A classmate says the right branch decreases. Decide whether that fits your equation, supporting your answer with two ordered input-output pairs. State the increasing/decreasing intervals. Finally, solve R(x)=6.")+work(4),
    p("The zero forces a factor x in the numerator and the vertical asymptote forces x+2 in the denominator. A constant ratio cannot meet the evidence; least degrees are 1 and 1."
       " The distant ratio must be 3, so "+m(r"R(x)=3x/(x+2)=3-6/(x+2)")+".")
    +p("Domain "+m(r"(-\infty,-2)\cup(-2,\infty)")+"; range "+m(r"(-\infty,3)\cup(3,\infty)")
       +". Both intercepts are (0,0). VA x=-2; HA y=3. Relative to 1/x: reflect across the x-axis, stretch by 6, shift left 2 and up 3.")
    +p("Both branches increase separately. For the right branch, "+m(r"R(0)=0<R(1)=1")+", contradicting a decreasing branch."
       " More generally, the reciprocal difference for two ordered inputs on one side of -2 is positive. Neither branch decreases."
       " Far left approaches 3 from above; far right approaches 3 from below.")
    +p(m(r"3x=6(x+2)\Rightarrow x=-4,\qquad R(-4)=6")+".")
    +grid(reciprocal, [(0,0,False),(-4,6,False)], guides=[(None,-2),(0,3)], wide=True),
    "Unscaffolded construction/degree justification 4; graph and labeled features 3; full sets/end behavior/transformations 3; justified directions on separate intervals 2; solved and checked equation 2.")

add(8, 10, 5, [5],
    p("A 24-liter solution contains 6 liters of dissolved material. Only water evaporates; none of the dissolved material leaves. Let x be the number of liters that evaporate.")
    +'<div class="pair"><div>'+p("Concentration model; liters to evaporate to reach 40% (show work and check):")+work(3)
    +'</div><div>'+p("Initial percentage; percentage after 6 liters evaporate (show calculations):")+work(3)+'</div></div>'
    +p("Give the physically meaningful domain. Does the model's horizontal asymptote describe the long-term behavior of this actual process? Explain.")+work(2),
    p("The dissolved amount stays 6 while the whole becomes 24-x, so "+m(r"C(x)=6/(24-x)")+".")
    +p(m(r"C(0)=6/24=25\%,\quad C(6)=6/18=33\tfrac13\%")+".")
    +p(m(r"\frac6{24-x}=0.4\Rightarrow6=9.6-0.4x\Rightarrow x=9")+". Check: 6/15=40%, so 9 liters evaporate.")
    +p("There are only 18 liters of water. Physical domain "+m(r"[0,18]")+"; concentration reaches 100% at x=18."
       " Algebraically the HA is y=0 as x grows without bound, but those x-values are physically impossible. The actual process never approaches that limit."),
    "Model 2; initial/later percentages 3; target and check 2; physical domain 1.5; distinction between algebraic and physical end behavior 1.5.")

hole_curves = [(lambda x:(x-3)/(x+1),-6,-1.02),(lambda x:(x-3)/(x+1),-0.98,6)]
add(9, 6, 3, [6],
    p("A program treats A and B as the same function. The graph shown is B.")
    +'<div class="formula-row two"><div>'+m(r"A(x)=\frac{x^2-5x+6}{x^2-x-2}", True)
    +'</div><div>'+m(r"B(x)=\frac{x-3}{x+1}", True)+'</div></div>'
    +p("Make exactly the graph change needed to represent A. Complete the feature answers for A.")
    +'<div class="pair"><div>'+grid(hole_curves)+'</div><div>'
    +p("Is the program correct? Explain:")+work(1)
    +table(["Feature of A","Answer"], [["Domain",""],["Both intercepts",""],["Hole",""],["Vertical asymptote",""]])
    +p("Write an unsimplified expression with B's remaining values and vertical asymptote, but with its sole hole moved to x=4 instead of x=2.")+work(2)+'</div></div>',
    p(m(r"A(x)=\frac{(x-2)(x-3)}{(x-2)(x+1)}")+". Cancellation preserves the values only on A's original domain; A excludes both 2 and -1, whereas B excludes only -1.")
    +p("The program is wrong about equal functions. Remove the point "+m(r"(2,-1/3)")+" from B's graph."
       " A has that hole, VA x=-1, x-intercept (3,0), and y-intercept (0,-3). Domain "+m(r"(-\infty,-1)\cup(-1,2)\cup(2,\infty)")+".")
    +p("A suitable replacement is "+m(r"\frac{(x-4)(x-3)}{(x-4)(x+1)}")+", excluding -1 and 4. Its hole is "+m(r"(4,1/5)")+"."),
    "Factoring/equal-values versus equal-domains 2; hole and correct graph edit 1; domain/intercepts/VA 1.5; relocated-hole construction 1.5.")

slant = [(lambda x:(x*x-x+5)/(x-2),-6,1.98),(lambda x:(x*x-x+5)/(x-2),2.02,6)]
add(10, 6, 5, [7],
    p(m(r"S(x)=\frac{x^2+bx+5}{x-2}")+" has S(1)=-5. Find b. Determine any slant asymptote algebraically; do not estimate its equation from a drawing.")
    +work(3)+p("Can S cross its slant asymptote? Explain. Sketch S with its asymptotes and intercepts labeled.")
    +grid(wide=True, ystep=2, ymax=12)+p("For each expression below, give its horizontal asymptote, or explain why neither a horizontal nor a slant line describes the distant ends.")
    +'<div class="formula-row">'
    +'<div><span class="formula-label">(a)</span>'+m(r"\frac{2x^2+1}{x^2-4}", True)+'</div>'
    +'<div><span class="formula-label">(b)</span>'+m(r"\frac{3x-1}{x^2+1}", True)+'</div>'
    +'<div><span class="formula-label">(c)</span>'+m(r"\frac{x^3-x}{x-1}", True)+'</div></div>'+work(2),
    p(m(r"S(1)=-(6+b)=-5\Rightarrow b=-1")+". Long division gives "
       +m(r"S(x)=x+1+\frac7{x-2}")+". Thus the slant is y=x+1 and the VA is x=2.")
    +p("The difference from the slant is 7/(x-2), which never vanishes. The graph cannot cross that line."
       " It is below it when x&lt;2 and above when x&gt;2; the difference approaches zero at both far ends.")
    +p("The numerator has discriminant "+m(r"1-20=-19")+", so no real x-intercepts. The y-intercept is "+m(r"(0,-5/2)")+".")
    +grid(slant, [(0,-2.5,False)], guides=[(None,2),(1,1)], wide=True, ystep=2, ymax=12)
    +p("The three comparison answers are HA y=2, HA y=0, and neither. In the last, cancellation leaves "
       +m(r"x(x+1)")+" with x=1 still excluded; its quadratic growth has no horizontal or slant-line guide."),
    "Parameter/division/slant 2; noncrossing explanation 1; coherent graph/intercepts/asymptotes 1.5; three end-behavior classifications 1.5.")

add(11, 6, 3, [8],
    p("A linear machine accepts inputs in [0,8]. It sends 2 to 7 and 6 to 19.")
    +p("Find the forward rule and inverse rule, with the domain and range of each. What original input produced 16? Verify the two rules undo each other, using a variable rather than only one numerical example.")+work(4),
    p(m(r"m=(19-7)/(6-2)=3,\quad7=3(2)+c\Rightarrow c=1")+". Forward rule "+m(r"f(x)=3x+1")
       +" has domain [0,8] and range [1,25].")
    +p(m(r"y=3x+1\Rightarrow x=(y-1)/3")+", so "+m(r"f^{-1}(y)=(y-1)/3")+", domain [1,25], range [0,8]."
       " Output 16 came from "+m(r"(16-1)/3=5")+".")
    +p(m(r"f^{-1}(f(x))=(3x+1-1)/3=x")+" for x in [0,8], and "
       +m(r"f(f^{-1}(y))=3((y-1)/3)+1=y")+" for y in [1,25]."),
    "Forward reconstruction 1.5; inverse with parentheses 1.5; both exchanged sets 1; original input .5; symbolic two-way checks 1.5.")

add(12, 6, 5, [8],
    p("A moving platform's height is "+m(r"h(t)=4-\frac{(t-4)^2}{4}")+" meters for "+m(r"0\le t\le8")+" seconds.")
    +p("Find all times when the height is 3 meters. Can the full model have an inverse function? Explain.")
    +p("Choose the largest interval of allowed times on which an inverse function exists and sends height 3 to time 2. Derive that inverse rule and its domain.")
    +p("On the grid, sketch h only on your chosen interval and its inverse. Draw the reflection line. Label corresponding points.")+work(5)+grid(),
    p(m(r"3=4-(t-4)^2/4\Rightarrow(t-4)^2=4\Rightarrow t=2,6")+". Two times give the same height, so the full model has no inverse function.")
    +p("To return 2 rather than 6, choose the increasing half, the maximal interval [0,4]. On it the range is [0,4]."
       " Solving for t gives "+m(r"t=4\pm2\sqrt{4-y}")+"; only the minus sign stays in [0,4].")
    +p(m(r"h^{-1}(y)=4-2\sqrt{4-y},\quad0\le y\le4")+". Check: "
       +m(r"h^{-1}(3)=2,\quad h(2)=3")+". The original points (0,0),(2,3),(4,4) reflect to (0,0),(3,2),(4,4).")
    +grid([(lambda t:4-(t-4)**2/4,0,4),(lambda y:4-2*math.sqrt(4-y),0,4)],
          [(0,0,False),(2,3,False),(3,2,False),(4,4,False)], guides=[(1,0)], wide=True),
    "Both preimages and failure of unrestricted inverse 1.5; maximal branch 1; derived inverse/sign/domain 2; reflected labeled curves and y=x 1.5.")

GROUPS = [[1],[2,3],[4,5],[6],[7],[8,9],[10],[11,12]]
assert sum(q["points"] for q in questions) == 100
assert sum(q["minutes"] for q in questions) == 54
assert set(lt for q in questions for lt in q["learning_targets"]) == set(range(1,9))


def document(key=False):
    pages = []
    for page_number, group in enumerate(GROUPS, 1):
        body = ""
        for number in group:
            q = questions[number-1]
            body += f'<h2>{number}. <span style="float:right">{q["points"]} points</span></h2>'
            body += q["worked"] if key else q["student"]
            if key:
                body += '<p class="rubric"><b>Suggested credit:</b> '+q["rubric"]+"</p>"
        first = p("Name: __________________________  Date: ____________") if page_number == 1 and not key else ""
        if page_number == 1:
            first += p("60 minutes | 12 questions | 100 points | Four-function calculator") if not key else p("Worked solutions and suggested practice scoring; not a school grade scale.")
            first += p("Show requested work. Exact answers unless percentages are requested. Reserve about 6 minutes to check.") if not key else p("Score the requested reasoning; retain independent and consistent follow-through credit.")
        pages.append('<section class="sheet"><header><div style="font-size:8pt">MOTOR CITY MATH | STANDARD PRECALCULUS</div>'
                     '<h1>Final practice'+(" / worked key" if key else "")+"</h1>"+first+"</header><main>"+body
                     +f'</main><footer><span>November 21, 2026 | {"Worked key" if key else "Student copy"}</span><span>{page_number} / 8</span></footer></section>')
    css = (ASSETS/"katex.min.css").read_text(encoding="utf-8")
    def font(match):
        path = ASSETS / match.group(1).strip("'\"")
        mime = "font/woff2" if path.suffix == ".woff2" else "font/woff" if path.suffix == ".woff" else "font/ttf"
        return "url(data:"+mime+";base64,"+b64encode(path.read_bytes()).decode()+")"
    css = re.sub(r"url\(([^)]+)\)", font, css)
    js = (ASSETS/"katex.min.js").read_text(encoding="utf-8")
    return '<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Final practice'+(" key" if key else "")+'</title><style>'+css+CSS+'</style></head><body class="'+("key" if key else "student")+'">'+"".join(pages)+"<script>"+js+'</script><script>for(const n of document.querySelectorAll("[data-math]")){katex.render(n.dataset.math,n,{displayMode:n.dataset.display==="true",throwOnError:true,trust:false,output:"html"});}document.fonts.ready.then(()=>document.documentElement.dataset.fontsReady="true");</script></body></html>'


for key, name in [(False,"Final_Practice_2026-11-21"),(True,"Final_Practice_2026-11-21_KEY")]:
    (OUT/(name+".html")).write_text(document(key), encoding="utf-8")
(OUT/"questions.json").write_text(json.dumps(questions, indent=2), encoding="utf-8")
(OUT/"coverage.json").write_text(json.dumps(dict(points=100, estimated_work_minutes=54, checking_minutes=6,
    timing="Author estimate, not a measured completion guarantee",
    version="Direct-author replacement; simulated A-student reviewed all twelve questions before the final usability fixes; prior teacher reviews evaluated superseded drafts",
    student_review="All twelve attempted; graphs mentally reconstructed, four print pages inspected; five usability recommendations applied by the author without a second model pass",
    pages=8, groups=GROUPS, tasks=[{k:v for k,v in q.items() if k not in ("student","worked")} for q in questions]), indent=2), encoding="utf-8")
print(f"Built 12 questions, 100 points, 8 student pages and 8 key pages in {OUT}")
