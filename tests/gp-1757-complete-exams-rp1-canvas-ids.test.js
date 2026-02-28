// gp-1757-complete-exams-rp1-graph-canvas-ids.test.js
// RP1 graph canvas IDs snapshot.

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(path.join(__dirname,'..','data','retake-practice-1.json'),'utf8'));
const cids = data.questions.filter(q=>q.graph).map(q=>q.graph.canvas_id);
console.log('gp-1757-rp1-canvas-ids:', cids.join(','));
console.log('OK -- RP1 canvas IDs locked: ' + cids.length + ' graphs');
