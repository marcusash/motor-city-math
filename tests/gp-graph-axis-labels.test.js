// gp-graph-axis-labels.test.js — graph questions should have x_label and y_label for chart rendering

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0;
let warn = 0;
const issues = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const isGraph = q.inputs && q.inputs.some(i => i.type === 'graph' || (q.question_html && q.question_html.toLowerCase().includes('graph')));
    const hasGraphData = q.graph || q.graph_data;
    if (!hasGraphData) continue;
    
    const gd = q.graph || q.graph_data;
    const hasXLabel = gd.x_label && gd.x_label.trim().length > 0;
    const hasYLabel = gd.y_label && gd.y_label.trim().length > 0;
    
    if (hasXLabel && hasYLabel) {
      pass++;
    } else {
      warn++;
      const missing = [!hasXLabel && 'x_label', !hasYLabel && 'y_label'].filter(Boolean).join(', ');
      issues.push(`${file}: Q${q.id} graph_data missing: ${missing}`);
    }
  }
}

console.log(`gp-graph-axis-labels: ${pass} pass, ${warn} missing axis labels`);
if (issues.length) {
  console.log('WARN — axis labels improve chart readability (GR/GD domain):');
  issues.forEach(i => console.log('  ', i));
}
// Informational — axis labels are UX improvement, not a blocking failure
process.exit(0);
