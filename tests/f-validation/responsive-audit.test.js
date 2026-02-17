/**
 * Motor City Math — Fundamentals Agent (F)
 * Task F-6: Mobile Responsive Layout Audit
 *
 * Validates responsive CSS across all HTML files.
 * Checks: media queries, viewport meta, touch targets, input sizing.
 *
 * Design spec breakpoints (.design-system.md §9):
 *   Desktop: >1000px (1000px container)
 *   Tablet:  768-999px (fill width, 24px padding)
 *   Phone:   <768px (h1 1.8em, card padding 20px, inputs full width)
 *   Small:   <480px (h1 1.5em, buttons stack, chart 250px)
 *
 * Run: node tests/f-validation/responsive-audit.test.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
let pass = 0, fail = 0;

function test(desc, condition) {
    if (condition) { pass++; }
    else { fail++; console.log(`  ❌ ${desc}`); }
}
function section(title) { console.log(`\n── ${title} ──`); }

const htmlFiles = fs.readdirSync(ROOT).filter(f => f.endsWith('.html'));

// ===================================================================
// 1. VIEWPORT META TAG
// ===================================================================
section('1. Viewport Meta Tag');

for (const file of htmlFiles) {
    const content = fs.readFileSync(path.join(ROOT, file), 'utf-8');
    const hasViewport = /meta\s+name=["']viewport["']/.test(content);
    const viewportMatch = content.match(/meta\s+name=["']viewport["']\s+content=["']([^"']+)["']/);
    
    if (hasViewport) {
        const vp = viewportMatch ? viewportMatch[1] : 'unknown';
        const hasWidth = /width=device-width/.test(vp);
        const hasScale = /initial-scale=1/.test(vp);
        test(`${file}: viewport meta`, hasWidth && hasScale);
        if (!hasWidth || !hasScale) {
            console.log(`    viewport: "${vp}" — missing ${!hasWidth ? 'width=device-width' : 'initial-scale=1'}`);
        }
    } else {
        test(`${file}: viewport meta`, false);
        console.log(`    No viewport meta — page won't scale on mobile`);
    }
}

// ===================================================================
// 2. MEDIA QUERIES
// ===================================================================
section('2. Media Query Analysis');

const specBreakpoints = [480, 768, 1000];

for (const file of htmlFiles) {
    const content = fs.readFileSync(path.join(ROOT, file), 'utf-8');
    const mediaQueries = [...content.matchAll(/@media[^{]+\{/g)].map(m => m[0]);
    const printQueries = mediaQueries.filter(q => /print/.test(q));
    const screenQueries = mediaQueries.filter(q => /max-width|min-width/.test(q));
    
    // Extract breakpoint values
    const breakpoints = [...content.matchAll(/(?:max|min)-width:\s*(\d+)px/g)]
        .map(m => parseInt(m[1]))
        .filter(v => !isNaN(v));
    const uniqueBP = [...new Set(breakpoints)].sort((a, b) => a - b);
    
    if (screenQueries.length > 0) {
        console.log(`  ✅ ${file}: ${screenQueries.length} responsive queries, breakpoints: [${uniqueBP.join(', ')}]px`);
    } else {
        console.log(`  ⚠️ ${file}: NO responsive media queries`);
    }
    
    test(`${file}: has responsive queries`, screenQueries.length > 0);
}

// ===================================================================
// 3. CONTAINER WIDTH
// ===================================================================
section('3. Container Max-Width');

for (const file of htmlFiles) {
    const content = fs.readFileSync(path.join(ROOT, file), 'utf-8');
    const containerMatch = content.match(/\.container\s*\{[^}]*max-width:\s*(\d+)px/);
    
    if (containerMatch) {
        const width = parseInt(containerMatch[1]);
        console.log(`  ${file}: max-width: ${width}px${width > 1000 ? ' ⚠️ wider than spec (1000px)' : ''}`);
    } else {
        // Check for inline max-width on body or main container
        const bodyWidth = content.match(/max-width:\s*(\d+)px/);
        if (bodyWidth) {
            console.log(`  ${file}: found max-width: ${bodyWidth[1]}px`);
        } else {
            console.log(`  ⚠️ ${file}: no container max-width found`);
        }
    }
}

// ===================================================================
// 4. INPUT SIZING (TOUCH TARGETS)
// ===================================================================
section('4. Input Sizing for Touch');

console.log('  WCAG 2.5.8: Touch targets should be ≥44×44px');
console.log('  Apple HIG: ≥44pt, Material: ≥48dp\n');

for (const file of htmlFiles) {
    const content = fs.readFileSync(path.join(ROOT, file), 'utf-8');
    
    // Check for small inline widths on inputs
    const smallInputs = [...content.matchAll(/style="[^"]*width:\s*(\d+)px/g)]
        .filter(m => parseInt(m[1]) < 80);
    
    if (smallInputs.length > 0) {
        console.log(`  ⚠️ ${file}: ${smallInputs.length} inputs with width < 80px`);
        console.log(`     Small widths: ${smallInputs.map(m => m[1] + 'px').join(', ')}`);
    }
    
    // Check for responsive input handling
    const hasFullWidthInputs = /input[\s\S]*?width:\s*100%/.test(content) ||
                                /input[\s\S]*?max-width:\s*100%/.test(content);
    if (hasFullWidthInputs) {
        console.log(`  ✅ ${file}: has full-width input rules`);
    }
}

// ===================================================================
// 5. FONT SIZE AT MOBILE
// ===================================================================
section('5. Font Size Handling');

for (const file of htmlFiles) {
    const content = fs.readFileSync(path.join(ROOT, file), 'utf-8');
    
    // Check if h1 is resized in mobile queries
    const mobileSection = content.match(/@media[^{]*max-width:\s*768px[^{]*\{[\s\S]*?\}\s*\}/g) || [];
    const allMobile = mobileSection.join(' ');
    
    const hasH1Resize = /h1[\s\S]*?font-size/.test(allMobile);
    
    // Check for base font-size setting
    const baseFontSize = content.match(/font-size:\s*(\d+(?:\.\d+)?)(px|em|rem)/);
    
    if (hasH1Resize) {
        console.log(`  ✅ ${file}: h1 resized at mobile breakpoint`);
    } else if (mobileSection.length > 0) {
        console.log(`  ℹ️  ${file}: has mobile query but no h1 resize`);
    }
}

// ===================================================================
// 6. SHARED STYLES.CSS RESPONSIVE
// ===================================================================
section('6. shared/styles.css Responsive Analysis');

const stylesCss = path.join(ROOT, 'shared', 'styles.css');
if (fs.existsSync(stylesCss)) {
    const css = fs.readFileSync(stylesCss, 'utf-8');
    const queries = [...css.matchAll(/@media[^{]+\{/g)];
    const breakpoints = [...css.matchAll(/(?:max|min)-width:\s*(\d+)px/g)]
        .map(m => parseInt(m[1]));
    const uniqueBP = [...new Set(breakpoints)].sort((a, b) => a - b);
    
    console.log(`  Media queries: ${queries.length}`);
    console.log(`  Breakpoints: [${uniqueBP.join(', ')}]px`);
    
    const hasPhone = breakpoints.includes(768) || breakpoints.some(b => b <= 768 && b >= 480);
    const hasSmall = breakpoints.includes(480) || breakpoints.some(b => b < 480);
    
    test('shared/styles.css has phone breakpoint', hasPhone);
    test('shared/styles.css has small-phone breakpoint', hasSmall);
    
    // Check spec compliance
    const specMissing = specBreakpoints.filter(bp => !breakpoints.includes(bp));
    if (specMissing.length > 0) {
        console.log(`  ⚠️ Missing spec breakpoints: ${specMissing.join(', ')}px`);
    }
} else {
    console.log('  shared/styles.css not found');
}

// ===================================================================
// SUMMARY
// ===================================================================
section('RESPONSIVE AUDIT SUMMARY');
console.log(`\n  Tests: ${pass + fail}, ${pass} passed, ${fail} failed`);

const noViewport = htmlFiles.filter(f => {
    const c = fs.readFileSync(path.join(ROOT, f), 'utf-8');
    return !/meta\s+name=["']viewport["']/.test(c);
});
const noResponsive = htmlFiles.filter(f => {
    const c = fs.readFileSync(path.join(ROOT, f), 'utf-8');
    return !/(max|min)-width:\s*\d+px/.test(c);
});

if (noViewport.length > 0) {
    console.log(`\n  🔴 Files missing viewport meta: ${noViewport.join(', ')}`);
}
if (noResponsive.length > 0) {
    console.log(`  ⚠️ Files with no responsive queries: ${noResponsive.join(', ')}`);
}

console.log('\n  RECOMMENDATIONS:');
console.log('  1. Add viewport meta to any files missing it');
console.log('  2. Migrate all files to shared/styles.css responsive rules');
console.log('  3. Add 480px small-phone breakpoint per design spec');
console.log('  4. Inline width:60px inputs need responsive override at mobile\n');

process.exit(fail > 0 ? 1 : 0);
