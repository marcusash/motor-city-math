// gp-standards-coverage.js — analyze which standards are covered per exam
// Output: coverage table showing which W codes appear in each RP exam

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const ALL_STANDARDS = ['W2.a', 'W2.b', 'W2.c', 'W2.d', 'W2.e', 'W3.a', 'W3.b', 'W3.c', 'W3.d', 'W3.e'];

console.log('\nGP Standards Coverage Analysis');
console.log('='.repeat(80));

const totalCoverage = {};
ALL_STANDARDS.forEach(s => { totalCoverage[s] = 0; });

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const questions = data.questions || [];
  const coverage = {};
  ALL_STANDARDS.forEach(s => { coverage[s] = 0; });
  for (const q of questions) {
    if (q.standard && coverage[q.standard] !== undefined) {
      coverage[q.standard]++;
      totalCoverage[q.standard]++;
    }
  }
  const examName = file.replace('.json', '').replace('retake-practice-', 'RP');
  const row = ALL_STANDARDS.map(s => coverage[s] > 0 ? String(coverage[s]).padStart(2) : ' -').join(' | ');
  console.log(`${examName.padEnd(5)} | ${row}`);
}

console.log('-'.repeat(80));
const totalRow = ALL_STANDARDS.map(s => String(totalCoverage[s]).padStart(2)).join(' | ');
console.log(`TOTAL | ${totalRow}`);
console.log('\nStandards: ' + ALL_STANDARDS.join(' | '));
console.log('='.repeat(80));

console.log('\nKai Weakness Standards:');
console.log('  W2.b (graphing): ' + totalCoverage['W2.b'] + ' questions total');
console.log('  W2.d (features from graph): ' + totalCoverage['W2.d'] + ' questions total');
