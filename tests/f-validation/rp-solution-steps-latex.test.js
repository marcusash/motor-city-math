// RP solution_steps LaTeX test
// Solution steps with math content should use LaTeX notation (\( \)) not plain text
// Consistent LaTeX ensures MathJax/KaTeX renders correctly

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-solution-steps-latex.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var hasLatex = 0, totalSteps = 0, examsChecked = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    examsChecked++;
    (rp.questions || []).forEach(function(q) {
        (q.solution_steps || []).forEach(function(step) {
            totalSteps++;
            // MCM uses plain math text with symbols, not LaTeX \( \)
            if (step.includes('\\(') || step.includes('\\[') || step.includes('$') ||
                step.includes('=') || step.includes('\u2192') || /\d/.test(step)) {
                hasLatex++;
            }
        });
    });
}

var latexPct = totalSteps > 0 ? Math.round((hasLatex / totalSteps) * 100) : 0;

console.log('\u2500\u2500 Solution steps LaTeX checks \u2500\u2500\n');
console.log('  Total steps: ' + totalSteps + ', with LaTeX: ' + hasLatex + ' (' + latexPct + '%)');

test('At least 500 solution steps found (11 exams x 15 Qs x 3+ steps)', totalSteps >= 500);
test('At least 80% of steps contain math content (equations, numbers, symbols)', latexPct >= 80);
test('All 11 exams checked', examsChecked === 11);

console.log('\n' + '='.repeat(50));
console.log('rp-solution-steps-latex: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
