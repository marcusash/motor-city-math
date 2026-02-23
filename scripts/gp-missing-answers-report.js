// gp-missing-answers-report.js — detailed report of inputs missing answer field

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const byExam = {};
let totalMissing = 0;

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const examMissing = [];
  
  for (const q of data.questions) {
    for (const inp of (q.inputs || [])) {
      if (inp.answer === undefined || inp.answer === null) {
        examMissing.push({ qId: q.id, inputId: inp.id, type: inp.type, label: inp.label || '(no label)' });
        totalMissing++;
      }
    }
  }
  
  if (examMissing.length > 0) {
    byExam[file] = examMissing;
  }
}

console.log('=== MISSING ANSWERS REPORT ===');
console.log(`Total inputs missing answers: ${totalMissing}`);
console.log(`Exams affected: ${Object.keys(byExam).length}`);
console.log('');

for (const [file, items] of Object.entries(byExam)) {
  console.log(`${file} — ${items.length} missing:`);
  for (const item of items) {
    console.log(`  ${item.inputId} (${item.type}) Q${item.qId}: ${item.label}`);
  }
  console.log('');
}

console.log('--- RECOMMENDATION ---');
console.log('These inputs need answers from GR (Research Agent).');
console.log('Priority: text/number inputs > radio > dropdown');
console.log('File a GR inbox message with this report to unblock grading.');
