// rp-feedback-correct-no-emph test
// feedback_correct must use MCM coach voice -- no generic "Excellent!" or "Great job!"
// Praise should be specific to the math skill demonstrated

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-feedback-correct-no-emph.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var genericPraise = [], totalChecked = 0;

var GENERIC = [/^Excellent!$/i, /^Great job!$/i, /^Well done!$/i, /^Perfect!$/i, /^Correct!$/i];

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        if (q.feedback_correct) {
            totalChecked++;
            var fb = q.feedback_correct.trim();
            GENERIC.forEach(function(re) {
                if (re.test(fb)) {
                    genericPraise.push('rp' + i + ' ' + q.id + ': "' + fb + '"');
                }
            });
        }
    });
}

console.log('\u2500\u2500 Feedback praise specificity checks \u2500\u2500\n');
if (genericPraise.length) genericPraise.slice(0, 5).forEach(function(v) { console.log('  ! ' + v); });

test('feedback_correct checked: ' + totalChecked, totalChecked >= 165);
test('No one-word generic praise (Excellent/Perfect/Correct alone)', genericPraise.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-feedback-correct-no-emph: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
