# Shadcn Adapter Implementation Standard

This standard defines the minimum implementation bar for any adapter that bridges domain data/actions into shadcn UI components.

## Required Adapter Contract

| Contract Item | Requirement | Failure Mode if Missing |
| --- | --- | --- |
| Input Schema | Validate adapter input with a typed schema before transform | Runtime crashes from malformed payloads |
| Output Shape | Emit only documented component props and events | Rendering drift and hidden prop coupling |
| Error Mapping | Convert domain errors to user-safe UI messages | Raw backend errors leak to UI |
| Telemetry | Emit success/failure latency with correlation ID | Incident triage is slow and guessy |
| Version Tag | Include adapter version in logs/metadata | Hard to trace regressions after rollout |

## Implementation Checklist

- [ ] Define input/output types in one adapter-owned module.
- [ ] Add schema validation at adapter boundary.
- [ ] Implement pure transform logic (no side effects in mapper).
- [ ] Add error translation map (domain -> user-facing + internal code).
- [ ] Add unit tests for happy path, empty data, malformed input, and domain error.
- [ ] Add one contract test proving consumer compatibility.
- [ ] Add observability fields: `adapter_name`, `adapter_version`, `trace_id`.
- [ ] Document fallback behavior for partial data.

## Adapter Strategy Decision Table

| Scenario | Strategy | Why | Approval Needed |
| --- | --- | --- | --- |
| Existing adapter covers >80% behavior | Extend existing adapter | Lower maintenance overhead | Adapter owner |
| New domain model with incompatible shape | New adapter | Avoids brittle conditionals | Frontend lead |
| One-off temporary bridge (<2 sprints) | Thin wrapper + deprecation ticket | Fast unblock with explicit expiry | Frontend lead + PM |
| Third-party unstable API | Anti-corruption adapter layer | Isolates churn and protects components | Frontend lead + architecture reviewer |

## Definition of Done

An adapter is release-ready only when all required checklist items are complete and the strategy decision is recorded in the PR description.
