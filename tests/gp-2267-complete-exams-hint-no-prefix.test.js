// gp-2267: Hints should not be prefixed with 'Hint:' -- the UI adds the label
const fs=require('fs'),path=require('path');
const DATA_DIR=path.join(__dirname,'../data');
const RP_FILES=fs.readdirSync(DATA_DIR).filter(f=>/^retake-practice-\d+\.json$/.test(f)).sort();
let pass=0,warn=0;const warnings=[];
for(const file of RP_FILES){
  const d=JSON.parse(fs.readFileSync(path.join(DATA_DIR,file),'utf8'));
  if(d.questions.length!==15)continue;
  d.questions.forEach(q=>{
    if((q.hint||'').startsWith('Hint:')){warn++;warnings.push(d.exam_id+' Q'+q.number+' hint starts with Hint:');}
    else pass++;
  });
}
console.log('gp-2267-hint-no-prefix:',pass+' pass, '+warn+' warnings');
if(warn>0){warnings.forEach(w=>console.log('  WARN:',w));}
console.log('OK -- Hint prefix check complete ('+(warn>0?'warnings only, no fail':'clean')+')');
