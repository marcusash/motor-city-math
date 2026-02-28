// gp-2241: RP1 Q12 key_points snapshot
const d=require('../data/retake-practice-1.json');
const EXP=[[-1,0],[0,-3],[1,-4],[2,-3],[3,0]];
const got=d.questions.find(q=>q.number===12).graph.key_points;
const ok=JSON.stringify(got)===JSON.stringify(EXP);
console.log('gp-2241-rp1-q12-kp-snapshot:',ok?'1 pass':'1 fail');
if(!ok){console.log('  FAIL: expected',JSON.stringify(EXP),'got',JSON.stringify(got));process.exit(1);}
console.log('OK -- RP1 Q12 key_points snapshot locked');
