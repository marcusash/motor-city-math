// gp-1112-backup-files-valid-json.test.js
// All backup files in data/_backups/ must be parseable as valid JSON.

const fs = require('fs');
const path = require('path');

const BACKUP_DIR = path.join(__dirname, '..', 'data', '_backups');
let files = [];
try { files = fs.readdirSync(BACKUP_DIR).filter(f => f.endsWith('.json')).sort(); }
catch (e) { console.log(`gp-1112-backup-files-valid-json: backup dir missing`); process.exit(0); }

let pass = 0, fail = 0;
const failures = [];

for (const file of files) {
  try {
    JSON.parse(fs.readFileSync(path.join(BACKUP_DIR, file), 'utf8'));
    pass++;
  } catch (e) {
    fail++;
    failures.push(`${file}: invalid JSON -- ${e.message}`);
  }
}

console.log(`gp-1112-backup-files-valid-json: ${pass} pass, ${fail} fail (${files.length} backups)`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK -- all ${pass} backup files are valid JSON`);
