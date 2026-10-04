const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const context = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'reviews', 'prep-test-2-proposal-data.js'), 'utf8'), context);
const data = context.window.prepTest2Proposal;
assert.equal(data.questions.length, 10);
assert.equal(data.questions.reduce((sum, q) => sum + q.points, 0), 100);
assert.equal(data.questions.reduce((sum, q) => sum + q.minutes, 0), 70);
assert.equal(data.workingMinutes + data.checkingMinutes, 75);
const polynomialQuestions = data.questions.filter(q => q.polynomialDegree);
assert.equal(polynomialQuestions.map(q=>q.polynomialDegree).sort().join(','),'4,5');
assert.equal(polynomialQuestions.reduce((sum,q)=>sum+q.points,0),22);
assert.equal(polynomialQuestions.reduce((sum,q)=>sum+q.minutes,0),16);
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
assert.match(data.questions[2].stem[0],/g\(x\)=1-\(3\/5\)x/);
assert.deepEqual(Array.from(data.questions[2].graphs[0].lines[0].vertices, p=>Array.from(p)), source);
assert.deepEqual(source.map(([u,v])=>[(5/3)*(1-u),v]).sort((a,b)=>a[0]-b[0]), [[-5,2],[-5/3,0],[10/3,3],[20/3,-1]]);
const outsideExpected = [[-3,8/5],[-1,-4/5],[2,1],[4,-1/5]];
source.forEach(([u,v],i)=>{
  assert.equal(u,outsideExpected[i][0]);
  assert.ok(Math.abs(1-(3/5)*v-outsideExpected[i][1])<1e-12);
});
source.forEach(([u,v])=>{
  assert.ok(Math.abs(1-(3/5)*((5/3)*(1-u))-u)<1e-12);
  assert.ok(Math.abs((5/3)*(1-u))<8 && Math.abs(1-(3/5)*v)<8);
});
assert.deepEqual([-3,4].map(u=>(5/3)*(1-u)).sort((a,b)=>a-b),[-5,20/3]);
assert.equal(data.questions[3].graphs.length,0);
assert.match(data.questions[3].stem[0],/R\(x\)=\(x\^2-x-2\)\/\(x\^2\+x-6\)/);
for (let x=-10;x<=10;x+=0.25) {
  assert.ok(x*x-x-2===(x-2)*(x+1));
  assert.ok(x*x+x-6===(x-2)*(x+3));
  if(x!==2 && x!==-3) assert.ok(Math.abs((x*x-x-2)/(x*x+x-6)-(x+1)/(x+3))<1e-12);
}
assert.equal((1*1-1-2)/(1*1+1-6),0.5);
assert.equal(2*2+2-6,0);
assert.equal((2+1)/(2+3),0.6);
const A = x=>x*x-2*x, B=x=>2*x-1;
for(let x=-10;x<=10;x+=0.25) {
  assert.equal(A(B(x)),4*x*x-8*x+3);
  assert.equal(B(A(x)),2*x*x-4*x-1);
  assert.equal(A(B(x))-B(A(x)),2*(x-1)**2+2);
  assert.ok(A(B(x))>B(A(x)));
}
assert.equal((-4)**2-4*2*4,-16);
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
const area=w=>w*(12-w);
const cost=a=>a<=30?8*a:240+5*(a-30);
const price=w=>w<=6-Math.sqrt(6)?96*w-8*w*w:60*w-5*w*w+90;
assert.ok(Math.abs(area(6-Math.sqrt(6))-30)<1e-10);
for(let w=2;w<=6;w+=0.01) assert.ok(Math.abs(price(w)-cost(area(w)))<1e-9);
assert.equal(area(4),32);
assert.equal(cost(area(4)),250);
assert.ok(Math.abs(cost(area(6-Math.sqrt(2)))-260)<1e-9);
assert.ok(cost(area(6-Math.sqrt(2)+0.01))>260);
assert.equal((6-Math.sqrt(2)).toFixed(2),'4.59');
const radical=x=>-2*Math.sqrt(x-1)+3;
assert.deepEqual([1,2,5,10].map(radical),[3,1,-1,-3]);
assert.equal(radical(13/4),0);
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
assert.equal(containers.plan.children.length,10);
assert.equal(containers.questions.children.length,10);
assert.equal(containers.questions.children[0].id,'q1');
assert.equal(containers.questions.children[9].id,'q10');
const allElements = [];
function visit(element) {
  allElements.push(element);
  (element.children || []).forEach(visit);
}
visit(containers.questions);
assert.equal(allElements.filter(element=>element.tag==='details').length,10);
assert.equal(allElements.filter(element=>element.tag==='svg').length,2);
assert.equal(allElements.filter(element=>element.tag==='polyline').length,2);
assert.equal(allElements.filter(element=>element.tag==='circle').length,8);
console.log('Prep Test 2 proposal: PASS (10 questions, 100 points, 70+5 minutes; verified models, compositions, graph reads, rules, signs, and domains).');
