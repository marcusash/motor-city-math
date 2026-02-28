// gp-1506-rp12-basic-schema.test.js
// RP12 basic schema validation: exam_id, title, 15 questions, schema_version.

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'retake-practice-12.json'), 'utf8'));
let pass = 0, fail = 0; const failures = [];
if (data.exam_id === 'retake-practice-12') pass++;
else { fail++; failures.push('exam_id: ' + data.exam_id); }
if (data.title && data.title.length > 0) pass++;
else { fail++; failures.push('missing title'); }
if (data.questions && data.questions.length === 15) pass++;
else { fail++; failures.push('questions: ' + (data.questions ? data.questions.length : 0)); }
if (data.schema_version) pass++;
else { fail++; failures.push('missing schema_version'); }
if (data.version === '2.0') pass++;
else { fail++; failures.push('version: ' + data.version); }
console.log('gp-1506-rp12-schema: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- RP12 passes basic schema checks');
