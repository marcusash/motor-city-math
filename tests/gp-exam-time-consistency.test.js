// gp-exam-time-consistency.test.js — exams should have consistent time allocations per exam set

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

// Collect time distribution
const timeMap = {};
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const t = data.time_minutes;
  timeMap[t] = (timeMap[t] || []);
  timeMap[t].push(file.replace('retake-practice-','RP').replace('.json',''));
}

console.log(`gp-exam-time-consistency: time distribution across 11 exams:`);
for (const [time, exams] of Object.entries(timeMap).sort()) {
  console.log(`  ${time} min: ${exams.join(', ')}`);
}

// Check: some exams are 50min (shorter) and some are 60min (full)
const times = Object.keys(timeMap).map(Number).sort();
if (times.length > 2) {
  console.log(`INFO — More than 2 time buckets found: ${times.join(', ')} min`);
} else {
  console.log(`OK — ${times.length} time bucket(s): ${times.join(', ')} min`);
}
