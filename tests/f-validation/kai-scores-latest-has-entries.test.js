// kai-scores-latest-has-entries test
// data/kai-scores-latest.json must have at least one score entry
// Score history is required for the dashboard to show progress

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} kai-scores-latest-has-entries.test.js\n');

var fpath = path.join(__dirname, '../../data/kai-scores-latest.json');
if (!fs.existsSync(fpath)) {
    console.log('  ! kai-scores-latest.json not found');
    console.log('FAIL'); process.exit(1);
}

var scores = JSON.parse(fs.readFileSync(fpath, 'utf-8'));
var raw = JSON.stringify(scores);

// Could be array or object with entries
var isArray = Array.isArray(scores);
var isNonEmpty = isArray ? scores.length > 0 : Object.keys(scores).length > 0;
var hasDate = /date|Date|timestamp|created/i.test(raw);

test('kai-scores-latest.json exists and is non-empty', isNonEmpty);
test('Score data contains date/timestamp information', hasDate);
console.log('  Type: ' + (isArray ? 'array(' + scores.length + ')' : 'object'));

console.log('\n' + '='.repeat(50));
console.log('kai-scores-latest-has-entries: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
