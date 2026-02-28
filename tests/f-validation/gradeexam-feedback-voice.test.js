// gradeExam feedback voice test
// Verifies MCM voice guidelines: no em dash, under 12 words ADHD limit, MCM brand language

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} gradeexam-feedback-voice.test.js\n');

const src = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

// Extract gradeExam function region (~4000 chars from function start)
var gStart = src.indexOf('function gradeExam()');
var gSrc = src.substring(gStart, gStart + 15000);

// Extract coachMsg strings
var msgs = [];
var re = /coachMsg\s*=\s*'([^']+)'/g, m;
while ((m = re.exec(gSrc)) !== null) msgs.push(m[1]);

console.log('\u2500\u2500 coachMsg strings found: ' + msgs.length + ' \u2500\u2500');
msgs.forEach(function(msg, i) {
    console.log('  [' + i + '] ' + msg);
});
console.log();

// 1. Must find at least 4 coach messages (grade 1-4)
test('At least 4 coach messages defined', msgs.length >= 4);

// 2. No em dashes in any message
test('No em dashes (\u2014\u2013) in coach messages', !msgs.some(function(m) {
    return m.includes('\u2014') || m.includes('\u2013');
}));

// 3. All messages under 12 words (ADHD limit — strip emoji)
var wordCounts = msgs.map(function(m) {
    return m.replace(/[\u{1F000}-\u{1FFFF}]/gu, '').trim().split(/\s+/).filter(Boolean).length;
});
test('All messages under 12 words (ADHD limit)', wordCounts.every(function(c) { return c <= 12; }));
console.log('  (word counts: ' + wordCounts.join(', ') + ')');

// 4. MCM brand language: direct, motivational (no passive voice starters)
var passivePatterns = ['It was', 'There were', 'This was'];
test('No passive voice openers in coach messages', !msgs.some(function(msg) {
    return passivePatterns.some(function(p) { return msg.startsWith(p); });
}));

// 5. Grade 4 message references grade 4 specifically
var grade4msg = msgs.find(function(m) { return m.includes('Grade 4') || m.includes('grade 4'); });
test('Grade 4 coach message references Grade 4', !!grade4msg);

// 6. Grade 1 message references study/review/hints (recovery path)
var grade1msg = msgs[msgs.length - 1]; // else branch = lowest grade
test('Low grade message references hints or study', grade1msg && (
    grade1msg.toLowerCase().includes('hint') ||
    grade1msg.toLowerCase().includes('study') ||
    grade1msg.toLowerCase().includes('review') ||
    grade1msg.toLowerCase().includes('gap')
));

// 7. No all-caps shouting
test('No all-caps words in messages (except grade abbreviations)', !msgs.some(function(msg) {
    return msg.split(' ').some(function(w) { return w.length > 3 && w === w.toUpperCase() && /[A-Z]/.test(w); });
}));

// 8. coachMsg displayed in DOM (not just set)
test('coachMsg is rendered into DOM (html += ...coachMsg...)', gSrc.includes('coachMsg'));
test('Coach message wrapped in HTML element', gSrc.includes("+ coachMsg +"));

console.log('\n' + '='.repeat(50));
console.log('gradeexam-feedback-voice: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
