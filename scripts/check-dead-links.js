#!/usr/bin/env node
/**
 * check-dead-links.js
 *
 * Crawls all three public GitHub Pages sites and checks for broken links and assets.
 *
 * Sites covered:
 *   - https://marcusash.github.io/              (Forge/matrix canvases — FA + FD work)
 *   - https://marcusash.github.io/motor-city-math/      (MCM — Kai algebra)
 *   - https://marcusash.github.io/motor-city-chemistry/ (MCC — Kai chemistry)
 *
 * Checks:
 *   - Every HTML page returns HTTP 200
 *   - Every href and src reference within pages returns HTTP 200
 *   - External CDN assets (KaTeX, Google Fonts, etc.) return 200
 *
 * Usage:
 *   node scripts/check-dead-links.js
 *   node scripts/check-dead-links.js --verbose
 *   node scripts/check-dead-links.js --site matrix   (matrix only)
 *   node scripts/check-dead-links.js --site mcm      (MCM only)
 *   node scripts/check-dead-links.js --site mcc      (MCC only)
 *
 * Exit code 0 = all OK, 1 = broken links found
 */

'use strict';

const https = require('https');
const http = require('http');
const { URL } = require('url');

const VERBOSE = process.argv.includes('--verbose');
const SITE_FILTER = (() => {
  const idx = process.argv.indexOf('--site');
  return idx !== -1 ? process.argv[idx + 1] : null;
})();

// ── Site definitions ──────────────────────────────────────────────────────────

const MATRIX_PAGES = [
  'agent-color-options.html', 'agent-colors-locked.html', 'agent-dashboard.html',
  'agent-tab-colors-brand.html', 'ai-maker-test-plan.html', 'canvas-audit-remaining.html',
  'canvas-feedback-demo.html', 'ci-explainer.html', 'deck-feedback-20260223.html',
  'deck-variants.html', 'dispatch.html', 'fd-agent-performance.html', 'fd-changelog.html',
  'fd-competitive-analysis.html', 'fd-dashboard-reference.html', 'fd-dispatch-journey.html',
  'fd-dispatch-screens.html', 'fd-eval-rubric.html', 'fd-facilitation-skill.html',
  'fd-forge-culture.html', 'fd-forge-vs-competition.html', 'fd-grind-section.html',
  'fd-inkwell-onboarding.html', 'fd-inkwell-screens.html', 'fd-inkwell-v2.html',
  'fd-interaction-design-reference.html', 'fd-mcm-chemistry.html', 'fd-mcm-journey.html',
  'fd-portfolio.html', 'fd-presentation-template.html', 'fd-queue.html',
  'fd-readme-header.html', 'fd-social-strategy.html', 'fd-sprint-complete.html',
  'fd-sprint-scorecard-v3.html', 'fd-strategic-options.html', 'fd-tui-email-design.html',
  'fd-typography-poster.html', 'fd-web-github-pages-mockup.html', 'forge-brand-showcase.html',
  'forge-culture-deck.html', 'forge-deck-v3.html', 'forge-deck-v4.html',
  'forge-deck-v5-talk.html', 'forge-deck-v5.html', 'forge-org-story.html',
  'forge-way-comms-v2.html', 'forge-way-comms.html', 'fp-color-decision.html',
  'greg-email-canvas.html', 'greg-email-dispatch.html', 'greg-feedback-session.html',
  'greg-session-facilitation-guide.html', 'greg-session-preread.html', 'greg-synthesis.html',
  'grind-mark-variants.html', 'icon-iteration-deck.html', 'index.html',
  'inkwell-apps-mockup.html', 'inkwell-tui-prototype.html', 'logo-brief.html',
  'memory-inventory.html', 'quote-eval.html', 'sprint4-planning.html',
  'terminal-color-mockup.html', 'tui-canvas-exploration.html', 'voice-to-message-mockup.html',
].map(p => 'https://marcusash.github.io/' + p);

const RED_PILL_PAGES = [
  'index.html',
  'matrix-setup-guide.html',
  'docs/user-guide.html',
].map(p => 'https://marcusash.github.io/gh-copilot-setup/' + p);

const BLUE_PILL_PAGES = [
  'index.html',
  'matrix-install-guide.html',
  'docs/user-guide.html',
].map(p => 'https://marcusash.github.io/ai-maker/' + p);

