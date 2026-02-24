// rp-no-html-entities-in-hint test
// Hints must use actual characters, not HTML entities like &amp;, &lt;, &gt;
// JSON strings don't need HTML escaping -- entities indicate a copy-paste error

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-no-html-entities-in-hint.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [];
var ENTITY = /&amp;|&lt;|&gt;|&nbsp;|&quot;|&#\d+;/;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        if (q.hint && ENTITY.test(q.hint)) {
            violations.push(q.id + ': hint contains HTML entity: "' + q.hint.substring(0, 60) + '"');
        }
    });
}

test('No hints contain HTML entities (' + violations.length + ' violations)', violations.length === 0);
if (violations.length) violations.forEach(function(v) { console.log('    ! ' + v); });

console.log('\n' + '='.repeat(50));
console.log('rp-no-html-entities-in-hint: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
