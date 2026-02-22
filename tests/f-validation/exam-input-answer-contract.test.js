/**
 * exam-input-answer-contract.test.js
 * Enforces answer-field rules by input type for retake practice JSON.
 *
 * Rule:
 * - number/dropdown/radio: answer required
 * - text: answer optional (self-assessed)
 *
 * Run: node tests/f-validation/exam-input-answer-contract.test.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const DATA_DIR = path.join(ROOT, 'data');
const files = fs.readdirSync(DATA_DIR).filter((f) => /^retake-practice-\d+\.json$/.test(f)).sort();

let total = 0, pass = 0, fail = 0;
function test(name, ok, detail = '') {
  total++;
  if (ok) {
    pass++;
    console.log(`  ✅ ${name}`);
  } else {
    fail++;
    console.log(`  ❌ ${name}${detail ? ` — ${detail}` : ''}`);
  }
}

console.log('\n🏀 exam-input-answer-contract.test.js\n');
test('retake-practice files found', files.length > 0, `count=${files.length}`);

const requiredTypes = new Set(['number', 'dropdown', 'radio']);
for (const file of files) {
  const full = path.join(DATA_DIR, file);
  const json = JSON.parse(fs.readFileSync(full, 'utf-8'));
  const questions = Array.isArray(json.questions) ? json.questions : [];
  test(`${file}: has questions`, questions.length > 0);

  for (const q of questions) {
    const inputs = Array.isArray(q.inputs) ? q.inputs : [];
    for (const inp of inputs) {
      const type = String(inp.type || '').trim();
      const hasAnswer = Object.prototype.hasOwnProperty.call(inp, 'answer');
      const label = `${file} ${q.id || 'q?'} ${inp.id || 'inp?'} (${type})`;
      if (requiredTypes.has(type)) {
        test(`${label}: answer required`, hasAnswer);
      } else if (type === 'text') {
        test(`${label}: text allows missing answer`, true);
      } else {
        test(`${label}: unknown type flagged`, false, 'unsupported input.type');
      }
    }
  }
}

console.log('\n── Summary ──');
console.log(`  Total: ${total}`);
console.log(`  ✅ Passed: ${pass}`);
console.log(`  ❌ Failed: ${fail}`);
if (fail > 0) process.exit(1);
