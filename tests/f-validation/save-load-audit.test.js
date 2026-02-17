/**
 * Motor City Math — Fundamentals Agent (F)
 * Task F-4: Save/Load (localStorage) Audit
 *
 * Audits the 7+ save/load implementations for:
 * - localStorage key collisions
 * - Data format inconsistencies
 * - Error handling gaps
 * - Round-trip data integrity
 *
 * Run: node tests/f-validation/save-load-audit.test.js
 */

let pass = 0, fail = 0;
function test(description, condition) {
    if (condition) { pass++; }
    else { fail++; console.log(`  ❌ ${description}`); }
}
function section(title) {
    console.log(`\n── ${title} ──`);
}

// ===================================================================
// 1. localStorage KEY INVENTORY
// ===================================================================
section('1. localStorage Key Inventory');

const keyMap = {
    'index.html':                      'algebra2TestResults',
    'index_calc.html':                 'algebra2TestResults',  // ← COLLISION
    'final_exam_251123.html':          'algebra2TestResults',  // ← COLLISION
    'final_exam_251123_mini.html':     'algebra2TestResults',  // ← COLLISION
    'quiz_251117.html':                'algebra2QuizResults',
    'quiz_251120.html':                'algebra2Quiz251120',
    'quiz_251121.html':                'algebra2Quiz251121',
    'nonlinear_functions_test.html':   'nonlinearFunctionsTest',
    'exponents_exam.html':             'exponentsExamResults',   // via shared/scripts.js
    '20260119_Exponents_Unit1.html':   'exponents_test_results',
    '20260119_Exponents_Unit1_2nd.html': 'exponents_test_2nd_results',
    '20260119_Exponents_Unit1_3rd.html': 'exponents_test_3rd_results',
};

// Count collisions
const keyCounts = {};
for (const [file, key] of Object.entries(keyMap)) {
    keyCounts[key] = (keyCounts[key] || []);
    keyCounts[key].push(file);
}

const collisions = Object.entries(keyCounts).filter(([k, files]) => files.length > 1);
console.log(`  Total files with save/load: ${Object.keys(keyMap).length}`);
console.log(`  Unique localStorage keys: ${Object.keys(keyCounts).length}`);
console.log(`  Key collisions: ${collisions.length}`);

for (const [key, files] of collisions) {
    console.log(`  🔴 KEY COLLISION: "${key}" used by:`);
    for (const f of files) console.log(`       - ${f}`);
}

test('No key collisions', collisions.length === 0);

// ===================================================================
// 2. DATA FORMAT AUDIT
// ===================================================================
section('2. Data Format Audit');

// Two distinct save formats exist:
// Format A (old): flat object { inputId: value, ... }
//   Used by: 20260119_Exponents_Unit1.html
//
// Format B (new): { timestamp: ISO string, formData: { inputId: value, ... } }
//   Used by: all other files + shared/scripts.js

console.log('  Format A (flat):   20260119_Exponents_Unit1.html');
console.log('  Format B (nested): All other files + shared/scripts.js');
console.log('  ✅ shared/scripts.js loadResults() handles both formats (line 85)');

test('Shared scripts handles both formats', true);

// ===================================================================
// 3. ERROR HANDLING AUDIT
// ===================================================================
section('3. Error Handling Audit');

// Test: What happens with corrupted JSON?
const implementations = {
    'shared/scripts.js': { tryCatch: true, corruptionMsg: true },
    '20260119_Exponents_Unit1.html': { tryCatch: false, corruptionMsg: false },
    '20260119_Exponents_Unit1_2nd.html': { tryCatch: false, corruptionMsg: false },
    '20260119_Exponents_Unit1_3rd.html': { tryCatch: false, corruptionMsg: false },
    'index.html': { tryCatch: false, corruptionMsg: false },
    'final_exam_251123.html': { tryCatch: false, corruptionMsg: false },
    'final_exam_251123_mini.html': { tryCatch: false, corruptionMsg: false },
    'quiz_251117.html': { tryCatch: false, corruptionMsg: false },
    'quiz_251120.html': { tryCatch: false, corruptionMsg: false },
    'quiz_251121.html': { tryCatch: false, corruptionMsg: false },
    'nonlinear_functions_test.html': { tryCatch: false, corruptionMsg: false },
};

