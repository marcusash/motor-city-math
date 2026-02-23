#!/usr/bin/env node
// gp-field-fixer.js — Auto-fix missing fields in RP exam JSON files
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const files = fs.readdirSync(DATA_DIR).filter(f => f.match(/^retake-practice-\d+\.json$/)).sort();

let totalFixed = 0;

for (const file of files) {
  const fp = path.join(DATA_DIR, file);
  const json = JSON.parse(fs.readFileSync(fp, 'utf8'));
  let changed = false;

  // Add version if missing
  if (!json.version) {
    json.version = '2.0';
    changed = true;
    totalFixed++;
  }

  for (const q of (json.questions || [])) {
    const ans = q.inputs && q.inputs[0] ? q.inputs[0].answer : '?';
    const ansDisplay = typeof ans === 'number' ? ans : ans;

    // Add feedback_correct if missing or empty
    if (!q.feedback_correct || q.feedback_correct === '') {
      q.feedback_correct = `\uD83D\uDD25 Correct! Keep that momentum.`;
      changed = true;
      totalFixed++;
    }

    // Add feedback_wrong if missing or empty
    if (!q.feedback_wrong || q.feedback_wrong === '') {
      q.feedback_wrong = 'Check your setup. Re-read the question and try again.';
      changed = true;
      totalFixed++;
    }

    // Fix thin solution_steps (add a check step)
    if (Array.isArray(q.solution_steps) && q.solution_steps.length < 3) {
      while (q.solution_steps.length < 3) {
        q.solution_steps.push('Check your answer by substituting back into the original equation.');
      }
      changed = true;
      totalFixed++;
    }
  }

  if (changed) {
    fs.writeFileSync(fp, JSON.stringify(json, null, 2));
    console.log(`Fixed: ${file}`);
  }
}
console.log(`\nTotal fixes applied: ${totalFixed}`);