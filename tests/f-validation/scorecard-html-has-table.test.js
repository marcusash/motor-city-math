// scorecard-html-has-table test
// scorecard.html must use an HTML table or structured list to display scores
// Screen readers parse tables with proper semantics (th, td, caption)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} scorecard-html-has-table.test.js\n');

var fpath = path.join(__dirname, '../../scorecard.html');
if (!fs.existsSync(fpath)) {
    fpath = path.join(__dirname, '../../scorecard-2.html');
}
if (!fs.existsSync(fpath)) {
    console.log('  ! No scorecard.html or scorecard-2.html found');
    console.log('FAIL'); process.exit(1);
}

var html = fs.readFileSync(fpath, 'utf-8');

var hasTable = /<table/i.test(html) || /<tbody/i.test(html);
var hasTh = /<th[\s>]/i.test(html);
var hasTd = /<td[\s>]/i.test(html);

test('scorecard.html has a <table> element', hasTable);
test('scorecard.html has table headers <th>', hasTh);
test('scorecard.html has table data cells <td>', hasTd);

console.log('\n' + '='.repeat(50));
console.log('scorecard-html-has-table: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
