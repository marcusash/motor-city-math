// exam-shared-scripts-loaded test
// exam.html must load shared/scripts.js for timer and save functionality
// Without it, initTimer() and saveResults() are undefined

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-shared-scripts-loaded.test.js\n');

var html = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

var hasSharedScripts = /shared\/scripts\.js/.test(html);
var hasSharedStyles  = /shared\/styles\.css/.test(html);

test('exam.html loads shared/scripts.js', hasSharedScripts);
test('exam.html loads shared/styles.css', hasSharedStyles);
if (!hasSharedScripts) console.log('    ! shared/scripts.js not loaded -- timer and save will fail');

console.log('\n' + '='.repeat(50));
console.log('exam-shared-scripts-loaded: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
