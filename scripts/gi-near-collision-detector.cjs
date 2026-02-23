#!/usr/bin/env node
/**
 * gi-near-collision-detector.cjs
 * GI advisory: flag exam answers within ±1 of another exam's same-slot answer.
 * Not a hard failure, but warns GR to use values farther apart.
 *
 * Usage: node scripts/gi-near-collision-detector.cjs
 */

'use strict';

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const EXAM_COUNT = 11;
const NEAR_DISTANCE = 1; // flag if answers in same slot are within this distance

function loadExams() {
  const exams = [];
  for (let i = 1; i <= EXAM_COUNT; i++) {
    const f = path.join(DATA_DIR, `retake-practice-${i}.json`);
    if (fs.existsSync(f)) {
      exams.push({ id: `rp${i}`, data: JSON.parse(fs.readFileSync(f, 'utf8')) });
    }
  }
  return exams;
}

function getIntegerAnswersForQuestion(q) {
  const answers = [];
  for (const inp of q.inputs || []) {
    if (typeof inp.answer === 'number' && Number.isInteger(inp.answer) && !isNaN(inp.answer)) {
      answers.push(inp.answer);
    }
  }
  return answers;
}

function detectNearCollisions(exams) {
  const warnings = [];

  // Build per-slot index: slot (qNum) -> [{exam, answer, standard}]
  const slots = {};
  for (const { id, data } of exams) {
    for (const q of data.questions || []) {
      const slot = q.number;
      if (!slots[slot]) slots[slot] = [];
      const answers = getIntegerAnswersForQuestion(q);
      for (const ans of answers) {
        slots[slot].push({ exam: id, answer: ans, standard: q.standard });
      }
    }
  }

  // Compare all pairs within each slot
  for (const [slot, entries] of Object.entries(slots)) {
    for (let i = 0; i < entries.length; i++) {
      for (let j = i + 1; j < entries.length; j++) {
        const a = entries[i];
        const b = entries[j];
        if (a.exam === b.exam) continue; // skip same-exam comparisons

        const dist = Math.abs(a.answer - b.answer);
        if (dist > 0 && dist <= NEAR_DISTANCE) {
          warnings.push({
            slot: Number(slot),
            exam_a: a.exam,
            answer_a: a.answer,
            exam_b: b.exam,
            answer_b: b.answer,
            distance: dist,
            standard: a.standard,
          });
        }
      }
    }
  }

  return warnings;
}

function main() {
  const exams = loadExams();
  const warnings = detectNearCollisions(exams);

  console.log('\n=== GI Near-Collision Detector ===');
  console.log(`Checking ${exams.length} exams for answers within ±${NEAR_DISTANCE} in same slot\n`);

  if (warnings.length === 0) {
    console.log('CLEAN: No near-collisions detected.');
  } else {
    for (const w of warnings) {
      console.log(
        `[NEAR] Q${w.slot} ${w.exam_a}(${w.answer_a}) vs ${w.exam_b}(${w.answer_b}) — dist=${w.distance} standard=${w.standard}`
      );
    }
    console.log(`\nTotal: ${warnings.length} near-collision(s) found.`);
    console.log('Advisory only. Use gi-answer-space-density.cjs to find better values.');
  }

  // Exit 0 always — this is advisory only
}

main();
