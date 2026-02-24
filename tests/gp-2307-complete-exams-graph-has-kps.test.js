// gp-2307: All Q12/Q13 graphs have at least 1 key_point
const fs=require('fs'),path=require('path');
const DATA_DIR=path.join(__dirname,'../data');
const RP_FILES=fs.readdirSync(DATA_DIR).filter(f=>/^retake-practice-\d+\.json$/.test(f)).sort();
let pass=0,fail=0;const failures=[];
for(const file of RP_FILES){
  const d=JSON.parse(fs.readFileSync(path.join(DATA_DIR,file),'utf8'));
  if(d.questions.length!==15)continue;
  [12,13].forEach(n=>{
    const q=d.questions.find(q=>q.number===n);
    const kps=(q.graph.key_points||[]).length;
    if(kps>=1)pass++;else{fail++;failures.push(d.exam_id+' Q'+n+' key_points='+kps);}
  });
}
console.log('gp-2307-graph-has-keypoints:',pass+' pass,',fail+' fail');
if(fail>0){failures.forEach(f=>console.log('  FAIL:',f));process.exit(1);}
console.log('OK -- All Q12/Q13 graphs have at least 1 key_point');
