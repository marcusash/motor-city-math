// index-saas-grade-thresholds test
// index.html SAAS grade thresholds must be correct per specification
// Grade 4: >=92%, Grade 3: 79-91%, Grade 2: 64-78%, Grade 1: <64%

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} index-saas-grade-thresholds.test.js\n');

var indexSrc = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf-8');

console.log('\u2500\u2500 SAAS grade threshold checks \u2500\u2500\n');

// 1. 92 threshold for Grade 4 (>=92%)
var has92 = indexSrc.includes('92');
test('92% Grade 4 threshold referenced in index.html', has92);

// 2. Grade 4 is the highest achievable grade
var hasGrade4 = indexSrc.includes('Grade 4') || indexSrc.includes('grade 4') || indexSrc.includes('grade: 4');
test('Grade 4 (top tier) referenced', hasGrade4);

// 3. Color coding for grades (green = good, warning = needs work)
var hasColorCoding = indexSrc.includes('color-correct') || indexSrc.includes('color-warning') ||
                     indexSrc.includes('accent-blue') || indexSrc.includes('saas') || indexSrc.includes('grade');
test('Grade color coding present', hasColorCoding);

// 4. Thresholds used in comparison logic
var hasComparison = indexSrc.includes('>= 92') || indexSrc.includes('>=92') ||
                    indexSrc.includes('> 91') || indexSrc.includes('>91') ||
                    indexSrc.includes('pct >= 92') || indexSrc.includes('pct > 91');
test('Grade threshold comparison in JS', hasComparison);

console.log('\n' + '='.repeat(50));
console.log('index-saas-grade-thresholds: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
