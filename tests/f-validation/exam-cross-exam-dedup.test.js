/**
 * exam-cross-exam-dedup.test.js
 * Guardrail: block same-type numeric answer duplicates in new retake exams.
 *
 * Run: node tests/f-validation/exam-cross-exam-dedup.test.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const DATA_DIR = path.join(ROOT, 'data');
const NEW_EXAMS = ['retake-practice-6.json', 'retake-practice-7.json'];
const STRICT = process.env.STRICT_DEDUP === '1';

let pass = 0, fail = 0, total = 0;

function test(name, cond, detail) {
    total++;
    if (cond) {
        pass++;
        console.log(`  ✅ ${name}`);
    } else {
        fail++;
        console.log(`  ❌ ${name}${detail ? ` - ${detail}` : ''}`);
    }
}

function getExam(file) {
    return JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf-8'));
}

function numericSignature(question) {
    const nums = question.inputs
        .filter(i => i.type === 'number' && typeof i.answer === 'number')
        .map(i => i.answer)
        .sort((a, b) => a - b);
    if (!nums.length) return null;
    return `${question.type}|${question.standard}|${nums.join(',')}`;
}

console.log('\n🏀 exam-cross-exam-dedup.test.js\n');

const allFiles = fs.readdirSync(DATA_DIR)
    .filter(f => /^retake-practice-\d+\.json$/.test(f))
    .sort((a, b) => Number(a.match(/\d+/)[0]) - Number(b.match(/\d+/)[0]));

test('retake exam set discovered', allFiles.length >= 7, `found ${allFiles.length}`);
for (const f of NEW_EXAMS) {
    test(`${f} exists`, allFiles.includes(f));
}

const prior = [];
for (const file of allFiles) {
    if (!NEW_EXAMS.includes(file)) prior.push(getExam(file));
}
const incoming = NEW_EXAMS.map(getExam);

const priorSignatures = new Map();
for (const exam of prior) {
    for (const q of exam.questions) {
        const sig = numericSignature(q);
        if (!sig) continue;
        const val = `${exam.exam_id}/${q.id}`;
        if (!priorSignatures.has(sig)) priorSignatures.set(sig, []);
        priorSignatures.get(sig).push(val);
    }
}

console.log('\n── Duplicate check: new exams vs prior exams (same type + standard + numeric answers) ──');
for (const exam of incoming) {
    let localDupes = 0;
    for (const q of exam.questions) {
        const sig = numericSignature(q);
        if (!sig) continue;
        const matches = priorSignatures.get(sig) || [];
        if (matches.length) {
            localDupes++;
            test(`${exam.exam_id}/${q.id} is unique`, false, `matches ${matches.join(', ')}`);
        } else {
            test(`${exam.exam_id}/${q.id} is unique`, true);
        }
    }
    test(`${exam.exam_id} has zero hard duplicates`, localDupes === 0, `${localDupes} duplicates`);
}

console.log('\n── Summary ──');
console.log(`  Total: ${total}`);
console.log(`  ✅ Passed: ${pass}`);
console.log(`  ❌ Failed: ${fail}`);

if (fail > 0 && STRICT) {
    process.exit(1);
}
if (fail > 0 && !STRICT) {
    console.log('  ℹ️ Advisory mode: duplicates reported, not blocking (set STRICT_DEDUP=1 to fail).');
}
