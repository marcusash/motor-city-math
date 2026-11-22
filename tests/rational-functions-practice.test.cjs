const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { test } = require('node:test');
const { chromium } = require('playwright');
const { getDocument } = require('pdfjs-dist');

const directory = path.resolve(__dirname, '..', 'print', 'assessment-2-practice-2026-11-11');
const exam = JSON.parse(fs.readFileSync(path.join(directory, 'exam.json'), 'utf8'));
const question = id => exam.questions.find(item => item.id === id);
const polynomial = (coefficients, x) => coefficients.reduce((value, coefficient) => value * x + coefficient, 0);
const value = (id, x) => {
  const graph = question(id).graph;
  return polynomial(graph.numerator, x) / polynomial(graph.denominator, x);
};
const close = (actual, expected, tolerance = 1e-8) =>
  assert.ok(Math.abs(actual - expected) < tolerance, `${actual} should equal ${expected}`);

test('preserves the teacher order, point maxima, difficulty and user-selected allowance', () => {
  assert.deepEqual(exam.questions.map(item => item.id), Array.from({ length: 13 }, (_, i) => i + 1));
  assert.deepEqual(exam.questions.map(item => item.teacherQuestion), exam.questions.map(item => item.id));
  assert.deepEqual(exam.questions.map(item => item.points), [8, 4, 4, 8, 10, 4, 4, 4, 2, 2, 2, 2, 4]);
  assert.equal(exam.totalPoints, 58);
  assert.equal(exam.durationMinutes, 60);
  assert.match(exam.durationProvenance, /historical teacher test allowance is undocumented/);
  assert.equal(exam.questions.reduce((sum, item) => sum + item.minutes, 0) + exam.reviewMinutes, 60);
  assert.deepEqual(exam.questions.filter(item => item.choices).map(item => item.id), [9, 10, 11, 12]);
  for (const item of exam.questions) {
    assert.ok([1, 2, 3].includes(item.difficulty));
    assert.equal(item.rubric.reduce((sum, row) => sum + row.points, 0), item.points);
    for (const field of ['stem', 'answer', 'variation', 'gapTarget']) assert.ok(item[field].length > 20);
    assert.ok(item.steps.length >= 2);
    assert.ok(item.parts.length > 0);
    if (item.choices) {
      assert.equal(item.choices.length, 4);
      assert.equal(new Set(item.choices).size, 4);
      assert.match(item.correctChoice, /^[A-D]$/);
    }
  }
});

test('reciprocal graph and signed feature coordinates agree with the original expressions', () => {
  for (const x of [-5, -3, -0.5, 0, 1, 3, 5]) {
    close(value(1, x), 3 - 2 / (x + 1));
    close(value(5, x), (2 * x * x + 6 * x + 4) / (x * x - x - 2));
  }
  close(value(1, -3), 4);
  close(value(1, 0), 1);
  close(value(5, -2), 0);
  close(value(5, 0), -2);
  close(value(5, -1), -2 / 3);
  assert.deepEqual(question(5).graph.holes, [[-1, '-2/3']]);
  assert.equal(question(5).graph.horizontal, 2);
  assert.deepEqual(question(5).graph.poles, [2]);
});

test('subtraction and multiplication identities retain all original exclusions', () => {
  assert.match(question(2).stem, /\\dfrac\{3\}\{x\+2\}-\\dfrac\{2x-1\}\{x\^2-4\}/);
  assert.match(question(3).stem, /x\^2-2x-15/);
  for (const x of [-7, -4, -1, 0, 1, 4, 6, 9]) {
    close(3 / (x + 2) - (2 * x - 1) / (x * x - 4), (x - 5) / ((x - 2) * (x + 2)));
    close((x * x - 2 * x - 15) / (x * x - 25) * (x + 5) / (x * x - 9), 1 / (x - 3));
  }
  assert.match(question(2).answer, /not -2 or 2/);
  assert.match(question(3).answer, /-5, -3, 3, 5/);
});

