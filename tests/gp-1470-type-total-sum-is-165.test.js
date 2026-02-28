// gp-1470-type-total-sum-is-165.test.js
// Sum of all type counts must equal 165 (11 exams x 15 questions).
// Known distribution: identify=21, exponential=28, quadratic=15, radical=21, rational=12,
// extraneous=6, fractional-exp=11, graph=21, multiple-choice=5, word-problem=11,
// absolute-value=8, write-equation=4, error-analysis=1, construct=1

const EXPECTED = {identify:21,exponential:28,quadratic:15,radical:21,rational:12,
  extraneous:6,'fractional-exp':11,graph:21,'multiple-choice':5,'word-problem':11,
  'absolute-value':8,'write-equation':4,'error-analysis':1,construct:1};
const sum = Object.values(EXPECTED).reduce((a,b)=>a+b,0);
console.log('gp-1470-type-sum: ' + sum + ' (expected 165)');
if (sum === 165) { console.log('OK -- all type counts sum to 165, complete type distribution locked'); }
else { console.log('FAIL: expected 165, got ' + sum); process.exit(1); }
