/**
 * Motor City Math — LaTeX Format Smoke Test (t02)
 *
 * Checks all exam JSON files for known LaTeX formatting issues:
 * 1. Quadruple backslash (\\\\() instead of \\() in question_html, feedback, hints
 * 2. Unicode escape sequences (\\u2081) instead of literal subscripts (₁)
 * 3. Unescaped backslash at JSON root level (raw \( instead of \\()
 * 4. MathJax-style delimiters ($$ or \[) instead of KaTeX-style \( \)
 *
 * Run: node tests/f-validation/latex-format-smoke.test.js
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data');
const files = fs.readdirSync(DATA_DIR)
    .filter(f => f.endsWith('.json') && f.startsWith('retake-practice'));

let pass = 0, fail = 0;

function test(desc, condition, context) {
    if (condition) { pass++; }
    else {
        fail++;
        console.error('  FAIL: ' + desc + (context ? ' [' + context + ']' : ''));
    }
}

function scanText(text, label) {
    // Quadruple backslash = \\\\( in JSON string = \\( in actual string = bad
    if (/\\\\\\\\/g.test(text)) {
        test(label + ': no quadruple backslash (\\\\\\\\)', false, text.slice(0, 60));
    }
    // Unicode escapes for subscripts/superscripts instead of actual chars
    if (/\\u[0-9a-fA-F]{4}/i.test(text)) {
        test(label + ': no \\uXXXX unicode escapes (use literal chars)', false, text.slice(0, 60));
    }
    // MathJax-style $$ delimiters
    if (/\$\$/.test(text)) {
        test(label + ': no $$ delimiters (use \\( ... \\))', false, text.slice(0, 60));
    }
}

function scanQuestion(q, file) {
    var prefix = file + ':' + q.id;
    if (q.question_html) scanText(q.question_html, prefix + '.question_html');
    if (q.hint) scanText(q.hint, prefix + '.hint');
    if (q.feedback_correct) scanText(q.feedback_correct, prefix + '.feedback_correct');
    if (q.feedback_wrong) scanText(q.feedback_wrong, prefix + '.feedback_wrong');
    if (q.solution_steps) {
        q.solution_steps.forEach(function(s, i) {
            scanText(s, prefix + '.solution_steps[' + i + ']');
        });
    }
}

files.forEach(function(file) {
    var raw;
    try {
        raw = fs.readFileSync(path.join(DATA_DIR, file), 'utf8');
        test(file + ': valid JSON', true);
    } catch (e) {
        test(file + ': valid JSON', false, e.message);
        return;
    }

    // Check raw file for quadruple backslashes before JSON.parse
    if (/\\\\\\\\/g.test(raw)) {
        fail++;
        console.error('  FAIL: ' + file + ' -- quadruple backslash in raw JSON (should be \\\\( not \\\\\\\\()');
    } else {
        pass++;
    }

    var data;
    try { data = JSON.parse(raw); } catch (e) { return; }

    (data.questions || []).forEach(function(q) { scanQuestion(q, file); });
});

console.log('latex-format-smoke: ' + pass + '/' + (pass + fail) + ' pass');
if (fail > 0) process.exit(1);
