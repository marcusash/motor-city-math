// rp-standard-w3-coverage test
// W3 standards (W3.a, W3.b, etc.) should appear across the full RP exam bank
// These are the nonlinear function standards Kai needs for the retake

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-standard-w3-coverage.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var standardCounts = {};
var totalQuestions = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        totalQuestions++;
        var std = q.standard || 'none';
        standardCounts[std] = (standardCounts[std] || 0) + 1;
    });
}

console.log('\u2500\u2500 W3 standard coverage checks \u2500\u2500\n');
Object.keys(standardCounts).sort().forEach(function(std) {
    console.log('  ' + std + ': ' + standardCounts[std] + ' questions');
});
console.log('');

// 1. W3 standards appear at all
var w3Keys = Object.keys(standardCounts).filter(function(k) { return k.startsWith('W3'); });
test('W3 standards represented in exam bank', w3Keys.length > 0);

// 2. Multiple W3 sub-standards covered
test('Multiple W3 sub-standards covered (>=2)', w3Keys.length >= 2);

// 3. No standard dominates (>50% concentration would be unbalanced)
var maxCount = Math.max.apply(null, Object.values(standardCounts));
var maxPct = Math.round(maxCount / totalQuestions * 100);
test('No single standard dominates (max concentration <50%): ' + maxPct + '%', maxPct < 50);

console.log('\n' + '='.repeat(50));
console.log('rp-standard-w3-coverage: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
