// tests/property/ocr-confidence.test.mjs
// GI: Unit tests for OCR confidence threshold logic
// Run: node tests/property/ocr-confidence.test.mjs

import { analyzeConfidence, buildConfidenceSummary, shouldAbort, THRESHOLDS } from '../../import/ocr-confidence.mjs';

let passed = 0;
let failed = 0;

function assert(condition, label) {
  if (condition) {
    console.log(`  ✅ ${label}`);
    passed++;
  } else {
    console.log(`  ❌ FAIL: ${label}`);
    failed++;
  }
}

// --- Mock Tesseract data builders ---
function makeLine(text, lineConf, words = []) {
  return { text, confidence: lineConf, words };
}

function makeWord(text, wordConf) {
  return { text, confidence: wordConf };
}

// --- Test 1: clean page (all above threshold) ---
console.log('\nTest 1: clean page — no flags');
{
  const tessData = {
    lines: [
      makeLine('Solve: 4x + 3 = 19', 92, [makeWord('4x', 91), makeWord('+', 93)]),
      makeLine('x = 4', 95, [makeWord('x', 94), makeWord('=', 96), makeWord('4', 95)]),
    ],
  };
  const report = analyzeConfidence(tessData, 1);
  assert(report.flagged_lines === 0, 'zero lines flagged');
  assert(report.clean_lines === 2, 'two clean lines');
  assert(!report.abort, 'abort=false');
  assert(report.flagged_pct === 0, 'flagged_pct=0');
}

// --- Test 2: line confidence below threshold ---
console.log('\nTest 2: low line confidence');
{
  const tessData = {
    lines: [
      makeLine('x^2 - 5x + 6 = 0', 72, [makeWord('x^2', 70), makeWord('-', 74)]),
      makeLine('x = 2 or x = 3', 94, []),
    ],
  };
  const report = analyzeConfidence(tessData, 1);
  assert(report.flagged_lines === 1, 'one line flagged (conf=72 < 85)');
  assert(report.lines[0].flagged, 'first entry is flagged line');
  assert(report.lines[0].flags.some(f => f.startsWith('line_conf_')), 'flag includes line_conf_');
}

// --- Test 3: math token below threshold ---
console.log('\nTest 3: math token low confidence');
{
  const tessData = {
    lines: [
      makeLine('√(x+4) = 7', 88, [makeWord('√(x+4)', 75), makeWord('=', 88), makeWord('7', 90)]),
    ],
  };
  const report = analyzeConfidence(tessData, 1);
  assert(report.flagged_lines === 1, 'one line flagged (math token conf=75 < 80)');
  assert(report.lines[0].flags.some(f => f.startsWith('math_token_conf_')), 'flag includes math_token_conf_');
}

// --- Test 4: abort trigger (>25% flagged) ---
console.log('\nTest 4: abort trigger');
{
  const tessData = {
    lines: Array.from({ length: 10 }, (_, i) => {
      // first 3 lines are low confidence (30% flagged)
      const conf = i < 3 ? 60 : 95;
      return makeLine(`line ${i}`, conf, []);
    }),
  };
  const report = analyzeConfidence(tessData, 1);
  assert(report.abort === true, 'abort=true when 30% flagged');
  assert(report.flagged_pct === 30, `flagged_pct=30 (got ${report.flagged_pct})`);
}

// --- Test 5: no abort at exactly 25% ---
console.log('\nTest 5: no abort at exactly 25% threshold');
{
  const tessData = {
    lines: Array.from({ length: 4 }, (_, i) => {
      const conf = i < 1 ? 60 : 95; // 1/4 = 25%
      return makeLine(`line ${i}`, conf, []);
    }),
  };
  const report = analyzeConfidence(tessData, 1);
  assert(report.abort === false, 'abort=false at exactly 25% (threshold is >25)');
}

// --- Test 6: buildConfidenceSummary aggregates pages ---
console.log('\nTest 6: buildConfidenceSummary aggregates pages');
{
  const page1 = { page: 1, total_lines: 10, flagged_lines: 1, clean_lines: 9, flagged_pct: 10, abort: false, lines: [] };
  const page2 = { page: 2, total_lines: 10, flagged_lines: 3, clean_lines: 7, flagged_pct: 30, abort: true, lines: [] };
  const summary = buildConfidenceSummary([page1, page2]);
  assert(summary.total_lines === 20, 'total_lines=20');
  assert(summary.total_flagged === 4, 'total_flagged=4');
  assert(summary.flagged_pct === 20, 'overall flagged_pct=20');
  assert(summary.abort === false, 'abort=false overall (20% < 25%)');
  assert(summary.thresholds.line_conf_min === THRESHOLDS.LINE_CONF_MIN, 'thresholds included');
}

// --- Test 7: shouldAbort returns false and logs nothing for clean summary ---
console.log('\nTest 7: shouldAbort on clean summary');
{
  const summary = {
    abort: false,
    abort_reason: null,
    flagged_pct: 5,
    pages: [],
  };
  assert(shouldAbort(summary) === false, 'shouldAbort returns false');
}

// --- Test 8: empty lines array ---
console.log('\nTest 8: empty page (no lines)');
{
  const tessData = { lines: [] };
  const report = analyzeConfidence(tessData, 1);
  assert(report.total_lines === 0, 'total_lines=0');
  assert(report.flagged_pct === 0, 'flagged_pct=0');
  assert(!report.abort, 'abort=false for empty page');
}

// --- Summary ---
console.log(`\n${'='.repeat(50)}`);
console.log(`OCR Confidence Tests: ${passed + failed} total | ${passed} passed | ${failed} failed`);
if (failed > 0) {
  process.exit(1);
}
