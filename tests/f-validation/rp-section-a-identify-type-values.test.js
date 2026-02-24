// rp-section-a-is-identification test
// Section A should contain identification questions (identify parent function)
// Section A is always the "identify the function type" section

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-section-a-identify-type-values.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var KNOWN_TYPES = ['exponential', 'quadratic', 'absolute-value', 'radical', 'rational', 'square-root', 'logarithmic', 'linear', 'identify'];
var unknownTypes = [], total = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        if (q.section !== 'A') return;
        total++;
        if (!q.type) return; // already checked by rp-section-a-has-type
        if (!KNOWN_TYPES.some(function(t) { return q.type.toLowerCase().includes(t); })) {
            unknownTypes.push('rp' + i + ' ' + q.id + ': unknown type "' + q.type + '"');
        }
    });
}

console.log('\u2500\u2500 Section A type value checks \u2500\u2500\n');
if (unknownTypes.length) unknownTypes.forEach(function(v) { console.log('  ! ' + v); });

// Informational: report type distribution
test('All ' + total + ' Section A questions have recognized function types', unknownTypes.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-section-a-identify-type-values: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
