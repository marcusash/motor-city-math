#!/usr/bin/env node
// One-shot builder: data/logs-practice-exam-review.json -> reviews/kai-logs-practice-2026-05-14.html
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, "$1")), "..");
const data = JSON.parse(fs.readFileSync(path.join(ROOT, "data", "logs-practice-exam-review.json"), "utf8"));

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
// Convert "$...$" inline LaTeX to \( ... \) so the same KaTeX auto-render config used by other reviews works.
// Do NOT escape inside math segments.
function renderMixed(s) {
  if (s == null) return "";
  const parts = String(s).split(/(\$[^$]+\$)/g);
  return parts.map(p => {
    if (p.startsWith("$") && p.endsWith("$")) {
      return "\\(" + p.slice(1, -1) + "\\)";
    }
    return esc(p);
  }).join("");
}

const barClass = (pct) => pct >= 90 ? "good" : pct >= 70 ? "mid" : "warn";
const cardClass = (status) => status === "correct" ? "correct" : status === "partial" ? "partial" : "incorrect";
const scoreClass = (s, t) => s === t ? "s-full" : s === 0 ? "s-zero" : "s-partial";

function sectionCards(sections) {
  return Object.values(sections).map(s => `
    <div class="section-card">
      <h3>${esc(s.title)}</h3>
      <div class="section-score">${s.score} / ${s.total}</div>
      <p>${s.pct}% &bull; ${esc(s.questions)} &bull; ${esc(s.desc)}</p>
      <div class="bar"><div class="bar-fill ${barClass(s.pct)}" style="width:${s.pct}%"></div></div>
    </div>`).join("");
}

function qCard(q) {
  const errorBlock = q.error_type ? `
    <div class="error-note">
      <div class="elabel">${esc(q.error_type)}</div>
      ${renderMixed(q.error_detail)}
    </div>` : "";
  const coachingBlock = q.coaching ? `
    <div class="coaching-note">
      <div class="clabel">Coaching Note</div>
      ${renderMixed(q.coaching)}
    </div>` : "";
  return `
  <div class="q-card ${cardClass(q.status)}">
    <div class="q-header">
      <span class="q-num">${esc(q.id)}</span>
      <span class="q-badge badge-standard">${esc(q.standard)}</span>
      <span class="badge-score ${scoreClass(q.score, q.total)}">${q.score} / ${q.total}</span>
    </div>
    <div class="q-problem">${renderMixed(q.problem)}</div>
    <div class="answer-grid">
      <div class="answer-box kai-box">
        <div class="alabel">Kai's Answer</div>
        ${renderMixed(q.kai_answer)}
      </div>
      <div class="answer-box correct-box">
        <div class="alabel">Correct Answer</div>
        ${renderMixed(q.correct_answer)}
      </div>
    </div>
    ${errorBlock}
    ${coachingBlock}
  </div>`;
}

