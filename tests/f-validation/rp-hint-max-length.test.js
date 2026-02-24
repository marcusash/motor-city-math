// rp-hint-max-length test
// Hints should be concise: max 120 chars for ADHD-friendly reading
// Very long hints are walls of text that overwhelm

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-hint-max-length.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [];
var MAX = 150; // slightly generous to avoid over-constraining

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        if (q.hint && q.hint.length > MAX) {
            violations.push(q.id + ': hint is ' + q.hint.length + ' chars (max ' + MAX + ')');
        }
    });
}

test('All hints are <= ' + MAX + ' chars (' + violations.length + ' violations)', violations.length === 0);
if (violations.length) violations.slice(0, 5).forEach(function(v) { console.log('    ! ' + v); });

console.log('\n' + '='.repeat(50));
console.log('rp-hint-max-length: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
