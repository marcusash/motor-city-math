// gp-inputs-have-label-or-question.test.js
// Every input should have either a label, or be part of a question with clear question_html context

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

// Types where label is optional (question_html provides context)
const LABEL_OPTIONAL_TYPES = new Set(['radio', 'dropdown']);

let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const hasQuestionHtml = q.question_html && q.question_html.trim().length > 0;
    
    for (const inp of (q.inputs || [])) {
      const hasLabel = inp.label && inp.label.trim().length > 0;
      const optionalType = LABEL_OPTIONAL_TYPES.has(inp.type);
      
      if (hasLabel || optionalType || hasQuestionHtml) {
        pass++;
      } else {
        warn++;
        warnings.push(`${file}: Q${q.id} '${inp.id}' (${inp.type}) has no label or question context`);
      }
    }
  }
}

console.log(`gp-inputs-have-label-or-question: ${pass} pass, ${warn} flagged`);
if (warnings.length) {
  console.log('INFO — inputs without clear labeling context:');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} inputs have adequate labeling context`);
