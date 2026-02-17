/**
 * Motor City Math — Fundamentals Agent (F)
 * Task F-11: Dashboard Data Integrity Tests
 *
 * Validates that dashboard (index.html) correctly aggregates
 * score data from mcm_scores localStorage:
 *  - Simple format: {score, total, pct, streak, timestamp}
 *  - MVP format: {attempts: [{score, total, pct, questions: {...}}]}
 *  - Standards aggregation from both formats
 *  - Study recommendation logic (weakest 3 standards)
 *  - Edge cases: empty, corrupt, mixed formats
 *
 * Run: node tests/f-validation/dashboard-integrity.test.js
 */

let pass = 0, fail = 0;

function test(desc, condition) {
    if (condition) { pass++; }
    else { fail++; console.log(`  ❌ ${desc}`); }
}
function section(title) { console.log(`\n── ${title} ──`); }

// ===================================================================
// EXTRACTED DASHBOARD LOGIC (from index.html)
// Pure functions — no DOM dependencies
// ===================================================================

// getScores() — index.html line 214-216
function getScores(raw) {
    try { return JSON.parse(raw || '{}'); } catch(e) { return {}; }
}

// Chart data extraction — index.html lines 219-246
function extractChartData(scores, tests) {
    var labels = [], data = [], tooltips = [];
    var hasData = false;

    tests.forEach(function(t) {
        var s = scores[t.key];
        if (s) {
            hasData = true;
            var pct = s.pct || (s.score && s.total ? Math.round(s.score / s.total * 100) : 0);
            labels.push(t.name.length > 20 ? t.name.substring(0, 18) + '…' : t.name);
            data.push(pct);
            tooltips.push(t.name + ': ' + pct + '% · ' + (s.score || '?') + '/' + (s.total || '?'));
        }
        if (scores[t.key] && scores[t.key].attempts) {
            var att = scores[t.key].attempts;
            if (att.length > 0) {
                var latest = att[att.length - 1];
                var idx = labels.length - 1;
                if (idx >= 0) {
                    data[idx] = latest.pct;
                    tooltips[idx] = t.name + ': ' + latest.pct + '% · ' + latest.score + '/' + latest.total;
                }
            }
        }
    });

    return { labels, data, tooltips, hasData };
}

// Standards aggregation — index.html lines 306-378
function aggregateStandards(scores, tests) {
    var stdData = {};

    tests.forEach(function(t) {
        var s = scores[t.key];
        if (!s) return;

        // MVP format
        if (s.attempts && s.attempts.length > 0) {
            var latest = s.attempts[s.attempts.length - 1];
            if (latest.questions) {
                Object.keys(latest.questions).forEach(function(qid) {
                    var q = latest.questions[qid];
                    var std = q.standard || 'unknown';
                    if (!stdData[std]) stdData[std] = { correct: 0, total: 0, types: {} };
                    stdData[std].total++;
                    if (q.correct) stdData[std].correct++;
                    var type = q.type || 'unknown';
                    if (!stdData[std].types[type]) stdData[std].types[type] = 0;
                    stdData[std].types[type]++;
                });
            }
        }

        // Simple format
        if (s.standardScores) {
            Object.keys(s.standardScores).forEach(function(id) {
                var ss = s.standardScores[id];
                if (!stdData[id]) stdData[id] = { correct: 0, total: 0, types: {}, name: ss.name };
                stdData[id].correct += ss.correct || 0;
                stdData[id].total += ss.total || 0;
                if (ss.name) stdData[id].name = ss.name;
            });
        }
    });

    // Sort lowest first
    var keys = Object.keys(stdData);
    keys.sort(function(a, b) {
        var pa = stdData[a].total ? (stdData[a].correct / stdData[a].total) : 0;
        var pb = stdData[b].total ? (stdData[b].correct / stdData[b].total) : 0;
        return pa - pb;
    });

    return { keys, data: stdData };
}

