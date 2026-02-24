// rp-question-html-no-script test
// No question_html in any RP exam should contain <script> tags
// Script injection in question HTML is a security risk and breaks the DOM

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-question-html-no-script.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [], totalQ = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        totalQ++;
        var html = q.question_html || '';
        if (/<script/i.test(html)) {
            violations.push('rp' + i + ' ' + q.id + ': contains <script>');
        }
        // Also check solution steps and feedback
        (q.solution_steps || []).forEach(function(step) {
            if (/<script/i.test(step)) {
                violations.push('rp' + i + ' ' + q.id + ' step: contains <script>');
            }
        });
    });
}

console.log('\u2500\u2500 Script injection checks \u2500\u2500\n');
if (violations.length) violations.forEach(function(v) { console.log('  ! ' + v); });

test('Questions checked: ' + totalQ, totalQ >= 165);
test('No <script> tags in question content', violations.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-question-html-no-script: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
