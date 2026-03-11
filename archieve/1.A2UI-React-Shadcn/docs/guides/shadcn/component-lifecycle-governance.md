# Shadcn Component Lifecycle Governance

Use this policy to govern introduction, evolution, and retirement of shadcn components.

## Lifecycle States

| State | Entry Criteria | Exit Criteria | Owner |
| --- | --- | --- | --- |
| Proposed | Intake scorecard approved | Prototype demo + API draft reviewed | Component proposer |
| Incubating | Prototype merged behind feature flag | Two production usages + test baseline | Component owner |
| Active | Stable API + docs + test coverage | Deprecation notice approved | Component owner |
| Deprecated | Successor component exists + migration path documented | All consumers migrated | Component owner + consuming teams |
| Retired | No active consumers | N/A | Component owner |

## Governance Checklist (Per Release Cycle)

- [ ] Verify active components have an assigned owner.
- [ ] Review usage telemetry for incubating components.
- [ ] Confirm deprecated components have migration guides.
- [ ] Verify no new usage of deprecated components.
- [ ] Confirm lifecycle state and next action in component registry.
- [ ] Review accessibility and performance regressions by component.

## State Transition Decision Table

| Trigger | Current State | Next State | Required Evidence | Approver |
| --- | --- | --- | --- | --- |
| First validated implementation merged | Proposed | Incubating | API contract + sample usage | Frontend lead |
| Two teams adopt with no critical defects for 2 weeks | Incubating | Active | Adoption evidence + test results | Frontend lead + QA |
| Better replacement available and migration plan ready | Active | Deprecated | RFC + migration checklist | Design system owner |
| Zero consumers for one full release | Deprecated | Retired | Usage scan + cleanup PR | Design system owner |
| Critical unresolved defect for >7 days | Active/Incubating | Proposed or Deprecated | Incident review | Engineering manager |

## Enforcement

If evidence is missing for a requested transition, the state does not change.
