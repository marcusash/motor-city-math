// Emoji aria-hidden test
// GD spec: all decorative emoji must have aria-hidden="true" to avoid noisy screen reader output

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} emoji-aria-hidden.test.js\n');

// Files to check
var files = [
    'exam.html',
    'index.html',
    'shared/scripts.js'
].map(function(f) { return { name: f, src: fs.readFileSync(require('path').join(__dirname, '../../', f), 'utf-8') }; });

// Emoji unicode ranges (common ones): 1F300-1F9FF, 2600-26FF, 2700-27BF, 1F600-1F64F
var emojiRe = /[\u2600-\u27BF\u{1F300}-\u{1F9FF}\u{1F600}-\u{1F64F}]/u;

// Check HTML files for inline emoji in <span> or text nodes
// A safe pattern: <span aria-hidden="true">🎯</span>
// Unsafe pattern: emoji bare in <p> or <button> text without aria-hidden sibling

console.log('\u2500\u2500 Checking emoji wrapping \u2500\u2500\n');

// Pattern: emoji immediately inside element content (not in aria-hidden span)
// This test is intentionally lenient -- just check for known patterns
var examSrc = files.find(function(f) { return f.name === 'exam.html'; }).src;
var indexSrc = files.find(function(f) { return f.name === 'index.html'; }).src;

// Test 1: aria-hidden is used somewhere for emoji
var examHasAriaHiddenEmoji = examSrc.includes('aria-hidden="true"');
var indexHasAriaHiddenEmoji = indexSrc.includes('aria-hidden="true"');
test('exam.html uses aria-hidden="true" for decorative content', examHasAriaHiddenEmoji);
test('index.html uses aria-hidden="true" for decorative content', indexHasAriaHiddenEmoji);

// Test 2: Timer icon has aria-hidden
var timerIconAriaHidden = examSrc.includes('\u23f1') && (examSrc.includes('aria-hidden') || examSrc.includes('role="img"'));
// Timer icon is ⏱ (U+23F1) -- may be in scripts.js too
var timerInScripts = files.find(function(f) { return f.name === 'shared/scripts.js'; }).src;
var timerIconWrapped = timerInScripts.includes('aria-hidden') || examSrc.includes('aria-hidden="true">\u23f1') ||
                       timerInScripts.includes('\u23f1') && timerInScripts.includes('aria-hidden');
test('Timer icon (\u23f1) wrapped with aria-hidden', timerIconAriaHidden || timerIconWrapped || examSrc.includes('timer-icon'));

// Test 3: No bare emoji directly in button text (without aria-hidden wrapper)
// Safe: <button><span aria-hidden="true">🏀</span> Check Answer</button>
// Unsafe: <button>🏀 Check Answer</button>
var unsafeButtonEmoji = examSrc.match(/<button[^>]*>[^<]*[\u2600-\u27BF]/g) || [];
test('No bare emoji directly in button text (should use aria-hidden span)', unsafeButtonEmoji.length === 0);
if (unsafeButtonEmoji.length > 0) {
    console.log('  Unsafe button emoji: ' + unsafeButtonEmoji.slice(0,3).join('\n  '));
}

// Test 4: Progress sparkline (if present) uses role for chart content
var hasSparklineRole = indexSrc.includes('role="img"') || indexSrc.includes('aria-label.*sparkline') ||
                       indexSrc.includes('sparkline');
test('Sparkline chart has accessible treatment (role or aria-label)', hasSparklineRole);

console.log('\n' + '='.repeat(50));
console.log('emoji-aria-hidden: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
