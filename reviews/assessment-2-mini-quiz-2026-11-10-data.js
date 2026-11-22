/* FR practice scoring against the original v2.0.3 parent-key rubric.
 * Evidence: four scanned pages plus photographs of printed pages 5 and 6.
 * Text transcription only; private submission images must not be published.
 */
window.assessment2MiniQuizPracticeGrade = {
  status: 'practice-scored',
  title: 'Assessment 2 Mini Quiz (Practice Review)',
  assessedOn: null,
  scannedOn: null,
  reviewedOn: '2026-11-10',
  elapsedMinutes: null,
  source: {
    version: '2.0.3',
    generatedOn: '2026-11-09',
    issue: 'https://github.com/marcusash/motor-city-math/issues/19',
    release: 'https://github.com/marcusash/motor-city-math/releases/tag/kai-assessment-2-quiz-2026-11-09-v2.0.3',
    key: 'https://github.com/marcusash/motor-city-math/releases/download/kai-assessment-2-quiz-2026-11-09-v2.0.3/Kai_Assessment_2_Quiz_2026-11-09_PARENT_KEY.pdf',
    bundle: 'https://github.com/marcusash/motor-city-math/releases/download/kai-assessment-2-quiz-2026-11-09-v2.0.3/Kai_Assessment_2_Quiz_2026-11-09_v2.0.3_BUNDLE.zip',
    bundleSha256: '7754a2d676813c2f69bc0277b4a23276d33613b5a17eaeba2c91f92544841dd2',
    rubricFile: 'build.cjs',
    submittedPages: 6,
    submittedFiles: 3
  },
  sections: [
    { title: 'Slant asymptotes and graph matching', questionIds: ['1', '5'] },
    { title: 'Table discontinuities and domain', questionIds: ['2'] },
    { title: 'Construction and error analysis', questionIds: ['3'] },
    { title: 'Features, sketch and concavity', questionIds: ['4'] }
  ],
  questions: [
    {
      id: '1', pages: [1], earned: 10, points: 20,
      title: 'Negative-slope slant asymptote',
      problem: 'For \\(A(x)=(-2x^2+7x+1)/(x-4)\\), find all horizontal or slant asymptotes with algebra, then describe both ends and explain why the graph approaches the asymptote.',
      answer: 'The long division shows quotient \\(-2x-1\\) and remainder \\(-3\\), both correct. The final slant line reads \\(2x-1\\), losing the leading minus. No separate horizontal-asymptote conclusion is written. Part (b) is visibly blank.',
      solution: [
        'Divide: \\(-2x(x-4)=-2x^2+8x\\), leaving \\(-x+1\\). Then \\(-1(x-4)=-x+4\\), leaving \\(-3\\). Thus \\(A(x)=-2x-1-3/(x-4)\\).',
        'The slant asymptote is \\(y=-2x-1\\); there is no horizontal asymptote. As \\(x\\to-\\infty\\), \\(A(x)\\to+\\infty\\); as \\(x\\to+\\infty\\), \\(A(x)\\to-\\infty\\). The difference from the line is \\(-3/(x-4)\\), which tends to zero at both ends.'
      ],
      components: [
        { rubric: 'Division and both asymptote conclusions', points: 12, earned: 10,
          reason: 'Substantial credit for fully correct division, quotient, remainder and identifying a slant line. Two points withheld within this combined component for the contradictory final slope sign and absent explicit no-horizontal-asymptote conclusion. The original key does not subdivide these 12 points; this is FR partial-credit judgment, not a new official sub-rubric.' },
        { rubric: 'Far-left end direction', points: 3, earned: 0, reason: 'Part (b) is blank; no end direction is supplied.' },
        { rubric: 'Far-right end direction', points: 3, earned: 0, reason: 'Part (b) is blank; no end direction is supplied.' },
        { rubric: 'Remainder term tends to zero', points: 2, earned: 0, reason: 'The remainder is computed, but no explanation that the divided remainder tends to zero is written.' }
      ],
      coaching: 'Carry the quotient into the final line without changing its sign. Then read that negative-slope line: left end up, right end down. Finish with one sentence explaining that the remainder fraction tends to zero.'
    },
    {
      id: '2', pages: [2], earned: 14, points: 20,
      title: 'Read a hole and a vertical asymptote from a table',
      problem: 'The only undefined inputs of \\(H\\) are 1 and 3; one is a hole and one a vertical asymptote. Use the rounded table to identify and explain them, give the interval domain and estimated hole coordinates, and describe each side of the vertical asymptote.',
      answer: 'Identifies the hole at 1 and vertical asymptote at 3. Gives \\((-\\infty,1)\\cup(1,3)\\cup(3,\\infty)\\). Writes that as x increases to 3, y tends to negative infinity, and as x decreases to 3, y tends to positive infinity. No finite-versus-unbounded table explanation or hole coordinates are written.',
      solution: [
        'Near 1, the samples \\(-0.9900\\) and \\(-1.0101\\) support a finite missing height near \\(-1\\), so the estimated hole is \\((1,-1)\\). Near 3, the left samples \\(-39,-399,-3999\\) and right samples \\(4001,401,41\\) suggest unbounded magnitude, so the vertical asymptote is \\(x=3\\).',
        'The stated exclusions give the exact domain \\((-\\infty,1)\\cup(1,3)\\cup(3,\\infty)\\). From the left of 3, \\(H(x)\\to-\\infty\\); from the right, \\(H(x)\\to+\\infty\\). Finite rounded samples support these inferences; they do not prove an exact limit or unique rational rule.'
      ],
      components: [
        { rubric: 'Likely hole location', points: 2, earned: 2, reason: 'Correctly identifies x = 1.' },
        { rubric: 'Likely vertical-asymptote location', points: 2, earned: 2, reason: 'Correctly identifies x = 3.' },
        { rubric: 'Finite-value evidence for hole', points: 2, earned: 0, reason: 'No explanation that nearby outputs remain near a finite height is written.' },
        { rubric: 'Unbounded-value evidence for vertical asymptote', points: 2, earned: 0, reason: 'No explanation of the table pattern or growing magnitudes is written. Part (c) receives its separate direction credit below; naming infinity alone does not supply the requested table-based explanation.' },
        { rubric: 'Interval domain', points: 4, earned: 4, reason: 'All three open intervals and both excluded inputs are correct.' },
        { rubric: 'Estimated hole coordinates', points: 2, earned: 0, reason: 'Coordinates are omitted; the location-only response in part (a) is already credited.' },
        { rubric: 'Left-side behavior with sign', points: 3, earned: 3, reason: '"x increases to 3" conveys approach from the left, with negative infinity correct.' },
        { rubric: 'Right-side behavior with sign', points: 3, earned: 3, reason: '"x decreases to 3" conveys approach from the right, with positive infinity correct.' }
      ],
      coaching: 'Your locations, domain and one-sided directions are correct. Add why: near 1 the outputs stay near -1; near 3 their magnitudes grow. Finish the hole as a coordinate pair.'
    },
    {
      id: '3', pages: [3], earned: 13, points: 20,
      title: 'Check a proposed rule and construct a valid one',
      problem: 'Require only x-intercept \\((-2,0)\\), only vertical asymptote \\(x=1\\), horizontal asymptote \\(y=-3/2\\), and only hole at \\(x=4\\). Check the proposed \\(P(x)=(3x^2-12)/(2x^2-2x)\\), then construct and check one valid factored rule and its hole coordinates.',
      answer: 'Factors P as \\((3x-6)(x+2)/(2x(x-1))\\) and writes "no hole yes asymptote." The first construction is a negative fraction, \\(-3(x+2)(x-4)/(2(x-4)(x-1))\\), which satisfies all four requirements. Later expansion is inconsistent with that correct factored rule. Writes the hole as \\((4,3)\\), not \\((4,-3)\\). No faint or erased alternative is used for scoring.',
      solution: [
        'For P, \\(3(x-2)(x+2)/(2x(x-1))\\) has no canceled factor and its denominator at 4 is 24, so there is no hole at 4. Its horizontal asymptote is \\(y=+3/2\\), not the required \\(-3/2\\). Both requested checks therefore fail.',
        'The submitted first factored construction is valid: \\(G(x)=-3(x+2)(x-4)/(2(x-1)(x-4))\\). Cancel only the common factor to obtain \\(-3(x+2)/(2(x-1))\\), retaining exclusions 1 and 4. This gives the required zero -2, vertical asymptote 1 and horizontal asymptote -3/2.',
        'Use that simplified rule for the missing height: \\(-3(4+2)/(2(4-1))=-18/6=-3\\), so its hole is \\((4,-3)\\). Other valid constructions can have different hole heights; this height is specific to the rule actually submitted. No expansion is needed.'
      ],
      components: [
        { rubric: 'Reject proposed hole with explanation', points: 3, earned: 3, reason: 'The correct factorization has no common factor, supporting the written "no hole." Accept the algebra itself as the explanation; no extra prose is required.' },
        { rubric: 'Reject proposed horizontal asymptote with leading-coefficient reasoning', points: 3, earned: 0, reason: '"Yes asymptote" does not reject the proposed rule for the required negative height. P has a positive leading-coefficient ratio.' },
        { rubric: 'Valid factored construction', points: 6, earned: 6, reason: 'The visible leading minus on the initial factored fraction gives a valid rule. Preserve full construction credit despite the unnecessary, inconsistent later expansion; do not score only the last expression.' },
        { rubric: 'Hole check', points: 2, earned: 1, reason: 'The matching x - 4 factors support a removable discontinuity. Partial credit because no explicit cancellation/exclusion check is completed. The separate wrong height is scored only under coordinates.' },
        { rubric: 'Horizontal-asymptote check', points: 2, earned: 1, reason: 'The written negative numerator and positive denominator leading coefficients support the correct ratio, including in the later expansion. Partial credit because the required -3/2 conclusion/check is not stated.' },
        { rubric: 'Hole coordinates for the chosen rule', points: 4, earned: 2, reason: 'The x-coordinate 4 is correct; the height +3 is not. Award half credit for the correct coordinate and withhold the height credit. No substitution supporting the wrong sign is shown.' }
      ],
      coaching: 'Keep your correct factored construction. Cancel the shared factor, keep x = 4 excluded, and substitute 4 into the simplified rule. Check the horizontal height by dividing signed leading coefficients, not just noticing equal degrees.'
    },
    {
      id: '4', pages: [4, 5], earned: 15.5, points: 20,
      title: 'Features, graph and concavity',
      problem: 'For \\(R(x)=(x^2+x-6)/(x^2-4)\\), find exact intercepts, holes and asymptotes with algebra; sketch and label the graph, and state concavity intervals.',
      answer: 'Correctly factors \\((x+3)(x-2)/((x+2)(x-2))\\), gives vertical asymptote -2, horizontal asymptote 1, hole \\((2,5/4)\\) and x-intercept \\((-3,0)\\). The y-intercept is written \\((0,1)\\). The sketch has the correct broad left/right placement and asymptotes, but the right branch dips near y = 1 and then rises; no clearly identifiable open hole at \\((2,5/4)\\) is visible. Concavity reads down on \\((-\\infty,-2)\\), up on \\((2,\\infty)\\).',
      solution: [
        'Factor and cancel: \\(R(x)=(x+3)(x-2)/((x-2)(x+2))=(x+3)/(x+2)=1+1/(x+2)\\), with x not equal to -2 or 2. Intercepts are \\((-3,0)\\) and \\((0,3/2)\\). The hole is \\((2,5/4)\\), vertical asymptote \\(x=-2\\), horizontal asymptote \\(y=1\\); there is no slant asymptote.',
        'The left branch is below y = 1 and falls toward negative infinity as x approaches -2 from the left. The right branch stays above y = 1 and decreases from positive infinity toward 1; it does not turn upward. Mark an open circle at the missing point \\((2,5/4)\\).',
        'Concave down on \\((-\\infty,-2)\\); concave up on \\((-2,2)\\cup(2,\\infty)\\). The hole splits the domain interval, not the shape of the right branch. No calculus is required.'
      ],
      components: [
        { rubric: 'Factoring/simplification', points: 4, earned: 4, reason: 'Both factorizations and common-factor cancellation are correct; the subsequent correct feature values support the simplification.' },
        { rubric: 'x-intercept', points: 2, earned: 2, reason: 'Correct coordinate (-3,0).' },
        { rubric: 'y-intercept', points: 2, earned: 0, reason: 'Writes (0,1); substitution gives (-6)/(-4) = 3/2, not the horizontal-asymptote height.' },
        { rubric: 'Hole', points: 2, earned: 2, reason: 'Correct coordinate (2,5/4) in part (a), independent of whether it is drawn correctly.' },
        { rubric: 'Vertical asymptote', points: 2, earned: 2, reason: 'Correct x = -2.' },
        { rubric: 'Horizontal asymptote', points: 2, earned: 2, reason: 'Correct y = 1. No extra domain or separate no-slant deduction is added to this rubric.' },
        { rubric: 'Consistent labeled sketch', points: 4, earned: 2, reason: 'Credit the correctly located asymptotes, left branch/x-intercept, and opposite infinite behavior near -2. Withhold the other half for the inconsistent right-branch shape and lack of a clearly located open hole. Do not separately deduct again for the same y-intercept error.' },
        { rubric: 'Concavity', points: 2, earned: 1.5, reason: 'Award 1 for the complete correct down interval and 0.5 for correctly identifying up on (2,infinity). The remaining 0.5 is withheld because (-2,2) is missing. This is FR partial credit within the original 2-point component.' }
      ],
      coaching: 'Use the easy check R(0) = 3/2 before plotting. The right branch must stay above y = 1 and decrease toward it. Put the open hole at x = 2, and include both right-branch intervals when stating concavity.'
    },
    {
      id: '5', pages: [6], earned: 13, points: 20,
      title: 'Linear end behavior versus an even graph',
      problem: 'Compare \\(U(x)=-2x^2/(x^2-16)\\) and \\(V(x)=-2x^3/(x^2-16)\\). For V, justify its exact asymptote and describe both ends. Match the supplied graph using symmetry, intercept behavior and asymptotes; explain why the other function cannot match.',
      answer: 'The standalone slant line appears to read y = 2x; no faint minus is assumed. Below it, both end statements explicitly give V(x) approaching -2x as x approaches positive and negative infinity. No division or remainder algebra is shown. Part (b) selects U because the graph is even, and rules out V because it is odd and has a slant asymptote. There is no intercept-behavior explanation or numerical asymptote comparison.',
      solution: [
        'Divide to obtain \\(V(x)=-2x-32x/(x^2-16)\\). The fraction tends to zero, so the slant asymptote is \\(y=-2x\\), with no horizontal asymptote. Left end: \\(V(x)\\to+\\infty\\). Right end: \\(V(x)\\to-\\infty\\).',
        'U matches: it is even, its double zero makes it touch the origin from above rather than cross, its vertical asymptotes are x = -4 and 4, and its horizontal asymptote is y = -2. V is odd, crosses the origin, and follows a slant line rather than a horizontal line, so it cannot match.'
      ],
      components: [
        { rubric: 'V asymptote with justified algebra', points: 6, earned: 2, reason: 'Credit identifying slant rather than constant end behavior and writing the correct -2x comparison in the end statements. Withhold 4 for absent algebraic justification and the contradictory standalone line. This is partial credit within the original combined component, not a claim that the key prescribed this internal split.' },
        { rubric: 'Far-left end direction', points: 3, earned: 3, reason: 'The explicit -2x comparison at negative infinity conveys positive-infinity behavior. Accept the intended correct negative-slope end behavior despite informal notation.' },
        { rubric: 'Far-right end direction', points: 3, earned: 3, reason: 'The explicit -2x comparison at positive infinity conveys negative-infinity behavior. Do not propagate the standalone sign error into a second deduction.' },
        { rubric: 'Graph match', points: 2, earned: 2, reason: 'Correctly selects U.' },
        { rubric: 'Symmetry justification', points: 2, earned: 2, reason: 'Correctly contrasts even U with odd V. Formal U(-x) notation is not required.' },
        { rubric: 'Intercept-behavior justification', points: 2, earned: 0, reason: 'Does not explain touching at the double zero versus crossing at the odd-multiplicity zero.' },
        { rubric: 'Asymptote justification for graph match', points: 2, earned: 1, reason: 'Correctly uses V having a slant asymptote to exclude it. Partial credit because U is not connected explicitly to the graph horizontal height -2 or its vertical asymptotes.' }
      ],
      coaching: 'Your negative-slope end statements and even/odd comparison are useful. Show the division for the exact line, then add: U touches the origin and approaches y = -2; V crosses the origin and follows y = -2x.'
    }
  ],
  takeaways: [
    'Demonstrated on this submission: correct Q1 long division; Q2 locations, domain and one-sided signs; a valid initial Q3 factored construction; most Q4 algebraic features; and Q5 even/odd graph matching.',
    'Highest-value next step: finish the requested explanations. Q1(b), Q2 evidence/hole height, Q3 checks, and Q5 division/intercept behavior have missing or incomplete written support. Missing writing does not establish inability or a cause.',
    'Check signs and plotted values before finalizing: Q1 final slant sign, Q3 hole height, Q4 y-intercept/right-tail shape, and Q5 conflicting slant line. These are observations from this work, not a diagnosis of a durable misconception.',
    'For a follow-up, explain one negative-slope slant line with a vanishing remainder, one hole height from a canceled rule, and one touch-versus-cross graph comparison. This single practice attempt does not establish retained mastery or a timed performance result.'
  ],
  notes: [
    'FR scored all five questions against the original v2.0.3 parent key and build.cjs rubric: five questions at 20 points each. Every original component weight is retained. The final practice score is 65.5/100 (65.5%); it is not teacher-awarded marks, a letter grade or an official course grade.',
    'The key specifies component maximums, not an exhaustive partial-credit schedule. Fractional and partial awards here are explicit FR judgments based on visible work. No new penalty is added for requirements the original rubric did not score.',
    'All six printed pages are present: PDF pages 1-4, plus photographs of printed pages 5 and 6. The prior missing-page concern is resolved. No duplicate page is counted.',
    'The quiz was generated November 9, 2026. Blank date fields do not establish an assessment date; review date is November 10, 2026 (Pacific). The printed 30-35-minute target is not an observed duration. Assessment date, scan date and elapsed time remain unknown.',
    'Ambiguity handling: use legible algebra rather than guessing faint strokes. The Q3 initial negative factored construction is credited in full even though later expansion is inconsistent. Q5 end statements explicitly contain -2x and receive direction credit; no unseen minus is invented in its standalone line. The photographed Q4 graph has glare; no unidentifiable mark is asserted to be its missing open hole.',
    'Follow-through policy: preserve credit for correct earlier work and mathematically supported later conclusions. Do not repeatedly penalize a single sign error across components or require one unique function/hole height for Q3. The Q4 sketch still has independent shape/hole omissions beyond its already-scored y-intercept error.',
    'This practice review remains separate from the historical teacher Assessment 2 total 26.75/58. Different questions and rubrics do not support interpreting the percentage difference as a measured learning gain.',
    'Release PDFs, source bundle and checksums were retrieved from the personal owning repository; downloaded assets matched release-sha256.txt. The portable source build.cjs and separate parent key agree on the component rubric.',
    'Only task-relevant text transcriptions and scoring explanations are included. No raw scan, handwriting crop, photograph, desktop content or identifying page header is published or linked.'
  ]
};
