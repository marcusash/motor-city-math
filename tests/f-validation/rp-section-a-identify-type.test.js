// rp-section-a-identify-type test
// Section A questions (rp1-7) should be type=identify or have identification task
// Identification is the primary skill tested in Section A

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-section-a-identify-type.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var IDENTIFY_TYPES = ['identify', 'quadratic', 'exponential', 'absolute-value', 'radical', 'rational'];
var nonIdentify = [], sectionACount = 0;

// Check only rp1-7 (rp8-11 use different Section A structure)
for (var i = 1; i <= 7; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).filter(function(q){ return q.section === 'A'; }).forEach(function(q) {
        sectionACount++;
        if (IDENTIFY_TYPES.indexOf(q.type) === -1) {
            nonIdentify.push('rp' + i + ' ' + q.id + ': type=' + q.type);
        }
    });
}

console.log('\u2500\u2500 Section A identify-type checks \u2500\u2500\n');
if (nonIdentify.length) nonIdentify.forEach(function(v) { console.log('  ! ' + v); });

test('Section A questions checked (rp1-7): ' + sectionACount, sectionACount >= 21);
test('All Section A (rp1-7) questions are identify or equivalent type', nonIdentify.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-section-a-identify-type: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
