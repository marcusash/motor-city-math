const m = String.raw;
const table = {
  heading: 'Selected values of f',
  rows: [['x', '-1', '1', '2', '4', '6'], ['f(x)', '5', '-3', '7', '2', '0']]
};
const skillsTable = {
  heading: 'Selected values of f',
  rows: [['x', '-2', '0', '2', '3', '5'], ['f(x)', '6', '1', '-4', '7', '2']]
};

module.exports = {
  status: 'Full student test authorized after parent feedback; shorter skills check remains draft. Not administered or approved for the dashboard.',
  grading: 'Deduct an originating error once. Award follow-through for consistent later work. Accept equivalent expressions, notation, and valid graphs. Do not infer a conceptual deficit from a low score alone. Grade only requested work; no unrequested explanations or exact polynomial extrema.',
  exams: [
    {
      slug: 'assessment-3-functions-75min', title: 'Prep Test 3: Functions',
      minutes: 75, points: 100,
      rationale: 'Parallel to the teacher-assigned Assessment 1, not Prep Test 2. Twelve unique numbers replace the original duplicate Q8. Same task families and order; new values, graph shapes, and boundary ownership. More weight on piecewise modeling, decomposition, and graph/table operations. This is targeted reassessment, not proof of durable mastery.',
      questions: [
        {
          id: 1, points: 10, difficulty: 2, minutes: 7, source: 'Teacher Q1, both parts',
          prompt: ['Graph each function. Label the axes and intercepts.',
            m`(a) \(f(x)=\frac32x-2\).`,
            m`(b) \(g(x)=-\frac32\sqrt{-x+2}+3\).`],
          layout: 'two-grids', range: 8,
          steps: [
            m`For (a), the slope is \(\frac32\) and the y-intercept is \((0,-2)\). Other points include \((2,1)\) and \((-2,-5)\). Setting \(y=0\) gives x-intercept \((\frac43,0)\). Draw a straight line with arrows.`,
            m`For (b), \(-x+2\ge0\), so the curve starts at \((2,3)\) and continues leftward and downward through \((1,\frac32),(-2,0),(-7,-\frac32)\). The fractional vertical stretch has magnitude \(\frac32\); the negative outside factor reflects vertically. Since \(-x+2=-(x-2)\), reflect horizontally and shift right 2. Intercepts are \((-2,0)\) and \((0,3-\frac32\sqrt2)\). Domain \((-\infty,2]\); range \((-\infty,3]\). Domain/range and transformation descriptions are reference information, not extra student requirements.`
          ],
          rubric: [
            [5, 'Part (a): correct slope/line 2; intercepts 2 (1 each); labeled axes and continuation 1.'],
            [5, 'Part (b): endpoint 1; correct direction and curvature 1; additional correct point 1; intercepts 1 (0.5 each); labeled axes and continuation 1. Accept exact intercept labels with approximate plotting.']
          ]
        },
        {
          id: 2, points: 6, difficulty: 2, minutes: 4, source: 'Teacher Q2',
          prompt: ['Write an equation for the graphed function in factored and standard form. Show your work.'],
          given: 'quadratic', range: 6,
          steps: [
            m`The zeros are \(-3\) and \(2\), so \(F(x)=a(x+3)(x-2)\).`,
            m`The point \((0,3)\) gives \(3=-6a\), so \(a=-\frac12\).`,
            m`Factored form: \(F(x)=-\frac12(x+3)(x-2)\). Standard form: \(F(x)=-\frac12x^2-\frac12x+3\).`
          ],
          rubric: [[2, 'Correct zero factors.'], [2, 'Use the marked point to find the leading factor.'], [2, 'Correct standard form. Preserve expansion follow-through.']]
        },
        {
          id: 3, points: 10, difficulty: 2, minutes: 6, source: 'Teacher Q3',
          prompt: ['For the graphed function, give the domain, range, end behavior, intervals of increase and decrease, and relative extrema. Use proper notation.'],
          given: 'characteristics', range: 6,
          steps: [
            m`The graph is \(F(x)=-x^3+3x^2\), drawn with continuation arrows. Domain and range are both \((-\infty,\infty)\). The formula is reference information, not given to the student.`,
            m`As \(x\to-\infty\), \(F(x)\to\infty\). As \(x\to\infty\), \(F(x)\to-\infty\).`,
            m`Increasing on \((0,2)\); decreasing on \((-\infty,0)\cup(2,\infty)\). Relative minimum \((0,0)\); relative maximum \((2,4)\).`
          ],
          rubric: [[2, 'Domain and range, 1 each.'], [2, 'End behavior, 1 per end.'], [3, 'Increasing interval 1; both decreasing intervals 1 each.'], [3, 'Relative minimum and maximum, 1.5 each: location 1 and correct classification 0.5.']]
        },
        {
          id: 4, points: 6, difficulty: 2, minutes: 5, source: 'Teacher Q4',
          prompt: [m`Graph \(F(x)=-x^3+x^2+6x\). Label the axes and intercepts.`],
          layout: 'graph', range: 8,
          steps: [
            m`Factor: \(F(x)=-x(x-3)(x+2)\). Zeros are \(-2,0,3\), all simple; cross at each.`,
            'The negative leading coefficient and odd degree give left end up, right end down. The y-intercept is (0,0). The graph is negative between -2 and 0 and positive between 0 and 3.',
            'Draw a smooth cubic with a valley between -2 and 0 and a peak between 0 and 3. Exact extrema are not required. Portions outside the numerical window continue with arrows.'
          ],
          rubric: [[2, 'Factoring or equivalent valid work.'], [2, 'Intercept locations and labels.'], [1, 'Correct end directions.'], [1, 'Correct smooth connections, crossings, and labeled axes.']]
        },
        {
          id: 5, points: 6, difficulty: 2, minutes: 4, source: 'Teacher Q5',
          prompt: ['Write an equation for the graphed polynomial. Show your work.'],
          given: 'polynomial', range: 6,
          steps: [
            m`The graph touches at \(-1\), crosses at \(2\), and has cubic end behavior. An equation is \(P(x)=a(x+1)^2(x-2)\).`,
            m`The marked point \((0,2)\) gives \(2=-2a\), so \(a=-1\). Therefore \(P(x)=-(x+1)^2(x-2)\).`,
            'This is one valid equation. Accept any polynomial genuinely matching the displayed graph and marked points; the simplest cubic is intended.'
          ],
          rubric: [[2, 'Correct zero factors.'], [2, 'Correct multiplicities.'], [2, 'Determine the leading factor from the marked point and state a valid equation.']]
        },
        {
          id: 6, points: 12, difficulty: 2, minutes: 6, source: 'Teacher Q6(a-c)',
          prompt: [
            m`Let \(f(x)=\sqrt{8-2x}\) and \(g(x)=x+1\).`,
            m`(a) Find \(\frac{f(x)}{g(x)}\) and its domain.`,
            m`(b) Find \(g(f(x))\).`,
            m`(c) Find \(f(a-b)\).`
          ],
          steps: [
            m`(a) \(\frac{f(x)}{g(x)}=\frac{\sqrt{8-2x}}{x+1}\). Require \(8-2x\ge0\), so \(x\le4\), and \(x+1\ne0\), so \(x\ne-1\). Domain: \((-\infty,-1)\cup(-1,4]\).`,
            m`(b) \(g(f(x))=\sqrt{8-2x}+1\).`,
            m`(c) \(f(a-b)=\sqrt{8-2(a-b)}=\sqrt{8-2a+2b}\). Either form is accepted.`
          ],
          rubric: [[4, 'Part (a): quotient 1; radical restriction 1; denominator restriction 1; complete domain 1.'], [4, 'Part (b): correct substitution 2; correct expression 2.'], [4, 'Part (c): substitute the entire argument 2; correct expression 2.']]
        },
        {
          id: 7, points: 12, difficulty: 2, minutes: 8, source: 'Teacher Q7',
          prompt: [
            m`Let \(h(x)=\begin{cases}2(x+1)^2-4,&x<-1\\-2x+1,&x\ge-1.\end{cases}\)`,
            '(a) Graph h on the provided axes.',
            m`(b) Find \(h(-2)\), \(h(-1)\), and \(h(2)\).`
          ],
          layout: 'graph', range: 8,
          steps: [
            m`For \(x<-1\), draw the left portion of \(y=2(x+1)^2-4\), vertically stretched by 2 and shifted left 1 and down 4, with an open point at \((-1,-4)\); sample points \((-2,-2)\) and \((-3,4)\).`,
            m`For \(x\ge-1\), draw \(y=-2x+1\), with a closed point at \((-1,3)\), continuing through \((0,1)\) and \((2,-3)\).`,
            m`The evaluations are \(h(-2)=-2\), \(h(-1)=3\), and \(h(2)=-3\). Each input belongs to only one branch.`
          ],
          rubric: [[4, 'Branch shapes and correct sides, 2 each.'], [2, 'Boundary coordinates, 1 each.'], [2, 'Open/closed marks, 1 each.'], [1, 'Labeled axes and appropriate continuation.'], [3, 'Evaluations, 1 each. If a branch-selection error recurs in graph and evaluations, deduct its selection component once; retain arithmetic credit.']]
        },
        {
          id: 8, points: 12, difficulty: 3, minutes: 7, source: 'Teacher Q8, kayak, page 4',
          prompt: [
            'A print studio makes custom fabric banners. A banner with an area of up to 6 square feet costs a flat $24. For larger banners, the studio charges $24 plus $3.50 for each square foot beyond the first 6; fractional square feet are charged proportionally. The studio makes banners with areas greater than 0 and no larger than 30 square feet.',
            '(a) Write a piecewise function C(a) for the cost in dollars, where a is the banner area in square feet.',
            '(b) Find the costs for banners with areas of 6, 10, and 30 square feet.'
          ],
          steps: [
            'The flat charge covers the first 6 square feet. Only the area beyond 6 is charged at the additional rate.',
            m`\(C(a)=\begin{cases}24,&0<a\le6\\24+3.50(a-6),&6<a\le30.\end{cases}\) The second expression may be written \(3.50a+3\). Domain: \((0,30]\).`,
            m`\(C(6)=24\), \(C(10)=24+3.50(4)=38\), and \(C(30)=24+3.50(24)=108\), all in dollars.`,
            'Areas above 30 square feet are outside this model, not free and not capped at $108. Area 0 is explicitly excluded.'
          ],
          rubric: [[2, 'Flat branch expression.'], [3, 'Additional-area expression: base charge 1; correct additional area 1; rate 1.'], [3, 'Branch intervals and full area domain, including boundary ownership. Accept placing 6 in either branch since the formulas agree there.'], [4, 'Costs: 6 square feet 1; 10 square feet 1.5; 30 square feet 1.5. Preserve evaluation follow-through from a model error.']]
        },
        {
          id: 9, points: 8, difficulty: 3, minutes: 6, source: 'Teacher Q8, graph properties, page 5',
          prompt: [
            'Graph a function with all of the following properties:',
            m`As \(x\to-\infty\), \(y\to\infty\), and as \(x\to\infty\), \(y\to\infty\).`,
            m`Decreasing on \((-\infty,-2)\).`,
            m`A relative minimum at \((2,-2)\).`,
            m`Y-intercept \((0,2)\).`
          ],
          layout: 'graph', range: 8,
          steps: [
            m`One possible graph is \(F(x)=\frac14(x^2-4)^2-2\). An equation is not required.`,
            'Both ends rise. It decreases to a relative minimum at (-2,-2), rises to (0,2), falls to the required relative minimum at (2,-2), then rises.',
            'Other graphs are valid. Assess the stated properties, not whether the student reproduces this example. Extra extrema are permitted.'
          ],
          rubric: [[2, 'Both ends rise, 1 each.'], [2, 'Decreasing throughout the stated interval.'], [2, 'A genuine relative minimum at the correct coordinate.'], [2, 'Correct y-intercept and a single-valued graph satisfying all properties together.']]
        },
        {
          id: 10, points: 8, difficulty: 2, minutes: 4, source: 'Teacher Q9, composition decomposition, page 5',
          prompt: [
            m`Let \(j(x)=\frac{5}{x^2+4}\). Find two functions f and g such that \(j(x)=f(g(x))\). Do not use \(f(x)=x\) or \(g(x)=x\).`,
            'Show that your functions give j when composed.'
          ],
          steps: [
            m`One choice is \(g(x)=x^2+4\) and \(f(x)=\frac5x\).`,
            m`Then \(f(g(x))=\frac5{g(x)}=\frac5{x^2+4}=j(x)\). Because \(x^2+4>0\), this composition is defined for every real x.`,
            'Accept any two nonidentity functions whose composition is j on its domain. Do not interchange their roles unless the resulting composition actually works.'
          ],
          rubric: [[3, 'Valid inner function.'], [3, 'Compatible outer function.'], [2, 'Correct composition check. Judge the pair together; award valid alternative decompositions in full.']]
        },
        {
          id: 11, points: 4, difficulty: 2, minutes: 4, source: 'Teacher Q10, ambiguous score not used for targeting',
          prompt: [
            'The continuous function g is defined for all real numbers. The table gives some values and its behavior on the indicated intervals.',
            'Which statement is guaranteed to be true?',
            '(A) g has a relative maximum at x=4.',
            '(B) The range of g is [-2,8].',
            '(C) g(x)=0 for some x in (4,7).',
            '(D) g has a relative minimum at x=0.'
          ],
          table: { heading: 'Behavior of g', rows: [
            ['x', '-5', '(-5,0)', '0', '(0,4)', '4', '(4,7)', '7'],
            ['g(x)', '6', 'decreasing', '-2', 'increasing', '3', 'increasing', '8']
          ] },
          steps: [
            'Answer D. The function decreases into x=0 and increases immediately after x=0, with continuity, so (0,-2) is a relative minimum.',
            'A is not true because g increases on both sides of 4. B is not guaranteed because nothing specifies g outside [-5,7]. C is false because g increases between positive values 3 and 8 on (4,7).',
            'Continuity is stated explicitly to remove any ambiguity about the value at the turning point.'
          ],
          rubric: [[4, 'Select D. No written explanation is required. This item retains original coverage; the original ambiguous margin mark is not evidence for a targeted weakness.']]
        },
        {
          id: 12, points: 6, difficulty: 3, minutes: 9, source: 'Teacher Q11(a-c)',
          prompt: [
            m`The graph of g is shown for \(-4\le x\le8\). Selected values of f are in the table; f is defined for all real numbers. Let \(h(x)=3x+2\).`,
            m`(a) Find \(f(g(-2))\).`,
            m`(b) Let \(j(x)=g(x)-h(x)\). Find \(j(5)\).`,
            m`(c) What is the domain of \(\frac{f(x)}{h(x)}\)?`
          ],
          given: 'operations', range: 8, table,
          steps: [
            m`(a) The horizontal branch gives \(g(-2)=1\). The table gives \(f(1)=-3\), so \(f(g(-2))=-3\).`,
            m`(b) Read \(g(5)=3\). Compute \(h(5)=17\), so \(j(5)=3-17=-14\).`,
            m`(c) f is defined for all real numbers. Require \(3x+2\ne0\), giving \(x\ne-\frac23\). Domain: \((-\infty,-\frac23)\cup(-\frac23,\infty)\). The finite domain of g does not restrict this different quotient.`
          ],
          rubric: [[2, 'Part (a): read inner value 1; table lookup 1.'], [2, 'Part (b): read graph and evaluate h, 1 combined; correct difference 1.'], [2, 'Part (c): denominator restriction 1; correct full domain 1.']]
        }
      ]
    },
    {
      slug: 'assessment-functions-skills-25min', title: 'Functions Skills Check',
      minutes: 25, points: 30,
      rationale: 'Four focused tasks, using different values from Prep Test 3. Targets the two verified zero-mark tasks (applied piecewise model and decomposition), the 1/3 graph/table operations task with faint attempts, and the 3/4 piecewise graph. The ambiguous multiple-choice mark is not used to infer a weakness. No coaching in the student copy. Use separately from the full exam; do not combine scores.',
      questions: [
        {
          id: 1, points: 8, difficulty: 2, minutes: 7, source: 'Teacher Q7',
          prompt: [
            m`Let \(p(x)=\begin{cases}x^2-1,&x<1\\-x+4,&x\ge1.\end{cases}\)`,
            '(a) Graph p on the provided axes.',
            m`(b) Find \(p(0)\), \(p(1)\), and \(p(3)\).`
          ],
          layout: 'graph', range: 6,
          steps: [
            m`Draw \(y=x^2-1\) only for \(x<1\), including \((0,-1)\) and \((-1,0)\), with an open point at \((1,0)\).`,
            m`Draw \(y=-x+4\) only for \(x\ge1\), starting with a closed point at \((1,3)\) and continuing right through \((3,1)\).`,
            m`\(p(0)=-1\), \(p(1)=3\), \(p(3)=1\).`
          ],
          rubric: [[3, 'Branch shapes and correct sides, 1.5 each.'], [2, 'Correct boundary coordinates and open/closed marks, 1 per endpoint.'], [3, 'Evaluations, 1 each. Deduct repeated branch-selection errors once; retain arithmetic credit.']]
        },
        {
          id: 2, points: 8, difficulty: 2, minutes: 6, source: 'Teacher Q8, kayak, page 4',
          prompt: [
            'A bicycle rental costs $18 for the first 2 hours or any part of that time. After 2 hours, each additional hour costs $5, with partial hours charged proportionally. Rentals last more than 0 and at most 6 hours.',
            '(a) Write a piecewise cost function B(t), with t in hours.',
            '(b) Find the costs for 0.75 hours, 3.5 hours, and 6 hours.'
          ],
          steps: [
            m`\(B(t)=\begin{cases}18,&0<t\le2\\18+5(t-2),&2<t\le6.\end{cases}\) The second formula may be written \(5t+8\).`,
            m`\(B(0.75)=18\), \(B(3.5)=18+5(1.5)=25.50\), and \(B(6)=18+5(4)=38\), in dollars.`,
            'Domain is (0,6]. The prompt does not permit longer rentals.'
          ],
          rubric: [[3, 'Formulas: flat branch 1; base fee and additional-time expression 2.'], [2, 'Intervals and duration domain. Either boundary ownership is valid at 2 because the formulas agree.'], [3, 'Three evaluations, 1 each; preserve follow-through from a model error.']]
        },
        {
          id: 3, points: 6, difficulty: 2, minutes: 4, source: 'Teacher Q9, composition decomposition',
          prompt: [
            m`For each function, find f and g such that \(f(g(x))\) equals the given function. Do not use \(f(x)=x\) or \(g(x)=x\). Show each composition.`,
            m`(a) \(J(x)=(5-2x)^3\).`,
            m`(b) \(R(x)=\sqrt{5-2x}\).`
          ],
          steps: [
            m`(a) Choose \(g(x)=5-2x\), \(f(x)=x^3\). Then \(f(g(x))=(5-2x)^3\).`,
            m`(b) Choose \(g(x)=5-2x\), \(f(x)=\sqrt{x}\). Then \(f(g(x))=\sqrt{5-2x}\), defined for \(x\le\frac52\).`,
            'Accept any valid nonidentity pair on the original domain. Domain is key reference information, not an extra student requirement.'
          ],
          rubric: [[3, 'Part (a): inner function 1; compatible outer function 1; verification 1.'], [3, 'Part (b): inner function 1; compatible outer function 1; verification 1.']]
        },
        {
          id: 4, points: 8, difficulty: 3, minutes: 8, source: 'Teacher Q11(a-c)',
          prompt: [
            m`The graph of g is shown for \(-4\le x\le6\). Selected values of f are in the table; f is defined for all real numbers. Let \(h(x)=2x-1\).`,
            m`(a) Find \(f(g(-1))\).`,
            m`(b) Let \(j(x)=g(x)-h(x)\). Find \(j(5)\).`,
            m`(c) What is the domain of \(\frac{f(x)}{h(x)}\)?`
          ],
          given: 'skills-operations', range: 6, table: skillsTable,
          steps: [
            m`(a) Read \(g(-1)=2\); the table gives \(f(2)=-4\). Therefore \(f(g(-1))=-4\).`,
            m`(b) Read \(g(5)=2\); compute \(h(5)=9\), so \(j(5)=2-9=-7\).`,
            m`(c) Require \(2x-1\ne0\), so \(x\ne\frac12\). Domain: \((-\infty,\frac12)\cup(\frac12,\infty)\). No restriction from g applies to this quotient.`
          ],
          rubric: [[2, 'Part (a): inner graph value 1; table lookup 1.'], [3, 'Part (b): graph value 1; h value 1; subtraction 1.'], [3, 'Part (c): denominator equation/restriction 2; complete domain 1.']]
        }
      ]
    }
  ]
};
