// gp-2306: NO_RANGES group (RP1-5, RP12) Q12/Q13 have no x_range or y_range
const fs=require('fs'),path=require('path');
const DATA_DIR=path.join(__dirname,'../data');
const NO_RANGES=['retake-practice-1','retake-practice-2','retake-practice-3','retake-practice-4','retake-practice-5','retake-practice-12'];
let pass=0,fail=0;const failures=[];
for(const exam_id of NO_RANGES){
  const d=JSON.parse(fs.readFileSync(path.join(DATA_DIR,exam_id+'.json'),'utf8'));
  [12,13].forEach(n=>{
    const q=d.questions.find(q=>q.number===n);
    const hasX=q.graph.x_range!=null;
    const hasY=q.graph.y_range!=null;
    if(!hasX&&!hasY)pass++;else{fail++;failures.push(exam_id+' Q'+n+' has x_range='+hasX+' y_range='+hasY);}
  });
}
console.log('gp-2306-no-ranges-group:',pass+' pass,',fail+' fail');
if(fail>0){failures.forEach(f=>console.log('  FAIL:',f));process.exit(1);}
console.log('OK -- NO_RANGES group (RP1-5, RP12) Q12/Q13 have no x/y range');
