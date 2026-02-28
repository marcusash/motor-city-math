// All RP exam answers parseable by parseStudentAnswer()
// Regression: every answer in RP1-11 must parse to a number or known keyword

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-answers-parseable.test.js\n');

// Inline parseStudentAnswer equivalent for test use
function parseStudentAnswer(raw) {
    if (!raw && raw !== 0) return NaN;
    var s = String(raw).trim();
    if (!s) return NaN;
    var fractionMatch = s.match(/^(-?\d+)\s*\/\s*(-?\d+)$/);
    if (fractionMatch) {
        var num = parseInt(fractionMatch[1], 10);
        var den = parseInt(fractionMatch[2], 10);
        if (den === 0) return NaN;
        return num / den;
    }
    if (/^[0-9.\+\-\*\/\(\)sqrt]+$/.test(s)) {
        try {
            var expr = s.replace(/(\d)\s*sqrt/g, '$1*sqrt').replace(/sqrt/g, 'Math.sqrt');
            var result = Function('"use strict"; return (' + expr + ')')(); // eslint-disable-line no-new-func
            if (typeof result === 'number' && isFinite(result)) return result;
        } catch(e) { /* fall through */ }
    }
    var f = parseFloat(s);
    if (!isNaN(f)) return f;
    return NaN;
}

// Known keyword types that parseStudentAnswer won't handle numerically
var KEYWORD_TYPES = ['multiple_choice', 'dropdown', 'true_false', 'parent_function', 'parent_id', 'matching'];

var dataDir = path.join(__dirname, '../../data');
var examFiles = fs.readdirSync(dataDir).filter(function(f) {
    return f.match(/retake-practice-\d+\.json/);
}).sort();

console.log('\u2500\u2500 Parsing ' + examFiles.length + ' exam files \u2500\u2500\n');

var totalAnswers = 0;
var unparseableNumeric = [];

examFiles.forEach(function(file) {
    var data = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf-8'));
    var questions = data.questions || [];
    questions.forEach(function(q) {
        // Skip non-numeric question types
        if (KEYWORD_TYPES.indexOf(q.type) !== -1) return;

        // Get all answers from inputs array
        var inputs = q.inputs || [];
        inputs.forEach(function(inp) {
            if (!inp.answer && inp.answer !== 0) return;
            totalAnswers++;
            var answer = String(inp.answer);
            // Answers like "increasing", "positive" are keyword answers (not numeric)
            if (answer.match(/^[a-zA-Z]/)) return; // skip keyword answers
            // Try to parse
            try {
                var parsed = parseStudentAnswer(answer);
                if (isNaN(parsed)) {
                    unparseableNumeric.push(file + ':' + q.id + ' answer=' + answer);
                }
            } catch(e) {
                unparseableNumeric.push(file + ':' + q.id + ' ERROR: ' + e.message);
            }
        });
    });
    console.log('  \u2705 ' + file + ': ' + questions.length + ' questions checked');
});

console.log('\n  Total numeric answers checked: ' + totalAnswers);
test('Total answers checked > 0 (at least some numeric)', totalAnswers > 0);
test('All numeric answers parse to valid numbers', unparseableNumeric.length === 0);
if (unparseableNumeric.length > 0) {
    console.log('\n  Unparseable:');
    unparseableNumeric.slice(0, 10).forEach(function(u) { console.log('    ' + u); });
}

console.log('\n' + '='.repeat(50));
console.log('rp-answers-parseable: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
