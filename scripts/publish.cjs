#!/usr/bin/env node
/**
 * publish.cjs — sync kai-algebra2-tests to motor-city-math
 *
 * Usage: node scripts/publish.cjs
 *
 * Requires: MOTOR_CITY_MATH_TOKEN env var (or stored in .env.local at repo root)
 * Never commit .env.local — it's gitignored.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const ROOT = path.join(__dirname, '..');
const MCM_DIR = path.join(os.tmpdir(), 'motor-city-math-publish');

// Load token from env or .env.local
let token = process.env.MOTOR_CITY_MATH_TOKEN;
if (!token) {
  const envLocal = path.join(ROOT, '.env.local');
  if (fs.existsSync(envLocal)) {
    const lines = fs.readFileSync(envLocal, 'utf8').split('\n');
    for (const line of lines) {
      const [k, ...v] = line.split('=');
      if (k && k.trim() === 'MOTOR_CITY_MATH_TOKEN') {
        token = v.join('=').trim().replace(/^["']|["']$/g, '');
        break;
      }
    }
  }
}

if (!token) {
  console.error('ERROR: MOTOR_CITY_MATH_TOKEN not set.');
  console.error('  Option 1: MOTOR_CITY_MATH_TOKEN=your_token node scripts/publish.cjs');
  console.error('  Option 2: Create .env.local at repo root with MOTOR_CITY_MATH_TOKEN=your_token');
  process.exit(1);
}

function run(cmd, opts = {}) {
  console.log(`  > ${cmd.replace(token, '***')}`);
  return execSync(cmd, { stdio: 'pipe', shell: true, ...opts }).toString().trim();
}

console.log('Publishing kai-algebra2-tests to motor-city-math...\n');

// 1. Clone motor-city-math fresh
if (fs.existsSync(MCM_DIR)) {
  fs.rmSync(MCM_DIR, { recursive: true, force: true });
}
run(`git clone https://x-access-token:${token}@github.com/marcusash/motor-city-math.git ${MCM_DIR}`);

// 2. Copy public files
const files = ['index.html','exam.html','final_exam_251123.html','final_exam_251123_mini.html','nonlinear_exam_mvp.html','_gen.js','package.json','README.md'];
const dirs  = ['shared','data','docs','scripts'];

let synced = [];

for (const f of files) {
  const src = path.join(ROOT, f);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(MCM_DIR, f));
    synced.push(f);
  }
}

for (const d of dirs) {
  const src = path.join(ROOT, d);
  if (fs.existsSync(src)) {
    fs.cpSync(src, path.join(MCM_DIR, d), { recursive: true });
    synced.push(`${d}/`);
  }
}

console.log(`\nSynced: ${synced.join(', ')}\n`);

// 3. Commit and push
const sha = run('git rev-parse --short HEAD', { cwd: ROOT });
const msg = run('git log -1 --pretty=%s', { cwd: ROOT });

run('git config user.name "Forge Agent"', { cwd: MCM_DIR });
run('git config user.email "agents@forge.dev"', { cwd: MCM_DIR });
run('git add -A', { cwd: MCM_DIR });

try {
  const diff = run('git diff --staged --stat', { cwd: MCM_DIR });
  if (!diff) {
    console.log('Nothing changed — motor-city-math already up to date.');
    process.exit(0);
  }
  run(`git commit -m "sync: ${msg.replace(/"/g, "'")} (kai@${sha})"`, { cwd: MCM_DIR });
  run(`git push https://x-access-token:${token}@github.com/marcusash/motor-city-math.git master`, { cwd: MCM_DIR });
  console.log('\nPublished! Live in ~60s at:');
  console.log('https://marcusash.github.io/motor-city-math/\n');
} catch (e) {
  console.error('Push failed:', e.message);
  process.exit(1);
}
