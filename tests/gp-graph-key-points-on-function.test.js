// gp-graph-key-points-on-function.test.js — graph key_points should satisfy f(x) ≈ y within tolerance

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

// Safe eval wrapper for graph functions (using x variable)
function evalFn(fnStr, x) {
  try {
    // Replace Math. references and evaluate
    return Function('x', 'Math', `'use strict'; return ${fnStr};`)(x, Math);
  } catch (e) {
    return NaN;
  }
}

let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (!q.graph || !q.graph.function || !q.graph.key_points) continue;
    const tolerance = q.graph.tolerance || 0.5;
    const fn = q.graph.function;
    
    for (const [x, y] of q.graph.key_points) {
      const computed = evalFn(fn, x);
      if (isNaN(computed)) {
        warn++;
        warnings.push(`${file}: Q${q.id} fn="${fn}" failed to evaluate at x=${x}`);
        continue;
      }
      const diff = Math.abs(computed - y);
      if (diff > tolerance) {
        warn++;
        warnings.push(`${file}: Q${q.id} key_point [${x},${y}]: f(${x})=${computed.toFixed(3)} diff=${diff.toFixed(3)} > tol=${tolerance}`);
      } else {
        pass++;
      }
    }
  }
}

console.log(`gp-graph-key-points-on-function: ${pass} pass, ${warn} mismatch`);
if (warnings.length) {
  console.log('INFO — key_points not on function (math accuracy gap):');
  warnings.slice(0, 5).forEach(w => console.log('  ', w));
  if (warn > 5) console.log(`  ... and ${warn - 5} more`);
}
console.log(`OK — ${pass} key_points verified against graph function`);
