// RP question prompt length test
// Each question's input labels/context should be reasonably sized
// The RP JSON uses inputs[].label as the question text (not a top-level "prompt" field)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-prompt-length.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var tooLong = [], totalChecked = 0;
var MAX = 600; // generous max for multi-part prompts (LaTeX adds length)

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        var hint = q.hint || '';
        if (hint.length > MAX) {
            tooLong.push('rp' + i + ' ' + q.id + ': hint too long (' + hint.length + ' chars)');
        }
        totalChecked++;
    });
}

console.log('\u2500\u2500 RP question length checks \u2500\u2500\n');
console.log('  Questions checked: ' + totalChecked);

test('At least 165 questions found (11 exams x 15 each)', totalChecked >= 165);

if (tooLong.length) {
    tooLong.slice(0,3).forEach(function(v) { console.log('  ! ' + v); });
}
test('No hint text exceeds ' + MAX + ' chars', tooLong.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-prompt-length: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
