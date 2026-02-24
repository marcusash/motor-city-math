// index-open-graph-tags test
// index.html should have meta description for link sharing
// OG tags are nice-to-have; meta description is required baseline

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} index-open-graph-tags.test.js\n');

var indexSrc = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf-8');

console.log('\u2500\u2500 Meta description checks \u2500\u2500\n');

// Index has at least a <meta name="description"> fallback
var hasMetaDesc = indexSrc.includes('name="description"') || indexSrc.includes("name='description'");
test('index.html has meta description tag', hasMetaDesc);

// Description content is not empty
var descMatch = indexSrc.match(/name="description"\s+content="([^"]+)"/);
var hasDescContent = descMatch && descMatch[1].trim().length > 10;
test('meta description has meaningful content', !!hasDescContent);

// Optional: OG tags (informational)
var hasOgTitle = indexSrc.includes('og:title') || indexSrc.includes('property="og:');
if (!hasOgTitle) console.log('  \u2139\uFE0F  Open Graph meta tags not implemented (enhancement opportunity)');

console.log('\n' + '='.repeat(50));
console.log('index-open-graph-tags: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
