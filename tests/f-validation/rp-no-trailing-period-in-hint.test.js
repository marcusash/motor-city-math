// rp-no-trailing-period-in-hint test
// Hints should end with meaningful content, not trailing periods at end of
// strings that might be incomplete or truncated

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-no-trailing-period-in-hint.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [];
var checked = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        if (!q.hint || typeof q.hint !== 'string') return;
        checked++;
        // A hint ending with "..." (ellipsis) suggests incomplete/truncated content
        if (q.hint.trim().endsWith('...')) {
            violations.push('rp' + i + ' ' + q.id + ': hint ends with ellipsis (truncated?)');
        }
    });
}

console.log('\u2500\u2500 Hint trailing ellipsis checks \u2500\u2500\n');
if (violations.length) violations.forEach(function(v) { console.log('  ! ' + v); });
console.log('  Hints checked: ' + checked);

test('No hints end with ellipsis (...) suggesting truncation (' + violations.length + ' violations)', violations.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-no-trailing-period-in-hint: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
