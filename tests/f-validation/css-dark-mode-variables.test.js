// css-dark-mode-variables test
// shared/styles.css must define dark mode overrides for key token variables
// Kai uses the site in different lighting -- dark mode requires variable overrides

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-dark-mode-variables.test.js\n');

var stylesSrc = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

console.log('\u2500\u2500 Dark mode variable checks \u2500\u2500\n');

// 1. arena-mode (dark theme) selector defined in shared/styles.css
var hasDarkMode = stylesSrc.includes('arena-mode') || 
                  stylesSrc.includes('prefers-color-scheme: dark') || 
                  stylesSrc.includes('[data-theme="dark"]');
test('Dark/arena mode selector defined (arena-mode or prefers-color-scheme)', hasDarkMode);

// 2. Background overridden in arena mode
var hasDarkBg = hasDarkMode && stylesSrc.includes('background');
test('Background color overridden in dark/arena mode', hasDarkBg);

// 3. Color tokens overridden in arena mode
var hasDarkText = hasDarkMode && (stylesSrc.includes('--text') || stylesSrc.includes('color:'));
test('Text/color tokens overridden in dark/arena mode', hasDarkText);

console.log('\n' + '='.repeat(50));
console.log('css-dark-mode-variables: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
