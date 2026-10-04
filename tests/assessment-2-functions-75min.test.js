const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname,'..');
const context = { window:{} };
vm.runInNewContext(fs.readFileSync(path.join(root,'reviews','prep-test-2-proposal-data.js'),'utf8'),context);
const questions = context.window.prepTest2Proposal.questions;
const student = fs.readFileSync(path.join(__dirname,'assessment-2-functions-75min.html'),'utf8');
const key = fs.readFileSync(path.join(__dirname,'assessment-2-functions-75min-KEY.html'),'utf8');
assert.equal((student.match(/data-question="/g)||[]).length,8);
assert.equal([...student.matchAll(/data-points="(\d+)"/g)].reduce((sum,m)=>sum+Number(m[1]),0),100);
assert.equal([...student.matchAll(/data-minutes="(\d+)"/g)].reduce((sum,m)=>sum+Number(m[1]),0),70);
assert.equal((student.match(/<svg /g)||[]).length,9);
const grids = [...student.matchAll(/<svg class="print-grid" viewBox="0 0 (\d+) (\d+)"[^>]*aria-label="[^"]*; x (-?\d+) to (\d+), y (-?\d+) to (\d+)"/g)];
assert.equal(grids.length,7);
for (const match of grids) {
  assert.equal(match[1],match[2],'Square SVG');
  assert.equal(Number(match[3]),-Number(match[4]),'Centered x-axis');
  assert.equal(Number(match[5]),-Number(match[6]),'Centered y-axis');
  assert.equal(match[4],match[6],'Matching axis scale');
}
assert.match(student,/x -8 to 8, y -8 to 8/);
assert.match(student,/width:5\.8in; height:5\.8in/);
assert.match(student,/Large centered axes for qualitative sketch/);
assert.equal((key.match(/class="exam-section key-block"/g)||[]).length,8);
assert.match(student,/Motor City Math \| Pre-Calculus/);
assert.match(student,/final 5 minutes/);
assert.doesNotMatch(student,/Worked answer|Scoring|parent-review|Marcus|Study Guide Q|Answer Key/);
assert.match(student,/solid line/); assert.match(student,/dashed line/);
assert.doesNotMatch(student,/flattened|touch at one zero|keep the curve|ends point the same|blank parts|Read the graph before|Keep all restrictions/);
assert.match(student,/<hr>/);
assert.match(key,/deduct an originating error once/i);
questions.forEach(q=>{
  assert.ok(student.includes(`id="q${q.id}"`));
  assert.ok(key.includes(q.title));
});
for (const name of ['assessment-2-functions-75min.pdf','assessment-2-functions-75min-KEY.pdf']) {
  const bytes=fs.readFileSync(path.join(__dirname,name));
  assert.equal(bytes.subarray(0,4).toString(),'%PDF');
  assert.ok(bytes.length>10000);
}
console.log('Prep Test 2 print artifacts: PASS (8 questions, 100 points, 70+5 minutes, 7 symmetric grids and 2 open sketch axes, separate key and PDFs).');
