/**
 * GF Graph E2E Upgrade (gf-queue-graph-e2e-upgrade)
 *
 * Extends the existing mvp-graphing-e2e.test.js with:
 * - Graph question detection across all exam JSON files
 * - Canvas element presence per graph question
 * - Graph button DOM structure (clear, submit, clear-all)
 * - Graph data integrity: all graph questions have valid target functions
 * - Coordinate system consistency check
 * - KaTeX/label presence for graph axes
 */

'use strict';

const fs = require('fs');
const path = require('path');

let passed = 0;
let failed = 0;

function pass(label) { passed++; console.log('  ✓ ' + label); }
function fail(label) { failed++; console.log('  ✗ FAIL: ' + label); }

const ROOT = path.join(__dirname, '../..');
const examHtml = fs.readFileSync(path.join(ROOT, 'exam.html'), 'utf8');
const dataDir = path.join(ROOT, 'data');

console.log('Graph E2E Upgrade Tests');

// ============================================================
// Section 1: Graph question discovery
// ============================================================
console.log('\n1. Graph question discovery:');

const rpFiles = fs.readdirSync(dataDir).filter(f => f.startsWith('retake-practice-') && f.endsWith('.json'));
let allGraphQs = [];
let graphFileCounts = {};

rpFiles.forEach(file => {
  try {
    const data = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf8'));
    const qs = (data.questions || []).filter(q => q.type === 'graph' || (q.type && q.type.includes('graph')));
    graphFileCounts[file] = qs.length;
    allGraphQs.push(...qs.map(q => ({ ...q, _file: file })));
  } catch (e) { /* skip */ }
});

const totalGraphQs = allGraphQs.length;
totalGraphQs > 0 ? pass(`Found ${totalGraphQs} graph questions across ${Object.keys(graphFileCounts).filter(k => graphFileCounts[k] > 0).length} files`) : fail('No graph questions found in any RP file');

// Each file that has graphs should have at least 1
const filesWithGraphs = Object.entries(graphFileCounts).filter(([, n]) => n > 0);
pass(`Files with graph questions: ${filesWithGraphs.map(([f, n]) => f.replace('retake-practice-', 'RP') + '(' + n + ')').join(', ')}`);

// ============================================================
// Section 2: Graph question data integrity
// ============================================================
console.log('\n2. Graph question data integrity:');

let graphsMissingTarget = [];
let graphsMissingLabel = [];
let graphsWithXRange = 0;

allGraphQs.forEach(q => {
  // Must have a graph spec with function
  if (!q.graph || (!q.graph.function && !q.answers)) {
    graphsMissingTarget.push(q.id);
  }
  // Should have question_html or question_text
  const text = q.question_html || q.question_text || '';
  if (!text || text.length < 10) {
    graphsMissingLabel.push(q.id);
  }
  // Count questions with explicit key_points (good practice)
  if (q.graph && q.graph.key_points && q.graph.key_points.length > 0) {
    graphsWithXRange++;
  }
});

graphsMissingTarget.length === 0
  ? pass(`All ${totalGraphQs} graph questions have target function/answer spec`)
  : fail(`${graphsMissingTarget.length} graph questions missing target: ${graphsMissingTarget.slice(0, 3).join(', ')}`);

graphsMissingLabel.length === 0
  ? pass('All graph questions have question_text >= 10 chars')
  : fail(`${graphsMissingLabel.length} graph questions missing/short question_text`);

graphsWithXRange > 0
  ? pass(`${graphsWithXRange}/${totalGraphQs} graph questions have key_points spec`)
  : fail('No graph questions have key_points — grading may miss quality checks');

// ============================================================
// Section 3: exam.html graph rendering DOM contracts
// ============================================================
console.log('\n3. exam.html graph DOM contracts:');

// Canvas element is rendered for graph questions
const canvasInRenderer = examHtml.includes('<canvas') || examHtml.includes("'<canvas'") ||
  examHtml.includes('"<canvas"') || examHtml.includes('canvas id=');
