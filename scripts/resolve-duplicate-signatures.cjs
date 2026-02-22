#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const dataDir = path.join(root, 'data');
const outputDir = path.join(root, 'artifacts');
const examPattern = /^retake-practice-\d+\.json$/;

const shouldWrite = process.argv.includes('--write') || process.env.MCM_DUPLICATE_REPORT === '1';

const parseStandards = (value) => {
  if (Array.isArray(value)) return value;
  return String(value || '')
    .split(',')
    .flatMap((part) => part.split('&'))
    .map((part) => part.trim())
    .filter(Boolean);
};

const normalizeNumber = (value) => {
  if (typeof value !== 'number') return null;
  return Math.round(value * 1000) / 1000;
};

const files = fs.readdirSync(dataDir).filter((file) => examPattern.test(file)).sort();
const signatures = {};

for (const file of files) {
  const data = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf8'));
  const examId = data.exam_id || file.replace('.json', '');
  for (const q of data.questions || []) {
    const standards = parseStandards(q.standard).sort();
    const answers = [];
    (q.inputs || []).forEach((inp) => {
      if (inp.type === 'number') {
        const normalized = normalizeNumber(inp.answer);
        if (normalized !== null) answers.push(normalized);
      }
    });
    if (!standards.length || !answers.length) continue;
    const signature = `${standards.join('|')}::${answers.sort((a, b) => a - b).join('|')}`;
    if (!signatures[signature]) signatures[signature] = [];
    signatures[signature].push({
      exam_id: examId,
      question_id: q.id,
      number: q.number,
      standards,
      answers
    });
  }
}

const duplicates = Object.entries(signatures)
  .filter(([, items]) => items.length > 1)
  .map(([signature, items]) => ({ signature, items }));

if (duplicates.length === 0) {
  console.log('No duplicate signatures found.');
} else {
  console.log(`Duplicate signatures: ${duplicates.length}`);
  duplicates.forEach((dup) => {
    console.log(`\n${dup.signature}`);
    dup.items.forEach((item) => {
      console.log(`  ${item.exam_id} Q${item.number} (${item.question_id}) answers=[${item.answers.join(', ')}]`);
    });
  });
}

if (shouldWrite) {
  fs.mkdirSync(outputDir, { recursive: true });
  const report = {
    generated_at: new Date().toISOString(),
    source: 'data/retake-practice-*.json',
    duplicate_signatures: duplicates
  };
  fs.writeFileSync(path.join(outputDir, 'duplicate-signatures.json'), JSON.stringify(report, null, 2));
  console.log(`\nWrote ${path.join('artifacts', 'duplicate-signatures.json')}`);
}
