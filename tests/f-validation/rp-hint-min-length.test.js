// rp-hint-min-length test
// Every hint must be at least 15 characters (not placeholder/empty)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-hint-min-length.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var MIN_LEN = 15;
var tooShort = [];
var total = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        if (typeof q.hint !== 'string') return;
        total++;
        if (q.hint.trim().length < MIN_LEN) {
            tooShort.push('rp' + i + ' ' + q.id + ': "' + q.hint + '"');
        }
    });
}

console.log('\u2500\u2500 Hint minimum length checks (>=' + MIN_LEN + ' chars) \u2500\u2500\n');
if (tooShort.length) tooShort.forEach(function(v) { console.log('  ! ' + v); });
console.log('  Total hints checked: ' + total);

test('All hints >= ' + MIN_LEN + ' characters (' + tooShort.length + ' violations)', tooShort.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-hint-min-length: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
