// rp-standard-has-description test
// All standards fields should be in Wx.y format and non-empty
// Standards like "W2.b" must be exact -- Kai's IEP tracks competency by standard

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-standard-nonempty.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var missing = [], total = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        total++;
        if (!q.standard || q.standard.trim() === '') {
            missing.push('rp' + i + ' ' + q.id + ': missing standard');
        }
    });
}

console.log('\u2500\u2500 Standard field checks \u2500\u2500\n');
if (missing.length) missing.forEach(function(v) { console.log('  ! ' + v); });

test('All ' + total + ' questions have non-empty standard field', missing.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-standard-nonempty: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
