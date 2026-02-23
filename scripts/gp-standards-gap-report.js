// gp-standards-gap-report.js — full W2.a-e / W3.a-f breakdown per exam
// Shows how many questions cover each sub-standard so GR can spot gaps

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

// Expected standards
const STANDARDS = [
  'W2.a', 'W2.b', 'W2.c', 'W2.d', 'W2.e',
  'W3.a', 'W3.b', 'W3.c', 'W3.d', 'W3.e', 'W3.f'
];

// Aggregate counts
const globalMap = {};
for (const s of STANDARDS) globalMap[s] = 0;
globalMap['other'] = 0;

console.log('\n=== STANDARDS GAP REPORT ===\n');
console.log('Per-exam breakdown:\n');

const table = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const examMap = {};
  for (const s of STANDARDS) examMap[s] = 0;
  examMap['other'] = 0;

  for (const q of data.questions) {
    const std = q.standard || 'other';
    if (STANDARDS.includes(std)) {
      examMap[std]++;
      globalMap[std]++;
    } else {
      examMap['other']++;
      globalMap['other']++;
    }
  }

  const examLabel = file.replace('retake-practice-', 'RP').replace('.json', '');
  const row = { exam: examLabel };
  for (const s of STANDARDS) row[s] = examMap[s];
  row['other'] = examMap['other'];
  table.push(row);

  // Per-exam output
  const covered = STANDARDS.filter(s => examMap[s] > 0);
  const missing = STANDARDS.filter(s => examMap[s] === 0);
  console.log(`${examLabel}: ${data.questions.length}q — covered: ${covered.join(', ')} | MISSING: ${missing.length > 0 ? missing.join(', ') : 'none'}`);
}

// Global summary
console.log('\n=== GLOBAL TOTALS ===');
for (const std of STANDARDS) {
  const examsWithIt = table.filter(r => r[std] > 0).length;
  const total = globalMap[std];
  const status = total < 5 ? '⚠️  SPARSE' : (total < 10 ? '📋 LOW' : '✅');
  console.log(`  ${std.padEnd(6)} ${String(total).padStart(3)} questions across ${examsWithIt}/11 exams  ${status}`);
}

if (globalMap['other'] > 0) {
  console.log(`  other  ${String(globalMap['other']).padStart(3)} questions with non-standard codes`);
}

// Identify lowest coverage
const lowest = STANDARDS.sort((a, b) => globalMap[a] - globalMap[b]).slice(0, 3);
console.log('\n=== TOP GAPS (GR action items) ===');
for (const s of lowest) {
  console.log(`  ${s}: only ${globalMap[s]} questions total — needs more coverage`);
}

console.log('\nReport complete.\n');
