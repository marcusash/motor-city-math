#!/usr/bin/env node
/**
 * gi-word-count.cjs
 * GI analytics: count words in hints, solution_steps, and feedback for every question.
 * Flag any over threshold. Output stats per exam.
 *
 * Thresholds (from .voice-guide.md ADHD guidelines):
 *   hint:             <= 30 words
 *   solution step:    <= 20 words each
 *   feedback_correct: <= 15 words
 *   feedback_wrong:   <= 20 words
 *
 * Usage: node scripts/gi-word-count.cjs [--exam rpN] [--stats-only]
 */

'use strict';

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const EXAM_COUNT = 11;

const THRESHOLDS = {
  hint: 30,
  solution_step: 20,
  feedback_correct: 15,
  feedback_wrong: 20,
};

function countWords(text) {
  if (!text || typeof text !== 'string') return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function analyzeExam(examId, exam) {
  const violations = [];
  const stats = {
    exam: examId,
    hint_avg: 0,
    hint_max: 0,
    fb_correct_avg: 0,
    fb_correct_max: 0,
    fb_wrong_avg: 0,
    fb_wrong_max: 0,
    step_avg: 0,
    step_max: 0,
    violations: 0,
  };

  let hintSum = 0, hintCount = 0;
  let fbcSum = 0, fbcCount = 0;
  let fbwSum = 0, fbwCount = 0;
  let stepSum = 0, stepCount = 0;

  for (const q of exam.questions || []) {
    // Hint (singular field)
    if (q.hint) {
      const wc = countWords(q.hint);
      hintSum += wc; hintCount++;
      if (wc > stats.hint_max) stats.hint_max = wc;
      if (wc > THRESHOLDS.hint) {
        violations.push({ qNum: q.number, field: 'hint', words: wc, limit: THRESHOLDS.hint });
      }
    }

    // Solution steps
    for (const step of q.solution_steps || []) {
      const wc = countWords(step);
      stepSum += wc; stepCount++;
      if (wc > stats.step_max) stats.step_max = wc;
      if (wc > THRESHOLDS.solution_step) {
        violations.push({ qNum: q.number, field: 'solution_step', words: wc, limit: THRESHOLDS.solution_step });
      }
    }

    // Feedback correct
    if (q.feedback_correct) {
      const wc = countWords(q.feedback_correct);
      fbcSum += wc; fbcCount++;
      if (wc > stats.fb_correct_max) stats.fb_correct_max = wc;
      if (wc > THRESHOLDS.feedback_correct) {
        violations.push({ qNum: q.number, field: 'feedback_correct', words: wc, limit: THRESHOLDS.feedback_correct });
      }
    }

    // Feedback wrong (unified or split)
    const fbwText = q.feedback_wrong || q.feedback_wrong_parent || '';
    if (fbwText) {
      const wc = countWords(fbwText);
      fbwSum += wc; fbwCount++;
      if (wc > stats.fb_wrong_max) stats.fb_wrong_max = wc;
      if (wc > THRESHOLDS.feedback_wrong) {
        violations.push({ qNum: q.number, field: 'feedback_wrong', words: wc, limit: THRESHOLDS.feedback_wrong });
      }
    }
  }

  stats.hint_avg = hintCount ? Math.round(hintSum / hintCount) : 0;
  stats.fb_correct_avg = fbcCount ? Math.round(fbcSum / fbcCount) : 0;
  stats.fb_wrong_avg = fbwCount ? Math.round(fbwSum / fbwCount) : 0;
  stats.step_avg = stepCount ? Math.round(stepSum / stepCount) : 0;
  stats.violations = violations.length;

  return { stats, violations };
}

function main() {
  const args = process.argv.slice(2);
  const examFilter = args.includes('--exam') ? args[args.indexOf('--exam') + 1] : null;
  const statsOnly = args.includes('--stats-only');

  let totalViolations = 0;

  console.log('\n=== GI Word Count Analysis ===');
  console.log(`Thresholds: hint<=${THRESHOLDS.hint}w, step<=${THRESHOLDS.solution_step}w, fb_correct<=${THRESHOLDS.feedback_correct}w, fb_wrong<=${THRESHOLDS.feedback_wrong}w\n`);

  const header = ['Exam', 'Hint avg', 'Hint max', 'Step avg', 'Step max', 'FbCorr avg', 'FbWrong avg', 'Violations'];
  console.log(header.map(h => h.padEnd(12)).join(' | '));
  console.log('-'.repeat(100));

  for (let i = 1; i <= EXAM_COUNT; i++) {
    const id = `rp${i}`;
    if (examFilter && id !== examFilter) continue;

    const f = path.join(DATA_DIR, `retake-practice-${i}.json`);
    if (!fs.existsSync(f)) continue;

    const exam = JSON.parse(fs.readFileSync(f, 'utf8'));
    const { stats, violations } = analyzeExam(id, exam);
    totalViolations += violations.length;

    const row = [
      stats.exam,
      String(stats.hint_avg),
      String(stats.hint_max),
      String(stats.step_avg),
      String(stats.step_max),
      String(stats.fb_correct_avg),
      String(stats.fb_wrong_avg),
      violations.length > 0 ? `${violations.length} WARN` : 'OK',
    ];
    console.log(row.map(c => c.padEnd(12)).join(' | '));

    if (!statsOnly && violations.length > 0) {
      for (const v of violations) {
        console.log(`  [WARN] Q${v.qNum} ${v.field}: ${v.words} words (limit ${v.limit})`);
      }
    }
  }

  console.log(`\nTotal violations: ${totalViolations}`);
  if (totalViolations > 0) {
    console.log('Advisory only. Long text may cause cognitive overload for Kai (ADHD).');
  }
}

main();
