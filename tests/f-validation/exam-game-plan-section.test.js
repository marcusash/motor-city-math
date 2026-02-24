// exam-game-plan-section test
// exam.html must include the Game Plan section (standards study guide)
// Game Plan shows Kai which standards are covered before he starts

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-game-plan-section.test.js\n');

var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 Game Plan section checks \u2500\u2500\n');

// 1. Game Plan section exists
var hasGamePlan = examSrc.includes('Game Plan') || examSrc.includes('gamePlan') || examSrc.includes('game-plan');
test('Game Plan section exists in exam.html', hasGamePlan);

// 2. Standards listed in game plan
var hasStandards = examSrc.includes('W1') || examSrc.includes('W2') || examSrc.includes('W3') ||
                   examSrc.includes('standard') && examSrc.includes('gamePlan');
test('Standards referenced in Game Plan section', hasStandards);

// 3. Game Plan collapsible (progressive disclosure for ADHD)
var isCollapsible = examSrc.includes('gamePlanSection') || examSrc.includes('toggleGamePlan') ||
                    examSrc.includes('aria-expanded') && examSrc.includes('gamePlan') ||
                    examSrc.includes('toggle') && examSrc.includes('game');
test('Game Plan is collapsible (progressive disclosure)', isCollapsible);

console.log('\n' + '='.repeat(50));
console.log('exam-game-plan-section: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
