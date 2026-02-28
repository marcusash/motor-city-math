/**
 * gp-solution-steps-format.test.js — solution_steps are arrays of non-empty strings
 * (advisory — not all questions require solution_steps)
 *
 * Run: node tests/gp-solution-steps-format.test.js
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_PATTERN = /^retake-practice-\d+\.json$/;
const files = fs.readdirSync(DATA_DIR).filter(f => RP_PATTERN.test(f)).sort();

let pass = 0, fail = 0, skip = 0, checked = 0;

for (const file of files) {
    const raw = fs.readFileSync(path.join(DATA_DIR, file), 'utf-8');
    let data;
    try { data = JSON.parse(raw); } catch { fail++; continue; }

    for (const q of (data.questions || [])) {
        if (!q.solution_steps) { skip++; continue; }
        checked++;
        if (!Array.isArray(q.solution_steps)) {
            console.log('FAIL ' + file + ' ' + q.id + ': solution_steps must be array');
            fail++; continue;
        }
        const badSteps = q.solution_steps.filter(s => typeof s !== 'string' || s.trim().length === 0);
        if (badSteps.length > 0) {
            console.log('FAIL ' + file + ' ' + q.id + ': ' + badSteps.length + ' empty/non-string steps');
            fail++;
        } else {
            pass++;
        }
    }
}

console.log('Checked: ' + checked + ' questions with solution_steps (' + skip + ' without)');
console.log(pass + '/' + checked + ' passed');
if (fail > 0) { console.log(fail + ' failures'); process.exit(1); }
else { console.log('✅ All solution_steps are valid arrays of strings.'); }
