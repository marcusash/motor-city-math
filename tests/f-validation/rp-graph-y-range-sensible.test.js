// rp-graph-y-range-sensible test
// Graph y-range should span at least 4 units and at most 40 units
// Too narrow = graph doesn't show key behavior; too wide = function invisible

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-graph-y-range-sensible.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var MIN_SPAN = 4, MAX_SPAN = 40;
var badRanges = [];

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        if (!q.graph) return;
        var yr = q.graph.y_range || q.graph.yRange || q.graph.yrange;
        if (!Array.isArray(yr) || yr.length < 2) return;
        var span = yr[1] - yr[0];
        if (span < MIN_SPAN || span > MAX_SPAN) {
            badRanges.push('rp' + i + ' ' + q.id + ': y-range span=' + span + ' [' + yr[0] + ',' + yr[1] + ']');
        }
    });
}

console.log('\u2500\u2500 Graph y-range span checks (' + MIN_SPAN + '-' + MAX_SPAN + ') \u2500\u2500\n');
if (badRanges.length) badRanges.slice(0, 5).forEach(function(v) { console.log('  ! ' + v); });

test('All graph y-ranges span ' + MIN_SPAN + '-' + MAX_SPAN + ' units (' + badRanges.length + ' violations)', badRanges.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-graph-y-range-sensible: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
