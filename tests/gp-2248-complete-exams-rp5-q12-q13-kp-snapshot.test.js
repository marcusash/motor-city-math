// gp-2248: RP5 Q12 and Q13 key_points snapshot
const d=require('../data/retake-practice-5.json');
const EXPECTED={12:[[1,0],[2,-3],[3,-4],[4,-3],[5,0]], 13:[[-2,-1.75],[0,-0.5],[1,2],[3,-8],[4,-5.5]]};
let pass=0,fail=0;
for(const[qnum,exp] of Object.entries(EXPECTED)){
  const got=d.questions.find(q=>q.number===parseInt(qnum)).graph.key_points;
  if(JSON.stringify(got)===JSON.stringify(exp))pass++;
  else{fail++;console.log('  FAIL Q'+qnum+': expected',JSON.stringify(exp),'got',JSON.stringify(got));}
}
console.log('gp-2248-rp5-q12-q13-kp-snapshot:',pass+' pass, '+fail+' fail');
if(fail>0){process.exit(1);}
console.log('OK -- RP5 Q12/Q13 key_points snapshot locked');
