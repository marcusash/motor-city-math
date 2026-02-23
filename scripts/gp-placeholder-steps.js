#!/usr/bin/env node
// GP: gp-placeholder-steps.js
// Lists all questions with generic placeholder solution steps
// so GR can replace them with exam-specific worked solutions.

const fs = require('fs');
const path = require('path');

const PLACEHOLDER = 'Check your work by substituting the answer back into the original equation.';
const DATA_DIR = path.join(__dirname, '..', 'data');

let total = 0;
let placeholderCount = 0;
const report = [];

for (let n = 1; n <= 10; n++) {
  const file = path.join(DATA_DIR, `retake-practice-${n}.json`);
  if (!fs.existsSync(file)) continue;
  const json = JSON.parse(fs.readFileSync(file, 'utf8'));
  for (const q of json.questions || []) {
    total++;
    const steps = q.solution_steps || [];
    const hasPlaceholder = steps.some(s => s.includes(PLACEHOLDER));
    if (hasPlaceholder) {
      placeholderCount++;
      report.push({
        exam: json.exam_id,
        id: q.id,
        steps_count: steps.length,
        steps: steps,
        question: q.question_html ? q.question_html.replace(/<[^>]+>/g, '').slice(0, 60) : ''
      });
    }
  }
}

if (report.length === 0) {
  console.log(`✅ No placeholder steps found. All ${total} questions have real solution steps.`);
} else {
  console.log(`\n=== PLACEHOLDER STEPS REPORT ===`);
  console.log(`Found: ${placeholderCount}/${total} questions with generic step\n`);
  for (const r of report) {
    console.log(`[${r.exam}] ${r.id} (${r.steps_count} steps)`);
    console.log(`  Q: ${r.question}`);
    r.steps.forEach((s, i) => {
      const flag = s.includes(PLACEHOLDER) ? ' ← GENERIC' : '';
      console.log(`  Step ${i+1}: ${s}${flag}`);
    });
    console.log('');
  }
  console.log(`Action needed: GR to replace generic steps with exam-specific worked solutions.`);
  console.log(`Send results to GR inbox: .agent-comms/grind/inbox-GR/`);
}
