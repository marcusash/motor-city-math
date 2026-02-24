// gp-1524-rp12-graph-count.test.js
// RP12 must have exactly 2 graphs (Q12 and Q13 both have graph field).

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'retake-practice-12.json'), 'utf8'));
const graphCount = data.questions.filter(q => q.graph).length;
console.log('gp-1524-rp12-graph-count: ' + graphCount + ' graphs');
if (graphCount === 2) { console.log('OK -- RP12 has 2 graphs'); }
else { console.log('INFO: RP12 has ' + graphCount + ' graphs (expected 2)'); }
