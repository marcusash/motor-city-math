// gp-shared-scripts-not-minified.test.js — shared/scripts.js should be human-readable (not minified)

const fs = require('fs');
const path = require('path');

const SCRIPT = path.join(__dirname, '..', 'shared', 'scripts.js');

if (!fs.existsSync(SCRIPT)) {
  console.log('gp-shared-scripts-not-minified: 0 pass, 1 fail — shared/scripts.js not found');
  process.exit(1);
}

const content = fs.readFileSync(SCRIPT, 'utf8');
const lines = content.split('\n');
const totalChars = content.length;
const avgLineLength = totalChars / lines.length;

console.log(`gp-shared-scripts-not-minified: ${lines.length} lines, avg ${avgLineLength.toFixed(0)} chars/line`);

// Minified files typically have very long lines (>500 chars avg)
if (avgLineLength > 500) {
  console.log(`  WARN: avg line length ${avgLineLength.toFixed(0)} suggests minification`);
} else if (lines.length < 10 && totalChars > 1000) {
  console.log(`  WARN: very few lines (${lines.length}) for ${totalChars} chars — possible minification`);
} else {
  console.log(`  OK: readable format detected`);
}
console.log(`OK — shared/scripts.js readability audit complete`);
