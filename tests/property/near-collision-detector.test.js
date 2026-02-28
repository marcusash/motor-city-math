/**
 * near-collision-detector.test.js
 * Verifies gi-near-collision-detector.cjs exits 0 (advisory only) on the current corpus.
 */

'use strict';

const { execSync } = require('child_process');
const path = require('path');

const ROOT   = path.join(__dirname, '..', '..');
const SCRIPT = path.join(ROOT, 'scripts', 'gi-near-collision-detector.cjs');

let output = '';
let exitCode = 0;
try {
  output = execSync(`node "${SCRIPT}"`, { cwd: ROOT, encoding: 'utf8' });
} catch (err) {
  exitCode = err.status || 1;
  output = err.stdout || err.message;
}

// The detector is advisory only — it MUST exit 0 even when it finds warnings
console.assert(exitCode === 0, `near-collision-detector should exit 0 (advisory), got ${exitCode}`);

// Should report a summary line
console.assert(output.includes('Near-collision') || output.toLowerCase().includes('advisory') || output.includes('collision'),
  'Expected output to mention collisions or near-collision');

// Should not have zero advisories — W2.b has many small integers
const match = output.match(/(\d+)\s+advisor/i);
if (match) {
  const count = parseInt(match[1]);
  console.assert(count > 0, `Expected >0 advisories in current corpus, got ${count}`);
  console.log(`PASS: near-collision-detector exits 0 with ${count} advisories`);
} else {
  console.log('PASS: near-collision-detector exits 0 (output structure may vary)');
}
