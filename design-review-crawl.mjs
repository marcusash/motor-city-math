/**
 * FD Design Review — Automated site crawl
 * Takes full-page screenshots + captures CSS/DOM metadata for every MCM page
 */
import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'fs';

const BASE = 'https://marcusash.github.io/motor-city-math';

const PAGES = [
  { name: 'index', url: `${BASE}/index.html`, desc: 'Home / landing page' },
  { name: 'practice', url: `${BASE}/practice.html`, desc: 'Practice hub' },
  { name: 'exam', url: `${BASE}/exam.html`, desc: 'Exam page (latest)' },
  { name: 'parent', url: `${BASE}/parent.html`, desc: 'Parent dashboard' },
  { name: 'test-builder', url: `${BASE}/test-builder.html`, desc: 'Test builder tool' },
  { name: 'index_calc', url: `${BASE}/index_calc.html`, desc: 'Calculator index' },
  { name: 'linear_functions_test', url: `${BASE}/linear_functions_test.html`, desc: 'Linear functions test' },
  { name: 'nonlinear_functions_test', url: `${BASE}/nonlinear_functions_test.html`, desc: 'Nonlinear functions test' },
  { name: 'nonlinear_exam_mvp', url: `${BASE}/nonlinear_exam_mvp.html`, desc: 'Nonlinear exam MVP' },
  { name: 'exponents_exam', url: `${BASE}/exponents_exam.html`, desc: 'Exponents exam' },
  { name: 'unit2_nonlinear_review', url: `${BASE}/unit2_nonlinear_review.html`, desc: 'Unit 2 nonlinear review' },
  { name: 'final_exam_251123', url: `${BASE}/final_exam_251123.html`, desc: 'Final exam (full)' },
  { name: 'final_exam_251123_mini', url: `${BASE}/final_exam_251123_mini.html`, desc: 'Final exam (mini)' },
  { name: 'quiz_251117', url: `${BASE}/quiz_251117.html`, desc: 'Quiz 11/17' },
  { name: 'quiz_251120', url: `${BASE}/quiz_251120.html`, desc: 'Quiz 11/20' },
  { name: 'quiz_251121', url: `${BASE}/quiz_251121.html`, desc: 'Quiz 11/21' },
  { name: '20260119_Exponents_Unit1', url: `${BASE}/20260119_Exponents_Unit1.html`, desc: 'Exponents Unit 1' },
  { name: '20260119_Exponents_Unit1_2nd', url: `${BASE}/20260119_Exponents_Unit1_2nd.html`, desc: 'Exponents Unit 1 (2nd)' },
  { name: '20260119_Exponents_Unit1_3rd', url: `${BASE}/20260119_Exponents_Unit1_3rd.html`, desc: 'Exponents Unit 1 (3rd)' },
  { name: 'test', url: `${BASE}/test.html`, desc: 'Test page' },
];

const outDir = 'design-review-screenshots';
mkdirSync(outDir, { recursive: true });

async function extractPageMetadata(page) {
  return page.evaluate(() => {
    // Get all unique colors, fonts, spacing
    const allElements = document.querySelectorAll('*');
    const colors = new Set();
    const bgColors = new Set();
    const fonts = new Set();
    const fontSizes = new Set();
    const borderRadii = new Set();
    const issues = [];

    for (const el of allElements) {
      const s = getComputedStyle(el);
      if (s.color && s.color !== 'rgba(0, 0, 0, 0)') colors.add(s.color);
      if (s.backgroundColor && s.backgroundColor !== 'rgba(0, 0, 0, 0)') bgColors.add(s.backgroundColor);
      if (s.fontFamily) fonts.add(s.fontFamily);
      if (s.fontSize) fontSizes.add(s.fontSize);
      if (s.borderRadius && s.borderRadius !== '0px') borderRadii.add(s.borderRadius);
    }

    // Check for hardcoded hex in inline styles
    const inlineHex = [];
    for (const el of allElements) {
      const style = el.getAttribute('style');
      if (style && /#[0-9a-fA-F]{3,8}/.test(style)) {
        inlineHex.push({ tag: el.tagName, style: style.substring(0, 100) });
      }
    }

    // Check for CSS custom properties usage
    const rootStyles = getComputedStyle(document.documentElement);
    const cssVars = {};
    for (const sheet of document.styleSheets) {
      try {
        for (const rule of sheet.cssRules) {
          if (rule.selectorText === ':root' || rule.selectorText === '[data-theme]') {
            for (const prop of rule.style) {
              if (prop.startsWith('--')) {
                cssVars[prop] = rule.style.getPropertyValue(prop).trim();
              }
            }
          }
        }
      } catch (e) { /* cross-origin */ }
    }

    // Accessibility checks
    const images = document.querySelectorAll('img');
    const missingAlt = Array.from(images).filter(i => !i.alt).length;
    const buttons = document.querySelectorAll('button, [role="button"], .btn');
    const links = document.querySelectorAll('a');
    const inputs = document.querySelectorAll('input, select, textarea');
    const headings = Array.from(document.querySelectorAll('h1,h2,h3,h4,h5,h6')).map(h => ({
      level: h.tagName, text: h.textContent.trim().substring(0, 60)
    }));

    // Layout info
    const body = document.body;
    const bodyWidth = body.scrollWidth;
    const bodyHeight = body.scrollHeight;

    return {
      colors: [...colors].slice(0, 20),
      bgColors: [...bgColors].slice(0, 20),
      fonts: [...fonts],
      fontSizes: [...fontSizes].sort(),
      borderRadii: [...borderRadii],
      cssVars,
      inlineHex: inlineHex.slice(0, 10),
      headings,
      counts: {
        elements: allElements.length,
        images: images.length,
        missingAlt,
        buttons: buttons.length,
        links: links.length,
        inputs: inputs.length,
      },
      dimensions: { width: bodyWidth, height: bodyHeight },
      title: document.title,
      metaViewport: document.querySelector('meta[name="viewport"]')?.content || 'MISSING',
    };
  });
}