const errors = data.per_question.filter(q => q.status !== "correct");
const corrects = data.per_question.filter(q => q.status === "correct");
const pointsLost = data.total - data.score;

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" type="image/svg+xml" href="../shared/favicon.svg">
  <title>Kai: Logs 45-Min Practice Review (2026-05-14)</title>
  <link rel="stylesheet" href="../shared/katex/katex.min.css">
  <script src="../shared/katex/katex.min.js"></script>
  <script src="../shared/katex/auto-render.min.js"></script>
  <link rel="stylesheet" href="../shared/styles.css">
  <style>
    .review-container { max-width: 860px; margin: 0 auto; padding: 24px 16px; }
    .back-link { display: inline-flex; align-items: center; gap: 6px; font-size: var(--text-sm); font-weight: 600; color: var(--accent-blue); text-decoration: none; margin-bottom: 16px; }
    .back-link:hover { text-decoration: underline; }
    .review-header { text-align: center; margin-bottom: 32px; }
    .review-header h1 { font-size: 1.6rem; font-weight: 800; color: var(--accent-navy); margin: 0 0 4px; }
    .review-header .meta { color: var(--text-secondary); font-size: var(--text-sm); margin: 0 0 20px; }
    .score-banner { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; margin-bottom: 24px; }
    .score-pill { background: var(--bg-card); border: 1px solid var(--border-default); border-radius: 12px; padding: 14px 24px; text-align: center; min-width: 130px; box-shadow: var(--shadow-card); }
    .score-pill .label { font-size: var(--text-xs); font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; }
    .score-pill .value { font-size: 2rem; font-weight: 800; color: var(--accent-navy); line-height: 1; }
    .score-pill .sub { font-size: var(--text-xs); color: var(--text-secondary); margin-top: 2px; }
    .score-pill.grade-a .value { color: var(--color-correct); }

    .section-row { display: flex; gap: 16px; margin-bottom: 16px; flex-wrap: wrap; }
    .section-card { flex: 1; min-width: 180px; background: var(--bg-card); border: 1px solid var(--border-default); border-radius: 8px; padding: 16px 20px; box-shadow: var(--shadow-card); }
    .section-card h3 { margin: 0 0 4px; font-size: var(--text-sm); font-weight: 700; color: var(--accent-navy); text-transform: uppercase; letter-spacing: 0.05em; }
    .section-card .section-score { font-size: 1.4rem; font-weight: 800; color: var(--accent-navy); }
    .section-card p { font-size: var(--text-xs); color: var(--text-secondary); margin: 2px 0 0; }
    .bar { height: 6px; border-radius: 3px; background: var(--border-subtle); margin-top: 8px; overflow: hidden; }
    .bar-fill { height: 100%; border-radius: 3px; background: var(--accent-blue); }
    .bar-fill.good { background: var(--color-correct); }
    .bar-fill.warn { background: var(--color-incorrect); }
    .bar-fill.mid { background: var(--color-warning); }
    h2.section-label { font-size: var(--text-sm); font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.08em; margin: 32px 0 12px; padding-bottom: 8px; border-bottom: 2px solid var(--border-subtle); }
    .q-card { background: var(--bg-card); border: 1px solid var(--border-default); border-left: 4px solid var(--border-default); border-radius: 8px; padding: 18px 20px; margin-bottom: 14px; box-shadow: var(--shadow-card); }
    .q-card.correct { border-left-color: var(--color-correct); }
    .q-card.partial { border-left-color: var(--color-warning); }
    .q-card.incorrect { border-left-color: var(--color-incorrect); }
    .q-header { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; flex-wrap: wrap; }
    .q-num { font-weight: 800; color: var(--accent-navy); font-size: 1rem; }
    .q-badge { font-size: var(--text-xs); font-weight: 700; padding: 2px 8px; border-radius: 10px; }
    .badge-standard { background: var(--bg-highlight); color: var(--accent-blue); }
    .badge-score { margin-left: auto; font-size: 0.95rem; font-weight: 800; }
    .badge-score.s-full { color: var(--color-correct); }
    .badge-score.s-partial { color: var(--color-warning); }
    .badge-score.s-zero { color: var(--color-incorrect); }
    .q-problem { font-size: var(--text-base); color: var(--text-primary); margin-bottom: 12px; }
    .answer-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; }
    @media (max-width: 600px) { .answer-grid { grid-template-columns: 1fr; } }
    .answer-box { padding: 10px 14px; border-radius: 6px; font-size: var(--text-sm); }
    .answer-box .alabel { font-size: var(--text-xs); font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; }
    .answer-box.kai-box { background: rgba(29,66,186,0.06); border: 1px solid rgba(29,66,186,0.2); }
    .answer-box.kai-box .alabel { color: var(--accent-blue); }
    .answer-box.correct-box { background: var(--color-correct-bg); border: 1px solid rgba(27,125,58,0.2); }
    .answer-box.correct-box .alabel { color: var(--color-correct); }
    .error-note { background: var(--color-incorrect-bg); border: 1px solid rgba(200,16,46,0.2); border-radius: 6px; padding: 10px 14px; font-size: var(--text-sm); color: var(--text-primary); margin-bottom: 8px; }
    .error-note .elabel { font-size: var(--text-xs); font-weight: 700; color: var(--color-incorrect); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; }
    .coaching-note { background: rgba(29,66,186,0.06); border: 1px solid rgba(29,66,186,0.2); border-radius: 6px; padding: 8px 14px; font-size: var(--text-sm); color: var(--text-primary); margin-top: 8px; }
    .coaching-note .clabel { font-size: var(--text-xs); font-weight: 700; color: var(--accent-blue); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 2px; }

    .critical-banner { background: linear-gradient(135deg, rgba(200,16,46,0.10), rgba(200,16,46,0.03)); border: 2px solid var(--color-incorrect); border-radius: 12px; padding: 18px 24px; margin: 0 0 32px; box-shadow: var(--shadow-card); }
    .critical-banner .ihead { font-size: var(--text-xs); font-weight: 800; color: var(--color-incorrect); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px; }
    .critical-banner .imain { font-size: 1.2rem; font-weight: 800; color: var(--accent-navy); margin-bottom: 6px; }
    .critical-banner .isub { font-size: var(--text-sm); color: var(--text-primary); margin: 0; }

    .progress-wrap { background: var(--bg-card); border: 1px solid var(--border-default); border-radius: 10px; padding: 18px 22px; margin: 28px 0 8px; box-shadow: var(--shadow-card); }
    .progress-wrap h3 { margin: 0 0 6px; font-size: 1.05rem; font-weight: 800; color: var(--accent-navy); }
    .progress-wrap .sub { font-size: var(--text-sm); color: var(--text-secondary); margin: 0 0 12px; }
    .progress-wrap ul { margin: 6px 0 0; padding-left: 22px; font-size: var(--text-sm); color: var(--text-primary); }
    .progress-wrap ul li { margin-bottom: 6px; }
    .progress-wrap .wins-header, .progress-wrap .gaps-header, .progress-wrap .next-header { font-size: var(--text-xs); font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; margin-top: 12px; }
    .progress-wrap .wins-header { color: var(--color-correct); }
    .progress-wrap .gaps-header { color: var(--color-warning); }
    .progress-wrap .next-header { color: var(--accent-blue); }
    .footer-note { text-align: center; font-size: var(--text-xs); color: var(--text-secondary); margin-top: 48px; padding-top: 16px; border-top: 1px solid var(--border-subtle); }
  </style>
