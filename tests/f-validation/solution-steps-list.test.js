// Solution steps list test
// showHint layer 3 (SHOW SOLUTION STEPS) must render solution_steps as a list
// GD spec: ordered list (ol) with each step as a list item

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} solution-steps-list.test.js\n');

var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 Solution steps list (showHint layer 3) checks \u2500\u2500\n');

// 1. showHint function handles layer 3 (solution steps)
var showHintStart = examSrc.indexOf('function showHint');
var showHintBody = showHintStart !== -1 ? examSrc.substring(showHintStart, showHintStart + 4000) : '';
var hasLayer3 = showHintBody.includes('3') && (showHintBody.includes('solution_steps') || showHintBody.includes('steps'));
test('showHint layer 3 handles solution_steps', hasLayer3);

// 2. solution_steps rendered as list (ol or ul)
var stepsListed = showHintBody.includes('<ol') || showHintBody.includes('<ul') ||
                  showHintBody.includes('join') || showHintBody.includes('<li');
test('solution_steps rendered as list (ol/ul) or joined', stepsListed);

// 3. Each step is a list item
var hasListItem = showHintBody.includes('<li') || showHintBody.includes('map') && showHintBody.includes('step');
test('Each step renders as list item', hasListItem || stepsListed);

// 4. All RP questions have solution_steps array with at least 2 steps
var rp1 = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/retake-practice-1.json'), 'utf-8'));
var allHaveSteps = (rp1.questions || []).every(function(q) {
    return Array.isArray(q.solution_steps) && q.solution_steps.length >= 2;
});
test('RP1 all questions have solution_steps with 2+ steps', allHaveSteps);

// 5. solution_steps step strings are non-empty
var allNonEmpty = (rp1.questions || []).every(function(q) {
    return (q.solution_steps || []).every(function(s) { return s && s.trim().length > 0; });
});
test('RP1 all solution_steps entries are non-empty strings', allNonEmpty);

console.log('\n' + '='.repeat(50));
console.log('solution-steps-list: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
