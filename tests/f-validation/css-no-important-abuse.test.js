// css-no-important-abuse test
// !important overrides should be minimal (<=10) in shared CSS
// Excessive !important makes CSS fragile and hard to maintain

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-no-important-abuse.test.js\n');

var css = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

var importantCount = (css.match(/!important/g) || []).length;
var MAX_IMPORTANT = 10;

test('CSS has <= ' + MAX_IMPORTANT + ' !important overrides (actual: ' + importantCount + ')', importantCount <= MAX_IMPORTANT);
if (importantCount > MAX_IMPORTANT) {
    console.log('    ! ' + importantCount + ' !important usages is too many. Refactor specificity instead.');
}

console.log('\n' + '='.repeat(50));
console.log('css-no-important-abuse: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
