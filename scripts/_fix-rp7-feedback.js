'use strict';
const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, '..', 'data', 'retake-practice-7.json');
const d = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const fc = {
  6: '\uD83D\uDD25 Squared both sides. Both roots: \u00b14.',
  10: '\uD83D\uDD25 Quadratic exponent. Both roots: \u00b12.'
};
const fw = {
  1: 'Set f(x)=0. Factor (x+3)(x-2)=0.',
  2: 'Set -2|x+1|+6=0. Two cases: |x+1|=3.',
  3: 'Factor: 2|x-3|-4. Two cases: 2x-6=\u00b14.',
  4: '8=2^3, 32=2^5. So 3(x-1)=5 \u2192 x=8/3.',
  7: 'Base 5: 2x=3(x-1). Solve x=3.',
  8: 'Multiply by (x+2). Then 5x-3=3x+6.',
  11: 'x^(3/2)=512. Raise to 2/3 power: x=64.',
  12: 'Vertex: (h,k)=(2,-3). Opens up (a=3).',
  13: 'VA: x+2=0 \u2192 x=-2. HA: constant y=4.'
};

d.questions.forEach(q => {
  if (fc[q.number]) q.feedback_correct = fc[q.number];
  if (fw[q.number]) q.feedback_wrong = fw[q.number];
});

fs.writeFileSync(dataPath, JSON.stringify(d, null, 2), 'utf8');
console.log('RP7 feedback fields updated successfully');
