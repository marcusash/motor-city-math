// rp-question-html-word-count test
// Question HTML prompts should not be excessively long (Kai has ADHD)
// Max ~120 words per question to keep cognitive load manageable

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-question-html-word-count.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [];
var checked = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        if (!q.question_html) return;
        checked++;
        // Strip HTML tags and count words
        var text = q.question_html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
        var wordCount = text.split(' ').filter(function(w) { return w.length > 0; }).length;
        if (wordCount > 120) {
            violations.push('rp' + i + ' ' + q.id + ': ' + wordCount + ' words (max 120)');
        }
    });
}

console.log('\u2500\u2500 Question word count checks \u2500\u2500\n');
if (violations.length) violations.forEach(function(v) { console.log('  ! ' + v); });
console.log('  Questions checked: ' + checked);

test('All question prompts have <= 120 words (' + violations.length + ' violations)', violations.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-question-html-word-count: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
