#!/usr/bin/env node
// gp-rp-field-audit.js — Field completeness audit for all RP exam JSON files
// Usage: node scripts/gp-rp-field-audit.js

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const REQUIRED_QUESTION_FIELDS = ['question_html','inputs','hint','solution_steps','feedback_correct','feedback_wrong'];
const REQUIRED_INPUT_FIELDS = ['id','type','label','answer'];
const REQUIRED_META_FIELDS = ['exam_id','title','version'];

const files = fs.readdirSync(DATA_DIR).filter(f => f.match(/^retake-practice-\d+\.json$/)).sort();
const results = [];
let grandTotalQ = 0, grandMissing = 0;

for (const file of files) {
  const json = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const questions = json.questions || [];
  const meta = { file, q_count: questions.length, missing: [], meta_missing: [] };

  // Check top-level metadata
  for (const f of REQUIRED_META_FIELDS) {
    if (json[f] === undefined || json[f] === null || json[f] === '') meta.meta_missing.push(f);
  }

  // Check each question
  for (const q of questions) {
    const qid = q.id || q.question_id || '?';
    for (const field of REQUIRED_QUESTION_FIELDS) {
      if (q[field] === undefined || q[field] === null || q[field] === '') {
        meta.missing.push(`${qid}.${field}`);
        grandMissing++;
      }
    }
    // Check solution_steps length
    if (Array.isArray(q.solution_steps) && q.solution_steps.length < 3) {
      meta.missing.push(`${qid}.solution_steps(thin:${q.solution_steps.length})`);
    }
    // Check feedback length (ADHD: max 12 words)
    if (q.feedback_correct && q.feedback_correct.split(' ').length > 12) {
      meta.missing.push(`${qid}.feedback_correct(long:${q.feedback_correct.split(' ').length}w)`);
    }
  }
  grandTotalQ += questions.length;
  results.push(meta);
}

// Print report
console.log('\n=== GP RP FIELD COMPLETENESS AUDIT ===');
console.log(`Scanned ${files.length} exams, ${grandTotalQ} total questions\n`);

for (const r of results) {
  const status = r.missing.length === 0 && r.meta_missing.length === 0 ? '✅' : '⚠️';
  console.log(`${status} ${r.file} (${r.q_count}q)`);
  if (r.meta_missing.length) console.log(`   META missing: ${r.meta_missing.join(', ')}`);
  if (r.missing.length) console.log(`   FIELD issues: ${r.missing.slice(0,10).join(', ')}${r.missing.length>10?` +${r.missing.length-10} more`:''}`);
}

console.log(`\nTotal field issues: ${grandMissing}`);
console.log(grandMissing === 0 ? '✅ ALL CLEAN' : `⚠️  ${grandMissing} issues found`);

// Write machine-readable output
const report = { generated: new Date().toISOString(), exams: results, grand_total_questions: grandTotalQ, grand_total_issues: grandMissing };
const outPath = path.join(__dirname, '..', 'data', 'gp-field-audit-report.json');
fs.writeFileSync(outPath, JSON.stringify(report, null, 2));
console.log(`\nReport saved: data/gp-field-audit-report.json`);