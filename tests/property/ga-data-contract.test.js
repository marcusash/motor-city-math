/**
 * Consumer-driven contract test: GA's fields in practice exam JSON.
 *
 * Based on docs/gi-ga-data-contract.md — this test codifies what exam.html
 * actually reads at runtime. If GI or GR removes a required field, this test
 * fails and the change is blocked.
 *
 * Run: node tests/property/ga-data-contract.test.js
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
const DATA_DIR = path.join(ROOT, 'data');
const EXAM_PATTERN = /^retake-practice-\d+\.json$/;

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (!condition) {
    console.error(`FAIL: ${message}`);
    failed++;
  } else {
    passed++;
  }
}

function loadExams() {
  return fs.readdirSync(DATA_DIR)
    .filter((f) => EXAM_PATTERN.test(f))
    .sort()
    .map((f) => ({
      file: f,
      data: JSON.parse(fs.readFileSync(path.join(DATA_DIR, f), 'utf8'))
    }));
}

/**
 * Contract: Top-level fields GA reads (exam.html lines ~30-80 template logic)
 */
function checkTopLevelContract(exam) {
  const { file, data } = exam;
  const REQUIRED_TOP = ['exam_id', 'title', 'subtitle', 'time_minutes', 'questions'];
  for (const field of REQUIRED_TOP) {
    assert(field in data, `${file}: GA requires top-level field "${field}" (used in exam header/timer)`);
  }
  assert(typeof data.time_minutes === 'number', `${file}: time_minutes must be number (used in countdown timer)`);
  assert(Array.isArray(data.questions), `${file}: questions must be array`);
}

/**
 * Contract: Per-question fields GA reads when rendering question cards
 */
function checkQuestionContract(file, q) {
  const qid = `${file} ${q.id}`;

  // Fields GA reads for every question
  assert(q.id !== undefined, `${qid}: GA requires q.id (used as DOM id anchor)`);
  assert(q.number !== undefined, `${qid}: GA requires q.number (used in "Q{n} of 15" display)`);
  assert(q.section !== undefined, `${qid}: GA requires q.section (used in section grouping)`);
  assert(q.standard !== undefined, `${qid}: GA requires q.standard (used in scorecard breakdown)`);
  assert(q.question_html !== undefined, `${qid}: GA requires q.question_html (rendered directly as innerHTML)`);
  assert(Array.isArray(q.inputs), `${qid}: GA requires q.inputs array (rendered as form fields)`);

  // Per-input contract
  for (const inp of (q.inputs || [])) {
    const iid = `${qid} input[${inp.id}]`;
    assert(inp.id !== undefined, `${iid}: GA requires inp.id (used as HTML input id + answer lookup key)`);
    assert(inp.type !== undefined, `${iid}: GA requires inp.type (determines which input widget to render)`);
    assert(inp.label !== undefined, `${iid}: GA requires inp.label (rendered as input label text)`);

    if (inp.type === 'number') {
      assert(inp.answer !== undefined, `${iid}: GA requires inp.answer for numeric input (used in grading)`);
      assert(inp.tolerance !== undefined, `${iid}: GA requires inp.tolerance for numeric input (used in grading: |student - answer| <= tol)`);
    }
    if (inp.type === 'dropdown') {
      assert(Array.isArray(inp.options), `${iid}: GA requires inp.options array for dropdown`);
      assert(inp.answer !== undefined, `${iid}: GA requires inp.answer for dropdown (used in grading)`);
    }
    if (inp.type === 'radio') {
      assert(Array.isArray(inp.options), `${iid}: GA requires inp.options array for radio`);
      assert(inp.answer !== undefined, `${iid}: GA requires inp.answer for radio (used in grading)`);
    }
  }

  // Hint and solution fields — used in exam.html hint/reveal system
  assert(q.hint !== undefined, `${qid}: GA requires q.hint (rendered in hint panel)`);
  assert(Array.isArray(q.solution_steps), `${qid}: GA requires q.solution_steps array (rendered in solution panel)`);
  assert(q.solution_steps.length > 0, `${qid}: GA requires at least 1 solution_step`);

  // Feedback fields are optional — exam.html falls back to '🔥 Correct!' and 'Review the hint.'
  // If feedback_correct is present it must be a non-empty string
  if (q.feedback_correct !== undefined) {
    assert(typeof q.feedback_correct === 'string' && q.feedback_correct.length > 0,
      `${qid}: feedback_correct must be non-empty string when present`);
  }
  // If feedback_wrong is present it must be a non-empty string
  if (q.feedback_wrong !== undefined) {
    assert(typeof q.feedback_wrong === 'string' && q.feedback_wrong.length > 0,
      `${qid}: feedback_wrong must be non-empty string when present`);
  }

  // Graph contract — only checked if graph key is present
  if (q.graph !== undefined && q.graph !== null) {
    assert(q.graph.function !== undefined, `${qid}: GA requires q.graph.function when graph is present (passed to Chart.js)`);
    assert(Array.isArray(q.graph.key_points), `${qid}: GA requires q.graph.key_points array when graph is present`);
    assert(q.graph.key_points.length >= 2, `${qid}: GA requires at least 2 key_points for a graphed question`);
  }
}

// Run contract checks
const exams = loadExams();
if (exams.length === 0) {
  console.error('FAIL: No retake-practice-*.json files found');
  process.exit(1);
}

for (const exam of exams) {
  checkTopLevelContract(exam);
  for (const q of (exam.data.questions || [])) {
    checkQuestionContract(exam.file, q);
  }
}

console.log(`\nGA data contract: ${passed} passed, ${failed} failed across ${exams.length} exams`);
if (failed > 0) process.exit(1);
