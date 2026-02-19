#!/usr/bin/env node
/**
 * Cross-Exam Answer Uniqueness Verification
 * Based on FR-MCM-1 algorithm spec (docs/fr-answer-uniqueness-research.md)
 *
 * Checks all practice exams against MVP and each other for:
 *   HARD FAIL (H-1..H-5): blocks commit
 *   WARNING  (W-1..W-5): review required
 *   INFO     (I-1..I-2): logged for awareness
 *
 * Usage: node tests/cross-exam-verify.js
 * Exit code 1 if any HARD FAILs, 0 otherwise.
 */
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

// --- Thresholds from FR-MCM-1 ---
const SAME_SLOT_MIN_DELTA = { integer: 2, decimal: 0.5, plusMinus: 2 };
const CROSS_SLOT_MVP_MIN_DELTA = 1.0;
const WITHIN_EXAM_MIN_DELTA = 0.01;
const MAX_SAME_TEMPLATE_PER_SLOT = 3;
const MAX_SAME_CONTEXT = 2;

// --- MVP reference answers (from nonlinear_exam_mvp.html) ---
const MVP = {
  id: 'MVP',
  questions: [
    { q: 1,  section: 'A', eq: '2(x-3)^3+1',        type: 'identify',      answers: [], dropdown: 'cubic' },
    { q: 2,  section: 'A', eq: '-|x+4|+3',           type: 'identify',      answers: [-1, -7], dropdown: 'absolute' },
    { q: 3,  section: 'A', eq: '3(x-1)^2-12',        type: 'identify',      answers: [3, -1], dropdown: 'quadratic' },
    { q: 4,  section: 'B', eq: '2^(3x-1)=32',        type: 'exponential',   answers: [2] },
    { q: 5,  section: 'B', eq: '3(2x+1)^2-5=7',      type: 'quadratic',     answers: [0.5, -1.5], plusMinus: true },
    { q: 6,  section: 'B', eq: 'sqrt(3x^2+1)-4=0',   type: 'radical',       answers: [2.236, -2.236], plusMinus: true },
    { q: 7,  section: 'B', eq: '5^(2-x)+3=4',        type: 'exponential',   answers: [2] },
    { q: 8,  section: 'B', eq: '(4x+3)/(x-2)=7',     type: 'rational',      answers: [5.667] },
    { q: 9,  section: 'B', eq: 'sqrt(4x-3)=sqrt(x+6)',type: 'radical',      answers: [3] },
    { q: 10, section: 'B', eq: '4*3^(x^2-3)=108',    type: 'exponential',   answers: [2.449, -2.449], plusMinus: true },
    { q: 11, section: 'B', eq: '2x^(3/2)+4=58',      type: 'frac-exp',      answers: [9] },
    { q: 12, section: 'C', eq: '-(x+2)^2+5',         type: 'graph-quad',    answers: [-2, 5], vertex: [-2, 5] },
    { q: 13, section: 'C', eq: '3/(x-1)-2',           type: 'graph-rational',answers: [1, -2], va: 1, ha: -2 },
    { q: 14, section: 'D', eq: 'A=pi*r^2',            type: 'mc',            answers: [] },
    { q: 15, section: 'D', eq: '200*3^(t/4)=48600',   type: 'word',          answers: [20], context: 'bacteria-growth' },
  ]
};

// --- Load practice exam and normalize to same shape as MVP ---
function loadPracticeExam(filename) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, filename), 'utf8'));
  const exam = { id: data.exam_id, questions: [] };

  data.questions.forEach((q, i) => {
    const entry = {
      q: i + 1,
      section: q.section,
      eq: q.equation || q.question_html || '',
      type: q.type || '',
      answers: [],
      plusMinus: !!q.plus_minus,
    };

    if (q.inputs) {
      q.inputs.forEach(inp => {
        if (inp.type === 'number') entry.answers.push(inp.answer);
        if (inp.type === 'dropdown') entry.dropdown = inp.answer;
        if (inp.type === 'radio') entry.radio = inp.answer;
      });
    }

    if (q.graph) {
      if (entry.type === 'graph' && q.inputs) {
        // Graph questions: extract vertex or asymptotes from inputs
        const vx = q.inputs.find(i => i.id && i.id.includes('vx'));
        const vy = q.inputs.find(i => i.id && i.id.includes('vy'));
        if (vx && vy) entry.vertex = [vx.answer, vy.answer];

        const va = q.inputs.find(i => i.id && i.id.includes('va'));
        const ha = q.inputs.find(i => i.id && i.id.includes('ha'));
        if (va && ha) { entry.va = va.answer; entry.ha = ha.answer; }
      }
      entry.graphFunction = q.graph.function || '';
    }

    exam.questions.push(entry);
  });

  return exam;
}

