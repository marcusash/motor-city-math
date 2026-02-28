// gp-2215: Graph min_points snapshot
// Pattern: Q12 graphs use min_points=kps (except RP12 Q12 which has kps=7 but min=5)
// Q13 rational graphs in OLDER exams (RP1-5, RP12): min_points=4, kps=5 (intentional margin)
// NEWER exams (RP6-11): Q12=5,Q13=5 (min_points matches kps)

const fs=require('fs'),path=require('path');
const DATA_DIR=path.join(__dirname,'../data');
// [exam_id, q12_min, q13_min]
const EXPECTED=[
  ['retake-practice-1',5,4],['retake-practice-2',5,4],['retake-practice-3',5,4],
  ['retake-practice-4',5,4],['retake-practice-5',5,4],
  ['retake-practice-6',5,5],['retake-practice-7',5,5],['retake-practice-8',5,5],
  ['retake-practice-9',5,5],['retake-practice-10',5,5],['retake-practice-11',5,5],
  ['retake-practice-12',5,4] // RP12 Q12 has 7 kps but min=5 (separate known bug)
];
let pass=0,fail=0;const failures=[];
for(const[exam_id,q12exp,q13exp] of EXPECTED){
  const d=JSON.parse(fs.readFileSync(path.join(DATA_DIR,exam_id+'.json'),'utf8'));
  const q12=d.questions.find(q=>q.number===12);
  const q13=d.questions.find(q=>q.number===13);
  if(q12.graph.min_points===q12exp)pass++;else{fail++;failures.push(exam_id+' Q12: expected min='+q12exp+' got '+q12.graph.min_points);}
  if(q13.graph.min_points===q13exp)pass++;else{fail++;failures.push(exam_id+' Q13: expected min='+q13exp+' got '+q13.graph.min_points);}
}
console.log('gp-2215-graph-min-points-snapshot: '+pass+' pass, '+fail+' fail');
if(fail>0){failures.forEach(f=>console.log('  FAIL:',f));process.exit(1);}
console.log('OK -- Graph min_points snapshot locked (OLDER-Q13=4, all others=5)');
