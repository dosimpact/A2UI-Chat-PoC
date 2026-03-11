# CP1: Baseline Repo Role Matrix

## 레포지토리 역할 정의

### A2UI-Original
- 책임: 프로토콜, 스펙, 코어 계약 정의와 기본 메시지 모델 유지
- 범위:
  - `web_core` 프로토콜 규격, 메시지/버전/액션 계약의 정합성 정의
  - 기본 카탈로그 식별 규칙(`catalogId`, `component`, `version`)
  - 보안/검증/호환성 가이드의 기준선 작성
- 산출물 우선권: 계약/스펙 변경 시 최우선 적용 소스

### A2UI-add-react-renderer
- 책임: React 렌더러 구현과 shadcn UI 어댑터 정책 실행
- 범위:
  - `1.A2UI-React-Shadcn/renderers/react`의 컴포넌트 렌더링, fallback, provider/context 동작 구현
  - 샘플 앱(React/Next) 연동에서 카탈로그 bootstrap, action dispatch round-trip 보장
  - 테스트/문서/템플릿 일관성 정비
- 산출물 우선권: 사용자 피드백 기반 UI 동작 보강, 기존 contract 위반 최소화

## 충돌 해결 우선순위
1. **계약 우선**: `web_core`/spec 관련 정의가 우선한다.
2. **공통 규칙 우선**: 공개 API 이름, catalog 키, 버전 락 등은 체크포인트 합의 규칙을 따른다.
3. **범위 우선**: 동일 키 충돌 시, 책임이 명확한 레포의 결정을 우선 적용한다.
4. **승인 우선**: 충돌 판단 로그+근거를 문서화하고, 두 레포 변경이 맞물릴 경우 통합 PR에서 상호 동의 후 머지한다.

## 파일 충돌 처리 원칙
- 동일 파일에서 서로 다른 정의 충돌 시, CP 문서의 완료 기준을 충족한 마지막 판을 기준으로 `A2UI-Original` 규칙을 우선 반영한다.
- 변경은 PR 본문에 근거(링크, 체크리스트, 검증)로 남기고, 롤백 포인트를 `Plan/reports`(혹은 해당 CP 리포트)에 기록한다.
