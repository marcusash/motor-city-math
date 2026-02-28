// Dashboard test history display test
// index.html must show Kai's past exam scores
// A score history table or list must be rendered per-exam

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} dashboard-score-history.test.js\n');

var indexSrc = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf-8');

console.log('\u2500\u2500 Dashboard score history checks \u2500\u2500\n');

// 1. Score history section exists (table, list, or chart)
var hasScoreHistory = indexSrc.includes('score') && 
                      (indexSrc.includes('history') || indexSrc.includes('attempts') || 
                       indexSrc.includes('chart') || indexSrc.includes('sparkline'));
test('Score history section exists in index.html', hasScoreHistory);

// 2. getScores function reads from localStorage
var hasGetScores = indexSrc.includes('getScores') || 
                   (indexSrc.includes('localStorage') && indexSrc.includes('score'));
test('getScores() or localStorage score read exists', hasGetScores);

// 3. For each exam, show last score or grade
var hasPerExamScore = indexSrc.includes('tests') && indexSrc.includes('score') && 
                      (indexSrc.includes('forEach') || indexSrc.includes('map'));
test('Per-exam score displayed (iterates over tests array)', hasPerExamScore);

// 4. Score displayed as percentage or grade label
var hasScoreDisplay = indexSrc.includes('pct') || indexSrc.includes('percent') ||
                      (indexSrc.includes('Grade') && indexSrc.includes('score'));
test('Score shown as percentage or Grade label', hasScoreDisplay);

// 5. Empty state handled (no scores yet)
var hasEmptyState = indexSrc.includes('No score') || indexSrc.includes('not taken') ||
                    indexSrc.includes('Start') || indexSrc.includes('attempts.length === 0') ||
                    indexSrc.includes('length < 1');
test('Empty state handled (no scores yet)', hasEmptyState);

console.log('\n' + '='.repeat(50));
console.log('dashboard-score-history: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
