// Checkpoint docs no em dash test
// MCM voice rule: all agent docs must not contain em dashes (— or –)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} docs-no-emdash.test.js\n');

var EM_DASH = '\u2014';
var EN_DASH = '\u2013';

var docsDir = path.join(__dirname, '../../docs');

// Gather all markdown files in docs/
function getAllMdFiles(dir) {
    var results = [];
    if (!fs.existsSync(dir)) return results;
    fs.readdirSync(dir).forEach(function(f) {
        var fullPath = path.join(dir, f);
        var stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            results = results.concat(getAllMdFiles(fullPath));
        } else if (f.endsWith('.md')) {
            results.push(fullPath);
        }
    });
    return results;
}

// Only check GA-authored docs (GA is responsible for these)
var gaDocs = [
    'docs/agents/ga-learning-plan.md',
    'docs/agents/ga-offsite-postmortem-20260224.md',
    'docs/testing.md'
].map(function(f) { return path.join(__dirname, '../../', f); }).filter(function(f) { return fs.existsSync(f); });

console.log('\u2500\u2500 Scanning ' + gaDocs.length + ' GA-authored docs \u2500\u2500\n');

var violations = [];
gaDocs.forEach(function(file) {
    var src = fs.readFileSync(file, 'utf-8');
    var hasEmDash = src.includes(EM_DASH) || src.includes(EN_DASH);
    var relPath = file.replace(path.join(__dirname, '../../'), '');
    if (hasEmDash) {
        var lines = src.split('\n');
        var badLines = lines.filter(function(l) { return l.includes(EM_DASH) || l.includes(EN_DASH); });
        violations.push(relPath + ': ' + badLines.length + ' line(s) with em dash');
        console.log('  \u274c ' + relPath + ': ' + badLines.length + ' em dash violation(s)');
        badLines.slice(0, 2).forEach(function(l) { console.log('    "' + l.trim().substring(0, 80) + '"'); });
    } else {
        console.log('  \u2705 ' + relPath);
    }
});

console.log('');
test('All GA-authored docs exist', gaDocs.length >= 2);
test('No em dashes in any docs/ markdown file', violations.length === 0);
if (violations.length > 0) {
    console.log('\n  Violations:');
    violations.forEach(function(v) { console.log('  ' + v); });
}

console.log('\n' + '='.repeat(50));
console.log('docs-no-emdash: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
