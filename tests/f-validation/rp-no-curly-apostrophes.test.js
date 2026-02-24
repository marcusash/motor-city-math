// rp-no-curly-apostrophes test
// RP exam JSON content must not contain curly apostrophes (') or curly quotes ("")
// Curly quotes break KaTeX parsing and create display artifacts

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-no-curly-apostrophes.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [], totalQ = 0;
var CURLY = ['\u2018', '\u2019', '\u201c', '\u201d']; // '', ""

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        totalQ++;
        var fields = [q.question_html || '', q.feedback_correct || '', q.feedback_wrong || ''];
        (q.solution_steps || []).forEach(function(s) { fields.push(s); });
        (q.inputs || []).forEach(function(inp) {
            if (inp.label) fields.push(inp.label);
        });
        var combined = fields.join('\n');
        CURLY.forEach(function(ch) {
            if (combined.includes(ch)) {
                violations.push('rp' + i + ' ' + q.id + ': curly char U+' + ch.charCodeAt(0).toString(16).toUpperCase());
            }
        });
    });
}

console.log('\u2500\u2500 Curly quote checks \u2500\u2500\n');
if (violations.length) violations.forEach(function(v) { console.log('  ! ' + v); });

test('Total questions checked: ' + totalQ, totalQ >= 165);
test('No curly apostrophes or quotes in question content', violations.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-no-curly-apostrophes: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
