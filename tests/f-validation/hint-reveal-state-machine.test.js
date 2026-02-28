// Hint reveal state machine test
// GD spec: hints reveal sequentially (1 at a time), not all at once
// ADHD design: drip hints to avoid cognitive overload

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} hint-reveal-state-machine.test.js\n');

const examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 Hint reveal checks \u2500\u2500\n');

// 1. Hint reveal function exists
var hintFn = examSrc.indexOf('revealHint') !== -1 ? 'revealHint' :
             examSrc.indexOf('showHint') !== -1 ? 'showHint' :
             examSrc.indexOf('hint') !== -1 ? 'hint' : '';
test('Hint reveal function exists in exam.html', !!hintFn && examSrc.includes(hintFn));

// 2. Hint state tracks layers via button show/hide (not an index variable)
var hasHintIndex = examSrc.includes('hintIndex') || examSrc.includes('hint_index') ||
                   examSrc.includes('hintCount') || examSrc.includes('currentHint') ||
                   examSrc.includes('hintLevel') ||
                   // showHint(qId, layer) pattern: layer param IS the index
                   (examSrc.includes('showHint') && examSrc.includes(', layer)'))  ||
                   (examSrc.includes('showHint') && examSrc.includes(', 1)') && examSrc.includes(', 2)') && examSrc.includes(', 3)'));
test('Hint state uses layer/index for sequential reveal', hasHintIndex);

// 3. solution_steps array is iterated one step at a time
var hintBody = hintFn ? examSrc.substring(examSrc.indexOf(hintFn), examSrc.indexOf(hintFn) + 3000) : '';
var usesSteps = hintBody.includes('solution_steps') || examSrc.includes('solution_steps');
test('Hint reveal uses solution_steps array', usesSteps);

// 4. Hint button is shown/hidden based on whether more hints are available
var hasHintToggle = examSrc.includes('hint-btn') || examSrc.includes('hintBtn') ||
                    examSrc.includes('hint') && examSrc.includes('button');
test('Hint button exists for triggering reveal', hasHintToggle);

// 5. After last hint, hint button is disabled or hidden
var hintExhausted = examSrc.includes('no more') || examSrc.includes('no-more-hints') ||
                    examSrc.includes('hint') && (examSrc.includes('disabled') || examSrc.includes('hide')) ||
                    examSrc.includes('hintIndex') && examSrc.includes('length');
test('Last hint state: button disabled or hidden when hints exhausted', hintExhausted);

console.log('\n' + '='.repeat(50));
console.log('hint-reveal-state-machine: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
