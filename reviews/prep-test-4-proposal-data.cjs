const m = String.raw;

module.exports = {
  title: 'Functions and Graphs: Practice Test 4',
  minutes: 75,
  points: 100,
  status: 'Question proposal only. No student test or PDF has been built.',
  questions: [
    {
      id: 1, points: 10, source: 'New, parallel to Prep Test 3 Q1', graph: 'two-blank',
      prompt: [
        'Graph each function on its own coordinate plane. Label the axes and intercepts.',
        m`(a) \(f(x)=\frac23x+1\).`,
        m`(b) \(g(x)=2\sqrt{x-1}-4\).`
      ]
    },
    {
      id: 2, points: 6, source: 'New, parallel to Prep Test 3 Q2', given: 'quadratic',
      prompt: [
        'Write an equation for the graphed function in factored and standard form. Show your work.'
      ]
    },
    {
      id: 3, points: 14, source: 'Prep Test 2 Q3 (retained)', given: 'composition',
      graph: 'blank',
      prompt: [
        'The graph of f consists of straight segments through (-3,-1), (-1,3), (2,0), and (4,2), in that order, with included endpoints. Let g(x)=1-(3/5)x.',
        m`(a) Graph \(f(g(x))\) and \(g(f(x))\) on the provided coordinate plane. Use a solid line for \(f(g(x))\) and a dashed line for \(g(f(x))\). Label the vertices and both graphs.`,
        m`(b) Give both domains and describe the transformations of f in each composition. Show your work.`
      ]
    },
    {
      id: 4, points: 8, source: 'New, parallel to Prep Test 3 Q4', graph: 'blank',
      graphRange: { x: [-4, 4], y: [-10, 12] },
      prompt: [
        m`Graph \(F(x)=x^3-2x^2-5x+6\). Label the axes and intercepts.`
      ]
    },
    {
      id: 5, points: 8, source: 'New, parallel to Prep Test 3 Q5', given: 'polynomial',
      prompt: ['Write an equation for the graphed polynomial. Show your work.']
    },
    {
      id: 6, points: 10, source: 'New, parallel to Prep Test 3 Q6', graph: 'none',
      prompt: [
        m`Let \(f(x)=\sqrt{15-3x}\) and \(g(x)=x+2\).`,
        m`(a) Find \(\frac{f(x)}{g(x)}\) and its domain.`,
        m`(b) Find \(g(f(x))\).`,
        m`(c) Find \(f(a+b)\).`
      ]
    },
    {
      id: 7, points: 8, source: 'New, parallel to Prep Test 3 Q7', graph: 'blank',
      graphRange: { x: [-6, 6], y: [-6, 6] },
      prompt: [
        m`Let \(p(x)=\begin{cases}2(x-1)^2-3,&x<1\\-x+2,&x\ge1.\end{cases}\)`,
        '(a) Graph p on the provided axes.',
        m`(b) Find \(p(0)\), \(p(1)\), and \(p(3)\).`
      ]
    },
    {
      id: 8, points: 8, source: 'Prep Test 2 Q8 (retained)', graph: 'blank',
      graphRange: { x: [-4, 5], y: [-8, 20] },
      prompt: [
        m`Let \(R(x)=-(x+2)(x-1)^2(x-3)\).`,
        '(a) State the degree, leading coefficient, zeros, and multiplicities. Find the y-intercept.',
        '(b) Sketch R on the provided axes. Label its intercepts.',
        m`(c) State the intervals where \(R(x)>0\) and \(R(x)<0\). Explain why its ends point the same way, unlike the odd-degree polynomial in Question 4.`
      ]
    },
    {
      id: 9, points: 10, source: 'Prep Test 2 Q9 (retained)', graph: 'none',
      prompt: [
        m`A rectangular planting bed has perimeter 24 feet. Its width is \(w\) feet, with \(2\le w\le6\), and its length is \(12-w\) feet. Its area is \(A(w)=w(12-w)\) square feet.`,
        m`Soil delivery costs \(C(a)=8a\) dollars when \(0\le a\le30\) square feet, and \(C(a)=240+5(a-30)\) dollars when \(a>30\) square feet. There are no other charges.`,
        '(a) Write the composition giving cost in terms of width. Explain the order using units.',
        '(b) Write that cost as a piecewise function of w, including the width intervals for each price rule. State the model domain.',
        '(c) Find the cost when w=4.',
        '(d) With a budget of $260, find the greatest permitted width. Give an exact value and a decimal to the nearest hundredth. Show your work.'
      ]
    },
    {
      id: 10, points: 8, source: 'Prep Test 2 Q10 (retained)', graph: 'blank',
      graphRange: { x: [-2, 10], y: [-8, 6] },
      prompt: [
        m`A square-root function has the form \(r(x)=a\sqrt{x-h}+k\), domain \([1,\infty)\), range \((-\infty,3]\), and passes through \((5,-1)\).`,
        '(a) Find its equation. Show your work.',
        '(b) Graph r on the provided coordinate plane. Label its starting point and three other points.',
        '(c) State its x-intercept exactly and its interval of decrease.'
      ]
    },
    {
      id: 11, points: 4, source: 'New, parallel to Prep Test 3 Q11', table: {
        caption: 'Values and behavior of g',
        rows: [
          ['x', '-5', '(-5,-1)', '-1', '(-1,4)', '4', '(4,8)', '8'],
          ['g(x)', '6', 'decreasing', '-2', 'increasing', '3', 'decreasing', '-2']
        ]
      },
      prompt: [
        'The continuous function g is defined for all real numbers. The table gives some values and its behavior on the indicated intervals.',
        'Which statement is guaranteed to be true?',
        '(A) g has a relative maximum at x=-1.',
        '(B) The range of g is [-2,6].',
        '(C) g(x)=0 for some x in (4,8).',
        '(D) g has a relative minimum at x=4.'
      ]
    },
    {
      id: 12, points: 6, source: 'New, parallel to Prep Test 3 Q12', given: 'operations', table: {
        caption: 'Selected values of f',
        rows: [
          ['x', '-1', '1', '2', '4', '6'],
          ['f(x)', '2', '5', '-4', '7', '0']
        ]
      },
      prompt: [
        m`The graph of g is shown for \(-4\le x\le8\). Selected values of f are in the table; f is defined for all real numbers. Let \(h(x)=2x+3\).`,
        m`(a) Find \(f(g(-2))\).`,
        m`(b) Let \(j(x)=g(x)-h(x)\). Find \(j(5)\).`,
        m`(c) What is the domain of \(\frac{f(x)}{h(x)}\)?`
      ]
    }
  ]
};