const MCM_PAGES = [
  'index.html', 'exam.html', 'chart-variants.html', 'dad.html',
  'final_exam_251123.html', 'final_exam_251123_mini.html', 'final_practice_w2w3.html',
  'guest.html', 'mockup-ab.html', 'mockup.html', 'nonlinear_exam_mvp.html',
  'retake-practice-12.html', 'retake-practice-13.html', 'scorecard-2.html', 'scorecard.html',
].map(p => 'https://marcusash.github.io/motor-city-math/' + p);

const MCC_PAGES = [
  'index.html',
  'artifacts/chem-42-practice-test.html', 'artifacts/chem-42-practice-test-2.html',
  'artifacts/chem-42-answer-key.html', 'artifacts/chem-42-answer-key-2.html',
  'artifacts/kai-chem-grade-report.html', 'artifacts/kai-practice-test-grade-report.html',
].map(p => 'https://marcusash.github.io/motor-city-chemistry/' + p);

const SITES = {
  matrix:   { name: 'Matrix (marcusash.github.io)', pages: MATRIX_PAGES,    base: 'https://marcusash.github.io' },
  redpill:  { name: 'Red Pill (gh-copilot-setup)',  pages: RED_PILL_PAGES,  base: 'https://marcusash.github.io/gh-copilot-setup' },
  bluepill: { name: 'Blue Pill (ai-maker)',          pages: BLUE_PILL_PAGES, base: 'https://marcusash.github.io/ai-maker' },
  mcm:      { name: 'Motor City Math',               pages: MCM_PAGES,       base: 'https://marcusash.github.io/motor-city-math' },
  mcc:      { name: 'Motor City Chemistry',          pages: MCC_PAGES,       base: 'https://marcusash.github.io/motor-city-chemistry' },
};

const ACTIVE_SITES = SITE_FILTER
  ? [SITES[SITE_FILTER]].filter(Boolean)
  : Object.values(SITES);

if (SITE_FILTER && !SITES[SITE_FILTER]) {
  console.error(`Unknown site: ${SITE_FILTER}. Use: matrix | mcm | mcc`);
  process.exit(1);
}

// ── HTTP helper ───────────────────────────────────────────────────────────────

const checked = new Map(); // url -> {status, cached}

function fetchStatus(url, timeout = 10000) {
  if (checked.has(url)) return Promise.resolve(checked.get(url));

  return new Promise(resolve => {
    const mod = url.startsWith('https') ? https : http;
    let done = false;

    const req = mod.get(url, { timeout, headers: { 'User-Agent': 'forge-link-checker/1.0' } }, res => {
      if (done) return;
      done = true;
      const result = { url, status: res.statusCode, ok: res.statusCode >= 200 && res.statusCode < 400 };
      checked.set(url, result);
      resolve(result);
      res.resume();
    });

    req.on('error', e => {
      if (done) return;
      done = true;
      const result = { url, status: 'ERR', ok: false, error: e.message };
      checked.set(url, result);
      resolve(result);
    });

    req.on('timeout', () => {
      if (done) return;
      done = true;
      req.destroy();
      const result = { url, status: 'TIMEOUT', ok: false };
      checked.set(url, result);
      resolve(result);
    });
  });
}

function fetchBody(url, timeout = 15000) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http;
    let data = '';
    const req = mod.get(url, { timeout, headers: { 'User-Agent': 'forge-link-checker/1.0' } }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const redirectUrl = res.headers.location.startsWith('http')
          ? res.headers.location
          : new URL(res.headers.location, url).href;
        return fetchBody(redirectUrl, timeout).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        res.resume();
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      res.setEncoding('utf8');
      res.on('data', d => { data += d; });
      res.on('end', () => resolve(data));
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
  });
}

// ── Link extractor ────────────────────────────────────────────────────────────

