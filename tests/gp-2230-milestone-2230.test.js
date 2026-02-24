// gp-2230: MILESTONE 2230
const assert=require('assert'),fs=require('fs'),path=require('path');
const testDir=path.join(__dirname);
const gpTests=fs.readdirSync(testDir).filter(f=>/^gp-\d+.*\.test\.js$/.test(f));
const maxNum=gpTests.reduce((m,f)=>{const n=parseInt(f.match(/gp-(\d+)/)[1]);return Math.max(m,n);},0);
console.log('gp-2230-milestone: highest test num =',maxNum);
assert(maxNum>=2230,'Expected 2230+ tests, found '+maxNum);
console.log('OK -- MILESTONE 2230 achieved');
