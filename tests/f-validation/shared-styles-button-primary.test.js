// shared-styles-button-primary test
// shared/styles.css must define .btn-primary class (the main CTA button)
// exam.html submit button uses .btn-primary

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} shared-styles-button-primary.test.js\n');

var css = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');
var examHtml = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 .btn-primary class checks \u2500\u2500\n');

var hasBtnPrimary = css.includes('.btn-primary');
var examUsesBtnPrimary = examHtml.includes('btn-primary');
var btnHasBackground = hasBtnPrimary && css.includes('.btn-primary') &&
    /\.btn-primary\s*\{[^}]*background/.test(css);

test('CSS defines .btn-primary class', hasBtnPrimary);
test('exam.html uses .btn-primary class', examUsesBtnPrimary);
test('.btn-primary has background property defined', btnHasBackground);

console.log('\n' + '='.repeat(50));
console.log('shared-styles-button-primary: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
