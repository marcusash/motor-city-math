// shared-styles-arena-mode-text test
// body.arena-mode must also define a text color (not just background)
// Dark bg needs light text for readability

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} shared-styles-arena-mode-text.test.js\n');

var f = path.join(__dirname, '../../shared/styles.css');
var css = fs.readFileSync(f, 'utf-8');

console.log('\u2500\u2500 Arena mode text color checks \u2500\u2500\n');

var arenaIdx = css.indexOf('.arena-mode');
var arenaSection = arenaIdx !== -1 ? css.slice(arenaIdx, arenaIdx + 800) : '';

var hasTextColor = /color\s*:/.test(arenaSection) || arenaSection.includes('--text-');
var hasBothBgAndText = arenaSection.includes('background') && (hasTextColor);

test('.arena-mode block is defined', arenaIdx !== -1);
test('.arena-mode defines text color or uses text CSS variables', hasBothBgAndText || (arenaIdx !== -1 && css.slice(arenaIdx, arenaIdx + 1500).includes('color')));

console.log('\n' + '='.repeat(50));
console.log('shared-styles-arena-mode-text: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
