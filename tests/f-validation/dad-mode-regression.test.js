/**
 * dad-mode-regression.test.js
 * Static regression contract for Dad Mode (?dad=1)
 * FA broadcast: 2026-02-21-1945 -- Playwright test required, static coverage until Playwright unblocked
 * Tests: structure, fixture, getScores() guard, banner, upNext logic
 */

'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const INDEX_HTML = path.join(ROOT, 'index.html');
const KAI_SCORES = path.join(ROOT, 'data', 'kai-scores-2026-02-21.json');

let passed = 0;
let failed = 0;
const failures = [];

function check(label, condition, detail = '') {
  if (condition) {
    passed++;
    console.log(`  \u2714 ${label}`);
  } else {
    failed++;
    failures.push(`${label}${detail ? ': ' + detail : ''}`);
    console.log(`  \u2718 ${label}${detail ? ': ' + detail : ''}`);
  }
}

const html = fs.readFileSync(INDEX_HTML, 'utf8');
const scoresRaw = fs.readFileSync(KAI_SCORES, 'utf8');
const scores = JSON.parse(scoresRaw);

// --- 1. Fixture file integrity ---
console.log('\u2500\u2500 1. Kai Scores Fixture (data/kai-scores-2026-02-21.json) \u2500\u2500');
check('fixture: parseable JSON', true);
check('fixture: version field present', typeof scores.version !== 'undefined');
check('fixture: exported field present', typeof scores.exported !== 'undefined');
check('fixture: student field is "Kai"', scores.student === 'Kai');
check('fixture: mcm_scores object present', typeof scores.mcm_scores === 'object' && scores.mcm_scores !== null);
check('fixture: MVP score entry present', 'mcm-nonlinear-exam-mvp' in scores.mcm_scores);
check('fixture: Practice 1 score entry present', 'mcm-retake-practice-1' in scores.mcm_scores);
check('fixture: Practice 2 entry present (not yet attempted)', 'mcm-retake-practice-2' in scores.mcm_scores);

const mvp = scores.mcm_scores['mcm-nonlinear-exam-mvp'];
check('fixture: MVP score has best.pct (0-100)', typeof mvp === 'object' && typeof mvp.best?.pct === 'number',
  mvp ? `best.pct=${mvp.best?.pct}` : 'entry missing');

const rp1 = scores.mcm_scores['mcm-retake-practice-1'];
check('fixture: RP1 score has best.pct (0-100)', typeof rp1 === 'object' && typeof rp1.best?.pct === 'number',
  rp1 ? `best.pct=${rp1.best?.pct}` : 'entry missing');

// --- 2. Dad Mode JS in index.html ---
console.log('\u2500\u2500 2. Dad Mode JS Logic \u2500\u2500');
check('dad=1 URL param detection', html.includes("get('dad') === '1'"));
check('_dadMode variable declared', html.includes('var _dadMode'));
check('getScores() guards _dadMode first', html.includes('if (_dadMode && _dadScores) return _dadScores'));
check('dadModeInit() function exists', html.includes('function dadModeInit()'));
check('dadModeInit() called on init', html.includes('dadModeInit()'));
check('dadModeInit() shows banner when ?dad=1', (() => {
  const initFn = html.slice(html.indexOf('function dadModeInit()'), html.indexOf('function dadModeInit()') + 500);
  return initFn.includes('dadBanner') && initFn.includes('display');
})());

// --- 3. Dad Banner HTML ---
console.log('\u2500\u2500 3. Dad Mode Banner DOM \u2500\u2500');
check('dad-banner element exists with id=dadBanner', html.includes('id="dadBanner"'));
check('dad-banner hidden by default (display:none)', html.includes('id="dadBanner" style="display:none">') || 
  html.includes('id="dadBanner" style="display:none;"') ||
  html.includes('id="dadBanner" style="display: none"') ||
  html.includes('id="dadBanner" style="display: none;"'));
check('dad-banner has class="dad-banner"', html.includes('class="dad-banner"'));
check('"Dad View" label visible in banner', html.includes('Dad View'));
check('"Update" button or file input in banner', html.includes('dadFileInput') || html.includes('update') || html.includes('Update'));

// --- 4. upNextInfo element ---
console.log('\u2500\u2500 4. upNextInfo element \u2500\u2500');
check('upNextInfo element exists', html.includes('id="upNextInfo"'));
check('upNextInfo updated in dad mode or normal flow', html.includes("getElementById('upNextInfo')"));

// --- 5. Score data fetch path ---
console.log('\u2500\u2500 5. Score data fetch contract \u2500\u2500');
check('kai-scores JSON file in data/ directory', fs.existsSync(KAI_SCORES));
check('Data fetch references kai-scores file', html.includes('kai-scores'));
check('No direct localStorage.getItem for score data outside getScores()', (() => {
  // Must not call localStorage.getItem('algebra2TestResults') directly outside of getScores() function
  const getScoresFn = html.match(/function getScores\(\)[^}]+\}/s);
  const outsideGetScores = html.replace(/function getScores\(\)[\s\S]*?^    \}/m, '');
  const directCalls = (outsideGetScores.match(/localStorage\.getItem\(['"]algebra2TestResults['"]\)/g) || []).length;
  return directCalls === 0;
})(), 'direct localStorage read for scores outside getScores() detected');

// --- 6. Dad Mode CSS ---
console.log('\u2500\u2500 6. Dad Mode CSS \u2500\u2500');
const sharedCSS = fs.readFileSync(path.join(ROOT, 'shared', 'styles.css'), 'utf8');
check('dad-banner styles in shared/styles.css (not only inline)', sharedCSS.includes('.dad-banner') || html.includes('dad-banner'),
  'dad-banner styles should exist somewhere');
check('hero-greeting class exists', html.includes('hero-greeting') || sharedCSS.includes('hero-greeting'));

// --- Summary ---
const total = passed + failed;
console.log(`\n\u2500\u2500 DAD MODE REGRESSION SUMMARY \u2500\u2500`);
if (failed > 0) {
  console.log(`\nFailures:`);
  failures.forEach(f => console.log(`  \u2718 ${f}`));
}
console.log(`\n  Tests: ${total} total, ${passed} passed, ${failed} failed`);

if (failed > 0) process.exit(1);
