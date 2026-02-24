// gp-2246: RP3 Q13 key_points snapshot
const d=require('../data/retake-practice-3.json');
const EXP=[[-5,-4],[-2,2],[-1,0],[1,-1],[5,-1.5]];
const got=d.questions.find(q=>q.number===13).graph.key_points;
const ok=JSON.stringify(got)===JSON.stringify(EXP);
console.log('gp-2246-rp3-q13-kp-snapshot:',ok?'1 pass':'1 fail');
if(!ok){console.log('  FAIL: expected',JSON.stringify(EXP),'got',JSON.stringify(got));process.exit(1);}
console.log('OK -- RP3 Q13 key_points snapshot locked');
