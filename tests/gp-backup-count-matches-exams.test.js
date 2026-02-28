// gp-backup-count-matches-exams.test.js — should have at least 1 backup per exam (11 exams = 11+ backups)

const fs = require('fs');
const path = require('path');

const BACKUP_DIR = path.join(__dirname, '..', 'data', '_backups');
const DATA_DIR = path.join(__dirname, '..', 'data');

const rpFiles = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f));
const EXAM_COUNT = rpFiles.length;

let backupCount = 0;
try {
  backupCount = fs.readdirSync(BACKUP_DIR).filter(f => /\.json$/.test(f)).length;
} catch {
  backupCount = 0;
}

console.log(`gp-backup-count-matches-exams: ${backupCount} backups for ${EXAM_COUNT} exams`);

if (backupCount < EXAM_COUNT) {
  console.log(`  FAIL: only ${backupCount} backups but ${EXAM_COUNT} exams (need at least 1 per exam)`);
  process.exit(1);
}

console.log(`OK — ${backupCount} backups cover all ${EXAM_COUNT} exams`);
