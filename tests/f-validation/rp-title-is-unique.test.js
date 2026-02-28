// rp-title-is-unique test
// Each RP exam must have a unique title (not copy-pasted from another)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-title-is-unique.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var titles = {};
var violations = [];

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    var t = (rp.title || '').trim().toLowerCase();
    if (!t) {
        violations.push('retake-practice-' + i + ': empty title');
    } else if (titles[t]) {
        violations.push('retake-practice-' + i + ' shares title with ' + titles[t] + ': "' + rp.title + '"');
    } else {
        titles[t] = 'retake-practice-' + i;
    }
}

test('All exam titles are unique and non-empty (' + violations.length + ' violations)', violations.length === 0);
if (violations.length) violations.forEach(function(v) { console.log('    ! ' + v); });

console.log('\n' + '='.repeat(50));
console.log('rp-title-is-unique: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
