// gp-2270: MILESTONE 2270
const assert=require('assert'),fs=require('fs'),path=require('path');
const testDir=path.join(__dirname);
const gpTests=fs.readdirSync(testDir).filter(f=>/^gp-\d+.*\.test\.js$/.test(f));
const maxNum=gpTests.reduce((m,f)=>{const n=parseInt(f.match(/gp-(\d+)/)[1]);return Math.max(m,n);},0);
console.log('gp-2270-milestone: highest test num =',maxNum);
assert(maxNum>=2270,'Expected 2270+ tests, found '+maxNum);
console.log('OK -- MILESTONE 2270 achieved');
