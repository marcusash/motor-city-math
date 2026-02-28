// gp-2295: Q6/Q7/Q8 type snapshot across all complete exams
// OLDER(RP1-5,RP7-12): Q6=radical, Q7=exponential, Q8=rational
// RP6 rotates: Q6=quadratic, Q7=radical, Q8=exponential
const fs=require('fs'),path=require('path');
const DATA_DIR=path.join(__dirname,'../data');
const EXPECTED={
  'retake-practice-1':{6:'radical',7:'exponential',8:'rational'},
  'retake-practice-2':{6:'radical',7:'exponential',8:'rational'},
  'retake-practice-3':{6:'radical',7:'exponential',8:'rational'},
  'retake-practice-4':{6:'radical',7:'exponential',8:'rational'},
  'retake-practice-5':{6:'radical',7:'exponential',8:'rational'},
  'retake-practice-6':{6:'quadratic',7:'radical',8:'exponential'},
  'retake-practice-7':{6:'radical',7:'exponential',8:'rational'},
  'retake-practice-8':{6:'radical',7:'exponential',8:'rational'},
  'retake-practice-9':{6:'radical',7:'exponential',8:'rational'},
  'retake-practice-10':{6:'radical',7:'exponential',8:'rational'},
  'retake-practice-11':{6:'radical',7:'exponential',8:'rational'},
  'retake-practice-12':{6:'radical',7:'exponential',8:'rational'}
};
let pass=0,fail=0;const failures=[];
for(const[exam_id,qmap] of Object.entries(EXPECTED)){
  const d=JSON.parse(fs.readFileSync(path.join(DATA_DIR,exam_id+'.json'),'utf8'));
  for(const[qnum,exp] of Object.entries(qmap)){
    const q=d.questions.find(q=>q.number===parseInt(qnum));
    if(q.type===exp)pass++;else{fail++;failures.push(exam_id+' Q'+qnum+'='+q.type+' expected '+exp);}
  }
}
console.log('gp-2295-q6-q8-type-snapshot:',pass+' pass,',fail+' fail');
if(fail>0){failures.forEach(f=>console.log('  FAIL:',f));process.exit(1);}
console.log('OK -- Q6/Q7/Q8 type snapshot locked');
