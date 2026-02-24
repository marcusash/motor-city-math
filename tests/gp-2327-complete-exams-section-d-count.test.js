// gp-2327: Section D (Q14-Q15) always has exactly 2 questions
const fs=require('fs'),path=require('path');
const DATA_DIR=path.join(__dirname,'../data');
const RP_FILES=fs.readdirSync(DATA_DIR).filter(f=>/^retake-practice-\d+\.json$/.test(f)).sort();
let pass=0,fail=0;const failures=[];
for(const file of RP_FILES){
  const d=JSON.parse(fs.readFileSync(path.join(DATA_DIR,file),'utf8'));
  if(d.questions.length!==15)continue;
  const secD=d.questions.filter(q=>q.number>=14&&q.number<=15).length;
  if(secD===2)pass++;else{fail++;failures.push(d.exam_id+' Section D count='+secD);}
}
console.log('gp-2327-section-d-count:',pass+' pass,',fail+' fail');
if(fail>0){failures.forEach(f=>console.log('  FAIL:',f));process.exit(1);}
console.log('OK -- Section D always has 2 questions (Q14-Q15)');
