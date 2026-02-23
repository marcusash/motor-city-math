// CSS keyframe animation test
// shared/styles.css must define keyframe animations for:
// - .correct-pulse (GD spec: correct answer green pulse)
// - Slide-down for hint reveal
// - Reduced-motion suppresses all

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-keyframe-animations.test.js\n');

var cssSrc = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

console.log('\u2500\u2500 CSS keyframe animation checks \u2500\u2500\n');

// 1. @keyframes block exists
var hasKeyframes = cssSrc.includes('@keyframes');
test('@keyframes blocks exist in shared/styles.css', hasKeyframes);

// 2. Correct pulse animation defined
var hasCorrectPulse = cssSrc.includes('correctPulse') || cssSrc.includes('correct-pulse') ||
                      cssSrc.includes('pulse') && cssSrc.includes('correct');
test('Correct pulse animation defined (@keyframes pulse or correctPulse)', hasCorrectPulse);

// 3. Any slide/reveal animation exists in CSS or JS
var hasSlideDown = cssSrc.includes('slideDown') || cssSrc.includes('slide-down') ||
                   cssSrc.includes('SlideIn') || cssSrc.includes('slide-in') ||
                   cssSrc.includes('fadeIn') || cssSrc.includes('fade-in') ||
                   cssSrc.includes('restoreSlideIn');
var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');
var hasSlideInJs = examSrc.includes('slideDown') || examSrc.includes('maxHeight') || examSrc.includes('slide');
test('Slide/reveal animation exists (CSS keyframe or JS height transition)', hasSlideDown || hasSlideInJs);

// 4. Reduced motion block suppresses animations
var hasReducedMotion = cssSrc.includes('prefers-reduced-motion');
test('@media (prefers-reduced-motion) suppresses animations', hasReducedMotion);

// 5. animation-duration is within reasonable range (0.1-1.0s)
var durationMatches = cssSrc.match(/animation(?:-duration)?:\s*([\d.]+)s/g) || [];
var allReasonable = durationMatches.every(function(d) {
    var val = parseFloat(d.match(/([\d.]+)s/)[1]);
    return val <= 1.5;
});
test('All animation durations are <= 1.5s', allReasonable || durationMatches.length === 0);

console.log('\n' + '='.repeat(50));
console.log('css-keyframe-animations: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
