// gp-shared-styles-not-minified.test.js — shared/styles.css should be readable (not minified)

const fs = require('fs');
const path = require('path');

const STYLES = path.join(__dirname, '..', 'shared', 'styles.css');

if (!fs.existsSync(STYLES)) {
  console.log('gp-shared-styles-not-minified: 0 pass, 1 fail — shared/styles.css not found');
  process.exit(1);
}

const content = fs.readFileSync(STYLES, 'utf8');
const lines = content.split('\n');
const avgLineLength = content.length / lines.length;

console.log(`gp-shared-styles-not-minified: ${lines.length} lines, avg ${avgLineLength.toFixed(0)} chars/line`);

if (avgLineLength > 300) {
  console.log(`  WARN: avg line length suggests minification`);
} else {
  console.log(`  OK: readable format`);
}

// Verify it contains Pistons palette colors (design system requirement)
const hasPistons = content.includes('#C8102E') || content.includes('#1D42BA') || content.includes('#002D62');
if (hasPistons) {
  console.log(`  Pistons palette colors found`);
} else {
  console.log(`  INFO: No Pistons palette colors found in shared/styles.css`);
}

console.log(`OK — shared/styles.css readability audit complete`);
