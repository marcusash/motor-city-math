// gp-rp5-version-is-2-0.test.js — RP5 was fixed from version '2' to '2.0' — regression guard

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const TARGET = 'retake-practice-5.json';

const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, TARGET), 'utf8'));
const version = data.version;

console.log(`gp-rp5-version-is-2-0: RP5 version="${version}"`);
if (version !== '2.0') {
  console.log(`  FAIL: RP5 version reverted to "${version}" (was fixed to "2.0" in commit 64e674f)`);
  process.exit(1);
}
console.log(`OK — RP5 version "2.0" regression guard passes`);
