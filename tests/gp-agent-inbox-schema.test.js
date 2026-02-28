// gp-agent-inbox-schema.test.js — verify all inbox messages follow the correct JSON schema

const fs = require('fs');
const path = require('path');

const INBOX_BASE = path.join(__dirname, '..', '.agent-comms', 'grind');
const AGENT_IDS = ['GA', 'GD', 'GF', 'GI', 'GP', 'GR'];

const REQUIRED_FIELDS = ['from', 'to', 'body'];
const OPTIONAL_BUT_CHECKED = ['subject', 'created', 'date'];

let pass = 0;
let fail = 0;
const issues = [];

for (const agent of AGENT_IDS) {
  const inbox = path.join(INBOX_BASE, `inbox-${agent}`);
  if (!fs.existsSync(inbox)) continue;

  const files = fs.readdirSync(inbox).filter(f => f.endsWith('.json'));
  for (const file of files) {
    const filePath = path.join(inbox, file);
    let msg;
    try {
      msg = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (e) {
      fail++;
      issues.push(`INVALID JSON: inbox-${agent}/${file}`);
      continue;
    }

    let msgOk = true;
    for (const field of REQUIRED_FIELDS) {
      if (!msg[field]) {
        fail++;
        issues.push(`MISSING '${field}': inbox-${agent}/${file}`);
        msgOk = false;
      }
    }
    if (msgOk) pass++;
  }
}

console.log(`gp-agent-inbox-schema: ${pass} pass, ${fail} fail`);
if (issues.length) {
  issues.slice(0, 10).forEach(i => console.log('  ', i));
  if (issues.length > 10) console.log(`  ...and ${issues.length - 10} more`);
  process.exit(1);
}
console.log(`OK — all ${pass} inbox messages have required fields`);