test('graph-reading extrema, interval directions, concavity and slant are consistent', () => {
  const f = x => value(4, x);
  const slope = x => (f(x + 0.0001) - f(x - 0.0001)) / 0.0002;
  const curvature = x => f(x + 0.001) - 2 * f(x) + f(x - 0.001);
  close(f(-3), 5);
  close(f(1), -3);
  close(f(0), -4);
  assert.deepEqual(question(4).graph.holes, [[0, -4]]);
  for (const x of [-2.5, -1.5, -0.5, 0.5]) assert.ok(slope(x) > 0);
  for (const x of [-5, -4, 2, 4]) assert.ok(slope(x) < 0);
  for (const x of [-5, -2]) assert.ok(curvature(x) > 0);
  for (const x of [-0.5, 0.5, 2]) assert.ok(curvature(x) < 0);
  assert.deepEqual(question(4).graph.slant, [-1, 0]);
  close(f(10000) + 10000, -4 / 10001);
});

test('negative fractional quotient, model nonattainment and construction are correct', () => {
  for (const x of [-8, -1, 0, 1, 3, 7]) {
    close((-x * x + 5) / (2 * x - 4), -x / 2 - 1 + 1 / (2 * x - 4));
  }
  assert.ok(question(6).steps.join(' ').includes('y=-x/2-1'));
  for (const n of [0, 1, 10, 100, 10000]) {
    close((12 * n + 180) / (n + 10), 12 + 60 / (n + 10));
    assert.ok((12 * n + 180) / (n + 10) > 12);
  }
  const g = x => 3 * (x + 4) / (2 * (x + 1));
  close(g(-4), 0);
  close(g(2), 3);
  assert.ok(question(8).steps.join(' ').includes('\\dfrac{3(x+4)(x-2)}{2(x+1)(x-2)}'));
  assert.match(question(8).answer, /Other valid constructions may have different hole heights/);
});

test('MC graph candidates have exactly one full graph/domain match', () => {
  assert.equal(question(9).correctChoice, 'D');
  assert.ok(question(9).graph.numerator.length < question(9).graph.denominator.length);
  const cases = [
    { id: 10, candidates: [
      { rule: x => -3 * x * x / (x * x - 4), excluded: [-2, 2] },
      { rule: x => -3 * x / (x * x - 4), excluded: [-2, 2] },
      { rule: x => -3 * x / (x * x + 4), excluded: [] },
      { rule: x => 3 * x / (x * x - 4), excluded: [-2, 2] }
    ] },
    { id: 11, candidates: [
      { rule: x => -(x - 1) * (x - 4) / (2 * (x + 2)), excluded: [-2, 0] },
      { rule: x => -(x - 1) * (x - 4) / (2 * (x + 2)), excluded: [-2] },
      { rule: x => -(x - 1) * (x - 4) / (2 * (x - 2)), excluded: [0, 2] },
      { rule: x => (x - 1) * (x - 4) / (2 * (x + 2)), excluded: [-2, 0] }
    ] }
  ];
  assert.deepEqual(question(10).choices, [
    '\\(y=\\dfrac{-3x^2}{x^2-4}\\)', '\\(y=\\dfrac{-3x}{x^2-4}\\)',
    '\\(y=\\dfrac{-3x}{x^2+4}\\)', '\\(y=\\dfrac{3x}{x^2-4}\\)'
  ]);
  assert.deepEqual(question(11).choices, [
    '\\(y=\\dfrac{-x(x-1)(x-4)}{2x(x+2)}\\)', '\\(y=\\dfrac{-(x-1)(x-4)}{2(x+2)}\\)',
    '\\(y=\\dfrac{-x(x-1)(x-4)}{2x(x-2)}\\)', '\\(y=\\dfrac{x(x-1)(x-4)}{2x(x+2)}\\)'
  ]);
  for (const { id, candidates } of cases) {
    const graph = question(id).graph;
    const expectedExclusions = [...graph.poles, ...(graph.holes || []).map(hole => hole[0])].sort((a, b) => a - b);
    const matches = candidates.flatMap((candidate, i) => {
      const domainMatches = JSON.stringify(candidate.excluded) === JSON.stringify(expectedExclusions);
      const samplesMatch = [-5, -3, -1, 0.5, 1, 3, 5].every(x => Math.abs(candidate.rule(x) - value(id, x)) < 1e-10);
      return domainMatches && samplesMatch ? [String.fromCharCode(65 + i)] : [];
    });
    assert.deepEqual(matches, [question(id).correctChoice]);
  }
  close(value(11, 0), -1);
  for (const x of [-7, -1, 0, 3, 6]) {
    close(value(11, x), -x / 2 + 3.5 - 9 / (x + 2));
  }
});

