// gp-graph-step-value-positive.test.js — graph step/interval values should be positive

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0;
let fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const g = q.graph;
    if (!g) continue;
    const step = g.step !== undefined ? g.step : (g.interval !== undefined ? g.interval : null);
    if (step !== null) {
      if (typeof step === 'number' && step <= 0) {
        fail++;
        failures.push(`${file}: Q${q.id} graph step=${step} must be positive`);
      } else {
        pass++;
      }
    } else {
      pass++;
    }
  }
}

console.log(`gp-graph-step-value-positive: ${pass} pass, ${fail} fail`);
if (failures.length) {
  failures.forEach(f => console.log('  FAIL:', f));
  process.exit(1);
}
console.log(`OK — all ${pass} graphs have positive step values`);
