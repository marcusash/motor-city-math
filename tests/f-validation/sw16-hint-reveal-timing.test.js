// sw-16 regression: hint reveal timing constants in scheduleRescue()
// Spec: 800ms delay before transitional message, 1200ms before auto-rescue (triggerRescue)
// prefersReducedMotion path uses 0ms for both delays.

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} sw16-hint-reveal-timing.test.js\n');

const src = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

// ── scheduleRescue presence ────────────────────────────────────
console.log('\u2500\u2500 Function presence \u2500\u2500');
const start = src.indexOf('scheduleRescue(qId, fbEl)');
test('scheduleRescue function exists', start !== -1);
const fn = start !== -1 ? src.substring(start, start + 1400) : '';
test('scheduleRescue references delay1', fn.includes('delay1'));
test('scheduleRescue references delay2', fn.includes('delay2'));

// ── Timing constants ───────────────────────────────────────────
console.log('\n\u2500\u2500 Timing constants \u2500\u2500');
test('delay1 = 800ms (transitional message)', fn.includes('delay1 = prefersReduced ? 0 : 800'));
test('delay2 = 1200ms (auto-rescue trigger)', fn.includes('delay2 = prefersReduced ? 0 : 1200'));
test('delay2 > delay1 (rescue after message)', (function() {
    const d1 = fn.match(/prefersReduced \? 0 : (\d+)/);
    const d2 = fn.match(/prefersReduced \? 0 : (\d+)/g);
    if (!d1 || !d2 || d2.length < 2) return false;
    const v1 = parseInt(d2[0].match(/(\d+)$/)[1]);
    const v2 = parseInt(d2[1].match(/(\d+)$/)[1]);
    return v2 > v1;
})());

// ── Reduced motion path ────────────────────────────────────────
console.log('\n\u2500\u2500 Reduced motion path \u2500\u2500');
test('prefersReducedMotion check uses matchMedia', fn.includes("matchMedia('(prefers-reduced-motion: reduce)')"));
test('delay1 is 0 when prefersReduced', fn.includes('prefersReduced ? 0 : 800'));
test('delay2 is 0 when prefersReduced', fn.includes('prefersReduced ? 0 : 1200'));

// ── Transitional message ───────────────────────────────────────
console.log('\n\u2500\u2500 Transitional message \u2500\u2500');
test('transitional message uses delay1 setTimeout', fn.includes('setTimeout(function() {') && fn.includes('delay1'));
test('transitional message has aria-live=polite', fn.includes("setAttribute('aria-live', 'polite')"));
test('transitional message is p element', fn.includes("createElement('p')"));
test('transitional message has rescue-msg id', fn.includes("'rescue-msg-' + qId"));
test('transitional message guard: skips if already added', fn.includes("if (document.getElementById('rescue-msg-' + qId)) return"));

// ── Auto-rescue trigger ────────────────────────────────────────
console.log('\n\u2500\u2500 Auto-rescue trigger \u2500\u2500');
test('triggerRescue called after delay2', fn.includes('setTimeout(function() { triggerRescue(qId, fbEl); }, delay2)'));
test('triggerRescue function exists in source', src.includes('function triggerRescue(') || src.includes('triggerRescue(qId'));

// ── hints element guard ────────────────────────────────────────
console.log('\n\u2500\u2500 Safety guard \u2500\u2500');
test('early return if hints element missing', fn.includes("if (!hints) return"));
test('hints lookup uses hints-{qId} id', fn.includes("getElementById('hints-' + qId)"));

console.log('\n' + '='.repeat(50));
console.log('sw16-hint-reveal-timing: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
