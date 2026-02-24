// rp-feedback-starts-with-emoji test
// Correct feedback should start with a positive emoji or affirmation
// Per MCM voice guide: celebrate wins with energy, not clinical responses

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-feedback-starts-with-emoji.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var noEmoji = [], totalQ = 0;
// Common celebration emojis/chars
var EMOJI_RE = /^(\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]|\u2705|\u2B50|\uD83C[\uDFC0-\uDFFF]|\uD83E[\uDD00-\uDDFF]|[\u2600-\u26FF]|[\u2700-\u27BF]|\uD83C\uDFAF)/;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        totalQ++;
        var fc = (q.feedback_correct || '').trim();
        if (fc && !EMOJI_RE.test(fc)) {
            noEmoji.push('rp' + i + ' ' + q.id + ': "' + fc.slice(0, 40) + '"');
        }
    });
}

console.log('\u2500\u2500 Feedback emoji checks \u2500\u2500\n');
if (noEmoji.length) {
    noEmoji.slice(0, 5).forEach(function(v) { console.log('  ! ' + v); });
    if (noEmoji.length > 5) console.log('  ... and ' + (noEmoji.length - 5) + ' more');
}

test('Total questions checked: ' + totalQ, totalQ >= 165);
// Allow up to 10% without leading emoji (some feedback uses text affirmations)
var threshold = Math.ceil(totalQ * 0.10);
test('>=90% of feedback_correct starts with emoji: ' + noEmoji.length + ' without', noEmoji.length <= threshold);

console.log('\n' + '='.repeat(50));
console.log('rp-feedback-starts-with-emoji: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
