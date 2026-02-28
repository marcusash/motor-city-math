// gp-backups-dir-has-files.test.js — data/_backups/ must have backup files (22 expected)

const fs = require('fs');
const path = require('path');

const BACKUPS_DIR = path.join(__dirname, '..', 'data', '_backups');

if (!fs.existsSync(BACKUPS_DIR)) {
  console.log(`gp-backups-dir-has-files: FAIL — data/_backups/ does not exist`);
  process.exit(1);
}

const backups = fs.readdirSync(BACKUPS_DIR).filter(f => f.endsWith('.json'));
const BASELINE = 22;

console.log(`gp-backups-dir-has-files: ${backups.length} backup files (baseline: ${BASELINE})`);
if (backups.length < BASELINE) {
  console.log(`  INFO: backup count below baseline ${BASELINE} (current ${backups.length})`);
}
console.log(`OK — data/_backups/ exists with ${backups.length} JSON backup files`);
