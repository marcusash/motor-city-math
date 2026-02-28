'use strict';
const fs = require('fs');
const path = require('path');

// Unique numeric answers within this exam (all confirmed non-colliding):
// Q1: -1.5, 2.5  Q2: 7, -10, 6, 8  Q3: -2, 16  Q4: 15  Q5: -7, 11
// Q6: -12, 12    Q7: 4               Q8: 19      Q9: 14
// Q10: -3.742, 3.742  Q11: 32  Q12: -6, 18, -9, -3  Q13: -4, 13
// Q14: 2, 3, -8, 1, 5 (GI spec)    Q15: 21
const rp11 = {
  exam_id: "retake-practice-11",
  schema_version: "1.0",
  title: "Unit 2 Retake Practice 11",
  subtitle: "Consolidation — 3/5-power fractional exponent, quadratic exponent, rational equations",
  time_minutes: 50,
  created: "2026-02-23",
  created_by: "GR",
  purpose: "RP11 targets W2.d coverage gap (brings W2.d to threshold=5). Introduces x^(3/5) fractional exponent. Builds on extraneous-root detection and opens-down parabola. All answers unique within-exam and across RP1-10.",
  questions: [
    {
      id: "rp11-q1", number: 1, section: "A", standard: "W2.a", type: "quadratic",
      question_html: "Solve by factoring: \\( 4x^2 - 4x - 15 = 0 \\)",
      inputs: [
        { id: "q1_factored", type: "text", label: "Factored form:" },
        { id: "q1_x1", type: "number", label: "Smaller x =", answer: -1.5, tolerance: 0.05 },
        { id: "q1_x2", type: "number", label: "Larger x =", answer: 2.5, tolerance: 0.05 }
      ],
      hint: "AC method: a×c = 4×(-15) = -60. Find factors of -60 that add to -4.",
      solution_steps: [
        "AC: a×c = -60. Factors adding to -4: -10 and +6.",
        "Split: 4x^2 - 10x + 6x - 15.",
        "Group: 2x(2x - 5) + 3(2x - 5) = (2x + 3)(2x - 5) = 0.",
        "x = -3/2 = -1.5 or x = 5/2 = 2.5.",
        "Check: 4(2.25) - 4(-1.5) - 15 = 9 + 6 - 15 = 0 ✓, 4(6.25) - 4(2.5) - 15 = 25 - 10 - 15 = 0 ✓"
      ],
      feedback_correct: "🔥 AC method. Two roots found.",
      feedback_wrong: "AC: a×c=-60. Factors adding to -4: -10,+6. Group: (2x+3)(2x-5)=0."
    },
    {
      id: "rp11-q2", number: 2, section: "A", standard: "W2.b", type: "absolute-value",
      question_html: "For \\( f(x) = 10|x - 7| - 10 \\): state the vertex, x-intercepts, and range.",
      inputs: [
        { id: "q2_vx", type: "number", label: "Vertex x =", answer: 7, tolerance: 0.05 },
        { id: "q2_vy", type: "number", label: "Vertex y =", answer: -10, tolerance: 0.05 },
        { id: "q2_x1", type: "number", label: "Smaller x-intercept =", answer: 6, tolerance: 0.05 },
        { id: "q2_x2", type: "number", label: "Larger x-intercept =", answer: 8, tolerance: 0.05 },
        { id: "q2_range", type: "text", label: "Range (interval notation):" }
      ],
      hint: "Vertex is at (h, k) = (7, -10). Set f(x)=0 and solve |x-7|=1 for intercepts.",
      solution_steps: [
        "Vertex: h=7, k=-10. Vertex is (7, -10).",
        "Set 10|x-7|-10=0 → 10|x-7|=10 → |x-7|=1.",
        "x-7=1 → x=8, or x-7=-1 → x=6.",
        "a=10 > 0: opens upward. Range: y ≥ -10, or [-10, ∞)."
      ],
      feedback_correct: "🔥 Vertex, intercepts, range. Full read.",
      feedback_wrong: "Vertex: (h,k)=(7,-10). Set |x-7|=1 → x=6 or x=8."
    },
    {
      id: "rp11-q3", number: 3, section: "A", standard: "W3.a", type: "absolute-value",
      question_html: "Solve: \\( |2x - 14| - 8 = 10 \\). Write BOTH equations before entering answers.",
      inputs: [
        { id: "q3_eqs", type: "text", label: "Write both equations:" },
        { id: "q3_x1", type: "number", label: "Smaller x =", answer: -2, tolerance: 0.05 },
        { id: "q3_x2", type: "number", label: "Larger x =", answer: 16, tolerance: 0.05 }
      ],
      hint: "Isolate the absolute value first: |2x-14|=18. Then split into two cases.",
      solution_steps: [
        "|2x-14| = 18.",
        "Case 1: 2x-14=18 → 2x=32 → x=16.",
        "Case 2: 2x-14=-18 → 2x=-4 → x=-2.",
        "Check: |2(16)-14|-8=|18|-8=10 ✓, |2(-2)-14|-8=|-18|-8=10 ✓"
      ],
      feedback_correct: "🔥 Both cases. Both roots.",
      feedback_wrong: "Isolate first: |2x-14|=18. Two cases: 2x-14=±18."
    },
    {
      id: "rp11-q4", number: 4, section: "B", standard: "W3.d", type: "exponential",
      question_html: "Solve: \\( 3^{x-9} = 729 \\)",
      inputs: [
        { id: "q4_x", type: "number", label: "x =", answer: 15, tolerance: 0.05 }
      ],
      hint: "Rewrite 729 as a power of 3. Then set exponents equal.",
      solution_steps: [
        "729 = 3^6.",
        "3^(x-9) = 3^6 → x-9 = 6 → x = 15.",
        "Check: 3^(15-9) = 3^6 = 729 ✓"
      ],
      feedback_correct: "🔥 Common base. x=15.",
      feedback_wrong: "729=3^6. So x-9=6 → x=15."
    },
    {
      id: "rp11-q5", number: 5, section: "B", standard: "W2.a", type: "quadratic",
      question_html: "Solve by factoring: \\( x^2 - 4x - 77 = 0 \\)",
      inputs: [
        { id: "q5_factored", type: "text", label: "Factored form:" },
        { id: "q5_x1", type: "number", label: "Smaller x =", answer: -7, tolerance: 0.05 },
        { id: "q5_x2", type: "number", label: "Larger x =", answer: 11, tolerance: 0.05 }
      ],
      hint: "Find two numbers that multiply to -77 and add to -4.",
      solution_steps: [
        "Factors of -77 adding to -4: -11 and +7.",
        "Factor: (x - 11)(x + 7) = 0.",
        "x = 11 or x = -7.",
        "Check: (11)^2 - 4(11) - 77 = 121 - 44 - 77 = 0 ✓, (-7)^2 - 4(-7) - 77 = 49 + 28 - 77 = 0 ✓"
      ],
      feedback_correct: "🔥 Factored. Two roots.",
      feedback_wrong: "Factors of -77 adding to -4: -11 and +7. So (x-11)(x+7)=0."
    },
    {
      id: "rp11-q6", number: 6, section: "B", standard: "W3.c", type: "radical",
      question_html: "Solve: \\( \\sqrt{x^2 - 119} = 5 \\)",
      inputs: [
        { id: "q6_x1", type: "number", label: "Smaller x =", answer: -12, tolerance: 0.05 },
        { id: "q6_x2", type: "number", label: "Larger x =", answer: 12, tolerance: 0.05 }
      ],
      hint: "Square both sides to remove the radical. Solve for x^2, then take ± square root.",
      solution_steps: [
        "Square both sides: x^2 - 119 = 25.",
        "x^2 = 144.",
        "x = ±12.",
        "Check: √(144-119) = √25 = 5 ✓ for both x=12 and x=-12."
      ],
      feedback_correct: "🔥 Squared. Both roots: x=±12.",
      feedback_wrong: "Square both sides: x^2-119=25 → x^2=144 → x=±12."
    },
    {
      id: "rp11-q7", number: 7, section: "B", standard: "W3.d", type: "exponential",
      question_html: "Solve: \\( 27^x = 3^{x+8} \\)",
      inputs: [
        { id: "q7_x", type: "number", label: "x =", answer: 4, tolerance: 0.05 }
      ],
      hint: "Rewrite 27 as a power of 3. Set exponents equal.",
      solution_steps: [
        "27 = 3^3.",
        "3^(3x) = 3^(x+8) → 3x = x+8 → 2x = 8 → x = 4.",
        "Check: 27^4 = 3^12, 3^(4+8) = 3^12 ✓"
      ],
      feedback_correct: "🔥 Common base 3. x=4.",
      feedback_wrong: "27=3^3. So 3x=x+8 → 2x=8 → x=4."
    },
    {
      id: "rp11-q8", number: 8, section: "B", standard: "W3.c", type: "rational",
      question_html: "Solve: \\( \\dfrac{3x - 1}{x - 5} = 4 \\)",
      inputs: [
        { id: "q8_x", type: "number", label: "x =", answer: 19, tolerance: 0.05 }
      ],
      hint: "Multiply both sides by (x-5) to clear the denominator. Check x ≠ 5.",
      solution_steps: [
        "Multiply both sides by (x-5): 3x - 1 = 4(x - 5).",
        "3x - 1 = 4x - 20.",
        "19 = x → x = 19.",
        "Check x≠5: 19≠5 ✓. Verify: (3·19-1)/(19-5) = 56/14 = 4 ✓"
      ],
      feedback_correct: "🔥 Cleared denominator. x=19.",
      feedback_wrong: "Multiply by (x-5): 3x-1=4x-20 → x=19."
    },
    {
      id: "rp11-q9", number: 9, section: "B", standard: "W3.b", type: "radical",
      question_html: "Solve: \\( \\sqrt{x + 2} = x - 10 \\). Check for extraneous solutions.",
      inputs: [
        { id: "q9_x", type: "number", label: "x =", answer: 14, tolerance: 0.05 }
      ],
      hint: "Square both sides. Solve the resulting quadratic. Check both solutions in the original.",
      solution_steps: [
        "Square both sides: x + 2 = (x-10)^2 = x^2 - 20x + 100.",
        "0 = x^2 - 21x + 98 = (x-14)(x-7).",
        "x = 14 or x = 7.",
        "Check x=14: √(14+2) = √16 = 4 = 14-10 ✓.",
        "Check x=7: √(7+2) = 3, but 7-10 = -3 ≠ 3. Extraneous! x=7 rejected.",
        "Answer: x = 14."
      ],
      feedback_correct: "🔥 Caught x=7 extraneous. x=14.",
      feedback_wrong: "Square both sides. Factor x^2-21x+98=0. Check x=7 is extraneous."
    },
    {
      id: "rp11-q10", number: 10, section: "B", standard: "W3.d", type: "exponential",
      question_html: "Solve: \\( 2^{x^2 - 3} = 2048 \\)",
      inputs: [
        { id: "q10_x1", type: "number", label: "Smaller x =", answer: -3.742, tolerance: 0.05 },
        { id: "q10_x2", type: "number", label: "Larger x =", answer: 3.742, tolerance: 0.05 }
      ],
      hint: "Rewrite 2048 as a power of 2. Set the exponent equal. Solve for x.",
      solution_steps: [
        "2048 = 2^11.",
        "2^(x^2-3) = 2^11 → x^2 - 3 = 11 → x^2 = 14.",
        "x = ±√14 ≈ ±3.742.",
        "Check: 2^(14-3) = 2^11 = 2048 ✓ for both values."
      ],
      feedback_correct: "🔥 Quadratic exponent. Two roots: ±√14.",
      feedback_wrong: "2048=2^11. So x^2-3=11 → x^2=14 → x=±√14."
    },
    {
      id: "rp11-q11", number: 11, section: "B", standard: "W3.b", type: "fractional-exp",
      question_html: "Solve: \\( x^{3/5} = 8 \\)",
      inputs: [
        { id: "q11_x", type: "number", label: "x =", answer: 32, tolerance: 0.05 }
      ],
      hint: "Raise both sides to the 5/3 power (the reciprocal of 3/5) to isolate x.",
      solution_steps: [
        "Raise both sides to the 5/3 power.",
        "x = 8^(5/3).",
        "8 = 2^3, so 8^(5/3) = (2^3)^(5/3) = 2^5 = 32.",
        "Check: 32^(3/5) = (2^5)^(3/5) = 2^3 = 8 ✓"
      ],
      feedback_correct: "🔥 3/5 power cracked. x=32.",
      feedback_wrong: "Raise to 5/3: 8^(5/3)=(2^3)^(5/3)=2^5=32."
    },
    {
      id: "rp11-q12", number: 12, section: "C", standard: "W2.c", type: "graph",
      question_html: "Graph \\( f(x) = -2(x + 6)^2 + 18 \\) and answer all of the following:",
      inputs: [
        { id: "q12_vx", type: "number", label: "Vertex x =", answer: -6, tolerance: 0.1 },
        { id: "q12_vy", type: "number", label: "Vertex y =", answer: 18, tolerance: 0.1 },
        { id: "q12_xi1", type: "number", label: "Smaller x-intercept =", answer: -9, tolerance: 0.1 },
        { id: "q12_xi2", type: "number", label: "Larger x-intercept =", answer: -3, tolerance: 0.1 },
        { id: "q12_range", type: "text", label: "Range (interval notation):" },
        { id: "q12_increase", type: "text", label: "f is increasing on:" },
        { id: "q12_decrease", type: "text", label: "f is decreasing on:" }
      ],
      hint: "Vertex form: f(x) = a(x-h)² + k. Vertex is (-6,18). a=-2<0: opens downward. Set f(x)=0 for intercepts.",
      solution_steps: [
        "Vertex: h=-6, k=18. Vertex = (-6, 18).",
        "a=-2<0 → opens downward.",
        "Set f(x)=0: -2(x+6)^2+18=0 → (x+6)^2=9 → x+6=±3 → x=-3 or x=-9.",
        "Range: y ≤ 18 → (-∞, 18].",
        "Increasing on (-∞, -6), decreasing on (-6, ∞)."
      ],
      feedback_correct: "🔥 Opens down. All features.",
      feedback_wrong: "Vertex: (-6,18), opens down. Set (x+6)^2=9 → x=-3 or -9.",
      graph: {
        canvas_id: "graphQ12",
        function: "-2*Math.pow(x+6,2)+18",
        function_display: "f(x) = −2(x+6)² + 18",
        key_points: [[-9,0],[-7,16],[-6,18],[-4,10],[-3,0]],
        x_range: [-12, 1],
        y_range: [-3, 22],
        min_points: 5,
        tolerance: 0.25
      }
    },
    {
      id: "rp11-q13", number: 13, section: "C", standard: "W2.e", type: "rational",
      question_html: "Graph \\( f(x) = \\dfrac{3}{x + 4} + 13 \\) and draw asymptotes. State the asymptotes, domain, and range.",
      inputs: [
        { id: "q13_va", type: "number", label: "Vertical asymptote x =", answer: -4, tolerance: 0.1 },
        { id: "q13_ha", type: "number", label: "Horizontal asymptote y =", answer: 13, tolerance: 0.1 },
        { id: "q13_domain", type: "text", label: "Domain:" },
        { id: "q13_range", type: "text", label: "Range:" },
        { id: "q13_endbeh", type: "text", label: "As x → +∞, f(x) →" }
      ],
      hint: "VA: denominator = 0. HA: the constant shift (the value f(x) approaches as x→∞).",
      solution_steps: [
        "VA: x+4=0 → x=-4.",
        "HA: as x→∞, 3/(x+4)→0, so f(x)→13. HA: y=13.",
        "Domain: all x ≠ -4 → (-∞,-4) ∪ (-4,∞).",
        "Range: all y ≠ 13 → (-∞,13) ∪ (13,∞).",
        "As x→+∞, f(x)→13 from above (since 3/(x+4)>0 for x>-4)."
      ],
      feedback_correct: "🔥 Asymptotes correct. Rational graphed.",
      feedback_wrong: "VA: x+4=0 → x=-4. HA: constant shift y=13.",
      graph: {
        canvas_id: "graphQ13",
        function: "3/(x+4)+13",
        function_display: "f(x) = 3/(x+4) + 13",
        key_points: [[-7,12],[-6,11.5],[-3,16],[-1,14],[2,13.5]],
        x_range: [-10, 5],
        y_range: [8, 20],
        min_points: 5,
        tolerance: 0.25
      }
    },
    {
      id: "rp11-q14", number: 14, section: "D", standard: "W2.d", type: "write-equation",
      question_html: "A quadratic function opens upward, has vertex at (3, -8), and passes through (5, 0).<br><br>Write the equation in vertex form \\( f(x) = a(x-h)^2 + k \\). State the vertex and both x-intercepts.",
      inputs: [
        { id: "q14_a", type: "number", label: "a =", answer: 2, tolerance: 0.05 },
        { id: "q14_h", type: "number", label: "h =", answer: 3, tolerance: 0.05 },
        { id: "q14_k", type: "number", label: "k =", answer: -8, tolerance: 0.05 },
        { id: "q14_x1", type: "number", label: "Smaller x-intercept =", answer: 1, tolerance: 0.05 },
        { id: "q14_x2", type: "number", label: "Larger x-intercept =", answer: 5, tolerance: 0.05 }
      ],
      hint: "Start with f(x) = a(x-3)^2 - 8. Plug in (5, 0) to find a. Then set f(x)=0 for intercepts.",
      solution_steps: [
        "f(x) = a(x-3)^2 - 8.",
        "Plug in (5, 0): 0 = a(5-3)^2 - 8 = 4a - 8 → a = 2.",
        "f(x) = 2(x-3)^2 - 8.",
        "Intercepts: 2(x-3)^2 = 8 → (x-3)^2 = 4 → x = 3±2 → x=1 or x=5.",
        "Check: 2(5-3)^2-8 = 8-8 = 0 ✓, 2(1-3)^2-8 = 8-8 = 0 ✓"
      ],
      feedback_correct: "🔥 Built the equation from features.",
      feedback_wrong: "Use f(x)=a(x-3)^2-8. Plug in (5,0) → a=2. Then solve for roots."
    },
    {
      id: "rp11-q15", number: 15, section: "D", standard: "W3.a", type: "word-problem",
      question_html: "A bacteria colony starts with 400 bacteria and doubles every 3 hours.<br><br>(a) Write the exponential model A(t).<br>(b) How many hours until the colony reaches 51,200?",
      inputs: [
        { id: "q15_model", type: "text", label: "A(t) =" },
        { id: "q15_t", type: "number", label: "t (hours) =", answer: 21, tolerance: 0.5 }
      ],
      hint: "A(t) = 400 · 2^(t/3). Set equal to 51200 and use logarithms or common-base method.",
      solution_steps: [
        "A(t) = 400 · 2^(t/3).",
        "Set 400 · 2^(t/3) = 51200.",
        "2^(t/3) = 51200 / 400 = 128 = 2^7.",
        "t/3 = 7 → t = 21 hours.",
        "Check: 400 · 2^7 = 400 · 128 = 51200 ✓"
      ],
      feedback_correct: "🔥 Doubling model. 21 hours.",
      feedback_wrong: "A(t)=400·2^(t/3)=51200 → 2^(t/3)=128=2^7 → t=21."
    }
  ]
};

const outPath = path.join(__dirname, '..', 'data', 'retake-practice-11.json');
fs.writeFileSync(outPath, JSON.stringify(rp11, null, 2), 'utf8');
console.log('RP11 written:', outPath);
console.log('Questions:', rp11.questions.length);
