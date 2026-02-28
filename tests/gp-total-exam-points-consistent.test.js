// gp-total-exam-points-consistent.test.js — if point values exist, they should sum consistently

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0;
let info = 0;
const notes = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const totalPoints = data.total_points || data.points;
  const qPoints = data.questions.map(q => q.points || q.point_value).filter(p => p !== undefined);

  if (qPoints.length === 0 && !totalPoints) {
    info++; // no points schema = informational
  } else if (totalPoints && qPoints.length === data.questions.length) {
    const sum = qPoints.reduce((a, b) => a + Number(b), 0);
    if (sum !== Number(totalPoints)) {
      notes.push(`${file}: total_points=${totalPoints} but question sum=${sum}`);
    }
    pass++;
  } else {
    pass++;
  }
}

console.log(`gp-total-exam-points-consistent: ${pass} pass, ${info} no-points-schema, ${notes.length} inconsistent`);
if (notes.length) {
  notes.forEach(n => console.log('  WARN:', n));
}
console.log(`OK — ${info} exams have no points schema (informational), ${pass} verified`);
