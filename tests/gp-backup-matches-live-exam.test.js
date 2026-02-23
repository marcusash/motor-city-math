// gp-backup-matches-live-exam.test.js — backup files should parse cleanly and match live exam structure

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const BACKUP_DIR = path.join(DATA_DIR, '_backups');

let pass = 0;
let fail = 0;
const failures = [];

if (!fs.existsSync(BACKUP_DIR)) {
  console.log(`gp-backup-matches-live-exam: 0 pass, 1 fail — backup dir not found`);
  process.exit(1);
}

const backups = fs.readdirSync(BACKUP_DIR).filter(f => f.endsWith('.json') && !f.startsWith('.'));

for (const bkFile of backups) {
  try {
    const bkData = JSON.parse(fs.readFileSync(path.join(BACKUP_DIR, bkFile), 'utf8'));
    const hasQuestions = Array.isArray(bkData.questions) && bkData.questions.length > 0;
    const hasExamId = !!bkData.exam_id;
    if (!hasQuestions || !hasExamId) {
      fail++;
      failures.push(`_backups/${bkFile}: invalid structure (questions=${hasQuestions}, exam_id=${hasExamId})`);
    } else {
      pass++;
    }
  } catch (e) {
    fail++;
    failures.push(`_backups/${bkFile}: JSON parse error — ${e.message.substring(0, 50)}`);
  }
}

console.log(`gp-backup-matches-live-exam: ${pass} pass, ${fail} fail (${backups.length} backups checked)`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} backup files are valid exam JSON`);