// --- Normalize equation string for comparison ---
function normalizeEq(eq) {
  return eq.replace(/\\[()]/g, '').replace(/\\dfrac/g, '').replace(/\\sqrt/g, 'sqrt')
    .replace(/\\cdot/g, '*').replace(/\s+/g, '').replace(/\\/g, '').toLowerCase();
}

// --- Main verification ---
function verify() {
  const errors = { hard: [], warn: [], info: [] };

  // Load all exams
  const practiceFiles = fs.readdirSync(DATA_DIR)
    .filter(f => f.startsWith('retake-practice-') && f.endsWith('.json')).sort();

  const practiceExams = practiceFiles.map(loadPracticeExam);
  const allExams = [MVP, ...practiceExams];
  const examLabels = allExams.map(e => e.id);

  // --- H-1: Exact equation duplicates (same slot) ---
  for (let qi = 0; qi < 15; qi++) {
    for (let a = 0; a < allExams.length; a++) {
      for (let b = a + 1; b < allExams.length; b++) {
        const eqA = normalizeEq(allExams[a].questions[qi].eq);
        const eqB = normalizeEq(allExams[b].questions[qi].eq);
        if (eqA && eqB && eqA === eqB) {
          errors.hard.push(`H-1: Q${qi+1} equation duplicate — ${examLabels[a]} and ${examLabels[b]}`);
        }
      }
    }
  }

  // --- H-2/H-3: Same-slot, same numeric answer (solve questions Q4-Q11 only) ---
  // Q12/Q13 graphs handled by H-5; Q1-Q3 identify and Q14-Q15 apply handled separately
  for (let qi = 3; qi <= 10; qi++) {
    for (let a = 0; a < allExams.length; a++) {
      for (let b = a + 1; b < allExams.length; b++) {
        const ansA = allExams[a].questions[qi].answers;
        const ansB = allExams[b].questions[qi].answers;
        if (!ansA || !ansB || !ansA.length || !ansB.length) continue;

        // For single-value answers: exact match
        if (ansA.length === 1 && ansB.length === 1) {
          if (Math.abs(ansA[0] - ansB[0]) < WITHIN_EXAM_MIN_DELTA) {
            const rule = (a === 0) ? 'H-2' : 'H-3';
            errors.hard.push(`${rule}: Q${qi+1} same answer ${ansA[0]} — ${examLabels[a]} vs ${examLabels[b]}`);
          }
        }

        // For two-value answers: true ± if one is negative of other
        if (ansA.length === 2 && ansB.length === 2) {
          const isPlusMinusA = Math.abs(ansA[0] + ansA[1]) < 0.01;
          const isPlusMinusB = Math.abs(ansB[0] + ansB[1]) < 0.01;
          if (isPlusMinusA && isPlusMinusB) {
            // Both are ± pairs: compare absolute values
            if (Math.abs(Math.abs(ansA[0]) - Math.abs(ansB[0])) < WITHIN_EXAM_MIN_DELTA) {
              const rule = (a === 0) ? 'H-2' : 'H-3';
              errors.hard.push(`${rule}: Q${qi+1} same ± answer ±${Math.abs(ansA[0])} — ${examLabels[a]} vs ${examLabels[b]}`);
            }
          } else {
            // Not ± pairs (e.g. x-intercepts): compare as sorted sets
            const sA = [...ansA].sort((x,y) => x-y);
            const sB = [...ansB].sort((x,y) => x-y);
            if (sA.every((v, i) => Math.abs(v - sB[i]) < WITHIN_EXAM_MIN_DELTA)) {
              const rule = (a === 0) ? 'H-2' : 'H-3';
              errors.hard.push(`${rule}: Q${qi+1} same answer pair [${sA}] — ${examLabels[a]} vs ${examLabels[b]}`);
            }
          }
        }
      }
    }
  }

  // H-2/H-3 for Q15 (word problem, single numeric answer)
  for (let a = 0; a < allExams.length; a++) {
    for (let b = a + 1; b < allExams.length; b++) {
      const ansA = allExams[a].questions[14].answers;
      const ansB = allExams[b].questions[14].answers;
      if (ansA && ansB && ansA.length === 1 && ansB.length === 1) {
        if (Math.abs(ansA[0] - ansB[0]) < WITHIN_EXAM_MIN_DELTA) {
          const rule = (a === 0) ? 'H-2' : 'H-3';
          errors.hard.push(`${rule}: Q15 same answer ${ansA[0]} — ${examLabels[a]} vs ${examLabels[b]}`);
        }
      }
    }
  }

  // --- H-4: Within-exam duplicate answers (solve questions Q4-Q11, practice exams only) ---
  // MVP is shipped and can't be changed — skip it
  for (const exam of practiceExams) {
    const solveAnswers = [];
    for (let qi = 3; qi <= 10; qi++) {
      const q = exam.questions[qi];
      q.answers.forEach(v => solveAnswers.push({ q: qi + 1, v }));
    }
    for (let i = 0; i < solveAnswers.length; i++) {
      for (let j = i + 1; j < solveAnswers.length; j++) {
        if (Math.abs(solveAnswers[i].v - solveAnswers[j].v) < WITHIN_EXAM_MIN_DELTA) {
          errors.hard.push(`H-4: ${exam.id} internal dupe Q${solveAnswers[i].q}=${solveAnswers[i].v} and Q${solveAnswers[j].q}=${solveAnswers[j].v}`);
        }
      }
    }
  }

  // --- H-5: Graph vertex/asymptote duplicates (same slot) ---
  // Q12: vertex match
  for (let a = 0; a < allExams.length; a++) {
    for (let b = a + 1; b < allExams.length; b++) {
      const qa = allExams[a].questions[11]; // Q12 is index 11
      const qb = allExams[b].questions[11];
      const vtxA = qa.vertex || (qa.answers.length === 2 ? qa.answers : null);
      const vtxB = qb.vertex || (qb.answers.length === 2 ? qb.answers : null);
      if (vtxA && vtxB && Math.abs(vtxA[0] - vtxB[0]) < 0.1 && Math.abs(vtxA[1] - vtxB[1]) < 0.1) {
        errors.hard.push(`H-5: Q12 vertex duplicate (${vtxA}) — ${examLabels[a]} vs ${examLabels[b]}`);
      }
    }
  }
  // Q13: asymptote pair match
  for (let a = 0; a < allExams.length; a++) {
    for (let b = a + 1; b < allExams.length; b++) {
      const qa = allExams[a].questions[12]; // Q13 is index 12
      const qb = allExams[b].questions[12];
      const vaA = qa.va !== undefined ? qa.va : (qa.answers[0] !== undefined ? qa.answers[0] : null);
      const haA = qa.ha !== undefined ? qa.ha : (qa.answers[1] !== undefined ? qa.answers[1] : null);
      const vaB = qb.va !== undefined ? qb.va : (qb.answers[0] !== undefined ? qb.answers[0] : null);
      const haB = qb.ha !== undefined ? qb.ha : (qb.answers[1] !== undefined ? qb.answers[1] : null);
      if (vaA !== null && haA !== null && vaB !== null && haB !== null) {
        if (Math.abs(vaA - vaB) < 0.1 && Math.abs(haA - haB) < 0.1) {
          errors.hard.push(`H-5: Q13 asymptote duplicate (VA=${vaA},HA=${haA}) — ${examLabels[a]} vs ${examLabels[b]}`);
        }
      }
    }
  }

  // --- W-1: Cross-slot exact numeric match (practice vs MVP) ---
  // Only flag exact matches (Δ < 0.5) to avoid noise from small integers
  const CROSS_SLOT_EXACT = 0.5;
  const mvpAllNumerics = {};
  for (let qi = 3; qi <= 10; qi++) {
    MVP.questions[qi].answers.forEach(v => {
      mvpAllNumerics[`MVP-Q${qi+1}`] = mvpAllNumerics[`MVP-Q${qi+1}`] || [];
      mvpAllNumerics[`MVP-Q${qi+1}`].push(v);
    });
  }
  for (const exam of practiceExams) {
    for (let qi = 3; qi <= 10; qi++) {
      const pAnswers = exam.questions[qi].answers;
      for (const [mqKey, mqVals] of Object.entries(mvpAllNumerics)) {
        const mqSlot = parseInt(mqKey.split('Q')[1]);
        if (mqSlot === qi + 1) continue; // same slot checked by H-2
        for (const pv of pAnswers) {
          for (const mv of mqVals) {
            if (Math.abs(pv - mv) < CROSS_SLOT_EXACT) {
              errors.warn.push(`W-1: ${exam.id} Q${qi+1}=${pv} matches ${mqKey}=${mv} (cross-slot)`);
            }
          }
        }
      }
    }
  }

  // --- W-2: Partial overlap in ± answers vs MVP single answers ---
  for (const exam of practiceExams) {
    for (let qi = 3; qi <= 10; qi++) {
      const q = exam.questions[qi];
      if (!q.plusMinus && q.answers.length <= 1) continue;
      // Check each component against MVP same-slot single answer
      const mvpQ = MVP.questions[qi];
      if (mvpQ.answers.length === 1) {
        for (const v of q.answers) {
          if (Math.abs(v - mvpQ.answers[0]) < WITHIN_EXAM_MIN_DELTA) {
            errors.warn.push(`W-2: ${exam.id} Q${qi+1} ± component ${v} matches MVP Q${qi+1}=${mvpQ.answers[0]}`);
          }
        }
      }
    }
  }

  // --- W-3: Same-slot answers within minimum delta ---
  for (let qi = 3; qi <= 10; qi++) {
    for (let a = 0; a < allExams.length; a++) {
      for (let b = a + 1; b < allExams.length; b++) {
        const ansA = allExams[a].questions[qi].answers;
        const ansB = allExams[b].questions[qi].answers;
        if (ansA.length !== 1 || ansB.length !== 1) continue;
        const delta = Math.abs(ansA[0] - ansB[0]);
        if (delta >= WITHIN_EXAM_MIN_DELTA && delta < SAME_SLOT_MIN_DELTA.integer) {
          // Not exact match (H-2/H-3 catches that) but too close
          errors.warn.push(`W-3: Q${qi+1} answers too close — ${examLabels[a]}=${ansA[0]} vs ${examLabels[b]}=${ansB[0]} (Δ=${delta.toFixed(2)})`);
        }
      }
    }
  }

  // --- W-4: ± answer component matching single-value answer in same exam ---
  for (const exam of allExams) {
    const singleVals = [];
    const pmVals = [];
    for (let qi = 3; qi <= 10; qi++) {
      const q = exam.questions[qi];
      if (q.answers.length === 1) singleVals.push({ q: qi + 1, v: q.answers[0] });
      if (q.answers.length === 2 && (q.plusMinus || q.answers[0] === -q.answers[1] || q.answers[1] === -q.answers[0])) {
        q.answers.forEach(v => pmVals.push({ q: qi + 1, v }));
      }
    }
    for (const pm of pmVals) {
      for (const sv of singleVals) {
        if (pm.q !== sv.q && Math.abs(pm.v - sv.v) < WITHIN_EXAM_MIN_DELTA) {
          errors.warn.push(`W-4: ${exam.id} Q${pm.q} ± component ${pm.v} matches Q${sv.q}=${sv.v}`);
        }
      }
    }
  }

  // --- W-5: Graph direction identical in 3+ consecutive exams ---
  // Q12: check opens up vs down using graph.function (reliable JS), not question_html
  const q12Directions = allExams.map(e => {
    const q = e.questions[11];
    const funcStr = q.graphFunction || q.eq || '';
    // Leading negative means opens down: "-Math.pow(...)", "-(Math.pow(..."
    return funcStr.match(/^\s*-/) ? 'down' : 'up';
  });
  // Check any 3 consecutive
  for (let i = 0; i <= q12Directions.length - 3; i++) {
    if (q12Directions[i] === q12Directions[i+1] && q12Directions[i+1] === q12Directions[i+2]) {
      errors.warn.push(`W-5: Q12 opens ${q12Directions[i]} in 3 consecutive exams: ${examLabels[i]}, ${examLabels[i+1]}, ${examLabels[i+2]}`);
    }
  }

  // --- I-2: Template count per slot (flag when 3+ exams use same equation form) ---
  // Classify equation templates by extracting structural form
  const TEMPLATE_SLOTS = { 8: 'Q8-rational', 11: 'Q11-frac-exp', 13: 'Q13-graph-rational', 15: 'Q15-word' };
  for (const [qiStr, slotLabel] of Object.entries(TEMPLATE_SLOTS)) {
    const qi = parseInt(qiStr) - 1; // 0-indexed
    const templates = {};
    for (const exam of allExams) {
      const q = exam.questions[qi];
      let tmpl = 'unknown';
      const eq = q.eq || '';
      if (qi === 7) { // Q8 rational
        if (eq.match(/\(.+\)\/\(.+\)\s*=/) || eq.match(/dfrac\{.*\}\{.*\}\s*=/)) tmpl = '(ax+b)/(x-c)=d';
        else if (eq.match(/\/\(.+\)\s*\+/)) tmpl = 'a/(x-h)+k=d';
      } else if (qi === 10) { // Q11 fractional exponent
        if (eq.match(/x\^\{?3\/2\}?/) || eq.match(/x\^?\(3\/2\)/)) tmpl = 'ax^(3/2)+b=c';
        else if (eq.match(/x\^\{?2\/3\}?/)) tmpl = 'ax^(2/3)+b=c';
      } else if (qi === 12) { // Q13 graph rational
        const funcStr = q.graphFunction || eq;
        if (funcStr.match(/^-?\d.*\/.*Math\.pow/) || funcStr.match(/\(.*x.*\)\/\(.*x.*\)/)) tmpl = '(ax+b)/(x-c)';
        else tmpl = 'a/(x-h)+k';
      } else if (qi === 14) { // Q15 word problem
        tmpl = q.eq || 'word-generic';
      }
      templates[tmpl] = templates[tmpl] || [];
      templates[tmpl].push(exam.id);
    }
    for (const [tmpl, exams] of Object.entries(templates)) {
      if (exams.length >= MAX_SAME_TEMPLATE_PER_SLOT && tmpl !== 'unknown') {
        errors.info.push(`I-2: ${slotLabel} template "${tmpl}" used in ${exams.length}/${allExams.length} exams: ${exams.join(', ')}`);
      }
    }
  }

  // --- I-1: Common small integers across different types ---
  const SMALL_INTS = [1, 2, 3, -1, -2, -3];
  for (const si of SMALL_INTS) {
    const appearances = [];
    for (const exam of practiceExams) {
      for (let qi = 3; qi <= 10; qi++) {
        if (exam.questions[qi].answers.some(v => Math.abs(v - si) < 0.01)) {
          appearances.push(`${exam.id}-Q${qi+1}`);
        }
      }
    }
    if (appearances.length >= 3) {
      errors.info.push(`I-1: Value ${si} appears in ${appearances.length} solve answers: ${appearances.join(', ')}`);
    }
  }

  return errors;
}

// --- Run ---
const errors = verify();

console.log('Cross-Exam Answer Uniqueness Verification');
console.log('Based on FR-MCM-1 algorithm spec');
console.log('='.repeat(55));
console.log();

if (errors.hard.length > 0) {
  console.log(`🔴 HARD FAIL: ${errors.hard.length}`);
  errors.hard.forEach(e => console.log('   ' + e));
  console.log();
}

if (errors.warn.length > 0) {
  console.log(`⚠️  WARNING: ${errors.warn.length}`);
  errors.warn.forEach(e => console.log('   ' + e));
  console.log();
}

if (errors.info.length > 0) {
  console.log(`ℹ️  INFO: ${errors.info.length}`);
  errors.info.forEach(e => console.log('   ' + e));
  console.log();
}

console.log('='.repeat(55));
if (errors.hard.length === 0) {
  console.log('✅ PASS — zero hard failures');
} else {
  console.log(`🔴 BLOCKED — ${errors.hard.length} hard failure(s) must be fixed before commit`);
}

process.exit(errors.hard.length > 0 ? 1 : 0);
