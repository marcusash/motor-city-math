/**
 * Motor City Math — "Association" Light Theme Mockups
 * Generates PNG design mockups for Marcus's review.
 *
 * Inspired by Detroit Pistons Association (white away) jersey:
 * Clean white base, navy wordmark, red accents, red-blue-red side stripe.
 */
const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname);

// === DESIGN TOKENS ===
const T = {
  // Backgrounds
  bgPage:      '#F4F5F9',
  bgCard:      '#FFFFFF',
  bgInput:     '#F8F9FC',

  // Text
  textPrimary: '#1A1F36',
  textSecondary:'#5E6378',
  textInverse: '#FFFFFF',

  // Pistons palette
  red:         '#C8102E',
  redHover:    '#A00D24',
  blue:        '#1D42BA',
  blueHover:   '#1535A0',
  navy:        '#002D62',
  chrome:      '#BEC0C2',

  // Borders
  borderDefault:'#C8CCD8',
  borderSubtle: '#E2E5EF',
  borderFocus:  '#1D42BA',

  // Semantic
  correct:     '#1B7D3A',
  correctBg:   '#F0FFF4',
  incorrect:   '#C8102E',
  incorrectBg: '#FFF5F5',
  warning:     '#E8A317',

  // Shadows
  shadowCard:  'rgba(0,45,98,0.06)',

  // Graph
  gridLine:    '#D8DCE6',
  gridMinor:   '#EDF0F5',

  // Highlight
  highlight:   '#EEF1FA',
};

// === HELPERS ===
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

function drawStripe(ctx, x, y, w, h) {
  // Red-blue-red stripe (like jersey side panel)
  ctx.fillStyle = T.red;
  ctx.fillRect(x, y, w * 0.35, h);
  ctx.fillStyle = T.blue;
  ctx.fillRect(x + w * 0.35, y, w * 0.30, h);
  ctx.fillStyle = T.red;
  ctx.fillRect(x + w * 0.65, y, w * 0.35, h);
}

function save(canvas, name) {
  const buf = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(OUT, name), buf);
  console.log('  ✓ ' + name);
}

