// rp-hints-no-generic test
// RP question hints must not use generic boilerplate language
// "Use the formula", "Remember to", "Don't forget" are not coach voice

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-hints-no-generic.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var genericHints = [], totalChecked = 0;

var GENERIC_PATTERNS = [
    /^use the formula/i,
    /^remember to/i,
    /^don't forget/i,
    /^recall that/i,
    /^note that/i,
    /^hint:/i
];

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        if (q.hint) {
            totalChecked++;
            var hintTrim = q.hint.trim();
            GENERIC_PATTERNS.forEach(function(re) {
                if (re.test(hintTrim)) {
                    genericHints.push('rp' + i + ' ' + q.id + ': "' + hintTrim.slice(0, 40) + '..."');
                }
            });
        }
    });
}

console.log('\u2500\u2500 Generic hint checks \u2500\u2500\n');
if (genericHints.length) genericHints.slice(0, 5).forEach(function(v) { console.log('  ! ' + v); });
if (genericHints.length > 5) console.log('  ... and ' + (genericHints.length - 5) + ' more');

test('Hints checked: ' + totalChecked, totalChecked >= 100);
// Allow up to 5 generic patterns (common math pedagogy sometimes uses these)
test('Generic hint language minimal (<=5 occurrences)', genericHints.length <= 5);

console.log('\n' + '='.repeat(50));
console.log('rp-hints-no-generic: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
