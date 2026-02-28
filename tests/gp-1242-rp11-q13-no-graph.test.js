// gp-1242-rp11-q13-type-rational.test.js
// RP11 Q13 anomaly lock: type must be "rational" (not "graph" like all other exams).
// It still HAS a graph field -- only the type field differs.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const file = 'retake-practice-11.json';
const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
const q13 = data.questions[12];
console.log('gp-1242-rp11-q13-type: type=' + q13.type + ', graph=' + (q13.graph ? 'present' : 'absent'));
if (q13.type !== 'rational') { console.log('  FAIL: RP11 Q13 type should be rational, got:', q13.type); process.exit(1); }
if (!q13.graph) { console.log('  FAIL: RP11 Q13 should still have graph field'); process.exit(1); }
console.log('OK -- RP11 Q13 type=rational with graph field present (locked anomaly)');
