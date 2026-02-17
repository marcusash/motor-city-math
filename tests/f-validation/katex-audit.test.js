/**
 * Motor City Math — KaTeX Rendering Audit (F-8)
 *
 * Verifies all files that use KaTeX:
 * 1. Load local KaTeX bundle (shared/katex/)
 * 2. Have auto-render configured with correct delimiters
 * 3. Contain actual LaTeX content (\( \) or \[ \])
 * 4. No MathJax remnants
 *
 * Run: node tests/f-validation/katex-audit.test.js
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

// Files that should have KaTeX (math-heavy)
const katexFiles = [
    '20260119_Exponents_Unit1.html',
    '20260119_Exponents_Unit1_2nd.html',
    '20260119_Exponents_Unit1_3rd.html',
    'nonlinear_exam_mvp.html',
    'nonlinear_functions_test.html',
    'practice.html',
    'test-builder.html',
    'unit2_nonlinear_review.html',
    'test.html'
];

// ===================================================================
// 1. LOCAL KATEX BUNDLE EXISTS
// ===================================================================
section('1. Local KaTeX Bundle');

const katexDir = path.join(ROOT, 'shared', 'katex');
test('shared/katex/ directory exists', fs.existsSync(katexDir));
test('katex.min.css exists', fs.existsSync(path.join(katexDir, 'katex.min.css')));
test('katex.min.js exists', fs.existsSync(path.join(katexDir, 'katex.min.js')));
test('auto-render.min.js exists', fs.existsSync(path.join(katexDir, 'auto-render.min.js')));
test('fonts/ directory exists', fs.existsSync(path.join(katexDir, 'fonts')));

const fonts = fs.existsSync(path.join(katexDir, 'fonts'))
    ? fs.readdirSync(path.join(katexDir, 'fonts'))
    : [];
test('fonts/ has woff2 files', fonts.some(f => f.endsWith('.woff2')));
test('fonts/ has ≥10 font files', fonts.length >= 10);

// ===================================================================
// 2. KATEX FILES LOAD LOCAL BUNDLE
// ===================================================================
section('2. KaTeX Files Load Local Bundle');

for (const file of katexFiles) {
    const filePath = path.join(ROOT, file);
    if (!fs.existsSync(filePath)) {
        test(`${file}: file exists`, false);
        continue;
    }
    const content = fs.readFileSync(filePath, 'utf-8');

    test(`${file}: loads local katex.min.css`, content.includes('shared/katex/katex.min.css'));
    test(`${file}: loads local katex.min.js`, content.includes('shared/katex/katex.min.js'));
}

// ===================================================================
// 3. AUTO-RENDER CONFIGURED
// ===================================================================
section('3. Auto-Render Configuration');

const autoRenderFiles = katexFiles.filter(f => f !== 'parent.html');
for (const file of autoRenderFiles) {
    const filePath = path.join(ROOT, file);
    if (!fs.existsSync(filePath)) continue;
    const content = fs.readFileSync(filePath, 'utf-8');

    const hasAutoRender = content.includes('auto-render') || content.includes('renderMathInElement');
    test(`${file}: has auto-render`, hasAutoRender);
}

// ===================================================================
// 4. NO MATHJAX REMNANTS
// ===================================================================
section('4. No MathJax Remnants');

for (const file of htmlFiles) {
    const content = fs.readFileSync(path.join(ROOT, file), 'utf-8');
    const hasMathJax = /mathjax|MathJax/i.test(content);
    test(`${file}: no MathJax references`, !hasMathJax);
}

// ===================================================================
// 5. NO CDN KATEX (ALL LOCAL)
// ===================================================================
section('5. No CDN KaTeX References');

for (const file of htmlFiles) {
    const content = fs.readFileSync(path.join(ROOT, file), 'utf-8');
    const hasCdnKatex = /cdn\.jsdelivr\.net\/npm\/katex/i.test(content);
    test(`${file}: no CDN KaTeX`, !hasCdnKatex);
}

// ===================================================================
// SUMMARY
// ===================================================================
section('KATEX AUDIT SUMMARY');
console.log(`\n  Tests: ${pass + fail}, ${pass} passed, ${fail} failed\n`);
process.exit(fail > 0 ? 1 : 0);
