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
        '(b) Graph p on axes x=-6 to 6, y=-6 to 6, with one unit per square. Continue each branch with an arrow. Label the boundary coordinates and show open or closed circles.',
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
      id: 2, title: 'Transform both coordinates of a given graph', difficulty: 2, points: 12, minutes: 6,
      target: 'Study Guide Q18; Prep Test 1 Q4/Q6. Marcus requests another check of horizontal and vertical graph transformations together. The supplied early photo has no added graph; the earlier review credited a later close-up, so this is a practice priority rather than proof of misunderstanding.',
      extension: 'Keeps the original task type: a horizontal shift and vertical reflection, with a vertical shift added. No scaling, fractions, coordinate-rule derivation, or extra point check.',
      stem: [
        'The graph of f is shown below. Its vertices are (-3,1), (-1,-2), (2,0), and (4,2), joined by straight segments, with included endpoints. Let h(x)=-f(x-2)+1.',
        '(a) Graph h on the provided grid. Label all vertices with their coordinates and mark the endpoints. Use axes x=-8 to 8, y=-8 to 8, one unit per square.',
        '(b) Give the domain and range of h.'
      ],
      steps: [
        'For source point (u,v), the new point is (u+2,1-v): shift right 2, reflect across the x-axis, then shift up 1.',
        'The vertices become (-1,0), (1,3), (4,1), and (6,-1). Join in order with straight segments and included endpoints.',
        'Domain [-1,6]. The original range [-2,2] becomes [-1,3] after reflection and vertical shift.'
      ],
      rubric: [
        { points: 4, text: 'Four transformed vertices, 1 each.' },
        { points: 2, text: 'Correctly connected straight segments. Preserve follow-through credit from an earlier coordinate error.' },
        { points: 2, text: 'All coordinate labels 1; both included endpoints 1.' },
        { points: 2, text: 'Domain.' },
        { points: 2, text: 'Range.' }
      ],
      graphs: [
        { label: 'Given graph of f for Question 2', x: [-6,6], y: [-6,6], lines: [{ name: 'f', vertices: [[-3,1],[-1,-2],[2,0],[4,2]] }] }
      ]
    },
    {
      id: 3, title: 'Graph both composition orders with a reflection', difficulty: 3, points: 18, minutes: 12,
      target: 'Prep Test 1 Q4; Study Guide Q23. Coordinate mapping was strong; readable graphs, required line styles, and all vertex labels were not fully demonstrated.',
      extension: 'Builds on Kai’s correct mappings in Prep Test 1: each order now combines reflection, scale, and shift, with half-unit horizontal coordinates. The prompt does not tell him which order reverses the vertices.',
      stem: [
        'The graph of f consists of straight segments through (-3,-1), (-1,3), (2,0), (4,2), in that order, with included endpoints. Let g(x)=1-2x.',
        '(a) Graph f(g(x)) and g(f(x)) on the provided grid. Use a solid line for f(g(x)) and a dashed line for g(f(x)). Label the vertices and both graphs. The axes run from -6 to 6, one unit per square.',
        '(b) Give both domains and describe the transformations of f in each composition. Show your work.'
      ],
      steps: [
        'For source (u,v), solve 1-2x=u, so f(g(x)) maps to ((1-u)/2,v). Left-to-right vertices: (-3/2,2), (-1/2,0), (1,3), (2,-1). Domain [-3/2,2].',
        'For g(f(x)), map (u,v) to (u,1-2v). Vertices: (-3,3), (-1,-5), (2,1), (4,-3). Domain [-3,4].',
        'Connect each vertex set in its own left-to-right order. Use solid and dashed lines as specified and mark all endpoints included.',
        'For f(g(x)), reflect horizontally, compress horizontally by 1/2, then shift right 1/2. For g(f(x)), reflect vertically, stretch vertically by 2, then shift up 1. Equivalent correctly ordered descriptions are accepted.'
      ],
      rubric: [
        { points: 4, text: 'Two mapping rules, 2 each.' },
        { points: 8, text: 'Four transformed vertices for each composition, 1 each.' },
        { points: 3, text: 'Correct segment connections and included endpoints 2; all coordinate labels, graph names, and specified line styles 1 combined.' },
        { points: 2, text: 'Domains, 1 each.' },
        { points: 1, text: 'Correct transformation description for each composition, 0.5 each.' }
      ],
      graphs: [
        { label: 'Given graph of f', x: [-6,6], y: [-6,6], lines: [{ name: 'f', vertices: [[-3,-1],[-1,3],[2,0],[4,2]] }] }
      ]
    },
    {
      id: 4, title: 'Evaluate and solve a composition from two graphs', difficulty: 3, points: 12, minutes: 10,
      target: 'Prep Test 1 Q9; Study Guide Q21-22. One zero and two interval boundaries were wrong; an earlier nested evaluation had a wrong intermediate value.',
      extension: 'Uses fractional inputs and asks for every solution of a composite equation. Kai must work backward through both graphs and collect multiple preimages, not just read two obvious values.',
      stem: [
        'Both graphs consist of straight segments joining the listed vertices, with included endpoints. f: (-4,2), (-2,-2), (1,1), (4,-2). g: (-3,0), (0,3), (3,0). The graphs below use axes x=-6 to 6, y=-6 to 6, one unit per grid line.',
        '(a) Find g(f(-3.5)) and f(g(-3.5)). Show your work.',
        '(b) Find all x-values for which g(f(x))=2. Show your work.',
        '(c) Give all zeros of f and its increasing and decreasing intervals.'
      ],
      steps: [
        'The first segment of f has rule y=-2x-6, so f(-3.5)=1. Then g(f(-3.5))=g(1)=2. Also g(-3.5) is undefined because g has domain [-3,3], so f(g(-3.5)) is undefined.',
        'To solve g(f(x))=2, the graph of g gives inner values -1 and 1. Solve f(x)=-1 or f(x)=1 on every segment.',
        'For f(x)=-1, the solutions are -2.5, -1, and 3. For f(x)=1, the solutions are -3.5 and 1. The complete set is {-3.5,-2.5,-1,1,3}. All five inner values are in the domain of g.',
        'The first segment of f has rule y=-2x-6, giving zero -3. The middle segment gives zero 0, and the last gives zero 2.',
        'f increases on (-2,1) and decreases on (-4,-2) union (1,4). Turning-point x-coordinates, not the zeros, are interval boundaries.'
      ],
      rubric: [
        { points: 4, text: 'First nested evaluation: intermediate value and final value, 1 each. Second: recognizes the inside function is undefined and concludes the composite is undefined, 1 each. Preserve valid follow-through credit.' },
        { points: 4, text: 'Identifies both inner target values, 1; five correct x-values, 0.5 each; complete list with no extras, 0.5. Do not deduct repeatedly for one propagated graph-read error.' },
        { points: 2, text: 'All three zeros: 0.5 each, plus 0.5 for a complete list with no extra zeros.' },
        { points: 2, text: 'Increasing interval 1; two decreasing intervals 0.5 each. Award half of the interval credit when direction and one endpoint are correct.' }
      ],
      graphs: [
        { label: 'Given graphs of f and g', x: [-6,6], y: [-6,6], lines: [
          { name: 'f (solid)', vertices: [[-4,2],[-2,-2],[1,1],[4,-2]] },
          { name: 'g (dashed)', dashed: true, vertices: [[-3,0],[0,3],[3,0]] }
        ] }
      ]
    },
    {
      id: 5, title: 'Compare two algebraic compositions', difficulty: 3, points: 10, minutes: 7,
      target: 'Prep Test 1 Q3; Study Guide Q20/Q25. Kai correctly substituted and expanded functions. This extends those demonstrated skills rather than introducing an unsupported absolute-value graph family.',
      extension: 'Moves beyond evaluating the two orders at one input: determine whether the compositions can be equal at any real input.',
      stem: [
        'Let A(x)=x^2-2x and B(x)=2x-1.',
        '(a) Find and simplify A(B(x)) and B(A(x)).',
        '(b) Find all real x-values for which A(B(x))=B(A(x)). Justify your answer.'
      ],
      steps: [
        'A(B(x))=(2x-1)^2-2(2x-1)=4x^2-8x+3.',
        'B(A(x))=2(x^2-2x)-1=2x^2-4x-1.',
        'Equality requires 2x^2-4x+4=0, or (x-1)^2+1=0. A real square cannot equal -1, so there are no real solutions. Equivalently, the quadratic discriminant is negative.',
        'The difference A(B(x))-B(A(x))=2(x-1)^2+2 is always positive, so the first composition is always greater. This observation is a valid justification, not an extra student requirement.'
      ],
      rubric: [
        { points: 3, text: 'A(B(x)): full substitution 1; correct expansion 2.' },
        { points: 3, text: 'B(A(x)): full substitution 1; correct simplification 2.' },
        { points: 3, text: 'Correct equality equation and valid real-solution reasoning. Preserve algebraic follow-through from one earlier error.' },
        { points: 1, text: 'Explicitly concludes no real solutions.' }
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
