// index-no-broken-script-refs test
// All script src= references in index.html must point to files that exist
// Broken script refs cause silent JS errors

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} index-no-broken-script-refs.test.js\n');

var html = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf-8');
var root = path.join(__dirname, '../../');
var violations = [];

var srcMatches = html.match(/<script[^>]+src\s*=\s*["']([^"']+)["']/g) || [];
srcMatches.forEach(function(tag) {
    var m = tag.match(/src\s*=\s*["']([^"']+)["']/);
    if (!m) return;
    var src = m[1];
    // Skip external URLs
    if (/^https?:\/\//.test(src)) return;
    var resolved = path.resolve(root, src);
    if (!fs.existsSync(resolved)) {
        violations.push(src + ' -- file not found');
    }
});

test('All local script src= references exist (' + violations.length + ' broken)', violations.length === 0);
if (violations.length) violations.forEach(function(v) { console.log('    ! ' + v); });

console.log('\n' + '='.repeat(50));
console.log('index-no-broken-script-refs: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
