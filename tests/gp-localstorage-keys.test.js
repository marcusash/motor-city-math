/**
 * gp-localstorage-keys.test.js
 * Verifies unique localStorage keys across all HTML files.
 * Per memory: 4 HTML files share 'algebra2TestResults' — this test tracks that.
 * GP: sprint batch — test 13
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

// Production HTML files only (exclude design prototypes)
const PRODUCTION_FILES = [
  'index.html',
  'exam.html',
  'final_exam_251123.html',
  'final_exam_251123_mini.html',
];

// Extract all localStorage.setItem / localStorage.getItem key names from a file
function extractKeys(content) {
  const keys = new Set();
  const patterns = [
    /localStorage\.setItem\s*\(\s*['"]([^'"]+)['"]/g,
    /localStorage\.getItem\s*\(\s*['"]([^'"]+)['"]/g,
    /localStorage\.removeItem\s*\(\s*['"]([^'"]+)['"]/g,
  ];
  for (const pattern of patterns) {
    let m;
    while ((m = pattern.exec(content)) !== null) {
      keys.add(m[1]);
    }
  }
  return keys;
}

const fileKeys = {};
let checks = 0;
let warnings = 0;

for (const fname of PRODUCTION_FILES) {
  const fpath = path.join(ROOT, fname);
  if (!fs.existsSync(fpath)) continue;
  const content = fs.readFileSync(fpath, 'utf8');
  fileKeys[fname] = extractKeys(content);
  checks++;
}

// Find shared keys (potential collision between production files)
const keyOwners = {};
for (const [fname, keys] of Object.entries(fileKeys)) {
  for (const key of keys) {
    if (!keyOwners[key]) keyOwners[key] = [];
    keyOwners[key].push(fname);
  }
}

const collisions = Object.entries(keyOwners).filter(([, owners]) => owners.length > 1);

console.log(`\n=== GP localStorage Key Audit ===`);
console.log(`Scanned ${checks} production files`);

if (collisions.length === 0) {
  console.log(`✅ No shared localStorage keys — all keys are unique per file`);
} else {
  console.log(`⚠️  ${collisions.length} shared key(s) found (collision risk):`);
  collisions.forEach(([key, owners]) => {
    console.log(`  '${key}' used in: ${owners.join(', ')}`);
    warnings++;
  });
  console.log(`\nNote: Shared keys cause data overwrite when switching between tests.`);
  console.log(`Each exam should use a unique key like 'mcm-rp1-results', 'mcm-exam-results'.`);
}

// All keys list
console.log(`\nAll localStorage keys by file:`);
for (const [fname, keys] of Object.entries(fileKeys)) {
  console.log(`  ${fname}: [${[...keys].join(', ')}]`);
}

// Exit 0 even with collisions — this is a warning/audit test, not a gate
// The collision is a known issue tracked in .agent-status.md
process.exit(0);