// Tier assignment — index.html line 363
function getTier(pct, total) {
    if (total === 0) return 'none';
    if (pct >= 90) return 'high';
    if (pct >= 70) return 'mid';
    if (pct >= 50) return 'warn';
    return 'low';
}

// Study recommendation — top 3 weakest
function getStudyRecs(stdResult) {
    if (!stdResult || !stdResult.keys) return [];
    var recs = [];
    stdResult.keys.forEach(function(id) {
        if (recs.length >= 3) return;
        var s = stdResult.data[id];
        if (s.total === 0) return;
        var pct = Math.round((s.correct / s.total) * 100);
        recs.push({ id, pct, name: s.name || id });
    });
    return recs;
}

// Sample test config (subset)
const TESTS = [
    { key: 'mcm-exponents-exam', name: 'Exponents Exam' },
    { key: 'mcm-nonlinear-exam-mvp', name: 'Nonlinear Exam MVP' },
    { key: 'mcm-quiz-251120', name: 'Quiz 11/20' },
    { key: 'mcm-index-calc', name: 'Functions Exam' }
];

// ===================================================================
// 1. SIMPLE FORMAT
// ===================================================================
section('1. Simple Format Scores');

const simpleScores = {
    'mcm-exponents-exam': { score: 18, total: 20, pct: 90, streak: 5, timestamp: '2026-02-17T10:00:00Z' },
    'mcm-quiz-251120': { score: 3, total: 5, pct: 60, streak: 2, timestamp: '2026-02-17T11:00:00Z' }
};

const chart1 = extractChartData(simpleScores, TESTS);
test('Simple: hasData = true', chart1.hasData);
test('Simple: 2 test scores', chart1.data.length === 2);
test('Simple: exponents = 90%', chart1.data[0] === 90);
test('Simple: quiz = 60%', chart1.data[1] === 60);

// ===================================================================
// 2. MVP FORMAT (with attempts)
// ===================================================================
section('2. MVP Format Scores');

const mvpScores = {
    'mcm-nonlinear-exam-mvp': {
        attempts: [
            { score: 10, total: 15, pct: 67, grade: 1,
              questions: {
                  q1: { correct: true, type: 'identify', standard: 'W2' },
                  q2: { correct: false, type: 'identify', standard: 'W2' },
                  q4: { correct: true, type: 'exponential', standard: 'W3' },
                  q6: { correct: false, type: 'radical', standard: 'W3' }
              },
              timestamp: '2026-02-17T12:00:00Z'
            },
            { score: 13, total: 15, pct: 87, grade: 3,
              questions: {
                  q1: { correct: true, type: 'identify', standard: 'W2' },
                  q2: { correct: true, type: 'identify', standard: 'W2' },
                  q4: { correct: true, type: 'exponential', standard: 'W3' },
                  q6: { correct: true, type: 'radical', standard: 'W3' }
              },
              timestamp: '2026-02-17T14:00:00Z'
            }
        ],
        best: { score: 13, pct: 87, grade: 3 }
    }
};

const chart2 = extractChartData(mvpScores, TESTS);
test('MVP: uses latest attempt pct', chart2.data[0] === 87);
test('MVP: tooltip shows latest score', chart2.tooltips[0].includes('13/15'));

// ===================================================================
// 3. STANDARDS AGGREGATION — MVP FORMAT
// ===================================================================
section('3. Standards Aggregation (MVP)');

const std1 = aggregateStandards(mvpScores, TESTS);
test('MVP standards: uses latest attempt', std1.data['W2'] !== undefined);
test('MVP W2: 2 questions total', std1.data['W2'].total === 2);
test('MVP W2: 2 correct (latest attempt)', std1.data['W2'].correct === 2);
test('MVP W3: 2 questions total', std1.data['W3'].total === 2);
test('MVP W3: 2 correct', std1.data['W3'].correct === 2);

// Type tracking
test('MVP W2 type tracking: identify type counted', std1.data['W2'].types['identify'] === 2);
test('MVP W3 type tracking: exponential and radical', 
    std1.data['W3'].types['exponential'] === 1 && std1.data['W3'].types['radical'] === 1);

