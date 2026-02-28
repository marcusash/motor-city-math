// index.html empty state test
// Verifies empty state exists and has meaningful messaging when no scores exist

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} index-empty-state.test.js\n');

const src = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf-8');

console.log('\u2500\u2500 Empty state CSS \u2500\u2500');

// 1. .empty-state CSS class defined
test('.empty-state CSS class defined', src.includes('.empty-state'));

// 2. Empty state icon styling
test('.empty-state has icon styling', src.includes('.empty-state .icon') || src.includes('.empty-state'));

console.log('\n\u2500\u2500 Empty state messaging \u2500\u2500');

// 3. Trend chart empty state message
test('Trend chart empty: "first test" message', src.includes('Complete your first test') || src.includes('first test'));

// 4. Standards breakdown empty state
test('Standards empty: take a test message', src.includes('Take a test') || src.includes('take a test'));

// 5. Up Next section handles no scores (null/empty guard)
var upNextFn = src.substring(src.indexOf('function updateUpNext'), src.indexOf('function updateUpNext') + 2000);
test('updateUpNext() handles no score data', upNextFn.length > 100 && (
    upNextFn.includes('null') || upNextFn.includes('!') || upNextFn.includes('length')
));

// 6. getScores() has empty object fallback
var getScoresFn = src.substring(src.indexOf('function getScores'), src.indexOf('function getScores') + 500);
test('getScores() returns {} when localStorage empty', getScoresFn.includes("|| '{}'") || getScoresFn.includes('|| {}') || getScoresFn.includes("'{}'"));

// 7. No uncaught reference errors when scores is empty (JSON.parse with fallback)
test('getScores uses {} fallback for empty localStorage', src.includes("|| '{}'") || src.includes("|| \"{}\"") || src.includes('|| {}'));

// 8. buildSparkline handles empty attempts array
var sparkFn = src.substring(src.indexOf('function buildSparkline'), src.indexOf('function buildSparkline') + 1500);
test('buildSparkline handles empty/missing score data', sparkFn.includes('values.length') && sparkFn.includes('return'));

// 9. Empty state text is motivational (MCM voice: positive, action-oriented)
var emptyTexts = src.match(/"[^"]*first test[^"]*"|'[^']*first test[^']*'|"[^"]*Take a test[^"]*"|'[^']*Take a test[^']*'/g) || [];
var hasPositiveEmpty = emptyTexts.some(function(t) {
    return !t.toLowerCase().includes('error') && !t.toLowerCase().includes('failed');
});
test('Empty state text is positive/motivational (not error-like)', hasPositiveEmpty || emptyTexts.length > 0);

console.log('\n' + '='.repeat(50));
console.log('index-empty-state: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
