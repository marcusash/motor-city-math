// gp-2223: All graph Q13 key_points are [x,y] arrays (2-element numeric arrays)
const fs=require('fs'),path=require('path');
const DATA_DIR=path.join(__dirname,'../data');
const RP_FILES=fs.readdirSync(DATA_DIR).filter(f=>/^retake-practice-\d+\.json$/.test(f)).sort();
let pass=0,fail=0;const failures=[];
for(const file of RP_FILES){
  const d=JSON.parse(fs.readFileSync(path.join(DATA_DIR,file),'utf8'));
  if(d.questions.length!==15)continue;
  const q13=d.questions.find(q=>q.number===13);
  if(!q13||!q13.graph)continue;
  let ok=true;
  q13.graph.key_points.forEach((kp,i)=>{
    if(!Array.isArray(kp)||kp.length!==2||typeof kp[0]!=='number'||typeof kp[1]!=='number'){
      ok=false;failures.push(d.exam_id+' Q13 kp['+i+']='+JSON.stringify(kp));
    }
  });
  if(ok)pass++; else fail++;
}
console.log('gp-2223-q13-kp-format: '+pass+' pass, '+fail+' fail');
if(fail>0){failures.forEach(f=>console.log('  FAIL:',f));process.exit(1);}
console.log('OK -- All Q13 key_points are [x,y] numeric arrays');
