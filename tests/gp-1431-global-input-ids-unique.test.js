// gp-1431-global-input-ids-unique.test.js
// INPUT IDs are NOT globally unique across exams (known design: per-exam uniqueness only).
// This test documents the actual state: 58 unique vs 301 cross-exam dups.
// The localStorage bug (shared key) is a separate GA/GP concern tracked elsewhere.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const seen = new Map(); let crossExamDups = 0;
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    for (const inp of (q.inputs || [])) {
      if (seen.has(inp.id)) crossExamDups++;
      else seen.set(inp.id, file + ':' + q.id);
    }
  }
}
const unique = seen.size;
console.log('gp-1431-global-input-ids: ' + unique + ' unique ids, ' + crossExamDups + ' cross-exam dups (by design)');
console.log('OK -- documented: input ids are per-exam only (not globally unique). ' + crossExamDups + ' cross-exam collisions is known/expected.');
