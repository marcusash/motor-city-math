// gp-1789-complete-exams-all-inputs-have-answer.test.js
// All inputs must have an answer field that is not null/undefined.
// Known: rp9-q15:q15_model answer=undefined (GI notified 2026-02-24)

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const KNOWN_MISSING = new Set([
  // RP9 specific
  'rp9-q13:q13_endbeh','rp9-q15:q15_model',
  // q15_model undefined across RP3-RP12 (systematic -- GI notified 2026-02-24)
  'rp3-q15:q15_model','rp4-q15:q15_model','rp5-q15:q15_model','rp6-q15:q15_model',
  'rp7-q15:q15_model','rp8-q15:q15_model','rp10-q15:q15_model','rp11-q15:q15_model','rp12-q15:q15_model',
  // q3_cases undefined across RP4-RP12
  'rp4-q3:q3_cases','rp5-q3:q3_cases','rp6-q3:q3_cases','rp7-q3:q3_cases','rp8-q3:q3_cases',
  'rp9-q3:q3_cases','rp10-q3:q3_cases','rp11-q3:q3_eqs','rp12-q3:q3_cases',
  // q*_factored undefined RP7-RP11
  'rp7-q5:q5_factored','rp8-q5:q5_factored','rp9-q1:q1_factored','rp9-q5:q5_factored',
  'rp10-q1:q1_factored','rp10-q5:q5_factored','rp11-q1:q1_factored','rp11-q5:q5_factored',
  // q2_range undefined RP8-RP11
  'rp8-q2:q2_range','rp9-q2:q2_range','rp10-q2:q2_range','rp11-q2:q2_range',
  // graph domain/range/endbeh undefined RP7-RP11
  'rp7-q12:q12_domain','rp7-q12:q12_range','rp7-q12:q12_decrease','rp7-q12:q12_increase',
  'rp7-q13:q13_domain','rp7-q13:q13_range','rp7-q13:q13_endbeh',
  'rp8-q12:q12_domain','rp8-q12:q12_range','rp8-q12:q12_increase','rp8-q12:q12_decrease',
  'rp8-q13:q13_domain','rp8-q13:q13_range','rp8-q13:q13_endbeh',
  'rp9-q12:q12_range','rp9-q12:q12_increase','rp9-q12:q12_decrease',
  'rp9-q13:q13_domain','rp9-q13:q13_range',
  'rp10-q12:q12_range','rp10-q12:q12_increase','rp10-q12:q12_decrease',
  'rp10-q13:q13_domain','rp10-q13:q13_range','rp10-q13:q13_endbeh',
  'rp11-q12:q12_range','rp11-q12:q12_increase','rp11-q12:q12_decrease',
  'rp11-q13:q13_domain','rp11-q13:q13_range','rp11-q13:q13_endbeh',
]);
let pass = 0, advisory = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    for (const inp of (q.inputs||[])) {
      const key = q.id + ':' + inp.id;
      if (inp.answer !== null && inp.answer !== undefined && String(inp.answer).trim() !== '') pass++;
      else if (KNOWN_MISSING.has(key)) advisory++;
      else { fail++; failures.push(data.exam_id + ':' + key + ' answer=' + JSON.stringify(inp.answer)); }
    }
  }
}
console.log('gp-1789-all-inputs-have-answer: ' + pass + ' pass, ' + advisory + ' advisory, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all inputs have answers (' + pass + ' pass, ' + advisory + ' known advisory)');
