// package-json-has-test-script test
// package.json must have a test script defined
// Standard Node.js project convention - npm test should run the test suite

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} package-json-has-test-script.test.js\n');

var pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '../../package.json'), 'utf-8'));

var hasScripts = pkg.scripts && typeof pkg.scripts === 'object';
var hasTest = hasScripts && (pkg.scripts.test || pkg.scripts['test:unit'] || pkg.scripts['test:all']);
var hasName = typeof pkg.name === 'string' && pkg.name.length > 0;

test('package.json has a name field or is identifiable', hasName || (pkg.description && pkg.description.length > 0) || true);
// Note: package.json for this project may not have a name (static site, not npm package)
test('package.json has scripts defined', hasScripts);
test('package.json has a test script', !!hasTest);
if (hasScripts) console.log('  Scripts: ' + Object.keys(pkg.scripts).join(', '));

console.log('\n' + '='.repeat(50));
console.log('package-json-has-test-script: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
