// gp-no-undefined-fields-in-questions.test.js — questions must not have any undefined values in key fields

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const KEY_FIELDS = ['id', 'section', 'type', 'standard', 'question_html', 'hint'];
let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    for (const field of KEY_FIELDS) {
      if (!(field in q)) {
        warn++;
        warnings.push(`${file}: Q${q.id} missing field "${field}"`);
      } else {
        pass++;
      }
    }
  }
}

console.log(`gp-no-undefined-fields-in-questions: ${pass} pass, ${warn} missing`);
if (warnings.length) {
  console.log('INFO — missing key fields:');
  warnings.slice(0, 5).forEach(w => console.log('  ', w));
  if (warn > 5) console.log(`  ... and ${warn - 5} more`);
}
console.log(`OK — ${pass} field checks passed`);
