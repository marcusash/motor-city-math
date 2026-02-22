// Generator for RP8 and RP9 — run with: node scripts/gen-rp8-rp9.cjs
'use strict';
const fs = require('fs');
const path = require('path');
const DATA = path.join(__dirname, '..', 'data');

// ─── RP8 ─────────────────────────────────────────────────────────────────────
// Generated from mock RP7 score: 6/15 (40%)
// RIGHT: Q1, Q4, Q7, Q8, Q9, Q11
// WRONG: Q2, Q3, Q5, Q6, Q10, Q12, Q13, Q14, Q15
// Strategy: maintain pressure on all 9 missed types; vary surface structure.
// Key upgrade: Q12 now uses DOWNWARD opening parabola (exact type from real exam).

const rp8 = {
  exam_id: 'retake-practice-8',
  title: 'Unit 2 Retake Practice 8',
  subtitle: 'Varied structure — continued pressure on RP7 weaknesses',
  time_minutes: 50,
  created: '2026-02-22',
  created_by: 'FR',
  purpose: 'Mock RP7 score 6/15. Maintains pressure on 9 missed types: AV reading, AV two-case solve, AC method, x^2-inside radical, exponential x^2-exponent, downward parabola graph, rational graph, write-equation from vertex+point, word-problem find-r-first.',
  questions: [
    {
      id: 'rp8-q1', number: 1, section: 'A', standard: 'W2.a', type: 'quadratic',
      question_html: 'Solve by factoring: \\( x^2 - 5x - 6 = 0 \\)',
      inputs: [
        { id: 'q1_x1', type: 'number', label: 'Smaller x =', answer: -1, tolerance: 0.05 },
        { id: 'q1_x2', type: 'number', label: 'Larger x =', answer: 6, tolerance: 0.05 }
      ],
      hint: 'Find two numbers that multiply to -6 and add to -5.',
      solution_steps: [
        'Factors of -6 adding to -5: -6 and +1.',
        '(x - 6)(x + 1) = 0.',
        'x = 6 or x = -1. Check: 36-30-6=0 \u2713, 1+5-6=0 \u2713'
      ],
      feedback_wrong: 'Factors of -6 adding to -5 are -6 and +1: (x-6)(x+1)=0.'
    },
    {
      id: 'rp8-q2', number: 2, section: 'A', standard: 'W2.b', type: 'absolute-value',
      question_html: 'For \\( f(x) = 2|x - 3| - 4 \\): state the vertex, x-intercepts, and range.',
      inputs: [
        { id: 'q2_vx', type: 'number', label: 'Vertex x =', answer: 3, tolerance: 0.05 },
        { id: 'q2_vy', type: 'number', label: 'Vertex y =', answer: -4, tolerance: 0.05 },
        { id: 'q2_x1', type: 'number', label: 'Smaller x-intercept =', answer: 1, tolerance: 0.05 },
        { id: 'q2_x2', type: 'number', label: 'Larger x-intercept =', answer: 5, tolerance: 0.05 },
        { id: 'q2_range', type: 'text', label: 'Range (interval notation):' }
      ],
      hint: 'Vertex is at (h,k) from a|x-h|+k. Set f(x)=0 to find x-intercepts.',
      solution_steps: [
        'Vertex: h=3, k=-4 \u2192 (3,-4).',
        'x-intercepts: 2|x-3|=4 \u2192 |x-3|=2 \u2192 x=5 or x=1.',
        'a=2>0 opens upward. Range: [-4, +\u221e).'
      ],
      feedback_wrong: 'Vertex is (3,-4). Set f=0: |x-3|=2 gives x=1 and x=5. a>0 so range is [-4,+inf).'
    },
    {
      id: 'rp8-q3', number: 3, section: 'A', standard: 'W3.a', type: 'absolute-value',
      question_html: 'Solve: \\( |2x + 4| - 3 = 5 \\). Write BOTH equations before entering answers.',
      inputs: [
        { id: 'q3_cases', type: 'text', label: 'Both cases (write them out):' },
        { id: 'q3_x1', type: 'number', label: 'Smaller x =', answer: -6, tolerance: 0.05 },
        { id: 'q3_x2', type: 'number', label: 'Larger x =', answer: 2, tolerance: 0.05 }
      ],
      hint: 'Isolate the absolute value first. Then write the positive AND negative case.',
      solution_steps: [
        'Isolate: |2x+4| = 8.',
        'Case 1 (positive): 2x+4=8 \u2192 x=2.',
        'Case 2 (negative): -(2x+4)=8 \u2192 2x+4=-8 \u2192 x=-6.',
        'Check: |4+4|-3=5 \u2713 and |-12+4|-3=8-3=5 \u2713'
      ],
      feedback_wrong: 'Isolate first: |2x+4|=8. Case 1: 2x+4=8. Case 2: -(2x+4)=8.'
    },
    {
      id: 'rp8-q4', number: 4, section: 'B', standard: 'W3.d', type: 'exponential',
      question_html: 'Solve: \\( 4^{2x-1} = 64 \\)',
      inputs: [{ id: 'q4_x', type: 'number', label: 'x =', answer: 2, tolerance: 0.05 }],
      hint: 'Rewrite both sides as powers of 2.',
      solution_steps: [
        '4^(2x-1) = (2\u00b2)^(2x-1) = 2^(4x-2).',
        '64 = 2\u2076.',
        '4x-2=6 \u2192 x=2.',
        'Check: 4^(4-1)=4\u00b3=64 \u2713'
      ],
      feedback_wrong: '4=2\u00b2 so 4^(2x-1)=2^(4x-2). 64=2\u2076. Set 4x-2=6 \u2192 x=2.'
    },
    {
      id: 'rp8-q5', number: 5, section: 'B', standard: 'W2.a', type: 'quadratic',
      question_html: 'Solve by factoring: \\( 3x^2 - 5x - 2 = 0 \\)',
      inputs: [
        { id: 'q5_factored', type: 'text', label: 'Factored form:' },
        { id: 'q5_x1', type: 'number', label: 'Smaller x =', answer: -0.333, tolerance: 0.02 },
        { id: 'q5_x2', type: 'number', label: 'Larger x =', answer: 2, tolerance: 0.05 }
      ],
      hint: 'AC method: a\u00d7c = 3\u00d7(-2) = -6. Find factors of -6 that add to -5. Split middle term, factor by grouping.',
      solution_steps: [
        'a\u00d7c = -6. Factors adding to -5: -6 and +1.',
        'Split: 3x\u00b2 - 6x + x - 2.',
        'Group: 3x(x-2) + 1(x-2) = (3x+1)(x-2) = 0.',
        'x = -1/3 or x = 2.'
      ],
      feedback_wrong: 'AC: a\u00d7c=-6. Factors adding to -5: -6 and +1. Split and group: (3x+1)(x-2)=0.'
    },
    {
      id: 'rp8-q6', number: 6, section: 'B', standard: 'W3.c', type: 'radical',
      question_html: 'Solve: \\( \\sqrt{x^2 - 3} - 1 = 0 \\)',
      inputs: [
        { id: 'q6_x1', type: 'number', label: 'Smaller x =', answer: -2, tolerance: 0.05 },
        { id: 'q6_x2', type: 'number', label: 'Larger x =', answer: 2, tolerance: 0.05 }
      ],
      hint: 'Isolate the radical, then square. You will get x\u00b2 = a number. What does that give you?',
      solution_steps: [
        'Isolate: \u221a(x\u00b2-3) = 1.',
        'Square: x\u00b2-3=1 \u2192 x\u00b2=4.',
        'x=\u00b12. Two solutions because x\u00b2=positive always gives \u00b1.',
        'Check: \u221a(4-3)-1=0 \u2713'
      ],
      feedback_wrong: 'After squaring: x\u00b2=4 \u2192 x=\u00b12. Don\u2019t forget the negative solution.'
    },
    {
      id: 'rp8-q7', number: 7, section: 'B', standard: 'W3.d', type: 'exponential',
      question_html: 'Solve: \\( 27^x = 9^{2x-1} \\)',
      inputs: [{ id: 'q7_x', type: 'number', label: 'x =', answer: 2, tolerance: 0.05 }],
      hint: 'Rewrite both sides as powers of 3.',
      solution_steps: [
        '27^x = (3\u00b3)^x = 3^(3x).',
        '9^(2x-1) = (3\u00b2)^(2x-1) = 3^(4x-2).',
        '3x = 4x-2 \u2192 x=2.',
        'Check: 27\u00b2=729, 9\u00b3=729 \u2713'
      ],
      feedback_wrong: '27=3\u00b3, 9=3\u00b2. Convert and set exponents equal: 3x=4x-2.'
    },
    {
      id: 'rp8-q8', number: 8, section: 'B', standard: 'W3.c', type: 'rational',
      question_html: 'Solve: \\( \\dfrac{3x + 2}{x - 4} = 5 \\)',
      inputs: [{ id: 'q8_x', type: 'number', label: 'x =', answer: 11, tolerance: 0.05 }],
      hint: 'Multiply both sides by (x-4).',
      solution_steps: [
        '3x+2 = 5(x-4) = 5x-20.',
        '22=2x \u2192 x=11.',
        'Check: (33+2)/(11-4)=35/7=5 \u2713'
      ],
      feedback_wrong: 'Multiply by (x-4): 3x+2=5x-20 \u2192 x=11.'
    },
    {
      id: 'rp8-q9', number: 9, section: 'B', standard: 'W3.b', type: 'radical',
      question_html: 'Solve: \\( \\sqrt{5x - 4} = \\sqrt{2x + 8} \\)',
      inputs: [{ id: 'q9_x', type: 'number', label: 'x =', answer: 4, tolerance: 0.05 }],
      hint: 'If \u221aA = \u221aB then A = B. Set radicands equal.',
      solution_steps: [
        '5x-4 = 2x+8.',
        '3x=12 \u2192 x=4.',
        'Check: \u221a16=\u221a16 \u2713'
      ],
      feedback_wrong: 'Set radicands equal: 5x-4=2x+8 \u2192 x=4.'
    },
    {
      id: 'rp8-q10', number: 10, section: 'B', standard: 'W3.d', type: 'exponential',
      question_html: 'Solve: \\( 3^{x^2 + 1} = 243 \\)',
      inputs: [
        { id: 'q10_x1', type: 'number', label: 'Smaller x =', answer: -2, tolerance: 0.05 },
        { id: 'q10_x2', type: 'number', label: 'Larger x =', answer: 2, tolerance: 0.05 }
      ],
      hint: 'Rewrite 243 as a power of 3. Set exponents equal. You will get x\u00b2 = a number.',
      solution_steps: [
        '243 = 3\u2075.',
        'x\u00b2+1=5 \u2192 x\u00b2=4.',
        'x=\u00b12. Two solutions.',
        'Check: 3^(4+1)=3\u2075=243 \u2713'
      ],
      feedback_wrong: '243=3\u2075. So x\u00b2+1=5 \u2192 x\u00b2=4 \u2192 x=\u00b12.'
    },
    {
      id: 'rp8-q11', number: 11, section: 'B', standard: 'W3.b', type: 'fractional-exp',
      question_html: 'Solve: \\( 3x^{2/3} = 48 \\)',
      inputs: [{ id: 'q11_x', type: 'number', label: 'x =', answer: 64, tolerance: 0.05 }],
      hint: 'Divide by 3 first. Then raise both sides to the 3/2 power to undo the 2/3.',
      solution_steps: [
        'x^(2/3)=16.',
        'x = 16^(3/2) = (\u221a16)\u00b3 = 4\u00b3 = 64.',
        'Check: 3\u00d764^(2/3) = 3\u00d7(4\u00b3)^(2/3) = 3\u00d74\u00b2 = 48 \u2713'
      ],
      feedback_wrong: 'Divide by 3: x^(2/3)=16. Raise to 3/2: x=16^(3/2)=(\u221a16)\u00b3=64.'
    },
    {
      id: 'rp8-q12', number: 12, section: 'C', standard: 'W2.c', type: 'graph',
      question_html: 'Graph \\( f(x) = -(x-3)^2 + 4 \\) and answer all of the following:',
      inputs: [
        { id: 'q12_vx', type: 'number', label: 'Vertex x =', answer: 3, tolerance: 0.1 },
        { id: 'q12_vy', type: 'number', label: 'Vertex y =', answer: 4, tolerance: 0.1 },
        { id: 'q12_domain', type: 'text', label: 'Domain (interval notation):' },
        { id: 'q12_range', type: 'text', label: 'Range (interval notation):' },
        { id: 'q12_increase', type: 'text', label: 'f is increasing on:' },
        { id: 'q12_decrease', type: 'text', label: 'f is decreasing on:' }
      ],
      graph: {
        canvas_id: 'graphQ12',
        function: '-(Math.pow(x-3,2))+4',
        function_display: 'f(x) = -(x-3)\u00b2 + 4',
        key_points: [[1,0],[2,3],[3,4],[4,3],[5,0]],
        x_range: [-1,7], y_range: [-2,6], min_points: 5, tolerance: 0.25
      },
      hint: 'a=-1 means the parabola opens DOWNWARD. The vertex is a MAXIMUM. Range stops at the vertex y-value.',
      solution_steps: [
        'Vertex: h=3, k=4 \u2192 (3,4). a=-1<0 so opens DOWNWARD.',
        'Domain: all real numbers, (-\u221e,+\u221e).',
        'Range: parabola goes DOWN from vertex. Maximum y=4. Range = (-\u221e, 4].',
        'Increasing on (-\u221e,3): left of vertex.',
        'Decreasing on (3,+\u221e): right of vertex.',
        'Key: downward parabola \u2192 range is y \u2264 k, NOT y \u2265 k.'
      ],
      feedback_wrong: 'a=-1 means DOWNWARD. Range is (-inf,4], not [4,+inf). Increasing is LEFT of vertex.'
    },
    {
      id: 'rp8-q13', number: 13, section: 'C', standard: 'W2.e', type: 'graph',
      question_html: 'Graph \\( f(x) = \\dfrac{4}{x + 3} - 1 \\) and state asymptotes, domain, range, and end behavior.',
      inputs: [
        { id: 'q13_va', type: 'number', label: 'Vertical asymptote x =', answer: -3, tolerance: 0.1 },
        { id: 'q13_ha', type: 'number', label: 'Horizontal asymptote y =', answer: -1, tolerance: 0.1 },
        { id: 'q13_domain', type: 'text', label: 'Domain:' },
        { id: 'q13_range', type: 'text', label: 'Range:' },
        { id: 'q13_endbeh', type: 'text', label: 'As x \u2192 +\u221e, f(x) \u2192' }
      ],
      graph: {
        canvas_id: 'graphQ13',
        function: '4/(x+3)-1',
        function_display: 'f(x) = 4/(x+3) - 1',
        key_points: [[-5,1],[-4,3],[-2,-5],[0,1/3],[3,0]],
        x_range: [-9,5], y_range: [-7,5], min_points: 5, tolerance: 0.25
      },
      hint: 'VA: where denominator=0. HA: y-value the function approaches as x\u2192\u221e.',
      solution_steps: [
        'VA: x+3=0 \u2192 x=-3. HA: as x\u2192\u221e, 4/(x+3)\u21920 \u2192 y\u2192-1.',
        'Domain: x\u2260-3. Write: (-\u221e,-3)\u222a(-3,+\u221e).',
        'Range: y\u2260-1. Write: (-\u221e,-1)\u222a(-1,+\u221e).',
        'As x\u2192+\u221e: f(x)\u2192-1 from above (4/(x+3) is positive).',
        'W2.e: asymptotes determine the excluded values in both domain and range.'
      ],
      feedback_wrong: 'VA: x=-3. HA: y=-1. Domain excludes x=-3. Range excludes y=-1.'
    },
    {
      id: 'rp8-q14', number: 14, section: 'D', standard: 'W2.d', type: 'write-equation',
      question_html: 'A quadratic opens UPWARD, has vertex at (-2, 1), and passes through (0, 5). Find a, h, k so that f(x) = a(x - h)\u00b2 + k.',
      inputs: [
        { id: 'q14_a', type: 'number', label: 'a =', answer: 1, tolerance: 0.05 },
        { id: 'q14_h', type: 'number', label: 'h =', answer: -2, tolerance: 0.05 },
        { id: 'q14_k', type: 'number', label: 'k =', answer: 1, tolerance: 0.05 }
      ],
      hint: 'Vertex (-2,1) gives h=-2, k=1 directly. Substitute (0,5) into f(x)=a(x+2)\u00b2+1 to find a.',
      solution_steps: [
        'Vertex (-2,1) \u2192 h=-2, k=1. So f(x) = a(x+2)\u00b2+1.',
        'Substitute (0,5): 5 = a(0+2)\u00b2+1 = 4a+1.',
        '4a=4 \u2192 a=1.',
        'f(x) = (x+2)\u00b2+1. Verify: f(-2)=0+1=1 \u2713, f(0)=4+1=5 \u2713, opens up (a>0) \u2713'
      ],
      feedback_wrong: 'h=-2 and k=1 come from the vertex. Plug (0,5) into a(x+2)\u00b2+1=5 to solve for a.'
    },
    {
      id: 'rp8-q15', number: 15, section: 'D', standard: 'W3.a', type: 'word-problem',
      question_html: 'A bacteria colony starts with 50 bacteria at t=0. At t=4 hours there are 800 bacteria.<br><br>(a) Write the model P(t) = P\u2080 \u00b7 r^t.<br>(b) At what time t will the population reach 25,600?',
      inputs: [
        { id: 'q15_model', type: 'text', label: '(a) P(t) =' },
        { id: 'q15_t', type: 'number', label: '(b) t =', answer: 9, tolerance: 0.1 }
      ],
      hint: 'Solve for r FIRST. P(4)=800: 50\u00b7r\u2074=800 \u2192 r\u2074=16. What number raised to the 4th power equals 16?',
      solution_steps: [
        'P\u2080=50. Model: P(t)=50\u00b7r^t.',
        'P(4)=800: 50\u00b7r\u2074=800 \u2192 r\u2074=16=2\u2074 \u2192 r=2.',
        'Model: P(t) = 50\u00b72^t.',
        'When P=25600? 50\u00b72^t=25600 \u2192 2^t=512=2\u2079 \u2192 t=9 hours.',
        'Check: 50\u00d7512=25600 \u2713'
      ],
      feedback_wrong: 'Find r first: 50\u00b7r\u2074=800 \u2192 r\u2074=16 \u2192 r=2. Then P(t)=50\u00b72^t. Then t=9.'
    }
  ]
};

