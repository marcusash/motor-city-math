#!/usr/bin/env node
// gp-weak-standard-drill.js — generate a focused drill list for Kai's weakest standard (W2.d)
// Outputs question IDs grouped by exam where W2.d is covered

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const TARGET_STANDARD = process.argv[2] || 'W2.d';

console.log(`\n=== Drill List: ${TARGET_STANDARD} (Kai's identified weakness) ===\n`);

let total = 0;
const drillList = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const matches = data.questions.filter(q => q.standard === TARGET_STANDARD);
  
  if (matches.length === 0) continue;
  
  const examLabel = file.replace('retake-practice-', 'RP').replace('.json', '');
  console.log(`${examLabel}: ${matches.length} question(s)`);
  
  for (const q of matches) {
    total++;
    drillList.push({ exam: examLabel, id: q.id, number: q.number, type: q.type });
    const preview = (q.question_html || '').replace(/<[^>]+>/g, '').trim().substring(0, 80);
    console.log(`  Q${q.number} (${q.id}) — ${preview}...`);
  }
}

console.log(`\nTotal ${TARGET_STANDARD} questions: ${total} across ${drillList.length > 0 ? 'multiple' : '0'} exams`);

if (total < 10) {
  console.log(`\nWARNING: Only ${total} questions for ${TARGET_STANDARD} — curriculum gap risk`);
  console.log('Recommendation: GR should add more W2.d questions to RP1, RP4, RP5, RP6, RP7, RP8');
}
