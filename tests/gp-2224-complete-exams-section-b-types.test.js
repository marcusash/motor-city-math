// gp-2224: Section B (Q4-Q11) question types must be from allowed set
const fs=require('fs'),path=require('path');
const DATA_DIR=path.join(__dirname,'../data');
const RP_FILES=fs.readdirSync(DATA_DIR).filter(f=>/^retake-practice-\d+\.json$/.test(f)).sort();
const ALLOWED=['exponential','radical','rational','extraneous','fractional-exp','quadratic','absolute-value'];
let pass=0,fail=0;const failures=[];
for(const file of RP_FILES){
  const d=JSON.parse(fs.readFileSync(path.join(DATA_DIR,file),'utf8'));
  if(d.questions.length!==15)continue;
  let ok=true;
  d.questions.filter(q=>q.number>=4&&q.number<=11).forEach(q=>{
    if(!ALLOWED.includes(q.type)){ok=false;failures.push(d.exam_id+' Q'+q.number+' type='+q.type);}
  });
  if(ok)pass++; else fail++;
}
console.log('gp-2224-section-b-types: '+pass+' pass, '+fail+' fail');
if(fail>0){failures.forEach(f=>console.log('  FAIL:',f));process.exit(1);}
console.log('OK -- All Section B questions have allowed types');
