#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const DATA_DIR = process.env.MCM_DATA_DIR || path.join(__dirname, '..', 'data');
const QUESTIONS_FILE = path.join(DATA_DIR, 'questions.json');
const EXAM_PATTERN = /^retake-practice-\d+\.json$/;

const VALID_INPUT_TYPES = ['number', 'dropdown', 'radio', 'text'];
const VALID_DIFFICULTY = ['easy', 'medium', 'hard'];
const VALID_ANSWER_TYPES = ['numeric', 'text', 'equation', 'expression', 'graph'];

let totalErrors = 0;
let totalWarnings = 0;

function error(msg) {
  console.error(`❌ ${msg}`);
  totalErrors++;
}

function warn(msg) {
  console.warn(`⚠️  ${msg}`);
  totalWarnings++;
}

function readJson(filepath) {
  const raw = fs.readFileSync(filepath, 'utf8');
  try {
    return JSON.parse(raw);
  } catch (err) {
    throw new Error(`Invalid JSON in ${filepath}: ${err.message}`);
  }
}

function validateInputs(qid, inputs) {
  if (!Array.isArray(inputs) || inputs.length === 0) {
    error(`${qid}: inputs missing or empty`);
    return;
  }

  for (const inp of inputs) {
    if (!inp || inp.id === undefined || inp.type === undefined || inp.label === undefined) {
      error(`${qid}: input missing id/type/label`);
      continue;
    }

    if (!VALID_INPUT_TYPES.includes(inp.type)) {
      error(`${qid}: input ${inp.id} has invalid type "${inp.type}"`);
      continue;
    }

    if (inp.type !== 'text' && inp.answer === undefined) {
      error(`${qid}: input ${inp.id} missing answer`);
      continue;
    }

    if (inp.type === 'number') {
      if (typeof inp.answer !== 'number') {
        error(`${qid}: input ${inp.id} answer must be number`);
      }
      if (typeof inp.tolerance !== 'number') {
        error(`${qid}: input ${inp.id} missing numeric tolerance`);
      }
    }

    if (inp.type === 'dropdown') {
      if (!Array.isArray(inp.options) || inp.options.length === 0) {
        error(`${qid}: input ${inp.id} dropdown options missing`);
      } else if (!inp.options.includes(inp.answer)) {
        error(`${qid}: input ${inp.id} answer not in dropdown options`);
      }
    }

    if (inp.type === 'radio') {
      if (!Array.isArray(inp.options) || inp.options.length === 0) {
        error(`${qid}: input ${inp.id} radio options missing`);
      } else {
        const values = inp.options.map((opt) => (opt && opt.value !== undefined ? opt.value : opt));
        if (!values.includes(inp.answer)) {
          error(`${qid}: input ${inp.id} answer not in radio options`);
        }
      }
    }

    if (inp.type === 'text' && inp.answer !== undefined && typeof inp.answer !== 'string') {
      error(`${qid}: input ${inp.id} answer must be string for text input`);
    }
  }
}

function validateExamFile(filepath) {
  let data;
  try {
    data = readJson(filepath);
  } catch (err) {
    error(err.message);
    return;
  }

  const filename = path.basename(filepath);
  const requiredTop = ['exam_id', 'title', 'subtitle', 'time_minutes', 'questions'];

  for (const field of requiredTop) {
    if (!(field in data)) {
      error(`${filename}: missing top-level field "${field}"`);
    }
  }

  if (!Array.isArray(data.questions) || data.questions.length === 0) {
    error(`${filename}: questions missing or empty`);
    return;
  }

  const requiredQuestion = ['id', 'number', 'section', 'standard', 'type', 'question_html', 'inputs'];
  for (const q of data.questions) {
    const qid = `${filename} ${q && q.id ? q.id : 'question'}`;
    for (const field of requiredQuestion) {
      if (!q || q[field] === undefined || q[field] === null || q[field] === '') {
        error(`${qid}: missing "${field}"`);
      }
    }

    if (q && q.difficulty && !VALID_DIFFICULTY.includes(q.difficulty)) {
      error(`${qid}: invalid difficulty "${q.difficulty}"`);
    }

    validateInputs(qid, q && q.inputs ? q.inputs : []);
  }
}

function validateQuestionBank() {
  let data;
  try {
    data = readJson(QUESTIONS_FILE);
  } catch (err) {
    error(err.message);
    return;
  }

  if (!Array.isArray(data.questions)) {
    error('questions.json: questions array missing');
    return;
  }

  const required = ['id', 'unit', 'standard', 'difficulty', 'type', 'question_text'];
  for (const q of data.questions) {
    const qid = `questions.json ${q && q.id ? q.id : 'question'}`;
    for (const field of required) {
      if (!q || q[field] === undefined || q[field] === null || q[field] === '') {
        error(`${qid}: missing "${field}"`);
      }
    }

    if (q && q.difficulty && !VALID_DIFFICULTY.includes(q.difficulty)) {
      error(`${qid}: invalid difficulty "${q.difficulty}"`);
    }

    const subParts = Array.isArray(q.sub_parts) ? q.sub_parts : [];
    if (subParts.length > 0) {
      for (const sp of subParts) {
        if (!sp || !sp.label || !sp.text || sp.answer === undefined || !sp.answer_type) {
          error(`${qid}: sub_part missing label/text/answer/answer_type`);
          continue;
        }
        if (!VALID_ANSWER_TYPES.includes(sp.answer_type)) {
          error(`${qid}: sub_part answer_type "${sp.answer_type}" invalid`);
        }
      }
    } else if (q) {
      if (q.answer === undefined || q.answer === null || q.answer_type === undefined || q.answer_type === null) {
        warn(`${qid}: missing answer or answer_type`);
      } else if (!VALID_ANSWER_TYPES.includes(q.answer_type)) {
        error(`${qid}: answer_type "${q.answer_type}" invalid`);
      }
    }
  }
}

function main() {
  validateQuestionBank();

  const examFiles = fs.readdirSync(DATA_DIR)
    .filter((file) => EXAM_PATTERN.test(file))
    .sort()
    .map((file) => path.join(DATA_DIR, file));

  if (examFiles.length === 0) {
    error('No retake-practice-*.json files found');
  }

  examFiles.forEach(validateExamFile);

  console.log('\nExam contract validation complete.');
  console.log(`Errors: ${totalErrors} | Warnings: ${totalWarnings}`);
  if (totalErrors > 0) process.exit(1);
}

main();
