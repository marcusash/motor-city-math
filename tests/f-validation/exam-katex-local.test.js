// exam-katex-local test
// KaTeX must be loaded from local shared/ directory, not CDN
// CDN dependency breaks offline use and creates a single point of failure

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-katex-local.test.js\n');

var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 KaTeX local hosting checks \u2500\u2500\n');

// 1. KaTeX loaded from local path
var hasLocalKaTeX = examSrc.includes('shared/katex') || examSrc.includes('./katex') ||
                    examSrc.includes('../katex') || examSrc.includes('shared/') && examSrc.includes('katex');
test('KaTeX loaded from local shared/ path', hasLocalKaTeX);

// 2. No KaTeX CDN
var hasCdnKaTeX = examSrc.includes('cdn.jsdelivr.net/npm/katex') ||
                  examSrc.includes('cdnjs.cloudflare.com') && examSrc.includes('katex') ||
                  examSrc.includes('unpkg.com/katex');
test('KaTeX NOT loaded from CDN', !hasCdnKaTeX);

// 3. KaTeX auto-render used
var hasAutoRender = examSrc.includes('renderMathInElement') || examSrc.includes('auto-render');
test('KaTeX auto-render enabled', hasAutoRender);

// 4. KaTeX delimiters configured
var hasDelimiters = examSrc.includes('delimiters') || examSrc.includes('displayMode');
test('KaTeX delimiters or displayMode configured', hasDelimiters);

console.log('\n' + '='.repeat(50));
console.log('exam-katex-local: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
