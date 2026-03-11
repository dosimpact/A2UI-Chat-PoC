# Rollback Runbook

Use this runbook to recover safely from a bad rollout.

## Trigger Conditions

| Trigger | Severity | Rollback Required? |
| --- | --- | --- |
| Sev1 production incident linked to release | Critical | Yes |
| Sustained error rate breach for >15 minutes | High | Yes |
| Accessibility blocker in critical flow | High | Yes |
| Cosmetic regression only | Low | Usually no (hotfix path) |

## Rollback Checklist

- [ ] Declare release incident owner.
- [ ] Freeze further deployments.
- [ ] Identify last known good version.
- [ ] Execute rollback mechanism (feature flag or deploy revert).
- [ ] Verify service health metrics return to baseline.
- [ ] Post status update to stakeholders.
- [ ] Open follow-up corrective action ticket.

## Execution Paths Decision Table

| Environment Capability | Preferred Rollback Path | Expected Recovery Time |
| --- | --- | --- |
| Feature flags enabled | Flip flag to previous stable state | < 10 minutes |
| Immutable deploy artifacts available | Redeploy previous artifact | < 20 minutes |
| No safe artifact available | Emergency patch + controlled redeploy | 30-90 minutes |

## Post-Rollback Validation

- [ ] Error rate normalized.
- [ ] Latency normalized.
- [ ] Critical user journey smoke-tested.
- [ ] Monitoring and alerts stable for at least 30 minutes.

## Communication Minimum

| Audience | Update Content | Cadence |
| --- | --- | --- |
| Engineering channel | Current status, impact, next checkpoint | Every 15 minutes |
| Product/Support | User impact and ETA | At incident start and resolution |
| Leadership (for Sev1) | Business impact and mitigation plan | At escalation and closure |
