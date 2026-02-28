// Audit: hardcoded hex colors in exam.html
// Checks: no hex in style= attributes (all CSS must use tokens or <style> block)
// Advisory: lists hardcoded hex in <style> that should eventually become CSS tokens

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-token-hygiene.test.js\n');

const src = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

// ── No inline style= hex colors ──────────────────────────────
console.log('\u2500\u2500 No inline hex colors (hard rule) \u2500\u2500');
// Extract only the HTML (non-CSS/JS) portion for style= attribute checks
var styleAttrHex = src.match(/style\s*=\s*["'][^"']*#[0-9A-Fa-f]{6}[^"']*["']/g) || [];
test('No hardcoded hex in style= attributes', styleAttrHex.length === 0);
if (styleAttrHex.length > 0) {
    console.log('  Violations:', styleAttrHex.slice(0, 3));
}

// ── Focus ring uses token-friendly color ──────────────────────
console.log('\n\u2500\u2500 Focus ring accessibility color \u2500\u2500');
test('Focus ring uses #4A90D9 or CSS token', src.includes('#4A90D9') || src.includes('var(--focus-ring'));

// ── Brand colors present ──────────────────────────────────────
console.log('\n\u2500\u2500 Brand palette present \u2500\u2500');
test('Pistons dark blue (#002D62) present', src.includes('#002D62'));
test('Pistons blue (#1D42BA) present', src.includes('#1D42BA'));
test('Pistons red (#C8102E) present', src.includes('#C8102E'));

// ── Total unique hex count (advisory) ─────────────────────────
console.log('\n\u2500\u2500 Hex count advisory \u2500\u2500');
var hexes = src.match(/#[0-9A-Fa-f]{6}/g) || [];
var unique = hexes.filter(function(v, i, a) { return a.indexOf(v) === i; });
console.log('  Unique hex colors: ' + unique.length + ' (' + unique.join(', ') + ')');
test('Unique hex colors <= 15 (tech debt threshold)', unique.length <= 15);

console.log('\n' + '='.repeat(50));
console.log('css-token-hygiene: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
