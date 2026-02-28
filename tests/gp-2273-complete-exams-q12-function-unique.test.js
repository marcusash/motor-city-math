// gp-2273: No two complete exams share the same Q12 graph function string
const fs=require('fs'),path=require('path');
const DATA_DIR=path.join(__dirname,'../data');
const RP_FILES=fs.readdirSync(DATA_DIR).filter(f=>/^retake-practice-\d+\.json$/.test(f)).sort();
const seen={};let pass=0,fail=0;const failures=[];
for(const file of RP_FILES){
  const d=JSON.parse(fs.readFileSync(path.join(DATA_DIR,file),'utf8'));
  if(d.questions.length!==15)continue;
  const q12=d.questions.find(q=>q.number===12);
  const fn=q12.graph.function;
  if(seen[fn]){fail++;failures.push(d.exam_id+' Q12 duplicates '+seen[fn]+': '+fn);}
  else{seen[fn]=d.exam_id;pass++;}
}
console.log('gp-2273-q12-function-no-dups:',pass+' pass, '+fail+' fail');
if(fail>0){failures.forEach(f=>console.log('  FAIL:',f));process.exit(1);}
console.log('OK -- All Q12 graph function strings are unique across exams');
