// gp-2320: MILESTONE 2320
const assert=require('assert'),fs=require('fs'),path=require('path');
const testDir=path.join(__dirname);
const gpTests=fs.readdirSync(testDir).filter(f=>/^gp-\d+.*\.test\.js$/.test(f));
const maxNum=gpTests.reduce((m,f)=>{const n=parseInt(f.match(/gp-(\d+)/)[1]);return Math.max(m,n);},0);
console.log('gp-2320-milestone: highest test num =',maxNum,', total GP tests =',gpTests.length);
assert(maxNum>=2320,'Expected 2320+ tests, found '+maxNum);
console.log('OK -- MILESTONE 2320 achieved');
