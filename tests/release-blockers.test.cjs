const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const katex = require('katex');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '..');

test('the legacy final exam loads and its answer-key button calls the actual modal helper', () => {
    const html = fs.readFileSync(path.join(root, 'final_exam_251123.html'), 'utf8');
    let answerKey;
    const context = {
        window: { addEventListener() {} },
        document: {
            addEventListener() {}, getElementById() { return null; },
            createElement() { return { setAttribute() {} }; },
            body: { appendChild() {} }
        },
        showAnswerKey(value) { answerKey = value; }
    };
    const scripts = [...html.matchAll(/<script(?:\s[^>]*)?>([^]*?)<\/script>/gi)];
    const main = scripts.find(match => match[1].includes('function gradeFinalExam()'));
    assert.ok(main);
    vm.runInNewContext(main[1], context);
    assert.equal(typeof context.gradeFinalExam, 'function');
    assert.match(html, /onclick="showFinalExamAnswerKey\(\)"/);
    context.showFinalExamAnswerKey();
    assert.match(answerKey, /<strong>Q1:<\/strong>/);
    assert.match(answerKey, /<strong>Q18:<\/strong>/);
    assert.equal((answerKey.match(/class="answer-item"/g) || []).length, 18);
});

test('RP12 prompts use renderable math without changing their answers or rubric', () => {
    const bank = JSON.parse(fs.readFileSync(path.join(root, 'data/retake-practice-12.json'), 'utf8'));
    let expressions = 0;
    for (const question of bank.questions) {
        assert.doesNotMatch(question.question_html, /\\\\[()]/);
        for (const match of question.question_html.matchAll(/\\\(([\s\S]*?)\\\)/g)) {
            assert.doesNotThrow(() => katex.renderToString(match[1], { throwOnError: true, trust: false }));
            expressions++;
        }
    }
    assert.ok(expressions >= 4);
    bank.questions.forEach(question => { delete question.question_html; });
    assert.equal(crypto.createHash('sha256').update(JSON.stringify(bank)).digest('hex'),
        'dc78a25b71f77380450f5392978f111a038fd630844393333368b290e2fae4b3');
});
