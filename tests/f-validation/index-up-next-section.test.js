// index-up-next-section test
// index.html must have a hero/up-next section (ADHD: clear single CTA on dashboard)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} index-up-next-section.test.js\n');

var f = path.join(__dirname, '../../index.html');
var html = fs.readFileSync(f, 'utf-8');

console.log('\u2500\u2500 Up Next hero section checks \u2500\u2500\n');

test('index.html has hero/Up Next section', html.includes('hero') && (html.includes('Up Next') || html.includes('upNext')));
test('index.html has upNextInfo element', html.includes('upNextInfo'));
test('index.html has single primary CTA button for starting practice', /class\s*=\s*["'][^"']*primary[^"']*["']/.test(html));

console.log('\n' + '='.repeat(50));
console.log('index-up-next-section: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
