// exam-no-todo-comments test
// exam.html must not contain TODO or FIXME comments in production

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-no-todo-comments.test.js\n');

var html = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

var todoCount = (html.match(/\/\/\s*TODO|\/\*\s*TODO|<!--\s*TODO|\/\/\s*FIXME|<!--\s*FIXME/gi) || []).length;

test('exam.html has no TODO or FIXME comments (found: ' + todoCount + ')', todoCount === 0);

console.log('\n' + '='.repeat(50));
console.log('exam-no-todo-comments: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
