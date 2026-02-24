// rp-graph-x-integer-range test
// Graph x-range must have integer values (not floats)
// Float x-ranges produce misaligned grid lines in canvas renderer

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-graph-x-integer-range.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var floatRanges = [];

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        if (!q.graph) return;
        var xr = q.graph.x_range || q.graph.xRange || q.graph.xrange;
        if (!Array.isArray(xr) || xr.length < 2) return;
        xr.forEach(function(v, idx) {
            if (typeof v === 'number' && !Number.isInteger(v)) {
                floatRanges.push('rp' + i + ' ' + q.id + ' x_range[' + idx + ']=' + v + ' (float)');
            }
        });
    });
}

console.log('\u2500\u2500 Graph x-range integer checks \u2500\u2500\n');
if (floatRanges.length) floatRanges.slice(0, 5).forEach(function(v) { console.log('  ! ' + v); });

test('All graph x-range values are integers (' + floatRanges.length + ' violations)', floatRanges.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-graph-x-integer-range: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
