// Static analysis: answer key password gate in shared/scripts.js
// Verifies password check exists, uses correct password, returns on wrong password

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} answer-key-guard.test.js\n');

const src = fs.readFileSync(path.join(__dirname, '../../shared/scripts.js'), 'utf-8');

// ── showAnswerKey function ─────────────────────────────────────
console.log('\u2500\u2500 showAnswerKey existence \u2500\u2500');
test('showAnswerKey function exists', src.includes('function showAnswerKey('));
const start = src.indexOf('function showAnswerKey(');
const fn = start !== -1 ? src.substring(start, start + 500) : '';

// ── Password prompt ────────────────────────────────────────────
console.log('\n\u2500\u2500 Password prompt \u2500\u2500');
test('prompt() called for password', fn.includes('prompt('));
test('password variable stores prompt result', fn.includes('password') && fn.includes('prompt('));

// ── Password comparison ────────────────────────────────────────
console.log('\n\u2500\u2500 Password comparison \u2500\u2500');
test('password compared with strict inequality', fn.includes("password !== '121274'") || fn.includes('password !== "121274"'));
test('early return on wrong password', fn.includes("password !== '121274'") && fn.includes('return'));
test('alert on wrong password', fn.includes('alert('));

// ── Answer key display ────────────────────────────────────────
console.log('\n\u2500\u2500 Answer key display \u2500\u2500');
test('answerKeyBody innerHTML set', fn.includes("getElementById('answerKeyBody')"));
test('answerKeyModal shown', fn.includes("getElementById('answerKeyModal')"));
test('modal display = block', fn.includes("style.display = 'block'") || fn.includes('style.display="block"'));

// ── No bypass path ─────────────────────────────────────────────
console.log('\n\u2500\u2500 No bypass \u2500\u2500');
// Guard: the return must come before innerHTML assignment
var passwordCheckIdx = fn.indexOf("password !== '121274'");
var returnIdx = fn.indexOf('return', passwordCheckIdx);
var bodyIdx = fn.indexOf('answerKeyBody');
test('return on wrong password occurs before answer key display', passwordCheckIdx !== -1 && returnIdx < bodyIdx);

console.log('\n' + '='.repeat(50));
console.log('answer-key-guard: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
