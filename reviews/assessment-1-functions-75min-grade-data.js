window.assessment1PracticeGrade = {
  title: 'Prep Test 1: Functions and Polynomial Review',
  student: 'Kai',
  course: 'Pre-Calculus',
  reviewed: 'October 4, 2026',
  provisional: true,
  sections: [
    { title: 'Function Basics', evidence: [
      { page: 1, questions: ['1', '2'] },
      { page: 2, questions: ['3'] }
    ], questions: [
      {
        id: '1', points: 5, earned: 5,
        problem: 'Decide whether the ordered-pair table defines a function, explain using the repeated input, and give the range.',
        answer: 'Kai said the repeated x-value 0 is paired with -1 both times, so the relation is still a function. He gave the range {-1, 4, 5}.',
        solution: 'Correct. The repeated input has the same output both times. The range is {-1, 4, 5}.',
        rubric: '5/5. Correct conclusion, explanation, and range. The identical repeated pair makes this a very easy item; do not treat it as evidence of advanced mastery.'
      },
      {
        id: '2', points: 8, earned: 8,
        problem: 'For f(x)=sqrt(5-x) and g(x)=x^2-1, write f(x)/g(x), identify all restrictions, and give the interval domain.',
        answer: 'Kai wrote sqrt(5-x)/(x^2-1), x<=5, x not equal to 1 or -1, and (-infinity,-1) union (-1,1) union (1,5].',
        solution: 'Correct. The square root requires x<=5. The denominator is zero at x=-1 and x=1, and both must be excluded.',
        rubric: '8/8. Quotient 2; radical restriction 2; denominator zeros 2; final domain 2.'
      },
      {
        id: '3', points: 10, earned: 10,
        problem: 'For A(x)=2x-1 and B(x)=x^2+3, find B(A(x)), B(A(4)), and A(B(4)); compare the evaluated compositions.',
        answer: 'Kai found B(A(x))=4x^2-4x+4, B(A(4))=52, and A(B(4))=37, and stated they are not equal.',
        solution: 'Correct. B(A(x))=(2x-1)^2+3=4x^2-4x+4. B(A(4))=B(7)=52. A(B(4))=A(19)=37.',
        rubric: '10/10. Correct symbolic composition and both evaluated orders.'
      }
    ] },
    { title: 'Transformations and Piecewise Functions', evidence: [
      { page: 6, questions: ['4'] },
      { page: 8, questions: ['5'] },
      { page: 3, questions: ['6'] }
    ], questions: [
      {
        id: '4', points: 10, earned: 9,
        problem: 'From the graph with vertices (-4,-2), (-2,2), (1,0), and (4,3), graph f(g(x)) and g(f(x)) for g(x)=2x-2. Label transformed vertices and distinguish the two graphs.',
        answer: 'Kai used x_new=(x_old+2)/2 for f(g(x)) and listed x-values -1, 0, 3/2, and 3. For g(f(x)) he used y_new=2y-2 and listed (-4,-6), (-2,2), (1,-2), and (4,4). Both graphs are drawn, but he did not use the required solid line for f(g(x)) and dashed line for g(f(x)), and he did not label every transformed vertex.',
        solution: 'Correct f(g(x)) vertices are (-1,-2), (0,2), (3/2,0), and (3,3). Correct g(f(x)) vertices are (-4,-6), (-2,2), (1,-2), and (4,4). The mapping formulas and drawn graphs agree with these points.',
        rubric: '9/10. The transformed coordinate sets are correct. Deduct 1 point total because the required solid/dashed line styles were not followed and not every transformed vertex was labeled. These are both graph-presentation requirements within the same 2-point graphing category, not separate full deductions.'
      },
      {
        id: '5', points: 8, earned: 3,
        problem: 'For p(x)=2-x when x<1 and p(x)=x+2 when x>=1, find p(0), p(1), p(3), and graph both branches with open/closed boundary points at x=1.',
        answer: 'No written values for p(0), p(1), or p(3) are visible. Kai drew the decreasing line on the left and the increasing line on the right. The left line stops at x=0 rather than reaching its open endpoint at (1,1). The right branch begins at (1,3), which appears closed.',
        solution: 'The values are p(0)=2, p(1)=3, and p(3)=5. The left branch is y=2-x for x<1, with an open circle at (1,1). The right branch is y=x+2 for x>=1, with a closed circle at (1,3).',
        rubric: '3/8. Graph shape and branch selection 2/3; endpoint marks 1/2 for the visible closed point at (1,3), with the left endpoint missing; evaluations 0/3 because no answers are shown. Blank values are not evidence that Kai cannot evaluate the rule.'
      },
      {
        id: '6', points: 10, earned: 7,
        problem: 'Translate y=sqrt(x) left 4 and down 3. Write the rule, graph the start and three more points, state domain and range, and check (-3,-2).',
        answer: 'No equation is visible. Kai drew the translated square-root curve and labeled (-3,-2), (0,-1), and (5,0); the curve appears to start at (-4,-3), but that start is not separately labeled. He gave domain [-4,infinity), range [-3,infinity), and said (-3,-2) is on the graph.',
        solution: 'The rule is y=sqrt(x+4)-3. Its starting point is (-4,-3), and the listed points are on the graph. Domain [-4,infinity); range [-3,infinity). Substitution gives sqrt(-3+4)-3=-2.',
        rubric: '7/10. Rule 0/2 because it is not written; graph 3/4 because the curve and three additional points are correct but the starting point is not clearly marked; domain/range 2/2; point check 2/2 because the correct point is labeled on the graph and identified as belonging.'
      }
    ] },
    { title: 'Polynomial Structure and Graphs', evidence: [
      { page: 4, questions: ['7'] },
      { page: 7, questions: ['8'] },
      { page: 5, questions: ['9'] }
    ], questions: [
      {
        id: '7', points: 7, earned: 7,
        problem: 'Recover a cubic equation from its graph, then give increasing/decreasing intervals and relative extrema.',
        answer: 'Kai found y=1/2(x+1)^2(x-2), relative maximum (-1,0), relative minimum (1,-2), increasing for x<-1 and x>1, and decreasing between -1 and 1.',
        solution: 'Correct. The double zero is -1, the crossing zero is 2, and the y-intercept gives leading factor 1/2. The graph increases on (-infinity,-1) and (1,infinity), decreases on (-1,1), with extrema (-1,0) and (1,-2).',
        rubric: '7/7. Intercepts/multiplicity 2; scale 2; equation 1; intervals 1; both extrema 1.'
      },
      {
        id: '8', points: 10, earned: 10,
        problem: 'Select the polynomial whose graph crosses at -2, touches and turns at 1, falls left, and rises right. Explain how its zeros, multiplicities, and leading term match.',
        answer: 'Kai selected A, (x+2)(x-1)^2. He explained the simple zero at -2, double zero at 1, and positive leading coefficient with odd-degree end behavior.',
        solution: 'Correct. The simple root crosses at -2; the double root touches and turns at 1; the positive cubic falls left and rises right.',
        rubric: '10/10. Kai answered the explanation requested in the student prompt. The answer key additionally asks why the other choices fail, but the student prompt does not; no points are deducted for omitting that unrequested explanation.'
      },
      {
        id: '9', points: 10, earned: 8.5,
        problem: 'Check a classmate’s domain, range, zeros, increasing/decreasing intervals, and extrema against the plotted polyline.',
        answer: 'Kai gave domain [-5,5], range [-3,4], zeros -4.75, 0, 4, increasing (-4,2), decreasing (-5,-4) union (2,5), minimum (-3,-3), and maximum (2,4).',
        solution: 'From the plotted vertices (-5,1), (-3,-3), (0,0), (2,4), (5,-2), the domain is [-5,5], range [-3,4], zeros are -4.5, 0, 4, increasing interval is (-3,2), decreasing intervals are (-5,-3) and (2,5), minimum is (-3,-3), and maximum is (2,4). The first line crosses halfway between x=-5 and x=-4, at x=-4.5.',
        rubric: '8.5/10, graded against the graph rather than the key’s incorrect -4 zero. Domain/range 2/2; zeros 1.5/2 because 0 and 4 are correct and -4.75 is a close but incorrect estimate of -4.5; intervals 2/3: 0.5 for the increasing interval with one endpoint wrong, 0.5 for the first decreasing interval with one endpoint wrong, and 1 for the correct (2,5) interval; extrema 3/3. The interval deductions reflect the wrong boundaries without taking away credit for correct direction, the other correct boundary, or the fully correct decreasing interval.'
      }
    ] },
    { title: 'Function Models and Transformations', evidence: [
      { page: 9, questions: ['10', '11'] }
    ], questions: [
      {
        id: '10', points: 12, earned: 12,
        problem: 'Compose the rental charge D(d)=9d+12 dollars with the 8% tax function T(c)=1.08c. Explain the order, simplify, find the four-day price, and explain why reversal does not model the situation.',
        answer: 'Kai wrote T(D(d))=1.08(9d+12), explained that D maps days to dollars and T taxes dollars, simplified to 9.72d+12.96, and found $51.84 for four days. He explained that T needs dollars while D takes days.',
        solution: 'Correct. T(D(d))=1.08(9d+12)=9.72d+12.96. At d=4, the cost is $51.84. Reversing feeds a dollar amount into a function whose input is days.',
        rubric: '12/12. Order and units 4; simplified rule 3; four-day total 3; reversal explanation 2.'
      },
      {
        id: '11', points: 10, earned: 10,
        problem: 'For f(x)=sqrt(x+1) and g(x)=x^2-1, simplify both g(f(x)) and f(g(x)), state their domains, and explain the difference.',
        answer: 'Kai found g(f(x))=x with x>=-1 and explained the original square-root restriction remains. He found f(g(x))=sqrt(x^2)=|x| with all real numbers allowed because x^2>=0.',
        solution: 'Correct. g(f(x))=x on [-1,infinity), since f requires x+1>=0. f(g(x))=sqrt(x^2)=|x| on all real numbers.',
        rubric: '10/10. Both composites and domains are correct, with the inherited restriction explained.'
      }
    ] }
  ],
  notes: [
    'The scan does not show elapsed time. The 75-minute limit is the exam design, not a verified time taken.',
    'Question 9 in the checked-in key says the first zero is -4; the actual graph crosses at -4.5. This score uses the plotted graph, not that key value.',
    'Marcus confirmed the written intervals in Question 9: increasing (-4,2) and decreasing (-5,-4) union (2,5). The correct intervals from the graph are increasing (-3,2) and decreasing (-5,-3) union (2,5).',
    'Question 8 asks for a match explanation, not a rejection of every distractor. Full credit is awarded for answering the prompt.',
    'Question 1 repeats an identical ordered pair, making it a trivial item. Correct work earns its points, but it is weak evidence of mastery.'
  ]
};
