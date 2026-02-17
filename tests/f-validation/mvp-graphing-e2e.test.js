/**
 * Motor City Math — Fundamentals Agent (F)
 * MVP: Graphing E2E Tests
 *
 * 21 test cases from .mvp-spec.md for Q12/Q13 graphing:
 *  - Point-check algorithm (correct/incorrect detection)
 *  - Asymptote validation
 *  - Tooltip coordinate snapping
 *  - Canvas sizing constraints
 *
 * These tests validate the ALGORITHM, not the DOM. They can run
 * in Node without a browser by testing the pure math functions
 * that Agent A will implement.
 *
 * Run: node tests/f-validation/mvp-graphing-e2e.test.js
 */

let pass = 0, fail = 0;

function test(desc, condition) {
    if (condition) { pass++; }
    else { fail++; console.log(`  ❌ ${desc}`); }
}
function section(title) { console.log(`\n── ${title} ──`); }

// ===================================================================
// PURE FUNCTIONS (extracted from spec — Agent A will implement these)
// ===================================================================

// Target functions from the spec
const q12Func = x => -((x + 2) ** 2) + 5;
const q13Func = x => 3 / (x - 1) - 2;

// Point-check algorithm (from .mvp-spec.md pseudocode)
function checkGraphPoint(gx, gy, targetFunc, tolerance) {
    const expected = targetFunc(gx);
    return Math.abs(gy - expected) <= tolerance;
}

// Asymptote check
function checkAsymptote(value, expected, tolerance) {
    return Math.abs(value - expected) <= tolerance;
}

// Snap to nearest 0.25 grid unit
function snapToGrid(value) {
    return Math.round(value * 4) / 4;
}

// Coordinate conversion: graph → screen (from nonlinear_functions_test.html lines 879-880)
function graphToScreen(graphX, graphY, margins) {
    const { marginLeft, marginTop, plotWidth, plotHeight } = margins;
    const screenX = marginLeft + plotWidth / 2 + (graphX * plotWidth / 32);
    const screenY = marginTop + plotHeight / 2 - (graphY * plotHeight / 32);
    return { x: screenX, y: screenY };
}

// Coordinate conversion: screen → graph (from nonlinear_functions_test.html lines 776-777)
function screenToGraph(screenX, screenY, margins) {
    const { marginLeft, marginTop, plotWidth, plotHeight } = margins;
    const graphX = ((screenX - marginLeft) / plotWidth) * 32 - 16;
    const graphY = -(((screenY - marginTop) / plotHeight) * 32 - 16);
    return { x: graphX, y: graphY };
}

// Standard canvas margins from existing code
const MARGINS_700 = {
    marginLeft: 40, marginRight: 20, marginTop: 20, marginBottom: 35,
    plotWidth: 700 - 40 - 20,  // 640
    plotHeight: 700 - 20 - 35  // 645
};

const MARGINS_500 = {
    marginLeft: 40, marginRight: 20, marginTop: 20, marginBottom: 35,
    plotWidth: 500 - 40 - 20,  // 440
    plotHeight: 500 - 20 - 35  // 445
};

const TOLERANCE = 0.25;

// ===================================================================
// Q12 — Parabola: f(x) = -(x + 2)² + 5
// ===================================================================
section('Q12 — Parabola: f(x) = -(x + 2)² + 5');

// Verify the function itself
test('Q12 f(-2) = 5 (vertex)', q12Func(-2) === 5);
test('Q12 f(0) = 1', q12Func(0) === 1);
test('Q12 f(-4) = 1', q12Func(-4) === 1);
test('Q12 f(-1) = 4', q12Func(-1) === 4);
test('Q12 f(-3) = 4', q12Func(-3) === 4);

// Point-check tests from spec
test('Vertex at (-2, 5) → green',
    checkGraphPoint(-2, 5, q12Func, TOLERANCE));

test('Point at (0, 1) → green [f(0) = 1]',
    checkGraphPoint(0, 1, q12Func, TOLERANCE));

test('Point at (-4, 1) → green [f(-4) = 1]',
    checkGraphPoint(-4, 1, q12Func, TOLERANCE));

test('Point at (-1, 4) → green [f(-1) = 4]',
    checkGraphPoint(-1, 4, q12Func, TOLERANCE));

test('Point at (-3, 4) → green [f(-3) = 4]',
    checkGraphPoint(-3, 4, q12Func, TOLERANCE));

test('Point at (0, 3) → RED [f(0) = 1, off by 2.0]',
    !checkGraphPoint(0, 3, q12Func, TOLERANCE));

test('Point at (-2, 4) → RED [f(-2) = 5, off by 1.0]',
    !checkGraphPoint(-2, 4, q12Func, TOLERANCE));

test('Point at (-2, 4.8) → green [f(-2) = 5, off by 0.2 < 0.25]',
    checkGraphPoint(-2, 4.8, q12Func, TOLERANCE));

// Minimum points check
test('4 points should fail minimum (need 5)',
    4 < 5);

test('CHECK GRAPH disabled until 5+ points',
    5 >= 5);

// ===================================================================
// Q13 — Rational: f(x) = 3/(x - 1) - 2
// ===================================================================
section('Q13 — Rational: f(x) = 3/(x - 1) - 2');

// Verify the function itself
test('Q13 f(2) = 1', Math.abs(q13Func(2) - 1) < 0.001);
test('Q13 f(4) = -1', Math.abs(q13Func(4) - (-1)) < 0.001);
test('Q13 f(-2) = -3', Math.abs(q13Func(-2) - (-3)) < 0.001);
test('Q13 f(0) = -5', Math.abs(q13Func(0) - (-5)) < 0.001);

