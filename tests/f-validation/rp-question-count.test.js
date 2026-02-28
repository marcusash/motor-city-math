// All RP exams have exactly 15 questions (regression lock)
// Catches truncated files, copy-paste errors, or partial saves

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-question-count.test.js\n');

const dataDir = path.join(__dirname, '../../data');
const examFiles = fs.readdirSync(dataDir).filter(function(f) {
    return f.match(/retake-practice-\d+\.json/);
}).sort();

console.log('\u2500\u2500 Question count per exam \u2500\u2500\n');

var wrongCount = [];
examFiles.forEach(function(file) {
    var data = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf-8'));
    var count = (data.questions || []).length;
    var ok = count === 15;
    console.log('  ' + (ok ? '\u2705' : '\u274c') + ' ' + file + ': ' + count + ' questions');
    if (!ok) wrongCount.push(file + ' (' + count + ')');
});

console.log('');
test('All ' + examFiles.length + ' RP exam files have exactly 15 questions', wrongCount.length === 0);
if (wrongCount.length > 0) {
    console.log('  Wrong count: ' + wrongCount.join(', '));
}
test('At least 11 RP exam files exist', examFiles.length >= 11);

console.log('\n' + '='.repeat(50));
console.log('rp-question-count: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
