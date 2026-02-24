// css-font-stack test
// shared/styles.css must define a complete font stack with fallbacks
// Specifying only a custom font without fallback causes FOUT on slow connections

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-font-stack.test.js\n');

var stylesSrc = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

console.log('\u2500\u2500 Font stack checks \u2500\u2500\n');

// 1. font-family defined
var hasFontFamily = stylesSrc.includes('font-family');
test('font-family defined in shared/styles.css', hasFontFamily);

// 2. Generic fallback (sans-serif, serif, monospace) present
var hasGenericFallback = stylesSrc.includes('sans-serif') || stylesSrc.includes('serif') || 
                         stylesSrc.includes('monospace');
test('Generic font fallback (sans-serif/serif/monospace) defined', hasGenericFallback);

// 3. System font stack or Google Fonts referenced
var hasSystemFont = stylesSrc.includes('-apple-system') || stylesSrc.includes('system-ui') || 
                    stylesSrc.includes('Inter') || stylesSrc.includes('Roboto') ||
                    stylesSrc.includes('Segoe UI') || stylesSrc.includes('Helvetica') ||
                    stylesSrc.includes('Arial');
test('System font stack or named web font referenced', hasSystemFont);

console.log('\n' + '='.repeat(50));
console.log('css-font-stack: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
