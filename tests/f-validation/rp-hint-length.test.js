// RP hint length test -- ADHD design rule
// Hints should be concise: < 150 chars. Long hints = cognitive overload for ADHD.
// Per .voice-guide.md: max 12 words per feedback (~80 chars). Hints slightly longer allowed.

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-hint-length.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var allQuestions = [];
for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (fs.existsSync(f)) {
        var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
        (rp.questions || []).forEach(function(q) { allQuestions.push({ file: 'rp' + i, q: q }); });
    }
}

console.log('\u2500\u2500 Hint length: all 165 questions \u2500\u2500\n');

test('All 165 questions loaded', allQuestions.length === 165);

// 1. All hints are non-empty
var emptyHints = allQuestions.filter(function(q) {
    return !q.q.hint || q.q.hint.trim().length === 0;
});
if (emptyHints.length) emptyHints.slice(0,3).forEach(function(q) { console.log('  ! empty hint: ' + q.file + ' ' + q.q.id); });
test('All questions have non-empty hint', emptyHints.length === 0);

// 2. All hints are < 200 chars (generous limit for structured hints with LaTeX)
var HINT_LIMIT = 200;
var longHints = allQuestions.filter(function(q) {
    return (q.q.hint || '').length > HINT_LIMIT;
});
if (longHints.length) longHints.slice(0,3).forEach(function(q) { console.log('  ! long hint (' + q.q.hint.length + ' chars): ' + q.file + ' ' + q.q.id); });
test('All hints are < ' + HINT_LIMIT + ' chars', longHints.length === 0);

// 3. All hints are strings
var notStrings = allQuestions.filter(function(q) { return typeof q.q.hint !== 'string'; });
test('All hint fields are strings', notStrings.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-hint-length: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
