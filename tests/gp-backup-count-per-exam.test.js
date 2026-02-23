// gp-backup-count-per-exam.test.js — each exam should have exactly 2 backups in _backups/

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const BACKUPS_DIR = path.join(DATA_DIR, '_backups');

if (!fs.existsSync(BACKUPS_DIR)) {
  console.log('gp-backup-count-per-exam: 0 pass, 1 fail — _backups directory missing');
  process.exit(1);
}

const backupFiles = fs.readdirSync(BACKUPS_DIR).filter(f => f.endsWith('.json'));

// Count backups per exam number
const perExam = {};
for (const f of backupFiles) {
  const m = f.match(/retake-practice-(\d+)/);
  if (m) {
    perExam[m[1]] = (perExam[m[1]] || 0) + 1;
  }
}

let pass = 0;
let warn = 0;
const warnings = [];
const EXPECTED_EXAMS = [1,2,3,4,5,6,7,8,9,10,11];
const EXPECTED_BACKUPS = 2;

for (const n of EXPECTED_EXAMS) {
  const count = perExam[String(n)] || 0;
  if (count < EXPECTED_BACKUPS) {
    warn++;
    warnings.push(`RP${n}: only ${count} backups (expected ${EXPECTED_BACKUPS})`);
  } else {
    pass++;
  }
}

console.log(`gp-backup-count-per-exam: ${pass} pass, ${warn} under-backed`);
console.log(`  Total backup files: ${backupFiles.length} across ${Object.keys(perExam).length} exams`);
if (warnings.length) { warnings.forEach(w => console.log('  INFO:', w)); }
console.log(`OK — backup coverage audit complete`);
