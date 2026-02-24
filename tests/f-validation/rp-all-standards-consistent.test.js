// rp-all-standards-consistent test
// All standards in RP exams should be from a consistent set
// No typos like "W2b" (missing dot) or "w2.b" (lowercase) 

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-all-standards-consistent.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var allStandards = new Set(), badFormat = [];
var STD_RE = /^W\d+\.[a-z]$/;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        var std = q.standard || '';
        if (std) allStandards.add(std);
        if (!STD_RE.test(std)) {
            badFormat.push('rp' + i + ' ' + q.id + ': "' + std + '"');
        }
    });
}

console.log('\u2500\u2500 Standard consistency checks \u2500\u2500\n');
var stdList = Array.from(allStandards).sort();
console.log('  All standards in bank: ' + stdList.join(', '));
if (badFormat.length) badFormat.forEach(function(v) { console.log('  ! ' + v); });
console.log('');

test('Standards follow W{N}.{letter} format (no typos)', badFormat.length === 0);
// Between 5-20 unique standards is a healthy range
test('Unique standards count reasonable (5-20): ' + stdList.length, stdList.length >= 5 && stdList.length <= 20);

console.log('\n' + '='.repeat(50));
console.log('rp-all-standards-consistent: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
