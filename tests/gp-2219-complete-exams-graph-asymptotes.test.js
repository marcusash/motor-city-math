// gp-2219: Graph asymptotes field schema split and type validation
// HAS_ASYM group (RP1-5, RP12):
//   Q12 (quadratic): asymptotes=null
//   Q13 (rational): asymptotes={vertical:[n], horizontal:[n]} object
// NO_ASYM group (RP6-11): asymptotes field is completely absent

const fs=require('fs'),path=require('path');
const DATA_DIR=path.join(__dirname,'../data');
const HAS_ASYM=['retake-practice-1','retake-practice-2','retake-practice-3','retake-practice-4','retake-practice-5','retake-practice-12'];
const NO_ASYM=['retake-practice-6','retake-practice-7','retake-practice-8','retake-practice-9','retake-practice-10','retake-practice-11'];
let pass=0,fail=0;const failures=[];
for(const exam_id of HAS_ASYM){
  const d=JSON.parse(fs.readFileSync(path.join(DATA_DIR,exam_id+'.json'),'utf8'));
  d.questions.forEach(q=>{
    if(!q.graph)return;
    const a=q.graph.asymptotes;
    if(a===null){pass++;} // Q12 quadratic: null is correct
    else if(a&&typeof a==='object'&&!Array.isArray(a)&&Array.isArray(a.vertical)&&Array.isArray(a.horizontal)){pass++;} // Q13 rational: object with vertical/horizontal
    else{fail++;failures.push(exam_id+' Q'+q.number+' unexpected asymptotes: '+JSON.stringify(a));}
  });
}
for(const exam_id of NO_ASYM){
  const d=JSON.parse(fs.readFileSync(path.join(DATA_DIR,exam_id+'.json'),'utf8'));
  d.questions.forEach(q=>{
    if(!q.graph)return;
    if(q.graph.asymptotes===undefined)pass++;
    else{fail++;failures.push(exam_id+' Q'+q.number+' expected absent, got '+JSON.stringify(q.graph.asymptotes));}
  });
}
console.log('gp-2219-graph-asymptotes-schema: '+pass+' pass, '+fail+' fail');
if(fail>0){failures.forEach(f=>console.log('  FAIL:',f));process.exit(1);}
console.log('OK -- Graph asymptotes: HAS_ASYM correct types, NO_ASYM absent (schema split documented)');
