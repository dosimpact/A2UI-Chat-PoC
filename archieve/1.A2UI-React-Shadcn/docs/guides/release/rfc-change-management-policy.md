# RFC and Change Management Policy

This policy defines when an RFC is required and how shadcn-related changes are approved and tracked.

## When an RFC Is Required

| Change Type | RFC Required? | Notes |
| --- | --- | --- |
| New shared component | Yes | Include API, lifecycle, and migration impact |
| Breaking API change | Yes | Must include migration strategy and deprecation window |
| Adapter internals with no external behavior change | No | PR description is enough |
| Rollout policy or governance policy change | Yes | Treat as process-breaking change |
| Copy/typo/docs-only updates | No | Standard PR review |

## RFC Checklist (Author)

- [ ] Problem statement and constraints are explicit.
- [ ] Alternatives and trade-offs are documented.
- [ ] Rollout and rollback strategy included.
- [ ] Backward compatibility and migration plan included.
- [ ] Test and monitoring strategy included.
- [ ] Ownership and success metrics defined.

## Review Workflow

1. Draft RFC and request asynchronous comments for at least 2 business days.
2. Resolve major objections in the RFC document.
3. Hold a decision review for unresolved high-impact trade-offs.
4. Record final decision, approvers, and expiry/revisit date.

## Approval Decision Table

| Situation | Required Approvers | Decision Rule |
| --- | --- | --- |
| Standard shared component addition | Frontend lead + one peer maintainer | Both approve |
| Breaking change | Frontend lead + engineering manager + consumer representative | Unanimous |
| Emergency exception | Engineering manager + incident commander | Time-boxed approval; follow-up RFC required |

## Change Log Requirements

- [ ] Link implementation PRs to the RFC.
- [ ] Record status: Draft, Approved, Rejected, Superseded.
- [ ] Add decision date and owner.
- [ ] Add follow-up date for policy-impacting changes.
