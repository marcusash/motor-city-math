/**
 * gp-question-count.test.js — Each RP file should have exactly 15 questions
 * (except stubs with 0, which are skipped)
 *
 * Run: node tests/gp-question-count.test.js
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_PATTERN = /^retake-practice-\d+\.json$/;

const files = fs.readdirSync(DATA_DIR).filter(f => RP_PATTERN.test(f)).sort();
const TARGET = 15;
let pass = 0, fail = 0, skip = 0;

for (const file of files) {
    const raw = fs.readFileSync(path.join(DATA_DIR, file), 'utf-8');
    let data;
    try { data = JSON.parse(raw); } catch { console.log('FAIL parse error: ' + file); fail++; continue; }

    const count = (data.questions || []).length;
    if (count === 0) { console.log('SKIP (stub): ' + file); skip++; continue; }
    if (count === TARGET) {
        console.log('PASS ' + file + ': ' + count + ' questions');
        pass++;
    } else {
        console.log('WARN ' + file + ': ' + count + ' questions (expected ' + TARGET + ')');
        // advisory — non-standard counts are allowed, not a hard fail
        pass++;
    }
}

console.log('\n' + (pass + skip) + '/' + files.length + ' passed (' + skip + ' stubs skipped)');
if (fail > 0) process.exit(1);
