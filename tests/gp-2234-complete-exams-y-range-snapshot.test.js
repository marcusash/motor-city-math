// gp-2234: y_range snapshot for RANGES group (RP6-11)
const fs=require('fs'),path=require('path');
const DATA_DIR=path.join(__dirname,'../data');
const EXPECTED={
  'retake-practice-6':{12:[-6,8],13:[-10,8]},
  'retake-practice-7':{12:[-5,12],13:[-4,10]},
  'retake-practice-8':{12:[-2,6],13:[-7,5]},
  'retake-practice-9':{12:[-2,10],13:[-2,14]},
  'retake-practice-10':{12:[-35,5],13:[-8,4]},
  'retake-practice-11':{12:[-3,22],13:[8,20]}
};
let pass=0,fail=0;const failures=[];
for(const[exam_id,qmap] of Object.entries(EXPECTED)){
  const d=JSON.parse(fs.readFileSync(path.join(DATA_DIR,exam_id+'.json'),'utf8'));
  for(const[qnum,exp] of Object.entries(qmap)){
    const q=d.questions.find(q=>q.number===parseInt(qnum));
    const got=q.graph.y_range;
    if(JSON.stringify(got)===JSON.stringify(exp))pass++;
    else{fail++;failures.push(exam_id+' Q'+qnum+': expected '+JSON.stringify(exp)+' got '+JSON.stringify(got));}
  }
}
console.log('gp-2234-y-range-snapshot: '+pass+' pass, '+fail+' fail');
if(fail>0){failures.forEach(f=>console.log('  FAIL:',f));process.exit(1);}
console.log('OK -- All RANGES group y_range values snapshot locked');
