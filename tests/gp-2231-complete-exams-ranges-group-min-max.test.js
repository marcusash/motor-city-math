// gp-2231: x_range and y_range min<max validation for RANGES group (RP6-11)
const fs=require('fs'),path=require('path');
const DATA_DIR=path.join(__dirname,'../data');
const RANGES=['retake-practice-6','retake-practice-7','retake-practice-8','retake-practice-9','retake-practice-10','retake-practice-11'];
let pass=0,fail=0;const failures=[];
for(const exam_id of RANGES){
  const d=JSON.parse(fs.readFileSync(path.join(DATA_DIR,exam_id+'.json'),'utf8'));
  d.questions.forEach(q=>{
    if(!q.graph)return;
    const {x_range,y_range}=q.graph;
    if(!x_range||!y_range){fail++;failures.push(exam_id+' Q'+q.number+' missing x/y_range');return;}
    if(x_range[0]<x_range[1])pass++;else{fail++;failures.push(exam_id+' Q'+q.number+' x_range '+JSON.stringify(x_range));}
    if(y_range[0]<y_range[1])pass++;else{fail++;failures.push(exam_id+' Q'+q.number+' y_range '+JSON.stringify(y_range));}
  });
}
console.log('gp-2231-range-group-min-max: '+pass+' pass, '+fail+' fail');
if(fail>0){failures.forEach(f=>console.log('  FAIL:',f));process.exit(1);}
console.log('OK -- All RANGES group graphs have x_range and y_range with min<max');
