// gp-2312: Q1 question_html is unique across all complete exams (full text comparison)
// Note: Some exams share prompt template but with different equations -- confirmed unique
const fs=require('fs'),path=require('path');
const DATA_DIR=path.join(__dirname,'../data');
const RP_FILES=fs.readdirSync(DATA_DIR).filter(f=>/^retake-practice-\d+\.json$/.test(f)).sort();
const seen={};let pass=0,fail=0;const failures=[];
for(const file of RP_FILES){
  const d=JSON.parse(fs.readFileSync(path.join(DATA_DIR,file),'utf8'));
  if(d.questions.length!==15)continue;
  const q1=d.questions.find(q=>q.number===1);
  const html=q1.question_html.trim();
  if(seen[html]){fail++;failures.push(d.exam_id+' Q1 exact dup of '+seen[html]);}
  else{seen[html]=d.exam_id;pass++;}
}
console.log('gp-2312-q1-html-unique:',pass+' pass,',fail+' fail');
if(fail>0){failures.forEach(f=>console.log('  FAIL:',f));process.exit(1);}
console.log('OK -- Q1 question_html is unique across all exams');
