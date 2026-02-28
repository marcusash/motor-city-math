// gp-2326: Section C (Q12-Q13) always has exactly 2 questions
const fs=require('fs'),path=require('path');
const DATA_DIR=path.join(__dirname,'../data');
const RP_FILES=fs.readdirSync(DATA_DIR).filter(f=>/^retake-practice-\d+\.json$/.test(f)).sort();
let pass=0,fail=0;const failures=[];
for(const file of RP_FILES){
  const d=JSON.parse(fs.readFileSync(path.join(DATA_DIR,file),'utf8'));
  if(d.questions.length!==15)continue;
  const secC=d.questions.filter(q=>q.number>=12&&q.number<=13).length;
  if(secC===2)pass++;else{fail++;failures.push(d.exam_id+' Section C count='+secC);}
}
console.log('gp-2326-section-c-count:',pass+' pass,',fail+' fail');
if(fail>0){failures.forEach(f=>console.log('  FAIL:',f));process.exit(1);}
console.log('OK -- Section C always has 2 questions (Q12-Q13)');
