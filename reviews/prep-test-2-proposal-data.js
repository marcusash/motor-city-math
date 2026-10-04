window.prepTest2Proposal = {
  status: 'Draft for parent review; not an approved or administered exam',
  points: 100,
  workingMinutes: 70,
  checkingMinutes: 5,
  questions: [
    {
      id: 1, title: 'Finish a piecewise graph', difficulty: 1, points: 12, minutes: 8,
      target: 'Prep Test 1 Q5; Study Guide Q15-16. The missing evaluations and unfinished boundary need another chance to be demonstrated.',
      extension: 'A constant branch replaces the second sloping line. The range has a gap, so graph completion and range reasoning must agree.',
      stem: [
        'Let p(x)=2x+4 for x<-1, and p(x)=3 for x>=-1.',
        '(a) Find p(-2), p(-1), and p(2). Show which branch you use.',
        '(b) Graph p on axes x=-4 to 4, y=-5 to 5, with one unit per square. Continue each branch with an arrow. Label the boundary coordinates and show open or closed circles.',
        '(c) Give the domain and range in interval or set notation.'
      ],
      steps: [
        'For -2 use 2x+4: p(-2)=0. At -1 and 2 use the constant branch: both values are 3.',
        'Draw y=2x+4 to the left of an open (-1,2). Draw y=3 to the right of a closed (-1,3). The horizontal branch includes its boundary.',
        'Every real x belongs to a branch, so the domain is all real numbers. The left branch gives every y below 2; the right branch adds only 3. Range: (-infinity,2) union {3}.'
      ],
      rubric: [
        { points: 3, text: 'Three evaluations, 1 each.' },
        { points: 4, text: 'Correct branch shapes and sides, 2 each.' },
        { points: 2, text: 'Boundary coordinates and open/closed marks, 1 per boundary.' },
        { points: 3, text: 'Domain 1; complete range including its gap 2.' }
      ]
    },
    {
      id: 2, title: 'Write the rule and complete the square-root graph', difficulty: 2, points: 12, minutes: 8,
      target: 'Prep Test 1 Q6. Kai showed the shifted curve and domain/range but omitted the rule and a clearly marked starting point.',
      extension: 'Adds reflection and a vertical scale change, then asks for a graph, rule, and membership check that agree.',
      stem: [
        'Start with y=sqrt(x). Shift it right 1, reflect it across the x-axis, stretch it vertically by a factor of 2, then move it up 3.',
        '(a) Write the resulting rule.',
        '(b) Graph it using the transformed points from x=0,1,4,9 on the original square-root graph. Label all four new coordinates, including the starting point. Use axes x=-1 to 11, y=-4 to 4, one unit per square.',
        '(c) Give the domain and range. Use substitution to decide whether (5,-1) lies on the graph.'
      ],
      steps: [
        'The rule is y=-2sqrt(x-1)+3: x-1 shifts right; -2 reflects and stretches; +3 moves up.',
        'Map (u,v) to (u+1,-2v+3). The four labeled points are (1,3), (2,1), (5,-1), (10,-3). Join with a decreasing square-root curve starting at closed (1,3), continuing right.',
        'Domain [1,infinity); range (-infinity,3]. At x=5, y=-2sqrt(4)+3=-1, so (5,-1) belongs.'
      ],
      rubric: [
        { points: 3, text: 'Rule: horizontal shift, reflection/scale, vertical shift, 1 each.' },
        { points: 5, text: 'Four correct labeled points, 1 each; correct connected curve and included start, 1.' },
        { points: 2, text: 'Domain and range, 1 each.' },
        { points: 2, text: 'Substitution and correct membership conclusion.' }
      ]
    },
    {
      id: 3, title: 'Graph both composition orders with a reflection', difficulty: 3, points: 18, minutes: 12,
      target: 'Prep Test 1 Q4; Study Guide Q23. Coordinate mapping was strong; readable graphs, required line styles, and all vertex labels were not fully demonstrated.',
      extension: 'A negative-slope inner function reverses horizontal vertex order. This is more than changing the old compression numbers.',
      stem: [
        'The graph of f consists of straight segments through (-3,-1), (-1,3), (2,0), (4,2), in that order, with included endpoints. Let g(x)=2-x.',
        '(a) Make a transformed-vertex table for f(g(x)) and for g(f(x)). Show the coordinate rule for each.',
        '(b) On one grid, graph f(g(x)) with a solid line and g(f(x)) with a dashed line. Label every vertex with its coordinates and name each graph. Use axes x=-4 to 6, y=-3 to 4, one unit per square. Do not extend beyond the mapped endpoints.',
        '(c) Give both domains. Explain why the source vertices appear in reversed left-to-right order in one composition.'
      ],
      steps: [
        'For source (u,v), solve 2-x=u, so f(g(x)) maps to (2-u,v). Left-to-right vertices: (-2,2), (0,0), (3,3), (5,-1). Domain [-2,5].',
        'For g(f(x)), map (u,v) to (u,2-v). Vertices: (-3,3), (-1,-1), (2,2), (4,0). Domain [-3,4].',
        'Connect each vertex set in its own left-to-right order. Use solid and dashed lines as specified and mark all endpoints included.',
        'In f(g(x)), increasing the original u makes 2-u smaller: the horizontal reflection reverses vertex order. In g(f(x)), only vertical coordinates change.'
      ],
      rubric: [
        { points: 4, text: 'Two mapping rules, 2 each.' },
        { points: 8, text: 'Four transformed vertices for each composition, 1 each.' },
        { points: 3, text: 'Correct segment connections and included endpoints 2; all coordinate labels, graph names, and specified line styles 1 combined.' },
        { points: 2, text: 'Domains, 1 each.' },
        { points: 1, text: 'Explains horizontal reversal.' }
      ],
      graphs: [
        { label: 'Given graph of f', x: [-4,6], y: [-3,4], lines: [{ name: 'f', vertices: [[-3,-1],[-1,3],[2,0],[4,2]] }] }
      ]
    },
    {
      id: 4, title: 'Read the graph before doing the next step', difficulty: 2, points: 12, minutes: 8,
      target: 'Prep Test 1 Q9; Study Guide Q21-22. One zero and two interval boundaries were wrong; an earlier nested evaluation had a wrong intermediate value.',
      extension: 'Requires an explicit intermediate read in both composition orders and distinguishes zeros from turning-point boundaries.',
      stem: [
        'Both graphs consist of straight segments joining the listed vertices, with included endpoints. f: (-4,2), (-2,-2), (1,1), (4,-2). g: (-3,0), (0,3), (3,0). The graphs below use axes x=-5 to 5, y=-3 to 4, one unit per grid line.',
        '(a) Find f(-1) and g(-1).',
        '(b) Find g(f(-1)) and f(g(-1)). Write the intermediate value for each before evaluating the outside function.',
        '(c) Give all zeros of f and its increasing and decreasing intervals.'
      ],
      steps: [
        'Between (-2,-2) and (1,1), f(x)=x, so f(-1)=-1. On the left branch of g, g(x)=x+3, so g(-1)=2.',
        'g(f(-1))=g(-1)=2. In the other order, f(g(-1))=f(2)=0, since the last segment of f has rule y=2-x.',
        'The first segment of f has rule y=-2x-6, giving zero -3. The middle segment gives zero 0, and the last gives zero 2.',
        'f increases on (-2,1) and decreases on (-4,-2) union (1,4). Turning-point x-coordinates, not the zeros, are interval boundaries.'
      ],
      rubric: [
        { points: 4, text: 'Two initial graph reads, 2 each.' },
        { points: 4, text: 'Two nested evaluations, 2 each. Use follow-through credit for correctly evaluating the outside function at an earlier incorrect but defined value.' },
        { points: 2, text: 'All three zeros: 0.5 each, plus 0.5 for a complete list with no extra zeros.' },
        { points: 2, text: 'Increasing interval 1; two decreasing intervals 0.5 each. Award half of the interval credit when direction and one endpoint are correct.' }
      ],
      graphs: [
        { label: 'Given graphs of f and g', x: [-5,5], y: [-3,4], lines: [
          { name: 'f (solid)', vertices: [[-4,2],[-2,-2],[1,1],[4,-2]] },
          { name: 'g (dashed)', dashed: true, vertices: [[-3,0],[0,3],[3,0]] }
        ] }
      ]
    },
    {
      id: 5, title: 'Build and draw a graph from its characteristics', difficulty: 2, points: 10, minutes: 7,
      target: 'Study Guide Q6; Prep Test 1 Q6. A correct equation without its requested graph is not a complete response.',
      extension: 'Uses a downward absolute-value graph rather than another upward parabola or square-root translation.',
      stem: [
        'Find a function of the form q(x)=a|x-h|+k with domain all real numbers, range (-infinity,4], maximum (2,4), and y-intercept (0,0).',
        '(a) Find a, h, and k and write q(x). Show how the intercept determines a.',
        '(b) Graph q on axes x=-2 to 6, y=-5 to 5, one unit per square. Label the vertex and both x-intercepts; draw arrows.',
        '(c) State where q increases and decreases, and confirm its domain and range.'
      ],
      steps: [
        'The vertex gives h=2, k=4. Substitute (0,0): 0=2a+4, so a=-2. Thus q(x)=-2|x-2|+4.',
        'The graph is a downward V with vertex (2,4), x-intercepts (0,0), (4,0), and rays extending both ways.',
        'Increasing (-infinity,2); decreasing (2,infinity). Domain all real numbers; range (-infinity,4].'
      ],
      rubric: [
        { points: 3, text: 'Correct form from vertex 1; intercept calculation 1; final rule 1.' },
        { points: 4, text: 'Downward V and continuing rays 1; vertex and both intercept labels, 1 each.' },
        { points: 1, text: 'Increasing/decreasing intervals, 0.5 each.' },
        { points: 2, text: 'Domain/range, 1 each.' }
      ]
    },
    {
      id: 6, title: 'Show a flattened crossing in a fifth-degree polynomial', difficulty: 3, points: 14, minutes: 10, polynomialDegree: 5,
      target: 'Study Guide Q11; Prep Test 1 Q7-8. Polynomial algebra is strong, but a clearly flattened odd-multiplicity crossing needs fresh evidence.',
      extension: 'Constructs and sketches a fifth-degree polynomial, then uses root multiplicities to explain strict sign intervals.',
      stem: [
        'A degree-5 polynomial P has exactly two distinct real zeros: -2 with multiplicity 2, and 1 with multiplicity 3. It passes through (0,-8).',
        '(a) Find P in factored form and show how you determine its leading factor.',
        '(b) Make a qualitative sketch. Label both zeros and the y-intercept, show the correct ends, and clearly show the touch at one zero and flattened crossing at the other. Exact extrema are not required; the sketch need not use a uniform vertical scale.',
        '(c) State the intervals where P(x)>0 and P(x)<0. Explain where the sign changes and where it does not.'
      ],
      steps: [
        'P(x)=a(x+2)^2(x-1)^3. From P(0)=-8, -4a=-8, so a=2.',
        'P(x)=2(x+2)^2(x-1)^3 has positive leading coefficient and odd degree: left end down, right end up. Touch the axis at (-2,0) without changing sign; cross with horizontal flattening at (1,0). Label (0,-8).',
        'The squared factor is positive except at -2; the cubic factor is negative below 1 and positive above 1. P>0 on (1,infinity). P<0 on (-infinity,-2) union (-2,1). Exclude both zeros from strict sign intervals.'
      ],
      rubric: [
        { points: 4, text: 'Multiplicity factors 2; leading-factor calculation and final equation 2.' },
        { points: 1, text: 'Correct labeled y-intercept.' },
        { points: 3, text: 'Both labeled zeros 1; touch at -2 1; clearly flattened crossing at 1 1.' },
        { points: 2, text: 'Both end directions, 1 each.' },
        { points: 4, text: 'Positive interval 1; negative intervals 2; explanation of sign change/no change 1.' }
      ]
    },
    {
      id: 7, title: 'Keep all restrictions in a composed quotient', difficulty: 3, points: 12, minutes: 9,
      target: 'Prep Test 1 Q2/Q11; Study Guide Q19-20. Both reports show strong domain work; retain one deeper transfer problem rather than repeat basic domain arithmetic.',
      extension: 'A square-root composition and two excluded denominator values interact, leaving a bounded domain with two holes.',
      stem: [
        'Let f(t)=sqrt(t), g(x)=9-x^2, and H(x)=f(g(x))/(g(x)-5).',
        '(a) Write H as one expression in x.',
        '(b) Find every real restriction before writing the domain in interval notation. Show why each excluded value is excluded.',
        '(c) Is x=3 allowed? Is x=2 allowed? Explain using the original expression.'
      ],
      steps: [
        'H(x)=sqrt(9-x^2)/(4-x^2).',
        'The square root requires 9-x^2>=0, giving -3<=x<=3. The denominator requires 4-x^2!=0, so exclude -2 and 2.',
        'Domain [-3,-2) union (-2,2) union (2,3]. At 3, f(g(3))=sqrt(0)=0 and the denominator is -5, so it is allowed. At 2, g(2)=5, so the original denominator is zero and it is not allowed.'
      ],
      rubric: [
        { points: 3, text: 'Correct substitution in numerator 2 and denominator 1.' },
        { points: 3, text: 'Radical inequality and bounded restriction.' },
        { points: 2, text: 'Both denominator exclusions, 1 each.' },
        { points: 2, text: 'Final interval intersection including the allowed endpoints.' },
        { points: 2, text: 'Boundary checks and explanations, 1 each.' }
      ]
    },
    {
      id: 8, title: 'Sketch a quartic with crossings and a touch', difficulty: 3, points: 10, minutes: 8, polynomialDegree: 4,
      target: 'Study Guide Q7/Q24; Prep Test 1 Q7-8. Marcus requests more polynomial graph execution, including an even-degree example, not only correct equations.',
      extension: 'A quartic combines two simple crossings and an even-multiplicity touch. Compare its two ends with the fifth-degree polynomial in Q6.',
      stem: [
        'Let R(x)=-(x+2)(x-1)^2(x-3).',
        '(a) State the degree, leading coefficient, zeros, and multiplicities. Find the y-intercept.',
        '(b) Make a qualitative sketch with all intercepts labeled and arrows on both ends. Show which zeros cross and which touch. Use signs between the zeros to keep the curve on the correct side of the axis. Exact extrema and a uniform vertical scale are not required.',
        '(c) State the intervals where R(x)>0 and R(x)<0. Explain why its ends point the same way, unlike the odd-degree polynomial in Question 6.'
      ],
      steps: [
        'Degree 4, leading coefficient -1. Zeros -2 and 3 are simple; 1 has multiplicity 2. R(0)=-(2)(1)(-3)=6, so label (0,6).',
        'Both ends fall. Cross upward at (-2,0), stay above the axis, touch and turn at (1,0), stay above until crossing downward at (3,0). Draw a smooth graph with a peak on each side of the touch; exact peaks are not requested.',
        'R>0 on (-2,1) union (1,3); R<0 on (-infinity,-2) union (3,infinity). The even root does not change sign but is excluded from the strict-positive intervals.',
        'Even degree makes the signs at the two far ends the same; the negative leading coefficient makes both ends fall. Odd degree makes the two ends opposite.'
      ],
      rubric: [
        { points: 2, text: 'Degree/leading coefficient 1; zeros and multiplicities 1.' },
        { points: 1, text: 'Calculated and labeled y-intercept.' },
        { points: 3, text: 'Labeled zeros 1; crossing/touch behavior 1; correctly signed smooth connections 1.' },
        { points: 1, text: 'Both ends down.' },
        { points: 2, text: 'Complete positive and negative interval lists, 1 each.' },
        { points: 1, text: 'Even versus odd degree end-behavior explanation.' }
      ]
    }
  ]
};
