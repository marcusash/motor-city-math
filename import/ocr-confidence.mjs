// import/ocr-confidence.mjs
// GI: OCR confidence thresholds for the MCM import pipeline
//
// Thresholds:
//   LINE_CONF_MIN  = 85  — flag line if avg confidence < 85%
//   MATH_CONF_MIN  = 80  — flag line if any math-symbol token < 80%
//   ABORT_THRESHOLD = 25 — abort import if > 25% of lines are flagged
//
// Usage:
//   import { analyzeConfidence, shouldAbort } from './ocr-confidence.mjs';
//   const report = analyzeConfidence(tesseractData, pageNum);
//   if (shouldAbort(report)) { process.exit(1); }

const LINE_CONF_MIN = 85;
const MATH_CONF_MIN = 80;
const ABORT_THRESHOLD = 25; // percent

// Patterns that indicate a math token — these need high-confidence OCR
const MATH_TOKEN_PATTERN = /[0-9x\^√+\-*/=()²³½⅓⅔]/;

/**
 * Analyze confidence data from a single Tesseract page result.
 *
 * @param {object} tessData - result.data from Tesseract.recognize()
 * @param {number} pageNum  - 1-based page number (for reporting)
 * @returns {object} confidence report for this page
 */
export function analyzeConfidence(tessData, pageNum) {
  const lines = tessData.lines || [];
  const flagged = [];
  const clean = [];

  for (const line of lines) {
    const lineText = line.text?.trim();
    if (!lineText || lineText.length === 0) continue;

    const lineConf = line.confidence ?? 0;
    const flags = [];

    // Flag 1: line average confidence below threshold
    if (lineConf < LINE_CONF_MIN) {
      flags.push(`line_conf_${Math.round(lineConf)}<${LINE_CONF_MIN}`);
    }

    // Flag 2: any math-token word below MATH_CONF_MIN
    const words = line.words || [];
    for (const word of words) {
      if (MATH_TOKEN_PATTERN.test(word.text) && word.confidence < MATH_CONF_MIN) {
        flags.push(`math_token_conf_${Math.round(word.confidence)}<${MATH_CONF_MIN}:"${word.text}"`);
      }
    }

    const entry = {
      line: lineText,
      confidence: lineConf,
      flagged: flags.length > 0,
      flags,
    };

    if (flags.length > 0) {
      flagged.push(entry);
    } else {
      clean.push(entry);
    }
  }

  const totalLines = flagged.length + clean.length;
  const flaggedPct = totalLines > 0 ? (flagged.length / totalLines) * 100 : 0;

  return {
    page: pageNum,
    total_lines: totalLines,
    flagged_lines: flagged.length,
    clean_lines: clean.length,
    flagged_pct: Math.round(flaggedPct * 10) / 10,
    abort: flaggedPct > ABORT_THRESHOLD,
    lines: [...flagged, ...clean],
  };
}

/**
 * Aggregate confidence reports across all pages and decide whether to abort.
 *
 * @param {object[]} reports - array of page reports from analyzeConfidence()
 * @returns {object} summary with overall abort decision
 */
export function buildConfidenceSummary(reports) {
  const totalLines = reports.reduce((s, r) => s + r.total_lines, 0);
  const totalFlagged = reports.reduce((s, r) => s + r.flagged_lines, 0);
  const overallPct = totalLines > 0 ? (totalFlagged / totalLines) * 100 : 0;
  const abort = overallPct > ABORT_THRESHOLD;

  return {
    generated_at: new Date().toISOString(),
    thresholds: {
      line_conf_min: LINE_CONF_MIN,
      math_conf_min: MATH_CONF_MIN,
      abort_threshold_pct: ABORT_THRESHOLD,
    },
    total_lines: totalLines,
    total_flagged: totalFlagged,
    flagged_pct: Math.round(overallPct * 10) / 10,
    abort,
    abort_reason: abort
      ? `${Math.round(overallPct)}% of lines flagged (threshold: ${ABORT_THRESHOLD}%)`
      : null,
    pages: reports,
  };
}

/**
 * Returns true if the import should be aborted based on confidence report.
 * Logs a clear reason to stderr.
 *
 * @param {object} summary - output of buildConfidenceSummary()
 * @returns {boolean}
 */
export function shouldAbort(summary) {
  if (summary.abort) {
    console.error(`\n⛔ OCR CONFIDENCE ABORT: ${summary.abort_reason}`);
    console.error(`   Flagged pages:`);
    for (const page of summary.pages) {
      if (page.abort) {
        console.error(`   Page ${page.page}: ${page.flagged_pct}% flagged (${page.flagged_lines}/${page.total_lines} lines)`);
      }
    }
    console.error(`   Re-scan at higher DPI or fix lighting before re-importing.\n`);
    return true;
  }
  return false;
}

export const THRESHOLDS = { LINE_CONF_MIN, MATH_CONF_MIN, ABORT_THRESHOLD };
