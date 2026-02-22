#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const DATA_DIR = process.env.MCM_DATA_DIR || path.join(__dirname, '..', 'data');
const STANDARDS_FILE = path.join(DATA_DIR, 'standards.json');
const QUESTIONS_FILE = path.join(DATA_DIR, 'questions.json');
const EXAM_PATTERN = /^retake-practice-\d+\.json$/;

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

function collectStandards(standardsData) {
  const ids = new Set();
  const duplicates = new Set();

  const units = standardsData.units || [];
  if (!Array.isArray(units) || units.length === 0) {
    error('standards.json missing units array');
    return { ids, duplicates };
  }

  for (const unit of units) {
    const standards = unit.standards || [];
    for (const standard of standards) {
      if (!standard || !standard.id) {
        error(`standard entry missing id in unit ${unit.id || '?'}`);
        continue;
      }
      if (ids.has(standard.id)) {
        duplicates.add(standard.id);
      }
      ids.add(standard.id);
    }
  }

  return { ids, duplicates };
}

function validateQuestionStandards(questions, standardIds, sourceLabel, counts) {
  if (!Array.isArray(questions)) {
    error(`${sourceLabel} questions array missing or invalid`);
    return;
  }

  for (const q of questions) {
    const qid = q && q.id ? q.id : `${sourceLabel} question`;
    if (!q || !q.standard) {
      error(`${sourceLabel} ${qid} missing standard`);
      continue;
    }

    const standardList = Array.isArray(q.standard)
      ? q.standard
      : String(q.standard)
        .split(',')
        .flatMap((part) => part.split('&'))
        .map((part) => part.trim())
        .filter(Boolean);

    if (standardList.length === 0) {
      error(`${sourceLabel} ${qid} missing standard`);
      continue;
    }

    for (const standard of standardList) {
      if (!standardIds.has(standard)) {
        error(`${sourceLabel} ${qid} uses unknown standard "${standard}"`);
        continue;
      }
      counts[standard] = (counts[standard] || 0) + 1;
    }
  }
}

function main() {
  let standardsData;
  let questionsData;

  try {
    standardsData = readJson(STANDARDS_FILE);
    questionsData = readJson(QUESTIONS_FILE);
  } catch (err) {
    error(err.message);
    process.exit(1);
  }

  const { ids: standardIds, duplicates } = collectStandards(standardsData);
  if (duplicates.size > 0) {
    error(`Duplicate standard IDs in standards.json: ${[...duplicates].join(', ')}`);
  }

  const counts = {};

  validateQuestionStandards(questionsData.questions, standardIds, 'questions.json', counts);

  const examFiles = fs.readdirSync(DATA_DIR)
    .filter((file) => EXAM_PATTERN.test(file))
    .sort()
    .map((file) => path.join(DATA_DIR, file));

  if (examFiles.length === 0) {
    warn('No retake-practice-*.json files found');
  }

  for (const file of examFiles) {
    let examData;
    try {
      examData = readJson(file);
    } catch (err) {
      error(err.message);
      continue;
    }
    validateQuestionStandards(examData.questions, standardIds, path.basename(file), counts);
  }

  const orphaned = [...standardIds].filter((id) => !counts[id]);
  if (orphaned.length > 0) {
    warn(`Standards with zero references: ${orphaned.join(', ')}`);
  }

  console.log('\nStandards map validation complete.');
  console.log(`Errors: ${totalErrors} | Warnings: ${totalWarnings}`);

  if (totalErrors > 0) {
    process.exit(1);
  }
}

main();
