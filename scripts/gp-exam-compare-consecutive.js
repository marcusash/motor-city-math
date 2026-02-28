// gp-exam-compare-consecutive.js — diff consecutive exam pairs for schema drift and answer overlap
// Compares RP1-RP2, RP2-RP3, etc.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

function getExamData(file) {
  return JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
}

function getAnswers(data) {
  const answers = [];
  for (const q of data.questions) {
    for (const inp of (q.inputs || [])) {
      if (inp.answer !== null && inp.answer !== undefined && inp.answer !== '') {
        answers.push(String(inp.answer).trim());
      }
    }
  }
  return answers;
}

function getTopFields(data) {
  return Object.keys(data).sort();
}

console.log('\n=== CONSECUTIVE EXAM COMPARISON ===\n');

for (let i = 0; i < RP_FILES.length - 1; i++) {
  const fileA = RP_FILES[i];
  const fileB = RP_FILES[i + 1];
  const A = getExamData(fileA);
  const B = getExamData(fileB);

  const labelA = fileA.replace('retake-practice-', 'RP').replace('.json', '');
  const labelB = fileB.replace('retake-practice-', 'RP').replace('.json', '');

  // Field differences
  const fieldsA = new Set(getTopFields(A));
  const fieldsB = new Set(getTopFields(B));
  const inAnotB = [...fieldsA].filter(f => !fieldsB.has(f));
  const inBnotA = [...fieldsB].filter(f => !fieldsA.has(f));

  // Answer overlap
  const answersA = new Set(getAnswers(A));
  const answersB = new Set(getAnswers(B));
  const overlap = [...answersA].filter(v => answersB.has(v));
  const overlapPct = answersA.size > 0 ? Math.round(overlap.length / answersA.size * 100) : 0;

  // Schema version change
  const svChange = A.schema_version !== B.schema_version ? ` ⚠️  schema: ${A.schema_version}→${B.schema_version}` : '';

  console.log(`${labelA} vs ${labelB}:${svChange}`);
  if (inAnotB.length > 0) console.log(`  Fields only in ${labelA}: ${inAnotB.join(', ')}`);
  if (inBnotA.length > 0) console.log(`  Fields only in ${labelB}: ${inBnotA.join(', ')}`);
  console.log(`  Answer overlap: ${overlap.length}/${answersA.size} shared (${overlapPct}%) — values: ${overlap.slice(0, 8).join(', ')}${overlap.length > 8 ? '...' : ''}`);

  if (overlapPct > 60) {
    console.log(`  ⚠️  HIGH OVERLAP — ${overlapPct}% of answers shared with next exam (memorization risk)`);
  }
  console.log();
}

console.log('Done.\n');
