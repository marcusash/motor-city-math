// css-padding-not-px-for-em-elements test
// CSS should not use px padding on text-level elements (em, span) since
// px doesn't scale with user font-size preferences (accessibility issue)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-padding-not-px-for-em-elements.test.js\n');

var css = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

// Count how many times em or span selectors have px padding
var violations = [];
var re = /\bem\b[^{]*\{([^}]*)\}/g;
var m;
while ((m = re.exec(css)) !== null) {
    if (/padding\s*:[^;]*\d+px/.test(m[1])) {
        violations.push('em selector has px padding: ...' + m[1].slice(0, 60).trim() + '...');
    }
}

test('em elements do not use px padding (' + violations.length + ' violations)', violations.length === 0);
if (violations.length) violations.forEach(function(v) { console.log('    ! ' + v); });

console.log('\n' + '='.repeat(50));
console.log('css-padding-not-px-for-em-elements: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
