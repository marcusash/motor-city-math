// gp-1771-complete-exams-exponential-answers-positive.test.js
// Exponential type questions: most answers should be positive. Advisory for known negatives.
// Known: rp8-q10:q10_x1=-2.236, rp9-q10:q10_x1=-7 (quadratic roots in exponential questions)

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const KNOWN_NEGATIVES = new Set(['rp8-q10:q10_x1','rp9-q10:q10_x1','rp7-q10:q10_x1','rp11-q10:q10_x1']);
let pass = 0, skip = 0, advisory = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    if (q.type !== 'exponential') continue;
    for (const inp of (q.inputs||[])) {
      const key = q.id + ':' + inp.id;
      const v = parseFloat(String(inp.answer).replace(/[^0-9.\-]/g,''));
      if (isNaN(v)) { skip++; continue; }
      if (v > 0) pass++;
      else if (KNOWN_NEGATIVES.has(key)) advisory++;
      else { fail++; failures.push(key + '=' + inp.answer); }
    }
  }
}
console.log('gp-1771-exponential-positive: ' + pass + ' positive, ' + advisory + ' known-negative, ' + skip + ' non-numeric, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- exponential answers mostly positive (' + pass + ' pass, ' + advisory + ' advisory)');
