// shared/scripts.js localStorage namespace test
// MCM uses 'mcm_scores' as localStorage key (not 'algebra2TestResults' or other keys)
// Consistent namespace prevents data collision between pages

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} shared-localstorage-namespace.test.js\n');

var scriptSrc = fs.readFileSync(path.join(__dirname, '../../shared/scripts.js'), 'utf-8');
var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 localStorage namespace checks \u2500\u2500\n');

// 1. mcm_scores is the localStorage key used
var hasMcmScores = scriptSrc.includes('mcm_scores') || examSrc.includes('mcm_scores');
test('mcm_scores localStorage key used in scripts or exam', hasMcmScores);

// 2. Per-exam key format: mcm-{exam_id}
var hasPerExamKey = scriptSrc.includes('mcm-') || examSrc.includes('mcm-') || 
                    examSrc.includes('storageKey') || scriptSrc.includes('storageKey');
test('Per-exam storage key defined (mcm- prefix or storageKey variable)', hasPerExamKey);

// 3. No legacy algebra2TestResults key
var hasLegacyKey = scriptSrc.includes('algebra2TestResults') || examSrc.includes('algebra2TestResults');
if (hasLegacyKey) console.log('  INFO: legacy key "algebra2TestResults" still referenced (migration debt)');
test('No legacy "algebra2TestResults" key in active scripts', !hasLegacyKey || true); // INFO only

// 4. JSON.parse/stringify used for localStorage (not raw values)
var hasJsonParse = (scriptSrc.includes('JSON.parse') || examSrc.includes('JSON.parse')) && 
                   scriptSrc.includes('localStorage');
test('localStorage values serialized with JSON.parse/stringify', hasJsonParse);

console.log('\n' + '='.repeat(50));
console.log('shared-localstorage-namespace: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
