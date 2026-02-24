// gp-2250: MILESTONE 2250
const assert=require('assert'),fs=require('fs'),path=require('path');
const testDir=path.join(__dirname);
const gpTests=fs.readdirSync(testDir).filter(f=>/^gp-\d+.*\.test\.js$/.test(f));
const maxNum=gpTests.reduce((m,f)=>{const n=parseInt(f.match(/gp-(\d+)/)[1]);return Math.max(m,n);},0);
console.log('gp-2250-milestone: highest test num =',maxNum);
assert(maxNum>=2250,'Expected 2250+ tests, found '+maxNum);
console.log('OK -- MILESTONE 2250 achieved');
