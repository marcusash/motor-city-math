// css-transition-safe-props test
// Only safe CSS properties should be in transition declarations
// Animating layout-triggering props (width, height, top) causes jank

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-transition-safe-props.test.js\n');

var cssSrc = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

// Unsafe properties to animate (cause layout/paint)
var unsafeProps = ['width', 'height', 'top ', 'left ', 'right ', 'bottom ', 'margin', 'padding', 'font-size'];

console.log('\u2500\u2500 CSS transition property safety checks \u2500\u2500\n');

// Extract all transition declarations
var transitions = cssSrc.match(/transition:\s*[^;]+;/g) || [];
var unsafe = [];
transitions.forEach(function(td) {
    unsafeProps.forEach(function(prop) {
        if (td.includes(prop)) {
            unsafe.push(prop.trim() + ' in: ' + td.trim().slice(0, 60));
        }
    });
});

if (unsafe.length) unsafe.slice(0, 5).forEach(function(v) { console.log('  ! ' + v); });
console.log('  Total transition declarations: ' + transitions.length);

// Allow up to 2 unsafe (some layout transitions are intentional)
test('Transition declarations use mostly safe props (<3 layout-trigger uses): ' + unsafe.length, unsafe.length < 3);

console.log('\n' + '='.repeat(50));
console.log('css-transition-safe-props: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
