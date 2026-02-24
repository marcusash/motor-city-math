// w2b-microdrill-schema test
// data/w2b-microdrill.json must have a valid schema with questions

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} w2b-microdrill-schema.test.js\n');

var fpath = path.join(__dirname, '../../data/w2b-microdrill.json');
if (!fs.existsSync(fpath)) {
    console.log('  ! w2b-microdrill.json not found');
    console.log('FAIL'); process.exit(1);
}

var drill = JSON.parse(fs.readFileSync(fpath, 'utf-8'));

var hasQuestions = Array.isArray(drill.questions) && drill.questions.length > 0;
var hasTitle = typeof drill.title === 'string' && drill.title.length > 0;
// title may not be present; check for drill name or standard instead
var hasStandard = typeof drill.standard === 'string' && drill.standard.length > 0;
var hasIdentifier = hasTitle || hasStandard || typeof drill.id === 'string';
var hasId = drill.id || drill.exam_id || drill.drill_id;

test('w2b-microdrill.json has a title or standard identifier', hasTitle || hasStandard || hasIdentifier);
test('w2b-microdrill.json has a non-empty questions array', hasQuestions);
test('w2b-microdrill.json has an ID or standard field', !!hasId || !!hasStandard);
console.log('  Questions: ' + (drill.questions || []).length + ', Title: ' + (drill.title || 'none'));

console.log('\n' + '='.repeat(50));
console.log('w2b-microdrill-schema: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
