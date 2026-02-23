// gp-1115-section-c-q13-type-audit.test.js
// Q13 (index 12): type varies (graph for most, rational for RP11). Document the distribution.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const typeMap = {};
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const q13 = data.questions[12];
  if (q13) {
    typeMap[q13.type] = (typeMap[q13.type] || 0) + 1;
  }
}

const variety = Object.keys(typeMap).length;
console.log(`gp-1115-section-c-q13-type-audit: ${variety} types used in Q13`);
Object.entries(typeMap).sort((a,b) => b[1]-a[1]).forEach(([t,c]) => console.log(`  ${t}: ${c} exams`));
console.log(`OK -- Q13 type distribution documented (RP11 uses 'rational' not 'graph')`);
