// exam-no-duplicate-input-ids test
// All input id attributes in exam.html template must be unique (or use dynamic ids)
// Duplicate HTML input IDs break label associations and JavaScript selectors

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-no-duplicate-input-ids.test.js\n');

var html = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

// Extract static id= attributes (not template literals or JS)
var staticIds = [];
var idMatches = html.match(/\bid\s*=\s*["'][^"']+["']/g) || [];
idMatches.forEach(function(m) {
    var id = m.match(/["']([^"']+)["']/)[1];
    // Skip dynamic ids (containing ${} or ending with - implying suffix)
    if (id.indexOf('${') !== -1) return;
    if (/[-_]$/.test(id)) return; // template id prefix ending with separator
    staticIds.push(id);
});

var counts = {};
staticIds.forEach(function(id) { counts[id] = (counts[id] || 0) + 1; });
var duplicates = Object.keys(counts).filter(function(id) { return counts[id] > 1; });

test('No duplicate static element IDs in exam.html (' + duplicates.length + ' duplicates)', duplicates.length === 0);
if (duplicates.length) duplicates.slice(0, 5).forEach(function(d) { console.log('    ! id="' + d + '" appears ' + counts[d] + 'x'); });

console.log('\n' + '='.repeat(50));
console.log('exam-no-duplicate-input-ids: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
