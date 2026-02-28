// Exam HTML structure integrity test
// exam.html must have proper HTML5 structure:
// <!DOCTYPE html>, <head>, <body>, exactly one <main> or role=main

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-html5-structure.test.js\n');

var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');
var indexSrc = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf-8');

console.log('\u2500\u2500 HTML5 structure checks \u2500\u2500\n');

// 1. DOCTYPE declaration
var hasDoctype = examSrc.trim().toLowerCase().startsWith('<!doctype html');
test('exam.html starts with <!DOCTYPE html>', hasDoctype);

// 2. <html lang="en">
var hasHtmlLang = examSrc.includes('<html lang="en"');
test('exam.html has <html lang="en">', hasHtmlLang);

// 3. <head> with <title>
var hasTitle = examSrc.includes('<head>') && examSrc.includes('<title>');
test('exam.html has <head> with <title>', hasTitle);

// 4. <meta charset="UTF-8">
var hasCharset = examSrc.includes('charset="UTF-8"') || examSrc.includes("charset='UTF-8'") ||
                 examSrc.includes('charset=UTF-8');
test('exam.html has <meta charset="UTF-8">', hasCharset);

// 5. Exactly one role=main or <main> (no duplicate landmarks)
var mainCount = (examSrc.match(/role="main"|<main[\s>]/g) || []).length;
test('exam.html has exactly 1 main landmark (role="main" or <main>)', mainCount === 1);
if (mainCount !== 1) console.log('  ! Found ' + mainCount + ' main landmarks');

// 6. index.html also has DOCTYPE
var indexHasDoctype = indexSrc.trim().toLowerCase().startsWith('<!doctype html');
test('index.html starts with <!DOCTYPE html>', indexHasDoctype);

console.log('\n' + '='.repeat(50));
console.log('exam-html5-structure: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