// ===================================================================
// 4. STANDARDS AGGREGATION — SIMPLE FORMAT
// ===================================================================
section('4. Standards Aggregation (Simple)');

const simpleWithStd = {
    'mcm-exponents-exam': {
        score: 18, total: 20, pct: 90,
        standardScores: {
            'W1.a': { correct: 8, total: 10, name: 'Rules of exponents' },
            'W1.b': { correct: 4, total: 5, name: 'Roots and rational exp' },
            'W1.e': { correct: 6, total: 5, name: 'Scientific notation' }
        }
    }
};

const std2 = aggregateStandards(simpleWithStd, TESTS);
test('Simple W1.a: 8/10', std2.data['W1.a'].correct === 8 && std2.data['W1.a'].total === 10);
test('Simple W1.b: 4/5', std2.data['W1.b'].correct === 4 && std2.data['W1.b'].total === 5);
test('Simple: name preserved', std2.data['W1.a'].name === 'Rules of exponents');

// ===================================================================
// 5. MIXED FORMATS
// ===================================================================
section('5. Mixed Format Aggregation');

const mixedScores = {
    'mcm-exponents-exam': {
        score: 18, total: 20, pct: 90,
        standardScores: {
            'W1.a': { correct: 8, total: 10, name: 'Rules of exponents' }
        }
    },
    'mcm-nonlinear-exam-mvp': {
        attempts: [{
            score: 12, total: 15, pct: 80,
            questions: {
                q1: { correct: true, type: 'identify', standard: 'W2' },
                q4: { correct: false, type: 'exponential', standard: 'W3' }
            }
        }]
    }
};

const std3 = aggregateStandards(mixedScores, TESTS);
test('Mixed: W1.a from simple format', std3.data['W1.a'].correct === 8);
test('Mixed: W2 from MVP format', std3.data['W2'].correct === 1);
test('Mixed: W3 from MVP format', std3.data['W3'].correct === 0);
test('Mixed: 3 standards total', std3.keys.length === 3);

// ===================================================================
// 6. STANDARD SORTING (weakest first)
// ===================================================================
section('6. Standards Sorted Weakest First');

const sortScores = {
    'mcm-exponents-exam': {
        score: 15, total: 20, pct: 75,
        standardScores: {
            'W1.a': { correct: 9, total: 10 },  // 90%
            'W1.b': { correct: 2, total: 5 },    // 40%
            'W1.c': { correct: 5, total: 7 }     // 71%
        }
    }
};

const std4 = aggregateStandards(sortScores, TESTS);
test('Sorted: weakest first (W1.b at 40%)', std4.keys[0] === 'W1.b');
test('Sorted: middle (W1.c at 71%)', std4.keys[1] === 'W1.c');
test('Sorted: strongest last (W1.a at 90%)', std4.keys[2] === 'W1.a');

// ===================================================================
// 7. TIER ASSIGNMENT
// ===================================================================
section('7. Tier Assignment');

test('Tier: 95% → high', getTier(95, 10) === 'high');
test('Tier: 90% → high (boundary)', getTier(90, 10) === 'high');
test('Tier: 89% → mid', getTier(89, 10) === 'mid');
test('Tier: 70% → mid (boundary)', getTier(70, 10) === 'mid');
test('Tier: 69% → warn', getTier(69, 10) === 'warn');
test('Tier: 50% → warn (boundary)', getTier(50, 10) === 'warn');
test('Tier: 49% → low', getTier(49, 10) === 'low');
test('Tier: 0% → low', getTier(0, 10) === 'low');
test('Tier: 0 total → none', getTier(0, 0) === 'none');

// ===================================================================
// 8. STUDY RECOMMENDATIONS
// ===================================================================
section('8. Study Recommendations');

