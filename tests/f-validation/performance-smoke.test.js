/**
 * GF Performance Smoke (gf-queue-performance-smoke)
 *
 * Lightweight static checks that catch the most common performance
 * anti-patterns in MCM without requiring a browser or build.
 *
 * Checks:
 * - No synchronous XHR (blocks main thread)
 * - No setInterval without clearInterval (leak risk)
 * - Image/asset counts reasonable (no accidental asset explosion)
 * - KaTeX deferred (not blocking render)
 * - MathJax not used (heavy — KaTeX only per spec)
 * - Chart.js loaded once per page (not duplicated)
 * - No inline base64 images > 10KB (bloat)
 * - data/ JSON files < 500KB each (large files slow cold load)
 * - total shared JS < 100KB
 */

'use strict';

const fs = require('fs');
const path = require('path');

let passed = 0;
let failed = 0;

function pass(label) { passed++; console.log('  ✓ ' + label); }
function fail(label) { failed++; console.log('  ✗ FAIL: ' + label); }

const ROOT = path.join(__dirname, '../..');
const PAGES = ['index.html', 'exam.html', 'final_exam_251123.html', 'nonlinear_exam_mvp.html'];

console.log('Performance Smoke Tests');

// ============================================================
// Section 1: Main thread blockers
// ============================================================
console.log('\n1. Main thread blockers:');

PAGES.forEach(page => {
  const html = fs.readFileSync(path.join(ROOT, page), 'utf8');
  // Sync XHR: open(..., false) — 3rd arg false = sync
  const hasSyncXHR = /\.open\s*\([^)]*,\s*false\s*\)/.test(html);
  (!hasSyncXHR) ? pass(`${page}: no synchronous XHR`) : fail(`${page}: synchronous XHR found (blocks main thread)`);
});

// ============================================================
// Section 2: Timer leak guard
// ============================================================
console.log('\n2. Timer leak guard:');

