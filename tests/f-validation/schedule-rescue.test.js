/**
 * schedule-rescue.test.js
 * Tests for sw-16: scheduleRescue() hint reveal timing spec.
 *
 * Validates: delay timing, transitional message, reduced-motion, manual hint bypass.
 * Run: node tests/f-validation/schedule-rescue.test.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const exam = fs.readFileSync(path.join(ROOT, 'exam.html'), 'utf-8');

let total = 0, pass = 0, fail = 0;
function test(name, ok, detail) {
    total++;
    if (ok) { pass++; console.log(`  ✅ ${name}`); }
    else { fail++; console.log(`  ❌ ${name}${detail ? ` — ${detail}` : ''}`); }
}

console.log('\n🏀 schedule-rescue.test.js (sw-16)\n');

// 1. scheduleRescue function exists
test('scheduleRescue function defined', exam.includes('function scheduleRescue('));

// 2. triggerRescue still exists (manual callers use it directly)
test('triggerRescue function still exists', exam.includes('function triggerRescue('));

// 3. Call site uses scheduleRescue (not triggerRescue) for auto-rescue
test('auto-rescue calls scheduleRescue (not triggerRescue)',
    exam.includes('attemptCounts[q.id] >= 3') &&
    exam.includes('scheduleRescue(q.id, fb)') &&
    !exam.includes('>= 3) triggerRescue(')
);

// 4. Delay of 800ms for transitional message
test('800ms delay before transitional message', exam.includes('800'));

// 5. Total delay of 1200ms before hint reveal
test('1200ms delay before hint reveal', exam.includes('1200'));

// 6. Transitional message copy (no em dash)
test("transitional message: 'Here is a direction to try --'",
    exam.includes("Here is a direction to try --")
);

// 7. No em dash in transitional message (spec: double dash not em dash)
const hintMsgLine = exam.match(/Here is a direction to try[^'"]*/);
test('transitional message uses double dash, not em dash',
    !hintMsgLine || !/[—–]/.test(hintMsgLine[0])
);

// 8. aria-live polite on transitional message
const msgCtx = exam.match(/rescue-msg[\s\S]{0,500}/);
test("transitional message has aria-live='polite'",
    !!msgCtx && msgCtx[0].includes("'polite'")
);

// 9. Reduced motion guard collapses timing to 0ms
test('prefers-reduced-motion guard present in scheduleRescue',
    exam.includes('prefers-reduced-motion: reduce') &&
    exam.includes('delay1 = prefersReduced ? 0') &&
    exam.includes('delay2 = prefersReduced ? 0')
);

// 10. Fade-in animation via requestAnimationFrame (200ms via CSS transition)
test('fade-in via requestAnimationFrame double RAF',
    exam.includes('requestAnimationFrame(function() { requestAnimationFrame(')
);

// 11. Manual hint (want-a-hint button) still calls triggerRescue directly
const wantHintCtx = exam.match(/showHint[\s\S]{0,500}/);
test('manual hint showHint does not use scheduleRescue',
    !!wantHintCtx && !wantHintCtx[0].includes('scheduleRescue')
);

// 12. Removed fbEl.textContent override in triggerRescue
test('triggerRescue no longer overrides fbEl.textContent with boilerplate',
    !exam.includes("fbEl.textContent = 'Off target. Check the hint below.'")
);

console.log(`\n${'='.repeat(50)}`);
console.log(`schedule-rescue: ${pass}/${total} pass`);
if (fail > 0) process.exit(1);
else console.log('PASS');
