// gp-2318: All inputs have an 'id' field
const fs=require('fs'),path=require('path');
const DATA_DIR=path.join(__dirname,'../data');
const RP_FILES=fs.readdirSync(DATA_DIR).filter(f=>/^retake-practice-\d+\.json$/.test(f)).sort();
let pass=0,fail=0;const failures=[];
for(const file of RP_FILES){
  const d=JSON.parse(fs.readFileSync(path.join(DATA_DIR,file),'utf8'));
  for(const q of d.questions){
    for(const inp of (q.inputs||[])){
      if(typeof inp.id==='string'&&inp.id.trim().length>0)pass++;
      else{fail++;failures.push(d.exam_id+' Q'+q.number+' input missing id: '+JSON.stringify(inp));}
    }
  }
}
console.log('gp-2318-inputs-have-id:',pass+' pass,',fail+' fail');
if(fail>0){failures.slice(0,5).forEach(f=>console.log('  FAIL:',f));process.exit(1);}
console.log('OK -- All inputs have an id field');
