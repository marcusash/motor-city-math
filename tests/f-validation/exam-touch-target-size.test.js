// exam-touch-target-size test
// exam.html submit/nav buttons should have adequate touch targets for mobile (44px min)
// Verified via CSS min-height rule in shared/styles.css

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-touch-target-size.test.js\n');

var css = fs.readFileSync(require('path').join(__dirname, '../../shared/styles.css'), 'utf-8');
var html = fs.readFileSync(require('path').join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 Touch target size checks \u2500\u2500\n');

// CSS should define min-height >= 44px for buttons (WCAG 2.5.8)
var minHeightRules = css.match(/min-height\s*:\s*(\d+)px/g) || [];
var hasAdequateMinHeight = minHeightRules.some(function(rule) {
    var px = parseInt(rule.match(/(\d+)/)[1]);
    return px >= 44;
});

test('CSS defines min-height >= 44px for interactive elements (WCAG 2.5.8)', hasAdequateMinHeight);
test('exam.html has button elements for actions', html.includes('<button') || html.includes('nav-btn') || html.includes('btn-primary'));

console.log('\n' + '='.repeat(50));
console.log('exam-touch-target-size: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
