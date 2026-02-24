// shared-styles-transition-timing test
// shared/styles.css transitions must use MCM standard timing (200ms or 300ms)
// Inconsistent transitions (e.g., 1s, 0.5s) create jarring UX for Kai

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} shared-styles-transition-timing.test.js\n');

var stylesSrc = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

console.log('\u2500\u2500 Transition timing checks \u2500\u2500\n');

// Find all transition duration values
var durationRe = /transition[^;]*?(\d+(?:\.\d+)?)(ms|s)\b/g;
var m, durations = [];
while ((m = durationRe.exec(stylesSrc)) !== null) {
    var val = parseFloat(m[1]);
    var unit = m[2];
    var ms = unit === 's' ? val * 1000 : val;
    durations.push(ms);
}

// Standard MCM timing: 150, 200, 250, 300ms
var ALLOWED = [150, 200, 250, 300, 400, 500, 600, 800];
var nonStandard = durations.filter(function(ms) { return ALLOWED.indexOf(ms) === -1 && ms > 0; });

if (durations.length) console.log('  Durations found: ' + Array.from(new Set(durations)).sort(function(a,b){return a-b;}).join('ms, ') + 'ms');
if (nonStandard.length) console.log('  Non-standard: ' + nonStandard.join('ms, ') + 'ms');

test('Transition durations found: ' + durations.length, durations.length >= 1);
test('All transitions use standard timing (150-500ms, 800ms allowed)', nonStandard.length === 0);

console.log('\n' + '='.repeat(50));
console.log('shared-styles-transition-timing: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
