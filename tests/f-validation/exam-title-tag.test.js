// exam.html title tag test
// Every HTML page needs a descriptive <title> tag
// Dynamic title (set from exam JSON) is preferred but static fallback is ok

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-title-tag.test.js\n');

var HTML_FILES = [
    { file: 'exam.html', label: 'exam' },
    { file: 'index.html', label: 'dashboard' },
    { file: 'final_exam_251123.html', label: 'final exam' }
];

var baseDir = path.join(__dirname, '../../');

console.log('\u2500\u2500 Title tag checks \u2500\u2500\n');

HTML_FILES.forEach(function(item) {
    var f = path.join(baseDir, item.file);
    if (!fs.existsSync(f)) {
        console.log('  SKIP: ' + item.file + ' not found');
        return;
    }
    var src = fs.readFileSync(f, 'utf-8');

    // Check <title> tag exists
    var titleMatch = src.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    var hasTitle = !!titleMatch;
    test(item.file + ': has <title> tag', hasTitle);

    if (hasTitle) {
        var titleText = (titleMatch[1] || '').trim();
        // Title must not be empty
        test(item.file + ': title is non-empty', titleText.length > 0);
        // Title must include "Motor City" or "Kai" or "Algebra" (MCM context)
        var hasBrand = titleText.includes('Motor City') || titleText.includes('Kai') || 
                       titleText.includes('Algebra') || titleText.includes('Math') ||
                       titleText.includes('MCM');
        test(item.file + ': title references MCM brand or context', hasBrand);
    }
});

console.log('\n' + '='.repeat(50));
console.log('exam-title-tag: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
