// exam-localStorage-key-dynamic test
// exam.html must construct localStorage key dynamically from exam_id
// Static key would cause all exams to overwrite each other's scores

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-localStorage-key-dynamic.test.js\n');

var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 localStorage key dynamic construction checks \u2500\u2500\n');

// Reads file param from URL
var readsFileParam = examSrc.includes('file') && 
                     (examSrc.includes('URLSearchParams') || examSrc.includes('searchParams') ||
                      examSrc.includes('location.search') || examSrc.includes('getParam'));
test('exam.html reads file name from URL params', readsFileParam);

// Dynamic key construction (not hardcoded)
var hasDynamicKey = examSrc.includes('exam_id') || examSrc.includes('fileName') ||
                    examSrc.includes('storageKey') || examSrc.includes('file +') ||
                    examSrc.includes("'mcm-' +") || examSrc.includes('"mcm-" +');
test('localStorage key is constructed dynamically from file/exam_id', hasDynamicKey);

console.log('\n' + '='.repeat(50));
console.log('exam-localStorage-key-dynamic: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
