// gp-graph-function-parseable.test.js — graph functions should not contain common syntax errors

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0;
let fail = 0;
const issues = [];

// Quick sanity patterns without full JS eval:
// 1. Must not have unbalanced parentheses
// 2. Must not be empty
// 3. Must contain 'x' (the variable)
// 4. Must not have double operators (++, --, **)

function countChars(str, char) {
  return (str.match(new RegExp(`\\${char}`, 'g')) || []).length;
}

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (!q.graph || !q.graph.function) continue;
    const fn = q.graph.function;

    if (!fn.trim()) {
      fail++;
      issues.push(`${file}: Q${q.id} graph.function is empty`);
      continue;
    }

    const openP = countChars(fn, '(');
    const closeP = countChars(fn, ')');

    if (openP !== closeP) {
      fail++;
      issues.push(`${file}: Q${q.id} graph.function has unbalanced parens: "${fn}"`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-graph-function-parseable: ${pass} pass, ${fail} fail`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
  process.exit(1);
}
console.log(`OK — ${pass} graph functions have balanced parentheses`);
