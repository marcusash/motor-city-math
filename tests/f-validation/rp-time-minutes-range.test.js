// rp-time-minutes-range test
// Exam time_minutes must be a positive integer in a reasonable range (20-90)
// Zero or negative minutes would end the exam immediately;
// 90+ minutes is unreasonably long for a 15-question test

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-time-minutes-range.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var MIN = 20, MAX = 90;
var bad = [], total = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    total++;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    var t = rp.time_minutes;
    if (t === undefined || t === null) {
        bad.push('rp' + i + ': missing time_minutes');
    } else if (typeof t !== 'number' || !Number.isInteger(t)) {
        bad.push('rp' + i + ': time_minutes=' + t + ' (must be integer)');
    } else if (t < MIN || t > MAX) {
        bad.push('rp' + i + ': time_minutes=' + t + ' (must be ' + MIN + '-' + MAX + ')');
    }
}

console.log('\u2500\u2500 Time range checks (' + MIN + '-' + MAX + ' min) \u2500\u2500\n');
if (bad.length) bad.forEach(function(v) { console.log('  ! ' + v); });

test('All ' + total + ' RP exams have time_minutes in range ' + MIN + '-' + MAX, bad.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-time-minutes-range: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
