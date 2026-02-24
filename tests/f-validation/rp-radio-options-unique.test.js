// rp-radio-options-unique test
// All options within a radio input must have distinct text values
// Duplicate options are confusing and suggest data entry errors

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-radio-options-unique.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var dups = [], total = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        (q.inputs || []).forEach(function(inp) {
            if (inp.type !== 'radio' || !inp.options) return;
            total++;
            var texts = inp.options.map(function(o) { return (o.text || '').trim().toLowerCase(); });
            var seen = {};
            texts.forEach(function(t) {
                if (seen[t]) dups.push('rp' + i + ' ' + q.id + ' inp=' + inp.id + ' dup option: "' + t + '"');
                seen[t] = true;
            });
        });
    });
}

console.log('\u2500\u2500 Radio option uniqueness checks \u2500\u2500\n');
if (dups.length) dups.forEach(function(v) { console.log('  ! ' + v); });

test('All ' + total + ' radio inputs have unique option texts', dups.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-radio-options-unique: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
