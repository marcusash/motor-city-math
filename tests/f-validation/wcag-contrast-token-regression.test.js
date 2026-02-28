// WCAG contrast regression: key token values in shared/styles.css
// Values must match GD da-01 audit. Changes to these tokens would break WCAG AA.

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} wcag-contrast-token-regression.test.js\n');

const src = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

function getToken(name) {
    var m = src.match(new RegExp('--' + name + ':\\s*([^;\\n]+)'));
    return m ? m[1].trim().toLowerCase() : null;
}

// ── Light mode tokens (GD da-01 verified values) ───────────────
console.log('\u2500\u2500 Light mode token values (WCAG AA verified) \u2500\u2500');
test('--text-primary is #1A1F36 (14.91:1 on bg-page)', getToken('text-primary') === '#1a1f36');
test('--text-secondary is #5E6378 (5.46:1 on bg-page)', getToken('text-secondary') === '#5e6378');
test('--bg-page is #F4F5F9', getToken('bg-page') === '#f4f5f9');
test('--color-correct is #1B7D3A (4.77:1 on bg-page)', getToken('color-correct') === '#1b7d3a');
test('--color-incorrect is #C8102E (5.40:1 on bg-page)', getToken('color-incorrect') === '#c8102e');

// ── Arena mode tokens ─────────────────────────────────────────
console.log('\n\u2500\u2500 Arena mode token values \u2500\u2500');
var arenaBlock = src.match(/\.arena-mode[\s\S]+?(?=\n\s*\n|\n\.|\n@|\nhtml)/);
var arenaCSS = arenaBlock ? arenaBlock[0] : src;

test('arena --text-primary is light (#E0E4EB or similar)', arenaCSS.includes('#E0E4EB') || arenaCSS.includes('#e0e4eb'));
test('arena --color-correct is #2ECC71 (8.16:1 on #141B2D)', arenaCSS.includes('#2ECC71') || arenaCSS.includes('#2ecc71'));

// ── Token count stable ─────────────────────────────────────────
console.log('\n\u2500\u2500 Token stability \u2500\u2500');
var tokenCount = (src.match(/--[a-z][a-z0-9-]+\s*:/g) || []).length;
test('Token count in expected range (30-80)', tokenCount >= 30 && tokenCount <= 80);
console.log('  (current token count: ' + tokenCount + ')');

console.log('\n' + '='.repeat(50));
console.log('wcag-contrast-token-regression: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
