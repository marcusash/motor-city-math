// Exam question ID uniqueness test
// No duplicate IDs within any RP exam JSON file

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-question-id-uniqueness.test.js\n');

const dataDir = path.join(__dirname, '../../data');
const examFiles = fs.readdirSync(dataDir).filter(function(f) {
    return f.match(/retake-practice-\d+\.json/);
}).sort();

console.log('\u2500\u2500 Scanning ' + examFiles.length + ' exam files \u2500\u2500\n');

var totalFiles = 0;
var filesWithDups = [];

examFiles.forEach(function(file) {
    var data = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf-8'));
    var questions = data.questions || [];
    var ids = questions.map(function(q) { return q.id; });
    var seen = {};
    var dups = [];
    ids.forEach(function(id) {
        if (seen[id]) dups.push(id);
        seen[id] = true;
    });
    totalFiles++;
    if (dups.length > 0) {
        filesWithDups.push(file + ': dup IDs [' + dups.join(', ') + ']');
        console.log('  \u274c ' + file + ': ' + dups.length + ' duplicate IDs: ' + dups.join(', '));
    } else {
        console.log('  \u2705 ' + file + ': ' + questions.length + ' questions, all IDs unique');
    }
});

console.log('');
test('All exam files scanned (' + totalFiles + ' total)', totalFiles === examFiles.length);
test('No duplicate question IDs in any exam file', filesWithDups.length === 0);
if (filesWithDups.length > 0) {
    filesWithDups.forEach(function(f) { console.log('  Error: ' + f); });
}

// Bonus: IDs follow consistent format (rp{N}-q{N})
var allIds = [];
examFiles.forEach(function(file) {
    var data = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf-8'));
    (data.questions || []).forEach(function(q) { allIds.push(q.id); });
});
var badFormat = allIds.filter(function(id) { return !id || !id.match(/^rp\d+-q\d+$/); });
test('All question IDs follow rp{N}-q{N} format', badFormat.length === 0);
if (badFormat.length > 0) console.log('  Non-conforming IDs (' + badFormat.length + '): ' + badFormat.slice(0, 5).join(', '));

console.log('\n' + '='.repeat(50));
console.log('exam-question-id-uniqueness: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
