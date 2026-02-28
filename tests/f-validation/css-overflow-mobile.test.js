// CSS overflow handling test
// MCM must prevent horizontal scroll on mobile
// overflow-x: hidden or max-width: 100% on containers

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-overflow-mobile.test.js\n');

var cssSrc = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

console.log('\u2500\u2500 Mobile overflow checks \u2500\u2500\n');

// 1. overflow-x: hidden somewhere (prevents horizontal scroll)
var hasOverflowHidden = cssSrc.includes('overflow-x: hidden') || cssSrc.includes('overflow-x:hidden');
test('overflow-x: hidden defined (prevents horizontal scroll)', hasOverflowHidden);

// 2. box-sizing: border-box (prevents content overflow from padding)
var hasBoxSizing = cssSrc.includes('box-sizing: border-box') || cssSrc.includes('box-sizing:border-box');
test('box-sizing: border-box defined (prevents padding overflow)', hasBoxSizing);

// 3. max-width: 100% on images (prevents image overflow)
var hasMaxWidthImages = cssSrc.includes('max-width: 100%') || cssSrc.includes('max-width:100%');
test('max-width: 100% defined (prevents element overflow)', hasMaxWidthImages);

// 4. No fixed pixel widths on body/main that would overflow mobile
var bodyBlock = cssSrc.match(/body\s*\{([^}]+)\}/);
if (bodyBlock) {
    var hasFixedBodyWidth = /\bwidth:\s*\d{4,}px/.test(bodyBlock[1]); // > 999px fixed
    test('No large fixed width on body element', !hasFixedBodyWidth);
} else {
    test('Body element has no fixed large width', true); // no body block is fine
}

console.log('\n' + '='.repeat(50));
console.log('css-overflow-mobile: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
