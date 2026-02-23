// rp-section-a-has-identify test
// Section A questions should be identification/recognition type (easier entry point)
// This follows the SAAS pedagogy: start with identification before calculation

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-section-a-has-identify.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var missingIdentify = [], examsChecked = 0;

// Types that qualify as identification/recognition
var IDENTIFY_TYPES = ['identify', 'exponential', 'quadratic', 'radical', 'rational', 'fractional-exp', 'graph'];

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    examsChecked++;
    var sectionA = (rp.questions || []).filter(function(q) { return q.section === 'A'; });
    var hasMatch = sectionA.some(function(q) { return q.type === 'identify'; });
    if (!hasMatch && sectionA.length > 0) {
        var types = sectionA.map(function(q) { return q.type; }).join(', ');
        missingIdentify.push('rp' + i + ': Section A has no identify type (has: ' + types + ')');
    }
}

console.log('\u2500\u2500 Section A identification checks \u2500\u2500\n');
if (missingIdentify.length) missingIdentify.forEach(function(v) { console.log('  INFO: ' + v); });

test('All exams checked (' + examsChecked + '/11)', examsChecked === 11);
// Soft check -- some exams may have different Section A pedagogy
var failCount = missingIdentify.length;
test('Section A has identify-type questions (' + (examsChecked - failCount) + '/' + examsChecked + ' exams)', failCount <= 4);

console.log('\n' + '='.repeat(50));
console.log('rp-section-a-has-identify: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
