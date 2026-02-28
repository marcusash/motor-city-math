// rp-no-broken-katex-in-hint test
// Hint strings that contain LaTeX must use proper KaTeX delimiters $...$
// Unclosed delimiters cause the hint to render as raw LaTeX code

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-no-broken-katex-in-hint.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [];

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        if (typeof q.hint !== 'string') return;
        // Check for unclosed $ delimiters (odd number of non-escaped $)
        var dollarCount = (q.hint.match(/(?<!\\)\$/g) || []).length;
        if (dollarCount % 2 !== 0) {
            violations.push('retake-practice-' + i + ' ' + q.id + ': hint has odd number of $ delimiters (' + dollarCount + ')');
        }
    });
}

test('No hints have unclosed KaTeX $ delimiters (' + violations.length + ' violations)', violations.length === 0);
if (violations.length) violations.forEach(function(v) { console.log('    ! ' + v); });

console.log('\n' + '='.repeat(50));
console.log('rp-no-broken-katex-in-hint: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
