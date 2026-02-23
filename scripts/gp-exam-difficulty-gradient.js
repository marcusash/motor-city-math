// gp-exam-difficulty-gradient.js — score the relative difficulty of each exam
// Uses question type complexity, number of inputs, and solution step depth

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

// Complexity weights per question type (higher = harder)
const TYPE_WEIGHT = {
  'identify': 1,
  'multiple-choice': 1,
  'exponential': 2,
  'quadratic': 2,
  'word-problem': 2,
  'graph': 3,
  'radical': 3,
  'rational': 3,
  'absolute-value': 3,
  'fractional-exp': 3,
  'write-equation': 4,
  'construct': 4,
  'extraneous': 4,
  'error-analysis': 5,
};

const scores = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const num = file.match(/\d+/)[0];
  
  let typeScore = 0;
  let inputScore = 0;
  let stepScore = 0;
  
  for (const q of data.questions) {
    typeScore += TYPE_WEIGHT[q.type] || 2;
    inputScore += (q.inputs || []).length;
    stepScore += (q.solution_steps || []).length;
  }
  
  const total = data.questions.length;
  const avgType = (typeScore / total).toFixed(2);
  const avgInputs = (inputScore / total).toFixed(2);
  const avgSteps = (stepScore / total).toFixed(2);
  const difficulty = ((typeScore + inputScore * 0.5 + stepScore * 0.3) / total).toFixed(2);
  
  scores.push({ num, avgType, avgInputs, avgSteps, difficulty });
}

scores.sort((a, b) => a.difficulty - b.difficulty);

console.log('=== EXAM DIFFICULTY GRADIENT ===');
console.log('(lower score = easier, higher = harder)\n');
console.log('Rank  RP#   Difficulty  AvgType  AvgInputs  AvgSteps');
console.log('----  ---   ----------  -------  ---------  --------');

scores.forEach((s, i) => {
  const rank = String(i + 1).padStart(4);
  const rp = `RP${s.num}`.padEnd(5);
  const diff = String(s.difficulty).padEnd(10);
  const type = String(s.avgType).padEnd(9);
  const inp = String(s.avgInputs).padEnd(11);
  console.log(`${rank}  ${rp}  ${diff}  ${type}  ${inp}  ${s.avgSteps}`);
});

console.log('\nRecommended order for Kai: ' + scores.map(s => `RP${s.num}`).join(' → '));
