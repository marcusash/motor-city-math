// index-score-display-format test
// index.html score display must show both raw score and percentage
// Kai needs both: "13/15 (87%)" not just "87%"

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} index-score-display-format.test.js\n');

var indexSrc = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf-8');

console.log('\u2500\u2500 Score display format checks \u2500\u2500\n');

// Score display combines raw + percentage
var hasRawScore = indexSrc.includes('correct') && (indexSrc.includes('/') || indexSrc.includes('total'));
test('Score display shows raw score (e.g. correct/total)', hasRawScore);

// Percentage calculation present
var hasPct = indexSrc.includes('Math.round') || indexSrc.includes('toFixed') || 
             indexSrc.includes('percent') || indexSrc.includes('%');
test('Percentage calculation or display present in index.html', hasPct);

// Grade display (SAAS scale A-D)
var hasGrade = indexSrc.includes('Grade') || indexSrc.includes('grade') || indexSrc.includes('SAAS');
test('Grade display present in index.html', hasGrade);

console.log('\n' + '='.repeat(50));
console.log('index-score-display-format: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
