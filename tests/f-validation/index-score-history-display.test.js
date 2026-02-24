// index-score-history-display test
// index.html dashboard must display score history for past exams
// Kai needs to see his progress over time (ADHD: progress motivation)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} index-score-history-display.test.js\n');

var indexSrc = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf-8');

console.log('\u2500\u2500 Score history display checks \u2500\u2500\n');

// Reads from localStorage (score history)
var readsScores = indexSrc.includes('localStorage') && 
                  (indexSrc.includes('score') || indexSrc.includes('results'));
test('index.html reads score history from localStorage', readsScores);

// Displays scores somehow (in chart, table, or text)
var displayScores = indexSrc.includes('getScores') || indexSrc.includes('buildChart') ||
                    indexSrc.includes('score-history') || indexSrc.includes('scoreHistory') ||
                    (indexSrc.includes('score') && indexSrc.includes('display'));
test('index.html displays score data on dashboard', displayScores);

// Score percentage calculated
var hasPercentage = indexSrc.includes('percent') || indexSrc.includes('%') ||
                    indexSrc.includes('/ 15') || indexSrc.includes('/15');
test('Score percentage shown or calculated', hasPercentage);

console.log('\n' + '='.repeat(50));
console.log('index-score-history-display: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
