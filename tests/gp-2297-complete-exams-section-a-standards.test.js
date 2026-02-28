// gp-2297: Section A (Q1-Q3) standards snapshot
// OLDER(RP1-7,RP12): Q1/Q2/Q3=W2.b; NEWER(RP8-11): Q1=W2.a,Q2=W2.b,Q3=W3.a
const fs=require('fs'),path=require('path');
const DATA_DIR=path.join(__dirname,'../data');
const EXPECTED={
  'retake-practice-1':{1:'W2.b',2:'W2.b',3:'W2.b'},
  'retake-practice-2':{1:'W2.b',2:'W2.b',3:'W2.b'},
  'retake-practice-3':{1:'W2.b',2:'W2.b',3:'W2.b'},
  'retake-practice-4':{1:'W2.b',2:'W2.b',3:'W2.b'},
  'retake-practice-5':{1:'W2.b',2:'W2.b',3:'W2.b'},
  'retake-practice-6':{1:'W2.b',2:'W2.b',3:'W2.b'},
  'retake-practice-7':{1:'W2.b',2:'W2.b',3:'W2.b'},
  'retake-practice-8':{1:'W2.a',2:'W2.b',3:'W3.a'},
  'retake-practice-9':{1:'W2.a',2:'W2.b',3:'W3.a'},
  'retake-practice-10':{1:'W2.a',2:'W2.b',3:'W3.a'},
  'retake-practice-11':{1:'W2.a',2:'W2.b',3:'W3.a'},
  'retake-practice-12':{1:'W2.b',2:'W2.b',3:'W2.b'}
};
let pass=0,fail=0;const failures=[];
for(const[exam_id,qmap] of Object.entries(EXPECTED)){
  const d=JSON.parse(fs.readFileSync(path.join(DATA_DIR,exam_id+'.json'),'utf8'));
  for(const[qnum,exp] of Object.entries(qmap)){
    const q=d.questions.find(q=>q.number===parseInt(qnum));
    if(q.standard===exp)pass++;else{fail++;failures.push(exam_id+' Q'+qnum+' std='+q.standard+' expected '+exp);}
  }
}
console.log('gp-2297-section-a-standards:',pass+' pass,',fail+' fail');
if(fail>0){failures.forEach(f=>console.log('  FAIL:',f));process.exit(1);}
console.log('OK -- Section A Q1-Q3 standards snapshot locked');
