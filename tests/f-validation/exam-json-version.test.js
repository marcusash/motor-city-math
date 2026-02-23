// Static test: all RP1-11 JSONs have version field = string "2.0"
// Normalization commit: 59592bc

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-json-version.test.js\n');

const dataDir = path.join(__dirname, '../../data');

console.log('\u2500\u2500 Version field normalization (RP1-11) \u2500\u2500');
var allPass = true;
for (var n = 1; n <= 11; n++) {
    var file = 'retake-practice-' + n + '.json';
    try {
        var data = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf-8'));
        var ok = data.version === '2.0';
        test('RP' + n + ' version === "2.0"', ok);
        if (!ok) allPass = false;
    } catch(e) {
        test('RP' + n + ' file readable', false);
        allPass = false;
    }
}

// ── Type check: must be string, not number ─────────────────────
console.log('\n\u2500\u2500 Type check: string not number \u2500\u2500');
var data1 = JSON.parse(fs.readFileSync(path.join(dataDir, 'retake-practice-1.json'), 'utf-8'));
test('version is string type', typeof data1.version === 'string');
test('version is not number type', typeof data1.version !== 'number');

console.log('\n' + '='.repeat(50));
console.log('exam-json-version: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
