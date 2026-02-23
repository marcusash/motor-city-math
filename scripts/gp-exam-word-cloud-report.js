// gp-exam-word-cloud-report.js — show the 20 most common words in question_html across all exams
// Helps GR identify vocabulary patterns and ensure question diversity

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const STOP_WORDS = new Set([
  'the', 'a', 'an', 'of', 'in', 'is', 'are', 'to', 'and', 'for', 'that',
  'it', 'on', 'at', 'be', 'with', 'as', 'by', 'from', 'this', 'has', 'if',
  'or', 'not', 'was', 'will', 'can', 'which', 'have', 'what', 'you',
  'find', 'given', 'use', 'where', 'each'
]);

const wordCount = {};

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const text = (q.question_html || '').replace(/<[^>]+>/g, ' ').toLowerCase();
    const words = text.match(/\b[a-z]{4,}\b/g) || [];
    for (const w of words) {
      if (!STOP_WORDS.has(w)) {
        wordCount[w] = (wordCount[w] || 0) + 1;
      }
    }
  }
}

const top = Object.entries(wordCount)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 30);

console.log('\n=== QUESTION VOCABULARY TOP 30 ===\n');
for (const [word, count] of top) {
  const bar = '#'.repeat(Math.min(40, Math.floor(count / 2)));
  console.log(`  ${String(count).padStart(3)}  ${word.padEnd(20)} ${bar}`);
}
console.log('\nReport complete.\n');
