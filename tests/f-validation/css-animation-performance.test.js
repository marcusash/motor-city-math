// CSS animation performance test
// Animations should use transform/opacity (GPU-compositable) not layout-triggering properties
// Layout-triggering: margin, padding, width, height, top, left in @keyframes

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-animation-performance.test.js\n');

var cssSrc = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

console.log('\u2500\u2500 Animation performance checks \u2500\u2500\n');

// Extract @keyframes blocks
var keyframeBlocks = cssSrc.match(/@keyframes[\s\S]*?\}[\s]*\}/g) || [];
console.log('  @keyframes blocks found: ' + keyframeBlocks.length);
test('@keyframes animations defined in shared/styles.css', keyframeBlocks.length > 0);

// Check for layout-triggering properties in keyframes
var LAYOUT_PROPS = ['\\bwidth:', '\\bheight:', '\\bmargin:', '\\bpadding:', '\\btop:', '\\bleft:', '\\bright:', '\\bbottom:'];
var layoutViolations = [];
keyframeBlocks.forEach(function(block) {
    var name = (block.match(/@keyframes\s+(\S+)/) || [])[1] || 'unknown';
    LAYOUT_PROPS.forEach(function(prop) {
        if (new RegExp(prop).test(block)) {
            layoutViolations.push('@keyframes ' + name + ': uses ' + prop.replace(/\\b|:/g, ''));
        }
    });
});

if (layoutViolations.length) {
    layoutViolations.slice(0,3).forEach(function(v) { console.log('  ! ' + v); });
    console.log('  INFO: Layout-triggering props in keyframes cause layout thrash (use transform/opacity instead)');
}
// Soft check -- warn but pass (not critical for MVP)
test('Animations use GPU-friendly properties (transform/opacity preferred)', layoutViolations.length === 0);

// Check for will-change or transform-based animations
var hasTransformAnim = cssSrc.includes('transform:') || cssSrc.includes('opacity:');
test('Stylesheet uses transform/opacity for animations', hasTransformAnim);

console.log('\n' + '='.repeat(50));
console.log('css-animation-performance: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
