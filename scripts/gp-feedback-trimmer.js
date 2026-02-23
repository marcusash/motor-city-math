#!/usr/bin/env node
// gp-feedback-trimmer.js — Trim feedback_wrong over 12 words (ADHD rule: max 12 words)
const fs = require('fs'), path = require('path');
const DATA = path.join(__dirname, '..', 'data');
const files = fs.readdirSync(DATA).filter(f => f.match(/^retake-practice-\d+\.json$/));
let fixed = 0;
for (const file of files) {
  const fp = path.join(DATA, file);
  const json = JSON.parse(fs.readFileSync(fp));
  let changed = false;
  for (const q of (json.questions || [])) {
    for (const field of ['feedback_wrong','feedback_correct']) {
      if (!q[field]) continue;
      const words = q[field].trim().split(/\s+/);
      if (words.length > 12) {
        const trimmed = words.slice(0,12).join(' ') + '.';
        console.log(`Trimming ${file} ${q.id}.${field}: "${q[field]}" -> "${trimmed}"`);
        q[field] = trimmed;
        changed = true; fixed++;
      }
    }
  }
  if (changed) fs.writeFileSync(fp, JSON.stringify(json, null, 2));
}
console.log(`\nTrimmed ${fixed} fields`);