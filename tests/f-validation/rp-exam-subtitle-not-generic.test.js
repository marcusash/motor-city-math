// rp-exam-subtitle-not-generic test
// Subtitles should be specific to the exam content, not generic fallbacks
// "Practice Exam" or "Retake Practice" alone is too generic

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-exam-subtitle-not-generic.test.js\n');

var GENERIC = ['practice exam', 'retake practice', 'practice test', 'exam practice'];

var dataDir = path.join(__dirname, '../../data');
var violations = [];

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    var sub = (rp.subtitle || '').toLowerCase().trim();
    if (sub.length < 5) {
        violations.push('retake-practice-' + i + ': subtitle too short: "' + rp.subtitle + '"');
    } else if (GENERIC.indexOf(sub) !== -1) {
        violations.push('retake-practice-' + i + ': subtitle is generic: "' + rp.subtitle + '"');
    }
}

console.log('\u2500\u2500 Subtitle specificity checks \u2500\u2500\n');
if (violations.length) violations.forEach(function(v) { console.log('  ! ' + v); });

test('All exam subtitles are specific (not generic) (' + violations.length + ' violations)', violations.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-exam-subtitle-not-generic: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
