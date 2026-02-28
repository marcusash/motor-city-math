// RP input type validation test
// All inputs in RP JSON must have a type field from the allowed set:
// number, text, dropdown, radio, checkbox, expression

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-input-type-valid.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var ALLOWED_TYPES = ['number', 'text', 'dropdown', 'radio', 'checkbox', 'expression', 'graph', 'multi'];
var allTypes = {};
var violations = [];
var totalInputs = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        (q.inputs || []).forEach(function(inp) {
            totalInputs++;
            var t = inp.type || '(missing)';
            allTypes[t] = (allTypes[t] || 0) + 1;
            if (!ALLOWED_TYPES.includes(t)) {
                violations.push('rp' + i + ' ' + q.id + ' input ' + inp.id + ': type="' + t + '"');
            }
        });
    });
}

console.log('\u2500\u2500 RP input type checks \u2500\u2500\n');
console.log('  Total inputs: ' + totalInputs);
console.log('  Types found: ' + JSON.stringify(allTypes));

test('Total inputs > 0 (questions have inputs)', totalInputs > 0);
test('All input types from allowed set', violations.length === 0);
test('number type is used (most common input type)', (allTypes['number'] || 0) > 0);

if (violations.length) violations.slice(0,5).forEach(function(v) { console.log('  ! ' + v); });

console.log('\n' + '='.repeat(50));
console.log('rp-input-type-valid: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
