/**
 * gp-feedback-tone-check.js — Flag feedback over 12 words (ADHD rule)
 *
 * Also flags feedback that uses em dashes, multiple exclamation marks,
 * or vague filler phrases.
 *
 * Run: node scripts/gp-feedback-tone-check.js
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_PATTERN = /^retake-practice-\d+\.json$/;

const BANNED_PATTERNS = [
    { pattern: /—|–/, label: 'em dash' },
    { pattern: /great job|good job|well done|nice work|awesome|amazing/i, label: 'vague praise' },
    { pattern: /try again|keep trying|don.t worry/i, label: 'discouraging filler' },
    { pattern: /!!/, label: 'double exclamation' },
];

const files = fs.readdirSync(DATA_DIR).filter(f => RP_PATTERN.test(f)).sort();

let violations = 0;

for (const file of files) {
    const raw = fs.readFileSync(path.join(DATA_DIR, file), 'utf-8');
    let data;
    try { data = JSON.parse(raw); } catch { continue; }

    for (const q of (data.questions || [])) {
        for (const field of ['feedback_correct', 'feedback_incorrect']) {
            const text = q[field];
            if (!text) continue;

            const wordCount = text.trim().split(/\s+/).length;
            if (wordCount > 12) {
                console.log('❌ ' + file + ' ' + q.id + '.' + field + ': ' + wordCount + ' words (max 12): "' + text + '"');
                violations++;
            }

            for (const { pattern, label } of BANNED_PATTERNS) {
                if (pattern.test(text)) {
                    console.log('⚠️  ' + file + ' ' + q.id + '.' + field + ' [' + label + ']: "' + text + '"');
                }
            }
        }
    }
}

console.log('\n─── Tone Check Summary ───');
if (violations === 0) {
    console.log('✅ All feedback within 12-word ADHD limit.');
} else {
    console.log('❌ ' + violations + ' feedback violations. Fix before shipping to Kai.');
}
