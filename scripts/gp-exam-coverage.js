#!/usr/bin/env node
// GP: gp-exam-coverage.js
// Reports exam coverage stats: which questions have graphs, hints, 
// multiple inputs, etc. Useful for GA (exam renderer) and GR (content).

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

let totals = {
  questions: 0,
  withGraphs: 0,
  withHints: 0,
  multiInput: 0,
  singleInput: 0,
  withText: 0,
  withNumber: 0
};

const examStats = [];

for (let n = 1; n <= 10; n++) {
  const file = path.join(DATA_DIR, `retake-practice-${n}.json`);
  if (!fs.existsSync(file)) continue;
  const json = JSON.parse(fs.readFileSync(file, 'utf8'));
  const qs = json.questions || [];

  const stat = {
    exam: json.exam_id,
    count: qs.length,
    graphs: 0,
    hints: 0,
    multiInput: 0,
    singleInput: 0,
    textInputs: 0,
    numberInputs: 0
  };

  for (const q of qs) {
    totals.questions++;
    if (q.graph) { stat.graphs++; totals.withGraphs++; }
    if (q.hint) { stat.hints++; totals.withHints++; }
    const inputs = q.inputs || [];
    if (inputs.length > 1) { stat.multiInput++; totals.multiInput++; }
    else { stat.singleInput++; totals.singleInput++; }
    for (const inp of inputs) {
      if (inp.type === 'text') { stat.textInputs++; totals.withText++; }
      if (inp.type === 'number') { stat.numberInputs++; totals.withNumber++; }
    }
  }

  examStats.push(stat);
}

console.log('=== EXAM COVERAGE REPORT ===\n');
console.log(`Total questions: ${totals.questions}`);
console.log(`With graphs:     ${totals.withGraphs} (${pct(totals.withGraphs, totals.questions)}%)`);
console.log(`With hints:      ${totals.withHints} (${pct(totals.withHints, totals.questions)}%)`);
console.log(`Single input:    ${totals.singleInput}`);
console.log(`Multi input:     ${totals.multiInput}`);
console.log(`Number inputs:   ${totals.withNumber}`);
console.log(`Text inputs:     ${totals.withText}`);
console.log('\nPer-exam breakdown:');
console.log('Exam                    | Qs | Graphs | Hints | Multi');
console.log('------------------------|----|----|----|----|');
for (const s of examStats) {
  const name = s.exam.padEnd(23).slice(0, 23);
  console.log(`${name} | ${String(s.count).padStart(2)} | ${String(s.graphs).padStart(2)}     | ${String(s.hints).padStart(2)}    | ${s.multiInput}`);
}

function pct(n, d) { return d === 0 ? 0 : Math.round(n / d * 100); }
