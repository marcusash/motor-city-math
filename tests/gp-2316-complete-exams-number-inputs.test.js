// gp-2316: All 'number' type inputs have a numeric answer field
const fs=require('fs'),path=require('path');
const DATA_DIR=path.join(__dirname,'../data');
const RP_FILES=fs.readdirSync(DATA_DIR).filter(f=>/^retake-practice-\d+\.json$/.test(f)).sort();
let pass=0,fail=0;const failures=[];
for(const file of RP_FILES){
  const d=JSON.parse(fs.readFileSync(path.join(DATA_DIR,file),'utf8'));
  for(const q of d.questions){
    for(const inp of (q.inputs||[])){
      if(inp.type==='number'){
        if(inp.answer!==undefined&&typeof inp.answer==='number')pass++;
        else{fail++;failures.push(d.exam_id+' Q'+q.number+' input '+inp.id+' answer='+JSON.stringify(inp.answer));}
      }
    }
  }
}
console.log('gp-2316-number-inputs-answer:',pass+' pass,',fail+' fail');
if(fail>0){failures.slice(0,5).forEach(f=>console.log('  FAIL:',f));process.exit(1);}
console.log('OK -- All number inputs have numeric answer');
