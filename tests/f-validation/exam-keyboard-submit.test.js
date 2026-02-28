// exam.html keyboard submit accessibility test
// Submit button must be keyboard-accessible: <button> element, no mouse-only handlers

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-keyboard-submit.test.js\n');

const src = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

// Find submit button — search in HTML body (skip CSS sections)
var scriptStart = src.indexOf('<body');
var submitBtnMatch = src.match(/<button[^>]*gradeExam[^>]*>.*?<\/button>/);
var submitAreaIdx = src.indexOf('class="submit-area"');
if (submitAreaIdx === -1) submitAreaIdx = src.indexOf("class='submit-area'");
var submitArea = submitAreaIdx >= 0 ? src.substring(submitAreaIdx, submitAreaIdx + 500) : '';

console.log('\u2500\u2500 Submit button accessibility \u2500\u2500');

// 1. Submit is a <button> element (not <div> or <a>)
test('Submit uses <button> element (not div/anchor)', submitArea.includes('<button'));

// 2. Submit button has text content (not icon-only)
var btnTextMatch = submitArea.match(/<button[^>]*>([^<]+)/);
var btnText = btnTextMatch ? btnTextMatch[1].trim() : '';
test('Submit button has visible text content', btnText.length > 0);
console.log('  (button text: "' + btnText.substring(0, 50) + '")');

// 3. No onmousedown/onmouseup for submit (mouse-only events)
test('No onmousedown handler on submit (keyboard-friendly)', !submitArea.includes('onmousedown'));

// 4. gradeExam called via onclick (not mouseover or touch-only)
test('Submit uses onclick to call gradeExam()', submitArea.includes('onclick') && submitArea.includes('gradeExam'));

// 5. Submit button not disabled by default (must be reachable)
test('Submit button not disabled by default', !submitArea.match(/disabled(?!=)/));

// 6. Button is inside submit-area div (expected DOM structure)
test('Submit button inside .submit-area container', src.includes('class="submit-area"') ||
    src.includes("class='submit-area'"));

// 7. No positive tabindex on submit (natural tab order)
var submitBtnSrc = submitArea.match(/<button[^>]*/);
var btnTag = submitBtnSrc ? submitBtnSrc[0] : '';
var tabindex = btnTag.match(/tabindex="(\d+)"/);
test('Submit button has no positive tabindex', !tabindex || parseInt(tabindex[1]) <= 0);

// 8. exam.html has skip link (keyboard navigation to main content)
test('Skip link present for keyboard users', src.includes('skip-link') || src.includes('Skip to'));

console.log('\n' + '='.repeat(50));
console.log('exam-keyboard-submit: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
