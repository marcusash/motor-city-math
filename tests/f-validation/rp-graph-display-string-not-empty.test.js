// rp-graph-display-string-not-empty test
// Every graph question must have a non-empty function_display string
// function_display is the human-readable math shown to Kai (e.g., "f(x) = 2^x + 1")

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-graph-display-string-not-empty.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var empty = [], total = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        if (!q.graph) return;
        total++;
        var disp = q.graph.function_display;
        if (!disp || typeof disp !== 'string' || disp.trim().length === 0) {
            empty.push('rp' + i + ' ' + q.id + ': function_display is ' + JSON.stringify(disp));
        }
    });
}

console.log('\u2500\u2500 Graph function_display checks \u2500\u2500\n');
if (empty.length) empty.forEach(function(v) { console.log('  ! ' + v); });

test('All ' + total + ' graph questions have non-empty function_display', empty.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-graph-display-string-not-empty: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
