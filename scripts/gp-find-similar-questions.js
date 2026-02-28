#!/usr/bin/env node
// gp-find-similar-questions.js — detect questions with very similar question_html text across exams (potential duplicate/near-duplicate content)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

// Simple similarity: normalize question text and check for prefix matches
function normalize(text) {
  return text.toLowerCase()
    .replace(/<[^>]*>/g, '') // strip HTML
    .replace(/\\.[\{\(][^)}\]]*[\}\)]/g, '') // strip LaTeX
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, 60); // first 60 chars
}

const questions = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const norm = normalize(q.question_html || '');
    questions.push({ file, id: q.id, norm, original: (q.question_html || '').substring(0, 80) });
  }
}

let similar = 0;
const pairs = [];

for (let i = 0; i < questions.length; i++) {
  for (let j = i + 1; j < questions.length; j++) {
    const a = questions[i];
    const b = questions[j];
    if (a.file === b.file) continue; // Skip same-exam comparisons
    
    if (a.norm === b.norm && a.norm.length > 15) {
      similar++;
      pairs.push(`${a.file} ${a.id} == ${b.file} ${b.id}: "${a.norm}"`);
    }
  }
}

console.log(`\ngp-find-similar-questions: ${similar} cross-exam near-duplicates found`);
if (pairs.length) {
  console.log('SIMILAR QUESTION PAIRS (informational — GR domain):');
  pairs.slice(0, 20).forEach(p => console.log('  ', p));
  if (pairs.length > 20) console.log(`  ...and ${pairs.length - 20} more`);
} else {
  console.log('OK — no obvious cross-exam duplicates found');
}
