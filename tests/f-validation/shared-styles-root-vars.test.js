// shared-styles-root-vars test
// :root must define the core design tokens
// If :root block is missing, all var() calls fall back to browser defaults

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} shared-styles-root-vars.test.js\n');

var cssSrc = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

console.log('\u2500\u2500 CSS :root variable checks \u2500\u2500\n');

// :root block present
var hasRoot = cssSrc.includes(':root');
test(':root block present in styles.css', hasRoot);

// Key design tokens defined
var CORE_TOKENS = ['--accent-red', '--font-body'];
CORE_TOKENS.forEach(function(token) {
    test('Core token ' + token + ' defined in :root', cssSrc.includes(token));
});

// Pistons palette tokens or raw colors
var hasPistonsRed = cssSrc.includes('#C8102E') || cssSrc.includes('c8102e') || cssSrc.includes('C8102E');
var hasPistonsBlue = cssSrc.includes('#1D42BA') || cssSrc.includes('1D42BA') || cssSrc.includes('1d42ba');
test('Pistons red (#C8102E) defined in styles.css', hasPistonsRed);
test('Pistons blue (#1D42BA) defined in styles.css', hasPistonsBlue);

console.log('\n' + '='.repeat(50));
console.log('shared-styles-root-vars: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
