#!/usr/bin/env node
/**
 * scripts/lint-exam-json.js
 * Data quality linter for Motor City Math practice exam JSON files.
 *
 * Checks:
 *   1. Top-level required fields present
 *   2. Questions array non-empty
 *   3. Each question has required fields
 *   4. Math delimiters use double-backslash (not quadruple) in raw file
 *   5. Input labels contain no literal \uXXXX escape sequences
 *   6. Number inputs have tolerance field
 *   7. Dropdown inputs have options array and answer is in options
 *   8. No duplicate question IDs within a file
 *   9. No duplicate answers across files (cross-exam collision check)
 *  10. Answers are not undefined/null
 */

'use strict';

const fs = require('fs');
const path = require('path');
const glob = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const EXAM_PATTERN = /^retake-practice-\d+\.json$/;

const REQUIRED_TOP_LEVEL = ['exam_id', 'title', 'questions', 'time_minutes'];
const REQUIRED_QUESTION = ['id', 'number', 'standard', 'type', 'question_html'];
const REQUIRED_INPUT = ['id', 'type', 'label', 'answer'];

let totalErrors = 0;
let totalWarnings = 0;

function error(file, msg) {
  console.error(`  ❌ ${msg}`);
  totalErrors++;
}

function warn(file, msg) {
  console.warn(`  ⚠️  ${msg}`);
  totalWarnings++;
}

function lintFile(filepath) {
  const filename = path.basename(filepath);
  const rawContent = fs.readFileSync(filepath, 'utf8');
  let data;

  try {
    data = JSON.parse(rawContent);
  } catch (e) {
    console.error(`\n${filename}`);
    error(filename, `Invalid JSON: ${e.message}`);
    return null;
  }

  const fileErrors = [];
  const fileWarns = [];
  const localError = (msg) => { fileErrors.push(msg); totalErrors++; };
  const localWarn  = (msg) => { fileWarns.push(msg); totalWarnings++; };

  // 1. Top-level required fields
  for (const field of REQUIRED_TOP_LEVEL) {
    if (!(field in data)) localError(`Missing top-level field: "${field}"`);
  }

  const questions = data.questions || [];

  // 2. Questions non-empty
  if (!Array.isArray(questions) || questions.length === 0) {
    localError('questions array is empty or missing');
  }

  // 3. Check raw file for quadruple-backslash math delimiters
  //    In raw JSON, correct is \\( (2 chars) -> \( after parse
  //    Wrong is \\\\( (4 chars) -> \\( after parse (KaTeX won't render)
  const quadBackslashMatches = rawContent.match(/\\{4}[\\(leftrightcdotdfracsqrtfrac]/g);
  if (quadBackslashMatches) {
    localError(`Quadruple-backslash in math delimiters (${quadBackslashMatches.length} occurrences). ` +
      `Use \\\\( not \\\\\\\\(. KaTeX will not render.`);
  }

  // 4. Check for literal \\uXXXX escape sequences in the raw file
  //    These show as literal text instead of Unicode characters on screen
  const literalUnicode = rawContent.match(/\\{2}u[0-9a-fA-F]{4}/g);
  if (literalUnicode) {
    localError(`Literal \\\\uXXXX sequences found (${literalUnicode.length}): ${[...new Set(literalUnicode)].slice(0,3).join(', ')}. ` +
      `Use actual Unicode characters (e.g. ₁ ₂) in label fields.`);
  }

  // Per-question checks
  const seenIds = new Set();
  const numberAnswers = []; // for cross-exam collision return

  for (const q of questions) {
    const qid = q.id || `Q#${q.number}`;

    // 5. Required question fields
    for (const field of REQUIRED_QUESTION) {
      if (!(field in q)) localError(`Question ${qid}: missing field "${field}"`);
    }

    // 6. Duplicate IDs
    if (seenIds.has(q.id)) {
      localError(`Duplicate question id: "${q.id}"`);
    }
    seenIds.add(q.id);

    // 7. Per-input checks
    for (const inp of (q.inputs || [])) {
      // Required input fields
      for (const field of REQUIRED_INPUT) {
        if (!(field in inp)) localError(`Question ${qid} input ${inp.id || '?'}: missing field "${field}"`);
      }

      // Number inputs need tolerance
      if (inp.type === 'number') {
        if (inp.tolerance === undefined || inp.tolerance === null) {
          localWarn(`Question ${qid} input ${inp.id}: number type missing tolerance (will use exact match)`);
        }
        if (typeof inp.answer === 'number') {
          numberAnswers.push({ qid, answer: inp.answer, file: filename });
        }
      }

      // Dropdown answer must be in options
      if (inp.type === 'dropdown') {
        if (!Array.isArray(inp.options)) {
          localError(`Question ${qid} input ${inp.id}: dropdown missing options array`);
        } else if (!inp.options.includes(inp.answer)) {
          localError(`Question ${qid} input ${inp.id}: answer "${inp.answer}" not in options [${inp.options.join(', ')}]`);
        }
      }

      // Null/undefined answers
      if (inp.answer === undefined || inp.answer === null) {
        localError(`Question ${qid} input ${inp.id}: answer is null/undefined`);
      }
    }
  }

  const passed = fileErrors.length === 0;
  const icon = passed ? (fileWarns.length > 0 ? '⚠️ ' : '✅') : '❌';
  console.log(`\n${icon} ${filename} (${questions.length} questions)`);
  fileErrors.forEach(e => console.error(`  ❌ ${e}`));
  fileWarns.forEach(w => console.warn(`  ⚠️  ${w}`));

  return { filename, passed, errors: fileErrors, warnings: fileWarns, numberAnswers };
}

function crossExamCollisionCheck(allAnswers) {
  // Group number answers by value
  const byValue = {};
  for (const { answer, file, qid } of allAnswers) {
    const key = answer.toFixed(2);
    if (!byValue[key]) byValue[key] = [];
    byValue[key].push({ file, qid });
  }

  const collisions = Object.entries(byValue)
    .filter(([, occurrences]) => {
      const files = new Set(occurrences.map(o => o.file));
      return files.size >= 3; // same answer in 3+ different files is a pattern risk
    });

  if (collisions.length > 0) {
    console.log('\n⚠️  Cross-exam answer collisions (same numeric answer in 3+ exams):');
    for (const [val, occurrences] of collisions) {
      console.warn(`  ${val}: appears in ${occurrences.map(o => o.file.replace('retake-practice-','P').replace('.json','')).join(', ')}`);
      totalWarnings++;
    }
  }
}

// Main
const files = fs.readdirSync(DATA_DIR)
  .filter(f => EXAM_PATTERN.test(f))
  .sort()
  .map(f => path.join(DATA_DIR, f));

if (files.length === 0) {
  console.error('No exam files found matching retake-practice-*.json');
  process.exit(1);
}

console.log(`Motor City Math — Exam JSON Linter`);
console.log(`Checking ${files.length} files in data/\n${'─'.repeat(50)}`);

const allAnswers = [];
const results = files.map(f => lintFile(f)).filter(Boolean);
results.forEach(r => allAnswers.push(...r.numberAnswers));

crossExamCollisionCheck(allAnswers);

console.log(`\n${'─'.repeat(50)}`);
console.log(`Results: ${results.filter(r => r.passed).length}/${results.length} passed`);
console.log(`Errors: ${totalErrors} | Warnings: ${totalWarnings}`);

if (totalErrors > 0) {
  console.error('\nLint FAILED. Fix errors before committing.\n');
  process.exit(1);
} else {
  console.log('\nLint PASSED.\n');
  process.exit(0);
}
