// gp-agent-comms-inbox-dirs-exist.test.js — all agent inbox directories must exist

const fs = require('fs');
const path = require('path');

const COMMS_DIR = path.join(__dirname, '..', '.agent-comms', 'grind');

const REQUIRED_INBOXES = ['inbox-GA', 'inbox-GD', 'inbox-GF', 'inbox-GI', 'inbox-GP', 'inbox-GR'];

let pass = 0;
let fail = 0;
const failures = [];

for (const inbox of REQUIRED_INBOXES) {
  const inboxPath = path.join(COMMS_DIR, inbox);
  if (fs.existsSync(inboxPath) && fs.statSync(inboxPath).isDirectory()) {
    pass++;
    const msgCount = fs.readdirSync(inboxPath).filter(f => f.endsWith('.json')).length;
    console.log(`  FOUND: ${inbox} (${msgCount} messages)`);
  } else {
    fail++;
    failures.push(`${inbox} directory missing at .agent-comms/grind/${inbox}`);
  }
}

console.log(`gp-agent-comms-inbox-dirs-exist: ${pass} pass, ${fail} fail`);
if (failures.length) {
  failures.forEach(f => console.log('  FAIL:', f));
  process.exit(1);
}
console.log(`OK — all ${pass} agent inbox directories exist`);
