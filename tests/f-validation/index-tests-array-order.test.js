// index.html tests[] array order matches manifest.json test
// Prevents Kai's exam picker from showing tests out-of-order

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} index-tests-array-order.test.js\n');

const indexSrc = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf-8');
const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/manifest.json'), 'utf-8'));

// Extract tests[] array from index.html
var arrStart = indexSrc.indexOf('var tests = [');
test('tests[] array found in index.html', arrStart !== -1);

if (arrStart !== -1) {
    var arrEnd = indexSrc.indexOf('];', arrStart);
    var arrSrc = indexSrc.substring(arrStart, arrEnd + 2);

    // Extract unique ordered ids from tests array (each entry has file: 'exam.html?file=id' or 'file.html')
    var fileMatches = arrSrc.match(/file:\s*['"]([^'"]+)['"]/g) || [];
    var uniqueIds = [];
    var seen = {};
    fileMatches.forEach(function(m) {
        var raw = m.match(/['"]([^'"]+)['"]/)[1];
        // Extract bare ID: from 'exam.html?file=retake-practice-1' -> 'retake-practice-1'
        var id = raw.includes('?file=') ? raw.split('?file=')[1] : raw;
        if (!seen[id]) { seen[id] = true; uniqueIds.push(id); }
    });

    // Separate RP exams from legacy HTML files
    var rpIds = uniqueIds.filter(function(id) { return id.match(/^retake-practice-\d+$/); });
    var legacyIds = uniqueIds.filter(function(id) { return !id.match(/^retake-practice-\d+$/); });

    console.log('\u2500\u2500 tests[] RP IDs \u2500\u2500');
    console.log('  [' + rpIds.join(', ') + ']');
    console.log('\u2500\u2500 tests[] legacy IDs \u2500\u2500');
    console.log('  [' + legacyIds.join(', ') + ']');

    var manifestIds = (manifest.exams || []).map(function(e) { return e.id; });
    console.log('\u2500\u2500 manifest.json IDs \u2500\u2500');
    console.log('  [' + manifestIds.join(', ') + ']');

    test('tests[] RP exam count matches manifest exam count', rpIds.length === manifestIds.length);

    var orderMatch = rpIds.every(function(id, i) { return id === manifestIds[i]; });
    test('tests[] RP order matches manifest.json order', orderMatch);
    if (!orderMatch) {
        rpIds.forEach(function(id, i) {
            if (id !== manifestIds[i]) {
                console.log('  Mismatch at index ' + i + ': tests[]=' + id + ' manifest=' + (manifestIds[i] || 'none'));
            }
        });
    }

    // Check all manifest IDs are in tests[]
    var seenRP = {};
    rpIds.forEach(function(id) { seenRP[id] = true; });
    var missingFromTests = manifestIds.filter(function(id) { return !seenRP[id]; });
    test('All manifest exams present in tests[]', missingFromTests.length === 0);
    if (missingFromTests.length > 0) {
        console.log('  Missing from tests[]: ' + missingFromTests.join(', '));
    }
}

console.log('\n' + '='.repeat(50));
console.log('index-tests-array-order: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
