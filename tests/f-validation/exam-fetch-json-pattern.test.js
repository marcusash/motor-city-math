// exam-fetch-json-pattern test
// exam.html must use fetch() to load exam JSON dynamically
// Static import or inline data would break multi-exam support

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-fetch-json-pattern.test.js\n');

var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 fetch() JSON loading checks \u2500\u2500\n');

// fetch() used
var hasFetch = examSrc.includes('fetch(');
test('fetch() used to load exam JSON', hasFetch);

// .json() called on response
var hasJsonParse = examSrc.includes('.json()') || examSrc.includes('JSON.parse');
test('.json() or JSON.parse used to parse response', hasJsonParse);

// Error handling on fetch
var hasFetchError = (examSrc.includes('.catch(') || examSrc.includes('catch (') || 
                     examSrc.includes('catch(')) && examSrc.includes('fetch(');
test('fetch() has error handling (.catch or try/catch)', hasFetchError);

console.log('\n' + '='.repeat(50));
console.log('exam-fetch-json-pattern: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
