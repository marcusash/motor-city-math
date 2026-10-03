# FD Interaction Design

## Trigger

Load when designing navigation, task flow, state transitions, modes, forms, destructive
actions, or multi-persona workflows.

## Method

1. Name the user, goal, context, and cost of error.
2. Map the happy path and every meaningful state transition.
3. Identify the artifact or state the workflow creates.
4. Separate tasks when persona, input shape, output, urgency, or consequence differs.
5. Choose the smallest container that keeps context clear.
6. Define undo, confirmation, recovery, persistence, and audit behavior.
7. Prototype and test with real content before polishing.

## Container guidance

- **Setting or toggle:** same task and artifact; one preference changes.
- **Tab:** related area, but the user intentionally chooses a distinct task or dataset.
- **Page:** a substantial context or information-architecture change.
- **Dialog:** a short, focused decision that must resolve before return.
- **Inline disclosure:** optional detail that preserves the current task.

Avoid hidden modes. If users must remember a mode to predict an action, expose that state
persistently or separate the workflows.

## Interaction contract

For every action, specify:

- trigger and preconditions;
- visible feedback and in-progress behavior;
- success, empty, partial, and error outcomes;
- cancellation, undo, or recovery;
- persistence and audit requirements;
- keyboard, pointer, touch, and assistive-technology behavior.

## Accessibility and quality gate

- Preserve logical reading and focus order.
- Provide keyboard access without traps and return focus after transient UI closes.
- Expose names, roles, values, status changes, errors, and instructions to assistive
  technology.
- Do not encode state with color, position, hover, or motion alone.
- Honor reduced motion, zoom, reflow, high contrast, and target-size requirements.
- Test error recovery and irreversible actions with representative users or realistic
  task scenarios.

## Output

Deliver a flow, state model, interaction contract, content requirements, accessibility
notes, and acceptance criteria. Product-specific behavior belongs in that product's
design authority, not in this durable method.
