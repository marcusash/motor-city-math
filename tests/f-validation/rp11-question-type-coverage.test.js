// RP11 question type coverage test
// Verifies RP11 has diverse question types covering the W2 curriculum

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp11-question-type-coverage.test.js\n');

const data = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/retake-practice-11.json'), 'utf-8'));
const questions = data.questions || [];

// Tally types
var typeCounts = {};
questions.forEach(function(q) {
    var t = q.type || 'unknown';
    typeCounts[t] = (typeCounts[t] || 0) + 1;
});

console.log('\u2500\u2500 Question type distribution \u2500\u2500');
Object.keys(typeCounts).sort().forEach(function(t) {
    console.log('  ' + t + ': ' + typeCounts[t]);
});
var uniqueTypes = Object.keys(typeCounts);
console.log('\n  Total unique types: ' + uniqueTypes.length + '\n');

// 1. At least 5 distinct question types (W2 curriculum breadth)
test('At least 5 distinct question types', uniqueTypes.length >= 5);

// 2. Core algebra types present
var coreTypes = ['quadratic', 'exponential', 'radical', 'rational', 'absolute-value'];
coreTypes.forEach(function(t) {
    test('Core type present: ' + t, !!typeCounts[t]);
});

// 3. At least one graph or write-equation question
test('At least one graph or write-equation question',
    !!typeCounts['graph'] || !!typeCounts['write-equation']);

// 4. No single type dominates (max 4 questions per type — prevents repetition fatigue)
var dominated = Object.keys(typeCounts).filter(function(t) { return typeCounts[t] > 4; });
test('No question type has more than 4 questions', dominated.length === 0);
if (dominated.length > 0) {
    dominated.forEach(function(t) { console.log('  WARN: ' + t + ' has ' + typeCounts[t] + ' questions'); });
}

// 5. Total question count is 15
test('RP11 has exactly 15 questions', questions.length === 15);

// 6. Every question has a type field
var missingType = questions.filter(function(q) { return !q.type; });
test('Every question has a type field', missingType.length === 0);
if (missingType.length > 0) {
    missingType.forEach(function(q) { console.log('  WARN: Question ' + q.id + ' missing type field'); });
}

console.log('\n' + '='.repeat(50));
console.log('rp11-question-type-coverage: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
