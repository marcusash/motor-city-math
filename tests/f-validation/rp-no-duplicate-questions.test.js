// rp-no-duplicate-questions test
// question_html strings must be unique within an exam
// Duplicate question text suggests a copy-paste error -- Kai gets the same question twice

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-no-duplicate-questions.test.js\n');

var dataDir = path.join(__dirname, '../../data');

console.log('\u2500\u2500 Duplicate question_html checks \u2500\u2500\n');

var allGood = true;
for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    var htmls = (rp.questions || []).map(function(q) { return (q.question_html || '').trim().toLowerCase().substring(0, 80); });
    var seen = {};
    var dups = [];
    htmls.forEach(function(h, idx) {
        if (h && seen[h] !== undefined) {
            dups.push('q' + (idx+1) + ' duplicates q' + (seen[h]+1));
        } else {
            seen[h] = idx;
        }
    });
    if (dups.length > 0) {
        dups.forEach(function(d) { console.log('  ! rp' + i + ': ' + d); });
        allGood = false;
    }
    test('rp' + i + ': no duplicate question_html', dups.length === 0);
}

console.log('\n' + '='.repeat(50));
console.log('rp-no-duplicate-questions: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
