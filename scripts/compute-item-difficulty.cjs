#!/usr/bin/env node
// scripts/compute-item-difficulty.cjs
// Reads all kai-scores-*.json files and computes per-question attempted/correct
// ratios. Reports item difficulty for each question slot, per exam and overall.
// Run: node scripts/compute-item-difficulty.cjs

'use strict';

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

// --- Load all score files ---

const scoreFiles = fs.readdirSync(DATA_DIR)
  .filter(f => f.startsWith('kai-scores-') && f.endsWith('.json') && f !== 'kai-scores-latest.json')
  .sort();

if (scoreFiles.length === 0) {
  console.log('No kai-scores-*.json files found.');
  process.exit(0);
}

// --- Accumulate correct/attempted per question slot ---

// question slot = position within exam (q1..q15), not the question ID
// slot key = "examId::questionId" for specific tracking
// type key = question type for type-level analysis
// standard key = standard code

const bySlot = {};     // "Q1", "Q2" ... "Q15"
const byType = {};     // question type
const byStandard = {}; // standard code
const byExam = {};     // exam-level totals

function incrementCount(map, key, isCorrect) {
  if (!map[key]) map[key] = { correct: 0, attempted: 0 };
  map[key].attempted++;
  if (isCorrect === true) map[key].correct++;
}

for (const filename of scoreFiles) {
  const raw = JSON.parse(fs.readFileSync(path.join(DATA_DIR, filename), 'utf8'));
  const scores = raw.mcm_scores || {};

  for (const [examId, examData] of Object.entries(scores)) {
    if (!examData.attempts) continue;

    for (const attempt of examData.attempts) {
      const questions = attempt.questions || {};
      const examKey = examId.replace('mcm-', '').replace('mcm-nonlinear-exam-', 'mvp');

      let examCorrect = 0;
      let examAttempted = 0;

      const qEntries = Object.entries(questions);
      qEntries.forEach(([qid, qdata], idx) => {
        const isCorrect = qdata.correct;
        if (isCorrect == null) return;

        // Slot: 1-based position within exam
        const slotKey = `Q${idx + 1}`;
        incrementCount(bySlot, slotKey, isCorrect);

        // Type
        if (qdata.type) {
          incrementCount(byType, qdata.type, isCorrect);
        }

        // Standard (strip to W2/W3 level for broader grouping)
        if (qdata.standard) {
          incrementCount(byStandard, qdata.standard, isCorrect);
          const topLevel = qdata.standard.replace(/\.[a-z]$/, '');
          if (topLevel !== qdata.standard) {
            incrementCount(byStandard, topLevel + ' (all)', isCorrect);
          }
        }

        if (isCorrect === true) examCorrect++;
        examAttempted++;
      });

      incrementCount(byExam, examKey, null);
      byExam[examKey].correct = (byExam[examKey].correct || 0) + examCorrect;
      byExam[examKey].attempted = (byExam[examKey].attempted || 0) + examAttempted;
    }
  }
}

// --- Difficulty calculation ---
// Item difficulty (p) = proportion correct = correct / attempted
// p close to 1.0 = easy, p close to 0.0 = hard
// p 0.8-1.0 = easy, 0.5-0.8 = moderate, 0.3-0.5 = hard, <0.3 = very hard

function classify(p) {
  if (p >= 0.8) return 'EASY';
  if (p >= 0.5) return 'MODERATE';
  if (p >= 0.3) return 'HARD';
  return 'VERY HARD';
}

function report(label, map, sortKey = 'key') {
  console.log(`\n--- ${label} ---\n`);
  const entries = Object.entries(map)
    .filter(([, v]) => v.attempted > 0)
    .map(([k, v]) => {
      const p = v.correct / v.attempted;
      return { key: k, correct: v.correct, attempted: v.attempted, p, difficulty: classify(p) };
    });

  if (sortKey === 'slot') {
    entries.sort((a, b) => {
      const na = parseInt(a.key.replace('Q', ''), 10);
      const nb = parseInt(b.key.replace('Q', ''), 10);
      return na - nb;
    });
  } else {
    entries.sort((a, b) => a.p - b.p); // hardest first
  }

  for (const e of entries) {
    const bar = '█'.repeat(Math.round(e.p * 10)).padEnd(10, '░');
    console.log(`${e.key.padEnd(25)} ${String(e.correct).padStart(2)}/${e.attempted}  ${String(Math.round(e.p * 100)).padStart(3)}%  [${bar}]  ${e.difficulty}`);
  }
}

console.log('\n=== MCM Item Difficulty Report ===');
console.log(`Score files: ${scoreFiles.join(', ')}`);
console.log('Difficulty: p=0-30% VERY HARD | 30-50% HARD | 50-80% MODERATE | 80-100% EASY\n');

report('By Question Slot (Q1=Section A first, Q4=Section B first)', bySlot, 'slot');
report('By Question Type (hardest first)', byType);
report('By Standard (hardest first)', byStandard);

// Exam level summary
console.log('\n--- By Exam (overall % correct) ---\n');
const examEntries = Object.entries(byExam)
  .filter(([, v]) => v.attempted > 0)
  .map(([k, v]) => ({ key: k, correct: v.correct, attempted: v.attempted, p: v.correct / v.attempted }))
  .sort((a, b) => a.key.localeCompare(b.key));

for (const e of examEntries) {
  const bar = '█'.repeat(Math.round(e.p * 10)).padEnd(10, '░');
  console.log(`${e.key.padEnd(25)} ${String(e.correct).padStart(3)}/${e.attempted}  ${String(Math.round(e.p * 100)).padStart(3)}%  [${bar}]  ${classify(e.p)}`);
}

console.log('');

// Flag hardest questions
const hardSlots = Object.entries(bySlot)
  .filter(([, v]) => v.attempted > 0 && (v.correct / v.attempted) < 0.5)
  .map(([k, v]) => ({ key: k, p: v.correct / v.attempted }))
  .sort((a, b) => a.p - b.p);

if (hardSlots.length > 0) {
  console.log('ACTION: These question slots have <50% accuracy. GR should review difficulty:');
  for (const s of hardSlots) {
    console.log(`  ${s.key}: ${Math.round(s.p * 100)}% correct`);
  }
  console.log('');
}
