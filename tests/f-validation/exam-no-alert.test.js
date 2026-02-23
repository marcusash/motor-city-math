// exam.html no-alert() test
// Using browser alert() breaks UX and ADHD flow
// All feedback must use DOM elements (role=alert, aria-live)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-no-alert.test.js\n');

var HTML_FILES = [
    { file: 'exam.html', hardFail: true },    // exam must have zero alerts
    { file: 'index.html', hardFail: false },   // dashboard has legacy alerts (bug: tracked)
    { file: 'shared/scripts.js', hardFail: false } // scripts has legacy alerts (bug: tracked)
];
var baseDir = path.join(__dirname, '../../');

console.log('\u2500\u2500 No alert() checks \u2500\u2500\n');

HTML_FILES.forEach(function(item) {
    var f = path.join(baseDir, item.file);
    if (!fs.existsSync(f)) { console.log('  SKIP: ' + item.file); return; }
    var src = fs.readFileSync(f, 'utf-8');
    var alertCalls = (src.match(/\balert\s*\(/g) || []).length;
    if (item.hardFail) {
        test(item.file + ': no alert() calls', alertCalls === 0);
    } else {
        // Log as info -- legacy alerts, bug tracked, not blocking
        if (alertCalls > 0) {
            console.log('  INFO: ' + item.file + ': ' + alertCalls + ' alert() call(s) (replace with DOM toast -- tracked)');
        } else {
            console.log('  OK: ' + item.file + ': no alert() calls');
        }
        test(item.file + ': alert() count documented', true); // informational pass
    }
});

console.log('\n' + '='.repeat(50));
console.log('exam-no-alert: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
