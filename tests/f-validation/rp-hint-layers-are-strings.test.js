// rp-hint-layers-are-strings test
// All hint layers (layer1, layer2, layer3) must be non-empty strings
// Null or empty hint layers show blank content when Kai taps the hint button

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-hint-layers-are-strings.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var invalid = [], totalLayers = 0;
var LAYERS = ['layer1', 'layer2', 'layer3'];

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        if (!q.hint) return;
        LAYERS.forEach(function(layer) {
            var val = q.hint[layer];
            if (val === undefined) return; // optional layers are OK
            totalLayers++;
            if (typeof val !== 'string' || val.trim().length === 0) {
                invalid.push('rp' + i + ' ' + q.id + '.' + layer + ': ' + JSON.stringify(val));
            }
        });
    });
}

console.log('\u2500\u2500 Hint layer string checks \u2500\u2500\n');
if (invalid.length) invalid.forEach(function(v) { console.log('  ! ' + v); });

test('All ' + totalLayers + ' present hint layers are non-empty strings', invalid.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-hint-layers-are-strings: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
