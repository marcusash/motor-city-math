// index.html coach voice test
// Dashboard must use MCM coach voice (encouraging, specific, ADHD-friendly)
// No passive "You scored X" -- active "You got X" or "Kai, you're..."

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} dashboard-coach-voice.test.js\n');

var indexSrc = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf-8');

console.log('\u2500\u2500 Coach voice checks \u2500\u2500\n');

// 1. Active voice encouragement present
var hasActiveVoice = indexSrc.includes('You') || indexSrc.includes('Kai') || 
                     indexSrc.includes("you're") || indexSrc.includes('you got') ||
                     indexSrc.includes("You're") || indexSrc.includes('Keep going');
test('Active coach voice used in dashboard (You/Kai)', hasActiveVoice);

// 2. Basketball emoji or Pistons imagery (MCM brand)
var hasMcmBrand = indexSrc.includes('\u{1F3C0}') || indexSrc.includes('🏀') || 
                  indexSrc.includes('Pistons') || indexSrc.includes('Motor City');
test('MCM brand imagery present (basketball emoji or Pistons)', hasMcmBrand);

// 3. No em-dashes in dashboard text
var hasEmDash = indexSrc.includes('\u2014') || indexSrc.includes('\u2013');
test('No em-dashes in dashboard (MCM voice guide)', !hasEmDash);

// 4. Progress narrative (score story, streak, next step)
var hasNarrative = indexSrc.includes('next') || indexSrc.includes('up next') || 
                   indexSrc.includes('streak') || indexSrc.includes('practice') ||
                   indexSrc.includes('Up Next') || indexSrc.includes('upNext');
test('Progress narrative / up-next section in dashboard', hasNarrative);

console.log('\n' + '='.repeat(50));
console.log('dashboard-coach-voice: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
