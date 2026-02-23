#!/usr/bin/env node
// gp-word-count.js — Report word counts for hints and feedback (ADHD compliance)
const fs = require('fs'), path = require('path');
const DATA = path.join(__dirname, '..', 'data');
const files = fs.readdirSync(DATA).filter(f => f.match(/^retake-practice-\d+\.json$/));
const over = [];
for (const file of files) {
  const json = JSON.parse(fs.readFileSync(path.join(DATA, file)));
  for (const q of (json.questions || [])) {
    for (const field of ['feedback_correct','feedback_wrong','hint']) {
      if (!q[field]) continue;
      const w = q[field].trim().split(/\s+/).length;
      if (w > 12) over.push({ file, id: q.id, field, words: w, text: q[field].slice(0,50) });
    }
  }
}
if (over.length === 0) console.log('✅ All feedback/hints within 12-word ADHD limit');
else { console.table(over); console.log(`${over.length} violations found`); }