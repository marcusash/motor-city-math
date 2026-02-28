#!/usr/bin/env node
// gp-input-stats.js — comprehensive input field statistics across all exams

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let totalInputs = 0;
let withAnswer = 0;
let withoutAnswer = 0;
const typeCount = {};
const labelCount = { hasLabel: 0, noLabel: 0 };
const precisionCount = {};

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    for (const inp of (q.inputs || [])) {
      totalInputs++;
      typeCount[inp.type] = (typeCount[inp.type] || 0) + 1;
      
      if (inp.answer !== undefined && inp.answer !== null) {
        withAnswer++;
        // Count decimal precision
        const str = String(inp.answer);
        const decimals = str.includes('.') ? str.split('.')[1].length : 0;
        precisionCount[decimals] = (precisionCount[decimals] || 0) + 1;
      } else {
        withoutAnswer++;
      }
      
      if (inp.label && inp.label.trim()) labelCount.hasLabel++;
      else labelCount.noLabel++;
    }
  }
}

console.log('=== GP Input Statistics ===\n');
console.log(`Total inputs: ${totalInputs}`);
console.log(`With answer:  ${withAnswer} (${Math.round(withAnswer/totalInputs*100)}%)`);
console.log(`Without answer: ${withoutAnswer} (${Math.round(withoutAnswer/totalInputs*100)}%)`);
console.log('');
console.log('Input types:');
Object.entries(typeCount).sort((a,b)=>b[1]-a[1]).forEach(([t,c])=>console.log(`  ${t.padEnd(12)}: ${c}`));
console.log('');
console.log(`Labels: ${labelCount.hasLabel} have label, ${labelCount.noLabel} no label`);
console.log('');
console.log('Answer decimal precision:');
Object.entries(precisionCount).sort((a,b)=>a[0]-b[0]).forEach(([d,c])=>console.log(`  ${d} decimal${d==='1'?'':'s'}: ${c} answers`));
