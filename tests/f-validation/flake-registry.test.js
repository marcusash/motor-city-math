/**
 * flake-registry.test.js
 * GF gf-skill-14: Validates the MCM QA flake registry schema and reports
 * entry states. Surfaces blocked suites and unresolved flakes in CI output.
 */

'use strict';

const fs = require('fs');
const path = require('path');

const REGISTRY_PATH = path.resolve(__dirname, '..', 'flake-registry.json');
const REQUIRED_FIELDS = ['id', 'suite', 'test', 'type', 'root_cause', 'repro_rate', 'status', 'resolution', 'first_seen'];
const VALID_TYPES = ['environment', 'data-dependent', 'timing', 'logic', 'network'];
const VALID_STATUSES = ['blocked', 'known-safe', 'active', 'suppressed', 'resolved'];

let passed = 0;
let failed = 0;
const warnings = [];

function pass(msg) {
  console.log(`  \u2713 ${msg}`);
  passed++;
}

function fail(msg) {
  console.error(`  \u2717 FAIL: ${msg}`);
  failed++;
}

function warn(msg) {
  warnings.push(msg);
}

console.log('\nFlake Registry Audit\n');

// 1. Registry file exists and parses
let registry;
try {
  const raw = fs.readFileSync(REGISTRY_PATH, 'utf8');
  registry = JSON.parse(raw);
  pass('flake-registry.json: exists and parses');
} catch (e) {
  fail(`flake-registry.json: ${e.message}`);
  process.exit(1);
}

// 2. Schema version present
if (registry.schema_version) {
  pass(`schema_version present: ${registry.schema_version}`);
} else {
  fail('schema_version missing');
}

// 3. Entries array exists
if (Array.isArray(registry.entries)) {
  pass(`entries array: ${registry.entries.length} entry(s)`);
} else {
  fail('entries field is not an array');
  process.exit(1);
}

// 4. Validate each entry
for (const entry of registry.entries) {
  const label = entry.id || '(no id)';

  // Required fields
  for (const field of REQUIRED_FIELDS) {
    if (!entry[field]) {
      fail(`${label}: missing required field "${field}"`);
    }
  }

  // Type enum
  if (entry.type && !VALID_TYPES.includes(entry.type)) {
    fail(`${label}: invalid type "${entry.type}" (expected: ${VALID_TYPES.join(', ')})`);
  }

  // Status enum
  if (entry.status && !VALID_STATUSES.includes(entry.status)) {
    fail(`${label}: invalid status "${entry.status}" (expected: ${VALID_STATUSES.join(', ')})`);
  }

  // Suite file exists (skip Playwright specs — they may be present but unrunnable)
  if (entry.suite && !entry.suite.endsWith('.spec.js')) {
    const suitePath = path.resolve(__dirname, '..', entry.suite.replace(/^tests\//, ''));
    if (!fs.existsSync(suitePath)) {
      warn(`${label}: suite file not found: ${entry.suite}`);
    }
  }

  // Flag any 'active' status entries as needing attention
  if (entry.status === 'active') {
    warn(`${label}: ACTIVE flake — ${entry.suite} / "${entry.test}" (repro: ${entry.repro_rate})`);
  }

  if (failed === 0) {
    pass(`${label}: schema valid (status: ${entry.status})`);
  }
}

// 5. Report blocked suites prominently
const blocked = registry.entries.filter(e => e.status === 'blocked');
if (blocked.length > 0) {
  console.log(`\n  \u26A0  ${blocked.length} blocked suite(s) — require infrastructure fix:`);
  for (const b of blocked) {
    console.log(`     - ${b.suite}: ${b.resolution}`);
  }
}

// 6. Suppressed array exists
if (Array.isArray(registry.suppressed)) {
  pass(`suppressed array: ${registry.suppressed.length} entry(s)`);
} else {
  fail('suppressed field is not an array');
}

// 7. Resolved array exists
if (Array.isArray(registry.resolved)) {
  pass(`resolved array: ${registry.resolved.length} entry(s)`);
} else {
  fail('resolved field is not an array');
}

// Warnings summary
if (warnings.length > 0) {
  console.log('\n  Warnings:');
  for (const w of warnings) {
    console.log(`    W: ${w}`);
  }
}

console.log(`\n${'='.repeat(50)}`);
console.log(`${passed + failed} checks: ${passed} passed, ${failed} failed`);
if (failed > 0) {
  console.error('\u2718 FAIL');
  process.exit(1);
} else {
  console.log('\u2714 PASS');
}
