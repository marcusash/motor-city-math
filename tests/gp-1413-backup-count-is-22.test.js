// gp-1413-backup-count-is-22.test.js
// There must be exactly 22 backup files (2 per exam x 11 exams).

const fs = require('fs'), path = require('path');
const BACKUP_DIR = path.join(__dirname, '..', 'data', '_backups');
const count = fs.readdirSync(BACKUP_DIR).filter(f => f.endsWith('.json')).length;
console.log('gp-1413-backup-count: ' + count + ' backup files');
if (count === 22) {
  console.log('OK -- exactly 22 backup files (2 per exam x 11)');
} else {
  console.log('FAIL: expected 22, got ' + count);
  process.exit(1);
}
