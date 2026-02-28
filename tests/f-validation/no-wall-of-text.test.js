// MCM voice: no wall of text in any HTML file
// ADHD design: no paragraph is longer than 100 words
// Screens of text cause Kai to tune out immediately

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} no-wall-of-text.test.js\n');

var BASE = path.join(__dirname, '../..');
var htmlFiles = ['exam.html', 'index.html'];

console.log('\u2500\u2500 Wall of text check: p tags must be < 100 words \u2500\u2500\n');

var violations = [];

htmlFiles.forEach(function(file) {
    var src = fs.readFileSync(path.join(BASE, file), 'utf-8');
    // Extract text content from <p> tags (not inside script or style)
    var pMatches = src.match(/<p[^>]*>([^<]{100,})<\/p>/g) || [];
    pMatches.forEach(function(p) {
        var text = p.replace(/<[^>]+>/g, '').trim();
        var wordCount = text.split(/\s+/).length;
        if (wordCount > 100) {
            violations.push(file + ': paragraph has ' + wordCount + ' words: "' + text.substring(0, 60) + '..."');
        }
    });
});

if (violations.length) violations.slice(0,3).forEach(function(v) { console.log('  ! ' + v); });

test('exam.html has no p tag with > 100 words', violations.filter(function(v) { return v.startsWith('exam.html'); }).length === 0);
test('index.html has no p tag with > 100 words', violations.filter(function(v) { return v.startsWith('index.html'); }).length === 0);

console.log('\n' + '='.repeat(50));
console.log('no-wall-of-text: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
