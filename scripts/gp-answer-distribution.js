/**
 * gp-answer-distribution.js
 * Shows the spread of numeric answer values across all exams.
 * Helps GR spot patterns Kai might memorize.
 *
 * Usage: node scripts/gp-answer-distribution.js
 */
const fs = require('fs');
const path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');

const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => f.startsWith('retake-practice-') && f.endsWith('.json'))
  .sort();

// Collect all numeric answers
const answerFreq = {};
const answerSources = {};

for (const fname of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, fname), 'utf8'));
  if (!data.questions || data.questions.length === 0) continue;
  const examId = data.exam_id || fname.replace('.json', '');

  for (const q of data.questions) {
    if (!q.inputs) continue;
    for (const inp of q.inputs) {
      if (inp.type === 'number' && typeof inp.answer === 'number') {
        const v = inp.answer;
        const key = String(v);
        answerFreq[key] = (answerFreq[key] || 0) + 1;
        if (!answerSources[key]) answerSources[key] = [];
        answerSources[key].push(`${examId}/${q.id}`);
      }
    }
  }
}

console.log('\n=== GP Answer Distribution ===\n');
console.log('Answers appearing 3+ times (memorization risk):');
console.log('Value'.padEnd(12) + '  Count  Sources');
console.log('-'.repeat(60));

const frequent = Object.entries(answerFreq)
  .filter(([, c]) => c >= 3)
  .sort((a, b) => b[1] - a[1]);

if (frequent.length === 0) {
  console.log('  (none — good distribution)');
} else {
  for (const [val, count] of frequent) {
    const sources = answerSources[val].slice(0, 3).join(', ');
    const more = answerSources[val].length > 3 ? ` +${answerSources[val].length - 3} more` : '';
    console.log(`${val.padEnd(12)}  ${String(count).padEnd(6)}  ${sources}${more}`);
  }
}

console.log('\nAll answer value frequency:');
const allSorted = Object.entries(answerFreq).sort((a, b) => b[1] - a[1]);
for (const [val, count] of allSorted.slice(0, 20)) {
  const bar = '█'.repeat(Math.min(count, 20));
  console.log(`  ${String(val).padEnd(10)} ${bar} (${count})`);
}
if (allSorted.length > 20) {
  console.log(`  ... and ${allSorted.length - 20} more unique values`);
}
