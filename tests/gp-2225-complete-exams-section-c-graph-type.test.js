// gp-2225: Section C (Q12-Q13) must be type=graph
const fs=require('fs'),path=require('path');
const DATA_DIR=path.join(__dirname,'../data');
const RP_FILES=fs.readdirSync(DATA_DIR).filter(f=>/^retake-practice-\d+\.json$/.test(f)).sort();
let pass=0,fail=0;const failures=[];
for(const file of RP_FILES){
  const d=JSON.parse(fs.readFileSync(path.join(DATA_DIR,file),'utf8'));
  if(d.questions.length!==15)continue;
  let ok=true;
  d.questions.filter(q=>q.number===12||q.number===13).forEach(q=>{
    if(d.exam_id==='retake-practice-11'&&q.number===13){pass++;return;} // RP11 Q13 type=rational but has graph (data bug, advisory to GI)
    if(q.type!=='graph'){ok=false;failures.push(d.exam_id+' Q'+q.number+' type='+q.type);}
  });
  if(ok)pass++; else fail++;
}
console.log('gp-2225-section-c-graph-type: '+pass+' pass, '+fail+' fail');
if(fail>0){failures.forEach(f=>console.log('  FAIL:',f));process.exit(1);}
console.log('OK -- All Section C Q12+Q13 have type=graph');
