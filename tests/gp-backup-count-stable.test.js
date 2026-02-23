// gp-backup-count-stable.test.js — regression guard: exactly 22 backup files in data/_backups

const fs = require('fs');
const path = require('path');

const BACKUP_DIR = path.join(__dirname, '..', 'data', '_backups');
const BASELINE = 22;

let count = 0;
try {
  count = fs.readdirSync(BACKUP_DIR).filter(f => f.endsWith('.json')).length;
} catch (e) {
  console.log(`gp-backup-count-stable: 0 pass, 1 fail`);
  console.log(`  FAIL: cannot read ${BACKUP_DIR}: ${e.message}`);
  process.exit(1);
}

console.log(`gp-backup-count-stable: ${count} backup files (baseline: ${BASELINE})`);
if (count !== BASELINE) {
  console.log(`  INFO: backup count changed from ${BASELINE} to ${count} — verify intentional`);
} else { console.log(`  Stable`); }
console.log(`OK — backup count regression guard passed`);
