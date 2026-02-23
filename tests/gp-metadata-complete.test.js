/**
 * gp-metadata-complete.test.js — All RP files have title, schema_version, version
 *
 * Run: node tests/gp-metadata-complete.test.js
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_PATTERN = /^retake-practice-\d+\.json$/;

const REQUIRED = ['title', 'schema_version', 'version', 'questions'];
const files = fs.readdirSync(DATA_DIR).filter(f => RP_PATTERN.test(f)).sort();
let pass = 0, fail = 0;

for (const file of files) {
    const raw = fs.readFileSync(path.join(DATA_DIR, file), 'utf-8');
    let data;
    try { data = JSON.parse(raw); } catch { console.log('FAIL parse: ' + file); fail++; continue; }

    const missing = REQUIRED.filter(f => !data[f] && data[f] !== 0);
    if (missing.length === 0) {
        console.log('PASS ' + file);
        pass++;
    } else {
        console.log('FAIL ' + file + ': missing ' + missing.join(', '));
        fail++;
    }
}

console.log('\n' + pass + '/' + files.length + ' passed');
if (fail > 0) process.exit(1);
