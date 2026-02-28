// gp-2243: RP3 Q12 key_points snapshot
const d=require('../data/retake-practice-3.json');
const EXP=[[-5,3],[-4,0],[-3,-1],[-2,0],[-1,3]];
const got=d.questions.find(q=>q.number===12).graph.key_points;
const ok=JSON.stringify(got)===JSON.stringify(EXP);
console.log('gp-2243-rp3-q12-kp-snapshot:',ok?'1 pass':'1 fail');
if(!ok){console.log('  FAIL: expected',JSON.stringify(EXP),'got',JSON.stringify(got));process.exit(1);}
console.log('OK -- RP3 Q12 key_points snapshot locked');