// =============================================
// MOCKUP 1: Color Palette & Design Language
// =============================================
function mockupPalette() {
  const W = 1200, H = 900;
  const c = createCanvas(W, H);
  const ctx = c.getContext('2d');

  // Background
  ctx.fillStyle = T.bgPage;
  ctx.fillRect(0, 0, W, H);

  // Title
  ctx.fillStyle = T.navy;
  ctx.font = 'bold 32px Arial';
  ctx.fillText('Motor City Math — "Association" Design Language', 40, 55);
  ctx.fillStyle = T.textSecondary;
  ctx.font = '16px Arial';
  ctx.fillText('Inspired by the Pistons white away jersey. Clean, bold, readable.', 40, 82);

  // Jersey stripe accent under title
  drawStripe(ctx, 40, 96, 400, 4);

  // --- COLOR SWATCHES ---
  ctx.fillStyle = T.navy;
  ctx.font = 'bold 18px Arial';
  ctx.fillText('PRIMARY COLORS', 40, 145);

  const primary = [
    { hex: '#C8102E', name: 'Pistons Red', role: 'Buttons, accents, card borders' },
    { hex: '#1D42BA', name: 'Royal Blue', role: 'Links, focus, charts, interactive' },
    { hex: '#002D62', name: 'Navy', role: 'Headlines, axes, strong text' },
    { hex: '#BEC0C2', name: 'Chrome', role: 'Borders, disabled states' },
    { hex: '#FFFFFF', name: 'White', role: 'Cards, canvas, breathing room' },
  ];

  primary.forEach((c2, i) => {
    const sx = 40 + i * 220;
    // Swatch
    ctx.fillStyle = c2.hex;
    ctx.strokeStyle = c2.hex === '#FFFFFF' ? T.borderDefault : c2.hex;
    ctx.lineWidth = 1;
    roundRect(ctx, sx, 160, 190, 80, 6);
    ctx.fill(); ctx.stroke();
    // Label
    ctx.fillStyle = T.textPrimary;
    ctx.font = 'bold 13px Arial';
    ctx.fillText(c2.name, sx, 260);
    ctx.fillStyle = T.textSecondary;
    ctx.font = '12px Arial';
    ctx.fillText(c2.hex, sx, 276);
    ctx.fillText(c2.role, sx, 292);
  });

  // --- BACKGROUND TOKENS ---
  ctx.fillStyle = T.navy;
  ctx.font = 'bold 18px Arial';
  ctx.fillText('BACKGROUND & SURFACE TOKENS', 40, 335);

  const bgs = [
    { hex: '#F4F5F9', name: 'Page Background', note: 'Cool blue-gray tint' },
    { hex: '#FFFFFF', name: 'Card Surface', note: 'Pure white' },
    { hex: '#F8F9FC', name: 'Input Background', note: 'Subtle depth' },
    { hex: '#EEF1FA', name: 'Highlight', note: 'Selected states' },
    { hex: '#E2E5EF', name: 'Border Subtle', note: 'Separators' },
  ];

  bgs.forEach((b, i) => {
    const sx = 40 + i * 220;
    ctx.fillStyle = b.hex;
    ctx.strokeStyle = T.borderDefault;
    ctx.lineWidth = 1;
    roundRect(ctx, sx, 350, 190, 60, 6);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = T.textPrimary;
    ctx.font = 'bold 13px Arial';
    ctx.fillText(b.name, sx, 430);
    ctx.fillStyle = T.textSecondary;
    ctx.font = '12px Arial';
    ctx.fillText(b.hex + ' — ' + b.note, sx, 446);
  });

  // --- TYPOGRAPHY ---
  ctx.fillStyle = T.navy;
  ctx.font = 'bold 18px Arial';
  ctx.fillText('TYPOGRAPHY', 40, 495);

  // h1
  ctx.fillStyle = T.navy;
  ctx.font = 'bold 36px Arial';
  ctx.fillText('Algebra 2: Nonlinear Functions Exam', 40, 540);

  // subtitle
  ctx.fillStyle = T.textSecondary;
  ctx.font = '18px Arial';
  ctx.fillText('Unit 2 · Standards W2 & W3 · 15 Questions · ~60 min', 40, 568);

  // question number
  ctx.fillStyle = T.navy;
  ctx.font = 'bold 14px Arial';
  ctx.letterSpacing = '2px';
  ctx.fillText('QUESTION 3', 40, 610);
  // Reset by approximating letter-spacing manually
  ctx.fillStyle = T.borderSubtle;
  ctx.fillRect(40, 618, 120, 2);

  // question text
  ctx.fillStyle = T.textPrimary;
  ctx.font = '16px Arial';
  ctx.fillText('Identify parent, describe transformations, state domain & range, and find x-intercepts.', 40, 648);

  // label
  ctx.fillStyle = T.textSecondary;
  ctx.font = 'bold 14px Arial';
  ctx.fillText('Parent function:', 40, 680);

  // --- JERSEY STRIPE MOTIF ---
  ctx.fillStyle = T.navy;
  ctx.font = 'bold 18px Arial';
  ctx.fillText('JERSEY STRIPE MOTIF', 40, 730);

  ctx.fillStyle = T.textSecondary;
  ctx.font = '13px Arial';
  ctx.fillText('Header border (horizontal):', 40, 755);
  drawStripe(ctx, 250, 744, 600, 5);

  ctx.fillText('Container accent (vertical):', 40, 790);
  drawStripe(ctx, 250, 770, 5, 50);

  ctx.fillText('Section divider:', 40, 840);
  // Top stripe
  drawStripe(ctx, 250, 825, 600, 3);
  ctx.fillStyle = T.bgCard;
  ctx.fillRect(250, 828, 600, 30);
  ctx.fillStyle = T.red;
  ctx.font = 'bold 14px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Section B — Solve Nonlinear Equations (Q4–Q11)', 550, 848);
  ctx.textAlign = 'left';
  // Bottom stripe
  drawStripe(ctx, 250, 858, 600, 3);

  save(c, 'mockup-01-palette.png');
}

