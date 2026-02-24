// gp-2308: All graph key_points are [x,y] numeric arrays
const fs=require('fs'),path=require('path');
const DATA_DIR=path.join(__dirname,'../data');
const RP_FILES=fs.readdirSync(DATA_DIR).filter(f=>/^retake-practice-\d+\.json$/.test(f)).sort();
let pass=0,fail=0;const failures=[];
for(const file of RP_FILES){
  const d=JSON.parse(fs.readFileSync(path.join(DATA_DIR,file),'utf8'));
  if(d.questions.length!==15)continue;
  [12,13].forEach(n=>{
    const q=d.questions.find(q=>q.number===n);
    for(const kp of (q.graph.key_points||[])){
      if(Array.isArray(kp)&&kp.length===2&&typeof kp[0]==='number'&&typeof kp[1]==='number')pass++;
      else{fail++;failures.push(d.exam_id+' Q'+n+' kp='+JSON.stringify(kp));}
    }
  });
}
console.log('gp-2308-kp-format:',pass+' pass,',fail+' fail');
if(fail>0){failures.slice(0,5).forEach(f=>console.log('  FAIL:',f));process.exit(1);}
console.log('OK -- All key_points are [x,y] numeric arrays');
