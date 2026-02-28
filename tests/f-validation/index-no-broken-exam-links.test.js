// index-no-broken-exam-links test
// index.html exam links must reference files that exist in the data/ directory

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} index-no-broken-exam-links.test.js\n');

var html = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf-8');
var dataDir = path.join(__dirname, '../../data');

// Extract file= references from exam links
var refs = [];
var re = /file=([a-zA-Z0-9_-]+)/g;
var m;
while ((m = re.exec(html)) !== null) {
    refs.push(m[1]);
}

var violations = [];
refs.forEach(function(ref) {
    var f = path.join(dataDir, ref + '.json');
    if (!fs.existsSync(f)) {
        violations.push('file=' + ref + ' -> data/' + ref + '.json not found');
    }
});

test('All exam file= references exist in data/ (' + violations.length + ' broken)', violations.length === 0);
if (violations.length) violations.forEach(function(v) { console.log('    ! ' + v); });
console.log('  Total links checked: ' + refs.length);

console.log('\n' + '='.repeat(50));
console.log('index-no-broken-exam-links: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
