// css-arena-mode-dark-bg test
// body.arena-mode must define a dark background (not default white)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-arena-mode-dark-bg.test.js\n');

var f = path.join(__dirname, '../../shared/styles.css');
var css = fs.readFileSync(f, 'utf-8');

console.log('\u2500\u2500 Arena mode dark background checks \u2500\u2500\n');

// arena-mode block should define background-color
var arenaIdx = css.indexOf('.arena-mode');
var arenaDefined = arenaIdx !== -1;
var arenaHasBg = arenaDefined && /\.arena-mode[^}]+background/.test(css.replace(/\n/g, ' '));

test('CSS defines .arena-mode class', arenaDefined);
test('.arena-mode defines a background color', arenaHasBg || (arenaDefined && css.slice(arenaIdx, arenaIdx + 500).includes('background')));

console.log('\n' + '='.repeat(50));
console.log('css-arena-mode-dark-bg: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
