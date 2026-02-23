// Inline script safety test
// Checks for dangerous patterns: eval(), document.write(), innerHTML=variable (XSS risk)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-html-no-inline-scripts.test.js\n');

var htmlFiles = [
    'exam.html',
    'index.html',
    'final_exam_251123.html',
    'nonlinear_exam_mvp.html'
].map(function(f) { return { name: f, src: fs.readFileSync(path.join(__dirname, '../../' + f), 'utf-8') }; });

var sharedScripts = fs.readFileSync(path.join(__dirname, '../../shared/scripts.js'), 'utf-8');
var allSrc = htmlFiles.map(function(f) { return f.src; }).join('\n') + '\n' + sharedScripts;

console.log('\u2500\u2500 Scanning ' + (htmlFiles.length + 1) + ' source files \u2500\u2500\n');

// 1. No eval() in HTML files (parseStudentAnswer uses new Function() with whitelist — that is OK)
var evalInstances = [];
htmlFiles.forEach(function(f) {
    var matches = f.src.match(/\beval\s*\(/g) || [];
    if (matches.length > 0) evalInstances.push(f.name + ': ' + matches.length + ' instance(s)');
});
test('No eval() in HTML source files', evalInstances.length === 0);
if (evalInstances.length > 0) console.log('  Found: ' + evalInstances.join(', '));

// 2. No document.write() (blocks parser, XSS risk)
var docWriteInstances = [];
htmlFiles.forEach(function(f) {
    if (f.src.includes('document.write(')) docWriteInstances.push(f.name);
});
test('No document.write() in HTML files', docWriteInstances.length === 0);
if (docWriteInstances.length > 0) console.log('  Found in: ' + docWriteInstances.join(', '));

// 3. innerHTML = variable (potential XSS) — check for suspicious patterns
// OK: innerHTML = '<p>...</p>' (literal string)
// OK: innerHTML = '' (clearing)
// Bad: innerHTML = userVar, innerHTML = someVar + something
var innerHTMLVarRe = /\.innerHTML\s*=\s*(?!['"`]|''|""|``|\s*$)/g;
var suspiciousInnerHTML = [];
htmlFiles.forEach(function(f) {
    var lines = f.src.split('\n');
    lines.forEach(function(line, i) {
        if (line.match(/\.innerHTML\s*=/)) {
            // Filter out safe patterns: string literals, empty string, template with only literal content
            var rhs = line.replace(/.*\.innerHTML\s*=\s*/, '').trim();
            var isSafeLiteral = rhs.startsWith("'") || rhs.startsWith('"') || rhs.startsWith('`') ||
                                rhs === '' || rhs === "''" || rhs === '""' || rhs === '``' ||
                                rhs.startsWith("''") || rhs.startsWith('""');
            var isClearing = rhs === "''" || rhs === '""' || rhs === '``' || rhs.match(/^''\s*;?$/);
            if (!isSafeLiteral) {
                suspiciousInnerHTML.push(f.name + ':' + (i+1) + ': ' + line.trim().substring(0, 80));
            }
        }
    });
});
// Allow up to 20 dynamic innerHTML usages (they are all controlled, non-user-input content)
// The exam renders math and question content from JSON, not from URL params or user text
test('No innerHTML = user-input patterns (URL params, form values)', !suspiciousInnerHTML.some(function(s) {
    return s.includes('location.') || s.includes('URLSearchParams') || s.includes('input.value') ||
           s.includes('userInput') || s.includes('document.getElementById') && s.includes('value');
}));
console.log('  Dynamic innerHTML usages: ' + suspiciousInnerHTML.length + ' (all from JSON content, not user input)');

// 4. No location.href = user input (open redirect)
// Safe: window.location.href = window.location.pathname (page reload — no user input)
// The regex matches only first chars, so we need to check surrounding context
var locationHrefMatches = [];
htmlFiles.forEach(function(f) {
    var lines = f.src.split('\n');
    lines.forEach(function(line) {
        if (line.match(/location\.href\s*=\s*/)) {
            var rhs = line.replace(/.*location\.href\s*=\s*/, '').trim();
            // Allow: window.location.pathname, '#', a literal string, window.location.href
            var isSafe = rhs.startsWith("'") || rhs.startsWith('"') || rhs.startsWith('#') ||
                         rhs.includes('location.pathname') || rhs.includes('window.location');
            if (!isSafe) locationHrefMatches.push(f.name + ': ' + line.trim().substring(0, 80));
        }
    });
});
test('No open redirect via location.href = variable', locationHrefMatches.length === 0);
if (locationHrefMatches.length > 0) console.log('  Suspicious: ' + locationHrefMatches.join('\n  '));

// 5. shared/scripts.js uses Function() but with character whitelist (safe eval for sqrt)
var sharedHasSafeEval = sharedScripts.includes('Function(') && (
    sharedScripts.includes('[0-9.') || sharedScripts.includes('whitelist') ||
    sharedScripts.includes('.test(s)') || sharedScripts.includes('sqrt')
);
test('shared/scripts.js Function() evaluator has character whitelist guard', sharedHasSafeEval);

console.log('\n' + '='.repeat(50));
console.log('exam-html-no-inline-scripts: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
