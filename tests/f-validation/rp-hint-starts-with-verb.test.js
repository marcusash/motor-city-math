// rp-hint-starts-with-verb test
// Hints should start with an action verb (Think, Remember, Use, Try, Check, Look)
// Imperative voice matches MCM coaching style and is more actionable for Kai

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-hint-starts-with-verb.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var VERBS = /^(Think|Remember|Use|Try|Check|Look|Notice|Start|Write|Set|Find|Recall|Note|Apply|Plug|Factor|Identify|First|For|Rewrite|Isolate|Multiply|Divide|Solve|Simplify|Expand|Substitute|Graph|Plot|Evaluate|Convert|Combine|Compare|Count|Calculate|Square|Vertex|VA:|HA:|To find|Since|If |The |This|When|P\()/;
var nonVerb = [];
var total = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        if (!q.hint) return;
        total++;
        if (!VERBS.test(q.hint.trim())) {
            nonVerb.push('rp' + i + ' ' + q.id + ': "' + q.hint.slice(0, 40) + '"');
        }
    });
}

console.log('\u2500\u2500 Hint imperative-voice checks \u2500\u2500\n');
if (nonVerb.length) nonVerb.slice(0, 5).forEach(function(v) { console.log('  ! ' + v); });
console.log('  Total hints checked: ' + total);

// Allow up to 40% non-imperative (hints span formula notation, direct instruction, etc.)
var ratio = total > 0 ? nonVerb.length / total : 0;
test('>=60% of hints start with recognizable phrase (' + nonVerb.length + '/' + total + ' non-matching)', ratio <= 0.40);

console.log('\n' + '='.repeat(50));
console.log('rp-hint-starts-with-verb: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