test('parameter question and rounded table values have the stated interpretation', () => {
  const matching = [1, 4, 5, 3].map(m => {
    const g = x => (3 * x ** m - 8 * x ** 4 + 2) / (x * x + 1);
    return g(-1000) < 0 && g(1000) < 0;
  });
  assert.deepEqual(matching, [true, true, false, true]);
  assert.equal(question(12).correctChoice, 'C');
  for (const table of question(13).tables) {
    assert.equal(table.inputs.length, table.outputs.length);
    table.inputs.forEach((x, i) => {
      if ([1, 3].includes(x)) assert.equal(table.outputs[i], null);
      else close(table.outputs[i], 3 + 2 / (x - 1), 0.000051);
    });
  }
  assert.match(question(13).stem, /One is a hole and the other is a vertical asymptote/);
});

test('review corrections expose omitted deliverables without giving solution methods', () => {
  const labels = id => question(id).parts.flatMap(part => (part.areas || []).flatMap(area => area.labels));
  assert.deepEqual(labels(1), ['Far-left behavior', 'Far-right behavior']);
  for (const id of [2, 3]) assert.deepEqual(labels(id), ['Algebra', 'Simplified expression', 'Excluded real inputs']);
  assert.ok(labels(4).includes('Concave up'));
  assert.ok(labels(4).includes('Concave down'));
  assert.deepEqual(labels(4).slice(-3), ['Vertical', 'Horizontal', 'Slant']);
  assert.match(question(4).parts[3].prompt, /none exists/);
  assert.ok(labels(5).includes('y-intercept'));
  assert.equal(question(5).parts[1].prompt.includes('grid below'), true);
  assert.match(question(6).parts[0].prompt, /none exists/);
  assert.match(question(6).parts[1].prompt, /why the graph approaches the asymptote/);
  assert.ok(labels(7).includes('Finite attainment and justification'));
  assert.ok(labels(8).includes('Verification of the stated features'));
  for (const id of [9, 10, 11, 12]) assert.deepEqual(labels(id), ['Choice', 'Justification']);
  assert.match(question(10).stem, /behavior at the origin and at least one other relevant graph feature/);
  assert.deepEqual(question(10).rubric.map(item => item.points), [1, 0.5, 0.5]);
  assert.match(question(11).stem, /Include the missing point/);
  assert.ok(Math.abs(value(11, -6)) < question(11).graph.range, 'Q11 left branch must appear in the actual graph window');
  assert.ok(question(11).graph.plot >= 304);
  assert.match(question(12).stem, /end directions/);
  assert.match(question(13).stem, /likely x-coordinate/);
  assert.deepEqual(labels(13), ['Location', 'Evidence', 'Location', 'Evidence']);
  for (const item of exam.questions) {
    for (const part of item.parts) {
      for (const area of part.areas || []) {
        assert.ok(area.labels.length > 0);
        assert.ok((area.weight ?? 1) > 0);
        if (area.weights) {
          assert.equal(area.weights.length, area.labels.length);
          assert.ok(area.weights.every(weight => weight > 0));
        }
      }
    }
  }
});

