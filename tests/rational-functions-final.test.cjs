const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { createHash } = require('node:crypto');
const { test } = require('node:test');
const { chromium } = require('playwright');
const { getDocument } = require('pdfjs-dist');

const root = path.resolve(__dirname, '..');
const dir = path.join(root, 'print', 'rational-functions-final-2026-11-12');
const exam = JSON.parse(fs.readFileSync(path.join(dir, 'exam.json'), 'utf8'));
const q = id => exam.questions.find(item => item.id === id);
const poly = (coefficients, x) => coefficients.reduce((value, coefficient) => value * x + coefficient, 0);
const graph = (id, x) => poly(q(id).graph.numerator, x) / poly(q(id).graph.denominator, x);
const close = (actual, expected, tolerance = 1e-8) =>
  assert.ok(Math.abs(actual - expected) < tolerance, `${actual} should equal ${expected}`);

test('the final rehearsal retains teacher task counterparts within the requested 75 minutes', () => {
  assert.deepEqual(exam.questions.map(item => item.id), Array.from({ length: 13 }, (_, i) => i + 1));
  assert.deepEqual(exam.questions.map(item => item.teacherQuestion), exam.questions.map(item => item.id));
  assert.deepEqual(exam.questions.map(item => item.points), [8, 4, 4, 8, 10, 4, 4, 4, 2, 2, 2, 2, 4]);
  assert.equal(exam.totalPoints, 58);
  assert.equal(exam.durationMinutes, 75);
  assert.equal(exam.questions.reduce((sum, item) => sum + item.minutes, 0) + exam.reviewMinutes, 75);
  assert.match(exam.timingStatus, /not empirically timed/);
  for (const item of exam.questions) {
    assert.ok([1, 2, 3].includes(item.difficulty));
    close(item.rubric.reduce((sum, row) => sum + row.points, 0), item.points);
    for (const field of ['stem', 'answer', 'variation', 'gapTarget']) assert.ok(item[field].length > 20);
    assert.ok(item.steps.length >= 2);
    if (item.choices) {
      assert.equal(item.choices.length, 4);
      assert.equal(new Set(item.choices).size, 4);
      assert.match(item.correctChoice, /^[A-D]$/);
    }
  }
  assert.deepEqual(exam.questions.filter(item => item.choices).map(item => item.id), [9, 10, 11, 12]);
});

test('new LCD and repeated-factor operations preserve the full original domains', () => {
  assert.equal(q(2).stem, 'Simplify \\(\\dfrac2{x^2+x-6}-\\dfrac3{x^2+5x+6}\\). State all excluded real inputs. Show your algebra.');
  assert.equal(q(3).stem, 'Simplify \\(\\dfrac{x^2-9}{x^2+5x+6}\\cdot\\dfrac{x^2+4x+4}{x^2-6x+9}\\). State all excluded real inputs. Show your algebra.');
  for (const x of [-7, -4, -1, 0, 1, 4, 5, 7]) {
    close(2 / (x * x + x - 6) - 3 / (x * x + 5 * x + 6),
      (10 - x) / ((x + 3) * (x - 2) * (x + 2)));
    close((x * x - 9) / (x * x + 5 * x + 6) * (x * x + 4 * x + 4) / (x * x - 6 * x + 9),
      (x + 2) / (x - 3));
  }
  assert.match(q(2).answer, /not -3, -2 or 2/);
  assert.match(q(3).answer, /not -3, -2 or 3/);
  const excluded = (polynomials, values) => values.filter(x => polynomials.some(p => poly(p, x) === 0));
  assert.deepEqual(excluded([[1, 1, -6], [1, 5, 6]], [-3, -2, 2]), [-3, -2, 2]);
  assert.deepEqual(excluded([[1, 5, 6], [1, -6, 9]], [-3, -2, 3]), [-3, -2, 3]);
});

