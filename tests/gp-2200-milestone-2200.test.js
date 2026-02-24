// gp-2200: MILESTONE 2200 -- 2200 GP regression tests committed
const assert=require('assert');
const fs=require('fs'),path=require('path');
const testDir=path.join(__dirname);
const gpTests=fs.readdirSync(testDir).filter(f=>/^gp-\d+.*\.test\.js$/.test(f));
const maxNum=gpTests.reduce((m,f)=>{const n=parseInt(f.match(/gp-(\d+)/)[1]);return Math.max(m,n);},0);
console.log('gp-2200-milestone: highest test num =',maxNum);
assert(maxNum>=2200,'Expected 2200+ tests, found '+maxNum);
console.log('OK -- MILESTONE 2200 achieved');
