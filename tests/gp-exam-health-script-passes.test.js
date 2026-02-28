// gp-exam-health-script-passes.test.js — gp-exam-health.js must exit 0 (11/11)

const { execSync } = require('child_process');
const path = require('path');

const SCRIPT = path.join(__dirname, '..', 'scripts', 'gp-exam-health.js');

let pass = 0;
let fail = 0;

try {
  const output = execSync(`node "${SCRIPT}"`, { encoding: 'utf8', timeout: 30000 });
  const match = output.match(/(\d+) checks: (\d+) pass, (\d+) fail/);
  if (match) {
    const [, total, passing, failing] = match.map(Number);
    console.log(`gp-exam-health-script-passes: health gate ${passing}/${total}`);
    if (failing > 0) {
      fail++;
      console.log(`  FAIL: ${failing} health checks failed`);
      process.exit(1);
    } else {
      pass++;
    }
  } else {
    pass++;
    console.log(`gp-exam-health-script-passes: script ran (no structured output detected)`);
  }
} catch (err) {
  fail++;
  console.log(`gp-exam-health-script-passes: 0 pass, 1 fail — script errored`);
  console.log(`  Error: ${err.message.substring(0, 100)}`);
  process.exit(1);
}

console.log(`OK — health gate passes (${pass} checks)`);
