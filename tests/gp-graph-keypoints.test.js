#!/usr/bin/env node
// GP: gp-graph-keypoints.test.js
// Verifies graph key_points match the graph function (within tolerance).
// Every [x,y] pair must satisfy: |f(x) - y| <= tolerance.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
let passed = 0, failed = 0, skipped = 0;

function evalFn(fnStr, x) {
  // eslint-disable-next-line no-new-func
  return new Function('x', 'Math', `return ${fnStr};`)(x, Math);
}

for (let n = 1; n <= 10; n++) {
  const file = path.join(DATA_DIR, `retake-practice-${n}.json`);
  if (!fs.existsSync(file)) continue;
  const json = JSON.parse(fs.readFileSync(file, 'utf8'));

  for (const q of json.questions || []) {
    if (!q.graph) continue;
    const { function: fnStr, key_points, tolerance = 0.3, asymptotes } = q.graph;

    if (!fnStr || !key_points) { skipped++; continue; }

    for (const [x, y] of key_points) {
      let actual;
      try {
        actual = evalFn(fnStr, x);
      } catch (e) {
        console.error(`FAIL [${json.exam_id}] ${q.id} x=${x}: eval error: ${e.message}`);
        failed++;
        continue;
      }

      // Skip if near vertical asymptote
      if (asymptotes && asymptotes.vertical) {
        const nearAsymptote = asymptotes.vertical.some(a => Math.abs(x - a) < 0.01);
        if (nearAsymptote) { skipped++; continue; }
      }

      if (Math.abs(actual - y) <= tolerance) {
        passed++;
      } else {
        console.error(`FAIL [${json.exam_id}] ${q.id}: key_point [${x},${y}] → f(${x})=${actual.toFixed(4)}, expected ${y}, diff=${Math.abs(actual-y).toFixed(4)} > tol=${tolerance}`);
        failed++;
      }
    }
  }
}

const total = passed + failed;
if (failed === 0) {
  console.log(`✅ gp-graph-keypoints: ${passed}/${total} key_points verified (${skipped} skipped near asymptotes)`);
  process.exit(0);
} else {
  console.error(`❌ gp-graph-keypoints: ${failed} failures out of ${total} key_points`);
  process.exit(1);
}
