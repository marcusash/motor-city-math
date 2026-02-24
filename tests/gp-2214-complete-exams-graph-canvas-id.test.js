// gp-2214: All graphs have canvas_id matching pattern graphQ{N} where N=question number
const fs=require('fs'),path=require('path');
const DATA_DIR=path.join(__dirname,'../data');
const RP_FILES=fs.readdirSync(DATA_DIR).filter(f=>/^retake-practice-\d+\.json$/.test(f)).sort();
let pass=0,fail=0;const failures=[];
for(const file of RP_FILES){
  const d=JSON.parse(fs.readFileSync(path.join(DATA_DIR,file),'utf8'));
  if(d.questions.length!==15)continue;
  d.questions.forEach(q=>{
    if(!q.graph)return;
    const expected='graphQ'+q.number;
    if(q.graph.canvas_id===expected)pass++;
    else{fail++;failures.push(d.exam_id+' Q'+q.number+': expected '+expected+' got '+q.graph.canvas_id);}
  });
}
console.log('gp-2214-graph-canvas-id-pattern: '+pass+' pass, '+fail+' fail');
if(fail>0){failures.forEach(f=>console.log('  FAIL:',f));process.exit(1);}
console.log('OK -- All graph canvas_id values follow graphQ{N} pattern');
