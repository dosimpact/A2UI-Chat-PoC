# Plan Index (체크포인트 기반)

`Plan/todo` 하위에 직렬/병렬 실행 구조로 분리했다.

## 파일명 규칙
- 직렬: `Plan/todo/1.task-name.md`, `Plan/todo/2.task-name.md`, `Plan/todo/3.task-name.md`
- 병렬: `Plan/todo/3-1.task-name.md`, `Plan/todo/3-2.task-name.md`, `Plan/todo/3-3.task-name.md`

## 직렬 체크포인트
1. [todo/1.scope-baseline.md](./todo/1.scope-baseline.md)
2. [todo/2.protocol-catalog-contract.md](./todo/2.protocol-catalog-contract.md)
3. [todo/3.ui-runtime-foundation.md](./todo/3.ui-runtime-foundation.md)
4. [todo/4.ai-generation-validation-pipeline.md](./todo/4.ai-generation-validation-pipeline.md)
5. [todo/5.shadcn-onboarding-operating-model.md](./todo/5.shadcn-onboarding-operating-model.md)
6. [todo/6.quality-testing-observability.md](./todo/6.quality-testing-observability.md)
7. [todo/7.release-rollout-change-management.md](./todo/7.release-rollout-change-management.md)

## 병렬 작업 상세

### 1단계 병렬
- [todo/1-1.goal-non-goal-definition.md](./todo/1-1.goal-non-goal-definition.md)
- [todo/1-2.baseline-repo-role-matrix.md](./todo/1-2.baseline-repo-role-matrix.md)
- [todo/1-3.integration-branch-strategy.md](./todo/1-3.integration-branch-strategy.md)

### 2단계 병렬
- [todo/2-1.protocol-version-policy.md](./todo/2-1.protocol-version-policy.md)
- [todo/2-2.catalog-component-contract.md](./todo/2-2.catalog-component-contract.md)
- [todo/2-3.binding-action-contract.md](./todo/2-3.binding-action-contract.md)
- [todo/2-4.versioning-compatibility-policy.md](./todo/2-4.versioning-compatibility-policy.md)

### 3단계 병렬
- [todo/3-1.design-system-theme-tokens.md](./todo/3-1.design-system-theme-tokens.md)
- [todo/3-2.react-renderer-component-adapters.md](./todo/3-2.react-renderer-component-adapters.md)
- [todo/3-3.chat-ui-a2ui-integration.md](./todo/3-3.chat-ui-a2ui-integration.md)

### 4단계 병렬
- [todo/4-1.prompt-architecture.md](./todo/4-1.prompt-architecture.md)
- [todo/4-2.schema-policy-validation.md](./todo/4-2.schema-policy-validation.md)
- [todo/4-3.repair-fallback-pipeline.md](./todo/4-3.repair-fallback-pipeline.md)

### 5단계 병렬
- [todo/5-1.shadcn-intake-scorecard.md](./todo/5-1.shadcn-intake-scorecard.md)
- [todo/5-2.adapter-implementation-standard.md](./todo/5-2.adapter-implementation-standard.md)
- [todo/5-3.component-lifecycle-governance.md](./todo/5-3.component-lifecycle-governance.md)

### 6단계 병렬
- [todo/6-1.test-matrix-ci-gates.md](./todo/6-1.test-matrix-ci-gates.md)
- [todo/6-2.performance-visual-a11y-gates.md](./todo/6-2.performance-visual-a11y-gates.md)
- [todo/6-3.observability-metrics-triage.md](./todo/6-3.observability-metrics-triage.md)

### 7단계 병렬
- [todo/7-1.pre-release-gates.md](./todo/7-1.pre-release-gates.md)
- [todo/7-2.progressive-rollout-policy.md](./todo/7-2.progressive-rollout-policy.md)
- [todo/7-3.rollback-runbook.md](./todo/7-3.rollback-runbook.md)
- [todo/7-4.change-management-rfc-policy.md](./todo/7-4.change-management-rfc-policy.md)

## 참고 문서
- 배경 분석: `../Background/01-reference-implementation-status.md`
- 방법론 초안: `./02-shadcn-design-system-a2ui-methodology-draft.md`

## 아카이브
- 이전 literal A-Z 문서는 `./archive/a-z/`에 보관.
