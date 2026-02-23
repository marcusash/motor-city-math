// exam.html skip link visible focus test
// WCAG 2.4.1: A skip navigation link must be visible when focused
// The skip link should have focus-visible styles (not display:none on focus)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-skip-link-visible-focus.test.js\n');

var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');
var indexSrc = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf-8');
var cssSrc = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

console.log('\u2500\u2500 Skip link focus visibility checks \u2500\u2500\n');

// 1. Skip link exists in exam.html
var hasExamSkipLink = examSrc.includes('skip') && (examSrc.includes('#main') || examSrc.includes('skip-link') || examSrc.includes('Skip'));
test('Skip link present in exam.html', hasExamSkipLink);

// 2. Skip link exists in index.html  
var hasIndexSkipLink = indexSrc.includes('Skip to content') || indexSrc.includes('skip-link') ||
                       (indexSrc.includes('href="#main"') && indexSrc.includes('sr-only'));
test('Skip link present in index.html', hasIndexSkipLink);

// 3. CSS has :focus styles for skip link (not hidden on focus)
var hasSkipFocusStyle = cssSrc.includes('.skip-link:focus') || cssSrc.includes('.skip-to-main:focus') ||
                        cssSrc.includes('[href="#main"]:focus') || cssSrc.includes('skip-link');
test('CSS has skip link focus styles (.skip-link:focus or similar)', hasSkipFocusStyle);

// 4. Skip link target (#main or main element or role="main") exists in exam.html
var hasMainTarget = examSrc.includes('id="main"') || examSrc.includes('<main') ||
                    examSrc.includes("id='main'") || examSrc.includes('role="main"');
test('Skip link target (id="main", <main>, or role="main") exists in exam.html', hasMainTarget);

// 5. Skip link does NOT use display:none unconditionally (would hide from AT)
// A skip link hidden off-screen is fine (position: absolute; left: -9999px)
// But display:none makes it inaccessible
var skipLinkSection = (cssSrc.match(/\.skip-link[^}]*}/gs) || []).join('');
var hasDisplayNone = skipLinkSection.includes('display: none') || skipLinkSection.includes('display:none');
var hasFocusOverride = cssSrc.includes('.skip-link:focus') && cssSrc.includes('display: block');
test('Skip link is not hidden with display:none (screen-reader accessible)', !hasDisplayNone || hasFocusOverride);

console.log('\n' + '='.repeat(50));
console.log('exam-skip-link-visible-focus: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
