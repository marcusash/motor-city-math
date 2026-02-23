// gp-exam-word-count-summary.js — per-exam word count summary for readability assessment

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

console.log('=== EXAM WORD COUNT SUMMARY ===\n');
console.log('RP    Q-HTML Words  Hint Words  FB-Correct  FB-Wrong   Steps Words  TOTAL');
console.log('---   -----------  ----------  ----------  --------   -----------  -----');

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const num = file.match(/\d+/)[0].padStart(2);
  
  let qWords = 0, hWords = 0, fcWords = 0, fwWords = 0, sWords = 0;
  
  for (const q of data.questions) {
    const countWords = s => (s || '').trim().split(/\s+/).filter(Boolean).length;
    qWords += countWords(q.question_html);
    hWords += countWords(q.hint);
    fcWords += countWords(q.feedback_correct);
    fwWords += countWords(q.feedback_wrong);
    for (const step of (q.solution_steps || [])) {
      const text = typeof step === 'string' ? step : (step.text || '');
      sWords += countWords(text);
    }
  }
  
  const total = qWords + hWords + fcWords + fwWords + sWords;
  console.log(`RP${num}   ${String(qWords).padEnd(13)} ${String(hWords).padEnd(12)} ${String(fcWords).padEnd(12)} ${String(fwWords).padEnd(11)} ${String(sWords).padEnd(13)} ${total}`);
}

console.log('\nNote: Higher word counts may indicate ADHD-unfriendly verbosity.');
console.log('Target: feedback < 15 words each, hints < 20 words, steps < 30 words each.');
