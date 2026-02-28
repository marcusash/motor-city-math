// gp-ci-gate-script-runs-clean.test.js — gp-ci-gate.js must exit 0 (all CI checks pass)

const { execSync } = require('child_process');
const path = require('path');

const SCRIPT = path.join(__dirname, '..', 'scripts', 'gp-ci-gate.js');

try {
  const output = execSync(`node "${SCRIPT}"`, { encoding: 'utf8', timeout: 60000 });
  // Look for pass/fail summary
  const passMatch = output.match(/(\d+) pass/g);
  const failMatch = output.match(/(\d+) fail/);
  const failCount = failMatch ? parseInt(failMatch[1]) : 0;
  
  console.log(`gp-ci-gate-script-runs-clean: CI gate completed`);
  if (passMatch) console.log(`  Checks: ${passMatch.join(', ')}`);
  
  if (failCount > 0) {
    console.log(`  FAIL: ${failCount} CI checks failed`);
    process.exit(1);
  }
  console.log(`OK — CI gate passes`);
} catch (err) {
  console.log(`gp-ci-gate-script-runs-clean: 0 pass, 1 fail — CI gate errored`);
  console.log(`  Exit code: ${err.status}, error: ${err.message.substring(0, 100)}`);
  process.exit(1);
}
