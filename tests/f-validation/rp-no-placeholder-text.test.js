// rp-no-placeholder-text test
// Questions and hints must not contain placeholder text like "TODO" or "PLACEHOLDER"
// Placeholder text breaks Kai's learning experience

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-no-placeholder-text.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var PLACEHOLDERS = ['TODO', 'PLACEHOLDER', 'TBD', 'FIXME', 'XXX', 'lorem ipsum', '[insert'];
var found = [], total = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    var raw = fs.readFileSync(f, 'utf-8').toLowerCase();
    total++;
    PLACEHOLDERS.forEach(function(p) {
        if (raw.includes(p.toLowerCase())) {
            found.push('rp' + i + ': contains "' + p + '"');
        }
    });
}

console.log('\u2500\u2500 Placeholder text checks \u2500\u2500\n');
if (found.length) found.forEach(function(v) { console.log('  ! ' + v); });

test('All ' + total + ' RP exams free of placeholder text', found.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-no-placeholder-text: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
