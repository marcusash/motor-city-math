// rp-solution-step-contains-math test
// At least 1 solution step per question with a graph or numeric calculation
// must contain a math expression (digit, operator, or math keyword)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-solution-step-contains-math.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [];
var checked = 0;

var MATH_RE = /[\d\+\-\*\/\^\=\(\)\{\}\[\]\\]|sqrt|log|sin|cos|slope|intercept|vertex|factor/;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).filter(function(q) {
        return q.type === 'graph' || q.type === 'calculation' || q.section === 'B' || q.section === 'C';
    }).forEach(function(q) {
        var steps = q.solution_steps || [];
        if (steps.length === 0) return;
        checked++;
        var hasMath = steps.some(function(s) { return MATH_RE.test(s); });
        if (!hasMath) {
            violations.push('rp' + i + ' ' + q.id + ': no math expression in any solution step');
        }
    });
}

console.log('\u2500\u2500 Solution step math content checks \u2500\u2500\n');
if (violations.length) violations.forEach(function(v) { console.log('  ! ' + v); });
console.log('  Questions with solution steps checked: ' + checked);

test('Graph/calc questions have >= 1 math expression in solution steps (' + violations.length + ' violations)', violations.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-solution-step-contains-math: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
