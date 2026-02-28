// gp-2296: All question standards start with 'W'
const fs=require('fs'),path=require('path');
const DATA_DIR=path.join(__dirname,'../data');
const RP_FILES=fs.readdirSync(DATA_DIR).filter(f=>/^retake-practice-\d+\.json$/.test(f)).sort();
let pass=0,fail=0;const failures=[];
for(const file of RP_FILES){
  const d=JSON.parse(fs.readFileSync(path.join(DATA_DIR,file),'utf8'));
  for(const q of d.questions){
    const std=q.standard;
    if(typeof std==='string'&&std.startsWith('W'))pass++;
    else{fail++;failures.push(d.exam_id+' Q'+q.number+' standard='+JSON.stringify(std));}
  }
}
console.log('gp-2296-standards-start-W:',pass+' pass,',fail+' fail');
if(fail>0){failures.slice(0,5).forEach(f=>console.log('  FAIL:',f));process.exit(1);}
console.log('OK -- All standards start with W');
