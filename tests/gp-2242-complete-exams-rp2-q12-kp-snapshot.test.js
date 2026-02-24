// gp-2242: RP2 Q12 key_points snapshot
const d=require('../data/retake-practice-2.json');
const EXP=[[1,2],[2,-4],[3,-6],[4,-4],[5,2]];
const got=d.questions.find(q=>q.number===12).graph.key_points;
const ok=JSON.stringify(got)===JSON.stringify(EXP);
console.log('gp-2242-rp2-q12-kp-snapshot:',ok?'1 pass':'1 fail');
if(!ok){console.log('  FAIL: expected',JSON.stringify(EXP),'got',JSON.stringify(got));process.exit(1);}
console.log('OK -- RP2 Q12 key_points snapshot locked');
