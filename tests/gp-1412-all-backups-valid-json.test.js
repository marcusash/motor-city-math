// gp-1412-all-backups-valid-json.test.js
// All backup JSON files must parse without error.

const fs = require('fs'), path = require('path');
const BACKUP_DIR = path.join(__dirname, '..', 'data', '_backups');
const files = fs.readdirSync(BACKUP_DIR).filter(f => f.endsWith('.json')).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of files) {
  try {
    JSON.parse(fs.readFileSync(path.join(BACKUP_DIR, file), 'utf8'));
    pass++;
  } catch (e) {
    fail++;
    failures.push(file + ': ' + e.message);
  }
}
console.log('gp-1412-all-backups-valid-json: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' backup files are valid JSON');
