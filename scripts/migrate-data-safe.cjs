#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

function usage() {
  return [
    'Usage:',
    '  node scripts/migrate-data-safe.cjs --file <path> --transform <module> [--out <path>] [--backup-dir <dir>] [--dry-run]',
    '',
    'Options:',
    '  --file       Input JSON file to migrate',
    '  --transform  Path to a JS module exporting a function: (data) => data',
    '  --out        Output file path. Default: overwrite input file',
    '  --backup-dir Directory for backups. Default: backups',
    '  --dry-run    Do not write files, only report actions'
  ].join('\n');
}

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i += 1) {
    const key = argv[i];
    if (!key.startsWith('--')) continue;
    const value = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : true;
    args[key.replace(/^--/, '')] = value;
    if (value !== true) i += 1;
  }
  return args;
}

function loadTransform(transformPath) {
  const resolved = path.isAbsolute(transformPath)
    ? transformPath
    : path.join(process.cwd(), transformPath);
  // eslint-disable-next-line global-require, import/no-dynamic-require
  const mod = require(resolved);
  const fn = mod.default || mod;
  if (typeof fn !== 'function') {
    throw new Error('Transform module must export a function.');
  }
  return fn;
}

function main() {
  const args = parseArgs(process.argv);
  if (args.help || args.h) {
    console.log(usage());
    process.exit(0);
  }
  if (!args.file || !args.transform) {
    console.log(usage());
    process.exit(1);
  }

  const inputPath = path.isAbsolute(args.file) ? args.file : path.join(process.cwd(), args.file);
  const outputPath = args.out
    ? (path.isAbsolute(args.out) ? args.out : path.join(process.cwd(), args.out))
    : inputPath;
  const backupDir = args['backup-dir']
    ? (path.isAbsolute(args['backup-dir']) ? args['backup-dir'] : path.join(process.cwd(), args['backup-dir']))
    : path.join(process.cwd(), 'backups');
  const dryRun = args['dry-run'] === true;

  const raw = fs.readFileSync(inputPath, 'utf8');
  const data = JSON.parse(raw);
  const transform = loadTransform(args.transform);
  const nextData = transform(data);

  if (nextData === undefined) {
    throw new Error('Transform returned undefined. Return the updated data object.');
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(backupDir, `${path.basename(inputPath)}.bak-${timestamp}`);

  if (dryRun) {
    console.log(`[dry-run] Backup: ${backupPath}`);
    console.log(`[dry-run] Output: ${outputPath}`);
    return;
  }

  fs.mkdirSync(backupDir, { recursive: true });
  fs.writeFileSync(backupPath, raw);
  fs.writeFileSync(outputPath, `${JSON.stringify(nextData, null, 2)}\n`);
  console.log(`Backup written to ${backupPath}`);
  console.log(`Output written to ${outputPath}`);
}

try {
  main();
} catch (err) {
  console.error(err.message);
  process.exit(1);
}
