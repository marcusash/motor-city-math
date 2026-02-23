#!/usr/bin/env node
// GP Pre-commit hook — runs quality checks on staged files
// Checks: 1) polyfill.io ban, 2) multiple <html> tags, 3) JSON parse,
//         4) feedback_correct present in RP files, 5) duplicate answers in RP files
//         6) localStorage key collisions, 7) critical file deletion guard,
//         8) RP JSON schema validation

const { execSync } = require('child_process');
const fs = require('fs'), path = require('path');

let failed = 0;

function getStagedFiles(pattern) {
  try {
    return execSync(`git diff --cached --name-only --diff-filter=ACM`, { encoding: 'utf8' })
      .split('\n').filter(f => f.trim() && (!pattern || f.match(pattern)));
  } catch { return []; }
}

// CHECK 1: polyfill.io ban
const htmlFiles = getStagedFiles(/\.html$/);
for (const f of htmlFiles) {
  try {
    const content = fs.readFileSync(f, 'utf8');
    if (content.includes('polyfill.io')) {
      console.error(`\nPRE-COMMIT FAIL: polyfill.io found in ${f} — known compromised CDN. Remove it.`);
      failed++;
    }
  } catch {}
}

// CHECK 2: multiple <html> tags in staged HTML (corruption detector)
for (const f of htmlFiles) {
  try {
    const content = fs.readFileSync(f, 'utf8');
    const count = (content.match(/<html/gi) || []).length;
    if (count > 1) {
      console.error(`\nPRE-COMMIT FAIL: ${f} has ${count} <html> tags — file may be corrupted.`);
      failed++;
    }
  } catch {}
}

// CHECK 3: JSON parse check on staged data files
const jsonFiles = getStagedFiles(/^data\/.*\.json$/);
for (const f of jsonFiles) {
  try {
    JSON.parse(fs.readFileSync(f, 'utf8'));
  } catch (e) {
    console.error(`\nPRE-COMMIT FAIL: ${f} is invalid JSON: ${e.message}`);
    failed++;
  }
}

// CHECK 4: feedback_correct present in staged RP files
const rpFiles = getStagedFiles(/^data\/retake-practice-\d+\.json$/);
for (const f of rpFiles) {
  try {
    const json = JSON.parse(fs.readFileSync(f, 'utf8'));
    for (const q of (json.questions || [])) {
      if (!q.feedback_correct) {
        console.error(`\nPRE-COMMIT FAIL: ${f} question ${q.id} missing feedback_correct`);
        failed++;
      }
    }
  } catch {}
}

// CHECK 5: duplicate single-input answers in staged RP files
for (const f of rpFiles) {
  try {
    const json = JSON.parse(fs.readFileSync(f, 'utf8'));
    const seen = {};
    const singles = (json.questions || []).filter(q => (q.inputs || []).length === 1);
    for (const q of singles) {
      const a = String(q.inputs[0].answer);
      if (seen[a]) {
        console.error(`\nPRE-COMMIT WARN: ${f} duplicate answer=${a} on ${q.id} and ${seen[a]} — verify intentional`);
      } else seen[a] = q.id;
    }
  } catch {}
}

// CHECK 6: localStorage key collision across staged HTML/JS
const jsHtmlFiles = getStagedFiles(/\.(html|js)$/);
const localStorageKeys = {};
for (const f of jsHtmlFiles) {
  try {
    const content = fs.readFileSync(f, 'utf8');
    const matches = content.matchAll(/localStorage\.(setItem|getItem|removeItem)\(['"]([^'"]+)['"]/g);
    for (const m of matches) {
      const key = m[2];
      if (!localStorageKeys[key]) localStorageKeys[key] = [];
      localStorageKeys[key].push(f);
    }
  } catch {}
}
for (const [key, files] of Object.entries(localStorageKeys)) {
  const uniqueFiles = [...new Set(files)];
  if (uniqueFiles.length > 2) {
    console.error(`\nPRE-COMMIT WARN: localStorage key '${key}' used in ${uniqueFiles.length} files — risk of data collision.`);
  }
}

// CHECK 7: guard against deletion of critical shared files
const deletedFiles = (() => {
  try {
    return execSync('git diff --cached --name-only --diff-filter=D', { encoding: 'utf8' })
      .split('\n').filter(f => f.trim());
  } catch { return []; }
})();
const criticalFiles = ['shared/scripts.js', 'shared/styles.css', 'data/manifest.json'];
for (const critical of criticalFiles) {
  if (deletedFiles.includes(critical)) {
    console.error(`\nPRE-COMMIT FAIL: ${critical} is staged for deletion — this file is critical. Restore it or confirm with team.`);
    failed++;
  }
}

// CHECK 8: RP exam JSON top-level schema
for (const f of rpFiles) {
  try {
    const json = JSON.parse(fs.readFileSync(f, 'utf8'));
    const required = ['exam_id', 'title', 'version', 'questions'];
    for (const field of required) {
      if (!json[field]) {
        console.error(`\nPRE-COMMIT FAIL: ${f} missing top-level field: ${field}`);
        failed++;
      }
    }
    if (!Array.isArray(json.questions) || json.questions.length === 0) {
      console.error(`\nPRE-COMMIT FAIL: ${f} has no questions array`);
      failed++;
    }
  } catch {}
}

if (failed > 0) {
  console.error(`\n${failed} pre-commit check(s) failed. Fix and re-commit.\n`);
  process.exit(1);
} else {
  console.log('Pre-commit checks: all passed.');
  process.exit(0);
}
