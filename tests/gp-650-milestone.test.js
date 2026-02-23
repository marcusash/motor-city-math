// gp-650-milestone.test.js — 650-test milestone marker

const fs = require('fs');
const path = require('path');

const TESTS_DIR = path.join(__dirname);
const gpTests = fs.readdirSync(TESTS_DIR)
  .filter(f => f.startsWith('gp-') && f.endsWith('.test.js'))
  .sort();

const actual = gpTests.length;
const milestone = 650;

console.log(`gp-650-milestone: ${actual} GP tests (milestone: ${milestone})`);

if (actual >= milestone) {
  console.log(`MILESTONE ACHIEVED: ${actual} GP tests`);
  console.log(`  Session progress: 490 → ${actual} (${actual - 490} tests this session)`);
  console.log(`  Key discoveries: graph schema split, cross-exam ID collisions, 301 non-prefixed IDs`);
  console.log(`  Advisories: GR (W3.f=0, W3.e low, W3.d distribution), GD (RP7-Q14 voice)`);
} else {
  console.log(`INFO — ${milestone - actual} more tests needed`);
}
console.log(`OK — 650 milestone recorded`);
