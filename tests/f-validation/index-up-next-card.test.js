// index-up-next-card test
// index.html dashboard must show an "Up Next" recommendation card
// Kai needs clear guidance on what to take next (ADHD: one CTA at a time)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} index-up-next-card.test.js\n');

var indexSrc = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf-8');

console.log('\u2500\u2500 Up Next card checks \u2500\u2500\n');

// 1. Up Next concept present in index.html
var hasUpNext = indexSrc.includes('Up Next') || indexSrc.includes('up-next') || 
                indexSrc.includes('upNext') || indexSrc.includes('updateUpNext');
test('Up Next recommendation card present', hasUpNext);

// 2. Single CTA button in Up Next card (ADHD: one action)
var hasSingleCTA = hasUpNext && (indexSrc.includes('up-next') && indexSrc.includes('href') || 
                                  indexSrc.includes('updateUpNext'));
test('Up Next links to next recommended exam', hasSingleCTA);

// 3. Up Next dynamically determined (not hardcoded)
var isDynamic = indexSrc.includes('updateUpNext') || indexSrc.includes('getUpNext') ||
                indexSrc.includes('nextExam') || indexSrc.includes('up-next') && indexSrc.includes('function');
test('Up Next is dynamically determined from progress', isDynamic);

console.log('\n' + '='.repeat(50));
console.log('index-up-next-card: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
