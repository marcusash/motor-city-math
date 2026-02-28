// gp-graph-tolerance-sane-range.test.js — graph tolerance should be > 0 and <= 5 (reasonable answer acceptance)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const MIN_TOL = 0;
const MAX_TOL = 5;
let pass = 0;
let fail = 0;
const failures = [];
const tolerances = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (!q.graph) continue;
    const tol = q.graph.tolerance;
    tolerances.push(tol);
    if (tol === undefined || tol === null) {
      fail++;
      failures.push(`${file}: Q${q.id} graph missing tolerance`);
    } else if (tol <= MIN_TOL) {
      fail++;
      failures.push(`${file}: Q${q.id} graph tolerance=${tol} (must be > 0)`);
    } else if (tol > MAX_TOL) {
      fail++;
      failures.push(`${file}: Q${q.id} graph tolerance=${tol} (max ${MAX_TOL})`);
    } else {
      pass++;
    }
  }
}

const avg = tolerances.filter(t => typeof t === 'number').reduce((s, t) => s + t, 0) / (tolerances.filter(t => typeof t === 'number').length || 1);
console.log(`gp-graph-tolerance-sane-range: ${pass} pass, ${fail} fail`);
console.log(`  Tolerances: min=${Math.min(...tolerances)}, max=${Math.max(...tolerances)}, avg=${avg.toFixed(3)}`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} graph tolerances in range (0, ${MAX_TOL}]`);