test('reciprocal and nonmonic feature graphs match their original expressions and missing points', () => {
  assert.match(q(1).stem, /\\dfrac\{x\+1\}\{2-x\}/);
  assert.match(q(5).stem, /-3x\^2\+12x-9/);
  for (const x of [-5, -3, -0.5, 0, 3, 5]) {
    close(graph(1, x), (x + 1) / (2 - x));
    close(graph(5, x), (-3 * x * x + 12 * x - 9) / (2 * x * x + 2 * x - 4));
  }
  close(graph(1, 1), 2);
  close(graph(1, 3), -4);
  close(graph(5, 3), 0);
  close(graph(5, 0), 9 / 4);
  close(graph(5, 1), 1);
  assert.deepEqual(q(5).graph.holes, [[1, 1]]);
  assert.deepEqual(q(5).graph.poles, [-2]);
  assert.equal(q(5).graph.horizontal, -1.5);
  assert.match(q(5).rubric.at(-1).text, /open hole/);
});

test('graph analysis changes hole topology while retaining readable exact extrema', () => {
  const f = x => graph(4, x);
  const slope = x => (f(x + 0.0001) - f(x - 0.0001)) / 0.0002;
  const curvature = x => f(x + 0.001) - 2 * f(x) + f(x - 0.001);
  close(f(-1), -5);
  close(f(3), 3);
  close(f(5), 4);
  assert.deepEqual(q(4).graph.holes, [[5, 4]]);
  assert.deepEqual(q(4).graph.poles, [1]);
  assert.deepEqual(q(4).graph.slant, [1, -2]);
  for (const x of [-6, -2, 4, 6]) assert.ok(slope(x) > 0);
  for (const x of [-0.5, 0.5, 1.5, 2.5]) assert.ok(slope(x) < 0);
  for (const x of [-4, -0.5]) assert.ok(curvature(x) < 0);
  for (const x of [1.5, 3, 6]) assert.ok(curvature(x) > 0);
  assert.match(q(4).answer, /\(3,5\) union \(5,infinity\)/);
  assert.match(q(4).steps.join(' '), /deducted once, not twice/);
});

test('positive fractional slant, mixture interpretation and original-domain construction are correct', () => {
  for (const x of [-8, -1, 0, 2, 3, 7]) {
    close((x * x + 2 * x - 7) / (2 * x - 2), x / 2 + 1.5 - 4 / (2 * x - 2));
  }
  for (const t of [0, 1, 10, 100, 10000]) {
    const concentration = (10 + 6 * t) / (5 + 2 * t);
    close(concentration, 3 - 5 / (5 + 2 * t));
    assert.ok(concentration < 3);
  }
  const construction = x => -2 * (x + 2) / (x - 3);
  close(construction(-2), 0);
  close(construction(0), 4 / 3);
  const alternative = x => -2 * (x + 2) ** 2 / (x - 3) ** 2;
  close(alternative(0), -8 / 9);
  assert.match(q(8).answer, /Other valid rules may have different hole heights/);
  assert.match(q(8).steps.join(' '), /no y-intercept/);
  assert.match(q(8).rubric[1].text, /Verification/);
});

