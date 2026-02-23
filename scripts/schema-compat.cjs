#!/usr/bin/env node
/**
 * scripts/schema-compat.cjs
 *
 * Computes a "schema compatibility score" between two practice exam JSON files.
 * Inspired by Hamming distance: what fraction of fields are shared vs. divergent?
 *
 * Usage:
 *   node scripts/schema-compat.cjs data/retake-practice-1.json data/retake-practice-10.json
 *   node scripts/schema-compat.cjs --all           # compare all adjacent exam pairs
 *   node scripts/schema-compat.cjs --matrix        # print full NxN compatibility matrix
 *
 * Output:
 *   - Shared fields (present in both, same type)
 *   - Missing fields (in A but not B, or B but not A)
 *   - Type divergence (present in both but different types)
 *   - Compatibility score: shared / (shared + missing + divergent)
 *
 * GI learning plan task 16: Hamming-distance equivalent for data schemas.
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'data');
const EXAM_PATTERN = /^retake-practice-\d+\.json$/;

const showAll = process.argv.includes('--all');
const showMatrix = process.argv.includes('--matrix');

function typeOf(val) {
  if (val === null) return 'null';
  if (Array.isArray(val)) return 'array';
  return typeof val;
}

/**
 * Compute a flat field signature for a JSON object.
 * Keys are dot-notation paths, values are type strings.
 * Arrays are represented by their element type at [0].
 */
function fieldSignature(obj, prefix = '') {
  const sig = {};
  for (const [key, val] of Object.entries(obj || {})) {
    const path = prefix ? `${prefix}.${key}` : key;
    const t = typeOf(val);
    if (t === 'object') {
      // Recurse one level for nested objects
      Object.assign(sig, fieldSignature(val, path));
    } else if (t === 'array' && val.length > 0 && typeOf(val[0]) === 'object') {
      // For arrays of objects, record the array type and recurse into first element
      sig[path] = 'array<object>';
      Object.assign(sig, fieldSignature(val[0], `${path}[]`));
    } else {
      sig[path] = t;
    }
  }
  return sig;
}

/**
 * Compute compatibility score between two field signatures.
 * Returns: { score, shared, missingInB, missingInA, diverged, details }
 */
function compareSignatures(sigA, sigB, nameA, nameB) {
  const allKeys = new Set([...Object.keys(sigA), ...Object.keys(sigB)]);
  const shared = [];
  const missingInB = [];
  const missingInA = [];
  const diverged = [];

  for (const key of allKeys) {
    const inA = key in sigA;
    const inB = key in sigB;
    if (inA && inB) {
      if (sigA[key] === sigB[key]) {
        shared.push(key);
      } else {
        diverged.push({ key, typeA: sigA[key], typeB: sigB[key] });
      }
    } else if (inA && !inB) {
      missingInB.push(key);
    } else {
      missingInA.push(key);
    }
  }

  const total = shared.length + missingInB.length + missingInA.length + diverged.length;
  const score = total === 0 ? 1 : shared.length / total;

  return { score, shared, missingInB, missingInA, diverged, nameA, nameB };
}

function loadExam(filepath) {
  return JSON.parse(fs.readFileSync(filepath, 'utf8'));
}

function printComparison(result, verbose = true) {
  const pct = (result.score * 100).toFixed(1);
  const grade = result.score >= 0.95 ? '✅' : result.score >= 0.80 ? '⚠️ ' : '❌';
  console.log(`\n${grade} ${result.nameA} ↔ ${result.nameB}: ${pct}% compatible`);
  console.log(`   Shared: ${result.shared.length} | Missing in B: ${result.missingInB.length} | Missing in A: ${result.missingInA.length} | Type diverged: ${result.diverged.length}`);

  if (!verbose) return;

  if (result.missingInB.length > 0) {
    console.log(`   In ${result.nameA} but not ${result.nameB}:`);
    result.missingInB.forEach((k) => console.log(`     - ${k}`));
  }
  if (result.missingInA.length > 0) {
    console.log(`   In ${result.nameB} but not ${result.nameA}:`);
    result.missingInA.forEach((k) => console.log(`     + ${k}`));
  }
  if (result.diverged.length > 0) {
    console.log(`   Type divergence:`);
    result.diverged.forEach(({ key, typeA, typeB }) =>
      console.log(`     ~ ${key}: ${typeA} vs ${typeB}`)
    );
  }
}

// --- Main ---

const positionalArgs = process.argv.slice(2).filter((a) => !a.startsWith('--'));

if (showMatrix || showAll) {
  // Load all exams
  const examFiles = fs.readdirSync(DATA_DIR)
    .filter((f) => EXAM_PATTERN.test(f))
    .sort();

  const exams = examFiles.map((f) => {
    const data = loadExam(path.join(DATA_DIR, f));
    // Build signature from top-level fields only (not questions array content) for matrix view
    const topSig = fieldSignature(data);
    // Build deeper signature including one question as representative
    const qSig = data.questions && data.questions.length > 0
      ? fieldSignature(data.questions[0], 'questions[]')
      : {};
    return { name: f.replace('.json', ''), sig: { ...topSig, ...qSig } };
  });

  if (showMatrix) {
    console.log('\nSchema Compatibility Matrix (% shared fields)\n');
    const names = exams.map((e) => e.name.replace('retake-practice-', 'RP'));
    const header = '              ' + names.map((n) => n.padEnd(6)).join(' ');
    console.log(header);

    for (let i = 0; i < exams.length; i++) {
      let row = (names[i] + ':').padEnd(14);
      for (let j = 0; j < exams.length; j++) {
        if (i === j) {
          row += '100%  ';
        } else {
          const r = compareSignatures(exams[i].sig, exams[j].sig, exams[i].name, exams[j].name);
          row += (r.score * 100).toFixed(0).padStart(4) + '% ';
        }
      }
      console.log(row);
    }
  } else {
    // --all: adjacent pairs
    for (let i = 0; i < exams.length - 1; i++) {
      const result = compareSignatures(exams[i].sig, exams[i + 1].sig, exams[i].name, exams[i + 1].name);
      printComparison(result, true);
    }
  }
} else if (positionalArgs.length === 2) {
  // Two specific files
  const [fileA, fileB] = positionalArgs;
  const dataA = loadExam(fileA);
  const dataB = loadExam(fileB);

  const topSigA = fieldSignature(dataA);
  const topSigB = fieldSignature(dataB);
  const qSigA = dataA.questions && dataA.questions.length > 0
    ? fieldSignature(dataA.questions[0], 'questions[]')
    : {};
  const qSigB = dataB.questions && dataB.questions.length > 0
    ? fieldSignature(dataB.questions[0], 'questions[]')
    : {};

  const sigA = { ...topSigA, ...qSigA };
  const sigB = { ...topSigB, ...qSigB };
  const nameA = path.basename(fileA, '.json');
  const nameB = path.basename(fileB, '.json');

  const result = compareSignatures(sigA, sigB, nameA, nameB);
  printComparison(result, true);
  console.log('');
} else {
  console.log('Usage:');
  console.log('  node scripts/schema-compat.cjs <fileA.json> <fileB.json>   # compare two exams');
  console.log('  node scripts/schema-compat.cjs --all                        # adjacent pairs');
  console.log('  node scripts/schema-compat.cjs --matrix                     # full NxN matrix');
  process.exit(1);
}
