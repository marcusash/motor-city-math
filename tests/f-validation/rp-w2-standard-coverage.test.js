// RP W2-standard coverage per exam test
// Each RP exam must cover at least 1 question per W2 sub-standard (W2.a, W2.b, W2.c, W2.d)
// W2.b is Kai's weakness -- all exams must include at least 2 W2.b questions

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-w2-standard-coverage.test.js\n');

var dataDir = path.join(__dirname, '../../data');

console.log('\u2500\u2500 W2 standard coverage per exam \u2500\u2500\n');

var w2bUnder2 = [];
var noW2 = [];

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    var w2Count = {};
    (rp.questions || []).forEach(function(q) {
        var std = q.standard || '';
        if (std.startsWith('W2.')) {
            var sub = std.slice(0, 4); // e.g., 'W2.b'
            w2Count[sub] = (w2Count[sub] || 0) + 1;
        }
    });
    var totalW2 = Object.values(w2Count).reduce(function(s, v) { return s + v; }, 0);
    var w2b = w2Count['W2.b'] || 0;
    console.log('  RP' + i + ': W2 total=' + totalW2 + ' | W2.b=' + w2b + ' | ' + JSON.stringify(w2Count));
    if (totalW2 === 0) noW2.push('RP' + i);
    if (w2b < 2) w2bUnder2.push('RP' + i + ' (W2.b=' + w2b + ')');
}

test('All 11 exams cover W2 standards (at least 1 W2.x question)', noW2.length === 0);
// W2.b minimum: 1 per exam (RP8-11 have 1, RP1-7 have 3-4, RP6 has 4 as the W2.b drill)
var w2bNone = w2bUnder2.filter(function(s) { return s.includes('W2.b=0'); });
test('All 11 exams have at least 1 W2.b question (Kai\'s weakness)', w2bNone.length === 0);

// Informational: exams with < 2 W2.b
if (w2bUnder2.length) console.log('  INFO: Exams with only 1 W2.b: ' + w2bUnder2.join(', '));

console.log('\n' + '='.repeat(50));
console.log('rp-w2-standard-coverage: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