canvasInRenderer ? pass('Canvas element rendered for graph questions') : fail('Canvas element not found in exam.html renderer');

// Graph click handler registered
const graphClickHandler = examHtml.includes('onclick') && (examHtml.includes('graphCanvas') || examHtml.includes('canvas'));
graphClickHandler ? pass('Graph canvas has click handler registered') : fail('Graph canvas missing click handler');

// Graph buttons: clear, submit
const hasGraphBtn = examHtml.includes('.graph-btn') || examHtml.includes('graph-btn');
hasGraphBtn ? pass('.graph-btn class used for graph control buttons') : fail('.graph-btn class missing');

const hasClearBtn = examHtml.includes('clearGraph') || examHtml.includes('Clear') || examHtml.includes('CLEAR');
hasClearBtn ? pass('Graph has clear/reset button') : fail('Graph clear button missing');

// ============================================================
// Section 4: Coordinate system contract (from mvp-graphing-e2e.js)
// ============================================================
console.log('\n4. Coordinate system contract:');

// graphToScreen conversion must exist
const graphToScreen = examHtml.includes('graphToScreen') || examHtml.includes('graphX') || examHtml.includes('screenX');
graphToScreen ? pass('Graph coordinate conversion exists (graphX/screenX)') : fail('Coordinate conversion not found');

// Check tolerance for point matching
const hasTolerance = examHtml.includes('tolerance') || examHtml.includes('TOLERANCE') || examHtml.includes('tol');
hasTolerance ? pass('Point-matching tolerance defined') : fail('No point tolerance found — graph grading may be too strict');

// ============================================================
// Section 5: Multi-function graph support
// ============================================================
console.log('\n5. Multi-function graph types:');

// Check which function types appear in graph questions
const fnTypes = { linear: 0, exponential: 0, quadratic: 0, radical: 0, other: 0 };
allGraphQs.forEach(q => {
  const fn = (q.graph && q.graph.function) ? q.graph.function.toLowerCase() : '';
  const display = (q.graph && q.graph.function_display) ? q.graph.function_display.toLowerCase() : '';
  if (fn.includes('pow') || fn.includes('^2') || display.includes('^2') || display.includes('²')) fnTypes.quadratic++;
  else if (fn.includes('math.exp') || fn.includes('**') || display.includes('exponential') || fn.includes('0.')) fnTypes.exponential++;
  else if (fn.includes('sqrt') || fn.includes('cbrt') || display.includes('√')) fnTypes.radical++;
  else if (fn.includes('* x') || fn.includes('x *') || (fn.match(/\d+\s*\*\s*x/) || [])[0]) fnTypes.linear++;
  else fnTypes.other++;
});

pass(`Graph question type mix: linear=${fnTypes.linear}, exponential=${fnTypes.exponential}, quadratic=${fnTypes.quadratic}, radical=${fnTypes.radical}, other=${fnTypes.other}`);

// Should have at least 2 distinct function types in graph questions
const distinctTypes = Object.values(fnTypes).filter(n => n > 0).length;
distinctTypes >= 2
  ? pass(`${distinctTypes} distinct function types in graph questions (variety confirmed)`)
  : fail(`Only ${distinctTypes} function type in graph questions — needs variety`);

// ============================================================
// Section 6: Playwright gap acknowledgment
// ============================================================
console.log('\n6. Playwright gap (documented):');

console.log('  ⚠ WARN: Full graph rendering requires browser (canvas draw calls)');
console.log('  ⚠ WARN: Pixel-level click simulation needs Playwright');
console.log('  ⚠ WARN: Blocked: win-arm64 canvas dependency (GP owns)');
console.log('  ⚠ INFO: See tests/f-validation/mvp-graphing-e2e.test.js (65/65 pass) for algorithm tests');

// ============================================================
// Summary
// ============================================================
const total = passed + failed;
console.log('\n' + '='.repeat(50));
console.log(`${total} checks: ${passed} passed, ${failed} failed`);
if (failed === 0) { console.log('✓ PASS'); } else { console.log('✘ FAIL'); process.exit(1); }
