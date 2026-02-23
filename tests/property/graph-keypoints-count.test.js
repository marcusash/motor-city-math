/**
 * Property test: graph key_points arrays have enough entries.
 * For graph questions, key_points.length >= min_points (or >= 3 if absent).
 * Run: node tests/property/graph-keypoints-count.test.js
 */

'use strict';

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data');
const EXAM_COUNT = 11;
const DEFAULT_MIN = 3;

let pass = 0;
let fail = 0;
let graphQCount = 0;

for (let i = 1; i <= EXAM_COUNT; i++) {
  const f = path.join(DATA_DIR, `retake-practice-${i}.json`);
  if (!fs.existsSync(f)) continue;

  const exam = JSON.parse(fs.readFileSync(f, 'utf8'));
  const examId = `rp${i}`;

  for (const q of exam.questions || []) {
    if (!q.graph) continue;
    graphQCount++;

    const kp = q.graph.key_points || [];
    const minPts = q.graph.min_points || DEFAULT_MIN;

    if (kp.length < minPts) {
      console.error(`FAIL ${examId} Q${q.number}: graph has ${kp.length} key_points but min_points=${minPts}`);
      fail++;
    } else {
      pass++;
    }
  }
}

if (fail === 0) {
  console.log(`PASS: all ${graphQCount} graph questions have sufficient key_points`);
}

console.log(`\nGraph questions checked: ${graphQCount} | Failures: ${fail}`);
if (fail > 0) process.exit(1);
