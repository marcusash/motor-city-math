// kai-profile-has-weaknesses test
// data/kai-profile.json must have known_weaknesses array with at least 1 entry
// The study tool is built around Kai's specific weak points

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} kai-profile-has-weaknesses.test.js\n');

var profile = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/kai-profile.json'), 'utf-8'));

var hasWeaknesses = Array.isArray(profile.known_weaknesses) && profile.known_weaknesses.length > 0;
var hasStrengths = Array.isArray(profile.strengths) || typeof profile.strengths === 'object';
var hasName = typeof profile.name === 'string' && profile.name.length > 0;

test('kai-profile.json has a name', hasName);
test('known_weaknesses is a non-empty array', hasWeaknesses);
test('strengths field is present', hasStrengths || profile.strengths !== undefined);
console.log('  Name: ' + profile.name + ', Weaknesses: ' + (profile.known_weaknesses || []).length);

console.log('\n' + '='.repeat(50));
console.log('kai-profile-has-weaknesses: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
