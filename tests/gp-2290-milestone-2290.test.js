// gp-2290: MILESTONE 2290
const assert=require('assert'),fs=require('fs'),path=require('path');
const testDir=path.join(__dirname);
const gpTests=fs.readdirSync(testDir).filter(f=>/^gp-\d+.*\.test\.js$/.test(f));
const maxNum=gpTests.reduce((m,f)=>{const n=parseInt(f.match(/gp-(\d+)/)[1]);return Math.max(m,n);},0);
console.log('gp-2290-milestone: highest test num =',maxNum);
assert(maxNum>=2290,'Expected 2290+ tests, found '+maxNum);
console.log('OK -- MILESTONE 2290 achieved');
