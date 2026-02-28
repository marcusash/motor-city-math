'use strict';
const fs = require('fs');
const path = require('path');

// RP8 feedback_correct — skill-specific, ≤8 words, 🔥 emoji
const rp8fc = {
  1: '🔥 Factored it. Both roots clean.',
  2: '🔥 Vertex, intercepts, range. Full read.',
  3: '🔥 Both cases split. Both roots.',
  4: '🔥 Common base. Exponents matched. x=1.5.',
  5: '🔥 AC method. Two roots.',
  6: '🔥 Squared both sides. Both roots: \u00b18.',
  7: '🔥 Base 3 unified. x=7.',
  8: '🔥 Cross-multiplied. Rational cleared.',
  9: '🔥 Equal radicands. x=4.',
  10: '🔥 Quadratic exponent. Two roots: \u00b1\u221a5.',
  11: '🔥 2/3 power cracked. x=125.',
  12: '🔥 Parabola graphed. Vertex and roots.',
  13: '🔥 Asymptotes correct. Rational graphed.',
  14: '🔥 Built upward parabola from features.',
  15: '🔥 Half-life model. 18 years.'
};

// RP9 feedback_correct — skill-specific, ≤8 words, 🔥 emoji
const rp9fc = {
  1: '🔥 Factored it. Both roots clean.',
  2: '🔥 Vertex, intercepts, range. Full picture.',
  3: '🔥 Both cases. Both roots.',
  4: '🔥 Divided first. Common base. x=9.',
  5: '🔥 AC method. Two roots.',
  6: '🔥 Squared. Both roots: \u00b113.',
  7: '🔥 Base 3 unified. x=12.',
  8: '🔥 Cross-multiplied. Rational cleared.',
  9: '🔥 Equal radicands. x=10.',
  10: '🔥 Quadratic exponent. Two roots: \u00b17.',
  11: '🔥 5/3 power cracked. x=27.',
  12: '🔥 Parabola graphed. All features.',
  13: '🔥 Asymptotes correct. Rational graphed.',
  14: '🔥 Exponential equation from two points.',
  15: '🔥 Tripling model. 11 hours.'
};

function applyFeedback(filePath, fcMap) {
  const d = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  d.questions.forEach(q => {
    if (fcMap[q.number]) q.feedback_correct = fcMap[q.number];
  });
  fs.writeFileSync(filePath, JSON.stringify(d, null, 2), 'utf8');
  console.log('Updated:', path.basename(filePath));
}

const ROOT = path.join(__dirname, '..', 'data');
applyFeedback(path.join(ROOT, 'retake-practice-8.json'), rp8fc);
applyFeedback(path.join(ROOT, 'retake-practice-9.json'), rp9fc);
console.log('Done');