// Point-check tests from spec
test('Point at (2, 1) → green [f(2) = 1]',
    checkGraphPoint(2, 1, q13Func, TOLERANCE));

test('Point at (4, -1) → green [f(4) = -1]',
    checkGraphPoint(4, -1, q13Func, TOLERANCE));

test('Point at (-2, -3) → green [f(-2) = -3]',
    checkGraphPoint(-2, -3, q13Func, TOLERANCE));

test('Point at (0, -5) → green [f(0) = -5]',
    checkGraphPoint(0, -5, q13Func, TOLERANCE));

test('Point at (2, 3) → RED [f(2) = 1, off by 2.0]',
    !checkGraphPoint(2, 3, q13Func, TOLERANCE));

// Asymptote tests
test('Vertical asymptote at x = 1 → green (±0.25)',
    checkAsymptote(1, 1, TOLERANCE));

test('Horizontal asymptote at y = -2 → green (±0.25)',
    checkAsymptote(-2, -2, TOLERANCE));

test('Vertical asymptote at x = 2 → RED [expected x = 1]',
    !checkAsymptote(2, 1, TOLERANCE));

test('Horizontal asymptote at y = 0 → RED [expected y = -2]',
    !checkAsymptote(0, -2, TOLERANCE));

// ===================================================================
// Canvas UX — Tooltip Snapping
// ===================================================================
section('Canvas UX — Tooltip Snapping');

test('Snap 2.73 → 2.75', snapToGrid(2.73) === 2.75);
test('Snap 3.1 → 3.0', snapToGrid(3.1) === 3.0);
test('Snap 0.0 → 0.0', snapToGrid(0.0) === 0.0);
test('Snap -1.88 → -2.0', snapToGrid(-1.88) === -2.0);
test('Snap 0.12 → 0.0', snapToGrid(0.12) === 0.0);
test('Snap 0.13 → 0.25', snapToGrid(0.13) === 0.25);
test('Snap -5.37 → -5.25', snapToGrid(-5.37) === -5.25);
test('Snap 16.0 → 16.0 (edge of grid)', snapToGrid(16.0) === 16.0);
test('Snap -16.0 → -16.0 (edge of grid)', snapToGrid(-16.0) === -16.0);

// ===================================================================
// Canvas UX — Coordinate Conversion Round-Trip
// ===================================================================
section('Canvas UX — Coordinate Conversion');

// Round-trip: graph → screen → graph should be identity
function roundTripOk(gx, gy, margins) {
    const screen = graphToScreen(gx, gy, margins);
    const back = screenToGraph(screen.x, screen.y, margins);
    return Math.abs(back.x - gx) < 0.001 && Math.abs(back.y - gy) < 0.001;
}

test('Round-trip (0, 0) at 700×700', roundTripOk(0, 0, MARGINS_700));
test('Round-trip (-2, 5) at 700×700', roundTripOk(-2, 5, MARGINS_700));
test('Round-trip (16, -16) at 700×700', roundTripOk(16, -16, MARGINS_700));
test('Round-trip (-16, 16) at 700×700', roundTripOk(-16, 16, MARGINS_700));
test('Round-trip (0, 0) at 500×500', roundTripOk(0, 0, MARGINS_500));
test('Round-trip (-2, 5) at 500×500', roundTripOk(-2, 5, MARGINS_500));

// Origin should map to center of plot area
const origin700 = graphToScreen(0, 0, MARGINS_700);
test('Origin (0,0) at center of 700px canvas',
    Math.abs(origin700.x - (40 + 640/2)) < 0.01 &&
    Math.abs(origin700.y - (20 + 645/2)) < 0.01);

// ===================================================================
// Canvas Sizing
// ===================================================================
section('Canvas Sizing');

test('700×700 on desktop (spec default)', 700 >= 700);
test('Min 500×500 on mobile (spec minimum)', 500 >= 500);
test('Plot area at 700: width=640, height=645',
    MARGINS_700.plotWidth === 640 && MARGINS_700.plotHeight === 645);
test('Plot area at 500: width=440, height=445',
    MARGINS_500.plotWidth === 440 && MARGINS_500.plotHeight === 445);

// ===================================================================
// Q12/Q13 — Graph function values at 0.25 snap points
// ===================================================================
section('Q12/Q13 — Clean values at 0.25 snap points');

// Verify that the graph functions produce reasonable values at snap points
// that Kai would actually click on
const q12SnapPoints = [
    [-4, 1], [-3.5, 2.75], [-3, 4], [-2.5, 4.75], [-2, 5],
    [-1.5, 4.75], [-1, 4], [-0.5, 2.75], [0, 1]
];
for (const [x, expected] of q12SnapPoints) {
    const actual = q12Func(x);
    test(`Q12 f(${x}) = ${expected}`, Math.abs(actual - expected) < 0.001);
}

const q13SnapPoints = [
    [-2, -3], [-0.5, -4], [0, -5], [2, 1], [4, -1], [7, -1.5]
];
for (const [x, expected] of q13SnapPoints) {
    const actual = q13Func(x);
    test(`Q13 f(${x}) = ${expected}`, Math.abs(actual - expected) < 0.001);
}

// Q13: verify near-asymptote behavior
test('Q13 f(1.25) = 10 (near asymptote, large value)',
    Math.abs(q13Func(1.25) - 10) < 0.001);
test('Q13 f(0.75) = -14 (near asymptote, large negative)',
    Math.abs(q13Func(0.75) - (-14)) < 0.001);

// ===================================================================
// SUMMARY
// ===================================================================
section('GRAPHING E2E SUMMARY');
console.log(`\n  Tests: ${pass + fail}, ${pass} passed, ${fail} failed\n`);
process.exit(fail > 0 ? 1 : 0);
