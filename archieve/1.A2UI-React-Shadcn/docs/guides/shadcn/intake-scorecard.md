# Shadcn Intake Scorecard

Use this scorecard before accepting any new shadcn component request, adapter change, or design-system extension.

## Intake Checklist

- [ ] Problem statement is written in one sentence.
- [ ] Primary user journey is named.
- [ ] Existing component alternatives were evaluated.
- [ ] Accessibility impact is documented (keyboard, screen reader, contrast).
- [ ] Performance impact is estimated (bundle, runtime, network).
- [ ] Owner and backup owner are assigned.
- [ ] Success metrics and rollback criteria are defined.

## Weighted Scoring

Score each dimension from 0 to 3.

| Dimension | What to Evaluate | Weight | Score (0-3) | Weighted Score |
| --- | --- | ---: | ---: | ---: |
| User Value | How much customer-facing value this unlocks | 5 |  |  |
| Strategic Alignment | Match with product roadmap and design standards | 4 |  |  |
| Implementation Complexity | Engineering complexity and unknowns (reverse scored) | 4 |  |  |
| Operational Risk | Risk to stability, accessibility, and support (reverse scored) | 4 |  |  |
| Reuse Potential | How many features/teams can reuse the output | 3 |  |  |
| Testability | Ability to automate regression coverage | 2 |  |  |

`Total Score = sum(weight * score)`

## Decision Table

| Total Score | Risk Flags Present? | Decision | SLA Target | Required Approver |
| ---: | --- | --- | --- | --- |
| 46-66 | No | Accept | Start in current sprint | Frontend lead |
| 34-45 | No | Accept with guardrails | Start next sprint | Frontend lead + QA |
| 24-33 | Any | Park for discovery | Re-evaluate within 2 weeks | Engineering manager |
| 0-23 | Any | Reject for now | Re-open with new evidence | Engineering manager |

## Risk Flags

Any single flag moves the request to "Accept with guardrails" or lower:

- No rollback plan
- No owner/backup owner
- Accessibility impact unknown
- Critical dependency has no maintainer
- Estimated effort exceeds one sprint with no milestone breakdown

## Intake Record Template

| Field | Value |
| --- | --- |
| Request ID | |
| Requester | |
| Owner / Backup | |
| Proposed Change | |
| Dependencies | |
| Rollback Trigger | |
| Final Score | |
| Final Decision | |
