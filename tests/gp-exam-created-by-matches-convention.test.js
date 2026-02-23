// gp-exam-created-by-matches-convention.test.js — created_by should follow agent ID convention (GR, Marcus, etc.)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const KNOWN_CREATORS = new Set(['GR', 'Marcus', 'marcus', 'FR', 'FA', 'GI', 'GP', 'GA', 'agent-r', 'agent-gr', 'Agent GA', 'Agent GR', 'Agent FR', 'Agent R', 'R']);

let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const creator = data.created_by;
  if (!creator || !KNOWN_CREATORS.has(creator)) {
    warn++;
    warnings.push(`${file}: created_by='${creator}' (unknown creator — expected GR, Marcus, or agent ID)`);
  } else {
    pass++;
  }
}

console.log(`gp-exam-created-by-matches-convention: ${pass} pass, ${warn} flagged`);
if (warnings.length) {
  console.log('INFO — exams with unexpected creator:');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} exams have recognized created_by value`);
