// exam-section-headers test
// exam.html must use section data from JSON questions for score tracking
// Sections A-D are tracked in attempt.sections for per-section scoring

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-section-headers.test.js\n');

var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 Section tracking checks \u2500\u2500\n');

// 1. Section logic exists -- reads q.section from JSON
var usesSectionField = examSrc.includes('q.section') || examSrc.includes('question.section');
test('exam.html reads q.section from JSON', usesSectionField);

// 2. attempt.sections tracking (per-section score breakdown)
var hasAttemptSections = examSrc.includes('attempt.sections') || examSrc.includes('sections[sec]') ||
                         examSrc.includes('attempt[') && examSrc.includes('section');
test('Per-section score tracking in attempt object', hasAttemptSections);

// 3. Section used in scorecard display
var hasSectionScorecard = examSrc.includes('.sections') || examSrc.includes('sec-score') ||
                          examSrc.includes('std-card') || examSrc.includes('standard') && examSrc.includes('section');
test('Scorecard displays section/standard data', hasSectionScorecard);

console.log('\n' + '='.repeat(50));
console.log('exam-section-headers: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
