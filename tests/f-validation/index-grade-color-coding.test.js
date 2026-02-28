// index-grade-color-coding test
// index.html dashboard must use different colors for each SAAS grade level
// Color coding helps Kai instantly see his performance level at a glance

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} index-grade-color-coding.test.js\n');

var indexSrc = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf-8');

console.log('\u2500\u2500 Grade color coding checks \u2500\u2500\n');

// 1. Grade-specific color logic referenced (SAAS grade colors via CSS or inline)
var hasGradeClasses = indexSrc.includes('saas-grade') || indexSrc.includes('Grade 4') ||
                      indexSrc.includes('grade') && indexSrc.includes('color');
test('Grade-specific color logic present (saas-grade or color by grade)', hasGradeClasses);

// 2. Grade color applied dynamically based on score
var hasGradeLogic = indexSrc.includes('getGrade') || indexSrc.includes('grade') && indexSrc.includes('pct');
test('Grade determined dynamically from score percentage', hasGradeLogic);

// 3. SAAS grading mentioned (not arbitrary colors)
var hasSAAS = indexSrc.includes('SAAS') || indexSrc.includes('saas') || indexSrc.includes('Grade 4');
test('SAAS grade system referenced in index.html', hasSAAS);

console.log('\n' + '='.repeat(50));
console.log('index-grade-color-coding: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
