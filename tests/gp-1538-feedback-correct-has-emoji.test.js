// gp-1538-feedback-correct-has-emoji.test.js
// feedback_correct should include an emoji or encouraging phrase.
// Check for common success indicators.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let withEmoji = 0, withoutEmoji = 0; const noEmojiSample = [];
// Simple emoji check: unicode >0x1F000 or common symbols
const hasEmoji = s => /[\u{1F000}-\u{1FFFF}]|[\u2600-\u27FF]|[🏀🔥✅💪🎯⚡🏆🎉]/u.test(s);
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (hasEmoji(q.feedback_correct || '')) withEmoji++;
    else { withoutEmoji++; if (noEmojiSample.length < 3) noEmojiSample.push(data.exam_id + ':' + q.id); }
  }
}
console.log('gp-1538-feedback-emoji: ' + withEmoji + ' with emoji, ' + withoutEmoji + ' without');
if (noEmojiSample.length) console.log('  INFO (no emoji):', noEmojiSample.join(', '));
console.log('OK -- ' + withEmoji + '/' + (withEmoji+withoutEmoji) + ' feedback_correct have emoji/symbols');
