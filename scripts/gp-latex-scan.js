/**
 * gp-latex-scan.js — Flag unclosed LaTeX delimiters in RP JSON files
 *
 * Scans all prompt/hint/feedback strings for unclosed $..$ or $$..$$
 * Advisory only — does not block commit.
 *
 * Run: node scripts/gp-latex-scan.js
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_PATTERN = /^retake-practice-\d+\.json$/;

const files = fs.readdirSync(DATA_DIR).filter(f => RP_PATTERN.test(f));
const FIELDS = ['prompt', 'hint', 'hint_2', 'feedback_correct', 'feedback_incorrect'];

let totalIssues = 0;
const issues = [];

for (const file of files) {
    const raw = fs.readFileSync(path.join(DATA_DIR, file), 'utf-8');
    let data;
    try { data = JSON.parse(raw); } catch { continue; }

    for (const q of (data.questions || [])) {
        for (const field of FIELDS) {
            const text = q[field];
            if (!text || typeof text !== 'string') continue;

            // Count $$ pairs
            const ddMatches = (text.match(/\$\$/g) || []).length;
            if (ddMatches % 2 !== 0) {
                issues.push({ file, id: q.id, field, text: text.substring(0, 80) });
                totalIssues++;
                continue;
            }

            // Remove $$ pairs, then count single $
            const stripped = text.replace(/\$\$[^$]*\$\$/g, '');
            const singleMatches = (stripped.match(/\$/g) || []).length;
            if (singleMatches % 2 !== 0) {
                issues.push({ file, id: q.id, field, text: text.substring(0, 80) });
                totalIssues++;
            }
        }
    }
}

if (issues.length === 0) {
    console.log('✅ No unclosed LaTeX delimiters found across ' + files.length + ' exams.');
} else {
    console.log('⚠️  ' + totalIssues + ' possible unclosed LaTeX delimiters (advisory):');
    for (const { file, id, field, text } of issues) {
        console.log('  ' + file + ' ' + id + '.' + field + ': ' + text);
    }
}
