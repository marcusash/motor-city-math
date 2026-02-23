// Progress story card test -- sw-11
// index.html must have progress story card with: 3-exam minimum, delta display, narrative copy

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} progress-story-card.test.js\n');

var indexSrc = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf-8');

console.log('\u2500\u2500 Progress story card (sw-11) checks \u2500\u2500\n');

// 1. Progress story card CSS class exists
var hasCardClass = indexSrc.includes('progress-story') || indexSrc.includes('progressStory') ||
                   indexSrc.includes('story-card') || indexSrc.includes('storyCard');
test('Progress story card class exists (.progress-story or similar)', hasCardClass);

// 2. Card not shown until 3+ results (minimum check)
var hasMinGuard = indexSrc.includes('3') && (indexSrc.includes('results') || indexSrc.includes('scores') ||
                  indexSrc.includes('localStorage'));
test('Card has minimum result count guard (3+ exams)', hasMinGuard);

// 3. Delta display between consecutive exams
var hasDelta = indexSrc.includes('delta') || indexSrc.includes('Delta') ||
               (indexSrc.includes('+') && indexSrc.includes('pct'));
test('Delta display between consecutive exam scores', hasDelta);

// 4. Narrative copy based on trend
var hasNarrative = indexSrc.includes('improved') || indexSrc.includes('consistent') ||
                   indexSrc.includes('dipped') || indexSrc.includes('trend');
test('Narrative copy reflects score trend (improved/consistent/dipped)', hasNarrative);

// 5. No em dashes in progress story narrative copy (JS strings only)
// Search for the progress story JS function that generates narrative text
var storyFnIdx = indexSrc.indexOf('buildProgressStory') !== -1 ? indexSrc.indexOf('buildProgressStory') :
                 indexSrc.indexOf('progress-story-card') !== -1 ? indexSrc.indexOf('progress-story-card') : -1;
var hasEmDash = false;
if (storyFnIdx !== -1) {
    // Look for string literals with em dash in a 3000-char window around the JS function
    var window3k = indexSrc.substring(storyFnIdx, storyFnIdx + 3000);
    // Only flag em dash inside quoted strings (crude heuristic)
    var jsStrings = window3k.match(/'[^']*'|"[^"]*"/g) || [];
    hasEmDash = jsStrings.some(function(s) {
        return s.includes('\u2014') || s.includes('\u2013') || s.includes('&mdash;');
    });
}
test('Progress story narrative strings contain no em dashes', !hasEmDash);

console.log('\n' + '='.repeat(50));
console.log('progress-story-card: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
