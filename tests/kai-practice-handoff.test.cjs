const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { inventory, inventoryPath } = require('../scripts/kai-practice-inventory.cjs');
const { quiz, key, documentHtml } = require('../scripts/build-kai-mixed-refresher.cjs');
const repository = path.resolve(__dirname, '..');

test('distributed files match the complete checksum inventory', () => {
  const recorded = JSON.parse(fs.readFileSync(inventoryPath, 'utf8'));
  assert.deepEqual(inventory(), recorded);
  assert.equal(recorded.files.filter(file => file.path.endsWith('.pdf')).length, 6);
  assert.equal(recorded.files.filter(file => file.path.endsWith('.html')).length, 4);
  for (const file of recorded.files) {
    assert.ok(!file.path.includes('..'));
    if (file.path.endsWith('.pdf')) {
      assert.equal(fs.readFileSync(path.join(repository, file.path)).subarray(0, 5).toString(), '%PDF-');
    }
  }
});

test('HTML and handoff links resolve without machine-local assets', () => {
  const recorded = JSON.parse(fs.readFileSync(inventoryPath, 'utf8'));
  for (const file of recorded.files.filter(file => /\.(html|md)$/.test(file.path))) {
    const filename = path.join(repository, file.path);
    const text = fs.readFileSync(filename, 'utf8');
    assert.doesNotMatch(text, /file:\/\/|session-state|C:\\Users\\|\/Users\/|\/home\//i);
    const links = file.path.endsWith('.html')
      ? [...text.matchAll(/(?:href|src)="([^"]+)"/g)].map(match => match[1])
      : [...text.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)].map(match => match[1]);
    for (const link of links) {
      if (/^(https?:|#)/.test(link)) continue;
      assert.ok(fs.existsSync(path.resolve(path.dirname(filename), decodeURIComponent(link))),
        `${file.path}: missing ${link}`);
    }
  }
  assert.match(documentHtml(quiz(), 'Quiz'), /href="..\/..\/shared\/katex\/katex.min.css"/);
});

test('student quiz retains five questions, three rational and two inverse', () => {
  const student = quiz();
  assert.deepEqual([...student.matchAll(/data-question="(\d)"/g)].map(match => Number(match[1])),
    [1, 1, 2, 3, 4, 5]);
  assert.equal((student.match(/<b>20 points<\/b>/g) || []).length, 5);
  assert.match(student, /4x\^2\+6x\+2/);
  assert.match(student, /6x\^2\+15x\+6/);
  assert.match(student, /53-second job/);
  assert.match(student, /Write your answers first/);
  assert.equal((student.match(/= __________________/g) || []).length, 2);
  assert.doesNotMatch(student, /<annotation[^>]*>U\(U\^\{-1\}\(x\)\)=x/);
  assert.match(key(), /not an honors-level assessment/);
});

function multiply(a, b) {
  const result = Array(a.length + b.length - 1).fill(0);
  a.forEach((x, i) => b.forEach((y, j) => { result[i + j] += x * y; }));
  return result;
}

test('easier factoring preserves all rational-function answers', () => {
  assert.deepEqual(multiply([2, 2], [1, 2]), [2, 6, 4]);
  assert.deepEqual(multiply([6, 3], [1, 2]), [6, 15, 6]);
  const numerator = x => 4 * x * x + 6 * x + 2;
  const denominator = x => 6 * x * x + 15 * x + 6;
  const simplified = x => 2 * (x + 1) / (3 * (x + 2));
  assert.equal(denominator(-2), 0);
  assert.equal(denominator(-0.5), 0);
  assert.equal(numerator(-0.5), 0);
  assert.notEqual(numerator(-2), 0);
  assert.equal(simplified(-1), 0);
  assert.equal(simplified(0), 1 / 3);
  assert.equal(simplified(-0.5), 2 / 9);
  for (const x of [-5, -3, -1, 0, 1, 2, 7 / 3]) {
    assert.ok(Math.abs(numerator(x) / denominator(x) - simplified(x)) < 1e-12);
    assert.ok(Math.abs(simplified(x) - (2 / 3 - 2 / (3 * (x + 2)))) < 1e-12);
  }
  assert.ok(simplified(-2.001) > 600);
  assert.ok(simplified(-1.999) < -600);
  assert.ok(simplified(-1000) > 2 / 3);
  assert.ok(simplified(1000) < 2 / 3);
});

test('retained long division and inverse answers remain valid', () => {
  const product = multiply([-2, 1, 3], [-3, 2]);
  product[0] -= 4;
  product[1] += 5;
  assert.deepEqual(product, [2, -2, -7, 6]);
  const time = pages => 2.5 * pages + 3;
  const pages = seconds => (seconds - 3) / 2.5;
  assert.equal(time(8), 23);
  assert.equal(pages(8), 2);
  assert.equal(pages(53), 20);
  const forward = x => 2 + Math.sqrt(5 * x + 10);
  const inverse = x => ((x - 2) ** 2 - 10) / 5;
  for (const x of [-2, -1, 0, 5]) assert.ok(Math.abs(inverse(forward(x)) - x) < 1e-12);
  for (const x of [2, 3, 5, 10]) assert.ok(Math.abs(forward(inverse(x)) - x) < 1e-12);
  assert.notEqual(forward(inverse(1)), 1);
});
