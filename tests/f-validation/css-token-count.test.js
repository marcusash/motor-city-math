// Advisory audit: CSS custom property count in shared/styles.css
// Advisory threshold: <= 80 tokens (above = cognitive overhead, hard to maintain)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-token-count.test.js\n');

const src = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

// ── Token count ────────────────────────────────────────────────
console.log('\u2500\u2500 CSS custom property count \u2500\u2500');
var tokens = src.match(/--[a-z][a-z0-9-]+\s*:/g) || [];
var unique = tokens.filter(function(v, i, a) { return a.indexOf(v) === i; });
console.log('  Unique CSS tokens: ' + unique.length);
test('CSS token count >= 10 (design system present)', unique.length >= 10);
test('CSS token count <= 80 (manageable threshold)', unique.length <= 80);

// ── Core design system tokens present ─────────────────────────
console.log('\n\u2500\u2500 Core tokens present \u2500\u2500');
test('--bg-page defined', src.includes('--bg-page'));
test('--text-primary defined', src.includes('--text-primary'));
test('--text-secondary defined', src.includes('--text-secondary'));
test('--color-correct defined', src.includes('--color-correct'));
test('--color-incorrect defined', src.includes('--color-incorrect'));

// ── Arena mode (dark theme) tokens ────────────────────────────
console.log('\n\u2500\u2500 Arena mode tokens \u2500\u2500');
test('Dark mode override present', src.includes('.arena-mode') || src.includes('[data-theme'));

console.log('\n' + '='.repeat(50));
console.log('css-token-count: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
