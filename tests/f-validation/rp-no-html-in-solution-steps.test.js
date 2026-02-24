// rp-no-html-tags-in-solution-steps test
// Solution steps should be plain text, not raw HTML
// Raw HTML in solution steps would render as escaped text, breaking math display

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-no-html-in-solution-steps.test.js\n');

var dataDir = path.join(__dirname, '../../data');
// Check for raw HTML block-level tags (not KaTeX/math)
var BAD_HTML_RE = /<\s*(div|p|span|ul|li|table|br|hr|h[1-6])\s*[^>]*>/i;
var htmlInSteps = [], total = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        (q.solution_steps || []).forEach(function(step, idx) {
            total++;
            if (typeof step === 'string' && BAD_HTML_RE.test(step)) {
                htmlInSteps.push('rp' + i + ' ' + q.id + ' step[' + idx + ']: contains HTML tag');
            }
        });
    });
}

console.log('\u2500\u2500 HTML in solution steps checks \u2500\u2500\n');
if (htmlInSteps.length) htmlInSteps.slice(0, 5).forEach(function(v) { console.log('  ! ' + v); });

test('All ' + total + ' solution steps are free of block-level HTML tags', htmlInSteps.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-no-html-in-solution-steps: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
