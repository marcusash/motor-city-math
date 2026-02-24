// rp-standard-w-prefix test  
// All standard values must start with 'W' (e.g., W2.b, W3.a)
// Non-W standards are not SAAS algebra standards and indicate data error

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-standard-w-prefix.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var bad = [], total = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        if (!q.standard) return;
        total++;
        if (!q.standard.startsWith('W')) {
            bad.push('rp' + i + ' ' + q.id + ': standard="' + q.standard + '" (must start with W)');
        }
    });
}

console.log('\u2500\u2500 Standard W-prefix checks \u2500\u2500\n');
if (bad.length) bad.forEach(function(v) { console.log('  ! ' + v); });

test('All ' + total + ' standards start with W (e.g., W2.b)', bad.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-standard-w-prefix: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
