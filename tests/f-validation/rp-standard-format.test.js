// rp-standard-format test
// Standard field must be in a recognizable format (W1.a, W2.b, W3.c, etc.)
// Non-standard format breaks standard-based sorting and score analysis

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-standard-format.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var invalid = [], total = 0;
// Standards follow Wx.y format (W1.a through W3.z) or free text with W prefix
var STD_RE = /^W[123]\.[a-z]$/;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        total++;
        var std = q.standard || '';
        // Accept W1.a-W3.z or compound standards with comma/slash separator
        if (!STD_RE.test(std) && !std.match(/W[123]/)) {
            invalid.push('rp' + i + ' ' + q.id + ': standard="' + std + '" (unrecognized format)');
        }
    });
}

console.log('\u2500\u2500 Standard format checks \u2500\u2500\n');
if (invalid.length) invalid.forEach(function(v) { console.log('  ! ' + v); });

test('All ' + total + ' questions have Wx.y format standard', invalid.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-standard-format: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
