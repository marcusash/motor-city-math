// gp-1956-complete-exams-asymptotes-schema-snapshot.test.js
// Discover which graphs have asymptotes field and lock count.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let withAsym = 0; const byExam = {};
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    if (!q.graph) continue;
    if (q.graph.asymptotes !== undefined) { withAsym++; byExam[data.exam_id] = (byExam[data.exam_id]||0)+1; }
  }
}
console.log('gp-1956-asymptotes-count:', withAsym, 'by-exam:', JSON.stringify(byExam));
console.log('OK -- asymptotes field discovery: '+withAsym+' graphs have it');