(async () => {
  const browser = await chromium.launch();
  const results = [];

  // Desktop viewport
  const desktopCtx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  // Mobile viewport
  const mobileCtx = await browser.newContext({ viewport: { width: 375, height: 812 }, isMobile: true });

  for (const pg of PAGES) {
    console.log(`Reviewing: ${pg.name} — ${pg.desc}`);
    const result = { ...pg, desktop: null, mobile: null, metadata: null, errors: [] };

    try {
      // Desktop
      const dPage = await desktopCtx.newPage();
      dPage.on('console', msg => {
        if (msg.type() === 'error') result.errors.push(msg.text());
      });
      const dResp = await dPage.goto(pg.url, { waitUntil: 'networkidle', timeout: 15000 });
      result.httpStatus = dResp?.status();
      await dPage.waitForTimeout(1000);
      await dPage.screenshot({ path: `${outDir}/${pg.name}-desktop.png`, fullPage: true });
      result.metadata = await extractPageMetadata(dPage);
      await dPage.close();

      // Mobile
      const mPage = await mobileCtx.newPage();
      await mPage.goto(pg.url, { waitUntil: 'networkidle', timeout: 15000 });
      await mPage.waitForTimeout(1000);
      await mPage.screenshot({ path: `${outDir}/${pg.name}-mobile.png`, fullPage: true });
      await mPage.close();

      result.desktop = `${pg.name}-desktop.png`;
      result.mobile = `${pg.name}-mobile.png`;
    } catch (e) {
      result.errors.push(e.message);
      console.error(`  ERROR: ${e.message}`);
    }

    results.push(result);
  }

  await browser.close();

  // Write metadata report
  writeFileSync(`${outDir}/crawl-report.json`, JSON.stringify(results, null, 2));

  // Write summary
  let summary = '# MCM Design Review — Crawl Report\n\n';
  summary += `**Date**: ${new Date().toISOString()}\n`;
  summary += `**Pages reviewed**: ${results.length}\n`;
  summary += `**Base URL**: ${BASE}\n\n`;

  for (const r of results) {
    summary += `## ${r.name} — ${r.desc}\n`;
    summary += `- **HTTP**: ${r.httpStatus || 'N/A'}\n`;
    summary += `- **Title**: ${r.metadata?.title || 'N/A'}\n`;
    summary += `- **Viewport meta**: ${r.metadata?.metaViewport || 'N/A'}\n`;
    summary += `- **Dimensions**: ${r.metadata?.dimensions?.width}×${r.metadata?.dimensions?.height}\n`;
    summary += `- **Elements**: ${r.metadata?.counts?.elements || 0}\n`;
    summary += `- **Fonts**: ${r.metadata?.fonts?.join(', ') || 'none'}\n`;
    summary += `- **Font sizes**: ${r.metadata?.fontSizes?.join(', ') || 'none'}\n`;
    summary += `- **CSS vars**: ${Object.keys(r.metadata?.cssVars || {}).length}\n`;
    summary += `- **Inline hex**: ${r.metadata?.inlineHex?.length || 0} instances\n`;
    summary += `- **Headings**: ${r.metadata?.headings?.map(h => `${h.level}: "${h.text}"`).join(' | ') || 'none'}\n`;
    summary += `- **Console errors**: ${r.errors.length}\n`;
    if (r.errors.length > 0) {
      summary += `  - ${r.errors.slice(0, 3).join('\n  - ')}\n`;
    }
    summary += '\n';
  }

  // Cross-page analysis
  const allColors = new Set();
  const allBgColors = new Set();
  const allFonts = new Set();
  const allVars = {};
  let totalInlineHex = 0;
  let totalErrors = 0;

  for (const r of results) {
    if (r.metadata) {
      r.metadata.colors?.forEach(c => allColors.add(c));
      r.metadata.bgColors?.forEach(c => allBgColors.add(c));
      r.metadata.fonts?.forEach(f => allFonts.add(f));
      Object.assign(allVars, r.metadata.cssVars || {});
      totalInlineHex += r.metadata.inlineHex?.length || 0;
    }
    totalErrors += r.errors.length;
  }

  summary += '---\n\n## Cross-Page Analysis\n\n';
  summary += `### Unique Text Colors (${allColors.size})\n`;
  summary += [...allColors].join('\n') + '\n\n';
  summary += `### Unique Background Colors (${allBgColors.size})\n`;
  summary += [...allBgColors].join('\n') + '\n\n';
  summary += `### Fonts Used\n`;
  summary += [...allFonts].join('\n') + '\n\n';
  summary += `### CSS Custom Properties\n`;
  for (const [k, v] of Object.entries(allVars)) {
    summary += `- \`${k}\`: ${v}\n`;
  }
  summary += `\n### Issues\n`;
  summary += `- Total inline hex instances: ${totalInlineHex}\n`;
  summary += `- Total console errors: ${totalErrors}\n`;

  writeFileSync(`${outDir}/crawl-summary.md`, summary);
  console.log(`\nDone! Report: ${outDir}/crawl-summary.md`);
})();
