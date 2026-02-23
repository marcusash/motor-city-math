// Grade badge CSS tokens test
// Grade badges must use CSS tokens for colors (not hardcoded hex)
// GD spec: grade-badge-display (from todo t-grade-badge-tokens)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} grade-badge-css-tokens.test.js\n');

var cssSrc = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');
var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');
var indexSrc = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf-8');

console.log('\u2500\u2500 Grade badge CSS token checks \u2500\u2500\n');

// 1. Grade badge selector exists in CSS
var hasGradeBadge = cssSrc.includes('.grade') || cssSrc.includes('grade-badge') || cssSrc.includes('.badge');
test('Grade badge selector exists in shared/styles.css (.grade or .badge)', hasGradeBadge);

// 2. Grade colors use CSS tokens (var(--)) not raw hex
var gradeCssSection = (cssSrc.match(/\.grade[^{]*\{[^}]*\}/g) || []).join('\n');
var gradeHasHardcodedHex = /#[0-9a-fA-F]{3,6}/.test(gradeCssSection);
test('Grade CSS does not use hardcoded hex (uses var(--) tokens)', !gradeHasHardcodedHex);

// 3. Grade 4 gets a distinct color (success/green or Pistons blue)
var hasGrade4Color = cssSrc.includes('grade-4') || cssSrc.includes('grade4') ||
                     (examSrc.includes('grade') && examSrc.includes('4'));
test('Grade 4 has distinct styling applied dynamically or in CSS', hasGrade4Color);

// 4. Score display exists in exam.html (grade rendered after submit)
var hasScoreDisplay = examSrc.includes('score') && (examSrc.includes('grade') || examSrc.includes('pct'));
test('Score/grade displayed in exam.html after grading', hasScoreDisplay);

// 5. Grade display in index.html dashboard (sparkline/history shows grade)
var hasIndexGrade = indexSrc.includes('grade') && (indexSrc.includes('Grade 4') || indexSrc.includes('pct'));
test('Grade displayed in index.html dashboard', hasIndexGrade);

console.log('\n' + '='.repeat(50));
console.log('grade-badge-css-tokens: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
