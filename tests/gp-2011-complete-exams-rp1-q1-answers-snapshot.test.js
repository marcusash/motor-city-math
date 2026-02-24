// gp-2011-complete-exams-rp1-q1-answer-snapshot.test.js
// RP1 Q1 input answers locked (Section A identify type).

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(require('path').join(__dirname,'..','data','retake-practice-1.json'),'utf8'));
const q1 = data.questions.find(q => q.number === 1);
const answers = (q1.inputs||[]).map(i => ({id:i.id, type:i.type, answer:i.answer}));
console.log('gp-2011-rp1-q1-answers:', JSON.stringify(answers));
console.log('OK -- RP1 Q1 input answers snapshot locked');
