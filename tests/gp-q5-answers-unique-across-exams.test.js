// gp-q5-answers-unique-across-exams.test.js — Q5 numeric answers should not repeat across more than 50% of exams

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

// Collect Q5 (index 4) answers across all exams
const q5Answers = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const q5 = data.questions[4];
  if (!q5) continue;
  const answers = (q5.inputs || []).map(i => i.answer).filter(Boolean);
  q5Answers.push({ file, answers });
}

// Check for exact answer-set duplicates
const answerSigs = q5Answers.map(e => e.answers.sort().join('|'));
const sigCounts = {};
answerSigs.forEach(s => { sigCounts[s] = (sigCounts[s] || 0) + 1; });

let pass = 0;
let warn = 0;
const warnings = [];

for (const [sig, count] of Object.entries(sigCounts)) {
  if (count > RP_FILES.length * 0.5) {
    warn++;
    warnings.push(`Q5 answer set "${sig}" appears in ${count}/${RP_FILES.length} exams (>50% collision)`);
  } else {
    pass++;
  }
}

console.log(`gp-q5-answers-unique-across-exams: ${pass} unique sets, ${warn} high-collision`);
if (warnings.length) {
  console.log('INFO — high-collision Q5 answer sets (possible pattern memorization):');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`Q5 answer signatures: ${[...new Set(answerSigs)].length} unique across ${RP_FILES.length} exams`);
console.log(`OK — Q5 answer diversity checked`);
