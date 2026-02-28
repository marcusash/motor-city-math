#!/usr/bin/env node
/**
 * gi-exam-similarity.cjs
 * GI analytics: compare any two exams for structural similarity.
 * Modes: --pair rp1 rp2 (single pair) or --matrix (all pairs)
 *
 * Similarity is measured by:
 * - % matching question types in same position (0-100)
 * - % matching sections in same position
 * - % matching standards in same position
 *
 * Usage:
 *   node scripts/gi-exam-similarity.cjs --pair rp1 rp2
 *   node scripts/gi-exam-similarity.cjs --matrix
 */

'use strict';

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const EXAM_COUNT = 11;

function loadExam(id) {
  const num = id.replace('rp', '');
  const f = path.join(DATA_DIR, `retake-practice-${num}.json`);
  if (!fs.existsSync(f)) return null;
  return { id, data: JSON.parse(fs.readFileSync(f, 'utf8')) };
}

function loadAll() {
  const exams = [];
  for (let i = 1; i <= EXAM_COUNT; i++) {
    const e = loadExam(`rp${i}`);
    if (e) exams.push(e);
  }
  return exams;
}

function computeSimilarity(examA, examB) {
  const qA = examA.data.questions || [];
  const qB = examB.data.questions || [];
  const len = Math.min(qA.length, qB.length);

  let typeMatch = 0, sectionMatch = 0, standardMatch = 0;

  for (let i = 0; i < len; i++) {
    if (qA[i].type === qB[i].type) typeMatch++;
    if (qA[i].section === qB[i].section) sectionMatch++;
    if (qA[i].standard === qB[i].standard) standardMatch++;
  }

  return {
    pair: `${examA.id} vs ${examB.id}`,
    type_match_pct: Math.round((typeMatch / len) * 100),
    section_match_pct: Math.round((sectionMatch / len) * 100),
    standard_match_pct: Math.round((standardMatch / len) * 100),
    overall_pct: Math.round(((typeMatch + sectionMatch + standardMatch) / (len * 3)) * 100),
    questions_compared: len,
  };
}

function printPair(sim) {
  console.log(`\n--- ${sim.pair} ---`);
  console.log(`  Type match:     ${sim.type_match_pct}%`);
  console.log(`  Section match:  ${sim.section_match_pct}%`);
  console.log(`  Standard match: ${sim.standard_match_pct}%`);
  console.log(`  Overall:        ${sim.overall_pct}%`);
}

function main() {
  const args = process.argv.slice(2);
  const pairIdx = args.indexOf('--pair');
  const matrixMode = args.includes('--matrix');

  if (pairIdx !== -1) {
    const idA = args[pairIdx + 1];
    const idB = args[pairIdx + 2];
    if (!idA || !idB) {
      console.error('Usage: --pair rp1 rp2');
      process.exit(1);
    }
    const examA = loadExam(idA);
    const examB = loadExam(idB);
    if (!examA) { console.error(`Exam not found: ${idA}`); process.exit(1); }
    if (!examB) { console.error(`Exam not found: ${idB}`); process.exit(1); }

    console.log('\n=== GI Exam Similarity ===');
    printPair(computeSimilarity(examA, examB));
    return;
  }

  // Default or --matrix: all pairs
  const exams = loadAll();
  console.log('\n=== GI Exam Similarity Matrix ===');
  console.log(`Comparing ${exams.length} exams (${exams.length * (exams.length - 1) / 2} pairs)\n`);

  // Print compact matrix header
  const ids = exams.map(e => e.id.padEnd(5));
  console.log('      ' + ids.join(' '));

  const matrix = {};
  for (let i = 0; i < exams.length; i++) {
    let row = exams[i].id.padEnd(5) + ' ';
    for (let j = 0; j < exams.length; j++) {
      if (i === j) {
        row += '---   ';
      } else {
        const key = [exams[i].id, exams[j].id].sort().join('|');
        if (!matrix[key]) {
          matrix[key] = computeSimilarity(exams[i], exams[j]);
        }
        row += String(matrix[key].overall_pct + '%').padEnd(6);
      }
    }
    console.log(row);
  }

  // Summary: most and least similar pairs
  const pairs = Object.values(matrix);
  pairs.sort((a, b) => b.overall_pct - a.overall_pct);
  console.log('\nMost similar:');
  pairs.slice(0, 3).forEach(p => console.log(`  ${p.pair}: ${p.overall_pct}%`));
  console.log('\nLeast similar:');
  pairs.slice(-3).forEach(p => console.log(`  ${p.pair}: ${p.overall_pct}%`));
}

main();
