#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const dataDir = path.join(root, 'data');
const examPattern = /^retake-practice-\d+\.json$/;
const scorePattern = /^kai-scores-(\d{4}-\d{2}-\d{2})\.json$/;

const thresholdDays = Number.parseInt(process.env.MCM_FRESHNESS_DAYS || '14', 10);
const strictMode = process.env.MCM_FRESHNESS_STRICT === '1';

function parseDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function getLatestScoreDate() {
  const files = fs.readdirSync(dataDir);
  const dates = files
    .map((file) => {
      const match = file.match(scorePattern);
      return match ? parseDate(match[1]) : null;
    })
    .filter(Boolean)
    .sort((a, b) => b - a);
  return dates[0] || null;
}

const referenceDate = getLatestScoreDate() || new Date();
const exams = fs.readdirSync(dataDir).filter((file) => examPattern.test(file)).sort();

let failures = 0;

console.log(`Reference date: ${referenceDate.toISOString().slice(0, 10)}`);
console.log(`Freshness threshold: ${thresholdDays} days`);

for (const file of exams) {
  const fullPath = path.join(dataDir, file);
  const data = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
  const created = parseDate(data.created) || new Date(fs.statSync(fullPath).mtime);
  const ageDays = Math.floor((referenceDate - created) / (24 * 60 * 60 * 1000));
  const label = data.exam_id || file.replace('.json', '');
  const status = ageDays > thresholdDays ? 'STALE' : 'OK';
  console.log(`${label}: ${created.toISOString().slice(0, 10)} (${ageDays} days) ${status}`);
  if (ageDays > thresholdDays) failures++;
}

if (failures > 0) {
  console.warn(`${failures} exam set(s) exceed freshness threshold.`);
  if (strictMode) process.exit(1);
}
