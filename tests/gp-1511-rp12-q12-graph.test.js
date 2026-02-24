// gp-1511-rp12-q12-graph.test.js
// RP12 Q12 (index 11) must be 'graph' (consistent with all other exams).

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'retake-practice-12.json'), 'utf8'));
const q12 = data.questions[11];
console.log('gp-1511-rp12-q12: type=' + (q12 && q12.type) + ' has_graph=' + !!(q12 && q12.graph));
if (q12 && q12.type === 'graph' && q12.graph) { console.log('OK -- RP12 Q12 is graph type with graph field'); }
else { console.log('FAIL: Q12 type=' + (q12 && q12.type)); process.exit(1); }
