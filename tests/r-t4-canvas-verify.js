/**
 * R-T4 Canvas Math Verification Script
 * Agent R — verifies canvas changes preserve math accuracy
 * Run: node tests/r-t4-canvas-verify.js
 */
var fs = require('fs');
var passed = 0, failed = 0;

function check(label, ok) {
    if (ok) { passed++; console.log('  \u2705 ' + label); }
    else { failed++; console.log('  \u274C ' + label); }
}

// Load all canvas-bearing files
var files = [
    'nonlinear_exam_mvp.html',
    'nonlinear_functions_test.html',
    'linear_functions_test.html',
    'quiz_251120.html',
    'quiz_251121.html',
    'index.html',
    'index_calc.html'
];

// === MVP EXAM: Deep verification ===
console.log('=== R-T4 CANVAS MATH VERIFICATION ===\n');
var mvp = fs.readFileSync('nonlinear_exam_mvp.html', 'utf8');

console.log('1. Coordinate transforms (MVP):');
check('Grid range: (gx+16)/32', mvp.indexOf('gx + 16) / 32') !== -1);
check('Y-axis flip: (-fy+16)/32 or (-gy+16)/32', mvp.indexOf('fy + 16) / 32') !== -1 || mvp.indexOf('gy + 16) / 32') !== -1);
check('Grid step: pw / 32', mvp.indexOf('d.pw / 32') !== -1);

console.log('\n2. Q12 parabola f(x) = -(x+2)\u00B2+5:');
check('Q12 function: -(x + 2) * (x + 2) + 5', mvp.indexOf('-(x + 2) * (x + 2) + 5') !== -1);
check('Q12 vertex h=-2', mvp.indexOf("'q12_vx', -2") !== -1);
check('Q12 vertex k=5', mvp.indexOf("'q12_vy', 5") !== -1);

// Compute Q12 at key points
var q12 = function(x) { return -(x + 2) * (x + 2) + 5; };
check('Q12: f(-2)=5', q12(-2) === 5);
check('Q12: f(0)=1', q12(0) === 1);
check('Q12: f(-4)=1', q12(-4) === 1);
check('Q12: f(1)=-4', q12(1) === -4);
check('Q12: f(-5)=-4', q12(-5) === -4);

console.log('\n3. Q13 rational f(x) = 3/(x-1) - 2:');
check('Q13 function: 3 / (x - 1) - 2', mvp.indexOf('3 / (x - 1) - 2') !== -1);
check('Q13 VA: x=1', mvp.indexOf("'q13_va', 1") !== -1);
check('Q13 HA: y=-2', mvp.indexOf("'q13_ha', -2") !== -1);

var q13 = function(x) { return 3 / (x - 1) - 2; };
check('Q13: f(2)=1', q13(2) === 1);
check('Q13: f(4)=-1', q13(4) === -1);
check('Q13: f(-2)=-3', q13(-2) === -3);
check('Q13: f(0)=-5', q13(0) === -5);

console.log('\n4. Point-check algorithm:');
check('Tolerance = 0.25', mvp.indexOf('tolerance = 0.25') !== -1);
check('Check: |p.gy - expected| <= tolerance', mvp.indexOf('Math.abs(p.gy - expected) <= tolerance') !== -1);
check('Min 5 points required', mvp.indexOf('n < 5') !== -1 || mvp.indexOf('n >= 5') !== -1);

console.log('\n5. Answer key (15 questions):');
check("Q1: cubic", mvp.indexOf("=== 'cubic'") !== -1);
check("Q2: absolute", mvp.indexOf("=== 'absolute'") !== -1);
check("Q3: quadratic", mvp.indexOf("=== 'quadratic'") !== -1);
check("Q4: x=2", mvp.indexOf("'q4_x', 2") !== -1);
check("Q5: x=0.5,-1.5", mvp.indexOf("0.5, -1.5") !== -1);
check("Q6: x=\u00B12.236", mvp.indexOf("2.236, -2.236") !== -1);
check("Q7: x=2", mvp.indexOf("'q7_x', 2") !== -1);
check("Q8: x=5.667", mvp.indexOf("'q8_x', 5.667") !== -1);
check("Q9: x=3", mvp.indexOf("'q9_x', 3") !== -1);
check("Q10: x=\u00B12.449", mvp.indexOf("'q10_x1', 'q10_x2', 2.449") !== -1);
check("Q11: x=9", mvp.indexOf("'q11_x', 9") !== -1);
check("Q14: answer B", mvp.indexOf("=== 'B'") !== -1);
check("Q15: t=20", mvp.indexOf("'q15_t', 20") !== -1);

console.log('\n6. Canvas setup:');
check("initGraph('graphQ12')", mvp.indexOf("initGraph('graphQ12')") !== -1);
check("initGraph('graphQ13')", mvp.indexOf("initGraph('graphQ13')") !== -1);
// A2 arch: canvas is always white, MutationObserver intentionally removed
check('Static CANVAS constant (always white)', mvp.indexOf("var CANVAS") !== -1 || mvp.indexOf('getCanvasColors') !== -1);
check('White background fillRect', mvp.indexOf('fillRect(0, 0, d.w, d.h)') !== -1);
check('Asymptote VA tolerance check', mvp.indexOf('asymptotes.vertical[0] - 1)') !== -1);
check('Asymptote HA tolerance check', mvp.indexOf('asymptotes.horizontal[0] - (-2))') !== -1);

console.log('\n7. SAAS grade thresholds:');
check('\u226592% = 4', mvp.indexOf('pct >= 92 ? 4') !== -1);
check('\u226582% = 3', mvp.indexOf('pct >= 82 ? 3') !== -1);
check('\u226570% = 2', mvp.indexOf('pct >= 70 ? 2') !== -1);

console.log('\n8. Either-box checker:');
check('checkPlusMinus: order1 || order2', mvp.indexOf('order1 || order2') !== -1);

// === CHECK ALL OTHER CANVAS FILES EXIST ===
console.log('\n9. Canvas-bearing files exist:');
files.forEach(function(f) {
    check(f + ' exists', fs.existsSync(f));
});

// === CHECK OTHER GRAPH FILES HAVE CANVAS ===
console.log('\n10. Graph files retain canvas elements:');
var graphFiles = ['nonlinear_functions_test.html', 'linear_functions_test.html'];
graphFiles.forEach(function(f) {
    if (!fs.existsSync(f)) return;
    var content = fs.readFileSync(f, 'utf8');
    check(f + ': has <canvas>', content.indexOf('<canvas') !== -1);
    check(f + ': has drawGrid or drawAxis', content.indexOf('drawGrid') !== -1 || content.indexOf('drawAxis') !== -1 || content.indexOf('drawAxes') !== -1);
});

// === SUMMARY ===
console.log('\n=== RESULTS: ' + passed + ' passed, ' + failed + ' failed ===');
if (failed === 0) console.log('\uD83D\uDFE2 ALL CANVAS MATH CHECKS PASS');
else console.log('\uD83D\uDD34 CANVAS MATH CHECK FAILED \u2014 ' + failed + ' issues');

process.exit(failed > 0 ? 1 : 0);
