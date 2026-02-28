// WCAG contrast token lock test
// Locks the color token values that GD verified pass WCAG 2.1 AA in both light and dark mode
// If any token changes, this test fails -- preventing silent contrast regressions

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} wcag-contrast-token-lock.test.js\n');

var cssSrc = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

console.log('\u2500\u2500 WCAG-verified token values (GD audit 2026-02-24) \u2500\u2500\n');

function tokenVal(name) {
    var re = new RegExp(name + '\\s*:\\s*(#[0-9a-fA-F]{3,6})');
    var m = cssSrc.match(re);
    return m ? m[1].toUpperCase() : null;
}

// Light mode tokens (all verified PASS by GD)
test('--bg-page is #F4F5F9 (light mode base, 14.91:1 with text-primary)', tokenVal('--bg-page') === '#F4F5F9');
test('--text-primary is #1A1F36 (15.42:1 on bg-input)', tokenVal('--text-primary') === '#1A1F36');
test('--text-secondary is #5E6378 (5.46:1 on bg-page)', tokenVal('--text-secondary') === '#5E6378');
test('--color-correct is #1B7D3A (5.03:1 on color-correct-bg)', tokenVal('--color-correct') === '#1B7D3A');
test('--color-incorrect is #C8102E (5.50:1 on color-incorrect-bg)', tokenVal('--color-incorrect') === '#C8102E');

console.log('\n' + '='.repeat(50));
console.log('wcag-contrast-token-lock: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
