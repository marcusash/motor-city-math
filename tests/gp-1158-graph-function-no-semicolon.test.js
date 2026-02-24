// gp-1158-graph-function-no-semicolon.test.js
// Graph function strings should not end with semicolons (JS eval artifact).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, warn = 0;
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions.filter(q => q.graph)) {
    const fn = (q.graph.function || '').trim();
    if (fn.endsWith(';')) { warn++; console.log('  WARN:', file, q.id, 'function ends with semicolon:', fn.slice(0,50)); }
    else pass++;
  }
}
console.log('gp-1158-graph-function-no-semicolon: ' + pass + ' clean, ' + warn + ' with semicolons');
console.log('OK -- graph function semicolon audit complete');
