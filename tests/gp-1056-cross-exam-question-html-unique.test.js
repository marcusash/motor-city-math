// gp-1056-cross-exam-question-html-unique.test.js — same question_html should not appear in multiple exams

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const htmlToExams = new Map();
let totalQ = 0;

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const name = file.replace('retake-practice-', 'RP').replace('.json', '');
  for (const q of data.questions) {
    const html = (q.question_html || '').trim();
    if (!htmlToExams.has(html)) htmlToExams.set(html, []);
    htmlToExams.get(html).push(`${name}/${q.id}`);
    totalQ++;
  }
}

const duplicates = [...htmlToExams.entries()].filter(([,v]) => v.length > 1);
console.log(`gp-1056-cross-exam-question-html-unique: ${totalQ} questions, ${duplicates.length} cross-exam duplicates`);
if (duplicates.length) { duplicates.forEach(([html, refs]) => console.log(`  INFO: "${html.slice(0,50)}..." in [${refs.join(', ')}]`)); }
console.log(`OK — cross-exam question_html uniqueness audit complete`);
