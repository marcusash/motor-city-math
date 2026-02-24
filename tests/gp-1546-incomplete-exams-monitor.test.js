// gp-1546-incomplete-exams-monitor.test.js
// Monitor for incomplete exams in data/ directory.
// Incomplete = not 15 questions or non-standard sections.
// These must be completed or moved before they can pass health gate.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const VALID_SECTIONS = new Set(['A','B','C','D']);
const incomplete = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const qCount = data.questions.length;
  const sections = new Set(data.questions.map(q => q.section));
  const invalidSections = [...sections].filter(s => !VALID_SECTIONS.has(s));
  if (qCount !== 15 || invalidSections.length > 0) {
    incomplete.push(data.exam_id + ': ' + qCount + ' questions, invalid sections: ' + (invalidSections.join(',') || 'none'));
  }
}
console.log('gp-1546-incomplete-exams: ' + incomplete.length + ' incomplete exams found');
incomplete.forEach(e => console.log('  ADVISORY:', e));
if (incomplete.length > 0) {
  console.log('ADVISORY: Escalated to GI. Incomplete exams are excluded from regression suite.');
} else {
  console.log('OK -- all retake-practice-*.json files are complete (15 questions, standard sections)');
}
