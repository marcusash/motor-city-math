// rp-question-html-has-latex test
// Questions in section B (calculation) should have at least one LaTeX expression
// to render the math problem properly via KaTeX

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-question-html-has-latex.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [];
var checked = 0;

// LaTeX delimiters used in MCM: $...$, \(...\), katex class
var LATEX_RE = /\$[^$]+\$|\\[\(\[]|class=['"]math/;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).filter(function(q) { return q.section === 'B'; }).forEach(function(q) {
        if (!q.question_html) return;
        checked++;
        if (!LATEX_RE.test(q.question_html)) {
            violations.push('rp' + i + ' ' + q.id + ': no LaTeX in section B question_html');
        }
    });
}

console.log('\u2500\u2500 Section B LaTeX presence checks \u2500\u2500\n');
if (violations.length) violations.forEach(function(v) { console.log('  ! ' + v); });
console.log('  Section B questions checked: ' + checked);

test('Section B questions contain LaTeX math expressions (' + violations.length + ' violations)', violations.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-question-html-has-latex: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
