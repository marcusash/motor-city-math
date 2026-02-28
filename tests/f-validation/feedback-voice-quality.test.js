// Error voice copy quality test
// GD spec: feedback_wrong text must not be generic ("Wrong", "Invalid", "Try again")
// Must be specific and constructive. Check all 165 RP questions.

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} feedback-voice-quality.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var questions = [];
for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (fs.existsSync(f)) {
        var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
        (rp.questions || []).forEach(function(q) { questions.push({ file: 'rp' + i, q: q }); });
    }
}

console.log('\u2500\u2500 Voice quality: 165 questions \u2500\u2500\n');

test('All 165 questions loaded', questions.length === 165);

// 1. No feedback_wrong that is purely generic
var GENERIC = ['Wrong.', 'Incorrect.', 'Invalid.', 'Try again.', 'That is wrong.', 'Not right.'];
var hasGenericWrong = questions.filter(function(q) {
    var fw = q.q.feedback_wrong || '';
    return GENERIC.some(function(g) { return fw.trim() === g; });
});
if (hasGenericWrong.length > 0) hasGenericWrong.slice(0,3).forEach(function(q) { console.log('  ! ' + q.file + ' ' + q.q.id + ': "' + q.q.feedback_wrong + '"'); });
test('No feedback_wrong is a single generic phrase', hasGenericWrong.length === 0);

// 2. No feedback_wrong shorter than 10 chars
var tooShort = questions.filter(function(q) {
    return (q.q.feedback_wrong || '').trim().length < 10;
});
if (tooShort.length > 0) tooShort.slice(0,3).forEach(function(q) { console.log('  ! too short: ' + q.file + ' ' + q.q.id + ': "' + q.q.feedback_wrong + '"'); });
test('All feedback_wrong strings are at least 10 chars', tooShort.length === 0);

// 3. No feedback_correct that starts with "W{N}." (teaching note, not celebration)
var teachingNotes = questions.filter(function(q) {
    return /^W\d+\./.test((q.q.feedback_correct || '').trim());
});
if (teachingNotes.length > 0) teachingNotes.slice(0,3).forEach(function(q) { console.log('  ! teaching note as feedback_correct: ' + q.file + ' ' + q.q.id + ': "' + q.q.feedback_correct + '"'); });
test('No feedback_correct starts with W{N}. (not a teaching note)', teachingNotes.length === 0);

// 4. All feedback_correct and feedback_wrong are strings
var missingFeedback = questions.filter(function(q) {
    return typeof q.q.feedback_correct !== 'string' || typeof q.q.feedback_wrong !== 'string';
});
test('All questions have string feedback_correct and feedback_wrong', missingFeedback.length === 0);

console.log('\n' + '='.repeat(50));
console.log('feedback-voice-quality: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