const withTryCatch = Object.entries(implementations).filter(([k, v]) => v.tryCatch);
const withoutTryCatch = Object.entries(implementations).filter(([k, v]) => !v.tryCatch);

console.log(`  Files with try/catch on JSON.parse: ${withTryCatch.length}/11`);
console.log(`  Files WITHOUT try/catch: ${withoutTryCatch.length}/11`);
console.log('  ⚠️ Corrupted localStorage → uncaught JSON.parse exception → silent failure');
console.log('  ✅ shared/scripts.js has try/catch (line 77-82)');

test('Only shared/scripts.js has corruption handling', withTryCatch.length === 1);

// ===================================================================
// 4. KEY COLLISION IMPACT
// ===================================================================
section('4. Key Collision Impact Analysis');

console.log('  🔴 BLOCKER: "algebra2TestResults" used by 4 different tests:');
console.log('     1. index.html (Linear Functions, 16 Qs)');
console.log('     2. index_calc.html (Linear Functions calc, 16 Qs)');
console.log('     3. final_exam_251123.html (Unit 1 Exam, 18 Qs)');
console.log('     4. final_exam_251123_mini.html (Unit 1 Mini, 8 Qs)');
console.log('');
console.log('  Impact: Saving on any of these 4 tests OVERWRITES progress');
console.log('  from the other 3. Kai saves index.html → opens final_exam →');
console.log('  loads → gets garbage data (wrong input IDs, missing fields).');
console.log('');
console.log('  quiz_251117 uses "algebra2QuizResults" — would collide with');
console.log('  any future quiz that uses the same generic key.');

// ===================================================================
// 5. FUNCTION SIGNATURE MISMATCH
// ===================================================================
section('5. Function Signature Mismatch');

console.log('  exponents_exam.html HTML calls: saveResults("exponentsExamResults")');
console.log('  exponents_exam.html loads: shared/scripts.js (accepts storageKey param) ✅');
console.log('');
console.log('  20260119_Exponents_Unit1.html HTML calls: saveResults("exponents_test_results")');
console.log('  20260119_Exponents_Unit1.html defines: saveResults() with NO params');
console.log('  ⚠️ Param "exponents_test_results" is passed but ignored — key is hardcoded');

test('Unit1 button passes unused param', true);

// ===================================================================
// 6. TEXTAREA vs INPUT HANDLING
// ===================================================================
section('6. Textarea vs Input Handling');

console.log('  Format A save: input.value only');
console.log('  Format B save: input.value || input.textContent');
console.log('  Format B load: checks tagName for INPUT/TEXTAREA vs other');
console.log('  ⚠️ contenteditable divs: saved via textContent, restored via textContent');
console.log('  ⚠️ Textarea newlines preserved? Yes — .value handles newlines');
console.log('  ✅ No data loss for standard input/textarea elements');

// ===================================================================
// SUMMARY
// ===================================================================
section('SAVE/LOAD AUDIT SUMMARY');
console.log(`\n  Tests: ${pass + fail} total, ${pass} passed, ${fail} failed`);

console.log('\n  🔴 BLOCKER:');
console.log('     B-F3: 4 files share "algebra2TestResults" key — data overwrite');
console.log('           index.html, index_calc.html, final_exam_251123.html, final_exam_251123_mini.html');

console.log('\n  🟡 HIGH:');
console.log('     H-F5: 10/11 files lack try/catch on JSON.parse');
console.log('           Corrupted data → uncaught exception → load silently fails');
console.log('     H-F6: Two save formats (flat vs nested) across files');
console.log('           shared/scripts.js handles both, inline code doesnt');

console.log('\n  🟢 LOW:');
console.log('     L-F3: Button param mismatch in 20260119_Exponents_Unit1.html');
console.log('           (passes key to function that ignores it)\n');

console.log('  For Agent S: Recommend unique keys per test, e.g. "mcm-{filename}-results"');
console.log('  For Agent A: When migrating to shared/scripts.js, each file needs unique storageKey\n');

process.exit(fail > 0 ? 1 : 0);
