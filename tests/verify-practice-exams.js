#!/usr/bin/env node
/**
 * Verify all retake practice exam JSON files.
 * Checks: math accuracy (graph key_points), schema completeness,
 * answer uniqueness within each exam, section distribution.
 *
 * Usage: node tests/verify-practice-exams.js
 * Or:    node tests/verify-practice-exams.js retake-practice-3.json
 */
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const REQUIRED_FIELDS = ['id', 'number', 'section', 'standard', 'type', 'question_html', 'inputs', 'hint', 'solution_steps'];
const REQUIRED_INPUT_FIELDS = { dropdown: ['id', 'type', 'answer', 'options'], number: ['id', 'type', 'answer'], radio: ['id', 'type', 'answer', 'options'] };
const REQUIRED_GRAPH_FIELDS = ['canvas_id', 'function', 'function_display', 'key_points', 'min_points', 'tolerance'];
const EXPECTED_SECTIONS = { A: 3, B: 8, C: 2, D: 2 };

let totalPass = 0, totalFail = 0, totalExams = 0;

function verifyExam(filename) {
    const filepath = path.join(DATA_DIR, filename);
    if (!fs.existsSync(filepath)) { console.log('  NOT FOUND: ' + filepath); return; }

    const data = JSON.parse(fs.readFileSync(filepath, 'utf8'));
    let pass = 0, fail = 0;
    const issues = [];

    function check(label, condition) {
        if (condition) { pass++; } else { fail++; issues.push(label); }
    }

    // Top-level
    check('has exam_id', !!data.exam_id);
    check('has title', !!data.title);
    check('has questions array', Array.isArray(data.questions));
    check('has 15 questions', data.questions.length === 15);
    check('has time_minutes', typeof data.time_minutes === 'number');

    // Section distribution
    const sections = {};
    data.questions.forEach(q => { sections[q.section] = (sections[q.section] || 0) + 1; });
    Object.entries(EXPECTED_SECTIONS).forEach(([s, count]) => {
        check('section ' + s + ' has ' + count + ' questions', sections[s] === count);
    });

    // Per-question checks
    data.questions.forEach((q, i) => {
        const qLabel = 'Q' + (i + 1);

        // Required fields
        REQUIRED_FIELDS.forEach(f => {
            check(qLabel + ' has ' + f, q[f] !== undefined && q[f] !== null);
        });

        // Input-level checks
        if (q.inputs) {
            q.inputs.forEach((inp, j) => {
                const iLabel = qLabel + ' input[' + j + ']';
                check(iLabel + ' has id', !!inp.id);
                check(iLabel + ' has type', !!inp.type);

                if (inp.type === 'number') {
                    check(iLabel + ' has answer', inp.answer !== undefined);
                    check(iLabel + ' has tolerance', inp.tolerance !== undefined);
                }
                if (inp.type === 'dropdown') {
                    check(iLabel + ' has answer', !!inp.answer);
                    check(iLabel + ' has options', Array.isArray(inp.options));
                }
                if (inp.type === 'radio') {
                    check(iLabel + ' has answer', !!inp.answer);
                    check(iLabel + ' has options', Array.isArray(inp.options));
                }
            });
        }

        // Graph key_point verification
        if (q.graph) {
            REQUIRED_GRAPH_FIELDS.forEach(f => {
                check(qLabel + ' graph has ' + f, q.graph[f] !== undefined && q.graph[f] !== null);
            });

            let func;
            try {
                func = new Function('x', 'return ' + q.graph.function);
                check(qLabel + ' graph function parses', true);
            } catch (e) {
                check(qLabel + ' graph function parses', false);
            }

            if (func && q.graph.key_points) {
                const tol = q.graph.tolerance || 0.25;
                q.graph.key_points.forEach(([x, y]) => {
                    const result = func(x);
                    check(qLabel + ' f(' + x + ')=' + y, Math.abs(result - y) <= tol);
                });
            }

            // Asymptote structure
            if (q.graph.asymptotes) {
                if (q.graph.asymptotes.vertical) {
                    check(qLabel + ' VA is array', Array.isArray(q.graph.asymptotes.vertical));
                }
                if (q.graph.asymptotes.horizontal) {
                    check(qLabel + ' HA is array', Array.isArray(q.graph.asymptotes.horizontal));
                }
            }
        }

        // Feedback fields
        check(qLabel + ' has feedback_correct or feedback_wrong',
            !!q.feedback_correct || !!q.feedback_wrong || !!q.feedback_wrong_parent);
    });

    // Answer uniqueness (single-value solve questions)
    const singleAnswers = [];
    data.questions.forEach(q => {
        if (!q.plus_minus && !q.graph && q.inputs) {
            q.inputs.forEach(inp => {
                if (inp.type === 'number') {
                    singleAnswers.push({ q: q.number, answer: inp.answer });
                }
            });
        }
    });
    for (let i = 0; i < singleAnswers.length; i++) {
        for (let j = i + 1; j < singleAnswers.length; j++) {
            if (Math.abs(singleAnswers[i].answer - singleAnswers[j].answer) < 0.01) {
                check('Q' + singleAnswers[i].q + ' and Q' + singleAnswers[j].q + ' have unique answers', false);
            }
        }
    }

    totalExams++;
    totalPass += pass;
    totalFail += fail;

    const status = fail === 0 ? '✅' : '🔴';
    console.log(status + ' ' + filename + ': ' + pass + '/' + (pass + fail) + ' checks');
    if (issues.length > 0) {
        issues.forEach(i => console.log('   FAIL: ' + i));
    }
}

// Main
const specific = process.argv[2];
if (specific) {
    verifyExam(specific);
} else {
    const files = fs.readdirSync(DATA_DIR).filter(f => f.startsWith('retake-practice-') && f.endsWith('.json')).sort();
    console.log('Verifying ' + files.length + ' practice exams...\n');
    files.forEach(verifyExam);
}

console.log('\n' + '='.repeat(50));
console.log('TOTAL: ' + totalPass + '/' + (totalPass + totalFail) + ' checks across ' + totalExams + ' exams');
console.log(totalFail === 0 ? '✅ ALL VERIFIED' : '🔴 ' + totalFail + ' FAILURES');
process.exit(totalFail > 0 ? 1 : 0);
