// No console.log in production code test
// exam.html and shared/scripts.js must not have console.log() calls in production
// console.log statements are dev-only and slow down production, especially on mobile

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} no-console-log.test.js\n');

var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');
var scriptSrc = fs.readFileSync(path.join(__dirname, '../../shared/scripts.js'), 'utf-8');
var indexSrc = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf-8');

console.log('\u2500\u2500 Production console.log check \u2500\u2500\n');

function countConsoleLogs(src, name) {
    var re = /console\.log\(/g;
    var matches = src.match(re) || [];
    // Exclude commented-out console.logs
    var lines = src.split('\n').filter(function(line) {
        return line.match(/console\.log\(/) && !line.trim().startsWith('//') && !line.trim().startsWith('*');
    });
    if (lines.length > 0) {
        lines.slice(0, 3).forEach(function(l) { console.log('  ! ' + name + ': ' + l.trim().substring(0, 80)); });
    }
    return lines.length;
}

var examLogs = countConsoleLogs(examSrc, 'exam.html');
test('exam.html has no console.log() calls', examLogs === 0);

var scriptLogs = countConsoleLogs(scriptSrc, 'shared/scripts.js');
test('shared/scripts.js has no console.log() calls', scriptLogs === 0);

var indexLogs = countConsoleLogs(indexSrc, 'index.html');
test('index.html has no console.log() calls', indexLogs === 0);

console.log('\n' + '='.repeat(50));
console.log('no-console-log: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
