// RP11 question standard field audit
// All questions must have a standard field in the W2/W3 set

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp11-question-standards.test.js\n');

const data = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/retake-practice-11.json'), 'utf-8'));
const questions = data.questions || [];

// Expected standards for W2/W3 curriculum
var validStandards = ['W2.a','W2.b','W2.c','W2.d','W2.e','W3.a','W3.b','W3.c','W3.d','W3.e'];

var missing = questions.filter(function(q) { return !q.standard; });
var invalid = questions.filter(function(q) { return q.standard && !validStandards.includes(q.standard); });

// Distribution
var dist = {};
questions.forEach(function(q) { var s = q.standard || 'NONE'; dist[s] = (dist[s] || 0) + 1; });

console.log('\u2500\u2500 Standards distribution \u2500\u2500');
Object.keys(dist).sort().forEach(function(s) {
    console.log('  ' + s + ': ' + dist[s]);
});
console.log();

test('All questions have standard field', missing.length === 0);
if (missing.length) console.log('  Missing: ' + missing.map(function(q){return q.id;}).join(', '));

test('All standards are valid W2/W3 codes', invalid.length === 0);
if (invalid.length) console.log('  Invalid: ' + invalid.map(function(q){return q.id+':'+q.standard;}).join(', '));

// Coverage: at least 2 W2 and 2 W3 standards represented
var w2Count = Object.keys(dist).filter(function(s) { return s.startsWith('W2'); }).length;
var w3Count = Object.keys(dist).filter(function(s) { return s.startsWith('W3'); }).length;
test('At least 2 W2.x standards covered', w2Count >= 2);
test('At least 2 W3.x standards covered', w3Count >= 2);
console.log('  (W2 standards: ' + w2Count + ', W3 standards: ' + w3Count + ')');

// W2.b present (Kai\'s known weakness)
test('W2.b (Kai weakness) present in RP11', !!dist['W2.b']);

// No single standard dominates (max 4 per standard)
var dominated = Object.keys(dist).filter(function(s) { return dist[s] > 4; });
test('No standard appears more than 4 times', dominated.length === 0);

// Total question count matches
test('RP11 has 15 questions', questions.length === 15);

console.log('\n' + '='.repeat(50));
console.log('rp11-question-standards: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
