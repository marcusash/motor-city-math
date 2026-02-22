#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const dataDir = path.join(root, 'data');
const outputDir = path.join(root, 'artifacts');
const examPattern = /^retake-practice-\d+\.json$/;

const hasText = (value) => typeof value === 'string' && value.trim().length > 0;

function loadJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function summarizeExam(filePath) {
  const data = loadJson(filePath);
  const questions = Array.isArray(data.questions) ? data.questions : [];
  const summary = {
    exam_id: data.exam_id || path.basename(filePath, '.json'),
    question_count: questions.length,
    missing_hint: [],
    missing_solution_steps: [],
    missing_feedback: [],
    missing_inputs: [],
    missing_standard: [],
    missing_question_html: []
  };

  questions.forEach((q) => {
    const qid = q && q.id ? q.id : `q-${q.number || '?'}`;
    if (!hasText(q && q.hint)) summary.missing_hint.push(qid);
    if (!Array.isArray(q && q.solution_steps) || q.solution_steps.length === 0) {
      summary.missing_solution_steps.push(qid);
    }
    if (!(q && (q.feedback_correct || q.feedback_wrong || q.feedback_wrong_parent))) {
      summary.missing_feedback.push(qid);
    }
    if (!Array.isArray(q && q.inputs) || q.inputs.length === 0) {
      summary.missing_inputs.push(qid);
    }
    if (!hasText(q && q.standard)) summary.missing_standard.push(qid);
    if (!hasText(q && q.question_html)) summary.missing_question_html.push(qid);
  });

  return summary;
}

function buildMarkdown(exams, generatedAt) {
  const lines = [];
  lines.push('# QA Summary');
  lines.push('');
  lines.push(`Generated: ${generatedAt}`);
  lines.push('');
  lines.push('| Exam | Questions | Missing hints | Missing steps | Missing feedback | Missing inputs | Missing standard | Missing HTML |');
  lines.push('|------|-----------|---------------|---------------|------------------|----------------|------------------|--------------|');
  exams.forEach((exam) => {
    lines.push(
      `| ${exam.exam_id} | ${exam.question_count} | ${exam.missing_hint.length} | ${exam.missing_solution_steps.length} | ${exam.missing_feedback.length} | ${exam.missing_inputs.length} | ${exam.missing_standard.length} | ${exam.missing_question_html.length} |`
    );
  });
  lines.push('');
  exams.forEach((exam) => {
    const sections = [
      ['Missing hints', exam.missing_hint],
      ['Missing solution_steps', exam.missing_solution_steps],
      ['Missing feedback', exam.missing_feedback],
      ['Missing inputs', exam.missing_inputs],
      ['Missing standard', exam.missing_standard],
      ['Missing question_html', exam.missing_question_html]
    ];
    lines.push(`## ${exam.exam_id}`);
    lines.push('');
    sections.forEach(([label, list]) => {
      lines.push(`- ${label}: ${list.length ? list.join(', ') : 'none'}`);
    });
    lines.push('');
  });
  return lines.join('\n');
}

function main() {
  fs.mkdirSync(outputDir, { recursive: true });
  const files = fs.readdirSync(dataDir).filter((file) => examPattern.test(file)).sort();
  const summaries = files.map((file) => summarizeExam(path.join(dataDir, file)));
  const generatedAt = new Date().toISOString();

  const output = {
    generated_at: generatedAt,
    source: 'data/retake-practice-*.json',
    exams: summaries
  };

  fs.writeFileSync(path.join(outputDir, 'qa-summary.json'), JSON.stringify(output, null, 2));
  fs.writeFileSync(path.join(outputDir, 'qa-summary.md'), buildMarkdown(summaries, generatedAt));
}

main();
