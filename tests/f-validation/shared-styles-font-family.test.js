// shared-styles-font-family test
// shared/styles.css must define the --font-body custom property
// and it must use the approved Helvetica Neue stack (design system spec)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} shared-styles-font-family.test.js\n');

var cssSrc = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

console.log('\u2500\u2500 Font family checks \u2500\u2500\n');

// --font-body custom property defined
var hasFontBodyVar = cssSrc.includes('--font-body');
test('--font-body CSS custom property defined', hasFontBodyVar);

// Helvetica Neue in font stack
var hasHelveticaNeue = cssSrc.includes("'Helvetica Neue'") || cssSrc.includes('"Helvetica Neue"');
test("'Helvetica Neue' in font stack", hasHelveticaNeue);

// Sans-serif fallback
var hasSansSerif = cssSrc.includes('sans-serif');
test('sans-serif fallback in font stack', hasSansSerif);

// Font used on body element
var fontOnBody = /body\s*\{[^}]*font-family/s.test(cssSrc) || cssSrc.includes('font-family: var(--font-body)');
test('Font family applied to body or via var(--font-body)', fontOnBody);

console.log('\n' + '='.repeat(50));
console.log('shared-styles-font-family: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
