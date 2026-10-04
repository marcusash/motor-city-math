# Pre-Calculus Test 1: review and follow-up practice

Reviewed October 3, 2026 by FR and an independent Claude Opus 5.5 instructor.

## Sources and status

- Original seven handwritten Assessment 1 Concept Review pages: the images linked from the Test 1 Study Guide report.
- Authoritative evaluation: `reviews/test-1-study-guide.html`, backed by `reviews/test-1-study-guide-data.js`.
- Instructor-assigned evaluation: **84/100, provisional**, not a teacher grade or timed-test result.
- Latest practice exam: `tests/assessment-1-functions-75min.pdf`, with matching student and key HTML.
- Kai's results on that latest exam were not available when these recommendations were made.

The original work mostly demonstrates correct algebra, polynomial reconstruction, and domain reasoning. Blank graphs mean not demonstrated, not proven conceptual misunderstanding. More useful practice targets are completing graphs, mapping compositions accurately, distinguishing the two resulting graphs, reading intermediate values, and showing a flattened odd-multiplicity crossing.

## Review findings to retain before grading

- The latest exam's Q9 key has an error: its polyline starts at (-5,1) and next reaches (-3,-3), so its first zero is **-4.5**, not -4. The other zeros are 0 and 4. The stored key/PDF has not yet been corrected; use the actual graph when grading.
- Q1's duplicated identical ordered pair is a weak gotcha, not useful advanced practice.
- Q8's rubric asks for elimination reasoning that the question does not explicitly request. Do not penalize missing unrequested prose.
- Graph-based composition is only 10 points and polynomial reconstruction only 7 points, despite being important practice priorities.
- Some polynomial and domain items closely resemble the source examples. Future questions should transfer the skill, not just change numbers.
- Use method/follow-through credit without repeatedly deducting for a propagated error. Record time-related omissions separately.
- Do not change the test Kai is taking. Any later key corrections should be explicit and verified.

## FR proposed practice set

**Six questions, 71 suggested points, approximately 58 minutes.** This is practice, not a replacement 100-point test. Questions 1-5 total 63 points and 51 minutes; Question 6 is optional enrichment. No multiple-choice distractors are required for these constructed-response exercises.

### 1. Piecewise graph scaffold

Difficulty 1; 10 points; 8 minutes. Builds on latest quiz Q5 and unfinished original piecewise work.

Let

$$p(x)=\begin{cases}-(x-1)^2+4 & x<1\\3-x & x\ge1.\end{cases}$$

Use axes from -2 to 4 horizontally and -5 to 6 vertically, one unit per square. Calculate each branch's boundary value at x=1, decide open/closed, and graph each on its permitted side. Label the boundary points. Find p(0), p(1), p(3), domain, and range.

**Solution:** Open (1,4) on the left-hand downward parabola, closed (1,2) on the right-hand decreasing line. Values are 3, 2, 0. Domain is all real numbers; range is $(-\infty,4)$ because the left branch attains every value below 4, and the right branch adds no higher values.

**Rubric:** 2 branch shapes/sides; 2 boundary coordinates/inclusion; 3 evaluations; 1 domain; 2 range/reason. Deduct an inherited endpoint-coordinate error only once. Model this example before independent practice.

### 2. Three-branch piecewise transfer

Difficulty 2; 12 points; 10 minutes. Extends latest Q5 and original guide's blank piecewise graphs.

$$r(x)=\begin{cases}-x-2 & x<-1\\(x+1)^2 & -1\le x<2\\\sqrt{x-2}+1 & x\ge2.\end{cases}$$

Graph on axes x=-4 to 5, y=-3 to 10, one unit per square. Show all four boundary marks. Find r(-2), r(-1), r(2), domain, and range.

**Solution:** Open (-1,-1), closed (-1,0), open (2,9), closed (2,1). Graph a line left, a quadratic segment in the middle, and the radical ray right. Values are 0, 0, 1. Domain is all real numbers; range is $(-1,\infty)$, already supplied by the left line.

**Rubric:** 3 shapes/sides; 4 endpoint marks; 3 evaluations; 1 domain; 1 range. Do not double-deduct copied coordinate errors.

### 3. Both-order composition graphs

Difficulty 3; 14 points; 12 minutes. Extends latest Q4 and original composition drawing.

