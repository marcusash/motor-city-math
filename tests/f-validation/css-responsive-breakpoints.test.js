// CSS responsive breakpoints test
// MCM responsive spec: 375px (mobile) and 768px (tablet) breakpoints must exist
// Both must be covered in shared/styles.css

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-responsive-breakpoints.test.js\n');

var cssSrc = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');
var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 Responsive breakpoint checks \u2500\u2500\n');

// 1. At least one @media query exists
var hasMedia = cssSrc.includes('@media');
test('@media queries exist in shared/styles.css', hasMedia);

// 2. Mobile breakpoint (375px or 480px or max-width: 600px)
var hasMobileBreakpoint = cssSrc.includes('375px') || cssSrc.includes('480px') ||
                          (cssSrc.includes('@media') && cssSrc.includes('600px'));
test('Mobile breakpoint defined (375px, 480px, or 600px)', hasMobileBreakpoint);

// 3. Tablet breakpoint (768px or 800px)
var hasTabletBreakpoint = cssSrc.includes('768px') || cssSrc.includes('800px') ||
                          cssSrc.includes('tablet');
test('Tablet breakpoint defined (768px or 800px)', hasTabletBreakpoint);

// 4. viewport meta tag in exam.html (required for responsive layout)
var hasViewportMeta = examSrc.includes('viewport') && examSrc.includes('width=device-width');
test('Viewport meta tag in exam.html (width=device-width)', hasViewportMeta);

// 5. Touch target size: min-height or min-width for interactive elements
var hasTouchTarget = cssSrc.includes('44px') || cssSrc.includes('48px') ||
                     cssSrc.includes('touch-target') || examSrc.includes('44px');
test('Touch target size (44px or 48px) defined for interactive elements', hasTouchTarget);

console.log('\n' + '='.repeat(50));
console.log('css-responsive-breakpoints: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
