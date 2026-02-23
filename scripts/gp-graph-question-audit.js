/**
 * gp-graph-question-audit.js — List all graph questions and their key_points
 *
 * Shows which questions have graph_data, what key_points are defined,
 * and flags any graph questions missing key_points.
 *
 * Run: node scripts/gp-graph-question-audit.js
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_PATTERN = /^retake-practice-\d+\.json$/;

const files = fs.readdirSync(DATA_DIR).filter(f => RP_PATTERN.test(f)).sort();

let totalGraphQs = 0;
let missingKeyPoints = 0;

for (const file of files) {
    const raw = fs.readFileSync(path.join(DATA_DIR, file), 'utf-8');
    let data;
    try { data = JSON.parse(raw); } catch { continue; }

    const graphQs = (data.questions || []).filter(q => q.graph_data);
    if (graphQs.length === 0) continue;

    console.log('\n' + file + ' — ' + graphQs.length + ' graph question(s):');
    for (const q of graphQs) {
        totalGraphQs++;
        const kp = q.graph_data.key_points;
        if (!kp || kp.length === 0) {
            console.log('  ⚠️  ' + q.id + ': NO key_points defined');
            missingKeyPoints++;
        } else {
            const kpStr = kp.map(p => '(' + p.x + ',' + p.y + ')').join(' ');
            console.log('  ✅ ' + q.id + ': key_points ' + kpStr);
        }
    }
}

console.log('\n─── Summary ───');
console.log('Total graph questions: ' + totalGraphQs);
console.log('Missing key_points: ' + missingKeyPoints);
if (missingKeyPoints > 0) {
    console.log('⚠️  File bug reports for missing key_points to GR.');
} else {
    console.log('✅ All graph questions have key_points.');
}
