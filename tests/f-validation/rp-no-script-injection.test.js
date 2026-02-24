// rp-no-script-injection test
// question_html must not contain <script> tags
// Script injection in question content is a security risk

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-no-script-injection.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var scriptTags = [];

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        var html = q.question_html || '';
        if (/<script/i.test(html)) {
            scriptTags.push('rp' + i + ' ' + q.id + ': <script> in question_html');
        }
        // Also check solution_steps
        (q.solution_steps || []).forEach(function(step) {
            if (/<script/i.test(step || '')) {
                scriptTags.push('rp' + i + ' ' + q.id + ' solution_step: <script> found');
            }
        });
    });
}

console.log('\u2500\u2500 Script injection checks \u2500\u2500\n');
if (scriptTags.length) scriptTags.forEach(function(v) { console.log('  ! ' + v); });

test('No <script> tags in question_html or solution_steps (' + scriptTags.length + ' violations)', scriptTags.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-no-script-injection: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
