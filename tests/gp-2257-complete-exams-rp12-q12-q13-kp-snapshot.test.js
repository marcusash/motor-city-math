// gp-2257: RP12 Q12 and Q13 key_points snapshot
// Note: RP12 Q12 has 7 key_points (known bug reported to GI, should be 5)
const d=require('../data/retake-practice-12.json');
const EXP={
  12:[[-5,0],[-4,5],[-3,8],[-2,9],[-1,8],[0,5],[1,0]], // 7 kps (known bug)
  13:[[1,-4],[2,-6],[4,2],[5,0],[7,-1]]
};
let pass=0,fail=0;
for(const[n,exp] of Object.entries(EXP)){
  const got=d.questions.find(q=>q.number===parseInt(n)).graph.key_points;
  if(JSON.stringify(got)===JSON.stringify(exp))pass++;else{fail++;console.log('  FAIL Q'+n,'expected',JSON.stringify(exp),'got',JSON.stringify(got));}
}
console.log('gp-2257-rp12-kp-snapshot:',pass+' pass, '+fail+' fail');
if(fail>0)process.exit(1);
console.log('OK -- RP12 Q12/Q13 key_points snapshot locked (Q12 has 7 kps, known bug)');
