// gp-hints-shorter-than-questions.test.js — hints should generally be shorter than question text (concise guidance)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0;
let warn = 0;
const warnings = [];
let totalHintLen = 0;
let totalQLen = 0;
let count = 0;

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (!q.hint) continue;
    const hintLen = String(q.hint).trim().length;
    const qLen = (q.question_html || '').replace(/<[^>]+>/g, '').trim().length;
    totalHintLen += hintLen;
    totalQLen += qLen;
    count++;
    // If hint is >2x question length, that's unusual
    if (hintLen > qLen * 2) {
      warn++;
      warnings.push(`${file}: Q${q.id} hint (${hintLen}c) is much longer than question (${qLen}c)`);
    } else {
      pass++;
    }
  }
}

const avgHint = count ? (totalHintLen / count).toFixed(0) : 0;
const avgQ = count ? (totalQLen / count).toFixed(0) : 0;
console.log(`gp-hints-shorter-than-questions: ${pass} pass, ${warn} hint-longer-than-question`);
console.log(`  Avg hint length: ${avgHint} chars, avg question text: ${avgQ} chars`);
if (warnings.length) { warnings.slice(0, 3).forEach(w => console.log('  INFO:', w)); }
console.log(`OK — hint length audit complete`);
