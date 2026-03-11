# Progressive Rollout Policy

Use controlled percentage-based rollout to reduce blast radius and detect regressions early.

## Rollout Stages

| Stage | Traffic % | Minimum Duration | Exit Criteria |
| --- | ---: | --- | --- |
| Internal | 0% external (team only) | 1 day | No critical defects in internal usage |
| Canary | 5% | 1 day | Error and latency within thresholds |
| Limited | 25% | 2 days | Support tickets within expected baseline |
| Broad | 50% | 2 days | No Sev1/Sev2 incidents |
| General Availability | 100% | N/A | Final sign-off by release owner |

## Promotion Checklist

- [ ] Current stage duration satisfied.
- [ ] Error rate below threshold for the full stage window.
- [ ] P95 latency not regressed beyond threshold.
- [ ] No unresolved Sev1/Sev2 incidents.
- [ ] On-call acknowledges readiness to promote.

## Promote/Hold/Rollback Decision Table

| Condition | Decision | Required Action |
| --- | --- | --- |
| All thresholds pass | Promote | Move to next stage and log timestamp |
| One threshold borderline | Hold | Extend current stage for 24 hours |
| Error rate breach or Sev1 incident | Rollback | Return to previous safe stage immediately |
| Monitoring gap or missing data | Hold | Restore telemetry before any promotion |

## Default Guardrails

| Metric | Threshold |
| --- | --- |
| Error rate | <= 1.5x pre-release baseline |
| P95 latency | <= 1.2x pre-release baseline |
| Client crash rate | <= 0.2% sessions |
| Accessibility bug count | 0 new critical issues |