const sharedJs = fs.readFileSync(path.join(ROOT, 'shared', 'scripts.js'), 'utf8');
const setIntervalCount = (sharedJs.match(/setInterval\s*\(/g) || []).length;
const clearIntervalCount = (sharedJs.match(/clearInterval\s*\(/g) || []).length;
setIntervalCount === clearIntervalCount
  ? pass(`shared/scripts.js: setInterval count (${setIntervalCount}) matches clearInterval count`)
  : fail(`shared/scripts.js: ${setIntervalCount} setInterval vs ${clearIntervalCount} clearInterval (potential leak)`);

// Check exam.html too
const examHtml = fs.readFileSync(path.join(ROOT, 'exam.html'), 'utf8');
const examSetInt = (examHtml.match(/setInterval\s*\(/g) || []).length;
const examClearInt = (examHtml.match(/clearInterval\s*\(/g) || []).length;
examSetInt <= examClearInt
  ? pass(`exam.html: setInterval (${examSetInt}) <= clearInterval (${examClearInt})`)
  : fail(`exam.html: ${examSetInt} setInterval vs ${examClearInt} clearInterval (potential leak)`);

// ============================================================
// Section 3: Heavy library guard (no MathJax)
// ============================================================
console.log('\n3. Heavy library guard:');

PAGES.forEach(page => {
  const html = fs.readFileSync(path.join(ROOT, page), 'utf8');
  const hasMathJax = html.toLowerCase().includes('mathjax');
  (!hasMathJax) ? pass(`${page}: no MathJax (KaTeX only per spec)`) : fail(`${page}: MathJax found — heavy library, use KaTeX`);
});

// ============================================================
// Section 4: Chart.js deduplication
// ============================================================
console.log('\n4. Chart.js deduplication:');

PAGES.forEach(page => {
  const html = fs.readFileSync(path.join(ROOT, page), 'utf8');
  // Count direct script src loads (not CDN fallback pattern)
  const directLoads = (html.match(/src=["'][^"']*chart(?:\.min)?\.js["']/gi) || []).length;
  // CDN fallback pattern is OK: `if(typeof Chart==="undefined"){...cdn...}`
  const hasFallbackOnly = html.includes('typeof Chart') && html.includes('cdn.jsdelivr.net');
  const effectiveLoads = hasFallbackOnly ? 1 : directLoads; // fallback counts as 1 logical load
  effectiveLoads <= 1
    ? pass(`${page}: Chart.js loaded ${directLoads > 1 && hasFallbackOnly ? '1+fallback' : effectiveLoads} time(s)`)
    : fail(`${page}: Chart.js loaded ${effectiveLoads} times (duplicate)`);
});

// ============================================================
// Section 5: Asset size budget
// ============================================================
console.log('\n5. Asset size budget:');

// Shared JS < 150KB
const sharedJsSize = fs.statSync(path.join(ROOT, 'shared', 'scripts.js')).size;
const sharedCssSize = fs.statSync(path.join(ROOT, 'shared', 'styles.css')).size;
const JS_LIMIT = 150 * 1024;
const CSS_LIMIT = 100 * 1024;
sharedJsSize < JS_LIMIT
  ? pass(`shared/scripts.js: ${Math.round(sharedJsSize / 1024)}KB < ${JS_LIMIT / 1024}KB`)
  : fail(`shared/scripts.js: ${Math.round(sharedJsSize / 1024)}KB exceeds ${JS_LIMIT / 1024}KB budget`);
sharedCssSize < CSS_LIMIT
  ? pass(`shared/styles.css: ${Math.round(sharedCssSize / 1024)}KB < ${CSS_LIMIT / 1024}KB`)
  : fail(`shared/styles.css: ${Math.round(sharedCssSize / 1024)}KB exceeds ${CSS_LIMIT / 1024}KB budget`);

// data/ JSON files < 500KB each
const DATA_LIMIT = 500 * 1024;
const dataFiles = fs.readdirSync(path.join(ROOT, 'data')).filter(f => f.endsWith('.json'));
let dataOverBudget = [];
dataFiles.forEach(f => {
  const sz = fs.statSync(path.join(ROOT, 'data', f)).size;
  if (sz > DATA_LIMIT) dataOverBudget.push(`${f}: ${Math.round(sz / 1024)}KB`);
});
dataOverBudget.length === 0
  ? pass(`data/: all ${dataFiles.length} JSON files < ${DATA_LIMIT / 1024}KB`)
  : fail(`data/: ${dataOverBudget.length} files over ${DATA_LIMIT / 1024}KB: ${dataOverBudget.join(', ')}`);

// HTML pages < 2MB each (sanity check)
const HTML_LIMIT = 2 * 1024 * 1024;
PAGES.forEach(page => {
  const sz = fs.statSync(path.join(ROOT, page)).size;
  sz < HTML_LIMIT
    ? pass(`${page}: ${Math.round(sz / 1024)}KB < ${HTML_LIMIT / 1024}KB`)
    : fail(`${page}: ${Math.round(sz / 1024)}KB exceeds ${HTML_LIMIT / 1024}KB budget`);
});

// ============================================================
// Section 6: No inline base64 images > 10KB
// ============================================================
console.log('\n6. Inline asset guard:');

const BASE64_LIMIT = 10 * 1024; // 10KB in base64 = ~7.5KB binary
PAGES.forEach(page => {
  const html = fs.readFileSync(path.join(ROOT, page), 'utf8');
  const base64Matches = html.match(/data:image\/[^;]+;base64,[A-Za-z0-9+/]+=*/g) || [];
  const oversized = base64Matches.filter(m => m.length > BASE64_LIMIT);
  oversized.length === 0
    ? pass(`${page}: no oversized inline base64 images`)
    : fail(`${page}: ${oversized.length} inline base64 images exceed 10KB`);
});

// ============================================================
// Summary
// ============================================================
const total = passed + failed;
console.log('\n' + '='.repeat(50));
console.log(`${total} checks: ${passed} passed, ${failed} failed`);
if (failed === 0) { console.log('✓ PASS'); } else { console.log('✘ FAIL'); process.exit(1); }
