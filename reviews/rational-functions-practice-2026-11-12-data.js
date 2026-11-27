window.practiceGradeReport = {
  "title": "Rational Functions Full Practice",
  "reviewedOn": "2026-11-12",
  "assessedOn": null,
  "scannedOn": null,
  "elapsedMinutes": null,
  "earned": 54,
  "points": 58,
  "href": "reviews/rational-functions-practice-2026-11-12.html",
  "pdf": "rational-functions-practice-2026-11-12.pdf",
  "chartLabel": "Rational",
  "provenance": "Original Revision 2 practice rubric, with the original fractional-credit awards preserved.",
  "notes": [
    "All 13 questions and all 11 printed submission pages were reviewed. This publication contains text only; no submission images are included.",
    "The original rubric weights and partial-credit conventions are unchanged. This is practice scoring, not a school grade or a measured mastery gain.",
    "Q4: 7/8; Q5: 8.5/10; Q11: 0.5/2. All other questions received full credit.",
    "The 60-minute target is an exam allowance, not observed elapsed time. Completion date, scan date, timing and assistance are undocumented.",
    "The review is dated November 12, 2026 (Pacific)."
  ],
  "sources": [
    {
      "label": "Original grading and partial-credit record",
      "url": "https://github.com/marcusash/motor-city-math/issues/29#issuecomment-6841482710"
    },
    {
      "label": "Original Revision 2 exam rubric",
      "url": "https://github.com/marcusash/motor-city-math/blob/1af0b7ef39c86dfb0d6db6f2b9c345070c68fd6a/print/assessment-2-practice-2026-11-11/exam.json"
    }
  ],
  "questions": [
    {
      "id": 1,
      "title": "Reciprocal graph and both ends",
      "points": 8,
      "answer": "Dashed lines at x = -1 and y = 3; labeled points (0,1) and (1,2), with both intended branches drawn. Left end approaches 3 from above; right end approaches 3 from below.",
      "solution": "For f(x) = 3 - 2/(x+1), the denominator is zero at -1. The reciprocal term tends to zero at either end. Example points are (-3,4), (0,1) and (1,2). Left of -1 the branch lies above 3; right of -1 it lies below 3. Both end limits equal 3.",
      "components": [
        {
          "points": 4,
          "earned": 4,
          "reason": "Graph: correct asymptotes 1, two correct labeled points 1, consistent branches 2. Accept the freehand branch intent; no precision/tail-waviness deduction."
        },
        {
          "points": 2,
          "earned": 2,
          "reason": "Far-left limit 3, with the approach from above correctly indicated."
        },
        {
          "points": 2,
          "earned": 2,
          "reason": "Far-right limit 3, with the approach from below correctly indicated."
        }
      ],
      "result": "Correct graph features and both end statements.",
      "earned": 8
    },
    {
      "id": 2,
      "title": "Rational subtraction",
      "points": 4,
      "answer": "Factors x^2 - 4, uses the common denominator, simplifies the numerator to x - 5, and excludes -2 and 2. The clearer stacked fraction in the algebra establishes the intended denominator.",
      "solution": "3/(x+2) - (2x-1)/(x^2-4) = [3(x-2) - (2x-1)]/[(x-2)(x+2)] = (x-5)/[(x-2)(x+2)]. Retain x not equal to -2 or 2.",
      "components": [
        {
          "points": 1,
          "earned": 1,
          "reason": "Valid common denominator."
        },
        {
          "points": 2,
          "earned": 2,
          "reason": "Correct subtraction and simplified numerator."
        },
        {
          "points": 1,
          "earned": 1,
          "reason": "Both original excluded inputs."
        }
      ],
      "result": "Correct work, final fraction and exclusions.",
      "earned": 4
    },
    {
      "id": 3,
      "title": "Rational multiplication",
      "points": 4,
      "answer": "Correctly factors, cancels to 1/(x-3), and preserves exclusions 5, -5, 3 and -3.",
      "solution": "The product factors as [(x-5)(x+3)/((x-5)(x+5))] times [(x+5)/((x-3)(x+3))]. Cancellation leaves 1/(x-3). Original denominator zeros -5, -3, 3 and 5 remain excluded even when their factors cancel.",
      "components": [
        {
          "points": 1,
          "earned": 1,
          "reason": "Correct factorizations."
        },
        {
          "points": 2,
          "earned": 2,
          "reason": "Valid cancellation and final expression."
        },
        {
          "points": 1,
          "earned": 1,
          "reason": "All four original exclusions."
        }
      ],
      "result": "Correct simplification and all original restrictions.",
      "earned": 4
    },
    {
      "id": 4,
      "title": "Graph intervals, extrema and asymptotes",
      "points": 8,
      "answer": "Increasing (-3,-1) union (-1,1); relative maximum (1,-3), minimum (-3,5); concave up (-infinity,0), down (0,infinity); VA x = -1, no HA, slant y = -x.",
      "solution": "Increasing: (-3,-1) union (-1,0) union (0,1). Relative minimum (-3,5), maximum (1,-3). Concave up: (-infinity,-1). Concave down: (-1,0) union (0,infinity). The asymptotes are x = -1 and y = -x; no horizontal asymptote exists. A hole at zero is an excluded input, not an extremum.",
      "components": [
        {
          "points": 1,
          "earned": 0.75,
          "reason": "Increasing intervals: full 0.5 for (-3,-1); 0.25 of the remaining 0.5 for correct right-branch direction and outer boundaries, but the hole at zero is not excluded."
        },
        {
          "points": 2,
          "earned": 2,
          "reason": "Both relative extrema, types and coordinates are correct."
        },
        {
          "points": 2,
          "earned": 1.25,
          "reason": "Concavity: 0.5/1 for the up interval's correct far-left direction but incorrect cutoff 0 instead of -1; 0.75/1 for the correct down interval (0,infinity), with (-1,0) omitted. This is a partial award for coverage; the missing-hole split already scored in increasing is not deducted again."
        },
        {
          "points": 3,
          "earned": 3,
          "reason": "Correct vertical line, slant line and no-horizontal conclusion, one point each."
        }
      ],
      "result": "Correct extrema/asymptotes; interval boundaries need correction.",
      "earned": 7
    },
    {
      "id": 5,
      "title": "Features and completed graph",
      "points": 10,
      "answer": "Correct factors 2(x+1)(x+2)/[(x-2)(x+1)], intercepts (-2,0), (0,-2), and hole (-1,-2/3). The vertical entry says y = 2 and the horizontal entry x = 2. The separately supplied graph correctly places VA x = 2 and HA y = 2, both branches and intercepts; no open circle is identifiable at the hole.",
      "solution": "Cancel x+1 to obtain R(x) = 2(x+2)/(x-2) = 2 + 8/(x-2), retaining original exclusions -1 and 2. The intercepts are (-2,0) and (0,-2). Substitution into the simplified rule at -1 gives -2/3, so mark the open hole at (-1,-2/3). VA: x = 2; HA: y = 2. The left branch stays below 2 and falls toward negative infinity near x = 2; the right stays above 2 and decreases toward 2.",
      "components": [
        {
          "points": 2,
          "earned": 2,
          "reason": "Factoring and valid simplification, supported by correct subsequent features."
        },
        {
          "points": 2,
          "earned": 2,
          "reason": "Both intercepts, one point each."
        },
        {
          "points": 2,
          "earned": 2,
          "reason": "Correct hole location and height in the written answer."
        },
        {
          "points": 2,
          "earned": 1,
          "reason": "Half-credit for each asymptote: numerical locations and plotted lines are correct, but both written equation variables are swapped."
        },
        {
          "points": 2,
          "earned": 1.5,
          "reason": "Correct branch placement and intercepts/asymptotes. Withhold 0.5 for the missing drawn open hole. Do not deduct again for the already-scored swapped equation labels."
        }
      ],
      "result": "Mostly correct; swap x/y back in asymptote equations and draw the hole.",
      "earned": 8.5
    },
    {
      "id": 6,
      "title": "Slant asymptote and end behavior",
      "points": 4,
      "answer": "Long division gives -x/2 - 1 with remainder 1; states no horizontal asymptote and y = -x/2 - 1 as the slant. Both positive- and negative-infinity x statements compare y with the correct line, but are in the opposite labeled boxes. Writes 1/(2x-4) = 0 in the explanation under the end statements.",
      "solution": "S(x) = -x/2 - 1 + 1/(2x-4). The slant is y = -x/2 - 1; there is no horizontal asymptote. As x goes to negative infinity, S goes to positive infinity; as x goes to positive infinity, S goes to negative infinity. The remainder fraction tends to zero; it is not equal to zero at a finite allowed input.",
      "components": [
        {
          "points": 1.5,
          "earned": 1.5,
          "reason": "Correct division and remainder."
        },
        {
          "points": 1,
          "earned": 1,
          "reason": "Correct slant line and absence of a horizontal asymptote."
        },
        {
          "points": 0.5,
          "earned": 0.5,
          "reason": "The negative-infinity x comparison with the correct line conveys the far-left direction, although written in the right-hand box."
        },
        {
          "points": 0.5,
          "earned": 0.5,
          "reason": "The positive-infinity x comparison with the correct line conveys the far-right direction, although written in the left-hand box."
        },
        {
          "points": 0.5,
          "earned": 0.5,
          "reason": "Accept the zero-remainder-fraction statement in its infinity context as the intended limiting explanation, consistent with earlier informal-notation credit."
        }
      ],
      "result": "Full mathematical credit; fix box placement and use 'tends to zero.'",
      "earned": 4
    },
    {
      "id": 7,
      "title": "Average-cost model",
      "points": 4,
      "answer": "$12 per kit; approaches from above because the fraction is positive; 60/(n+10) is not zero.",
      "solution": "C(n) = 12 + 60/(n+10). For every finite nonnegative n, the correction is positive, so the average remains above $12 per kit. The correction tends to zero as production increases; the average approaches but never reaches $12 at finite n.",
      "components": [
        {
          "points": 1,
          "earned": 1,
          "reason": "Correct limit 12."
        },
        {
          "points": 1,
          "earned": 1,
          "reason": "Correct dollars-per-kit interpretation."
        },
        {
          "points": 1,
          "earned": 1,
          "reason": "Correct approach from above and positive-fraction explanation."
        },
        {
          "points": 1,
          "earned": 1,
          "reason": "Valid nonattainment justification: 60/(n+10) is nonzero for finite allowed n."
        }
      ],
      "result": "Correct interpretation, approach and justification.",
      "earned": 4
    },
    {
      "id": 8,
      "title": "Construct a rational function",
      "points": 4,
      "answer": "Writes 3(x+4)(x-2)/[2(x+1)(x-2)]. The verification box is blank, but the rule has every required feature. Calculates the hole height 3(6)/[2(3)] = 3 and gives (2,3).",
      "solution": "The remaining numerator zero is -4. The remaining denominator zero is -1. Equal numerator/denominator degree gives leading ratio 3/2. The sole common real factor x-2 creates the hole at 2; evaluating the reduced rule there gives 18/6 = 3. Keep -1 and 2 excluded.",
      "components": [
        {
          "points": 1,
          "earned": 1,
          "reason": "Only x-intercept -4, supported by the correct factored rule."
        },
        {
          "points": 1,
          "earned": 1,
          "reason": "Only vertical asymptote -1, supported by the rule."
        },
        {
          "points": 1,
          "earned": 1,
          "reason": "Correct horizontal height 3/2, supported by the rule."
        },
        {
          "points": 1,
          "earned": 1,
          "reason": "Only hole at 2 and the shown correct height calculation, 0.5 each."
        }
      ],
      "result": "Correct construction and hole calculation; no extra unweighted prose penalty.",
      "earned": 4
    },
    {
      "id": 9,
      "title": "Degree relationship from a graph",
      "points": 2,
      "answer": "Selects D and explains that a horizontal asymptote y = 0 requires denominator degree greater than numerator degree.",
      "solution": "D is correct. The nonzero rational graph approaches the x-axis at both ends, so the numerator degree is smaller than the denominator degree. The graph alone does not determine one exact pair of degrees.",
      "components": [
        {
          "points": 1,
          "earned": 1,
          "reason": "Correct choice D."
        },
        {
          "points": 1,
          "earned": 1,
          "reason": "Correct zero-horizontal-height/degree explanation."
        }
      ],
      "result": "Correct choice and reasoning.",
      "earned": 2
    },
    {
      "id": 10,
      "title": "Match the crossing rational graph",
      "points": 2,
      "answer": "Selects B; cites passing through (0,0) and vertical asymptotes at x = +/-2.",
      "solution": "B, y = -3x/(x^2-4), crosses the origin and has vertical asymptotes at -2 and 2, matching the graph. The key permits origin behavior plus one other relevant feature; it does not require ruling out every distractor.",
      "components": [
        {
          "points": 1,
          "earned": 1,
          "reason": "Correct choice B."
        },
        {
          "points": 0.5,
          "earned": 0.5,
          "reason": "Correct behavior at the origin: passes through (0,0), accepted as the described crossing."
        },
        {
          "points": 0.5,
          "earned": 0.5,
          "reason": "Another correct relevant feature: vertical asymptotes at +/-2."
        }
      ],
      "result": "Correct choice and the two required supporting features.",
      "earned": 2
    },
    {
      "id": 11,
      "title": "Match the entire graph, including the hole",
      "points": 2,
      "answer": "Selects C. Correctly identifies a hole at x = 0 and explains the shared x cancellation, but says only C has the common factor.",
      "solution": "A is correct: -x(x-1)(x-4)/[2x(x+2)]. Its reduced rule is -(x-1)(x-4)/[2(x+2)], retaining x = 0 as excluded, so the hole is (0,-1). It has VA x = -2 and zeros 1 and 4. B fills the hole, C places the VA at +2 and the hole at (0,+1), and D reverses the graph vertically. A, C and D all have a shared x factor; a hole alone does not distinguish them.",
      "components": [
        {
          "points": 1,
          "earned": 0,
          "reason": "Choice C is incorrect; the matching choice is A."
        },
        {
          "points": 1,
          "earned": 0.5,
          "reason": "Partial explanation credit for correctly identifying the hole at zero and cancellation mechanism. The explanation does not correctly distinguish A from B and falsely claims only C has the common factor."
        }
      ],
      "result": "Wrong choice; retain partial credit for recognizing the hole mechanism.",
      "earned": 0.5
    },
    {
      "id": 12,
      "title": "Degree-dependent end behavior",
      "points": 2,
      "answer": "Selects C, m = 5; says f has both ends down, while g then has odd-degree end behavior with opposite ends.",
      "solution": "For m = 5, g has leading behavior 3x^3 and opposite ends, unlike f's negative even leading term. For m = 1 or 3, g behaves as -8x^2; for m = 4 it behaves as -5x^2. Those other choices have both ends down.",
      "components": [
        {
          "points": 1,
          "earned": 1,
          "reason": "Correct choice C."
        },
        {
          "points": 1,
          "earned": 1,
          "reason": "Correct parity/end-direction reasoning."
        }
      ],
      "result": "Correct choice and explanation.",
      "earned": 2
    },
    {
      "id": 13,
      "title": "Table evidence for a hole and vertical asymptote",
      "points": 4,
      "answer": "Hole at x = 3 because values approach 4 from both sides and stay finite. VA x = 1 because values become extremely large in magnitude.",
      "solution": "Near 3, finite outputs approach a height near 4, supporting a hole. Near 1, magnitudes grow sharply with opposite signs on the two sides, supporting a vertical asymptote. Under the question's stated assumptions these are the requested likely classifications, not a proof from a finite rounded table.",
      "components": [
        {
          "points": 1,
          "earned": 1,
          "reason": "Correct hole location 3."
        },
        {
          "points": 1,
          "earned": 1,
          "reason": "Correct finite-height evidence."
        },
        {
          "points": 1,
          "earned": 1,
          "reason": "Correct vertical-asymptote location 1."
        },
        {
          "points": 1,
          "earned": 1,
          "reason": "Correct growing-magnitude evidence."
        }
      ],
      "result": "Both locations and both evidence statements are correct.",
      "earned": 4
    }
  ]
};
(window.practiceGradeReports = window.practiceGradeReports || []).push(window.practiceGradeReport);
