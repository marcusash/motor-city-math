// rp-no-duplicate-hint-text test
// Hint text should not be duplicated across questions in the same exam
// Copy-paste hints signal low-quality question content

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-no-duplicate-hint-text.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var dupsFound = [];

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    var hints = {};
    (rp.questions || []).forEach(function(q) {
        if (!q.hint) return;
        var h = q.hint.trim().toLowerCase();
        if (!h) return;
        if (hints[h]) {
            dupsFound.push('rp' + i + ': "' + q.hint.slice(0, 40) + '..." duplicated on ' + q.id + ' + ' + hints[h]);
        } else {
            hints[h] = q.id;
        }
    });
}

console.log('\u2500\u2500 Duplicate hint text checks \u2500\u2500\n');
if (dupsFound.length) dupsFound.slice(0, 5).forEach(function(v) { console.log('  ! ' + v); });

test('No duplicate hint text within same exam (' + dupsFound.length + ' violations)', dupsFound.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-no-duplicate-hint-text: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
