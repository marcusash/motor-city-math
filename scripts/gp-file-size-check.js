/**
 * gp-file-size-check.js
 * Flags HTML files over a size threshold (default 100KB).
 * Large HTML files may be slow to load or hard to maintain.
 *
 * Usage: node scripts/gp-file-size-check.js [--limit-kb=100]
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

const limitKB = parseInt((process.argv.find(a => a.startsWith('--limit-kb=')) || '--limit-kb=100').split('=')[1]);
const limitBytes = limitKB * 1024;

const HTML_FILES = fs.readdirSync(ROOT)
  .filter(f => f.endsWith('.html'))
  .map(f => ({ name: f, path: path.join(ROOT, f) }));

console.log(`\n=== GP File Size Check (limit: ${limitKB}KB) ===\n`);
console.log('File'.padEnd(40) + '  Size');
console.log('-'.repeat(50));

const oversized = [];
for (const { name, path: fpath } of HTML_FILES) {
  const stat = fs.statSync(fpath);
  const kb = (stat.size / 1024).toFixed(1);
  const flag = stat.size > limitBytes ? '⚠️ ' : '✅ ';
  console.log(`${flag} ${name.padEnd(38)}  ${kb}KB`);
  if (stat.size > limitBytes) oversized.push(`${name} (${kb}KB)`);
}

console.log('\n' + '-'.repeat(50));
if (oversized.length === 0) {
  console.log(`✅ All ${HTML_FILES.length} files under ${limitKB}KB`);
} else {
  console.log(`⚠️  ${oversized.length} file(s) over ${limitKB}KB:`);
  oversized.forEach(f => console.log(`   ${f}`));
  console.log(`\nLarge files may slow initial load. Consider splitting or lazy-loading.`);
}
process.exit(0); // advisory only
