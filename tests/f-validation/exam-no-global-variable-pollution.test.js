// exam-no-global-variable-pollution test
// exam.html should not declare variables at global scope without const/let/var
// Undeclared globals pollute window object and can conflict with shared scripts

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-no-global-variable-pollution.test.js\n');

var html = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 Global scope checks \u2500\u2500\n');

// Count undeclared assignments at start of line in script blocks (risky pattern)
// Pattern: variable = value; at line start with no var/let/const
var scriptContent = html.match(/<script[\s\S]*?<\/script>/gi) || [];
var undeclaredGlobals = 0;
scriptContent.forEach(function(block) {
    var lines = block.split('\n');
    lines.forEach(function(line) {
        var trimmed = line.trim();
        // Line like: varName = something; without declaration keyword at line start
        if (/^[a-zA-Z_$][a-zA-Z0-9_$]*\s*=\s*[^=]/.test(trimmed) &&
            !/^(var|let|const|function|if|else|return|case|default|for|while|do|switch|try|catch)\s/.test(trimmed) &&
            !trimmed.startsWith('//') && !trimmed.startsWith('*')) {
            undeclaredGlobals++;
        }
    });
});

// Threshold: some re-assignments are fine (like DOM element variables), keep under 50
test('exam.html has limited undeclared global assignments (<= 50)', undeclaredGlobals <= 50);

console.log('  Potential undeclared global-scope assignments: ' + undeclaredGlobals);

console.log('\n' + '='.repeat(50));
console.log('exam-no-global-variable-pollution: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
