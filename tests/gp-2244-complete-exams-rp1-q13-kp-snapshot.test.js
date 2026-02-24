// gp-2244: RP1 Q13 key_points snapshot
const d=require('../data/retake-practice-1.json');
const EXP=[[-3,2],[-2,1],[0,5],[1,4],[3,3.5]];
const got=d.questions.find(q=>q.number===13).graph.key_points;
const ok=JSON.stringify(got)===JSON.stringify(EXP);
console.log('gp-2244-rp1-q13-kp-snapshot:',ok?'1 pass':'1 fail');
if(!ok){console.log('  FAIL: expected',JSON.stringify(EXP),'got',JSON.stringify(got));process.exit(1);}
console.log('OK -- RP1 Q13 key_points snapshot locked');
