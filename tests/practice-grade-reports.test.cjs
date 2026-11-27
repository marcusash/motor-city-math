const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const names = ['rational-functions-practice-2026-11-12', 'cumulative-final-practice-2026-11-21', 'final-rehearsal-2026-11-22'];
const expected = [
    { earned: 54, points: 58, awards: [8,4,4,7,8.5,4,4,4,2,2,.5,2,4] },
    { earned: 113.75, points: 128, awards: [8,6.25,8,7,8,8,5.5,7.5,6,4.5,8,8,8,8,5,8] },
    { earned: 92.75, points: 100, awards: [7,7.5,3,9.5,7,5,9,5,9.5,4,8,8,6.25,4] }
];
function node(tag, text = '') {
    return {
        tag, textContent: text, children: [], attributes: {}, open: false,
        get lastChild() { return this.children.at(-1); },
        append(...items) { this.children.push(...items); },
        replaceChildren(...items) { this.children = items; },
        setAttribute(key, value) { this.attributes[key] = value; },
        addEventListener(key, fn) { this.attributes[key] = fn; },
        querySelectorAll(tag) { return descend(this).filter(child => child !== this && child.tag === tag); }
    };
}
function descend(item) { return [item, ...item.children.flatMap(descend)]; }
function text(item) { return item.textContent + item.children.map(text).join(''); }
function report(name) {
    const nodes = {report: node('main')};
    const events = {};
    const context = {
        window: { addEventListener: (event, callback) => { events[event] = callback; } },
        document: {
            getElementById: id => nodes[id] || (nodes[id] = node('div')),
            createElement: tag => node(tag), createTextNode: text => node('#text', text)
        },
        URL, renderMathInElement: (_, options) => {
            assert.equal(options.throwOnError, true);
            assert.equal(options.trust, false);
        }
    };
    vm.createContext(context);
    vm.runInContext(fs.readFileSync(path.join(root,'reviews',name+'-data.js'),'utf8'),context);
    return {context,nodes,events,data:context.window.practiceGradeReport};
}
const renderer = fs.readFileSync(path.join(root,'shared','practice-report.js'),'utf8');
test('three reports preserve original awards, complete component explanations and text-only delivery', () => {
    names.forEach((name,index) => {
        const {context,nodes,events,data} = report(name);
        assert.equal(data.earned,expected[index].earned);
        assert.equal(data.points,expected[index].points);
        assert.deepEqual(Array.from(data.questions,q=>q.earned),expected[index].awards);
        for(const q of data.questions) {
            assert.equal(q.components.reduce((n,c)=>n+c.earned,0),q.earned);
            assert.equal(q.components.reduce((n,c)=>n+c.points,0),q.points);
            assert.ok(q.components.every(c=>c.reason.trim().length>0));
            assert.ok(Array.isArray(q.solution) ? q.solution.length : q.solution);
        }
        assert.equal(data.assessedOn,null);
        assert.equal(data.scannedOn,null);
        assert.equal(data.elapsedMinutes,null);
        const source=fs.readFileSync(path.join(root,'reviews',name+'-data.js'),'utf8');
        assert.doesNotMatch(source, /data:image|file:\/\/|C:\\\\|\.copilot|<img|9fbf7a1bc2f5/);
        const html=fs.readFileSync(path.join(root,'reviews',name+'.html'),'utf8');
        assert.match(html,/shared\/reports.css/);
        assert.doesNotMatch(html,/<img|<iframe|<embed/);
        vm.runInContext(renderer,context);
        const all=descend(nodes.report);
        assert.equal(all.filter(n=>n.tag==='article').length,data.questions.length);
        assert.equal(all.filter(n=>n.tag==='details').length,data.questions.length);
        assert.ok(all.some(n=>n.id==='score' && text(n).startsWith(data.earned+'/'+data.points)));
        assert.ok(all.some(n=>n.href===data.pdf));
        assert.match(text(nodes.report),/not teacher-awarded marks/);
        const detail=all.find(n=>n.tag==='details');
        detail.open=false;
        events.beforeprint();
        events.beforeprint();
        assert.equal(detail.open,true);
        events.afterprint();
        assert.equal(detail.open,false);
        const pdf=fs.readFileSync(path.join(root,'reviews',data.pdf));
        assert.equal(pdf.subarray(0,5).toString(),'%PDF-');
    });
    const cumulative=report(names[1]).data;
    assert.deepEqual(Array.from(cumulative.sections,section=>cumulative.questions
        .filter(q=>section.questionIds.includes(q.id)).reduce((n,q)=>n+q.earned,0)),
    [14.25,15,16,13,10.5,16,16,13]);
    assert.match(cumulative.provenance,/no printed points/);
    const rehearsal=report(names[2]).data;
    assert.equal(rehearsal.questions[6].earned,9);
    assert.match(rehearsal.questions[6].components.at(-1).reason,/reading error, removed/);
    assert.match(rehearsal.notes.join(' '),/supersedes the initial 92.5/);
});
test('invalid source data fails visibly rather than displaying a success-shaped score', () => {
    for(const mutate of [
        data=>{data.questions[0].components[0].earned=-1;},
        data=>{data.questions[0].earned-=.25;},
        data=>{data.questions[1].id=data.questions[0].id;},
        data=>{data.earned+=1;}
    ]) {
        const {context,nodes,data}=report(names[0]);
        mutate(data);
        assert.throws(()=>vm.runInContext(renderer,context),/Inconsistent|totals/);
        assert.match(nodes.report.textContent,/Report unavailable/);
    }
});
test('dashboard derives eight points from source data without changing teacher marks', () => {
    const context={window:{MCMActivityCards:require('../shared/activity-cards')}};
    const nodes={};
    context.document={
        getElementById:id=>nodes[id]||(nodes[id]=node('div')),
        createElement:tag=>node(tag),createTextNode:text=>node('#text',text)
    };
    vm.createContext(context);
    for(const name of ['test-1-study-guide','assessment-1-functions-75min-grade',
        'assessment-1-midterm-functions-grade','assessment-2-rational-functions-grade',
        'assessment-2-mini-quiz-2026-11-10',...names]) {
        vm.runInContext(fs.readFileSync(path.join(root,'reviews',name+'-data.js'),'utf8'),context);
    }
    let points;
    context.renderTrendChart=(_,history)=>{points=JSON.parse(JSON.stringify(history));};
    const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
    vm.runInContext(html.slice(html.indexOf('    function formatScanDate('),
        html.indexOf('    function buildStandards()')),context);
    context.buildPrecalculusHistory();
    assert.deepEqual(points.map(p=>p.fa),[84,89.5,72.6,46.1,65.5,93.1,88.9,92.8]);
    assert.equal(points.filter(p=>p.kind==='teacher-result').length,2);
    assert.equal(nodes.precalculusChartScores.children.length,8);
    assert.equal((nodes.precalculusGrid.innerHTML.match(/class="activity-card"/g)||[]).length,9);
    assert.match(nodes.precalculusGrid.innerHTML, /92\.75\/100/);
    assert.match(nodes.precalculusGrid.innerHTML, /113\.75\/128/);
    assert.doesNotMatch(nodes.precalculusGrid.innerHTML,/93\.103448|88\.867187/);
    const history=JSON.stringify(points.slice(0,5));
    const latest=context.window.practiceGradeReports.at(-1);
    latest.questions[0].earned-=.25;
    latest.earned-=.25;
    context.buildPrecalculusHistory();
    assert.equal(points.at(-1).fa,92.5);
    assert.equal(JSON.stringify(points.slice(0,5)),history);
});
