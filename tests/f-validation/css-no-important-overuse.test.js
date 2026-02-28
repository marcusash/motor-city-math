// css-no-important-overuse test
// !important should be used sparingly in shared/styles.css
// Excessive !important makes styles hard to maintain and override

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-no-important-overuse.test.js\n');

var cssSrc = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

var importantCount = (cssSrc.match(/!important/g) || []).length;

console.log('\u2500\u2500 !important usage audit \u2500\u2500\n');
console.log('  !important count: ' + importantCount);

// Allow up to 15 !important (reduced-motion, print, etc. are legitimate)
test('!important used sparingly (<15 times): ' + importantCount, importantCount < 15);

// Identify which lines use !important
var lines = cssSrc.split('\n');
var importantLines = lines.filter(function(l) { return l.includes('!important'); });
if (importantLines.length <= 10) {
    importantLines.forEach(function(l) { console.log('  > ' + l.trim()); });
}

console.log('\n' + '='.repeat(50));
console.log('css-no-important-overuse: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
