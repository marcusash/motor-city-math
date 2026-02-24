// rp-no-em-dash test
// No RP exam question content should contain em-dashes (-- or Unicode em dash)
// Voice guide bans em dashes -- all agents must comply in data files too

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-no-em-dash.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [], totalQ = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        totalQ++;
        var fields = [q.question_html || '', q.feedback_correct || '', q.feedback_wrong || ''];
        (q.solution_steps || []).forEach(function(s) { fields.push(s); });
        var combined = fields.join('\n');
        // Unicode em dash U+2014 or U+2013 (en dash)
        if (combined.includes('\u2014') || combined.includes('\u2013')) {
            violations.push('rp' + i + ' ' + q.id + ': contains em/en dash');
        }
    });
}

console.log('\u2500\u2500 Em-dash checks \u2500\u2500\n');
if (violations.length) violations.forEach(function(v) { console.log('  ! ' + v); });

test('Total questions checked: ' + totalQ, totalQ >= 165);
test('No em-dashes in any question content (voice guide compliance)', violations.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-no-em-dash: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