test('preserves both requested reviews, actual dispositions and parent-approval boundary', () => {
  const record = JSON.parse(fs.readFileSync(path.join(directory, exam.reviewRecord), 'utf8'));
  assert.equal(record.revision, exam.revision);
  assert.equal(record.status, 'ready-for-parent-review');
  assert.equal(exam.status, record.status);
  assert.deepEqual(record.reviewers.map(reviewer => reviewer.model), ['claude-opus-5.5', 'gpt-6-astra']);
  for (const reviewer of record.reviewers) {
    assert.equal(reviewer.initialVerdict, 'REVISE');
    assert.match(reviewer.finalVerdict, /^READY/);
    assert.deepEqual(reviewer.finalBlockingIssues, []);
    assert.equal(reviewer.itemFindings.length, 13);
  }
  assert.ok(record.revisionDispositions.every(item => item.status === 'implemented'));
  assert.equal(record.timing.measuredStudentTiming, false);
  assert.equal(record.timing.authoredWorkEstimateMinutes + record.timing.authoredReviewEstimateMinutes, exam.durationMinutes);
  assert.match(record.limits.join(' '), /approval, merge and site deployment remain separate/);
});

test('printed student copy separates the key, has all tasks, fits pages and uses square grids', async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    await page.goto(pathToFileURL(path.join(directory, 'student.html')).href);
    await page.evaluate(() => document.fonts.ready);
    await page.emulateMedia({ media: 'print' });
    assert.equal(await page.locator('meta[name="duration-minutes"]').getAttribute('content'), '60');
    assert.equal(await page.locator('meta[name="total-points"]').getAttribute('content'), '58');
    const ids = await page.locator('article:not([data-continued])').evaluateAll(nodes => nodes.map(node => Number(node.dataset.question)));
    assert.deepEqual(ids, exam.questions.map(item => item.id));
    assert.equal(await page.locator('[data-continued="true"]').count(), 1);
    assert.equal(await page.locator('.choices').count(), 4);
    assert.equal(await page.locator('script, .solutions, .rubric').count(), 0);
    assert.equal(await page.locator('a').count(), 0);
    const html = await page.content();
    for (const forbidden of ['gapTarget', 'correctChoice', 'Practice rubric', 'One valid rule', 'parent-key']) {
      assert.ok(!html.includes(forbidden), `student copy leaks ${forbidden}`);
    }
    const errors = await page.evaluate(() => Array.from(document.querySelectorAll('.sheet')).flatMap(sheet => {
      const result = [];
      const main = sheet.querySelector('main').getBoundingClientRect();
      const footer = sheet.querySelector('footer').getBoundingClientRect();
      if (main.bottom > footer.top - 4 || sheet.scrollWidth > sheet.clientWidth + 1) result.push('overflow');
      for (const svg of sheet.querySelectorAll('svg')) {
        const bounds = svg.getBoundingClientRect();
        if (Math.abs(bounds.width - bounds.height) > 0.1) result.push('unequal physical axis units');
      }
      return result;
    }));
    assert.deepEqual(errors, []);
    assert.equal(await page.locator('[data-question="1"] svg path').count(), 0);
    assert.equal(await page.locator('[data-question="5"] svg path').count(), 0);
    assert.equal(await page.locator('[data-question="11"] circle').count(), 1);
    for (const item of exam.questions) {
      const expected = item.parts.flatMap(part => (part.areas || []).flatMap(area => area.labels));
      const rendered = await page.locator(`article[data-question="${item.id}"] .answer-field`).allTextContents();
      assert.deepEqual(rendered, expected, `Q${item.id} response areas`);
    }
  } finally {
    await browser.close();
  }
});

test('actual PDFs have the expected Letter pages and no missing or extra page footers', async () => {
  for (const [name, count] of [['student', 11], ['parent-key', 8]]) {
    const loading = getDocument({ data: new Uint8Array(fs.readFileSync(path.join(directory, name + '.pdf'))), verbosity: 0 });
    const pdf = await loading.promise;
    try {
      assert.equal(pdf.numPages, count);
      for (let i = 1; i <= count; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1 });
        close(viewport.width, 612, 0.01);
        close(viewport.height, 792, 0.01);
        const content = (await page.getTextContent()).items.map(item => item.str).join(' ');
        assert.ok(content.includes(`Page ${i} of ${count}`), `${name} page ${i} footer`);
        assert.ok(content.includes(`Revision ${exam.revision}`), `${name} stale revision`);
        if (name === 'student') assert.ok(!content.includes('Practice rubric'));
      }
    } finally {
      await loading.destroy();
    }
  }
});
