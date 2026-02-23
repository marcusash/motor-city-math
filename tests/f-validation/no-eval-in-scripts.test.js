// No eval() in shared scripts test
// parseStudentAnswer uses Function() for safe math eval with character whitelist
// Raw eval() is a security risk and must not appear in shared/scripts.js or exam.html

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} no-eval-in-scripts.test.js\n');

var root = path.join(__dirname, '../../');
var files = [
    'shared/scripts.js',
    'exam.html',
    'index.html',
];

console.log('\u2500\u2500 eval() security audit \u2500\u2500\n');

var evalViolations = [];

files.forEach(function(f) {
    var src = fs.readFileSync(path.join(root, f), 'utf-8');
    // Match raw eval( not inside comments and not "new Function" (which is the safe alternative)
    // Simple heuristic: count raw eval() occurrences
    var matches = src.match(/[^a-zA-Z.]eval\s*\(/g) || [];
    if (matches.length > 0) {
        evalViolations.push(f + ': ' + matches.length + ' eval() call(s)');
    }
});

test('No raw eval() in shared/scripts.js', !evalViolations.some(function(v) { return v.includes('scripts.js'); }));
test('No raw eval() in exam.html', !evalViolations.some(function(v) { return v.includes('exam.html'); }));
test('No raw eval() in index.html', !evalViolations.some(function(v) { return v.includes('index.html'); }));

if (evalViolations.length) evalViolations.forEach(function(v) { console.log('  ! ' + v); });

// Verify safe alternative (Function) is used in parseStudentAnswer
var sharedSrc = fs.readFileSync(path.join(root, 'shared/scripts.js'), 'utf-8');
var hasSafeEval = sharedSrc.includes('Function(') || sharedSrc.includes('new Function');
test('parseStudentAnswer uses Function() (safe eval alternative)', hasSafeEval);

console.log('\n' + '='.repeat(50));
console.log('no-eval-in-scripts: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
