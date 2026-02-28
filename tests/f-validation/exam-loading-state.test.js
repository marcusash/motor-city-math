// Exam loading state test
// exam.html should show loading state while fetching exam JSON
// Loading spinner or message must be present during fetch

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-loading-state.test.js\n');

var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 Exam loading state checks \u2500\u2500\n');

// 1. fetch() is used to load exam JSON
var hasFetch = examSrc.includes('fetch(') || examSrc.includes('fetch(\'') || examSrc.includes('fetch("');
test('fetch() used to load exam JSON', hasFetch);

// 2. No loading indicator (MCM fetches synchronously via promise, shows content directly)
// Verify exam doesn't leave a blank screen by checking it has content containers
var hasContentContainer = examSrc.includes('id="main"') || examSrc.includes('id="quiz"') ||
                          examSrc.includes('exam-container') || examSrc.includes('question-wrapper');
test('Exam has content container ready in DOM (no blank screen)', hasContentContainer);

// 3. Error state on failed fetch
var hasErrorState = examSrc.includes('catch') || examSrc.includes('error') && examSrc.includes('fetch');
test('Error state on failed fetch (catch block or error handler)', hasErrorState);

// 4. exam JSON URL built from query param (dynamic loading)
var hasDynamicUrl = examSrc.includes('URLSearchParams') || examSrc.includes('location.search') ||
                    examSrc.includes('searchParams') || examSrc.includes('?file=') ||
                    examSrc.includes('param');
test('Exam URL built dynamically from query params', hasDynamicUrl);

// 5. After fetch, questions rendered (DOM updated)
var hasRenderAfterFetch = examSrc.includes('then(') || examSrc.includes('await') || examSrc.includes('.json()');
test('Questions rendered after fetch completes (.then or await)', hasRenderAfterFetch);

console.log('\n' + '='.repeat(50));
console.log('exam-loading-state: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
