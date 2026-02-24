// rp-radio-answer-valid-option test
// Radio questions: the answer field should match one of the option labels
// Mismatch means Kai can never get the question right

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-radio-answer-valid-option.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var mismatches = [];

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        (q.inputs || []).forEach(function(inp) {
            if (inp.type !== 'radio') return;
            if (!inp.answer || !inp.options) return;
            var optionTexts = inp.options.map(function(o) { return (o.text || '').trim(); });
            var optionIds   = inp.options.map(function(o) { return (o.id || '').trim(); });
            var ans = (inp.answer || '').trim();
            // q14 pattern: answer is "A"/"B"/"C"/"D" referencing option INDEX
            var letterMap = {'A':0,'B':1,'C':2,'D':3};
            var isLetterAnswer = ans.length === 1 && letterMap[ans] !== undefined;
            if (isLetterAnswer) {
                // Letter answers map to option by index -- valid if option exists at that index
                var optIdx = letterMap[ans];
                if (optIdx >= inp.options.length) {
                    mismatches.push('rp' + i + ' ' + q.id + ' inp=' + inp.id + ': letter answer "' + ans + '" out of range (only ' + inp.options.length + ' options)');
                }
                return; // letter-reference answers are valid
            }
            if (!optionTexts.includes(ans) && !optionIds.includes(ans)) {
                mismatches.push('rp' + i + ' ' + q.id + ' inp=' + inp.id + ': answer="' + ans + '" not in options=[' + optionTexts.slice(0,2).join(',') + '...]');
            }
        });
    });
}

console.log('\u2500\u2500 Radio answer vs options checks \u2500\u2500\n');
if (mismatches.length) mismatches.slice(0, 5).forEach(function(v) { console.log('  ! ' + v); });

test('All radio answers match a valid option (' + mismatches.length + ' violations)', mismatches.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-radio-answer-valid-option: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
