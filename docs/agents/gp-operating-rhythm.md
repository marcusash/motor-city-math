# GP No-Idle Operating Rhythm

## Objective
Maintain continuous execution with no empty queue while preserving quality and communication.

## Hourly Loop
1. Check GP inbox (`.agent-comms/grind/inbox-GP/`) and process critical/high first.
2. Query SQL for ready tasks and pick one from each lane:
   - Delivery
   - Improvement
   - Skill
3. Execute one task to completion.
4. Verify results (command output, file check, or tests).
5. Commit and push.
6. Re-check inbox.
7. Refill queue if pending GP tasks < 8 by adding 10 new tasks.

## Daily Targets
- Minimum 6 completed GP tasks per day.
- Keep at least 12 pending GP tasks.
- Keep at most 1 blocked GP task without escalation.

## Escalation Rule
If blocked for 15 minutes, send blocker message to owner inbox, mark blocked in SQL, and move to next ready task immediately.
