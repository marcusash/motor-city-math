// rp-word-problem-characters test
// Section D word problems (q15) should not be excessively long
// ADHD rule: max 100 words per question_html -- no walls of text

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-word-problem-characters.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var tooLong = [], checked = 0;
var MAX_WORDS = 100;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    // Section D is last section, q15 is word problem
    var sectionD = (rp.questions || []).filter(function(q) { return q.section === 'D'; });
    sectionD.forEach(function(q) {
        var html = q.question_html || '';
        // Strip HTML tags for word count
        var text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
        var words = text.split(' ').length;
        checked++;
        if (words > MAX_WORDS) {
            tooLong.push('rp' + i + ' ' + q.id + ': ' + words + ' words');
        }
    });
}

console.log('\u2500\u2500 Word problem length checks \u2500\u2500\n');
if (tooLong.length) tooLong.forEach(function(v) { console.log('  ! ' + v); });

test('Section D word problems checked: ' + checked, checked >= 11);
test('All Section D questions <=100 words (ADHD: no text walls)', tooLong.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-word-problem-characters: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
