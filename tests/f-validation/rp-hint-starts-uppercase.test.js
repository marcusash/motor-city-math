// rp-hint-starts-uppercase test
// Hints should start with an uppercase letter (sentence case)
// Lowercase-starting hints feel informal and inconsistent

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-hint-starts-uppercase.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [];

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        if (q.hint && q.hint.length > 0) {
            var first = q.hint[0];
            // Allow LaTeX start ($), numbers, and uppercase letters
            if (/[a-z]/.test(first)) {
                violations.push(q.id + ': hint starts lowercase: "' + q.hint.substring(0, 40) + '"');
            }
        }
    });
}

// Allow up to 10 lowercase-starting hints (some hints start with math notation like "a≠1")
test('Nearly all hints start with uppercase or non-letter (<= 10 exceptions)', violations.length <= 10);
if (violations.length) violations.slice(0, 5).forEach(function(v) { console.log('    ! ' + v); });

console.log('\n' + '='.repeat(50));
console.log('rp-hint-starts-uppercase: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
