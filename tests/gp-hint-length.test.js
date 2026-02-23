#!/usr/bin/env node
// GP: gp-hint-length.test.js
// Verifies hint strings comply with the ADHD design rule: max 20 words.
// Per .voice-guide.md: hints should be brief — one direction, not a lecture.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const MAX_WORDS = 20;

let passed = 0, failed = 0;

for (let n = 1; n <= 10; n++) {
  const file = path.join(DATA_DIR, `retake-practice-${n}.json`);
  if (!fs.existsSync(file)) continue;
  const json = JSON.parse(fs.readFileSync(file, 'utf8'));

  for (const q of json.questions || []) {
    if (!q.hint) continue;
    const wordCount = q.hint.trim().split(/\s+/).length;
    if (wordCount <= MAX_WORDS) {
      passed++;
    } else {
      console.error(`FAIL [${json.exam_id}] ${q.id}: hint has ${wordCount} words (max ${MAX_WORDS})`);
      console.error(`  Hint: "${q.hint}"`);
      failed++;
    }
  }
}

const total = passed + failed;
if (failed === 0) {
  console.log(`✅ gp-hint-length: ${passed}/${total} hints within ${MAX_WORDS}-word ADHD limit`);
  process.exit(0);
} else {
  console.error(`❌ gp-hint-length: ${failed}/${total} hints exceed ${MAX_WORDS} words`);
  process.exit(1);
}
