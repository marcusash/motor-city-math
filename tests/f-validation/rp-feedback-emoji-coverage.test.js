// rp-feedback-has-emoji test
// feedback_correct strings should have an emoji (per MCM voice guide)
// Emojis signal celebration and reinforce correct answers for Kai

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-feedback-emoji-coverage.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var EMOJI_RE = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{27BF}]|[\u{1F000}-\u{1FFFF}]/u;
var noEmoji = [], total = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        if (!q.feedback_correct) return;
        total++;
        if (!EMOJI_RE.test(q.feedback_correct)) {
            noEmoji.push('rp' + i + ' ' + q.id + ': "' + q.feedback_correct.substring(0, 50) + '"');
        }
    });
}

console.log('\u2500\u2500 Feedback emoji coverage checks \u2500\u2500\n');
if (noEmoji.length) {
    console.log('  ! ' + noEmoji.length + ' feedback_correct strings missing emoji:');
    noEmoji.slice(0, 5).forEach(function(v) { console.log('    ' + v); });
}

// Allow up to 10% without emoji (some may be intentionally plain)
var threshold = Math.ceil(total * 0.1);
test('Emoji coverage in feedback_correct: ' + (total - noEmoji.length) + '/' + total + ' (max ' + noEmoji.length + ' missing)', noEmoji.length <= threshold);

console.log('\n' + '='.repeat(50));
console.log('rp-feedback-emoji-coverage: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
