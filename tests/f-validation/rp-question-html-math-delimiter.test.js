// rp-question-html-math-delimiter test
// Questions with LaTeX should use $ or \( delimiters (not raw backslash notation)
// KaTeX only renders $...$ and \(...\) -- raw \frac without delimiters renders as text

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-question-html-math-delimiter.test.js\n');

var dataDir = path.join(__dirname, '../../data');
// Raw LaTeX that must be wrapped: \frac, \sqrt, \left, \right outside delimiters
var rawLatexPattern = /(?<!\$)\\(frac|sqrt|left|right|cdot|times|pm|geq|leq)(?![^$]*\$)/;
var flagged = [];
var totalWithLatex = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        var html = q.question_html || '';
        // Check if math present -- has $ or \(
        var hasDelimiters = html.includes('$') || html.includes('\\(');
        if (html.includes('\\frac') || html.includes('\\sqrt')) {
            totalWithLatex++;
            if (!hasDelimiters) {
                flagged.push('rp' + i + ' ' + q.id + ': LaTeX present but no $ or \\( delimiters');
            }
        }
    });
}

console.log('\u2500\u2500 LaTeX delimiter checks \u2500\u2500\n');
if (flagged.length) flagged.slice(0, 5).forEach(function(v) { console.log('  ! ' + v); });
console.log('  Questions with LaTeX: ' + totalWithLatex);

test('All LaTeX questions use $ or \\( delimiters (' + flagged.length + ' violations)', flagged.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-question-html-math-delimiter: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
