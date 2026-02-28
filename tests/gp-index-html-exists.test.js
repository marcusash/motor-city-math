// gp-index-html-exists.test.js — index.html must exist (dashboard)

const fs = require('fs');
const path = require('path');

const INDEX_HTML = path.join(__dirname, '..', 'index.html');

console.log(`gp-index-html-exists: checking index.html`);
if (!fs.existsSync(INDEX_HTML)) {
  console.log(`  FAIL: index.html does not exist`);
  process.exit(1);
}

const stat = fs.statSync(INDEX_HTML);
const sizeKB = (stat.size / 1024).toFixed(1);
console.log(`  Found: ${sizeKB}KB`);
if (stat.size < 5120) {
  console.log(`  FAIL: index.html is too small (${sizeKB}KB) — may be corrupted`);
  process.exit(1);
}
console.log(`OK — index.html exists and is ${sizeKB}KB (healthy)`);
