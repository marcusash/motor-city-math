// Skip link target validation test
// WCAG 2.4.1: skip link .skip-link href="#main" must have matching id="main" in HTML

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} skip-link-target.test.js\n');

const htmlFiles = [
    { name: 'exam.html', hasSkipLink: true },
    { name: 'index.html', hasSkipLink: false }
];

var root = path.join(__dirname, '../../');

htmlFiles.forEach(function(f) {
    var src = fs.readFileSync(path.join(root, f.name), 'utf-8');
    console.log('\u2500\u2500 ' + f.name + ' \u2500\u2500');

    // Find skip link
    var skipLinkMatch = src.match(/class="skip-link"[^>]*href="([^"]+)"/i) ||
                        src.match(/href="([^"]+)"[^>]*class="skip-link"/i);

    if (!skipLinkMatch && !f.hasSkipLink) {
        console.log('  (no skip link expected)');
        return;
    }

    test(f.name + ': has .skip-link element', skipLinkMatch !== null || src.includes('skip-link'));

    if (skipLinkMatch) {
        var href = skipLinkMatch[1]; // e.g., "#main"
        var targetId = href.replace(/^#/, '');
        var hasTarget = src.includes('id="' + targetId + '"') || src.includes("id='" + targetId + "'");
        test(f.name + ': skip link target #' + targetId + ' exists in DOM', hasTarget);
        console.log('  Skip link href: ' + href + ', target found: ' + hasTarget);
    } else if (src.includes('skip-link')) {
        // skip-link present but couldn't extract href pattern
        test(f.name + ': skip link href parseable', false);
    }
});

console.log('\n' + '='.repeat(50));
console.log('skip-link-target: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
