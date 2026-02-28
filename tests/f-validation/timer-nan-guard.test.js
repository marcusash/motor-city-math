// Regression suite: timer init NaN guard in shared/scripts.js + exam.html
// Guards against NaN:NaN display when time_minutes is missing or non-numeric

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} timer-nan-guard.test.js\n');

const scripts = fs.readFileSync(path.join(__dirname, '../../shared/scripts.js'), 'utf-8');
const exam = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

// ── initTimer() guards in shared/scripts.js ────────────────────
console.log('\u2500\u2500 initTimer() existence and early-exit guards \u2500\u2500');
test('initTimer function exists', scripts.includes('function initTimer('));
const timerStart = scripts.indexOf('function initTimer(');
const timerFn = timerStart !== -1 ? scripts.substring(timerStart, timerStart + 600) : '';
test('parseInt used for time_minutes', timerFn.includes("parseInt(header.getAttribute('data-time-minutes')") || timerFn.includes('parseInt('));
test('early exit if minutes falsy', timerFn.includes('if (!minutes) return null'));

// ── formatTime() NaN hardening ─────────────────────────────────
console.log('\n\u2500\u2500 formatTime() NaN hardening \u2500\u2500');
// There are 2 formatTime instances (initTimer and initExamTimer)
const fmtMatches = scripts.match(/function formatTime\(s\)/g);
test('formatTime declared in scripts.js (at least once)', fmtMatches && fmtMatches.length >= 1);
test('formatTime guards !isFinite', scripts.includes('!isFinite(s)'));
test('formatTime returns 0:00 fallback', scripts.includes("return '0:00'"));

// ── exam.html: time_minutes truthy check before initTimer ──────
console.log('\n\u2500\u2500 exam.html: time_minutes guard before initTimer call \u2500\u2500');
test('exam.html guards if (data.time_minutes)', exam.includes('if (data.time_minutes)'));
// initTimer is inside the if block (check they appear in order)
const tmIdx = exam.indexOf('if (data.time_minutes)');
const initIdx = exam.indexOf('if (typeof initTimer === \'function\') initTimer()');
test('initTimer only called inside data.time_minutes block', tmIdx !== -1 && initIdx !== -1 && initIdx > tmIdx && initIdx < tmIdx + 300);

// ── data-time-minutes attribute ────────────────────────────────
console.log('\n\u2500\u2500 data-time-minutes attribute path \u2500\u2500');
test('setAttribute data-time-minutes used', exam.includes("setAttribute('data-time-minutes', data.time_minutes)"));
test('initTimer reads data-time-minutes attribute', timerFn.includes("getAttribute('data-time-minutes')") || scripts.includes("getAttribute('data-time-minutes')"));

console.log('\n' + '='.repeat(50));
console.log('timer-nan-guard: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
