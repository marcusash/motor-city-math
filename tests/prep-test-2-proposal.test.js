const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const context = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'reviews', 'prep-test-2-proposal-data.js'), 'utf8'), context);
const data = context.window.prepTest2Proposal;
assert.equal(data.questions.length, 8);
assert.equal(data.questions.reduce((sum, q) => sum + q.points, 0), 100);
assert.equal(data.questions.reduce((sum, q) => sum + q.minutes, 0), 70);
assert.equal(data.workingMinutes + data.checkingMinutes, 75);
const polynomialQuestions = data.questions.filter(q => q.polynomialDegree);
assert.equal(polynomialQuestions.map(q=>q.polynomialDegree).sort().join(','),'4,5');
assert.equal(polynomialQuestions.reduce((sum,q)=>sum+q.points,0),24);
assert.equal(polynomialQuestions.reduce((sum,q)=>sum+q.minutes,0),18);
data.questions.forEach((q, index) => {
  assert.equal(q.id, index + 1);
  assert.ok([1,2,3].includes(q.difficulty));
  assert.equal(q.rubric.reduce((sum, part) => sum + part.points, 0), q.points);
  assert.ok(q.target && q.extension && q.stem.length && q.steps.length);
  (q.graphs || []).forEach(graph => {
    assert.equal(graph.x[0],-graph.x[1]);
    assert.equal(graph.y[0],-graph.y[1]);
    assert.equal(graph.x.join(','),graph.y.join(','));
    graph.lines.forEach(line => line.vertices.forEach(([x,y]) => {
    assert.ok(x >= graph.x[0] && x <= graph.x[1]);
    assert.ok(y >= graph.y[0] && y <= graph.y[1]);
    }));
  });
});
const p = x => x < -1 ? 2*x+4 : 3;
assert.deepEqual([-2,-1,2].map(p), [0,3,3]);
const transformSource = [[-3,1],[-1,-2],[2,0],[4,2]];
assert.deepEqual(transformSource.map(([u,v])=>[u+2,1-v]),[[-1,0],[1,3],[4,1],[6,-1]]);
assert.deepEqual([-3,4].map(u=>u+2),[-1,6]);
assert.deepEqual([-2,2].map(v=>1-v).sort((a,b)=>a-b),[-1,3]);
assert.equal(data.questions[1].stem.length,3);
assert.doesNotMatch(data.questions[1].stem.join(' '),/derive|table|\/2|point check/);
const source = [[-3,-1],[-1,3],[2,0],[4,2]];
assert.deepEqual(source.map(([u,v])=>[(1-u)/2,v]).sort((a,b)=>a[0]-b[0]), [[-1.5,2],[-0.5,0],[1,3],[2,-1]]);
assert.deepEqual(source.map(([u,v])=>[u,1-2*v]), [[-3,3],[-1,-5],[2,1],[4,-3]]);
source.forEach(([u,v])=>{
  assert.equal(1-2*((1-u)/2),u);
  assert.ok(Math.abs((1-u)/2)<6 && Math.abs(1-2*v)<6);
});
assert.deepEqual([-3,4].map(u=>(1-u)/2).sort((a,b)=>a-b),[-1.5,2]);
function read(vertices, x) {
  for (let i=1;i<vertices.length;i++) {
    const [x0,y0]=vertices[i-1], [x1,y1]=vertices[i];
    if (x>=x0 && x<=x1) return y0+(y1-y0)*(x-x0)/(x1-x0);
  }
  throw new Error('Outside graph domain: '+x);
}
const f = x => read([[-4,2],[-2,-2],[1,1],[4,-2]],x);
const g = x => read([[-3,0],[0,3],[3,0]],x);
assert.deepEqual([f(-1),g(-1),g(f(-1)),f(g(-1))], [-1,2,2,0]);
assert.equal(f(-3.5),1);
assert.equal(g(f(-3.5)),2);
assert.throws(()=>g(-3.5),/Outside graph domain/);
[-3.5,-2.5,-1,1,3].forEach(x=>assert.equal(g(f(x)),2));
const compositeSolutions=[];
for (const target of [-1,1]) {
  const vertices=[[-4,2],[-2,-2],[1,1],[4,-2]];
  for(let i=1;i<vertices.length;i++) {
    const [x0,y0]=vertices[i-1], [x1,y1]=vertices[i];
    if(target>=Math.min(y0,y1) && target<=Math.max(y0,y1)) compositeSolutions.push(x0+(target-y0)*(x1-x0)/(y1-y0));
  }
}
assert.deepEqual([...new Set(compositeSolutions)].sort((a,b)=>a-b),[-3.5,-2.5,-1,1,3]);
[-3,0,2].forEach(x => assert.equal(f(x),0));
assert.ok(f(-1)>f(-2) && f(1)>f(-1));
assert.ok(f(-4)>f(-2) && f(1)>f(4));
const q = x => -2*Math.abs(x-2)+4;
assert.deepEqual([0,2,4].map(q),[0,4,0]);
assert.ok(q(1)<q(2) && q(3)<q(2));
const P = x => 2*(x+2)**2*(x-1)**3;
assert.equal(P(0),-8);
assert.ok(P(-2)===0 && P(1)===0);
assert.ok(P(-3)<0 && P(-1)<0 && P(2)>0);
assert.ok(P(-100)<0 && P(100)>0);
const legal = x => 9-x*x>=0 && 4-x*x!==0;
assert.deepEqual([-3,-2,0,2,3,4].map(legal), [true,false,true,false,true,false]);
const R = x => -(x+2)*(x-1)**2*(x-3);
const expandedR = x => -(x**4)+3*x**3+3*x*x-11*x+6;
for (let x=-6;x<=6;x+=0.25) assert.ok(Math.abs(R(x)-expandedR(x))<1e-10);
[-2,1,3].forEach(x=>assert.ok(R(x)===0));
assert.equal(R(0),6);
assert.deepEqual([-3,0,2,4].map(x=>Math.sign(R(x))),[-1,1,1,-1]);
assert.ok(R(0.99)>0 && R(1.01)>0);
assert.ok(R(-100)<0 && R(100)<0);
assert.ok(P(0.99)<0 && P(1.01)>0);
const quinticCrossingRate = Math.abs((P(1+0.001)-P(1))/0.001);
assert.ok(quinticCrossingRate<0.0001);
const html = fs.readFileSync(path.join(root,'reviews','prep-test-2-proposal.html'),'utf8');
assert.match(html,/not the finished test/);
assert.match(html,/blank answer does not prove/);
assert.match(html,/prep-test-2-proposal-data\.js/);
for (const match of html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)) {
  if (match[1].trim()) new Function(match[1]);
}
class Element {
  constructor(tag) { this.tag=tag; this.children=[]; this.attributes={}; }
  append(...children) { this.children.push(...children); }
  setAttribute(key,value) { this.attributes[key]=value; }
}
const containers = { plan:new Element('tbody'), questions:new Element('div') };
const document = {
  createElement: tag=>new Element(tag),
  createElementNS: (namespace,tag)=>new Element(tag),
  createTextNode: text=>({ textContent:text }),
  getElementById: id=>containers[id]
};
const renderer = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].find(match=>match[1].trim())[1];
vm.runInNewContext(renderer, { window:context.window, document });
assert.equal(containers.plan.children.length,8);
assert.equal(containers.questions.children.length,8);
assert.equal(containers.questions.children[0].id,'q1');
assert.equal(containers.questions.children[7].id,'q8');
const allElements = [];
function visit(element) {
  allElements.push(element);
  (element.children || []).forEach(visit);
}
visit(containers.questions);
assert.equal(allElements.filter(element=>element.tag==='details').length,8);
assert.equal(allElements.filter(element=>element.tag==='svg').length,3);
assert.equal(allElements.filter(element=>element.tag==='polyline').length,4);
assert.equal(allElements.filter(element=>element.tag==='circle').length,15);
console.log('Prep Test 2 proposal: PASS (8 questions, 100 points, 70+5 minutes; verified mappings, graph reads, rules, signs, and domains).');
