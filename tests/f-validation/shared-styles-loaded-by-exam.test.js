// shared-styles-loaded-by-exam test
// exam.html must load shared/styles.css
// Without shared styles, exam UI breaks (colors, layout, typography all gone)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} shared-styles-loaded-by-exam.test.js\n');

var examSrc  = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');
var indexSrc = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf-8');

console.log('\u2500\u2500 Shared styles loading checks \u2500\u2500\n');

// exam.html loads shared/styles.css
var examLoadsStyles = examSrc.includes('shared/styles.css') || examSrc.includes('shared\\styles.css');
test('exam.html loads shared/styles.css', examLoadsStyles);

// index.html loads shared/styles.css
var indexLoadsStyles = indexSrc.includes('shared/styles.css') || indexSrc.includes('shared\\styles.css');
test('index.html loads shared/styles.css', indexLoadsStyles);

// Link rel=stylesheet used (not inline)
var usesLinkTag = examSrc.includes('<link') && examSrc.includes('stylesheet') && examSrc.includes('shared/styles');
test('shared/styles.css loaded via <link rel=stylesheet>', usesLinkTag);

console.log('\n' + '='.repeat(50));
console.log('shared-styles-loaded-by-exam: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
