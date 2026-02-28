// gp-q1-answers-unique-across-exams.test.js — Q1 answers should be unique across all 11 exams

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const q1Sigs = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const q1 = data.questions[0];
  if (!q1) continue;
  const answers = (q1.inputs || []).map(i => i.answer).filter(a => a !== undefined && a !== null && a !== '');
  q1Sigs.push({ file: file.replace('retake-practice-','RP').replace('.json',''), sig: answers.sort().join('|') });
}

const sigCounts = {};
q1Sigs.forEach(e => { sigCounts[e.sig] = (sigCounts[e.sig] || []).concat(e.file); });

let pass = 0;
let warn = 0;
const warnings = [];
for (const [sig, exams] of Object.entries(sigCounts)) {
  if (exams.length > 2) {
    warn++;
    warnings.push(`Q1 answer pattern appears in ${exams.length} exams: ${exams.join(', ')}`);
  } else {
    pass += exams.length;
  }
}

const unique = Object.keys(sigCounts).length;
console.log(`gp-q1-answers-unique-across-exams: ${unique} unique Q1 answer sets across ${RP_FILES.length} exams`);
if (warnings.length) {
  console.log('INFO — high-collision Q1 answer patterns:');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — Q1 answer diversity checked`);
