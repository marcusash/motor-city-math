// gp-2305: All RANGES group (RP6-11) Q12/Q13 y_range spans at least 8 units
const fs=require('fs'),path=require('path');
const DATA_DIR=path.join(__dirname,'../data');
const RANGES=['retake-practice-6','retake-practice-7','retake-practice-8','retake-practice-9','retake-practice-10','retake-practice-11'];
let pass=0,fail=0;const failures=[];
for(const exam_id of RANGES){
  const d=JSON.parse(fs.readFileSync(path.join(DATA_DIR,exam_id+'.json'),'utf8'));
  [12,13].forEach(n=>{
    const q=d.questions.find(q=>q.number===n);
    const yr=q.graph.y_range;
    const height=yr[1]-yr[0];
    if(height>=8)pass++;else{fail++;failures.push(exam_id+' Q'+n+' y_range height='+height);}
  });
}
console.log('gp-2305-y-range-height-min8:',pass+' pass,',fail+' fail');
if(fail>0){failures.forEach(f=>console.log('  FAIL:',f));process.exit(1);}
console.log('OK -- All RANGES group y_range heights >= 8');
