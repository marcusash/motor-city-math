// rp-section-a-is-identify test
// All section A questions must be of an "identify" or function-family type
// Section A tests pattern recognition of parent function graphs

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-section-a-is-identify.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [];
var SECTION_A_TYPES = ['quadratic','absolute-value','exponential','radical','logarithmic','linear','rational','square-root','cube-root','cubic','identify','parent','power'];

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    var sectionA = (rp.questions || []).filter(function(q) { return q.section === 'A'; });
    sectionA.forEach(function(q) {
        var typeOk = SECTION_A_TYPES.some(function(t) { return q.type && q.type.indexOf(t) !== -1; });
        if (!typeOk) {
            violations.push(q.id + ': section A type="' + q.type + '" (expected function family type)');
        }
    });
}

test('All section A questions have function-family types (' + violations.length + ' violations)', violations.length === 0);
if (violations.length) violations.slice(0, 5).forEach(function(v) { console.log('    ! ' + v); });

console.log('\n' + '='.repeat(50));
console.log('rp-section-a-is-identify: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
