// index-last-score-display test
// index.html must display the last score for each exam in the dashboard
// Kai needs to see his most recent result to know where he stands

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} index-last-score-display.test.js\n');

var indexSrc = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf-8');

console.log('\u2500\u2500 Last score display checks \u2500\u2500\n');

// 1. References localStorage to fetch scores
var hasLocalStorage = indexSrc.includes('localStorage') && indexSrc.includes('getItem');
test('Uses localStorage.getItem to fetch scores', hasLocalStorage);

// 2. Displays score percentage or fraction somewhere in dashboard
var hasScoreDisplay = indexSrc.includes('score') && (indexSrc.includes('%') || indexSrc.includes('/15'));
test('Score display (percentage or /15) referenced', hasScoreDisplay);

// 3. Last attempt vs best score distinction
var hasLastScore = indexSrc.includes('last') || indexSrc.includes('recent') || indexSrc.includes('latest');
test('Last/recent score concept present', hasLastScore);

console.log('\n' + '='.repeat(50));
console.log('index-last-score-display: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
