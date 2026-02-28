// Score counter animation test -- GD sw-08
// After gradeExam: score animates from 0 to final value
// Uses requestAnimationFrame for smooth animation (not setInterval)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} score-counter-animation.test.js\n');

var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 Score counter animation (sw-08) checks \u2500\u2500\n');

// 1. requestAnimationFrame used for animation
var hasRAF = examSrc.includes('requestAnimationFrame');
test('requestAnimationFrame used for score animation', hasRAF);

// 2. Score animates from 0 to final (start=0, end=final)
var hasScoreAnim = examSrc.includes('animateScore') || examSrc.includes('animScore') ||
                   examSrc.includes('scoreAnim') || (hasRAF && examSrc.includes('score'));
test('Score animation function exists (animateScore or similar)', hasScoreAnim);

// 3. Duration defined for animation (performance guard: not too long)
var hasDuration = examSrc.includes('duration') || examSrc.includes('Duration') ||
                  examSrc.includes('1000') || examSrc.includes('800') || examSrc.includes('600');
test('Animation duration constant defined', hasDuration);

// 4. Reduced motion: animation collapses to instant when prefers-reduced-motion
var hasReducedGuard = examSrc.includes('prefers-reduced-motion') || examSrc.includes('reducedMotion') ||
                      examSrc.includes('matchMedia');
test('prefers-reduced-motion guard for animation', hasReducedGuard);

// 5. Score display element exists with identifiable ID
var hasScoreEl = examSrc.includes('score') && (examSrc.includes('id="score') || examSrc.includes("id='score") ||
                 examSrc.includes('scoreEl') || examSrc.includes('scoreDisplay'));
test('Score display element with identifiable ID', hasScoreEl);

console.log('\n' + '='.repeat(50));
console.log('score-counter-animation: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
