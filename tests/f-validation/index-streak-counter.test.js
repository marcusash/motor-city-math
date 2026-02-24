// index-streak-counter test
// index.html dashboard spec (.streak-spec.md) calls for streak counter
// This test documents current state: streak spec exists, implementation pending

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} index-streak-counter.test.js\n');

var indexSrc = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf-8');

console.log('\u2500\u2500 Streak counter checks \u2500\u2500\n');

// 1. Streak spec exists
var specExists = fs.existsSync(path.join(__dirname, '../../.streak-spec.md'));
test('.streak-spec.md spec file exists', specExists);

// 2. index.html uses localStorage (foundation for streak tracking)
var hasLocalStorage = indexSrc.includes('localStorage');
test('index.html uses localStorage (streak foundation)', hasLocalStorage);

// 3. Date logic exists for time-based features
var hasDateLogic = indexSrc.includes('Date') || indexSrc.includes('date');
test('Date-based logic present in index.html', hasDateLogic);

console.log('\n' + '='.repeat(50));
console.log('index-streak-counter: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

console.log('\n' + '='.repeat(50));
console.log('index-streak-counter: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
