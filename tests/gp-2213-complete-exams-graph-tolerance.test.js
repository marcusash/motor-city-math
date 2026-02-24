// gp-2213: Graph tolerance snapshot lock -- all graphs use 0.25 except RP5 Q13=0.3
const fs=require('fs'),path=require('path');
const DATA_DIR=path.join(__dirname,'../data');
const RP_FILES=fs.readdirSync(DATA_DIR).filter(f=>/^retake-practice-\d+\.json$/.test(f)).sort();
let pass=0,fail=0;const failures=[];
for(const file of RP_FILES){
  const d=JSON.parse(fs.readFileSync(path.join(DATA_DIR,file),'utf8'));
  if(d.questions.length!==15)continue;
  d.questions.forEach(q=>{
    if(!q.graph)return;
    const expected=d.exam_id==='retake-practice-5'&&q.number===13?0.3:0.25;
    if(q.graph.tolerance===expected)pass++;
    else{fail++;failures.push(d.exam_id+' Q'+q.number+': expected tol='+expected+' got '+q.graph.tolerance);}
  });
}
console.log('gp-2213-graph-tolerance-snapshot: '+pass+' pass, '+fail+' fail');
if(fail>0){failures.forEach(f=>console.log('  FAIL:',f));process.exit(1);}
console.log('OK -- All graph tolerance values snapshot locked (0.25 except RP5-Q13=0.3)');
