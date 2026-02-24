// css-input-styles-defined test
// shared/styles.css must style form inputs consistently
// Unstyled inputs render with OS-default appearance, breaking MCM visual language

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-input-styles-defined.test.js\n');

var stylesSrc = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

console.log('\u2500\u2500 Input style checks \u2500\u2500\n');

// 1. Input element styled
var hasInputStyle = stylesSrc.includes('input[type=') || stylesSrc.includes('input[type="') || 
                    stylesSrc.includes('input {') || stylesSrc.includes('input,');
test('Input elements have CSS styles defined', hasInputStyle);

// 2. Focus state styled on inputs
var hasInputFocus = stylesSrc.includes('input') && stylesSrc.includes(':focus');
test('Input focus state styled', hasInputFocus);

// 3. Text input uses MCM color tokens
var hasInputToken = stylesSrc.includes('var(--bg-input)') || stylesSrc.includes('var(--border-input)') ||
                    stylesSrc.includes('var(--text-primary)');
test('Input uses MCM CSS custom property tokens', hasInputToken);

console.log('\n' + '='.repeat(50));
console.log('css-input-styles-defined: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
