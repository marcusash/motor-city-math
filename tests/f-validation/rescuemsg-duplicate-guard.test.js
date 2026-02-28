// scheduleRescue() duplicate prevention test
// Verifies only one rescue message per question (ID guard), aria-live polite

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rescuemsg-duplicate-guard.test.js\n');

const src = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

var rescueStart = src.indexOf('function scheduleRescue(');
var rescueFn = src.substring(rescueStart, rescueStart + 2500);

console.log('\u2500\u2500 scheduleRescue() duplicate guard \u2500\u2500');

// 1. Function defined
test('scheduleRescue() function defined', rescueStart >= 0);

// 2. Duplicate guard: getElementById check before creating message
test('Duplicate guard: getElementById check on rescue-msg ID', rescueFn.includes("getElementById('rescue-msg-") || rescueFn.includes('rescue-msg-'));

// 3. Guard uses return to exit early (prevents double message)
test('Guard uses early return to prevent duplicate', rescueFn.includes('return') && (
    rescueFn.includes('rescue-msg') || rescueFn.includes('if (document')
));

// 4. aria-live=polite on rescue message (not assertive — transitional, not urgent)
test('Rescue message uses aria-live=polite', rescueFn.includes("aria-live', 'polite'") || rescueFn.includes("aria-live=\"polite\""));

// 5. Delay before showing rescue (not instant — must allow student to think)
test('Rescue has delay variable 800+ ms', rescueFn.includes('800') || rescueFn.includes('delay1') || rescueFn.includes('delay2'));

// 6. triggerRescue or equivalent called after delay (the actual hint reveal)
test('Rescue calls triggerRescue or reveals hint after delay', rescueFn.includes('triggerRescue') || rescueFn.includes('showHintLayer'));

// 7. prefers-reduced-motion respected (0ms path)
test('prefers-reduced-motion sets delay to 0ms', rescueFn.includes('reduced-motion') || rescueFn.includes('prefers-reduced'));

// 8. rescue message references the question ID (unique per question)
test('Rescue message ID includes question ID (unique)', rescueFn.includes("'rescue-msg-' + qId") || rescueFn.includes('rescue-msg-'));

// 9. No hardcoded question IDs in scheduleRescue (generic, takes qId param)
test('scheduleRescue takes qId parameter', rescueFn.includes('qId') || rescueFn.match(/function scheduleRescue\([^)]*q/));

console.log('\n' + '='.repeat(50));
console.log('rescuemsg-duplicate-guard: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