// =============================================
// MOCKUP 2: Full Page Layout
// =============================================
function mockupPage() {
  const W = 1200, H = 1600;
  const c = createCanvas(W, H);
  const ctx = c.getContext('2d');

  // Page background
  ctx.fillStyle = T.bgPage;
  ctx.fillRect(0, 0, W, H);

  // Container
  const cx = 100, cy = 30, cw = 1000, ch = 1540;
  // Shadow
  ctx.shadowColor = 'rgba(0,45,98,0.08)';
  ctx.shadowBlur = 20;
  ctx.shadowOffsetY = 4;
  ctx.fillStyle = T.bgCard;
  ctx.fillRect(cx, cy, cw, ch);
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;

  // Container left stripe (jersey side panel)
  drawStripe(ctx, cx, cy, 4, ch);

  // --- HEADER ---
  const hx = cx + 40, hw = cw - 80;
  ctx.fillStyle = T.navy;
  ctx.font = 'bold 36px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Algebra 2: Nonlinear Functions Exam', cx + cw/2, 100);
  ctx.fillStyle = T.textSecondary;
  ctx.font = '16px Arial';
  ctx.fillText('Unit 2 · Standards W2 & W3 · 15 Questions · ~60 min', cx + cw/2, 128);
  ctx.textAlign = 'left';

  // Header stripe border
  drawStripe(ctx, hx, 150, hw, 4);

  // --- NOTATION CARD ---
  const ny = 180;
  ctx.fillStyle = T.bgCard;
  ctx.strokeStyle = T.blue;
  ctx.lineWidth = 2;
  roundRect(ctx, hx, ny, hw, 90, 6);
  ctx.fill(); ctx.stroke();
  // Blue left accent
  ctx.fillStyle = T.blue;
  ctx.fillRect(hx, ny, 5, 90);

  ctx.fillStyle = T.blue;
  ctx.font = 'bold 14px Arial';
  ctx.fillText('📝 HOW TO ENTER ANSWERS', hx + 20, ny + 28);
  ctx.fillStyle = T.textPrimary;
  ctx.font = '14px Arial';
  ctx.fillText('^  for exponents → type  x^2  for x²  ·   sqrt()  for √  ·   pi  for π', hx + 20, ny + 52);
  ctx.fillStyle = T.red;
  ctx.font = 'bold 14px Arial';
  ctx.fillText('⚠️ Round all decimal answers to 2 decimal places (e.g. type 2.24 not √5)', hx + 20, ny + 76);

  // --- SECTION DIVIDER ---
  const sy = 300;
  drawStripe(ctx, hx, sy, hw, 3);
  ctx.fillStyle = T.bgCard;
  ctx.fillRect(hx, sy + 3, hw, 44);
  ctx.strokeStyle = T.borderDefault;
  ctx.lineWidth = 1;
  ctx.strokeRect(hx, sy + 3, hw, 44);
  drawStripe(ctx, hx, sy + 47, hw, 3);
  ctx.fillStyle = T.red;
  ctx.font = 'bold 16px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Section A — Identify & Transform (Q1–Q3)', cx + cw/2, sy + 30);
  ctx.textAlign = 'left';

  // --- QUESTION CARD 1 ---
  const q1y = 380;
  // Card shadow
  ctx.shadowColor = 'rgba(0,45,98,0.06)';
  ctx.shadowBlur = 12;
  ctx.shadowOffsetY = 2;
  ctx.fillStyle = T.bgCard;
  ctx.strokeStyle = T.borderDefault;
  ctx.lineWidth = 1;
  roundRect(ctx, hx, q1y, hw, 340, 4);
  ctx.fill(); ctx.stroke();
  ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;

  // Red left accent
  ctx.fillStyle = T.red;
  ctx.fillRect(hx, q1y, 4, 340);

  // Question number
  ctx.fillStyle = T.navy;
  ctx.font = 'bold 14px Arial';
  ctx.fillText('Q U E S T I O N   1', hx + 28, q1y + 32);
  ctx.fillStyle = T.borderSubtle;
  ctx.fillRect(hx + 28, q1y + 40, 140, 2);

  // Question text
  ctx.fillStyle = T.textPrimary;
  ctx.font = '16px Arial';
  ctx.fillText('Identify the parent function and describe all transformations.', hx + 28, q1y + 72);

  // Math formula (simulated)
  ctx.fillStyle = T.textPrimary;
  ctx.font = 'italic 20px Georgia';
  ctx.fillText('f(x) = 2(x − 3)³ + 1', hx + 28, q1y + 108);

  // Label
  ctx.fillStyle = T.textPrimary;
  ctx.font = 'bold 14px Arial';
  ctx.fillText('Parent function:', hx + 28, q1y + 148);

  // Dropdown mockup
  ctx.fillStyle = T.bgInput;
  ctx.strokeStyle = T.borderDefault;
  ctx.lineWidth = 2;
  roundRect(ctx, hx + 28, q1y + 158, 340, 40, 4);
  ctx.fill(); ctx.stroke();
  ctx.fillStyle = T.textSecondary;
  ctx.font = '14px Arial';
  ctx.fillText('— Choose parent function —', hx + 42, q1y + 184);
  // Dropdown arrow
  ctx.fillStyle = T.textSecondary;
  ctx.beginPath();
  ctx.moveTo(hx + 348, q1y + 172);
  ctx.lineTo(hx + 356, q1y + 172);
  ctx.lineTo(hx + 352, q1y + 180);
  ctx.closePath(); ctx.fill();

  // Transformations label
  ctx.fillStyle = T.textPrimary;
  ctx.font = 'bold 14px Arial';
  ctx.fillText('Transformations:', hx + 28, q1y + 232);

  // Textarea mockup
  ctx.fillStyle = T.bgInput;
  ctx.strokeStyle = T.borderDefault;
  ctx.lineWidth = 2;
  roundRect(ctx, hx + 28, q1y + 242, hw - 56, 80, 4);
  ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#A0A8BE';
  ctx.font = '14px Arial';
  ctx.fillText('List transformations...', hx + 42, q1y + 272);

  // --- QUESTION CARD 2 (with inputs) ---
  const q2y = 750;
  ctx.shadowColor = 'rgba(0,45,98,0.06)';
  ctx.shadowBlur = 12; ctx.shadowOffsetY = 2;
  ctx.fillStyle = T.bgCard;
  ctx.strokeStyle = T.borderDefault;
  ctx.lineWidth = 1;
  roundRect(ctx, hx, q2y, hw, 420, 4);
  ctx.fill(); ctx.stroke();
  ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;

  ctx.fillStyle = T.red;
  ctx.fillRect(hx, q2y, 4, 420);

  ctx.fillStyle = T.navy;
  ctx.font = 'bold 14px Arial';
  ctx.fillText('Q U E S T I O N   2', hx + 28, q2y + 32);
  ctx.fillStyle = T.borderSubtle;
  ctx.fillRect(hx + 28, q2y + 40, 140, 2);

  ctx.fillStyle = T.textPrimary;
  ctx.font = '16px Arial';
  ctx.fillText('Identify parent, describe transformations, state domain & range, and find x-intercepts.', hx + 28, q2y + 72);

  ctx.font = 'italic 20px Georgia';
  ctx.fillText('f(x) = −|x + 4| + 3', hx + 28, q2y + 108);

  // Parent function dropdown
  ctx.fillStyle = T.textPrimary;
  ctx.font = 'bold 14px Arial';
  ctx.fillText('Parent function:', hx + 28, q2y + 148);
  ctx.fillStyle = T.bgInput;
  ctx.strokeStyle = T.borderDefault;
  ctx.lineWidth = 2;
  roundRect(ctx, hx + 28, q2y + 158, 340, 40, 4);
  ctx.fill(); ctx.stroke();
  ctx.fillStyle = T.blue;
  ctx.font = '14px Arial';
  ctx.fillText('y = |x| (absolute value)', hx + 42, q2y + 184);

  // x-intercept inputs
  ctx.fillStyle = T.textPrimary;
  ctx.font = 'bold 14px Arial';
  ctx.fillText('x₁ =', hx + 28, q2y + 230);
  // Input box
  ctx.fillStyle = T.bgInput;
  ctx.strokeStyle = T.blue; // focused state
  ctx.lineWidth = 2;
  roundRect(ctx, hx + 68, q2y + 212, 120, 36, 4);
  ctx.fill(); ctx.stroke();
  // Focus ring
  ctx.strokeStyle = 'rgba(29,66,186,0.15)';
  ctx.lineWidth = 6;
  roundRect(ctx, hx + 65, q2y + 209, 126, 42, 6);
  ctx.stroke();
  ctx.fillStyle = T.textPrimary;
  ctx.font = '15px Arial';
  ctx.fillText('-1', hx + 82, q2y + 236);

  ctx.fillStyle = T.textPrimary;
  ctx.font = 'bold 14px Arial';
  ctx.fillText('x₂ =', hx + 220, q2y + 230);
  ctx.fillStyle = T.bgInput;
  ctx.strokeStyle = T.borderDefault;
  ctx.lineWidth = 2;
  roundRect(ctx, hx + 260, q2y + 212, 120, 36, 4);
  ctx.fill(); ctx.stroke();
  ctx.fillStyle = T.textPrimary;
  ctx.font = '15px Arial';
  ctx.fillText('-7', hx + 274, q2y + 236);

  // Transformations textarea
  ctx.fillStyle = T.textPrimary;
  ctx.font = 'bold 14px Arial';
  ctx.fillText('Transformations, Domain & Range:', hx + 28, q2y + 282);
  ctx.fillStyle = T.bgInput;
  ctx.strokeStyle = T.borderDefault;
  ctx.lineWidth = 2;
  roundRect(ctx, hx + 28, q2y + 292, hw - 56, 80, 4);
  ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#A0A8BE';
  ctx.font = '14px Arial';
  ctx.fillText('Transformations, domain, range...', hx + 42, q2y + 322);

  // --- BUTTONS ---
  const by = 1210;
  // Primary button
  roundRect(ctx, hx + 200, by, 220, 48, 4);
  ctx.fillStyle = T.red;
  ctx.fill();
  ctx.fillStyle = T.textInverse;
  ctx.font = 'bold 14px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('CHECK ANSWERS', hx + 310, by + 30);
  ctx.textAlign = 'left';

  // Secondary button
  roundRect(ctx, hx + 440, by, 140, 48, 4);
  ctx.fillStyle = T.bgCard;
  ctx.fill();
  ctx.strokeStyle = T.blue;
  ctx.lineWidth = 2;
  roundRect(ctx, hx + 440, by, 140, 48, 4);
  ctx.stroke();
  ctx.fillStyle = T.blue;
  ctx.font = 'bold 14px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('PRINT', hx + 510, by + 30);
  ctx.textAlign = 'left';

  // Ghost button
  roundRect(ctx, hx + 600, by, 180, 48, 4);
  ctx.fillStyle = T.bgCard;
  ctx.fill();
  ctx.strokeStyle = T.borderDefault;
  ctx.lineWidth = 1;
  roundRect(ctx, hx + 600, by, 180, 48, 4);
  ctx.stroke();
  ctx.fillStyle = T.textSecondary;
  ctx.font = 'bold 14px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('ANSWER KEY 🔑', hx + 690, by + 30);
  ctx.textAlign = 'left';

  // --- SCORED RESULT PREVIEW ---
  const ry = 1300;
  ctx.fillStyle = T.navy;
  ctx.font = 'bold 18px Arial';
  ctx.fillText('After scoring:', hx, ry);

  // Correct card
  ctx.fillStyle = T.correctBg;
  ctx.strokeStyle = T.correct;
  ctx.lineWidth = 1;
  roundRect(ctx, hx, ry + 20, hw/2 - 10, 60, 4);
  ctx.fill(); ctx.stroke();
  ctx.fillStyle = T.correct;
  ctx.fillRect(hx, ry + 20, 4, 60);
  ctx.fillStyle = T.correct;
  ctx.font = 'bold 14px Arial';
  ctx.fillText('✓  Q U E S T I O N   1', hx + 20, ry + 46);
  ctx.font = '13px Arial';
  ctx.fillText('🔥 Nothing but net.', hx + 20, ry + 66);

  // Incorrect card
  ctx.fillStyle = T.incorrectBg;
  ctx.strokeStyle = T.incorrect;
  ctx.lineWidth = 1;
  roundRect(ctx, hx + hw/2 + 10, ry + 20, hw/2 - 10, 60, 4);
  ctx.fill(); ctx.stroke();
  ctx.fillStyle = T.incorrect;
  ctx.fillRect(hx + hw/2 + 10, ry + 20, 4, 60);
  ctx.fillStyle = T.incorrect;
  ctx.font = 'bold 14px Arial';
  ctx.fillText('✗  Q U E S T I O N   4', hx + hw/2 + 30, ry + 46);
  ctx.font = '13px Arial';
  ctx.fillText('Check your exponent. Try again.', hx + hw/2 + 30, ry + 66);

  // --- SAAS GRADE ---
  const gy = 1420;
  ctx.fillStyle = T.navy;
  ctx.font = 'bold 18px Arial';
  ctx.fillText('SAAS Grade Display:', hx, gy);

  // Grade 4 badge
  roundRect(ctx, hx, gy + 20, 80, 80, 8);
  ctx.fillStyle = T.blue;
  ctx.fill();
  ctx.fillStyle = T.textInverse;
  ctx.font = 'bold 42px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('4', hx + 40, gy + 72);
  ctx.textAlign = 'left';
  ctx.fillStyle = T.textSecondary;
  ctx.font = '14px Arial';
  ctx.fillText('≥ 92% — A', hx + 95, gy + 60);

  // Grade 3
  roundRect(ctx, hx + 200, gy + 20, 80, 80, 8);
  ctx.fillStyle = T.chrome;
  ctx.fill();
  ctx.fillStyle = T.textPrimary;
  ctx.font = 'bold 42px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('3', hx + 240, gy + 72);
  ctx.textAlign = 'left';
  ctx.fillStyle = T.textSecondary;
  ctx.font = '14px Arial';
  ctx.fillText('82–91% — B', hx + 295, gy + 60);

  // Grade 2
  roundRect(ctx, hx + 420, gy + 20, 80, 80, 8);
  ctx.fillStyle = T.warning;
  ctx.fill();
  ctx.fillStyle = T.textInverse;
  ctx.font = 'bold 42px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('2', hx + 460, gy + 72);
  ctx.textAlign = 'left';
  ctx.fillStyle = T.textSecondary;
  ctx.font = '14px Arial';
  ctx.fillText('70–81% — C', hx + 515, gy + 60);

  // Grade 1
  roundRect(ctx, hx + 640, gy + 20, 80, 80, 8);
  ctx.fillStyle = T.red;
  ctx.fill();
  ctx.fillStyle = T.textInverse;
  ctx.font = 'bold 42px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('1', hx + 680, gy + 72);
  ctx.textAlign = 'left';
  ctx.fillStyle = T.textSecondary;
  ctx.font = '14px Arial';
  ctx.fillText('< 70% — D', hx + 735, gy + 60);

  save(c, 'mockup-02-page-layout.png');
}

