// gp-no-emoji-in-answer.test.js — answer fields should be plain text/numbers, not emoji

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

// Basic emoji range detection
const EMOJI_PATTERN = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{27BF}]/u;

let pass = 0;
let fail = 0;
const issues = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    for (const inp of (q.inputs || [])) {
      const ans = String(inp.answer || '');
      if (EMOJI_PATTERN.test(ans)) {
        fail++;
        issues.push(`${file}: Q${q.id} '${inp.id}' answer contains emoji: '${ans}'`);
      } else {
        pass++;
      }
    }
  }
}

console.log(`gp-no-emoji-in-answer: ${pass} pass, ${fail} fail`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
  process.exit(1);
}
console.log(`OK — ${pass} answer fields contain no emoji`);
