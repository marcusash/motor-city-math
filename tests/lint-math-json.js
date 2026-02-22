#!/usr/bin/env node
/**
 * lint-math-json.js — GR Math JSON Format Linter
 *
 * Catches formatting bugs in data/*.json exam files before they reach production.
 * Motivated by P6/P7 regressions: quadruple-backslash KaTeX, literal \uXXXX in labels,
 * unstyled buttons (GA accountability message to FF, 2026-02-21).
 *
 * Rules:
 *   E-1: No quadruple-backslash in string values (\\\\( → should be \\()
 *   E-2: No literal \uXXXX escape sequences in label/hint/feedback strings (use actual unicode)
 *   E-3: KaTeX delimiters must be \\( ... \\) or \\[ ... \\] — not $...$ or \(...\)
 *   E-4: Every question must have at least one hint
 *   E-5: No hint longer than 120 characters (ADHD — keep it short)
 *   E-6: solution_steps must have at least 2 steps
 *   W-1: Hint 1 should not contain the answer value (giveaway check)
 *   W-2: feedback_correct longer than 60 characters (too wordy for ADHD learner)
 *   W-3: question_html longer than 200 characters (may overwhelm)
 */

'use strict';

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const EXAM_PATTERN = /^retake-practice-\d+\.json$/;

let totalErrors = 0;
let totalWarnings = 0;
let filesChecked = 0;

function lint(filePath) {
  const fileName = path.basename(filePath);
  let raw;
  try {
    raw = fs.readFileSync(filePath, 'utf8');
  } catch (e) {
    console.error(`  Cannot read ${fileName}: ${e.message}`);
    return;
  }

  let exam;
  try {
    exam = JSON.parse(raw);
  } catch (e) {
    console.error(`  ❌ ${fileName}: JSON parse error — ${e.message}`);
    totalErrors++;
    return;
  }

  const errors = [];
  const warnings = [];

  // Check raw string for quadruple backslash (E-1)
  if (raw.includes('\\\\\\\\(') || raw.includes('\\\\\\\\[')) {
    errors.push('E-1: Quadruple-backslash KaTeX delimiter found (use double-backslash: \\\\( )');
  }

  // Check raw string for literal \uXXXX in label contexts (E-2)
  // In JSON source, a literal \u sequence would appear as \\u followed by 4 hex digits
  const literalUnicodeRe = /\\\\u[0-9a-fA-F]{4}/g;
  const literalMatches = raw.match(literalUnicodeRe);
  if (literalMatches) {
    errors.push(`E-2: Literal \\uXXXX escape sequences found (${literalMatches.length} occurrences) — use actual unicode characters`);
  }

  // Check for single-backslash KaTeX (E-3) — \( instead of \\(
  // In JSON source this appears as a single \( not preceded by another backslash
  const singleDelimRe = /(?<!\\)\\(?!\\)[\(\[]/g;
  if (singleDelimRe.test(raw)) {
    errors.push('E-3: Single-backslash KaTeX delimiter found — use \\\\( not \\( in JSON source');
  }

  // Per-question checks
  if (!Array.isArray(exam.questions)) {
    errors.push('E-?: No questions array found');
    return report(fileName, errors, warnings);
  }

  exam.questions.forEach(function(q, qi) {
    const qid = q.id || `Q${qi + 1}`;

    // E-4: must have hint
    if (!q.hint || typeof q.hint !== 'string' || q.hint.trim().length === 0) {
      errors.push(`E-4 [${qid}]: Missing or empty hint`);
    } else {
      // E-5: hint length
      if (q.hint.length > 120) {
        errors.push(`E-5 [${qid}] hint: ${q.hint.length} chars (max 120) — "${q.hint.substring(0, 60)}..."`);
      }

      // W-1: hint giveaway — check if it contains an answer value
      if (q.inputs && Array.isArray(q.inputs)) {
        const answers = q.inputs
          .map(function(inp) { return String(inp.answer || ''); })
          .filter(function(a) { return a.length > 0 && !isNaN(parseFloat(a)); });
        answers.forEach(function(ans) {
          if (q.hint.includes(ans)) {
            warnings.push(`W-1 [${qid}] hint contains answer value "${ans}" — may be a giveaway`);
          }
        });
      }
    }

    // E-6: solution_steps
    if (!q.solution_steps || !Array.isArray(q.solution_steps) || q.solution_steps.length < 2) {
      errors.push(`E-6 [${qid}]: solution_steps must have at least 2 steps (has ${(q.solution_steps || []).length})`);
    }

    // W-2: feedback_correct length
    if (q.feedback_correct && q.feedback_correct.length > 60) {
      warnings.push(`W-2 [${qid}] feedback_correct: ${q.feedback_correct.length} chars (max 60) — "${q.feedback_correct.substring(0, 40)}..."`);
    }

    // W-3: question_html length
    if (q.question_html && q.question_html.length > 200) {
      warnings.push(`W-3 [${qid}] question_html: ${q.question_html.length} chars (max 200)`);
    }
  });

  report(fileName, errors, warnings);
}

function report(fileName, errors, warnings) {
  const hasIssues = errors.length > 0 || warnings.length > 0;
  if (!hasIssues) {
    console.log(`  ✅ ${fileName}: clean`);
    return;
  }

  if (errors.length > 0) {
    console.log(`  ❌ ${fileName}: ${errors.length} error(s), ${warnings.length} warning(s)`);
    errors.forEach(function(e) { console.log(`     ERROR: ${e}`); });
  } else {
    console.log(`  ⚠️  ${fileName}: 0 errors, ${warnings.length} warning(s)`);
  }
  if (warnings.length > 0) {
    warnings.forEach(function(w) { console.log(`     WARN:  ${w}`); });
  }

  totalErrors += errors.length;
  totalWarnings += warnings.length;
}

// Main
const files = fs.readdirSync(DATA_DIR)
  .filter(function(f) { return EXAM_PATTERN.test(f); })
  .sort();

if (files.length === 0) {
  console.error('No exam JSON files found in data/');
  process.exit(1);
}

console.log(`\nMath JSON Linter — ${files.length} exam files\n`);
files.forEach(function(f) {
  lint(path.join(DATA_DIR, f));
  filesChecked++;
});

console.log(`\n${'='.repeat(50)}`);
console.log(`${filesChecked} files checked — ${totalErrors} errors, ${totalWarnings} warnings`);
if (totalErrors > 0) {
  console.log('❌ FAIL — fix errors before committing');
  process.exit(1);
} else if (totalWarnings > 0) {
  console.log('⚠️  PASS with warnings — review before committing');
} else {
  console.log('✅ PASS — all clean');
}
