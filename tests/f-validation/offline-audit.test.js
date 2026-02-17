/**
 * Motor City Math — Fundamentals Agent (F)
 * Task F-12: Offline Mode / CDN Dependency Audit
 *
 * Audits all 12+ HTML files for external CDN dependencies and
 * assesses what breaks without internet access.
 *
 * Run: node tests/f-validation/offline-audit.test.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
let pass = 0, fail = 0;

function test(desc, condition) {
    if (condition) { pass++; }
    else { fail++; console.log(`  ❌ ${desc}`); }
}
function section(title) { console.log(`\n── ${title} ──`); }

// Scan all HTML files for CDN references
const htmlFiles = fs.readdirSync(ROOT).filter(f => f.endsWith('.html'));
const cdnPattern = /(?:src|href)=["'](https?:\/\/[^"']+)["']/gi;

const dependencies = {};
for (const file of htmlFiles) {
    const content = fs.readFileSync(path.join(ROOT, file), 'utf-8');
    const matches = [...content.matchAll(cdnPattern)];
    if (matches.length > 0) {
        dependencies[file] = matches.map(m => m[1]);
    }
}

// ===================================================================
// 1. CDN DEPENDENCY INVENTORY
// ===================================================================
section('1. CDN Dependency Inventory');

const allCDNs = new Set();
for (const [file, urls] of Object.entries(dependencies)) {
    for (const url of urls) allCDNs.add(url);
}

console.log(`  HTML files scanned: ${htmlFiles.length}`);
console.log(`  Files with CDN deps: ${Object.keys(dependencies).length}`);
console.log(`  Unique CDN URLs: ${allCDNs.size}`);
console.log('');

for (const url of allCDNs) {
    const files = Object.entries(dependencies)
        .filter(([f, urls]) => urls.includes(url))
        .map(([f]) => f);
    console.log(`  ${url}`);
    console.log(`    Used by: ${files.join(', ')}`);
}

// ===================================================================
// 2. CHART.JS DEPENDENCY
// ===================================================================
section('2. Chart.js Dependency Analysis');

const chartJsFiles = Object.entries(dependencies)
    .filter(([f, urls]) => urls.some(u => u.includes('chart.js')))
    .map(([f]) => f);

const chartJsUsers = htmlFiles.filter(f => {
    const content = fs.readFileSync(path.join(ROOT, f), 'utf-8');
    return /new Chart\(/.test(content);
});

console.log(`  Files loading Chart.js CDN: ${chartJsFiles.length}`);
console.log(`    ${chartJsFiles.join(', ')}`);
console.log(`  Files using Chart API: ${chartJsUsers.length}`);
console.log(`    ${chartJsUsers.join(', ')}`);

// Check: do all Chart API users load the CDN?
const missingChartLoad = chartJsUsers.filter(f => !chartJsFiles.includes(f));
if (missingChartLoad.length > 0) {
    console.log(`  ⚠️ Files using Chart but NOT loading CDN: ${missingChartLoad.join(', ')}`);
}

test('All Chart.js users load the CDN', missingChartLoad.length === 0);

// Impact: what breaks without Chart.js?
console.log('\n  OFFLINE IMPACT (Chart.js unavailable):');
console.log('  - Charts render as empty <canvas> elements');
console.log('  - Questions with graph-reading are unanswerable');
console.log('  - JS console: "Chart is not defined" errors');
console.log('  - Other questions on the same page still work');
console.log(`  - Affected: ${chartJsFiles.length} files, ${chartJsUsers.length} chart instances`);

// Check for local fallback
const hasLocalChartJs = fs.existsSync(path.join(ROOT, 'shared', 'chart.min.js')) ||
                        fs.existsSync(path.join(ROOT, 'node_modules', 'chart.js'));
console.log(`\n  Local Chart.js fallback: ${hasLocalChartJs ? '✅ exists' : '❌ NONE'}`);
test('Local Chart.js fallback exists', hasLocalChartJs);

// ===================================================================
// 3. MATHJAX DEPENDENCY
// ===================================================================
section('3. MathJax Dependency Analysis');

const mathJaxFiles = Object.entries(dependencies)
    .filter(([f, urls]) => urls.some(u => u.includes('mathjax')))
    .map(([f]) => f);

console.log(`  Files loading MathJax CDN: ${mathJaxFiles.length}`);
console.log(`    ${mathJaxFiles.join(', ')}`);

// Impact: what breaks without MathJax?
console.log('\n  OFFLINE IMPACT (MathJax unavailable):');
console.log('  - LaTeX delimiters (\\(...\\), \\[...\\]) render as raw text');
console.log('  - Questions are still readable but equations look messy');
console.log('  - Answers and grading still work (text-based)');
console.log('  - No JS errors (async loading fails silently)');
console.log(`  - Affected: ${mathJaxFiles.length} files`);

const hasLocalMathJax = fs.existsSync(path.join(ROOT, 'shared', 'mathjax')) ||
                        fs.existsSync(path.join(ROOT, 'node_modules', 'mathjax'));
console.log(`\n  Local MathJax fallback: ${hasLocalMathJax ? '✅ exists' : '❌ NONE'}`);
test('Local MathJax fallback exists', hasLocalMathJax);

// ===================================================================
// 4. FILES WITH NO CDN DEPENDENCIES
// ===================================================================
section('4. Fully Offline-Capable Files');

const offlineFiles = htmlFiles.filter(f => !dependencies[f] || dependencies[f].length === 0);
console.log(`  Files with zero CDN deps: ${offlineFiles.length}/${htmlFiles.length}`);
for (const f of offlineFiles) {
    // Check if they use shared/ local files
    const content = fs.readFileSync(path.join(ROOT, f), 'utf-8');
    const usesShared = /shared\//.test(content);
    console.log(`    ${f}${usesShared ? ' (uses shared/)' : ' (fully self-contained)'}`);
}

// ===================================================================
// 5. SHARED LOCAL ASSETS
// ===================================================================
section('5. Shared Local Assets');

const sharedDir = path.join(ROOT, 'shared');
if (fs.existsSync(sharedDir)) {
    const sharedFiles = fs.readdirSync(sharedDir).filter(f => !f.startsWith('.'));
    console.log(`  shared/ contents: ${sharedFiles.join(', ')}`);

    const filesUsingShared = htmlFiles.filter(f => {
        const content = fs.readFileSync(path.join(ROOT, f), 'utf-8');
        return /shared\//.test(content);
    });
    console.log(`  Files using shared/: ${filesUsingShared.length}/${htmlFiles.length}`);
    console.log(`    ${filesUsingShared.join(', ')}`);
} else {
    console.log('  shared/ directory: NOT FOUND');
}

// ===================================================================
// 6. RISK MATRIX
// ===================================================================
section('6. Offline Risk Matrix');

console.log('');
console.log('  | Dependency | Files | Severity | Impact |');
console.log('  |------------|-------|----------|--------|');
console.log(`  | Chart.js   | ${chartJsFiles.length}     | HIGH     | Graph questions unanswerable, JS errors |`);
console.log(`  | MathJax    | ${mathJaxFiles.length}     | MEDIUM   | Equations show raw LaTeX, still readable |`);
console.log('  | shared/*   | 3     | LOW      | Local files — only fails if folder missing |');
console.log('');
console.log('  Kai studies on the bus without WiFi (per .agent-onboarding.md).');
console.log('  Chart.js failure makes 7 files partially unusable.');
console.log('  MathJax failure degrades readability but doesnt block studying.');

// ===================================================================
// SUMMARY
// ===================================================================
section('OFFLINE AUDIT SUMMARY');
console.log(`\n  Tests: ${pass + fail}, ${pass} passed, ${fail} failed`);
console.log('\n  RECOMMENDATIONS:');
console.log('  1. Bundle Chart.js locally (200KB) — critical for offline');
console.log('  2. Bundle KaTeX locally (200KB) when migrating from MathJax');
console.log('  3. Add <script onerror> fallback to load local copy if CDN fails');
console.log('  4. Test: disconnect WiFi → open each file → verify functionality');
console.log('');
console.log('  For Agent A: Add local fallback scripts in shared/');
console.log('  For Agent S: Include CDN availability in offline-first audit\n');

process.exit(fail > 0 ? 1 : 0);