// ─── RP9 ─────────────────────────────────────────────────────────────────────
// Generated from mock RP8 score: 9/15 (60%)
// RIGHT: Q1, Q3, Q4, Q5, Q7, Q8, Q9, Q11, Q13 (showed progress on AC method, AV two-case, rational graph)
// WRONG: Q2, Q6, Q10, Q12, Q15 (AV reading, x^2-inside radical, exponential x^2, downward graph, word problem)
// Strategy: maintain strength maintenance on rights; escalate difficulty on persistent wrongs.

const rp9 = {
  exam_id: 'retake-practice-9',
  title: 'Unit 2 Retake Practice 9',
  subtitle: 'Escalated difficulty on persistent weaknesses',
  time_minutes: 50,
  created: '2026-02-22',
  created_by: 'FR',
  purpose: 'Mock RP8 score 9/15 (60%). Shows progress. Still wrong: AV reading (Q2), x^2-inside radical (Q6), exponential x^2-exponent (Q10), downward parabola (Q12), word problem (Q15). Escalation: Q1 now uses full AC method. Q5 harder AC. Q14 switches from quadratic-vertex to exponential equation-building. Q12 adds x-intercepts to downward parabola.',
  questions: [
    {
      id: 'rp9-q1', number: 1, section: 'A', standard: 'W2.a', type: 'quadratic',
      question_html: 'Solve by factoring: \\( 2x^2 - 9x + 4 = 0 \\)',
      inputs: [
        { id: 'q1_factored', type: 'text', label: 'Factored form:' },
        { id: 'q1_x1', type: 'number', label: 'Smaller x =', answer: 0.5, tolerance: 0.05 },
        { id: 'q1_x2', type: 'number', label: 'Larger x =', answer: 4, tolerance: 0.05 }
      ],
      hint: 'a\u22601 — use the AC method. a\u00d7c = 2\u00d74 = 8. Find factors of 8 that add to -9.',
      solution_steps: [
        'a\u00d7c = 2\u00d74 = 8. Factors of 8 adding to -9: -8 and -1.',
        'Split: 2x\u00b2 - 8x - x + 4.',
        'Group: 2x(x-4) - 1(x-4) = (2x-1)(x-4) = 0.',
        'x = 1/2 or x = 4.',
        'Check: 2(1/4)-9(1/2)+4=1/2-9/2+8/2=0 \u2713, 2(16)-36+4=0 \u2713'
      ],
      feedback_wrong: 'AC: a\u00d7c=8. Factors of 8 adding to -9: -8 and -1. Split and group: (2x-1)(x-4)=0.'
    },
    {
      id: 'rp9-q2', number: 2, section: 'A', standard: 'W2.b', type: 'absolute-value',
      question_html: 'For \\( f(x) = 3|x + 2| - 6 \\): state the vertex, x-intercepts, and range.',
      inputs: [
        { id: 'q2_vx', type: 'number', label: 'Vertex x =', answer: -2, tolerance: 0.05 },
        { id: 'q2_vy', type: 'number', label: 'Vertex y =', answer: -6, tolerance: 0.05 },
        { id: 'q2_x1', type: 'number', label: 'Smaller x-intercept =', answer: -4, tolerance: 0.05 },
        { id: 'q2_x2', type: 'number', label: 'Larger x-intercept =', answer: 0, tolerance: 0.05 },
        { id: 'q2_range', type: 'text', label: 'Range (interval notation):' }
      ],
      hint: 'This is a|x-h|+k form. h=-2 (sign flips from inside). Set f(x)=0 for x-intercepts.',
      solution_steps: [
        'f(x) = 3|x-(-2)| + (-6). Vertex: h=-2, k=-6 \u2192 (-2,-6).',
        'x-intercepts: 3|x+2|=6 \u2192 |x+2|=2 \u2192 x+2=2 or x+2=-2 \u2192 x=0 or x=-4.',
        'a=3>0 opens upward. Range: [-6, +\u221e).'
      ],
      feedback_wrong: 'Vertex is (-2,-6). Note: h=-2 because |x+2| = |x-(-2)|. Set f=0: |x+2|=2 gives x=0 and x=-4.'
    },
    {
      id: 'rp9-q3', number: 3, section: 'A', standard: 'W3.a', type: 'absolute-value',
      question_html: 'Solve: \\( |3x - 9| - 2 = 7 \\). Write BOTH equations before entering answers.',
      inputs: [
        { id: 'q3_cases', type: 'text', label: 'Both cases (write them out):' },
        { id: 'q3_x1', type: 'number', label: 'Smaller x =', answer: 0, tolerance: 0.05 },
        { id: 'q3_x2', type: 'number', label: 'Larger x =', answer: 6, tolerance: 0.05 }
      ],
      hint: 'Isolate the absolute value. Can you factor inside before writing the two cases?',
      solution_steps: [
        'Isolate: |3x-9| = 9.',
        'Factor: |3(x-3)| = 9 \u2192 3|x-3| = 9 \u2192 |x-3| = 3.',
        'Case 1: x-3=3 \u2192 x=6.',
        'Case 2: -(x-3)=3 \u2192 -x+3=3 \u2192 x=0.',
        'Check: |18-9|-2=9-2=7 \u2713 and |0-9|-2=9-2=7 \u2713'
      ],
      feedback_wrong: 'Isolate: |3x-9|=9. Factor inside: 3|x-3|=9 \u2192 |x-3|=3. Then two cases: x=6 or x=0.'
    },
    {
      id: 'rp9-q4', number: 4, section: 'B', standard: 'W3.d', type: 'exponential',
      question_html: 'Solve: \\( 2 \\cdot 5^{x-1} = 50 \\)',
      inputs: [{ id: 'q4_x', type: 'number', label: 'x =', answer: 3, tolerance: 0.05 }],
      hint: 'Isolate the exponential first by dividing by 2. Then rewrite 25 as a power of 5.',
      solution_steps: [
        'Divide by 2: 5^(x-1) = 25 = 5\u00b2.',
        'x-1=2 \u2192 x=3.',
        'Check: 2\u00d75\u00b2=2\u00d725=50 \u2713'
      ],
      feedback_wrong: 'Divide by 2 first: 5^(x-1)=25=5\u00b2. Then x-1=2 \u2192 x=3.'
    },
    {
      id: 'rp9-q5', number: 5, section: 'B', standard: 'W2.a', type: 'quadratic',
      question_html: 'Solve by factoring: \\( 3x^2 + 10x - 8 = 0 \\)',
      inputs: [
        { id: 'q5_factored', type: 'text', label: 'Factored form:' },
        { id: 'q5_x1', type: 'number', label: 'Smaller x =', answer: -4, tolerance: 0.05 },
        { id: 'q5_x2', type: 'number', label: 'Larger x =', answer: 0.667, tolerance: 0.02 }
      ],
      hint: 'AC method: a\u00d7c = 3\u00d7(-8) = -24. Find factors of -24 that add to +10.',
      solution_steps: [
        'a\u00d7c = -24. Factors adding to +10: +12 and -2.',
        'Split: 3x\u00b2 + 12x - 2x - 8.',
        'Group: 3x(x+4) - 2(x+4) = (3x-2)(x+4) = 0.',
        'x = 2/3 or x = -4.',
        'Check: 3(16)+10(-4)-8=48-40-8=0 \u2713'
      ],
      feedback_wrong: 'AC: a\u00d7c=-24. Factors adding to +10: +12 and -2. Split and group: (3x-2)(x+4)=0.'
    },
    {
      id: 'rp9-q6', number: 6, section: 'B', standard: 'W3.c', type: 'radical',
      question_html: 'Solve: \\( \\sqrt{x^2 - 5} = 2 \\)',
      inputs: [
        { id: 'q6_x1', type: 'number', label: 'Smaller x =', answer: -3, tolerance: 0.05 },
        { id: 'q6_x2', type: 'number', label: 'Larger x =', answer: 3, tolerance: 0.05 }
      ],
      hint: 'Square both sides directly. You get x\u00b2 = a number. That gives two answers.',
      solution_steps: [
        'Square both sides: x\u00b2-5 = 4 \u2192 x\u00b2 = 9.',
        'x = \u00b13. Two solutions.',
        'Check: \u221a(9-5)=\u221a4=2 \u2713'
      ],
      feedback_wrong: 'Square both sides: x\u00b2-5=4 \u2192 x\u00b2=9 \u2192 x=\u00b13.'
    },
    {
      id: 'rp9-q7', number: 7, section: 'B', standard: 'W3.d', type: 'exponential',
      question_html: 'Solve: \\( 4^x \\cdot 2^{x+1} = 128 \\)',
      inputs: [{ id: 'q7_x', type: 'number', label: 'x =', answer: 2, tolerance: 0.05 }],
      hint: 'Rewrite everything as powers of 2. Then add exponents when multiplying same base.',
      solution_steps: [
        '4^x = (2\u00b2)^x = 2^(2x).',
        '2^(2x) \u00b7 2^(x+1) = 2^(3x+1).',
        '128 = 2\u2077.',
        '3x+1=7 \u2192 x=2.',
        'Check: 4\u00b2\u00b72\u00b3=16\u00d78=128 \u2713'
      ],
      feedback_wrong: '4^x = 2^(2x). Then 2^(2x)\u00b72^(x+1) = 2^(3x+1) = 128 = 2\u2077. So 3x+1=7 \u2192 x=2.'
    },
    {
      id: 'rp9-q8', number: 8, section: 'B', standard: 'W3.c', type: 'rational',
      question_html: 'Solve: \\( \\dfrac{2x + 3}{x - 1} = 7 \\)',
      inputs: [{ id: 'q8_x', type: 'number', label: 'x =', answer: 2, tolerance: 0.05 }],
      hint: 'Multiply both sides by (x-1).',
      solution_steps: [
        '2x+3 = 7(x-1) = 7x-7.',
        '10=5x \u2192 x=2.',
        'Check: (4+3)/(2-1)=7 \u2713'
      ],
      feedback_wrong: 'Multiply by (x-1): 2x+3=7x-7 \u2192 10=5x \u2192 x=2.'
    },
    {
      id: 'rp9-q9', number: 9, section: 'B', standard: 'W3.b', type: 'radical',
      question_html: 'Solve: \\( \\sqrt{4x + 1} = \\sqrt{x + 10} \\)',
      inputs: [{ id: 'q9_x', type: 'number', label: 'x =', answer: 3, tolerance: 0.05 }],
      hint: 'If \u221aA = \u221aB then A = B.',
      solution_steps: [
        '4x+1 = x+10.',
        '3x=9 \u2192 x=3.',
        'Check: \u221a13=\u221a13 \u2713'
      ],
      feedback_wrong: 'Set radicands equal: 4x+1=x+10 \u2192 x=3.'
    },
    {
      id: 'rp9-q10', number: 10, section: 'B', standard: 'W3.d', type: 'exponential',
      question_html: 'Solve: \\( 2 \\cdot 5^{x^2 - 2} = 50 \\)',
      inputs: [
        { id: 'q10_x1', type: 'number', label: 'Smaller x =', answer: -2, tolerance: 0.05 },
        { id: 'q10_x2', type: 'number', label: 'Larger x =', answer: 2, tolerance: 0.05 }
      ],
      hint: 'Divide by 2 first. Then rewrite as a power of 5. You will get x\u00b2 = a number.',
      solution_steps: [
        'Divide by 2: 5^(x\u00b2-2) = 25 = 5\u00b2.',
        'x\u00b2-2=2 \u2192 x\u00b2=4.',
        'x=\u00b12. Two solutions.',
        'Check: 2\u00d75^(4-2)=2\u00d725=50 \u2713'
      ],
      feedback_wrong: 'Divide by 2: 5^(x\u00b2-2)=25=5\u00b2. So x\u00b2-2=2 \u2192 x\u00b2=4 \u2192 x=\u00b12.'
    },
    {
      id: 'rp9-q11', number: 11, section: 'B', standard: 'W3.b', type: 'fractional-exp',
      question_html: 'Solve: \\( 2x^{5/3} = 486 \\)',
      inputs: [{ id: 'q11_x', type: 'number', label: 'x =', answer: 27, tolerance: 0.05 }],
      hint: 'Divide by 2 first. Then raise both sides to the 3/5 power.',
      solution_steps: [
        'x^(5/3) = 243.',
        'x = 243^(3/5) = (\u2075\u221a243)\u00b3 = 3\u00b3 = 27. (Because 3\u2075=243.)',
        'Check: 2\u00d727^(5/3) = 2\u00d7(3\u00b3)^(5/3) = 2\u00d73\u2075 = 2\u00d7243 = 486 \u2713'
      ],
      feedback_wrong: 'Divide by 2: x^(5/3)=243. Raise to 3/5: x=243^(3/5)=(\u2075\u221a243)\u00b3=3\u00b3=27.'
    },
    {
      id: 'rp9-q12', number: 12, section: 'C', standard: 'W2.c', type: 'graph',
      question_html: 'Graph \\( f(x) = -2(x+1)^2 + 8 \\) and answer all of the following:',
      inputs: [
        { id: 'q12_vx', type: 'number', label: 'Vertex x =', answer: -1, tolerance: 0.1 },
        { id: 'q12_vy', type: 'number', label: 'Vertex y =', answer: 8, tolerance: 0.1 },
        { id: 'q12_xi1', type: 'number', label: 'Smaller x-intercept =', answer: -3, tolerance: 0.1 },
        { id: 'q12_xi2', type: 'number', label: 'Larger x-intercept =', answer: 1, tolerance: 0.1 },
        { id: 'q12_range', type: 'text', label: 'Range (interval notation):' },
        { id: 'q12_increase', type: 'text', label: 'f is increasing on:' },
        { id: 'q12_decrease', type: 'text', label: 'f is decreasing on:' }
      ],
      graph: {
        canvas_id: 'graphQ12',
        function: '-2*Math.pow(x+1,2)+8',
        function_display: 'f(x) = -2(x+1)\u00b2 + 8',
        key_points: [[-3,0],[-2,6],[-1,8],[0,6],[1,0]],
        x_range: [-5,3], y_range: [-2,10], min_points: 5, tolerance: 0.25
      },
      hint: 'a=-2: downward, maximum at vertex. x-intercepts: set f=0, solve -2(x+1)\u00b2+8=0 \u2192 (x+1)\u00b2=4.',
      solution_steps: [
        'Vertex: h=-1, k=8 \u2192 (-1,8). a=-2<0 opens DOWNWARD.',
        'x-intercepts: -2(x+1)\u00b2+8=0 \u2192 (x+1)\u00b2=4 \u2192 x+1=\u00b12 \u2192 x=1 or x=-3.',
        'Range: maximum at y=8. Range = (-\u221e, 8].',
        'Increasing on (-\u221e,-1). Decreasing on (-1,+\u221e).',
        'Check: f(-3)=-2(4)+8=0 \u2713, f(1)=-2(4)+8=0 \u2713'
      ],
      feedback_wrong: 'Vertex (-1,8), opens down (a=-2<0). x-intercepts: (x+1)\u00b2=4 \u2192 x=1 or x=-3. Range: (-inf,8].'
    },
    {
      id: 'rp9-q13', number: 13, section: 'C', standard: 'W2.e', type: 'graph',
      question_html: 'Graph \\( f(x) = \\dfrac{-3}{x - 2} + 1 \\) and state asymptotes, domain, range, and end behavior.',
      inputs: [
        { id: 'q13_va', type: 'number', label: 'Vertical asymptote x =', answer: 2, tolerance: 0.1 },
        { id: 'q13_ha', type: 'number', label: 'Horizontal asymptote y =', answer: 1, tolerance: 0.1 },
        { id: 'q13_domain', type: 'text', label: 'Domain:' },
        { id: 'q13_range', type: 'text', label: 'Range:' },
        { id: 'q13_endbeh', type: 'text', label: 'As x \u2192 +\u221e, f(x) \u2192' }
      ],
      graph: {
        canvas_id: 'graphQ13',
        function: '-3/(x-2)+1',
        function_display: 'f(x) = -3/(x-2) + 1',
        key_points: [[0,2.5],[1,4],[3,-2],[5,0]],
        x_range: [-2,8], y_range: [-4,6], min_points: 5, tolerance: 0.25
      },
      hint: 'VA: x-2=0. HA: limit as x\u2192\u221e. Note: negative numerator flips which branch is above vs below HA.',
      solution_steps: [
        'VA: x-2=0 \u2192 x=2. HA: y=1.',
        'Domain: x\u22602. Range: y\u22601.',
        'As x\u2192+\u221e: -3/(x-2)\u21920 from below, so f(x)\u21921 from below.',
        'Key: negative numerator (-3) flips branch orientation vs positive numerator.'
      ],
      feedback_wrong: 'VA: x=2. HA: y=1. Domain: x\u22602. Range: y\u22601. As x\u2192+\u221e, f\u21921.'
    },
    {
      id: 'rp9-q14', number: 14, section: 'D', standard: 'W2.d', type: 'write-equation',
      question_html: 'An exponential function passes through (0, 5) and (3, 40). Write f(x) = a \u00b7 b^x. Find a and b.',
      inputs: [
        { id: 'q14_a', type: 'number', label: 'a =', answer: 5, tolerance: 0.05 },
        { id: 'q14_b', type: 'number', label: 'b =', answer: 2, tolerance: 0.05 }
      ],
      hint: 'f(0) = a\u00b7b\u2070 = a. So a is given by the point (0, ?). Then substitute the other point to solve for b.',
      solution_steps: [
        'f(0)=5: a\u00b7b\u2070 = a = 5. So a=5.',
        'f(3)=40: 5\u00b7b\u00b3=40 \u2192 b\u00b3=8 \u2192 b=2.',
        'f(x) = 5\u00b72^x.',
        'Verify: f(0)=5\u00d71=5 \u2713, f(3)=5\u00d78=40 \u2713'
      ],
      feedback_wrong: 'a=5 from the (0,5) point. Then 5\u00b7b\u00b3=40 \u2192 b\u00b3=8 \u2192 b=2.'
    },
    {
      id: 'rp9-q15', number: 15, section: 'D', standard: 'W3.a', type: 'word-problem',
      question_html: 'An investment of $500 doubles every 3 years.<br><br>(a) Write the model P(t) = 500 \u00b7 2^(t/3).<br>(b) Confirm the model, then find when the investment reaches $64,000.',
      inputs: [
        { id: 'q15_confirm', type: 'text', label: '(a) Verify: at t=3, P = ?' },
        { id: 'q15_t', type: 'number', label: '(b) t =', answer: 21, tolerance: 0.1 }
      ],
      hint: 'The model is given: P(t)=500\u00b72^(t/3). Set it equal to 64000. Solve for t/3 first.',
      solution_steps: [
        'Model: P(t)=500\u00b72^(t/3). At t=3: 500\u00b72^(3/3)=500\u00b72=1000. Doubles \u2713',
        'Set P=64000: 500\u00b72^(t/3)=64000 \u2192 2^(t/3)=128=2\u2077.',
        't/3=7 \u2192 t=21 years.',
        'Check: 500\u00d72\u2077=500\u00d7128=64000 \u2713'
      ],
      feedback_wrong: '500\u00b72^(t/3)=64000 \u2192 2^(t/3)=128=2\u2077 \u2192 t/3=7 \u2192 t=21.'
    }
  ]
};

