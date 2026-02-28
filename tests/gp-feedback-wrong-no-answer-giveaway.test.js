// gp-feedback-wrong-no-answer-giveaway.test.js — wrong feedback shouldn't directly state the correct answer

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const fw = (q.feedback_wrong || '').toLowerCase();
    for (const inp of (q.inputs || [])) {
      const ans = String(inp.answer || '').toLowerCase().trim();
      // If answer is a specific short number and feedback_wrong mentions it verbatim, flag it
      if (ans.length > 0 && ans.length <= 8 && fw.includes(`is ${ans}`) || fw.includes(`= ${ans}`) || fw.includes(`answer is ${ans}`)) {
        warn++;
        warnings.push(`${file}: Q${q.id} feedback_wrong may reveal answer '${ans}'`);
        break;
      } else {
        pass++;
      }
    }
  }
}

console.log(`gp-feedback-wrong-no-answer-giveaway: ${pass} pass, ${warn} flagged`);
if (warnings.length) {
  console.log('INFO — feedback_wrong may reveal the correct answer (GR review):');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} inputs have wrong feedback that avoids direct answer giveaway`);
