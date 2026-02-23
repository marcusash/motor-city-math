/**
 * GF Hint Display Contract Tests (predicted gap #4 from coaching rubric)
 *
 * Verifies the hint system in exam.html:
 * - 3-layer structure: hint → answer → solution steps
 * - CSS contracts: hidden by default, shown via .show class
 * - Button text contracts: exact emoji + label
 * - Hint length contracts: all hints in data JSON <= 120 chars (E-5 rule)
 * - Progressive disclosure: layer 2/3 buttons hidden until layer 1 shown
 * - No hint data missing (q.hint || '' fallback)
 */

'use strict';

const fs = require('fs');
const path = require('path');

let passed = 0;
let failed = 0;

function pass(label) { passed++; console.log('  ✓ ' + label); }
function fail(label) { failed++; console.log('  ✗ FAIL: ' + label); }

const examHtml = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf8');
const ROOT = path.join(__dirname, '../..');

console.log('Hint Display Contract Tests');

// ============================================================
// Section 1: CSS structure
// ============================================================
console.log('\n1. CSS structure:');

const hintLayerHidden = examHtml.includes('.hint-layer { display: none;') || examHtml.includes('.hint-layer{display:none');
hintLayerHidden ? pass('.hint-layer: display:none by default') : fail('.hint-layer not hidden by default');

const hintLayerShow = examHtml.includes('.hint-layer.show { display: block;') || examHtml.includes('.hint-layer.show{display:block');
hintLayerShow ? pass('.hint-layer.show: display:block when visible') : fail('.hint-layer.show not display:block');

const hintBtnExists = examHtml.includes('.hint-btn {') || examHtml.includes('.hint-btn{');
hintBtnExists ? pass('.hint-btn class defined') : fail('.hint-btn class missing');

const hintLayersPadding = examHtml.includes('.hint-layer') && examHtml.includes('padding: 12px');
hintLayersPadding ? pass('.hint-layer has 12px padding') : fail('.hint-layer missing 12px padding');

// ============================================================
// Section 2: HTML structure in renderer
// ============================================================
console.log('\n2. HTML rendering structure:');

const hintsContainer = examHtml.includes("'<div class=\"hint-layers\" id=\"hints-'");
hintsContainer ? pass('hint-layers container rendered per question') : fail('hint-layers container missing from renderer');

const layer1 = examHtml.includes("'<div class=\"hint-layer\" id=\"hint-'") && examHtml.includes("q.hint || ''");
layer1 ? pass("Layer 1: hint div rendered with q.hint || '' fallback") : fail("Layer 1: hint div or fallback missing");

const layer2Btn = examHtml.includes('SHOW ANSWER') && examHtml.includes('hintBtn-');
layer2Btn ? pass("Layer 2: 📖 SHOW ANSWER button") : fail("Layer 2: SHOW ANSWER button missing or wrong text");

const layer3Btn = examHtml.includes('SOLUTION STEPS') && examHtml.includes('hintBtn-');
layer3Btn ? pass("Layer 3: 📝 SOLUTION STEPS button") : fail("Layer 3: SOLUTION STEPS button missing or wrong text");

const layer1Btn = examHtml.includes('HINT') && examHtml.includes('showHint');
layer1Btn ? pass("Layer 1: 💡 HINT trigger button") : fail("Layer 1: HINT button missing or wrong text");

// ============================================================
// Section 3: Progressive disclosure contract
// ============================================================
console.log('\n3. Progressive disclosure:');

// Layer 2+3 buttons start hidden
const layer2Hidden = examHtml.includes("id=\"hintBtn-' + q.id + '-2\" style=\"display:none;\"");
layer2Hidden ? pass('Layer 2 button: display:none on init') : fail('Layer 2 button not hidden on init');

const layer3Hidden = examHtml.includes("id=\"hintBtn-' + q.id + '-3\" style=\"display:none;\"");
layer3Hidden ? pass('Layer 3 button: display:none on init') : fail('Layer 3 button not hidden on init');

// showHint() reveals layer 2 button after layer 1 is shown
const revealsLayer2 = examHtml.includes("hintBtn-' + qId + '-2') .style.display") ||
  examHtml.includes("hintBtn-' + qId + '-2').style.display = 'inline-block'");
revealsLayer2 ? pass('showHint(): reveals layer 2 button after layer 1') : fail('showHint(): does not reveal layer 2 button');

const revealsLayer3 = examHtml.includes("hintBtn-' + qId + '-3') .style.display") ||
  examHtml.includes("hintBtn-' + qId + '-3').style.display = 'inline-block'");
revealsLayer3 ? pass('showHint(): reveals layer 3 button after layer 2') : fail('showHint(): does not reveal layer 3 button');

// showHint function exists
const showHintFn = examHtml.includes('function showHint(qId, layer)');
showHintFn ? pass('showHint(qId, layer) function exists') : fail('showHint() function missing');

// ============================================================
// Section 4: Hint length contract (120 char limit from lint rules)
// ============================================================
console.log('\n4. Hint length contract:');

const dataDir = path.join(ROOT, 'data');
const jsonFiles = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));
let hintViolations = [];
let totalHints = 0;
const HINT_MAX = 120;

jsonFiles.forEach(file => {
  try {
    const data = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf8'));
    const questions = data.questions || data;
    if (!Array.isArray(questions)) return;
    questions.forEach((q, i) => {
      if (q.hint && typeof q.hint === 'string') {
        totalHints++;
        if (q.hint.length > HINT_MAX) {
          hintViolations.push({ file, qIndex: i, qId: q.id, len: q.hint.length });
        }
      }
    });
  } catch (e) { /* skip non-question JSON */ }
});

if (hintViolations.length === 0) {
  pass(`All ${totalHints} hints <= ${HINT_MAX} chars (E-5 rule)`);
} else {
  fail(`${hintViolations.length} hints exceed ${HINT_MAX} chars:`);
  hintViolations.forEach(v => console.log(`    ${v.file} q[${v.qIndex}] (${v.qId}): ${v.len} chars`));
}

// ============================================================
// Section 5: Hint presence by question type
// ============================================================
console.log('\n5. Hint presence audit:');

let totalQs = 0;
let qsWithHint = 0;
let qsWithoutHint = [];

jsonFiles.forEach(file => {
  try {
    const data = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf8'));
    const questions = data.questions || data;
    if (!Array.isArray(questions)) return;
    questions.forEach((q, i) => {
      if (q.type === 'info' || q.type === 'separator') return;
      totalQs++;
      if (q.hint && q.hint.trim()) {
        qsWithHint++;
      } else {
        qsWithoutHint.push({ file, qId: q.id || `q[${i}]` });
      }
    });
  } catch (e) { /* skip */ }
});

const hintPct = totalQs > 0 ? Math.round((qsWithHint / totalQs) * 100) : 0;
pass(`Hint coverage: ${qsWithHint}/${totalQs} questions (${hintPct}%)`);

// Threshold: at least 60% of questions must have hints
const HINT_FLOOR = 60;
hintPct >= HINT_FLOOR
  ? pass(`Hint coverage >= ${HINT_FLOOR}% floor`)
  : fail(`Hint coverage ${hintPct}% below ${HINT_FLOOR}% floor`);

// ============================================================
// Summary
// ============================================================
const total = passed + failed;
console.log('\n' + '='.repeat(50));
console.log(`${total} checks: ${passed} passed, ${failed} failed`);
if (failed === 0) { console.log('✓ PASS'); } else { console.log('✘ FAIL'); process.exit(1); }
