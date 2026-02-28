// exam-question-title-element test
// exam.html must render a question title/heading area
// Without a visible question number or heading, Kai loses his place

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-question-title-element.test.js\n');

var html = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

// Look for question title area -- h2, h3, or div with question-related class
var hasQuestionTitle = /<h[2-4][^>]*>|class\s*=\s*["'][^"']*question[^"']*title|class\s*=\s*["'][^"']*question[^"']*header/i.test(html);
// Also check for question number display
var hasQuestionNumber = /question-number|questionNumber|q-number|\.number/i.test(html);

test('exam.html has question title or header element', hasQuestionTitle || hasQuestionNumber);

console.log('\n' + '='.repeat(50));
console.log('exam-question-title-element: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