The connected graph of f has vertices (-3,-2), (-1,1), (1,-1), (3,0), with included endpoints. Let g(x)=2x+1. On **separate** grids with both axes from -4 to 4, graph f(g(x)) and g(f(x)). Label every vertex, connect in order, and state both domains. Say which composition changes horizontal versus vertical coordinates.

**Solution:** For a source point (u,v), f(g(x)) maps to $((u-1)/2,v)$. Its vertices are (-2,-2), (-1,1), (0,-1), (1,0), domain [-2,1]. This is a horizontal compression by 1/2 and a left shift of 1/2.

The other order maps to $(u,2v+1)$, giving (-3,-3), (-1,3), (1,-1), (3,1), domain [-3,3]. This stretches vertically by 2 and shifts up 1. Both fit the supplied grids.

**Rubric:** 2 mapping rules; 4 each vertex set; 2 complete identified graphs; 2 domains and coordinate-change explanation. Credit consistent plotting from an incorrect mapping without repeating the same deduction at every point.

### 4. Read graph values and nested evaluations

Difficulty 2; 13 points; 9 minutes. Extends latest Q9/Q3 and original graph-reading work.

Supply f as connected segments through (-4,2), (-2,-2), (0,2), (2,0), (4,-2), and g through (-4,-2), (-2,2), (0,-2), (2,2), (4,0). Include endpoints. Use axes x=-4 to 4 and y=-3 to 3. List both graphs' x-intercepts and y-intercepts. Show the inner and outer graph reads for g(f(-1)) and f(g(1)).

**Solution:** f zeros are -3, -1, 2; its y-intercept is (0,2). g zeros are -3, -1, 1, 4; its y-intercept is (0,-2). First f(-1)=0, then g(0)=-2. First g(1)=0, then f(0)=2.

**Rubric:** 7 x-intercepts; 2 y-intercepts; 2 per nested evaluation, split between inner and outer read. Award correct outer-read follow-through if the inner value is wrong.

### 5. Recover and sketch a flattened crossing

Difficulty 3; 14 points; 12 minutes. Extends latest Q7-Q8 and the original odd-multiplicity sketch.

A degree-five polynomial has only real zeros -2 and 1. It touches at -2, crosses with horizontal flattening at 1, and passes through (0,-8). Use the least multiplicities consistent with these behaviors. Find a factored equation, make a **qualitative, not-to-scale** sketch labeling zeros, y-intercept, behavior, and ends, and state where it is strictly positive/negative. A sketch frame x=-3 to 3, y=-10 to 10 may be used; large magnitudes leave the frame.

**Solution:** Multiplicities are 2 and 3. Write $p(x)=a(x+2)^2(x-1)^3$. Substitution gives -4a=-8, so a=2. Left end falls; right end rises. Touch (-2,0) from below, flattened crossing (1,0), y-intercept (0,-8). Negative on $(-\infty,-2)$ and $(-2,1)$; positive on $(1,\infty)$.

**Rubric:** 2 multiplicities; 2 factored skeleton; 2 scale; 3 touch/flattened crossing; 1 y-intercept; 1 ends; 3 strict-sign intervals. Do not penalize approximate scale on a qualitative sketch or repeat an earlier scale/sign error.

### 6. Optional interacting-domain extension

Difficulty 3; 8 points; 7 minutes. Extends latest Q2/Q11, preserving a demonstrated strength.

Let $F(u)=\sqrt{u+2}$ and $G(x)=(x+1)/(x-2)$. Simplify F(G(x)), find its domain, show sign analysis, and explain the exclusion of x=2.

**Solution:** $F(G(x))=\sqrt{3(x-1)/(x-2)}$. Require a nonnegative radicand and x not equal to 2. The radicand is positive below 1, zero at 1, negative between 1 and 2, positive above 2. Domain is $(-\infty,1]\cup(2,\infty)$. G is undefined at 2.

**Rubric:** 1 setup; 2 radicand simplification; 2 critical values/sign analysis; 2 domain; 1 inherited exclusion.

## Recommended use

Teach Question 1 aloud: branch, boundary value, inclusion, graph. Have Kai do Question 2 independently, then 3 on separate labeled grids. Questions 4-5 are transfer; 6 is optional. Use fresh parallel items after spaced practice for a later scored check. Keep completion/time evidence distinct from demonstrated conceptual errors.
