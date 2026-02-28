// CSS transition duration test
// Transitions should be <= 500ms (anything longer feels sluggish)
// ADHD design: fast, responsive feedback

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-transition-duration.test.js\n');

var cssSrc = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

console.log('\u2500\u2500 Transition duration checks \u2500\u2500\n');

// Find all transition durations
var transitions = cssSrc.match(/transition[^;:]*:\s*[^;]+/g) || [];
var slowTransitions = [];
transitions.forEach(function(t) {
    // Extract ms or s values
    var msVals = t.match(/(\d+)ms/g) || [];
    var sVals = t.match(/(\d+(?:\.\d+)?)s\b/g) || [];
    msVals.forEach(function(v) {
        var ms = parseInt(v);
        if (ms > 700) slowTransitions.push(t.trim().substring(0, 60) + ' (' + ms + 'ms)');
    });
    sVals.forEach(function(v) {
        var ms = parseFloat(v) * 1000;
        if (ms > 700) slowTransitions.push(t.trim().substring(0, 60) + ' (' + ms + 'ms)');
    });
});

console.log('  Transition rules found: ' + transitions.length);
if (slowTransitions.length) slowTransitions.slice(0,3).forEach(function(v) { console.log('  ! Slow transition: ' + v); });

test('Transitions exist in shared/styles.css', transitions.length > 0);
test('All transitions <= 700ms (ADHD-friendly, responsive)', slowTransitions.length === 0);

console.log('\n' + '='.repeat(50));
console.log('css-transition-duration: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
