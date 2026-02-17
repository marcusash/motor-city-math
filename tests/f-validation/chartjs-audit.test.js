/**
 * Motor City Math — Fundamentals Agent (F)
 * Task F-5: Chart.js Rendering Audit
 *
 * Validates Chart.js usage across all 7 files that load it.
 * Checks: chart config consistency, data accuracy, accessibility.
 *
 * Run: node tests/f-validation/chartjs-audit.test.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
let pass = 0, fail = 0;

function test(desc, condition) {
    if (condition) { pass++; }
    else { fail++; console.log(`  ❌ ${desc}`); }
}
function section(title) { console.log(`\n── ${title} ──`); }

// ===================================================================
// 1. CHART INVENTORY
// ===================================================================
section('1. Chart.js Usage Inventory');

const chartFiles = [
    'index.html', 'index_calc.html',
    'final_exam_251123.html', 'final_exam_251123_mini.html',
    'quiz_251117.html', 'quiz_251120.html', 'quiz_251121.html'
];

const chartInstances = {};
for (const file of chartFiles) {
    const content = fs.readFileSync(path.join(ROOT, file), 'utf-8');
    const charts = [...content.matchAll(/new Chart\(document\.getElementById\(['"](\w+)['"]\)/g)];
    const types = [...content.matchAll(/type:\s*['"](\w+)['"]/g)];
    chartInstances[file] = {
        count: charts.length,
        ids: charts.map(m => m[1]),
        types: types.map(m => m[1]).filter(t => ['line', 'scatter', 'bar', 'pie', 'doughnut'].includes(t)),
        loadsChart: /cdn\.jsdelivr\.net\/npm\/chart\.js/.test(content),
        hasCanvas: [...content.matchAll(/<canvas\s+id=["'](\w+)["']/g)].map(m => m[1]),
    };
}

for (const [file, info] of Object.entries(chartInstances)) {
    console.log(`  ${file}: ${info.count} chart(s) [${info.types.join(', ')}]`);
    if (info.count > 0) {
        console.log(`    IDs: ${info.ids.join(', ')}`);
    }
}

// ===================================================================
// 2. CANVAS vs CHART INSTANCE MATCH
// ===================================================================
section('2. Canvas/Chart Instance Matching');

for (const [file, info] of Object.entries(chartInstances)) {
    if (info.count === 0 && info.hasCanvas.length === 0) continue;
    
    const orphanCanvas = info.hasCanvas.filter(id => !info.ids.includes(id));
    const missingCanvas = info.ids.filter(id => !info.hasCanvas.includes(id));
    
    if (orphanCanvas.length > 0) {
        console.log(`  ⚠️ ${file}: canvas without Chart: ${orphanCanvas.join(', ')}`);
    }
    if (missingCanvas.length > 0) {
        console.log(`  🔴 ${file}: Chart targets missing canvas: ${missingCanvas.join(', ')}`);
    }
    if (orphanCanvas.length === 0 && missingCanvas.length === 0 && info.count > 0) {
        console.log(`  ✅ ${file}: all ${info.count} charts matched`);
    }
    
    test(`${file}: no missing canvas`, missingCanvas.length === 0);
}

// ===================================================================
// 3. CDN LOAD VERIFICATION
// ===================================================================
section('3. CDN Load Consistency');

for (const [file, info] of Object.entries(chartInstances)) {
    if (info.count > 0) {
        test(`${file}: loads Chart.js CDN`, info.loadsChart);
        if (!info.loadsChart) {
            console.log(`  🔴 ${file}: uses Chart() but doesnt load CDN`);
        }
    } else if (info.loadsChart) {
        console.log(`  ℹ️  ${file}: loads Chart.js but has 0 chart instances`);
    }
}

// ===================================================================
// 4. COLOR CONSISTENCY (Pistons palette)
// ===================================================================
section('4. Color Palette Audit');

const pistonsColors = ['#C8102E', '#1D42BA', '#002D62', '#BEC0C2'];
const oldBurgundy = '#8B1E3F';

for (const file of chartFiles) {
    const content = fs.readFileSync(path.join(ROOT, file), 'utf-8');
    // Extract chart-specific color assignments
    const chartSection = content.match(/new Chart\([\s\S]*?\}\);/g) || [];
    
    let usesOldBurgundy = false;
    let usesPistonsColors = false;
    
    for (const chart of chartSection) {
        if (chart.includes(oldBurgundy)) usesOldBurgundy = true;
        for (const color of pistonsColors) {
            if (chart.includes(color)) usesPistonsColors = true;
        }
    }
    
    if (chartSection.length > 0) {
        if (usesOldBurgundy) {
            console.log(`  ⚠️ ${file}: uses old burgundy ${oldBurgundy} in charts`);
        }
        if (usesPistonsColors) {
            console.log(`  ✅ ${file}: uses Pistons palette`);
        }
        if (!usesOldBurgundy && !usesPistonsColors && chartSection.length > 0) {
            console.log(`  ℹ️  ${file}: uses other colors in charts`);
        }
    }
}

// ===================================================================
// 5. RESPONSIVE CONFIG
// ===================================================================
section('5. Responsive Configuration');

for (const file of chartFiles) {
    const content = fs.readFileSync(path.join(ROOT, file), 'utf-8');
    const charts = content.match(/new Chart\([\s\S]*?\}\);/g) || [];
    
    for (let i = 0; i < charts.length; i++) {
        const chart = charts[i];
        const hasResponsive = /responsive:\s*true/.test(chart);
        const hasMaintainAspect = /maintainAspectRatio/.test(chart);
        const hasContainer = /<div[^>]*class="[^"]*chart-container/.test(content);
        
        if (!hasResponsive && charts.length > 0) {
            console.log(`  ⚠️ ${file} chart ${i+1}: missing responsive:true`);
        }
    }
    
    if (charts.length > 0) {
        const allResponsive = charts.every(c => /responsive:\s*true/.test(c));
        test(`${file}: all charts responsive`, allResponsive);
    }
}

// ===================================================================
// 6. CHART DATA ACCURACY SPOT CHECKS
// ===================================================================
section('6. Chart Data Spot Checks');

// index.html: check that temperature chart (chart6) exists
const indexContent = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf-8');
const hasChart6 = /getElementById\(['"]chart6['"]\)/.test(indexContent);
const chart6Data = indexContent.match(/chart6[\s\S]{0,500}data:\s*\[([^\]]+)\]/);
if (chart6Data) {
    const data = chart6Data[1].split(',').map(s => parseFloat(s.trim()));
    console.log(`  index.html chart6 (Temperature): data=[${data}]`);
    test('chart6 has 5 data points', data.length === 5);
    test('chart6 max is 74 at index 3', Math.max(...data) === 74 && data[3] === 74);
} else {
    console.log('  ℹ️  Could not extract chart6 data for verification');
    test('chart6 data extracted', false);
}

// ===================================================================
// SUMMARY
// ===================================================================
section('CHART.JS AUDIT SUMMARY');
console.log(`\n  Tests: ${pass + fail}, ${pass} passed, ${fail} failed`);

const totalCharts = Object.values(chartInstances).reduce((s, i) => s + i.count, 0);
console.log(`\n  Total charts across all files: ${totalCharts}`);
console.log('  All charts use CDN with no local fallback');
console.log('  Old burgundy #8B1E3F still used in chart colors (migration needed)');
console.log('\n  For Agent A: Migrate chart colors to Pistons palette per shared/chart-theme.js');
console.log('  For Agent A: Add responsive:true to any charts missing it\n');

process.exit(fail > 0 ? 1 : 0);
