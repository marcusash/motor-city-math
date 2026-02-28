// index-welcome-message test
// index.html dashboard must display a welcome/greeting message for Kai
// Personalized greeting = ADHD warm start, reduces anxiety before exam

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} index-welcome-message.test.js\n');

var indexSrc = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf-8');

console.log('\u2500\u2500 Welcome message checks \u2500\u2500\n');

// 1. Kai's name or greeting present
var hasGreeting = indexSrc.includes('Kai') || indexSrc.includes('Motor City') || 
                  indexSrc.includes('Welcome') || indexSrc.includes('Hey');
test('Personalized greeting or name present in index.html', hasGreeting);

// 2. Dashboard has h1 or heading
var hasHeading = indexSrc.includes('<h1') || indexSrc.includes('<h2');
test('Dashboard heading (h1/h2) present', hasHeading);

console.log('\n' + '='.repeat(50));
console.log('index-welcome-message: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
