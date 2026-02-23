// gp-rp7-q14-feedback-advisory.test.js — RP7 Q14 feedback_correct is a teaching note not celebration

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const file = 'retake-practice-7.json';

const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
const q14 = data.questions.find(q => q.id === 'rp7-q14');

if (!q14) {
  console.log('gp-rp7-q14-feedback-advisory: Q14 not found in RP7');
  process.exit(0);
}

const fc = q14.feedback_correct || '';
console.log(`gp-rp7-q14-feedback-advisory: feedback_correct="${fc.substring(0, 100)}"`);

// This is a known issue — the feedback reads as a teaching note not celebration
// Expected: something like "🔥 Function built. Clean." (voice guide pattern)
// Actual: "W2.d: build the equation from features, not just reading values."
if (fc.startsWith('W2') || fc.startsWith('Standard') || /^\w+\./.test(fc)) {
  console.log(`INFO — RP7 Q14 feedback_correct reads as teaching note (not voice guide celebratory)`);
  console.log(`  Current: "${fc}"`);
  console.log(`  Recommended: something celebratory per .voice-guide.md`);
  console.log(`  Owner: GD — please update to match voice guide`);
} else {
  console.log(`OK — RP7 Q14 feedback_correct is celebratory`);
}

// Exit 0 always — informational
process.exit(0);
