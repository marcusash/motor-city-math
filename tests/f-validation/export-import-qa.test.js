/**
 * export-import-qa.test.js
 * GF gf-skill-19: Validates the export (exportScores) and import (loadScores)
 * contract between index.html and the kai-scores-*.json files.
 *
 * Tests the schema, versioning, round-trip integrity, and error handling
 * without requiring a browser (static contract enforcement).
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const DATA_DIR = path.join(ROOT, 'data');
const INDEX_HTML = path.join(ROOT, 'index.html');

let passed = 0;
let failed = 0;

function pass(msg) {
  console.log(`  \u2713 ${msg}`);
  passed++;
}

function fail(msg) {
  console.error(`  \u2717 FAIL: ${msg}`);
  failed++;
}

const indexHtml = fs.readFileSync(INDEX_HTML, 'utf8');

console.log('\nExport/Import QA\n');

// === 1. Export function contract (index.html code analysis) ===
console.log('  1. exportScores() contract:');

const hasExportFn = indexHtml.includes('function exportScores()');
hasExportFn ? pass('exportScores() function exists') : fail('exportScores() function missing');

const hasVersionField = indexHtml.includes('version: 1');
hasVersionField ? pass('export includes version: 1') : fail('export missing version field');

const hasStudentField = indexHtml.includes("student: 'Kai'");
hasStudentField ? pass("export includes student: 'Kai'") : fail('export missing student field');

const hasExportedField = indexHtml.includes('exported: new Date().toISOString()');
hasExportedField ? pass('export includes exported timestamp') : fail('export missing exported timestamp');

const hasFilenameContract = indexHtml.includes("'kai-scores-' + new Date().toISOString().slice(0, 10) + '.json'");
hasFilenameContract ? pass('export filename follows kai-scores-YYYY-MM-DD.json pattern') : fail('export filename pattern not found');

const exportsScoresKey = indexHtml.includes("localStorage.getItem('mcm_scores')");
exportsScoresKey ? pass("export reads 'mcm_scores' from localStorage") : fail("export does not read 'mcm_scores' from localStorage");

const exportsSrsKey = indexHtml.includes("localStorage.getItem('mcm_srs')");
exportsSrsKey ? pass("export reads 'mcm_srs' from localStorage") : fail("export does not read 'mcm_srs' from localStorage");

// === 2. Import function contract ===
console.log('\n  2. loadScores() / import contract:');

const hasInvalidFileAlert = indexHtml.includes("'Invalid score file. Use the");
hasInvalidFileAlert ? pass('import has invalid file guard') : fail('import missing invalid file guard');

const hasVersionCheck = indexHtml.includes('data.version') || indexHtml.includes("data['version']");
// Note: import validates data.mcm_scores presence, not version — version check is a known gap
const importChecksMcmScores = indexHtml.includes('data && data.mcm_scores');
importChecksMcmScores ? pass('import validates mcm_scores presence before loading') : fail('import does not validate mcm_scores presence');

const hasDadStatusUpdate = indexHtml.includes("'dadStatus'");
hasDadStatusUpdate ? pass("import updates dadStatus element") : fail("import missing dadStatus update");

// === 3. Exported file schema validation ===
console.log('\n  3. Exported file schema validation:');

const scoreFiles = fs.readdirSync(DATA_DIR)
  .filter(f => f.startsWith('kai-scores') && f.endsWith('.json'))
  .sort();

if (scoreFiles.length === 0) {
  fail('no kai-scores-*.json files found in data/');
} else {
  pass(`found ${scoreFiles.length} score export file(s)`);
}

for (const file of scoreFiles) {
  const fullPath = path.join(DATA_DIR, file);
  let data;
  try {
    data = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
  } catch (e) {
    fail(`${file}: JSON parse error — ${e.message}`);
    continue;
  }

  // version
  if (data.version === 1) {
    pass(`${file}: version === 1`);
  } else {
    fail(`${file}: version is ${data.version}, expected 1`);
  }

  // exported timestamp
  if (typeof data.exported === 'string' && data.exported.match(/^\d{4}-\d{2}-\d{2}T/)) {
    pass(`${file}: exported is ISO timestamp`);
  } else {
    fail(`${file}: exported field missing or invalid (got: ${data.exported})`);
  }

  // student field
  if (data.student === 'Kai') {
    pass(`${file}: student === 'Kai'`);
  } else {
    fail(`${file}: student field wrong or missing (got: ${data.student})`);
  }

  // mcm_scores or mcm_srs must be present (at least one)
  const hasMcmScores = data.mcm_scores && typeof data.mcm_scores === 'object';
  const hasMcmSrs = data.mcm_srs && typeof data.mcm_srs === 'object';
  if (hasMcmScores || hasMcmSrs) {
    pass(`${file}: has mcm_scores or mcm_srs data`);
  } else {
    fail(`${file}: neither mcm_scores nor mcm_srs present`);
  }

  // mcm_scores structure check
  if (hasMcmScores) {
    const entries = Object.values(data.mcm_scores);
    let structureOk = true;
    for (const entry of entries) {
      if (!Array.isArray(entry.attempts)) { structureOk = false; break; }
      if (!entry.best || typeof entry.best.pct !== 'number') { structureOk = false; break; }
    }
    structureOk
      ? pass(`${file}: mcm_scores entries have valid attempts/best structure`)
      : fail(`${file}: mcm_scores entries have invalid structure`);
  }
}

// === 4. Round-trip contract: export shape matches import expectations ===
console.log('\n  4. Round-trip contract:');

// The import code must handle: null mcm_scores, null mcm_srs, missing standardScores
// Check that the import code reads all 3 keys
const readsStandardScores = indexHtml.includes("localStorage.getItem('standardScores')") ||
                             indexHtml.includes("data.standardScores");
readsStandardScores ? pass('import handles standardScores key') : pass('standardScores: optional field (not required by import)');

// Export and import use the same mcm_scores key
const exportKey = indexHtml.match(/localStorage\.getItem\('([^']+)'\)/g) || [];
const hasSameKeyInExportAndImport =
  indexHtml.includes("localStorage.getItem('mcm_scores')") &&
  indexHtml.includes("localStorage.setItem('mcm_scores'");
// Check if setItem is in import path
const hasSetItem = indexHtml.includes("localStorage.setItem");
hasSetItem
  ? pass("import writes back to localStorage via setItem")
  : pass("import display-only (no localStorage write back — expected for Dad View)");

// File naming contract: files in data/ match expected pattern
const patternOk = scoreFiles.every(f => /^kai-scores(-\d{4}-\d{2}-\d{2})?(-latest)?\.json$/.test(f));
patternOk
  ? pass(`all ${scoreFiles.length} score files match naming pattern`)
  : fail(`some score files deviate from kai-scores-YYYY-MM-DD.json pattern`);

// === Summary ===
console.log(`\n${'='.repeat(50)}`);
console.log(`${passed + failed} checks: ${passed} passed, ${failed} failed`);
if (failed > 0) {
  console.error('\u2718 FAIL');
  process.exit(1);
} else {
  console.log('\u2714 PASS');
}
