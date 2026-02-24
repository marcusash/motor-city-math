// rp-key-points-on-curve test
// Graph questions must have key_points that actually lie on the declared function
// Key points off the curve = wrong answer expectations for Kai

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-key-points-on-curve.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var offCurve = [], graphQs = 0;
var TOLERANCE = 0.5; // allow rounding up to 0.5

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).filter(function(q){ return q.graph && q.graph.function; }).forEach(function(q) {
        graphQs++;
        var fn;
        try {
            fn = new Function('x', 'return ' + q.graph.function);
        } catch(e) {
            offCurve.push('rp' + i + ' ' + q.id + ': function parse error: ' + e.message);
            return;
        }
        (q.graph.key_points || []).forEach(function(pt) {
            var x = pt[0], yExpected = pt[1];
            try {
                var yActual = fn(x);
                if (Math.abs(yActual - yExpected) > TOLERANCE) {
                    offCurve.push('rp' + i + ' ' + q.id + ': [' + x + ',' + yExpected + '] f(' + x + ')=' + yActual.toFixed(3));
                }
            } catch(e) {
                offCurve.push('rp' + i + ' ' + q.id + ': eval error at x=' + x);
            }
        });
    });
}

console.log('\u2500\u2500 Key points on curve checks \u2500\u2500\n');
if (offCurve.length) offCurve.forEach(function(v) { console.log('  ! ' + v); });

test('Graph questions checked: ' + graphQs, graphQs >= 22);
test('All key_points lie on their declared function (tolerance 0.5)', offCurve.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-key-points-on-curve: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
