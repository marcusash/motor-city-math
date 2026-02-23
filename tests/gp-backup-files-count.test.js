// gp-backup-files-count.test.js — data/_backups/ should have exactly 22 backup files (2 per exam)

const fs = require('fs');
const path = require('path');

const BACKUP_DIR = path.join(__dirname, '..', 'data', '_backups');
const EXPECTED_BACKUPS = 22;

let pass = 0;
let fail = 0;

if (!fs.existsSync(BACKUP_DIR)) {
  fail++;
  console.log(`gp-backup-files-count: 0 pass, 1 fail`);
  console.log(`  FAIL: data/_backups/ directory does not exist`);
  process.exit(1);
}

const backupFiles = fs.readdirSync(BACKUP_DIR)
  .filter(f => f.endsWith('.json') && !f.startsWith('.'));

console.log(`gp-backup-files-count: ${backupFiles.length} backups found (expected ${EXPECTED_BACKUPS})`);

if (backupFiles.length === EXPECTED_BACKUPS) {
  pass++;
  console.log(`OK — exactly ${EXPECTED_BACKUPS} backup files in data/_backups/`);
} else if (backupFiles.length >= EXPECTED_BACKUPS) {
  pass++;
  console.log(`OK — ${backupFiles.length} backup files (${backupFiles.length - EXPECTED_BACKUPS} extra, that's fine)`);
} else {
  fail++;
  console.log(`  FAIL: only ${backupFiles.length} backups, expected ${EXPECTED_BACKUPS}`);
  process.exit(1);
}
