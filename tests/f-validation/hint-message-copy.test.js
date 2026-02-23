// Static analysis: scheduleRescue transitional message copy quality
// Checks: no em dash, ADHD word count (<= 12), aria-live=polite, double-hyphen format

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} hint-message-copy.test.js\n');

const src = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');
const start = src.indexOf('scheduleRescue(qId, fbEl)');
test('scheduleRescue exists', start !== -1);
const fn = start !== -1 ? src.substring(start, start + 1200) : '';

// Extract the textContent assignment
const msgMatch = fn.match(/msgEl\.textContent\s*=\s*'([^']+)'/);
const msgText = msgMatch ? msgMatch[1] : '';
test('transitional message text found', msgText.length > 0);

// ── No em dash ────────────────────────────────────────────────
console.log('\u2500\u2500 Em dash ban (MCM rule) \u2500\u2500');
test('no em dash (U+2014) in message', !msgText.includes('\u2014'));
test('no en dash (U+2013) in message', !msgText.includes('\u2013'));

// ── ADHD: word count <= 12 ────────────────────────────────────
console.log('\n\u2500\u2500 ADHD word count \u2500\u2500');
var wordCount = msgText.trim().split(/\s+/).length;
console.log('  (word count: ' + wordCount + ')');
test('message is <= 12 words (ADHD rule)', wordCount <= 12);
test('message is not empty', wordCount > 0);

// ── aria-live=polite on transitional message ──────────────────
console.log('\n\u2500\u2500 Accessibility \u2500\u2500');
test('transitional message aria-live is polite', fn.includes("setAttribute('aria-live', 'polite')"));
test('msgEl is a <p> element', fn.includes("createElement('p')"));

// ── Double-hyphen usage (not em dash) ─────────────────────────
console.log('\n\u2500\u2500 Punctuation style \u2500\u2500');
// MCM uses -- as a casual pause marker (acceptable), not em dash
// Just verify the text is clean
test('message does not contain literal em dash character', !msgText.includes('\u2014'));
test('message contains expected cue word (try/here/direction/hint)', /try|here|direction|hint/i.test(msgText));

// ── rescue-msg element id ──────────────────────────────────────
console.log('\n\u2500\u2500 Element ID pattern \u2500\u2500');
test('rescue-msg-{qId} id assigned', fn.includes("'rescue-msg-' + qId"));
test('duplicate message guard present', fn.includes("if (document.getElementById('rescue-msg-' + qId)) return"));

console.log('\n' + '='.repeat(50));
console.log('hint-message-copy: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
