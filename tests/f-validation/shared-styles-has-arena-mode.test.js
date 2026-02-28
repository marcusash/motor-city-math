// shared-styles-has-arena-mode test
// shared/styles.css must define the .arena-mode dark mode variant
// arena-mode is the dark mode trigger (not prefers-color-scheme)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} shared-styles-has-arena-mode.test.js\n');

var css = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

var hasArenaMode = /\.arena-mode/.test(css);
var arenaModeCount = (css.match(/\.arena-mode/g) || []).length;

test('CSS defines .arena-mode dark mode class', hasArenaMode);
test('.arena-mode is used multiple times (>= 3)', arenaModeCount >= 3);
console.log('  .arena-mode occurrences: ' + arenaModeCount);

console.log('\n' + '='.repeat(50));
console.log('shared-styles-has-arena-mode: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
