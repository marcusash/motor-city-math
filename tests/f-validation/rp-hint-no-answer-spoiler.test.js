// rp-hint-no-answer-spoiler test
// Hint strings must not contain the numeric answer directly
// A hint like "The answer is 5" defeats the purpose of hints

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-hint-no-answer-spoiler.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var SPOILER_PATTERNS = ['the answer is', 'answer is ', 'answer =', 'answer: '];
var spoilers = [], total = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        if (!q.hint || typeof q.hint !== 'string') return;
        total++;
        var hintLower = q.hint.toLowerCase();
        SPOILER_PATTERNS.forEach(function(pattern) {
            if (hintLower.includes(pattern)) {
                spoilers.push('rp' + i + ' ' + q.id + ': hint contains "' + pattern + '"');
            }
        });
    });
}

console.log('\u2500\u2500 Hint spoiler checks \u2500\u2500\n');
if (spoilers.length) spoilers.forEach(function(v) { console.log('  ! ' + v); });

test('All ' + total + ' hints are spoiler-free (no "the answer is")', spoilers.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-hint-no-answer-spoiler: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
