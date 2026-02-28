// gp-2232: NO_RANGES group (RP1-5, RP12) must NOT have x_range or y_range on graphs
const fs=require('fs'),path=require('path');
const DATA_DIR=path.join(__dirname,'../data');
const NO_RANGES=['retake-practice-1','retake-practice-2','retake-practice-3','retake-practice-4','retake-practice-5','retake-practice-12'];
let pass=0,fail=0;const failures=[];
for(const exam_id of NO_RANGES){
  const d=JSON.parse(fs.readFileSync(path.join(DATA_DIR,exam_id+'.json'),'utf8'));
  d.questions.forEach(q=>{
    if(!q.graph)return;
    if(q.graph.x_range!==undefined){fail++;failures.push(exam_id+' Q'+q.number+' unexpected x_range');}
    else if(q.graph.y_range!==undefined){fail++;failures.push(exam_id+' Q'+q.number+' unexpected y_range');}
    else pass++;
  });
}
console.log('gp-2232-no-ranges-group: '+pass+' pass, '+fail+' fail');
if(fail>0){failures.forEach(f=>console.log('  FAIL:',f));process.exit(1);}
console.log('OK -- NO_RANGES group (RP1-5, RP12) has no x_range or y_range');