</head>
<body>
<div class="review-container">
  <a href="../index.html" class="back-link">&larr; Back to Dashboard</a>

  <div class="review-header">
    <h1>${esc(data.title)}</h1>
    <p class="meta">${esc(data.student)} &bull; 45-Minute Practice Exam &bull; ${esc(data.date)}</p>
  </div>

  <!-- Score Banner -->
  <div class="score-banner">
    <div class="score-pill grade-a">
      <div class="label">Raw Score</div>
      <div class="value">${data.score}/${data.total}</div>
      <div class="sub">${data.pct}%</div>
    </div>
    <div class="score-pill">
      <div class="label">Points Lost</div>
      <div class="value">${pointsLost}</div>
      <div class="sub">across ${errors.length} questions</div>
    </div>
    <div class="score-pill">
      <div class="label">Sections Perfect</div>
      <div class="value">${Object.values(data.sections).filter(s => s.pct === 100).length} / ${Object.keys(data.sections).length}</div>
      <div class="sub">Part A: 15/15</div>
    </div>
  </div>

  <!-- Critical Gap Banner -->
  <div class="critical-banner">
    <div class="ihead">#1 Gap to Fix Before the Unit Test</div>
    <div class="imain">Change-of-base execution &mdash; Q9 lost 3 of 5 points</div>
    <p class="isub">Kai computed \\(\\log(0.6)\\) but forgot to divide by \\(\\log(7)\\). Change-of-base has TWO parts: \\(\\log_b(x) = \\log(x) / \\log(b)\\). Drilled in the new Logs &amp; Rationals Gap Drill (Q2, Q3).</p>
  </div>

  <!-- Section Cards -->
  <div class="section-row">${sectionCards(data.sections)}
  </div>

  <h2 class="section-label">Errors &mdash; ${pointsLost} Points Lost across ${errors.length} Questions</h2>
  ${errors.map(qCard).join("")}

  <h2 class="section-label">Correct &mdash; ${corrects.length} of ${data.per_question.length} Questions</h2>
  ${corrects.map(qCard).join("")}

  <!-- Progress Summary -->
  <div class="progress-wrap">
    <h3>Summary &mdash; Strengths, Gaps, and Next Steps</h3>
    <p class="sub">${data.score}/${data.total} (${data.pct}%) on the 45-minute logarithms practice. Strong algebra, weaker calculator execution.</p>

    <div class="wins-header">Strengths</div>
    <ul>${data.summary.strengths.map(s => `<li>${renderMixed(s)}</li>`).join("")}</ul>

    <div class="gaps-header">Gaps</div>
    <ul>${data.summary.gaps.map(s => `<li>${renderMixed(s)}</li>`).join("")}</ul>

    <div class="next-header">Next Steps</div>
    <p style="margin: 6px 0 0; font-size: var(--text-sm);">${renderMixed(data.summary.next_steps)}</p>
  </div>

  <p class="footer-note">Score data: <code>scores/logs-practice-exam-2026-05-14.json</code> &bull; Retake: <a href="../logs_practice_45min.html" style="color:var(--accent-blue);">logs_practice_45min.html</a> &bull; Answer key: <a href="../logs_practice_45min_KEY.html" style="color:var(--accent-blue);">logs_practice_45min_KEY.html</a></p>
</div>

<script>
  document.addEventListener('DOMContentLoaded', function() {
    renderMathInElement(document.body, {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '\\\\(', right: '\\\\)', display: false }
      ],
      throwOnError: false
    });
  });
</script>
</body>
</html>
`;

const outPath = path.join(ROOT, "reviews", "kai-logs-practice-2026-05-14.html");
fs.writeFileSync(outPath, html, "utf8");
console.log("Wrote", outPath, "(" + html.length + " bytes)");
