// gp-answer-key-coverage.test.js — what percentage of questions have fully answered inputs?

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const COVERAGE_THRESHOLD = 0.70; // 70% of inputs should have answers

let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  let totalInputs = 0;
  let withAnswers = 0;
  
  for (const q of data.questions) {
    for (const inp of (q.inputs || [])) {
      totalInputs++;
      if (inp.answer !== undefined && inp.answer !== null) {
        withAnswers++;
      }
    }
  }
  
  const coverage = totalInputs > 0 ? withAnswers / totalInputs : 1;
  
  if (coverage >= COVERAGE_THRESHOLD) {
    pass++;
    console.log(`  ${file}: ${withAnswers}/${totalInputs} (${Math.round(coverage * 100)}%) ✅`);
  } else {
    warn++;
    warnings.push(`${file}: ${withAnswers}/${totalInputs} (${Math.round(coverage * 100)}%) — below ${Math.round(COVERAGE_THRESHOLD * 100)}% threshold`);
  }
}

console.log(`\ngp-answer-key-coverage: ${pass} pass, ${warn} under-threshold`);
if (warnings.length) {
  console.log('INFO — low answer coverage (notify GR to fill in answers):');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} exams meet 70%+ answer coverage`);
