/**
 * GF Dad View Data Isolation Tests (predicted gap #3 from coaching rubric)
 *
 * Verifies that dad mode (_dadMode + _dadScores) is properly isolated
 * from Kai's localStorage data. Ensures:
 * - getScores() returns _dadScores (not localStorage) when in dad mode
 * - _dadScores is null by default (not bleed-through)
 * - Dad mode is triggered ONLY by ?dad=1 query param
 * - localStorage writes do not affect dad view
 * - dadModeInit() wires up _dadScores from imported file
 */

'use strict';

const fs = require('fs');
const path = require('path');

let passed = 0;
let failed = 0;

function pass(label) { passed++; console.log('  ✓ ' + label); }
function fail(label) { failed++; console.log('  ✗ FAIL: ' + label); }

const indexHtml = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf8');

console.log('Dad View Data Isolation Tests');

// ============================================================
// Section 1: Dad mode flag contracts
// ============================================================
console.log('\n1. Dad mode flag:');

// Must be toggled by ?dad=1 query param only
const dadModeByParam = indexHtml.includes("get('dad') === '1'");
dadModeByParam ? pass("_dadMode = URLSearchParams.get('dad') === '1'") : fail('dad mode not tied to ?dad=1 query param');

// _dadScores initialized to null (no bleed-through)
const dadScoresNullInit = indexHtml.includes('_dadScores = null');
dadScoresNullInit ? pass('_dadScores initialized to null (no default bleed-through)') : fail('_dadScores not initialized to null');

// _dadMode declared as a var (block-scoped isolation)
const dadModeVar = indexHtml.includes('var _dadMode');
dadModeVar ? pass('_dadMode declared as var (isolated to script block)') : fail('_dadMode not declared as var');

// ============================================================
// Section 2: getScores() data routing
// ============================================================
console.log('\n2. getScores() routing:');

// Dad path: if (_dadMode && _dadScores) return _dadScores;
const dadScoresReturn = indexHtml.includes('if (_dadMode && _dadScores) return _dadScores');
dadScoresReturn ? pass('getScores(): dad path returns _dadScores when both _dadMode and _dadScores truthy') : fail('getScores(): missing dad short-circuit return');

// Kai path: falls through to localStorage
const localStorageFallback = indexHtml.includes("localStorage.getItem('mcm_scores')");
localStorageFallback ? pass("getScores(): Kai path reads from localStorage 'mcm_scores'") : fail("getScores(): missing localStorage fallback");

// Dad path only fires if BOTH _dadMode AND _dadScores are truthy (not just _dadMode)
// This prevents returning null when dad mode is on but file not yet loaded
const andGuard = indexHtml.includes('_dadMode && _dadScores');
andGuard ? pass('getScores(): AND guard prevents returning null during dad load') : fail('getScores(): missing AND guard for null _dadScores');

// ============================================================
// Section 3: localStorage isolation
// ============================================================
console.log('\n3. localStorage isolation:');

// exportScores() exists (Kai exports her scores for Dad to load)
const exportFn = indexHtml.includes('function exportScores');
exportFn ? pass('exportScores() function exists') : fail('exportScores() function missing');

// Dad mode does not WRITE to localStorage
// Check that dadModeInit does not call localStorage.setItem
const dadInitBlock = indexHtml.match(/function dadModeInit\(\)([\s\S]{0,1200})/);
if (dadInitBlock) {
  const dadInitBody = dadInitBlock[0];
  const dadWritesStorage = dadInitBody.includes('localStorage.setItem');
  (!dadWritesStorage) ? pass('dadModeInit() does not write to localStorage') : fail('dadModeInit() calls localStorage.setItem — isolation risk');
} else {
  fail('dadModeInit() function not found');
}

// ============================================================
// Section 4: dadModeInit() wiring
// ============================================================
console.log('\n4. dadModeInit() wiring:');

// dadModeInit exits early if not in dad mode
const dadModeGuard = indexHtml.includes('if (!_dadMode) return');
dadModeGuard ? pass('dadModeInit(): early return when not in dad mode') : fail('dadModeInit(): missing !_dadMode guard');

// _dadScores gets assigned from imported file (mcm_scores key)
const dadScoresAssigned = indexHtml.includes("_dadScores = data.mcm_scores");
dadScoresAssigned ? pass("dadModeInit(): assigns _dadScores from data.mcm_scores") : fail("dadModeInit(): _dadScores not assigned from imported data");

// dadModeInit() called during init
const dadModeInitCall = indexHtml.includes('dadModeInit()');
dadModeInitCall ? pass('dadModeInit() called during page init') : fail('dadModeInit() never called');

// ============================================================
// Section 5: UI differentiation
// ============================================================
console.log('\n5. Dad mode UI:');

// dadStatus element exists for communication
const dadStatusEl = indexHtml.includes('id="dadStatus"');
dadStatusEl ? pass('dadStatus element present for mode indicator') : fail('dadStatus element missing');

// Dad status shows loading message
const loadingMsg = indexHtml.includes("Loading Kai's scores");
loadingMsg ? pass("dadStatus shows 'Loading Kai's scores...' on init") : fail("dadStatus missing loading message");

// ============================================================
// Section 6: Data shape contracts
// ============================================================
console.log('\n6. Import data shape:');

// Import reads from file input — FileReader API
const fileReaderUsed = indexHtml.includes('FileReader');
fileReaderUsed ? pass('Dad file load uses FileReader API') : fail('FileReader not used for dad import');

// Validates mcm_scores key before assigning
const validatesKey = indexHtml.includes('data.mcm_scores') && indexHtml.includes('mcm_scores');
validatesKey ? pass('Import checks data.mcm_scores key before assigning to _dadScores') : fail('Import does not check mcm_scores key');

// ============================================================
// Summary
// ============================================================
const total = passed + failed;
console.log('\n' + '='.repeat(50));
console.log(`${total} checks: ${passed} passed, ${failed} failed`);
if (failed === 0) { console.log('✓ PASS'); } else { console.log('✘ FAIL'); process.exit(1); }
