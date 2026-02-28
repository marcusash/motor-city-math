// rp-quiz-title-includes-number test
// RP exam titles should include a number or practice identifier
// so Kai knows which exam he's taking (not just "Retake Practice")

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-quiz-title-includes-number.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [];

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    var title = rp.title || '';
    // Title should contain a number OR specific content identifier
    if (!/\d/.test(title) && !/drill|mock|final|review|warmup/i.test(title)) {
        violations.push('retake-practice-' + i + ': title="' + title + '" lacks number or identifier');
    }
}

console.log('\u2500\u2500 Exam title identifier checks \u2500\u2500\n');
if (violations.length) violations.forEach(function(v) { console.log('  ! ' + v); });

test('All exam titles include a number or content identifier (' + violations.length + ' violations)', violations.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-quiz-title-includes-number: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
