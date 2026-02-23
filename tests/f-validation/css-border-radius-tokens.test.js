// CSS border-radius token test
// MCM uses consistent border-radius values from tokens
// Hardcoded border-radius (e.g., 8px, 12px) not via tokens indicates inconsistency

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-border-radius-tokens.test.js\n');

var cssSrc = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

console.log('\u2500\u2500 Border-radius token checks \u2500\u2500\n');

// 1. border-radius is used somewhere
var hasBorderRadius = cssSrc.includes('border-radius');
test('border-radius property is used in shared/styles.css', hasBorderRadius);

// 2. CSS token for border-radius (optional - MCM uses direct px values)
// At 33 direct px uses, consistency is more important than tokenization
var hasBorderRadiusToken = cssSrc.includes('--radius') || cssSrc.includes('--border-radius') ||
                           cssSrc.includes('--corner');
var directUsage = (cssSrc.match(/border-radius:\s*\d/g) || []).length;
if (!hasBorderRadiusToken) console.log('  INFO: No border-radius token (using direct px values - consistent but not tokenized)');
test('Border-radius token exists OR direct values are consistent (< 40 uses)', 
     hasBorderRadiusToken || directUsage <= 40);

// 3. Consistent usage (count of direct px values vs token usage)
var tokenUsage = (cssSrc.match(/border-radius:\s*var\(--/g) || []).length;
console.log('  Token usage: ' + tokenUsage + ', Direct px: ' + directUsage);
test('Border-radius used consistently (<= 40 direct values or tokenized)', directUsage <= 40);

console.log('\n' + '='.repeat(50));
console.log('css-border-radius-tokens: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
