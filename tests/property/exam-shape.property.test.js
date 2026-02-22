/**
 * Property-based checks for practice exam JSON structure.
 *
 * Run: node tests/property/exam-shape.property.test.js
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
const DATA_DIR = path.join(ROOT, 'data');
const EXAM_PATTERN = /^retake-practice-\d+\.json$/;

const RUNS = Number.parseInt(process.env.MCM_PROPERTY_RUNS || '50', 10);

function loadExams() {
  return fs.readdirSync(DATA_DIR)
    .filter((file) => EXAM_PATTERN.test(file))
    .sort()
    .map((file) => ({
      file,
      data: JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'))
    }));
}

function fail(message) {
  console.error(`FAIL: ${message}`);
  process.exit(1);
}

function randomItem(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function checkExamShape(exam) {
  const questions = exam.data.questions || [];
  if (!Array.isArray(questions) || questions.length !== 15) {
    fail(`${exam.file}: expected 15 questions`);
  }
  const numbers = new Set();
  questions.forEach((q) => {
    if (!q || !q.id) fail(`${exam.file}: missing question id`);
    if (typeof q.number !== 'number' || q.number < 1 || q.number > 15) {
      fail(`${exam.file}: invalid question number ${q.number}`);
    }
    numbers.add(q.number);
  });
  if (numbers.size !== 15) {
    fail(`${exam.file}: question numbers not unique`);
  }
}

function checkRandomQuestion(exam) {
  const questions = exam.data.questions || [];
  const q = randomItem(questions);
  if (!q) fail(`${exam.file}: missing question`);

  if (!q.section || !['A', 'B', 'C', 'D'].includes(q.section)) {
    fail(`${exam.file} ${q.id}: invalid section`);
  }
  if (!Array.isArray(q.inputs) || q.inputs.length === 0) {
    fail(`${exam.file} ${q.id}: inputs missing`);
  }
  q.inputs.forEach((inp) => {
    if (!inp || !inp.id || !inp.type) {
      fail(`${exam.file} ${q.id}: input missing id or type`);
    }
    if (inp.type === 'number' && typeof inp.tolerance !== 'number') {
      fail(`${exam.file} ${q.id} ${inp.id}: numeric input missing tolerance`);
    }
  });
  if (q.graph) {
    if (!q.graph.function || !Array.isArray(q.graph.key_points) || q.graph.key_points.length < 2) {
      fail(`${exam.file} ${q.id}: graph missing function or key_points`);
    }
  }
}

const exams = loadExams();
if (exams.length === 0) {
  fail('No retake-practice-*.json files found');
}

exams.forEach(checkExamShape);

for (let i = 0; i < RUNS; i += 1) {
  const exam = randomItem(exams);
  checkRandomQuestion(exam);
}

console.log(`PASS: ${RUNS} randomized checks across ${exams.length} exams`);
