// gradeExam section ordering test
// Verifies 5 labeled sections exist in gradeExam() in the correct order

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} gradeexam-section-ordering.test.js\n');

const src = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

var gStart = src.indexOf('function gradeExam()');
var gSrc = src.substring(gStart, gStart + 20000);

// Find section comment markers
var sections = [];
var re = /==\s*SECTION\s+(\d+):[^=]+==/g, m;
while ((m = re.exec(gSrc)) !== null) {
    sections.push({ num: parseInt(m[1]), idx: m.index, text: m[0] });
}

console.log('\u2500\u2500 Section markers found: ' + sections.length + ' \u2500\u2500');
sections.forEach(function(s) {
    console.log('  SECTION ' + s.num + ': "' + s.text.trim() + '"');
});
console.log();

// 1. All 5 sections present
test('All 5 sections defined in gradeExam()', sections.length === 5);

// 2. Sections are numbered 1-5
var nums = sections.map(function(s) { return s.num; }).sort();
test('Sections numbered 1-5', JSON.stringify(nums) === JSON.stringify([1,2,3,4,5]));

// 3. Sections appear in ascending order (1 before 2 before 3...)
var ordered = true;
for (var i = 1; i < sections.length; i++) {
    if (sections[i].idx < sections[i-1].idx) { ordered = false; break; }
}
test('Sections appear in order 1-5 in source', ordered);

// 4. Section 1 comes before evaluateNumberInputs (setup phase first)
var evalIdx = gSrc.indexOf('evaluateNumberInputs');
var section1 = sections.find(function(s) { return s.num === 1; });
test('SECTION 1 (setup) appears before evaluateNumberInputs', section1 && section1.idx < evalIdx);

// 5. Last section contains scorecard/display logic (not number parsing)
var lastSection = sections[sections.length - 1];
var lastSrcChunk = gSrc.substring(lastSection.idx, lastSection.idx + 800);
test('Last section contains scorecard/save/display logic',
    lastSrcChunk.includes('scorecard') ||
    lastSrcChunk.includes('saveResults') ||
    lastSrcChunk.includes('display') ||
    lastSrcChunk.includes('innerHTML'));

// 6. evaluateNumberInputs is delegated (not inlined)
test('evaluateNumberInputs called as function (not inlined)', gSrc.includes('evaluateNumberInputs('));

// 7. findMissingInputLabels is delegated (not inlined)
test('findMissingInputLabels called as function (not inlined)', gSrc.includes('findMissingInputLabels('));

console.log('\n' + '='.repeat(50));
console.log('gradeexam-section-ordering: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
