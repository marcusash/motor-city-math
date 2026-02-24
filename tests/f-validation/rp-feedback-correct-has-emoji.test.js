// rp-feedback-correct-has-emoji test
// feedback_correct strings should start with a positive emoji
// Emoji at the start creates immediate positive signal for Kai (ADHD design)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-feedback-correct-has-emoji.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var noEmoji = [], total = 0;
// Common positive emojis for correct feedback
var EMOJI_RE = /^[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F000}-\u{1FFFF}]/u;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        var fb = q.feedback_correct;
        if (!fb) return;
        total++;
        if (!EMOJI_RE.test(fb.trim())) {
            noEmoji.push('rp' + i + ' ' + q.id + ': "' + fb.substring(0, 40) + '"');
        }
    });
}

console.log('\u2500\u2500 Feedback correct emoji checks \u2500\u2500\n');
var pct = Math.round(((total - noEmoji.length) / total) * 100);
if (noEmoji.length > 0) {
    noEmoji.slice(0, 5).forEach(function(v) { console.log('  ! ' + v); });
    if (noEmoji.length > 5) console.log('  ... and ' + (noEmoji.length - 5) + ' more');
}

// 80% threshold -- some edge cases may be intentional
test(pct + '% of feedback_correct strings start with emoji (>=80% required)', pct >= 80);

console.log('\n' + '='.repeat(50));
console.log('rp-feedback-correct-has-emoji: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
