/**
 * Motor City Math — Pre-commit Safety Check
 * PM-3 from postmortem: prevent regressions
 *
 * Checks ALL staged HTML files for:
 *   (a) polyfill.io references — compromised CDN (B-F4 blocker)
 *   (b) CDN URLs when local bundles exist (KaTeX → shared/katex/, Chart.js → shared/chart.min.js)
 *   (c) File size decrease >20% on protected files (nonlinear_exam_mvp.html, shared/scripts.js, etc.)
 *
 * Usage:
 *   node tests/f-validation/pre-commit-check.js          # check staged files
 *   node tests/f-validation/pre-commit-check.js --all     # check ALL html files
 *
 * Exit code: 0 = pass, 1 = blocked (must fix), 2 = warnings only
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
const checkAll = process.argv.includes('--all');

let blocked = 0, warned = 0;

function block(file, msg) {
    blocked++;
    console.log(`  🔴 BLOCKED: ${file} — ${msg}`);
}
function warn(file, msg) {
    warned++;
    console.log(`  ⚠️  WARNING: ${file} — ${msg}`);
}

// ===================================================================
// GET FILES TO CHECK
// ===================================================================

let filesToCheck = [];

if (checkAll) {
    // Check all HTML files in repo
    filesToCheck = fs.readdirSync(ROOT)
        .filter(f => f.endsWith('.html'))
        .map(f => path.join(ROOT, f));
    // Also check shared JS/CSS
    ['shared/scripts.js', 'shared/styles.css'].forEach(f => {
        const p = path.join(ROOT, f);
        if (fs.existsSync(p)) filesToCheck.push(p);
    });
} else {
    // Check only staged files
    try {
        const staged = execSync('git diff --cached --name-only --diff-filter=ACMR', {
            cwd: ROOT, encoding: 'utf-8'
        }).trim();
        if (!staged) {
            console.log('  No staged files. Skipping checks.');
            process.exit(0);
        }
        filesToCheck = staged.split('\n')
            .filter(f => f.endsWith('.html') || f.endsWith('.js') || f.endsWith('.css'))
            .map(f => path.join(ROOT, f));
    } catch (e) {
        // Not in a git repo or git not available — fall back to --all
        console.log('  Cannot read staged files, checking all HTML...');
        filesToCheck = fs.readdirSync(ROOT)
            .filter(f => f.endsWith('.html'))
            .map(f => path.join(ROOT, f));
    }
}

console.log(`\nChecking ${filesToCheck.length} files...\n`);

// ===================================================================
// (a) POLYFILL.IO — Compromised CDN (B-F4 blocker)
// ===================================================================

console.log('── Check (a): polyfill.io references ──');

for (const filePath of filesToCheck) {
    if (!fs.existsSync(filePath)) continue;
    const content = fs.readFileSync(filePath, 'utf-8');
    const fileName = path.relative(ROOT, filePath);

    // Check for compromised CDN — split string to avoid self-detection
    var bannedCdn = 'polyfill' + '.io';
    if (content.includes(bannedCdn)) {
        // Skip self (this file contains the string as a check target)
        if (!fileName.includes('pre-commit-check') && !fileName.includes('f-validation')) {
            block(fileName, 'Contains ' + bannedCdn + ' reference — compromised CDN (B-F4)');
        }
    }
}

// ===================================================================
// (b) CDN URLs when local bundles exist
// ===================================================================

console.log('\n── Check (b): CDN URLs with local alternatives ──');

const cdnChecks = [
    {
        pattern: /cdn\.jsdelivr\.net.*mathjax/i,
        local: 'shared/katex/',
        name: 'MathJax CDN (local KaTeX bundle at shared/katex/)',
        severity: 'block'
    },
    {
        pattern: /cdn\.jsdelivr\.net.*katex/i,
        local: 'shared/katex/',
        name: 'KaTeX CDN (local bundle at shared/katex/)',
        severity: 'block'
    },
    {
        pattern: /cdn\.jsdelivr\.net.*chart\.js/i,
        local: 'shared/chart.min.js',
        name: 'Chart.js CDN (local bundle at shared/chart.min.js)',
        severity: 'warn'
    }
];

for (const filePath of filesToCheck) {
    if (!fs.existsSync(filePath)) continue;
    const content = fs.readFileSync(filePath, 'utf-8');
    const fileName = path.relative(ROOT, filePath);

    // Skip test/validation files (contain CDN strings as check targets)
    if (fileName.includes('f-validation')) continue;

    for (const check of cdnChecks) {
        if (check.pattern.test(content)) {
            // Verify local bundle exists
            if (fs.existsSync(path.join(ROOT, check.local))) {
                if (check.severity === 'block') {
                    block(fileName, `Uses ${check.name} — local bundle exists`);
                } else {
                    warn(fileName, `Uses ${check.name} — migrate to local`);
                }
            } else {
                warn(fileName, `Uses CDN for ${check.name} but local bundle not found`);
            }
        }
    }
}

// ===================================================================
// (b2) HTML STRUCTURE — duplicate tags (PM2-1: Agent A corruption)
// ===================================================================

console.log('\n── Check (b2): HTML structure (duplicate tags) ──');

for (const filePath of filesToCheck) {
    if (!fs.existsSync(filePath)) continue;
    if (!filePath.endsWith('.html')) continue;
    const content = fs.readFileSync(filePath, 'utf-8');
    const fileName = path.relative(ROOT, filePath);

    // Count structural tags — should each appear exactly once
    const structChecks = [
        { tag: '<body', regex: /<body[\s>]/gi, max: 1 },
        { tag: '</body>', regex: /<\/body>/gi, max: 1 },
        { tag: '<head', regex: /<head[\s>]/gi, max: 1 },
        { tag: '</head>', regex: /<\/head>/gi, max: 1 },
        { tag: '<!DOCTYPE', regex: /<!DOCTYPE/gi, max: 1 },
        { tag: '<html', regex: /<html[\s>]/gi, max: 1 },
        { tag: '</html>', regex: /<\/html>/gi, max: 1 }
    ];

    for (const { tag, regex, max } of structChecks) {
        const matches = content.match(regex);
        const count = matches ? matches.length : 0;
        if (count > max) {
            block(fileName, `Duplicate ${tag} found (${count}x) — corrupted HTML structure`);
        }
    }
}

// ===================================================================
// (c) FILE SIZE DECREASE >20% on protected files
// ===================================================================

console.log('\n── Check (c): File size protection ──');

const PROTECTED_FILES = [
    'nonlinear_exam_mvp.html',
    'shared/scripts.js',
    'shared/styles.css',
    'index.html',
    'index_calc.html',
    'final_exam_251123.html'
];

for (const relFile of PROTECTED_FILES) {
    const filePath = path.join(ROOT, relFile);
    if (!fs.existsSync(filePath)) continue;

    // Only check if this file is staged
    const isStaged = filesToCheck.some(f => path.relative(ROOT, f) === relFile.replace(/\//g, path.sep));
    if (!isStaged && !checkAll) continue;

    try {
        // Get committed size
        const committedContent = execSync(`git show HEAD:${relFile}`, {
            cwd: ROOT, encoding: 'utf-8'
        });
        const committedSize = committedContent.length;
        const currentSize = fs.readFileSync(filePath, 'utf-8').length;

        if (committedSize > 0 && currentSize < committedSize * 0.8) {
            const pctDrop = Math.round((1 - currentSize / committedSize) * 100);
            block(relFile, `Size decreased ${pctDrop}% (${committedSize} → ${currentSize} chars). Possible full-file overwrite.`);
        }
    } catch (e) {
        // File not in git yet or other error — skip
    }
}

// ===================================================================
// BONUS: Check for hardcoded hex that should use tokens
// ===================================================================

console.log('\n── Check (bonus): Hardcoded hex in new code ──');

const BANNED_HEX = [
    { hex: '#e0e0e0', note: 'use --border-subtle' },
    { hex: '#f5f5f5', note: 'use --bg-page' },
    { hex: '#333333', note: 'use --text-primary' },
    { hex: '#666666', note: 'use --text-secondary' },
    { hex: '#8B1E3F', note: 'old burgundy — use Pistons palette' }
];

for (const filePath of filesToCheck) {
    if (!fs.existsSync(filePath)) continue;
    if (!filePath.endsWith('.html') && !filePath.endsWith('.css')) continue;
    const content = fs.readFileSync(filePath, 'utf-8');
    const fileName = path.relative(ROOT, filePath);

    for (const { hex, note } of BANNED_HEX) {
        if (content.toLowerCase().includes(hex.toLowerCase())) {
            warn(fileName, `Contains hardcoded ${hex} — ${note}`);
        }
    }
}

// ===================================================================
// SUMMARY
// ===================================================================

console.log('\n── SAFETY CHECK SUMMARY ──');
console.log(`  Files checked: ${filesToCheck.length}`);
console.log(`  Blocked: ${blocked}, Warnings: ${warned}`);

if (blocked > 0) {
    console.log('\n  ❌ COMMIT BLOCKED — fix the 🔴 issues above before committing.\n');
    process.exit(1);
} else if (warned > 0) {
    console.log('\n  ⚠️  Warnings found — review before committing.\n');
    process.exit(0); // Warnings don't block
} else {
    console.log('\n  ✅ All clear.\n');
    process.exit(0);
}
