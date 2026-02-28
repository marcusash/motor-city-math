#!/usr/bin/env node
// gp-stale-inbox-check.js — detect inbox messages older than 48 hours with unread status

const fs = require('fs');
const path = require('path');

const INBOX_BASE = path.join(__dirname, '..', '.agent-comms', 'grind');
const AGENT_IDS = ['GA', 'GD', 'GF', 'GI', 'GP', 'GR'];
const MAX_AGE_HOURS = 48;

let stale = 0;
let fresh = 0;

const now = Date.now();

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
      continue;
    }

    if (msg.status !== 'unread') continue;

    const created = msg.created ? new Date(msg.created).getTime() : null;
    if (!created) continue;

    const ageHours = (now - created) / (1000 * 60 * 60);
    if (ageHours > MAX_AGE_HOURS) {
      stale++;
      console.log(`STALE: inbox-${agent}/${file} (${Math.round(ageHours)}h old) — from: ${msg.from}, subject: ${msg.subject}`);
    } else {
      fresh++;
    }
  }
}

console.log(`\ngp-stale-inbox-check: ${stale} stale messages (>${MAX_AGE_HOURS}h unread), ${fresh} fresh`);
if (stale > 0) {
  console.log('ACTION: Notify relevant agents to check their inbox.');
}
