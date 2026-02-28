// rp-question-html-no-empty-p test
// question_html should not contain empty <p></p> or <p> </p> tags
// Empty paragraphs cause layout gaps and look broken to Kai

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-question-html-no-empty-p.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var emptyP = /<p>\s*<\/p>/;
var violations = [];

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        if (emptyP.test(q.question_html || '')) {
            violations.push('rp' + i + ' ' + q.id + ': empty <p></p> in question_html');
        }
    });
}

console.log('\u2500\u2500 Empty paragraph checks \u2500\u2500\n');
if (violations.length) violations.slice(0, 5).forEach(function(v) { console.log('  ! ' + v); });

test('No empty <p></p> tags in question_html (' + violations.length + ' violations)', violations.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-question-html-no-empty-p: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
