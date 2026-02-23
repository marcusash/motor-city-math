#!/usr/bin/env node
/**
 * scripts/add-schema-version.cjs
 *
 * Migration: adds schema_version: "1.0" to all practice exam JSON files
 * that do not already have it.
 *
 * Usage:
 *   node scripts/add-schema-version.cjs            # dry run (shows what would change)
 *   node scripts/add-schema-version.cjs --write     # apply changes
 *   node scripts/add-schema-version.cjs --exam retake-practice-10  # single exam
 *
 * Safe: uses migrate-data-safe.cjs pattern — backup before write.
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'data');
const BACKUP_DIR = path.join(ROOT, 'data', '_backups');
const EXAM_PATTERN = /^retake-practice-\d+\.json$/;
const SCHEMA_VERSION = '1.0';

const write = process.argv.includes('--write');
const examFlag = process.argv.indexOf('--exam');
const targetExam = examFlag !== -1 ? process.argv[examFlag + 1] : null;

let changed = 0;
let skipped = 0;

function backup(filepath) {
  const name = path.basename(filepath);
  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true });
  const dest = path.join(BACKUP_DIR, `${ts}-${name}`);
  fs.copyFileSync(filepath, dest);
  return dest;
}

function processFile(filepath) {
  const name = path.basename(filepath);
  const raw = fs.readFileSync(filepath, 'utf8');
  let data;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    console.error(`SKIP ${name}: invalid JSON — ${e.message}`);
    skipped++;
    return;
  }

  if (data.schema_version !== undefined) {
    console.log(`SKIP ${name}: already has schema_version="${data.schema_version}"`);
    skipped++;
    return;
  }

  // Insert schema_version after exam_id (first field, for readability)
  const updated = {};
  for (const [key, val] of Object.entries(data)) {
    updated[key] = val;
    if (key === 'exam_id') {
      updated.schema_version = SCHEMA_VERSION;
    }
  }
  // Fallback: if exam_id wasn't found, prepend
  if (!updated.schema_version) {
    updated.schema_version = SCHEMA_VERSION;
  }

  const out = JSON.stringify(updated, null, 2);
  if (write) {
    const bak = backup(filepath);
    fs.writeFileSync(filepath, out + '\n', 'utf8');
    console.log(`WRITE ${name}: added schema_version="${SCHEMA_VERSION}" (backup: ${path.basename(bak)})`);
  } else {
    console.log(`DRY  ${name}: would add schema_version="${SCHEMA_VERSION}"`);
  }
  changed++;
}

const files = fs.readdirSync(DATA_DIR)
  .filter((f) => EXAM_PATTERN.test(f))
  .filter((f) => !targetExam || f === `${targetExam}.json` || f === targetExam)
  .sort()
  .map((f) => path.join(DATA_DIR, f));

if (files.length === 0) {
  console.error('No matching exam files found.');
  process.exit(1);
}

console.log(`Mode: ${write ? 'WRITE' : 'DRY RUN'} | Schema version: ${SCHEMA_VERSION} | Files: ${files.length}`);
console.log('');

for (const f of files) processFile(f);

console.log('');
console.log(`Done. Changed: ${changed} | Skipped: ${skipped}`);
if (!write && changed > 0) {
  console.log('Run with --write to apply changes.');
}
