const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const cards = require('../shared/activity-cards');
const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8').replace(/\r\n/g, '\n');

function dashboard() {
    const nodes = {};
    const context = {
        window: { location: { search: '' }, addEventListener() {}, MCMActivityCards: cards },
        document: { getElementById: id => nodes[id] || (nodes[id] = {}) },
        localStorage: { getItem: () => '{}', removeItem() {} },
        URLSearchParams, console, Date,
        fetch: () => new Promise(() => {})
    };
    vm.createContext(context);
    for (const match of html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)) {
        if (match[1].trim()) vm.runInContext(match[1], context);
    }
    return { context, nodes };
}

test('one shell keeps title, percentage, points and teacher rubric separate', () => {
    const model = cards.fromRecord({
        key: 'school-unit', name: 'A very long teacher assessment title & <source>',
        file: 'reviews/unit.html', unit: 'spring-s4', questions: 16
    }, {}, { pct: 44, score: 7, total: 16, teacher_grade: '3/4' }, 'Latest attempt');
    const output = cards.render(model);
    assert.match(output, /data-variant="teacher-result"/);
    assert.match(output, /Teacher assessment/);
    assert.match(output, /<h3[^>]*>A very long teacher assessment title &amp; &lt;source&gt;<\/h3>/);
    assert.match(output, /activity-card__score">44%/);
    assert.match(output, /<dt>Points<\/dt><dd>7\/16/);
    assert.match(output, /<dt>Teacher rubric<\/dt><dd>3\/4/);
    assert.doesNotMatch(output, /style=|test-score|75%|position:absolute/);
});

test('zero, decimals, missing values and raw-only results are explicit', () => {
    for (const record of [{ pct: 0, score: 0, total: 4 }, { score: 0, total: 4 }]) {
        assert.deepEqual(cards.result(record), { pct: 0, earned: 0, possible: 4 });
    }
    assert.deepEqual(cards.result({}), { pct: null, earned: null, possible: null });
    assert.equal(cards.result({ pct: 89.5, score: 89.5, total: 100 }).pct, 89.5);
    const missing = cards.render({ variant: 'practice-result', kind: 'Practice', title: 'Unknown' });
    assert.match(missing, /^<article /);
    assert.match(missing, /No score recorded/);
    assert.doesNotMatch(missing, /undefined|null|NaN|Questions|Points|Not attempted|<a(?:\s|>)/);
    const zeroRubric = cards.fromRecord({ key: 'school-zero', name: 'Zero' }, {},
        { pct: 0, teacher_grade: 0, teacher_rating: '0/4' }, 'Latest attempt');
    assert.match(cards.render(zeroRubric), /Teacher grade<\/dt><dd>0/);
    assert.match(cards.render(zeroRubric), /Teacher rubric<\/dt><dd>0\/4/);
});

test('teacher standards and rubric are not converted into raw points or percentages', () => {
    const model = cards.fromRecord({
        key: 'school-test', name: 'Unit Test', unit: 'spring-s1s2s3'
    }, {}, { pct: 84, teacher_grade: 'A/A/A', teacher_rating: '4/4',
        teacher_standards: { S1: 'A', S2: 'A', S3: 'A' } }, 'Latest attempt');
    const output = cards.render(model);
    assert.match(output, /<dt>Teacher grade<\/dt><dd>A\/A\/A/);
    assert.match(output, /<dt>Teacher rubric<\/dt><dd>4\/4/);
    assert.match(output, /<dt>Teacher standards<\/dt><dd>S1: A · S2: A · S3: A/);
    assert.doesNotMatch(output, /<dt>Points|100%/);
});

test('resource links preserve destination, new-tab behavior and known metadata only', () => {
    const output = cards.render({ variant: 'resource', kind: 'PDF resource',
        title: 'Printable practice', href: 'tests/example.pdf', newTab: true,
        possible: 100, duration: '75 minutes', action: 'Open PDF' });
    assert.match(output, /href="tests\/example.pdf" target="_blank" rel="noopener"/);
    assert.match(output, /Possible points<\/dt><dd>100/);
    assert.match(output, /Duration<\/dt><dd>75 minutes/);
    assert.match(output, /Open PDF \(new tab\)/);
    assert.doesNotMatch(output, /Questions|Not attempted|0%/);
});

test('Spring preserves GitHub priority, latest selection, hidden absent records and destinations', () => {
    const { context, nodes } = dashboard();
    context.tests = [
        { key: 'practice', file: 'exam.html?file=x', name: 'Practice', unit: 'spring-s1', trimester: 'spring' },
        { key: 'school-quiz', file: 'reviews/q.html', name: 'Quiz', unit: 'spring-s1', trimester: 'spring' },
        { key: 'absent', file: 'missing.html', name: 'Absent', trimester: 'spring' }
    ];
    context.getScores = () => ({ practice: { pct: 99 } });
    context._ghSpringScores = {
        practice: { attempts: [{ pct: 100 }, { pct: 0, score: 0, total: 8, timestamp: '2026-03-01T12:00:00Z' }] },
        'school-quiz': { attempts: [{ pct: 72.6, score: 45.75, total: 63, timestamp: '2026-03-02T12:00:00Z' }] }
    };
    context.buildSpringGrid();
    const output = nodes.springGrid.innerHTML;
    assert.equal((output.match(/class="activity-card"/g) || []).length, 2);
    assert.ok(output.indexOf('href="reviews/q.html"') < output.indexOf('href="exam.html?file=x"'));
    assert.match(output, /activity-card__score">0%/);
    assert.match(output, /<dt>Points<\/dt><dd>0\/8/);
    assert.match(output, /Latest attempt/);
    assert.match(output, /Recorded Mar 1, 2026/);
    assert.doesNotMatch(output, /99%|Absent|Questions/);
});

test('Winter preserves latest percentage and explicit first-attempt fallback without losing zero', () => {
    const { context, nodes } = dashboard();
    context.tests = [{ key: 'winter', name: 'Winter', trimester: 'winter', unit: 'nonlinear' },
        { key: 'unknown', name: 'Unrecorded', trimester: 'winter', file: 'exam.html?file=unknown' }];
    const first = { pct: 80, score: 8, total: 10, timestamp: '2026-02-01T12:00:00Z' };
    context._winterArchive = { mcm_scores: { winter: { attempts: [first, { pct: 0, score: 0, total: 10 }] } } };
    context.buildWinterTestGrid();
    assert.match(nodes.winterTestGrid.innerHTML, /^<article /);
    assert.match(nodes.winterTestGrid.innerHTML, /activity-card__score">0%/);
    assert.match(nodes.winterTestGrid.innerHTML, /No score recorded/);
    assert.doesNotMatch(nodes.winterTestGrid.innerHTML, /Not attempted/);
    context._winterArchive.mcm_scores.winter.attempts[1] = { score: 9, total: 10 };
    context.buildWinterTestGrid();
    assert.match(nodes.winterTestGrid.innerHTML, /activity-card__score">80%/);
    assert.match(nodes.winterTestGrid.innerHTML, /First attempt/);
    assert.match(nodes.winterTestGrid.innerHTML, /Points<\/dt><dd>8\/10/);
});

test('record kind and date provenance are factual', () => {
    const practice = cards.fromRecord({ key: 'practice', name: 'Practice Test', benchmark: true,
        teacherGrade: 'B', file: 'reviews/practice.html' }, {}, {}, 'Latest attempt');
    assert.equal(practice.kind, 'Scan-based review');
    assert.equal(practice.teacherGrade, 'B');
    assert.equal(practice.subject, '');
    assert.throws(() => cards.fromRecord({ key: 'bad', name: 'Bad' }, {}, { timestamp: 'invalid' }), /Invalid activity timestamp/);
    const homework = cards.fromRecord({ key: 'homework', name: 'Homework', homework: true }, {}, {}, '');
    assert.equal(homework.kind, 'Homework');
});

test('graph functions, source datasets, wrappers, registry and all non-card CSS remain byte-identical', () => {
    const sha = value => crypto.createHash('sha256').update(value).digest('hex');
    function source(name) {
        const start = html.indexOf('    function ' + name + '(');
        const end = html.indexOf('\n    function ', start + 1);
        return html.slice(start, end < 0 ? undefined : end).trim();
    }
    const expected = {
        renderTrendChart: 'f1571a0a8e97760c8fd4d097f43185715b272cba9f147d8b42b9d14caf2d057d',
        buildChart: '242853f9ccb9af8782be34addbbcbe11d26f00b84973d17fe7c4c0c207552868',
        buildWinterHistory: 'b023908601a618cfcc8be8b91e1298b15c91ad19d2287459676979bd88e931fa',
        buildSparkline: 'cc702fc0e9da9b572e7628ae6cb3c2d345a703696089928adc5663566ad7a19c',
        buildLast2Tests: '41171dce4075f935215e5013e0fc641dfd3155bc06b759dde8bf1dee1b67b7cd',
        formatScanDate: '4ebbabd4e38ccfbcb38e9a30d589da509d29b26354fd5803cdceec43ab7e393e',
        formatReportDate: '025d5cc9ba3384619f0f08c2c74ab85d394544cf63e339227eb4eaa55a42bbcb'
    };
    for (const [name, fingerprint] of Object.entries(expected)) assert.equal(sha(source(name)), fingerprint, name);
    assert.equal(sha(html.slice(html.indexOf("        document.getElementById('precalculusFirstScore')"),
        html.indexOf('    function buildStandards()')).trim()),
    '99830c9012b28d327c50dc64d555f5de6ed92f9f37523650eb41d72612b8ab30');
    assert.equal(sha(html.slice(html.indexOf('    // Load all scores'),
        html.indexOf('    </script>', html.indexOf('    // Load all scores'))).trim()),
    '0723ba527b46754856547e3b55246bfd631b799692c3e7a224f220db56fbf1bd');
    assert.equal(sha(html.slice(html.indexOf('    var tests = ['), html.indexOf('    /* ========== DAD MODE')).trim()),
        '77e83ca3565618482095d11a41f3f84496832f199efc20ed5f461f8f1e461f96');
    const css = html.match(/<style>([\s\S]*?)<\/style>/)[1]
        .replace(/        \.activity-card \{[\s\S]*?(?=        \.sparkline \{)/, 'CARD\n');
    assert.equal(sha(css), '9e7269dfef47ec9e89d2d631ce919291154929000a355e8662fa871559954b51');
    assert.equal(sha([...html.matchAll(/            <div class="trend-card"[\s\S]*?(?=            <div class="test-grid")/g)]
        .map(match => match[0]).join('\n')), 'd3ca53e5a8ca253850faa042039b7ae5ba1956c7354346842537992564cc7dbd');
});
