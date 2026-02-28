// gp-2245: RP2 Q13 key_points snapshot
const d=require('../data/retake-practice-2.json');
const EXP=[[0,2.5],[1,4],[-1,2],[3,-2],[5,0]];
const got=d.questions.find(q=>q.number===13).graph.key_points;
const ok=JSON.stringify(got)===JSON.stringify(EXP);
console.log('gp-2245-rp2-q13-kp-snapshot:',ok?'1 pass':'1 fail');
if(!ok){console.log('  FAIL: expected',JSON.stringify(EXP),'got',JSON.stringify(got));process.exit(1);}
console.log('OK -- RP2 Q13 key_points snapshot locked');
