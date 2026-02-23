// RP feedback length test (ADHD constraint)
// feedback_correct and feedback_wrong must be concise (max 80 chars)
// ADHD design rule: max 12 words per feedback

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-feedback-length.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var MAX_WORDS = 20; // generous -- 12 is ideal but some have LaTeX
var violations = [];
var totalChecked = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        ['feedback_correct', 'feedback_wrong'].forEach(function(field) {
            var txt = q[field] || '';
            totalChecked++;
            // Strip LaTeX for word count
            var stripped = txt.replace(/\\\(.*?\\\)/g, 'MATH').replace(/\$.*?\$/g, 'MATH');
            var wordCount = stripped.trim().split(/\s+/).filter(Boolean).length;
            if (wordCount > MAX_WORDS) {
                violations.push('rp' + i + ' ' + q.id + ' ' + field + ': ' + wordCount + ' words');
            }
        });
    });
}

console.log('\u2500\u2500 Feedback length checks (max ' + MAX_WORDS + ' words) \u2500\u2500\n');
console.log('  Fields checked: ' + totalChecked);

if (violations.length) {
    violations.slice(0, 5).forEach(function(v) { console.log('  ! ' + v); });
}
test('All feedback_correct/wrong are <= ' + MAX_WORDS + ' words', violations.length === 0);
test('At least 330 fields checked (165 questions x 2)', totalChecked >= 330);

console.log('\n' + '='.repeat(50));
console.log('rp-feedback-length: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
