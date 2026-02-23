// rp-exam-title test
// Each RP JSON must have a title field that is descriptive (not just "Practice Test")
// Title is shown in the exam picker and should help Kai identify the focus

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-exam-title.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var missing = [], tooShort = [], generic = [];
var GENERIC_TITLES = [/^practice test$/i, /^exam$/i, /^test$/i, /^untitled$/i];
var totalExams = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    totalExams++;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    var title = rp.title || rp.name || '';
    console.log('  RP' + i + ': "' + title + '"');
    if (!title || title.trim() === '') {
        missing.push('RP' + i + ': missing title/name');
    } else if (title.trim().length < 5) {
        tooShort.push('RP' + i + ': title too short: "' + title + '"');
    } else {
        GENERIC_TITLES.forEach(function(re) {
            if (re.test(title.trim())) {
                generic.push('RP' + i + ': generic title: "' + title + '"');
            }
        });
    }
}

console.log('\u2500\u2500 RP exam title checks \u2500\u2500\n');

test('All 11 exams loaded', totalExams === 11);
test('All exams have a title or name field', missing.length === 0);
test('All titles are >= 5 chars and not generic', tooShort.length === 0 && generic.length === 0);

if (missing.length) missing.forEach(function(v) { console.log('  ! ' + v); });
if (generic.length) generic.forEach(function(v) { console.log('  ! ' + v); });

console.log('\n' + '='.repeat(50));
console.log('rp-exam-title: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
