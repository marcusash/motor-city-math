// rp-standard-code-format test
// All standard codes must follow Wx.y format (e.g., W2.b, W3.a)
// Some questions can have multiple standards

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-standard-code-format.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var FORMAT = /^W\d+\.[a-z]$/;
var violations = [];
var total = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        var stds = Array.isArray(q.standards) ? q.standards : (q.standard ? [q.standard] : []);
        stds.forEach(function(s) {
            total++;
            if (!FORMAT.test(s)) {
                violations.push('rp' + i + ' ' + q.id + ': standard="' + s + '"');
            }
        });
    });
}

console.log('\u2500\u2500 Standard code format checks \u2500\u2500\n');
if (violations.length) violations.slice(0, 5).forEach(function(v) { console.log('  ! ' + v); });
console.log('  Total standards checked: ' + total);

test('All standard codes follow Wx.y format (' + violations.length + ' violations)', violations.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-standard-code-format: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
