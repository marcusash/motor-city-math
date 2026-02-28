// rp-feedback-wrong-min-length test
// feedback_wrong strings should be at least 20 chars
// Short wrong feedback like "No." gives no learning value

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-feedback-wrong-min-length.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [];
var MIN = 20;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        if (q.feedback_wrong && q.feedback_wrong.length < MIN) {
            violations.push(q.id + ': feedback_wrong too short (' + q.feedback_wrong.length + ' chars): "' + q.feedback_wrong + '"');
        }
    });
}

test('All feedback_wrong strings are >= ' + MIN + ' chars (' + violations.length + ' violations)', violations.length === 0);
if (violations.length) violations.slice(0, 5).forEach(function(v) { console.log('    ! ' + v); });

console.log('\n' + '='.repeat(50));
console.log('rp-feedback-wrong-min-length: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
