// All RP exam questions have non-empty hint field test
// Prevents blank hint reveal (bad UX for Kai when he asks for help)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} data-all-questions-have-hint.test.js\n');

const dataDir = path.join(__dirname, '../../data');
const examFiles = fs.readdirSync(dataDir).filter(function(f) {
    return f.match(/retake-practice-\d+\.json/);
}).sort();

console.log('\u2500\u2500 Scanning ' + examFiles.length + ' exam files \u2500\u2500\n');

var totalQuestions = 0;
var missingHint = [];

examFiles.forEach(function(file) {
    var data = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf-8'));
    var questions = data.questions || [];
    var missing = questions.filter(function(q) { return !q.hint || !q.hint.trim(); });

    totalQuestions += questions.length;
    if (missing.length > 0) {
        missing.forEach(function(q) { missingHint.push(file + ':' + q.id); });
    }
    console.log('  ' + file.padEnd(32) + questions.length + ' Qs, ' + missing.length + ' missing hint');
});

console.log('\n  Total: ' + totalQuestions + ' questions across ' + examFiles.length + ' exams');

test('Total question count > 100 (all exams present)', totalQuestions > 100);
test('All questions have non-empty hint field', missingHint.length === 0);
if (missingHint.length > 0) {
    console.log('\n  Missing hint:');
    missingHint.forEach(function(id) { console.log('    ' + id); });
}

// Hint length sanity check: not too short (<5 chars) or too long (>500 chars)
var hintLengths = [];
examFiles.forEach(function(file) {
    var data = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf-8'));
    (data.questions || []).forEach(function(q) {
        if (q.hint) hintLengths.push({ qid: q.id, len: q.hint.length });
    });
});

var tooShort = hintLengths.filter(function(h) { return h.len < 5; });
var tooLong = hintLengths.filter(function(h) { return h.len > 500; });

test('No hints under 5 characters (must be meaningful)', tooShort.length === 0);
test('No hints over 500 characters (ADHD: keep brief)', tooLong.length === 0);
if (tooLong.length > 0) {
    console.log('  Too long: ' + tooLong.map(function(h) { return h.qid + '(' + h.len + ')'; }).join(', '));
}

console.log('\n' + '='.repeat(50));
console.log('data-all-questions-have-hint: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