test('graph MC has one exact curve/domain match, including residual-factor and reflection distractors', () => {
  const cases = [
    { id: 10, candidates: [
      { rule: x => (x - 1) / (x * x - 4), excluded: [-2, 2] },
      { rule: x => -((x - 1) ** 2) / (x * x - 4), excluded: [-2, 2] },
      { rule: x => (x - 1) ** 2 / (2 * x * x + 8), excluded: [] },
      { rule: x => (x - 1) ** 2 / (x * x - 4), excluded: [-2, 2] }
    ] },
    { id: 11, candidates: [
      { rule: x => (x - 2) * (x + 3) / (2 * (x - 1)), excluded: [1] },
      { rule: x => (x - 2) * (x + 3) / (2 * (x - 1)), excluded: [-1, 1] },
      { rule: x => (x - 2) * (x + 3) / (2 * (x + 1)), excluded: [-1] },
      { rule: x => -(x - 2) * (x + 3) / (2 * (x - 1)), excluded: [-1, 1] }
    ] }
  ];
  assert.deepEqual(q(10).choices, [
    '\\(y=\\dfrac{x-1}{x^2-4}\\)', '\\(y=\\dfrac{-(x-1)^2}{x^2-4}\\)',
    '\\(y=\\dfrac{(x-1)^2}{2x^2+8}\\)', '\\(y=\\dfrac{(x-1)^2}{x^2-4}\\)'
  ]);
  assert.deepEqual(q(11).choices, [
    '\\(y=\\dfrac{(x-2)(x+3)}{2(x-1)}\\)',
    '\\(y=\\dfrac{(x+1)(x-2)(x+3)}{2(x+1)(x-1)}\\)',
    '\\(y=\\dfrac{(x+1)(x-2)(x+3)}{2(x+1)^2}\\)',
    '\\(y=\\dfrac{-(x+1)(x-2)(x+3)}{2(x+1)(x-1)}\\)'
  ]);
  for (const { id, candidates } of cases) {
    const spec = q(id).graph;
    const domain = [...spec.poles, ...(spec.holes || []).map(h => h[0])].sort((a, b) => a - b);
    const matches = candidates.flatMap((candidate, i) => {
      const domainMatches = JSON.stringify(candidate.excluded) === JSON.stringify(domain);
      const valuesMatch = [-5, -3, -0.5, 0, 0.5, 3, 5].every(x => Math.abs(candidate.rule(x) - graph(id, x)) < 1e-10);
      return domainMatches && valuesMatch ? [String.fromCharCode(65 + i)] : [];
    });
    assert.deepEqual(matches, [q(id).correctChoice]);
  }
  close(graph(10, 1), 0);
  assert.ok(graph(10, 0.9) < 0 && graph(10, 1.1) < 0);
  const touchingFromBelow = cases[0].candidates.map(candidate =>
    candidate.rule(1) === 0 && candidate.rule(0.9) < 0 && candidate.rule(1.1) < 0);
  assert.deepEqual(touchingFromBelow, [false, false, false, true]);
  assert.match(q(10).rubric.at(-1).text, /'Touches from below' plus any correct second feature qualifies/);
  close(graph(11, -1), 1.5);
  for (const x of [-6, -2, 0, 3, 6]) close(graph(11, x), x / 2 + 1 - 2 / (x - 1));
});

test('degree alternatives and same-sign pole table require new reasoning, not remembered answers', () => {
  assert.equal(q(9).correctChoice, 'C');
  assert.equal(q(9).graph.numerator.length, q(9).graph.denominator.length);
  assert.equal(q(9).graph.horizontal, -2);
  assert.deepEqual(q(12).choices, ['\\(m=8\\)', '\\(m=7\\)', '\\(m=6\\)', '\\(m=2\\)']);
  const match = [8, 7, 6, 2].map(m => {
    const f = x => (4 * x ** m - 7 * x ** 6 + 3) / (x * x + 1);
    return f(-1000) > 0 && f(1000) > 0;
  });
  assert.deepEqual(match, [true, false, false, false]);
  assert.equal(q(12).correctChoice, 'A');
  for (const table of q(13).tables) {
    assert.equal(table.inputs.length, table.outputs.length);
    table.inputs.forEach((x, i) => {
      if ([-2, 1].includes(x)) assert.equal(table.outputs[i], null);
      else close(table.outputs[i], 2 + 1 / (x + 2) ** 2, 0.000051);
    });
  }
  assert.ok(q(13).tables[0].outputs.filter(x => x !== null).every(x => x > 0));
  assert.match(q(13).answer, /positive infinity from both sides/);
});

test('both requested independent personas clear the final revision with traceable dispositions', () => {
  const reviews = JSON.parse(fs.readFileSync(path.join(dir, 'review-record.json'), 'utf8'));
  assert.equal(reviews.revision, exam.revision);
  const { status, ...assessment } = exam;
  assert.equal(status, 'reviewed-practice');
  const ordered = value => Array.isArray(value) ? value.map(ordered)
    : value !== null && typeof value === 'object'
      ? Object.fromEntries(Object.keys(value).sort().map(key => [key, ordered(value[key])]))
      : value;
  const contentHash = createHash('sha256').update(JSON.stringify(ordered(assessment)), 'utf8').digest('hex');
  assert.equal(contentHash, reviews.assessmentContentSha256ExcludingStatus,
    'No question, key, rubric, graph, layout or timing may drift after the requested reviews');
  assert.deepEqual(reviews.reviews.map(item => item.model).sort(), ['claude-opus-5.5', 'gpt-6-astra']);
  for (const item of reviews.reviews) {
    assert.equal(item.finalVerdict, 'PASS');
    assert.equal(item.reviewedRevision, exam.revision);
    assert.ok(item.evidenceInspected.length > 0);
    assert.ok(item.findings.every(finding => finding.disposition && finding.reason));
  }
  assert.match(reviews.limitations.join(' '), /not empirical/i);
});

