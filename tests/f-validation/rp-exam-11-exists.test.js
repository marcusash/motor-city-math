// rp-exam-11-exists test
// retake-practice-11.json must exist and be a valid RP exam

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-exam-11-exists.test.js\n');

var f = path.join(__dirname, '../../data/retake-practice-11.json');

console.log('\u2500\u2500 RP11 existence and validity checks \u2500\u2500\n');

var exists = fs.existsSync(f);
test('retake-practice-11.json exists', exists);

if (exists) {
    var rp11;
    try {
        rp11 = JSON.parse(fs.readFileSync(f, 'utf-8'));
        test('retake-practice-11.json is valid JSON', true);
    } catch(e) {
        test('retake-practice-11.json is valid JSON', false);
        rp11 = null;
    }
    if (rp11) {
        test('RP11 has 15 questions', (rp11.questions || []).length === 15);
        test('RP11 has exam_id="retake-practice-11"', rp11.exam_id === 'retake-practice-11');
    }
}

console.log('\n' + '='.repeat(50));
console.log('rp-exam-11-exists: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
