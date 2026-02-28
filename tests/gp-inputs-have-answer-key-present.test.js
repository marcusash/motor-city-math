// gp-inputs-have-answer-key-present.test.js — track what percent of inputs have answer key (soft gate)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let withAnswer = 0;
let withoutAnswer = 0;

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    for (const inp of (q.inputs || [])) {
      if (inp.answer !== undefined && inp.answer !== null) {
        withAnswer++;
      } else {
        withoutAnswer++;
      }
    }
  }
}

const pct = Math.round(withAnswer / (withAnswer + withoutAnswer) * 100);
console.log(`gp-inputs-have-answer-key-present: ${withAnswer} with answer, ${withoutAnswer} without`);
console.log(`  Coverage: ${pct}% (${withAnswer}/${withAnswer + withoutAnswer} inputs have answer)`);
if (pct < 80) {
  console.log(`  WARN: answer coverage ${pct}% is below 80% threshold — grading unreliable`);
}
console.log(`OK — answer key coverage: ${pct}%`);
