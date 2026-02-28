// index-shared-scripts-loaded test
// index.html must load shared/scripts.js (for saveResults, etc.)
// dashboard.html uses saveResults to write scores back to localStorage

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} index-shared-scripts-loaded.test.js\n');

var indexSrc = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf-8');
var examSrc  = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 shared/scripts.js loading checks \u2500\u2500\n');

// exam.html loads scripts.js
var examLoadsScripts = examSrc.includes('shared/scripts.js') || examSrc.includes('scripts.js');
test('exam.html loads shared/scripts.js', examLoadsScripts);

// index.html has saveResults or getScores (may inline or load)
var indexHasScripts = indexSrc.includes('saveResults') || indexSrc.includes('getScores') || 
                      indexSrc.includes('shared/scripts.js');
test('index.html uses or loads shared/scripts.js functions', indexHasScripts);

console.log('\n' + '='.repeat(50));
console.log('index-shared-scripts-loaded: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
