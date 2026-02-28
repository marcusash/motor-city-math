// gp-2274: Q13 graph function uniqueness check
// Known issue: RP6 and RP12 Q13 share the same function '4 / (x - 3) - 2' (advisory to GI)
// This test documents the known duplicate and checks no additional duplicates exist.
const fs=require('fs'),path=require('path');
const DATA_DIR=path.join(__dirname,'../data');
const RP_FILES=fs.readdirSync(DATA_DIR).filter(f=>/^retake-practice-\d+\.json$/.test(f)).sort();
const KNOWN_DUP='4 / (x - 3) - 2'; // RP6 and RP12 share this
const seen={};let pass=0,fail=0;const failures=[];
for(const file of RP_FILES){
  const d=JSON.parse(fs.readFileSync(path.join(DATA_DIR,file),'utf8'));
  if(d.questions.length!==15)continue;
  const q13=d.questions.find(q=>q.number===13);
  const fn=q13.graph.function;
  if(seen[fn]){
    const examPair=new Set([d.exam_id,seen[fn]]);
    if(fn===KNOWN_DUP&&examPair.has('retake-practice-6')&&examPair.has('retake-practice-12')){
      pass++; // known duplicate documented
    } else {
      fail++;failures.push(d.exam_id+' Q13 unexpected duplicate '+seen[fn]+': '+fn);
    }
  } else {seen[fn]=d.exam_id;pass++;}
}
console.log('gp-2274-q13-function-uniqueness:',pass+' pass, '+fail+' fail');
if(fail>0){failures.forEach(f=>console.log('  FAIL:',f));process.exit(1);}
console.log('OK -- Q13 function uniqueness: 1 known dup (RP6=RP12), no unexpected dups');
