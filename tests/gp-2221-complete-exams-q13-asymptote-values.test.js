// gp-2221: Graph Q13 asymptote values snapshot for RP1-5 and RP12
const fs=require('fs'),path=require('path');
const DATA_DIR=path.join(__dirname,'../data');
const EXPECTED={
  'retake-practice-1':{vertical:[-1],horizontal:[3]},
  'retake-practice-2':{vertical:[2],horizontal:[1]},
  'retake-practice-3':{vertical:[-3],horizontal:[-2]},
  'retake-practice-4':{vertical:[4],horizontal:[3]},
  'retake-practice-5':{vertical:[2],horizontal:[-3]},
  'retake-practice-12':{vertical:[3],horizontal:[-2]}
};
let pass=0,fail=0;const failures=[];
for(const[exam_id,exp] of Object.entries(EXPECTED)){
  const d=JSON.parse(fs.readFileSync(path.join(DATA_DIR,exam_id+'.json'),'utf8'));
  const q13=d.questions.find(q=>q.number===13);
  const got=q13.graph.asymptotes;
  if(got&&got.vertical[0]===exp.vertical[0]&&got.horizontal[0]===exp.horizontal[0])pass++;
  else{fail++;failures.push(exam_id+' Q13: expected v='+exp.vertical[0]+' h='+exp.horizontal[0]+' got '+JSON.stringify(got));}
}
console.log('gp-2221-q13-asymptote-values-snapshot: '+pass+' pass, '+fail+' fail');
if(fail>0){failures.forEach(f=>console.log('  FAIL:',f));process.exit(1);}
console.log('OK -- All Q13 asymptote values snapshot locked');
