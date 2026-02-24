// rp-title-not-default test
// Each RP exam title must be distinct and meaningful
// Default or template titles indicate copy-paste errors in exam creation

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-title-not-default.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var titles = [], dupes = [], empty = [];

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    var t = rp.title || '';
    console.log('  rp' + i + ': "' + t + '"');
    if (!t || t.trim().length < 5) { empty.push('rp' + i); }
    if (titles.indexOf(t) !== -1) { dupes.push('rp' + i + ': duplicate title "' + t + '"'); }
    titles.push(t);
}

console.log('');
if (empty.length) console.log('  ! Empty/short titles: ' + empty.join(', '));
if (dupes.length) dupes.forEach(function(v) { console.log('  ! ' + v); });

test('All 11 RP exam titles are non-empty and unique', empty.length === 0 && dupes.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-title-not-default: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
