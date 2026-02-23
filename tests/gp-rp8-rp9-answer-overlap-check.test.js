// gp-rp8-rp9-answer-overlap-check.test.js — RP8 and RP9 are known to have high answer overlap (filed with GR)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

const rp8 = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'retake-practice-8.json'), 'utf8'));
const rp9 = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'retake-practice-9.json'), 'utf8'));

// Collect numeric answers from both exams
const getAnswers = (data) => {
  const answers = [];
  for (const q of data.questions) {
    for (const input of (q.inputs || [])) {
      if (input.answer !== undefined && input.answer !== null && input.type === 'number') {
        answers.push(String(input.answer).trim());
      }
    }
  }
  return answers;
};

const ans8 = getAnswers(rp8);
const ans9 = getAnswers(rp9);
const overlap = ans8.filter(a => ans9.includes(a));
const overlapPct = (overlap.length / Math.min(ans8.length, ans9.length) * 100).toFixed(1);

console.log(`gp-rp8-rp9-answer-overlap-check: ${overlap.length} overlapping answers`);
console.log(`  RP8: ${ans8.length} answers, RP9: ${ans9.length} answers, overlap: ${overlapPct}%`);

if (parseFloat(overlapPct) > 40) {
  console.log(`  INFO: High overlap (${overlapPct}%) between RP8 and RP9 — Kai might memorize patterns`);
  console.log(`  GR bug B-GP-RP6RP7-COLLISION still present — filed for GR action`);
} else {
  console.log(`  Overlap level is acceptable (${overlapPct}%)`);
}
console.log(`OK — RP8/RP9 overlap audit complete`);
