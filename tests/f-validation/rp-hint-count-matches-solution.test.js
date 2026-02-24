// rp-hint-count-matches-solution test
// All questions with hints must have a non-empty hint string
// Hint system is a core ADHD support feature -- all hints must be substantive

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-hint-count-matches-solution.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var total = 0, withHint = 0, emptyHint = 0, shortHint = [];
var MIN_HINT_LENGTH = 10;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        total++;
        if (!q.hint) return;
        withHint++;
        var hintStr = typeof q.hint === 'string' ? q.hint : JSON.stringify(q.hint);
        if (hintStr.trim().length === 0) emptyHint++;
        else if (hintStr.trim().length < MIN_HINT_LENGTH) {
            shortHint.push('rp' + i + ' ' + q.id + ': hint too short (' + hintStr.length + ' chars)');
        }
    });
}

var hintPct = Math.round(withHint / total * 100);

console.log('\u2500\u2500 Hint coverage checks \u2500\u2500\n');
console.log('  Total questions: ' + total + ', with hints: ' + withHint + ' (' + hintPct + '%)');
if (shortHint.length) shortHint.forEach(function(v) { console.log('  ! ' + v); });

test('>=90% of questions have hints (' + hintPct + '%)', hintPct >= 90);
test('Zero empty hint strings', emptyHint === 0);
test('Zero hints under ' + MIN_HINT_LENGTH + ' chars', shortHint.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-hint-count-matches-solution: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
