# Pre-Release Gates

This guide defines the minimum pass criteria before any shadcn-related release candidate can ship.

## Gate Checklist

- [ ] Scope freeze confirmed (no unreviewed feature additions).
- [ ] Test matrix required checks passed in CI.
- [ ] Regression test list executed for impacted components.
- [ ] Accessibility baseline verified (keyboard + screen reader smoke).
- [ ] Release notes drafted with known issues.
- [ ] Rollback runbook link included in release ticket.
- [ ] On-call and release owner confirmed for rollout window.

## Gate Decision Table

| Gate Result | Blocking Severity | Decision | Action |
| --- | --- | --- | --- |
| All pass | None | Go | Start rollout according to policy |
| One fails | High/Critical | No-Go | Fix and re-run all gates |
| One fails | Medium | Conditional Go | Engineering manager exception required |
| Multiple fail | Any | No-Go | Stop release, open incident-style triage |

## Required Evidence by Gate

| Gate | Evidence Artifact | Owner |
| --- | --- | --- |
| CI checks | Link to workflow run with green required jobs | Release engineer |
| Regression checks | Test report or checklist screenshot | QA owner |
| Accessibility smoke | Notes from test session, impacted views | Accessibility owner |
| Release notes | PR or doc link | Product owner |
| Rollback readiness | Linked rollback ticket | Release engineer |
