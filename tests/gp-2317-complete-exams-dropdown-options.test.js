// gp-2317: All dropdown inputs have options array with at least 2 choices
const fs=require('fs'),path=require('path');
const DATA_DIR=path.join(__dirname,'../data');
const RP_FILES=fs.readdirSync(DATA_DIR).filter(f=>/^retake-practice-\d+\.json$/.test(f)).sort();
let pass=0,fail=0;const failures=[];
for(const file of RP_FILES){
  const d=JSON.parse(fs.readFileSync(path.join(DATA_DIR,file),'utf8'));
  for(const q of d.questions){
    for(const inp of (q.inputs||[])){
      if(inp.type==='dropdown'){
        if(Array.isArray(inp.options)&&inp.options.length>=2)pass++;
        else{fail++;failures.push(d.exam_id+' Q'+q.number+' input '+inp.id+' options='+JSON.stringify(inp.options));}
      }
    }
  }
}
console.log('gp-2317-dropdown-options:',pass+' pass,',fail+' fail');
if(fail>0){failures.slice(0,5).forEach(f=>console.log('  FAIL:',f));process.exit(1);}
console.log('OK -- All dropdown inputs have options with at least 2 choices');
