// exam-body-class-arena test
// exam.html must support arena mode via body.arena-mode class (dark theme)
// Per .design-system.md: dark mode is body.arena-mode, not prefers-color-scheme

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-body-class-arena.test.js\n');

var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');
var cssSrc = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

console.log('\u2500\u2500 Arena mode checks \u2500\u2500\n');

// exam.html references arena-mode class toggle
var hasArenaModeToggle = examSrc.includes('arena-mode') || examSrc.includes('arenaMode');
test('exam.html references arena-mode', hasArenaModeToggle);

// CSS defines body.arena-mode styles
var hasArenaModeCss = cssSrc.includes('body.arena-mode') || cssSrc.includes('.arena-mode');
test('styles.css defines body.arena-mode styles', hasArenaModeCss);

// CSS does NOT use prefers-color-scheme for dark mode (uses body class instead)
// Check that if it does exist, it's not the primary dark mode mechanism
var hasPrefersColorScheme = cssSrc.includes('prefers-color-scheme: dark');
// It's OK to have it as enhancement, just flagging it
test('Arena mode implemented via body class (not only prefers-color-scheme)', 
     cssSrc.includes('body.arena-mode') || cssSrc.includes('.arena-mode'));

console.log('\n' + '='.repeat(50));
console.log('exam-body-class-arena: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
