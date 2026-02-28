/**
 * w2b-coverage-contract.test.js — W2.b (Solving Multi-Step Equations) coverage gate
 * Agent GF | Improvement lane — acceptance criteria for GI W2.b micro-drill suggestion
 *
 * W2.b: "Solve multi-step equations including rational and radical equations"
 * GI suggested a 5-question micro-drill targeting W2.b intercepts.
 * This test defines the acceptance criteria: minimum coverage floor across all exams.
 *
 * Contract:
 *   - At least 3 exams must have a W2.b question (standard coverage)
 *   - Each W2.b question must have a numeric answer (not text/dropdown)
 *   - Each W2.b question must have a hint and solution_steps
 *   - Total W2.b questions across all exams >= 10
 *
 * When GR builds the W2.b micro-drill, this test will verify it meets the floor.
 *
 * Run: node tests/f-validation/w2b-coverage-contract.test.js
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data');
const W2B_STANDARD = 'W2.b';

let pass = 0, fail = 0;

function test(name, fn) {
    try {
        fn();
        pass++;
        console.log(`  ✅ ${name}`);
    } catch (e) {
        fail++;
        console.log(`  ❌ ${name} — ${e.message}`);
    }
}

function assert(cond, msg) { if (!cond) throw new Error(msg || 'Assertion failed'); }

console.log('\n🏀 w2b-coverage-contract.test.js');
console.log('W2.b standard coverage contract\n');

const rpFiles = fs.readdirSync(DATA_DIR)
    .filter(f => /^retake-practice-\d+\.json$/.test(f))
    .sort();

const w2bQuestions = [];
const filesWithW2b = [];

for (const filename of rpFiles) {
    const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, filename), 'utf8'));
    if (!data.questions || data.questions.length === 0) continue; // skip stubs

    const qs = data.questions.filter(q =>
        q.standard && q.standard.toUpperCase().includes(W2B_STANDARD.toUpperCase())
    );

    if (qs.length > 0) {
        filesWithW2b.push(filename.replace('.json', ''));
        w2bQuestions.push(...qs.map(q => ({ ...q, _file: filename })));
    }
}

console.log(`Found ${w2bQuestions.length} W2.b questions across ${filesWithW2b.length} exams:`);
if (filesWithW2b.length) console.log('  Files: ' + filesWithW2b.join(', '));
console.log();

// ── Coverage floor ──
test(`W2.b appears in >= 3 exams (current: ${filesWithW2b.length})`, () => {
    assert(filesWithW2b.length >= 3, `Only ${filesWithW2b.length} exams have W2.b questions — need at least 3`);
});

test(`Total W2.b questions >= 10 (current: ${w2bQuestions.length})`, () => {
    assert(w2bQuestions.length >= 10, `Only ${w2bQuestions.length} W2.b questions total — need at least 10`);
});

// ── Per-question quality ──
for (const q of w2bQuestions) {
    const label = `${q._file.replace('retake-practice-','RP').replace('.json','')} ${q.id}`;

    test(`${label}: has hint`, () => {
        assert(typeof q.hint === 'string' && q.hint.length > 0, 'Missing hint');
    });

    test(`${label}: has solution_steps`, () => {
        assert(Array.isArray(q.solution_steps) && q.solution_steps.length >= 1, 'Missing solution_steps');
    });

    test(`${label}: has at least 1 numeric input with answer`, () => {
        const numInputs = (q.inputs || []).filter(i => i.type === 'number' && i.answer !== undefined);
        assert(numInputs.length >= 1, `No graded numeric inputs — W2.b must have at least 1 answer to check`);
    });
}

// ── Summary ──
console.log('\n' + '='.repeat(50));
const total = pass + fail;
console.log(`RESULTS: ${pass}/${total} passed, ${fail} failed`);
if (fail === 0) {
    console.log(`✅ W2.b coverage contract met (${w2bQuestions.length} questions, ${filesWithW2b.length} exams)`);
} else {
    console.log(`❌ ${fail} failure(s) — W2.b coverage gap needs GR attention`);
}
console.log('='.repeat(50));

process.exit(fail > 0 ? 1 : 0);
