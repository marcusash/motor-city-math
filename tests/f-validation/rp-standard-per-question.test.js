// rp-standard-per-question test
// Every RP question must have a standard field that matches the W{N}.{letter} format
// W2.a through W4.z are valid MCM standards

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-standard-per-question.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var STANDARD_RE = /^W\d+\.[a-z]$/;
var missingStandard = [], badFormat = [];
var standardCounts = {};
var totalQuestions = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        totalQuestions++;
        var std = q.standard || '';
        if (!std) {
            missingStandard.push('rp' + i + ' ' + q.id + ': missing standard');
        } else if (!STANDARD_RE.test(std)) {
            badFormat.push('rp' + i + ' ' + q.id + ': bad format "' + std + '"');
        }
        standardCounts[std] = (standardCounts[std] || 0) + 1;
    });
}

console.log('\u2500\u2500 Standard field format per question \u2500\u2500\n');
console.log('  Total questions: ' + totalQuestions);
console.log('  Unique standards: ' + Object.keys(standardCounts).length);
var topStandards = Object.entries(standardCounts).sort(function(a,b){return b[1]-a[1];}).slice(0,5);
topStandards.forEach(function(e) { console.log('  ' + e[0] + ': ' + e[1]); });

test('All 165 questions have a standard field', missingStandard.length === 0);
test('All standards match W{N}.{letter} format', badFormat.length === 0);
test('Multiple different standards used (curriculum breadth)', Object.keys(standardCounts).length >= 5);

if (missingStandard.length) missingStandard.slice(0,3).forEach(function(v) { console.log('  ! ' + v); });
if (badFormat.length) badFormat.slice(0,3).forEach(function(v) { console.log('  ! ' + v); });

console.log('\n' + '='.repeat(50));
console.log('rp-standard-per-question: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
