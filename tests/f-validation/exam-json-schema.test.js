/**
 * exam-json-schema.test.js — Validate data/retake-practice-1.json
 * Agent GF | Sprint: autonomous-sprint
 * 
 * Checks every question has required fields, valid types, proper tolerances,
 * graph config structure, and plus_minus consistency.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const JSON_PATH = path.join(ROOT, 'data', 'retake-practice-1.json');

let data;
let pass = 0, fail = 0, total = 0;

function test(name, fn) {
    total++;
    try {
        fn();
        pass++;
        console.log(`  ✅ ${name}`);
    } catch (e) {
        fail++;
        console.log(`  ❌ ${name} — ${e.message}`);
    }
}

function assert(cond, msg) { if (!cond) throw new Error(msg || 'Assertion failed'); }

// ============================================================
// Load JSON
// ============================================================
console.log('\n🏀 exam-json-schema.test.js\n');

try {
    const raw = fs.readFileSync(JSON_PATH, 'utf-8');
    data = JSON.parse(raw);
    console.log(`Loaded: ${JSON_PATH}`);
    console.log(`Questions: ${data.questions.length}\n`);
} catch (e) {
    console.log(`❌ FATAL: Cannot load ${JSON_PATH} — ${e.message}`);
    process.exit(1);
}

// ============================================================
// Suite 1: Top-level fields
// ============================================================
console.log('── Suite 1: Top-level fields ──');

test('has exam_id', () => assert(typeof data.exam_id === 'string' && data.exam_id.length > 0));
test('has title', () => assert(typeof data.title === 'string' && data.title.length > 0));
test('has subtitle', () => assert(typeof data.subtitle === 'string'));
test('has time_minutes (positive number)', () => assert(typeof data.time_minutes === 'number' && data.time_minutes > 0));
test('has questions array', () => assert(Array.isArray(data.questions) && data.questions.length > 0));
test('has 15 questions', () => assert(data.questions.length === 15, `Expected 15, got ${data.questions.length}`));

// ============================================================
// Suite 2: Required fields per question
// ============================================================
console.log('\n── Suite 2: Required fields per question ──');

const REQUIRED_FIELDS = ['id', 'number', 'standard', 'type', 'question_html', 'inputs', 'hint', 'solution_steps'];
const VALID_INPUT_TYPES = ['dropdown', 'number', 'radio', 'text'];

for (const q of data.questions) {
    test(`Q${q.number} (${q.id}): has all required fields`, () => {
        for (const field of REQUIRED_FIELDS) {
            assert(q[field] !== undefined, `Missing field: ${field}`);
        }
    });
}

// ============================================================
// Suite 3: Input validation
// ============================================================
console.log('\n── Suite 3: Input validation ──');

for (const q of data.questions) {
    test(`Q${q.number}: inputs is non-empty array`, () => {
        assert(Array.isArray(q.inputs) && q.inputs.length > 0, 'inputs must be non-empty array');
    });

    for (const inp of q.inputs) {
        test(`Q${q.number} input ${inp.id}: has valid type`, () => {
            assert(VALID_INPUT_TYPES.includes(inp.type), `Invalid type: ${inp.type}`);
        });

        test(`Q${q.number} input ${inp.id}: has answer`, () => {
            assert(inp.answer !== undefined, 'Missing answer');
        });

        if (inp.type === 'number') {
            test(`Q${q.number} input ${inp.id}: answer is number`, () => {
                assert(typeof inp.answer === 'number', `Expected number, got ${typeof inp.answer}`);
            });
            test(`Q${q.number} input ${inp.id}: has tolerance`, () => {
                assert(typeof inp.tolerance === 'number' && inp.tolerance > 0, 'tolerance must be positive number');
            });
        }

        if (inp.type === 'dropdown') {
            test(`Q${q.number} input ${inp.id}: has options array`, () => {
                assert(Array.isArray(inp.options) && inp.options.length >= 2, 'dropdown needs 2+ options');
            });
            test(`Q${q.number} input ${inp.id}: answer in options`, () => {
                assert(inp.options.includes(inp.answer), `Answer "${inp.answer}" not in options`);
            });
        }

        if (inp.type === 'radio') {
            test(`Q${q.number} input ${inp.id}: has options array`, () => {
                assert(Array.isArray(inp.options) && inp.options.length >= 2, 'radio needs 2+ options');
            });
            test(`Q${q.number} input ${inp.id}: answer matches an option value`, () => {
                const vals = inp.options.map(o => o.value || o);
                assert(vals.includes(inp.answer), `Answer "${inp.answer}" not in option values`);
            });
        }
    }
}

// ============================================================
// Suite 4: Plus/minus consistency
// ============================================================
console.log('\n── Suite 4: Plus/minus questions ──');

const plusMinusQs = data.questions.filter(q => q.plus_minus === true);
test(`Found ${plusMinusQs.length} plus_minus questions`, () => assert(plusMinusQs.length > 0));

for (const q of plusMinusQs) {
    test(`Q${q.number}: plus_minus has exactly 2 number inputs`, () => {
        const numInputs = q.inputs.filter(i => i.type === 'number');
        assert(numInputs.length === 2, `Expected 2 number inputs, got ${numInputs.length}`);
    });

    test(`Q${q.number}: plus_minus answers are distinct`, () => {
        const numInputs = q.inputs.filter(i => i.type === 'number');
        if (numInputs.length === 2) {
            assert(numInputs[0].answer !== numInputs[1].answer,
                `Both answers are ${numInputs[0].answer} — should be distinct for ± ordering`);
        }
    });
}

// ============================================================
// Suite 5: Graph questions
// ============================================================
console.log('\n── Suite 5: Graph questions ──');

const graphQs = data.questions.filter(q => q.graph);
test(`Found ${graphQs.length} graph questions`, () => assert(graphQs.length > 0));

for (const q of graphQs) {
    const g = q.graph;
    test(`Q${q.number}: graph has canvas_id`, () => assert(typeof g.canvas_id === 'string'));
    test(`Q${q.number}: graph has function (JS expression)`, () => assert(typeof g.function === 'string'));
    test(`Q${q.number}: graph has function_display`, () => assert(typeof g.function_display === 'string'));
    test(`Q${q.number}: graph has key_points array`, () => {
        assert(Array.isArray(g.key_points) && g.key_points.length >= 3, 'Need at least 3 key points');
    });
    test(`Q${q.number}: graph has min_points`, () => assert(typeof g.min_points === 'number' && g.min_points >= 3));
    test(`Q${q.number}: graph has tolerance`, () => assert(typeof g.tolerance === 'number' && g.tolerance > 0));

    // Verify function evaluates correctly at key points
    test(`Q${q.number}: function matches key_points`, () => {
        const fn = new Function('x', 'return ' + g.function);
        for (const [px, py] of g.key_points) {
            const computed = fn(px);
            const diff = Math.abs(computed - py);
            assert(diff < 0.01, `f(${px}) = ${computed}, expected ${py}, diff=${diff.toFixed(4)}`);
        }
    });

    // Verify key_points snap to 0.25
    test(`Q${q.number}: key_points snap to 0.25`, () => {
        for (const [px, py] of g.key_points) {
            assert(Math.abs(px * 4 - Math.round(px * 4)) < 0.001, `x=${px} not on 0.25 grid`);
            assert(Math.abs(py * 4 - Math.round(py * 4)) < 0.001, `y=${py} not on 0.25 grid`);
        }
    });

    // Asymptotes
    if (g.asymptotes) {
        test(`Q${q.number}: asymptotes has vertical or horizontal`, () => {
            assert(g.asymptotes.vertical || g.asymptotes.horizontal, 'asymptotes must have vertical or horizontal');
        });
        if (g.asymptotes.vertical) {
            test(`Q${q.number}: vertical asymptotes are arrays of numbers`, () => {
                assert(Array.isArray(g.asymptotes.vertical));
                for (const v of g.asymptotes.vertical) assert(typeof v === 'number');
            });
        }
        if (g.asymptotes.horizontal) {
            test(`Q${q.number}: horizontal asymptotes are arrays of numbers`, () => {
                assert(Array.isArray(g.asymptotes.horizontal));
                for (const h of g.asymptotes.horizontal) assert(typeof h === 'number');
            });
        }
    }
}

// ============================================================
// Suite 6: Solution steps and feedback
// ============================================================
console.log('\n── Suite 6: Solution steps & feedback ──');

for (const q of data.questions) {
    test(`Q${q.number}: solution_steps is non-empty array of strings`, () => {
        assert(Array.isArray(q.solution_steps) && q.solution_steps.length >= 2, 'Need 2+ steps');
        for (const step of q.solution_steps) assert(typeof step === 'string' && step.length > 0);
    });

    test(`Q${q.number}: hint is non-empty string`, () => {
        assert(typeof q.hint === 'string' && q.hint.length > 0);
    });

    test(`Q${q.number}: has feedback_correct`, () => {
        assert(typeof q.feedback_correct === 'string' && q.feedback_correct.length > 0);
    });

    // feedback_wrong can be feedback_wrong, feedback_wrong_parent, feedback_wrong_intercepts, etc.
    test(`Q${q.number}: has at least one feedback_wrong variant`, () => {
        const wrongKeys = Object.keys(q).filter(k => k.startsWith('feedback_wrong'));
        assert(wrongKeys.length >= 1, 'Missing feedback_wrong or variant');
    });
}

// ============================================================
// Suite 7: Unique IDs and sequential numbering
// ============================================================
console.log('\n── Suite 7: IDs and numbering ──');

test('all question IDs are unique', () => {
    const ids = data.questions.map(q => q.id);
    const unique = new Set(ids);
    assert(unique.size === ids.length, `${ids.length - unique.size} duplicate IDs`);
});

test('all input IDs are unique', () => {
    const ids = data.questions.flatMap(q => q.inputs.map(i => i.id));
    const unique = new Set(ids);
    assert(unique.size === ids.length, `${ids.length - unique.size} duplicate input IDs`);
});

test('question numbers are 1-15 sequential', () => {
    const nums = data.questions.map(q => q.number).sort((a, b) => a - b);
    for (let i = 0; i < 15; i++) {
        assert(nums[i] === i + 1, `Expected Q${i + 1}, got Q${nums[i]}`);
    }
});

// ============================================================
// Suite 8: Math verification (independent computation)
// ============================================================
console.log('\n── Suite 8: Independent math verification ──');

// Q1: f(x) = 2(x-3)² - 8, x-intercepts: 2(x-3)²=8 → (x-3)²=4 → x=1,5
test('Q1 math: 2(1-3)²-8 = 2(4)-8 = 0', () => assert(2 * Math.pow(1 - 3, 2) - 8 === 0));
test('Q1 math: 2(5-3)²-8 = 2(4)-8 = 0', () => assert(2 * Math.pow(5 - 3, 2) - 8 === 0));

// Q2: f(x) = √(x+4) - 3, x-int: √(x+4)=3 → x+4=9 → x=5
test('Q2 math: √(5+4)-3 = 3-3 = 0', () => assert(Math.sqrt(5 + 4) - 3 === 0));

// Q3: f(x) = -|x-1|+4, x-int: |x-1|=4 → x=-3,5
test('Q3 math: -|-3-1|+4 = -4+4 = 0', () => assert(-Math.abs(-3 - 1) + 4 === 0));
test('Q3 math: -|5-1|+4 = -4+4 = 0', () => assert(-Math.abs(5 - 1) + 4 === 0));

// Q4: 7^(2x-3)=49, x=2.5: 7^(5-3)=7²=49
test('Q4 math: 7^(2*2.5-3) = 7² = 49', () => assert(Math.pow(7, 2 * 2.5 - 3) === 49));

// Q5: 3(x-4)²-12=0, x=6,2
test('Q5 math: 3(6-4)²-12 = 12-12 = 0', () => assert(3 * Math.pow(6 - 4, 2) - 12 === 0));
test('Q5 math: 3(2-4)²-12 = 12-12 = 0', () => assert(3 * Math.pow(2 - 4, 2) - 12 === 0));

// Q6: √(5x-1)+2=7, x=5.2: √(26-1)+2=√25+2=7
test('Q6 math: √(5*5.2-1)+2 = √25+2 = 7', () => assert(Math.sqrt(5 * 5.2 - 1) + 2 === 7));

// Q7: 4^(x+1)=8, x=0.5: 4^1.5 = (2²)^1.5 = 2³ = 8
test('Q7 math: 4^(0.5+1) = 4^1.5 = 8', () => assert(Math.pow(4, 1.5) === 8));

// Q8: (5x+2)/(x-3)=7, x=11.5: (57.5+2)/(11.5-3) = 59.5/8.5 = 7
test('Q8 math: (5*11.5+2)/(11.5-3) = 59.5/8.5 = 7', () => assert((5 * 11.5 + 2) / (11.5 - 3) === 7));

// Q9: √(2x²+7)=5, x=±3: √(18+7)=√25=5
test('Q9 math: √(2*9+7) = √25 = 5', () => assert(Math.sqrt(2 * 9 + 7) === 5));

// Q10: √(x+3)=x+1, x=1: √4=2, 1+1=2
test('Q10 math: √(1+3) = 2, 1+1 = 2', () => assert(Math.sqrt(1 + 3) === 1 + 1));
// x=-2 is extraneous: √1=1, -2+1=-1 ≠ 1
test('Q10 math: x=-2 extraneous: √1≠-1', () => assert(Math.sqrt(-2 + 3) !== (-2 + 1)));

// Q11: 3x^(3/2)-24=57, x=9: 3*27-24=81-24=57
test('Q11 math: 3*9^(3/2)-24 = 3*27-24 = 57', () => assert(3 * Math.pow(9, 1.5) - 24 === 57));

// Q12: f(x)=(x-1)²-4, vertex (1,-4)
test('Q12 math: vertex (1,-4)', () => assert(Math.pow(1 - 1, 2) - 4 === -4));

// Q13: f(x)=2/(x+1)+3, VA at x=-1, HA at y=3
test('Q13 math: f(0)=2/1+3=5', () => assert(2 / (0 + 1) + 3 === 5));
test('Q13 math: f(1)=2/2+3=4', () => assert(2 / (1 + 1) + 3 === 4));

// Q14: V=(1/3)πr²h, r=√(3V/(πh)) → answer B
test('Q14 math: r=√(3V/(πh)) is correct', () => {
    const V = 100, h = 5;
    const r = Math.sqrt(3 * V / (Math.PI * h));
    const Vcheck = (1 / 3) * Math.PI * r * r * h;
    assert(Math.abs(Vcheck - V) < 0.001, `V=${Vcheck}, expected ${V}`);
});

// Q15: P(t)=500*3^(t/6)=40500, t=24: 500*3^4=500*81=40500
test('Q15 math: 500*3^(24/6) = 500*81 = 40500', () => assert(500 * Math.pow(3, 24 / 6) === 40500));

// ============================================================
// Summary
// ============================================================
console.log(`\n${'═'.repeat(50)}`);
console.log(`RESULTS: ${pass}/${total} passed, ${fail} failed`);
if (fail === 0) console.log('✅ All schema + math checks pass');
else console.log('❌ FAILURES FOUND — fix before building exam.html');
console.log(`${'═'.repeat(50)}\n`);

process.exit(fail > 0 ? 1 : 0);