fs.writeFileSync(path.join(DATA, 'retake-practice-8.json'), JSON.stringify(rp8, null, 2));
fs.writeFileSync(path.join(DATA, 'retake-practice-9.json'), JSON.stringify(rp9, null, 2));

// Verify key math
const checks = [
  // RP8
  [(-1)*(-1)-5*(-1)-6, 0, 'RP8 Q1 x=-1'],
  [6*6-5*6-6, 0, 'RP8 Q1 x=6'],
  [Math.pow(4,2*2-1), 64, 'RP8 Q4 x=2'],
  [3*4-5*2-2, 0, 'RP8 Q5 x=2'],
  [Math.sqrt(4-3)-1, 0, 'RP8 Q6 x=2'],
  [Math.pow(27,2)-Math.pow(9,3), 0, 'RP8 Q7 x=2'],
  [(3*11+2)/(11-4)-5, 0, 'RP8 Q8 x=11'],
  [Math.sqrt(5*4-4)-Math.sqrt(2*4+8), 0, 'RP8 Q9 x=4'],
  [Math.pow(3,4+1)-243, 0, 'RP8 Q10 x=2'],
  [3*Math.pow(64,2/3)-48, 0, 'RP8 Q11 x=64'],
  [1*Math.pow(0-(-2),2)+1-5, 0, 'RP8 Q14 f(0)=5'],
  [50*Math.pow(2,9)-25600, 0, 'RP8 Q15 t=9'],
  // RP9
  [2*0.25-9*0.5+4, 0, 'RP9 Q1 x=0.5'],
  [2*16-9*4+4, 0, 'RP9 Q1 x=4'],
  [Math.abs(3*6-9)-2-7, 0, 'RP9 Q3 x=6'],
  [2*Math.pow(5,3-1)-50, 0, 'RP9 Q4 x=3'],
  [3*16+10*(-4)-8, 0, 'RP9 Q5 x=-4'],
  [Math.sqrt(9-5)-2, 0, 'RP9 Q6 x=3'],
  [Math.pow(4,2)*Math.pow(2,3)-128, 0, 'RP9 Q7 x=2'],
  [(2*2+3)/(2-1)-7, 0, 'RP9 Q8 x=2'],
  [Math.sqrt(4*3+1)-Math.sqrt(3+10), 0, 'RP9 Q9 x=3'],
  [2*Math.pow(5,4-2)-50, 0, 'RP9 Q10 x=2'],
  [2*Math.pow(27,5/3)-486, 0, 'RP9 Q11 x=27'],
  [-2*Math.pow(-1+1,2)+8-8, 0, 'RP9 Q12 vertex'],
  [-2*Math.pow(-3+1,2)+8, 0, 'RP9 Q12 x-int x=-3'],
  [5*Math.pow(2,3)-40, 0, 'RP9 Q14 f(3)'],
  [500*Math.pow(2,7)-64000, 0, 'RP9 Q15 t=21']
];
let pass=0, fail=0;
checks.forEach(([val, want, label]) => {
  const ok = Math.abs(val - want) < 0.01;
  if(ok) pass++; else fail++;
  console.log((ok?'\u2713':'\u2717')+' '+label+(ok?'':' got='+val.toFixed(4)));
});
console.log(`\nResults: ${pass} passed, ${fail} failed`);
