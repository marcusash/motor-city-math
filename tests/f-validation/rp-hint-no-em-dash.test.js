// RP hint em-dash test
// Hints must not contain em-dashes (-- or — or –)
// MCM voice guide bans em-dashes; use commas, colons, or periods

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-hint-no-em-dash.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [], totalChecked = 0;
// Em dash patterns: actual em-dash, double hyphen (prose), en-dash
var EM_DASH_PATTERN = /\u2014|\u2013|(?<!\-)-{2,}(?!\>)/; // -- but not --> (HTML comment arrows)

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        var hint = q.hint || '';
        totalChecked++;
        if (EM_DASH_PATTERN.test(hint)) {
            // Skip if in LaTeX (-- in \left--\right or similar math context)
            var hintsWithoutLatex = hint.replace(/\\\(.*?\\\)/g, '').replace(/\$.*?\$/g, '');
            if (EM_DASH_PATTERN.test(hintsWithoutLatex)) {
                violations.push('rp' + i + ' ' + q.id + ': em/en-dash in hint');
            }
        }
    });
}

console.log('\u2500\u2500 Hint em-dash checks \u2500\u2500\n');
console.log('  Hints checked: ' + totalChecked);

if (violations.length) violations.slice(0,5).forEach(function(v) { console.log('  ! ' + v); });
test('No em-dashes or en-dashes in hints (MCM voice guide)', violations.length === 0);
test('At least 165 hints checked', totalChecked >= 165);

console.log('\n' + '='.repeat(50));
console.log('rp-hint-no-em-dash: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
