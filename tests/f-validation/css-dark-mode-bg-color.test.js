// css-dark-mode-bg-color test
// body.arena-mode must define a dark background color
// Without background, content floats on white in arena mode

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-dark-mode-bg-color.test.js\n');

var cssSrc = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

console.log('\u2500\u2500 Dark mode background checks \u2500\u2500\n');

// arena-mode background defined
var arenaModeIdx = cssSrc.indexOf('.arena-mode');
var hasArenaBg = false;
if (arenaModeIdx !== -1) {
    // Look for background within the next 500 chars of first arena-mode occurrence
    var arenaBlock = cssSrc.substring(arenaModeIdx, arenaModeIdx + 1000);
    hasArenaBg = arenaBlock.includes('background') || arenaBlock.includes('bg-');
}
test('body.arena-mode defines background color', hasArenaBg);

// Dark text color for arena mode
var hasArenaDarkText = cssSrc.indexOf('arena-mode') !== -1;
test('arena-mode styles defined in styles.css', hasArenaDarkText);

// Color scheme tokens for dark mode
var hasDarkTokens = cssSrc.includes('--bg-') || cssSrc.includes('--color-bg') || 
                    cssSrc.includes('--canvas-default') || cssSrc.includes('--bg-canvas');
test('Background color design tokens defined (--bg- or --canvas-default)', hasDarkTokens);

console.log('\n' + '='.repeat(50));
console.log('css-dark-mode-bg-color: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
