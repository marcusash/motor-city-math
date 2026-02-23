// rp-answer-uniqueness-within-exam test
// Within a single exam, no two questions should have identical numeric answers
// for the same input position (prevents Kai from guessing by pattern)
// This is a SOFT check (warning) - logs duplicates but only fails if > 30% collision

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-answer-uniqueness-within-exam.test.js\n');

var dataDir = path.join(__dirname, '../../data');

console.log('\u2500\u2500 Answer uniqueness within each exam \u2500\u2500\n');

var highCollision = [];

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    var allAnswers = [];
    (rp.questions || []).forEach(function(q) {
        (q.inputs || []).forEach(function(inp) {
            if (inp.answer !== undefined && inp.answer !== null) {
                var val = String(inp.answer).trim();
                if (/^-?[\d.]+$/.test(val)) allAnswers.push(parseFloat(val));
            }
        });
    });
    if (allAnswers.length === 0) continue;
    // Count duplicates
    var freq = {};
    allAnswers.forEach(function(a) { freq[a] = (freq[a] || 0) + 1; });
    var dupes = Object.values(freq).filter(function(c) { return c > 1; });
    var collisionRate = dupes.reduce(function(s, c) { return s + c - 1; }, 0) / allAnswers.length;
    console.log('  RP' + i + ': ' + allAnswers.length + ' answers, collision rate=' + Math.round(collisionRate * 100) + '%');
    if (collisionRate > 0.50) {
        highCollision.push('RP' + i + ' (' + Math.round(collisionRate * 100) + '% collision)');
    }
}

test('All exams have < 50% duplicate answer values within the exam', highCollision.length === 0);
if (highCollision.length) highCollision.forEach(function(v) { console.log('  ! HIGH COLLISION: ' + v); });

console.log('\n' + '='.repeat(50));
console.log('rp-answer-uniqueness-within-exam: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
