// gp-2304: All RANGES group (RP6-11) Q12/Q13 x_range spans at least 8 units
const fs=require('fs'),path=require('path');
const DATA_DIR=path.join(__dirname,'../data');
const RANGES=['retake-practice-6','retake-practice-7','retake-practice-8','retake-practice-9','retake-practice-10','retake-practice-11'];
let pass=0,fail=0;const failures=[];
for(const exam_id of RANGES){
  const d=JSON.parse(fs.readFileSync(path.join(DATA_DIR,exam_id+'.json'),'utf8'));
  [12,13].forEach(n=>{
    const q=d.questions.find(q=>q.number===n);
    const xr=q.graph.x_range;
    const width=xr[1]-xr[0];
    if(width>=8)pass++;else{fail++;failures.push(exam_id+' Q'+n+' x_range width='+width);}
  });
}
console.log('gp-2304-x-range-width-min8:',pass+' pass,',fail+' fail');
if(fail>0){failures.forEach(f=>console.log('  FAIL:',f));process.exit(1);}
console.log('OK -- All RANGES group x_range widths >= 8');
