// Shared scripts no-CDN test
// shared/scripts.js must not reference any CDN URLs (all dependencies are local)
// Relying on CDN breaks offline/file:// usage

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} shared-scripts-no-cdn.test.js\n');

var scriptSrc = fs.readFileSync(path.join(__dirname, '../../shared/scripts.js'), 'utf-8');
var styleSrc = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

console.log('\u2500\u2500 CDN-free checks (shared/) \u2500\u2500\n');

var CDN_PATTERNS = [
    'cdn.jsdelivr.net', 'cdnjs.cloudflare.com', 'unpkg.com',
    'polyfill.io', 'cdn.mathjax.org', 'cdn.katex.org'
];

var scriptCDN = CDN_PATTERNS.filter(function(p) { return scriptSrc.includes(p); });
var cssCDN = CDN_PATTERNS.filter(function(p) { return styleSrc.includes(p); });

test('shared/scripts.js has no CDN URLs', scriptCDN.length === 0);
test('shared/styles.css has no CDN URLs', cssCDN.length === 0);

if (scriptCDN.length) scriptCDN.forEach(function(p) { console.log('  ! CDN in scripts.js: ' + p); });
if (cssCDN.length) cssCDN.forEach(function(p) { console.log('  ! CDN in styles.css: ' + p); });

// Also check exam.html for CDN references
var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');
var examCDN = CDN_PATTERNS.filter(function(p) { return examSrc.includes(p); });
test('exam.html has no CDN URLs', examCDN.length === 0);
if (examCDN.length) examCDN.forEach(function(p) { console.log('  ! CDN in exam.html: ' + p); });

// index.html CDN check
var indexSrc = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf-8');
var indexCDN = CDN_PATTERNS.filter(function(p) { return indexSrc.includes(p); });
test('index.html has no CDN URLs', indexCDN.length === 0);
if (indexCDN.length) indexCDN.forEach(function(p) { console.log('  ! CDN in index.html: ' + p); });

console.log('\n' + '='.repeat(50));
console.log('shared-scripts-no-cdn: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