// =============================================
// MOCKUP 3: Graph Canvas Redesign
// =============================================
function mockupGraph() {
  const W = 1200, H = 900;
  const c = createCanvas(W, H);
  const ctx = c.getContext('2d');

  // Page bg
  ctx.fillStyle = T.bgPage;
  ctx.fillRect(0, 0, W, H);

  // Title
  ctx.fillStyle = T.navy;
  ctx.font = 'bold 28px Arial';
  ctx.fillText('Graph Canvas — Before & After', 40, 45);
  drawStripe(ctx, 40, 58, 400, 4);

  // ---- BEFORE (left) ----
  ctx.fillStyle = T.textSecondary;
  ctx.font = 'bold 16px Arial';
  ctx.fillText('BEFORE (Current — Arena Mode)', 40, 100);

  const bx = 40, by = 115, bs = 360;
  // Dark bg (simulating arena-mode card)
  ctx.fillStyle = '#141B2D';
  roundRect(ctx, bx, by, bs + 20, bs + 20, 4);
  ctx.fill();
  ctx.strokeStyle = '#2A3352';
  ctx.lineWidth = 2;
  roundRect(ctx, bx + 10, by + 10, bs, bs, 2);
  ctx.stroke();

  // Draw bad grid (low contrast)
  ctx.strokeStyle = '#333844';
  ctx.lineWidth = 0.5;
  for (let i = 0; i <= 16; i++) {
    const x = bx + 10 + (i * bs / 16);
    ctx.beginPath(); ctx.moveTo(x, by + 10); ctx.lineTo(x, by + 10 + bs); ctx.stroke();
    const y = by + 10 + (i * bs / 16);
    ctx.beginPath(); ctx.moveTo(bx + 10, y); ctx.lineTo(bx + 10 + bs, y); ctx.stroke();
  }
  // Axes barely visible
  ctx.strokeStyle = '#555';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(bx + 10, by + 10 + bs/2); ctx.lineTo(bx + 10 + bs, by + 10 + bs/2); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(bx + 10 + bs/2, by + 10); ctx.lineTo(bx + 10 + bs/2, by + 10 + bs); ctx.stroke();
  // Labels barely visible
  ctx.fillStyle = '#555';
  ctx.font = '10px Arial';
  ctx.fillText('x', bx + bs, by + 10 + bs/2 - 5);
  ctx.fillText('y', bx + 10 + bs/2 + 5, by + 20);

  // "Hard to read" label
  ctx.fillStyle = T.red;
  ctx.font = 'bold 14px Arial';
  ctx.fillText('❌ Grid invisible, labels unreadable', bx, by + bs + 50);

  // ---- AFTER (right) ----
  ctx.fillStyle = T.textSecondary;
  ctx.font = 'bold 16px Arial';
  ctx.fillText('AFTER — "Association" Light Canvas', 560, 100);

  const ax = 560, ay = 115, as2 = 560; // larger canvas
  // White canvas background (THE KEY FIX)
  ctx.fillStyle = '#FFFFFF';
  ctx.strokeStyle = T.navy;
  ctx.lineWidth = 2;
  roundRect(ctx, ax, ay, as2, as2, 4);
  ctx.fill(); ctx.stroke();

  // Minor grid lines
  ctx.strokeStyle = T.gridMinor;
  ctx.lineWidth = 0.5;
  for (let i = 0; i <= 32; i++) {
    const x = ax + (i * as2 / 32);
    ctx.beginPath(); ctx.moveTo(x, ay); ctx.lineTo(x, ay + as2); ctx.stroke();
    const y = ay + (i * as2 / 32);
    ctx.beginPath(); ctx.moveTo(ax, y); ctx.lineTo(ax + as2, y); ctx.stroke();
  }

  // Major grid lines (every 2 units)
  ctx.strokeStyle = T.gridLine;
  ctx.lineWidth = 1;
  for (let i = 0; i <= 16; i++) {
    const x = ax + (i * as2 / 16);
    ctx.beginPath(); ctx.moveTo(x, ay); ctx.lineTo(x, ay + as2); ctx.stroke();
    const y = ay + (i * as2 / 16);
    ctx.beginPath(); ctx.moveTo(ax, y); ctx.lineTo(ax + as2, y); ctx.stroke();
  }

  // Bold axes
  ctx.strokeStyle = T.navy;
  ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.moveTo(ax, ay + as2/2); ctx.lineTo(ax + as2, ay + as2/2); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(ax + as2/2, ay); ctx.lineTo(ax + as2/2, ay + as2); ctx.stroke();

  // Axis labels
  ctx.fillStyle = T.navy;
  ctx.font = 'bold 14px Arial';
  ctx.fillText('x', ax + as2 - 20, ay + as2/2 - 10);
  ctx.fillText('y', ax + as2/2 + 10, ay + 16);
  ctx.font = '13px Arial';
  ctx.textAlign = 'center';
  for (let i = -8; i <= 8; i++) {
    if (i !== 0 && i % 2 === 0) {
      const x = ax + as2/2 + (i * as2/16);
      ctx.fillText('' + i, x, ay + as2/2 + 20);
    }
  }
  ctx.textAlign = 'right';
  for (let i = -8; i <= 8; i++) {
    if (i !== 0 && i % 2 === 0) {
      const y = ay + as2/2 - (i * as2/16);
      ctx.fillText('' + i, ax + as2/2 - 8, y + 4);
    }
  }
  ctx.textAlign = 'left';

  // Plotted points (red)
  const parabola = (x) => -(x + 2) * (x + 2) + 5;
  const points = [[-4, 1], [-3, 4], [-2, 5], [-1, 4], [0, 1]];
  points.forEach(([gx, gy]) => {
    const sx = ax + as2/2 + (gx * as2/16);
    const sy = ay + as2/2 - (gy * as2/16);
    ctx.fillStyle = T.red;
    ctx.beginPath(); ctx.arc(sx, sy, 7, 0, Math.PI * 2); ctx.fill();
    // White center dot
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath(); ctx.arc(sx, sy, 3, 0, Math.PI * 2); ctx.fill();
    // Label
    ctx.fillStyle = T.navy;
    ctx.font = 'bold 12px Arial';
    ctx.fillText(`(${gx}, ${gy})`, sx + 10, sy - 10);
  });

  // Draw the actual parabola curve
  ctx.strokeStyle = T.blue;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  let started = false;
  for (let gx = -6; gx <= 2; gx += 0.05) {
    const gy = parabola(gx);
    if (Math.abs(gy) <= 8) {
      const sx = ax + as2/2 + (gx * as2/16);
      const sy = ay + as2/2 - (gy * as2/16);
      if (!started) { ctx.moveTo(sx, sy); started = true; }
      else ctx.lineTo(sx, sy);
    }
  }
  ctx.stroke();

  // Vertex highlight
  const vsx = ax + as2/2 + (-2 * as2/16);
  const vsy = ay + as2/2 - (5 * as2/16);
  ctx.strokeStyle = T.blue;
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(vsx, vsy, 12, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = T.blue;
  ctx.font = 'bold 13px Arial';
  ctx.fillText('vertex (−2, 5)', vsx + 16, vsy - 14);

  // "Readable" label
  ctx.fillStyle = T.correct;
  ctx.font = 'bold 14px Arial';
  ctx.fillText('✓ White canvas, navy axes, bold labels, clean grid', 560, ay + as2 + 24);
  ctx.fillStyle = T.textSecondary;
  ctx.font = '13px Arial';
  ctx.fillText('Canvas is always white — even in Arena Mode (like a whiteboard in a dark room)', 560, ay + as2 + 46);

  // Tooltip mockup
  ctx.fillStyle = T.navy;
  roundRect(ctx, ax + 180, ay + 140, 90, 28, 4);
  ctx.fill();
  ctx.fillStyle = T.textInverse;
  ctx.font = 'bold 13px monospace';
  ctx.fillText('(−3.25, 4)', ax + 188, ay + 159);
  ctx.fillStyle = T.textSecondary;
  ctx.font = '12px Arial';
  ctx.fillText('← coordinate tooltip (snap to 0.25)', ax + 278, ay + 159);

  // Point styling legend
  const ly = ay + as2 + 70;
  ctx.fillStyle = T.navy;
  ctx.font = 'bold 14px Arial';
  ctx.fillText('Point States:', 560, ly);

  // Unchecked
  ctx.fillStyle = T.red;
  ctx.beginPath(); ctx.arc(580, ly + 24, 6, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#FFF'; ctx.beginPath(); ctx.arc(580, ly + 24, 2.5, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = T.textPrimary; ctx.font = '13px Arial';
  ctx.fillText('Placed (unchecked)', 594, ly + 28);

  // Correct
  ctx.fillStyle = T.correct;
  ctx.beginPath(); ctx.arc(740, ly + 24, 6, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = T.textPrimary; ctx.font = '13px Arial';
  ctx.fillText('Correct', 754, ly + 28);

  // Incorrect
  ctx.fillStyle = T.incorrect;
  ctx.beginPath(); ctx.arc(830, ly + 24, 6, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = T.textPrimary;
  ctx.fillText('Incorrect', 844, ly + 28);

  save(c, 'mockup-03-graph-canvas.png');
}

// === GENERATE ALL ===
console.log('Generating mockups...');
mockupPalette();
mockupPage();
mockupGraph();
console.log('Done! Files in docs/mockups/');
