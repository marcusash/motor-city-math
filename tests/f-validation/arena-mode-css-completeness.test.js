// arena-mode CSS dark theme completeness test
// Verifies .arena-mode overrides at minimum the core design tokens for dark theme

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} arena-mode-css-completeness.test.js\n');

const src = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

// Extract .arena-mode block
var arenaStart = src.indexOf('.arena-mode');
var arenaBlock = src.substring(arenaStart, arenaStart + 3000);

console.log('\u2500\u2500 .arena-mode token overrides \u2500\u2500');

// Core tokens that MUST be overridden for dark theme
var requiredTokens = [
    '--text-primary',
    '--bg-page',
    '--bg-card',
    '--accent-blue',
    '--color-correct'
];

requiredTokens.forEach(function(token) {
    var overridden = arenaBlock.includes(token);
    test('.arena-mode overrides ' + token, overridden);
});

// Additional checks
test('.arena-mode block exists in shared/styles.css', arenaStart >= 0);
test('.arena-mode overrides at least 5 tokens', (arenaBlock.match(/--[a-z][a-z0-9-]+\s*:/g) || []).length >= 5);

// Dark theme background should be dark (not light)
var bgOverride = arenaBlock.match(/--bg-page:\s*([^;]+)/);
if (bgOverride) {
    var bgVal = bgOverride[1].trim();
    console.log('  arena --bg-page: ' + bgVal);
    // Dark backgrounds have low-value hex (first two chars of #RRGGBB < 80)
    var hexMatch = bgVal.match(/#([0-9a-fA-F]{2})/);
    var isDark = hexMatch ? parseInt(hexMatch[1], 16) < 128 : false;
    test('arena --bg-page is a dark color (R < 128)', isDark);
}

// Text should be light on dark bg
var textOverride = arenaBlock.match(/--text-primary:\s*([^;]+)/);
if (textOverride) {
    var textVal = textOverride[1].trim();
    console.log('  arena --text-primary: ' + textVal);
    var hexMatchT = textVal.match(/#([0-9a-fA-F]{2})/);
    var isLight = hexMatchT ? parseInt(hexMatchT[1], 16) > 128 : false;
    test('arena --text-primary is a light color (R > 128)', isLight);
}

// exam.html and index.html apply arena-mode via JS
var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');
var indexSrc = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf-8');

console.log('\n\u2500\u2500 Arena mode application \u2500\u2500');
test('exam.html reads mcm-arena-mode from localStorage', examSrc.includes('mcm-arena-mode'));
test('index.html has arena-mode toggle', indexSrc.includes('arena-mode') || indexSrc.includes('arenaMode'));

console.log('\n' + '='.repeat(50));
console.log('arena-mode-css-completeness: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
