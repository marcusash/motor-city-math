#!/usr/bin/env node
'use strict';
const fs = require('fs');

const UNICODE_MAP = {
  '\\\\u2081': '\u2081',
  '\\\\u2082': '\u2082',
  '\\\\u2083': '\u2083',
  '\\\\u00B2': '\u00B2',
  '\\\\u00B3': '\u00B3',
  '\\\\u2014': '\u2014',
  '\\\\u2013': '\u2013',
  '\\\\u00B1': '\u00B1',
  '\\\\u221A': '\u221A',
  '\\\\u03C0': '\u03C0',
  '\\\\u2264': '\u2264',
  '\\\\u2265': '\u2265',
  '\\\\u2260': '\u2260',
  '\\\\u2192': '\u2192',
  '\\\\u221E': '\u221E',
};

const files = process.argv.slice(2);
if (files.length === 0) {
  console.error('Usage: node fix-exam-json.js <file1.json> [file2.json ...]');
  process.exit(1);
}

for (const filepath of files) {
  let raw = fs.readFileSync(filepath, 'utf8');
  const before = raw.length;

  // Fix quadruple-backslash to double-backslash
  raw = raw.split('\\\\\\\\').join('\\\\');

  // Fix literal unicode escapes
  for (const [esc, char] of Object.entries(UNICODE_MAP)) {
    raw = raw.split(esc).join(char);
  }

  // Validate
  JSON.parse(raw);
  fs.writeFileSync(filepath, raw, 'utf8');
  console.log('Fixed:', filepath, '(' + (before - raw.length) + ' chars removed)');
}
