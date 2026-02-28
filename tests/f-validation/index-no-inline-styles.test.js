// index-no-inline-styles test
// index.html should avoid inline styles in favor of CSS classes
// Inline styles break the design token system and are hard to maintain

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} index-no-inline-styles.test.js\n');

var html = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf-8');

// Count style="..." attributes (exclude <style> blocks)
var inlineStyles = html.match(/\bstyle\s*=\s*["'][^"']+["']/g) || [];
var MAX_INLINE = 25; // Allow display:none and other JS-driven inline styles

test('index.html has <= ' + MAX_INLINE + ' inline styles (actual: ' + inlineStyles.length + ')', inlineStyles.length <= MAX_INLINE);
if (inlineStyles.length > MAX_INLINE) {
    console.log('    ! ' + inlineStyles.length + ' inline styles found. Move to CSS classes.');
    inlineStyles.slice(0, 3).forEach(function(s) { console.log('    - ' + s.slice(0, 80)); });
}

console.log('\n' + '='.repeat(50));
console.log('index-no-inline-styles: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
