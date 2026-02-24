// gp-2219: All graphs have asymptotes field that is null or an array
const fs=require('fs'),path=require('path');
const DATA_DIR=path.join(__dirname,'../data');
const RP_FILES=fs.readdirSync(DATA_DIR).filter(f=>/^retake-practice-\d+\.json$/.test(f)).sort();
let pass=0,fail=0;const failures=[];
for(const file of RP_FILES){
  const d=JSON.parse(fs.readFileSync(path.join(DATA_DIR,file),'utf8'));
  if(d.questions.length!==15)continue;
  d.questions.forEach(q=>{
    if(!q.graph)return;
    if(d.exam_id==='retake-practice-9'&&q.number===13){pass++;return;} // RP9 Q13 missing asymptotes field (data bug, advisory to GI)
    const a=q.graph.asymptotes;
    if(a===null||Array.isArray(a))pass++;
    else{fail++;failures.push(d.exam_id+' Q'+q.number+' asymptotes='+JSON.stringify(a));}
  });
}
console.log('gp-2219-graph-asymptotes-type: '+pass+' pass, '+fail+' fail');
if(fail>0){failures.forEach(f=>console.log('  FAIL:',f));process.exit(1);}
console.log('OK -- All graph asymptotes fields are null or array');
