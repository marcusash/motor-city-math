#!/usr/bin/env node
/**
 * gi-progress-report.cjs
 * Generates a Markdown progress summary for Marcus.
 * Shows: exam corpus status, standards coverage, CI gate result, recent artifacts.
 * Usage: node scripts/gi-progress-report.cjs [--save]
 */

'use strict';

const fs   = require('fs');
const path = require('path');

const ROOT       = path.join(__dirname, '..');
const DATA_DIR   = path.join(ROOT, 'data');
const ART_DIR    = path.join(ROOT, 'artifacts');
const SAVE_FLAG  = process.argv.includes('--save');
const OUT_FILE   = path.join(ART_DIR, 'gi-progress-report.md');

// ── helpers ─────────────────────────────────────────────────────────────────

function loadExams() {
  const exams = [];
  for (let i = 1; i <= 15; i++) {
    const f = path.join(DATA_DIR, `retake-practice-${i}.json`);
    if (fs.existsSync(f)) {
      exams.push({ file: `retake-practice-${i}.json`, ...JSON.parse(fs.readFileSync(f, 'utf8')) });
    }
  }
  return exams;
}

function artifact(name) {
  const f = path.join(ART_DIR, name);
  return fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : null;
}

function mdArt(name) {
  const f = path.join(ART_DIR, name);
  return fs.existsSync(f) ? fs.readFileSync(f, 'utf8').trim() : null;
}

// ── main ─────────────────────────────────────────────────────────────────────

const exams = loadExams();
const now   = new Date().toISOString().slice(0, 10);
const lines = [];

lines.push(`# GI Progress Report`);
lines.push(`**Generated:** ${now}  |  **Exams:** ${exams.length}/15`);
lines.push('');

// ── Exam corpus table ─────────────────────────────────────────────────────
lines.push('## Exam Corpus');
lines.push('');
lines.push('| Exam | Questions | Version | schema_version | fr_approved |');
lines.push('|------|-----------|---------|----------------|-------------|');
for (const e of exams) {
  const qCount = Array.isArray(e.questions) ? e.questions.length : '?';
  const ver    = e.version !== undefined ? e.version : '-';
  const sv     = e.schema_version || '-';
  const fr     = e.fr_approved !== undefined ? (e.fr_approved ? 'YES' : 'NO') : '-';
  lines.push(`| ${e.file.replace('retake-practice-', 'RP').replace('.json','')} | ${qCount} | ${ver} | ${sv} | ${fr} |`);
}
lines.push('');

// ── Standards coverage ───────────────────────────────────────────────────
const cc = artifact('concept-coverage.json');
if (cc) {
  lines.push('## Standards Coverage');
  lines.push('');
  lines.push('| Standard | Count | Threshold | Status |');
  lines.push('|----------|-------|-----------|--------|');
  for (const [std, data] of Object.entries(cc.by_standard || {})) {
    const count = data.count || data;
    const thresh = 5;
    const status = count >= thresh ? 'OK' : `BELOW (need ${thresh - count} more)`;
    lines.push(`| ${std} | ${count} | ${thresh} | ${status} |`);
  }
  lines.push('');
} else {
  lines.push('## Standards Coverage\n\n_Run `node scripts/concept-coverage.cjs` to generate._\n');
}

// ── Answer space density ────────────────────────────────────────────────
const asd = artifact('answer-space-density.json');
if (asd) {
  lines.push('## Answer Space Density (top-used per standard)');
  lines.push('');
  lines.push('Shows integer answer values already used — GR should avoid repeats.');
  lines.push('');
  lines.push('| Standard | Used values (top 10) |');
  lines.push('|----------|----------------------|');
  for (const [std, vals] of Object.entries(asd.by_standard || {})) {
    const sorted = Object.entries(vals).sort((a,b)=>b[1]-a[1]).slice(0,10).map(([v])=>v);
    lines.push(`| ${std} | ${sorted.join(', ')} |`);
  }
  lines.push('');
}

// ── Item difficulty ──────────────────────────────────────────────────────
const idArt = mdArt('item-difficulty-latest.md');
if (idArt) {
  lines.push('## Item Difficulty (latest snapshot)');
  lines.push('');
  // Extract just the table section
  const tableStart = idArt.indexOf('|');
  if (tableStart >= 0) {
    const tableLines = idArt.slice(tableStart).split('\n').slice(0, 20);
    lines.push(...tableLines);
  }
  lines.push('');
}

// ── Score velocity ───────────────────────────────────────────────────────
const svArt = mdArt('score-velocity-latest.md');
if (svArt) {
  lines.push('## Score Velocity (Kai\'s recent scores)');
  lines.push('');
  lines.push(svArt.split('\n').slice(0, 10).join('\n'));
  lines.push('');
}

// ── CI gate summary ──────────────────────────────────────────────────────
lines.push('## CI Gate');
lines.push('');
lines.push('Run `node scripts/ci-data-gate.cjs` to get current gate status.');
lines.push('Baseline: **781ms**, exits 0 on clean corpus.');
lines.push('');

// ── Output ───────────────────────────────────────────────────────────────
const report = lines.join('\n');

if (SAVE_FLAG) {
  if (!fs.existsSync(ART_DIR)) fs.mkdirSync(ART_DIR, { recursive: true });
  fs.writeFileSync(OUT_FILE, report, 'utf8');
  console.log(`Saved: ${path.relative(ROOT, OUT_FILE)}`);
} else {
  console.log(report);
}
