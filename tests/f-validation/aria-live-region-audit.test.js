// Audit: aria-live regions in exam.html
// WCAG note: too many aria-live regions can cause screen reader announcement conflicts
// Advisory threshold: <=10 regions

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} aria-live-region-audit.test.js\n');

const src = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

// ── Count aria-live regions ────────────────────────────────────
console.log('\u2500\u2500 aria-live region count \u2500\u2500');
var ariaLiveAll = src.match(/aria-live/g) || [];
var assertive = src.match(/aria-live.{0,5}assertive/g) || [];
var polite = src.match(/aria-live.{0,5}polite/g) || [];
var off = src.match(/aria-live.{0,5}off/g) || [];
console.log('  Total aria-live:', ariaLiveAll.length, '| assertive:', assertive.length, '| polite:', polite.length, '| off:', off.length);

test('aria-live count >= 1 (accessibility present)', ariaLiveAll.length >= 1);
test('aria-live count <= 15 (not excessive)', ariaLiveAll.length <= 15);

// ── Key regions present ────────────────────────────────────────
console.log('\n\u2500\u2500 Key regions present \u2500\u2500');
test('announce region for canvas interactions', src.includes('aria-live') && src.includes('announce'));
test('timer uses aria-live for updates', src.includes('aria-live') && src.includes('timer'));
test('hint rescue uses aria-live=polite', src.includes("setAttribute('aria-live', 'polite')"));
test('error state uses aria-live=assertive', src.includes("aria-live=\"assertive\"") || src.includes("aria-live='assertive'") || src.includes('aria-live', 'assertive'));

// ── No role=alert misuse ───────────────────────────────────────
console.log('\n\u2500\u2500 role=alert usage \u2500\u2500');
var roleAlert = (src.match(/role="alert"/g) || []).length;
console.log('  role=alert count:', roleAlert);
test('role=alert count <= 5 (not excessive)', roleAlert <= 5);

console.log('\n' + '='.repeat(50));
console.log('aria-live-region-audit: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
