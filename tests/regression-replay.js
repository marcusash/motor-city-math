/**
 * GF Regression Replay Pack (gf-skill-23)
 * 
 * Captures pass-count baselines for all static test suites.
 * On replay, fails if any previously-passing suite drops checks.
 *
 * Usage:
 *   node tests/regression-replay.js --capture   # save new baseline
 *   node tests/regression-replay.js             # compare against baseline
 *   node tests/regression-replay.js --diff      # show only regressions
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const BASELINE_FILE = path.join(__dirname, 'regression-baseline.json');
const SUITES_DIR = path.join(__dirname, 'f-validation');
const CAPTURE_MODE = process.argv.includes('--capture');
const DIFF_MODE = process.argv.includes('--diff');

const CHECK_RE = /(\d+) checks?:\s*(\d+) passed(?:,\s*(\d+) failed)?/;
const PASS_RE = /(\d+)\/(\d+)/;

function getSuites() {
  return fs.readdirSync(SUITES_DIR)
    .filter(f => f.endsWith('.test.js'))
    .sort();
}

function runSuite(suite) {
  const suitePath = path.join(SUITES_DIR, suite);
  const t0 = Date.now();
  let stdout = '', stderr = '', exitCode = 0;
  try {
    stdout = execSync(`node "${suitePath}"`, { timeout: 30000 }).toString();
  } catch (e) {
    stdout = (e.stdout || '').toString();
    stderr = (e.stderr || '').toString();
    exitCode = e.status || 1;
  }
  const ms = Date.now() - t0;

  // Parse "N checks: X passed, Y failed"
  const m = CHECK_RE.exec(stdout + stderr);
  if (m) {
    return {
      suite,
      exitCode,
      total: parseInt(m[1]),
      passed: parseInt(m[2]),
      failed: parseInt(m[3] || '0'),
      durationMs: ms
    };
  }
  // Fallback: parse "X/Y" from last line
  const lines = (stdout + stderr).trim().split('\n');
  for (let i = lines.length - 1; i >= 0; i--) {
    const m2 = PASS_RE.exec(lines[i]);
    if (m2) {
      const passed = parseInt(m2[1]);
      const total = parseInt(m2[2]);
      return { suite, exitCode, total, passed, failed: total - passed, durationMs: ms };
    }
  }
  // No count found — treat exit code as proxy
  return { suite, exitCode, total: null, passed: null, failed: null, durationMs: ms };
}

function captureBaseline(results) {
  const baseline = {
    captured: new Date().toISOString(),
    note: 'Captured by gf-skill-23 regression replay pack',
    suites: {}
  };
  results.forEach(r => {
    baseline.suites[r.suite] = {
      exitCode: r.exitCode,
      total: r.total,
      passed: r.passed,
      failed: r.failed
    };
  });
  fs.writeFileSync(BASELINE_FILE, JSON.stringify(baseline, null, 2));
  console.log(`\nBaseline captured: ${Object.keys(baseline.suites).length} suites → ${BASELINE_FILE}`);
  console.log(`Date: ${baseline.captured}`);
}

function compareToBaseline(results) {
  if (!fs.existsSync(BASELINE_FILE)) {
    console.error('No baseline found. Run: node tests/regression-replay.js --capture');
    process.exit(1);
  }
  const baseline = JSON.parse(fs.readFileSync(BASELINE_FILE, 'utf8'));
  const regressions = [];
  const improvements = [];
  const unchanged = [];
  const newSuites = [];
  const removedSuites = [];

  // Check each current result against baseline
  results.forEach(r => {
    const b = baseline.suites[r.suite];
    if (!b) {
      newSuites.push(r);
      return;
    }
    // Regression: suite that passed now fails, or pass count dropped
    const wasOk = b.exitCode === 0;
    const isOk = r.exitCode === 0;
    const countDrop = (b.passed !== null && r.passed !== null) ? (r.passed < b.passed) : false;

    if ((wasOk && !isOk) || countDrop) {
      regressions.push({ suite: r.suite, baseline: b, current: r });
    } else if (!wasOk && isOk) {
      improvements.push({ suite: r.suite, baseline: b, current: r });
    } else {
      unchanged.push(r.suite);
    }
  });

  // Check for removed suites
  Object.keys(baseline.suites).forEach(s => {
    if (!results.find(r => r.suite === s)) {
      removedSuites.push(s);
    }
  });

  // Report
  if (!DIFF_MODE) {
    if (unchanged.length) {
      console.log(`\n✓ UNCHANGED (${unchanged.length}): ${unchanged.join(', ')}`);
    }
    if (improvements.length) {
      console.log(`\n↑ IMPROVED (${improvements.length}):`);
      improvements.forEach(({ suite, baseline: b, current: r }) => {
        console.log(`  ${suite}: exit ${b.exitCode}→${r.exitCode}, ${b.passed}→${r.passed} passed`);
      });
    }
    if (newSuites.length) {
      console.log(`\n+ NEW SUITES (${newSuites.length}):`);
      newSuites.forEach(r => console.log(`  ${r.suite}: ${r.passed}/${r.total} passed`));
    }
    if (removedSuites.length) {
      console.log(`\n- REMOVED SUITES (${removedSuites.length}): ${removedSuites.join(', ')}`);
    }
  }

  if (regressions.length) {
    console.log(`\n✗ REGRESSIONS (${regressions.length}):`);
    regressions.forEach(({ suite, baseline: b, current: r }) => {
      const exitChange = b.exitCode !== r.exitCode ? ` exit: ${b.exitCode}→${r.exitCode}` : '';
      const countChange = (b.passed !== null && r.passed !== null && b.passed !== r.passed)
        ? ` passed: ${b.passed}→${r.passed}` : '';
      console.log(`  ✗ ${suite}:${exitChange}${countChange}`);
    });
    console.log('');
    process.exit(1);
  } else {
    console.log('\n✓ No regressions detected.');
  }
}

// Main
console.log('GF Regression Replay Pack');
console.log(`Mode: ${CAPTURE_MODE ? 'CAPTURE' : 'COMPARE'}`);
console.log(`Suites directory: ${SUITES_DIR}\n`);

const suites = getSuites();
console.log(`Running ${suites.length} suites...`);

const results = suites.map(suite => {
  const r = runSuite(suite);
  const status = r.exitCode === 0 ? '✓' : '✗';
  const counts = r.passed !== null ? ` ${r.passed}/${r.total}` : '';
  process.stdout.write(`  ${status} ${suite}${counts} (${r.durationMs}ms)\n`);
  return r;
});

const passed = results.filter(r => r.exitCode === 0).length;
const failed = results.filter(r => r.exitCode !== 0).length;
console.log(`\nSummary: ${passed} pass, ${failed} fail of ${results.length} suites`);

if (CAPTURE_MODE) {
  captureBaseline(results);
} else {
  compareToBaseline(results);
}
