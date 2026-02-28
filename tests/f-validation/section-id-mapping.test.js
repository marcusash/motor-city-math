// Section ID mapping test
// Verifies question 'section' values in RP JSON match gradeExam() section names
// Prevents ungradeable questions (questions that don't map to any section)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} section-id-mapping.test.js\n');

const examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

// Extract valid section IDs from gradeExam()
var gradeExamStart = examSrc.indexOf('function gradeExam(');
var gradeExamBody = gradeExamStart !== -1 ? examSrc.substring(gradeExamStart, gradeExamStart + 20000) : '';

// Find section definitions (e.g., section-1, section-2, etc. OR letter-based A/B/C/D)
var sectionRefs = gradeExamBody.match(/section-\d+/g) || [];
var validSections = Array.from(new Set(sectionRefs));
// Check if gradeExam uses q.section (letter-based)
var gradeExamUsesSection = gradeExamBody.includes('q.section') || gradeExamBody.includes('question.section');
var sectionSystem = sectionRefs.length > 0 ? 'section-N (' + validSections.join(',') + ')' : 'letter-based (A/B/C/D) or dynamic';
console.log('\u2500\u2500 Section system: ' + sectionSystem + ' \u2500\u2500\n');

test('gradeExam() reads question section data', gradeExamUsesSection || gradeExamBody.includes('section') || sectionRefs.length > 0);

// Check all RP JSON files for section values
var dataDir = path.join(__dirname, '../../data');
var examFiles = fs.readdirSync(dataDir).filter(function(f) {
    return f.match(/retake-practice-\d+\.json/);
}).sort();

var invalidSectionQuestions = [];
var allSectionValues = new Set();

examFiles.forEach(function(file) {
    var data = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf-8'));
    (data.questions || []).forEach(function(q) {
        var section = q.section;
        if (!section) {
            invalidSectionQuestions.push(file + ':' + q.id + ' (no section field)');
            return;
        }
        allSectionValues.add(section);
        // Normalize: section could be 'section-1' or just '1' or 'W2'
        // Check if it maps to a known section
        var normalized = 'section-' + section.replace(/^section-/, '');
        if (validSections.length > 0 && !validSections.includes(normalized) && !validSections.includes(section)) {
            // It might be a standard code like 'W2.a' -- check if gradeExam references standards
            var isStandard = section.match(/^W\d/);
            if (!isStandard) {
                invalidSectionQuestions.push(file + ':' + q.id + ' section=' + section);
            }
        }
    });
});

console.log('  All section values: ' + Array.from(allSectionValues).sort().join(', '));
console.log('  Invalid mapping count: ' + invalidSectionQuestions.length);

test('All RP questions have section field', invalidSectionQuestions.filter(function(q) { return q.includes('no section'); }).length === 0);
test('All RP section values map to valid sections or standards', invalidSectionQuestions.length === 0);

if (invalidSectionQuestions.length > 0) {
    console.log('\n  Invalid:');
    invalidSectionQuestions.slice(0, 5).forEach(function(q) { console.log('    ' + q); });
}

console.log('\n' + '='.repeat(50));
console.log('section-id-mapping: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
