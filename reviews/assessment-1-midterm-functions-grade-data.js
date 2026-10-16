/* Teacher-margin scores transcribed from the six-page scan by FR.
 * The scan is intentionally not published. Reference solutions are not a teacher key.
 */
window.assessment1TeacherGrade = {
  status: 'verified-with-one-ambiguous-mark',
  title: 'Assessment 1: Functions (Teacher-Scored)',
  scannedOn: null,
  sections: [
    { title: 'Graphs and polynomials', questions: [
      { id: '1 linear', points: 4, earned: 3.75, problem: 'Graph f(x) = -2x + 3.',
        answer: 'A graph is visible; the teacher awarded 3.75/4.',
        solution: 'The line has slope -2 and y-intercept 3; it passes through (0,3) and (1,1).' },
      { id: '1 radical', points: 4, earned: 3, problem: 'Graph g(x) = 2 sqrt(-x) + 3.',
        answer: 'A graph is visible; the teacher awarded 3/4.',
        solution: 'The graph starts at (0,3) and extends left through (-1,5) and (-4,7). Domain: x <= 0; range: y >= 3.' },
      { id: '2', points: 4, earned: 3, problem: 'Write factored and standard forms for the quadratic shown in the graph.',
        answer: 'Handwriting and graph details are difficult to read. Preserve the teacher award of 3/4.',
        solution: 'The graph appears to support (1/2)(x + 2)(x - 3), or (1/2)x^2 - (1/2)x - 3. This reading is uncertain, not a replacement key; defer to the teacher mark.' },
      { id: '3', points: 10, earned: 9.75, problem: 'Read domain, range, end behavior, monotonic intervals, and relative extrema from the graph.',
        answer: 'Extrema notation appears to reverse the maximum coordinates; the teacher marks identify corrected graph points. Teacher award: 9.75/10.',
        solution: 'Domain and range: all real numbers. Ends: down-left, up-right. Increasing on (-infinity,-2) U (0,infinity); decreasing on (-2,0). Relative maximum (-2,4); relative minimum (0,0).' },
      { id: '4', points: 4, earned: 3.75, problem: 'Graph x^3 + 3x^2 - 10x.',
        answer: 'A polynomial graph is visible; the teacher awarded 3.75/4.',
        solution: 'Factor as x(x + 5)(x - 2). Zeros: -5, 0, 2, each crossing. Positive-leading cubic: down-left and up-right.' },
      { id: '5', points: 4, earned: 3.5, problem: 'Write a polynomial equation from a graph with crossing at -1, a touch at 2, and y-intercept -4.',
        answer: 'An equation response is visible; the teacher awarded 3.5/4.',
        solution: 'One matching rule is -(x + 1)(x - 2)^2. The simple zero crosses, the double zero touches, and f(0) = -4.' },
      { id: '7', points: 4, earned: 3, problem: 'Graph the piecewise function and find h(4).',
        answer: 'Both branch expressions were tried at x = 4. The answer 13 is boxed with the note "both true". Teacher award: 3/4.',
        solution: 'At x = 4, use only the second branch: h(4) = 13. The line has a closed endpoint at (2,0), and the parabola has an open endpoint at (2,1).' },
      { id: '8 graph (page 5)', points: 4, earned: 3.5, problem: 'Sketch a graph with both ends up, decreasing on (-infinity,-2), a relative minimum at (1,5), and y-intercept (0,-3).',
        answer: 'A sketch is visible; the teacher awarded 3.5/4.',
        solution: 'Any graph satisfying all stated conditions is acceptable; a unique formula is not required. A minimum at (1,5) may be local rather than global. Preserve the stated conditions and teacher award without imposing one formula.' }
    ] },
    { title: 'Function operations and modeling', questions: [
      { id: '6(a)', points: 4, earned: 3.5, problem: 'Find f/g and its domain.',
        answer: 'The quotient is correct and domain restrictions were attempted. Teacher award: 3.5/4.',
        solution: 'sqrt(6 + 3x)/(x + 4), with domain [-2,infinity). The denominator zero -4 is outside the radical domain already.' },
      { id: '6(b)', points: 4, earned: 4, problem: 'Find g(f(x)).',
        answer: 'Teacher awarded full credit: 4/4.',
        solution: '4 + sqrt(6 + 3x).' },
      { id: '6(c)', points: 4, earned: 4, problem: 'Find f(a + b).',
        answer: 'Teacher awarded full credit: 4/4.',
        solution: 'sqrt(6 + 3(a + b)).' },
      { id: '8 kayak (page 4)', points: 4, earned: 0, problem: 'Write a piecewise kayak-rental cost model.',
        answer: 'Writing is extremely faint; no legible complete response can be transcribed. Teacher award: 0/4.',
        solution: 'For duration t in (0,4]: cost is $10 when 0 < t <= 1, and $10 + $6(t - 1) when 1 < t <= 4. Inclusion of t = 0 depends on the original rental convention and teacher interpretation.' },
      { id: '9 composition', points: 4, earned: 0, problem: 'Find f and g so that j(x) = f(g(x)) for j(x) = (3x - 4)^4.',
        answer: 'The response is too faint to transcribe reliably. Preserve the teacher award of 0/4.',
        solution: 'One decomposition is g(x) = 3x - 4 and f(u) = u^4. Other equivalent decompositions may work.' },
      { id: '11(a-c)', points: 3, earned: 1, problem: 'Evaluate graph/table function operations and find the quotient domain.',
        answer: 'Part (a): f(g(-3)) = 11 is visibly correct and checked. Parts (b) and (c) have faint attempted work that cannot be transcribed confidently; they are not blank. Teacher award for the group: 1/3.',
        solution: 'For (a), g(-3) = 2 and f(2) = 11. For the remaining evaluations, g(6) = 3, h(6) = 9, and j(6) = -6. The domain of f/h excludes x = 3/2.' }
    ] },
    { title: 'Table reasoning', questions: [
      { id: '10 multiple choice', points: null, earned: null, problem: 'Choose the statement guaranteed by the table.',
        answer: 'D is circled in the student response; a blue arrow points to B. The blue margin fraction is ambiguous on magnification and appears to read 1/2, rather than the preliminary 4/4 transcription. No numeric score is assigned here.',
        solution: 'The intended reference is B, a relative minimum at x = -1, using the decreasing/increasing intervals in the table. The table alone does not establish the global range. The ambiguous teacher mark is excluded from the subtotal pending confirmation.' }
    ] }
  ],
  notes: [
    'Individual teacher-annotated scores are authoritative and have not been regraded.',
    'The verified subtotal is 45.75/61, excluding the ambiguous Question 10 multiple-choice mark entirely. No final assessment total or percentage is claimed.',
    'No matching teacher answer key was provided. Expandable reference answers explain the mathematics but do not establish deductions or replace the teacher rubric.',
    'Question labels follow the actual printed pages: Question 1 has two graph parts; both the kayak model on page 4 and graph-properties item on page 5 are printed Question 8. The composition item on page 5 is printed Question 9.',
    'The scan establishes neither assessment date nor elapsed time. This report is not an official course grade or a timed-practice result.',
    'Faint or blank work is not evidence that Kai cannot perform a skill. No response or deduction rationale has been invented.',
    'The original scan is intentionally not published or linked.'
  ]
};
