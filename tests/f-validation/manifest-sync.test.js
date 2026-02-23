// Test: manifest.json exam IDs match actual data/ JSON files
// No orphan entries in manifest, no missing files for listed exams

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} manifest-sync.test.js\n');

const dataDir = path.join(__dirname, '../../data');
const manifest = JSON.parse(fs.readFileSync(path.join(dataDir, 'manifest.json'), 'utf-8'));

// ── Manifest structure ─────────────────────────────────────────
console.log('\u2500\u2500 Manifest structure \u2500\u2500');
test('manifest.json parseable', true);
var examIds = manifest.exams ? manifest.exams.map(function(e) { return e.id || e.exam_id; }) : [];
test('manifest has exams array', Array.isArray(manifest.exams));
test('manifest has 11 exams (RP1-11)', examIds.length === 11);

// ── Manifest entries have required fields ──────────────────────
console.log('\n\u2500\u2500 Exam entry completeness \u2500\u2500');
var missingTitle = manifest.exams.filter(function(e) { return !e.title; });
var missingId = manifest.exams.filter(function(e) { return !(e.id || e.exam_id); });
test('all entries have title', missingTitle.length === 0);
test('all entries have id', missingId.length === 0);

// ── File sync: manifest IDs match actual files ─────────────────
console.log('\n\u2500\u2500 Manifest-to-file sync \u2500\u2500');
var orphans = [], missing = [];
examIds.forEach(function(id) {
    var filePath = path.join(dataDir, id + '.json');
    if (!fs.existsSync(filePath)) missing.push(id);
});
// Check reverse: actual files should be in manifest
for (var n = 1; n <= 11; n++) {
    var id = 'retake-practice-' + n;
    if (!examIds.includes(id)) orphans.push(id);
}
test('no manifest entries missing their file', missing.length === 0);
test('all RP1-11 files listed in manifest', orphans.length === 0);
if (missing.length) console.log('  Missing files for:', missing);
if (orphans.length) console.log('  Not in manifest:', orphans);

// ── Exam picker fields (id, title, desc) ──────────────────────
console.log('\n\u2500\u2500 Exam picker fields \u2500\u2500');
var noDesc = manifest.exams.filter(function(e) { return !e.desc; });
test('all entries have desc field', noDesc.length === 0);
// time_minutes is in individual exam JSON files, not in manifest (manifest is lightweight picker)
test('manifest is lightweight (no full exam data)', !manifest.exams[0].questions);

console.log('\n' + '='.repeat(50));
console.log('manifest-sync: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
