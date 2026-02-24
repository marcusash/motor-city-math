// gp-1222-graph-function-max-length.test.js
// Graph function strings should be under 200 chars (readability guard).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, warn = 0;
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions.filter(q => q.graph)) {
    const len = (q.graph.function || '').length;
    if (len <= 200) pass++;
    else { warn++; console.log('  WARN:', file, q.id, 'function length=' + len); }
  }
}
console.log('gp-1222-graph-function-max-length: ' + pass + ' pass, ' + warn + ' over 200 chars');
console.log('OK -- graph function length audit complete');
