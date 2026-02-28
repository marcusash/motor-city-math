// Hint message diversity test
// Verifies hint text across RP11 is varied — no repetitive opening words, MCM voice

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} hint-message-diversity.test.js\n');

const data = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/retake-practice-11.json'), 'utf-8'));
const questions = data.questions || [];

// Collect all hint text (hint field + first solution_step)
var hintTexts = [];
questions.forEach(function(q) {
    if (q.hint && typeof q.hint === 'string') hintTexts.push({ qid: q.id, text: q.hint, field: 'hint' });
    if (Array.isArray(q.solution_steps) && q.solution_steps.length > 0) {
        hintTexts.push({ qid: q.id, text: q.solution_steps[0], field: 'step[0]' });
    }
});

// Extract first word of each hint
function firstWord(text) {
    return text.replace(/<[^>]*>/g, '').trim().split(/\s+/)[0].toLowerCase().replace(/[^a-z]/g, '');
}

var firstWords = hintTexts.map(function(h) { return firstWord(h.text); });

// Count first word frequency
var wordFreq = {};
firstWords.forEach(function(w) { wordFreq[w] = (wordFreq[w] || 0) + 1; });

console.log('\u2500\u2500 First word frequency \u2500\u2500');
Object.keys(wordFreq).sort(function(a, b) { return wordFreq[b] - wordFreq[a]; }).forEach(function(w) {
    console.log('  "' + w + '": ' + wordFreq[w]);
});
console.log('  (total hints analyzed: ' + hintTexts.length + ')\n');

// 1. No single opening word appears more than half the time
var maxFreq = Math.max.apply(null, Object.values(wordFreq));
var totalHints = hintTexts.length;
test('No single opening word appears >50% of hints', maxFreq <= Math.ceil(totalHints / 2));
console.log('  (most common: ' + maxFreq + '/' + totalHints + ')');

// 2. At least 4 distinct opening words
test('At least 4 distinct opening words', Object.keys(wordFreq).length >= 4);

// 3. No em dashes in any hint text
var emDashHints = hintTexts.filter(function(h) {
    return h.text.includes('\u2014') || h.text.includes('\u2013');
});
test('No em dashes in hint text', emDashHints.length === 0);
if (emDashHints.length > 0) {
    emDashHints.forEach(function(h) { console.log('  WARN: ' + h.qid + ' [' + h.field + ']: ' + h.text.substring(0, 60)); });
}

// 4. All hints are non-empty
var emptyHints = hintTexts.filter(function(h) { return !h.text || h.text.trim().length === 0; });
test('All hint texts are non-empty', emptyHints.length === 0);

// 5. No consecutive questions start with same first word (in solution_steps)
var stepFirstWords = questions.map(function(q) {
    return (Array.isArray(q.solution_steps) && q.solution_steps[0]) ? firstWord(q.solution_steps[0]) : null;
});
var consecutiveDups = [];
for (var i = 1; i < stepFirstWords.length; i++) {
    if (stepFirstWords[i] && stepFirstWords[i] === stepFirstWords[i-1]) {
        consecutiveDups.push('Q' + i + '/Q' + (i+1) + ' both start with "' + stepFirstWords[i] + '"');
    }
}
if (consecutiveDups.length > 0) {
    consecutiveDups.forEach(function(d) { console.log('  WARN: ' + d); });
}
test('No consecutive questions share same step[0] first word', consecutiveDups.length === 0);

console.log('\n' + '='.repeat(50));
console.log('hint-message-diversity: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
