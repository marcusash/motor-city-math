#!/usr/bin/env node
// gp-exam-manifest-check.js — verify data/manifest.json matches actual RP files on disk

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const MANIFEST_PATH = path.join(DATA_DIR, 'manifest.json');

// Get actual files
const actualFiles = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

if (!fs.existsSync(MANIFEST_PATH)) {
  console.log('gp-exam-manifest-check: SKIP — no manifest.json found');
  console.log(`Files on disk: ${actualFiles.length} (${actualFiles.join(', ')})`);
  process.exit(0);
}

const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
const manifestFiles = (manifest.exams || manifest.files || manifest.practice_exams || [])
  .map(e => {
    const raw = typeof e === 'string' ? e : (e.file || e.filename || e.id || '');
    // Normalize: add .json if missing
    return raw.endsWith('.json') ? raw : `${raw}.json`;
  });

const onDisk = new Set(actualFiles);
const inManifest = new Set(manifestFiles);

let pass = 0;
let fail = 0;
const issues = [];

// Files in manifest but not on disk
for (const f of inManifest) {
  if (!onDisk.has(f)) {
    fail++;
    issues.push(`MANIFEST PHANTOM: '${f}' in manifest but not on disk`);
  } else {
    pass++;
  }
}

// Files on disk but not in manifest
for (const f of onDisk) {
  if (!inManifest.has(f)) {
    fail++;
    issues.push(`UNREGISTERED: '${f}' on disk but not in manifest`);
  }
}

console.log(`gp-exam-manifest-check: ${pass} pass, ${fail} issues`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
  if (fail > 0) process.exit(1);
}
if (fail === 0) console.log(`OK — manifest and disk are in sync (${pass} files)`);
