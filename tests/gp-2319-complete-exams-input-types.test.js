// gp-2319: All inputs have a 'type' field
const fs=require('fs'),path=require('path');
const DATA_DIR=path.join(__dirname,'../data');
const RP_FILES=fs.readdirSync(DATA_DIR).filter(f=>/^retake-practice-\d+\.json$/.test(f)).sort();
const VALID_TYPES=new Set(['number','dropdown','text','radio','checkbox']);
let pass=0,fail=0;const failures=[];
for(const file of RP_FILES){
  const d=JSON.parse(fs.readFileSync(path.join(DATA_DIR,file),'utf8'));
  for(const q of d.questions){
    for(const inp of (q.inputs||[])){
      if(typeof inp.type==='string'&&VALID_TYPES.has(inp.type))pass++;
      else{fail++;failures.push(d.exam_id+' Q'+q.number+' input '+inp.id+' type='+JSON.stringify(inp.type));}
    }
  }
}
console.log('gp-2319-input-types:',pass+' pass,',fail+' fail');
if(fail>0){failures.slice(0,5).forEach(f=>console.log('  FAIL:',f));process.exit(1);}
console.log('OK -- All inputs have valid type field');
