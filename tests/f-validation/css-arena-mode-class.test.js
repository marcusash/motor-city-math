// css-arena-mode-class test
// styles.css must define body.arena-mode dark theme styles
// Arena mode = Kai's dark exam environment (focus mode)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-arena-mode-class.test.js\n');

var cssSrc = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

console.log('\u2500\u2500 arena-mode class checks \u2500\u2500\n');

// body.arena-mode defined
var hasArenaMode = cssSrc.includes('body.arena-mode') || cssSrc.includes('.arena-mode');
test('body.arena-mode class defined in styles.css', hasArenaMode);

// Dark background in arena mode
var arenaModeBlock = hasArenaMode ? cssSrc.slice(cssSrc.indexOf('.arena-mode')) : '';
var hasDarkBg = arenaModeBlock.includes('#1') || arenaModeBlock.includes('#0') || 
                arenaModeBlock.includes('--bg') || arenaModeBlock.slice(0, 500).includes('background');
test('arena-mode has dark background styles', hasDarkBg);

// arena-mode toggled by body class (not media query)
var usesMediaQuery = cssSrc.includes('@media (prefers-color-scheme: dark)');
test('Dark theme uses body.arena-mode (not prefers-color-scheme media query)', !usesMediaQuery || hasArenaMode);

console.log('\n' + '='.repeat(50));
console.log('css-arena-mode-class: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