function extractLinks(html, pageUrl) {
  const links = new Set();
  const base = new URL(pageUrl);

  // Match href and src attributes
  const patterns = [
    /href=["']([^"'#?][^"']*?)["']/gi,
    /src=["']([^"'#?][^"']*?)["']/gi,
  ];

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(html)) !== null) {
      const raw = match[1].trim();
      if (!raw || raw.startsWith('data:') || raw.startsWith('javascript:') || raw.startsWith('mailto:')) continue;

      try {
        const resolved = new URL(raw, base).href;
        // Skip anchor-only links
        if (resolved === pageUrl) continue;
        links.add(resolved);
      } catch {
        // skip malformed URLs
      }
    }
  }

  return [...links];
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function checkSite(site) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Site: ${site.name}`);
  console.log('='.repeat(60));

  const broken = [];
  let totalChecked = 0;

  // Step 1: check all pages exist
  console.log(`\nChecking ${site.pages.length} pages...`);
  const pageResults = await Promise.all(site.pages.map(url => fetchStatus(url)));
  for (const r of pageResults) {
    totalChecked++;
    if (!r.ok) {
      broken.push({ page: r.url, link: r.url, type: 'PAGE', status: r.status });
      console.log(`  BROKEN (${r.status}) ${r.url}`);
    } else if (VERBOSE) {
      console.log(`  OK     (${r.status}) ${r.url}`);
    }
  }

  // Step 2: fetch HTML and extract links
  console.log(`\nCrawling links in pages...`);
  const linkCheckQueue = []; // {pageUrl, linkUrl}

  for (const page of site.pages) {
    if (VERBOSE) process.stdout.write(`  Crawling ${page.split('/').pop()}... `);
    let html;
    try {
      html = await fetchBody(page);
    } catch (e) {
      if (VERBOSE) console.log(`SKIP (${e.message})`);
      continue;
    }

    const links = extractLinks(html, page);
    if (VERBOSE) console.log(`${links.length} links`);

    for (const link of links) {
      linkCheckQueue.push({ page, link });
    }
  }

  // Step 3: deduplicate and check all extracted links
  const uniqueLinks = [...new Set(linkCheckQueue.map(x => x.link))];
  console.log(`\nChecking ${uniqueLinks.length} unique linked resources...`);

  // Check in batches of 20 to avoid overwhelming the server
  const BATCH = 20;
  for (let i = 0; i < uniqueLinks.length; i += BATCH) {
    const batch = uniqueLinks.slice(i, i + BATCH);
    const results = await Promise.all(batch.map(url => fetchStatus(url)));
    for (const r of results) {
      totalChecked++;
      if (!r.ok) {
        // Find which pages reference this broken link
        const refPages = linkCheckQueue.filter(x => x.link === r.url).map(x => x.page);
        broken.push({ link: r.url, pages: refPages, type: 'LINK', status: r.status });
        const ref = refPages[0] ? refPages[0].split('/').pop() : '?';
        console.log(`  BROKEN (${r.status}) ${r.url}`);
        console.log(`    referenced from: ${ref}`);
      } else if (VERBOSE) {
        console.log(`  OK     (${r.status}) ${r.url}`);
      }
    }
  }

  return { site: site.name, broken, totalChecked };
}

async function main() {
  console.log('Forge Site Health — Dead Link Checker');
  console.log('Sites:', ACTIVE_SITES.map(s => s.name).join(', '));
  const startMs = Date.now();

  const allResults = [];
  for (const site of ACTIVE_SITES) {
    const result = await checkSite(site);
    allResults.push(result);
  }

  const elapsed = ((Date.now() - startMs) / 1000).toFixed(1);

  console.log(`\n${'='.repeat(60)}`);
  console.log('SUMMARY');
  console.log('='.repeat(60));

  let totalBroken = 0;
  for (const r of allResults) {
    const status = r.broken.length === 0 ? 'PASS' : `FAIL (${r.broken.length} broken)`;
    console.log(`  ${status.padEnd(20)} ${r.site}  (${r.totalChecked} checks)`);
    totalBroken += r.broken.length;
  }

  console.log(`\nCompleted in ${elapsed}s. ${totalBroken === 0 ? 'All links OK.' : `${totalBroken} broken link(s) found.`}`);

  if (totalBroken > 0) {
    console.log('\nBROKEN LINKS:');
    for (const r of allResults) {
      for (const b of r.broken) {
        console.log(`  [${b.status}] ${b.link}`);
        if (b.pages) {
          for (const p of b.pages.slice(0, 3)) {
            console.log(`    in: ${p}`);
          }
        }
      }
    }
    process.exit(1);
  }
}

main().catch(e => { console.error(e); process.exit(1); });
