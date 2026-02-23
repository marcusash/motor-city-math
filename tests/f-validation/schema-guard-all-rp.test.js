/**
 * schema-guard-all-rp.test.js — Schema guard across ALL retake-practice JSON files
 * Agent GF | Gap identified: exam-json-schema.test.js only covers RP1
 *
 * Runs the critical contract checks on all 10 RP files:
 *   - JSON parseable (no merge conflicts, no corruption)
 *   - All required question fields present
 *   - Input type validity
 *   - Answer required for number/dropdown/radio (text allowed without answer per GA)
 *   - number inputs have tolerance
 *   - hint <= 120 chars (E-5)
 *   - solution_steps is non-empty array
 *   - plus_minus questions have exactly 2 distinct number inputs
 *
 * NOT duplicated from exam-json-schema.test.js: graph function math and key_points
 * are verified by the original RP1 test. This test focuses on data integrity across fleet.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const DATA_DIR = path.join(ROOT, 'data');

const REQUIRED_Q_FIELDS = ['id', 'number', 'standard', 'type', 'question_html', 'inputs', 'hint', 'solution_steps'];
// Note: feedback_correct, feedback_wrong, version are GP-added fields (optional here).
// Enforcement of those fields is owned by tests/gp-field-completeness.test.js (GP).
// GF does not duplicate that check.
const VALID_INPUT_TYPES = ['dropdown', 'number', 'radio', 'text'];
const HINT_MAX = 120;

let totalPass = 0, totalFail = 0;

function suite(label, fn) {
    console.log(`\n── ${label} ──`);
    fn();
}

function test(name, fn) {
    try {
        fn();
        totalPass++;
        console.log(`  ✅ ${name}`);
    } catch (e) {
        totalFail++;
        console.log(`  ❌ ${name} — ${e.message}`);
    }
}

function assert(cond, msg) { if (!cond) throw new Error(msg || 'Assertion failed'); }

// ============================================================
// Discover all RP files
// ============================================================
const rpFiles = fs.readdirSync(DATA_DIR)
    .filter(f => /^retake-practice-\d+\.json$/.test(f))
    .sort((a, b) => {
        const na = parseInt(a.match(/\d+/)[0]);
        const nb = parseInt(b.match(/\d+/)[0]);
        return na - nb;
    });

console.log(`\n🏀 schema-guard-all-rp.test.js\n`);
console.log(`Discovered ${rpFiles.length} RP files: ${rpFiles.join(', ')}\n`);
console.log('='.repeat(60));

// ============================================================
// Per-file checks
// ============================================================
for (const filename of rpFiles) {
    const filePath = path.join(DATA_DIR, filename);
    const label = filename.replace('.json', '');

    console.log(`\n📄 ${filename}`);

    // Parse guard
    let data;
    test(`${label}: JSON parseable (no merge conflicts)`, () => {
        const raw = fs.readFileSync(filePath, 'utf-8');
        // Merge conflict markers cause JSON.parse to throw — caught here
        data = JSON.parse(raw);
    });
    if (!data) continue; // can't validate further if parse failed

    // Skip placeholder stubs (0 questions) — not yet authored by GR
    if (!Array.isArray(data.questions) || data.questions.length === 0) {
        console.log(`  ⚠️  ${label}: placeholder stub (0 questions) — skipping schema validation`);
        continue;
    }

    // Top-level
    suite(`${label}: top-level fields`, () => {
        test(`${label}: has exam_id`, () => assert(typeof data.exam_id === 'string' && data.exam_id.length > 0));
        test(`${label}: has title`, () => assert(typeof data.title === 'string' && data.title.length > 0));
        test(`${label}: has 15 questions`, () => assert(Array.isArray(data.questions) && data.questions.length === 15,
            `Expected 15, got ${Array.isArray(data.questions) ? data.questions.length : 'non-array'}`));
    });

    // Per-question checks
    suite(`${label}: question fields and input contracts`, () => {
        for (const q of data.questions) {
            // Required fields
            test(`${label} Q${q.number}: has all required fields`, () => {
                for (const field of REQUIRED_Q_FIELDS) {
                    assert(q[field] !== undefined, `Missing: ${field}`);
                }
            });

            // Hint length (E-5)
            test(`${label} Q${q.number}: hint <= ${HINT_MAX} chars`, () => {
                const len = typeof q.hint === 'string' ? q.hint.length : -1;
                assert(len <= HINT_MAX, `Hint is ${len} chars (max ${HINT_MAX})`);
            });

            // Solution steps
            test(`${label} Q${q.number}: solution_steps non-empty array`, () => {
                assert(Array.isArray(q.solution_steps) && q.solution_steps.length >= 1, 'Need 1+ steps');
            });

            // Input validation
            test(`${label} Q${q.number}: inputs is non-empty array`, () => {
                assert(Array.isArray(q.inputs) && q.inputs.length > 0);
            });

            for (const inp of (q.inputs || [])) {
                const iid = `${label} Q${q.number} inp[${inp.id || '?'}]`;

                test(`${iid}: valid type`, () => {
                    assert(VALID_INPUT_TYPES.includes(inp.type), `Unknown type: "${inp.type}"`);
                });

                // Answer required for graded types (text without answer is intentional per GA)
                if (inp.type !== 'text') {
                    test(`${iid}: has answer`, () => {
                        assert(inp.answer !== undefined, `type=${inp.type} must have answer (grader will mark wrong without it)`);
                    });
                }

                // number: answer is numeric + has tolerance
                if (inp.type === 'number') {
                    test(`${iid}: answer is number`, () => {
                        assert(typeof inp.answer === 'number', `Expected number, got ${typeof inp.answer}`);
                    });
                    test(`${iid}: has positive tolerance`, () => {
                        assert(typeof inp.tolerance === 'number' && inp.tolerance > 0,
                            `tolerance=${inp.tolerance} (must be positive number)`);
                    });
                }

                // dropdown: answer in options list
                if (inp.type === 'dropdown') {
                    test(`${iid}: answer in options`, () => {
                        assert(Array.isArray(inp.options) && inp.options.includes(inp.answer),
                            `Answer "${inp.answer}" not in options [${(inp.options || []).join(', ')}]`);
                    });
                }

                // radio: answer in option values
                if (inp.type === 'radio') {
                    test(`${iid}: answer in option values`, () => {
                        const vals = (inp.options || []).map(o => o.value !== undefined ? o.value : o);
                        assert(vals.includes(inp.answer),
                            `Answer "${inp.answer}" not in option values [${vals.join(', ')}]`);
                    });
                }
            }
        }
    });

    // Plus/minus questions
    suite(`${label}: plus_minus questions`, () => {
        const pmQs = data.questions.filter(q => q.plus_minus === true);
        if (pmQs.length === 0) {
            // plus_minus is optional — later RPs use different question types
            test(`${label}: plus_minus count`, () => {
                console.log(`     (no plus_minus questions in ${label} — OK for RP6+)`);
                assert(true);
            });
            return;
        }
        test(`${label}: has ${pmQs.length} plus_minus question(s)`, () => assert(pmQs.length > 0));
        for (const q of pmQs) {
            test(`${label} Q${q.number} plus_minus: exactly 2 number inputs`, () => {
                const nums = q.inputs.filter(i => i.type === 'number');
                assert(nums.length === 2, `Expected 2, got ${nums.length}`);
            });
            test(`${label} Q${q.number} plus_minus: answers are distinct`, () => {
                const nums = q.inputs.filter(i => i.type === 'number');
                if (nums.length === 2) {
                    assert(nums[0].answer !== nums[1].answer,
                        `Both answers equal ${nums[0].answer} — should differ for ± display`);
                }
            });
        }
    });
}

// ============================================================
// Summary
// ============================================================
console.log('\n' + '='.repeat(60));
const total = totalPass + totalFail;
console.log(`RESULTS: ${totalPass}/${total} passed, ${totalFail} failed`);
if (totalFail === 0) {
    console.log('✅ All RP files pass schema contract');
} else {
    console.log(`❌ ${totalFail} failure(s) — review above for details`);
}
console.log('='.repeat(60));

process.exit(totalFail > 0 ? 1 : 0);
