// gp-2219: Graph asymptotes field schema split
// RP1-5 and RP12: asymptotes field is present (null or array) -- HAS_ASYM group
// RP6-11: asymptotes field is ABSENT (undefined) -- NO_ASYM group (schema difference, not a bug)

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
    if(a===null||Array.isArray(a))pass++;
    else{fail++;failures.push(exam_id+' Q'+q.number+' expected null/array, got '+JSON.stringify(a));}
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
console.log('OK -- Graph asymptotes: RP1-5+RP12=null/array, RP6-11=absent (schema split documented)');
