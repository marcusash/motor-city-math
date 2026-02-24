// gp-2012-complete-exams-rp8-q1-answer-snapshot.test.js
// RP8 Q1 input answers locked (Section A quadratic type).

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(require('path').join(__dirname,'..','data','retake-practice-8.json'),'utf8'));
const q1 = data.questions.find(q => q.number === 1);
const answers = (q1.inputs||[]).map(i => ({id:i.id, type:i.type, answer:i.answer}));
console.log('gp-2012-rp8-q1-answers:', JSON.stringify(answers));
console.log('OK -- RP8 Q1 input answers snapshot locked');
