window.prepTest2Proposal = {
  status: 'Draft for parent review; not an approved or administered exam',
  points: 100,
  workingMinutes: 70,
  checkingMinutes: 5,
  questions: [
    {
      id: 1, title: 'Finish a piecewise graph', difficulty: 1, points: 10, minutes: 6,
      target: 'Prep Test 1 Q5; Study Guide Q15-16. The missing evaluations and unfinished boundary need another chance to be demonstrated.',
      extension: 'A constant branch replaces the second sloping line. The range has a gap, so graph completion and range reasoning must agree.',
      stem: [
        'Let p(x)=2x+4 for x<-1, and p(x)=3 for x>=-1.',
        '(a) Find p(-2), p(-1), and p(2).',
        '(b) Graph p on the provided coordinate plane.',
        '(c) Give the domain and range in interval or set notation.'
      ],
      steps: [
        'For -2 use 2x+4: p(-2)=0. At -1 and 2 use the constant branch: both values are 3.',
        'Draw y=2x+4 to the left of an open (-1,2). Draw y=3 to the right of a closed (-1,3). The horizontal branch includes its boundary.',
        'Every real x belongs to a branch, so the domain is all real numbers. The left branch gives every y below 2; the right branch adds only 3. Range: (-infinity,2) union {3}.'
      ],
      rubric: [
        { points: 3, text: 'Three evaluations, 1 each.' },
        { points: 2, text: 'Correct branch shapes and sides, 1 each.' },
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
        '(a) Graph h on the provided coordinate plane. Label its vertices.',
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
      id: 3, title: 'Graph both composition orders with a reflection', difficulty: 3, points: 14, minutes: 9,
      target: 'Prep Test 1 Q4; Study Guide Q23. Coordinate mapping was strong; readable graphs, required line styles, and all vertex labels were not fully demonstrated.',
      extension: 'Marcus requested a new fractional-slope transfer task: each order combines reflection, scale, and shift. The inside slope -3/5 requires the fractional reciprocal 5/3 for horizontal scaling. The original source graph is retained; resulting coordinates use manageable thirds and fifths. This is new to Kai, not evidence of a previously demonstrated deficit. The student prompt supplies no reciprocal hint.',
      stem: [
        'The graph of f consists of straight segments through (-3,-1), (-1,3), (2,0), (4,2), in that order, with included endpoints. Let g(x)=1-(3/5)x.',
        '(a) Graph f(g(x)) and g(f(x)) on the provided coordinate plane. Use a solid line for f(g(x)) and a dashed line for g(f(x)). Label the vertices and both graphs.',
        '(b) Give both domains and describe the transformations of f in each composition. Show your work.'
      ],
      steps: [
        'For source (u,v), solve 1-(3/5)x=u, so f(g(x)) maps to ((5/3)(1-u),v). Left-to-right vertices: (-5,2), (-5/3,0), (10/3,3), (20/3,-1). Domain [-5,20/3].',
        'For g(f(x)), map (u,v) to (u,1-(3/5)v). Vertices: (-3,8/5), (-1,-4/5), (2,1), (4,-1/5). Domain [-3,4].',
        'Connect each vertex set in its own left-to-right order. Use solid and dashed lines as specified and mark all endpoints included.',
        'For f(g(x)), reflect horizontally, stretch horizontally by 5/3, then shift right 5/3. For g(f(x)), reflect vertically, compress vertically by 3/5, then shift up 1. Equivalent correctly ordered descriptions are accepted.'
      ],
      rubric: [
        { points: 2, text: 'Valid coordinate work for both composition orders, 1 each. Accept mapping rules, substitution equations, or equivalent calculations; no particular method is required.' },
        { points: 6, text: 'Four transformed vertices for each composition, 0.75 each.' },
        { points: 3, text: 'Correct segment connections and included endpoints 2; all coordinate labels, graph names, and specified line styles 1 combined.' },
        { points: 2, text: 'Domains, 1 each.' },
        { points: 1, text: 'Correct transformation description for each composition, 0.5 each.' }
      ],
      graphs: [
        { label: 'Given graph of f', x: [-6,6], y: [-6,6], lines: [{ name: 'f', vertices: [[-3,-1],[-1,3],[2,0],[4,2]] }] }
      ]
    },
    {
      id: 4, title: 'Simplify and solve a rational expression', difficulty: 3, points: 10, minutes: 7,
      target: 'Prep Test 1 Q2/Q11; Study Guide Q19-20. Algebra and domain restrictions were strong; this is transfer of those strengths, not remediation of an observed deficit.',
      extension: 'Replaces redundant graph composition with factoring, cancellation, an equation, and comparison of original and simplified domains. A cancelled factor still restricts the original function.',
      stem: [
        'Let R(x)=(x^2-x-2)/(x^2+x-6).',
        '(a) Simplify R(x) and state its domain. Show your work.',
        '(b) Solve R(x)=1/2.',
        '(c) Let S(x)=(x+1)/(x+3). Do R and S have the same domain? Explain.'
      ],
      steps: [
        'Factor the numerator as (x-2)(x+1) and denominator as (x-2)(x+3). Simplify to (x+1)/(x+3), retaining x!=2 and x!=-3. Domain: (-infinity,-3) union (-3,2) union (2,infinity).',
        'Solve 2(x+1)=x+3 to get x=1. It is in the original domain and gives R(1)=1/2.',
        'S excludes only -3. R also excludes 2, where its original denominator is zero. Thus the domains differ, even though their values agree wherever R is defined.'
      ],
      rubric: [
        { points: 5, text: 'Factoring 2 (1 per polynomial); simplification 1; original domain 2 (1 per exclusion). Accept equivalent domain notation.' },
        { points: 3, text: 'Valid equation work 2; solution x=1, 1. Preserve valid algebraic follow-through from an earlier error.' },
        { points: 2, text: 'Correct domain comparison 1; explains original denominator exclusion at x=2, 1. Do not deduct again for the same restriction error from part (a).' }
      ],
      graphs: []
    },
    {
      id: 5, title: 'Compare two algebraic compositions', difficulty: 3, points: 6, minutes: 5,
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
        { points: 2, text: 'A(B(x)): full substitution 1; correct expansion 1.' },
        { points: 2, text: 'B(A(x)): full substitution 1; correct simplification 1.' },
        { points: 1, text: 'Correct equality equation and valid real-solution reasoning. Preserve algebraic follow-through from one earlier error.' },
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
      id: 7, title: 'Keep all restrictions in a composed quotient', difficulty: 3, points: 8, minutes: 6,
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
        { points: 2, text: 'Correct substitution in numerator 1 and denominator 1.' },
        { points: 2, text: 'Radical inequality and bounded restriction.' },
        { points: 1, text: 'Both denominator exclusions, 0.5 each.' },
        { points: 2, text: 'Final interval intersection including the allowed endpoints.' },
        { points: 1, text: 'Boundary checks and explanations, 0.5 each.' }
      ]
    },
    {
      id: 8, title: 'Sketch a quartic with crossings and a touch', difficulty: 3, points: 8, minutes: 6, polynomialDegree: 4,
      target: 'Study Guide Q7/Q24; Prep Test 1 Q7-8. Marcus requests more polynomial graph execution, including an even-degree example, not only correct equations.',
      extension: 'A quartic combines two simple crossings and an even-multiplicity touch. Compare its two ends with the fifth-degree polynomial in Q6.',
      stem: [
        'Let R(x)=-(x+2)(x-1)^2(x-3).',
        '(a) State the degree, leading coefficient, zeros, and multiplicities. Find the y-intercept.',
        '(b) Sketch R on the provided axes. Label its intercepts.',
        '(c) State the intervals where R(x)>0 and R(x)<0. Explain why its ends point the same way, unlike the odd-degree polynomial in Question 6.'
      ],
      steps: [
        'Degree 4, leading coefficient -1. Zeros -2 and 3 are simple; 1 has multiplicity 2. R(0)=-(2)(1)(-3)=6, so label (0,6).',
        'Both ends fall. Cross upward at (-2,0), stay above the axis, touch and turn at (1,0), stay above until crossing downward at (3,0). Draw a smooth graph with a peak on each side of the touch; exact peaks are not requested.',
        'R>0 on (-2,1) union (1,3); R<0 on (-infinity,-2) union (3,infinity). The even root does not change sign but is excluded from the strict-positive intervals.',
        'Even degree makes the signs at the two far ends the same; the negative leading coefficient makes both ends fall. Odd degree makes the two ends opposite.'
      ],
      rubric: [
        { points: 1, text: 'Degree/leading coefficient 0.5; zeros and multiplicities 0.5.' },
        { points: 1, text: 'Calculated and labeled y-intercept.' },
        { points: 2, text: 'Labeled zeros 0.5; crossing/touch behavior 1; correctly signed smooth connections 0.5.' },
        { points: 1, text: 'Both ends down.' },
        { points: 2, text: 'Complete positive and negative interval lists, 1 each.' },
        { points: 1, text: 'Even versus odd degree end-behavior explanation.' }
      ]
    },
    {
      id: 9, title: 'Use a composite model to meet a budget', difficulty: 3, points: 10, minutes: 9,
      target: 'Study Guide Q14 and Prep Test 1 Q10. Kai handled the earlier cost compositions correctly; this asks him to build a composition with a price breakpoint and work backward from a budget.',
      extension: 'Unlike the previous linear tax calculation, area depends nonlinearly on width and pricing changes at 30 square feet. The budget answer must fit both the price branch and the geometric domain.',
      stem: [
        'A rectangular planting bed has perimeter 24 feet. Its width is w feet, with 2<=w<=6, and its length is 12-w feet. Its area is A(w)=w(12-w) square feet.',
        'Soil delivery costs C(a)=8a dollars when 0<=a<=30 square feet, and C(a)=240+5(a-30) dollars when a>30 square feet. There are no other charges.',
        '(a) Write the composition giving cost in terms of width. Explain the order using units.',
        '(b) Write that cost as a piecewise function of w, including the width intervals for each price rule. State the model domain.',
        '(c) Find the cost when w=4.',
        '(d) With a budget of $260, find the greatest permitted width. Give an exact value and a decimal to the nearest hundredth. Show your work.'
      ],
      steps: [
        'Use C(A(w)): A converts width in feet to area in square feet; C converts area to dollars.',
        'A(w)=12w-w^2=36-(w-6)^2. On [2,6], area increases from 20 to 36. A=30 gives (w-6)^2=6, so the relevant breakpoint is b=6-sqrt(6), approximately 3.55.',
        'Cost is 96w-8w^2 for 2<=w<=6-sqrt(6), and 60w-5w^2+90 for 6-sqrt(6)<w<=6. Domain [2,6]. Either formula gives $240 at the breakpoint; respect the original price condition when assigning the boundary.',
        'At w=4, area is 32, so use the second price branch: C(32)=240+5(2)=$250.',
        '$260 is above the $240 breakpoint price, so the maximum uses the second branch: 5A+90=260 gives A=34. Then 36-(w-6)^2=34 gives w=6 plus or minus sqrt(2). Only 6-sqrt(2) is in [2,6].',
        'The greatest width is 6-sqrt(2) feet, approximately 4.59 feet. Area and both price branches are increasing over the permitted widths, so wider permitted beds exceed the budget. Feasible widths are [2,6-sqrt(2)].'
      ],
      rubric: [
        { points: 2, text: 'Correct composition 1; correct unit/order explanation 1.' },
        { points: 3, text: 'Width breakpoint 1; two cost expressions 0.5 each; branch intervals and model domain 1.' },
        { points: 2, text: 'Area 32 and correct price branch 1; cost $250 1.' },
        { points: 3, text: 'Budget equation/area 0.5; exact width 1; rounded width 0.5; branch/domain check 0.5; explains why it is the greatest width 0.5. Preserve follow-through from one earlier model error.' }
      ]
    },
    {
      id: 10, title: 'Construct and graph a square-root function', difficulty: 2, points: 8, minutes: 6,
      target: 'Study Guide Q2/Q6 and Prep Test 1 Q6. Restores construction from characteristics and the square-root graph, rather than replacing course material with an absolute-value equation.',
      extension: 'Determine a reflected, scaled square-root rule from its domain, range, and a point; then complete the graph. This combines the guide’s function construction with the unfinished graph work.',
      stem: [
        'A square-root function has the form r(x)=a sqrt(x-h)+k, domain [1,infinity), range (-infinity,3], and passes through (5,-1).',
        '(a) Find its equation. Show your work.',
        '(b) Graph r on the provided coordinate plane. Label its starting point and three other points.',
        '(c) State its x-intercept exactly and its interval of decrease.'
      ],
      steps: [
        'The domain gives h=1. The upper range boundary gives k=3, and the function is reflected downward. Substitute (5,-1): -1=2a+3, so a=-2. Rule r(x)=-2sqrt(x-1)+3.',
        'Starting point (1,3). Three useful additional points are (2,1), (5,-1), (10,-3). Draw a decreasing square-root curve, with included start and a rightward continuation.',
        'Solve -2sqrt(x-1)+3=0: sqrt(x-1)=3/2, x-1=9/4, x=13/4. The x-intercept is (13/4,0). The function decreases on (1,infinity); domain-based endpoint-inclusive wording is also acceptable.'
      ],
      rubric: [
        { points: 3, text: 'Correct h and k 1; solves for a 1; final rule 1.' },
        { points: 3, text: 'Included labeled starting point 1; three additional labeled points 1; correct connected curve and continuation 1.' },
        { points: 2, text: 'Exact x-intercept 1; decreasing interval 1. Accept (1,infinity) or an explicitly stated decrease over its full domain [1,infinity).' }
      ]
    }
  ]
};
