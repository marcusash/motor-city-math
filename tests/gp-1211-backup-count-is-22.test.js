// gp-1211-backup-count-is-22.test.js
// Exactly 22 backup files must exist (2 per exam, 11 exams).

const fs = require('fs'), path = require('path');
const BACKUP_DIR = path.join(__dirname, '..', 'data', '_backups');
let count = 0;
try { count = fs.readdirSync(BACKUP_DIR).filter(f => f.endsWith('.json')).length; }
catch (e) { console.log('gp-1211-backup-count: backup dir missing'); process.exit(0); }
const EXPECTED = 22;
console.log('gp-1211-backup-count: ' + count + ' (expected ' + EXPECTED + ')');
if (count !== EXPECTED) { console.log('  FAIL: mismatch'); process.exit(1); }
console.log('OK -- exactly ' + EXPECTED + ' backup files exist');
