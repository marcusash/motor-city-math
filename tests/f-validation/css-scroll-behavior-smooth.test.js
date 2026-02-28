// css-scroll-behavior-smooth test
// CSS should define scroll-behavior: smooth for a polished UX
// Without it, scrolling between sections is jarring (jumpy)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-scroll-behavior-smooth.test.js\n');

var css = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');
var js  = fs.readFileSync(path.join(__dirname, '../../shared/scripts.js'), 'utf-8');

var hasScrollSmooth = /scroll-behavior\s*:\s*smooth/.test(css);
var hasScrollIntoView = /scrollIntoView|scrollTo|scroll-behavior/.test(js) || /scrollIntoView/.test(
    require('fs').readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8')
);

test('CSS or JS defines smooth scroll behavior', hasScrollSmooth || hasScrollIntoView);

console.log('\n' + '='.repeat(50));
console.log('css-scroll-behavior-smooth: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
