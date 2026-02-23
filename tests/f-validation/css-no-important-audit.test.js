// CSS !important audit: only @media print should use !important
// KaTeX font override is a known exception (documented in shared/styles.css)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-no-important-audit.test.js\n');

const src = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');
const lines = src.split('\n');

// Find !important uses outside @media print
var outsidePrint = [];
var inPrint = false;
var depth = 0;
lines.forEach(function(line, i) {
    if (line.includes('@media print')) { inPrint = true; depth = 0; }
    if (inPrint) {
        depth += (line.match(/\{/g) || []).length;
        depth -= (line.match(/\}/g) || []).length;
        if (depth <= 0) inPrint = false;
    }
    if (line.includes('!important') && !inPrint && !line.includes('@media print')) {
        outsidePrint.push({ line: i + 1, text: line.trim() });
    }
});

// KaTeX font override is the only known exception
var knownExceptions = outsidePrint.filter(function(x) { return x.text.includes('KaTeX'); });
var unexpectedImportants = outsidePrint.filter(function(x) { return !x.text.includes('KaTeX'); });

console.log('\u2500\u2500 !important usage outside @media print \u2500\u2500');
console.log('  Total: ' + outsidePrint.length + ' (known KaTeX exception: ' + knownExceptions.length + ')');
outsidePrint.forEach(function(x) {
    var tag = x.text.includes('KaTeX') ? '[OK - KaTeX exception]' : '[UNEXPECTED]';
    console.log('  L' + x.line + ': ' + tag + ' ' + x.text.substring(0, 70));
});
console.log();

test('@media print block has at least one !important rule', src.includes('@media print') && src.includes('!important'));
test('No unexpected !important outside @media print', unexpectedImportants.length === 0);
test('Known exception: max 1 KaTeX font !important', knownExceptions.length <= 1);

// Also check exam.html inline styles don't use !important (except print)
var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');
var examInlineImportant = (examSrc.match(/style="[^"]*!important/g) || []).length;
test('exam.html has no !important in inline style= attributes', examInlineImportant === 0);

// @media print block exists in shared/styles.css
test('@media print block exists in shared/styles.css', src.includes('@media print'));

console.log('\n' + '='.repeat(50));
console.log('css-no-important-audit: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
