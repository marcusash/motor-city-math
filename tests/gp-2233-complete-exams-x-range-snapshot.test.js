// gp-2233: x_range snapshot for RANGES group (RP6-11)
const fs=require('fs'),path=require('path');
const DATA_DIR=path.join(__dirname,'../data');
const EXPECTED={
  'retake-practice-6':{12:[-6,4],13:[-2,10]},
  'retake-practice-7':{12:[-2,6],13:[-8,6]},
  'retake-practice-8':{12:[-1,7],13:[-9,5]},
  'retake-practice-9':{12:[-5,3],13:[-1,11]},
  'retake-practice-10':{12:[-10,2],13:[-1,11]},
  'retake-practice-11':{12:[-12,1],13:[-10,5]}
};
let pass=0,fail=0;const failures=[];
for(const[exam_id,qmap] of Object.entries(EXPECTED)){
  const d=JSON.parse(fs.readFileSync(path.join(DATA_DIR,exam_id+'.json'),'utf8'));
  for(const[qnum,exp] of Object.entries(qmap)){
    const q=d.questions.find(q=>q.number===parseInt(qnum));
    const got=q.graph.x_range;
    if(JSON.stringify(got)===JSON.stringify(exp))pass++;
    else{fail++;failures.push(exam_id+' Q'+qnum+': expected '+JSON.stringify(exp)+' got '+JSON.stringify(got));}
  }
}
console.log('gp-2233-x-range-snapshot: '+pass+' pass, '+fail+' fail');
if(fail>0){failures.forEach(f=>console.log('  FAIL:',f));process.exit(1);}
console.log('OK -- All RANGES group x_range values snapshot locked');
