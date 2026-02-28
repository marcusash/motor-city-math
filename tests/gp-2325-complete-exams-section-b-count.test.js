// gp-2325: Section B (Q4-Q11) has exactly 8 questions per complete exam
const fs=require('fs'),path=require('path');
const DATA_DIR=path.join(__dirname,'../data');
const RP_FILES=fs.readdirSync(DATA_DIR).filter(f=>/^retake-practice-\d+\.json$/.test(f)).sort();
let pass=0,fail=0;const failures=[];
for(const file of RP_FILES){
  const d=JSON.parse(fs.readFileSync(path.join(DATA_DIR,file),'utf8'));
  if(d.questions.length!==15)continue;
  const secB=d.questions.filter(q=>q.number>=4&&q.number<=11).length;
  if(secB===8)pass++;else{fail++;failures.push(d.exam_id+' Section B count='+secB);}
}
console.log('gp-2325-section-b-count:',pass+' pass,',fail+' fail');
if(fail>0){failures.forEach(f=>console.log('  FAIL:',f));process.exit(1);}
console.log('OK -- Section B always has 8 questions (Q4-Q11)');
