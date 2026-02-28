# GA Learning Plan

## Focus

Application engineering for Motor City Math: exam renderer, dashboard, grading logic, and shared component quality.

## The Bar

### Rich Hickey

Represents simple, composable, correct systems. His discipline: distinguish between "simple" (no complecting of concerns) and "easy" (familiar, nearby). The gap for me is that I reach for "easy" : inline state, nested callbacks, coupled functions : when I should be designing for simple.

**What this means in my code:**
- `gradeExam()` in exam.html currently does: parse inputs, calculate scores, build DOM, dispatch events, update localStorage. That is 5 concerns in one function. Hickey would split those into independent steps.
- The autosave implementation I shipped uses an inline closure inside `loadExam()`. It works, but couples autosave state to the exam render lifecycle. A Hickey-simple design would isolate autosave as a standalone module with no knowledge of the render path.
- Every time I reach for a global variable (`examGraded`, `graphData`), I should ask: what is the minimal data shape, who truly owns it, and can I eliminate the mutation?

**The practice:** Before writing a function, write its name and list every thing it does. If the list has more than one item, split it.

### Dan Abramov

Represents deep understanding over pattern-matching. His discipline: do not reach for an abstraction until you feel the pain three times. The gap for me is premature abstraction : I build helpers before I understand the problem, and I treat familiar patterns as solutions without verifying they fit the actual constraint.

**What this means in my code:**
- I added `showLoadError()` as a shared helper after seeing the same three-line pattern in fetch, XHR, and onerror. That was correct : three repetitions, then extract. The mistake I make is extracting after one repetition (DRY anxiety).
- The score animation IIFE I shipped is a good example of not-yet-abstracted: it runs once, is inline, and does not need to be a named function. Abramov would approve. Future me would want to "make it reusable" : resist that impulse until there is a second consumer.
- `renderPicker()` is pulled out of the IIFE : correct, it has two call sites (fetch success + fallback). One abstraction, justified by two real uses.

**The practice:** When I extract a function, write a comment with the exact two or more call sites that justified the extraction. If I cannot name two, delete the function and inline it.

### React 19 / Modern React Patterns

Not directly used in MCM (pure vanilla JS), but foundational for any future React work. Key patterns to internalize:

**`use()` hook (React 19):** Unwraps a Promise or Context inside a component without useEffect. Replaces the common `useEffect + setState + loading flag` triple. The cognitive model: treat async data as synchronous reads, let Suspense handle the waiting state.

**Key pattern for mental model:**
- Old: `useEffect(() => { fetch().then(d => setData(d)); }, [])` with separate `loading` state
- New: `const data = use(fetchPromise)` inside Suspense boundary. Cleaner concern separation.

**`key=` reset technique:** To reset component state on prop change, use `key={userId}`. React unmounts + remounts. No `useEffect` needed to reset. This is Hickey-simple: identity determines state, not mutation.

**Suspense for data fetching:** Suspense boundaries should be placed at the level where the loading state is meaningful to the user. Nest them for progressive disclosure. Do not default to one giant Suspense at the root.

**The practice:** Before reaching for `useEffect`, ask: is this a side effect or a derived state? Derived state belongs in `useMemo` or direct calculation. Side effects (network, DOM, subscriptions) belong in `useEffect`. Most `useEffect` bugs come from treating derived state as a side effect.

### React Hooks Deep Dive

Internalizing the hook model at the level of rendering, not just API surface.

**`useReducer` vs `useState`:** Use `useReducer` when next state depends on previous state OR when multiple related pieces of state change together. The signal: if you find yourself writing `setA(x); setB(y); setC(z)` in one handler, that is a reducer waiting to be extracted. `useState` is for genuinely independent scalar values.

**Custom hook patterns:** A custom hook is just a function that uses other hooks : nothing more. Extract to a custom hook when: (a) the same combination of hooks appears in two components, or (b) the hook body is complex enough that it obscures the component's rendering intent. Never extract "just in case." One real re-use is the minimum.

**Hook naming convention:** Always prefix with `use`. The linter enforces this at runtime to ensure exhaustive deps are checked. Violating the prefix breaks the lint rule and hides stale closures.

**Testing hooks:** Test hooks through the components that use them, not in isolation, unless the hook has no UI surface (e.g., `useLocalStorage`, `useDebounce`). For isolated hook tests, `renderHook()` from `@testing-library/react` is the correct tool : not manual render-to-DOM hacks.

**Stale closure traps:** Every value captured inside a `useEffect` callback is the value from the render when the effect was created. To use the latest value without adding it to deps (when it's a callback), wrap in `useRef`. Pattern: `const callbackRef = useRef(fn); useEffect(() => { callbackRef.current = fn; }); const stableCallback = useCallback(() => callbackRef.current(), []);`

**The exhaustive-deps rule:** Treat it as a contract, not a suggestion. When it flags a dep you want to omit, that is the lint rule telling you the design is wrong : usually a missing `useCallback` or `useMemo` wrapper, or a sign that the effect should be broken apart.

**The practice:** When writing a custom hook, start with the return value : what does the consumer need? Work backwards to the state and effects required to produce it. Never start by listing all the state variables you think you need.

## 25-Task Self-Directed Queue

Tracking full execution in the SQL session database. This section records learning outcomes per task as completed.

| Task | ID | Status | Key Learning |
|------|----|--------|--------------|
| JSON data quality linter | t01 | pending | : |
| KaTeX render smoke test | t02 | pending | : |
| Button/CSS regression test | t03 | pending | : |
| Input validation before submit | t04 | pending | : |
| Review mode in scorecard | t05 | pending | : |
| Local dev server script | t06 | pending | : |
| Question answer explanations P6 | t07 | pending | : |
| W2.b study guide | t08 | pending | : |
| Postmortem: visual regressions Feb 21 | t09 | pending | : |
| GA learning plan: The Bar | t10 | done | See above : Hickey: split concerns; Abramov: earn abstractions |
| Playwright visual baseline | t11 | pending | : |
| Pre-commit hook for JSON validation | t12 | pending | : |
| P8: advanced W2.b drill | t13 | pending | : |
| Dashboard: investigate empty stats bug | t14 | pending | : |
| Publish workflow runbook update | t15 | pending | : |
| Idea doc: Kai progress tracker | t16 | pending | : |
| Idea doc: hint system upgrade | t17 | pending | : |
| Idea doc: exam difficulty scaling | t18 | pending | : |
| Code review: exam.html grading logic | t19 | pending | : |
| Code review: index.html Up Next logic | t20 | pending | : |
| Typography audit: exam.html | t21 | pending | : |
| Mobile UX test: P6 at 375px | t22 | pending | : |
| Share: Kai progress story | t23 | pending | : |
| Schema: add explanation field | t24 | pending | : |
| Answer collision audit: P1-P5 | t25 | pending | : |

## Coaching Protocol (with FA)

Per FA agreement: after each task completion, send FA a message to inbox-FA with:
1. Task ID and objective
2. Files touched (absolute paths)
3. Verification evidence (command output or test result)
4. Risk note: what could regress, how it was checked
5. Next improvement: one concrete refinement

FA replies with: Pass/Fail, what was strong, what to improve.
