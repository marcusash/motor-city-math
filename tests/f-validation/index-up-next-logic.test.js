// Static analysis: verify buildStudyNext() edge case logic in index.html
// Checks: empty/null fallback, all-passed fallback, pct thresholds, max-3 cap

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} index-up-next-logic.test.js\n');

const src = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf-8');
const start = src.indexOf('function buildStudyNext(stdResult)');
test('buildStudyNext exists', start !== -1);
const fn = start !== -1 ? src.substring(start, start + 1500) : '';

// ── Empty / null guard ─────────────────────────────────────────
console.log('\u2500\u2500 Null/empty guard \u2500\u2500');
test('null stdResult guard', fn.includes('!stdResult'));
test('missing keys guard', fn.includes('!stdResult.keys'));
test('empty keys guard', fn.includes('stdResult.keys.length === 0'));
test('empty fallback text contains start message', fn.includes("highlights reel starts with test #1"));

// ── All-passed fallback ────────────────────────────────────────
console.log('\n\u2500\u2500 All-passed fallback \u2500\u2500');
test('all-passed message present', fn.includes('All standards') && fn.includes('looking strong'));

// ── Per-item logic ─────────────────────────────────────────────
console.log('\n\u2500\u2500 Per-item logic \u2500\u2500');
test('skips zero-total items', fn.includes('if (s.total === 0) return'));
test('pct formula is correct', fn.includes('Math.round((s.correct / s.total) * 100)'));

// Exercise the current text actions instead of retired decorative emoji.
const vm = require('node:vm');
const end = src.indexOf('    /* ========== TEST INDEX', start);
if (start < 0 || end <= start) throw new Error('Study-next renderer boundaries missing');
for (const [correct, expected] of [[0, 'Start here.'], [69, 'Start here.'],
    [70, 'Almost there.'], [89, 'Almost there.'], [90, 'Review only.'], [100, 'Review only.']]) {
    const target = {};
    const context = { document: { getElementById: () => target } };
    vm.runInNewContext(src.slice(start, end), context);
    context.buildStudyNext({ keys: ['S1'], data: { S1: { correct, total: 100 } } });
    test(correct + '% renders ' + expected, target.innerHTML.includes(expected));
}

// ── Threshold action labels ────────────────────────────────────
console.log('\n\u2500\u2500 Threshold action labels \u2500\u2500');
test('low action: Start here.', fn.includes('Start here.'));
test('mid action: Almost there.', fn.includes('Almost there.'));
test('high action: Review only.', fn.includes('Review only.'));

// ── Max-3 cap ──────────────────────────────────────────────────
console.log('\n\u2500\u2500 Max-3 cap \u2500\u2500');
test('count variable initialized to 0', fn.includes('var count = 0'));
test('cap guard: count >= 3 return', fn.includes('if (count >= 3) return'));

// ── studyList target ───────────────────────────────────────────
console.log('\n\u2500\u2500 DOM target \u2500\u2500');
test('renders into #studyList', fn.includes("getElementById('studyList')"));

console.log('\n' + '='.repeat(50));
console.log('index-up-next-logic: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
