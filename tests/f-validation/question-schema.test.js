/**
 * Motor City Math — Fundamentals Agent (F)
 * Task F-10: Question Bank Schema Validation
 *
 * Validates data/questions.json against expected schema.
 * Checks: required fields, answer types, IDs, standards, difficulty,
 *         no duplicates, cross-reference with standards.json.
 *
 * Run: node tests/f-validation/question-schema.test.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
let pass = 0, fail = 0;

function test(desc, condition) {
    if (condition) { pass++; }
    else { fail++; console.log(`  ❌ ${desc}`); }
}
function section(title) { console.log(`\n── ${title} ──`); }

// Load data files
const questionsPath = path.join(ROOT, 'data', 'questions.json');
const standardsPath = path.join(ROOT, 'data', 'standards.json');

let questionsData, standardsData;
try {
    questionsData = JSON.parse(fs.readFileSync(questionsPath, 'utf-8'));
} catch (e) {
    console.error(`FATAL: Cannot parse data/questions.json: ${e.message}`);
    process.exit(2);
}
try {
    standardsData = JSON.parse(fs.readFileSync(standardsPath, 'utf-8'));
} catch (e) {
    console.error(`FATAL: Cannot parse data/standards.json: ${e.message}`);
    process.exit(2);
}

const questions = questionsData.questions;

// ===================================================================
// 1. TOP-LEVEL STRUCTURE
// ===================================================================
section('1. Top-Level Structure');

test('Has version field', typeof questionsData.version === 'string');
test('Has questions array', Array.isArray(questions));
test('Has question_count', typeof questionsData.question_count === 'number');
test('question_count matches array length', questionsData.question_count === questions.length);
console.log(`  Questions: ${questions.length}`);

// ===================================================================
// 2. REQUIRED FIELDS PER QUESTION
// ===================================================================
section('2. Required Fields');

const requiredFields = ['id', 'unit', 'standard', 'difficulty', 'type', 'source_file', 'question_text'];
const optionalFields = ['source_question', 'sub_parts', 'tags', 'hint', 'solution_steps', 'answer', 'answer_type'];

let missingFields = 0;
for (const q of questions) {
    for (const field of requiredFields) {
        if (q[field] === undefined || q[field] === null || q[field] === '') {
            missingFields++;
            if (missingFields <= 5) {
                console.log(`  ❌ ${q.id || '(no id)'}: missing "${field}"`);
            }
        }
    }
}
test(`All questions have required fields (${requiredFields.join(', ')})`, missingFields === 0);
if (missingFields > 5) {
    console.log(`  ... and ${missingFields - 5} more missing fields`);
}

// ===================================================================
// 3. UNIQUE IDS
// ===================================================================
section('3. Unique IDs');

const ids = questions.map(q => q.id);
const uniqueIds = new Set(ids);
const dupeIds = ids.filter((id, i) => ids.indexOf(id) !== i);

test('All IDs are unique', dupeIds.length === 0);
if (dupeIds.length > 0) {
    console.log(`  Duplicate IDs: ${[...new Set(dupeIds)].join(', ')}`);
}
console.log(`  Total IDs: ${ids.length}, Unique: ${uniqueIds.size}`);

// ===================================================================
// 4. DIFFICULTY VALUES
// ===================================================================
section('4. Difficulty Tags');

const validDifficulties = ['easy', 'medium', 'hard'];
const diffCounts = {};
let invalidDiff = 0;

for (const q of questions) {
    if (validDifficulties.includes(q.difficulty)) {
        diffCounts[q.difficulty] = (diffCounts[q.difficulty] || 0) + 1;
    } else {
        invalidDiff++;
        if (invalidDiff <= 3) console.log(`  ❌ ${q.id}: invalid difficulty "${q.difficulty}"`);
    }
}

test('All difficulties are easy/medium/hard', invalidDiff === 0);
console.log(`  Distribution: ${JSON.stringify(diffCounts)}`);

// ===================================================================
// 5. STANDARD CROSS-REFERENCE
// ===================================================================
section('5. Standards Cross-Reference');

// Build list of valid standards from standards.json
const validStandards = new Set();
if (standardsData.units) {
    for (const unit of standardsData.units) {
        if (unit.standards) {
            for (const std of unit.standards) {
                validStandards.add(std.id);
            }
        }
    }
}

console.log(`  Valid standards in standards.json: ${validStandards.size}`);

let invalidStandards = 0;
const usedStandards = new Set();
for (const q of questions) {
    usedStandards.add(q.standard);
    if (!validStandards.has(q.standard)) {
        invalidStandards++;
        if (invalidStandards <= 5) {
            console.log(`  ⚠️ ${q.id}: standard "${q.standard}" not in standards.json`);
        }
    }
}

const unusedStandards = [...validStandards].filter(s => !usedStandards.has(s));
console.log(`  Standards used in questions: ${usedStandards.size}`);
if (unusedStandards.length > 0) {
    console.log(`  Standards with 0 questions: ${unusedStandards.join(', ')}`);
}
if (invalidStandards > 0) {
    console.log(`  ⚠️ ${invalidStandards} questions reference standards not in standards.json`);
}

// Only fail if there are invalid standards — missing coverage is informational
test('All question standards exist in standards.json', invalidStandards === 0);

// ===================================================================
// 6. ANSWER VALIDATION
// ===================================================================
section('6. Answer Presence');

let questionsWithAnswers = 0;
let subPartsWithAnswers = 0;
let subPartsTotal = 0;
let questionsWithoutAnswers = 0;

for (const q of questions) {
    if (q.sub_parts && q.sub_parts.length > 0) {
        let hasAnyAnswer = false;
        for (const sp of q.sub_parts) {
            subPartsTotal++;
            if (sp.answer !== undefined && sp.answer !== null && sp.answer !== '') {
                subPartsWithAnswers++;
                hasAnyAnswer = true;
            }
        }
        if (hasAnyAnswer) questionsWithAnswers++;
        else questionsWithoutAnswers++;
    } else if (q.answer !== undefined && q.answer !== null && q.answer !== '') {
        questionsWithAnswers++;
    } else {
        questionsWithoutAnswers++;
    }
}

console.log(`  Questions with answers: ${questionsWithAnswers}/${questions.length}`);
console.log(`  Sub-parts with answers: ${subPartsWithAnswers}/${subPartsTotal}`);
if (questionsWithoutAnswers > 0) {
    console.log(`  ⚠️ Questions missing all answers: ${questionsWithoutAnswers}`);
}

test('All questions have at least one answer', questionsWithoutAnswers === 0);

// ===================================================================
// 7. HINT & SOLUTION COVERAGE
// ===================================================================
section('7. Hint & Solution Coverage');

let withHint = 0, withSolution = 0;
for (const q of questions) {
    if (q.hint && q.hint.trim()) withHint++;
    if (q.solution_steps && q.solution_steps.length > 0) withSolution++;
}

console.log(`  Questions with hints: ${withHint}/${questions.length} (${Math.round(100*withHint/questions.length)}%)`);
console.log(`  Questions with solutions: ${withSolution}/${questions.length} (${Math.round(100*withSolution/questions.length)}%)`);

test('All questions have hints', withHint === questions.length);
test('All questions have solution steps', withSolution === questions.length);

// ===================================================================
// 8. HINT LENGTH (ADHD: ≤12 words per voice guide)
// ===================================================================
section('8. Hint Length (ADHD constraint: ≤12 words)');

let longHints = 0;
for (const q of questions) {
    if (q.hint) {
        const wordCount = q.hint.split(/\s+/).length;
        if (wordCount > 12) {
            longHints++;
            if (longHints <= 3) {
                console.log(`  ⚠️ ${q.id}: hint is ${wordCount} words: "${q.hint.substring(0, 60)}..."`);
            }
        }
    }
}

console.log(`  Hints ≤12 words: ${questions.length - longHints}/${questions.length}`);
if (longHints > 0) {
    console.log(`  ⚠️ ${longHints} hints exceed 12-word limit`);
}

// ===================================================================
// 9. SOURCE FILE MAPPING
// ===================================================================
section('9. Source File Mapping');

const sourceFiles = {};
for (const q of questions) {
    sourceFiles[q.source_file] = (sourceFiles[q.source_file] || 0) + 1;
}

console.log('  Questions per source file:');
for (const [file, count] of Object.entries(sourceFiles).sort((a, b) => b[1] - a[1])) {
    console.log(`    ${file}: ${count}`);
}

// Verify source files exist
let missingSourceFiles = 0;
for (const file of Object.keys(sourceFiles)) {
    if (!fs.existsSync(path.join(ROOT, file))) {
        missingSourceFiles++;
        console.log(`  ❌ Source file not found: ${file}`);
    }
}
test('All source files exist', missingSourceFiles === 0);

// ===================================================================
// 10. UNIT DISTRIBUTION
// ===================================================================
section('10. Unit Distribution');

const units = {};
for (const q of questions) {
    units[q.unit] = (units[q.unit] || 0) + 1;
}

for (const [unit, count] of Object.entries(units).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${unit}: ${count}`);
}

// ===================================================================
// STANDARDS.JSON VALIDATION
// ===================================================================
section('11. Standards.json Structure');

test('Has curriculum field', typeof standardsData.curriculum === 'string');
test('Has units array', Array.isArray(standardsData.units));

let totalStdCount = 0;
for (const unit of standardsData.units || []) {
    test(`Unit "${unit.name || unit.id}" has standards`, Array.isArray(unit.standards) && unit.standards.length > 0);
    for (const std of unit.standards || []) {
        totalStdCount++;
        if (!std.id || !std.name || !std.description) {
            console.log(`  ❌ Standard missing id/name/description: ${JSON.stringify(std).substring(0, 80)}`);
        }
    }
}
console.log(`  Total standards defined: ${totalStdCount}`);

// ===================================================================
// SUMMARY
// ===================================================================
section('SCHEMA VALIDATION SUMMARY');
console.log(`\n  Tests: ${pass + fail}, ${pass} passed, ${fail} failed`);
console.log(`  Questions: ${questions.length}`);
console.log(`  Standards: ${validStandards.size}`);
console.log(`  Sub-parts: ${subPartsTotal}`);
console.log(`  Hints: ${withHint}, Solutions: ${withSolution}\n`);

process.exit(fail > 0 ? 1 : 0);
