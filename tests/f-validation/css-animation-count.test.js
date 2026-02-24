// css-animation-count test
// shared/styles.css should have CSS animations defined (@keyframes)
// Animations provide ADHD-friendly micro-feedback (progress, correct answers)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-animation-count.test.js\n');

var css = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

var keyframeCount = (css.match(/@keyframes\s+\w+/g) || []).length;
var animationUsage = (css.match(/animation\s*:/g) || []).length;

test('CSS defines at least 2 @keyframes animations', keyframeCount >= 2);
test('CSS uses animation: property at least once', animationUsage >= 1);
console.log('  @keyframes count: ' + keyframeCount + ', animation: usages: ' + animationUsage);

console.log('\n' + '='.repeat(50));
console.log('css-animation-count: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