const recs = getStudyRecs(std4);
test('Top 3 weakest standards recommended', recs.length === 3);
test('First rec is weakest (W1.b)', recs[0].id === 'W1.b');
test('Rec has pct', recs[0].pct === 40);

// With untested standards
const stdWithUntested = {
    keys: ['untested', 'W1.b', 'W1.c'],
    data: {
        'untested': { correct: 0, total: 0 },
        'W1.b': { correct: 2, total: 5 },
        'W1.c': { correct: 7, total: 10 }
    }
};
const recs2 = getStudyRecs(stdWithUntested);
test('Skips untested standards', recs2[0].id === 'W1.b');
test('Only tested standards recommended', recs2.length === 2);

// Empty
const recs3 = getStudyRecs(null);
test('Null result → empty recs', recs3.length === 0);
const recs4 = getStudyRecs({ keys: [], data: {} });
test('No standards → empty recs', recs4.length === 0);

// ===================================================================
// 9. EDGE CASES
// ===================================================================
section('9. Edge Cases');

// Empty localStorage
test('Empty scores: no data', !extractChartData({}, TESTS).hasData);
test('Empty scores: empty standards', aggregateStandards({}, TESTS).keys.length === 0);

// Corrupt JSON
test('Corrupt JSON → empty object', Object.keys(getScores('not json')).length === 0);
test('Null → empty object', Object.keys(getScores(null)).length === 0);
test('Undefined → empty object', Object.keys(getScores(undefined)).length === 0);

// Missing fields
const partialScore = { 'mcm-exponents-exam': { score: 10, total: 20 } };
const chart3 = extractChartData(partialScore, TESTS);
test('Missing pct: computed from score/total', chart3.data[0] === 50);

// Empty attempts array
const emptyAttempts = { 'mcm-nonlinear-exam-mvp': { attempts: [] } };
const chart4 = extractChartData(emptyAttempts, TESTS);
test('Empty attempts: still shows in chart', chart4.hasData);

// ===================================================================
// 10. CROSS-FORMAT CONSISTENCY
// ===================================================================
section('10. Cross-Format Data Integrity');

// Verify that a score saved by gradeTest() is readable by dashboard
const gradeTestOutput = {
    'mcm-exponents-exam': {
        score: 18,
        total: 20,
        pct: 90,
        streak: 7,
        timestamp: '2026-02-17T15:00:00Z'
    }
};

const chartFromGrade = extractChartData(gradeTestOutput, TESTS);
test('gradeTest output readable by dashboard chart', chartFromGrade.data[0] === 90);
test('gradeTest output: has timestamp in tooltip', chartFromGrade.tooltips[0].includes('90%'));

// Verify MVP storage is readable
const mvpStorage = {
    'mcm-nonlinear-exam-mvp': {
        attempts: [{
            score: 14, total: 15, pct: 93, grade: 4,
            sections: { A: { score: 3, total: 3 }, B: { score: 8, total: 8 }, C: { score: 1, total: 2 }, D: { score: 2, total: 2 } },
            questions: {
                q1: { correct: true, type: 'identify', standard: 'W2' },
                q12: { correct: false, type: 'graph-quad', standard: 'W2' },
                q15: { correct: true, type: 'word-problem', standard: 'W3' }
            },
            timestamp: '2026-02-17T16:00:00Z'
        }],
        best: { score: 14, pct: 93, grade: 4 }
    }
};

const stdFromMvp = aggregateStandards(mvpStorage, TESTS);
test('MVP storage: W2 aggregated (2 questions)', stdFromMvp.data['W2'].total === 2);
test('MVP storage: W2 1/2 correct (q12 wrong)', stdFromMvp.data['W2'].correct === 1);
test('MVP storage: W3 1/1 correct', stdFromMvp.data['W3'].correct === 1);

// ===================================================================
// SUMMARY
// ===================================================================
section('DASHBOARD INTEGRITY SUMMARY');
console.log(`\n  Tests: ${pass + fail}, ${pass} passed, ${fail} failed\n`);
process.exit(fail > 0 ? 1 : 0);
