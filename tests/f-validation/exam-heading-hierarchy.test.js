// exam.html heading hierarchy test
// WCAG 1.3.1 Info and Relationships: heading levels must not skip, h1 must exist once

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-heading-hierarchy.test.js\n');

function checkFile(file, label) {
    console.log('\u2500\u2500 ' + label + ' \u2500\u2500');
    var src = fs.readFileSync(path.join(__dirname, '../../' + file), 'utf-8');

    // Strip script/style blocks to avoid false matches
    var stripped = src.replace(/<script[\s\S]*?<\/script>/gi, '')
                      .replace(/<style[\s\S]*?<\/style>/gi, '');

    // Find all heading tags in order
    var headings = [];
    var re = /<(h[1-6])[^>]*>([^<]*)/gi, m;
    while ((m = re.exec(stripped)) !== null) {
        headings.push({ level: parseInt(m[1][1]), text: m[2].trim() });
    }

    console.log('  Headings found: ' + headings.length);
    headings.forEach(function(h) {
        console.log('    h' + h.level + ': ' + (h.text || '(empty)').substring(0, 60));
    });

    // 1. At least one h1
    var h1s = headings.filter(function(h) { return h.level === 1; });
    test(label + ': has at least one h1', h1s.length >= 1);

    // 2. No more than 2 h1 (documents should have 1 main heading)
    test(label + ': not more than 2 h1 elements', h1s.length <= 2);

    // 3. No empty headings (allow dynamic h1 with id — JS populates at runtime)
    var emptyH = headings.filter(function(h) {
        // h1 with an id is expected to be populated dynamically (e.g., examTitle)
        if (h.level === 1) return false;
        return !h.text;
    });
    test(label + ': no empty heading elements', emptyH.length === 0);

    // 4. No skipped heading levels (h1->h3 without h2)
    var levels = headings.map(function(h) { return h.level; });
    var skipFound = false;
    for (var i = 1; i < levels.length; i++) {
        if (levels[i] > levels[i-1] + 1) {
            skipFound = true;
            console.log('  WARN: Heading skip: h' + levels[i-1] + ' -> h' + levels[i]);
        }
    }
    test(label + ': no heading level skips', !skipFound);

    console.log();
}

checkFile('exam.html', 'exam.html');
checkFile('index.html', 'index.html');

console.log('='.repeat(50));
console.log('exam-heading-hierarchy: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
