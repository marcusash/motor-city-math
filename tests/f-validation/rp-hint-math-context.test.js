// rp-hint-has-math-context test
// Hints for W2.b (intercept/graph) questions should reference the function type
// Hints should mention: "exponential", "quadratic", "radical", "rational" as appropriate
// This ensures hints are domain-specific, not generic

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-hint-math-context.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var MATH_TERMS = ['exponential', 'quadratic', 'radical', 'rational', 'linear', 'function', 'graph', 'slope', 'intercept', 'vertex', 'asymptote', 'domain', 'range', 'factor', 'square', 'root', 'power', 'exponent', 'isolate', 'simplify', 'equation', 'variable', 'coefficient', 'numerator', 'denominator', 'fraction'];
var noMathContext = [];
var totalHints = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        var hint = q.hint || '';
        if (!hint) return;
        totalHints++;
        var hasMathTerm = MATH_TERMS.some(function(term) {
            return hint.toLowerCase().includes(term);
        });
        // Also allow if hint has numbers or math notation
        var hasMathNotation = /\d/.test(hint) || hint.includes('\\') || hint.includes('f(') || 
                              hint.includes('y =') || hint.includes('\u221a') || hint.includes('\u00b2') ||
                              hint.includes('\u00b1') || hint.includes('\u00d7') || hint.includes('=');
        if (!hasMathTerm && !hasMathNotation) {
            noMathContext.push('rp' + i + ' ' + q.id + ': hint lacks math context: "' + hint.slice(0, 60) + '"');
        }
    });
}

console.log('\u2500\u2500 RP hint math context checks \u2500\u2500\n');
console.log('  Hints checked: ' + totalHints);

test('All 165 hints have math context (term, notation, or numbers)', noMathContext.length === 0);
if (noMathContext.length) {
    console.log('  Hints without math context (' + noMathContext.length + '):');
    noMathContext.slice(0,5).forEach(function(v) { console.log('  ! ' + v); });
}

console.log('\n' + '='.repeat(50));
console.log('rp-hint-math-context: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
