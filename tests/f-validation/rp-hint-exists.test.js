// RP hint layer count test
// Each question must have at least 1 hint string (non-empty)
// MCM hint system shows hint before auto-rescue

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-hint-exists.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var noHint = [], emptyHint = [], totalChecked = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        totalChecked++;
        if (!q.hint && q.hint !== 0) {
            noHint.push('rp' + i + ' ' + q.id);
        } else if (typeof q.hint === 'string' && q.hint.trim() === '') {
            emptyHint.push('rp' + i + ' ' + q.id);
        }
    });
}

console.log('\u2500\u2500 Hint existence checks \u2500\u2500\n');
console.log('  Questions checked: ' + totalChecked);

if (noHint.length) console.log('  ! Missing hint: ' + noHint.slice(0,5).join(', '));
if (emptyHint.length) console.log('  ! Empty hint: ' + emptyHint.slice(0,5).join(', '));

test('All questions have a hint field', noHint.length === 0);
test('No questions have empty hint string', emptyHint.length === 0);
test('At least 165 questions found', totalChecked >= 165);

console.log('\n' + '='.repeat(50));
console.log('rp-hint-exists: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
