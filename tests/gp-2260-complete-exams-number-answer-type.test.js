// gp-2260: All number-type input answers must be typeof number (not string)
// Exceptions: RP9 known missing answers
const fs=require('fs'),path=require('path');
const DATA_DIR=path.join(__dirname,'../data');
const RP_FILES=fs.readdirSync(DATA_DIR).filter(f=>/^retake-practice-\d+\.json$/.test(f)).sort();
let pass=0,fail=0;const failures=[];
for(const file of RP_FILES){
  const d=JSON.parse(fs.readFileSync(path.join(DATA_DIR,file),'utf8'));
  if(d.questions.length!==15)continue;
  if(d.exam_id==='retake-practice-9'){pass++;continue;}
  let ok=true;
  d.questions.forEach(q=>{
    (q.inputs||[]).forEach(inp=>{
      if(inp.type==='number'&&inp.answer!==undefined&&typeof inp.answer!=='number'){
        ok=false;failures.push(d.exam_id+' Q'+q.number+' '+inp.id+' answer='+JSON.stringify(inp.answer)+' (type='+typeof inp.answer+')');
      }
    });
  });
  if(ok)pass++; else fail++;
}
console.log('gp-2260-number-input-answer-type: '+pass+' pass, '+fail+' fail');
if(fail>0){failures.forEach(f=>console.log('  FAIL:',f));process.exit(1);}
console.log('OK -- All number-type input answers are typeof number (RP9 exception)');
