// rp-hint-no-formula-giveaway test
// Hints should guide reasoning, not give away formulas directly
// Checks for hints that just state the answer formula verbatim

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-hint-no-formula-giveaway.test.js\n');

var dataDir = path.join(__dirname, '../../data');
// Patterns that suggest a hint is giving away the answer
var giveawayPatterns = [
    /the answer is/i,
    /answer:\s*\d/i,
    // Note: "= <number>" at end is intentionally NOT flagged -- pedagogical
    // hints often show formulas that guide (not give away) the solution
];
var flagged = [];

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        if (!q.hint) return;
        giveawayPatterns.forEach(function(pattern) {
            if (pattern.test(q.hint)) {
                flagged.push('rp' + i + ' ' + q.id + ': hint may give away answer -- "' + q.hint.slice(0, 50) + '"');
            }
        });
    });
}

console.log('\u2500\u2500 Hint giveaway checks \u2500\u2500\n');
if (flagged.length) flagged.slice(0, 5).forEach(function(v) { console.log('  ! ' + v); });

test('No hints directly give away the answer (' + flagged.length + ' flags)', flagged.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-hint-no-formula-giveaway: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
