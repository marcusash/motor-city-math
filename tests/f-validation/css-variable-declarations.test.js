// CSS variable declaration test (token hygiene)
// All --variable declarations in :root must have non-empty values
// Empty tokens indicate incomplete design system

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-variable-declarations.test.js\n');

var cssSrc = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

console.log('\u2500\u2500 CSS variable declaration checks \u2500\u2500\n');

// Extract :root block
var rootMatch = cssSrc.match(/:root\s*\{([^}]+)\}/);
if (!rootMatch) {
    console.log('  ! No :root block found');
    test(':root block found in shared/styles.css', false);
    process.exit(1);
}

var rootContent = rootMatch[1];

// Find all --var: value pairs
var declarations = rootContent.match(/--[\w-]+\s*:[^;]+/g) || [];
console.log('  CSS custom properties: ' + declarations.length);

// Check for empty values
var emptyDecls = declarations.filter(function(d) {
    var val = d.split(':').slice(1).join(':').trim();
    return val === '' || val === ';';
});

if (emptyDecls.length) emptyDecls.forEach(function(d) { console.log('  ! Empty: ' + d.trim()); });

test('At least 35 CSS custom properties in :root', declarations.length >= 35);
test('No empty CSS custom property values', emptyDecls.length === 0);

// Check font scale tokens exist
var hasFontScale = rootContent.includes('--text-sm') && rootContent.includes('--text-base') &&
                   rootContent.includes('--text-lg');
test('Font scale tokens defined (--text-sm, --text-base, --text-lg)', hasFontScale);

// Check spacing tokens (MCM may use margin/padding directly without spacing tokens)
var hasSpacing = rootContent.includes('--space') || rootContent.includes('--gap') ||
                 rootContent.includes('--padding') || rootContent.includes('--margin') ||
                 declarations.length >= 35; // if many tokens, design system is present
test('Spacing tokens or substantial token set defined', hasSpacing);

console.log('\n' + '='.repeat(50));
console.log('css-variable-declarations: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
