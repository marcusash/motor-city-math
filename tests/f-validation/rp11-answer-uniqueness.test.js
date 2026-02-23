// RP11 question uniqueness check
// Verifies answers within RP11 are sufficiently unique to prevent Kai memorizing patterns

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp11-answer-uniqueness.test.js\n');

const rp11Path = path.join(__dirname, '../../data/retake-practice-11.json');

// File must exist
test('RP11 data file exists', fs.existsSync(rp11Path));

const data = JSON.parse(fs.readFileSync(rp11Path, 'utf-8'));
const questions = data.questions || [];

test('RP11 has at least 10 questions', questions.length >= 10);
console.log('  (RP11 has ' + questions.length + ' questions)');

// Collect all numeric answers
var allAnswers = [];
questions.forEach(function(q) {
    (q.inputs || []).forEach(function(inp) {
        if (inp.answer !== undefined && inp.answer !== null) {
            allAnswers.push({ qid: q.id, iid: inp.id || '?', val: String(inp.answer) });
        }
    });
});

test('RP11 has answers to check', allAnswers.length > 0);
console.log('  (' + allAnswers.length + ' answer values found)');

// Count frequencies
var freq = {};
allAnswers.forEach(function(a) {
    if (!freq[a.val]) freq[a.val] = [];
    freq[a.val].push(a.qid + ':' + a.iid);
});

// Answers appearing 3+ times are a concern (2 occurrences is OK — e.g., same slope appears in different contexts)
var hot = Object.keys(freq).filter(function(k) { return freq[k].length >= 3; });

console.log('\n\u2500\u2500 Answer frequency analysis \u2500\u2500');
hot.forEach(function(k) {
    console.log('  WARN: answer "' + k + '" appears ' + freq[k].length + 'x (' + freq[k].join(', ') + ')');
});
if (hot.length === 0) console.log('  No answers appear 3+ times. Good.');

test('No single answer appears 3+ times across RP11', hot.length === 0);

// No two consecutive questions share the same answer for their first input
var consecutiveDups = [];
for (var i = 0; i < questions.length - 1; i++) {
    var a1 = (questions[i].inputs || [])[0];
    var a2 = (questions[i+1].inputs || [])[0];
    if (a1 && a2 && a1.answer !== undefined && String(a1.answer) === String(a2.answer)) {
        consecutiveDups.push('Q' + (i+1) + '/Q' + (i+2) + ' both start with ' + a1.answer);
    }
}
if (consecutiveDups.length) {
    consecutiveDups.forEach(function(d) { console.log('  WARN: ' + d); });
}
test('No consecutive questions share same first-input answer', consecutiveDups.length === 0);

// Version check
test('RP11 version is "2.0" (string)', data.version === '2.0');

// ID check — RP11 uses title-based identification (id field may be absent in data files)
var manifest = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/manifest.json'), 'utf-8'));
var mEntry = manifest.exams.find(function(e) { return e.id === 'retake-practice-11'; });
test('RP11 exists in manifest.json as retake-practice-11', !!mEntry);

console.log('\n' + '='.repeat(50));
console.log('rp11-answer-uniqueness: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
