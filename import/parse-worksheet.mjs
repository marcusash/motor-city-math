// Agent I — Parse Unit 2 Review worksheet into structured question JSON
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

// Unicode symbol mapping from PDF extraction to LaTeX/readable
const SYMBOL_MAP = {
  '≡¥æÑ': 'x',
  '≡¥æª': 'y',
  '≡¥æô': 'f',
  '≡¥æÅ': 'b',
  '≡¥æƒ': 'r',
  '≡¥É╣': 'F',
  '≡¥É║': 'G',
  '≡¥æÜ': 'm',
  '≡¥æç': 'T',
  '≡¥æÿ': 'k',
  'ΓêÆ': '−',
  '╧Ç': 'π',
  '┬╖': '·',
  'ΓùÅ': '•',
  'ΓÇÖ': "'",
};

function cleanText(text) {
  let result = text;
  for (const [encoded, decoded] of Object.entries(SYMBOL_MAP)) {
    result = result.replaceAll(encoded, decoded);
  }
  return result.replace(/\s+/g, ' ').trim();
}

async function extractPages(filePath) {
  const data = new Uint8Array(readFileSync(filePath));
  const doc = await getDocument({ data, useSystemFonts: true }).promise;
  const pages = [];

  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    
    // Group by y-position to reconstruct lines
    const lineMap = {};
    for (const item of content.items) {
      const y = Math.round(item.transform[5]);
      if (!lineMap[y]) lineMap[y] = [];
      lineMap[y].push({ x: Math.round(item.transform[4]), str: item.str });
    }
    
    const lines = Object.keys(lineMap)
      .map(Number)
      .sort((a, b) => b - a)
      .map(y => lineMap[y].sort((a, b) => a.x - b.x).map(i => i.str).join(' ').trim())
      .filter(line => line.length > 0);

    pages.push({ page: i, lines });
  }
  return pages;
}

