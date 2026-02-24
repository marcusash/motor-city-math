// shared-scripts-init-timer-exists test
// shared/scripts.js must export an initTimer function
// Timer is used in all exams for session timing

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} shared-scripts-init-timer-exists.test.js\n');

var js = fs.readFileSync(path.join(__dirname, '../../shared/scripts.js'), 'utf-8');

var hasInitTimer = /function\s+initTimer\s*\(/.test(js) || /const\s+initTimer\s*=/.test(js) || /var\s+initTimer\s*=/.test(js);
var hasFormatTime = /function\s+formatTime\s*\(/.test(js) || /const\s+formatTime\s*=/.test(js) || /var\s+formatTime\s*=/.test(js);

test('shared/scripts.js has initTimer function', hasInitTimer);
test('shared/scripts.js has formatTime function', hasFormatTime);

console.log('\n' + '='.repeat(50));
console.log('shared-scripts-init-timer-exists: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
