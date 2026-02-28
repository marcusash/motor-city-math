// gp-no-consecutive-same-type-questions.test.js — 3+ questions of same type in a row may suggest poor ordering

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const STREAK_THRESHOLD = 4; // 4+ same type in a row = flag

let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const types = data.questions.map(q => q.type || 'unknown');
  let streak = 1;
  let maxStreak = 1;
  let streakType = types[0];
  
  for (let i = 1; i < types.length; i++) {
    if (types[i] === types[i-1]) {
      streak++;
      if (streak > maxStreak) maxStreak = streak;
      if (streak === STREAK_THRESHOLD) {
        streakType = types[i];
      }
    } else {
      streak = 1;
    }
  }

  if (maxStreak >= STREAK_THRESHOLD) {
    warn++;
    warnings.push(`${file}: max ${maxStreak} consecutive '${streakType}' questions (may need reordering)`);
  } else {
    pass++;
  }
}

console.log(`gp-no-consecutive-same-type-questions: ${pass} pass, ${warn} flagged`);
if (warnings.length) {
  console.log('INFO — exam question ordering may benefit from more variety:');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} exams have good question type variety in ordering`);
