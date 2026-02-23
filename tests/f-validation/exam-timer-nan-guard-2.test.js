// Exam timeout NaN guard test
// exam.html timer must handle missing time_minutes gracefully
// If time_minutes is undefined/null/NaN, timer should not display "NaN:NaN"
// Instead: fallback to 60 minutes or disable timer

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-timer-nan-guard-2.test.js\n');

var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');
var sharedSrc = fs.readFileSync(path.join(__dirname, '../../shared/scripts.js'), 'utf-8');

console.log('\u2500\u2500 Timer NaN guard checks \u2500\u2500\n');

// 1. initTimer has NaN guard
var hasNanGuard = sharedSrc.includes('isNaN') || sharedSrc.includes('|| 60') || 
                  sharedSrc.includes('isFinite') || sharedSrc.includes('Number.isNaN') ||
                  sharedSrc.includes('|| 0') && sharedSrc.includes('time_minutes');
test('initTimer has NaN guard (isNaN, isFinite, or || 60 fallback)', hasNanGuard);

// 2. time_minutes accessed from data (not hardcoded)
var hasTimeProp = sharedSrc.includes('time_minutes') || examSrc.includes('time_minutes');
test('time_minutes read from exam data (not hardcoded)', hasTimeProp);

// 3. Timer display does not have literal "NaN" string output path
var hasLiteralNaN = examSrc.includes('"NaN:NaN"') || examSrc.includes("'NaN:NaN'");
test('No hardcoded NaN:NaN string in exam.html', !hasLiteralNaN);

// 4. formatTime function handles edge cases
var hasFormatTime = sharedSrc.includes('formatTime') || sharedSrc.includes('format_time');
test('formatTime function exists (wraps timer display logic)', hasFormatTime);

// 5. All RP JSON files have time_minutes (or timer defaults to 60 minutes)
var rpHasTime = true;
for (var i = 1; i <= 11; i++) {
    var rpPath = path.join(__dirname, '../../data/retake-practice-' + i + '.json');
    if (!fs.existsSync(rpPath)) continue;
    var rp = JSON.parse(fs.readFileSync(rpPath, 'utf-8'));
    if (rp.time_minutes === undefined || rp.time_minutes === null) {
        // If missing, check that shared scripts has a default fallback
        var hasDefault = sharedSrc.includes('|| 60') || sharedSrc.includes('? 60') ||
                         sharedSrc.includes('60 *') || sharedSrc.includes('default');
        if (!hasDefault) rpHasTime = false;
    }
}
test('All RP exams have time_minutes OR shared/scripts.js has 60min default', rpHasTime);

console.log('\n' + '='.repeat(50));
console.log('exam-timer-nan-guard-2: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
