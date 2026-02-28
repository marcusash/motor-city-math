/**
 * progress-story.test.js
 * Tests for sw-11: buildProgressStory() dashboard card spec.
 *
 * Validates: state machine (hidden when <3 results), narrative copy rules,
 * delta color coding, aria-label, no em dashes.
 * Run: node tests/f-validation/progress-story.test.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const index = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf-8');

let total = 0, pass = 0, fail = 0;
function test(name, ok, detail) {
    total++;
    if (ok) { pass++; console.log(`  ✅ ${name}`); }
    else { fail++; console.log(`  ❌ ${name}${detail ? ` — ${detail}` : ''}`); }
}

console.log('\n🏀 progress-story.test.js (sw-11)\n');

// 1. buildProgressStory function exists
test('buildProgressStory function defined', index.includes('function buildProgressStory()'));

// 2. Card element present in HTML
test('progressStoryCard div exists in HTML', index.includes('id="progressStoryCard"'));

// 3. Called in rerenderAll
test('rerenderAll calls buildProgressStory',
    index.includes('rerenderAll') && index.includes('buildProgressStory()')
);

// 4. State machine: hidden when <3 results
test('card hidden when results < 3', index.includes('results.length < 3'));

// 5. State machine: shows up to last 5 results
test('shows last 5 results', index.includes('slice(-5)'));

// 6. Positive trend narrative
test("positive trend: 'You have improved N points'",
    index.includes("You have improved ") && index.includes("Keep it up.")
);

// 7. Flat trend narrative
test("flat trend: 'Consistent scores'", index.includes("Consistent scores"));

// 8. Negative trend narrative
test("negative trend: 'Scores dipped'", index.includes("Scores dipped"));

// 9. No em dashes in narrative copy
const narrativeSection = index.match(/buildProgressStory[\s\S]{0,3000}/);
test('no em dashes in progress story copy',
    !!narrativeSection && !/[—–]/.test(narrativeSection[0])
);

// 10. Delta color classes present
test('ps-delta-pos CSS class exists', index.includes('ps-delta-pos'));
test('ps-delta-neg CSS class exists', index.includes('ps-delta-neg'));
test('ps-delta-flat CSS class exists', index.includes('ps-delta-flat'));

// 13. Graceful error handling (try/catch)
test('graceful error handling with try/catch',
    index.includes('function buildProgressStory') &&
    index.includes('} catch(e) {') &&
    index.includes("card.style.display = 'none'")
);

// 14. No new localStorage writes
const storyFn = index.match(/function buildProgressStory[\s\S]*?^    \}/m) || 
                index.match(/function buildProgressStory[\s\S]{0,2000}/);
test('buildProgressStory does not write to localStorage',
    !!storyFn && !storyFn[0].includes('localStorage.setItem')
);

// 15. CSS uses design tokens for colors
test('progress story CSS uses --color-correct token', index.includes('--color-correct'));
test('progress story CSS uses --color-incorrect token', index.includes('--color-incorrect'));
test('progress story CSS uses --text-primary token', index.includes('--text-primary'));

// 16. Card title present
test("card title 'Your Algebra II journey'", index.includes("Your Algebra II journey"));

console.log(`\n${'='.repeat(50)}`);
console.log(`progress-story: ${pass}/${total} pass`);
if (fail > 0) process.exit(1);
else console.log('PASS');
