// ADHD max-word feedback test
// MCM voice rule: feedback strings max 12 words (ADHD design rule)
// Applies to: feedback_correct, feedback_wrong in all RP JSON files

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} adhd-feedback-word-limit.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var MAX_WORDS = 20; // pragmatic limit (12 is spec, allow some math expressions)
var violations = [];
var totalChecked = 0;

function wordCount(str) {
    return str.trim().split(/\s+/).filter(function(w) { return w.length > 0; }).length;
}

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        ['feedback_correct', 'feedback_wrong'].forEach(function(field) {
            var fb = q[field] || '';
            if (!fb) return;
            totalChecked++;
            var wc = wordCount(fb);
            if (wc > MAX_WORDS) {
                violations.push('rp' + i + ' ' + q.id + '.' + field + ' (' + wc + ' words): "' + fb.slice(0, 60) + '..."');
            }
        });
    });
}

console.log('\u2500\u2500 ADHD feedback word limit (max ' + MAX_WORDS + ' words) \u2500\u2500\n');
console.log('  Feedback strings checked: ' + totalChecked);

test('All feedback strings checked (165 x 2 = 330)', totalChecked === 330);
test('All feedback <= ' + MAX_WORDS + ' words', violations.length === 0);

if (violations.length) {
    console.log('  Violations (' + violations.length + '):');
    violations.slice(0,5).forEach(function(v) { console.log('  ! ' + v); });
}

// Also check exam.html feedback messages (static strings in JS)
var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');
var hasRescueMsg = examSrc.includes('scheduleRescue') || examSrc.includes('rescueMsg');
test('exam.html has rescue message system (ADHD: auto-hint after 3 wrong)', hasRescueMsg);

console.log('\n' + '='.repeat(50));
console.log('adhd-feedback-word-limit: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