test('student and parent copies render without leakage, clipping or unequal graph units', { timeout: 120000 }, async () => {
  const browser = await chromium.launch({
    headless: true,
    ...(process.env.MCM_PDF_BROWSER_CHANNEL ? { channel: process.env.MCM_PDF_BROWSER_CHANNEL } : {})
  });
  try {
    for (const name of ['student', 'parent-key']) {
      const page = await browser.newPage({ viewport: { width: 900, height: 1100 } });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(pathToFileURL(path.join(dir, name + '.html')).href);
      await page.evaluate(() => document.fonts.ready);
      const result = await page.evaluate(() => ({
        text: document.body.innerText,
        ids: [...document.querySelectorAll('article:not([data-continued])')].map(e => Number(e.dataset.question)),
        problems: [...document.querySelectorAll('.sheet')].filter(sheet => {
          const main = sheet.querySelector('main').getBoundingClientRect();
          const footer = sheet.querySelector('footer').getBoundingClientRect();
          return main.bottom > footer.top - 4 || sheet.scrollWidth > sheet.clientWidth + 1;
        }).map(sheet => sheet.dataset.page),
        square: [...document.querySelectorAll('svg')].every(svg => {
          const bounds = svg.getBoundingClientRect();
          return Math.abs(bounds.width - bounds.height) < 0.1;
        }),
        mathErrors: document.querySelectorAll('.katex-error').length
      }));
      assert.deepEqual(result.ids, Array.from({ length: 13 }, (_, i) => i + 1));
      assert.deepEqual(result.problems, []);
      assert.equal(result.square, true);
      assert.equal(result.mathErrors, 0);
      assert.deepEqual(errors, []);
      assert.match(result.text, /75 minutes/);
      if (name === 'student') {
        assert.doesNotMatch(result.text, /Worked solutions|Practice rubric|gapTarget|Variation:|Teacher assessment score|Hint:/i);
        assert.equal(await page.locator('[data-question="5"][data-continued] svg').count(), 1);
        const algebraHeight = await page.locator('[data-question="6"] .answer-area').first().evaluate(element =>
          element.getBoundingClientRect().height);
        assert.ok(algebraHeight >= 1.75 * 96, 'Q6 needs at least 1.75 physical inches of algebra space');
      } else {
        assert.match(result.text, /not an official school key/);
        assert.equal((result.text.match(/Practice rubric/g) || []).length, 13);
      }
      await page.close();
    }
  } finally {
    await browser.close();
  }
});

test('actual PDFs have the promised Letter pages, complete questions and legible text', async () => {
  for (const [name, groups] of [['student', exam.printing.studentGroups], ['parent-key', exam.printing.keyGroups]]) {
    const pdf = await getDocument({
      data: new Uint8Array(fs.readFileSync(path.join(dir, name + '.pdf'))),
      useSystemFonts: true, isEvalSupported: false
    }).promise;
    try {
      assert.equal(pdf.numPages, groups.length);
      let all = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1 });
        close(viewport.width, 612, 0.1);
        close(viewport.height, 792, 0.1);
        const content = await page.getTextContent();
        const text = content.items.map(item => item.str).join(' ');
        assert.match(text, new RegExp('Page ' + i + ' of ' + pdf.numPages));
        assert.ok(content.items.every(item => !item.transform || item.transform[4] >= 0));
        all += text;
      }
      assert.match(all, /75 minutes/);
      if (name === 'parent-key') assert.equal((all.match(/Practice rubric/g) || []).length, 13);
    } finally {
      await pdf.destroy();
    }
  }
});