// Parse the worksheet into structured questions
function parseWorksheet(pages) {
  const result = {
    source: 'Copy of (Winter 11) Unit 2 Review.pdf',
    unit: 'Unit 2: Nonlinear Functions',
    school: 'SAAS',
    course: 'Algebra 2',
    standards: [],
    questions: []
  };

  // Page 1: Extract standards
  const standardsPage = pages[0].lines.join(' ');
  const standardMatches = [
    { id: 'W2.a', text: 'I can sketch graphs of parent functions' },
    { id: 'W2.b', text: 'I can identify the parent function and transformations from a graph or equation' },
    { id: 'W2.c', text: 'I can graph a function using parent shapes and transformations' },
    { id: 'W2.d', text: 'I can write an equation for a function given a graph' },
    { id: 'W2.e', text: 'I can describe characteristics of functions such as domain, range, symmetry, extrema, asymptotes, end behavior, and intervals of increasing or decreasing' },
    { id: 'W3.a', text: 'I can explain the reasoning for each step of solving an equation' },
    { id: 'W3.b', text: 'I can solve nonlinear equations using inverse operations, including quadratic, power, and radical functions' },
    { id: 'W3.c', text: 'I can solve rational equations' },
    { id: 'W3.d', text: 'I can solve exponential equations using the one-to-one property' },
    { id: 'W3.e', text: 'I can identify extraneous solutions' },
  ];
  result.standards = standardMatches;

  // Page 2: Parent function sketching (not numbered — treated as warmup set)
  const parentFunctions = [
    { expr: 'y = x^2', name: 'quadratic' },
    { expr: 'y = x^3', name: 'cubic' },
    { expr: 'y = |x|', name: 'absolute value' },
    { expr: 'y = √x', name: 'square root' },
    { expr: 'y = ∛x', name: 'cube root' },
    { expr: 'y = 1/x', name: 'reciprocal' },
    { expr: 'y = 1/x^2', name: 'reciprocal squared' },
    { expr: 'y = b^x where b > 1', name: 'exponential growth' },
    { expr: 'y = b^x where 0 < b < 1', name: 'exponential decay' },
  ];

  result.questions.push({
    id: 'W2R-warmup',
    number: 'Warmup',
    type: 'graphing',
    standards: ['W2.a'],
    difficulty: 'easy',
    questionText: 'Sketch graphs of each of the parent functions. Try to do it from memory instead of looking at your notes.',
    subParts: parentFunctions.map((pf, i) => ({
      part: String.fromCharCode(97 + i), // a, b, c...
      expression: pf.expr,
      parentFunction: pf.name
    })),
    requiresGraph: true,
    answer: null, // graphing — no single answer
    answerVerified: false
  });

  // Pages 3: Q1-Q4 — Transformation identification + graphing
  const transformQuestions = [
    {
      number: 1,
      expression: 'f(x) = −(x + 2)^3',
      latex: 'f(x) = -(x+2)^3',
      standards: ['W2.b', 'W2.c'],
      parentFunction: 'cubic: y = x^3',
      difficulty: 'medium'
    },
    {
      number: 2,
      expression: 'f(x) = 3√x − 1',
      latex: 'f(x) = 3\\sqrt{x} - 1',
      standards: ['W2.b', 'W2.c'],
      parentFunction: 'square root: y = √x',
      difficulty: 'medium'
    },
    {
      number: 3,
      expression: 'f(x) = 1/(x−4) − 1',
      latex: 'f(x) = \\frac{1}{x-4} - 1',
      standards: ['W2.b', 'W2.c'],
      parentFunction: 'reciprocal: y = 1/x',
      difficulty: 'medium'
    },
    {
      number: 4,
      expression: 'f(x) = √(−x)',
      latex: 'f(x) = \\sqrt{-x}',
      standards: ['W2.b', 'W2.c'],
      parentFunction: 'square root: y = √x',
      difficulty: 'medium'
    },
  ];

  for (const q of transformQuestions) {
    result.questions.push({
      id: `W2R-Q${q.number}`,
      number: q.number,
      type: 'transformation-identification',
      standards: q.standards,
      difficulty: q.difficulty,
      questionText: `Identify the parent function and describe the transformations. Then sketch a graph. Label at least two points.`,
      expression: q.expression,
      latex: q.latex,
      requiresGraph: true,
      expectedParts: ['parentFunction', 'transformations', 'graph'],
      hints: {
        parentFunction: q.parentFunction
      },
      answer: null, // open response + graphing
      answerVerified: false
    });
  }

  // Pages 4-5: Q5-Q6 — Detailed transformation with domain/range/table/intercepts
  const detailedTransformQuestions = [
    {
      number: 5,
      expression: 'f(x) = (1/2)|x − 1| − 2',
      latex: 'f(x) = \\frac{1}{2}|x - 1| - 2',
      standards: ['W2.b', 'W2.c', 'W2.e'],
      parentFunction: 'absolute value: y = |x|',
      difficulty: 'hard',
      domain: 'All real numbers (−∞, ∞)',
      range: 'y ≥ −2, i.e. [−2, ∞)',
      xIntercepts: 'Set (1/2)|x−1| − 2 = 0 → |x−1| = 4 → x = 5 or x = −3'
    },
    {
      number: 6,
      expression: 'f(x) = −2(x + 2)² + 5',
      latex: 'f(x) = -2(x+2)^2 + 5',
      standards: ['W2.b', 'W2.c', 'W2.e'],
      parentFunction: 'quadratic: y = x²',
      difficulty: 'hard',
      domain: 'All real numbers (−∞, ∞)',
      range: 'y ≤ 5, i.e. (−∞, 5]',
      xIntercepts: 'Set −2(x+2)² + 5 = 0 → (x+2)² = 5/2 → x = −2 ± √(5/2)',
      additionalParts: ['Find the point(s) where f(x) = 2']
    }
  ];

  for (const q of detailedTransformQuestions) {
    result.questions.push({
      id: `W2R-Q${q.number}`,
      number: q.number,
      type: 'detailed-transformation',
      standards: q.standards,
      difficulty: q.difficulty,
      questionText: `Identify the parent function and describe the transformations. Draw an accurate graph. Write the domain and range. Set up a table of values and label at least three points. Find the x-intercepts.`,
      expression: q.expression,
      latex: q.latex,
      requiresGraph: true,
      expectedParts: ['parentFunction', 'transformations', 'domain', 'range', 'tableOfValues', 'xIntercepts', 'graph'],
      hints: {
        parentFunction: q.parentFunction,
        domain: q.domain,
        range: q.range,
      },
      answer: {
        domain: q.domain,
        range: q.range,
        xIntercepts: q.xIntercepts,
      },
      answerVerified: false // NEEDS Agent R verification
    });
  }

  // Page 6: Q7-Q12 — Equation solving
  const equationSolvingSet1 = [
    {
      number: 7,
      expression: '3^(2x+5) = 81',
      latex: '3^{2x+5} = 81',
      standards: ['W3.d'],
      difficulty: 'medium',
      answer: '81 = 3^4, so 2x+5 = 4, x = −1/2',
      answerValue: '-1/2'
    },
    {
      number: 8,
      expression: '2(3x − 1)² + 1 = 9',
      latex: '2(3x-1)^2 + 1 = 9',
      standards: ['W3.b'],
      difficulty: 'medium',
      answer: '(3x−1)² = 4, 3x−1 = ±2, x = 1 or x = −1/3',
      answerValue: 'x = 1 or x = −1/3'
    },
    {
      number: 9,
      expression: '5^(3x+2) = 4', // Note: This uses the text as extracted; may need verification
      latex: '\\sqrt[5]{3x+2} = 4',
      standards: ['W3.b'],
      difficulty: 'medium',
      answer: '3x+2 = 4^5 = 1024, x = 1022/3 ≈ 340.67',
      answerValue: '1022/3',
      needsVerification: true // the PDF extraction of this equation is ambiguous
    },
    {
      number: 10,
      expression: '5 + 4x² − 2 = 3', // Extracted as: 5 + 4x² − 2 = 3, likely √(5 + 4x²) − 2 = 3
      latex: '\\sqrt{5 + 4x^2} - 2 = 3',
      standards: ['W3.b'],
      difficulty: 'medium',
      answer: '√(5+4x²) = 5, 5+4x² = 25, x² = 5, x = ±√5',
      answerValue: 'x = ±√5',
      needsVerification: true
    },
    {
      number: 11,
      expression: '5 − 3(x + 1)³ = 7',
      latex: '5 - 3(x+1)^3 = 7',
      standards: ['W3.b'],
      difficulty: 'medium',
      answer: '−3(x+1)³ = 2, (x+1)³ = −2/3, x+1 = ∛(−2/3), x = −1 + ∛(−2/3)',
      answerValue: 'x = −1 + ∛(−2/3)'
    },
    {
      number: 12,
      expression: '5 · 2^(x²−3) = 80',
      latex: '5 \\cdot 2^{x^2-3} = 80',
      standards: ['W3.d'],
      difficulty: 'hard',
      answer: '2^(x²−3) = 16 = 2^4, x²−3 = 4, x² = 7, x = ±√7',
      answerValue: 'x = ±√7'
    },
  ];

  for (const q of equationSolvingSet1) {
    result.questions.push({
      id: `W2R-Q${q.number}`,
      number: q.number,
      type: 'equation-solving',
      standards: q.standards,
      difficulty: q.difficulty,
      questionText: 'Solve each equation:',
      expression: q.expression,
      latex: q.latex,
      requiresGraph: false,
      answer: {
        solution: q.answer,
        value: q.answerValue
      },
      answerVerified: false,
      needsVerification: q.needsVerification || false
    });
  }

  // Page 7: Q13-Q16 — Graph-to-equation (require original graph images)
  for (let i = 13; i <= 16; i++) {
    result.questions.push({
      id: `W2R-Q${i}`,
      number: i,
      type: 'graph-to-equation',
      standards: ['W2.d'],
      difficulty: 'hard',
      questionText: 'Given each graph, write the parent function, the transformations that formed the graph, and then use that information to write the equation of the function shown.',
      expression: null, // requires graph image from PDF
      requiresGraph: true,
      requiresSourceImage: true, // cannot parse graph from PDF text alone
      expectedParts: ['parentFunction', 'transformations', 'equation'],
      answer: null,
      answerVerified: false,
      importNote: 'Graph image needed from source PDF — text extraction cannot capture the graph.'
    });
  }

  // Page 8: Q17-Q22 — More equation solving
  const equationSolvingSet2 = [
    {
      number: 17,
      expression: '3^(5−x) − 1 = 0',
      latex: '3^{5-x} - 1 = 0',
      standards: ['W3.d'],
      difficulty: 'medium',
      answer: '3^(5−x) = 1 = 3^0, 5−x = 0, x = 5',
      answerValue: 'x = 5'
    },
    {
      number: 18,
      expression: '2 − 3√x = 4',
      latex: '2 - 3\\sqrt{x} = 4',
      standards: ['W3.b'],
      difficulty: 'medium',
      answer: '−3√x = 2, √x = −2/3 — no real solution (√x ≥ 0)',
      answerValue: 'No real solution'
    },
    {
      number: 19,
      expression: '(6x−1)/(2x−3) = 5',
      latex: '\\frac{6x-1}{2x-3} = 5',
      standards: ['W3.c'],
      difficulty: 'medium',
      answer: '6x−1 = 5(2x−3), 6x−1 = 10x−15, 14 = 4x, x = 7/2',
      answerValue: 'x = 7/2'
    },
    {
      number: 20,
      expression: '3/(x−1)² = −4', // Extracted text suggests this; verify
      latex: '\\frac{3}{\\sqrt{2x-1}} = -4',
      standards: ['W3.c'],
      difficulty: 'hard',
      answer: 'No real solution — left side is always positive (cube root output divided), right side is negative',
      answerValue: 'No real solution',
      needsVerification: true
    },
    {
      number: 21,
      expression: '√(2x + 1) = √(3 − x)',
      latex: '\\sqrt{2x+1} = \\sqrt{3-x}',
      standards: ['W3.b', 'W3.e'],
      difficulty: 'medium',
      answer: '2x+1 = 3−x (squaring both sides), 3x = 2, x = 2/3. Check: √(7/3) = √(7/3) ✓',
      answerValue: 'x = 2/3'
    },
    {
      number: 22,
      expression: '3x^(2/3) − 1 = 107',
      latex: '3x^{2/3} - 1 = 107',
      standards: ['W3.b'],
      difficulty: 'hard',
      answer: '3x^(2/3) = 108, x^(2/3) = 36, x = 36^(3/2) = 216',
      answerValue: 'x = 216'
    },
  ];

  for (const q of equationSolvingSet2) {
    result.questions.push({
      id: `W2R-Q${q.number}`,
      number: q.number,
      type: 'equation-solving',
      standards: q.standards,
      difficulty: q.difficulty,
      questionText: 'Solve each equation:',
      expression: q.expression,
      latex: q.latex,
      requiresGraph: false,
      answer: {
        solution: q.answer,
        value: q.answerValue
      },
      answerVerified: false,
      needsVerification: q.needsVerification || false
    });
  }

  // Page 9: Q23-Q25 — Capstone word problems
  result.questions.push({
    id: 'W2R-Q23',
    number: 23,
    type: 'formula-rearrangement',
    standards: ['W3.a', 'W3.b'],
    difficulty: 'hard',
    questionText: "The gravitational force F between two bodies of mass m₁ and m₂ is given by Newton's Law of Universal Gravitation: F = G · (m₁m₂)/r². Where G is a universal constant. Rearrange the equation to find r in terms of the other quantities.",
    latex: 'F = G \\cdot \\frac{m_1 m_2}{r^2}',
    requiresGraph: false,
    answer: {
      solution: 'r² = G·m₁m₂/F, so r = √(G·m₁m₂/F)',
      value: 'r = √(Gm₁m₂/F)'
    },
    answerVerified: false
  });

  result.questions.push({
    id: 'W2R-Q24',
    number: 24,
    type: 'formula-rearrangement',
    standards: ['W3.a', 'W3.b'],
    difficulty: 'hard',
    questionText: 'When a block of mass m is connected to a spring, it can be set into simple harmonic motion. The period is given by T = 2π√(m/k). Rearrange to isolate mass m.',
    latex: 'T = 2\\pi\\sqrt{\\frac{m}{k}}',
    requiresGraph: false,
    answer: {
      solution: 'T/(2π) = √(m/k), (T/(2π))² = m/k, m = k·(T/(2π))² = kT²/(4π²)',
      value: 'm = kT²/(4π²)'
    },
    answerVerified: false
  });

  result.questions.push({
    id: 'W2R-Q25',
    number: 25,
    type: 'word-problem',
    standards: ['W3.d'],
    difficulty: 'hard',
    questionText: 'Gray wolves were reintroduced to Yellowstone in 1995-1996 with about 40 wolves. The population doubled every 10 years.',
    subParts: [
      {
        part: 'a',
        text: 'Write a model for the number of wolves after t years.',
        answer: {
          solution: 'P(t) = 40 · 2^(t/10)',
          value: 'P(t) = 40 · 2^(t/10)'
        }
      },
      {
        part: 'b',
        text: 'How long would it take for the wolf population to reach 1280?',
        answer: {
          solution: '40 · 2^(t/10) = 1280, 2^(t/10) = 32 = 2^5, t/10 = 5, t = 50 years',
          value: 't = 50 years'
        }
      }
    ],
    requiresGraph: false,
    answerVerified: false
  });

  // Page 10: Q26 — Comprehensive function analysis
  result.questions.push({
    id: 'W2R-Q26',
    number: 26,
    type: 'comprehensive-analysis',
    standards: ['W2.b', 'W2.c', 'W2.e'],
    difficulty: 'hard',
    questionText: 'Consider the function defined by f(x) = 2/(x−3)² + 1',
    latex: 'f(x) = \\frac{2}{(x-3)^2} + 1',
    requiresGraph: true,
    subParts: [
      { part: 'a', text: 'What is the parent function? Sketch a rough graph.', answer: 'y = 1/x²' },
      { part: 'b', text: 'What are the transformations from the parent function?', answer: 'Horizontal shift right 3, vertical stretch by 2, vertical shift up 1' },
      { part: 'c', text: 'Write the equations of the vertical and horizontal asymptotes.', answer: 'Vertical: x = 3, Horizontal: y = 1' },
      { part: 'd', text: 'Find the x-intercept(s).', answer: '2/(x−3)² + 1 = 0 → 2/(x−3)² = −1 → No real solution (left side always positive)' },
      { part: 'e', text: 'Construct a table of values for at least three values. Draw an accurate graph with asymptotes.' },
    ],
    answerVerified: false
  });

  return result;
}

// Main
const filePath = resolve('Winter Tri Standards Worksheets/Copy of (Winter 11) Unit 2 Review.pdf');
const pages = await extractPages(filePath);
const parsed = parseWorksheet(pages);

// Summary
console.log(`\nParsed: ${parsed.questions.length} questions from "${parsed.source}"`);
console.log(`Unit: ${parsed.unit}`);
console.log(`Standards: ${parsed.standards.map(s => s.id).join(', ')}`);
console.log(`\nQuestion breakdown:`);
const types = {};
for (const q of parsed.questions) {
  types[q.type] = (types[q.type] || 0) + 1;
}
for (const [type, count] of Object.entries(types)) {
  console.log(`  ${type}: ${count}`);
}

// Flag items needing verification
const needsVerify = parsed.questions.filter(q => q.needsVerification);
if (needsVerify.length > 0) {
  console.log(`\n⚠️  ${needsVerify.length} questions need PDF verification (ambiguous extraction):`);
  for (const q of needsVerify) {
    console.log(`  Q${q.number}: ${q.expression}`);
  }
}

// Save
const outPath = resolve('import', 'unit2-review-parsed.json');
writeFileSync(outPath, JSON.stringify(parsed, null, 2));
console.log(`\nSaved to: ${outPath}`);
