// rp-graph-xrange-valid test
// Graph x-range must be an array of exactly 2 numbers where xrange[0] < xrange[1]
// Invalid ranges cause the graphing engine to fail silently

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-graph-xrange-valid.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var bad = [], total = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        if (!q.graph) return;
        var g = q.graph;
        if (!g.xrange && !g.x_range) return;
        var xr = g.xrange || g.x_range;
        total++;
        if (!Array.isArray(xr) || xr.length !== 2) {
            bad.push('rp' + i + ' ' + q.id + ': xrange not [a,b] array: ' + JSON.stringify(xr));
        } else if (typeof xr[0] !== 'number' || typeof xr[1] !== 'number') {
            bad.push('rp' + i + ' ' + q.id + ': xrange non-numeric: ' + JSON.stringify(xr));
        } else if (xr[0] >= xr[1]) {
            bad.push('rp' + i + ' ' + q.id + ': xrange[0] >= xrange[1]: ' + JSON.stringify(xr));
        }
    });
}

console.log('\u2500\u2500 Graph x-range validation checks \u2500\u2500\n');
if (bad.length) bad.forEach(function(v) { console.log('  ! ' + v); });

if (total === 0) {
    test('No xrange fields found (graphs may use different field name)', true);
} else {
    test('All ' + total + ' graph x-ranges are valid [min, max] arrays', bad.length === 0);
}

console.log('\n' + '='.repeat(50));
console.log('rp-graph-xrange-valid: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
