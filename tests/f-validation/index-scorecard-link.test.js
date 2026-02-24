// index-scorecard-link test
// index.html must have a link or button to open the scorecard view
// Without it, Kai can't access his grade history

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} index-scorecard-link.test.js\n');

var html = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf-8');

// Scorecard can be a link to scorecard.html, inline section, or chart
var hasScorecard = /scorecard\.html|scorecard|score-card|view-scores|viewScores|grade-history|chart|grades|performance|history/i.test(html);

test('index.html links to or includes a scorecard/score history', hasScorecard);
if (!hasScorecard) console.log('    ! No scorecard reference found. Kai needs score history access.');

console.log('\n' + '='.repeat(50));
console.log('index-scorecard-link: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
